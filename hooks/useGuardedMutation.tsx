import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { useBanModal } from "@/components/web/BanProvider";
import { FunctionReference } from "convex/server";

type OptimisticUpdateFn<T extends FunctionReference<"mutation">> = Parameters<
  ReturnType<typeof useMutation<T>>["withOptimisticUpdate"]
>[0];

export function useGuardedMutation<T extends FunctionReference<"mutation">>(
  mutationRef: T,
  optimisticUpdate?: OptimisticUpdateFn<T>
) {
  let rawMutation = useMutation(mutationRef);

  if (optimisticUpdate) {
    rawMutation = rawMutation.withOptimisticUpdate(optimisticUpdate);
  }

  const { showBanDialog } = useBanModal();

  return async (
    ...args: Parameters<typeof rawMutation>
  ): Promise<ReturnType<typeof rawMutation> | void> => {
    try {
      return await rawMutation(...args);
    } catch (error) {
      if (error instanceof ConvexError && error.data?.code === "USER_BANNED") {
        showBanDialog({
          banReason: error.data.banReason,
          banViolations: error.data.banViolations,
          bannedAt: error.data.bannedAt,
          bannedUntil: error.data.bannedUntil,
        });
        return;
      }
      throw error;
    }
  };
}