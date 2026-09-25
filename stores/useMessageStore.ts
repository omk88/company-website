import { create } from "zustand";

interface OtherUserProfile {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

interface MessageStore {
  activeConversationId: string | null;
  activeUserProfile: OtherUserProfile | null;
  setActiveConversation: (
    conversationId: string | null,
    userProfile?: OtherUserProfile | null
  ) => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  activeConversationId: null,
  activeUserProfile: null,
  setActiveConversation: (conversationId, userProfile = null) =>
    set({
      activeConversationId: conversationId,
      activeUserProfile: userProfile,
    }),
}));