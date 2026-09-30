import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { FaGithub } from "react-icons/fa"
import { RxLinkedinLogo } from "react-icons/rx"

export default function () {
    return (
        <div className="w-full rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="flex flex-col items-center p-6 gap-4">
                <div className="relative h-24 w-24 shrink-0 rounded-full overflow-hidden border-2 border-muted bg-muted">
                    <Image
                        src={"/emmanuellearmount.jpg"}
                        alt={"Emmanuel Learmount"}
                        fill
                        sizes="64px"
                        priority
                        className="object-cover rounded-full"
                        unoptimized
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                        Emmanuel Learmount
                    </span>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400 font-bold">
                        Founder & CEO
                    </span>
                </div>
                <div className=" gap-4 px-8 sm:px-12 py-3.5 flex items-center justify-between text-xs text-neutral-500 isolate">
                    <Link href="https://www.linkedin.com/in/e-learmount" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <RxLinkedinLogo className="h-6 w-6 hover:text-foreground transition-colors" />
                    </Link>
                    <Link href="https://github.com/omk88" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <FaGithub className="h-6 w-6 hover:text-foreground transition-colors" />
                    </Link>
                </div>
            </div>
        </div>
    )
}