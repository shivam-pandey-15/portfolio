"use client";

import { Clock, RefreshCw, Database, Layers, AlertTriangle, Zap, ArrowRight, ArrowLeft, Server, Activity, Lock } from "lucide-react";
import Link from "next/link";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Freshness is Expensive", description: "Real-time search means high CPU. Every refresh creates a new segment file." },
    { title: "The 1-Second Gap", description: "Data moves from Buffer -> Translog -> Segment. It is durable before it is searchable." },
    { title: "Concurrency Matters", description: "Distributed writes race. Use Optimistic Concurrency Control (versioning) to prevent data loss." },
    { title: "Architecture Patterns", description: "Split fast-moving data (stock/price) into separate 'Sidecar' indices from slow content." }
];

export default function FreshnessPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 4.6</p>
                <h1 className="text-4xl font-bold tracking-tight">Freshness & Updates</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    The race against the refresh interval. Why your search engine is always living in the past (by at least 1 second), and why forcing it to be "real-time" might kill your cluster.
                </p>
            </div>

            <hr className="border-border" />

            {/* 1. Expectation vs Reality */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Clock className="w-6 h-6 text-blue-500" /> Expectation vs. Reality
                </h2>
                <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
                    <p>
                        Engineers coming from a relational database background (Postgres, MySQL) are used to <span className="text-foreground font-medium">ACID consistency</span>.
                        When you `COMMIT`, the data is there. Immediately. For everyone.
                    </p>
                    <p>
                        Search engines are different. They prioritize <span className="text-foreground font-medium">Read Throughput</span> over <span className="text-foreground font-medium">Write Latency</span>.
                        To achieve millisecond search speeds across billions of documents, they cheat. They buffer writes in memory and only flush to disk periodically.
                        This creates a fundamental disconnect between what users expect and what the system actually does.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* User Expectation */}
                    <div className="border border-border rounded-xl p-6 bg-zinc-50/50">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold uppercase">User Model</span>
                        </div>
                        <div className="space-y-4 font-mono text-sm">
                            <div className="flex justify-between items-center text-zinc-500">
                                <span>T+0s</span>
                                <span>Click "Save"</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-500">
                                <span>T+0.1s</span>
                                <span>Search</span>
                            </div>
                            <div className="bg-green-100 border border-green-200 p-3 rounded text-green-800 font-bold text-center">
                                FOUND! (Expectation)
                            </div>
                        </div>
                    </div>

                    {/* Engineering Reality */}
                    <div className="border border-border rounded-xl p-6 bg-zinc-50/50">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold uppercase">System Model</span>
                        </div>
                        <div className="space-y-4 font-mono text-sm relative">
                            {/* Timeline Line */}
                            <div className="absolute left-[3.5rem] top-2 bottom-2 w-0.5 bg-zinc-200"></div>

                            <div className="flex items-center gap-4 relative z-10">
                                <span className="w-12 text-right text-xs text-zinc-500">T+0s</span>
                                <div className="bg-white border border-zinc-200 px-3 py-1 rounded text-xs">Write to DB</div>
                            </div>
                            <div className="flex items-center gap-4 relative z-10">
                                <span className="w-12 text-right text-xs text-zinc-500">T+0.5s</span>
                                <div className="bg-white border border-zinc-200 px-3 py-1 rounded text-xs">CDC Event &rarr; Kafka</div>
                            </div>
                            <div className="flex items-center gap-4 relative z-10">
                                <span className="w-12 text-right text-xs text-zinc-500">T+1.0s</span>
                                <div className="bg-yellow-50 border border-yellow-200 px-3 py-1 rounded text-xs text-yellow-800">
                                    In-Memory Buffer <br />
                                    <span className="text-[10px] opacity-70">(Not Searchable)</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 relative z-10">
                                <span className="w-12 text-right text-xs text-zinc-500">T+2.0s</span>
                                <div className="bg-green-100 border border-green-200 px-3 py-1 rounded text-xs text-green-800 font-bold">
                                    Refresh &rarr; Segment <br />
                                    <span className="text-[10px] opacity-70">(Now Searchable!)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Architecture of NRT */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Layers className="w-6 h-6 text-purple-500" /> The Near-Real-Time (NRT) Architecture
                </h2>
                <p className="text-muted-foreground">
                    Why is there a delay? Because writing to disk is slow. Lucene cheats by writing to a memory buffer first.
                    This buffer is <strong>durable</strong> (via Translog) but <strong>not searchable</strong> until a "Refresh" operation turns it into a Segment.
                </p>

                <div className="bg-zinc-900 rounded-xl p-8 text-zinc-100 font-mono text-sm overflow-x-auto">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                        {/* Buffer */}
                        <div className="bg-zinc-800 border-2 border-dashed border-zinc-600 p-4 rounded-lg w-full md:w-1/3 relative">
                            <div className="absolute -top-3 left-4 bg-zinc-900 px-2 text-xs text-zinc-400 font-bold uppercase">JVM Heap</div>
                            <h4 className="text-center font-bold mb-2">Indexing Buffer</h4>
                            <div className="space-y-2">
                                <div className="bg-blue-900/50 border border-blue-500/30 p-2 rounded text-xs text-center">Doc A</div>
                                <div className="bg-blue-900/50 border border-blue-500/30 p-2 rounded text-xs text-center">Doc B</div>
                            </div>
                            <div className="mt-4 text-[10px] text-center text-red-400 flex items-center justify-center gap-1">
                                <Zap className="w-3 h-3" /> Fast Write
                            </div>
                            <div className="text-[10px] text-center text-zinc-500">Not Searchable</div>
                        </div>

                        {/* Arrow */}
                        <div className="flex flex-col items-center gap-2 text-zinc-400 shrink-0">
                            <ArrowRight className="w-6 h-6 hidden md:block" />
                            <div className="text-xs text-center font-bold bg-zinc-800 px-2 py-1 rounded">REFRESH (1s)</div>
                        </div>

                        {/* Segment */}
                        <div className="bg-green-900/20 border-2 border-green-500/50 p-4 rounded-lg w-full md:w-1/3">
                            <h4 className="text-center font-bold mb-2 text-green-400">Lucene Segment</h4>
                            <div className="space-y-2 opacity-80">
                                <div className="bg-green-900/30 border border-green-500/30 p-2 rounded text-xs text-center">Doc A</div>
                                <div className="bg-green-900/30 border border-green-500/30 p-2 rounded text-xs text-center">Doc B</div>
                            </div>
                            <div className="mt-4 text-[10px] text-center text-green-400 font-bold flex items-center justify-center gap-1">
                                <Activity className="w-3 h-3" /> Searchable
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-4 text-sm text-blue-900">
                    <div className="p-2 bg-blue-100 rounded-lg h-fit">
                        <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="font-bold mb-1">The Refresh Interval Trade-off</p>
                        <p className="mb-2">
                            By default, <code className="bg-blue-100 px-1 rounded">refresh_interval: "1s"</code>. This is the heartbeat of your search engine.
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-1">
                            <li><strong>Lower (e.g., 100ms)</strong>: Near-instant results, but creates 10x more segments. This spikes CPU usage and triggers massive "merge storms" as the system tries to combine them.</li>
                            <li><strong>Higher (e.g., 30s)</strong>: Very efficient. Low CPU, fewer segments. But users won't see their updates for half a minute.</li>
                        </ul>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wide opacity-70">
                            There is no free lunch.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Concurrency / Versioning */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Database className="w-6 h-6 text-red-500" /> The Lost Update Problem
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            In a distributed system, relying on "last write wins" is dangerous.
                            If two users update a document at the same time, the slower request might overwrite the newer data.
                        </p>
                        <div className="bg-zinc-50 p-4 rounded-xl border-2 border-red-200">
                            <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> The Race Condition
                            </h3>
                            <ul className="space-y-2 text-sm text-red-800">
                                <li>1. Admin reads Product A (Stock: 10)</li>
                                <li>2. Customer buys item (Stock &rarr; 9) [Writes to DB]</li>
                                <li>3. Admin saves stats update (Stock: 10) [Writes to DB]</li>
                                <li><strong>Result:</strong> Stock reset to 10. Customer purchase lost.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            <strong>Solution: Optimistic Concurrency Control (OCC)</strong>.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Instead of locking the database (slow), we use versioning. Every document has a <code className="bg-secondary px-1 rounded">_seq_no</code> (sequence number) and <code className="bg-secondary px-1 rounded">_primary_term</code>.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            When you write, you must pass the version you <em>read</em>. If the version on the server is higher than what you passed, the server rejects your write (409 Conflict), forcing you to re-read and retry.
                        </p>
                        <div className="bg-zinc-900 rounded-xl p-4 font-mono text-sm text-zinc-100 overflow-x-auto">
                            <div className="text-zinc-500 mb-2">// Safe Update with OCC</div>
                            <pre className="text-green-400">PUT /products/_doc/123?if_seq_no=34&if_primary_term=1</pre>
                            <pre className="mt-2 text-zinc-300">
                                {`{
  "stock": 9
}`}
                            </pre>
                            <div className="mt-4 border-t border-zinc-700 pt-2 text-red-400 text-xs whitespace-nowrap">
                                // If current seq_no is 35, returns 409 Conflict
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Architecture Patterns */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Server className="w-6 h-6 text-green-500" /> Architecture Patterns for High Velocity
                </h2>
                <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
                    <p>
                        A common mistake is trying to tune a single index to handle everything. You want the deep textual relevance of a search engine, but the real-time updates of a database.
                        If you force a massive index (e.g., 50GB) to refresh every 1 second just so price updates are live, you will kill your cluster with I/O overhead.
                    </p>
                    <p>
                        Instead, separate your data by its <span className="text-foreground font-medium">rate of change</span> (velocity).
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Sidecar Pattern */}
                    <div className="border-2 border-green-500/20 rounded-xl p-6 bg-green-50/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Activity className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="font-bold text-lg text-green-900">1. The Sidecar Index</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-zinc-600">
                            <li className="flex gap-2">
                                <span className="font-bold text-zinc-900 min-w-[80px]">Main Index:</span>
                                <div>
                                    Title, Description, Images. <br />
                                    <span className="text-xs bg-zinc-200 px-1 rounded">Refresh: 30s</span>
                                </div>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold text-zinc-900 min-w-[80px]">Sidecar:</span>
                                <div>
                                    Price, Stock, Availability. <br />
                                    <span className="text-xs bg-green-200 text-green-800 px-1 rounded">Refresh: 1s</span>
                                </div>
                            </li>
                        </ul>
                        <div className="mt-4 pt-4 border-t border-green-200 text-xs text-green-800 italic">
                            Query combines both at runtime (application join).
                        </div>
                    </div>

                    {/* API Fallback */}
                    <div className="border-2 border-blue-500/20 rounded-xl p-6 bg-blue-50/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Database className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-lg text-blue-900">2. Real-Time API Fallback</h3>
                        </div>
                        <p className="text-sm text-zinc-600 mb-3">
                            Search provides the <em>IDs</em>, but the UI fetches the source of truth for display.
                        </p>
                        <div className="bg-white rounded border border-blue-200 p-3 font-mono text-xs">
                            <div>1. Search returns: ["id_123", "id_456"]</div>
                            <div className="text-blue-600 mt-1">2. UI calls: GET /api/products?ids=123,456</div>
                            <div className="text-green-600 mt-1">3. Render with latest Price from Redis/SQL</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. War Story */}
            <section className="bg-zinc-900 text-zinc-100 rounded-xl p-8 border border-zinc-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-red-500" /> War Story: The 30-Minute Earthquake
                    </h3>
                    <div className="grid md:grid-cols-2 gap-8 text-sm text-zinc-400">
                        <div className="space-y-2">
                            <p>
                                <strong>The Setup:</strong> A major news portal cached search results for 5 minutes (TTL) to save costs.
                            </p>
                            <p>
                                <strong>The Incident:</strong> A massive earthquake hit. Millions searched "earthquake".
                            </p>
                            <p>
                                <strong>The Failure:</strong> The first user searched at T+0s (0 results). This empty result was cached.
                                For the next 5 minutes, 10 million users saw "No results found" while the homepage front story was... the earthquake.
                            </p>
                        </div>
                        <div className="bg-black/50 p-4 rounded-lg border border-zinc-700 font-mono text-xs">
                            <div className="text-green-400">LESSON LEARNED:</div>
                            <div className="mt-2 text-zinc-300">
                                Never cache "Zero Results" for high-velocity terms.
                                <br /><br />
                                Or better: Use event-driven invalidation (purge cache on 'publish' event) instead of time-based TTL.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Case Study: Flash Sale */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Zap className="w-6 h-6 text-amber-500" /> Case Study: The Flash Sale
                </h2>
                <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-6">
                    <p className="text-muted-foreground mb-6">
                        The ultimate stress test for search freshness is a "Flash Sale" or "Product Drop".
                        Imagine 10,000 users competing for 100 units of a limited sneaker.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-amber-900 mb-2">The Limit of NRT</h3>
                            <div className="prose prose-sm prose-amber text-amber-800">
                                <p>
                                    At T+0s, inventory drops to 0 in the database.
                                    The search index still thinks stock is 100 for the next 1 second (Refresh Interval).
                                </p>
                                <p>
                                    In that 1 second, <strong>500 more users</strong> click "Add to Cart" because Search said "In Stock".
                                    All 500 requests hit the database, fail, and show error messages.
                                    <strong>Result:</strong> Poor UX, DB overload, and customer rage.
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-amber-900 mb-2">The Architecture Fix</h3>
                            <div className="bg-white rounded-lg border border-amber-200 p-4 shadow-sm">
                                <ol className="space-y-3 text-sm">
                                    <li className="flex gap-2">
                                        <div className="bg-zinc-100 text-zinc-500 font-mono text-xs px-1.5 py-0.5 rounded h-fit">1</div>
                                        <span>
                                            <strong>Search (Discovery Only):</strong> Use Search ONLY to find the product ID. Do not trust its `stock` field for critical decisions.
                                        </span>
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="bg-zinc-100 text-zinc-500 font-mono text-xs px-1.5 py-0.5 rounded h-fit">2</div>
                                        <span>
                                            <strong>UI (Real-time Overlay):</strong> On the Product Page, fire a direct <code className="text-red-600 bg-red-50 px-1 rounded">GET /api/inventory/:id</code> to the primary DB.
                                        </span>
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="bg-zinc-100 text-zinc-500 font-mono text-xs px-1.5 py-0.5 rounded h-fit">3</div>
                                        <span>
                                            <strong>Graceful Degradation:</strong> If DB load is too high, assume "In Stock" but validate at Checkout (ultimate source of truth).
                                        </span>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Advanced: Measuring & Scaling */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Activity className="w-6 h-6 text-violet-500" /> Advanced: Measuring & Scaling
                </h2>

                <div className="space-y-12">
                    {/* Monitoring */}
                    <div className="space-y-6">
                        <div className="border-l-4 border-violet-500 pl-4">
                            <h3 className="text-xl font-bold text-foreground">1. Measuring the True Visibility Lag</h3>
                            <p className="text-muted-foreground mt-2">
                                You configured a 1s refresh, but under heavy indexing load (e.g., bulk backfill), Elasticsearch might intentionally skip refreshes to save CPU.
                                You cannot trust the configuration. You must measure the reality using a "Canary" loop.
                            </p>
                        </div>

                        <div className="bg-zinc-900 rounded-xl p-6 font-mono text-sm text-zinc-100 shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <Activity className="w-24 h-24" />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="space-y-2">
                                    <div className="text-violet-400 text-xs font-bold uppercase tracking-wider">Step 1: Write Canary</div>
                                    <div className="bg-black/50 p-3 rounded border border-zinc-700">
                                        <span className="text-purple-400">POST</span> /index/_doc/canary_123
                                        <pre className="text-zinc-400 mt-1">{`{ "timestamp": "2024-01-01T12:00:00.000Z" }`}</pre>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-violet-400 text-xs font-bold uppercase tracking-wider">Step 2: Poll Until Found</div>
                                    <div className="bg-black/50 p-3 rounded border border-zinc-700">
                                        <div className="flex justify-between text-xs text-zinc-500 mb-1">
                                            <span>Loop every 100ms...</span>
                                        </div>
                                        <span className="text-blue-400">GET</span> /index/_doc/canary_123
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-violet-400 text-xs font-bold uppercase tracking-wider">Step 3: Calculate Metric</div>
                                    <div className="p-3 rounded border border-green-900/50 bg-green-900/10 text-green-400">
                                        Lag = <span className="text-white">TimeFound</span> - <span className="text-white">TimeWritten</span>
                                    </div>
                                    <p className="text-zinc-500 text-xs italic">
                                        * If Lag &gt; 5s, trigger PagerDuty alert.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lambda Architecture */}
                    <div className="space-y-6">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h3 className="text-xl font-bold text-foreground">2. The Lambda Architecture (Hybrid)</h3>
                            <p className="text-muted-foreground mt-2">
                                For massive social feeds (Twitter, LinkedIn), even a 1-second lag is unacceptable. Users expect to see their own post <em>instantly</em>.
                                To achieve 0ms latency without killing the search cluster, we use a hybrid read-path.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            {/* Layer 1 */}
                            <div className="bg-red-50 border border-red-100 rounded-xl p-6 space-y-4">
                                <div className="bg-red-100 w-fit p-2 rounded-lg">
                                    <Zap className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-red-900">Speed Layer</h4>
                                    <p className="text-xs text-red-700 font-mono mt-1">Redis / Memcached</p>
                                </div>
                                <p className="text-sm text-red-800 leading-relaxed">
                                    Holds <strong>only the last 60 seconds</strong> of data. Fast, ephemeral, but expensive RAM.
                                </p>
                            </div>

                            {/* Plus */}
                            <div className="flex items-center justify-center">
                                <span className="text-4xl font-thin text-zinc-300">+</span>
                            </div>

                            {/* Layer 2 */}
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 space-y-4">
                                <div className="bg-blue-100 w-fit p-2 rounded-lg">
                                    <Database className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-900">Batch Layer</h4>
                                    <p className="text-xs text-blue-700 font-mono mt-1">Search Index</p>
                                </div>
                                <p className="text-sm text-blue-800 leading-relaxed">
                                    Holds <strong>everything older than 60 seconds</strong>. Efficient, scalable, cheaper disk.
                                </p>
                            </div>
                        </div>

                        <div className="bg-zinc-100 rounded-lg p-4 text-center border border-zinc-200 text-sm text-zinc-600">
                            <strong>Application Logic:</strong> <br />
                            <code className="bg-white px-2 py-1 rounded border border-zinc-300 mx-1">return merge(speed_layer, batch_layer).dedupe()</code>
                        </div>
                    </div>
                </div>
            </section>

            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/data/cleaning" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Cleaning & Normalization
                </Link>
                <Link href="/search/data/deletes" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Next: Deletes & Ghost Data <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
