import { v } from "convex/values";
import { mutation } from "./_generated/server";

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

    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.eq(q.field("participantIds"), [currentUserId, args.participantId]),
          q.eq(q.field("participantIds"), [args.participantId, currentUserId])
        )
      )
      .first();

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