"use client";

import { ArrowRight, ArrowLeft, ShieldCheck, AlertTriangle, CheckCircle2, Merge, FileStack, Trash2, RefreshCw, Database, Layers, HardDrive, Settings, Code2, BarChart3, Zap, Server, Activity, Book } from "lucide-react";
import Link from "next/link";

export default function Segments() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 3.5: Indexing &amp; Infrastructure</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Segments &amp; Immutability</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    The golden rule of Lucene: <span className="text-primary font-semibold">once written, never modified</span>.
                    This design enables lock-free reads, perfect caching, and crash recovery.
                </p>
            </div>

            <hr className="border-border" />

            {/* 1. Definition & Overview Section */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Book className="w-8 h-8" /> What is a Segment?
                </h2>
                <p className="text-foreground leading-relaxed">
                    A <strong>segment</strong> is an immutable, self-contained piece of the index. Every search query must check all segments,
                    then merge the results. Unlike traditional databases where indexes are a single mutable file, Lucene splits its index
                    into many segments that are created over time and periodically merged together.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="rounded-xl border-2 border-blue-500 bg-blue-50 p-6">
                        <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                            <Database className="w-5 h-5" /> Lucene Segment
                        </h4>
                        <ul className="text-sm text-blue-900 space-y-2">
                            <li>• <strong>Immutable</strong>: Never modified after creation</li>
                            <li>• <strong>Self-contained</strong>: Has its own term dictionary, postings, stored fields</li>
                            <li>• <strong>Searchable independently</strong>: Each segment can answer queries</li>
                            <li>• <strong>Created on refresh</strong>: New segment every 1 second (default)</li>
                        </ul>
                    </div>
                    <div className="rounded-xl border-2 border-zinc-300 bg-zinc-50 p-6">
                        <h4 className="font-bold text-zinc-700 mb-3 flex items-center gap-2">
                            <HardDrive className="w-5 h-5" /> Traditional DB Index
                        </h4>
                        <ul className="text-sm text-zinc-700 space-y-2">
                            <li>• <strong>Mutable</strong>: Updated in-place (B-tree pages)</li>
                            <li>• <strong>Single structure</strong>: One index file with locks</li>
                            <li>• <strong>Page-level writes</strong>: Complex crash recovery</li>
                            <li>• <strong>Immediate visibility</strong>: But at cost of locking</li>
                        </ul>
                    </div>
                </div>

                {/* Segment Directory Diagram */}
                <div className="bg-zinc-900 rounded-xl p-6">
                    <h4 className="font-bold text-zinc-100 mb-4">Index Directory Structure</h4>
                    <div className="font-mono text-sm text-zinc-300 overflow-x-auto">
                        <pre>{`/data/indices/my_index/
├── segments_5              ← Commit point (which segments are live)
├── _0.si                   ← Segment 0 info (metadata)
├── _0.cfs                  ← Compound file (all data)
├── _0.cfe                  ← Compound entries
├── _1.si                   ← Segment 1 info
├── _1_Lucene90_0.dvd       ← Doc values
├── _1_Lucene90_0.dvm       ← Doc values metadata
├── _1.fdx                  ← Stored fields index
├── _1.fdt                  ← Stored fields data
├── _1.liv                  ← Live docs bitmap (deleted = 0)
└── write.lock              ← Prevents concurrent writers`}</pre>
                    </div>
                </div>
            </section>

            {/* 2. Comparisons Table */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <BarChart3 className="w-8 h-8" /> Index Approaches Compared
                </h2>
                <p className="text-foreground leading-relaxed">
                    Different storage systems handle indexing differently. Lucene's segment-based approach is optimized for
                    read-heavy, write-once workloads typical in search. Here's how it compares to other approaches.
                </p>

                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">System</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Index Type</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Mutability</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Best For</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                            <tr className="bg-green-50">
                                <td className="px-4 py-3 font-bold text-green-800">Lucene/ES</td>
                                <td className="px-4 py-3">Inverted index + segments</td>
                                <td className="px-4 py-3 text-green-700">Immutable</td>
                                <td className="px-4 py-3">Full-text search, analytics</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-bold text-foreground">RocksDB</td>
                                <td className="px-4 py-3">LSM-Tree + SST files</td>
                                <td className="px-4 py-3">Immutable (SSTs)</td>
                                <td className="px-4 py-3">Key-value, high write throughput</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-bold text-foreground">PostgreSQL</td>
                                <td className="px-4 py-3">B-tree pages</td>
                                <td className="px-4 py-3">Mutable (in-place)</td>
                                <td className="px-4 py-3">OLTP, transactions</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-bold text-foreground">Cassandra SAI</td>
                                <td className="px-4 py-3">Per-SSTable index</td>
                                <td className="px-4 py-3">Immutable</td>
                                <td className="px-4 py-3">Secondary indexes at scale</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Why Immutability */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">Why Immutability?</h2>
                <p className="text-foreground leading-relaxed">
                    Most databases update data "in-place", overwriting the old record with the new one. While intuitive, this approach is full of dangers:
                    concurrency issues require complex locking, and a system crash during a write can leave the database corrupted.
                    Lucene takes a radically different approach: <strong>segments are immutable</strong>. Once a file is written to disk,
                    it is never changed. "Updating" a document means writing a new version to a <em>new</em> segment and marking the old one as deleted.
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="rounded-xl border-2 border-zinc-300 bg-zinc-50 p-6">
                        <div className="flex items-center gap-2 font-bold text-zinc-700 mb-4">
                            <Trash2 className="w-5 h-5" />
                            Mutable (Database)
                        </div>
                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm text-zinc-100">
                            <div>Row 1: John paid $100</div>
                            <div className="line-through text-red-400">Row 2: Jane paid $50</div>
                            <div className="text-amber-400">Row 2: Jane paid $200 (overwritten)</div>
                        </div>
                        <ul className="mt-4 space-y-1 text-sm text-red-700">
                            <li>• Requires locking during writes</li>
                            <li>• Risk of corruption on crash</li>
                            <li>• Cache invalidation complexity</li>
                        </ul>
                    </div>

                    <div className="rounded-xl border-2 border-green-500 bg-green-50 p-6">
                        <div className="flex items-center gap-2 font-bold text-green-700 mb-4">
                            <ShieldCheck className="w-5 h-5" />
                            Immutable (Lucene Segments)
                        </div>
                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm text-zinc-100">
                            <div className="text-green-400">Segment 1: Jane paid $50</div>
                            <div className="text-blue-400">Segment 2: Jane paid $200 (new!)</div>
                            <div className="text-zinc-500 mt-1">Original preserved, new segment added</div>
                        </div>
                        <ul className="mt-4 space-y-1 text-sm text-green-700">
                            <li>• No locks needed for reads</li>
                            <li>• Perfect cache utilization</li>
                            <li>• Crash recovery via translog</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* The Segment Lifecycle */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">The Segment Lifecycle</h2>
                <p className="text-foreground leading-relaxed">
                    How does a raw JSON document become a searchable immutable segment? It's a journey through memory and disk.
                    First, documents land in an <strong>In-Memory Buffer</strong> (RAM). Every second (by default), a process called <strong>Refresh</strong> turns
                    this buffer into a new small segment on disk. At this moment and only at this moment the document becomes visible to search.
                    This "refresh" mechanism is why Elasticsearch is called "Near Real-Time" (NRT).
                </p>

                {/* Lifecycle Visual Flow */}
                <div className="bg-zinc-900 rounded-xl p-8">
                    <div className="flex flex-col items-center gap-4 max-w-lg mx-auto">
                        {/* Stage 1: Buffer */}
                        <div className="w-full bg-blue-900 border border-blue-600 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-blue-200">1. In-Memory Buffer</div>
                                    <div className="text-xs text-blue-300 mt-1">Documents collected in RAM after translog write</div>
                                </div>
                                <span className="text-amber-400 text-xs font-bold">NOT SEARCHABLE</span>
                            </div>
                        </div>
                        <div className="text-2xl text-zinc-500">↓</div>

                        {/* Stage 2: Refresh */}
                        <div className="w-full bg-green-900 border border-green-600 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-green-200">2. Refresh → New Segment</div>
                                    <div className="text-xs text-green-300 mt-1">Buffer flushed to immutable segment file (every 1s)</div>
                                </div>
                                <span className="text-green-400 text-xs font-bold">SEARCHABLE ✓</span>
                            </div>
                        </div>
                        <div className="text-2xl text-zinc-500">↓</div>

                        {/* Stage 3: Accumulate */}
                        <div className="w-full bg-amber-900 border border-amber-600 rounded-lg p-4">
                            <div className="font-bold text-amber-200">3. Segments Accumulate</div>
                            <div className="flex gap-2 mt-3">
                                <div className="h-6 w-12 bg-amber-700 rounded text-xs flex items-center justify-center text-amber-200">50MB</div>
                                <div className="h-6 w-10 bg-amber-700 rounded text-xs flex items-center justify-center text-amber-200">30MB</div>
                                <div className="h-6 w-6 bg-amber-700 rounded text-xs flex items-center justify-center text-amber-200">5M</div>
                                <div className="h-6 w-4 bg-amber-700 rounded text-xs flex items-center justify-center text-amber-200">1</div>
                            </div>
                            <div className="text-xs text-amber-400 mt-2">⚠ Each query must check ALL segments</div>
                        </div>
                        <div className="text-2xl text-zinc-500">↓</div>

                        {/* Stage 4: Merge */}
                        <div className="w-full bg-purple-900 border border-purple-600 rounded-lg p-4">
                            <div className="font-bold text-purple-200">4. Merge (Background)</div>
                            <div className="text-xs text-purple-300 mt-1">Small segments combined, deleted docs removed</div>
                            <div className="flex gap-2 mt-3">
                                <div className="h-6 w-20 bg-purple-700 rounded text-xs flex items-center justify-center text-purple-200">86MB (merged)</div>
                            </div>
                            <div className="text-xs text-green-400 mt-2">✓ Disk space reclaimed</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Segment Files & Formats */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <FileStack className="w-8 h-8" /> Segment Files &amp; Formats
                </h2>
                <p className="text-foreground leading-relaxed">
                    Each segment consists of multiple files, each storing a specific type of data. Understanding these files
                    helps debug issues and optimize storage. The compound file format (.cfs) combines these into one file
                    for efficiency on older filesystems.
                </p>

                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">Extension</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Name</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Contents</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                            <tr className="bg-blue-50">
                                <td className="px-4 py-3 font-mono text-blue-700">segments_N</td>
                                <td className="px-4 py-3 font-bold">Commit Point</td>
                                <td className="px-4 py-3">Lists all live segments in the index</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-foreground">.si</td>
                                <td className="px-4 py-3 font-bold">Segment Info</td>
                                <td className="px-4 py-3">Metadata: doc count, codec, diagnostics</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-foreground">.cfs / .cfe</td>
                                <td className="px-4 py-3 font-bold">Compound File</td>
                                <td className="px-4 py-3">Bundled segment data (reduces file handles)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-foreground">.tim / .tip</td>
                                <td className="px-4 py-3 font-bold">Term Dictionary</td>
                                <td className="px-4 py-3">All unique terms + pointers to postings</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-foreground">.doc / .pos</td>
                                <td className="px-4 py-3 font-bold">Postings</td>
                                <td className="px-4 py-3">Doc IDs + positions for each term</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-foreground">.fdt / .fdx</td>
                                <td className="px-4 py-3 font-bold">Stored Fields</td>
                                <td className="px-4 py-3">Original document content (for _source)</td>
                            </tr>
                            <tr className="bg-red-50">
                                <td className="px-4 py-3 font-mono text-red-700">.liv</td>
                                <td className="px-4 py-3 font-bold">Live Docs</td>
                                <td className="px-4 py-3">Bitmap of non-deleted documents</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-foreground">.dvd / .dvm</td>
                                <td className="px-4 py-3 font-bold">Doc Values</td>
                                <td className="px-4 py-3">Columnar data for sorting/aggregations</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* The Tombstone Tax */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">The Tombstone Tax (Deletes)</h2>
                <p className="text-foreground leading-relaxed">
                    Because segments are immutable, deletes just mark documents as "dead" in a <code className="bg-muted px-1 rounded">.liv</code> file.
                    The data remains on disk until merge reclaims it. This creates hidden costs that grow with your delete rate.
                </p>

                <div className="bg-amber-100 border-2 border-amber-500 p-5 rounded-xl">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-1" />
                        <div className="w-full">
                            <h4 className="font-bold text-amber-900">Deleted Docs Still Consume Resources</h4>
                            <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm text-zinc-100 mt-3 space-y-1">
                                <div className="text-zinc-400">// Storage waste</div>
                                <div>Index: 100GB, 20% deleted → <span className="text-red-400">20GB wasted</span></div>
                                <div className="mt-2 text-zinc-400">// Query overhead</div>
                                <div>0% deleted: 10ms</div>
                                <div>20% deleted: 12ms (+20%)</div>
                                <div>50% deleted: <span className="text-red-400">18ms (+80%)</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Impact Table */}
                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">Delete Ratio</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Storage Overhead</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Query Slowdown</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Action Needed</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                            <tr className="bg-green-50">
                                <td className="px-4 py-3 text-green-800 font-bold">0-10%</td>
                                <td className="px-4 py-3">Minimal</td>
                                <td className="px-4 py-3">~5%</td>
                                <td className="px-4 py-3 text-green-700">Normal operation</td>
                            </tr>
                            <tr className="bg-amber-50">
                                <td className="px-4 py-3 text-amber-800 font-bold">10-30%</td>
                                <td className="px-4 py-3">Noticeable</td>
                                <td className="px-4 py-3">10-30%</td>
                                <td className="px-4 py-3 text-amber-700">Consider expunge_deletes</td>
                            </tr>
                            <tr className="bg-red-50">
                                <td className="px-4 py-3 text-red-800 font-bold">&gt;30%</td>
                                <td className="px-4 py-3">Severe</td>
                                <td className="px-4 py-3">50%+</td>
                                <td className="px-4 py-3 text-red-700">Force merge required</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Segment Explosion */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">The Segment Explosion Problem</h2>
                <p className="text-foreground leading-relaxed">
                    If we create a new segment every second, after an hour we'll have 3,600 files. After a day, 86,400.
                    Since every search query has to check <em>every</em> segment, performance degrades linearly with the number of segments.
                    To solve this, Lucene runs <strong>Background Merges</strong> constantly picking small segments and merging them into
                    larger ones (like 2048 game tiles).
                </p>

                {/* Segment Count Impact */}
                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">Segment Count</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Query Latency</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Memory Overhead</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">File Descriptors</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                            <tr className="bg-green-50">
                                <td className="px-4 py-3 text-green-800 font-bold">1-5</td>
                                <td className="px-4 py-3">10ms (baseline)</td>
                                <td className="px-4 py-3">Low</td>
                                <td className="px-4 py-3">~50</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-bold">10-50</td>
                                <td className="px-4 py-3">15ms (+50%)</td>
                                <td className="px-4 py-3">Moderate</td>
                                <td className="px-4 py-3">~500</td>
                            </tr>
                            <tr className="bg-amber-50">
                                <td className="px-4 py-3 text-amber-800 font-bold">100-500</td>
                                <td className="px-4 py-3">40ms (+300%)</td>
                                <td className="px-4 py-3">High</td>
                                <td className="px-4 py-3">~5,000</td>
                            </tr>
                            <tr className="bg-red-50">
                                <td className="px-4 py-3 text-red-800 font-bold">1,000+</td>
                                <td className="px-4 py-3">100ms+ (degraded)</td>
                                <td className="px-4 py-3">Critical</td>
                                <td className="px-4 py-3">Risk of exhaustion</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-xl border-2 border-red-300 bg-red-50 p-5">
                        <h4 className="font-bold text-red-800 mb-3">Symptoms of Too Many Segments</h4>
                        <ul className="text-sm text-red-900 space-y-2">
                            <li>• <strong>Query slowdown</strong>: Must check thousands of segments</li>
                            <li>• <strong>File handle exhaustion</strong>: Linux default ~65,000</li>
                            <li>• <strong>Memory pressure</strong>: Each segment has heap metadata</li>
                            <li>• <strong>Merge storms</strong>: Catch-up merging consumes all I/O</li>
                        </ul>
                    </div>

                    <div className="rounded-xl border-2 border-green-300 bg-green-50 p-5">
                        <h4 className="font-bold text-green-800 mb-3">Solutions</h4>
                        <div className="bg-zinc-900 rounded-lg p-3 font-mono text-xs text-zinc-100 space-y-2">
                            <div className="text-green-400">// Increase refresh interval</div>
                            <div>"refresh_interval": "30s" <span className="text-zinc-500">// vs 1s</span></div>
                            <div className="mt-3 text-green-400">// Disable during bulk load</div>
                            <div>"refresh_interval": "-1"</div>
                            <div className="mt-3 text-amber-400">// Force merge (read-only indices only!)</div>
                            <div>POST /index/_forcemerge?max_num_segments=1</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Shard & Segments Relationship */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Server className="w-8 h-8" /> Shards &amp; Segments
                </h2>
                <p className="text-foreground leading-relaxed">
                    In a distributed Elasticsearch cluster, each shard is an independent Lucene index with its own segments.
                    A query fans out to all shards, and each shard searches its own segments. This creates a multiplication effect:
                    <strong> total_segments = shards × segments_per_shard</strong>.
                </p>

                <div className="bg-zinc-900 rounded-xl p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-blue-900/50 border border-blue-600 rounded-lg p-4">
                            <div className="font-bold text-blue-200 mb-2">Shard 0 (Node A)</div>
                            <div className="flex flex-wrap gap-1">
                                <div className="h-4 w-8 bg-blue-700 rounded text-xs flex items-center justify-center text-blue-200">_0</div>
                                <div className="h-4 w-6 bg-blue-700 rounded text-xs flex items-center justify-center text-blue-200">_1</div>
                                <div className="h-4 w-10 bg-blue-700 rounded text-xs flex items-center justify-center text-blue-200">_2</div>
                            </div>
                            <div className="text-xs text-blue-400 mt-2">3 segments</div>
                        </div>
                        <div className="bg-green-900/50 border border-green-600 rounded-lg p-4">
                            <div className="font-bold text-green-200 mb-2">Shard 1 (Node B)</div>
                            <div className="flex flex-wrap gap-1">
                                <div className="h-4 w-12 bg-green-700 rounded text-xs flex items-center justify-center text-green-200">_0</div>
                                <div className="h-4 w-6 bg-green-700 rounded text-xs flex items-center justify-center text-green-200">_1</div>
                            </div>
                            <div className="text-xs text-green-400 mt-2">2 segments</div>
                        </div>
                        <div className="bg-purple-900/50 border border-purple-600 rounded-lg p-4">
                            <div className="font-bold text-purple-200 mb-2">Shard 2 (Node C)</div>
                            <div className="flex flex-wrap gap-1">
                                <div className="h-4 w-8 bg-purple-700 rounded text-xs flex items-center justify-center text-purple-200">_0</div>
                                <div className="h-4 w-8 bg-purple-700 rounded text-xs flex items-center justify-center text-purple-200">_1</div>
                                <div className="h-4 w-6 bg-purple-700 rounded text-xs flex items-center justify-center text-purple-200">_2</div>
                                <div className="h-4 w-4 bg-purple-700 rounded text-xs flex items-center justify-center text-purple-200">_3</div>
                            </div>
                            <div className="text-xs text-purple-400 mt-2">4 segments</div>
                        </div>
                    </div>
                    <div className="mt-4 text-center text-zinc-400 text-sm">
                        Query fan-out: 3 shards × ~3 segments each = <span className="text-amber-400 font-bold">9 segment searches</span>
                    </div>
                </div>

                <div className="bg-blue-100 border-2 border-blue-500 p-5 rounded-xl">
                    <h4 className="font-bold text-blue-800 mb-2">Impact on Query Performance</h4>
                    <ul className="text-sm text-blue-900 space-y-1">
                        <li>• More shards = more network overhead (coordinator gathers all results)</li>
                        <li>• Segment count per shard adds to per-node latency</li>
                        <li>• Hot spots occur when one shard has many more segments than others</li>
                        <li>• Force-merge across shards helps maintain uniform performance</li>
                    </ul>
                </div>
            </section>

            {/* 6. Practical Tuning Tips */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Settings className="w-8 h-8" /> Practical Tuning Tips
                </h2>
                <p className="text-foreground leading-relaxed">
                    Segment management requires balancing search latency, indexing throughput, and resource usage.
                    Here are production-tested guidelines for different workloads.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Refresh Tuning */}
                    <div className="rounded-xl border-2 border-blue-500 bg-blue-50 p-5">
                        <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                            <RefreshCw className="w-5 h-5" /> Refresh Interval Tuning
                        </h4>
                        <ul className="text-sm text-blue-900 space-y-2">
                            <li><strong>1s (default)</strong>: Real-time search, many small segments</li>
                            <li><strong>30s</strong>: Good for logs/metrics, fewer segments</li>
                            <li><strong>60s+</strong>: Near-batch workloads</li>
                            <li><strong>-1</strong>: Disabled bulk indexing only</li>
                        </ul>
                    </div>

                    {/* Merge Policies */}
                    <div className="rounded-xl border-2 border-purple-500 bg-purple-50 p-5">
                        <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                            <Merge className="w-5 h-5" /> Merge Policy Types
                        </h4>
                        <ul className="text-sm text-purple-900 space-y-2">
                            <li><strong>TieredMergePolicy</strong>: Default, balances size tiers</li>
                            <li><strong>LogByteSizeMergePolicy</strong>: Older, less adaptive</li>
                            <li><strong>max_merged_segment_size</strong>: Cap at 5GB (default)</li>
                            <li><strong>segments_per_tier</strong>: 10 (default), lower = more merging</li>
                        </ul>
                    </div>
                </div>

                {/* Force Merge Guidelines */}
                <div className="rounded-xl border-2 border-amber-500 bg-amber-50 p-5">
                    <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> When to Force Merge
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-amber-900 font-bold mb-2">✓ Good Use Cases:</p>
                            <ul className="text-sm text-amber-800 space-y-1">
                                <li>• After bulk indexing is complete</li>
                                <li>• Read-only/archived indices</li>
                                <li>• Before taking a snapshot</li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-sm text-amber-900 font-bold mb-2">✗ Avoid:</p>
                            <ul className="text-sm text-amber-800 space-y-1">
                                <li>• On actively written indices</li>
                                <li>• During peak query times</li>
                                <li>• On indices with ILM rollover</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Real-World Use Cases */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Activity className="w-8 h-8" /> Real-World Use Cases
                </h2>
                <p className="text-foreground leading-relaxed">
                    Understanding segment behavior in production helps you anticipate issues before they become problems.
                    Here are common scenarios and their segment patterns.
                </p>

                <div className="space-y-4">
                    {/* High Throughput Ingestion */}
                    <div className="rounded-xl border-2 border-orange-500 bg-orange-50 p-5">
                        <h4 className="font-bold text-orange-800 mb-2">🔥 High-Throughput Ingestion (10K docs/sec)</h4>
                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100 mt-2">
                            <div className="text-zinc-500"># Day 1 segment stats</div>
                            <div>Refresh: 1s → 86,400 segments created/day</div>
                            <div>After merge: ~50-100 segments (tiered policy)</div>
                            <div className="mt-2 text-amber-400">⚠ If merge can't keep up:</div>
                            <div className="text-red-400">→ Segment count grows to 1000+ → query degradation</div>
                        </div>
                        <p className="text-sm text-orange-800 mt-2">
                            <strong>Fix:</strong> Set refresh_interval: "30s" during ingestion, force-merge after.
                        </p>
                    </div>

                    {/* Logs Index */}
                    <div className="rounded-xl border-2 border-green-500 bg-green-50 p-5">
                        <h4 className="font-bold text-green-800 mb-2">📊 Logs Index (Time-Series)</h4>
                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100 mt-2">
                            <div className="text-zinc-500"># Typical ILM pattern</div>
                            <div>Hot phase: refresh=1s, many segments (search speed traded for freshness)</div>
                            <div>Warm phase: refresh=30s, force-merge to 1 segment</div>
                            <div>Cold phase: Read-only, 1 segment, searchable snapshot</div>
                        </div>
                        <p className="text-sm text-green-800 mt-2">
                            <strong>Key:</strong> Force-merge on rollover to warm tier.
                        </p>
                    </div>

                    {/* System Stats */}
                    <div className="rounded-xl border-2 border-blue-500 bg-blue-50 p-5">
                        <h4 className="font-bold text-blue-800 mb-2">📈 Typical Production Stats</h4>
                        <div className="grid md:grid-cols-3 gap-4 mt-2">
                            <div className="bg-white p-3 rounded-lg border border-blue-200 text-center">
                                <div className="text-2xl font-bold text-blue-800">15</div>
                                <div className="text-xs text-blue-600">Avg segments/shard</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-blue-200 text-center">
                                <div className="text-2xl font-bold text-blue-800">2.1GB</div>
                                <div className="text-xs text-blue-600">Avg segment size</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-blue-200 text-center">
                                <div className="text-2xl font-bold text-blue-800">8%</div>
                                <div className="text-xs text-blue-600">Deleted docs ratio</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. Code & API Snippets */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Code2 className="w-8 h-8" /> Code &amp; API Snippets
                </h2>
                <p className="text-foreground leading-relaxed">
                    Here are the essential Elasticsearch APIs and settings for monitoring and managing segments.
                </p>

                <div className="space-y-4">
                    {/* Check Segment Stats */}
                    <div className="bg-zinc-900 rounded-xl overflow-hidden">
                        <div className="bg-zinc-800 px-4 py-2 text-xs text-zinc-400 flex items-center justify-between">
                            <span>Check Segment Stats</span>
                            <span className="text-green-400">GET</span>
                        </div>
                        <div className="p-4 font-mono text-sm text-zinc-100 overflow-x-auto">
                            <div className="text-zinc-500"># Per-index segment info</div>
                            <div>GET /my_index/_segments</div>
                            <div className="mt-3 text-zinc-500"># Human-readable summary</div>
                            <div>GET /_cat/segments/my_index?v&amp;h=index,shard,segment,docs.count,size</div>
                            <div className="mt-3 text-zinc-500"># Index stats including segment count</div>
                            <div>GET /my_index/_stats/segments</div>
                        </div>
                    </div>

                    {/* Configure Settings */}
                    <div className="bg-zinc-900 rounded-xl overflow-hidden">
                        <div className="bg-zinc-800 px-4 py-2 text-xs text-zinc-400 flex items-center justify-between">
                            <span>Index Settings</span>
                            <span className="text-amber-400">PUT</span>
                        </div>
                        <div className="p-4 font-mono text-sm text-zinc-100 overflow-x-auto">
                            <div>PUT /my_index/_settings</div>
                            <div>{'{'}</div>
                            <div className="pl-4 text-amber-400">"index.refresh_interval": <span className="text-green-400">"30s"</span>,</div>
                            <div className="pl-4 text-amber-400">"index.merge.policy.max_merged_segment": <span className="text-green-400">"5gb"</span>,</div>
                            <div className="pl-4 text-amber-400">"index.merge.policy.segments_per_tier": <span className="text-blue-400">10</span>,</div>
                            <div className="pl-4 text-amber-400">"index.merge.policy.deletes_pct_allowed": <span className="text-blue-400">20</span></div>
                            <div>{'}'}</div>
                        </div>
                    </div>

                    {/* Force Merge */}
                    <div className="bg-zinc-900 rounded-xl overflow-hidden">
                        <div className="bg-zinc-800 px-4 py-2 text-xs text-zinc-400 flex items-center justify-between">
                            <span>Force Merge Operations</span>
                            <span className="text-red-400">POST</span>
                        </div>
                        <div className="p-4 font-mono text-sm text-zinc-100 overflow-x-auto">
                            <div className="text-zinc-500"># Merge to single segment (read-only index only!)</div>
                            <div>POST /my_index/_forcemerge?max_num_segments=1</div>
                            <div className="mt-3 text-zinc-500"># Just expunge deletes (safer)</div>
                            <div>POST /my_index/_forcemerge?only_expunge_deletes=true</div>
                            <div className="mt-3 text-zinc-500"># Background merge (non-blocking)</div>
                            <div>POST /my_index/_forcemerge?max_num_segments=5&amp;wait_for_completion=false</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Write Amplification */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Write Amplification: The Hidden Cost</h2>
                <p className="text-foreground leading-relaxed">
                    Immutability has a hidden cost: write amplification. Because segments are never modified in place,
                    the same data gets rewritten multiple times as it moves through the system first to the translog,
                    then to a segment, then through multiple merge phases.
                </p>

                <div className="bg-zinc-900 rounded-xl p-6">
                    <div className="text-zinc-400 text-sm mb-4">You write 1 document, but it's written 5-7 times:</div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="font-mono text-sm text-zinc-100 space-y-1">
                            <div>1. Translog (fsync)</div>
                            <div>2. In-memory buffer</div>
                            <div>3. Refresh → new segment</div>
                            <div>4. Merge level 1</div>
                            <div>5. Merge level 2</div>
                            <div>6. Merge level 3</div>
                        </div>
                        <div className="bg-zinc-800 rounded-lg p-4">
                            <div className="text-xs font-bold text-amber-400 uppercase mb-2">Capacity Planning</div>
                            <div className="font-mono text-sm text-zinc-100 space-y-1">
                                <div>Ingestion: 10 MB/sec (logical)</div>
                                <div>Actual I/O: <span className="text-red-400">50-70 MB/sec</span></div>
                                <div className="border-t border-zinc-700 pt-1 mt-2 text-zinc-400">
                                    Plan for 7x write amplification.
                                    Use SSDs. Leave 50% headroom.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 10. Enhanced Key Takeaways */}
            <section className="bg-green-100 border-2 border-green-500 p-6 rounded-xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-800">
                    <CheckCircle2 className="w-5 h-5" /> Key Takeaways
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-bold text-green-800 mb-2">Core Principles</h4>
                        <ul className="space-y-2 text-sm text-green-900">
                            <li className="flex items-start gap-2">
                                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                                <span><strong>Segments are immutable</strong> → lock-free reads, perfect caching, crash recovery.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <RefreshCw className="w-4 h-4 shrink-0 mt-0.5" />
                                <span><strong>Refresh creates segments</strong> → data searchable within ~1s. Tune for your workload.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Merge className="w-4 h-4 shrink-0 mt-0.5" />
                                <span><strong>Merge reclaims space</strong> → force-merge only for read-only indices.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span><strong>Write amplification is 5-7x</strong> → plan disk capacity accordingly.</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-green-800 mb-2">Best Practices Checklist</h4>
                        <ul className="space-y-1 text-sm text-green-900">
                            <li>☑ Set refresh_interval &gt; 1s for ingestion-heavy indices</li>
                            <li>☑ Monitor segment count with _cat/segments</li>
                            <li>☑ Force-merge after bulk loads complete</li>
                            <li>☑ Use ILM to automate segment management</li>
                            <li>☑ Keep delete ratio below 30%</li>
                            <li>☑ Plan storage for 7x write amplification</li>
                            <li>☑ Use SSDs for merge I/O performance</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/indexing/vectors" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 3.4 Vector Indices
                </Link>
                <Link href="/search/indexing/sharding" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Next: Sharding &amp; Scale <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
