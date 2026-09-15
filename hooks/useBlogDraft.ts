import { useEffect, useRef } from "react";
import { UseFormWatch } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useBlogStore } from "@/stores/useBlogStore";

export function useBlogDraft<T extends Record<string, any>>(
  watch: UseFormWatch<T>,
  isEditing: boolean,
  userId?: string,
  draftId?: string
) {
  const saveConvexDraft = useMutation(api.drafts.saveDraft);
  const deleteDraftById = useMutation(api.drafts.deleteDraftById);
  const setActiveDraft = useBlogStore((state) => state.setActiveDraft);
  const activeDraft = useBlogStore((state) => state.activeDraft);
  const clearStore = useBlogStore((state) => state.clearStore);

  const latestFormValues = useRef<T | null>(null);
  const currentDraftIdRef = useRef<string | undefined>(draftId);
  
  const isSavingRef = useRef<boolean>(false);
  const isClearedRef = useRef<boolean>(false);

  useEffect(() => {
    currentDraftIdRef.current = draftId;
  }, [draftId]);

  useEffect(() => {
    if (isEditing) return;
    const subscription = watch((values) => {
      latestFormValues.current = values as T;
    });
    return () => subscription.unsubscribe();
  }, [watch, isEditing]);

  useEffect(() => {
    if (isEditing || !userId) return;

    const handleSaveDraft = async () => {
      if (isSavingRef.current) return;

      const data = latestFormValues.current;
      if (!data || isSavingRef.current) return;

      const title = (data.title as string) || "";
      const subtitle = (data.subtitle as string) || "";
      const content = (data.content as string) || "";
      const tags = (data.tags as string[]) || [];
      const storageId = (data.storageId as string) || undefined;

      if (!title.trim() && !content.trim()) return;

      try {
        isSavingRef.current = true;

        const savedId = await saveConvexDraft({
          draftId: currentDraftIdRef.current as any,
          userId,
          title,
          subtitle,
          content,
          tags,
        });

        if (savedId) {
          currentDraftIdRef.current = savedId;
          
          setActiveDraft({
            ...activeDraft,
            _id: savedId,
            title,
            subtitle,
            content,
            tags,
            storageId,
          });
        }
      } catch (err) {
        console.error("Failed to auto-save draft:", err);
      } finally {
        isSavingRef.current = false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleSaveDraft();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handleSaveDraft);
    window.addEventListener("popstate", handleSaveDraft);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handleSaveDraft);
      window.removeEventListener("popstate", handleSaveDraft);
      
      handleSaveDraft();
    };
  }, [userId, isEditing, saveConvexDraft, setActiveDraft]);

  const clearDraft = async () => {
    isClearedRef.current = true;
    latestFormValues.current = null;
    
    const targetDraftId = currentDraftIdRef.current;
    currentDraftIdRef.current = undefined;

    if (targetDraftId) {
      try {
        await deleteDraftById({ draftId: targetDraftId as any });
      } catch (err) {
        console.error("Failed to delete draft:", err);
      }
    }

    clearStore();
  };

  return { clearDraft };
}