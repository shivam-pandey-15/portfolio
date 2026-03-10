"use client";

import Link from "next/link";
import {
    GitMerge, ArrowRight, ArrowLeft, Zap, AlertTriangle,
    Target, Search, Shuffle, BarChart3, Settings,
    Code2, Layers
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Neither Alone Is Sufficient", description: "BM25 excels at exact matching (SKU codes, error codes, product names) but fails on conceptual queries. Embeddings excel at intent and vocabulary bridging but struggle with precise identifiers. Hybrid covers all query types." },
    { title: "RRF Is the Recommended Starting Point", description: "Reciprocal Rank Fusion operates on ranks (not scores), needs no normalization, is parameter-free (k=60), requires no labeled data, and works with any number of retrievers. Used by Elasticsearch and Azure AI Search." },
    { title: "Linear Combination Needs Careful Normalization", description: "BM25 scores range 0-25, cosine similarity ranges 0-1. Without normalization, one retriever dominates. Min-max is sensitive to outliers; z-score produces negatives. This complexity is why many systems prefer RRF." },
    { title: "Parallel Execution Is Critical", description: "Run BM25 + vector search in parallel. Total latency = max(BM25, vector) + fusion overhead, NOT the sum. Both typically return in 5-15ms, so total retrieval is ~15ms + ~1ms fusion." },
    { title: "Query Routing Beats Static Weights", description: "Route by query type: ID queries → BM25 only; short queries → alpha=0.4 (favor BM25); questions → alpha=0.8 (favor semantic). Dramatically outperforms a single static alpha value." },
];

export default function HybridRankingPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.7</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Hybrid Ranking Pipelines</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            Neither keyword search nor semantic search alone delivers optimal results for all query types.
                            Hybrid search combines the precision of BM25 with the conceptual understanding of embeddings.
                            This chapter covers RRF, linear combination, score normalization, and query routing.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm"><Shuffle className="w-4 h-4" /> RRF Constant</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">k=60</p>
                        <p className="text-sm text-zinc-600">The &quot;set it and forget it&quot; constant from Cormack et al. (2009). Stable across domains.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><Target className="w-4 h-4" /> Alpha Sweet Spot</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">0.6-0.7</p>
                        <p className="text-sm text-zinc-600">Slightly favoring semantic. Short queries → lower alpha; long queries → higher.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-purple-700 font-medium text-sm"><Zap className="w-4 h-4" /> Fusion Latency</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">~1ms</p>
                        <p className="text-sm text-zinc-600">Merging two ranked lists of 100 candidates each. Negligible overhead.</p>
                    </div>
                </div>
            </div>

            {/* 1. Why Hybrid */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. Why Hybrid Search?</h2>
                <p className="text-foreground leading-relaxed">
                    If semantic search is so powerful, why do we still need old-school keyword search like BM25? 
                    The reality of production search systems is that <strong>neither approach alone is sufficient</strong> to 
                    handle the incredible diversity of human queries. Dense retrieval (embeddings) and sparse retrieval 
                    (keywords) have orthogonal strengths and strictly complementary weaknesses.
                </p>

                <p className="text-foreground leading-relaxed">
                    <strong>BM25 breaks</strong> on conceptual queries: &quot;affordable noise cancelling headphones&quot;
                    won&apos;t match &quot;budget over-ear ANC headphones&quot; because &quot;affordable&quot; ≠ &quot;budget&quot;
                    and &quot;noise cancelling&quot; ≠ &quot;ANC.&quot; <strong>Embeddings break</strong> on precision queries:
                    searching &quot;SKU-2847-B&quot; produces vague vectors that might loosely match hundreds of unrelated products with
                    similar-looking codes. Every query type that trips up one system is handled perfectly by the other.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Query Type</th>
                                <th className="text-left p-3 border-b font-semibold">BM25</th>
                                <th className="text-left p-3 border-b font-semibold">Vector</th>
                                <th className="text-left p-3 border-b font-semibold">Hybrid</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">&quot;iPhone 15 Pro Max&quot; (exact product)</td><td className="p-3 text-green-700">✅</td><td className="p-3 text-amber-600">⚠️</td><td className="p-3 text-green-700">✅</td></tr>
                            <tr className="border-b"><td className="p-3">&quot;affordable smartphones&quot; (conceptual)</td><td className="p-3 text-red-700">❌</td><td className="p-3 text-green-700">✅</td><td className="p-3 text-green-700">✅</td></tr>
                            <tr className="border-b"><td className="p-3">&quot;SKU-2847-B&quot; (exact code)</td><td className="p-3 text-green-700">✅</td><td className="p-3 text-red-700">❌</td><td className="p-3 text-green-700">✅</td></tr>
                            <tr className="border-b"><td className="p-3">&quot;how to fix my car not starting&quot;</td><td className="p-3 text-amber-600">⚠️</td><td className="p-3 text-green-700">✅</td><td className="p-3 text-green-700">✅</td></tr>
                            <tr className="border-b"><td className="p-3">&quot;error code 0x8004005&quot;</td><td className="p-3 text-green-700">✅</td><td className="p-3 text-red-700">❌</td><td className="p-3 text-green-700">✅</td></tr>
                            <tr><td className="p-3">&quot;alternatives to Slack for team chat&quot;</td><td className="p-3 text-red-700">❌</td><td className="p-3 text-green-700">✅</td><td className="p-3 text-green-700">✅</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. Architecture */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Architecture: Parallel Retrieval + Fusion</h2>
                <p className="text-foreground leading-relaxed">
                    A hybrid search engine physically executes two entirely separate searches. The user types a query; 
                    the system sends the raw text to the sparse engine (Elasticsearch, OpenSearch) scoring via BM25, 
                    and simultaneously embeds the text and sends the vector to the dense engine (Pinecone, Qdrant) 
                    scoring via cosine similarity.
                </p>

                <p className="text-foreground leading-relaxed">
                    Both engines return their top candidates (e.g., top 100), yielding two separate ranked lists of 
                    documents. The final, critical step is <strong>fusion</strong>: mathematically merging these two lists 
                    into a single, cohesive top 10 to present to the user.
                </p>
                <div className="bg-zinc-900 p-8 rounded-xl font-mono text-sm border border-zinc-800">
                    <div className="text-zinc-400 mb-6"># Hybrid search pipeline</div>
                    <div className="flex flex-col items-center gap-2">
                        {/* Query */}
                        <div className="bg-blue-950/20 border border-blue-900/30 text-blue-300 px-6 py-4 rounded-lg text-center w-full max-w-md z-10">
                            <span className="text-zinc-500">Query:</span> &quot;affordable noise cancelling headphones&quot;
                        </div>
                        
                        {/* Split Connector */}
                        <div className="w-full max-w-2xl relative h-12">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-zinc-700"></div>
                            <div className="absolute top-6 left-[25%] right-[25%] h-6 border-t-2 border-l-2 border-r-2 border-zinc-700 rounded-t-xl"></div>
                            <div className="absolute bottom-0 left-[25%] -translate-x-1/2 text-zinc-600 text-lg leading-none bg-zinc-900 z-10">↓</div>
                            <div className="absolute bottom-0 left-[75%] -translate-x-1/2 text-zinc-600 text-lg leading-none bg-zinc-900 z-10">↓</div>
                        </div>

                        {/* Engines */}
                        <div className="flex w-full max-w-2xl justify-between gap-8">
                            {/* Sparse Path */}
                            <div className="flex-1 flex flex-col items-center gap-4">
                                <div className="bg-zinc-800 border border-zinc-700 text-blue-400 px-6 py-4 rounded-xl shadow-lg w-full text-center hover:border-blue-500/50 transition-colors">
                                    <div className="font-bold text-lg mb-1">BM25</div>
                                    <div className="text-zinc-400 text-xs">Inverted Index</div>
                                </div>
                                <div className="text-zinc-600 text-lg leading-none">↓</div>
                                <div className="bg-blue-950/30 border border-blue-900/30 text-blue-300 px-4 py-2 rounded font-mono text-xs w-full text-center">
                                    Top 100 by BM25
                                </div>
                            </div>

                            {/* Dense Path */}
                            <div className="flex-1 flex flex-col items-center gap-4">
                                <div className="bg-zinc-800 border border-zinc-700 text-green-400 px-6 py-4 rounded-xl shadow-lg w-full text-center hover:border-green-500/50 transition-colors">
                                    <div className="font-bold text-lg mb-1">kNN/ANN</div>
                                    <div className="text-zinc-400 text-xs">Vector Index</div>
                                </div>
                                <div className="text-zinc-600 text-lg leading-none">↓</div>
                                <div className="bg-green-950/30 border border-green-900/30 text-green-300 px-4 py-2 rounded font-mono text-xs w-full text-center">
                                    Top 100 by vector
                                </div>
                            </div>
                        </div>

                        {/* Merge Connector */}
                        <div className="w-full max-w-2xl relative h-12 mt-2">
                            <div className="absolute top-0 left-[25%] right-[25%] h-6 border-b-2 border-l-2 border-r-2 border-zinc-700 rounded-b-xl"></div>
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-zinc-700"></div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-zinc-600 text-lg leading-none bg-zinc-900 px-1 z-10">↓</div>
                        </div>
                        
                        {/* Fusion & Output */}
                        <div className="flex flex-col items-center gap-4 mt-2">
                            <div className="bg-zinc-800 border border-zinc-700 text-yellow-400 px-8 py-4 rounded-xl shadow-lg w-full min-w-[240px] text-center hover:border-yellow-500/50 transition-colors">
                                <div className="font-bold text-base mb-1">Fusion</div>
                                <div className="text-zinc-400 text-xs">(RRF or Linear)</div>
                            </div>
                            <div className="text-zinc-600 text-lg leading-none">↓</div>
                            <div className="bg-green-950/30 border border-green-900/50 text-green-400 px-8 py-3 rounded-xl text-lg font-bold shadow-lg">
                                Top 10 results
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-foreground leading-relaxed">
                    The <strong>parallel execution</strong> is critical: both BM25 and vector search return in ~5-15ms each,
                    so total retrieval = max(BM25_time, vector_time), not the sum. Fusion adds ~1ms.
                </p>
            </section>

            <hr className="border-border" />

            {/* 3. RRF */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Reciprocal Rank Fusion (RRF)</h2>
                <p className="text-foreground leading-relaxed">
                    How do you merge a BM25 score of 24.5 with a cosine similarity score of 0.82? The scores are on 
                    completely different scales, have different distributions, and mean different things. Reciprocal 
                    Rank Fusion (RRF) bypasses this problem entirely by ignoring scores and looking only at <strong>ranks</strong>.
                </p>

                <p className="text-foreground leading-relaxed">
                    RRF is the most widely used fusion logic in production (native to Elasticsearch and Azure AI Search) 
                    because it&apos;s elegant, robust, and parameter-free. It calculates a score based purely on a document&apos;s 
                    position in the retrieved lists. A document ranking highly in multiple retrievers is probably highly 
                    relevant, regardless of what its absolute scores were.
                </p>
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">rrf.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">from</span><span className="text-zinc-300"> collections </span><span className="text-pink-400">import</span><span className="text-zinc-300"> defaultdict</span></div>
                            <div className="mt-1"><span className="text-pink-400">def</span> <span className="text-yellow-300">reciprocal_rank_fusion</span><span className="text-zinc-300">(ranked_lists, k=60):</span></div>
                            <div className="pl-4"><span className="text-zinc-500">&quot;&quot;&quot;k=60 from Cormack et al., 2009. Higher = less top-emphasis.&quot;&quot;&quot;</span></div>
                            <div className="pl-4"><span className="text-zinc-300">rrf_scores = defaultdict(float)</span></div>
                            <div className="pl-4"><span className="text-pink-400">for</span><span className="text-zinc-300"> ranked_list </span><span className="text-pink-400">in</span><span className="text-zinc-300"> ranked_lists:</span></div>
                            <div className="pl-8"><span className="text-pink-400">for</span><span className="text-zinc-300"> rank, doc_id </span><span className="text-pink-400">in</span><span className="text-zinc-300"> </span><span className="text-yellow-300">enumerate</span><span className="text-zinc-300">(ranked_list, start=</span><span className="text-orange-300">1</span><span className="text-zinc-300">):</span></div>
                            <div className="pl-12"><span className="text-zinc-300">rrf_scores[doc_id] += </span><span className="text-orange-300">1.0</span><span className="text-zinc-300"> / (k + rank)</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> </span><span className="text-yellow-300">sorted</span><span className="text-zinc-300">(rrf_scores.items(), key=</span><span className="text-pink-400">lambda</span><span className="text-zinc-300"> x: -x[</span><span className="text-orange-300">1</span><span className="text-zinc-300">])</span></div>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800">Worked Example</h3>
                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="space-y-2 text-xs">
                        <div><span className="text-blue-400">BM25:</span>     [Doc_A (rank 1), Doc_B (rank 2), Doc_C (rank 3)]</div>
                        <div><span className="text-green-400">Vector:</span>   [Doc_C (rank 1), Doc_D (rank 2), Doc_A (rank 3)]</div>
                        <div className="mt-2 text-zinc-400">RRF scores (k=60):</div>
                        <div className="pl-2">Doc_A: 1/(60+1) + 1/(60+3) = 0.01639 + 0.01587 = <span className="text-yellow-400">0.03227</span></div>
                        <div className="pl-2">Doc_B: 1/(60+2) + 0        = <span className="text-zinc-400">0.01613</span> (only in BM25)</div>
                        <div className="pl-2">Doc_C: 1/(60+3) + 1/(60+1) = 0.01587 + 0.01639 = <span className="text-yellow-400">0.03227</span></div>
                        <div className="pl-2">Doc_D: 0        + 1/(60+2) = <span className="text-zinc-400">0.01613</span> (only in vector)</div>
                        <div className="mt-2 text-green-400">Final: [Doc_A, Doc_C, Doc_B, Doc_D]</div>
                        <div className="text-zinc-500">→ Docs in BOTH lists get boosted. Single-list docs rank lower.</div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 4. Linear Combination */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Linear Combination</h2>
                <p className="text-foreground leading-relaxed">
                    While RRF is robust, discarding absolute scores means throwing away valuable information. A document 
                    with a BM25 score of 120 (a phenomenally strong exact match) gets the same rank-based treatment as 
                    a document with a BM25 score of 15 if they both happen to be rank #1 in their respective lists.
                </p>

                <p className="text-foreground leading-relaxed">
                    Linear combination solves this by keeping the scores, but it introduces a massive engineering headache: 
                    <strong>score normalization</strong>. You must mathematically squash the unbounded BM25 scores (0 to ∞) 
                    and the bounded vector scores (0 to 1) into the same distribution (typically applying a min-max scaling 
                    or z-score normalization over the retrieved set) before you can multiply them by a tunable weight (alpha).
                </p>
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">linear_fusion.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">hybrid_linear</span><span className="text-zinc-300">(bm25_score, vector_score, alpha=0.7):</span></div>
                            <div className="pl-4"><span className="text-zinc-500">&quot;&quot;&quot;</span></div>
                            <div className="pl-4"><span className="text-zinc-500">alpha=0.0 → pure BM25    alpha=0.5 → equal weight</span></div>
                            <div className="pl-4"><span className="text-zinc-500">alpha=1.0 → pure semantic  Typical: 0.6-0.7</span></div>
                            <div className="pl-4"><span className="text-zinc-500">&quot;&quot;&quot;</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> alpha * normalize(vector_score) + (</span><span className="text-orange-300">1</span><span className="text-zinc-300"> - alpha) * normalize(bm25_score)</span></div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Aspect</th>
                                <th className="text-left p-3 border-b font-semibold">RRF</th>
                                <th className="text-left p-3 border-b font-semibold">Linear Combination</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-medium">Normalization</td><td className="p-3 text-green-700">Not needed</td><td className="p-3 text-red-700">Required (and tricky)</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Tuning effort</td><td className="p-3 text-green-700">Minimal (k=60 works)</td><td className="p-3">Must tune α per domain + normalize</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Score info</td><td className="p-3">Discards magnitude</td><td className="p-3 text-green-700">Preserves magnitude</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Labeled data</td><td className="p-3 text-green-700">No</td><td className="p-3">Yes (for optimal α)</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Robustness</td><td className="p-3 text-green-700">Very robust to noise</td><td className="p-3">Sensitive to normalization</td></tr>
                            <tr><td className="p-3 font-medium">Adoption</td><td className="p-3">Elasticsearch, Azure AI Search</td><td className="p-3">Weaviate, Pinecone</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. Query Routing */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. Advanced: Query Routing</h2>
                <p className="text-foreground leading-relaxed">
                    Even with tuned linear combination, using a single global alpha weight (e.g., 60% semantic, 40% keyword) 
                    is mathematically suboptimal. An exact SKU search doesn&apos;t need 60% semantic noise; it needs 100% 
                    keyword precision. A philosophical question doesn&apos;t need 40% keyword matching; it needs 100% semantic 
                    understanding.
                </p>

                <p className="text-foreground leading-relaxed">
                    State-of-the-art production systems go beyond static fusion by <strong>routing queries</strong> to 
                    different strategies dynamically. A fast Query Understanding layer (often a small classifier or rules 
                    engine) analyzes the query string before retrieval and passes specific instructions down to the fusion 
                    layer regarding how to blend the results.
                </p>
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">query_routing.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">route_query</span><span className="text-zinc-300">(query):</span></div>
                            <div className="pl-4"><span className="text-zinc-500">&quot;&quot;&quot;Choose search strategy based on query characteristics.&quot;&quot;&quot;</span></div>
                            <div className="pl-4"><span className="text-pink-400">if</span><span className="text-zinc-300"> looks_like_id(query):</span><span className="text-zinc-500">          # &quot;SKU-2847-B&quot;, &quot;ISBN 978-3-16&quot;</span></div>
                            <div className="pl-8"><span className="text-pink-400">return</span><span className="text-zinc-300"> bm25_only(query)</span><span className="text-zinc-500">       # Exact match is what&apos;s needed</span></div>
                            <div className="pl-4"><span className="text-pink-400">if</span><span className="text-zinc-300"> is_short_query(query, max_words=</span><span className="text-orange-300">2</span><span className="text-zinc-300">):</span><span className="text-zinc-500"> # &quot;python&quot;, &quot;best laptop&quot;</span></div>
                            <div className="pl-8"><span className="text-pink-400">return</span><span className="text-zinc-300"> hybrid_search(query, alpha=</span><span className="text-orange-300">0.4</span><span className="text-zinc-300">)</span><span className="text-zinc-500">  # Favor BM25</span></div>
                            <div className="pl-4"><span className="text-pink-400">if</span><span className="text-zinc-300"> is_question(query):</span><span className="text-zinc-500">             # &quot;how do I...&quot;</span></div>
                            <div className="pl-8"><span className="text-pink-400">return</span><span className="text-zinc-300"> hybrid_search(query, alpha=</span><span className="text-orange-300">0.8</span><span className="text-zinc-300">)</span><span className="text-zinc-500">  # Favor semantic</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> hybrid_search(query, alpha=</span><span className="text-orange-300">0.6</span><span className="text-zinc-300">)</span><span className="text-zinc-500">      # Default: balanced</span></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/tradeoffs" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.6 Latency vs Recall Tradeoffs
                </Link>
                <Link href="/search/vector-search/failures" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.8 Common Failure Modes <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
