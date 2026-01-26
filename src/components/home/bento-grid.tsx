"use client";

import { Search, Database, Network, Cpu, Lock, Activity, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BentoCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    href?: string;
    status?: "live" | "building" | "planned";
    className?: string;
    bgImage?: React.ReactNode;
}

function BentoCard({ title, description, icon, href, status = "planned", className, bgImage }: BentoCardProps) {
    const Component = href ? Link : "div";
    const linkProps = href ? { href } : {};

    return (
        // @ts-ignore - Dynamic Link component type issue
        <Component
            {...linkProps}
            className={cn(
                "group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8 transition-all hover:border-zinc-700",
                href && "hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer",
                className
            )}
        >
            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-950" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-8">
                    <div className={cn(
                        "p-3 rounded-2xl border",
                        status === "live" ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                    )}>
                        {icon}
                    </div>
                    {status === "live" && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live
                        </span>
                    )}
                    {status === "building" && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                            In Progress
                        </span>
                    )}
                </div>

                <div className="mt-auto space-y-2">
                    <h3 className="text-2xl font-bold text-zinc-100 group-hover:text-white transition-colors">
                        {title}
                    </h3>
                    <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors leading-relaxed">
                        {description}
                    </p>
                </div>

                {href && (
                    <div className="absolute bottom-8 right-8 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        <ArrowUpRight className="w-6 h-6 text-white" />
                    </div>
                )}
            </div>

            {bgImage && (
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay">
                    {bgImage}
                </div>
            )}
        </Component>
    );
}

export function BentoGrid() {
    return (
        <section className="container px-4 md:px-6 mx-auto py-24">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                <div className="space-y-2 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">System Modules</h2>
                    <p className="text-zinc-400">
                        Independent deep-dives into specific engineering domains.
                        Each module is built from scratch to demonstrate core principles.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
                {/* Search Module - Large Featured */}
                <BentoCard
                    className="md:col-span-2 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-950"
                    title="Search Engine Architecture"
                    description="A complete dissection of a modern search system. Covers Inverted Indices, TF-IDF, BKD Trees, Vector Search (HNSW), and Distributed Consensus."
                    icon={<Search className="w-8 h-8" />}
                    href="/search"
                    status="live"
                    bgImage={
                        <svg className="absolute right-0 bottom-0 w-96 h-96 transform translate-x-1/4 translate-y-1/4" viewBox="0 0 200 200">
                            <path fill="none" stroke="currentColor" strokeWidth="0.5" d="M0,0 Q100,200 200,0" className="text-indigo-500" />
                            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" className="text-indigo-500" />
                        </svg>
                    }
                />

                {/* Distributed Systems - Planned */}
                <BentoCard
                    title="Distributed Consensus"
                    description="Implementing Raft from scratch. Leader election, log replication, and split-brain recovery scenarios."
                    icon={<Network className="w-6 h-6" />}
                    status="building"
                />

                {/* Database Internals */}
                <BentoCard
                    title="Database Internals"
                    description="B-Trees, LSM Trees, and WAL. How data actually hits the disk."
                    icon={<Database className="w-6 h-6" />}
                    status="planned"
                />

                {/* System Design */}
                <BentoCard
                    className="md:col-span-2"
                    title="System Design Patterns"
                    description="Real-world architectural patterns: Circuit Breakers, Rate Limiters, Consistent Hashing, and Backpressure handling."
                    icon={<Cpu className="w-6 h-6" />}
                    status="planned"
                />
            </div>
        </section>
    );
}
