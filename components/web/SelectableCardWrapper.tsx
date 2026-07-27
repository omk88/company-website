"use client";

import { Id } from "@/convex/_generated/dataModel";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Pen } from "lucide-react";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

interface SelectableCardWrapperProps<T extends string> {
    id: T;
    isSelected: boolean;
    onSelectChange: (id: T, checked: boolean) => void;
    isOwnProfile: string | boolean | undefined;
    children: React.ReactNode;
    actions?: React.ReactNode;
}

export function SelectableCardWrapper<T extends string>({id, isSelected, onSelectChange, isOwnProfile, children, actions}: SelectableCardWrapperProps<T>) {

    const convex = useConvex();
    
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
                className={`absolute z-10 p-0.5 bg-white border border-b border-r transition-opacity duration-100 ${
                    isSelected
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
                    }`}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className="flex flex-row items-center gap-0.5">
                    <div className="h-6 w-6 flex items-center justify-center rounded hover:bg-accent/50 transition-colors">
                        <Checkbox
                            id={`select-card-${id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => onSelectChange(id, !!checked)}
                            className="h-3.5 w-3.5 data-[state=checked]:bg-primary border-black cursor-pointer"
                        />
                    </div>
                    {actions}
                </div>
            </div>

            {children}
        </div>
    )
}