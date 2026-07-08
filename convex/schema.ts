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
    totalViews: v.number(),
    likes: v.number(),
    dislikes: v.number(),
    featured: v.boolean(),
    
    commentCount: v.number(), 
  })
  .index("by_createdAt", ["createdAt"])
  .index("by_totalViews", ["totalViews"])
  .index("by_likes", ["likes"])
  .index("by_featured", ["featured"])
  .index("by_author", ["author"])
  .searchIndex("search_title_subtitle", {
    searchField: "title",
    filterFields: ["subtitle"],
  }),

  viewLogs: defineTable({
    blogId: v.id("blogs"),
    viewedAt: v.number(),
  }).index("by_viewedAt", ["viewedAt"]),

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
  }).index("by_postId", ["postId"])
});

export default schema;