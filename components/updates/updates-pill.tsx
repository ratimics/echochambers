"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { changelog } from "@/lib/changelog";
import { useChangelog } from "@/lib/stores/use-changelog";

// Type definition for changes
interface Change {
    type: "feature" | "improvement" | "fix";
    description: string;
}

interface Version {
    version: string;
    date: string;
    highlights?: string[];
    changes: Change[];
}

interface UpdatesPillProps {
    trigger?: React.ReactNode;
}

// Memoized component for individual change items
const ChangeItem = memo(({ change, badgeVariant, badgeText }: { change: Change; badgeVariant: string; badgeText: string }) => (
    <div className="relative flex items-start group/item pb-3 border-b last:border-0 last:pb-0">
        <div className="flex-1 pr-24">
            <span className="text-sm leading-relaxed text-foreground/80 transition-colors group-hover/item:text-foreground/90">
                {change.description}
            </span>
        </div>
        <div className="absolute right-0 top-0">
            <Badge
                variant={badgeVariant}
                className={cn(
                    "relative px-2.5 py-0.5 h-6 min-w-[3rem] flex items-center justify-center transition-all duration-300",
                    badgeVariant === "default" && "group-hover/item:bg-primary group-hover/item:text-primary-foreground",
                    badgeVariant === "secondary" && "group-hover/item:bg-secondary group-hover/item:text-secondary-foreground",
                    badgeVariant === "outline" && "group-hover/item:border-primary"
                )}
            >
                <div
                    className={cn(
                        "absolute inset-0",
                        badgeVariant === "default" && "bg-primary/20 opacity-0 group-hover/item:opacity-100 blur-md rounded-md transition-opacity",
                        badgeVariant === "secondary" && "bg-secondary/20 opacity-0 group-hover/item:opacity-100 blur-md rounded-md transition-opacity",
                        badgeVariant === "outline" && "bg-primary/10 opacity-0 group-hover/item:opacity-100 blur-md rounded-md transition-opacity"
                    )}
                />
                <span className="relative">{badgeText}</span>
            </Badge>
        </div>
    </div>
));

ChangeItem.displayName = "ChangeItem";

// Memoized component for each version section
const VersionSection = memo(
    ({
        version,
        expandedVersions,
        toggleVersion,
    }: {
        version: Version;
        expandedVersions: Record<string, boolean>;
        toggleVersion: (version: string) => void;
    }) => (
        <div
            key={version.version}
            className={cn(
                "group relative overflow-hidden rounded-xl border bg-gradient-to-b from-muted/50 to-muted/0 backdrop-blur-sm transition-colors hover:bg-muted/50"
            )}
        >
            <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100"
                )}
            />
            <div className="relative p-3 space-y-3">
                {/* Version Header */}
                <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                            <span className="relative bg-gradient-to-br from-primary/80 to-primary px-3 py-1 rounded-full text-xs font-medium text-primary-foreground">
                                v{version.version}
                            </span>
                        </div>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground/70 bg-muted/50 px-3 py-1 rounded-full">
                        {version.date}
                    </span>
                </div>

                <div className="grid gap-3">
                    {/* Highlights Section */}
                    {version.highlights && (
                        <div className="group/card relative rounded-lg border bg-gradient-to-br from-card/90 to-card/50 p-4 transition-colors duration-300 hover:from-card/95 hover:to-card/60">
                            <div
                                className={cn(
                                    "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 rounded-lg"
                                )}
                            />
                            <h4 className="text-base font-semibold tracking-tight text-foreground/90 mb-4 flex items-center gap-2">
                                <div className="h-1 w-1 rounded-full bg-primary/70" />
                                Highlights
                            </h4>
                            <div className="grid gap-3 relative">
                                {version.highlights.map((highlight, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0 transition-transform group-hover/item:scale-110" />
                                        <span className="text-sm leading-relaxed text-foreground/80 transition-colors group-hover/item:text-foreground/90">
                                            {highlight}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Collapsible Changes Section */}
                    {version.changes.length > 0 && (
                        <>
                            <Button
                                variant="ghost"
                                className="w-full justify-between"
                                onClick={() => toggleVersion(version.version)}
                                aria-expanded={expandedVersions[version.version] || false}
                                aria-controls={`changes-section-${version.version}`}
                            >
                                <span className="text-sm font-medium">View all changes</span>
                                <ChevronDown
                                    className={cn("h-4 w-4 transition-transform", expandedVersions[version.version] && "rotate-180")}
                                />
                            </Button>

                            {expandedVersions[version.version] && (
                                <div
                                    id={`changes-section-${version.version}`}
                                    className="grid gap-3 animate-in slide-in-from-top-4 duration-200"
                                >
                                    {/* Features Section */}
                                    {version.changes.filter((c) => c.type === "feature").length > 0 && (
                                        <div className="group/card relative rounded-lg border bg-gradient-to-br from-card/90 to-card/50 p-4 transition-colors duration-300 hover:from-card/95 hover:to-card/60">
                                            <div
                                                className={cn(
                                                    "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 rounded-lg"
                                                )}
                                            />
                                            <h4 className="text-base font-semibold tracking-tight text-foreground/90 mb-4 flex items-center gap-2">
                                                <div className="h-1 w-1 rounded-full bg-primary/70" />
                                                Features
                                            </h4>
                                            <div className="grid gap-3 relative">
                                                {version.changes
                                                    .filter((change) => change.type === "feature")
                                                    .map((change, i) => (
                                                        <ChangeItem
                                                            key={i}
                                                            change={change}
                                                            badgeVariant="default"
                                                            badgeText="new"
                                                        />
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Improvements Section */}
                                    {version.changes.filter((c) => c.type === "improvement").length > 0 && (
                                        <div className="group/card relative rounded-lg border bg-gradient-to-br from-card/90 to-card/50 p-4 transition-colors duration-300 hover:from-card/95 hover:to-card/60">
                                            <div
                                                className={cn(
                                                    "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 rounded-lg"
                                                )}
                                            />
                                            <h4 className="text-base font-semibold tracking-tight text-foreground/90 mb-4 flex items-center gap-2">
                                                <div className="h-1 w-1 rounded-full bg-primary/70" />
                                                Improvements
                                            </h4>
                                            <div className="grid gap-3 relative">
                                                {version.changes
                                                    .filter((change) => change.type === "improvement")
                                                    .map((change, i) => (
                                                        <ChangeItem
                                                            key={i}
                                                            change={change}
                                                            badgeVariant="secondary"
                                                            badgeText="update"
                                                        />
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Fixes Section */}
                                    {version.changes.filter((c) => c.type === "fix").length > 0 && (
                                        <div className="group/card relative rounded-lg border bg-gradient-to-br from-card/90 to-card/50 p-4 transition-colors duration-300 hover:from-card/95 hover:to-card/60">
                                            <div
                                                className={cn(
                                                    "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 rounded-lg"
                                                )}
                                            />
                                            <h4 className="text-base font-semibold tracking-tight text-foreground/90 mb-4 flex items-center gap-2">
                                                <div className="h-1 w-1 rounded-full bg-primary/70" />
                                                Fixes
                                            </h4>
                                            <div className="grid gap-3 relative">
                                                {version.changes
                                                    .filter((change) => change.type === "fix")
                                                    .map((change, i) => (
                                                        <ChangeItem
                                                            key={i}
                                                            change={change}
                                                            badgeVariant="outline"
                                                            badgeText="fixed"
                                                        />
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
);

VersionSection.displayName = "VersionSection";

export function UpdatesPill({ trigger }: UpdatesPillProps = {}) {
    const { isOpen, setOpen, markAsRead, hasUnread } = useChangelog();
    const [expandedVersions, setExpandedVersions] = useState<Record<string, boolean>>({});

    // Mark as read when dialog opens
    useEffect(() => {
        if (isOpen) {
            markAsRead();
        }
    }, [isOpen, markAsRead]);

    // Toggle version expansion
    const toggleVersion = useCallback((version: string) => {
        setExpandedVersions((prev) => ({
            ...prev,
            [version]: !prev[version],
        }));
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            {trigger ? (
                <DialogTrigger asChild>{trigger}</DialogTrigger>
            ) : (
                <DialogTrigger asChild>
                    <div
                        className={cn(
                            "fixed bottom-4 left-4 z-50 hidden md:flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer bg-gradient-to-b from-muted/50 to-muted/0 backdrop-blur-sm border shadow-sm hover:bg-muted/50 transition-colors group"
                        )}
                    >
                        <div className="relative">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            {hasUnread && (
                                <div className="absolute inset-0 animate-ping h-2 w-2 rounded-full bg-green-500/50" />
                            )}
                        </div>
                        <span className="text-sm font-medium">Updates</span>
                    </div>
                </DialogTrigger>
            )}
            <DialogContent
                className={cn("sm:max-w-[555px] w-[calc(100%-3rem)] rounded-xl")}
                aria-describedby="updates-dialog-description"
            >
                <VisuallyHidden id="updates-dialog-description">
                    <DialogTitle>What's New</DialogTitle>
                </VisuallyHidden>
                <DialogHeader className="mb-3">
                    <DialogTitle className="text-2xl font-semibold text-center">What's New</DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground">
                        Stay updated with the latest features, improvements, and fixes.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] px-1 -mx-6">
                    <div className="px-3 space-y-6">
                        {changelog.map((version: Version) => (
                            <VersionSection
                                key={version.version}
                                version={version}
                                expandedVersions={expandedVersions}
                                toggleVersion={toggleVersion}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}