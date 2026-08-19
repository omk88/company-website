import { create } from 'zustand';

type FollowsType = 'followers' | 'following';

interface FollowsState {
  selectedFollows: FollowsType;
  setSelectedFollows: (follows: FollowsType) => void;
}

export const useFollowsStore = create<FollowsState>((set) => ({
  selectedFollows: 'followers',
  setSelectedFollows: (follows) => set({ selectedFollows: follows }),
}));