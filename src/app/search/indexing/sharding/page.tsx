import { ArrowRight, Server, Network, CheckCircle2, AlertTriangle, Database, Hash } from "lucide-react";
import Link from "next/link";

export default function Sharding() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 3.6: Indexing & Infrastructure</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Sharding & Scale</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    When one server isn't enough. Sharding splits an index across multiple machines
                    for horizontal scale and fault tolerance.
                </p>
            </div>

            <hr className="border-border" />

            {/* Why Shard */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">Why Shard?</h2>
                <p className="text-foreground leading-relaxed">
                    A single machine has hard physical limits: RAM is finite, CPU cores are limited, and disks fill up.
                    When your data exceeds these limits (e.g., 5TB index on a 1TB machine) or your query volume is too high for one CPU to handle,
                    you must scale horizontally. Sharding breaks your single index into smaller, manageable chunks called **shards**,
                    which can be distributed across multiple servers. This allows you to grow indefinitely by simply adding more nodes.
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

            {/* Routing */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Hash className="w-8 h-8" />
                    Routing: How Documents Find Their Home
                </h2>
                <p className="text-foreground leading-relaxed">
                    If an index is split into 5 pieces, where does document #123 go? The system uses a deterministic formula called **Consistent Hashing**:
                    `shard = hash(id) % number_of_shards`. This ensures a uniform distribution of documents across all shards without needing a central lookup table.
                    However, this simple math explains why **you cannot change the number of shards** after creating an index—doing so would change the modulo result,
                    making existing documents unfindable.
                </p>

                <div className="bg-zinc-900 rounded-xl p-6">
                    <div className="font-mono text-sm text-zinc-100 mb-4">
                        <span className="text-green-400">shard_number</span> = hash(<span className="text-amber-400">routing_key</span>) % <span className="text-blue-400">number_of_shards</span>
                    </div>
                    <div className="bg-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-300">
                        <div className="text-zinc-400">// Example: Document ID "product_abc123"</div>
                        <div>hash("product_abc123") = 2847593847</div>
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

            {/* Query Execution: Scatter-Gather */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">Query Execution: Scatter-Gather</h2>
                <p className="text-foreground leading-relaxed">
                    How do you search across 50 shards? You don't. You send your query to a **Coordinator Node**, which acts as a project manager.
                    The coordinator broadcasts ("scatters") the query to every shard. Each shard executes the search locally on its slice of data
                    and returns its top results. The coordinator then collects ("gathers") these partial results, merges them into a global top-list,
                    and returns the final answer. This parallelism makes sharded search incredibly fast, but network overhead increases with shard count.
                </p>

                <div className="bg-zinc-900 rounded-xl p-8">
                    <div className="flex flex-col items-center gap-4">
                        {/* Phase 1: Query */}
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
                                        <div className="text-zinc-400 mt-1">Returns: Top 10 IDs + scores</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-px h-8 bg-zinc-600"></div>

                        {/* Merge */}
                        <div className="bg-amber-800 border border-amber-500 rounded-lg px-6 py-3 text-amber-100 text-sm text-center">
                            <div className="font-bold">Merge Phase</div>
                            <div className="text-amber-300 text-xs mt-1">Sort 30 results → Global Top 10</div>
                        </div>
                        <div className="w-px h-8 bg-zinc-600"></div>

                        {/* Phase 2: Fetch */}
                        <div className="text-sm text-zinc-400">Phase 2: Fetch (Gather)</div>
                        <div className="bg-green-800 border border-green-500 rounded-lg px-6 py-3 text-green-100 text-sm text-center">
                            <div className="font-bold">Fetch full _source</div>
                            <div className="text-green-300 text-xs mt-1">Only from shards with winning docs</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Deep Pagination Warning */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">The Deep Pagination Problem</h2>
                <p className="text-foreground leading-relaxed">
                    The scatter-gather model has a major weakness: requesting "page 1,000" is expensive.
                    To return results 10,000 to 10,010, **every single shard** must return its own top 10,010 results to the coordinator.
                    If you have 10 shards, the coordinator must sort 100,100 documents in memory just to return 10.
                    This exponential cost is why most search engines limit `max_result_window` to 10,000. For deep pagination, use `search_after` instead.
                </p>

                <div className="bg-red-100 border-2 border-red-500 p-5 rounded-xl">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-red-900">Page 1000 = Memory Explosion</h4>
                            <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm text-zinc-100 mt-3">
                                <div className="text-zinc-400">// Request: page 1000, 10 results</div>
                                <div>Each shard must return: 10,010 results</div>
                                <div>5 shards × 10,010 = <span className="text-red-400 font-bold">50,050 in memory!</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border-2 border-green-300 bg-green-50 p-5">
                    <h4 className="font-bold text-green-800 mb-3">Solution: Use search_after</h4>
                    <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100">
                        <div className="text-green-400">// Each page uses last result's sort values</div>
                        <div>{`"search_after": ["2024-01-15T10:30:00", "product_123"],`}</div>
                        <div>{`"sort": [{ "created_at": "desc" }, { "_id": "asc" }]`}</div>
                        <div className="text-zinc-400 mt-2">// Each shard only returns 10 results - no explosion!</div>
                    </div>
                </div>
            </section>

            {/* Shard Sizing */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Shard Sizing Guide</h2>
                <p className="text-foreground leading-relaxed">
                    Shard size is the Goldilocks problem of search scaling.
                    **Too small (&lt;10GB)**: You waste heap memory on overhead. A cluster with thousands of tiny shards becomes unstable.
                    **Too large (&gt;50GB)**: Recovery takes hours. Moving a 100GB shard across the network saturates bandwidth.
                    **Just right (20-50GB)**: The industry standard sweet spot. It balances cluster stability with recovery speed.
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
                            <tr><td className="px-4 py-2 text-foreground">1-20 GB</td><td className="px-4 py-2 text-amber-700">Acceptable</td><td className="px-4 py-2 text-muted-foreground">OK for small indices</td></tr>
                            <tr className="bg-green-50"><td className="px-4 py-2 text-green-800 font-bold">20-50 GB</td><td className="px-4 py-2 text-green-700 font-bold">Ideal ✓</td><td className="px-4 py-2 text-green-800">Optimal balance</td></tr>
                            <tr><td className="px-4 py-2 text-foreground">50-100 GB</td><td className="px-4 py-2 text-amber-700">Large</td><td className="px-4 py-2 text-muted-foreground">Longer recovery time</td></tr>
                            <tr><td className="px-4 py-2 text-foreground">&gt; 100 GB</td><td className="px-4 py-2 text-red-700 font-bold">Under-sharded</td><td className="px-4 py-2 text-muted-foreground">Very slow operations</td></tr>
                        </tbody>
                    </table>
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

            {/* Capacity Planning Example */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Capacity Planning Example</h2>
                <p className="text-foreground leading-relaxed">
                    Let's work through a real example. How many shards and nodes do you need for 100 million products?
                    The key is to estimate your total index size and divide by the target shard size.
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
            <section className="bg-green-100 border-2 border-green-500 p-6 rounded-xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-800">
                    <CheckCircle2 className="w-5 h-5" /> Key Takeaways
                </h2>
                <ul className="space-y-2 text-sm text-green-900">
                    <li className="flex items-start gap-2">
                        <Database className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Sharding splits data</strong> across nodes for horizontal scaling.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Hash className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>hash(id) % shards</strong>  deterministic routing. Custom routing for multi-tenant.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Network className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Replicas provide</strong> fault tolerance AND read throughput.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Server className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Target 20-50 GB per shard</strong>. Shard count is fixedplan carefully!</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Deep pagination is dangerous</strong>  use search_after instead.</span>
                    </li>
                </ul>
            </section>

            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/indexing/segments" className="text-sm font-medium text-muted-foreground hover:text-primary">← 3.5 Segments</Link>
                <Link href="/search/indexing/paths" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90">
                    Next: Write & Query Path <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
