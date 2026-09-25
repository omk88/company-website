"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

function chunkText(text: string, maxChunkLength = 1800): string[] {
  const sentences = text.match(/[^.!?\n]+[.!?\n]+(\s+|$)\vert{}[^.!?\n]+$/g) || [text];
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
      const cleanedBody = args.content
        .replace(/<[^>]*>/g, "")
        .replace(/[#*`~_\[\]()]/g, "")
        .replace(/\n+/g, " ")
        .trim();

      let intro = `${args.title.trim()} by${args.author.trim()}.`;

      if (args.subtitle && args.subtitle.trim()) {
        const cleanedSubtitle = args.subtitle
          .replace(/<[^>]*>/g, "")
          .replace(/[#*`~_\[\]()]/g, "")
          .trim();
        
        intro += ` ${cleanedSubtitle}.`;
      }

      const plainText = `${intro} ${cleanedBody}`;

      const accessKeyId = (process.env.AWS_ACCESS_KEY_ID || "").trim();
      const secretAccessKey = (process.env.AWS_SECRET_ACCESS_KEY || "").trim();
      const region = (process.env.AWS_REGION || "eu-north-1").trim();

      if (!accessKeyId || !secretAccessKey) {
        throw new Error("AWS Credentials are missing from Convex environment variables.");
      }

      const polly = new PollyClient({
        region: region,
        credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
        },
      });

      const textChunks = chunkText(plainText, 1800);
      const audioBuffers: Buffer[] = [];

      for (const [index, chunk] of textChunks.entries()) {
        console.log(`Processing chunk ${index + 1}/${textChunks.length} - Character Count: ${chunk.length}`);

        const command = new SynthesizeSpeechCommand({
          OutputFormat: "mp3",
          Text: chunk,
          VoiceId: "Joanna",
          Engine: "standard",
        });

        const response = await polly.send(command);

        if (!response.AudioStream) {
          throw new Error("No audio stream received from AWS Polly");
        }

        const audioByteArray = await response.AudioStream.transformToByteArray();
        audioBuffers.push(Buffer.from(audioByteArray));
      }

      const fullAudioBuffer = Buffer.concat(audioBuffers);
      const audioBlob = new Blob([fullAudioBuffer], { type: "audio/mpeg" });

      const audioStorageId = await ctx.storage.store(audioBlob);
      const audioUrl = await ctx.storage.getUrl(audioStorageId);

      await ctx.runMutation(internal.blogs.updateBlogAudio, {
        blogId: args.blogId,
        audioStorageId,
        audioUrl: audioUrl || "",
      });

      console.log(`Audio generated successfully for blog: ${args.blogId}`);
    } catch (error) {
      console.error("Polly TTS error:", error);
    }
  },
});