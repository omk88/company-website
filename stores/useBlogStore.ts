import { Id } from '@/convex/_generated/dataModel';
import { create } from 'zustand';

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
  setSelectedBlog: (blog: Blog | null) => void;
}

export const useBlogStore = create<BlogStore>((set) => ({
  selectedBlog: null,
  setSelectedBlog: (blog) => set({ selectedBlog: blog }),
}));