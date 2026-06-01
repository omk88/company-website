import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { Resend } from "resend";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createPost = mutation({
  args: {
    title: v.string(),
    subtitle: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    storageId: v.string(), 
  },
  handler: async (ctx, args) => {
    const generatedImageUrl = await ctx.storage.getUrl(args.storageId);

    const newBlogId = await ctx.db.insert("blogs", {
      title: args.title,
      subtitle: args.subtitle,
      content: args.content,
      tags: args.tags,
      storageId: args.storageId,
      imageUrl: generatedImageUrl || "",
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, api.blogs.sendNewPostEmail, {
      title: args.title,
      subtitle: args.subtitle,
    });

    return newBlogId;
  },
});

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogs")
      .order("desc")
      .collect();

    return posts.map(({ content, ...previewFields }) => previewFields);
  },
});

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendNewPostEmail = action({
  args: { title: v.string(), subtitle: v.string() },
  handler: async (ctx, args) => {
    const subscribers = await ctx.runQuery(api.subscribers.getAllSubscribers);
    if (subscribers.length === 0) return;

    const emailList = subscribers.map((sub) => sub.email);

    try {
      await resend.emails.send({
        from: "Taqtiq Insights <onboarding@resend.dev>",
        to: emailList,
        subject: `New Article: ${args.title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #111;">${args.title}</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">${args.subtitle}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 24px 0;" />
            <a href="https://yourdomain.com/insights" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
              Read Full Article
            </a>
          </div>
        `,
      });
    } catch (error) {
      console.error("Failed to distribute newsletter:", error);
    }
  },
});