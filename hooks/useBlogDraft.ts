import { useEffect, useRef } from "react";
import { UseFormWatch } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const DRAFT_KEY = "blog_post_draft_data";

export function useBlogDraft<T extends Record<string, any>>(
  watch: UseFormWatch<T>,
  isEditing: boolean,
  userId?: string
) {
  const createConvexDraft = useMutation(api.drafts.createDraft);
  const latestFormValues = useRef<T | null>(null);

  useEffect(() => {
    if (isEditing) return;

    const subscription = watch((values) => {
      latestFormValues.current = values as T;

      const { coverImage, ...serializable } = values;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(serializable));
    });

    return () => subscription.unsubscribe();
  }, [watch, isEditing]);

  useEffect(() => {
    if (isEditing || !userId) return;

    const handleSaveNewDraft = () => {
      const data = latestFormValues.current;
      if (!data) return;

      const title = (data.title as string) || "";
      const subtitle = (data.subtitle as string) || "";
      const content = (data.content as string) || "";
      const tags = (data.tags as string[]) || [];

      if (title.trim() || content.trim()) {
        createConvexDraft({
          userId,
          title,
          subtitle,
          content,
          tags,
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleSaveNewDraft();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleSaveNewDraft);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleSaveNewDraft);
    };
  }, [userId, isEditing, createConvexDraft]);

  const clearLocalDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    latestFormValues.current = null;
  };

  return { clearLocalDraft };
}