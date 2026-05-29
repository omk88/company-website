import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({

    blogs: defineTable({
    title: v.string(),
    subtitle: v.string(),
    imageUrl: v.string(),
    content: v.string(),
    tags: v.array(v.string()), 
    createdAt: v.number(),
    }),

    subscribers: defineTable({
        email: v.string(),
        subscribedAt: v.number(),
    }).index("by_email", ["email"])
});

export default schema;