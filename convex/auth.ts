import { betterAuth } from "better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";
import { mutation, query } from "./_generated/server";
import { username } from "better-auth/plugins";
import { v } from "convex/values";

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: process.env.SITE_URL || "http://localhost:3000",
    database: authComponent.adapter(ctx),
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
    plugins: [
      convex({ authConfig }),
      username(),
    ],
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            const usernameHandle = user.email.split("@")[0];
            return {
              data: {
                ...user,
                username: usernameHandle,
              },
            };
          },
        },
      },
    },
    session: {
      cookieCache: { enabled: true, maxAge: 5 * 60 },
    },
  });
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    let profilePicUrl = null;
    if (profile?.profilePic) {
      profilePicUrl = await ctx.storage.getUrl(profile.profilePic);
    }

    return {
      userId: identity.subject,
      email: identity.email,
      username: identity.username,
      profile: profile ? {
        ...profile,
        profilePicUrl
      } : null
    };
  },
});

export const updateAuthImage = mutation({
  args: {
    image: v.string(),
  },
  handler: async (ctx, args) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    
    await auth.api.updateUser({
      body: {
        image: args.image,
      },
      headers,
    });
  },
});