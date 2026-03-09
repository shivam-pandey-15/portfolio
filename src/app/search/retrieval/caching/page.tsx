"use client";

import Link from "next/link";
import {
    Database,
    Layers,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    AlertTriangle,
    Timer,
    Gauge,
    HardDrive,
    RefreshCw,
    Trash2,
    Clock,
    BarChart3,
    Server,
    Cpu,
    Zap,
    Activity,
    TrendingUp,
    FileText
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Multi-Layer Caching", description: "Production search uses multiple cache layers: CDN for static results, Application (Redis/Memcached) for full query results, Request Cache for aggregations, Query Cache for filter bitsets, and Filesystem Cache for index segments. Each layer serves different data with different TTLs." },
    { title: "Query Cache = Bitsets", description: "Elasticsearch's Query Cache stores filter clause results as compact bitsets (1 bit per document). When the same filter is used again, the engine uses the cached bitset for instant set operations instead of re-evaluating documents. Auto-invalidated when segments merge or documents are updated." },
    { title: "Request Cache = Full Results", description: "The Shard-Level Request Cache stores entire search responses including aggregation results, suggestions, and hit counts. By default, it only caches size:0 queries since returning actual document hits would bloat the cache." },
    { title: "Cache Warming Matters", description: "A cold cache after deployment or cluster restart can overwhelm your backend since every request becomes a cache miss. Proactively warm caches by replaying your top queries (from analytics) before sending live traffic to new nodes." },
];

export default function CachingPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero Section */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 5.7</span>
                        <span>Performance Optimization</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Caching at Retrieval Layer</h1>

                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            A well-designed caching strategy can reduce query latency by 100x and decrease backend load by 90%.
                            This chapter reveals the multi-layer caching architecture that powers fast search.
                        </p>
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                        Caching is not just an optimization—it&apos;s a <strong>necessity</strong> for production search systems.
                        Understanding what to cache, where to cache it, and when to invalidate is the difference between
                        sub-millisecond response times and frustrated users.
                    </p>
                </div>

                {/* Stats Row */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm">
                            <Zap className="w-4 h-4" /> Cache Hit Latency
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">0.1-1ms</p>
                        <p className="text-sm text-zinc-600">In-memory cache hit vs 10-100ms for full query execution.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm">
                            <TrendingUp className="w-4 h-4" /> Query Repetition
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">70%</p>
                        <p className="text-sm text-zinc-600">Top 10% of queries account for 70% of traffic (Zipf&apos;s Law).</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-purple-700 font-medium text-sm">
                            <Gauge className="w-4 h-4" /> Target Hit Rate
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">&gt;80%</p>
                        <p className="text-sm text-zinc-600">Well-tuned production systems achieve 80%+ cache hit rates.</p>
                    </div>
                </div>

                {/* Tip Box */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                        <strong>Prerequisites:</strong> This chapter builds on <Link href="/search/retrieval/execution-plans" className="text-primary hover:underline">Execution Plans</Link> (query pipeline),
                        <Link href="/search/retrieval/filters" className="text-primary hover:underline ml-1">Filters & Facets</Link> (filter context), and
                        <Link href="/search/indexing/segments" className="text-primary hover:underline ml-1">Segments</Link> (index structure).
                    </div>
                </div>
            </div>

            {/* 1. Why Caching Matters */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. Why Caching Matters: Zipf&apos;s Law</h2>
                <p className="text-foreground leading-relaxed">
                    User query behavior follows <strong>Zipf&apos;s Law</strong>: a small number of queries account for
                    a disproportionately large share of traffic. This makes caching extraordinarily effective—cache
                    the top 10% of queries and you serve 70% of traffic from memory.
                </p>

                <p className="text-foreground leading-relaxed">
                    Named after linguist George Zipf, this power-law distribution appears throughout human behavior:
                    the most popular word ("the") appears exponentially more often than the 10th most popular word.
                    Search queries exhibit the same pattern. On any e-commerce site, queries like "iphone" or "nike shoes"
                    appear thousands of times per minute, while long-tail queries like "blue running shoes size 12 wide"
                    might appear once a day. This skewed distribution is the fundamental reason caching works so well
                    for search systems.
                </p>

                <p className="text-foreground leading-relaxed">
                    The practical implication is profound: by caching just a few thousand popular query results, you can
                    serve the majority of your search traffic without touching your index at all. This reduces latency
                    from 50-200ms (index search) to sub-millisecond (cache hit), while simultaneously reducing load on
                    your search cluster. A well-tuned caching strategy can reduce your required Elasticsearch nodes by
                    50% or more, directly impacting infrastructure costs.
                </p>

                {/* Zipf Distribution Visual */}
                <div className="bg-zinc-900 text-zinc-100 p-6 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># Query Distribution (Zipf&apos;s Law)</div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="text-zinc-500 w-28">Top 1%:</span>
                            <div className="flex-1 bg-zinc-800 rounded overflow-hidden">
                                <div className="bg-green-500 h-6" style={{ width: '30%' }}></div>
                            </div>
                            <span className="text-green-400 w-20">30% traffic</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-zinc-500 w-28">Top 10%:</span>
                            <div className="flex-1 bg-zinc-800 rounded overflow-hidden">
                                <div className="bg-blue-500 h-6" style={{ width: '70%' }}></div>
                            </div>
                            <span className="text-blue-400 w-20">70% traffic</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-zinc-500 w-28">Top 20%:</span>
                            <div className="flex-1 bg-zinc-800 rounded overflow-hidden">
                                <div className="bg-purple-500 h-6" style={{ width: '85%' }}></div>
                            </div>
                            <span className="text-purple-400 w-20">85% traffic</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-zinc-500 w-28">Long tail:</span>
                            <div className="flex-1 bg-zinc-800 rounded overflow-hidden">
                                <div className="bg-zinc-600 h-6" style={{ width: '15%' }}></div>
                            </div>
                            <span className="text-zinc-400 w-20">15% traffic</span>
                        </div>
                    </div>
                    <div className="border-t border-zinc-700 mt-4 pt-4 text-zinc-400 text-xs">
                        Cache the head → serve most traffic from memory → reduce load on scoring/disk
                    </div>
                </div>

                {/* Latency comparison */}
                <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-100">
                            <tr>
                                <th className="text-left p-4 font-semibold">Operation</th>
                                <th className="text-left p-4 font-semibold">Typical Latency</th>
                                <th className="text-left p-4 font-semibold">Comparison</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-border">
                                <td className="p-4 font-medium">Cache hit (in-memory)</td>
                                <td className="p-4 text-green-700 font-bold">0.1-1 ms</td>
                                <td className="p-4 text-green-600">Baseline</td>
                            </tr>
                            <tr className="border-t border-border bg-zinc-50">
                                <td className="p-4 font-medium">SSD read</td>
                                <td className="p-4">0.1-1 ms</td>
                                <td className="p-4">~1x</td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="p-4 font-medium">Posting list scan</td>
                                <td className="p-4">1-10 ms</td>
                                <td className="p-4 text-yellow-700">10x slower</td>
                            </tr>
                            <tr className="border-t border-border bg-zinc-50">
                                <td className="p-4 font-medium">Full BM25 scoring</td>
                                <td className="p-4">10-100 ms</td>
                                <td className="p-4 text-red-700">100x slower</td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="p-4 font-medium">Complex aggregation</td>
                                <td className="p-4">50-500 ms</td>
                                <td className="p-4 text-red-700">500x slower</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. Multi-Layer Architecture */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Multi-Layer Caching Architecture</h2>
                <p className="text-foreground leading-relaxed">
                    Production search systems use multiple caching layers, each serving different purposes with different
                    invalidation strategies. Understanding this stack is key to optimizing your search performance.
                </p>

                <p className="text-foreground leading-relaxed">
                    Think of the cache layers like a pyramid: at the top (closest to users) are CDN caches for static content
                    like autocomplete suggestions and popular category pages. These caches are large, geographically distributed,
                    and have long TTLs because the content rarely changes. Below that sits your application cache (Redis or
                    Memcached), storing full query results for popular searches. The application cache is centralized and faster
                    to invalidate when content changes.
                </p>

                <p className="text-foreground leading-relaxed">
                    At the Elasticsearch level, two caches work in tandem: the <strong>Request Cache</strong> stores complete
                    response payloads (aggregations, suggestions) at the shard level, while the <strong>Query Cache</strong>
                    stores filter clause results as bitsets at the node level. Finally, the OS filesystem cache keeps frequently
                    accessed index segments in memory. Each layer trades off hit rate, invalidation complexity, and storage
                    efficiency differently—the key is configuring them to complement each other.
                </p>

                {/* Layer Stack Visual */}
                <div className="bg-gradient-to-b from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-xl">
                    <h3 className="font-bold text-blue-800 mb-6 text-lg text-center">Caching Layer Stack</h3>
                    <div className="space-y-3 max-w-2xl mx-auto">
                        <div className="bg-white border-2 border-cyan-300 p-4 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Server className="w-5 h-5 text-cyan-600" />
                                    <span className="font-bold text-cyan-700">CDN Cache</span>
                                </div>
                                <span className="text-xs text-cyan-600 bg-cyan-100 px-2 py-1 rounded">Static results, autocomplete</span>
                            </div>
                        </div>
                        <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-zinc-400 rotate-90" /></div>
                        <div className="bg-white border-2 border-green-300 p-4 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Database className="w-5 h-5 text-green-600" />
                                    <span className="font-bold text-green-700">Application Cache</span>
                                </div>
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Redis/Memcached - full query results</span>
                            </div>
                        </div>
                        <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-zinc-400 rotate-90" /></div>
                        <div className="bg-white border-2 border-purple-300 p-4 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Layers className="w-5 h-5 text-purple-600" />
                                    <span className="font-bold text-purple-700">Request Cache</span>
                                </div>
                                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">Shard-level - aggregations</span>
                            </div>
                        </div>
                        <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-zinc-400 rotate-90" /></div>
                        <div className="bg-white border-2 border-orange-300 p-4 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-orange-600" />
                                    <span className="font-bold text-orange-700">Query Cache</span>
                                </div>
                                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Node-level - filter bitsets</span>
                            </div>
                        </div>
                        <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-zinc-400 rotate-90" /></div>
                        <div className="bg-white border-2 border-zinc-300 p-4 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <HardDrive className="w-5 h-5 text-zinc-600" />
                                    <span className="font-bold text-zinc-700">Filesystem Cache</span>
                                </div>
                                <span className="text-xs text-zinc-600 bg-zinc-100 px-2 py-1 rounded">OS page cache - index segments</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Layer comparison table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                        <thead className="bg-zinc-100">
                            <tr>
                                <th className="text-left p-4 font-semibold">Layer</th>
                                <th className="text-left p-4 font-semibold">What It Caches</th>
                                <th className="text-left p-4 font-semibold">Scope</th>
                                <th className="text-left p-4 font-semibold">TTL Strategy</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-border">
                                <td className="p-4 font-medium">CDN</td>
                                <td className="p-4">Static search pages, autocomplete</td>
                                <td className="p-4">Global</td>
                                <td className="p-4">Time-based (1-24h)</td>
                            </tr>
                            <tr className="border-t border-border bg-zinc-50">
                                <td className="p-4 font-medium">Application</td>
                                <td className="p-4">Full query results</td>
                                <td className="p-4">Cluster</td>
                                <td className="p-4">Time + event-based</td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="p-4 font-medium">Request</td>
                                <td className="p-4">Aggregations, suggestions</td>
                                <td className="p-4">Shard</td>
                                <td className="p-4">Auto-invalidate on write</td>
                            </tr>
                            <tr className="border-t border-border bg-zinc-50">
                                <td className="p-4 font-medium">Query</td>
                                <td className="p-4">Filter bitsets</td>
                                <td className="p-4">Node</td>
                                <td className="p-4">Segment-tied + LRU</td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="p-4 font-medium">Filesystem</td>
                                <td className="p-4">Index segments</td>
                                <td className="p-4">OS</td>
                                <td className="p-4">OS managed (LRU)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 3. Elasticsearch Query Cache */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Elasticsearch Query Cache</h2>
                <p className="text-foreground leading-relaxed">
                    The Query Cache (also called Node Query Cache) stores <strong>filter clause results as bitsets</strong>.
                    When the same filter is used again, Elasticsearch can skip re-evaluating documents entirely and just
                    use the cached bitset for set operations.
                </p>

                <p className="text-foreground leading-relaxed">
                    A bitset is an extremely compact data structure: one bit per document in the index. If your index has
                    100 million documents, a filter bitset only takes ~12 MB of memory while encoding the complete set of
                    matching document IDs. When a cached filter is combined with other filters (AND, OR, NOT), Elasticsearch
                    performs highly optimized bitwise operations (AND = &amp;, OR = |) that complete in microseconds rather
                    than iterating through posting lists.
                </p>

                <p className="text-foreground leading-relaxed">
                    The Query Cache is particularly valuable for e-commerce faceted search where the same filters appear
                    constantly: "category:shoes", "size:10", "color:black", "brand:nike", "in_stock:true". Each of these
                    filters gets cached as a bitset, and subsequent queries combining them just AND the bitsets together.
                    A query like "shoes AND size:10 AND color:black" becomes three bitwise AND operations vs. three posting
                    list intersections—orders of magnitude faster.
                </p>

                {/* Bitset visualization */}
                <div className="bg-zinc-900 text-zinc-100 p-6 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># How Query Cache Works: Filter → Bitset</div>
                    <div className="space-y-4">
                        <div className="text-zinc-300">Filter: <span className="text-green-400">category = &quot;electronics&quot; AND price {'<'} 500</span></div>
                        <div className="border-t border-zinc-700 pt-4">
                            <div className="text-zinc-400 mb-2">Cached as bitset (1 bit per doc):</div>
                            <div className="flex gap-1 flex-wrap">
                                {[0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1].map((bit, i) => (
                                    <div key={i} className={`w-6 h-6 rounded text-xs flex items-center justify-center ${bit ? 'bg-green-600' : 'bg-zinc-700'}`}>
                                        {bit}
                                    </div>
                                ))}
                                <span className="text-zinc-500 ml-2">...</span>
                            </div>
                            <div className="text-zinc-500 text-xs mt-2">
                                Doc0=no, Doc1=yes, Doc2=no, Doc3=yes...
                            </div>
                        </div>
                        <div className="border-t border-zinc-700 pt-4">
                            <div className="text-cyan-400">Next query with same filter:</div>
                            <div className="text-zinc-300 pl-4">
                                1. Hash filter clause → Cache key<br />
                                2. Cache hit → Return bitset directly<br />
                                3. Instant AND/OR with other filters
                            </div>
                        </div>
                    </div>
                </div>

                {/* Configuration */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg">
                        <div className="font-bold text-blue-800 mb-3">Configuration</div>
                        <div className="bg-white border border-blue-200 p-3 rounded font-mono text-xs">
                            <div className="text-zinc-600"># elasticsearch.yml</div>
                            <div>indices.queries.cache.size: <span className="text-green-600">10%</span></div>
                            <div className="text-zinc-600 mt-2"># Per index</div>
                            <div>index.queries.cache.enabled: <span className="text-green-600">true</span></div>
                        </div>
                        <p className="text-xs text-blue-600 mt-3">
                            Default: 10% of heap, shared across all shards on the node
                        </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 p-5 rounded-lg">
                        <div className="font-bold text-purple-800 mb-3">Caching Eligibility</div>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2 text-green-700">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span><strong>Term, range, geo_* filters:</strong> These deterministic filters produce stable results that benefit from caching since the same filter always matches the same documents.</span>
                            </div>
                            <div className="flex items-start gap-2 text-green-700">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span><strong>Segments with &gt;10K docs:</strong> Small segments change frequently from merging, so Elasticsearch only caches filters on larger, more stable segments to avoid wasted cache churn.</span>
                            </div>
                            <div className="flex items-start gap-2 text-red-700">
                                <Trash2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span><strong>Queries with &quot;now&quot;:</strong> Time-based queries like &quot;last 24 hours&quot; produce different results every second, making cached results immediately stale and useless.</span>
                            </div>
                            <div className="flex items-start gap-2 text-red-700">
                                <Trash2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span><strong>Script queries:</strong> Custom scripts may use external state or randomness, so Elasticsearch cannot guarantee the same script will produce the same results twice.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Invalidation */}
                <div className="bg-amber-50 border border-amber-200 p-5 rounded-lg">
                    <div className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                        <RefreshCw className="w-5 h-5" /> Cache Invalidation
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-white border border-amber-200 p-3 rounded">
                            <div className="font-medium text-amber-800">Segment Merge</div>
                            <p className="text-amber-600 text-xs mt-1">Cached bitsets for merged segments are discarded</p>
                        </div>
                        <div className="bg-white border border-amber-200 p-3 rounded">
                            <div className="font-medium text-amber-800">Document Update</div>
                            <p className="text-amber-600 text-xs mt-1">Any write invalidates affected segment caches</p>
                        </div>
                        <div className="bg-white border border-amber-200 p-3 rounded">
                            <div className="font-medium text-amber-800">LRU Eviction</div>
                            <p className="text-amber-600 text-xs mt-1">Least-recently-used entries evicted when cache full</p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 4. Elasticsearch Request Cache */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Elasticsearch Request Cache</h2>
                <p className="text-foreground leading-relaxed">
                    The Request Cache (Shard-Level Request Cache) stores <strong>entire search responses</strong> including
                    aggregation results, suggestions, and hit counts. It&apos;s perfect for dashboard queries that run repeatedly.
                </p>

                <p className="text-foreground leading-relaxed">
                    Unlike the Query Cache (which stores filter bitsets), the Request Cache stores complete serialized
                    response JSON at the shard level. The cache key is computed from the entire request body, so even small
                    changes to the query produce cache misses. By default, it only caches requests with <code className="bg-zinc-100 px-1 rounded">size: 0</code>
                    (no document hits) because caching actual document content would consume too much memory and become stale
                    quickly as documents are updated.
                </p>

                <p className="text-foreground leading-relaxed">
                    The Request Cache is automatically invalidated when the underlying data changes (via refresh). This makes
                    it safe for dynamic content but means it works best when your data has natural update boundaries. For example,
                    if you batch-import data once per hour, queries executed during that hour get 100% cache hits. The cache
                    is particularly valuable for aggregation-heavy dashboards where computing facet counts across billions
                    of documents is expensive but the counts don&apos;t need to be real-time.
                </p>

                {/* Use cases */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-green-50 border border-green-200 p-5 rounded-lg">
                        <div className="font-bold text-green-800 mb-3 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" /> Aggregations
                        </div>
                        <p className="text-sm text-green-700">
                            Category counts, price histograms, date ranges—perfect for faceted navigation
                        </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg">
                        <div className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                            <Activity className="w-5 h-5" /> Suggestions
                        </div>
                        <p className="text-sm text-blue-700">
                            Autocomplete, &quot;did you mean&quot;, and completion suggesters
                        </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 p-5 rounded-lg">
                        <div className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                            <Timer className="w-5 h-5" /> Hit Counts
                        </div>
                        <p className="text-sm text-purple-700">
                            Total match counts when size=0 (no document retrieval)
                        </p>
                    </div>
                </div>

                {/* API Example */}
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">request_cache_example.json</span>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-zinc-500">// Enable request cache for aggregation query</span></div>
                            <div><span className="text-zinc-300">POST /products/_search?</span><span className="text-amber-400">request_cache=true</span></div>
                            <div><span className="text-zinc-300">{'{'}</span></div>
                            <div className="pl-4"><span className="text-blue-400">&quot;size&quot;</span><span className="text-zinc-300">: </span><span className="text-orange-300">0</span><span className="text-zinc-300">,</span><span className="text-zinc-500"> // No hits, just aggs</span></div>
                            <div className="pl-4"><span className="text-blue-400">&quot;aggs&quot;</span><span className="text-zinc-300">: {'{'}</span></div>
                            <div className="pl-8"><span className="text-blue-400">&quot;categories&quot;</span><span className="text-zinc-300">: {'{'}</span></div>
                            <div className="pl-12"><span className="text-blue-400">&quot;terms&quot;</span><span className="text-zinc-300">: {'{'} </span><span className="text-blue-400">&quot;field&quot;</span><span className="text-zinc-300">: </span><span className="text-green-400">&quot;category.keyword&quot;</span><span className="text-zinc-300"> {'}'}</span></div>
                            <div className="pl-8"><span className="text-zinc-300">{'}'},</span></div>
                            <div className="pl-8"><span className="text-blue-400">&quot;price_ranges&quot;</span><span className="text-zinc-300">: {'{'}</span></div>
                            <div className="pl-12"><span className="text-blue-400">&quot;histogram&quot;</span><span className="text-zinc-300">: {'{'} </span><span className="text-blue-400">&quot;field&quot;</span><span className="text-zinc-300">: </span><span className="text-green-400">&quot;price&quot;</span><span className="text-zinc-300">, </span><span className="text-blue-400">&quot;interval&quot;</span><span className="text-zinc-300">: </span><span className="text-orange-300">100</span><span className="text-zinc-300"> {'}'}</span></div>
                            <div className="pl-8"><span className="text-zinc-300">{'}'}</span></div>
                            <div className="pl-4"><span className="text-zinc-300">{'}'}</span></div>
                            <div><span className="text-zinc-300">{'}'}</span></div>
                        </div>
                    </div>
                </div>

                {/* Default behavior table */}
                <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-100">
                            <tr>
                                <th className="text-left p-4 font-semibold">Request Type</th>
                                <th className="text-left p-4 font-semibold">Cached by Default</th>
                                <th className="text-left p-4 font-semibold">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-border">
                                <td className="p-4 font-medium">size: 0 (aggs only)</td>
                                <td className="p-4 text-green-700 font-bold">✓ Yes</td>
                                <td className="p-4">Aggregations without hits</td>
                            </tr>
                            <tr className="border-t border-border bg-zinc-50">
                                <td className="p-4 font-medium">size &gt; 0</td>
                                <td className="p-4 text-red-700">✗ No</td>
                                <td className="p-4">Queries returning documents</td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="p-4 font-medium">Contains &quot;now&quot;</td>
                                <td className="p-4 text-red-700">✗ No</td>
                                <td className="p-4">Results change with time</td>
                            </tr>
                            <tr className="border-t border-border bg-zinc-50">
                                <td className="p-4 font-medium">random_score</td>
                                <td className="p-4 text-red-700">✗ No</td>
                                <td className="p-4">Non-deterministic</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. Cache Warming */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. Cache Warming Strategies</h2>
                <p className="text-foreground leading-relaxed">
                    A cold cache after deployment or cluster restart can cause severe performance degradation.
                    <strong>Cache warming</strong> proactively populates caches before traffic arrives,
                    ensuring users never experience the &quot;cold start&quot; penalty.
                </p>

                <p className="text-foreground leading-relaxed">
                    The "thundering herd" problem illustrates why warming matters: when a cache is empty and traffic
                    suddenly arrives, every request becomes a cache miss simultaneously, overwhelming your search
                    cluster with 100x the normal load. A single new server added to a load balancer without warming
                    can bring down an entire cluster if traffic is high enough. Proper warming prevents this by
                    ensuring cache hit rates are healthy <em>before</em> real traffic arrives.
                </p>

                <p className="text-foreground leading-relaxed">
                    The key to effective warming is replaying <strong>real query patterns</strong> from your analytics.
                    Extract the top 1,000-10,000 most frequent queries from the past week, then replay them at a controlled
                    rate (10-50 QPS) before routing production traffic to new instances. This populates caches with the
                    exact queries that will drive most of your traffic, maximizing hit rate from the first real request.
                </p>

                {/* Warming scenarios */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-6 rounded-xl">
                    <h3 className="font-bold text-orange-800 mb-4">When to Warm Caches</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white border border-orange-200 p-4 rounded-lg">
                            <div className="font-bold text-orange-700 mb-2">After Deployment</div>
                            <p className="text-sm text-orange-600">
                                New application instances start with empty caches. Warm before adding to load balancer.
                            </p>
                        </div>
                        <div className="bg-white border border-orange-200 p-4 rounded-lg">
                            <div className="font-bold text-orange-700 mb-2">After Index Rebuild</div>
                            <p className="text-sm text-orange-600">
                                Reindexing invalidates all caches. Warm top queries after rebuild completes.
                            </p>
                        </div>
                        <div className="bg-white border border-orange-200 p-4 rounded-lg">
                            <div className="font-bold text-orange-700 mb-2">Before Traffic Spikes</div>
                            <p className="text-sm text-orange-600">
                                Black Friday, product launches, marketing campaigns—warm beforehand.
                            </p>
                        </div>
                        <div className="bg-white border border-orange-200 p-4 rounded-lg">
                            <div className="font-bold text-orange-700 mb-2">Off-Peak Maintenance</div>
                            <p className="text-sm text-orange-600">
                                Nightly cache refresh to prevent stale entries and maintain hit rates.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Warming code */}
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">cache_warmer.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">import</span><span className="text-zinc-300"> time</span></div>
                            <div><span className="text-pink-400">from</span><span className="text-zinc-300"> elasticsearch </span><span className="text-pink-400">import</span><span className="text-zinc-300"> Elasticsearch</span></div>
                            <div></div>
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">warm_cache</span><span className="text-zinc-300">(es, top_queries, rate_per_second=</span><span className="text-orange-300">10</span><span className="text-zinc-300">):</span></div>
                            <div className="pl-4"><span className="text-zinc-500">&quot;&quot;&quot;Warm cache without overwhelming cluster&quot;&quot;&quot;</span></div>
                            <div className="pl-4"><span className="text-zinc-300">interval = </span><span className="text-orange-300">1.0</span><span className="text-zinc-300"> / rate_per_second</span></div>
                            <div className="pl-4"></div>
                            <div className="pl-4"><span className="text-pink-400">for</span><span className="text-zinc-300"> query </span><span className="text-pink-400">in</span><span className="text-zinc-300"> top_queries:</span></div>
                            <div className="pl-8"><span className="text-zinc-300">start = time.time()</span></div>
                            <div className="pl-8"></div>
                            <div className="pl-8"><span className="text-zinc-500"># Execute query (populates all cache layers)</span></div>
                            <div className="pl-8"><span className="text-zinc-300">es.search(index=</span><span className="text-green-400">&quot;products&quot;</span><span className="text-zinc-300">, body=query)</span></div>
                            <div className="pl-8"></div>
                            <div className="pl-8"><span className="text-zinc-500"># Throttle to avoid cluster overload</span></div>
                            <div className="pl-8"><span className="text-zinc-300">elapsed = time.time() - start</span></div>
                            <div className="pl-8"><span className="text-pink-400">if</span><span className="text-zinc-300"> elapsed {'<'} interval:</span></div>
                            <div className="pl-12"><span className="text-zinc-300">time.sleep(interval - elapsed)</span></div>
                            <div></div>
                            <div><span className="text-zinc-500"># Usage: warm top 1000 queries from analytics</span></div>
                            <div><span className="text-zinc-300">top_queries = analytics.get_top_queries(limit=</span><span className="text-orange-300">1000</span><span className="text-zinc-300">)</span></div>
                            <div><span className="text-zinc-300">warm_cache(es, top_queries)</span></div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-blue-800 mb-2">Pro Tip: Gradual Warming</div>
                    <p className="text-blue-700">
                        Never blast all warming queries at once. Use rate limiting (10-50 QPS) to warm caches
                        gradually without impacting ongoing traffic or triggering circuit breakers.
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 6. Cache Invalidation */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">6. Cache Invalidation Strategies</h2>
                <p className="text-foreground leading-relaxed">
                    &quot;There are only two hard things in Computer Science: cache invalidation and naming things.&quot;
                    Choosing the right invalidation strategy is critical for balancing freshness with performance.
                </p>

                <p className="text-foreground leading-relaxed">
                    The fundamental tension is between <strong>freshness</strong> and <strong>hit rate</strong>. Aggressive
                    invalidation (expiring entries quickly) keeps data fresh but reduces cache effectiveness. Lenient
                    invalidation maximizes hit rate but risks serving stale data. The right balance depends entirely on
                    your use case: a product catalog might tolerate 1-hour staleness, while stock prices need real-time accuracy.
                </p>

                <p className="text-foreground leading-relaxed">
                    Most production systems use <strong>hybrid strategies</strong>: short TTLs for volatile data combined with
                    event-based invalidation for critical updates. For example, set a 5-minute TTL by default, but explicitly
                    invalidate an item&apos;s cache when it&apos;s updated through your CMS. The TTL acts as a safety net catching any
                    invalidation failures, while event-based invalidation ensures critical changes propagate immediately.
                </p>

                {/* Strategies comparison */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg">
                        <div className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                            <Clock className="w-5 h-5" /> Time-Based (TTL)
                        </div>
                        <div className="text-sm text-blue-700 space-y-2">
                            <p>Entries expire after fixed duration.</p>
                            <div className="bg-white border border-blue-200 p-2 rounded font-mono text-xs">
                                cache.setex(key, ttl=300, value)
                            </div>
                            <div className="flex items-center gap-2 text-green-600 text-xs">
                                <CheckCircle2 className="w-3 h-3" /> Simple, predictable
                            </div>
                            <div className="flex items-center gap-2 text-red-600 text-xs">
                                <AlertTriangle className="w-3 h-3" /> Stale until TTL expires
                            </div>
                        </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 p-5 rounded-lg">
                        <div className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                            <Zap className="w-5 h-5" /> Event-Based
                        </div>
                        <div className="text-sm text-purple-700 space-y-2">
                            <p>Invalidate when data changes.</p>
                            <div className="bg-white border border-purple-200 p-2 rounded font-mono text-xs">
                                on_update → cache.delete(key)
                            </div>
                            <div className="flex items-center gap-2 text-green-600 text-xs">
                                <CheckCircle2 className="w-3 h-3" /> Always fresh
                            </div>
                            <div className="flex items-center gap-2 text-red-600 text-xs">
                                <AlertTriangle className="w-3 h-3" /> Complex dependency tracking
                            </div>
                        </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-5 rounded-lg">
                        <div className="font-bold text-green-800 mb-3 flex items-center gap-2">
                            <RefreshCw className="w-5 h-5" /> Hybrid (Stale-While-Revalidate)
                        </div>
                        <div className="text-sm text-green-700 space-y-2">
                            <p>Return stale, refresh async.</p>
                            <div className="bg-white border border-green-200 p-2 rounded font-mono text-xs">
                                if stale: return + async_refresh()
                            </div>
                            <div className="flex items-center gap-2 text-green-600 text-xs">
                                <CheckCircle2 className="w-3 h-3" /> Fast + eventually fresh
                            </div>
                            <div className="flex items-center gap-2 text-red-600 text-xs">
                                <AlertTriangle className="w-3 h-3" /> Brief staleness window
                            </div>
                        </div>
                    </div>
                </div>

                {/* TTL Guidelines */}
                <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-100">
                            <tr>
                                <th className="text-left p-4 font-semibold">Content Type</th>
                                <th className="text-left p-4 font-semibold">Suggested TTL</th>
                                <th className="text-left p-4 font-semibold">Rationale</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-border">
                                <td className="p-4 font-medium">Static catalog search</td>
                                <td className="p-4">1 hour</td>
                                <td className="p-4">Product catalogs typically update through scheduled batch jobs rather than in real-time, so hour-long cache windows rarely serve stale data.</td>
                            </tr>
                            <tr className="border-t border-border bg-zinc-50">
                                <td className="p-4 font-medium">News search</td>
                                <td className="p-4">5 minutes</td>
                                <td className="p-4">Breaking news stories need to appear quickly, but a few minutes of delay is usually acceptable for search results.</td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="p-4 font-medium">Real-time data</td>
                                <td className="p-4">30 seconds</td>
                                <td className="p-4">Stock prices, social feeds, and live events demand near-instant updates—cache only to absorb traffic bursts during spikes.</td>
                            </tr>
                            <tr className="border-t border-border bg-zinc-50">
                                <td className="p-4 font-medium">Autocomplete</td>
                                <td className="p-4">1 hour</td>
                                <td className="p-4">Suggestion lists change infrequently since they&apos;re based on aggregate query patterns, not individual documents.</td>
                            </tr>
                            <tr className="border-t border-border">
                                <td className="p-4 font-medium">Aggregations/facets</td>
                                <td className="p-4">15 minutes</td>
                                <td className="p-4">Facet counts (e.g., &quot;42 items in category X&quot;) can lag slightly without confusing users—exact counts rarely matter.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 7. Monitoring */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">7. Cache Monitoring & Metrics</h2>
                <p className="text-foreground leading-relaxed">
                    You can&apos;t optimize what you don&apos;t measure. Monitor cache hit rates, eviction rates,
                    and memory usage to ensure your caching strategy is effective.
                </p>

                <p className="text-foreground leading-relaxed">
                    The most important metric is <strong>cache hit rate</strong>: (hits / (hits + misses)) × 100. A healthy
                    search cache typically achieves 70-90% hit rate. If you&apos;re below 50%, your cache is likely undersized,
                    TTLs are too short, or your queries are too diverse (long-tail dominated). Track this metric over time
                    to detect problems: sudden drops usually indicate configuration changes, traffic pattern shifts, or
                    cache capacity issues.
                </p>

                <p className="text-foreground leading-relaxed">
                    <strong>Eviction rate</strong> is your early warning system: high evictions mean the cache is undersized
                    and frequently discarding entries to make room for new ones. This reduces hit rate and wastes the CPU time
                    spent computing entries that get evicted before being reused. If evictions exceed 1-2% of your total
                    entries per minute, consider increasing cache size or reducing TTLs to allow natural expiration instead.
                </p>

                {/* ES Stats API */}
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">cache_stats_api.sh</span>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-zinc-500"># Get cache stats from Elasticsearch</span></div>
                            <div><span className="text-green-400">GET</span><span className="text-zinc-300"> /_nodes/stats/indices/query_cache,request_cache</span></div>
                            <div></div>
                            <div><span className="text-zinc-500"># Response snippet:</span></div>
                            <div><span className="text-zinc-300">{'{'}</span></div>
                            <div className="pl-4"><span className="text-blue-400">&quot;query_cache&quot;</span><span className="text-zinc-300">: {'{'}</span></div>
                            <div className="pl-8"><span className="text-blue-400">&quot;memory_size_in_bytes&quot;</span><span className="text-zinc-300">: </span><span className="text-orange-300">52428800</span><span className="text-zinc-300">,</span></div>
                            <div className="pl-8"><span className="text-blue-400">&quot;hit_count&quot;</span><span className="text-zinc-300">: </span><span className="text-green-400">12000</span><span className="text-zinc-300">,</span></div>
                            <div className="pl-8"><span className="text-blue-400">&quot;miss_count&quot;</span><span className="text-zinc-300">: </span><span className="text-red-400">3000</span><span className="text-zinc-300">,</span></div>
                            <div className="pl-8"><span className="text-blue-400">&quot;evictions&quot;</span><span className="text-zinc-300">: </span><span className="text-orange-300">500</span></div>
                            <div className="pl-4"><span className="text-zinc-300">{'}'}</span></div>
                            <div><span className="text-zinc-300">{'}'}</span></div>
                        </div>
                    </div>
                </div>

                {/* Key metrics */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-green-50 border border-green-200 p-5 rounded-lg text-center">
                        <div className="text-4xl font-bold text-green-700">&gt;80%</div>
                        <div className="font-medium text-green-800 mt-2">Target Hit Rate</div>
                        <p className="text-xs text-green-600 mt-1">hit_count / (hit_count + miss_count)</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 p-5 rounded-lg text-center">
                        <div className="text-4xl font-bold text-amber-700">&lt;5%</div>
                        <div className="font-medium text-amber-800 mt-2">Eviction Rate</div>
                        <p className="text-xs text-amber-600 mt-1">evictions / total_count</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg text-center">
                        <div className="text-4xl font-bold text-blue-700">&lt;limit</div>
                        <div className="font-medium text-blue-800 mt-2">Memory Usage</div>
                        <p className="text-xs text-blue-600 mt-1">Stay below configured max</p>
                    </div>
                </div>

                {/* Calculating hit rate */}
                <div className="bg-zinc-100 border border-zinc-200 p-5 rounded-lg">
                    <div className="font-bold text-zinc-800 mb-3">Hit Rate Calculation Example</div>
                    <div className="font-mono text-sm bg-white border border-zinc-200 p-4 rounded">
                        <div>hit_rate = hit_count / (hit_count + miss_count)</div>
                        <div className="text-zinc-500 mt-2">hit_rate = 12000 / (12000 + 3000) = 0.80 = <span className="text-green-600 font-bold">80%</span></div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 8. Common Pitfalls */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">8. Common Caching Pitfalls</h2>
                <p className="text-foreground leading-relaxed">
                    Even experienced teams make caching mistakes. Here are the most common issues and how to avoid them.
                </p>

                <div className="space-y-4">
                    {/* Pitfall 1 */}
                    <div className="bg-red-50 border border-red-200 p-5 rounded-lg">
                        <div className="font-bold text-red-800 mb-2">1. Cache Stampede</div>
                        <p className="text-sm text-red-700 mb-3">
                            When cache expires, many requests simultaneously hit the backend to refresh.
                        </p>
                        <div className="bg-white border border-red-200 p-3 rounded">
                            <div className="font-medium text-red-800 text-sm mb-1">Solution:</div>
                            <p className="text-xs text-red-600">
                                Use stale-while-revalidate + distributed locking. Only one request refreshes while others get stale data.
                            </p>
                        </div>
                    </div>

                    {/* Pitfall 2 */}
                    <div className="bg-amber-50 border border-amber-200 p-5 rounded-lg">
                        <div className="font-bold text-amber-800 mb-2">2. Cache Pollution</div>
                        <p className="text-sm text-amber-700 mb-3">
                            Low-value long-tail queries evict high-value head queries from limited cache space.
                        </p>
                        <div className="bg-white border border-amber-200 p-3 rounded">
                            <div className="font-medium text-amber-800 text-sm mb-1">Solution:</div>
                            <p className="text-xs text-amber-600">
                                Segment caches by query type. Separate caches for autocomplete, search, and aggregations.
                            </p>
                        </div>
                    </div>

                    {/* Pitfall 3 */}
                    <div className="bg-purple-50 border border-purple-200 p-5 rounded-lg">
                        <div className="font-bold text-purple-800 mb-2">3. Ignoring Personalization</div>
                        <p className="text-sm text-purple-700 mb-3">
                            Caching personalized results can leak data or show wrong recommendations.
                        </p>
                        <div className="bg-white border border-purple-200 p-3 rounded">
                            <div className="font-medium text-purple-800 text-sm mb-1">Solution:</div>
                            <p className="text-xs text-purple-600">
                                Include user segment (not user ID) in cache key. Cache per-segment, not per-user.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 border-t border-border">
                <Link href="/search/retrieval/wand" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Early Termination & WAND</span>
                </Link>
                <Link href="/search/retrieval/approximate" className="flex items-center gap-2 text-primary font-medium hover:underline">
                    <span>Approximate Retrieval</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
