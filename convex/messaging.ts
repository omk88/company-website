import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const getMessagesByConversation = query({
  args: {
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    if (!args.conversationId) return [];

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId!)
      )
      .order("asc")
      .collect();
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUserId = identity.subject;
    const now = Date.now();

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error("Conversation not found");

    const recipientId = conversation.participantIds.find(
      (id) => id !== currentUserId
    );
    if (!recipientId) throw new Error("Invalid conversation participants");

    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: currentUserId,
      recipientId: recipientId,
      content: args.content,
      readBy: [currentUserId],
    });

    await ctx.db.patch(args.conversationId, {
      lastMessageId: messageId,
      lastMessageContent: args.content,
      lastMessageSenderId: currentUserId,
      updatedAt: now,
    });

    return messageId;
  },
});

export const listConversations = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const currentUserId = identity.subject;

    const result = await ctx.db
      .query("conversations")
      .withIndex("by_updatedAt")
      .order("desc")
      .paginate(args.paginationOpts);

    const userConversations = result.page.filter((conv) =>
      conv.participantIds.includes(currentUserId)
    );

    const conversationsWithProfiles = await Promise.all(
      userConversations.map(async (conv) => {
        const otherUserId = conv.participantIds.find((id) => id !== currentUserId);

        let otherUserProfile = null;

        if (otherUserId) {
          const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", otherUserId))
            .unique();

          if (profile) {
            const avatarStorageId = profile.profilePic ?? profile.defaultProfilePic;
            const avatarUrl = avatarStorageId
              ? await ctx.storage.getUrl(avatarStorageId)
              : null;

            otherUserProfile = {
              userId: profile.userId,
              username: profile.username,
              displayName: profile.displayName ?? profile.username,
              avatarUrl,
            };
          }
        }

        return {
          ...conv,
          otherUserProfile,
        };
      })
    );

    return {
      ...result,
      page: conversationsWithProfiles,
    };
  },
});

export const getOrCreateAndStartConversation = mutation({
  args: {
    participantId: v.string(),
    initialMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    const currentUserId = identity.subject;

    if (currentUserId === args.participantId) {
      throw new Error("Cannot start a conversation with yourself.");
    }

    const allConversations = await ctx.db.query("conversations").collect();

    const existingConversation = allConversations.find(
      (conv) =>
        conv.participantIds.includes(currentUserId) &&
        conv.participantIds.includes(args.participantId)
    );

    let conversationId = existingConversation?._id;
    const now = Date.now();

    if (!conversationId) {
      conversationId = await ctx.db.insert("conversations", {
        participantIds: [currentUserId, args.participantId],
        lastMessageContent: args.initialMessage,
        lastMessageSenderId: currentUserId,
        updatedAt: now,
      });
    }

    const messageId = await ctx.db.insert("messages", {
      conversationId,
      senderId: currentUserId,
      recipientId: args.participantId,
      content: args.initialMessage,
      readBy: [currentUserId],
    });

    await ctx.db.patch(conversationId, {
      lastMessageId: messageId,
      lastMessageContent: args.initialMessage,
      lastMessageSenderId: currentUserId,
      updatedAt: now,
    });

    return conversationId;
  },
});