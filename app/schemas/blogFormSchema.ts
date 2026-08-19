import { z } from "zod";

export const blogFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title is too long"),
  subtitle: z.string().optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  tags: z
    .array(z.string())
    .min(1, "Please select at least one tag."),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;