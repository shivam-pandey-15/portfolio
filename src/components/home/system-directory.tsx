"use client";

import { ArrowRight, Circle, Database, Search, Cpu, Activity, Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const modules = [
    {
        id: "SYS-001",
        name: "Search Engine Architecture",
        description: "Inverted Index, TF-IDF, BKD Trees",
        status: "ONLINE",
        icon: Search,
        href: "/search",
        latency: "12ms"
    },
    {
        id: "SYS-002",
        name: "Distributed Consensus",
        description: "Raft Implementation, Log Replication",
        status: "OFFLINE",
        icon: Activity,
        href: "#",
        latency: "-"
    },
    {
        id: "SYS-003",
        name: "Storage Engine",
        description: "LSM Trees, WAL, MemTable",
        status: "PLANNED",
        icon: Database,
        href: "#",
        latency: "-"
    },
    {
        id: "SYS-004",
        name: "System Design Patterns",
        description: "Rate Limiting, Circuit Breakers",
        status: "PLANNED",
        icon: Cpu,
        href: "#",
        latency: "-"
    }
];

export function SystemDirectory() {
    return (
        <section className="container mx-auto px-6 py-16 bg-zinc-950 font-mono">
            <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-500" />
                    SYSTEM_DIRECTORY
                </h2>
                <div className="text-xs text-zinc-500">
                    TOTAL_MODULES: {modules.length}
                </div>
            </div>

            <div className="border border-zinc-800 rounded bg-zinc-900/20 overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-zinc-900 border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                    <div className="col-span-2">Sys_ID</div>
                    <div className="col-span-5">Module_Name</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1 hidden md:block">Latency</div>
                    <div className="col-span-2 text-right">Action</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-zinc-800/50">
                    {modules.map((module) => (
                        <div
                            key={module.id}
                            className="group grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-zinc-800/50 transition-colors"
                        >
                            <div className="col-span-2 text-xs text-zinc-500 font-mono">
                                {module.id}
                            </div>

                            <div className="col-span-5">
                                <div className="text-zinc-200 font-bold text-sm group-hover:text-blue-400 transition-colors">
                                    {module.name}
                                </div>
                                <div className="text-[10px] text-zinc-500 uppercase mt-1">
                                    {module.description}
                                </div>
                            </div>

                            <div className="col-span-2">
                                <div className={cn(
                                    "inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold border",
                                    module.status === "ONLINE"
                                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                        : "bg-zinc-800 text-zinc-500 border-zinc-700"
                                )}>
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full",
                                        module.status === "ONLINE" ? "bg-emerald-500 animate-pulse" : "bg-zinc-500"
                                    )} />
                                    {module.status}
                                </div>
                            </div>

                            <div className="col-span-1 hidden md:block text-xs text-zinc-600 font-mono">
                                {module.latency}
                            </div>

                            <div className="col-span-2 text-right">
                                {module.status === "ONLINE" ? (
                                    <Link href={module.href} className="inline-flex items-center text-xs font-bold text-blue-500 hover:text-blue-400 uppercase tracking-wide group-hover:translate-x-1 transition-transform">
                                        Access <ArrowRight className="w-3 h-3 ml-1" />
                                    </Link>
                                ) : (
                                    <span className="text-xs text-zinc-700 cursor-not-allowed uppercase">Locked</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
