"use client";

import { ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950"></div>
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">

                    {/* Badge */}
                    <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm font-medium text-zinc-300 backdrop-blur-xl">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                        System v1.0 Online
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 tracking-tight">
                        Deconstruct <br className="hidden md:block" />
                        the Machine.
                    </h1>

                    {/* Subtext */}
                    <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl leading-relaxed">
                        An interactive exploration of large-scale engineering.
                        From the first byte of ingestion to the final millisecond of ranking.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
                        <Link
                            href="/search"
                            className="inline-flex h-12 items-center justify-center rounded-lg bg-white text-zinc-950 px-8 text-sm font-medium transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300"
                        >
                            Start Exploring <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                        <a
                            href="https://github.com/shivam-pandey-15"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 px-8 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-800"
                        >
                            <Terminal className="mr-2 h-4 w-4" /> View Source
                        </a>
                    </div>
                </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[100px] -z-20 rounded-full mix-blend-screen pointer-events-none" />
        </section>
    );
}
