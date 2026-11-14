import { create } from 'zustand';

export interface VideoDraft {
    _id: string;
    title: string;
    description?: string;
    thumbnailStorageId?: string;
    thumbnailUrl?: string | null;
    videoStorageId?: string;
    videoUrl?: string | null;
}

export interface VideoPost {
    _id: string;
    title: string;
    description?: string;
    author: string;
    thumbnailStorageId?: string;
    thumbnailUrl?: string | null;
    videoStorageId?: string;
    videoUrl?: string | null;
}

interface VideoStore {
    selectedVideoPost: VideoPost | null;
    activeDraft: VideoDraft | null;
    setSelectedVideoPost: (videoPost: VideoPost | null) => void;
    setActiveDraft: (draft: VideoDraft | null) => void;
    clearStore: () => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
    selectedVideoPost: null,
    activeDraft: null,
    
    setSelectedVideoPost: (videoPost) => set({ selectedVideoPost: videoPost, activeDraft: null }),
    setActiveDraft: (draft) => set({ activeDraft: draft, selectedVideoPost: null }),
    clearStore: () => set({ selectedVideoPost: null, activeDraft: null }),
}));