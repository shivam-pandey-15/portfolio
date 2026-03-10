"use client";

import { ArrowRight, ArrowLeft, Search, Brain, Network, Gauge, Shuffle, AlertTriangle, DollarSign, Scissors, Database, BarChart3, Cpu, Layers } from "lucide-react";
import Link from "next/link";

export default function VectorSearchPage() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 6</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Vector &amp; Semantic Search</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Beyond keywords. This chapter covers how embedding models transform queries and documents into
                    dense vectors, enabling <strong>meaning-based retrieval</strong> that understands synonyms, intent,
                    and conceptual similarity — and the infrastructure needed to do it at scale.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                    <Link href="/search/vector-search/limitations" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        Start Chapter <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <hr className="border-border" />

            {/* Quick Links */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">In This Chapter</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Link href="/search/vector-search/limitations" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Search className="w-5 h-5 text-red-500" />
                            <h3 className="font-semibold group-hover:text-primary">6.1 Why Keywords Aren&apos;t Enough</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Vocabulary mismatch, synonym blindness, and why BM25 fails on conceptual queries.</p>
                    </Link>

                    <Link href="/search/vector-search/embeddings" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Brain className="w-5 h-5 text-purple-500" />
                            <h3 className="font-semibold group-hover:text-primary">6.2 Embeddings 101</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">From Word2Vec to SBERT: how text becomes vectors and why dimensions matter.</p>
                    </Link>

                    <Link href="/search/vector-search/encoders" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Cpu className="w-5 h-5 text-blue-500" />
                            <h3 className="font-semibold group-hover:text-primary">6.3 Bi-Encoder vs Cross-Encoder</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Speed vs accuracy in neural ranking — and why the best systems use both.</p>
                    </Link>

                    <Link href="/search/vector-search/indexing" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Layers className="w-5 h-5 text-amber-500" />
                            <h3 className="font-semibold group-hover:text-primary">6.4 Vector Indexing Basics</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">IVF, Product Quantization, and how to search billions of vectors efficiently.</p>
                    </Link>

                    <Link href="/search/vector-search/hnsw" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Network className="w-5 h-5 text-violet-500" />
                            <h3 className="font-semibold group-hover:text-primary">6.5 HNSW Deep Dive</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">The dominant ANN algorithm: navigable small world graphs, construction, and tuning.</p>
                    </Link>

                    <Link href="/search/vector-search/tradeoffs" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Gauge className="w-5 h-5 text-orange-500" />
                            <h3 className="font-semibold group-hover:text-primary">6.6 Latency vs Recall</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Tuning ef_search, nprobe, and the diminishing returns of chasing perfect recall.</p>
                    </Link>

                    <Link href="/search/vector-search/hybrid-ranking" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Shuffle className="w-5 h-5 text-emerald-500" />
                            <h3 className="font-semibold group-hover:text-primary">6.7 Hybrid Ranking</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Combining BM25 + vectors with RRF and linear fusion for robust retrieval.</p>
                    </Link>

                    <Link href="/search/vector-search/failures" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <h3 className="font-semibold group-hover:text-primary">6.8 Failure Modes</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">When semantic search fails silently: exact match, negation, domain mismatch.</p>
                    </Link>

                    <Link href="/search/vector-search/cost" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <DollarSign className="w-5 h-5 text-green-500" />
                            <h3 className="font-semibold group-hover:text-primary">6.9 Cost at Scale</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Memory math, quantization savings, and TCO for billion-vector deployments.</p>
                    </Link>

                    <Link href="/search/vector-search/chunking" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Scissors className="w-5 h-5 text-pink-500" />
                            <h3 className="font-semibold group-hover:text-primary">6.10 Chunking Strategies</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">How document splitting impacts retrieval quality more than model choice.</p>
                    </Link>

                    <Link href="/search/vector-search/databases" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Database className="w-5 h-5 text-cyan-500" />
                            <h3 className="font-semibold group-hover:text-primary">6.11 Vector Databases</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Pinecone vs Qdrant vs pgvector: architecture, tradeoffs, and when to use each.</p>
                    </Link>

                    <Link href="/search/vector-search/evaluation" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <BarChart3 className="w-5 h-5 text-indigo-500" />
                            <h3 className="font-semibold group-hover:text-primary">6.12 Evaluating Quality</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">MRR, nDCG, Recall@K — measuring search quality and building evaluation datasets.</p>
                    </Link>
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/retrieval" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 5. Retrieval
                </Link>
                <Link href="/search/embedding-training" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    Next: Training Embeddings <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
