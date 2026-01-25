"use client";

import { ArrowRight, ArrowLeft, Server, Network, CheckCircle2, AlertTriangle, Database, Hash, Layers, RefreshCw, Settings, Code2, Activity, Book, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Horizontal Scale", description: "Sharding splits data across nodes to exceed single-machine limits. Shards are independent Lucene indices." },
    { title: "Deterministic Routing", description: "hash(id) % shards guarantees we always know where a document lives. Changing shard count breaks this (reindex required)." },
    { title: "Replicas = Safety + Speed", description: "Replica shards provide HA (failover) and increase read throughput (load balancing)." },
    { title: "Deep Pagination Danger", description: "Scatter-Gather requires sorting (shards * page_size) docs in memory. Use search_after for deep scrolling." }
];

export default function Sharding() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 3.6: Indexing &amp; Infrastructure</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Sharding &amp; Scale</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    When one server isn't enough. Sharding splits an index across multiple machines
                    for horizontal scale and fault tolerance.
                </p>
            </div>

            <hr className="border-border" />

            {/* 1. Definition & Overview */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Book className="w-8 h-8" /> What is a Shard?
                </h2>
                <p className="text-foreground leading-relaxed">
                    A <strong>shard</strong> is a horizontal partition of your index a self-contained slice of your data that can live on any node in the cluster.
                    This is the same concept as horizontal partitioning in database systems, where a large table is split across multiple servers.
                    In Elasticsearch, each shard is a complete Lucene index with its own segments, term dictionaries, and search capabilities.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="rounded-xl border-2 border-blue-500 bg-blue-50 p-6">
                        <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                            <Database className="w-5 h-5" /> Elasticsearch Shard
                        </h4>
                        <ul className="text-sm text-blue-900 space-y-2">
                            <li>• <strong>Horizontal partition</strong> of index data</li>
                            <li>• <strong>Complete Lucene index</strong> internally</li>
                            <li>• Can be <strong>primary</strong> or <strong>replica</strong></li>
                            <li>• <strong>Independently searchable</strong> and recoverable</li>
                        </ul>
                    </div>
                    <div className="rounded-xl border-2 border-zinc-300 bg-zinc-50 p-6">
                        <h4 className="font-bold text-zinc-700 mb-3 flex items-center gap-2">
                            <Layers className="w-5 h-5" /> Database Horizontal Partitioning
                        </h4>
                        <ul className="text-sm text-zinc-700 space-y-2">
                            <li>• <strong>Range partitioning</strong>: by date range, ID range</li>
                            <li>• <strong>Hash partitioning</strong>: by hash(key) % N</li>
                            <li>• <strong>List partitioning</strong>: by category values</li>
                            <li>• Elasticsearch uses <strong>hash partitioning</strong></li>
                        </ul>
                    </div>
                </div>

                {/* Visual: Index to Shards */}
                <div className="bg-zinc-900 rounded-xl p-6">
                    <h4 className="font-bold text-zinc-100 mb-4">An Index is a Collection of Shards</h4>
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-blue-800 border border-blue-500 rounded-lg px-8 py-3 text-blue-100 font-bold">
                            Index: "products"
                        </div>
                        <div className="text-zinc-500">splits into</div>
                        <div className="flex gap-3">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-green-800 border border-green-500 rounded-lg px-4 py-2 text-green-100 text-sm">
                                    Shard {i}
                                </div>
                            ))}
                        </div>
                        <div className="text-xs text-zinc-400 mt-2">Each shard is a complete Lucene index</div>
                    </div>
                </div>
            </section>

            {/* Why Shard */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">Why Shard?</h2>
                <p className="text-foreground leading-relaxed">
                    A single machine has hard physical limits: RAM is finite, CPU cores are limited, and disks fill up.
                    When your data exceeds these limits (e.g., 5TB index on a 1TB machine) or your query volume is too high for one CPU to handle,
                    you must scale horizontally. Sharding breaks your single index into smaller, manageable chunks called <strong>shards</strong>,
                    which can be distributed across multiple servers.
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="rounded-xl border-2 border-zinc-300 bg-zinc-50 p-6">
                        <div className="font-bold text-zinc-700 mb-4">Single Node</div>
                        <div className="flex justify-center py-8">
                            <div className="w-24 h-24 bg-zinc-300 rounded-lg flex items-center justify-center">
                                <Server className="w-10 h-10 text-zinc-600" />
                            </div>
                        </div>
                        <p className="text-sm text-red-700 text-center">Limited by one machine's CPU, RAM, disk</p>
                    </div>

                    <div className="rounded-xl border-2 border-green-500 bg-green-50 p-6">
                        <div className="font-bold text-green-700 mb-4">Sharded (5 Shards, 1 Replica)</div>
                        <div className="flex flex-col gap-2 py-4">
                            <div className="flex justify-center gap-2">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-12 h-12 bg-green-300 rounded-lg flex items-center justify-center border-2 border-green-500">
                                        <div className="text-green-800 font-bold text-xs">P{i}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center gap-2">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center border border-green-400">
                                        <div className="text-green-700 text-xs">R{i}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-green-700 text-center">Scale out by adding machines. Replicas for availability.</p>
                    </div>
                </div>
            </section>

            {/* 2. Primary vs Replica Shards */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Shield className="w-8 h-8" /> Primary vs Replica Shards
                </h2>
                <p className="text-foreground leading-relaxed">
                    Every shard has a role. <strong>Primary shards</strong> handle all write operations and are the authoritative copy of the data.
                    <strong>Replica shards</strong> are copies of primaries that provide two critical benefits: fault tolerance (if a node dies, replicas take over)
                    and read throughput (search queries can be served by any copy).
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="rounded-xl border-2 border-blue-500 bg-blue-50 p-6">
                        <h4 className="font-bold text-blue-800 mb-3">Primary Shard</h4>
                        <ul className="text-sm text-blue-900 space-y-2">
                            <li>• <strong>Handles all writes</strong> (index, update, delete)</li>
                            <li>• <strong>Authoritative copy</strong> of the data</li>
                            <li>• <strong>Replicates</strong> operations to replica shards</li>
                            <li>• <strong>Number is fixed</strong> at index creation</li>
                        </ul>
                        <div className="mt-4 bg-zinc-900 rounded-lg p-3 font-mono text-xs text-zinc-100">
                            <div className="text-blue-400"># Fixed at creation time</div>
                            <div>"number_of_shards": 5</div>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-purple-500 bg-purple-50 p-6">
                        <h4 className="font-bold text-purple-800 mb-3">Replica Shard</h4>
                        <ul className="text-sm text-purple-900 space-y-2">
                            <li>• <strong>Copy of primary</strong> shard data</li>
                            <li>• <strong>Provides fault tolerance</strong> (failover)</li>
                            <li>• <strong>Increases read throughput</strong></li>
                            <li>• <strong>Number is adjustable</strong> anytime</li>
                        </ul>
                        <div className="mt-4 bg-zinc-900 rounded-lg p-3 font-mono text-xs text-zinc-100">
                            <div className="text-purple-400"># Can change dynamically</div>
                            <div>"number_of_replicas": 1</div>
                        </div>
                    </div>
                </div>

                <div className="bg-green-100 border-2 border-green-500 p-5 rounded-xl">
                    <h4 className="font-bold text-green-800 mb-2">Replica Benefits</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-green-900">
                        <div>
                            <strong>Fault Tolerance:</strong> If Node A dies, replica on Node B promotes to primary. Zero data loss.
                        </div>
                        <div>
                            <strong>Read Scaling:</strong> Search queries distributed across all copies. 2 replicas = 3x read capacity.
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. How Shards Link to Lucene */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Layers className="w-8 h-8" /> Shards &amp; Lucene Internals
                </h2>
                <p className="text-foreground leading-relaxed">
                    Each shard is not just an abstract partition it's a <strong>complete Lucene index</strong>. This means every shard has:
                </p>

                <div className="bg-zinc-900 rounded-xl p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-zinc-100"><strong>Its own segments</strong> (immutable data files)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-zinc-100"><strong>Its own translog</strong> (write-ahead log)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-zinc-100"><strong>Its own refresh</strong> (1s visibility latency)</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                <span className="text-zinc-100"><strong>Its own merge policy</strong> (background segment merges)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-zinc-100"><strong>Its own term dictionary</strong> (inverted index)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                                <span className="text-zinc-100"><strong>Its own doc values</strong> (columnar storage)</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-zinc-700 text-sm text-zinc-400">
                        This is why shard count affects resource usage each shard carries its own Lucene overhead.
                    </div>
                </div>
            </section>

            {/* Routing */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    Routing: How Documents Find Their Home
                </h2>
                <p className="text-foreground leading-relaxed">
                    If an index is split into 5 pieces, where does document #123 go? The system uses a deterministic formula:
                    <code className="bg-muted px-2 py-0.5 rounded mx-1">shard = hash(routing_key) % number_of_shards</code>.
                    By default, the routing key is the document's <code className="bg-muted px-1 rounded">_id</code>.
                </p>

                {/* 4. Routing Mechanism Details */}
                <div className="bg-zinc-900 rounded-xl p-6">
                    <div className="font-mono text-sm text-zinc-100 mb-4">
                        <span className="text-green-400">shard_number</span> = MurmurHash3(<span className="text-amber-400">routing_key</span>) % <span className="text-blue-400">number_of_shards</span>
                    </div>
                    <div className="bg-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-300">
                        <div className="text-zinc-400">// Example: Document ID "product_abc123"</div>
                        <div>MurmurHash3("product_abc123") = 2847593847</div>
                        <div>2847593847 % 5 = <span className="text-green-400 font-bold">2</span></div>
                        <div className="text-zinc-400 mt-2">→ Document goes to Shard 2</div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-xl border-2 border-green-300 bg-green-50 p-5">
                        <h4 className="font-bold text-green-800 mb-3">Custom Routing Benefits</h4>
                        <div className="bg-zinc-900 rounded-lg p-3 font-mono text-xs text-zinc-100 mb-3">
                            <div className="text-zinc-400">// Route all orders for a user together</div>
                            <div>POST /orders/_doc?<span className="text-amber-400">routing=user_456</span></div>
                            <div className="mt-2 text-green-400">// Query only hits ONE shard!</div>
                            <div>GET /orders/_search?routing=user_456</div>
                        </div>
                        <p className="text-xs text-green-800">Use for: multi-tenant, user data, parent-child</p>
                    </div>

                    <div className="rounded-xl border-2 border-red-300 bg-red-50 p-5">
                        <h4 className="font-bold text-red-800 mb-3">Danger: Hot Spots!</h4>
                        <div className="bg-zinc-900 rounded-lg p-3 font-mono text-xs text-zinc-100 mb-3">
                            <div className="text-zinc-400">// Power user has 10M docs</div>
                            <div>Shard 0: 50 MB</div>
                            <div>Shard 1: 50 MB</div>
                            <div className="text-red-400 font-bold">Shard 2: 5 GB ← CRUSHED</div>
                            <div>Shard 3: 50 MB</div>
                        </div>
                        <p className="text-xs text-red-800">Same routing key = same shard for all docs</p>
                    </div>
                </div>
            </section>

            {/* 5. Shard States & Lifecycle */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Activity className="w-8 h-8" /> Shard States &amp; Lifecycle
                </h2>
                <p className="text-foreground leading-relaxed">
                    Shards go through various states during their lifecycle. Understanding these states helps you diagnose
                    cluster health issues and understand what's happening during rebalancing.
                </p>

                <div className="grid md:grid-cols-4 gap-4">
                    <div className="rounded-xl border-2 border-amber-500 bg-amber-50 p-4 text-center">
                        <div className="text-2xl mb-2">🔄</div>
                        <div className="font-bold text-amber-800">INITIALIZING</div>
                        <div className="text-xs text-amber-700 mt-1">Shard is recovering or being created</div>
                    </div>
                    <div className="rounded-xl border-2 border-green-500 bg-green-50 p-4 text-center">
                        <div className="text-2xl mb-2">✅</div>
                        <div className="font-bold text-green-800">STARTED</div>
                        <div className="text-xs text-green-700 mt-1">Active and serving requests</div>
                    </div>
                    <div className="rounded-xl border-2 border-blue-500 bg-blue-50 p-4 text-center">
                        <div className="text-2xl mb-2">📦</div>
                        <div className="font-bold text-blue-800">RELOCATING</div>
                        <div className="text-xs text-blue-700 mt-1">Moving to another node</div>
                    </div>
                    <div className="rounded-xl border-2 border-red-500 bg-red-50 p-4 text-center">
                        <div className="text-2xl mb-2">❌</div>
                        <div className="font-bold text-red-800">UNASSIGNED</div>
                        <div className="text-xs text-red-700 mt-1">No node available to host it</div>
                    </div>
                </div>

                <div className="bg-zinc-900 rounded-xl p-6">
                    <h4 className="font-bold text-zinc-100 mb-4">Shard Lifecycle Flow</h4>
                    <div className="flex items-center justify-center gap-4 flex-wrap font-mono text-sm">
                        <span className="bg-red-800 px-3 py-1 rounded text-red-100">UNASSIGNED</span>
                        <span className="text-zinc-500">→</span>
                        <span className="bg-amber-800 px-3 py-1 rounded text-amber-100">INITIALIZING</span>
                        <span className="text-zinc-500">→</span>
                        <span className="bg-green-800 px-3 py-1 rounded text-green-100">STARTED</span>
                        <span className="text-zinc-500">→</span>
                        <span className="bg-blue-800 px-3 py-1 rounded text-blue-100">RELOCATING</span>
                        <span className="text-zinc-500">→</span>
                        <span className="bg-green-800 px-3 py-1 rounded text-green-100">STARTED</span>
                    </div>
                </div>
            </section>

            {/* 6. Shard Placement & Node Balancing */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Server className="w-8 h-8" /> Shard Placement &amp; Balancing
                </h2>
                <p className="text-foreground leading-relaxed">
                    Elasticsearch automatically distributes shards across nodes for optimal resource utilization.
                    The key rule: <strong>a primary and its replicas never live on the same node</strong> otherwise a single node failure would lose both copies.
                </p>

                <div className="bg-zinc-900 rounded-xl p-6">
                    <h4 className="font-bold text-zinc-100 mb-4">Shard Distribution Across 3 Nodes</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-blue-900/50 border border-blue-600 rounded-lg p-4">
                            <div className="font-bold text-blue-200 mb-2">Node 1</div>
                            <div className="flex flex-wrap gap-1">
                                <div className="bg-green-700 px-2 py-1 rounded text-xs text-green-100">P0</div>
                                <div className="bg-green-700 px-2 py-1 rounded text-xs text-green-100">P3</div>
                                <div className="bg-purple-700 px-2 py-1 rounded text-xs text-purple-100">R1</div>
                                <div className="bg-purple-700 px-2 py-1 rounded text-xs text-purple-100">R4</div>
                            </div>
                        </div>
                        <div className="bg-green-900/50 border border-green-600 rounded-lg p-4">
                            <div className="font-bold text-green-200 mb-2">Node 2</div>
                            <div className="flex flex-wrap gap-1">
                                <div className="bg-green-700 px-2 py-1 rounded text-xs text-green-100">P1</div>
                                <div className="bg-green-700 px-2 py-1 rounded text-xs text-green-100">P4</div>
                                <div className="bg-purple-700 px-2 py-1 rounded text-xs text-purple-100">R0</div>
                                <div className="bg-purple-700 px-2 py-1 rounded text-xs text-purple-100">R2</div>
                            </div>
                        </div>
                        <div className="bg-purple-900/50 border border-purple-600 rounded-lg p-4">
                            <div className="font-bold text-purple-200 mb-2">Node 3</div>
                            <div className="flex flex-wrap gap-1">
                                <div className="bg-green-700 px-2 py-1 rounded text-xs text-green-100">P2</div>
                                <div className="bg-purple-700 px-2 py-1 rounded text-xs text-purple-100">R3</div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-zinc-400">
                        <span className="bg-green-700 px-2 py-0.5 rounded text-green-100 text-xs mr-2">P</span> Primary
                        <span className="bg-purple-700 px-2 py-0.5 rounded text-purple-100 text-xs ml-4 mr-2">R</span> Replica
                    </div>
                </div>

                <div className="bg-amber-100 border-2 border-amber-500 p-5 rounded-xl">
                    <h4 className="font-bold text-amber-900 mb-2">Allocation Awareness</h4>
                    <p className="text-sm text-amber-800">
                        In production, use <strong>shard allocation awareness</strong> to spread replicas across racks, zones, or datacenters.
                        This ensures a single rack failure doesn't take out both primary and replica.
                    </p>
                </div>
            </section>

            {/* Query Execution: Scatter-Gather */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">Query Execution: Scatter-Gather</h2>
                <p className="text-foreground leading-relaxed">
                    How do you search across 50 shards? You don't directly. You send your query to a <strong>Coordinator Node</strong>, which acts as a project manager.
                    The coordinator broadcasts ("scatters") the query to every shard. Each shard executes the search locally
                    and returns its top results. The coordinator then collects ("gathers") these partial results.
                </p>

                {/* 7. Scatter-Gather Optimization */}
                <div className="bg-zinc-900 rounded-xl p-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-blue-800 border border-blue-500 rounded-lg px-6 py-3 text-blue-100 font-bold">
                            Coordinator Node
                        </div>
                        <div className="text-sm text-zinc-400">Phase 1: Query (Scatter)</div>
                        <div className="grid grid-cols-3 gap-8 w-full max-w-md">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className="w-px h-8 bg-zinc-600"></div>
                                    <div className="bg-zinc-700 rounded-lg p-3 text-xs text-zinc-200 text-center w-full">
                                        <div className="font-bold">Shard {i}</div>
                                        <div className="text-zinc-400 mt-1">Returns: Top 10 IDs</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-px h-8 bg-zinc-600"></div>
                        <div className="bg-amber-800 border border-amber-500 rounded-lg px-6 py-3 text-amber-100 text-sm text-center">
                            <div className="font-bold">Merge Phase</div>
                            <div className="text-amber-300 text-xs mt-1">Sort 30 results → Global Top 10</div>
                        </div>
                        <div className="w-px h-8 bg-zinc-600"></div>
                        <div className="bg-green-800 border border-green-500 rounded-lg px-6 py-3 text-green-100 text-sm text-center">
                            <div className="font-bold">Phase 2: Fetch (Gather)</div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border-2 border-green-500 bg-green-50 p-5">
                    <h4 className="font-bold text-green-800 mb-3">🚀 Optimization: Routing Key Query</h4>
                    <p className="text-sm text-green-900 mb-3">
                        When you query with a routing key, ES skips scattering to all shards it hits only the relevant shard!
                    </p>
                    <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100">
                        <div className="text-green-400">// Without routing: hits ALL 5 shards</div>
                        <div>GET /orders/_search</div>
                        <div className="mt-2 text-amber-400">// With routing: hits ONLY 1 shard</div>
                        <div>GET /orders/_search?routing=user_456</div>
                    </div>
                </div>
            </section>

            {/* Deep Pagination Warning */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">The Deep Pagination Problem</h2>
                <div className="space-y-4">
                    <p className="text-foreground leading-relaxed">
                        The scatter-gather model has a major weakness: random access to deep pages is exponentially expensive.
                        Requesting "Page 1,000" (results 10,000 to 10,010) forces the cluster to sort massive amounts of data in memory.
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                        <h4 className="font-bold text-blue-900 mb-2">The Logical Trap: Why can't we just ask for the 10,000th doc?</h4>
                        <p className="text-sm text-blue-800 mb-2">
                            Imagine searching for "fastest runners". You might ask each shard for its 10,000th fastest person.
                            But what if <strong>Shard A holds all top 10,000 runners</strong> in the world?
                            If Shard A only sends its 10,000th person, and Shard B sends its 1st, the Coordinator sees Shard B's person as the winner—which is wrong.
                        </p>
                        <p className="text-sm text-blue-800 font-bold">
                            To guarantee accuracy, EVERY shard must return its own top 10,010 results, just in case they are the global winners.
                        </p>
                    </div>
                </div>

                <div className="bg-red-100 border-2 border-red-500 p-5 rounded-xl">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-red-900">Page 1000 = Memory Explosion</h4>
                            <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm text-zinc-100 mt-3">
                                <div className="text-zinc-400">// Request: page 1000, 10 results</div>
                                <div>Each shard must return: 10,010 results</div>
                                <div>5 shards × 10,010 = <span className="text-red-400 font-bold">50,050 docs in memory!</span></div>
                                <div className="text-zinc-500 mt-2 text-xs">The Coordinator sorts ALL OF THESE just to pick the final 10.</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border-2 border-green-300 bg-green-50 p-5">
                    <h4 className="font-bold text-green-800 mb-3">The Solution: Cursor-Based Pagination (`search_after`)</h4>
                    <div className="space-y-4">
                        <p className="text-sm text-green-900">
                            Instead of saying "Skip 10,000 records" (which forces the DB to count them), we use a live cursor.
                            We tell the engine: <em>"I don't care about the first 10,000. I just know the last result I saw had a score of 1.5. Give me 10 results <strong>after</strong> 1.5."</em>
                        </p>

                        <div className="bg-white/60 rounded-lg p-4 text-sm text-green-900">
                            <div className="font-bold mb-1">Stateful Efficiency</div>
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>Offset (Bad):</strong> "Go to page 1,000" → Shard must calculate 10,000 items to know where page 1,000 starts.</li>
                                <li><strong>Cursor (Good):</strong> "Start after [Value X]" → Shard jumps directly to Value X in the sorted index and returns just the next 10 items.</li>
                                <li><strong>Result:</strong> Each shard returns 10 docs, not 10,010. Memory usage stays flat/constant regardless of depth.</li>
                            </ul>
                        </div>

                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100">
                            <div className="text-zinc-400">// Client sends the sort values of the LAST result from the previous page</div>
                            <div>{`"search_after": ["2024-01-15T10:30:00", "product_123"],`}</div>
                            <div>{`"sort": [{ "created_at": "desc" }, { "_id": "asc" }]`}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. Shard Sizing & Best Practices */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Shard Sizing Guide</h2>
                <p className="text-foreground leading-relaxed">
                    Target <strong>10-50 GB per shard</strong>. Too small creates overhead; too large slows recovery.
                </p>

                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">Size</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Status</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Why</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                            <tr><td className="px-4 py-2 text-foreground">&lt; 1 GB</td><td className="px-4 py-2 text-red-700 font-bold">Over-sharded</td><td className="px-4 py-2 text-muted-foreground">Too much overhead per shard</td></tr>
                            <tr><td className="px-4 py-2 text-foreground">1-10 GB</td><td className="px-4 py-2 text-amber-700">Acceptable</td><td className="px-4 py-2 text-muted-foreground">OK for small indices</td></tr>
                            <tr className="bg-green-50"><td className="px-4 py-2 text-green-800 font-bold">10-50 GB</td><td className="px-4 py-2 text-green-700 font-bold">Ideal ✓</td><td className="px-4 py-2 text-green-800">Optimal balance</td></tr>
                            <tr><td className="px-4 py-2 text-foreground">50-100 GB</td><td className="px-4 py-2 text-amber-700">Large</td><td className="px-4 py-2 text-muted-foreground">Longer recovery time</td></tr>
                            <tr><td className="px-4 py-2 text-foreground">&gt; 100 GB</td><td className="px-4 py-2 text-red-700 font-bold">Under-sharded</td><td className="px-4 py-2 text-muted-foreground">Very slow operations</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-xl border-2 border-red-500 bg-red-50 p-5">
                        <h4 className="font-bold text-red-800 mb-3">❌ Over-Sharding Problems</h4>
                        <ul className="text-sm text-red-900 space-y-1">
                            <li>• Excessive heap overhead per shard</li>
                            <li>• Too many file descriptors</li>
                            <li>• Cluster state bloat</li>
                            <li>• Master node instability</li>
                        </ul>
                    </div>
                    <div className="rounded-xl border-2 border-red-500 bg-red-50 p-5">
                        <h4 className="font-bold text-red-800 mb-3">❌ Under-Sharding Problems</h4>
                        <ul className="text-sm text-red-900 space-y-1">
                            <li>• Recovery takes hours (100GB+)</li>
                            <li>• Can't spread load across nodes</li>
                            <li>• Reindex required to add shards</li>
                            <li>• Network saturation during moves</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-amber-100 border-2 border-amber-500 p-5 rounded-xl">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-amber-900">⚠️ Shard Count is FIXED After Creation!</h4>
                            <p className="text-sm text-amber-800 mt-2">
                                You CANNOT change the number of shards later. Plan carefully or expect to reindex.
                            </p>
                            <div className="bg-zinc-900 rounded-lg p-3 font-mono text-xs text-zinc-100 mt-3">
                                <div className="text-zinc-400">// Formula for shard count</div>
                                <div>shards = ceil(data_size_gb / 30)</div>
                                <div className="text-green-400 mt-1">// 200 GB → 7 shards</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. Cluster Rebalancing & Recovery */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <RefreshCw className="w-8 h-8" /> Cluster Rebalancing &amp; Recovery
                </h2>
                <p className="text-foreground leading-relaxed">
                    When nodes join or leave the cluster, Elasticsearch automatically rebalances shards. Understanding this process
                    helps you plan maintenance windows and capacity changes.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-xl border-2 border-green-500 bg-green-50 p-5">
                        <h4 className="font-bold text-green-800 mb-3">Node Added</h4>
                        <ul className="text-sm text-green-900 space-y-2">
                            <li>1. New node joins cluster</li>
                            <li>2. Master allocates shards to new node</li>
                            <li>3. Shards copy data from existing nodes</li>
                            <li>4. Once synced, shards become STARTED</li>
                        </ul>
                        <p className="text-xs text-green-700 mt-3">Duration: depends on shard sizes, network speed</p>
                    </div>

                    <div className="rounded-xl border-2 border-red-500 bg-red-50 p-5">
                        <h4 className="font-bold text-red-800 mb-3">Node Removed/Failed</h4>
                        <ul className="text-sm text-red-900 space-y-2">
                            <li>1. Shards on dead node become UNASSIGNED</li>
                            <li>2. Replica promotes to primary (if available)</li>
                            <li>3. New replicas created on remaining nodes</li>
                            <li>4. Rebalancing to spread load evenly</li>
                        </ul>
                        <p className="text-xs text-red-700 mt-3">No data loss if replicas exist on other nodes</p>
                    </div>
                </div>
            </section>

            {/* Capacity Planning Example */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Capacity Planning Example</h2>
                <p className="text-foreground leading-relaxed">
                    Let's work through a real example. How many shards and nodes do you need for 100 million products?
                </p>

                <div className="bg-zinc-900 rounded-xl p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <div className="text-xs font-bold text-zinc-400 uppercase mb-3">Requirements</div>
                            <div className="font-mono text-sm text-zinc-100 space-y-1">
                                <div>100 million products</div>
                                <div>Average doc: 2 KB</div>
                                <div>Traffic: 1,000 queries/sec</div>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-blue-400 uppercase mb-3">Calculations</div>
                            <div className="font-mono text-sm text-zinc-100 space-y-1">
                                <div>100M × 2KB = 200 GB raw</div>
                                <div>With index overhead: <span className="text-amber-400">~300 GB</span></div>
                                <div>300 GB ÷ 30 = <span className="text-green-400 font-bold">10 shards</span></div>
                                <div>+ 1 replica = 20 shard copies</div>
                                <div>20 ÷ 5 per node = <span className="text-green-400 font-bold">4 nodes</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* 10. Practical API Examples */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Code2 className="w-8 h-8" /> Practical API Examples
                </h2>
                <p className="text-foreground leading-relaxed">
                    Essential commands for monitoring and managing shards in production.
                </p>

                <div className="space-y-4">
                    <div className="bg-zinc-900 rounded-xl overflow-hidden">
                        <div className="bg-zinc-800 px-4 py-2 text-xs text-zinc-400 flex items-center justify-between">
                            <span>View Shard Allocation</span>
                            <span className="text-green-400">GET</span>
                        </div>
                        <div className="p-4 font-mono text-sm text-zinc-100 overflow-x-auto">
                            <div className="text-zinc-500"># Detailed shard info</div>
                            <div>GET /_cat/shards?v&amp;h=index,shard,prirep,state,docs,store,node</div>
                            <div className="mt-3 text-zinc-500"># Index-specific</div>
                            <div>GET /_cat/shards/my_index?v</div>
                            <div className="mt-3 text-zinc-500"># Unassigned shards only</div>
                            <div>GET /_cat/shards?v&amp;h=index,shard,prirep,state,unassigned.reason&amp;s=state</div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 rounded-xl overflow-hidden">
                        <div className="bg-zinc-800 px-4 py-2 text-xs text-zinc-400 flex items-center justify-between">
                            <span>Create Index with Shard Settings</span>
                            <span className="text-amber-400">PUT</span>
                        </div>
                        <div className="p-4 font-mono text-sm text-zinc-100 overflow-x-auto">
                            <div>PUT /my_index</div>
                            <div>{'{'}</div>
                            <div className="pl-4">"settings": {'{'}</div>
                            <div className="pl-8"><span className="text-amber-400">"number_of_shards"</span>: <span className="text-blue-400">5</span>,</div>
                            <div className="pl-8"><span className="text-amber-400">"number_of_replicas"</span>: <span className="text-blue-400">1</span></div>
                            <div className="pl-4">{'}'}</div>
                            <div>{'}'}</div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 rounded-xl overflow-hidden">
                        <div className="bg-zinc-800 px-4 py-2 text-xs text-zinc-400 flex items-center justify-between">
                            <span>Update Replica Count (Dynamic)</span>
                            <span className="text-amber-400">PUT</span>
                        </div>
                        <div className="p-4 font-mono text-sm text-zinc-100 overflow-x-auto">
                            <div>PUT /my_index/_settings</div>
                            <div>{'{'}</div>
                            <div className="pl-4"><span className="text-amber-400">"number_of_replicas"</span>: <span className="text-blue-400">2</span></div>
                            <div>{'}'}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 11. Summary TL;DR */}
            <section className="bg-blue-100 border-2 border-blue-500 p-6 rounded-xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-800">
                    <Zap className="w-5 h-5" /> TL;DR Summary
                </h2>
                <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-900">
                    <div>
                        <h4 className="font-bold mb-2">Why Sharding Matters</h4>
                        <ul className="space-y-1">
                            <li>• Enables horizontal scaling beyond single-node limits</li>
                            <li>• Distributes data and query load across nodes</li>
                            <li>• Replicas provide fault tolerance and read scaling</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Core Rules</h4>
                        <ul className="space-y-1">
                            <li>• Target 10-50GB per shard</li>
                            <li>• Shard count is immutable plan ahead</li>
                            <li>• Use routing for multi-tenant optimization</li>
                            <li>• Avoid deep pagination use search_after</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Common Pitfalls</h4>
                        <ul className="space-y-1">
                            <li>• Over-sharding: too many tiny shards = overhead</li>
                            <li>• Under-sharding: huge shards = slow recovery</li>
                            <li>• Hot spots from uneven routing keys</li>
                            <li>• Ignoring replica placement across racks/zones</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Best Practices</h4>
                        <ul className="space-y-1">
                            <li>• Formula: shards = ceil(data_GB / 30)</li>
                            <li>• Always have at least 1 replica</li>
                            <li>• Use allocation awareness for HA</li>
                            <li>• Monitor with _cat/shards regularly</li>
                        </ul>
                    </div>
                </div>
            </section>

            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/indexing/segments" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 3.5 Segments
                </Link>
                <Link href="/search/indexing/paths" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90">
                    Next: Write &amp; Query Path <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
