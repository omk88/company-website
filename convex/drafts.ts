import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveDraft = mutation({
  args: {
    draftId: v.optional(v.id("drafts")),
    userId: v.string(),
    title: v.string(),
    subtitle: v.string(),
    content: v.string(),
    storageId: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.title.trim() && !args.content.trim()) return;

    const payload = {
      userId: args.userId,
      title: args.title,
      subtitle: args.subtitle,
      content: args.content,
      tags: args.tags,
      storageId: args.storageId,
      updatedAt: Date.now(),
    };

    if (args.draftId) {
      await ctx.db.patch(args.draftId, payload);
      return args.draftId;
    } else {
      return await ctx.db.insert("drafts", payload);
    }
  },
});

export const getDraft = query({
  args: { draftId: v.id("drafts") },
  handler: async (ctx, args) => {
    const draft = await ctx.db.get(args.draftId);
    if (!draft) return null;

    let imageUrl: string | null = null;
    if (draft.storageId) {
      imageUrl = await ctx.storage.getUrl(draft.storageId);
    }

    return {
      ...draft,
      imageUrl,
    };
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
    storageId: v.string(),
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
      storageId: args.storageId,
      updatedAt: Date.now(),
    });
  },
});

export const listUserDrafts = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const drafts = await ctx.db
      .query("drafts")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();

    return Promise.all(
      drafts.map(async (draft) => ({
        ...draft,
        imageUrl: draft.storageId 
          ? await ctx.storage.getUrl(draft.storageId) 
          : null,
      }))
    );
  },
});