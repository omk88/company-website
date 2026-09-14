import { useEffect, useRef } from "react";
import { UseFormWatch } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useBlogDraft<T extends Record<string, any>>(
  watch: UseFormWatch<T>,
  isEditing: boolean,
  userId?: string,
  draftId?: string
) {
  const saveConvexDraft = useMutation(api.drafts.saveDraft);
  const deleteDraftById = useMutation(api.drafts.deleteDraftById);
  const latestFormValues = useRef<T | null>(null);

  useEffect(() => {
    if (isEditing) return;
    const subscription = watch((values) => {
      latestFormValues.current = values as T;
    });
    return () => subscription.unsubscribe();
  }, [watch, isEditing]);

  useEffect(() => {
    if (isEditing || !userId) return;

    const handleSaveDraft = () => {
      const data = latestFormValues.current;
      if (!data) return;

      const title = (data.title as string) || "";
      const subtitle = (data.subtitle as string) || "";
      const content = (data.content as string) || "";
      const tags = (data.tags as string[]) || [];

      if (title.trim() || content.trim()) {
        saveConvexDraft({
          draftId: draftId as any,
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
        handleSaveDraft();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleSaveDraft);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleSaveDraft);
    };
  }, [userId, isEditing, draftId, saveConvexDraft]);

  const clearDraft = async () => {
    latestFormValues.current = null;
    localStorage.removeItem("blog_post_draft_data");
    if (draftId) {
      await deleteDraftById({ draftId: draftId as any });
    }
  };

  return { clearDraft };
}