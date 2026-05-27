"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const AVAILABLE_TAGS = ["Tutorials", "Research", "Design", "Technology", "Product", "Opinion"];

export function TagFilters() {
    return (
        <div className="my-12 flex flex-col items-center gap-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">Filter by Topic</p>
            
            <ToggleGroup type="multiple" className="flex flex-wrap justify-center gap-3">
                <ToggleGroupItem value="all" className="rounded-full px-4 py-2 border data-[state=on]:bg-black data-[state=on]:text-white">
                    All Posts
                </ToggleGroupItem>
                {AVAILABLE_TAGS.map((tag, index) => (
                    <ToggleGroupItem 
                        key={tag} 
                        value={tag} 
                        className="rounded-full px-4 py-2 border data-[state=on]:bg-black data-[state=on]:text-white"
                    >
                        {tag}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        </div>
    );
}