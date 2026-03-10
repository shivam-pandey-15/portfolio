"use client";

import Link from "next/link";
import { Network, ArrowRight, ArrowLeft, Layers, Zap, Settings, GitBranch } from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Multi-Layer Skip List for Vectors", description: "HNSW builds a hierarchy of graphs. Upper layers have few nodes with long-range connections for fast navigation; lower layers have all nodes with short-range connections for precise search. This is the 'skip list' analogy that makes HNSW intuitive." },
    { title: "M and ef_construction Control Build Quality", description: "M (connections per node, default 16) determines graph connectivity. ef_construction (candidate pool during insertion, default 200) determines how carefully each node is placed. Higher values = better graph quality, slower build time." },
    { title: "ef_search Controls the Speed-Recall Tradeoff", description: "The single most important runtime parameter. ef_search=64 gives ~95% recall in <1ms. ef_search=256 gives ~99% recall in ~3ms. The relationship is logarithmic — diminishing returns past ef_search=200." },
    { title: "Lucene's Per-Segment Architecture Has Implications", description: "Elasticsearch/Lucene builds a separate HNSW graph per segment. Segment merges rebuild graphs from scratch — causing CPU spikes, memory pressure, and temporary recall drops during heavy indexing." },
];

export default function HnswPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.5</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">HNSW Deep Dive</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            The dominant algorithm for approximate nearest neighbor search. HNSW builds a navigable
                            small-world graph that enables sub-millisecond vector search at million-to-billion scale.
                        </p>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-violet-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-violet-700 font-medium text-sm"><Layers className="w-4 h-4" /> Graph Layers</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">~log₂(N)</p>
                        <p className="text-sm text-zinc-600">Layers in the hierarchy. 1B vectors ≈ 30 layers, 1M ≈ 20.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><Zap className="w-4 h-4" /> Query Latency</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">&lt;1ms</p>
                        <p className="text-sm text-zinc-600">Typical search time for 10M vectors with ef_search=64.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm"><GitBranch className="w-4 h-4" /> Recall@10</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">98%+</p>
                        <p className="text-sm text-zinc-600">At default settings on well-constructed graphs.</p>
                    </div>
                </div>
            </div>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. The Skip List Analogy</h2>
                <p className="text-foreground leading-relaxed">
                    HNSW (Hierarchical Navigable Small World) is best understood as a <strong>skip list for vector
                    space</strong>. In a traditional skip list, upper levels have fewer nodes with long-range express
                    links that let you jump across the data quickly, while the bottom level contains all nodes with
                    short-range links for precise positioning. HNSW applies the same idea to proximity graphs.
                </p>
                <p className="text-foreground leading-relaxed">
                    At the top layer, a handful of widely-scattered vectors are connected with long-range edges. Search
                    begins here, jumping between these &quot;landmark&quot; nodes to quickly navigate to the right region
                    of the vector space. As you descend through layers, more nodes appear with shorter-range connections,
                    progressively refining the search until the bottom layer — which contains all vectors — delivers the
                    precise nearest neighbors.
                </p>

                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># HNSW multi-layer structure</div>
                    <div className="space-y-2">
                        <div><span className="text-purple-400">Layer 3:</span> [A]————————————[F]  (2 nodes, long jumps)</div>
                        <div><span className="text-blue-400">Layer 2:</span> [A]——[C]————[F]——[H]  (4 nodes)</div>
                        <div><span className="text-green-400">Layer 1:</span> [A]—[B]—[C]—[D]—[F]—[G]—[H]  (7 nodes)</div>
                        <div><span className="text-yellow-400">Layer 0:</span> [A]-[B]-[C]-[D]-[E]-[F]-[G]-[H]-[I]-[J]  (all nodes)</div>
                        <div className="text-zinc-500 mt-3">Search: Start at Layer 3 → greedy walk down to Layer 0</div>
                        <div className="text-zinc-500">Each layer refines the search with more neighbors to explore</div>
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Construction Parameters</h2>
                <p className="text-foreground leading-relaxed">
                    Two parameters control how the HNSW graph is built: <strong>M</strong> (maximum connections per node)
                    and <strong>ef_construction</strong> (size of the candidate pool during insertion). M=16 is the default
                    — each node connects to up to 16 neighbors. Higher M means more connections, better recall, but more
                    memory (~128 bytes per node at M=16) and slower construction.
                </p>
                <p className="text-foreground leading-relaxed">
                    <strong>ef_construction</strong> determines how thoroughly the algorithm searches for the best neighbors
                    when inserting a new node. Think of it as the &quot;effort during graph building.&quot; ef_construction=200
                    (default) means evaluating 200 candidate neighbors for each insertion. Higher values produce higher-quality
                    graphs but increase build time linearly. A common production pattern is ef_construction=400-500 for
                    critical indexes where you can afford slower builds for better search quality.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. The ef_search Knob</h2>
                <p className="text-foreground leading-relaxed">
                    <strong>ef_search</strong> is the single most important runtime parameter. It controls the size of the
                    dynamic candidate list during search — essentially how many nodes the algorithm considers before declaring
                    &quot;I&apos;ve found the best neighbors.&quot; The relationship between ef_search and recall is logarithmic:
                    doubling ef_search from 32 to 64 might improve recall from 90% to 95%, but doubling again from 64 to 128
                    only improves from 95% to 97.5%.
                </p>
                <p className="text-foreground leading-relaxed">
                    For most production systems, ef_search=64-128 provides the sweet spot of &gt;95% recall at sub-millisecond
                    latency. Going beyond ef_search=256 offers diminishing returns — the last 1-2% of recall costs
                    disproportionate latency. If you need &gt;99% recall, consider exact re-scoring of HNSW candidates
                    rather than pushing ef_search higher.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Lucene Segment Merge Challenge</h2>
                <p className="text-foreground leading-relaxed">
                    Elasticsearch and other Lucene-based systems build a separate HNSW graph per segment. When segments
                    merge (which Lucene does automatically to consolidate small segments), the HNSW graphs must be rebuilt
                    from scratch for the merged segment. This creates CPU spikes, temporary memory pressure, and can
                    cause brief drops in search quality during the rebuild.
                </p>
                <p className="text-foreground leading-relaxed">
                    Mitigations include: force-merging during off-peak hours, increasing the merge policy&apos;s floor
                    segment size to reduce merge frequency, and using max_merge_at_once to limit the scope of each merge.
                    Some teams schedule periodic force-merges as part of their operational runbook.
                </p>
            </section>

            <KeyTakeaways takeaways={takeaways} />

            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/indexing" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.4 Vector Indexing Basics
                </Link>
                <Link href="/search/vector-search/tradeoffs" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.6 Latency vs Recall <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
