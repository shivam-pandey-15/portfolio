"use client";

import { Trash2, RefreshCcw, AlertTriangle, Layers, Ghost, ArrowRight, ArrowLeft, Database, HardDrive, Shuffle, Cpu, Settings, Scale, Timer, Activity } from "lucide-react";
import Link from "next/link";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Deletes are Forever (Almost)", description: "Deleted docs persist as 'tombstones' until a Segment Merge event. They consume heap (bitsets) and slow down search." },
    { title: "Partial Updates = Full Rewrites", description: "Updating 1 byte requires retrieving the full JSON, parsing it, modifying it, and indexing a whole new document." },
    { title: "The _source tax", description: "You cannot do partial updates if you disable the `_source` field to save disk. You must have the original JSON." },
    { title: "Reindex with Care", description: "Use `slices` for parallel speed, but throttle `requests_per_second` to avoid taking down your primary cluster." }
];

export default function DeletesPage() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 4.7: Data Foundation</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Deletes, Partial Updates & Reindexing</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    In Search, "Mutability" is a leaky abstraction.
                    Why deleting data might actually increase your disk usage, and why updates burn CPU.
                </p>
            </div>

            <hr className="border-border" />

            {/* 1. The Delete Lie */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Trash2 className="w-8 h-8 text-rose-500" /> The Lie: "Delete"
                </h2>

                {/* Full Width Text per user feedback */}
                <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
                    <p>
                        When you send a DELETE request, the search engine lies to you. It says "200 OK", but nothing was removed.
                        Because search segments are highly compressed and optimized for read speed, they are <strong>Immutable</strong> (Write-Once). Modifying a file on disk to remove data is impossible without corrupting the index.
                    </p>
                    <p>
                        Instead, Lucene maintains a parallel file called the <strong>Bitset (Live Docs)</strong>.
                        A delete is simply flipping a bit from 1 to 0. The document is still on disk, still in memory, and still being processed by your search queries it is merely "tombstoned" and filtered out at the very last step.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Visualizing Tombstones */}
                    <div className="bg-zinc-950 rounded-xl p-8 border border-zinc-800 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Ghost className="w-32 h-32 text-rose-500" />
                        </div>
                        <h3 className="font-bold text-zinc-100 mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-rose-500" /> Lifecycle of a Deleted Doc
                        </h3>

                        <div className="space-y-4 font-mono text-sm relative z-10">
                            {/* Step 1 */}
                            <div className="flex items-center gap-4">
                                <div className="text-zinc-500 w-16 text-right">T+0s</div>
                                <div className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-zinc-300 w-full flex justify-between">
                                    <span>Doc 123 (Active)</span>
                                    <span className="text-emerald-500">Alive</span>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex items-center gap-4">
                                <div className="text-zinc-500 w-16 text-right">T+1s</div>
                                <div className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-zinc-300 w-full flex justify-between group">
                                    <span className="group-hover:line-through decoration-rose-500">Doc 123 (Deleted)</span>
                                    <span className="text-rose-500 font-bold">Tombstone ⚰️</span>
                                </div>
                            </div>

                            <div className="pl-20 text-xs text-rose-400">
                                ⚠️ Still searchable! Still taking disk space!
                            </div>

                            {/* Step 3 */}
                            <div className="flex items-center gap-4">
                                <div className="text-zinc-500 w-16 text-right">T+4h</div>
                                {/* Removed opacity-50 and dashed border for better visibility */}
                                <div className="bg-zinc-800 border border-zinc-600 px-3 py-2 rounded text-zinc-400 w-full flex justify-between">
                                    <span>Segment Merge</span>
                                    <span>Physically Removed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The Cost */}
                    <div className="space-y-6">
                        <div className="bg-rose-50 border border-rose-100 rounded-xl p-6">
                            <h4 className="font-bold text-rose-900 flex items-center gap-2 text-lg mb-3">
                                <AlertTriangle className="w-5 h-5" /> The Performance Tax
                            </h4>
                            <ul className="space-y-3 text-sm text-rose-800">
                                <li className="flex gap-2">
                                    <span className="font-bold min-w-[80px]">Latency:</span>
                                    <span>
                                        Your query matches 1,000,000 documents. The engine calculates scores for ALL of them.
                                        Only at the very end does it check the Bitset to hide the 500,000 deleted ones.
                                        <strong>You pay CPU for ghosts.</strong>
                                    </span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold min-w-[80px]">Heap:</span>
                                    <span>The Bitset must be loaded into JVM Heap for fast access. Heavy deletes = Heavy Heap pressure.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-zinc-100 border border-zinc-200 rounded-xl p-6">
                            <h4 className="font-bold text-zinc-900 flex items-center gap-2 text-sm mb-2">
                                <Settings className="w-4 h-4" /> The Solution: Force Merge?
                            </h4>
                            <p className="text-sm text-zinc-600 mb-3">
                                You can manually trigger `_forcemerge` to clean up, but be careful.
                                It works like a "Garbage Collection" for disk extremely I/O intensive.
                            </p>
                            <div className="bg-zinc-200 px-2 py-1 rounded text-xs font-mono inline-block">
                                POST /index/_forcemerge?max_num_segments=1
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Partial Updates */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <RefreshCcw className="w-8 h-8 text-amber-500" /> Partial Updates
                </h2>
                <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-8">
                    <div className="flex flex-col gap-6">
                        <p className="text-lg text-amber-950 max-w-2xl font-medium">
                            "I just want to update the view count. Why is my CPU hitting 100%?"
                        </p>
                        <p className="text-amber-800">
                            Because specific fields cannot be modified in place. Lucene stores documents in <strong>Compressed Blocks</strong> (LZ4/Deflate).
                            You cannot just "seek and overwrite" a few bytes. To change even a single counter, the engine must decompress the whole block, reconstruct the JSON, apply the change, and re-index the result as a new document.
                            This turns a tiny update into a heavy <strong>Read-Modify-Write</strong> cycle.
                        </p>

                        <div className="bg-white rounded-xl border border-amber-200 p-6 shadow-sm">
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">
                                The "Update" Pipeline
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Step 1 */}
                                <div className="space-y-2 relative">
                                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg text-center h-24 flex flex-col items-center justify-center">
                                        <Database className="w-6 h-6 text-blue-500 mb-2" />
                                        <span className="font-bold text-zinc-700 text-sm">1. GET</span>
                                    </div>
                                    <p className="text-xs text-center text-zinc-500">Retrieve `_source` JSON from disk</p>
                                    <ArrowRight className="absolute -right-6 top-10 text-zinc-300 hidden md:block" />
                                </div>

                                {/* Step 2 */}
                                <div className="space-y-2 relative">
                                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg text-center h-24 flex flex-col items-center justify-center">
                                        <Cpu className="w-6 h-6 text-amber-500 mb-2" />
                                        <span className="font-bold text-zinc-700 text-sm">2. MERGE</span>
                                    </div>
                                    <p className="text-xs text-center text-zinc-500">Parse JSON + Apply Diff in Memory</p>
                                    <ArrowRight className="absolute -right-6 top-10 text-zinc-300 hidden md:block" />
                                </div>

                                {/* Step 3 */}
                                <div className="space-y-2 relative">
                                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg text-center h-24 flex flex-col items-center justify-center">
                                        <Trash2 className="w-6 h-6 text-rose-500 mb-2" />
                                        <span className="font-bold text-zinc-700 text-sm">3. DELETE</span>
                                    </div>
                                    <p className="text-xs text-center text-zinc-500">Soft-delete old doc ID</p>
                                    <ArrowRight className="absolute -right-6 top-10 text-zinc-300 hidden md:block" />
                                </div>

                                {/* Step 4 */}
                                <div className="space-y-2">
                                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg text-center h-24 flex flex-col items-center justify-center">
                                        <HardDrive className="w-6 h-6 text-emerald-500 mb-2" />
                                        <span className="font-bold text-zinc-700 text-sm">4. INDEX</span>
                                    </div>
                                    <p className="text-xs text-center text-zinc-500">Write NEW doc to buffer</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start bg-amber-100 p-4 rounded-lg border border-amber-200 text-sm text-amber-900">
                            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-700" />
                            <div>
                                <strong>Constraint:</strong> If you disabled <code className="bg-white/50 px-1 rounded">_source</code> to save disk space,
                                you <strong>CANNOT</strong> use the Update API. You must provide the full document from your application side every time.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Reindexing Strategies */}
            <section className="space-y-8">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Shuffle className="w-8 h-8 text-blue-500" /> Reindexing at Scale
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                        Changing a data type (e.g., `string` &rarr; `date`) requires a full reindex because the Inverted Index is built once.
                        You cannot "ALTER TABLE" on an inverted index. You must rebuild it from scratch.
                        You have two choices: The way that causes downtime, or the way that doesn't.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* The Rookie Way */}
                    <div className="bg-zinc-50 dark:bg-zinc-900 border-2 border-red-500/20 rounded-xl overflow-hidden flex flex-col">
                        <div className="bg-red-500/10 p-4 border-b border-red-500/20 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <span className="font-bold text-red-500 uppercase tracking-wide text-sm">The Rookie Way (In-Place)</span>
                        </div>
                        <div className="p-6 flex-1 space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                    <span className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs">1</span>
                                    Delete Index
                                </div>
                                <div className="bg-black/80 text-red-400 font-mono text-xs p-3 rounded">
                                    DELETE /products
                                </div>
                                <p className="text-xs text-red-600 dark:text-red-400 font-bold">
                                    🚨 DOWNTIME STARTS (Search returns 404)
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                    <span className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs">2</span>
                                    Create New Index
                                </div>
                                <div className="bg-black/80 text-green-400 font-mono text-xs p-3 rounded">
                                    PUT /products &#123; "mappings": ... &#125;
                                </div>
                                <p className="text-xs text-zinc-500">
                                    Index exists but is empty.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                    <span className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs">3</span>
                                    Push Data
                                </div>
                                <div className="relative h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-blue-500 animate-pulse"></div>
                                </div>
                                <p className="text-xs text-zinc-500">
                                    Script running for 4 hours... users see 0 results.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* The Pro Way */}
                    <div className="bg-zinc-50 dark:bg-zinc-900 border-2 border-emerald-500/20 rounded-xl overflow-hidden flex flex-col">
                        <div className="bg-emerald-500/10 p-4 border-b border-emerald-500/20 flex items-center gap-2">
                            <Shuffle className="w-5 h-5 text-emerald-500" />
                            <span className="font-bold text-emerald-500 uppercase tracking-wide text-sm">The Pro Way (Aliasing)</span>
                        </div>
                        <div className="p-6 flex-1 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs font-mono">
                                    <div className="bg-zinc-200 dark:bg-zinc-800 px-3 py-1 rounded text-zinc-600 dark:text-zinc-300">Alias: products</div>
                                    <ArrowRight className="w-4 h-4 text-zinc-400" />
                                    <div className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">products_v1</div>
                                </div>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                                    ✅ Live traffic matches v1 (Old Data)
                                </p>
                            </div>

                            <div className="border-t border-dashed border-zinc-200 dark:border-zinc-800 my-4"></div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                    <span className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs">1</span>
                                    Background Build
                                </div>
                                <div className="flex items-center justify-between text-xs font-mono opacity-50">
                                    <span className="text-zinc-500">Reindexing...</span>
                                    <ArrowRight className="w-4 h-4 text-zinc-400" />
                                    <div className="bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">products_v2</div>
                                </div>
                                <p className="text-xs text-zinc-500">
                                    Zero impact on users.
                                </p>
                            </div>

                            <div className="space-y-2 pt-2">
                                <div className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                    <span className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs">2</span>
                                    Atomic Switch
                                </div>
                                <div className="bg-black/90 p-3 rounded font-mono text-[10px] text-zinc-300">
                                    POST /_aliases
                                    <span className="text-zinc-500 block">// Remove v1, Add v2 instanly</span>
                                </div>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                                    ✅ Users instantly see new data. No 404s.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Tuning */}
                <div className="bg-zinc-900 text-zinc-100 rounded-xl p-8 border border-zinc-800 mt-8">
                    <h3 className="font-bold text-lg text-blue-400 mb-6 flex items-center gap-2">
                        <Settings className="w-5 h-5" /> Production Tuning Guide
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 font-mono text-sm text-zinc-300">
                                <Timer className="w-4 h-4 text-zinc-500" />
                                wait_for_completion=false
                            </div>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                                Never hold a connection open for long jobs. Fire asynchronously and poll the Task API (`GET /_tasks/task_id`) to check progress.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 font-mono text-sm text-zinc-300">
                                <ColumnsIcon className="w-4 h-4 text-zinc-500" />
                                slices=auto
                            </div>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                                Parallelizes the reindex by splitting the work into sub-slices (usually equal to shard count). speeds up large jobs significantly.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 font-mono text-sm text-zinc-300">
                                <Scale className="w-4 h-4 text-zinc-500" />
                                requests_per_second=500
                            </div>
                            <p className="text-xs text-yellow-500/80 leading-relaxed font-medium">
                                Essential. Throttles the write rate to ensure the reindex job doesn't consume all I/O and CPU, starving live search traffic.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. The Hidden Dangers */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8 text-orange-500" /> The Hidden Trap: Nested Objects
                </h2>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-8">
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <Layers className="w-6 h-6 text-orange-600 mt-1 shrink-0" />
                            <div className="space-y-2">
                                <h3 className="font-bold text-orange-900 text-lg">Why "Nested" is mostly a trap</h3>
                                <p className="text-orange-800 leading-relaxed">
                                    Developers love `type: nested` because it preserves object relationships (e.g. `comments.author` linked to `comments.text`).
                                    But Lucene doesn't actually support "nested" objects. It pulls a sleight of hand.
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 my-6">
                            <div className="bg-white p-6 rounded-lg border border-orange-100 shadow-sm">
                                <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Logical View (What you see)</div>
                                <pre className="text-xs font-mono text-zinc-600 bg-zinc-50 p-4 rounded border border-zinc-100">
                                    {`{
  "id": 1,
  "title": "Blog Post",
  "comments": [
    { "user": "Alice", "text": "Nice!" },
    { "user": "Bob",   "text": "Cool!" }
  ]
}`}
                                </pre>
                            </div>

                            <div className="bg-white p-6 rounded-lg border border-orange-100 shadow-sm">
                                <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Physical View (On Disk)</div>
                                <div className="space-y-2 font-mono text-xs">
                                    <div className="bg-zinc-100 p-2 rounded text-zinc-400 border border-zinc-200">Doc 1: &#123; user: Alice, text: Nice, _root: 3 &#125;</div>
                                    <div className="bg-zinc-100 p-2 rounded text-zinc-400 border border-zinc-200">Doc 2: &#123; user: Bob,   text: Cool, _root: 3 &#125;</div>
                                    <div className="bg-emerald-50 p-2 rounded text-emerald-700 border border-emerald-200 font-bold">Doc 3: &#123; id: 1, title: Blog Post &#125;</div>
                                </div>
                                <p className="text-[10px] text-orange-600 mt-2 font-medium">
                                    * Hidden "Shadow Documents" created for every single list item.
                                </p>
                            </div>
                        </div>

                        <div className="bg-orange-100/50 p-4 rounded-lg border border-orange-200">
                            <h4 className="font-bold text-orange-900 text-sm mb-2">The Amplification Factor</h4>
                            <p className="text-orange-800 text-sm">
                                To update <strong>1 comment</strong> in a post with <strong>50,000 comments</strong>:
                                <br />
                                <span className="font-mono text-xs block mt-2 bg-white/50 p-2 rounded">
                                    Cost = Reindex Parent + Reindex ALL 50,000 Children
                                </span>
                            </p>
                            <p className="mt-3 text-sm font-bold text-orange-800">
                                Result: Massive CPU burn and eventual cluster instability.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/data/freshness" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Freshness & Updates
                </Link>
                <Link href="/search/retrieval" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Next: Chapter 5 - Retrieval <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}

function ColumnsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <line x1="9" x2="9" y1="3" y2="21" />
            <line x1="15" x2="15" y1="3" y2="21" />
        </svg>
    )
}
