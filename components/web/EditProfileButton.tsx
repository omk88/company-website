"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Pen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditProfileButtonProps {
    username: string;
}

export function EditProfileButton({ username }: EditProfileButtonProps) {
    const user = useQuery(api.auth.getCurrentUser);

    if (user?.username !== username) return null;
    
    return (
        <Button variant="ghost" size="icon">
            <Pen className="h-4 w-4" />
        </Button>
    );
}