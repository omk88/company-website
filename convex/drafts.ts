import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveDraft = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    subtitle: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("drafts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    const payload = {
      userId: args.userId,
      title: args.title,
      subtitle: args.subtitle,
      content: args.content,
      tags: args.tags,
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
    } else {
      await ctx.db.insert("drafts", payload);
    }
  },
});

export const getDraft = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    if (!args.userId) return null;
    return await ctx.db
      .query("drafts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const deleteDraftById = mutation({
  args: { draftId: v.id("drafts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.draftId);
  },
});

export const createDraft = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    subtitle: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.title.trim() && !args.content.trim()) return;

    return await ctx.db.insert("drafts", {
      userId: args.userId,
      title: args.title,
      subtitle: args.subtitle,
      content: args.content,
      tags: args.tags,
      updatedAt: Date.now(),
    });
  },
});

export const listUserDrafts = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("drafts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});