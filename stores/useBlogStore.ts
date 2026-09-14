import { create } from 'zustand';

export interface Draft {
  _id: string;
  title: string;
  subtitle?: string;
  content: string;
  tags?: string[];
}

export interface Blog {
  _id: string;
  title: string;
  subtitle?: string;
  content: string;
  author: string;
  tags?: string[];
  imageUrl?: string;
  storageId?: string;
}

interface BlogStore {
  selectedBlog: Blog | null;
  activeDraft: Draft | null;
  setSelectedBlog: (blog: Blog | null) => void;
  setActiveDraft: (draft: Draft | null) => void;
  clearStore: () => void;
}

export const useBlogStore = create<BlogStore>((set) => ({
  selectedBlog: null,
  activeDraft: null,
  
  setSelectedBlog: (blog) => set({ selectedBlog: blog, activeDraft: null }),
  
  setActiveDraft: (draft) => set({ activeDraft: draft, selectedBlog: null }),
  
  clearStore: () => set({ selectedBlog: null, activeDraft: null }),
}));