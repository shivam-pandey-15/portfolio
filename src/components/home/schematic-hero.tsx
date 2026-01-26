"use client";

import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";

export function SchematicHero() {
    const [bootStep, setBootStep] = useState(0);
    const bootSequence = [
        "> KERNEL_INIT...",
        "> MOUNTING_FILE_SYSTEM...",
        "> LOADING_MODULES [SEARCH, INDEXING, RANKING]...",
        "> SYSTEMS_ATLAS_V1.0 ONLINE"
    ];

    useEffect(() => {
        if (bootStep < bootSequence.length) {
            const timer = setTimeout(() => {
                setBootStep(prev => prev + 1);
            }, 600); // Speed of boot sequence
            return () => clearTimeout(timer);
        }
    }, [bootStep]);

    return (
        <section className="relative border-b border-zinc-800 bg-zinc-950 pt-24 pb-20 overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl">
                    <div className="font-mono text-zinc-500 text-sm mb-4">
                        <span className="text-emerald-500">root@shivam:~/systems-atlas</span>
                        <span className="animate-pulse">_</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6">
                        ENGINEERING <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">SCHEMATICS</span>
                    </h1>

                    <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg font-mono text-sm text-zinc-400 min-h-[140px] shadow-inner">
                        <div className="flex items-center gap-2 text-zinc-600 mb-2 border-b border-zinc-800/50 pb-2">
                            <Terminal className="w-3 h-3" />
                            <span className="text-[10px] uppercase tracking-widest">Boot Log</span>
                        </div>
                        <div className="space-y-1">
                            {bootSequence.slice(0, bootStep + 1).map((line, i) => (
                                <div key={i} className={i === bootSequence.length - 1 ? "text-emerald-500 font-bold" : ""}>
                                    {line}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Decorative Stats */}
                <div className="absolute top-12 right-12 hidden md:block text-right font-mono text-[10px] text-zinc-600 space-y-1">
                    <div>UPTIME: 99.99%</div>
                    <div>LATENCY: 24ms</div>
                    <div>REGION: US-EAST-1</div>
                </div>
            </div>
        </section>
    );
}
