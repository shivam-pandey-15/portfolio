"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";

export function MonographHero() {
    return (
        <section className="relative min-h-screen flex flex-col justify-between p-6 md:p-12 bg-zinc-950 text-zinc-100 overflow-hidden">

            {/* Background: Modern Info-Graphic Grid (Dark Mode) */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none bg-zinc-950 overflow-hidden">

                {/* Micro-Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.1]"
                    style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                {/* Technical Markers (The "Info" part) */}
                <svg className="absolute inset-0 w-full h-full text-zinc-500 opacity-20" aria-hidden="true">
                    {/* Crosshairs at intersections */}
                    <pattern id="crosshair" x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
                        <path d="M40 0 V3 M0 40 H3" stroke="currentColor" strokeWidth="1" />
                        <path d="M120 0 V3 M0 120 H3" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#crosshair)" />

                    {/* Decorative Data Lines */}
                    <line x1="10%" y1="20%" x2="30%" y2="20%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
                    <line x1="70%" y1="80%" x2="90%" y2="80%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
                </svg>

                {/* Floating "Metrics" */}
                <div className="absolute top-20 right-20 font-mono text-[10px] text-zinc-600 flex flex-col items-end gap-1">
                    <span>SYS_OP: NORMAL</span>
                    <span>idx_size: 4TB</span>
                </div>
                <div className="absolute bottom-40 left-20 font-mono text-[10px] text-zinc-600 flex flex-col gap-1">
                    <span>COORD: 34.0522° N</span>
                    <span>LATENCY: &lt;1ms</span>
                </div>
            </div>

            {/* Background Typography Overlay (Dark Mode) */}
            <div className="absolute top-0 left-0 right-0 h-[60vh] flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
                <div className="flex flex-col items-center leading-none translate-y-[-10%]">
                    <span className="text-[15vw] font-black text-zinc-800 tracking-tighter">SYSTEMS</span>
                    <span className="text-[15vw] font-black text-zinc-950 px-4 -mt-4 z-10" style={{ textShadow: '-1px -1px 0 #52525b, 1px -1px 0 #52525b, -1px 1px 0 #52525b, 1px 1px 0 #52525b' }}>ATLAS</span>
                </div>
            </div>

            {/* Header / Brand */}
            <div className="relative z-10 animate-in fade-in slide-in-from-top-4 duration-1000">
                <p className="text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-100"></span>
                    Systems Atlas
                </p>
            </div>

            {/* Main Title (Hidden mostly by the background typography, but kept for semantic structure if needed) */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none opacity-0">
                <h1 className="text-[12vw] md:text-[10vw] font-serif font-black tracking-tighter text-zinc-100 select-none">
                    SYSTEMS
                </h1>
            </div>

            {/* Bottom Section */}
            <div className="relative z-10 flex flex-col md:flex-row items-end justify-between w-full h-full pb-8 md:pb-0">

                {/* Bottom Left Card: Volume 1 - Dark Mode Style */}
                <Link
                    href="/search"
                    className="group relative w-full md:w-80 bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:bg-zinc-800 hover:border-zinc-700 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200"
                >
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-zinc-100 text-zinc-950 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                        Volume 01
                    </div>

                    <div className="flex justify-between items-start mb-8 pt-2">
                        <Search className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
                        <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-serif text-white italic">Search Systems.</h3>
                        <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                            A comprehensive engineering guide. Inverted Indices, Ranking, and Distributed Consensus.
                        </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                        {/* Removed Reading Time */}
                        <span className="uppercase text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">In Progress</span>
                    </div>
                </Link>

                {/* Footer Credits (Bottom Right) */}
                <div className="hidden md:block text-right space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                    <p className="text-lg text-zinc-100 font-serif italic">
                        The Engineering <br /> Monograph.
                    </p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                        Designed by <a href="https://www.linkedin.com/in/shivam-pandey-a1b2a6143/" target="_blank" rel="noopener noreferrer" className="hover:text-white underline decoration-zinc-700 underline-offset-2 transition-colors">Shivam Pandey</a>
                    </p>
                </div>

            </div>
        </section>
    );
}
