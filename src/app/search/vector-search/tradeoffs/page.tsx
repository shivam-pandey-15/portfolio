"use client";

import Link from "next/link";
import {
    Scale, ArrowRight, ArrowLeft, Zap, AlertTriangle,
    Gauge, TrendingUp, Target, HardDrive, Clock,
    BarChart3, Activity
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "The Fundamental Tradeoff", description: "Better accuracy (higher recall) costs more time and memory. This isn't a limitation — it's a mathematical property of ANN search. The art is finding the operating point that balances your application's requirements." },
    { title: "HNSW Dominates Speed-Recall Frontier", description: "At every recall level, HNSW achieves the best QPS. At recall=0.98, HNSW delivers ~1200 QPS vs IVF-Flat's ~400 QPS — 3x faster. But IVF-PQ uses 17x less memory, which matters at billion scale." },
    { title: "Diminishing Returns Above 95% Recall", description: "ef_search 32→128 (4x increase) improves recall 0.92→0.98 (6% gain). ef_search 256→512 (2x increase) improves recall 0.995→0.999 (0.4% gain). Most of the easy recall is cheap; the last few percent are exponentially expensive." },
    { title: "Two-Phase Search Is the Production Standard", description: "Retrieve top k×oversample using compressed index (PQ), then re-score those candidates with full-precision vectors from SSD. Result: PQ-level memory with 98%+ recall@10. SSD cost: 100 × 3KB = 300KB ≈ 0.5ms on NVMe." },
    { title: "P99 Matters More Than P50", description: "At 1000 QPS, P99=100ms means 10 queries per second are painfully slow. HNSW has tight P50-P99 spread; IVF can have long tails when queries fall near cluster boundaries." },
];

export default function TradeoffsPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.6</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Latency vs Recall Tradeoffs</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            Every vector search system faces the same fundamental tradeoff: better accuracy costs more
                            time and memory. This chapter quantifies these relationships with concrete benchmarks and
                            provides a decision framework for choosing your operating point.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm"><Gauge className="w-4 h-4" /> HNSW at 98% Recall</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">1,200 QPS</p>
                        <p className="text-sm text-zinc-600">ef_search=128, 1M vectors, 768-dim. 3x faster than IVF-Flat at same recall.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><HardDrive className="w-4 h-4" /> IVF-PQ Memory</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">17x less</p>
                        <p className="text-sm text-zinc-600">200 MB vs 3.5 GB for HNSW (1M vectors). The deciding factor at billion scale.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-amber-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-amber-700 font-medium text-sm"><Target className="w-4 h-4" /> Two-Phase Recall</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">98%+</p>
                        <p className="text-sm text-zinc-600">PQ retrieval + full-precision rescore. PQ memory with near-exact accuracy.</p>
                    </div>
                </div>
            </div>

            {/* 1. Metrics */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. Defining the Metrics</h2>
                <p className="text-foreground leading-relaxed">
                    Before evaluating search algorithms, you need a rigorous way to measure success. A semantic search 
                    system is not a binary &quot;working&quot; or &quot;broken&quot; state; it exists on a spectrum of 
                    accuracy, speed, and cost. Engineering a production search system requires defining a Service Level 
                    Agreement (SLA) around these exact metrics.
                </p>

                <p className="text-foreground leading-relaxed">
                    Recall@K measures the quality of your retrieval. QPS measures your system&apos;s throughput capacity 
                    (which directly translates to infrastructure cost). Latency (P50 and P99) measures the user experience, 
                    and Memory measures the physical RAM required to hold your index. 
                </p>
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">recall_at_k.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">recall_at_k</span><span className="text-zinc-300">(approx_results, exact_results, k):</span></div>
                            <div className="pl-4"><span className="text-zinc-500">&quot;&quot;&quot;</span></div>
                            <div className="pl-4"><span className="text-zinc-500">Exact brute-force returns [A, B, C, D, E, F, G, H, I, J]</span></div>
                            <div className="pl-4"><span className="text-zinc-500">ANN returns              [A, B, C, D, E, F, G, X, Y, Z]</span></div>
                            <div className="pl-4"><span className="text-zinc-500">recall@10 = 7/10 = 0.7 (missed H, I, J)</span></div>
                            <div className="pl-4"><span className="text-zinc-500">&quot;&quot;&quot;</span></div>
                            <div className="pl-4"><span className="text-zinc-300">approx_set = </span><span className="text-yellow-300">set</span><span className="text-zinc-300">(approx_results[:k])</span></div>
                            <div className="pl-4"><span className="text-zinc-300">exact_set = </span><span className="text-yellow-300">set</span><span className="text-zinc-300">(exact_results[:k])</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> </span><span className="text-yellow-300">len</span><span className="text-zinc-300">(approx_set &amp; exact_set) / k</span></div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Metric</th>
                                <th className="text-left p-3 border-b font-semibold">Measures</th>
                                <th className="text-left p-3 border-b font-semibold">Target</th>
                                <th className="text-left p-3 border-b font-semibold">Why It Matters</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-medium">Recall@10</td><td className="p-3">Accuracy of top-10</td><td className="p-3">&gt;0.95</td><td className="p-3">Result quality</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">QPS</td><td className="p-3">Throughput</td><td className="p-3">App-dependent</td><td className="p-3">Revenue capacity</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">P50 Latency</td><td className="p-3">Median query time</td><td className="p-3">&lt;10ms</td><td className="p-3">User experience</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">P99 Latency</td><td className="p-3">Worst-case 1%</td><td className="p-3">&lt;50ms</td><td className="p-3">SLA compliance</td></tr>
                            <tr><td className="p-3 font-medium">Memory/vec</td><td className="p-3">Index efficiency</td><td className="p-3">Budget-dependent</td><td className="p-3">Infrastructure cost</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-red-800 mb-2">Why P99 Matters More Than P50</div>
                    <p className="text-red-700">
                        At 1000 QPS, P99=100ms means <strong>10 queries per second are painfully slow</strong>. HNSW&apos;s
                        latency distribution is tight (small P50-P99 spread). IVF can have long tails when queries fall
                        near cluster boundaries and require probing many cells.
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. Benchmark */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Algorithm Benchmark (1M Vectors, 768-dim)</h2>
                <p className="text-foreground leading-relaxed">
                    To make the tradeoff concrete, consider a dataset of 1 million 768-dimensional vectors (a standard 
                    size for many enterprise applications). The table below compares the performance of exact search 
                    (Flat) against the two most popular Approximate Nearest Neighbor algorithms: Inverted File Index (IVF) 
                    and Hierarchical Navigable Small World (HNSW).
                </p>

                <p className="text-foreground leading-relaxed">
                    Notice how HNSW achieves the highest combination of Recall and QPS, making it the default choice 
                    for low-latency applications. However, look at the memory column: HNSW requires roughly the same RAM 
                    as exact search, while IVF paired with Product Quantization (IVF-PQ) fits the same 1 million vectors 
                    into just 200MB, trading a small amount of recall for a massive reduction in infrastructure cost.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Algorithm</th>
                                <th className="text-left p-3 border-b font-semibold">Recall@10</th>
                                <th className="text-left p-3 border-b font-semibold">QPS</th>
                                <th className="text-left p-3 border-b font-semibold">P50</th>
                                <th className="text-left p-3 border-b font-semibold">Memory</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-medium">Flat (exact)</td><td className="p-3 text-green-700">1.000</td><td className="p-3">~50</td><td className="p-3">~20ms</td><td className="p-3">3 GB</td></tr>
                            <tr className="border-b"><td className="p-3">IVF-Flat (nprobe=10)</td><td className="p-3">0.92</td><td className="p-3">~2,000</td><td className="p-3">~0.5ms</td><td className="p-3">3 GB</td></tr>
                            <tr className="border-b"><td className="p-3">IVF-Flat (nprobe=64)</td><td className="p-3">0.98</td><td className="p-3">~400</td><td className="p-3">~2.5ms</td><td className="p-3">3 GB</td></tr>
                            <tr className="border-b"><td className="p-3">IVF-PQ (nprobe=32)</td><td className="p-3">0.85</td><td className="p-3">~5,000</td><td className="p-3">~0.2ms</td><td className="p-3 text-green-700">200 MB</td></tr>
                            <tr className="border-b"><td className="p-3">HNSW (ef=32)</td><td className="p-3">0.92</td><td className="p-3">~3,500</td><td className="p-3">~0.3ms</td><td className="p-3">3.5 GB</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">HNSW (ef=128)</td><td className="p-3 font-medium">0.98</td><td className="p-3 font-medium">~1,200</td><td className="p-3">~0.8ms</td><td className="p-3">3.5 GB</td></tr>
                            <tr className="border-b"><td className="p-3">HNSW (ef=256)</td><td className="p-3">0.995</td><td className="p-3">~500</td><td className="p-3">~2ms</td><td className="p-3">3.5 GB</td></tr>
                            <tr><td className="p-3">HNSW (ef=512)</td><td className="p-3 text-green-700">0.999</td><td className="p-3">~200</td><td className="p-3">~5ms</td><td className="p-3">3.5 GB</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 3. ef_search tuning */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Tuning ef_search (HNSW)</h2>
                <p className="text-foreground leading-relaxed">
                    If you choose HNSW as your algorithm, your primary runtime parameter is <code>ef_search</code> (the size 
                    of the dynamic candidate list during search). This single integer controls exactly where your system 
                    sits on the Latency vs Recall curve.
                </p>

                <p className="text-foreground leading-relaxed">
                    A small <code>ef_search</code> value makes the algorithm greedy, returning results instantly but often 
                    getting stuck in local minima (low recall). As you increase <code>ef_search</code>, the algorithm 
                    explores a wider breadth of the graph, finding better matches at the cost of computing more distance 
                    comparisons. 
                </p>
                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># ef_search sweep: recall vs latency</div>
                    <div className="space-y-1">
                        <div>ef_search =  16:  Recall@10 ≈ <span className="text-red-400">0.85</span>  Latency ≈ 0.15ms  <span className="text-zinc-500">(fast but misses a lot)</span></div>
                        <div>ef_search =  32:  Recall@10 ≈ <span className="text-yellow-400">0.92</span>  Latency ≈ 0.3ms   <span className="text-zinc-500">(acceptable for many apps)</span></div>
                        <div>ef_search =  64:  Recall@10 ≈ <span className="text-yellow-400">0.96</span>  Latency ≈ 0.5ms   <span className="text-zinc-500">(good for production)</span></div>
                        <div>ef_search = 128:  Recall@10 ≈ <span className="text-green-400">0.98</span>  Latency ≈ 1ms     <span className="text-zinc-500">(high quality)</span></div>
                        <div>ef_search = 256:  Recall@10 ≈ <span className="text-green-400">0.995</span> Latency ≈ 2ms     <span className="text-zinc-500">(near-perfect)</span></div>
                        <div>ef_search = 512:  Recall@10 ≈ <span className="text-green-400">0.999</span> Latency ≈ 5ms     <span className="text-zinc-500">(virtually exact)</span></div>
                    </div>
                </div>
                <p className="text-foreground leading-relaxed">
                    <strong>Rule of thumb:</strong> Set ef_search ≥ K (results requested). For production, 4-10× K is a
                    good balance. For top-10 search, ef_search=64-128 is common. The curve has <strong>diminishing
                    returns</strong>: going from ef=32 to ef=128 (4x) improves recall by 6%, but ef=256 to ef=512 (2x)
                    improves by only 0.4%.
                </p>
            </section>

            <hr className="border-border" />

            {/* 4. nprobe tuning */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Tuning nprobe (IVF)</h2>
                <p className="text-foreground leading-relaxed">
                    If you choose an Inverted File (IVF) index to save memory, your primary runtime parameter is 
                    <code>nprobe</code>. IVF works by clustering your vectors into hundreds or thousands of "buckets" 
                    (Voronoi cells) during training.
                </p>

                <p className="text-foreground leading-relaxed">
                    At search time, a query vector is first compared to the centroids of all buckets. <code>nprobe</code> 
                    determines how many of the "closest" buckets are actually opened and searched. Setting <code>nprobe=1</code> 
                    is incredibly fast but highly inaccurate—if the true nearest neighbor happens to sit just across the 
                    boundary in an adjacent cell, the algorithm will never see it.
                </p>
                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># nprobe sweep: recall vs latency</div>
                    <div className="space-y-1">
                        <div>nprobe =   1:  Recall@10 ≈ <span className="text-red-400">0.45</span>  <span className="text-zinc-500">(useless — misses most neighbors)</span></div>
                        <div>nprobe =   4:  Recall@10 ≈ <span className="text-red-400">0.75</span>  <span className="text-zinc-500">(still too low for production)</span></div>
                        <div>nprobe =   8:  Recall@10 ≈ <span className="text-yellow-400">0.85</span>  <span className="text-zinc-500">(acceptable for best-effort)</span></div>
                        <div>nprobe =  32:  Recall@10 ≈ <span className="text-green-400">0.95</span>  <span className="text-zinc-500">(good production setting)</span></div>
                        <div>nprobe =  64:  Recall@10 ≈ <span className="text-green-400">0.97</span>  <span className="text-zinc-500">(high quality)</span></div>
                        <div>nprobe = 128:  Recall@10 ≈ <span className="text-green-400">0.99</span>  <span className="text-zinc-500">(near-perfect)</span></div>
                    </div>
                </div>
                <p className="text-foreground leading-relaxed">
                    <strong>Why nprobe=1 is terrible:</strong> Up to 50% of true nearest neighbors can lie in neighboring
                    Voronoi cells. The nprobe/nlist interaction matters: with nlist=1024, nprobe=32 searches 3.1% of clusters;
                    with nlist=65536, nprobe=32 searches only 0.05% — usually insufficient. Heuristic: nprobe should search
                    at least 1% of clusters.
                </p>
            </section>

            <hr className="border-border" />

            {/* 5. Memory vs Accuracy */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. Memory vs Accuracy: Quantization Levels</h2>
                <p className="text-foreground leading-relaxed">
                    Graph algorithms like HNSW solve the CPU bottleneck, but they do nothing to solve the memory bottleneck. 
                    A billion 768-dimensional float32 vectors require enormous amounts of RAM, making uncompressed storage 
                    prohibitively expensive for large-scale applications.
                </p>

                <p className="text-foreground leading-relaxed">
                    Quantization is the process of compressing these vectors by reducing precision. You can cast floats 
                    to smaller data types (float16 or int8) to halve or quarter your memory footprint, or you can use 
                    Product Quantization (PQ) to compress vectors into tiny byte arrays. Every layer of compression saves 
                    RAM and increases speed, but introduces mathematical noise that lowers maximum recall.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Method</th>
                                <th className="text-left p-3 border-b font-semibold">Bytes/vec (768d)</th>
                                <th className="text-left p-3 border-b font-semibold">Recall Loss</th>
                                <th className="text-left p-3 border-b font-semibold">Memory (1B vecs)</th>
                                <th className="text-left p-3 border-b font-semibold">Speed Impact</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-medium">float32</td><td className="p-3">3,072</td><td className="p-3">—</td><td className="p-3">3,000 GB</td><td className="p-3">Baseline</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">float16</td><td className="p-3">1,536</td><td className="p-3">&lt;0.5%</td><td className="p-3">1,500 GB</td><td className="p-3">1.5x faster</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">int8 (scalar)</td><td className="p-3">768</td><td className="p-3">2-5%</td><td className="p-3">750 GB</td><td className="p-3">3x faster</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">PQ (M=96)</td><td className="p-3 text-green-700">96</td><td className="p-3">5-15%</td><td className="p-3 text-green-700">96 GB</td><td className="p-3">8x faster</td></tr>
                            <tr><td className="p-3 font-medium">Binary quant</td><td className="p-3 text-green-700">96</td><td className="p-3 text-red-600">10-30%</td><td className="p-3 text-green-700">96 GB</td><td className="p-3">32x faster</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-blue-800 mb-2">Recall losses are additive</div>
                    <p className="text-blue-700">
                        If HNSW achieves 98% recall with float32, the same index with int8 might achieve 95%, and
                        with PQ it might be 88%. Planning must account for both quantization loss AND approximate
                        search loss.
                    </p>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800">Two-Phase Search: Oversample and Rescore</h3>
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">two_phase_search.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">two_phase_search</span><span className="text-zinc-300">(query, compressed_index, full_vectors, k=10, oversample=10):</span></div>
                            <div className="pl-4"><span className="text-zinc-500"># Phase 1: Fast search with PQ/int8 in RAM → top k×oversample</span></div>
                            <div className="pl-4"><span className="text-zinc-300">candidates = compressed_index.search(query, k=k * oversample)</span><span className="text-zinc-500">  # top 100</span></div>
                            <div className="pl-4"></div>
                            <div className="pl-4"><span className="text-zinc-500"># Phase 2: Load full-precision vectors from SSD, re-score</span></div>
                            <div className="pl-4"><span className="text-zinc-300">rescored = []</span></div>
                            <div className="pl-4"><span className="text-pink-400">for</span><span className="text-zinc-300"> doc_id </span><span className="text-pink-400">in</span><span className="text-zinc-300"> candidates:</span></div>
                            <div className="pl-8"><span className="text-zinc-300">full_vec = full_vectors.load(doc_id)</span><span className="text-zinc-500">  # From SSD: ~0.1ms per vec</span></div>
                            <div className="pl-8"><span className="text-zinc-300">exact_score = cosine_similarity(query, full_vec)</span></div>
                            <div className="pl-8"><span className="text-zinc-300">rescored.append((exact_score, doc_id))</span></div>
                            <div className="pl-4"></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> </span><span className="text-yellow-300">sorted</span><span className="text-zinc-300">(rescored, reverse=</span><span className="text-orange-300">True</span><span className="text-zinc-300">)[:k]</span></div>
                            <div className="mt-1"><span className="text-zinc-500"># SSD cost: 100 vecs × 3KB = 300KB ≈ 0.5ms on NVMe</span></div>
                            <div><span className="text-zinc-500"># Result: PQ-level memory with 98%+ recall@10</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 6. Decision Framework */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">6. Decision Framework</h2>
                <p className="text-foreground leading-relaxed">
                    Given the myriad combinations of algorithms (HNSW, IVF), quantization methods (int8, PQ), and 
                    architectures (Two-Phase Search), choosing the right stack can feel paralyzing. The table below 
                    provides a practical, heuristic-based framework for selecting an architecture based on your specific 
                    use case, dataset scale, and latency requirements.
                </p>

                <p className="text-foreground leading-relaxed">
                    The general rule is: use Flat search until latency hurts, use HNSW until RAM gets too expensive, 
                    and then switch to IVF-PQ or Two-Phase search for massive scale.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Application</th>
                                <th className="text-left p-3 border-b font-semibold">Scale</th>
                                <th className="text-left p-3 border-b font-semibold">Recall Target</th>
                                <th className="text-left p-3 border-b font-semibold">Latency</th>
                                <th className="text-left p-3 border-b font-semibold">Recommended</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">Product search</td><td className="p-3">1M-50M</td><td className="p-3">&gt;0.95</td><td className="p-3">&lt;20ms</td><td className="p-3">HNSW (ef=128)</td></tr>
                            <tr className="border-b"><td className="p-3">Document search</td><td className="p-3">100K-10M</td><td className="p-3">&gt;0.90</td><td className="p-3">&lt;50ms</td><td className="p-3">HNSW (ef=64)</td></tr>
                            <tr className="border-b"><td className="p-3">RAG / LLM retrieval</td><td className="p-3">10K-1M</td><td className="p-3">&gt;0.98</td><td className="p-3">&lt;100ms</td><td className="p-3">HNSW (ef=256) or flat</td></tr>
                            <tr className="border-b"><td className="p-3">Image similarity</td><td className="p-3">10M-1B</td><td className="p-3">&gt;0.90</td><td className="p-3">&lt;10ms</td><td className="p-3">IVF-PQ + rescore</td></tr>
                            <tr className="border-b"><td className="p-3">Recommendations</td><td className="p-3">100M-10B</td><td className="p-3">&gt;0.85</td><td className="p-3">&lt;20ms</td><td className="p-3">IVF-PQ, sharded</td></tr>
                            <tr><td className="p-3">Duplicate detection</td><td className="p-3">1M-100M</td><td className="p-3">&gt;0.99</td><td className="p-3">&lt;1sec</td><td className="p-3">Flat on batches</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-green-800 mb-2">Don&apos;t Over-Engineer Small Data</div>
                    <p className="text-green-700">
                        Below 100K vectors, flat (exact) search takes &lt;10ms. Adding an ANN index introduces
                        complexity without meaningful benefit. Even at 100K × 768 dims, exact brute-force leaves well
                        within acceptable latency bounds.
                    </p>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/hnsw" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.5 HNSW Deep Dive
                </Link>
                <Link href="/search/vector-search/hybrid-ranking" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.7 Hybrid Ranking Pipelines <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
