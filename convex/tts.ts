"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

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

      let intro = `${args.title.trim()} by ${args.author.trim()}.`;

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

      const command = new SynthesizeSpeechCommand({
        OutputFormat: "mp3",
        Text: plainText,
        VoiceId: "Joanna",
        Engine: "standard",
      });

      const response = await polly.send(command);

      if (!response.AudioStream) {
        throw new Error("No audio stream received from AWS Polly");
      }

      const audioByteArray = await response.AudioStream.transformToByteArray();
      const audioBuffer = Buffer.from(audioByteArray);
      const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" });

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