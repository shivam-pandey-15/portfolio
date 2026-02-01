"use client";

import Link from "next/link";
import {
    Workflow,
    Layers,
    Database,
    Cpu,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    AlertTriangle,
    Binary,
    Zap,
    Search,
    GitBranch,
    Timer,
    Gauge,
    Box,
    ListTree,
    Play,
    SkipForward,
    Target,
    SplitSquareVertical
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Query → Weight → Scorer", description: "Three-layer pipeline: Query defines WHAT, Weight computes IDF, Scorer iterates and scores per segment." },
    { title: "All Matching is Iteration", description: "DocIdSetIterator (DISI) is the heart of Lucene. AND uses leap-frog, OR uses priority queue." },
    { title: "Cost Drives Order", description: "Lucene executes cheapest clauses first in conjunctions, using posting list length as cost estimate." },
    { title: "Profile API", description: "Add \"profile\": true to see breakdown of create_weight, build_scorer, next_doc, advance, and score timings." },
];

export default function ExecutionPlansPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero Section */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 5.5</span>
                        <span>Retrieval Architecture</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Execution Plans</h1>

                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            How search engines translate "find laptops under $500" into disk reads, iterator operations, and score calculations.
                        </p>
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                        This chapter reveals the internal machinery of query execution. Understanding these mechanics is essential for debugging
                        slow queries and writing efficient search applications. Every millisecond in a search request can be traced to these operations.
                    </p>
                </div>

                {/* Stats Row */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm">
                            <Layers className="w-4 h-4" /> Pipeline Depth
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">3 Layers</p>
                        <p className="text-sm text-zinc-600">Query → Weight → Scorer abstraction for segment-level execution.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-purple-700 font-medium text-sm">
                            <Timer className="w-4 h-4" /> Iteration Cost
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">O(1)</p>
                        <p className="text-sm text-zinc-600">Amortized cost per document via skip lists and block iteration.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm">
                            <Gauge className="w-4 h-4" /> Profile Overhead
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">~10x</p>
                        <p className="text-sm text-zinc-600">Profile API adds significant overhead—debug only.</p>
                    </div>
                </div>

                {/* Tip Box */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                        <strong>Prerequisites:</strong> This chapter builds on <Link href="/search/retrieval/boolean" className="text-primary hover:underline">Boolean Retrieval</Link> (posting lists),
                        <Link href="/search/retrieval/bm25" className="text-primary hover:underline ml-1">BM25</Link> (scoring), and
                        <Link href="/search/indexing/segments" className="text-primary hover:underline ml-1">Segments</Link> (index structure).
                    </div>
                </div>
            </div>

            {/* 1. The Three-Layer Pipeline */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. The Query → Weight → Scorer Pipeline</h2>
                <p className="text-foreground leading-relaxed">
                    This is the fundamental architecture of Lucene query execution. Every search, from a simple term lookup to a complex
                    boolean query with filters, passes through these three layers. Understanding this abstraction is the key to understanding
                    query performance.
                </p>
                <p className="text-foreground leading-relaxed">
                    The separation exists for a reason: <strong>Query</strong> objects are reusable and stateless, <strong>Weight</strong> objects
                    hold index-level statistics (computed once), and <strong>Scorer</strong> objects handle segment-specific iteration (created per segment).
                    This design enables efficient execution across a segmented index.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg flex flex-col">
                        <div className="flex items-center gap-2 font-bold text-lg text-blue-800 mb-2">
                            <Search className="w-5 h-5 flex-shrink-0" /> Query
                        </div>
                        <p className="text-sm text-blue-700 flex-1">
                            User-facing representation. Defines <strong>WHAT</strong> to search for.
                        </p>
                        <div className="bg-white border border-blue-200 p-2 rounded text-xs mt-3">
                            <span className="text-blue-500">Examples: </span>
                            <code>TermQuery, BooleanQuery</code>
                        </div>
                        <div className="flex items-center gap-2 text-xs mt-2">
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Immutable</span>
                            <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">Thread-safe</span>
                        </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 p-5 rounded-lg flex flex-col">
                        <div className="flex items-center gap-2 font-bold text-lg text-purple-800 mb-2">
                            <Gauge className="w-5 h-5 flex-shrink-0" /> Weight
                        </div>
                        <p className="text-sm text-purple-700 flex-1">
                            Index-level state. Computes <strong>IDF</strong>, query boosts.
                        </p>
                        <div className="bg-white border border-purple-200 p-2 rounded text-xs mt-3">
                            <span className="text-purple-500">Created: </span>
                            <code>query.create_weight()</code>
                        </div>
                        <div className="flex items-center gap-2 text-xs mt-2">
                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Computed Once</span>
                            <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">Per-Search</span>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 p-5 rounded-lg flex flex-col">
                        <div className="flex items-center gap-2 font-bold text-lg text-green-800 mb-2">
                            <Play className="w-5 h-5 flex-shrink-0" /> Scorer
                        </div>
                        <p className="text-sm text-green-700 flex-1">
                            Segment-level iterator. Computes <strong>TF</strong>, length norms.
                        </p>
                        <div className="bg-white border border-green-200 p-2 rounded text-xs mt-3">
                            <span className="text-green-500">Created: </span>
                            <code>weight.scorer(segment)</code>
                        </div>
                        <div className="flex items-center gap-2 text-xs mt-2">
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">Per-Segment</span>
                            <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">Iterates Docs</span>
                        </div>
                    </div>
                </div>

                {/* Pipeline Visualization */}
                <div className="bg-zinc-900 text-zinc-100 p-6 rounded-lg font-mono text-sm">
                    <div className="text-zinc-400 mb-4">// Execution Flow</div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="text-blue-400 w-48">Query (stateless)</span>
                            <span className="text-zinc-500">───────▶</span>
                            <span className="text-zinc-400">createWeight(IndexSearcher)</span>
                        </div>
                        <div className="flex items-center gap-3 pl-8">
                            <span className="text-zinc-500">│</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-purple-400 w-48">Weight (IDF, boosts)</span>
                            <span className="text-zinc-500">───────▶</span>
                            <span className="text-zinc-400">scorer(LeafReaderContext) × N segments</span>
                        </div>
                        <div className="flex items-center gap-3 pl-8">
                            <span className="text-zinc-500">│</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-green-400 w-48">Scorer₁, Scorer₂, ... Scorer_N</span>
                            <span className="text-zinc-500">───────▶</span>
                            <span className="text-zinc-400">iterate(), score() per segment</span>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-blue-800 mb-2">Key Insight: IDF vs TF</div>
                    <p className="text-blue-700">
                        <strong>IDF</strong> (Inverse Document Frequency) is computed at the <strong>Weight</strong> level because it only depends on
                        global term statistics. <strong>TF</strong> (Term Frequency) is computed at the <strong>Scorer</strong> level because it
                        varies per document. This separation avoids redundant computation.
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. DocIdSetIterator (DISI) */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. DocIdSetIterator (DISI)</h2>
                <p className="text-foreground leading-relaxed">
                    The <strong>DocIdSetIterator</strong> (DISI) is the heart of Lucene's query execution. Every query, filter, and scorer
                    ultimately reduces to iterating over document IDs. Understanding DISI patterns is essential for understanding why
                    certain queries are fast and others are slow.
                </p>
                <p className="text-foreground leading-relaxed">
                    All DISI implementations return documents in <strong>increasing docID order</strong> within a segment. This monotonic
                    ordering enables efficient set operations (intersection, union) via merge-like algorithms. The key methods are
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm mx-1">nextDoc()</code> and
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm mx-1">advance(target)</code>.
                </p>

                {/* Core Methods */}
                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg space-y-4">
                    <div className="font-bold text-sm mb-4">Core DISI Methods</div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white border border-zinc-200 p-4 rounded-lg">
                            <code className="text-blue-600 font-bold">int nextDoc()</code>
                            <p className="text-sm text-zinc-600 mt-2">
                                Advance to the next matching document. Returns <code>NO_MORE_DOCS</code> when exhausted.
                            </p>
                        </div>
                        <div className="bg-white border border-zinc-200 p-4 rounded-lg">
                            <code className="text-purple-600 font-bold">int advance(int target)</code>
                            <p className="text-sm text-zinc-600 mt-2">
                                Skip to <code>target</code> or beyond. Essential for efficient intersection.
                            </p>
                        </div>
                        <div className="bg-white border border-zinc-200 p-4 rounded-lg">
                            <code className="text-green-600 font-bold">int docID()</code>
                            <p className="text-sm text-zinc-600 mt-2">
                                Return current document ID. Returns -1 before first nextDoc().
                            </p>
                        </div>
                        <div className="bg-white border border-zinc-200 p-4 rounded-lg">
                            <code className="text-amber-600 font-bold">long cost()</code>
                            <p className="text-sm text-zinc-600 mt-2">
                                Estimated number of matching docs. Used for optimization decisions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Key DISI Implementations */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold">Key DISI Implementations</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border border-zinc-200 rounded-lg overflow-hidden">
                            <thead className="bg-zinc-100">
                                <tr>
                                    <th className="text-left p-3 font-bold">Class</th>
                                    <th className="text-left p-3 font-bold">Purpose</th>
                                    <th className="text-left p-3 font-bold">Strategy</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                <tr className="border-t border-zinc-100">
                                    <td className="p-3 font-mono text-blue-600">TermScorer</td>
                                    <td className="p-3">Single term matches</td>
                                    <td className="p-3">Iterate posting list</td>
                                </tr>
                                <tr className="border-t border-zinc-100 bg-zinc-50">
                                    <td className="p-3 font-mono text-purple-600">ConjunctionDISI</td>
                                    <td className="p-3">AND queries</td>
                                    <td className="p-3">Intersection via leap-frog</td>
                                </tr>
                                <tr className="border-t border-zinc-100">
                                    <td className="p-3 font-mono text-green-600">DisjunctionDISI</td>
                                    <td className="p-3">OR queries</td>
                                    <td className="p-3">Union via priority queue</td>
                                </tr>
                                <tr className="border-t border-zinc-100 bg-zinc-50">
                                    <td className="p-3 font-mono text-red-600">ReqExclScorer</td>
                                    <td className="p-3">MUST_NOT handling</td>
                                    <td className="p-3">Skip excluded docs</td>
                                </tr>
                                <tr className="border-t border-zinc-100">
                                    <td className="p-3 font-mono text-amber-600">BlockMaxDISI</td>
                                    <td className="p-3">Early termination</td>
                                    <td className="p-3">Skip low-scoring blocks</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 3. Conjunction: The Leap-Frog Algorithm */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Conjunction: The Leap-Frog Algorithm</h2>
                <p className="text-foreground leading-relaxed">
                    For AND queries (<code className="bg-muted px-1.5 py-0.5 rounded text-sm">A AND B AND C</code>), Lucene uses the
                    <strong> leap-frog algorithm</strong>. Instead of scanning all documents, iterators "leap" over each other to find
                    common documents efficiently. This is why AND queries are typically faster than OR queries.
                </p>
                <p className="text-foreground leading-relaxed">
                    The algorithm exploits the fact that DISI returns documents in sorted order. When iterator A is at doc 5 and B is at
                    doc 10, we can skip A directly to 10 (or beyond) without checking docs 6-9. This optimization is dramatic when
                    intersecting large posting lists with small ones.
                </p>

                {/* Algorithm Visualization */}
                <div className="bg-zinc-900 text-zinc-100 p-6 rounded-lg font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># Leap-Frog Algorithm for A AND B AND C</div>
                    <div className="space-y-1 text-[13px]">
                        <div><span className="text-pink-400">def</span> <span className="text-yellow-300">leap_frog</span><span className="text-zinc-300">(iterators):</span></div>
                        <div className="pl-4"><span className="text-pink-400">while</span> <span className="text-cyan-300">True</span><span className="text-zinc-300">:</span></div>
                        <div className="pl-8"><span className="text-zinc-500"># Find current min/max docID</span></div>
                        <div className="pl-8"><span className="text-zinc-300">min_doc = </span><span className="text-yellow-300">min</span><span className="text-zinc-300">(it.doc_id() </span><span className="text-pink-400">for</span><span className="text-zinc-300"> it </span><span className="text-pink-400">in</span><span className="text-zinc-300"> iterators)</span></div>
                        <div className="pl-8"><span className="text-zinc-300">max_doc = </span><span className="text-yellow-300">max</span><span className="text-zinc-300">(it.doc_id() </span><span className="text-pink-400">for</span><span className="text-zinc-300"> it </span><span className="text-pink-400">in</span><span className="text-zinc-300"> iterators)</span></div>
                        <div className="pl-8"></div>
                        <div className="pl-8"><span className="text-pink-400">if</span><span className="text-zinc-300"> min_doc == max_doc:</span></div>
                        <div className="pl-12"><span className="text-zinc-500"># All aligned → MATCH!</span></div>
                        <div className="pl-12"><span className="text-pink-400">yield</span><span className="text-zinc-300"> min_doc</span></div>
                        <div className="pl-12"><span className="text-zinc-300">advance_all(iterators)</span></div>
                        <div className="pl-8"><span className="text-pink-400">else</span><span className="text-zinc-300">:</span></div>
                        <div className="pl-12"><span className="text-zinc-500"># Leap to max_doc</span></div>
                        <div className="pl-12"><span className="text-pink-400">for</span><span className="text-zinc-300"> it </span><span className="text-pink-400">in</span><span className="text-zinc-300"> iterators:</span></div>
                        <div className="pl-16"><span className="text-pink-400">if</span><span className="text-zinc-300"> it.doc_id() {'<'} max_doc:</span></div>
                        <div className="pl-20"><span className="text-zinc-300">it.advance(max_doc)</span></div>
                    </div>
                </div>

                {/* Visual Example */}
                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg space-y-4">
                    <div className="font-bold text-sm">Example: "blue" AND "shoes"</div>
                    <div className="space-y-3 font-mono text-sm">
                        <div className="flex items-center gap-4">
                            <span className="text-blue-600 font-bold w-20">"blue"</span>
                            <div className="flex gap-2">
                                <span className="bg-blue-100 px-2 py-1 rounded">1</span>
                                <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-400">3</span>
                                <span className="bg-blue-100 px-2 py-1 rounded">5</span>
                                <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-400">7</span>
                                <span className="bg-blue-100 px-2 py-1 rounded">12</span>
                                <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-400">15</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-purple-600 font-bold w-20">"shoes"</span>
                            <div className="flex gap-2">
                                <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-400">2</span>
                                <span className="bg-purple-100 px-2 py-1 rounded">5</span>
                                <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-400">8</span>
                                <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-400">10</span>
                                <span className="bg-purple-100 px-2 py-1 rounded">12</span>
                                <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-400">20</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 pt-2 border-t border-zinc-200">
                            <span className="text-green-600 font-bold w-20">Result</span>
                            <div className="flex gap-2">
                                <span className="bg-green-500 text-white px-2 py-1 rounded font-bold">5</span>
                                <span className="bg-green-500 text-white px-2 py-1 rounded font-bold">12</span>
                            </div>
                            <span className="text-zinc-500 text-xs ml-4">Only checked 6 positions, not 12!</span>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-green-800 mb-2">Optimization: Sort by Cost</div>
                    <p className="text-green-700">
                        Lucene sorts sub-queries by <code>cost()</code> (estimated matching docs) and puts the <strong>cheapest first</strong>.
                        This minimizes advance() calls because the smallest iterator drives the leap-frog. If "blue" matches 100 docs and
                        "electronics" matches 1M, we iterate "blue" and check "electronics" only 100 times.
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 4. Disjunction: Priority Queue */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Disjunction: Priority Queue</h2>
                <p className="text-foreground leading-relaxed">
                    For OR queries (<code className="bg-muted px-1.5 py-0.5 rounded text-sm">A OR B OR C</code>), Lucene uses a
                    <strong> min-heap priority queue</strong>. All iterators are placed in a heap ordered by current docID. We pop the
                    minimum, collect all iterators at that docID, compute the combined score, then advance and re-insert them.
                </p>
                <p className="text-foreground leading-relaxed">
                    Disjunctions are more expensive than conjunctions because we must visit ALL matching documents from any sub-query.
                    However, optimizations like <Link href="/search/retrieval/wand" className="text-primary hover:underline">WAND</Link> can
                    skip documents that can&apos;t make it into the top-K results.
                </p>

                {/* Algorithm */}
                <div className="bg-zinc-900 text-zinc-100 p-6 rounded-lg font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># Priority Queue for A OR B OR C</div>
                    <div className="space-y-1 text-[13px]">
                        <div><span className="text-pink-400">def</span> <span className="text-yellow-300">disjunction</span><span className="text-zinc-300">(iterators):</span></div>
                        <div className="pl-4"><span className="text-zinc-300">heap = </span><span className="text-yellow-300">MinHeap</span><span className="text-zinc-300">(iterators, key=doc_id)</span></div>
                        <div className="pl-4"></div>
                        <div className="pl-4"><span className="text-pink-400">while</span><span className="text-zinc-300"> heap:</span></div>
                        <div className="pl-8"><span className="text-zinc-500"># Pop all at minimum docID</span></div>
                        <div className="pl-8"><span className="text-zinc-300">min_doc = heap.peek().doc_id()</span></div>
                        <div className="pl-8"><span className="text-zinc-300">score = </span><span className="text-orange-300">0</span></div>
                        <div className="pl-8"></div>
                        <div className="pl-8"><span className="text-pink-400">while</span><span className="text-zinc-300"> heap.peek().doc_id() == min_doc:</span></div>
                        <div className="pl-12"><span className="text-zinc-300">it = heap.pop()</span></div>
                        <div className="pl-12"><span className="text-zinc-300">score += it.score()  </span><span className="text-zinc-500"># Sum scores</span></div>
                        <div className="pl-12"><span className="text-zinc-300">it.next_doc()</span></div>
                        <div className="pl-12"><span className="text-pink-400">if</span><span className="text-zinc-300"> it.doc_id() != NO_MORE_DOCS:</span></div>
                        <div className="pl-16"><span className="text-zinc-300">heap.push(it)</span></div>
                        <div className="pl-8"></div>
                        <div className="pl-8"><span className="text-pink-400">yield</span><span className="text-zinc-300"> (min_doc, score)</span></div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                        <div className="font-bold text-purple-800 mb-2">MinShouldMatch Optimization</div>
                        <p className="text-sm text-purple-700">
                            When <code>minimum_should_match</code> is set (e.g., "at least 2 of 5 terms"), Lucene can skip documents
                            that only match one clause. The heap tracks how many iterators are at each docID.
                        </p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                        <div className="font-bold text-amber-800 mb-2">Score Combination</div>
                        <p className="text-sm text-amber-700">
                            For disjunctions, scores from matching clauses are <strong>summed</strong>. A document matching "laptop OR
                            notebook OR computer" gets higher score if it matches all three terms.
                        </p>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. TwoPhaseIterator */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. TwoPhaseIterator</h2>
                <p className="text-foreground leading-relaxed">
                    Some queries have expensive match conditions. For example, phrase query "quick brown fox" must verify that terms
                    appear <strong>consecutively</strong>—a position check that requires reading position data. TwoPhaseIterator
                    separates the cheap "might match" check from the expensive "definitely matches" confirmation.
                </p>
                <p className="text-foreground leading-relaxed">
                    This optimization is crucial for phrase queries, span queries, and any query with a cheap approximation but
                    expensive verification. The first phase narrows candidates using the posting list intersection; the second phase
                    confirms matches by checking positions.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg space-y-3">
                        <div className="flex items-center gap-2 font-bold text-blue-800">
                            <Zap className="w-5 h-5" /> Phase 1: Approximation
                        </div>
                        <p className="text-sm text-blue-700">
                            Fast check using posting lists. For phrase "quick brown fox": does doc contain all three terms?
                        </p>
                        <div className="bg-white border border-blue-200 p-3 rounded text-sm font-mono">
                            approximation().nextDoc()
                        </div>
                        <div className="text-xs text-blue-600">Cost: O(posting list intersection)</div>
                    </div>

                    <div className="bg-green-50 border border-green-200 p-6 rounded-lg space-y-3">
                        <div className="flex items-center gap-2 font-bold text-green-800">
                            <CheckCircle2 className="w-5 h-5" /> Phase 2: Confirmation
                        </div>
                        <p className="text-sm text-green-700">
                            Expensive verification. For phrase "quick brown fox": do terms appear consecutively?
                        </p>
                        <div className="bg-white border border-green-200 p-3 rounded text-sm font-mono">
                            matches() → true/false
                        </div>
                        <div className="text-xs text-green-600">Cost: O(position reading)</div>
                    </div>
                </div>

                {/* Code Example */}
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">two_phase_iterator.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">from abc import</span><span className="text-zinc-300"> ABC, abstractmethod</span></div>
                            <div></div>
                            <div><span className="text-pink-400">class</span> <span className="text-yellow-300">TwoPhaseIterator</span><span className="text-zinc-300">(ABC):</span></div>
                            <div className="pl-4"><span className="text-zinc-500"># Fast iterator over candidates</span></div>
                            <div className="pl-4"><span className="text-purple-400">@abstractmethod</span></div>
                            <div className="pl-4"><span className="text-pink-400">def</span> <span className="text-yellow-300">approximation</span>(<span className="text-orange-300">self</span>) -{'>'} <span className="text-green-400">DocIdSetIterator</span>: ...</div>
                            <div className="pl-4"></div>
                            <div className="pl-4"><span className="text-zinc-500"># True if current doc matches (expensive)</span></div>
                            <div className="pl-4"><span className="text-purple-400">@abstractmethod</span></div>
                            <div className="pl-4"><span className="text-pink-400">def</span> <span className="text-yellow-300">matches</span>(<span className="text-orange-300">self</span>) -{'>'} <span className="text-green-400">bool</span>: ...</div>
                            <div className="pl-4"></div>
                            <div className="pl-4"><span className="text-zinc-500"># Hint for optimization (higher = more expensive)</span></div>
                            <div className="pl-4"><span className="text-purple-400">@abstractmethod</span></div>
                            <div className="pl-4"><span className="text-pink-400">def</span> <span className="text-yellow-300">match_cost</span>(<span className="text-orange-300">self</span>) -{'>'} <span className="text-green-400">float</span>: ...</div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 6. Query Rewriting */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">6. Query Rewriting</h2>
                <p className="text-foreground leading-relaxed">
                    Before execution, queries are <strong>rewritten</strong> into optimized, executable forms. This transformation
                    expands wildcards, simplifies Boolean logic, and enables accurate cost estimation. Rewriting requires an IndexReader
                    because the final form depends on what terms exist in the index.
                </p>
                <p className="text-foreground leading-relaxed">
                    Rewriting is a multi-pass process. <code className="bg-muted px-1.5 py-0.5 rounded text-sm">Query.rewrite(IndexReader)</code>
                    is called repeatedly until the query returns itself (no more transformations possible). This is why wildcard queries
                    can be slow: they must enumerate matching terms before execution can begin.
                </p>

                {/* Rewriting Examples */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold">Common Rewrites</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border border-zinc-200 rounded-lg overflow-hidden">
                            <thead className="bg-zinc-100">
                                <tr>
                                    <th className="text-left p-3 font-bold">Original Query</th>
                                    <th className="text-left p-3 font-bold">Rewritten Form</th>
                                    <th className="text-left p-3 font-bold">Why</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                <tr className="border-t border-zinc-100">
                                    <td className="p-3 font-mono text-sm">title:lap*</td>
                                    <td className="p-3 font-mono text-sm">BooleanQuery(OR: laptop, lap, lapel, ...)</td>
                                    <td className="p-3">Expand wildcard to actual terms</td>
                                </tr>
                                <tr className="border-t border-zinc-100 bg-zinc-50">
                                    <td className="p-3 font-mono text-sm">+A +B -C <span className="text-zinc-400">(C=0 docs)</span></td>
                                    <td className="p-3 font-mono text-sm">+A +B</td>
                                    <td className="p-3">Eliminate no-op clauses</td>
                                </tr>
                                <tr className="border-t border-zinc-100">
                                    <td className="p-3 font-mono text-sm">BooleanQuery(MUST: A)</td>
                                    <td className="p-3 font-mono text-sm">A</td>
                                    <td className="p-3">Unwrap single-clause BooleanQuery</td>
                                </tr>
                                <tr className="border-t border-zinc-100 bg-zinc-50">
                                    <td className="p-3 font-mono text-sm">ConstantScoreQuery(q)</td>
                                    <td className="p-3 font-mono text-sm">q (with score=1.0)</td>
                                    <td className="p-3">Remove scoring overhead</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <div className="font-bold text-red-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> Wildcard Warning
                    </div>
                    <p className="text-sm text-red-700">
                        Leading wildcards (<code>*laptop</code>) can be extremely slow because they match potentially millions of terms.
                        The rewrite phase must enumerate all matching terms before execution begins. Use edge-ngram tokenization instead.
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 7. Profile API */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">7. Profile API</h2>
                <p className="text-foreground leading-relaxed">
                    Elasticsearch's Profile API provides detailed timing breakdowns for query execution. Add
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm mx-1">"profile": true</code> to any search request to see
                    where time is spent. This is essential for diagnosing slow queries—but note that profiling adds ~10× overhead,
                    so never use it in production.
                </p>
                <p className="text-foreground leading-relaxed">
                    The profile output is structured per-shard and shows the actual Lucene query types (which may differ from your
                    Elasticsearch Query DSL after rewriting). Each query component shows its breakdown of low-level timing metrics.
                </p>

                {/* Profile Request */}
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">profile_request.json</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-white">{'{'}</span></div>
                            <div className="pl-4"><span className="text-green-300">"profile"</span><span className="text-white">: </span><span className="text-orange-300">true</span><span className="text-white">,</span></div>
                            <div className="pl-4"><span className="text-green-300">"query"</span><span className="text-white">: {'{'}</span></div>
                            <div className="pl-8"><span className="text-green-300">"bool"</span><span className="text-white">: {'{'}</span></div>
                            <div className="pl-12"><span className="text-green-300">"must"</span><span className="text-white">: [{'{'} </span><span className="text-green-300">"match"</span><span className="text-white">: {'{'} </span><span className="text-green-300">"title"</span><span className="text-white">: </span><span className="text-orange-300">"laptop"</span><span className="text-white"> {'}'} {'}'}],</span></div>
                            <div className="pl-12"><span className="text-green-300">"filter"</span><span className="text-white">: [{'{'} </span><span className="text-green-300">"range"</span><span className="text-white">: {'{'} </span><span className="text-green-300">"price"</span><span className="text-white">: {'{'} </span><span className="text-green-300">"lte"</span><span className="text-white">: </span><span className="text-orange-300">1000</span><span className="text-white"> {'}'} {'}'} {'}'}]</span></div>
                            <div className="pl-8"><span className="text-white">{'}'}</span></div>
                            <div className="pl-4"><span className="text-white">{'}'}</span></div>
                            <div><span className="text-white">{'}'}</span></div>
                        </div>
                    </div>
                </div>

                {/* Breakdown Metrics */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold">Key Breakdown Metrics</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                            <code className="text-blue-600 font-bold">create_weight</code>
                            <p className="text-sm text-zinc-600 mt-1">Time to create Weight object (IDF calculation, query normalization)</p>
                        </div>
                        <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                            <code className="text-purple-600 font-bold">build_scorer</code>
                            <p className="text-sm text-zinc-600 mt-1">Time to create Scorer for each segment (posting list setup)</p>
                        </div>
                        <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                            <code className="text-green-600 font-bold">next_doc</code>
                            <p className="text-sm text-zinc-600 mt-1">Time iterating to next matching document (posting list traversal)</p>
                        </div>
                        <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                            <code className="text-amber-600 font-bold">advance</code>
                            <p className="text-sm text-zinc-600 mt-1">Time skipping to target docID (skip list navigation)</p>
                        </div>
                        <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                            <code className="text-red-600 font-bold">score</code>
                            <p className="text-sm text-zinc-600 mt-1">Time computing relevance scores (TF-IDF/BM25 calculation)</p>
                        </div>
                        <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                            <code className="text-pink-600 font-bold">match</code>
                            <p className="text-sm text-zinc-600 mt-1">Time in TwoPhaseIterator.matches() (phrase/span verification)</p>
                        </div>
                    </div>
                </div>

                {/* Common Patterns */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="font-bold text-blue-800 mb-3">Diagnosing Slow Queries</div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                        <div>
                            <strong>High next_doc:</strong> Large posting lists being traversed. Consider more selective filters.
                        </div>
                        <div>
                            <strong>High build_scorer:</strong> Complex query structure. Simplify boolean combinations.
                        </div>
                        <div>
                            <strong>High match:</strong> Expensive TwoPhaseIterator (phrase queries). Consider shingles.
                        </div>
                        <div>
                            <strong>High score:</strong> Complex similarity function. Avoid scripts in scoring.
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 8. Distributed Execution */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">8. Distributed Execution</h2>
                <p className="text-foreground leading-relaxed">
                    Elasticsearch distributes queries across multiple <Link href="/search/indexing/sharding" className="text-primary hover:underline">shards</Link>.
                    The <strong>query-then-fetch</strong> model minimizes network traffic by first collecting just docIDs and scores,
                    then fetching full documents only for the final top-K results.
                </p>
                <p className="text-foreground leading-relaxed">
                    This two-phase approach is crucial for efficiency. If we fetched full documents immediately, a query requesting
                    top-10 results from 5 shards would transfer 50 full documents over the network, only to discard 40 of them.
                    With query-then-fetch, we transfer only 50 lightweight (docID, score) pairs in phase 1.
                </p>

                {/* Two Phases */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg space-y-4">
                        <div className="flex items-center gap-2 font-bold text-lg text-blue-800">
                            <Search className="w-5 h-5" /> Phase 1: Query
                        </div>
                        <ol className="text-sm text-blue-700 space-y-2">
                            <li className="flex gap-2"><span className="font-bold">1.</span> Coordinator routes to relevant shards</li>
                            <li className="flex gap-2"><span className="font-bold">2.</span> Each shard executes query locally</li>
                            <li className="flex gap-2"><span className="font-bold">3.</span> Returns top-K (docID, score) pairs</li>
                            <li className="flex gap-2"><span className="font-bold">4.</span> Coordinator merges and re-sorts globally</li>
                        </ol>
                    </div>

                    <div className="bg-green-50 border border-green-200 p-6 rounded-lg space-y-4">
                        <div className="flex items-center gap-2 font-bold text-lg text-green-800">
                            <Database className="w-5 h-5" /> Phase 2: Fetch
                        </div>
                        <ol className="text-sm text-green-700 space-y-2">
                            <li className="flex gap-2"><span className="font-bold">1.</span> Coordinator identifies global top-K</li>
                            <li className="flex gap-2"><span className="font-bold">2.</span> Requests full documents from owning shards</li>
                            <li className="flex gap-2"><span className="font-bold">3.</span> Assembles final response</li>
                            <li className="flex gap-2"><span className="font-bold">4.</span> Returns to client</li>
                        </ol>
                    </div>
                </div>

                {/* Visualization */}
                <div className="bg-zinc-900 text-zinc-100 p-6 rounded-lg font-mono text-sm">
                    <div className="text-zinc-400 mb-4">// Query-Then-Fetch Flow</div>
                    <div className="space-y-2">
                        <div className="text-cyan-400">Client → Coordinator: "search for laptop, top 10"</div>
                        <div className="text-zinc-500">│</div>
                        <div className="text-blue-400">Phase 1: Query</div>
                        <div className="pl-4 text-zinc-300">Coordinator → Shard₁, Shard₂, Shard₃: "execute query, return top 10"</div>
                        <div className="pl-4 text-zinc-300">Shard₁ → Coordinator: [(doc5, 4.2), (doc12, 3.8), ...]</div>
                        <div className="pl-4 text-zinc-300">Shard₂ → Coordinator: [(doc99, 5.1), (doc45, 2.9), ...]</div>
                        <div className="pl-4 text-zinc-300">Shard₃ → Coordinator: [(doc7, 4.0), ...]</div>
                        <div className="text-zinc-500">│</div>
                        <div className="text-green-400">Phase 2: Fetch</div>
                        <div className="pl-4 text-zinc-300">Coordinator: merge → global top 10 = [doc99, doc5, doc7, ...]</div>
                        <div className="pl-4 text-zinc-300">Coordinator → Shard₂: "fetch doc99"</div>
                        <div className="pl-4 text-zinc-300">Coordinator → Shard₁: "fetch doc5"</div>
                        <div className="pl-4 text-zinc-300">...</div>
                        <div className="text-zinc-500">│</div>
                        <div className="text-cyan-400">Coordinator → Client: [full results with _source]</div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between pt-8 border-t border-border">
                <Link
                    href="/search/retrieval/filters"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <div>
                        <div className="text-xs text-muted-foreground">Previous</div>
                        <div className="font-medium">Filters & Facets</div>
                    </div>
                </Link>
                <Link
                    href="/search/retrieval/wand"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors sm:flex-row-reverse sm:text-right"
                >
                    <ArrowRight className="w-4 h-4" />
                    <div>
                        <div className="text-xs text-muted-foreground">Next Chapter</div>
                        <div className="font-medium">WAND & Early Termination</div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
