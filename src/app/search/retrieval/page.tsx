"use client";

import { ArrowRight, ArrowLeft, Target, Filter, FileText, Zap, Layers, Network, Split } from "lucide-react";
import Link from "next/link";

export default function RetrievalPage() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 5</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Retrieval</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    The wide net. Retrieval is the stage where we select the best few thousand candidates from billions of documents.
                    It prioritizes <strong>Recall</strong> (finding everything relevant) over Precision (ranking it perfectly).
                    This chapter covers Inverted Indices, WAND, and Vector Search.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                    <Link href="/search/retrieval/recall-vs-precision" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        Start Chapter <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <hr className="border-border" />

            {/* Quick Links */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">In This Chapter</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* 5.1 */}
                    <Link href="/search/retrieval/recall-vs-precision" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Target className="w-5 h-5 text-red-500" />
                            <h3 className="font-semibold group-hover:text-primary">5.1 Recall vs. Precision</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Why the "Unrecoverable Error" dictates retrieval architecture.</p>
                    </Link>

                    {/* Placeholders for future chapters */}
                    <div className="group border border-border rounded-xl p-6 opacity-60">
                        <div className="flex items-center gap-3 mb-3">
                            <Filter className="w-5 h-5 text-zinc-500" />
                            <h3 className="font-semibold">5.2 Boolean Retrieval</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">AND, OR, NOT and bitset operations.</p>
                    </div>

                    <div className="group border border-border rounded-xl p-6 opacity-60">
                        <div className="flex items-center gap-3 mb-3">
                            <FileText className="w-5 h-5 text-blue-500" />
                            <h3 className="font-semibold">5.3 TF-IDF & BM25</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">The math of keyword relevance counting.</p>
                    </div>

                    <div className="group border border-border rounded-xl p-6 opacity-60">
                        <div className="flex items-center gap-3 mb-3">
                            <Zap className="w-5 h-5 text-amber-500" />
                            <h3 className="font-semibold">5.6 WAND Algorithm</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">How to assume 10k results without scoring 1B docs.</p>
                    </div>

                    <div className="group border border-border rounded-xl p-6 opacity-60">
                        <div className="flex items-center gap-3 mb-3">
                            <Network className="w-5 h-5 text-violet-500" />
                            <h3 className="font-semibold">5.8 HNSW (Vector)</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Approximate Nearest Neighbor search in high dimensions.</p>
                    </div>

                    <div className="group border border-border rounded-xl p-6 opacity-60">
                        <div className="flex items-center gap-3 mb-3">
                            <Split className="w-5 h-5 text-emerald-500" />
                            <h3 className="font-semibold">5.9 Hybrid Retrieval</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Merging Keyword and Vector scores (RRF vs Linear).</p>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/indexing" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 3. Indexing
                </Link>
                <Link href="/search/ranking" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    Next Chapter: Ranking <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
