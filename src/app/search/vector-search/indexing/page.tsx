"use client";

import Link from "next/link";
import {
    Database, ArrowRight, ArrowLeft, Zap, AlertTriangle,
    Layers, Binary, Target, TrendingUp, Gauge,
    HardDrive, Settings, Grid3X3, PackageSearch
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Brute Force Is Exact but Unscalable", description: "O(N×d) per query: fine for <100K vectors, borderline at 100K, and completely unusable above 1M. At 1B vectors with 768 dims, a single query takes ~768 seconds." },
    { title: "IVF: Partition → Search Subsets", description: "K-means splits the vector space into Voronoi cells. At query time, only search nprobe cells out of nlist total → ~100x speedup. The boundary problem (nearest neighbor in adjacent cell) is mitigated by increasing nprobe." },
    { title: "PQ: 32x Compression via Subspace Quantization", description: "Split 768-dim vector into 96 sub-vectors of 8 dims each. Learn 256 centroids per sub-space. Replace each sub-vector with a 1-byte centroid ID. Result: 3072 bytes → 96 bytes." },
    { title: "ADC Is Always Preferred over SDC", description: "Asymmetric distance computation keeps the query at full float32 precision and only quantizes database vectors. The accuracy gain over SDC (both quantized) is significant and the per-query table computation is negligible." },
    { title: "IVF-PQ: The Billion-Scale Default", description: "Combine IVF cluster pruning + PQ compression. Key: PQ is applied to residual vectors (vector - centroid), not originals. Residuals are smaller and more uniform → PQ works better. FAISS makes this production-ready." },
];

export default function IndexingPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.4</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Vector Indexing Basics</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            Brute-force search is O(N×d) per query — impossibly slow at scale. This chapter covers the
                            fundamental indexing strategies: IVF (Inverted File), PQ (Product Quantization), and IVF-PQ —
                            including Voronoi boundaries, ADC vs SDC distance computation, and FAISS configuration.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-red-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-red-700 font-medium text-sm"><Gauge className="w-4 h-4" /> Brute Force at 1B</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">~13 min</p>
                        <p className="text-sm text-zinc-600">768B distance operations at 1B ops/sec per query. Completely unusable.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm"><Zap className="w-4 h-4" /> IVF Speedup</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">~100x</p>
                        <p className="text-sm text-zinc-600">Search 10 of 1024 clusters = skip 99% of data with ~1% recall loss.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><HardDrive className="w-4 h-4" /> PQ Compression</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">32x</p>
                        <p className="text-sm text-zinc-600">768-dim float32 (3072 B) → 96-byte PQ code. 1B vectors: 3 TB → 96 GB.</p>
                    </div>
                </div>
            </div>

            {/* 1. Brute Force */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. The Brute-Force Baseline</h2>
                <p className="text-foreground leading-relaxed">
                    The simplest approach: compare the query against <strong>every vector</strong> in the database. This
                    gives exact results but costs O(N × d) per query. At scale, this quickly becomes impractical.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">brute_force.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">brute_force_search</span><span className="text-zinc-300">(query_vec, all_vectors, k=10):</span></div>
                            <div className="pl-4"><span className="text-zinc-500">&quot;&quot;&quot;Compare query against EVERY vector. O(N × d) per query.&quot;&quot;&quot;</span></div>
                            <div className="pl-4"><span className="text-zinc-300">distances = []</span></div>
                            <div className="pl-4"><span className="text-pink-400">for</span><span className="text-zinc-300"> i, vec </span><span className="text-pink-400">in</span><span className="text-zinc-300"> </span><span className="text-yellow-300">enumerate</span><span className="text-zinc-300">(all_vectors):</span></div>
                            <div className="pl-8"><span className="text-zinc-300">dist = cosine_distance(query_vec, vec)</span></div>
                            <div className="pl-8"><span className="text-zinc-300">distances.append((dist, i))</span></div>
                            <div className="pl-4"><span className="text-zinc-300">distances.sort()</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> distances[:k]</span></div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">N (docs)</th>
                                <th className="text-left p-3 border-b font-semibold">d (dims)</th>
                                <th className="text-left p-3 border-b font-semibold">Distance ops</th>
                                <th className="text-left p-3 border-b font-semibold">Time</th>
                                <th className="text-left p-3 border-b font-semibold">Verdict</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">10K</td><td className="p-3">768</td><td className="p-3">7.68M</td><td className="p-3">~8ms</td><td className="p-3 text-green-700 font-medium">✅ Fine</td></tr>
                            <tr className="border-b"><td className="p-3">100K</td><td className="p-3">768</td><td className="p-3">76.8M</td><td className="p-3">~77ms</td><td className="p-3 text-amber-700 font-medium">⚠️ Borderline</td></tr>
                            <tr className="border-b"><td className="p-3">1M</td><td className="p-3">768</td><td className="p-3">768M</td><td className="p-3">~768ms</td><td className="p-3 text-red-700 font-medium">❌ Too slow</td></tr>
                            <tr className="border-b"><td className="p-3">100M</td><td className="p-3">768</td><td className="p-3">76.8B</td><td className="p-3">~77s</td><td className="p-3 text-red-700 font-medium">❌ Unusable</td></tr>
                            <tr><td className="p-3">1B</td><td className="p-3">768</td><td className="p-3">768B</td><td className="p-3">~768s</td><td className="p-3 text-red-700 font-medium">❌ Absurd</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-blue-800 mb-2">Three Strategies to Beat Brute Force</div>
                    <p className="text-blue-700">
                        <strong>1. Partition the space</strong> → only search relevant regions (IVF).{" "}
                        <strong>2. Compress the vectors</strong> → smaller, faster distance computation (PQ).{" "}
                        <strong>3. Build a graph</strong> → navigate to neighbors efficiently (HNSW, Chapter 6.5).
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. IVF */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. IVF (Inverted File Index)</h2>
                <p className="text-foreground leading-relaxed">
                    Partition the vector space into <strong>clusters</strong> (Voronoi cells) using k-means. Each cluster
                    defines a Voronoi cell: the region of space closer to this centroid than any other. Every vector belongs
                    to exactly one cell. At query time, only search the closest <code>nprobe</code> clusters out of
                    <code>nlist</code> total.
                </p>

                <div className="bg-zinc-900 p-8 rounded-xl font-mono text-sm border border-zinc-800">
                    <div className="text-zinc-400 mb-6"># Voronoi cells in 2D (conceptual)</div>
                    <div className="relative w-full aspect-video max-h-64 border border-zinc-700 rounded-lg overflow-hidden bg-zinc-950/50">
                        {/* Boundaries simulated with SVGs/CSS lines */}
                        <div className="absolute inset-0">
                            <svg className="w-full h-full stroke-zinc-700/80 pointer-events-none" strokeWidth="2" strokeDasharray="6 6">
                                <line x1="0" y1="65%" x2="35%" y2="65%" />
                                <line x1="35%" y1="65%" x2="55%" y2="40%" />
                                <line x1="55%" y1="40%" x2="55%" y2="0%" />
                                <line x1="55%" y1="40%" x2="100%" y2="60%" />
                            </svg>
                        </div>
                        
                        {/* Centroids */}
                        <div className="absolute top-[20%] left-[25%] flex flex-col items-center">
                            <Target className="w-5 h-5 text-blue-400" />
                            <span className="text-blue-300 text-[10px] font-bold mt-1 bg-zinc-950/80 px-1 rounded">C1</span>
                        </div>
                        <div className="absolute top-[30%] right-[20%] flex flex-col items-center">
                            <Target className="w-5 h-5 text-green-400" />
                            <span className="text-green-300 text-[10px] font-bold mt-1 bg-zinc-950/80 px-1 rounded">C2</span>
                        </div>
                        <div className="absolute bottom-[20%] left-[20%] flex flex-col items-center">
                            <Target className="w-5 h-5 text-yellow-400" />
                            <span className="text-yellow-300 text-[10px] font-bold mt-1 bg-zinc-950/80 px-1 rounded">C3</span>
                        </div>
                        <div className="absolute bottom-[20%] right-[25%] flex flex-col items-center">
                            <Target className="w-5 h-5 text-pink-400" />
                            <span className="text-pink-300 text-[10px] font-bold mt-1 bg-zinc-950/80 px-1 rounded">C4</span>
                        </div>

                        {/* Scattered Points */}
                        {/* C1 Points */}
                        <div className="absolute top-[10%] left-[30%] w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                        <div className="absolute top-[25%] left-[15%] w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                        <div className="absolute top-[15%] left-[40%] w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                        <div className="absolute top-[35%] left-[35%] w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>

                        {/* C2 Points */}
                        <div className="absolute top-[20%] right-[30%] w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                        <div className="absolute top-[40%] right-[15%] w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                        <div className="absolute top-[25%] right-[10%] w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                        <div className="absolute top-[15%] right-[25%] w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>

                        {/* C3 Points */}
                        <div className="absolute bottom-[25%] left-[10%] w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                        <div className="absolute bottom-[10%] left-[25%] w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                        <div className="absolute bottom-[15%] left-[15%] w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                        <div className="absolute bottom-[30%] left-[30%] w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>

                        {/* C4 Points */}
                        <div className="absolute bottom-[30%] right-[15%] w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                        <div className="absolute bottom-[10%] right-[30%] w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                        <div className="absolute bottom-[15%] right-[10%] w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                        <div className="absolute bottom-[35%] right-[35%] w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                    </div>
                </div>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">ivf_search.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">ivf_search</span><span className="text-zinc-300">(query_vec, centroids, inverted_lists, n_probe=10, k=10):</span></div>
                            <div className="pl-4"><span className="text-zinc-500">&quot;&quot;&quot;Speedup ≈ nlist / nprobe (e.g., 1024/10 = 100x)&quot;&quot;&quot;</span></div>
                            <div className="pl-4"><span className="text-zinc-500"># Find nearest centroids (fast: compare query to nlist centroids)</span></div>
                            <div className="pl-4"><span className="text-zinc-300">nearest = find_k_nearest(query_vec, centroids, k=n_probe)</span></div>
                            <div className="pl-4"></div>
                            <div className="pl-4"><span className="text-zinc-500"># Search only in selected clusters (skip 99% of data)</span></div>
                            <div className="pl-4"><span className="text-zinc-300">candidates = []</span></div>
                            <div className="pl-4"><span className="text-pink-400">for</span><span className="text-zinc-300"> cluster_id </span><span className="text-pink-400">in</span><span className="text-zinc-300"> nearest:</span></div>
                            <div className="pl-8"><span className="text-pink-400">for</span><span className="text-zinc-300"> doc_id, vec </span><span className="text-pink-400">in</span><span className="text-zinc-300"> inverted_lists[cluster_id]:</span></div>
                            <div className="pl-12"><span className="text-zinc-300">dist = cosine_distance(query_vec, vec)</span></div>
                            <div className="pl-12"><span className="text-zinc-300">candidates.append((dist, doc_id))</span></div>
                            <div className="pl-4"><span className="text-zinc-300">candidates.sort()</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> candidates[:k]</span></div>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800">The Boundary Problem</h3>
                <p className="text-foreground leading-relaxed">
                    The fundamental weakness of IVF: a query near a cluster <strong>boundary</strong> may have true nearest
                    neighbors in an adjacent cell that isn&apos;t probed. With nprobe=1, you search only the nearest cluster
                    and miss neighbors just across the boundary. Mitigation: higher nprobe (diminishing returns above ~5%
                    of clusters), multi-probe hashing, or over-clustering (more clusters → smaller cells → fewer boundary issues).
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Dataset Size</th>
                                <th className="text-left p-3 border-b font-semibold">Recommended nlist</th>
                                <th className="text-left p-3 border-b font-semibold">Rationale</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">&lt;1M</td><td className="p-3">4 × √N (≈ 4K)</td><td className="p-3">Rule of thumb for small datasets</td></tr>
                            <tr className="border-b"><td className="p-3">1M - 10M</td><td className="p-3">16 × √N (≈ 16K-50K)</td><td className="p-3">Finer partitioning</td></tr>
                            <tr className="border-b"><td className="p-3">10M - 1B</td><td className="p-3">65,536 - 262,144</td><td className="p-3">Typical production values</td></tr>
                            <tr><td className="p-3">&gt;1B</td><td className="p-3">1M+</td><td className="p-3">Very fine partitioning</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 3. PQ */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. PQ (Product Quantization)</h2>
                <p className="text-foreground leading-relaxed">
                    Compress vectors by splitting them into <strong>sub-vectors</strong> and quantizing each independently.
                    A 768-dim vector (3072 bytes) is split into 96 sub-vectors of 8 dims each. For each 8-dim sub-space,
                    learn 256 centroids via k-means. Replace each sub-vector with its nearest centroid ID (1 byte). Result:
                    3072 bytes → 96 bytes = <strong>32x compression</strong>.
                </p>

                <div className="bg-zinc-900 p-6 rounded-xl font-mono text-[13px] border border-zinc-800">
                    <div className="text-zinc-400 mb-6 font-mono text-sm"># PQ Compression Pipeline</div>
                    <div className="grid gap-6">
                        {/* Step 1 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="bg-zinc-800 text-zinc-300 w-6 h-6 rounded-full flex items-center justify-center font-sans font-bold text-xs shrink-0">1</div>
                                <div className="text-zinc-300 font-sans font-medium">Original Float32 Vector <span className="text-zinc-500">(768 dims, 3072 bytes)</span></div>
                            </div>
                            
                            <div className="flex gap-2 w-full ml-9">
                                <div className="flex-1 bg-blue-950/30 border border-blue-900/50 rounded flex flex-col">
                                    <div className="text-blue-400 text-center py-2 px-1 text-xs truncate break-all">
                                        [0.21, -0.04, 0.67...]
                                    </div>
                                    <div className="bg-blue-900/40 text-blue-300 text-[10px] text-center py-1 mt-auto font-sans">
                                        Sub-vec 1 (8 dims)
                                    </div>
                                </div>
                                <div className="flex items-center justify-center text-zinc-600 px-2 lg:px-4">...</div>
                                <div className="flex-1 bg-green-950/30 border border-green-900/50 rounded flex flex-col">
                                    <div className="text-green-400 text-center py-2 px-1 text-xs truncate break-all">
                                        [0.15, 0.88, -0.32...]
                                    </div>
                                    <div className="bg-green-900/40 text-green-300 text-[10px] text-center py-1 mt-auto font-sans">
                                        Sub-vec 96 (8 dims)
                                    </div>
                                </div>
                            </div>
                            <div className="ml-9 text-xs text-zinc-500 italic mt-1 font-sans">Split into M=96 sub-vectors</div>
                        </div>

                        {/* Step 2 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="bg-zinc-800 text-zinc-300 w-6 h-6 rounded-full flex items-center justify-center font-sans font-bold text-xs shrink-0">2</div>
                                <div className="text-zinc-300 font-sans font-medium">Quantization <span className="text-zinc-500">(Match to nearest centroid)</span></div>
                            </div>
                            
                            <div className="flex gap-2 w-full ml-9 relative pt-2 pb-2">
                                <div className="flex-1 flex flex-col items-center gap-2">
                                    <div className="text-zinc-600 leading-none">↓</div>
                                    <div className="bg-zinc-800 border border-zinc-700 text-zinc-300 px-2 py-1.5 rounded text-xs w-full text-center shadow-lg truncate whitespace-nowrap overflow-hidden">
                                        ID: <span className="text-yellow-400">42</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center text-zinc-600 px-2 lg:px-4">...</div>
                                <div className="flex-1 flex flex-col items-center gap-2">
                                    <div className="text-zinc-600 leading-none">↓</div>
                                    <div className="bg-zinc-800 border border-zinc-700 text-zinc-300 px-2 py-1.5 rounded text-xs w-full text-center shadow-lg truncate whitespace-nowrap overflow-hidden">
                                        ID: <span className="text-yellow-400">199</span>
                                    </div>
                                </div>
                            </div>
                            <div className="ml-9 text-xs text-zinc-500 italic mt-1 font-sans">Learn 256 centroids/sub-space via k-means. Replace vec with 1-byte ID</div>
                        </div>

                        {/* Step 3 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="bg-zinc-800 text-zinc-300 w-6 h-6 rounded-full flex items-center justify-center font-sans font-bold text-xs shrink-0">3</div>
                                <div className="text-yellow-400 font-sans font-bold">Final PQ Code <span className="text-zinc-500 font-normal font-mono">(96 bytes total)</span></div>
                            </div>
                            <div className="ml-9 bg-yellow-950/20 border border-yellow-900/50 text-yellow-300 p-3 rounded-lg text-center shadow-md text-sm">
                                [42, 187, 5, 220, ..., 73, 18, 199]
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Scale</th>
                                <th className="text-left p-3 border-b font-semibold">float32</th>
                                <th className="text-left p-3 border-b font-semibold">PQ (M=96)</th>
                                <th className="text-left p-3 border-b font-semibold">Savings</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">1M vectors</td><td className="p-3">3 GB</td><td className="p-3">96 MB</td><td className="p-3 font-medium text-green-700">31x</td></tr>
                            <tr className="border-b"><td className="p-3">100M vectors</td><td className="p-3">300 GB</td><td className="p-3">9.6 GB</td><td className="p-3 font-medium text-green-700">31x</td></tr>
                            <tr><td className="p-3 font-medium">1B vectors</td><td className="p-3 text-red-700">3 TB</td><td className="p-3 text-green-700 font-medium">96 GB</td><td className="p-3 font-medium text-green-700">31x</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800">ADC vs SDC Distance Computation</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 border border-green-200 p-6 rounded-xl space-y-3">
                        <h4 className="font-bold text-lg text-green-800">ADC (Asymmetric) — Preferred</h4>
                        <p className="text-sm text-green-700 leading-relaxed">
                            Query stays <strong>uncompressed</strong>. Pre-compute distance from each query sub-vector to
                            all 256 centroids (M lookup tables). Then: per-vector distance = <strong>96 table lookups</strong>
                            instead of 768 multiplications. ~8x faster with higher accuracy.
                        </p>
                        <p className="text-xs text-green-600 font-mono">Per-query pre-comp: O(M × 256 × d_sub) — negligible</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-xl space-y-3">
                        <h4 className="font-bold text-lg text-zinc-800">SDC (Symmetric) — Faster but Less Accurate</h4>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            Both query AND database vectors are quantized. Distances come from pre-calculated
                            centroid-to-centroid tables (built once at index time). Faster for streaming but loses accuracy
                            because the query is also compressed.
                        </p>
                        <p className="text-xs text-zinc-600 font-mono">Pre-comp: M × 256 × 256 distances — one-time</p>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800">OPQ: Optimized Product Quantization</h3>
                <p className="text-foreground leading-relaxed">
                    Standard PQ splits vectors into contiguous blocks, but correlations between dimensions may span block
                    boundaries. <strong>OPQ</strong> learns an optimal <strong>rotation</strong> of the vector space before
                    quantization, reducing cross-dimension correlations. Result: <strong>5-15% recall improvement</strong>
                    at the cost of ~2x longer training time.
                </p>
            </section>

            <hr className="border-border" />

            {/* 4. IVF-PQ */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. IVF-PQ: The Billion-Scale Combination</h2>
                <p className="text-foreground leading-relaxed">
                    Combine IVF&apos;s cluster pruning with PQ&apos;s compression. The key insight: PQ is applied to
                    <strong> residual vectors</strong> (vector - centroid), not the original vectors. Residuals are smaller
                    in magnitude and more uniformly distributed, so PQ works better on them.
                </p>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-xl">
                    <h3 className="font-bold text-blue-800 mb-4 text-lg">IVF-PQ Pipeline</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white border border-blue-200 p-4 rounded-lg">
                            <div className="font-bold text-blue-700 mb-2">Training Phase</div>
                            <div className="space-y-1 text-sm text-blue-600">
                                <p>1. k-means → nlist centroids (Voronoi partition)</p>
                                <p>2. Compute residual = vector - nearest_centroid</p>
                                <p>3. Train PQ codebooks on <strong>residuals</strong></p>
                                <p>4. Store PQ-encoded residuals in inverted lists</p>
                            </div>
                        </div>
                        <div className="bg-white border border-blue-200 p-4 rounded-lg">
                            <div className="font-bold text-blue-700 mb-2">Query Phase</div>
                            <div className="space-y-1 text-sm text-blue-600">
                                <p>1. Find nearest centroids (nprobe)</p>
                                <p>2. Compute query_residual = query - centroid</p>
                                <p>3. ADC search within cluster using residual PQ codes</p>
                                <p>4. Return top-k across all probed clusters</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">faiss_ivfpq.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">import</span><span className="text-zinc-300"> faiss</span></div>
                            <div className="mt-1"><span className="text-zinc-300">nlist = </span><span className="text-orange-300">4096</span><span className="text-zinc-500">    # Number of Voronoi cells</span></div>
                            <div><span className="text-zinc-300">M = </span><span className="text-orange-300">96</span><span className="text-zinc-500">          # Number of sub-vectors for PQ</span></div>
                            <div><span className="text-zinc-300">nbits = </span><span className="text-orange-300">8</span><span className="text-zinc-500">       # Bits per sub-vector (256 centroids per sub-space)</span></div>
                            <div><span className="text-zinc-300">d = </span><span className="text-orange-300">768</span><span className="text-zinc-500">         # Vector dimension</span></div>
                            <div className="mt-1"><span className="text-zinc-500"># Create quantizer + IVF-PQ index</span></div>
                            <div><span className="text-zinc-300">quantizer = faiss.IndexFlatL2(d)</span></div>
                            <div><span className="text-zinc-300">index = faiss.IndexIVFPQ(quantizer, d, nlist, M, nbits)</span></div>
                            <div className="mt-1"><span className="text-zinc-300">index.train(training_vectors)</span><span className="text-zinc-500">  # Learns centroids + PQ codebooks</span></div>
                            <div><span className="text-zinc-300">index.add(all_vectors)</span><span className="text-zinc-500">         # Assigns + PQ-encodes residuals</span></div>
                            <div className="mt-1"><span className="text-zinc-300">index.nprobe = </span><span className="text-orange-300">64</span><span className="text-zinc-500">  # Search 64 of 4096 clusters</span></div>
                            <div><span className="text-zinc-300">distances, indices = index.search(query_vectors, k=</span><span className="text-orange-300">10</span><span className="text-zinc-300">)</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. Index Decision Matrix */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. FAISS Index Decision Matrix</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Index</th>
                                <th className="text-left p-3 border-b font-semibold">Memory/Vec (768d)</th>
                                <th className="text-left p-3 border-b font-semibold">Recall@10</th>
                                <th className="text-left p-3 border-b font-semibold">Best For</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-medium">Flat</td><td className="p-3">3,072 B</td><td className="p-3 text-green-700">100%</td><td className="p-3">Ground truth, &lt;100K vecs</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">IVF-Flat</td><td className="p-3">3,072 B</td><td className="p-3">95-99%</td><td className="p-3">Medium datasets, high accuracy</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">IVF-PQ</td><td className="p-3 text-green-700">~96 B</td><td className="p-3">85-95%</td><td className="p-3">Billion-scale, memory-constrained</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">IVF-PQ+refine</td><td className="p-3">~96 B + disk</td><td className="p-3">95-98%</td><td className="p-3">Best accuracy/memory tradeoff</td></tr>
                            <tr><td className="p-3 font-medium">HNSW (Ch 6.5)</td><td className="p-3">~3,500 B</td><td className="p-3 text-green-700">98-99%</td><td className="p-3">High recall, RAM available</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">practical_config.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-zinc-500"># Small (&lt;100K): Flat — don&apos;t overthink it</span></div>
                            <div><span className="text-zinc-300">index = faiss.IndexFlatL2(</span><span className="text-orange-300">768</span><span className="text-zinc-300">)</span></div>
                            <div className="mt-2"><span className="text-zinc-500"># Medium (100K-10M): IVF-Flat for accuracy</span></div>
                            <div><span className="text-zinc-300">index = faiss.IndexIVFFlat(quantizer, </span><span className="text-orange-300">768</span><span className="text-zinc-300">, n_clusters)</span></div>
                            <div className="mt-2"><span className="text-zinc-500"># Large (10M-1B): IVF-PQ for memory efficiency</span></div>
                            <div><span className="text-zinc-300">index = faiss.IndexIVFPQ(quantizer, </span><span className="text-orange-300">768</span><span className="text-zinc-300">, </span><span className="text-orange-300">65536</span><span className="text-zinc-300">, </span><span className="text-orange-300">96</span><span className="text-zinc-300">, </span><span className="text-orange-300">8</span><span className="text-zinc-300">)</span></div>
                            <div className="mt-2"><span className="text-zinc-500"># Billion-scale: IVF-PQ with OPQ preprocessing</span></div>
                            <div><span className="text-zinc-300">index = faiss.index_factory(</span><span className="text-orange-300">768</span><span className="text-zinc-300">, </span><span className="text-green-300">&quot;OPQ96_768,IVF262144,PQ96&quot;</span><span className="text-zinc-300">)</span></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/encoders" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.3 Bi-Encoder vs Cross-Encoder
                </Link>
                <Link href="/search/vector-search/hnsw" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.5 HNSW Deep Dive <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
