"use client";

import { Checkbox } from "../ui/checkbox";

interface SelectableCardWrapperProps {
    id: string;
    isSelected: boolean;
    onSelectChange: (id: string, checked: boolean) => void;
    children: React.ReactNode;
}

export function SelectableCardWrapper({id, isSelected, onSelectChange, children}: SelectableCardWrapperProps) {
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