"use client";

import Link from "next/link";
import {
    Zap,
    SkipForward,
    Target,
    Layers,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    Timer,
    Gauge,
    Box,
    BarChart3,
    GitBranch,
    FastForward,
    Filter,
    Activity,
    Database
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Upper Bound Scores", description: "Precompute the maximum possible score each term can contribute to ANY document. If the cumulative upper bound for a document is less than the current threshold, you can safely skip it without missing any top-k results." },
    { title: "Block-Max WAND", description: "Instead of using global upper bounds (which can be skewed by rare outlier documents), store per-block (128 docs) maximum scores. This enables 2-10x speedup over basic WAND by allowing entire blocks to be skipped." },
    { title: "MaxScore Alternative", description: "Partition query terms into essential and non-essential based on cumulative upper bounds. Only iterate through essential terms, lazily evaluating non-essential terms when candidates are found. Preferred for high-k or many-term OR queries." },
    { title: "Skip to Victory", description: "Skip pointers within posting lists enable binary-search-like advancement instead of linear scans. Combined with block-max indexes, Lucene can jump over millions of documents that mathematically cannot qualify for top-k." },
];

export default function WandPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero Section */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 5.6</span>
                        <span>Retrieval Optimization</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Early Termination & WAND</h1>

                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            How search engines find the top 10 results without scoring every document. The WAND algorithm
                            is the secret weapon that makes sub-second search possible at scale.
                        </p>
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                        When a query matches millions of documents, scoring them all is wasteful—users only see the top 10.
                        This chapter reveals the algorithms that make search engines fast by <strong>safely skipping</strong> documents
                        that provably cannot rank in the top-k results.
                    </p>
                </div>

                {/* Stats Row */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-orange-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-orange-700 font-medium text-sm">
                            <Zap className="w-4 h-4" /> Speedup Factor
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">2-10x</p>
                        <p className="text-sm text-zinc-600">Block-Max WAND vs exhaustive scoring on multi-term queries.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm">
                            <Target className="w-4 h-4" /> Documents Skipped
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">90%+</p>
                        <p className="text-sm text-zinc-600">Typical skip rate for top-10 queries on large indices.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm">
                            <Layers className="w-4 h-4" /> Block Size
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">128 docs</p>
                        <p className="text-sm text-zinc-600">Standard block size in Lucene for cache-optimal skipping.</p>
                    </div>
                </div>

                {/* Tip Box */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                        <strong>Prerequisites:</strong> This chapter builds on <Link href="/search/retrieval/execution-plans" className="text-primary hover:underline">Execution Plans</Link> (query pipeline),
                        <Link href="/search/retrieval/bm25" className="text-primary hover:underline ml-1">BM25</Link> (scoring), and
                        <Link href="/search/retrieval/boolean" className="text-primary hover:underline ml-1">Boolean Retrieval</Link> (posting lists).
                    </div>
                </div>
            </div>

            {/* 1. The Problem: Exhaustive Scoring */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. The Problem: Why Score Everything?</h2>
                <p className="text-foreground leading-relaxed">
                    Consider searching for &quot;machine learning tutorial&quot; in an index with 100 million documents.
                    Boolean retrieval might find 2 million matching documents—but users only see the top 10.
                    Scoring all 2 million with BM25 wastes 99.9995% of effort.
                </p>

                <p className="text-foreground leading-relaxed">
                    The traditional approach to ranked retrieval is called <strong>exhaustive scoring</strong>: for every document
                    that matches the query, compute its full BM25 score, maintain a min-heap of the top k results, and return
                    that heap when done. This approach is conceptually simple and guarantees correct results—but it scales
                    terribly. A query matching 5 million documents requires 5 million score computations, even if you only
                    want the top 10. Each BM25 computation involves fetching term frequencies, applying length normalization,
                    and accumulating partial scores across terms. At scale, this becomes the dominant cost of query execution.
                </p>

                <p className="text-foreground leading-relaxed">
                    The insight that unlocks early termination is recognizing that score distributions are highly skewed.
                    Most documents have mediocre scores that will never compete with the top results. If we could somehow
                    <em>predict</em> which documents have no chance of ranking highly, we could skip them entirely—saving
                    enormous amounts of computation. This is exactly what algorithms like WAND, MaxScore, and Block-Max WAND do:
                    they use <strong>upper bound scores</strong> to prove that certain documents cannot possibly make the top-k,
                    allowing safe skipping without any risk of missing relevant results.
                </p>

                {/* Visual: The Waste */}
                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono">
                    <div className="text-zinc-400 mb-4"># The Exhaustive Approach (Slow)</div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <div className="text-sm text-zinc-500">Query: &quot;machine learning tutorial&quot;</div>
                            <div className="flex items-center gap-2">
                                <span className="text-blue-400">Matches:</span>
                                <span className="text-zinc-300">2,000,000 documents</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-purple-400">BM25 scores:</span>
                                <span className="text-zinc-300">2,000,000 computations</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">Returned:</span>
                                <span className="text-zinc-300">10 documents</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-red-400">Wasted:</span>
                                <span className="text-red-300">1,999,990 score calculations</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-zinc-400 text-sm">Score Distribution:</div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-full bg-green-600 h-4 rounded" style={{ width: '100%' }}></div>
                                    <span className="text-xs text-zinc-500 w-20">Top 10</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-full bg-yellow-600/50 h-4 rounded" style={{ width: '15%' }}></div>
                                    <span className="text-xs text-zinc-500 w-20">Could rank</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-full bg-zinc-700 h-4 rounded" style={{ width: '5%' }}></div>
                                    <span className="text-xs text-zinc-500 w-20">No chance</span>
                                </div>
                            </div>
                            <div className="text-xs text-zinc-500 mt-2">~85% of documents have zero chance of making top-k</div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-blue-800 mb-2">The Key Insight</div>
                    <p className="text-blue-700">
                        If we can <strong>prove</strong> a document cannot score higher than the current 10th-best result,
                        we can skip it entirely. This is the foundation of early termination algorithms. The challenge is:
                        how do we prove a document&apos;s score is too low <em>without actually computing the score</em>?
                        The answer lies in upper bound estimation.
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. Upper Bound Scores */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Upper Bound Scores: The Foundation</h2>
                <p className="text-foreground leading-relaxed">
                    The key to safe skipping is computing <strong>upper bounds</strong>: the maximum possible score
                    a term can contribute to ANY document. If the sum of upper bounds for a document&apos;s terms
                    is less than the current threshold, that document can be safely skipped.
                </p>

                <p className="text-foreground leading-relaxed">
                    Recall how BM25 works: the score for a document is the sum of per-term contributions, where each
                    term&apos;s contribution depends on its term frequency (TF) in that document and its inverse document
                    frequency (IDF) across the corpus. The IDF component is constant for a term across all documents,
                    but the TF component varies. The key insight is that we can precompute the <em>maximum possible</em>
                    TF contribution for each term by finding which document has the highest TF for that term. This "max TF"
                    combined with the IDF gives us an upper bound that no document can exceed.
                </p>

                <p className="text-foreground leading-relaxed">
                    For example, if the term "machine" appears at most 150 times in any single document (in a research paper
                    about machine learning), then no document can score higher than BM25_TF(150) × IDF("machine") for this term.
                    We precompute and store this upper bound for every term at index time. At query time, we sum the upper
                    bounds for all query terms to get a ceiling on any document&apos;s possible score. If this ceiling is below
                    the current k-th best score, we can skip the document without any further computation.
                </p>

                {/* Upper Bound Calculation */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                        <div className="font-bold text-green-800 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" /> Computing Upper Bounds
                        </div>
                        <div className="space-y-3 text-sm text-green-700">
                            <p>For each term t in the index:</p>
                            <div className="bg-white border border-green-200 p-3 rounded font-mono text-xs">
                                <div>UB(t) = max_tf_score(t) × IDF(t)</div>
                                <div className="text-green-600 mt-2"># max_tf_score = BM25 TF component</div>
                                <div className="text-green-600"># using the document with highest TF</div>
                            </div>
                            <p className="text-green-600">
                                This is precomputed at index time and stored with the posting list.
                            </p>
                        </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
                        <div className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                            <Target className="w-5 h-5" /> Using Upper Bounds
                        </div>
                        <div className="space-y-3 text-sm text-purple-700">
                            <p>For query &quot;fast algorithm&quot;:</p>
                            <div className="bg-white border border-purple-200 p-3 rounded font-mono text-xs">
                                <div>UB(&quot;fast&quot;) = 3.2</div>
                                <div>UB(&quot;algorithm&quot;) = 4.8</div>
                                <div className="border-t border-purple-200 mt-2 pt-2">
                                    Max possible score = 3.2 + 4.8 = 8.0
                                </div>
                            </div>
                            <p className="text-purple-600">
                                If current threshold is 8.5, this document <strong>cannot</strong> make top-k.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Code Example */}
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">upper_bounds.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">compute_upper_bound</span><span className="text-zinc-300">(term, index):</span></div>
                            <div className="pl-4"><span className="text-zinc-500"># Find document with highest TF for this term</span></div>
                            <div className="pl-4"><span className="text-zinc-300">max_tf = </span><span className="text-yellow-300">max</span><span className="text-zinc-300">(tf(term, doc) </span><span className="text-pink-400">for</span><span className="text-zinc-300"> doc </span><span className="text-pink-400">in</span><span className="text-zinc-300"> posting_list(term))</span></div>
                            <div className="pl-4"></div>
                            <div className="pl-4"><span className="text-zinc-500"># Compute IDF (same for all docs)</span></div>
                            <div className="pl-4"><span className="text-zinc-300">idf = </span><span className="text-yellow-300">log</span><span className="text-zinc-300">(N / df(term))</span></div>
                            <div className="pl-4"></div>
                            <div className="pl-4"><span className="text-zinc-500"># Upper bound = max TF component × IDF</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> bm25_tf(max_tf) * idf</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 3. WAND Algorithm */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. The WAND Algorithm</h2>
                <p className="text-foreground leading-relaxed">
                    WAND (Weak AND) is the foundational algorithm for top-k retrieval with early termination.
                    It cleverly uses upper bounds and a <strong>pivot</strong> mechanism to skip documents
                    that cannot possibly rank in the top-k. The name "Weak AND" comes from its behavior: unlike
                    strict AND (which requires all query terms to match), WAND is "weak" because it considers
                    documents matching any subset of terms, but it&apos;s smart about which candidates to evaluate.
                </p>

                <p className="text-foreground leading-relaxed">
                    The algorithm maintains iterators over the posting lists of all query terms, always sorted by their
                    current document ID. In each iteration, it accumulates upper bounds from left to right (smallest docID
                    to largest) until the cumulative bound meets or exceeds the current score threshold. The document at
                    this point is called the <strong>pivot</strong>. Documents before the pivot cannot possibly score high
                    enough because even their maximum possible scores don&apos;t reach the threshold.
                </p>

                <p className="text-foreground leading-relaxed">
                    Once a pivot is found, WAND checks if all iterators up to and including the pivot point to the same
                    document ID. If they do, that document is a "full candidate" and gets fully scored with BM25. If not,
                    the iterators that lag behind are advanced to the pivot document ID, effectively skipping all documents
                    in between. This skip-and-advance pattern is what makes WAND dramatically faster than exhaustive scoring.
                </p>

                {/* WAND Concept */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 p-6 rounded-xl">
                    <h3 className="font-bold text-orange-800 mb-4 text-lg">WAND Core Concept</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white border border-orange-200 p-4 rounded-lg">
                            <div className="font-bold text-orange-700 mb-2">1. Sort Iterators</div>
                            <p className="text-sm text-orange-600">
                                Sort posting list iterators by their current docID (ascending). This ordering is maintained throughout execution and is key to the algorithm&apos;s efficiency.
                            </p>
                        </div>
                        <div className="bg-white border border-orange-200 p-4 rounded-lg">
                            <div className="font-bold text-orange-700 mb-2">2. Find Pivot</div>
                            <p className="text-sm text-orange-600">
                                Find smallest docID where cumulative UB ≥ threshold.
                            </p>
                        </div>
                        <div className="bg-white border border-orange-200 p-4 rounded-lg">
                            <div className="font-bold text-orange-700 mb-2">3. Skip or Score</div>
                            <p className="text-sm text-orange-600">
                                If all iterators align at pivot → score it. Otherwise → advance lagging iterators.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Visual: Pivot Selection */}
                <div className="bg-zinc-900 text-zinc-100 p-6 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># WAND Pivot Selection Example</div>
                    <div className="space-y-4">
                        <div className="text-zinc-500">Query: &quot;machine learning&quot; | Threshold θ = 7.5</div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="text-zinc-400">Posting Lists (sorted by docID):</div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-400 w-24">&quot;machine&quot;</span>
                                        <span className="text-zinc-300">[</span>
                                        <span className="text-yellow-300">3</span>
                                        <span className="text-zinc-500">, 7, 12, 25, 31...]</span>
                                        <span className="text-green-400 ml-2">UB=5.2</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-purple-400 w-24">&quot;learning&quot;</span>
                                        <span className="text-zinc-300">[</span>
                                        <span className="text-yellow-300">5</span>
                                        <span className="text-zinc-500">, 12, 18, 25, 40...]</span>
                                        <span className="text-green-400 ml-2">UB=4.8</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-zinc-400">Pivot Calculation:</div>
                                <div className="space-y-1 text-sm">
                                    <div><span className="text-zinc-500">Just &quot;machine&quot;:</span> <span className="text-zinc-300">5.2 {'<'} 7.5</span> <span className="text-red-400">✗</span></div>
                                    <div><span className="text-zinc-500">&quot;machine&quot;+&quot;learning&quot;:</span> <span className="text-zinc-300">5.2+4.8 = 10.0 ≥ 7.5</span> <span className="text-green-400">✓</span></div>
                                    <div className="border-t border-zinc-700 pt-2 mt-2">
                                        <span className="text-amber-400">Pivot = doc 5</span> <span className="text-zinc-500">(first doc where UB sum qualifies)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-zinc-700 pt-4">
                            <div className="text-zinc-400">Action:</div>
                            <div className="text-zinc-300">
                                &quot;machine&quot; points to doc 3, but pivot is doc 5
                                → <span className="text-cyan-400">Advance &quot;machine&quot; iterator to doc 5</span> (skips doc 3!)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Algorithm Code */}
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">wand_algorithm.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">wand</span><span className="text-zinc-300">(query_terms, k):</span></div>
                            <div className="pl-4"><span className="text-zinc-300">iterators = [PostingIterator(t) </span><span className="text-pink-400">for</span><span className="text-zinc-300"> t </span><span className="text-pink-400">in</span><span className="text-zinc-300"> query_terms]</span></div>
                            <div className="pl-4"><span className="text-zinc-300">threshold = </span><span className="text-orange-300">0</span></div>
                            <div className="pl-4"><span className="text-zinc-300">top_k = MinHeap(capacity=k)</span></div>
                            <div className="pl-4"></div>
                            <div className="pl-4"><span className="text-pink-400">while</span><span className="text-zinc-300"> </span><span className="text-pink-400">not</span><span className="text-zinc-300"> all_exhausted(iterators):</span></div>
                            <div className="pl-8"><span className="text-zinc-500"># Sort by current docID</span></div>
                            <div className="pl-8"><span className="text-zinc-300">iterators.sort(key=</span><span className="text-pink-400">lambda</span><span className="text-zinc-300"> it: it.doc_id())</span></div>
                            <div className="pl-8"></div>
                            <div className="pl-8"><span className="text-zinc-500"># Find pivot: smallest doc where cumulative UB ≥ threshold</span></div>
                            <div className="pl-8"><span className="text-zinc-300">cumulative = </span><span className="text-orange-300">0</span></div>
                            <div className="pl-8"><span className="text-zinc-300">pivot_idx = </span><span className="text-orange-300">-1</span></div>
                            <div className="pl-8"><span className="text-pink-400">for</span><span className="text-zinc-300"> i, it </span><span className="text-pink-400">in</span><span className="text-zinc-300"> </span><span className="text-yellow-300">enumerate</span><span className="text-zinc-300">(iterators):</span></div>
                            <div className="pl-12"><span className="text-zinc-300">cumulative += upper_bounds[it.term]</span></div>
                            <div className="pl-12"><span className="text-pink-400">if</span><span className="text-zinc-300"> cumulative {'>'}= threshold:</span></div>
                            <div className="pl-16"><span className="text-zinc-300">pivot_idx = i</span></div>
                            <div className="pl-16"><span className="text-pink-400">break</span></div>
                            <div className="pl-8"></div>
                            <div className="pl-8"><span className="text-pink-400">if</span><span className="text-zinc-300"> pivot_idx == </span><span className="text-orange-300">-1</span><span className="text-zinc-300">:</span></div>
                            <div className="pl-12"><span className="text-pink-400">break</span><span className="text-zinc-500">  # No more candidates</span></div>
                            <div className="pl-8"></div>
                            <div className="pl-8"><span className="text-zinc-300">pivot_doc = iterators[pivot_idx].doc_id()</span></div>
                            <div className="pl-8"></div>
                            <div className="pl-8"><span className="text-zinc-500"># Check if all terms up to pivot point to same doc</span></div>
                            <div className="pl-8"><span className="text-pink-400">if</span><span className="text-zinc-300"> </span><span className="text-yellow-300">all</span><span className="text-zinc-300">(it.doc_id() == pivot_doc </span><span className="text-pink-400">for</span><span className="text-zinc-300"> it </span><span className="text-pink-400">in</span><span className="text-zinc-300"> iterators[:pivot_idx+</span><span className="text-orange-300">1</span><span className="text-zinc-300">]):</span></div>
                            <div className="pl-12"><span className="text-zinc-500"># Full evaluation</span></div>
                            <div className="pl-12"><span className="text-zinc-300">score = compute_bm25(pivot_doc, query_terms)</span></div>
                            <div className="pl-12"><span className="text-pink-400">if</span><span className="text-zinc-300"> score {'>'} threshold:</span></div>
                            <div className="pl-16"><span className="text-zinc-300">top_k.push((score, pivot_doc))</span></div>
                            <div className="pl-16"><span className="text-pink-400">if</span><span className="text-zinc-300"> </span><span className="text-yellow-300">len</span><span className="text-zinc-300">(top_k) == k:</span></div>
                            <div className="pl-20"><span className="text-zinc-300">threshold = top_k.min_score()</span></div>
                            <div className="pl-12"><span className="text-zinc-300">advance_all(iterators[:pivot_idx+</span><span className="text-orange-300">1</span><span className="text-zinc-300">])</span></div>
                            <div className="pl-8"><span className="text-pink-400">else</span><span className="text-zinc-300">:</span></div>
                            <div className="pl-12"><span className="text-zinc-500"># Advance lagging iterators to pivot</span></div>
                            <div className="pl-12"><span className="text-pink-400">for</span><span className="text-zinc-300"> it </span><span className="text-pink-400">in</span><span className="text-zinc-300"> iterators[:pivot_idx]:</span></div>
                            <div className="pl-16"><span className="text-zinc-300">it.advance_to(pivot_doc)</span></div>
                            <div className="pl-4"></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> top_k.to_sorted_list()</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 4. Block-Max WAND */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Block-Max WAND: Tighter Bounds</h2>
                <p className="text-foreground leading-relaxed">
                    Basic WAND uses <strong>global</strong> upper bounds—the max score across the entire posting list.
                    This is often too loose because one outlier document with TF=1000 dominates the bound,
                    while most documents have TF=1-5. Block-Max WAND solves this by storing per-block max scores.
                </p>

                <p className="text-foreground leading-relaxed">
                    The problem with global upper bounds becomes clear with a concrete example: imagine the term "python"
                    appears 500 times in a tutorial document (which discusses Python extensively), but only 1-10 times in
                    99% of other matching documents. The global upper bound is based on that outlier tutorial, so it&apos;s
                    unrealistically high for most documents. This means WAND&apos;s pivot calculation is too pessimistic—it
                    assumes every document could potentially score as high as that tutorial, reducing skip opportunities.
                </p>

                <p className="text-foreground leading-relaxed">
                    <strong>Block-Max WAND</strong> (BMW) subdivides each posting list into blocks of typically 128 documents
                    and precomputes the maximum score within each block. Now when WAND processes a block, it uses that block&apos;s
                    local maximum instead of the global maximum. If a block&apos;s max score is below the threshold, the entire
                    block (all 128 documents) can be skipped without any per-document evaluation. This is a massive win:
                    instead of skipping individual documents, BMW skips thousands of documents at once by jumping over
                    entire blocks.
                </p>

                {/* Block Structure Visual */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-xl">
                    <h3 className="font-bold text-blue-800 mb-4">Block-Max Index Structure</h3>
                    <div className="bg-white border border-blue-200 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <div className="text-blue-600 mb-2">Posting List for &quot;machine&quot; (divided into 128-doc blocks):</div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <span className="text-zinc-500 w-24">Block 0:</span>
                                <span className="text-zinc-700">[docs 0-127]</span>
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">maxScore = 3.2</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-zinc-500 w-24">Block 1:</span>
                                <span className="text-zinc-700">[docs 128-255]</span>
                                <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs">maxScore = 2.1</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-zinc-500 w-24">Block 2:</span>
                                <span className="text-zinc-700">[docs 256-383]</span>
                                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">maxScore = 5.2</span>
                                <span className="text-zinc-400">← global max (outlier)</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-zinc-500 w-24">Block 3:</span>
                                <span className="text-zinc-700">[docs 384-511]</span>
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">maxScore = 1.8</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-blue-700 mt-4">
                        <strong>Key insight:</strong> Block 3 can be entirely skipped if threshold {'>'} 1.8 + other terms&apos; block maxes.
                        With global UB (5.2), we&apos;d have to check every document in Block 3.
                    </p>
                </div>

                {/* Comparison Table */}
                <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-100">
                            <tr>
                                <th className="text-left p-4 font-semibold">Aspect</th>
                                <th className="text-left p-4 font-semibold">Basic WAND</th>
                                <th className="text-left p-4 font-semibold">Block-Max WAND</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-border">
                                <td className="p-4 font-medium">Upper Bound Granularity</td>
                                <td className="p-4">Global (entire posting list)</td>
                                <td className="p-4">Per-block (128 docs)</td>
                            </tr>
                            <tr className="border-t border-border bg-zinc-50">
                                <td className="p-4 font-medium">Skip Unit</td>
                                <td className="p-4">Individual documents</td>
                                <td className="p-4">Entire blocks</td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="p-4 font-medium">Index Overhead</td>
                                <td className="p-4">1 float per term</td>
                                <td className="p-4">1 float per block per term</td>
                            </tr>
                            <tr className="border-t border-border bg-zinc-50">
                                <td className="p-4 font-medium">Speedup (typical)</td>
                                <td className="p-4">2-3x vs exhaustive</td>
                                <td className="p-4 text-green-700 font-bold">5-10x vs exhaustive</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Block skipping animation concept */}
                <div className="bg-zinc-900 text-zinc-100 p-6 rounded-xl">
                    <div className="text-zinc-400 mb-4 text-sm"># Block-Max Skipping in Action</div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-zinc-500">Threshold θ = 6.0</span>
                            <span className="text-zinc-600">|</span>
                            <span className="text-zinc-500">Query: &quot;machine learning&quot;</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                            <div className="bg-green-700/30 border border-green-600 p-3 rounded">
                                <div className="text-green-400 font-bold">Block 0</div>
                                <div className="text-zinc-400">maxScore: 3.2+4.1=7.3</div>
                                <div className="text-green-300 mt-1">✓ Evaluate</div>
                            </div>
                            <div className="bg-red-700/30 border border-red-600 p-3 rounded opacity-50">
                                <div className="text-red-400 font-bold">Block 1</div>
                                <div className="text-zinc-400">maxScore: 2.1+3.2=5.3</div>
                                <div className="text-red-300 mt-1">✗ Skip</div>
                            </div>
                            <div className="bg-green-700/30 border border-green-600 p-3 rounded">
                                <div className="text-green-400 font-bold">Block 2</div>
                                <div className="text-zinc-400">maxScore: 5.2+4.8=10.0</div>
                                <div className="text-green-300 mt-1">✓ Evaluate</div>
                            </div>
                            <div className="bg-red-700/30 border border-red-600 p-3 rounded opacity-50">
                                <div className="text-red-400 font-bold">Block 3</div>
                                <div className="text-zinc-400">maxScore: 1.8+2.9=4.7</div>
                                <div className="text-red-300 mt-1">✗ Skip</div>
                            </div>
                        </div>
                        <div className="text-zinc-500 text-sm text-center">
                            50% of blocks skipped entirely → major I/O savings
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. MaxScore Algorithm */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. MaxScore: The Alternative Approach</h2>
                <p className="text-foreground leading-relaxed">
                    MaxScore takes a different approach: instead of pivot-based skipping, it partitions query terms
                    into <strong>essential</strong> and <strong>non-essential</strong> based on their upper bounds.
                    Non-essential terms are only evaluated when a candidate is found via essential terms.
                </p>

                <p className="text-foreground leading-relaxed">
                    The core idea is elegant: sort query terms by their upper bounds and compute a running cumulative sum
                    from lowest to highest. Terms whose cumulative upper bound is still below the threshold are "non-essential"—
                    even if a document matched ALL of them and scored perfectly on each, it still couldn&apos;t reach the threshold.
                    Only the remaining terms are "essential" and must be iterated. For a 10-term query, only 2-3 terms might
                    be essential, reducing iteration overhead by 70-80%.
                </p>

                <p className="text-foreground leading-relaxed">
                    When MaxScore finds a candidate document via essential terms, it then checks the non-essential terms to
                    compute the full score. The brilliance is that this two-phase approach avoids maintaining sorted iterators
                    across all terms (as WAND does). For queries with many terms or when k is large (causing the threshold to
                    stay low), MaxScore often outperforms WAND because its per-document overhead is lower. Modern Lucene
                    versions use Block-Max MaxScore as the default for disjunctive queries.
                </p>

                {/* MaxScore Visual */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-6 rounded-xl">
                    <h3 className="font-bold text-purple-800 mb-4">MaxScore Term Partitioning</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="text-sm text-purple-600">Query: &quot;fast efficient algorithm search&quot; | θ = 12.0</div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-purple-700 w-20">&quot;fast&quot;</span>
                                    <span className="bg-purple-200 text-purple-800 px-2 py-0.5 rounded text-xs">UB=2.1</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-purple-700 w-20">&quot;efficient&quot;</span>
                                    <span className="bg-purple-200 text-purple-800 px-2 py-0.5 rounded text-xs">UB=1.8</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-purple-700 w-20">&quot;algorithm&quot;</span>
                                    <span className="bg-purple-200 text-purple-800 px-2 py-0.5 rounded text-xs">UB=4.5</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-purple-700 w-20">&quot;search&quot;</span>
                                    <span className="bg-purple-200 text-purple-800 px-2 py-0.5 rounded text-xs">UB=5.2</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-sm text-purple-600">Partitioning (sorted by UB, cumulative):</div>
                            <div className="space-y-2 font-mono text-sm">
                                <div className="text-zinc-500">Cumulative UB from low to high:</div>
                                <div><span className="text-red-400">efficient (1.8)</span> → 1.8 {'<'} 12.0</div>
                                <div><span className="text-red-400">fast (2.1)</span> → 3.9 {'<'} 12.0</div>
                                <div><span className="text-red-400">algorithm (4.5)</span> → 8.4 {'<'} 12.0</div>
                                <div><span className="text-green-400">search (5.2)</span> → 13.6 ≥ 12.0 ✓</div>
                            </div>
                            <div className="bg-white border border-purple-200 p-3 rounded mt-2">
                                <div className="text-xs text-purple-600">
                                    <strong>Essential:</strong> &quot;search&quot; (must iterate)<br />
                                    <strong>Non-essential:</strong> &quot;fast&quot;, &quot;efficient&quot;, &quot;algorithm&quot; (only score if candidate found)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* When to use what */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-orange-50 border border-orange-200 p-5 rounded-lg">
                        <div className="font-bold text-orange-800 mb-3">Use WAND When:</div>
                        <ul className="space-y-3 text-sm text-orange-700">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span><strong>Few query terms (2-5):</strong> With fewer terms, the pivot calculation is cheaper and the sorted iterator approach is more efficient than partitioning.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span><strong>Small result set (10-20):</strong> The threshold rises quickly when k is small, enabling aggressive skipping early in query processing.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span><strong>AND-heavy queries:</strong> Documents must match all terms anyway, so WAND&apos;s pivot mechanism aligns naturally with the intersection requirement.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-lg">
                        <div className="font-bold text-indigo-800 mb-3">Use MaxScore When:</div>
                        <ul className="space-y-3 text-sm text-indigo-700">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span><strong>Many query terms (5+):</strong> Term partitioning becomes advantageous—most terms end up non-essential, reducing iteration overhead.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span><strong>Large result set (100+):</strong> With more results needed, the threshold stays lower longer, making WAND&apos;s pivot less effective.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span><strong>OR-heavy disjunctive queries:</strong> Documents matching any subset of terms qualify, and MaxScore excels at iterating only essential terms.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-blue-800 mb-2">Lucene Evolution</div>
                    <p className="text-blue-700">
                        Lucene 8 introduced Block-Max WAND. Lucene 9+ uses <strong>Block-Max MaxScore</strong> for
                        top-level disjunctions, finding it has lower per-hit overhead for many-term queries.
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 6. Skip Pointers */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">6. Skip Pointers: Fast Advancement</h2>
                <p className="text-foreground leading-relaxed">
                    WAND and MaxScore rely heavily on <code className="bg-zinc-100 px-1.5 py-0.5 rounded">advance_to(target_doc)</code>
                    operations. Skip pointers are the data structure that makes these operations fast—allowing
                    binary-search-like jumps within a posting list instead of linear scans.
                </p>

                <p className="text-foreground leading-relaxed">
                    A posting list without skip pointers is just a sequence of document IDs. To find document 1,000,000 you&apos;d
                    need to iterate through 999,999 entries first. Skip pointers solve this by storing "checkpoints" at regular
                    intervals: every √N documents (where N is the posting list length), we record the document ID and its position.
                    Now advancing to document 1,000,000 requires jumping through ~1,000 skip points then a short linear scan,
                    instead of a million iterations.
                </p>

                <p className="text-foreground leading-relaxed">
                    Modern Lucene uses a two-level skip structure: coarse skips for large jumps and fine skips for precision.
                    When WAND needs to advance all lagging iterators to the pivot document, each iterator uses its skip
                    pointers to jump ahead efficiently. Combined with Block-Max indexing, skip pointers enable Lucene to
                    advance through millions of documents in microseconds—a crucial capability for sub-100ms query latency
                    on large corpora.
                </p>

                {/* Skip Pointer Visual */}
                <div className="bg-zinc-900 text-zinc-100 p-6 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># Skip Pointers in a Posting List</div>
                    <div className="space-y-4">
                        <div className="text-zinc-300">
                            Posting List: [3, 7, 12, 25, 31, 48, 55, 67, 82, 91, 105, 120, ...]
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-500">Skip Interval:</span>
                            <span className="text-green-400">√12 ≈ 3</span>
                            <span className="text-zinc-500">(every 3rd element)</span>
                        </div>
                        <div className="border-t border-zinc-700 pt-4">
                            <div className="text-cyan-400 mb-2">Skip List Structure:</div>
                            <div className="flex items-center gap-4 text-xs">
                                <div className="text-center">
                                    <div className="bg-cyan-800 px-3 py-1 rounded">3</div>
                                    <div className="text-zinc-500">pos 0</div>
                                </div>
                                <span className="text-zinc-600">→→→</span>
                                <div className="text-center">
                                    <div className="bg-cyan-800 px-3 py-1 rounded">25</div>
                                    <div className="text-zinc-500">pos 3</div>
                                </div>
                                <span className="text-zinc-600">→→→</span>
                                <div className="text-center">
                                    <div className="bg-cyan-800 px-3 py-1 rounded">55</div>
                                    <div className="text-zinc-500">pos 6</div>
                                </div>
                                <span className="text-zinc-600">→→→</span>
                                <div className="text-center">
                                    <div className="bg-cyan-800 px-3 py-1 rounded">91</div>
                                    <div className="text-zinc-500">pos 9</div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-zinc-700 pt-4">
                            <div className="text-amber-400">advance_to(60):</div>
                            <div className="text-zinc-300 pl-4">
                                1. Check skips: 3 → 25 → 55 → <span className="text-red-400">91 {'>'} 60</span><br />
                                2. Go back to pos 6 (value 55)<br />
                                3. Linear scan: 55 → <span className="text-green-400">67 ≥ 60</span> → Found!
                            </div>
                            <div className="text-zinc-500 mt-2">
                                Cost: 4 skip checks + 2 linear steps = 6 ops (vs 10 linear scan)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skip Pointer Formula */}
                <div className="bg-green-50 border border-green-200 p-5 rounded-lg">
                    <div className="font-bold text-green-800 mb-3">Optimal Skip Interval: √P</div>
                    <p className="text-sm text-green-700 mb-3">
                        For a posting list of length P, the optimal skip interval is √P. This balances:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-white border border-green-200 p-3 rounded">
                            <div className="font-medium text-green-800">Too few skips:</div>
                            <p className="text-green-600">Long linear scans between skip points</p>
                        </div>
                        <div className="bg-white border border-green-200 p-3 rounded">
                            <div className="font-medium text-green-800">Too many skips:</div>
                            <p className="text-green-600">Overhead of checking many skip points</p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 7. terminate_after */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">7. terminate_after: Simple Early Stop</h2>
                <p className="text-foreground leading-relaxed">
                    Elasticsearch provides a simpler early termination mechanism: <code className="bg-zinc-100 px-1.5 py-0.5 rounded">terminate_after</code>.
                    It stops collecting documents after a fixed count per shard—useful when approximate results are acceptable.
                </p>

                <p className="text-foreground leading-relaxed">
                    Unlike WAND and MaxScore (which guarantee returning the exact top-k highest-scoring documents),
                    <code className="bg-zinc-100 px-1.5 py-0.5 rounded">terminate_after</code> makes no quality guarantees.
                    It simply stops after evaluating a fixed number of documents per shard, returning whatever top-k results
                    were found so far. The documents aren&apos;t evaluated in score order, so you might miss high-scoring documents
                    that happen to be stored later in the index.
                </p>

                <p className="text-foreground leading-relaxed">
                    Despite this limitation, <code className="bg-zinc-100 px-1.5 py-0.5 rounded">terminate_after</code> shines in specific scenarios:
                    exploratory searches where any reasonable results are acceptable, debugging queries to test if any documents match,
                    or as a safety valve against runaway queries that match too many documents. It&apos;s essentially a "good enough"
                    optimization trading precision for guaranteed latency bounds.
                </p>

                {/* API Example */}
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">elasticsearch_query.json</span>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-zinc-300">{'{'}</span></div>
                            <div className="pl-4"><span className="text-blue-400">&quot;query&quot;</span><span className="text-zinc-300">: {'{'}</span></div>
                            <div className="pl-8"><span className="text-blue-400">&quot;match&quot;</span><span className="text-zinc-300">: {'{'} </span><span className="text-blue-400">&quot;content&quot;</span><span className="text-zinc-300">: </span><span className="text-green-400">&quot;machine learning&quot;</span><span className="text-zinc-300"> {'}'}</span></div>
                            <div className="pl-4"><span className="text-zinc-300">{'}'},</span></div>
                            <div className="pl-4"><span className="text-amber-400">&quot;terminate_after&quot;</span><span className="text-zinc-300">: </span><span className="text-orange-300">1000</span><span className="text-zinc-300">,</span></div>
                            <div className="pl-4"><span className="text-blue-400">&quot;size&quot;</span><span className="text-zinc-300">: </span><span className="text-orange-300">10</span></div>
                            <div><span className="text-zinc-300">{'}'}</span></div>
                        </div>
                    </div>
                </div>

                {/* Caveats */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-red-50 border border-red-200 p-5 rounded-lg">
                        <div className="font-bold text-red-800 mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> Important Caveats
                        </div>
                        <ul className="space-y-3 text-sm text-red-700">
                            <li><strong>Per-shard limit:</strong> The limit applies independently to each shard. With 5 shards and terminate_after=1000, you may process up to 5000 documents total.</li>
                            <li><strong>Incomplete results:</strong> You might miss relevant documents that happen to be stored after the cutoff point in each shard.</li>
                            <li><strong>Sorting conflicts:</strong> If you&apos;re sorting by a field (not relevance), the best documents might be beyond the termination point and never evaluated.</li>
                            <li><strong>Response flag:</strong> The response includes <code className="bg-red-100 px-1 rounded">terminated_early: true</code> so your application knows results may be incomplete.</li>
                        </ul>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-5 rounded-lg">
                        <div className="font-bold text-green-800 mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> Good Use Cases
                        </div>
                        <ul className="space-y-3 text-sm text-green-700">
                            <li><strong>Existence checks:</strong> When you just need to know &quot;does any document match this query?&quot; rather than finding the best matches.</li>
                            <li><strong>Sampling queries:</strong> When you need a random sample of matching documents for analytics or testing purposes.</li>
                            <li><strong>Filter-only queries:</strong> When there&apos;s no relevance ranking involved—all matching documents are equally valid.</li>
                            <li><strong>Latency-critical paths:</strong> When returning &quot;good enough&quot; results quickly is more important than finding the absolute best matches.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 8. Performance */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">8. Performance Benchmarks</h2>
                <p className="text-foreground leading-relaxed">
                    Early termination effectiveness depends on query characteristics, index size, and score distribution.
                    Here are typical benchmarks from Lucene and Elasticsearch deployments.
                </p>

                <p className="text-foreground leading-relaxed">
                    The key factor is <strong>score distribution skew</strong>: when scores vary widely (some documents
                    clearly better than others), early termination works extremely well because the threshold rises quickly.
                    The top-10 threshold might reach 90% of the maximum possible score after just evaluating 1% of documents,
                    allowing the remaining 99% to be skipped. Conversely, when scores are flat (many documents scoring similarly),
                    skipping opportunities are limited.
                </p>

                <p className="text-foreground leading-relaxed">
                    Query length also matters significantly. Longer queries (more OR terms) paradoxically perform <em>better</em>
                    with early termination because each additional term creates more opportunities to accumulate high scores on
                    a few documents while most documents only match one or two terms. A 5-term OR query might skip 90%+ of
                    candidate documents, while a 2-term OR query achieves only 70% skip rate.
                </p>

                {/* Benchmark Table */}
                <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-100">
                            <tr>
                                <th className="text-left p-4 font-semibold">Query Type</th>
                                <th className="text-left p-4 font-semibold">Docs Evaluated</th>
                                <th className="text-left p-4 font-semibold">Skip Rate</th>
                                <th className="text-left p-4 font-semibold">Speedup</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-border">
                                <td className="p-4">2-term OR</td>
                                <td className="p-4">~30% of matches</td>
                                <td className="p-4">70%</td>
                                <td className="p-4 text-green-700">2-3x</td>
                            </tr>
                            <tr className="border-t border-border bg-zinc-50">
                                <td className="p-4">3-term OR</td>
                                <td className="p-4">~20% of matches</td>
                                <td className="p-4">80%</td>
                                <td className="p-4 text-green-700">3-5x</td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="p-4">5-term OR</td>
                                <td className="p-4">~10% of matches</td>
                                <td className="p-4">90%</td>
                                <td className="p-4 text-green-700 font-bold">5-10x</td>
                            </tr>
                            <tr className="border-t border-border bg-zinc-50">
                                <td className="p-4">Phrase query</td>
                                <td className="p-4">~60% of matches</td>
                                <td className="p-4">40%</td>
                                <td className="p-4 text-yellow-700">1-2x</td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="p-4">Single term</td>
                                <td className="p-4">~50% of matches</td>
                                <td className="p-4">50%</td>
                                <td className="p-4 text-yellow-700">1.5-2x</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-blue-800 mb-2">When Early Termination Shines</div>
                    <p className="text-blue-700">
                        Maximum benefit when: (1) many terms in query, (2) small k, (3) skewed score distribution
                        (few high-scoring docs), and (4) large posting lists with good block-max variation.
                    </p>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 border-t border-border">
                <Link href="/search/retrieval/execution-plans" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Execution Plans</span>
                </Link>
                <Link href="/search/retrieval/caching" className="flex items-center gap-2 text-primary font-medium hover:underline">
                    <span>Caching at Retrieval Layer</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
