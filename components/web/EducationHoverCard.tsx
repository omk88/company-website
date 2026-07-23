import { GraduationCap } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "../ui/hover-card";
import { Doc } from "@/convex/_generated/dataModel";

interface EducationHoverCardProps {
    education: Doc<"profiles">["education"];
}

export function EducationHoverCard({ education }: EducationHoverCardProps) {

    return (
        <div>
            <HoverCard openDelay={100} closeDelay={100}>
                <HoverCardTrigger asChild>
                <button className="bg-zinc-200 text-muted-foreground p-2 rounded-2xl flex items-center gap-1.5 min-w-[3rem] justify-start cursor-pointer hover:bg-zinc-300 transition-colors">
                    <GraduationCap className="w-4 h-4 stroke-[2.3] shrink-0" />
                    <span className="text-sm font-medium">{education?.length ?? 0}</span>
                </button>
                </HoverCardTrigger>

                <HoverCardContent side="bottom" align="start" className="max-w-96">
                    <div className="space-y-2">
                        <h4 className="text-[12px]">Education</h4>
                        <ul className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pt-0.5">
                        {education?.map((cert) => (
                            <li key={`${cert.degree} ${cert.institution} ${cert.subject}`}>
                                <span className="text-[12px]">{ cert.degree } in { cert.subject } from { cert.institution }</span>
                            </li>
                        ))}
                        </ul>
                    </div>
                </HoverCardContent>
            </HoverCard>
        </div>
    )
}