"use client";

import Link from "next/link";
import {
    Network, ArrowRight, ArrowLeft, Zap, AlertTriangle,
    Layers, Target, TrendingUp, Gauge, HardDrive,
    Settings, Clock, MemoryStick, Cpu, Activity
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Skip List Analogy", description: "HNSW layers work like a skip list: Layer 3 has express highways (few nodes), Layer 0 has local streets (all nodes). Search starts at the top for coarse navigation and zooms in at the bottom for precision." },
    { title: "O(log N) Search Complexity", description: "Each layer roughly halves the search space. Greedy search descends from the top, then beam search at Layer 0 with ef_search width. 1B vectors needs only ~30 layers, each with O(1) average hops." },
    { title: "Three Key Parameters", description: "M (max connections, default 16): affects recall and memory. ef_construction (build beam width, default 200): affects graph quality. ef_search (query beam width): the primary accuracy/speed knob at query time." },
    { title: "Memory Formula: 32 GB for 10M Vectors", description: "Total = N × (d × 4 + M × 2 × 4) bytes. 10M × 768-dim × M=16 = 30.7 GB vectors + 1.28 GB graph = ~32 GB. At 1B: ~3.2 TB. This is why DiskANN exists." },
    { title: "Lucene Segment Merges Are the Operational Challenge", description: "Lucene maintains per-segment HNSW graphs. When segments merge, the graph is rebuilt from scratch — O(N log N). Memory spikes during merge can hit 2.5 GB. Use larger initial segments and TieredMergePolicy." },
];

export default function HnswPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.5</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">HNSW Deep Dive</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            Hierarchical Navigable Small World is the dominant graph-based ANN algorithm. It achieves
                            O(log N) search by building a multi-layer graph where upper layers are express highways
                            and lower layers are local streets. Used in Lucene/ES, Qdrant, Weaviate, and pgvector.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm"><Zap className="w-4 h-4" /> Search Latency</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">&lt;1ms</p>
                        <p className="text-sm text-zinc-600">Sub-millisecond latency for millions of vectors with 98-99% recall@10.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><Layers className="w-4 h-4" /> Layer Distribution</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">~63%</p>
                        <p className="text-sm text-zinc-600">Of nodes only exist at Layer 0. ~1% reach Layer 4+. Geometric distribution.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-purple-700 font-medium text-sm"><Clock className="w-4 h-4" /> Build Time (100M)</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">~1.5 hrs</p>
                        <p className="text-sm text-zinc-600">100M vectors, M=16, ef_construction=200 on 48-core Xeon.</p>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                        <strong>Prerequisite:</strong> This chapter builds on Chapter 6.4 (Vector Indexing Basics). Understand
                        why brute force fails and how IVF/PQ work before diving into graph-based approaches.
                    </div>
                </div>
            </div>

            {/* 1. Skip List Inspiration */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. From NSW to HNSW: The Skip List Insight</h2>
                <p className="text-foreground leading-relaxed">
                    Before HNSW, <strong>Navigable Small World (NSW)</strong> graphs built a flat graph where each node
                    connects to its approximate nearest neighbors. Search works by greedy traversal: start from any node,
                    always move to the neighbor closest to the query. The &quot;small world&quot; property ensures short
                    paths exist between any two nodes — but search complexity is O(N^(1/2)), not logarithmic.
                </p>
                <p className="text-foreground leading-relaxed">
                    HNSW&apos;s breakthrough was layering the graph like a <strong>probability skip list</strong>: Layer 0
                    contains all nodes with dense local connections. Higher layers contain exponentially fewer nodes with
                    longer-range connections. Search starts at the top for coarse navigation and descends to the bottom
                    for precision — achieving O(log N) search complexity.
                </p>

                <div className="bg-zinc-900 p-8 rounded-xl font-mono text-sm border border-zinc-800 overflow-x-auto">
                    <div className="text-zinc-400 mb-6"># HNSW multi-layer structure (skip list analogy)</div>
                    <div className="flex flex-col gap-6 min-w-[600px]">
                        {/* Layer 3 */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 text-zinc-500">Layer 3:</div>
                            <div className="flex-1 relative flex justify-between px-2">
                                <div className="absolute top-1/2 -translate-y-1/2 left-6 right-[70%] h-px bg-blue-900/50"></div>
                                {['A', '', '', 'D', '', '', '', '', '', ''].map((n, i) => (
                                    <div key={i} className="w-8 h-8 flex justify-center z-10">
                                        {n && <div className="w-8 h-8 rounded bg-blue-950/50 text-blue-400 border border-blue-900/50 flex flex-col items-center justify-center">{n}</div>}
                                    </div>
                                ))}
                            </div>
                            <div className="w-32 text-zinc-500 text-xs text-right italic">(express highway)</div>
                        </div>
                        {/* Layer 2 */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 text-zinc-500">Layer 2:</div>
                            <div className="flex-1 relative flex justify-between px-2">
                                <div className="absolute top-1/2 -translate-y-1/2 left-6 right-[48%] h-px bg-green-900/50"></div>
                                {['A', '', 'C', 'D', '', 'F', '', '', '', ''].map((n, i) => (
                                    <div key={i} className="w-8 h-8 flex justify-center z-10">
                                        {n && <div className="w-8 h-8 rounded bg-green-950/50 text-green-400 border border-green-900/50 flex flex-col items-center justify-center">{n}</div>}
                                    </div>
                                ))}
                            </div>
                            <div className="w-32 text-zinc-500 text-xs text-right italic">(regional roads)</div>
                        </div>
                        {/* Layer 1 */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 text-zinc-500">Layer 1:</div>
                            <div className="flex-1 relative flex justify-between px-2">
                                <div className="absolute top-1/2 -translate-y-1/2 left-6 right-[26%] h-px bg-yellow-900/50"></div>
                                {['A', 'B', 'C', 'D', 'E', 'F', 'G', '', '', ''].map((n, i) => (
                                    <div key={i} className="w-8 h-8 flex justify-center z-10">
                                        {n && <div className="w-8 h-8 rounded bg-yellow-950/50 text-yellow-400 border border-yellow-900/50 flex flex-col items-center justify-center">{n}</div>}
                                    </div>
                                ))}
                            </div>
                            <div className="w-32 text-zinc-500 text-xs text-right italic">(local streets)</div>
                        </div>
                        {/* Layer 0 */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 text-zinc-500">Layer 0:</div>
                            <div className="flex-1 relative flex justify-between px-2">
                                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((n, i) => (
                                    <div key={i} className="w-8 h-8 flex justify-center z-10">
                                        {n && <div className="w-8 h-8 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 flex flex-col items-center justify-center shadow-sm">{n}</div>}
                                    </div>
                                ))}
                            </div>
                            <div className="w-32 text-zinc-500 text-xs text-right italic">(all nodes)</div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. Construction */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Construction Algorithm</h2>
                <p className="text-foreground leading-relaxed">
                    Each new vector is assigned a maximum layer using a <strong>geometric distribution</strong>:
                    floor(-ln(random()) × m_L) where m_L = 1/ln(M). Most nodes stay at Layer 0 (~63%), with exponentially
                    fewer reaching higher layers (~23% at Layer 1, ~9% at Layer 2, ~1% at Layer 4+).
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">hnsw_insert.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">insert</span><span className="text-zinc-300">(new_node, graph, M, ef_construction):</span></div>
                            <div className="pl-4"><span className="text-zinc-500"># 1. Assign random layer (geometric distribution)</span></div>
                            <div className="pl-4"><span className="text-zinc-300">new_layer = floor(-ln(random()) * m_L)</span></div>
                            <div className="pl-4"></div>
                            <div className="pl-4"><span className="text-zinc-500"># 2. Greedy search from top to new_layer+1 (ef=1)</span></div>
                            <div className="pl-4"><span className="text-zinc-300">current = graph.entry_point</span></div>
                            <div className="pl-4"><span className="text-pink-400">for</span><span className="text-zinc-300"> layer </span><span className="text-pink-400">in</span><span className="text-zinc-300"> </span><span className="text-yellow-300">range</span><span className="text-zinc-300">(graph.max_layer, new_layer + </span><span className="text-orange-300">1</span><span className="text-zinc-300">, -</span><span className="text-orange-300">1</span><span className="text-zinc-300">):</span></div>
                            <div className="pl-8"><span className="text-zinc-300">current = greedy_search(new_node, current, layer, ef=</span><span className="text-orange-300">1</span><span className="text-zinc-300">)</span></div>
                            <div className="pl-4"></div>
                            <div className="pl-4"><span className="text-zinc-500"># 3. For each layer from new_layer down to 0:</span></div>
                            <div className="pl-4"><span className="text-pink-400">for</span><span className="text-zinc-300"> layer </span><span className="text-pink-400">in</span><span className="text-zinc-300"> </span><span className="text-yellow-300">range</span><span className="text-zinc-300">(</span><span className="text-yellow-300">min</span><span className="text-zinc-300">(new_layer, graph.max_layer), -</span><span className="text-orange-300">1</span><span className="text-zinc-300">, -</span><span className="text-orange-300">1</span><span className="text-zinc-300">):</span></div>
                            <div className="pl-8"><span className="text-zinc-500"># Beam search with ef_construction width</span></div>
                            <div className="pl-8"><span className="text-zinc-300">candidates = beam_search(new_node, current, layer, ef=ef_construction)</span></div>
                            <div className="pl-8"><span className="text-zinc-500"># Select M diverse neighbors (heuristic)</span></div>
                            <div className="pl-8"><span className="text-zinc-300">neighbors = select_neighbors_heuristic(new_node, candidates, M)</span></div>
                            <div className="pl-8"><span className="text-zinc-500"># Add bidirectional edges + prune if needed</span></div>
                            <div className="pl-8"><span className="text-pink-400">for</span><span className="text-zinc-300"> neighbor </span><span className="text-pink-400">in</span><span className="text-zinc-300"> neighbors:</span></div>
                            <div className="pl-12"><span className="text-zinc-300">graph.add_edge(new_node, neighbor, layer)</span></div>
                            <div className="pl-12"><span className="text-zinc-300">graph.add_edge(neighbor, new_node, layer)</span></div>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800">Neighbor Selection Heuristic</h3>
                <p className="text-foreground leading-relaxed">
                    Simple nearest-neighbor selection creates <strong>clusters</strong> — nodes all connect to the same
                    popular neighbors. HNSW uses a <strong>diversity heuristic</strong>: a candidate is added only if
                    it&apos;s closer to the query than to any existing selected neighbor. This ensures neighbors aren&apos;t
                    all clustered in the same direction, promoting diverse paths through the graph.
                </p>
            </section>

            <hr className="border-border" />

            {/* 3. Search Algorithm */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Search Algorithm</h2>
                <p className="text-foreground leading-relaxed">
                    Search starts at the entry point and does a greedy search from the top layer down to Layer 1 (ef=1 —
                    just find the single nearest neighbor). At Layer 0, switch to beam search with ef_search width to
                    explore more candidates. Return the top K from the beam search results.
                </p>

                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># Search trace example: finding neighbors of vector Q</div>
                    <div className="space-y-3">
                        <div><span className="text-blue-400">Layer 3:</span> Entry point A (dist=0.8)</div>
                        <div className="pl-8">→ A&apos;s neighbor D (dist=0.4) ← <span className="text-green-400">closer! Move to D</span></div>
                        <div className="pl-8">→ No improvement... <span className="text-yellow-400">descend with D</span></div>
                        <div className="mt-1"><span className="text-green-400">Layer 2:</span> Start at D (dist=0.4)</div>
                        <div className="pl-8">→ D&apos;s neighbor C (dist=0.35) ← <span className="text-green-400">closer!</span></div>
                        <div className="pl-8">→ <span className="text-yellow-400">Descend with C</span></div>
                        <div className="mt-1"><span className="text-yellow-400">Layer 1:</span> Start at C (dist=0.35)</div>
                        <div className="pl-8">→ Beam search with ef=64</div>
                        <div className="pl-8">→ Found: C(0.35), E(0.12), G(0.08), H(0.15), ...</div>
                        <div className="mt-1"><span className="text-pink-400">Layer 0:</span> Start at G (dist=0.08)</div>
                        <div className="pl-8">→ Beam search with ef=200</div>
                        <div className="pl-8">→ <span className="text-green-400">Results: [I(0.05), J(0.06), G(0.08), K(0.09), ...]</span></div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Operation</th>
                                <th className="text-left p-3 border-b font-semibold">Complexity</th>
                                <th className="text-left p-3 border-b font-semibold">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-medium">Construction (per element)</td><td className="p-3">O(log N)</td><td className="p-3">Search + edge creation per layer</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Construction (total)</td><td className="p-3">O(N log N)</td><td className="p-3">Insert N elements</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Search</td><td className="p-3 text-green-700 font-medium">O(log N)</td><td className="p-3">Layers = log N, each O(1) avg hops</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Memory (vectors)</td><td className="p-3">O(N × d)</td><td className="p-3">Store all vectors</td></tr>
                            <tr><td className="p-3 font-medium">Memory (graph)</td><td className="p-3">O(N × M)</td><td className="p-3">M edges per node, ~4 bytes each</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 4. Key Parameters */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Key Parameters &amp; Tuning</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Parameter</th>
                                <th className="text-left p-3 border-b font-semibold">Range</th>
                                <th className="text-left p-3 border-b font-semibold">Effect</th>
                                <th className="text-left p-3 border-b font-semibold">Memory</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-medium font-mono">M</td><td className="p-3">8-64 (default 16)</td><td className="p-3">Max connections per node per layer</td><td className="p-3">+8 bytes/node per M increase</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium font-mono">ef_construction</td><td className="p-3">64-512 (default 200)</td><td className="p-3">Build-time beam width</td><td className="p-3">No memory impact</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium font-mono">ef_search</td><td className="p-3">32-512</td><td className="p-3 text-green-700 font-medium">Query-time beam width (primary knob)</td><td className="p-3">No memory impact</td></tr>
                            <tr><td className="p-3 font-medium font-mono">M_max</td><td className="p-3">2×M</td><td className="p-3">Max connections at Layer 0 (denser base)</td><td className="p-3">Affects Layer 0 density</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm">
                        <div className="font-bold text-green-800 mb-1">High Recall (&gt;99%)</div>
                        <p className="text-green-700 font-mono text-xs">M=32-48, ef_construction=400, ef_search=200-500</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
                        <div className="font-bold text-blue-800 mb-1">Balanced (95-98%)</div>
                        <p className="text-blue-700 font-mono text-xs">M=16, ef_construction=200, ef_search=64-128</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-sm">
                        <div className="font-bold text-amber-800 mb-1">Speed-Optimized (~90%)</div>
                        <p className="text-amber-700 font-mono text-xs">M=8-12, ef_construction=100, ef_search=32-64</p>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800">Memory Formula</h3>
                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># Memory calculation</div>
                    <div className="space-y-2">
                        <div>Total = N × (d × sizeof(float) + M × 2 × sizeof(int))</div>
                        <div className="mt-2"><span className="text-green-400">Example: 10M vectors, 768-dim, M=16</span></div>
                        <div className="pl-4">Vectors: 10M × 768 × 4 bytes = <span className="text-yellow-400">30.7 GB</span></div>
                        <div className="pl-4">Graph:   10M × 16 × 2 × 4 bytes = <span className="text-yellow-400">1.28 GB</span></div>
                        <div className="pl-4">Total:   <span className="text-green-400 font-bold">~32 GB</span></div>
                        <div className="mt-2"><span className="text-red-400">Example: 1B vectors, 768-dim, M=16</span></div>
                        <div className="pl-4">Vectors: 1B × 768 × 4 bytes = <span className="text-red-400 font-bold">3,072 GB (3 TB!)</span></div>
                        <div className="pl-4">Graph:   1B × 16 × 2 × 4 bytes = 128 GB</div>
                        <div className="pl-4">Total:   <span className="text-red-400 font-bold">~3.2 TB</span> ← Needs disk-backed approach</div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. HNSW vs DiskANN */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. HNSW vs DiskANN</h2>
                <p className="text-foreground leading-relaxed">
                    DiskANN (Microsoft, 2019) stores the Vamana graph on SSD instead of RAM, keeping only PQ codes in
                    memory. This trades latency (5-20ms vs &lt;1ms) for <strong>15-50x lower memory cost</strong> at
                    billion scale.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Aspect</th>
                                <th className="text-left p-3 border-b font-semibold">HNSW</th>
                                <th className="text-left p-3 border-b font-semibold">DiskANN</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-medium">Storage</td><td className="p-3">RAM (all layers)</td><td className="p-3">SSD (graph + vectors), RAM (PQ codes only)</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Memory/vector</td><td className="p-3">~4 KB (768d + graph)</td><td className="p-3 text-green-700">~200 bytes (PQ codes + metadata)</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Query latency</td><td className="p-3 text-green-700">&lt;1ms</td><td className="p-3">5-20ms (SSD I/O bound)</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Recall@10</td><td className="p-3">98-99%</td><td className="p-3">95-98%</td></tr>
                            <tr><td className="p-3 font-medium">Updates</td><td className="p-3 text-green-700">Online (insert/delete)</td><td className="p-3">Batch (rebuild for changes)</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Vectors</th>
                                <th className="text-left p-3 border-b font-semibold">HNSW (RAM)</th>
                                <th className="text-left p-3 border-b font-semibold">DiskANN (RAM + SSD)</th>
                                <th className="text-left p-3 border-b font-semibold">Cost Ratio</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">10M</td><td className="p-3">~40 GB RAM</td><td className="p-3">~2 GB RAM + 40 GB SSD</td><td className="p-3">8x</td></tr>
                            <tr className="border-b"><td className="p-3">100M</td><td className="p-3">~400 GB RAM</td><td className="p-3">~20 GB RAM + 400 GB SSD</td><td className="p-3">10x</td></tr>
                            <tr><td className="p-3 font-medium">1B</td><td className="p-3 text-red-700">~3.2 TB RAM</td><td className="p-3 text-green-700">~64 GB RAM + 3.2 TB SSD</td><td className="p-3 font-bold text-green-700">15-50x</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 6. Lucene/Elasticsearch */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">6. HNSW in Lucene / Elasticsearch</h2>
                <p className="text-foreground leading-relaxed">
                    Lucene 9+ uses HNSW for kNN search. Unlike standalone HNSW (single graph), Lucene maintains
                    <strong> per-segment HNSW graphs</strong>. When segments merge, the graph is <strong>rebuilt from
                    scratch</strong> — this is the biggest operational challenge with vector search in Elasticsearch.
                </p>

                <div className="bg-zinc-900 p-8 rounded-xl font-mono text-sm border border-zinc-800">
                    <div className="text-zinc-400 mb-6"># Lucene segment architecture with HNSW</div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 bg-blue-950/20 border border-blue-900/30 text-blue-400 px-4 py-3 rounded-lg text-center shadow-sm">
                                <div className="font-bold mb-1">Segment 1</div>
                                <div className="text-xs opacity-80">HNSW graph (500K)</div>
                            </div>
                            <div className="flex-1 bg-green-950/20 border border-green-900/30 text-green-400 px-4 py-3 rounded-lg text-center shadow-sm">
                                <div className="font-bold mb-1">Segment 2</div>
                                <div className="text-xs opacity-80">HNSW graph (300K)</div>
                            </div>
                            <div className="flex-1 bg-yellow-950/20 border border-yellow-900/30 text-yellow-400 px-4 py-3 rounded-lg text-center shadow-sm">
                                <div className="font-bold mb-1">Segment 3</div>
                                <div className="text-xs opacity-80">HNSW graph (200K)</div>
                            </div>
                        </div>
                        <div className="flex justify-center -my-2 opacity-50"><span className="text-2xl text-zinc-500">↓</span></div>
                        <div className="bg-zinc-800 border border-zinc-700 text-zinc-300 px-4 py-3 rounded-lg text-center text-xs">
                            Query → search all 3 graphs independently → merge results → return top-K
                        </div>
                        
                        <div className="my-4 border-t border-zinc-800/80 w-3/4 mx-auto relative relative">
                            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 bg-zinc-900 px-4 text-xs text-zinc-500">After segment merge</div>
                        </div>
                        
                        <div className="bg-red-950/20 border-2 border-red-900/50 text-red-400 px-6 py-4 rounded-xl shadow-lg w-full text-center">
                            <div className="font-bold text-lg mb-1 flex items-center justify-center gap-2"><AlertTriangle className="w-5 h-5"/> Merged Segment</div>
                            <div className="text-red-400/80">HNSW graph (1M vectors) ── <span className="font-bold text-red-300 italic">REBUILT from scratch</span></div>
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-red-800 mb-2">⚠️ The Merge Problem</div>
                    <ul className="text-red-700 space-y-1 list-disc list-inside">
                        <li><strong>Graph rebuild:</strong> Hierarchical structure from individual segments can&apos;t be combined — rebuilt from scratch = O(N log N)</li>
                        <li><strong>Memory spikes:</strong> 9M vectors with M=16 can allocate over 2.5 GB of heap during merge</li>
                        <li><strong>Blocking:</strong> Long merges block new segment creation → indexing latency spikes</li>
                    </ul>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">ES Setting</th>
                                <th className="text-left p-3 border-b font-semibold">Default</th>
                                <th className="text-left p-3 border-b font-semibold">Production Recommendation</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-mono">m</td><td className="p-3">16</td><td className="p-3">16-32 (higher for better recall)</td></tr>
                            <tr className="border-b"><td className="p-3 font-mono">ef_construction</td><td className="p-3">100</td><td className="p-3">200-400 (worth the build cost)</td></tr>
                            <tr className="border-b"><td className="p-3 font-mono">num_candidates</td><td className="p-3">varies</td><td className="p-3">100-200 for top-10 queries</td></tr>
                            <tr><td className="p-3 font-mono">similarity</td><td className="p-3">cosine</td><td className="p-3">cosine for text, l2 for images</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/indexing" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.4 Vector Indexing Basics
                </Link>
                <Link href="/search/vector-search/tradeoffs" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.6 Latency vs Recall Tradeoffs <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
