"use client";

import { Id } from "@/convex/_generated/dataModel";
import { Checkbox } from "../ui/checkbox";

interface SelectableCardWrapperProps {
    id: Id<"blogs">;
    isSelected: boolean;
    onSelectChange: (id: Id<"blogs">, checked: boolean) => void;
    isOwnProfile: string | boolean | undefined;
    children: React.ReactNode;
}

export function SelectableCardWrapper({id, isSelected, onSelectChange, isOwnProfile, children}: SelectableCardWrapperProps) {

    if (!isOwnProfile) {
        return (
            <>
                {children}
            </>
        )
    }

    return (
        <div className="relative group">
            <div 
                className="absolute z-1 p-1 bg-white border border-border/50 rounded-none"
                onClick={(e) => {
                e.stopPropagation();
                }}
            >
            <Checkbox
                id={`select-card-${id}`}
                checked={isSelected}
                onCheckedChange={(checked) => onSelectChange(id, !!checked)}
                className="data-[state=checked]:bg-primary border-black"
                />
            </div>

            {children}
        </div>
    )
}