"use client";

import Link from "next/link";
import { Filter, Layers, Database, Cpu, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Binary, BarChart3, Zap, Search, Grid, Server } from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Filters Don't Score", description: "Filters are binary (yes/no) and highly cacheable. Put constraints in filter context, not must." },
    { title: "Faceting Needs DocValues", description: "Column-oriented storage (DocValues) is essential for efficient aggregation. Never facet on text fields." },
    { title: "Post-Filter Pattern", description: "Use post_filter to separate result filtering from aggregation counts for proper faceted navigation." },
    { title: "Roaring Bitmaps", description: "Industry-standard compressed bitsets that adapt to data density. Powers all modern filter caching." },
];

export default function FiltersPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero Section */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 5.4</span>
                        <span>Retrieval Architecture</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Filters, Facets & Constraints</h1>

                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            Retrieval finds candidates. Filters narrow them down. Facets provide navigation.
                        </p>
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                        This chapter covers the data structures and algorithms that power the "refine your search" experience.
                        Without efficient filtering, every search would require scoring millions of documents.
                    </p>
                </div>

                {/* Stats Row */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm">
                            <Filter className="w-4 h-4" /> Filter Speed
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">10ms</p>
                        <p className="text-sm text-zinc-600">Filter 1M docs to 5K candidates using cached bitsets.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-purple-700 font-medium text-sm">
                            <BarChart3 className="w-4 h-4" /> Facet Counts
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">~100</p>
                        <p className="text-sm text-zinc-600">Typical facet cardinality for navigable categories.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm">
                            <Search className="w-4 h-4" /> Cache Hit Rate
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">95%+</p>
                        <p className="text-sm text-zinc-600">Filter cache hit rate in production systems.</p>
                    </div>
                </div>
            </div>

            {/* 1. The Fundamental Split */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. The Fundamental Split</h2>
                <p className="text-foreground leading-relaxed">
                    Before diving into implementation, understand the three distinct concepts. They look similar in a UI but have very different performance characteristics.
                    A well-designed search experience must handle all three correctly, or risk showing incorrect counts, slow responses, or confusing dead-ends.
                </p>
                <p className="text-foreground leading-relaxed">
                    Many junior engineers conflate these terms, leading to bugs like "why do facet counts not match results?" or "why is my filter so slow?"
                    Each serves a distinct purpose: <strong>Filters</strong> exclude documents, <strong>Facets</strong> count values across results, and <strong>Constraints</strong> are the user-facing specifications that drive both.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg space-y-3">
                        <div className="flex items-center gap-2 font-bold text-lg">
                            <Filter className="w-5 h-5 text-blue-600" /> Filters
                        </div>
                        <p className="text-sm text-zinc-600">
                            Binary exclusion: "Is this document in or out?" Affects which documents appear.
                        </p>
                        <div className="bg-white border border-zinc-200 p-3 rounded text-sm">
                            <div className="text-zinc-500 text-xs mb-1">Example</div>
                            <code>in_stock: true</code>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">Cacheable</span>
                            <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">No Score</span>
                        </div>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg space-y-3">
                        <div className="flex items-center gap-2 font-bold text-lg">
                            <BarChart3 className="w-5 h-5 text-purple-600" /> Facets
                        </div>
                        <p className="text-sm text-zinc-600">
                            Counts across results: "How many documents have each value?" Powers the sidebar counts.
                        </p>
                        <div className="bg-white border border-zinc-200 p-3 rounded text-sm">
                            <div className="text-zinc-500 text-xs mb-1">Example</div>
                            <code>Brand: Apple (50), Samsung (30)</code>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded">CPU Intensive</span>
                            <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">Uses DocValues</span>
                        </div>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg space-y-3">
                        <div className="flex items-center gap-2 font-bold text-lg">
                            <Binary className="w-5 h-5 text-amber-600" /> Constraints
                        </div>
                        <p className="text-sm text-zinc-600">
                            The specification that drives both: the actual parameter like "price {'<'} 100".
                        </p>
                        <div className="bg-white border border-zinc-200 p-3 rounded text-sm">
                            <div className="text-zinc-500 text-xs mb-1">Example</div>
                            <code>price: [0 TO 100]</code>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">User Input</span>
                            <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">Drives Both</span>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. Data Structures */}
            <section className="space-y-12">
                <h2 className="text-3xl font-bold">2. Core Data Structures</h2>
                <p className="text-foreground leading-relaxed">
                    Filters and facets rely on different data structures optimized for their specific access patterns.
                    Understanding these is key to performance tuning.
                </p>

                {/* 2.1 Inverted Index for Filtering */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Database className="w-5 h-5 text-blue-600" /> 2.1 Inverted Index for Filtering
                    </h3>
                    <p className="text-foreground leading-relaxed">
                        The <Link href="/search/indexing/inverted-index" className="text-primary hover:underline font-medium">inverted index</Link> maps terms to document IDs. Filtering is fundamentally set intersection.
                        If you haven't already, review <Link href="/search/indexing/inverted-index" className="text-primary hover:underline">Chapter 3.2</Link> for how posting lists work.
                    </p>

                    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg space-y-4">
                        <div className="font-mono text-sm space-y-2">
                            <div className="flex items-center gap-4">
                                <span className="text-blue-600 font-bold w-24">"Blue"</span>
                                <span className="text-zinc-400">→</span>
                                <span>[DocID: 1, 5, 12, 99, 103, ...]</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-red-600 font-bold w-24">"Red"</span>
                                <span className="text-zinc-400">→</span>
                                <span>[DocID: 2, 5, 14, 99, ...]</span>
                            </div>
                        </div>
                        <div className="border-t border-zinc-200 pt-4">
                            <div className="text-sm text-zinc-600 mb-2">Query: <code className="bg-zinc-200 px-1.5 py-0.5 rounded">Blue AND Red</code></div>
                            <div className="flex items-center gap-4 font-mono text-sm">
                                <span className="text-zinc-500">Intersect →</span>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded font-bold">[5, 99]</span>
                            </div>
                        </div>
                    </div>

                    {/* Example */}
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm space-y-2">
                        <div className="font-bold text-blue-800">Example: E-commerce Filter</div>
                        <p className="text-blue-700">
                            User selects "Blue" + "Size: Large" + "In Stock". The engine retrieves posting lists for each term and intersects them.
                            With 1M documents, if each filter has 100K matches, the intersection might yield only 5K candidates.
                        </p>
                    </div>
                </div>

                {/* 2.2 Roaring Bitmaps */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Grid className="w-5 h-5 text-purple-600" /> 2.2 Roaring Bitmaps
                    </h3>
                    <p className="text-foreground leading-relaxed">
                        The industry standard for compressed bitsets used in filter caching. When you apply a filter like <code className="bg-muted px-1.5 py-0.5 rounded text-sm">in_stock: true</code>,
                        the result is a set of matching document IDs—potentially millions. Storing this naively (one bit per doc) wastes memory for sparse results.
                    </p>
                    <p className="text-foreground leading-relaxed">
                        Roaring Bitmaps solve this by dividing the 32-bit docID space into 65,536 "containers" of 65,536 IDs each.
                        Each container independently chooses the most efficient representation based on its density. This makes Roaring
                        10-100× faster than naive bitsets for typical search workloads where result sets are sparse.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                            <div className="font-bold text-sm mb-2">Array Container</div>
                            <div className="text-xs text-zinc-600 mb-3">Used when ≤ 4096 values</div>
                            <div className="font-mono text-xs bg-white p-2 rounded border border-zinc-200">
                                [12, 45, 78, 234, 567]
                            </div>
                            <div className="text-xs text-zinc-500 mt-2">Sorted u16 array</div>
                        </div>
                        <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                            <div className="font-bold text-sm mb-2">Bitmap Container</div>
                            <div className="text-xs text-zinc-600 mb-3">Used when {'>'} 4096 values</div>
                            <div className="font-mono text-xs bg-white p-2 rounded border border-zinc-200">
                                1001001010110101...
                            </div>
                            <div className="text-xs text-zinc-500 mt-2">Fixed 8KB bitmap</div>
                        </div>
                        <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                            <div className="font-bold text-sm mb-2">Run Container</div>
                            <div className="text-xs text-zinc-600 mb-3">Consecutive sequences</div>
                            <div className="font-mono text-xs bg-white p-2 rounded border border-zinc-200">
                                [100-500, 1000-1200]
                            </div>
                            <div className="text-xs text-zinc-500 mt-2">Run-length encoded</div>
                        </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-sm">
                        <div className="font-bold text-purple-800 mb-2">Why Roaring Wins</div>
                        <ul className="text-purple-700 space-y-1">
                            <li>• Adapts to data density automatically per container</li>
                            <li>• Bitwise AND/OR operations work across container types</li>
                            <li>• 10-100× faster than naive bitsets for sparse data</li>
                        </ul>
                    </div>
                </div>

                {/* 2.3 BKD Trees */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Layers className="w-5 h-5 text-amber-600" /> 2.3 BKD Trees for Numeric Constraints
                    </h3>
                    <p className="text-foreground leading-relaxed">
                        Since Lucene 6.0, numeric range queries use <Link href="/search/indexing/bkd-docvalues" className="text-primary hover:underline font-medium">BKD trees</Link> (Block K-Dimensional trees).
                        They're O(log n) for range queries vs O(n) for scanning posting lists. See <Link href="/search/indexing/bkd-docvalues" className="text-primary hover:underline">Chapter 3.3</Link> for the full deep dive.
                    </p>

                    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg">
                        <div className="text-sm font-bold mb-4">Query Execution: <code>price: [100 TO 500]</code></div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded">
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                                <div className="text-sm">
                                    <span className="font-bold text-green-700">Node entirely inside range:</span>
                                    <span className="text-green-600 ml-2">Accept all points (fast)</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded">
                                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                                <div className="text-sm">
                                    <span className="font-bold text-red-700">Node entirely outside range:</span>
                                    <span className="text-red-600 ml-2">Skip subtree (fast)</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded">
                                <Binary className="w-5 h-5 text-amber-600 mt-0.5" />
                                <div className="text-sm">
                                    <span className="font-bold text-amber-700">Node crosses boundary:</span>
                                    <span className="text-amber-600 ml-2">Recurse deeper (slower)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-sm">
                        <div className="font-bold text-amber-800 mb-2">Performance Tip</div>
                        <p className="text-amber-700">
                            Index-sort documents by the most-queried numeric field. This makes data physically contiguous, leading to better cache locality and fewer disk seeks.
                        </p>
                    </div>
                </div>

                {/* 2.4 Doc Values */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Server className="w-5 h-5 text-green-600" /> 2.4 Doc Values (Column Store) for Faceting
                    </h3>
                    <p className="text-foreground leading-relaxed">
                        The inverted index answers: "Which docs have term X?"
                        Faceting needs the opposite: "What terms does doc X have?"
                        <Link href="/search/indexing/bkd-docvalues" className="text-primary hover:underline font-medium">Doc Values</Link> provide column-oriented storage for this pattern. Review <Link href="/search/indexing/bkd-docvalues" className="text-primary hover:underline">Chapter 3.3</Link> for implementation details.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                            <div className="font-bold text-sm mb-3 text-zinc-700">Inverted Index</div>
                            <div className="font-mono text-xs space-y-1 bg-white p-3 rounded border border-zinc-200">
                                <div>"Apple" → [Doc1, Doc3, Doc5]</div>
                                <div>"Samsung" → [Doc2, Doc4]</div>
                            </div>
                            <div className="text-xs text-zinc-500 mt-2">Best for: "Which docs contain 'Apple'?"</div>
                        </div>
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                            <div className="font-bold text-sm mb-3 text-green-700">Doc Values (Column Store)</div>
                            <div className="font-mono text-xs space-y-1 bg-white p-3 rounded border border-green-200">
                                <div>Doc1 → "Apple"</div>
                                <div>Doc2 → "Samsung"</div>
                                <div>Doc3 → "Apple"</div>
                            </div>
                            <div className="text-xs text-green-600 mt-2">Best for: "What brands exist in these 10K docs?"</div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 text-zinc-100 p-4 rounded-lg text-sm font-mono">
                        <div className="text-zinc-400 mb-2">// Memory Model</div>
                        <div className="space-y-1 text-xs">
                            <div className="text-zinc-500">JVM Heap (GC-managed) ← NOT used by DocValues</div>
                            <div className="text-green-400">Disk (.dvd files) ←→ OS Filesystem Cache ←→ CPU</div>
                            <div className="text-zinc-500 pl-20">↑ mmap'd, no GC pauses</div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 3. Filter vs Query */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Filter vs Query Context</h2>
                <p className="text-foreground leading-relaxed">
                    In Elasticsearch/OpenSearch, clauses can run in "query" context (affects score) or "filter" context (binary, cacheable).
                    This distinction is critical for performance—the same clause can be 10× slower in the wrong context.
                </p>
                <p className="text-foreground leading-relaxed">
                    <strong>Query context:</strong> When a clause participates in scoring, it must compute a relevance score for each matching document.
                    This involves reading term frequencies, document lengths, and applying <Link href="/search/retrieval/bm25" className="text-primary hover:underline">BM25</Link> calculations.
                    <strong className="ml-2">Filter context:</strong> Binary yes/no decision. No scoring, results cached as Roaring Bitmaps for reuse.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">filter_vs_query.json</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-white">{'{'}</span></div>
                            <div className="pl-4"><span className="text-green-300">"query"</span><span className="text-white">: {'{'}</span></div>
                            <div className="pl-8"><span className="text-green-300">"bool"</span><span className="text-white">: {'{'}</span></div>
                            <div className="pl-12">
                                <span className="text-green-300">"must"</span><span className="text-white">: [</span>
                                <span className="text-gray-500"> // Affects score</span>
                            </div>
                            <div className="pl-16"><span className="text-white">{'{'} </span><span className="text-green-300">"match"</span><span className="text-white">: {'{'} </span><span className="text-green-300">"title"</span><span className="text-white">: </span><span className="text-orange-300">"laptop"</span><span className="text-white"> {'}'} {'}'}</span></div>
                            <div className="pl-12"><span className="text-white">],</span></div>
                            <div className="pl-12">
                                <span className="text-green-300">"filter"</span><span className="text-white">: [</span>
                                <span className="text-gray-500"> // Binary, cached</span>
                            </div>
                            <div className="pl-16"><span className="text-white">{'{'} </span><span className="text-green-300">"term"</span><span className="text-white">: {'{'} </span><span className="text-green-300">"in_stock"</span><span className="text-white">: </span><span className="text-orange-300">true</span><span className="text-white"> {'}'} {'}'},</span></div>
                            <div className="pl-16"><span className="text-white">{'{'} </span><span className="text-green-300">"range"</span><span className="text-white">: {'{'} </span><span className="text-green-300">"price"</span><span className="text-white">: {'{'} </span><span className="text-green-300">"lte"</span><span className="text-white">: </span><span className="text-orange-300">1000</span><span className="text-white"> {'}'} {'}'} {'}'}</span></div>
                            <div className="pl-12"><span className="text-white">]</span></div>
                            <div className="pl-8"><span className="text-white">{'}'}</span></div>
                            <div className="pl-4"><span className="text-white">{'}'}</span></div>
                            <div><span className="text-white">{'}'}</span></div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <div className="font-bold text-blue-800 mb-2">Execution Order</div>
                        <ol className="text-sm text-blue-700 space-y-2">
                            <li className="flex gap-2"><span className="font-bold">1.</span> Filters run first (fast, cached)</li>
                            <li className="flex gap-2"><span className="font-bold">2.</span> Scoring runs on filtered subset</li>
                            <li className="flex gap-2"><span className="font-bold">3.</span> Result: smaller candidate set for expensive scoring</li>
                        </ol>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                        <div className="font-bold text-zinc-700 mb-2">Filter Cache</div>
                        <div className="font-mono text-xs bg-white p-3 rounded border border-zinc-200 space-y-1">
                            <div><span className="text-zinc-500">Key:</span> hash(field, value, segment_id)</div>
                            <div><span className="text-zinc-500">Value:</span> RoaringBitmap [1, 4, 5, 7, ...]</div>
                        </div>
                        <div className="text-xs text-zinc-500 mt-2">Per-segment, LRU eviction</div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 4. Faceted Navigation */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Faceted Navigation Architecture</h2>
                <p className="text-foreground leading-relaxed">
                    Faceted navigation is the "refine your search" sidebar you see on e-commerce sites. It shows counts for each value,
                    allowing users to drill down without hitting dead-ends. This is the feature that makes or breaks the search UX on sites like Amazon, Airbnb, or Netflix.
                </p>
                <p className="text-foreground leading-relaxed">
                    Computing facet counts requires reading every document in the result set and aggregating field values. This is CPU-intensive,
                    which is why we use <Link href="/search/indexing/bkd-docvalues" className="text-primary hover:underline">Doc Values</Link> (columnar storage) instead of the inverted index.
                    The inverted index answers "which docs have term X?" but faceting needs "what values does doc X have?"—the inverse question.
                </p>

                {/* UI Pattern */}
                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg">
                    <div className="font-bold text-sm mb-4">What the User Sees</div>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded border border-zinc-200">
                            <div className="text-xs text-zinc-500 mb-2">Category</div>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between"><span>Electronics</span><span className="text-zinc-500">(1,234)</span></div>
                                <div className="flex justify-between"><span>Clothing</span><span className="text-zinc-500">(567)</span></div>
                                <div className="flex justify-between"><span>Books</span><span className="text-zinc-500">(890)</span></div>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded border border-zinc-200">
                            <div className="text-xs text-zinc-500 mb-2">Brand</div>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between"><span className="text-blue-600 font-medium">Apple</span><span className="text-zinc-500">(100)</span></div>
                                <div className="flex justify-between"><span>Samsung</span><span className="text-zinc-500">(80)</span></div>
                                <div className="flex justify-between"><span>Sony</span><span className="text-zinc-500">(45)</span></div>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded border border-zinc-200">
                            <div className="text-xs text-zinc-500 mb-2">Price</div>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between"><span>$0-50</span><span className="text-zinc-500">(200)</span></div>
                                <div className="flex justify-between"><span>$50-100</span><span className="text-zinc-500">(350)</span></div>
                                <div className="flex justify-between"><span>$100+</span><span className="text-zinc-500">(884)</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Algorithm */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold">Computing Facet Counts</h3>
                    <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                            <span className="text-muted-foreground">facet_count.py</span>
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20" />
                            </div>
                        </div>
                        <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                            <div className="flex flex-col gap-0.5">
                                <div>
                                    <span className="text-blue-400">def</span> <span className="text-yellow-300">compute_facet</span><span className="text-white">(result_bitset, field, doc_values):</span>
                                </div>
                                <div className="pl-4">
                                    <span className="text-green-400">&quot;&quot;&quot;Count values across result set.&quot;&quot;&quot;</span>
                                </div>
                                <div className="pl-4">
                                    <span className="text-white">counts = defaultdict(int)</span>
                                </div>
                                <div className="pl-4 text-white">&nbsp;</div>
                                <div className="pl-4">
                                    <span className="text-pink-400">for</span> <span className="text-white">doc_id</span> <span className="text-pink-400">in</span> <span className="text-white">result_bitset:</span>
                                </div>
                                <div className="pl-8">
                                    <span className="text-white">value = doc_values.get(doc_id, field)</span>  <span className="text-gray-500"># Column lookup</span>
                                </div>
                                <div className="pl-8">
                                    <span className="text-white">counts[value] += </span><span className="text-orange-300">1</span>
                                </div>
                                <div className="pl-4 text-white">&nbsp;</div>
                                <div className="pl-4">
                                    <span className="text-pink-400">return</span> <span className="text-white">sorted(counts.items(), key=</span><span className="text-pink-400">lambda</span> <span className="text-white">x: -x[</span><span className="text-orange-300">1</span><span className="text-white">])</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. Post-Filter Pattern */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. The Post-Filter Pattern</h2>
                <p className="text-foreground leading-relaxed">
                    The hardest part of faceted navigation is handling the interaction between selected facets and displayed counts.
                    This is where most implementations go wrong—either showing incorrect counts or creating dead-end selections.
                </p>
                <p className="text-foreground leading-relaxed">
                    Consider: when user selects "Color: Red", what should the color facet show? If you filter first, you'd only see "Red (50)"—
                    the user can't see alternatives! The correct behavior is:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-1 ml-4">
                    <li><strong>Results:</strong> Only red products (filtered by selection)</li>
                    <li><strong>Color facet:</strong> Still shows Blue (40), Green (20) so user can switch their selection</li>
                    <li><strong>Other facets:</strong> Only count within red products (combined filters apply)</li>
                </ul>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <div className="font-bold text-amber-800 mb-2">The Solution: post_filter</div>
                    <p className="text-sm text-amber-700">
                        <code>post_filter</code> applies after aggregations run, separating the "hits" from the "counts".
                    </p>
                </div>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">post_filter.json</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-white">{'{'}</span></div>
                            <div className="pl-4"><span className="text-green-300">"query"</span><span className="text-white">: {'{'} </span><span className="text-green-300">"match"</span><span className="text-white">: {'{'} </span><span className="text-green-300">"title"</span><span className="text-white">: </span><span className="text-orange-300">"shoes"</span><span className="text-white"> {'}'} {'}'},</span></div>
                            <div className="pl-4">
                                <span className="text-green-300">"post_filter"</span><span className="text-white">: {'{'} </span><span className="text-green-300">"term"</span><span className="text-white">: {'{'} </span><span className="text-green-300">"color"</span><span className="text-white">: </span><span className="text-orange-300">"red"</span><span className="text-white"> {'}'} {'}'},</span>
                                <span className="text-gray-500"> // Filters hits ONLY</span>
                            </div>
                            <div className="pl-4"><span className="text-green-300">"aggs"</span><span className="text-white">: {'{'}</span></div>
                            <div className="pl-8">
                                <span className="text-green-300">"colors"</span><span className="text-white">: {'{'} </span><span className="text-green-300">"terms"</span><span className="text-white">: {'{'} </span><span className="text-green-300">"field"</span><span className="text-white">: </span><span className="text-orange-300">"color"</span><span className="text-white"> {'}'} {'}'}</span>
                                <span className="text-gray-500"> // Runs on ALL shoes</span>
                            </div>
                            <div className="pl-4"><span className="text-white">{'}'}</span></div>
                            <div><span className="text-white">{'}'}</span></div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                        <div className="text-xs text-zinc-500 mb-1">Step 1</div>
                        <div className="font-bold">Query runs</div>
                        <div className="text-sm text-zinc-600">Gets all shoes</div>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                        <div className="text-xs text-zinc-500 mb-1">Step 2</div>
                        <div className="font-bold">Aggs run</div>
                        <div className="text-sm text-zinc-600">Counts all colors in shoes</div>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                        <div className="text-xs text-zinc-500 mb-1">Step 3</div>
                        <div className="font-bold">Post-filter runs</div>
                        <div className="text-sm text-zinc-600">Filters hits to only red</div>
                    </div>
                </div>

                {/* Practical Example: Nike.com */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-8">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">Case Study</span>
                        <span className="font-bold text-orange-900">Nike.com Shoe Filter</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <p className="text-sm text-orange-800">
                                User searches "running shoes" and selects <strong>Size: 10</strong> + <strong>Color: Black</strong>.
                                What should the facets show?
                            </p>
                            <ul className="space-y-2 text-sm text-orange-700">
                                <li className="flex gap-2"><span className="font-bold">Size facet:</span> Shows sizes available in black running shoes (not filtered by size)</li>
                                <li className="flex gap-2"><span className="font-bold">Color facet:</span> Shows colors available in size 10 running shoes (not filtered by color)</li>
                                <li className="flex gap-2"><span className="font-bold">Brand facet:</span> Shows brands available in size 10 + black running shoes (filtered by both)</li>
                            </ul>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-orange-200">
                            <div className="text-xs text-zinc-500 mb-2">Expected Facet Response</div>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <div className="font-bold text-xs text-zinc-400 mb-1">Size (ignore own filter)</div>
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="bg-zinc-100 px-2 py-0.5 rounded">8 (12)</span>
                                        <span className="bg-zinc-100 px-2 py-0.5 rounded">9 (18)</span>
                                        <span className="bg-orange-200 text-orange-800 px-2 py-0.5 rounded font-bold">10 (15)</span>
                                        <span className="bg-zinc-100 px-2 py-0.5 rounded">11 (8)</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold text-xs text-zinc-400 mb-1">Color (ignore own filter)</div>
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="bg-zinc-800 text-white px-2 py-0.5 rounded font-bold">Black (15)</span>
                                        <span className="bg-zinc-100 px-2 py-0.5 rounded">White (22)</span>
                                        <span className="bg-zinc-100 px-2 py-0.5 rounded">Blue (9)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 6. Distributed Faceting */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">6. Distributed Faceting Challenges</h2>
                <p className="text-foreground leading-relaxed">
                    In a distributed index with multiple <Link href="/search/indexing/sharding" className="text-primary hover:underline font-medium">shards</Link>, facet counts become approximate.
                    Each shard only sees its local data and returns its local top-N values. Review <Link href="/search/indexing/sharding" className="text-primary hover:underline">Chapter 3.6</Link> for sharding architecture details.
                </p>
                <p className="text-foreground leading-relaxed">
                    This is the classic "scatter-gather" problem: the coordinator sends requests to all shards, each shard returns local results,
                    and the coordinator merges them. For scoring, this works well because each document competes individually. For faceting,
                    the counts must be summed across shards—but if a shard doesn't return a value in its top-N, that count is lost.
                </p>

                <div className="bg-red-50 border border-red-200 p-6 rounded-lg space-y-4">
                    <div className="font-bold text-red-800 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        The Scatter-Gather Problem
                    </div>
                    <div className="text-sm text-red-700 space-y-2">
                        <p><strong>Setup:</strong> Index has 5 shards. Query for "laptop" with facet on "brand".</p>
                        <p><strong>Problem:</strong> Shard 1 might have "Lenovo: 50", but it's #11 locally so not returned. Global top-10 becomes inaccurate.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                        <div className="font-bold text-sm mb-3">Solution: shard_size</div>
                        <div className="text-sm text-zinc-600 mb-2">
                            Request more results per shard than needed.
                        </div>
                        <div className="font-mono text-xs bg-white p-2 rounded border border-zinc-200">
                            shard_size = size × 1.5 + 10
                        </div>
                        <div className="text-xs text-zinc-500 mt-2">(Elasticsearch default)</div>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                        <div className="font-bold text-sm mb-3">Solution: HyperLogLog++</div>
                        <div className="text-sm text-zinc-600 mb-2">
                            For high-cardinality counting (unique users, etc.)
                        </div>
                        <div className="font-mono text-xs bg-white p-2 rounded border border-zinc-200">
                            ~40KB memory for 2-3% error
                        </div>
                        <div className="text-xs text-zinc-500 mt-2">Probabilistic estimation</div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 7. Performance Optimization */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">7. Performance Optimization</h2>
                <p className="text-foreground leading-relaxed">
                    Filter and facet performance is dominated by I/O and cache efficiency. The key insight: filters run on immutable
                    <Link href="/search/indexing/segments" className="text-primary hover:underline ml-1">segments</Link>,
                    so caching is extremely effective. Understanding how to optimize both index-time schema decisions and query-time patterns
                    can reduce latency by 10× on complex faceted queries.
                </p>
                <p className="text-foreground leading-relaxed">
                    Focus on two phases: <strong>Index-time</strong> decisions are permanent and affect all queries. <strong>Query-time</strong> optimizations
                    can be applied per-query. Both matter, but index-time decisions have higher leverage.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-zinc-700">Index-Time</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded">
                                <Zap className="w-5 h-5 text-amber-500 mt-0.5" />
                                <div className="text-sm">
                                    <span className="font-bold">Use keyword not text</span>
                                    <div className="text-zinc-500">Enables DocValues, faster aggregation</div>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded">
                                <Zap className="w-5 h-5 text-amber-500 mt-0.5" />
                                <div className="text-sm">
                                    <span className="font-bold">Enable DocValues explicitly</span>
                                    <div className="text-zinc-500">Default for non-text fields, but verify</div>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded">
                                <Zap className="w-5 h-5 text-amber-500 mt-0.5" />
                                <div className="text-sm">
                                    <span className="font-bold">Index sorting</span>
                                    <div className="text-zinc-500">Physical contiguity → better cache locality</div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-zinc-700">Query-Time</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded">
                                <Cpu className="w-5 h-5 text-blue-500 mt-0.5" />
                                <div className="text-sm">
                                    <span className="font-bold">Selective filters first</span>
                                    <div className="text-zinc-500">Reduces candidate set early</div>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded">
                                <Cpu className="w-5 h-5 text-blue-500 mt-0.5" />
                                <div className="text-sm">
                                    <span className="font-bold">Limit facet size</span>
                                    <div className="text-zinc-500">"size": 10, not "size": 10000</div>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded">
                                <Cpu className="w-5 h-5 text-blue-500 mt-0.5" />
                                <div className="text-sm">
                                    <span className="font-bold">Use composite for pagination</span>
                                    <div className="text-zinc-500">For exhaustive faceting over millions</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="bg-zinc-900 text-zinc-100 p-6 rounded-lg">
                    <div className="font-bold mb-3">Filesystem Cache Priority</div>
                    <div className="font-mono text-sm space-y-1">
                        <div className="flex gap-4">
                            <span className="text-green-400 w-32">1. .dvd files</span>
                            <span className="text-zinc-400">DocValues data — Faceting</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-blue-400 w-32">2. .dim/.dii</span>
                            <span className="text-zinc-400">BKD tree — Numeric filters</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-purple-400 w-32">3. .tip/.tim</span>
                            <span className="text-zinc-400">Term index — Text filters</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-amber-400 w-32">4. Postings</span>
                            <span className="text-zinc-400">Scoring (less critical for filters)</span>
                        </div>
                    </div>
                    <div className="text-xs text-zinc-500 mt-4 pt-4 border-t border-zinc-700">
                        Rule of thumb: Leave 50% of RAM for OS filesystem cache
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 8. Industry Case Studies */}
            <section className="bg-zinc-900 text-zinc-100 rounded-xl p-8 border border-zinc-800">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-500" /> Real-World Filter Architectures
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-800 p-5 rounded-lg border border-zinc-700">
                        <div className="font-bold text-blue-400 mb-2">Amazon</div>
                        <div className="text-sm text-zinc-400 space-y-2">
                            <p><strong className="text-zinc-200">Scale:</strong> 350M+ products</p>
                            <p><strong className="text-zinc-200">Strategy:</strong> Pre-computed facet caches per category. Heavy use of shard routing by category.</p>
                            <p><strong className="text-zinc-200">Optimization:</strong> Facets computed at category level, not global query level.</p>
                        </div>
                    </div>
                    <div className="bg-zinc-800 p-5 rounded-lg border border-zinc-700">
                        <div className="font-bold text-green-400 mb-2">Spotify</div>
                        <div className="text-sm text-zinc-400 space-y-2">
                            <p><strong className="text-zinc-200">Scale:</strong> 100M+ tracks</p>
                            <p><strong className="text-zinc-200">Strategy:</strong> BKD trees for Audio Features (tempo, energy, danceability). Enables "mood" filtering.</p>
                            <p><strong className="text-zinc-200">Optimization:</strong> Index-sorted by popularity for early termination.</p>
                        </div>
                    </div>
                    <div className="bg-zinc-800 p-5 rounded-lg border border-zinc-700">
                        <div className="font-bold text-red-400 mb-2">Airbnb</div>
                        <div className="text-sm text-zinc-400 space-y-2">
                            <p><strong className="text-zinc-200">Scale:</strong> 7M+ listings</p>
                            <p><strong className="text-zinc-200">Strategy:</strong> Geo-hashing + date availability filters. BKD trees for price ranges.</p>
                            <p><strong className="text-zinc-200">Challenge:</strong> Availability is highly volatile (requires near real-time updates).</p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/retrieval/bm25" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> TF-IDF and BM25
                </Link>
                <Link href="/search/retrieval/execution-plans" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next: Execution Plans <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
