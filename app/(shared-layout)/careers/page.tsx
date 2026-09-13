import Footer from "@/components/web/Footer";
import UnifiedCareersTable from "@/components/web/UnifiedCareersTable";
import { cn } from "@/lib/utils";
import { Briefcase } from "lucide-react";

export default function Careers() {
    return (
        <>
            <div className="max-w-6xl mx-auto w-full min-h-screen border-x border-neutral-200 dark:border-neutral-800">
                <div className="py-26 px-16">
                    <div 
                        className={cn(
                            "flex flex-col gap-2 w-full",
                            "text-neutral-600 dark:text-neutral-400"
                        )}
                    >
                        <div className="inline-flex w-fit items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-gray-200/80 shadow-sm text-sm font-medium text-foreground">
                            <Briefcase className="w-4 h-4 text-foreground" />
                            <span>Careers</span>
                        </div>
                        <h1
                            className={cn(
                            "text-2xl sm:text-3xl md:text-4xl", 
                            "font-semibold tracking-tight text-foreground",
                            "leading-tight"
                            )}
                        >
                            Join the team
                        </h1>
                        <p className="max-w-lg font-light text-base sm:text-lg leading-relaxed text-wrap">
                            Interested in working for us? View our open positions and if you think you're a good fit, send us an application.
                        </p>
                        <div className="mt-8">
                            <UnifiedCareersTable />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}