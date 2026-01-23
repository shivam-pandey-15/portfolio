import { ArrowRight, ArrowDown, Clock, CheckCircle2, Database, Zap, RefreshCw, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Paths() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 3.7: Indexing & Infrastructure</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">The Write & Query Path</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Tracing the lifecycle of a request millisecond by millisecond. Understanding where latency hides.
                </p>
            </div>

            <hr className="border-border" />

            {/* The Write Path */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Database className="w-8 h-8" />
                    The Write Path (Indexing)
                </h2>

                <p className="text-foreground leading-relaxed">
                    When you call `PUT /products/_doc/1`, what happens behind the scenes? The goal is durability (don't lose data)
                    and eventual searchability. Notice the distinction: data is **durable** almost instantly (thanks to the Transaction Log),
                    but **searchable** only after a refresh (a few seconds). This dual-track system balances data safety with performance.
                </p>

                <div className="bg-zinc-900 rounded-xl p-8">
                    <div className="flex flex-col items-center gap-4 max-w-lg mx-auto">
                        {/* Step 1: Coordinator */}
                        <div className="w-full bg-zinc-700 border border-zinc-500 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-zinc-100 text-sm">1. Coordinator</div>
                                    <div className="text-xs text-zinc-400">Parse JSON, route to shard</div>
                                </div>
                                <span className="text-zinc-400 text-xs font-mono">~0.1ms</span>
                            </div>
                        </div>
                        <ArrowDown className="w-5 h-5 text-zinc-500" />

                        {/* Step 2: Translog */}
                        <div className="w-full bg-green-900 border border-green-600 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-green-200 text-sm">2. Translog (Disk)</div>
                                    <div className="text-xs text-green-300">Append + fsync for durability</div>
                                </div>
                                <span className="text-green-400 text-xs font-mono font-bold">1-5ms</span>
                            </div>
                            <div className="mt-2 bg-green-950 rounded px-2 py-1 text-xs text-green-400">
                                ✓ DATA IS NOW DURABLE (survives crash)
                            </div>
                        </div>
                        <ArrowDown className="w-5 h-5 text-zinc-500" />

                        {/* Step 3: Buffer */}
                        <div className="w-full bg-amber-900 border border-amber-600 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-amber-200 text-sm">3. In-Memory Buffer</div>
                                    <div className="text-xs text-amber-300">Tokenize, build index structures</div>
                                </div>
                                <span className="text-amber-400 text-xs font-mono">~0.5ms</span>
                            </div>
                            <div className="mt-2 bg-amber-950 rounded px-2 py-1 text-xs text-amber-400">
                                ⚠ NOT YET SEARCHABLE (until refresh)
                            </div>
                        </div>
                        <ArrowDown className="w-5 h-5 text-zinc-500" />

                        {/* Step 4: Replicate */}
                        <div className="w-full bg-blue-900 border border-blue-600 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-blue-200 text-sm">4. Replicate to Replicas</div>
                                    <div className="text-xs text-blue-300">Wait for acknowledgment</div>
                                </div>
                                <span className="text-blue-400 text-xs font-mono">1-5ms</span>
                            </div>
                        </div>
                        <ArrowDown className="w-5 h-5 text-zinc-500" />

                        {/* Step 5: Response */}
                        <div className="w-full bg-zinc-100 text-zinc-900 rounded-lg p-4 text-center">
                            <div className="font-bold">Return Success to Client</div>
                            <div className="text-sm text-zinc-600 mt-1">Total: ~6ms</div>
                        </div>
                    </div>
                </div>

                {/* Async: Refresh & Flush */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-xl border-2 border-border bg-white p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <RefreshCw className="w-5 h-5 text-primary" />
                            <h4 className="font-bold text-foreground">Refresh (Async, Every 1s)</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Buffer → Segment. Data becomes searchable.</p>
                        <div className="bg-zinc-900 rounded-lg p-3 font-mono text-xs text-zinc-100">
                            <div className="text-green-400">// After refresh:</div>
                            <div>Segment contains: inverted index, BKD trees, DocValues, stored fields</div>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-border bg-white p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <Database className="w-5 h-5 text-primary" />
                            <h4 className="font-bold text-foreground">Flush (Async, Every 30m)</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">fsync segments, clear translog.</p>
                        <div className="bg-zinc-900 rounded-lg p-3 font-mono text-xs text-zinc-100">
                            <div className="text-zinc-400">Triggers:</div>
                            <div>• Every 30 minutes</div>
                            <div>• Translog exceeds 512MB</div>
                            <div>• Manual: POST /index/_flush</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Query Path */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Zap className="w-8 h-8" />
                    The Query Path (Searching)
                </h2>
                <p className="text-foreground leading-relaxed">
                    Why is distributed search complex? Because of the **Scatter-Gather** problem. A search request must first be sent to *every single shard* (Scatter). Each shard executes the query locally. Then, the results—often just IDs and scores—are sent back to the coordinator (Gather). Finally, the coordinator requests the full JSON content only for the 'winning' documents. This two-phase Fetch-then-Fill approach minimizes network traffic.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Phase 1: Query */}
                    <div className="rounded-xl border-2 border-blue-300 bg-blue-50 p-5">
                        <h4 className="font-bold text-blue-800 mb-3">Phase 1: Query (Scatter)</h4>
                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100 space-y-1">
                            <div className="text-zinc-400">Coordinator → All Shards</div>
                            <div className="mt-2">Each shard:</div>
                            <div className="pl-2">1. Look up terms in inverted index</div>
                            <div className="pl-2">2. Skip deleted docs (.liv check)</div>
                            <div className="pl-2">3. Apply filters (BKD range)</div>
                            <div className="pl-2">4. Score with BM25</div>
                            <div className="border-t border-zinc-700 mt-2 pt-2 text-blue-400">Returns: Top N IDs + scores (lightweight)</div>
                        </div>
                        <div className="text-xs text-blue-900 mt-2 font-mono">Time: 5-50ms</div>
                    </div>

                    {/* Phase 2: Fetch */}
                    <div className="rounded-xl border-2 border-green-300 bg-green-50 p-5">
                        <h4 className="font-bold text-green-800 mb-3">Phase 2: Fetch (Gather)</h4>
                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100 space-y-1">
                            <div className="text-zinc-400">Coordinator merges all results</div>
                            <div className="mt-2">1. Priority queue merge</div>
                            <div>2. Determine global top N</div>
                            <div>3. Request full _source from winning shards</div>
                            <div className="border-t border-zinc-700 mt-2 pt-2 text-green-400">Returns: Full JSON documents</div>
                        </div>
                        <div className="text-xs text-green-900 mt-2 font-mono">Time: 2-10ms</div>
                    </div>
                </div>
            </section>

            {/* Latency Breakdown */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Clock className="w-8 h-8" /> Latency Breakdown
                </h2>
                <p className="text-foreground leading-relaxed">
                    In a typical search request, the vast majority of time is spent in the **Query Phase**—specifically, scoring documents. If your query matches 10 million documents, the engine must calculate a relevance score for every single one. This is why **Filters** are so powerful: they cheaply reduce the number of documents that need to be scored, dramatically reducing latency.
                </p>

                <div className="rounded-xl border-2 border-border overflow-hidden">
                    <div className="bg-muted px-4 py-2 font-bold text-sm text-foreground">Typical Search Request: ~26ms</div>
                    <div className="flex h-12">
                        <div className="bg-zinc-500 w-[5%] flex items-center justify-center text-[10px] text-white font-bold">Parse</div>
                        <div className="bg-blue-600 w-[60%] flex items-center justify-center text-xs text-white font-bold">Query Phase (20ms)</div>
                        <div className="bg-amber-600 w-[10%] flex items-center justify-center text-[10px] text-white font-bold">Merge</div>
                        <div className="bg-green-600 w-[25%] flex items-center justify-center text-xs text-white font-bold">Fetch (5ms)</div>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">
                    Most time is spent in the Query phase (scoring). Reduce documents to score via filters!
                </p>
            </section>

            {/* Caching Layers */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Caching Layers</h2>
                <p className="text-foreground leading-relaxed">
                    Search engines use multiple caching layers to avoid repeating expensive work. Understanding these
                    caches helps you optimize for your access patterns and explains why "warm" queries are faster
                    than "cold" ones.
                </p>

                <div className="bg-zinc-900 rounded-xl p-6">
                    <div className="space-y-3">
                        <div className="bg-purple-900 border border-purple-600 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-purple-200 text-sm">Node Query Cache</div>
                                    <div className="text-xs text-purple-300">Caches filter clause results (bitsets)</div>
                                </div>
                                <span className="text-purple-400 text-xs">Target: 80-95% hit rate</span>
                            </div>
                        </div>
                        <div className="bg-blue-900 border border-blue-600 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-blue-200 text-sm">Shard Request Cache</div>
                                    <div className="text-xs text-blue-300">Caches full aggregation results</div>
                                </div>
                                <span className="text-blue-400 text-xs">Target: 50-80% hit rate</span>
                            </div>
                        </div>
                        <div className="bg-green-900 border border-green-600 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-green-200 text-sm">OS Page Cache</div>
                                    <div className="text-xs text-green-300">Hot segment files in RAM (managed by OS)</div>
                                </div>
                                <span className="text-green-400 text-xs">Target: 95%+ hit rate</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-zinc-400 text-center">
                        All caches invalidate on refresh  tune refresh_interval for your workload.
                    </div>
                </div>
            </section>

            {/* OCC */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Optimistic Concurrency Control</h2>
                <p className="text-foreground leading-relaxed">
                    How do you prevent data corruption when two users edit the same document? SQL databases use locks, which kill performance. Search engines use **Optimistic Concurrency Control (OCC)**. Every document has a `_seq_no` version. When you write, you say 'Update document ID 123 *only if* it is still version 5'. If someone else updated it to version 6, your write is rejected (409 Conflict), and you must retry. No locks, no waiting.
                </p>

                <div className="bg-amber-100 border-2 border-amber-500 p-5 rounded-xl">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-amber-900">The Lost Update Problem</h4>
                            <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100 mt-3">
                                <div className="text-zinc-400">// Two threads read stock=100</div>
                                <div>Thread A: 100 - 1 = 99 → Write 99</div>
                                <div>Thread B: 100 - 1 = 99 → Write 99</div>
                                <div className="text-red-400 mt-1">Expected: 98. Actual: 99 ← LOST UPDATE!</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-xl border-2 border-green-300 bg-green-50 p-5">
                        <h4 className="font-bold text-green-800 mb-3">Solution: Version Checking</h4>
                        <div className="bg-zinc-900 rounded-lg p-3 font-mono text-xs text-zinc-100">
                            <div className="text-green-400">// Update with version check</div>
                            <div>PUT /products/_doc/123?<span className="text-amber-400">if_seq_no=5&if_primary_term=1</span></div>
                            <div className="text-zinc-400 mt-1">// Returns 409 Conflict if someone else updated first</div>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-blue-300 bg-blue-50 p-5">
                        <h4 className="font-bold text-blue-800 mb-3">Alternative: Script Updates (Atomic)</h4>
                        <div className="bg-zinc-900 rounded-lg p-3 font-mono text-xs text-zinc-100">
                            <div className="text-blue-400">// Runs atomically on shard leader</div>
                            <div>POST /products/_update/123</div>
                            <div>{`{ "script": "ctx._source.stock -= 1" }`}</div>
                            <div className="text-zinc-400 mt-1">// No read-modify-write race!</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Debugging */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Debugging Slow Queries</h2>
                <p className="text-foreground leading-relaxed">
                    When queries are slow, you need visibility into where the time is going. Elasticsearch provides
                    two key tools: the Profile API for detailed breakdowns, and the Slow Log for catching problematic
                    queries in production.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-xl border-2 border-border bg-white p-5">
                        <h4 className="font-bold text-foreground mb-3">Profile API</h4>
                        <div className="bg-zinc-900 rounded-lg p-3 font-mono text-xs text-zinc-100">
                            <div>GET /products/_search</div>
                            <div>{`{ "profile": true, "query": { ... } }`}</div>
                            <div className="text-zinc-400 mt-2">// Returns timing breakdown per shard</div>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-border bg-white p-5">
                        <h4 className="font-bold text-foreground mb-3">Slow Log</h4>
                        <div className="bg-zinc-900 rounded-lg p-3 font-mono text-xs text-zinc-100">
                            <div>PUT /products/_settings</div>
                            <div>{`{ "index.search.slowlog.threshold.query.warn": "10s" }`}</div>
                            <div className="text-zinc-400 mt-2">// Logs all queries exceeding threshold</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <section className="bg-green-100 border-2 border-green-500 p-6 rounded-xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-800">
                    <CheckCircle2 className="w-5 h-5" /> Key Takeaways
                </h2>
                <ul className="space-y-2 text-sm text-green-900">
                    <li className="flex items-start gap-2">
                        <Database className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Write path:</strong> Translog (durable) → Buffer → Replicas → Response. Segment creation is async.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Zap className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Query path:</strong> Scatter to shards → Score & filter → Merge → Fetch documents.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <RefreshCw className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Translog = durability</strong>, segments = searchability. Different guarantees!</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>OCC prevents lost updates:</strong> Use if_seq_no or atomic scripts.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Profile API</strong> is your friend for debugging slow queries.</span>
                    </li>
                </ul>
            </section>

            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/indexing/sharding" className="text-sm font-medium text-muted-foreground hover:text-primary">← 3.6 Sharding</Link>
                <Link href="/search/data-foundation/quality" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90">
                    Chapter 4: Data Foundation <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
