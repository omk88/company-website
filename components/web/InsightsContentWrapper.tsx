import { api } from "@/convex/_generated/api";
import { Preloaded } from "convex/react";
import { useEffect } from "react";
import { useLocalSearch } from "./SearchContext";
import { PageBlogPosts } from "./PageBlogPosts";

interface InsightsContentWrapperProps {
  preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
  preloadedInitialBlogs: Preloaded<typeof api.blogs.getPaginatedPostsByUsername>;
}

export function InsightsContentWrapper({ preloadedProfile, preloadedInitialBlogs }: InsightsContentWrapperProps) {

  const { setSearchTerm, setSortOrder } = useLocalSearch();

  useEffect(() => {
    setSearchTerm("");
    setSortOrder("new");
  }, [setSearchTerm, setSortOrder]);

  return (
    <div className="w-full px-4 mb-8">
        <PageBlogPosts
            preloadedProfile={preloadedProfile}
            preloadedInitialBlogs={preloadedInitialBlogs}
        />
    </div>
  );
}