"use client";

import Link from "next/link";
import { Gauge, ArrowRight, ArrowLeft, Timer, Target, TrendingDown, Activity } from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Diminishing Returns Are Logarithmic", description: "Going from 90% to 95% recall doubles ef_search. Going from 95% to 99% doubles it again. Going from 99% to 99.9% doubles it yet again. Each percentage point costs exponentially more latency." },
    { title: "P99 Matters More Than P50", description: "The tail latency (worst 1%) is where user frustration lives. A system with P50=2ms but P99=200ms feels unreliable. Always measure and optimize for P99, not average latency." },
    { title: "Two-Phase Search Breaks the Tradeoff", description: "Search a compressed index (fast, low recall) → exact re-score top candidates (accurate). Gets ~97% recall at compressed-index latency. The standard production pattern." },
    { title: "Application Requirements Dictate the Target", description: "E-commerce: Recall@50 > 90%, P99 < 50ms. Legal: Recall@100 > 99%, latency secondary. Autocomplete: P99 < 20ms, recall secondary. Don't optimize for metrics your application doesn't need." },
];

export default function TradeoffsPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.6</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Latency vs Recall Tradeoffs</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            Every ANN parameter knob trades speed for accuracy. Understanding the shape of this tradeoff — and
                            where the diminishing returns kick in — is essential for tuning vector search in production.
                        </p>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-orange-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-orange-700 font-medium text-sm"><Timer className="w-4 h-4" /> Sweet Spot</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">ef=128</p>
                        <p className="text-sm text-zinc-600">Typical production setting: ~96% recall at &lt;2ms latency.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><Target className="w-4 h-4" /> Diminishing Point</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">ef=256</p>
                        <p className="text-sm text-zinc-600">Beyond this, each 1% recall costs disproportionately more latency.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-red-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-red-700 font-medium text-sm"><Activity className="w-4 h-4" /> P99 vs P50</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">5-10x</p>
                        <p className="text-sm text-zinc-600">P99 latency is typically 5-10x higher than median. Optimize for tail.</p>
                    </div>
                </div>
            </div>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. The Shape of the Tradeoff</h2>
                <p className="text-foreground leading-relaxed">
                    The relationship between ef_search and recall follows a logarithmic curve: initial increases yield large
                    recall gains, but each additional increment buys progressively less. At ef_search=32, you might get 88%
                    recall. At 64, about 94%. At 128, about 96.5%. At 256, about 98%. At 512, about 99%. That last 1% from
                    98% to 99% costs as much latency as the first 10% from 88% to 98%.
                </p>
                <p className="text-foreground leading-relaxed">
                    This curve shape has a profound practical implication: <strong>there&apos;s always a natural sweet
                    spot</strong> where the recall-per-millisecond ratio peaks. For most HNSW deployments on 10M-100M
                    vectors, this sweet spot is around ef_search=64-128. Going beyond ef_search=256 is almost never
                    justified — if you need &gt;99% recall, two-phase search or exact re-scoring is more cost-effective.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. P99 Latency: The Real Metric</h2>
                <p className="text-foreground leading-relaxed">
                    Average or median latency is misleading for search systems. If your P50 is 2ms but your P99
                    is 200ms, one in a hundred queries takes 100x longer. Users notice — and they notice the slow queries
                    disproportionately. P99 spikes are caused by graph topology outliers (queries that land in poorly-connected
                    regions), GC pauses, and cache misses when accessing distant nodes in the HNSW graph.
                </p>
                <p className="text-foreground leading-relaxed">
                    Production teams should set latency SLOs on P99, not P50. A reasonable target is P99 &lt; 50ms for most
                    applications. Monitor P99 by query type — some query categories consistently hit graph topology
                    pathologies and may need different ef_search values or separate indexes.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Two-Phase Search</h2>
                <p className="text-foreground leading-relaxed">
                    The most effective way to break the latency-recall tradeoff is <strong>two-phase search</strong>:
                    search a compressed index (PQ or scalar quantized) to find roughly the right candidates, then
                    load full-precision vectors for only those candidates and compute exact distances.
                </p>
                <p className="text-foreground leading-relaxed">
                    Phase 1 retrieves the top 100 candidates from a PQ-compressed index (~0.3ms). Phase 2 loads 100
                    full-precision vectors from SSD (~10ms) and re-ranks by exact similarity. Result: ~97% recall at the
                    memory cost of PQ (~96 GB for 1B vectors) instead of full HNSW (~3 TB). This is the standard pattern
                    for cost-effective billion-scale deployments.
                </p>
            </section>

            <KeyTakeaways takeaways={takeaways} />

            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/hnsw" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.5 HNSW Deep Dive
                </Link>
                <Link href="/search/vector-search/hybrid-ranking" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.7 Hybrid Ranking <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
