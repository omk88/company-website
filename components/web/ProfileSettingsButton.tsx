"use client";

import { ReactNode, useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

interface ProfileSettingsProps {
  profile: Doc<"profiles">;
  children: ReactNode;
}

export function ProfileSettingsButton({ profile }: ProfileSettingsProps) {
    return (
        <ProfileSettingsDialog profile={profile}>
            <Button variant="ghost" size="icon" className="cursor-pointer">
                <Settings className="h-4 w-4" />
            </Button>
        </ProfileSettingsDialog>
    );
}

function ProfileSettingsDialog({ profile, children }: ProfileSettingsProps) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent className="sm:max-w-[425px] max-h-[85vh] flex flex-col overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Profile Settings</DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}