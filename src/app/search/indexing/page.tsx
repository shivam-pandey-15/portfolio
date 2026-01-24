"use client";

import { ArrowRight, ArrowLeft, Database, Search, Binary, Network, Box, Server, Shuffle } from "lucide-react";
import Link from "next/link";

export default function IndexingPage() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 3</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Indexing & Infrastructure</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    The heart of the search engine. This chapter demystifies the black box, explaining how inverted indices, BKD trees, and vector graphs actually work on disk.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                    <Link href="/search/indexing/definition" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        Start Chapter <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <hr className="border-border" />

            {/* Quick Links */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">In This Chapter</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Link href="/search/indexing/definition" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Database className="w-5 h-5 text-zinc-500" />
                            <h3 className="font-semibold group-hover:text-primary">3.1 What is an Index?</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Why we can't just `SELECT * WHERE text LIKE '%query%'`.</p>
                    </Link>

                    <Link href="/search/indexing/inverted-index" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Search className="w-5 h-5 text-blue-500" />
                            <h3 className="font-semibold group-hover:text-primary">3.2 The Inverted Index</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">The data structure that makes full-text search O(1).</p>
                    </Link>

                    <Link href="/search/indexing/bkd-docvalues" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Binary className="w-5 h-5 text-green-500" />
                            <h3 className="font-semibold group-hover:text-primary">3.3 BKD Trees & DocValues</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Handling numbers, dates, and sorting efficiently.</p>
                    </Link>

                    <Link href="/search/indexing/vectors" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Network className="w-5 h-5 text-purple-500" />
                            <h3 className="font-semibold group-hover:text-primary">3.4 Vector Indices (HNSW)</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Navigating high-dimensional space for semantic search.</p>
                    </Link>

                    <Link href="/search/indexing/segments" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Box className="w-5 h-5 text-amber-500" />
                            <h3 className="font-semibold group-hover:text-primary">3.5 Segments & Immutability</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Why search engines are append-only and how merging works.</p>
                    </Link>

                    <Link href="/search/indexing/sharding" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Server className="w-5 h-5 text-red-500" />
                            <h3 className="font-semibold group-hover:text-primary">3.6 Sharding Architecture</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Distributed storage: Shards, Replicas, and Routing.</p>
                    </Link>

                    <Link href="/search/indexing/paths" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Shuffle className="w-5 h-5 text-zinc-500" />
                            <h3 className="font-semibold group-hover:text-primary">3.7 Write Path vs Query Path</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">The lifecycle of a document vs the lifecycle of a request.</p>
                    </Link>
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/query-understanding" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 2. Query Understanding
                </Link>
                <Link href="/search/data" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    Next Chapter: Data Foundation <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
