import { Settings } from "lucide-react";
import { Button } from "../ui/button";

export function ProfileSettingsButton() {
    return (
        <div>
            <Button variant="ghost" size="icon" className="cursor-pointer">
                <Settings className="h-4 w-4" />
            </Button>
        </div>
    )
}