import { Terminal } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "../ui/hover-card";
import { Doc } from "@/convex/_generated/dataModel";
import { Badge } from "../ui/badge";

interface SkillsHoverCardProps {
    skills: Doc<"profiles">["skills"];
}

export function SkillsHoverCard({ skills }: SkillsHoverCardProps) {

    return (
        <div>
            <HoverCard openDelay={100} closeDelay={100}>
                <HoverCardTrigger asChild>
                <button className="bg-zinc-200 text-muted-foreground p-2 rounded-2xl flex items-center gap-1.5 min-w-[3rem] justify-start cursor-pointer hover:bg-zinc-300 transition-colors">
                    <Terminal className="w-4 h-4 stroke-[2.3] shrink-0" />
                    <span className="text-sm font-medium">{skills?.length ?? 0}</span>
                </button>
                </HoverCardTrigger>

                <HoverCardContent side="bottom" align="start">
                    <div className="space-y-2">
                        <h4 className="text-[12px]">Skills/Programming Languages</h4>
                        <ul className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pt-0.5">
                        {skills?.map((skill) => (
                            <li key={skill}>
                            <Badge 
                                variant="outline" 
                                className="font-mono text-[10px] px-1.5 py-0.5 whitespace-nowrap border-black dark:border-white cursor-help hover:bg-muted transition-colors shrink-0"
                            >
                                {skill}
                            </Badge>
                            </li>
                        ))}
                        </ul>
                    </div>
                </HoverCardContent>
            </HoverCard>
        </div>
    )
}