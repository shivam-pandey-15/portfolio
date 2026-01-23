import { ArrowRight, ArrowDown, ShieldCheck, AlertTriangle, CheckCircle2, Merge, FileStack, Trash2, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Segments() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 3.5: Indexing & Infrastructure</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Segments & Immutability</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    The golden rule of Lucene: <span className="text-primary font-semibold">once written, never modified</span>.
                    This design enables lock-free reads, perfect caching, and crash recovery.
                </p>
            </div>

            <hr className="border-border" />

            {/* Why Immutability */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">Why Immutability?</h2>
                <p className="text-foreground leading-relaxed">
                    Traditional databases modify data in place—overwriting the old value with the new. This seems efficient,
                    but it creates problems: you need locks to prevent readers from seeing half-written data, and a crash
                    during a write can corrupt the entire record. Lucene takes a different approach.
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
                    When you index a document, it doesn't immediately become searchable. Instead, it passes through
                    several stages—from the in-memory buffer to a searchable segment and eventually through background
                    merges. Understanding this lifecycle helps you tune refresh intervals and diagnose latency issues.
                </p>
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
                        <ArrowDown className="w-6 h-6 text-zinc-500" />

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
                        <ArrowDown className="w-6 h-6 text-zinc-500" />

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
                        <ArrowDown className="w-6 h-6 text-zinc-500" />

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

            {/* The Tombstone Tax */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">The Tombstone Tax (Deletes)</h2>
                <p className="text-foreground">
                    Because segments are immutable, deletes just mark documents as "dead" in a <code className="bg-muted px-1 rounded">.liv</code> file.
                    The data remains on disk until merge reclaims it.
                </p>

                <div className="bg-amber-100 border-2 border-amber-500 p-5 rounded-xl">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-amber-900">Deleted Docs Still Consume Resources</h4>
                            <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm text-zinc-100 mt-3 space-y-1">
                                <div className="text-zinc-400">// Storage waste</div>
                                <div>Index: 100GB, 20% deleted → <span className="text-red-400">20GB wasted</span></div>
                                <div className="mt-2 text-zinc-400">// Query overhead</div>
                                <div>0% deleted: 10ms</div>
                                <div>20% deleted: 12ms (+20%)</div>
                                <div>50% deleted: <span className="text-red-400">18ms (+80%)</span></div>
                            </div>
                            <p className="text-sm text-amber-800 mt-3">
                                High delete rates slow queries. Force-merge after bulk deletes to reclaim space.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Segment Explosion */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">The Segment Explosion Problem</h2>
                <p className="text-foreground leading-relaxed">
                    With the default 1-second refresh interval, you create 86,400 segments per day. If merges can't
                    keep up with this rate, you end up with thousands of tiny segments that each query must check.
                    This is called "segment explosion" and it can bring your cluster to its knees.
                </p>

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

            {/* Write Amplification */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Write Amplification: The Hidden Cost</h2>
                <p className="text-foreground leading-relaxed">
                    Immutability has a hidden cost: write amplification. Because segments are never modified in place,
                    the same data gets rewritten multiple times as it moves through the system—first to the translog,
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

            {/* Key Takeaways */}
            <section className="bg-green-100 border-2 border-green-500 p-6 rounded-xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-800">
                    <CheckCircle2 className="w-5 h-5" /> Key Takeaways
                </h2>
                <ul className="space-y-2 text-sm text-green-900">
                    <li className="flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Segments are immutable</strong> — lock-free reads, perfect caching, crash recovery.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <RefreshCw className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Refresh creates segments</strong> — data searchable within ~1s. Tune for your workload.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Merge className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Merge reclaims space</strong> — force-merge only for read-only indices.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Write amplification is 5-7x</strong> — plan disk capacity accordingly.</span>
                    </li>
                </ul>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/indexing/vectors" className="text-sm font-medium text-muted-foreground hover:text-primary">
                    ← 3.4 Vector Indices
                </Link>
                <Link href="/search/indexing/sharding" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Next: Sharding & Scale <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
