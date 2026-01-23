"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { searchNavConfig } from "@/config/search-nav";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Helper to check if a section is active
    const isSectionActive = (href: string) => pathname.startsWith(href);

    // State to track expanded sections
    // Initialize with the section that matches the current URL
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        searchNavConfig.forEach((section) => {
            if (pathname.startsWith(section.href)) {
                initial[section.title] = true;
            }
        });
        return initial;
    });

    const toggleSection = (title: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-50">
                <Link href="/search" className="font-bold text-lg">
                    Systems Atlas
                </Link>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-accent rounded-md"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-auto md:min-h-screen overflow-y-auto",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-6">
                    <Link href="/" className="block mb-8">
                        <h1 className="text-xl font-bold tracking-tight text-primary">Systems Atlas</h1>
                        <p className="text-xs text-muted-foreground mt-1">Search Engineering Guide</p>
                    </Link>

                    <nav className="space-y-4">
                        {searchNavConfig.map((section) => {
                            const isExpanded = expandedSections[section.title];
                            const active = isSectionActive(section.href);
                            const hasChildren = section.items && section.items.length > 0;

                            return (
                                <div key={section.href}>
                                    <div className="flex items-center justify-between mb-1 group">
                                        <Link
                                            href={section.href}
                                            className={cn(
                                                "flex-grow font-semibold hover:text-primary transition-colors py-1",
                                                active ? "text-primary" : "text-muted-foreground"
                                            )}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            {section.title}
                                        </Link>

                                        {hasChildren && (
                                            <button
                                                onClick={() => toggleSection(section.title)}
                                                className="p-1 text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                            </button>
                                        )}
                                    </div>

                                    {hasChildren && isExpanded && (
                                        <ul className="space-y-1 pl-3 border-l border-border ml-1 animate-in slide-in-from-top-2 duration-200">
                                            {section.items!.map((item) => (
                                                <li key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        className={cn(
                                                            "block text-sm py-1 px-2 rounded-md transition-colors truncate",
                                                            pathname === item.href
                                                                ? "bg-accent text-accent-foreground font-medium"
                                                                : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                                                        )}
                                                        onClick={() => setIsSidebarOpen(false)}
                                                        title={item.title}
                                                    >
                                                        {item.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    <div className="mt-8 pt-6 border-t border-border">
                        <Link
                            href="/"
                            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
                        >
                            ← Back to Portfolio
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                <div className="container max-w-4xl mx-auto p-6 md:p-12 lg:p-16">
                    {children}
                </div>
            </main>
        </div>
    );
}
