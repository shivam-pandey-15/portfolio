"use client";

import Link from "next/link";
import { Shuffle, ArrowRight, ArrowLeft, Zap, Scale, GitMerge, Search } from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Neither Approach Is Sufficient Alone", description: "BM25 excels at exact matches (SKUs, case numbers). Vectors excel at conceptual queries ('affordable smartphones'). Every query type that trips up one system is handled well by the other." },
    { title: "RRF Is the Default Fusion", description: "Reciprocal Rank Fusion operates on ranks, not scores — no normalization needed. k=60 works across almost all domains without tuning. It's the recommended starting point for any hybrid system." },
    { title: "Linear Combination Requires Normalization", description: "Weighted score fusion (alpha × vector + (1-alpha) × BM25) preserves score magnitude but requires careful min-max or z-score normalization. Can outperform RRF with labeled tuning data." },
    { title: "Query Routing Beats Static Weights", description: "Dynamically adjusting fusion strategy per query type (exact IDs → BM25 only, conceptual → high vector weight) significantly outperforms a single static alpha value." },
];

export default function HybridRankingPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.7</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Hybrid Ranking Pipelines</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            Combining keyword precision with semantic understanding. Hybrid search fuses BM25 and vector
                            results using RRF or linear combination — ensuring robust retrieval for every query type.
                        </p>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-emerald-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-emerald-700 font-medium text-sm"><GitMerge className="w-4 h-4" /> RRF Constant</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">k=60</p>
                        <p className="text-sm text-zinc-600">The universal smoothing constant from Cormack et al. (2009).</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><Scale className="w-4 h-4" /> Typical Alpha</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">0.6-0.7</p>
                        <p className="text-sm text-zinc-600">Common sweet spot: slightly favoring semantic over keyword.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-orange-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-orange-700 font-medium text-sm"><Zap className="w-4 h-4" /> Fusion Overhead</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">&lt;1ms</p>
                        <p className="text-sm text-zinc-600">RRF/linear fusion adds negligible latency to parallel retrieval.</p>
                    </div>
                </div>
            </div>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. Why Hybrid?</h2>
                <p className="text-foreground leading-relaxed">
                    A search for &quot;iPhone 15 Pro Max 256GB Blue&quot; needs exact keyword matching — the embedding model
                    compresses all iPhone 15 Pro Max variants into nearly identical vectors. Meanwhile, &quot;how to fix my car
                    not starting&quot; needs semantic understanding — the best documents mention &quot;dead battery,&quot;
                    &quot;starter motor,&quot; and &quot;alternator&quot; without using the query&apos;s exact words.
                </p>
                <p className="text-foreground leading-relaxed">
                    Hybrid search runs BM25 and vector retrieval in parallel, fuses their results, and optionally reranks with
                    a cross-encoder. The parallel architecture means total latency is max(BM25, vector) + fusion, not the sum.
                    Both typically complete in 5-15ms, so hybrid is almost as fast as either alone.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. RRF: Reciprocal Rank Fusion</h2>
                <p className="text-foreground leading-relaxed">
                    RRF is the most widely used fusion strategy because it&apos;s elegant and virtually parameter-free. For each
                    document, its RRF score is the sum of <code>1/(k + rank)</code> across all retrievers. Documents ranked highly
                    by both BM25 and vector search get boosted — documents ranked highly by only one get moderate scores.
                </p>
                <p className="text-foreground leading-relaxed">
                    The key advantage: RRF operates on <strong>ranks</strong>, not scores. BM25 scores range from 0 to ~25;
                    cosine similarity from 0 to 1. These are incomparable scales. RRF sidesteps the normalization problem
                    entirely by only using rank positions. The constant k=60 from the original Cormack et al. (2009) paper
                    works well enough that most production systems never tune it.
                </p>

                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># RRF worked example</div>
                    <div className="space-y-2">
                        <div><span className="text-green-400">BM25 returns:</span>  [Doc_A (rank 1), Doc_B (rank 2), Doc_C (rank 3)]</div>
                        <div><span className="text-blue-400">Vector returns:</span> [Doc_C (rank 1), Doc_D (rank 2), Doc_A (rank 3)]</div>
                        <div className="text-zinc-500 mt-3">RRF scores (k=60):</div>
                        <div>Doc_A: 1/(60+1) + 1/(60+3) = <span className="text-yellow-400">0.0323</span> (in both!)</div>
                        <div>Doc_C: 1/(60+3) + 1/(60+1) = <span className="text-yellow-400">0.0323</span> (in both!)</div>
                        <div>Doc_B: 1/(60+2)             = <span className="text-zinc-400">0.0161</span> (BM25 only)</div>
                        <div>Doc_D: 1/(60+2)             = <span className="text-zinc-400">0.0161</span> (vector only)</div>
                        <div className="text-zinc-500 mt-2">→ Docs in both result sets get boosted to the top</div>
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Linear Combination &amp; Alpha Tuning</h2>
                <p className="text-foreground leading-relaxed">
                    The alternative is a weighted sum: <code>score = α × normalize(vector) + (1-α) × normalize(BM25)</code>.
                    This preserves score magnitude information that RRF discards, but requires careful normalization (min-max or
                    z-score). The alpha parameter needs tuning per domain — exact-match-heavy domains like e-commerce favor
                    lower alpha (more BM25); conceptual domains like knowledge bases favor higher alpha (more semantic).
                </p>
                <p className="text-foreground leading-relaxed">
                    Start with alpha=0.5 and sweep from 0.0 to 1.0 in 0.1 increments against an evaluation dataset
                    of 50-100 queries with known relevant documents. Measure nDCG@10 at each alpha value.
                    The optimal alpha typically falls between 0.6-0.7 for most applications.
                </p>
            </section>

            <KeyTakeaways takeaways={takeaways} />

            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/tradeoffs" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.6 Latency vs Recall
                </Link>
                <Link href="/search/vector-search/failures" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.8 Failure Modes <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
