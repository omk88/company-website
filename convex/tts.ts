"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

function chunkText(text: string, maxChunkLength = 1800): string[] {
  const sentences = text.match(/[^.!?\n]+[.!?\n]+(\s+|$)/g) || [text];
  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if (sentence.length > maxChunkLength) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }

      const words = sentence.split(/\s+/);
      for (const word of words) {
        if ((currentChunk + " " + word).length > maxChunkLength) {
          if (currentChunk) chunks.push(currentChunk.trim());
          currentChunk = word;
        } else {
          currentChunk = currentChunk ? `${currentChunk} ${word}` : word;
        }
      }
      continue;
    }

    if ((currentChunk + sentence).length > maxChunkLength) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}


function cleanTextForTTS(text: string): string {
  return (
    text
      .replace(/```[\s\S]*?```/g, " See code block for more information. ")
      .replace(/(?:^|\n)(?: {4}|\t).+/g, " See code block for more information. ")

      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]*>/g, "")

      .replace(/!\[.*?\]\([^)]+\)/g, " See image for more information. ")

      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")

      .replace(/^\[[^\]]+\]:\s*\S+.*$/gm, "")
      .replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1")

      .replace(/^\[\^[^\]]+\]:\s*.*$/gm, "")
      .replace(/\[\^[^\]]+\]/g, "")

      .replace(/https?:\/\/\S+|www\.\S+/gi, " link ")

      .replace(/`([^`]+)`/g, " $1 ")

      .replace(/^#{1,6}\s+(.+)$/gm, (_, title) => {
        const trimmed = title.trim();
        return /[.?!]$/.test(trimmed) ? `${trimmed}\n` : `${trimmed}.\n`;
      })

      .replace(/^\s*[-*+]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "") 
      .replace(/^\s*>\s*/gm, "")
      .replace(/\|/g, ", ")

      .replace(/[*_~=]/g, "")

      .replace(/\s+/g, " ")
      .replace(/\s+([,.?!])/g, "$1") 
      .replace(/\.+/g, ".")
      .trim()
  );
}

function parseMarkdownSections(markdown: string) {
  const lines = markdown.split("\n");
  const sections: { title: string; content: string }[] = [];

  let currentTitle = "Introduction";
  let currentContentLines: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (currentContentLines.join(" ").trim()) {
        sections.push({
          title: currentTitle,
          content: currentContentLines.join(" "),
        });
        currentContentLines = [];
      }
      currentTitle = headingMatch[2].trim();
    } else {
      currentContentLines.push(line);
    }
  }

  if (currentContentLines.join(" ").trim()) {
    sections.push({
      title: currentTitle,
      content: currentContentLines.join(" "),
    });
  }

  return sections;
}

function estimateAudioDurationInSeconds(bufferLengthInBytes: number): number {
  const BYTES_PER_SECOND = 6000;
  return bufferLengthInBytes / BYTES_PER_SECOND;
}

export const generateAudio = internalAction({
  args: {
    blogId: v.id("blogs"),
    content: v.string(),
    title: v.string(),
    author: v.string(),
    subtitle: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const accessKeyId = (process.env.AWS_ACCESS_KEY_ID || "").trim();
      const secretAccessKey = (process.env.AWS_SECRET_ACCESS_KEY || "").trim();
      const region = (process.env.AWS_REGION || "eu-north-1").trim();

      if (!accessKeyId || !secretAccessKey) {
        throw new Error("AWS Credentials missing from Convex variables.");
      }

      const polly = new PollyClient({
        region,
        credentials: { accessKeyId, secretAccessKey },
      });

      let intro = `${args.title.trim()} by ${args.author.trim()}.`;
      if (args.subtitle?.trim()) {
        intro += ` ${cleanTextForTTS(args.subtitle)}.`;
      }

      const sections = parseMarkdownSections(args.content);

      const audioBuffers: Buffer[] = [];
      const chapters: { title: string; startTime: number }[] = [];
      let currentTimestampInSeconds = 0;

      const introClean = cleanTextForTTS(intro);
      const introCommand = new SynthesizeSpeechCommand({
        OutputFormat: "mp3",
        Text: introClean,
        VoiceId: "Joanna",
        Engine: "standard",
      });

      const introRes = await polly.send(introCommand);
      if (introRes.AudioStream) {
        const bytes = await introRes.AudioStream.transformToByteArray();
        const buffer = Buffer.from(bytes);
        audioBuffers.push(buffer);

        currentTimestampInSeconds += estimateAudioDurationInSeconds(buffer.length);
      }

      for (const section of sections) {
        const cleanedContent = cleanTextForTTS(section.content);
        if (!cleanedContent) continue;

        chapters.push({
          title: section.title,
          startTime: Math.round(currentTimestampInSeconds * 10) / 10,
        });

        const textChunks = chunkText(cleanedContent, 1800);

        for (const chunk of textChunks) {
          const command = new SynthesizeSpeechCommand({
            OutputFormat: "mp3",
            Text: chunk,
            VoiceId: "Joanna",
            Engine: "standard",
          });

          const response = await polly.send(command);
          if (!response.AudioStream) continue;

          const bytes = await response.AudioStream.transformToByteArray();
          const buffer = Buffer.from(bytes);

          audioBuffers.push(buffer);
          currentTimestampInSeconds += estimateAudioDurationInSeconds(buffer.length);
        }
      }

      const fullAudioBuffer = Buffer.concat(audioBuffers);
      const audioBlob = new Blob([fullAudioBuffer], { type: "audio/mpeg" });

      const audioStorageId = await ctx.storage.store(audioBlob);
      const audioUrl = await ctx.storage.getUrl(audioStorageId);

      await ctx.runMutation(internal.blogs.updateBlogAudio, {
        blogId: args.blogId,
        audioStorageId,
        audioUrl: audioUrl || "",
        chapters,
      });

      console.log(`Audio and ${chapters.length} chapters generated for: ${args.blogId}`);
    } catch (error) {
      console.error("Polly TTS error:", error);
    }
  },
});