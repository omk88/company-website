import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({

    blogs: defineTable({
        title: v.string(),
        subtitle: v.string(),
        imageUrl: v.string(),
        content: v.string(),
        author: v.string(),
        tags: v.array(v.string()), 
        storageId: v.string(),
        createdAt: v.number(),
    }),

    subscribers: defineTable({
        email: v.string(),
        subscribedAt: v.number(),
    }).index("by_email", ["email"]),

    contactMessages: defineTable({
        name: v.string(),
        email: v.string(),
        subject: v.string(),
        message: v.string(),
        createdAt: v.number(),
  }),

    comments: defineTable({
        postId: v.id("blogs"),
        authorId: v.string(),
        authorName: v.string(),
        body: v.string()
    })
});

export default schema;