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

    const currentUserId = identity.subject;

    const member = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversation_user", (q) =>
        q.eq("conversationId", args.conversationId!).eq("userId", currentUserId)
      )
      .unique();

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId!)
      )
      .order("asc")
      .collect();

    if (member?.clearedAt) {
      return messages.filter(
        (msg) => msg._creationTime > member.clearedAt!
      );
    }

    return messages;
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

    const members = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    for (const member of members) {
      if (member.isDeleted) {
        await ctx.db.patch(member._id, { isDeleted: false });
      }
    }

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

    const activeMemberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_user_active", (q) =>
        q.eq("userId", currentUserId).eq("isDeleted", false)
      )
      .collect();

    const activeConversationIds = new Set(
      activeMemberships.map((m) => m.conversationId)
    );

    const result = await ctx.db
      .query("conversations")
      .withIndex("by_updatedAt")
      .order("desc")
      .paginate(args.paginationOpts);

    const userConversations = result.page.filter((conv) =>
      activeConversationIds.has(conv._id)
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

    if (existingConversation) {
      const userMember = await ctx.db
        .query("conversationMembers")
        .withIndex("by_conversation_user", (q) =>
          q.eq("conversationId", existingConversation._id).eq("userId", currentUserId)
        )
        .unique();

      if (userMember && userMember.isDeleted) {
        await ctx.db.patch(userMember._id, { isDeleted: false });
      } else if (!userMember) {
        await ctx.db.insert("conversationMembers", {
          conversationId: existingConversation._id,
          userId: currentUserId,
          isDeleted: false,
        });
      }

      return existingConversation._id;
    }

    const conversationId = await ctx.db.insert("conversations", {
      participantIds: [currentUserId, args.participantId],
      updatedAt: Date.now(),
    });

    await ctx.db.insert("conversationMembers", {
      conversationId,
      userId: currentUserId,
      isDeleted: false,
    });

    await ctx.db.insert("conversationMembers", {
      conversationId,
      userId: args.participantId,
      isDeleted: false,
    });

    return conversationId;
  },
});

export const deleteConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    const currentUserId = identity.subject;
    const now = Date.now();

    const existingConversation = await ctx.db.get(args.conversationId);
    if (!existingConversation) {
      throw new Error("Conversation not found.");
    }

    const currentMember = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversation_user", (q) =>
        q.eq("conversationId", args.conversationId).eq("userId", currentUserId)
      )
      .unique();

    if (currentMember) {
      await ctx.db.patch(currentMember._id, {
        isDeleted: true,
        clearedAt: now,
      });
    }

    const allMembers = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    const allDeleted = allMembers.every((m) =>
      m.userId === currentUserId ? true : m.isDeleted
    );

    if (allDeleted) {
      const messages = await ctx.db
        .query("messages")
        .withIndex("by_conversation", (q) =>
          q.eq("conversationId", args.conversationId)
        )
        .collect();

      for (const message of messages) {
        await ctx.db.delete(message._id);
      }

      for (const member of allMembers) {
        await ctx.db.delete(member._id);
      }

      await ctx.db.delete(args.conversationId);
    }
  },
});