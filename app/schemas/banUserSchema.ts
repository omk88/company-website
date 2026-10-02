import z from "zod";

export const banUserSchema = z.object({
  violations: z.array(z.string()).min(1, "Select at least one violation rule"),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
  duration: z.string().min(1, "Please select a ban duration"),
});