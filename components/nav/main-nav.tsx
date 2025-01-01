"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { Home, BookOpen, MessageSquare, Menu, Sparkles } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RoomSidebar } from "../RoomSidebar";

export function MainNav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        {
            href: "/",
            label: "Home",
            icon: Home,
            active: pathname === "/",
        },
        {
            href: "/rooms",
            label: "Rooms",
            icon: MessageSquare,
            active: pathname === "/rooms",
        },
        {
            href: "/playground",
            label: "Playground",
            icon: Sparkles,
            active: pathname === "/playground",
        },
    ];

    return (
        <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-9 px-0 lg:hidden">
                                <Menu className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <RoomSidebar />
                        </SheetContent>
                    </Sheet>
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold text-xl text-red-500 lowercase hidden md:inline">ratimics::legion</span>
                        <span className="font-bold text-xl text-red-500 lowercase md:hidden">rati::legion</span>
                    </Link>
                </div>

                <div className="hidden md:flex items-center space-x-1">
                    {navItems.map((item) => (
                        <Button
                            key={item.href}
                            variant={item.active ? "secondary" : "ghost"}
                            size="sm"
                            className={cn("gap-2", item.active && "bg-muted")}
                            asChild
                        >
                            <Link href={item.href} className="flex items-center gap-2">
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        </Button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <Link href="https://github.com/dGNON/echochambers" target="_blank" className="hidden md:block">
                        <Button variant="ghost" size="icon">
                            <SiGithub className="h-5 w-5" />
                        </Button>
                    </Link>
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}