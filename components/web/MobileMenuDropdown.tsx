import { Briefcase, Cookie, FileText, HelpCircle, House, Info, Layers, Library, Menu, Shield } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import Link from "next/link";
import { useState } from "react";

const mainPages = [
  {
    title: "Home",
    href: "/",
    icon: House,
  },
  {
    title: "Insights",
    href: "/insights",
    icon: Library,
  },
  {
    title: "About",
    href: "/about",
    icon: Info,
  },
  {
    title: "Solutions",
    href: "/solutions",
    icon: Layers,
  },
  {
    title: "Careers",
    href: "/careers",
    icon: Briefcase,
  },
  {
    title: "Help & Support",
    href: "/contact",
    icon: HelpCircle,
  },
];

const legalPages = [
  { title: "Privacy Policy", href: "/privacy-policy", icon: Shield },
  { title: "Terms & Conditions", href: "/terms-and-conditions", icon: FileText },
  { title: "Cookie Policy", href: "/cookie-policy", icon: Cookie },
];

export function MobileMenuDropdown() {
    const [open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"ghost"}
                >
                    <Menu className="size-5 md:size-4 stroke-[2.5] md:stroke-2 text-foreground transition-all shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 overflow-hidden w-64">
                <div className="p-2">
                    <ul className="flex flex-col">
                        {mainPages.map((page) => {
                            const IconComponent = page.icon;

                            return (
                                <li key={page.href}>
                                    <Link
                                        href={page.href}
                                        onClick={handleClose}
                                        className="flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <div className="relative z-10 p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-foreground group-hover:scale-105 transition-transform duration-200 shrink-0">
                                            <IconComponent className="size-4 shrink-0 text-muted-foreground" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-base font-medium leading-none text-foreground">
                                                {page.title}
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="bg-neutral-50/80 dark:bg-neutral-900/50 border-t p-2">
                    <ul className="flex flex-col">
                        {legalPages.map((page) => {
                            const IconComponent = page.icon;

                            return (
                                <li key={page.href}>
                                    <Link
                                        href={page.href}
                                        onClick={handleClose}
                                        className="flex items-center"
                                    >
                                        <div className="relative z-10 p-2 text-foreground">
                                            <IconComponent className="size-4 shrink-0 text-foreground" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium leading-none text-foreground">
                                                {page.title}
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </PopoverContent>
        </Popover>
    )
}