import { betterAuth } from "better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";
import { query } from "./_generated/server";
// import { Resend } from "resend";

export const authComponent = createClient<DataModel>(components.betterAuth);

// const resend = new Resend(process.env.RESEND_API_KEY);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: process.env.SITE_URL || "http://localhost:3000",
    database: authComponent.adapter(ctx),
    secret: process.env.BETTER_AUTH_SECRET,
    advanced: {
      cookiePrefix: "__Secure-",
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,

      /*sendResetPassword: async ({ user, url }) => {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || "info@taqtiq.tech",
            to: user.email,
            subject: "Reset your password",
            html: `
              <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px;">
                <h2 style="font-size: 20px; font-weight: 600; color: #18181b; margin-bottom: 8px;">Password Reset</h2>
                <p style="font-size: 14px; color: #71717a; line-height: 1.5;">You requested a password reset for your account. Click the button below to set a new password:</p>
                <a href="${url}" style="display: inline-block; background-color: #18181b; color: #ffffff; font-size: 14px; font-weight: 500; text-decoration: none; padding: 10px 20px; border-radius: 6px; margin: 16px 0;">Reset Password</a>
                <p style="font-size: 12px; color: #a1a1aa; margin-top: 16px;">If you didn't make this request, you can safely ignore this email.</p>
              </div>
            `,
          });
        } catch (error) {
          console.error("Resend failed to send reset email:", error);
          throw new Error("Failed to send password reset email.");
        }
      },*/
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
    plugins: [
      convex({ authConfig }),
    ]
  });
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return identity; 
  },
});

