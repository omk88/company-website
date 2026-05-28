import { auth } from "@/convex/auth" 
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const { GET, POST } = handler;