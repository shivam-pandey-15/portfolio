"use client";

import { ArrowRight, ArrowLeft, ArrowDown, Clock, CheckCircle2, Database, Zap, RefreshCw, AlertTriangle, Book, Activity, Layers, Search, Server, Monitor, FileText } from "lucide-react";
import Link from "next/link";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Tune Refresh Interval", description: "Default 1s is too aggressive for heavy writes. Set to 30s+ to reduce segment creation overhead by 90%." },
    { title: "Monitor OS Page Cache", description: "Elasticsearch relies on the OS for caching. If you starve the FS cache (by giving Heap > 50%), latency tanks." },
    { title: "Filter First", description: "Filter clauses are cached (bitsets) and fast. Use them to narrow down the document set before expensive scoring runs." },
    { title: "Fetch Less", description: "Retrieving large _source fields is a network bottleneck. Use source filtering to get only what you display." }
];

export default function Paths() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 3.7: Indexing &amp; Infrastructure</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">The Write &amp; Query Path</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Indexing is not instantaneous, and searching is not magic. This chapter traces the lifecycle of a request millisecond by millisecond,
                    from the client call to the disk commit, revealing where latency hides.
                </p>
            </div>

            <hr className="border-border" />

            {/* 1. Introduction & Context */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Book className="w-8 h-8" /> Architecture Overview
                </h2>
                <p className="text-foreground leading-relaxed">
                    Understanding the "Write Path" (how data gets in) and the "Query Path" (how data gets out) is critical for performance tuning.
                    Elasticsearch optimizes for <strong>read speed</strong> and <strong>data safety</strong>, sometimes at the expense of write latency or immediate visibility.
                    We will walk through exactly what happens when you index a document and when you search for it.
                </p>
            </section>

            {/* 2. Definitions */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Book className="w-8 h-8" /> Key Terminology
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-zinc-50 border-2 border-zinc-200 rounded-xl p-5">
                        <h3 className="font-bold text-zinc-900 mb-2">Infrastructure</h3>
                        <ul className="space-y-2 text-sm text-zinc-700">
                            <li><strong>Coordinator:</strong> The node that receives the client request. It routes data to shards (write) or scatters queries (read).</li>
                            <li><strong>Shard:</strong> A self-contained Lucene index. Can be a Primary (writes) or Replica (reads/failover).</li>
                            <li><strong>Segment:</strong> An immutable file containing a portion of the inverted index. Searchable.</li>
                        </ul>
                    </div>
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                        <h3 className="font-bold text-blue-900 mb-2">Operations</h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li><strong>Translog:</strong> "Transaction Log". A sequential append-only file on disk. Guarantees DURABILITY.</li>
                            <li><strong>Refresh:</strong> Process of making data SEARCHABLE. Writes buffer to a new segment.</li>
                            <li><strong>Flush:</strong> Process of making data PERSISTENT. Fsyncs segments and clears translog.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* The Write Path */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Database className="w-8 h-8" />
                    The Write Path (Indexing)
                </h2>

                <p className="text-foreground leading-relaxed">
                    When you call <code className="bg-muted px-1 rounded">PUT /products/_doc/1</code>, the goal is <strong>durability</strong> (don't lose data)
                    and <strong>eventual searchability</strong>.
                    Data is durable almost instantly (Translog), but searchable only after a refresh (default 1s).
                    This split allows high ingestion rates while ensuring safety.
                </p>

                {/* 3. Write Path Diagram */}
                <div className="bg-zinc-900 rounded-xl p-8">
                    <div className="flex flex-col items-center gap-4 max-w-lg mx-auto">
                        {/* Step 1: Coordinator */}
                        <div className="w-full bg-zinc-700 border border-zinc-500 rounded-lg p-4 relative">
                            <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-xs text-zinc-400 w-10 text-right">0.1ms</div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-zinc-100 text-sm">1. Coordinator Node</div>
                                    <div className="text-xs text-zinc-400">Hashes ID, routes to Primary Shard</div>
                                </div>
                            </div>
                        </div>
                        <ArrowDown className="w-5 h-5 text-zinc-500" />

                        {/* Shard Container */}
                        <div className="w-full border-2 border-dashed border-zinc-700 rounded-xl p-4 relative">
                            <div className="absolute -top-3 left-4 bg-zinc-900 px-2 text-xs text-zinc-400">Primary Shard</div>

                            {/* Parallel: Translog & Buffer */}
                            <div className="flex gap-4">
                                {/* Step 2: Translog */}
                                <div className="flex-1 bg-green-900 border border-green-600 rounded-lg p-3">
                                    <div className="font-bold text-green-200 text-sm">2. Translog</div>
                                    <div className="text-xs text-green-300">fsync to disk</div>
                                    <div className="mt-2 bg-green-950 rounded px-1 py-0.5 text-[10px] text-green-400 text-center font-bold">
                                        DURABLE ✓
                                    </div>
                                </div>

                                {/* Step 3: Buffer */}
                                <div className="flex-1 bg-amber-900 border border-amber-600 rounded-lg p-3">
                                    <div className="font-bold text-amber-200 text-sm">3. Memory Buffer</div>
                                    <div className="text-xs text-amber-300">Build Inverted Index</div>
                                    <div className="mt-2 bg-amber-950 rounded px-1 py-0.5 text-[10px] text-amber-500 text-center font-bold">
                                        NOT SEARCHABLE ⚠
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ArrowDown className="w-5 h-5 text-zinc-500" />

                        {/* Step 4: Replicate */}
                        <div className="w-full bg-blue-900 border border-blue-600 rounded-lg p-4">
                            <div className="font-bold text-blue-200 text-sm">4. Replicate</div>
                            <div className="text-xs text-blue-300">Forward to all Replica Shards</div>
                        </div>

                        <ArrowDown className="w-5 h-5 text-zinc-500" />

                        {/* Step 5: Response */}
                        <div className="w-full bg-zinc-100 text-zinc-900 rounded-lg p-4 text-center">
                            <div className="font-bold">200 OK</div>
                            <div className="text-sm text-zinc-600 mt-1">Total Time: ~5-10ms</div>
                        </div>
                    </div>
                </div>

                {/* 4. Expand Write Path Details */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="rounded-xl border-2 border-green-500 bg-green-50 p-5">
                        <div className="flex items-center gap-2 mb-3 text-green-800">
                            <Database className="w-5 h-5" />
                            <h4 className="font-bold">Translog (Durability)</h4>
                        </div>
                        <p className="text-sm text-green-900 leading-snug">
                            Writing a full Lucene segment is expensive. The <strong>Translog</strong> is a cheap, sequential file.
                            We write here <em>synchronously</em> to ensure data isn't lost if the node crashes.
                        </p>
                    </div>
                    <div className="rounded-xl border-2 border-amber-500 bg-amber-50 p-5">
                        <div className="flex items-center gap-2 mb-3 text-amber-800">
                            <RefreshCw className="w-5 h-5" />
                            <h4 className="font-bold">Refresh (Searchability)</h4>
                        </div>
                        <p className="text-sm text-amber-900 leading-snug">
                            Every <strong>1 second</strong> (default), the Memory Buffer is written to a new, read-only <strong>Segment</strong>.
                            The buffer is cleared. ONLY NOW is the document visible to search.
                        </p>
                    </div>
                    <div className="rounded-xl border-2 border-blue-500 bg-blue-50 p-5">
                        <div className="flex items-center gap-2 mb-3 text-blue-800">
                            <Server className="w-5 h-5" />
                            <h4 className="font-bold">Flush (Persistence)</h4>
                        </div>
                        <p className="text-sm text-blue-900 leading-snug">
                            When the Translog gets too big (512MB) or every 30m, a <strong>Flush</strong> occurs.
                            It commits segments to disk, clears the Translog, and ensures clean restart.
                        </p>
                    </div>
                </div>
            </section>

            {/* 5. Segment Files */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <FileText className="w-8 h-8" /> What's in a Segment?
                </h2>
                <p className="text-foreground leading-relaxed">
                    A segment isn't just one file; it's a collection of highly optimized structures rooted in the <strong>Inverted Index</strong>.
                </p>
                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">Structure</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">File Ext</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Purpose</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                            <tr>
                                <td className="px-4 py-2 font-bold text-blue-700">Inverted Index</td>
                                <td className="px-4 py-2 font-mono text-zinc-500">.tip, .tim</td>
                                <td className="px-4 py-2">Maps terms → doc IDs. Used for full-text search.</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 font-bold text-purple-700">Doc Values</td>
                                <td className="px-4 py-2 font-mono text-zinc-500">.dvd, .dvm</td>
                                <td className="px-4 py-2">Columnar storage. Used for sorting &amp; aggregations.</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 font-bold text-green-700">Stored Fields</td>
                                <td className="px-4 py-2 font-mono text-zinc-500">.fdt, .fdx</td>
                                <td className="px-4 py-2">Original JSON (<code className="text-xs bg-zinc-100 rounded px-1">_source</code>). Retrieved at end of search.</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 font-bold text-pink-700">BKD Tree</td>
                                <td className="px-4 py-2 font-mono text-zinc-500">.dim, .dii</td>
                                <td className="px-4 py-2">Numeric &amp; spatial points. Used for numeric range filters.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 10. Failure & Recovery */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8" /> Failure &amp; Recovery
                </h2>
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                    <h3 className="font-bold text-red-900 mb-3">What happens if a node crashes mid-write?</h3>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="bg-white border border-red-200 rounded p-2 h-fit shrink-0 font-mono text-xs font-bold text-red-800">Scenario 1</div>
                            <p className="text-sm text-red-800">
                                <strong>Crash BEFORE Translog fsync:</strong> The client receives a 500 error or timeout.
                                Data is NOT on disk. The write is lost, but the client knows it failed and can retry.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className="bg-white border-green-200 border rounded p-2 h-fit shrink-0 font-mono text-xs font-bold text-green-800">Scenario 2</div>
                            <p className="text-sm text-green-900">
                                <strong>Crash AFTER Translog fsync:</strong> Client got 200 OK, but data wasn't in a segment yet.
                                On restart, Elasticsearch <strong>replays the Translog</strong>, rebuilding the memory buffer and segments.
                                No data is lost.
                            </p>
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
                    Distributed search solves the <strong>Scatter-Gather</strong> problem.
                    We don't want to send huge JSON documents across the network until we know which ones matched.
                    Thus, search is split into two distinct phases.
                </p>

                {/* 6. Query Path Graph */}
                <div className="bg-zinc-900 rounded-xl p-8">
                    <div className="grid md:grid-cols-2 gap-12 relative">
                        {/* Connecting Arrow */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:block hidden text-zinc-500">
                            <ArrowRight className="w-8 h-8" />
                        </div>

                        {/* Phase 1 */}
                        <div className="border border-zinc-700 rounded-lg p-5">
                            <div className="text-blue-400 font-bold mb-4 uppercase tracking-wider text-sm">Phase 1: Query (Scatter)</div>
                            <ul className="space-y-3 text-sm text-zinc-300">
                                <li className="flex gap-2">
                                    <span className="bg-zinc-800 w-6 h-6 rounded flex items-center justify-center text-xs">1</span>
                                    <span>Coordinator sends query to <strong>all relevant shards</strong>.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="bg-zinc-800 w-6 h-6 rounded flex items-center justify-center text-xs">2</span>
                                    <span>Each shard scores docs locally (Inverted Index).</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="bg-zinc-800 w-6 h-6 rounded flex items-center justify-center text-xs">3</span>
                                    <span>Shard returns <strong>only IDs + Scores</strong>.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="bg-zinc-800 w-6 h-6 rounded flex items-center justify-center text-xs">4</span>
                                    <span>Coordinator sorts & merges to find Global Top 10.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Phase 2 */}
                        <div className="border border-zinc-700 rounded-lg p-5">
                            <div className="text-green-400 font-bold mb-4 uppercase tracking-wider text-sm">Phase 2: Fetch (Gather)</div>
                            <ul className="space-y-3 text-sm text-zinc-300">
                                <li className="flex gap-2">
                                    <span className="bg-zinc-800 w-6 h-6 rounded flex items-center justify-center text-xs">1</span>
                                    <span>Coordinator knows exactly which docs won.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="bg-zinc-800 w-6 h-6 rounded flex items-center justify-center text-xs">2</span>
                                    <span>Requests <strong>full _source</strong> from specific shards.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="bg-zinc-800 w-6 h-6 rounded flex items-center justify-center text-xs">3</span>
                                    <span>Shards read from <strong>Stored Fields</strong> (.fdt).</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="bg-zinc-800 w-6 h-6 rounded flex items-center justify-center text-xs">4</span>
                                    <span>Coordinator assembles JSON response.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 8. Filters Latency */}
                <div className="rounded-xl border-2 border-border overflow-hidden">
                    <div className="bg-muted px-4 py-2 font-bold text-sm text-foreground flex justify-between">
                        <span>Latency Breakdown</span>
                    </div>
                    <div className="flex h-12">
                        <div className="bg-zinc-500 w-[5%] flex items-center justify-center text-[10px] text-white font-bold">Parse</div>
                        <div className="bg-blue-600 w-[60%] flex items-center justify-center text-xs text-white font-bold">Query / Scoring (20ms)</div>
                        <div className="bg-amber-600 w-[10%] flex items-center justify-center text-[10px] text-white font-bold">Merge</div>
                        <div className="bg-green-600 w-[25%] flex items-center justify-center text-xs text-white font-bold">Fetch (5ms)</div>
                    </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 text-sm mb-1">Why Filters are Faster</h4>
                    <p className="text-sm text-blue-800">
                        Filters (e.g., <code className="bg-white/50 px-1 rounded">term</code>, <code className="bg-white/50 px-1 rounded">range</code>) run <em>before</em> scoring.
                        They discard non-matching documents cheaply using bitsets.
                        The expensive scoring algorithm (BM25) then only runs on the small subset of remaining docs.
                    </p>
                </div>
            </section>

            {/* 9. Metrics & Timings */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Activity className="w-8 h-8" /> Typical Latencies
                </h2>
                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">Phase</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Latency Goal</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Bottleneck</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                            <tr className="bg-green-50">
                                <td className="px-4 py-2 font-bold text-green-800">Simple Write</td>
                                <td className="px-4 py-2 text-green-700">1 - 5 ms</td>
                                <td className="px-4 py-2">Disk I/O (Translog fsync)</td>
                            </tr>
                            <tr className="bg-amber-50">
                                <td className="px-4 py-2 font-bold text-amber-800">Heavy Bulk Write</td>
                                <td className="px-4 py-2 text-amber-700">50 - 200 ms</td>
                                <td className="px-4 py-2">CPU (Tokenization) + Memory Buffer</td>
                            </tr>
                            <tr className="bg-blue-50">
                                <td className="px-4 py-2 font-bold text-blue-800">Query (Cached)</td>
                                <td className="px-4 py-2 text-blue-700">&lt; 10 ms</td>
                                <td className="px-4 py-2">Network RTT</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 font-bold">Query (Complex)</td>
                                <td className="px-4 py-2">50 - 500 ms</td>
                                <td className="px-4 py-2">CPU (Scoring millions of docs)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 font-bold">Fetch (Big Docs)</td>
                                <td className="px-4 py-2">20 - 100 ms</td>
                                <td className="px-4 py-2">Network Bandwidth (JSON size)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 7. Caching Layers */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Layers className="w-8 h-8" /> Caching Layers
                </h2>
                <div className="space-y-4">
                    <p className="text-foreground leading-relaxed">
                        Why is the second run of a query often <strong>10x faster</strong>? It's not magic; it's caching at three distinct levels.
                        Optimizing cache usage is the cheapest way to improve performance.
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                        <h4 className="font-bold text-blue-900 mb-2">The "Warm Up" Effect</h4>
                        <p className="text-sm text-blue-800">
                            <strong>Cold Run (100ms):</strong> Disk I/O to read segments + CPU to score docs + CPU to parse JSON.<br />
                            <strong>Warm Run (5ms):</strong> RAM access (OS Cache) + Bitset lookup (Node Cache) + Pre-computed Result (Shard Cache).
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
                        <div className="font-bold text-purple-900 mb-2">1. Node Query Cache</div>
                        <p className="text-xs text-purple-700 mb-3 leading-relaxed">
                            Caches the <strong>results of filter clauses</strong> (like `status:active`) as bitsets (001010).
                        </p>
                        <ul className="text-xs text-purple-800 space-y-2">
                            <li>• <strong>Why it helps:</strong> Skipping 1M docs becomes a fast bitwise AND operation.</li>
                            <li>• <strong>Scope:</strong> Shared by all shards on a node.</li>
                            <li>• <strong>Policy:</strong> LRU. Only caches segments &gt; 10k docs.</li>
                        </ul>
                    </div>
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                        <div className="font-bold text-blue-900 mb-2">2. Shard Request Cache</div>
                        <p className="text-xs text-blue-700 mb-3 leading-relaxed">
                            Caches the <strong>full JSON response</strong> for search/aggregations (e.g., "Top 5 Categories").
                        </p>
                        <ul className="text-xs text-blue-800 space-y-2">
                            <li>• <strong>Why it helps:</strong> Returns instant results for dashboards/reports. Zero CPU usage.</li>
                            <li>• <strong>Invalidation:</strong> Invalidated instantly on <strong>Segment Refresh</strong>.</li>
                        </ul>
                    </div>
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
                        <div className="font-bold text-green-900 mb-2">3. OS Page Cache</div>
                        <p className="text-xs text-green-700 mb-3 leading-relaxed">
                            The Kernel automatically keeps <strong>hot file blocks in RAM</strong>.
                        </p>
                        <ul className="text-xs text-green-800 space-y-2">
                            <li>• <strong>Why it helps:</strong> Turns expensive Disk Random I/O (10ms) into RAM access (100ns).</li>
                            <li>• <strong>Tip:</strong> Never allocate &gt;50% RAM to Java Heap. Leave 50% for this!</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 11. Monitoring & Tools */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Monitor className="w-8 h-8" /> Monitoring &amp; Debugging
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-zinc-900 rounded-xl p-5">
                        <h4 className="font-bold text-zinc-100 mb-2 text-sm flex justify-between">
                            <span>Inspect Write State</span>
                            <span className="text-zinc-500">CLI</span>
                        </h4>
                        <div className="font-mono text-xs text-green-400 space-y-2">
                            <div>GET /_cat/indices?v</div>
                            <div className="text-zinc-500"># Check segment counts</div>
                            <div>GET /_cat/segments/my-index?v</div>
                            <div className="text-zinc-500"># Check refresh performance</div>
                            <div>GET /my-index/_stats/refresh</div>
                        </div>
                    </div>
                    <div className="bg-zinc-900 rounded-xl p-5">
                        <h4 className="font-bold text-zinc-100 mb-2 text-sm flex justify-between">
                            <span>Debug Queries</span>
                            <span className="text-zinc-500">API</span>
                        </h4>
                        <div className="font-mono text-xs text-blue-400 space-y-2">
                            <div className="text-zinc-500"># Why is this specific query slow?</div>
                            <div>GET /_search?error_trace=true</div>
                            <div>{`{ "profile": true, "query": ... }`}</div>
                            <div className="text-zinc-500"># Production Slow Log settings</div>
                            <div>index.search.slowlog.threshold.query.warn: 10s</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/indexing/sharding" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 3.6 Sharding
                </Link>
                <Link href="/search/data-foundation/quality" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90">
                    Chapter 4: Data Foundation <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
