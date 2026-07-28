import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  blogs: defineTable({
    storageId: v.string(),
    author: v.string(),
    title: v.string(),
    subtitle: v.string(),
    imageUrl: v.string(),
    content: v.string(),
    authorName: v.string(),
    username: v.string(),
    tags: v.array(v.string()), 
    createdAt: v.number(),
    totalViews: v.number(),
    likes: v.number(),
    featured: v.boolean(),
    commentCount: v.number(),
    hotScore: v.number(),
    controversialScore: v.number(), 
    readTime: v.number(),
    postType: v.union(v.literal("community"), v.literal("team")),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_totalViews", ["totalViews"])
    .index("by_likes", ["likes"])
    .index("by_featured", ["featured"])
    .index("by_author", ["author"])
    .index("by_username", ["username"])
    .index("by_username_likes", ["username", "likes"])
    .index("by_username_hot", ["username", "hotScore"])
    .index("by_username_controversial", ["username", "controversialScore"])
    .searchIndex("search_title", { searchField: "title", filterFields: ["username"] })

    .index("by_type", ["postType"])
    .index("by_type_hot", ["postType", "hotScore"])
    .index("by_type_controversial", ["postType", "controversialScore"])
    .index("by_type_likes", ["postType", "likes"])
    .searchIndex("search_title_by_type", { searchField: "title", filterFields: ["postType"] }),

  blogTags: defineTable({
    blogId: v.id("blogs"),
    username: v.string(),
    tag: v.string(),
    createdAt: v.number(),
    likes: v.number(),
    hotScore: v.number(),
    controversialScore: v.number(),
    postType: v.union(v.literal("community"), v.literal("team")),
  })

    .index("by_tag_type_createdAt", ["tag", "postType", "createdAt"])
    .index("by_tag_type_hot", ["tag", "postType", "hotScore"])
    .index("by_tag_type_controversial", ["tag", "postType", "controversialScore"])
    .index("by_tag_type_likes", ["tag", "postType", "likes"])

    .index("by_blog", ["blogId"])
    .index("by_tag_username", ["tag", "username"])
    .index("by_tag_username_createdAt", ["tag", "username", "createdAt"])
    .index("by_tag_username_likes", ["tag", "username", "likes"])
    .index("by_tag_username_hot", ["tag", "username", "hotScore"])
    .index("by_tag_username_controversial", ["tag", "username", "controversialScore"]),
  
  viewLogs: defineTable({
    blogId: v.string(),
    viewedAt: v.number(),
  })
    .index("by_viewedAt", ["viewedAt"])
    .index("by_blog", ["blogId"]),

  subscribers: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
  })
    .index("by_email", ["email"]),

  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    createdAt: v.number(),
  }),

  comments: defineTable({
    blogId: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    username: v.string(),
    blogTitle: v.string(),
    likes: v.number(),
    body: v.string(),
    hotScore: v.number(),
    controversialScore: v.number(),
  })
    .index("by_blog", ["blogId"])
    .index("by_authorId", ["authorId"])
    .index("by_username", ["username"])
    .index("by_username_likes", ["username", "likes"])
    .index("by_username_hot", ["username", "hotScore"])
    .index("by_username_controversial", ["username", "controversialScore"])
    .searchIndex("search_body", {
    searchField: "body",
    filterFields: ["username"],
  }),

  profiles: defineTable({
    userId: v.string(),
    username: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profilePic: v.optional(v.id("_storage")),
    defaultProfilePic: v.id("_storage"),
    location: v.optional(v.string()),
    locationCountryCode: v.optional(v.string()),
    bio: v.optional(v.string()),
    education: v.optional(v.array(
        v.object({
          degree: v.string(),
          subject: v.string(),
          institution: v.string(),
        })
      )),
    skills: v.optional(v.array(v.string())),
    socials: v.optional(v.array(
      v.object({
        platform: v.string(),
        url: v.string()
      })
    )),
    totalLikes: v.number(),
    articlesPublished: v.number(),
    commentsPublished: v.number(),
    followerCount: v.number(),
    followingCount: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_username", ["username"]),

  commentVotes: defineTable({
    userId: v.string(),
    commentId: v.id("comments"),
  })
    .index("by_user_and_comment", ["userId", "commentId"])
    .index("by_comment", ["commentId"]),

  blogVotes: defineTable({
    userId: v.string(),
    blogId: v.string(),
  })
    .index("by_user_and_blog", ["userId", "blogId"])
    .index("by_blog", ["blogId"]),

  featuredBlogs: defineTable({
    userId: v.string(),
    blogId: v.string(),
  })
    .index("by_user_and_blog", ["userId", "blogId"])
    .index("by_blog", ["blogId"]),

  uploadedAvatar: defineTable({
    storageId: v.id("_storage"),
  })
  .index("by_storageId", ["storageId"]),

  follows: defineTable({
    followerId: v.id("profiles"),
    followingId: v.id("profiles"),
  })
    .index("by_follower_and_following", ["followerId", "followingId"])
    .index("by_following", ["followingId"])
    .index("by_follower", ["followerId"]),
});

export default schema;