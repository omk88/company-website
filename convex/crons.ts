import { cronJobs } from "convex/server";
import { api } from "./_generated/api";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
    "cleanup-orphaned-avatars",
    { hourUTC: 0, minuteUTC: 0 },
    api.avatarCleanup.purgeOrphanedFiles
);

export default crons;