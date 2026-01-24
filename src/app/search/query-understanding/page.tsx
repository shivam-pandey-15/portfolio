"use client";

import { ArrowRight, ArrowLeft, Mic2, FileInput, BrainCircuit, Wand2, Split, SearchX, GitBranch } from "lucide-react";
import Link from "next/link";

export default function QueryUnderstandingPage() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 2</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Understanding the User Query</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    The user's query is rarely what they actually want. It's a low-resolution signal of a high-fidelity intent.
                    To build great search, we must decode, expand, and rewrite this signal before it ever touches the index.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                    <Link href="/search/query-understanding/definition" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        Start Chapter <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <hr className="border-border" />

            {/* Quick Links */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">In This Chapter</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Link href="/search/query-understanding/definition" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Mic2 className="w-5 h-5 text-zinc-500" />
                            <h3 className="font-semibold group-hover:text-primary">2.1 What a Query Really Is</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Why keywords are just the tip of the iceberg.</p>
                    </Link>

                    <Link href="/search/query-understanding/types" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <FileInput className="w-5 h-5 text-blue-500" />
                            <h3 className="font-semibold group-hover:text-primary">2.2 Types of Queries</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Navigational vs Informational vs Transactional. Why it matters.</p>
                    </Link>

                    <Link href="/search/query-understanding/intent" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <BrainCircuit className="w-5 h-5 text-purple-500" />
                            <h3 className="font-semibold group-hover:text-primary">2.3 Intent vs Tokens</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Moving from string matching to semantic understanding.</p>
                    </Link>

                    <Link href="/search/query-understanding/power-laws" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <BarChart3 className="w-5 h-5 text-amber-500" />
                            <h3 className="font-semibold group-hover:text-primary">2.4 Power Laws</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Why 20% of unique queries drive 80% of volume (The Head vs The Tail).</p>
                    </Link>

                    <Link href="/search/query-understanding/pipeline" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <GitBranch className="w-5 h-5 text-zinc-500" />
                            <h3 className="font-semibold group-hover:text-primary">2.5 The Understanding Pipeline</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Architecture of a query processing system, steps by step.</p>
                    </Link>

                    <Link href="/search/query-understanding/rewriting" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Wand2 className="w-5 h-5 text-violet-500" />
                            <h3 className="font-semibold group-hover:text-primary">2.6 Rewriting & Expansion</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Synonyms, spell check, and adding related concepts.</p>
                    </Link>

                    <Link href="/search/query-understanding/ambiguity" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Split className="w-5 h-5 text-red-500" />
                            <h3 className="font-semibold group-hover:text-primary">2.7 Handling Ambiguity</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">What does "Java" mean? Coffee, Island, or Code?</p>
                    </Link>
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/business-product" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 1. Business & Product
                </Link>
                <Link href="/search/indexing" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    Next Chapter: Indexing & Infra <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}

// Importing lucide icon that wasn't imported in the top list to fix implicit error if I missed one.
// Actually I see BarChart3 used but not imported in top list. Adding it now.
import { BarChart3 } from "lucide-react";
