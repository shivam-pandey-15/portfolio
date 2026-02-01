import { Binary, Database, Cpu, Zap, Merge, ArrowRight, MousePointerClick, Box, Search, Layers, GitMerge } from "lucide-react";
import Link from "next/link";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "The Foundation", description: "Boolean retrieval matches sets. It defines the 'Candidate Set' for stage 2. It is binary: a doc is either in or out." },
    { title: "FST > Hash Map", description: "We use Finite State Transducers (FSTs) for the dictionary because they support prefixes (run*) and compress 100x better than Hash Maps." },
    { title: "Compression is Speed", description: "We don't compress to save disk; we compress to save RAM bandwidth. SIMD-BP128 decodes 5 billion integers/sec." },
    { title: "Roaring Bitmaps", description: "The modern standard for filters. Hybridizes arrays (sparse) and bitsets (dense) for blistering fast set operations." },
    { title: "Phrase Cost", description: "Positional queries are often an order of magnitude slower, depending on term frequency, phrase length, and survivor set size." },
    { title: "Block-Oriented Execution", description: "Modern retrieval skips blocks before it ever looks at integers." },
    { title: "Memory Bandwidth Is the Bottleneck", description: "Almost every optimization in retrieval exists to move fewer bytes, not to save CPU." }
];

export default function BooleanRetrieval() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 5.2: Retrieval Architecture</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Boolean Retrieval & The Inverted Index</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Boolean retrieval is the physical machinery that turns a query into sets of document IDs. It is a system built from set theory, compression, cache behavior, and SIMD not from ranking or scoring.
                    <br /><br />
                    This chapter describes the data structures and CPU-level techniques that make large-scale set retrieval fast.
                </p>
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-emerald-900 text-sm">
                    If you wanted to find every book containing the word "Love", you wouldn't read every book.
                    You would use the index at the back. We are building that index but for billions of pages, and making it work in milliseconds.
                </div>
            </div>

            <hr className="border-border" />

            {/* 1. Anatomy of an Index */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">The Anatomy of an Inverted Index</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <p className="text-foreground leading-relaxed">
                            A search index turns the world upside down. Instead of <code>Doc -&gt; Terms</code>, we store <code>Term -&gt; Docs</code>.
                            Physically, this is split into two distinct data structures on disk.
                        </p>
                        <div className="space-y-6 mt-6">
                            <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                                <h3 className="font-bold flex items-center gap-2 mb-2">
                                    <Binary className="w-4 h-4 text-blue-600" />
                                    1. The Term Dictionary (FST)
                                </h3>
                                <p className="text-sm text-zinc-600 mb-2">
                                    Maps "term" &rarr; "file pointer".
                                    <br />
                                    <span className="text-xs text-zinc-500 bg-zinc-100 px-1 rounded border">Like T9 Text / Auto-complete</span>
                                    <br />
                                    <strong>Why not a Hash Map?</strong> Hash maps are fast (<code>O(1)</code>) but memory hungry and don't support prefixes.
                                    We use a <strong>Finite State Transducer (FST)</strong>. It compresses shared prefixes (e.g., "run", "runner", "running") into a graph, often fitting the entire vocabulary in RAM.
                                </p>
                            </div>
                            <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                                <h3 className="font-bold flex items-center gap-2 mb-2">
                                    <Database className="w-4 h-4 text-purple-600" />
                                    2. The Postings List
                                </h3>
                                <p className="text-sm text-zinc-600 mb-2">
                                    A sorted list of Document IDs that contain the term.
                                    <br />
                                    Constraint: <strong>Must be sorted.</strong> Solving complex queries depends on this sort order (like merging two sorted arrays).
                                </p>
                                <div className="mt-3 pt-3 border-t border-zinc-200 text-xs text-zinc-500">
                                    <strong>Logically:</strong> <code>[docID, freq, positions, payload]</code>
                                    <br />
                                    <strong>Physically:</strong> The hot path touches docID always, freq sometimes, positions almost never. This separation is critical for memory locality.
                                </div>
                            </div>
                            <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                                <h3 className="font-bold flex items-center gap-2 mb-2">
                                    <Box className="w-4 h-4 text-amber-600" />
                                    3. Block Index / Skip Data
                                </h3>
                                <p className="text-sm text-zinc-600 mb-2">
                                    Large postings lists are not flat arrays. They are split into fixed-size blocks (e.g., 128 docIDs).
                                    <br />
                                    Each block stores: <code>maxDocID</code>, compressed payload, and skip offsets.
                                    <br />
                                    <strong>Why?</strong> This enables block-level skipping, galloping, and avoiding decompression of blocks that cannot intersect. Modern retrieval is block-oriented, not integer-oriented.
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Visualizer Placeholder */}
                    <div className="bg-zinc-900 rounded-xl p-6 text-zinc-300 font-mono text-sm border border-zinc-800">
                        <div className="text-zinc-500 mb-4">// Physical Layout on Disk</div>

                        <div className="mb-6">
                            <div className="text-blue-400 font-bold mb-1">Term Dictionary (FST)</div>
                            <div className="pl-4 border-l-2 border-blue-900 space-y-1">
                                <div>"apple"  &rarr; <span className="text-yellow-500">0x00A1</span></div>
                                <div>"apply"  &rarr; <span className="text-yellow-500">0x00B4</span></div>
                                <div>"apricot"&rarr; <span className="text-yellow-500">0x00C8</span></div>
                            </div>
                        </div>

                        <div>
                            <div className="text-purple-400 font-bold mb-1">Postings File (.doc)</div>
                            <div className="pl-4 border-l-2 border-purple-900 space-y-4">
                                <div>
                                    <span className="text-yellow-500">0x00A1</span>: <span className="text-green-400">[1, 4, 10, 250...]</span>
                                </div>
                                <div>
                                    <span className="text-yellow-500">0x00B4</span>: <span className="text-green-400">[2, 4, 8, 9...]</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Compression */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">Compression: The Speed Factor</h2>
                <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl">
                    <div className="flex items-start gap-4">
                        <Zap className="w-6 h-6 text-blue-600 mt-1" />
                        <div>
                            <h3 className="text-lg font-bold text-blue-900">Why Compress? It's not for Disk Space.</h3>
                            <p className="text-blue-800 leading-relaxed mt-1">
                                We compress integers primarily to save <strong>Memory Bandwidth</strong>.
                                A CPU can process data faster than RAM can deliver it. If we can squeeze 4 integers into the space of 1, the CPU stays fed.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-50 border-l-4 border-blue-500 p-4 rounded italic text-zinc-600 text-sm">
                    "Compression is the art of fitting more data into the CPU's mouth at once."
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">1. Delta Encoding (The Gap)</h3>
                        <p className="text-foreground text-sm mb-4">
                            Instead of storing huge integers <code>[100, 101, 105]</code>, we store the differences.
                            Smaller numbers require fewer bits.
                        </p>
                        <div className="bg-zinc-100 p-4 rounded font-mono text-sm">
                            <div className="mb-2 text-xs text-zinc-500 italic">"Don't write the full address, just say 'Next door'."</div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-zinc-400">Raw:</span>
                                <span className="bg-white px-2 py-0.5 rounded border">15,000</span>
                                <ArrowRight className="w-4 h-4 text-zinc-400" />
                                <span className="bg-white px-2 py-0.5 rounded border">15,001</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-zinc-600 font-bold">Delta:</span>
                                <span className="bg-white px-2 py-0.5 rounded border">15,000</span>
                                <ArrowRight className="w-4 h-4 text-zinc-600" />
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200">+1</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">2. SIMD-BP128 (Bit Packing)</h3>
                        <p className="text-foreground text-sm mb-4">
                            We pack blocks of 128 integers into the exact number of bits needed (e.g., 5 bits each).
                            Then we use <strong>SIMD (AVX2 / AVX-512)</strong> instructions to decode an entire block in a few cycles.
                            <br /><br />
                            The real win is fewer bytes loaded from memory, fewer cache lines touched, and sequential access patterns.
                            The CPU is rarely the bottleneck. <strong>Memory bandwidth is.</strong>
                        </p>
                        <div className="bg-purple-50 p-3 rounded border border-purple-100 text-purple-900 text-xs mb-4">
                            Imagine a waiter carrying 8 plates at once (SIMD) vs. running back to the kitchen for every single plate (Scalar).
                        </div>
                        <div className="p-4 bg-zinc-900 text-zinc-300 rounded text-xs font-mono">
                            <div>// Simd-BitPacking conceptual speed</div>
                            <div className="mt-2 text-green-400">Decoding Speed: ~5 Billion ints/sec</div>
                            <div className="text-zinc-500">vs VByte: ~0.5 Billion ints/sec</div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-4">Block-Level Skipping</h3>
                    <p className="text-foreground text-sm leading-relaxed">
                        Intersection does not start by decoding integers. For each block:
                    </p>
                    <ul className="list-disc pl-5 text-sm text-zinc-700 space-y-2 mt-2">
                        <li>Compare <code>block.maxDocID</code> with the other list's current docID.</li>
                        <li>If the block cannot intersect &rarr; <strong>skip the entire block</strong>.</li>
                        <li>Only decompress blocks that might produce matches.</li>
                    </ul>
                    <p className="text-foreground text-sm mt-4">
                        This reduces decompression work, branches, and cache pollution. This is what allows postings lists to scale to billions of documents.
                    </p>
                </div>
            </section>

            {/* 3. Intersection Algorithms */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">Intersection: The "Zipper"</h2>
                <div className="space-y-4">
                    <p className="text-foreground leading-relaxed">
                        When you search <code>blue AND sky</code>, the engine performs Set Intersection.
                        Because the lists are sorted, we can do this in linear time <code>O(N+M)</code> using the "Zipper" (Merge Join) algorithm.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-zinc-900 p-6 rounded-xl text-sm font-mono text-zinc-300 overflow-x-auto">
                        <div className="text-zinc-500 mb-2">// The "Sort-vs-Sort" Algorithm</div>
                        <div className="space-y-1">
                            <div><span className="text-purple-400">while</span> (p1 &lt; len1 && p2 &lt; len2) {"{"}</div>
                            <div className="pl-4">
                                <span className="text-purple-400">if</span> (list1[p1] == list2[p2]) {"{"}
                            </div>
                            <div className="pl-8 text-green-400">
                                result.add(list1[p1]); <span className="text-zinc-500">// Match!</span>
                            </div>
                            <div className="pl-8">p1++; p2++;</div>
                            <div className="pl-4">{"}"} <span className="text-purple-400">else if</span> (list1[p1] &lt; list2[p2]) {"{"}</div>
                            <div className="pl-8">p1++; <span className="text-zinc-500">// Advance lagger</span></div>
                            <div className="pl-4">{"}"} <span className="text-purple-400">else</span> {"{"}</div>
                            <div className="pl-8">p2++;</div>
                            <div className="pl-4">{"}"}</div>
                            <div>{"}"}</div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-zinc-700 text-xs text-zinc-400">
                            In practice, engines dynamically choose between Linear merge, Galloping, and Block-skip + merge based on
                            relative list sizes and term selectivity.
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                            <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-2">
                                <GitMerge className="w-4 h-4" />
                                Optimization: Galloping Search
                            </h4>
                            <p className="text-sm text-amber-800">
                                What if List A has 1,000,000 items and List B has 2? Iterating 1M items is wasteful.
                                <br /><br />
                                <strong>Galloping</strong> checks indices exponentially ($1, 2, 4, 8, 16...$) to skip massive chunks of List A.
                                Complexity becomes <code>O(M · log N)</code>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Roaring Bitmaps */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">Roaring Bitmaps: The Modern Filters</h2>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1 space-y-4">
                        <p className="text-foreground leading-relaxed">
                            For heavy filtering (e.g., <code>status=published</code>), we don't use standard integer lists.
                            A <strong>BitSet</strong> (001001...) is fast but wasteful if data is sparse (storing 1M zeros for one '1').
                        </p>
                        <p className="text-foreground leading-relaxed">
                            <strong>Roaring Bitmaps</strong> solve this by being hybrid. They split distinct integers into 64k "Containers" and choose the best format dynamically:
                        </p>
                        <div className="my-4 bg-amber-50 border border-amber-200 p-4 rounded text-sm text-amber-900">
                            <strong>Consider a "Parking Lot" Strategy:</strong>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                                <li><strong>Sparse (Array):</strong> If only 3 cars are parked, just write down their spot numbers: <code>[10, 50, 99]</code>.</li>
                                <li><strong>Dense (Bitmap):</strong> If the lot is full, it's cheaper to draw a map of the lot with X's where cars are.</li>
                            </ul>
                            Roaring does exactly this switching strategies per "chunk" of numbers.
                        </div>
                        <ul className="space-y-3 mt-2">
                            <li className="flex items-center gap-3 p-3 bg-zinc-50 rounded border border-zinc-200">
                                <Box className="w-5 h-5 text-blue-500" />
                                <div>
                                    <div className="font-bold text-sm">Array Container</div>
                                    <div className="text-xs text-zinc-500">For very sparse data. Stores sorted <code>uint16[]</code>.</div>
                                </div>
                            </li>
                            <li className="flex items-center gap-3 p-3 bg-zinc-50 rounded border border-zinc-200">
                                <Layers className="w-5 h-5 text-purple-500" />
                                <div>
                                    <div className="font-bold text-sm">Bitmap Container</div>
                                    <div className="text-xs text-zinc-500">For dense data. Stores 65,536 bits (~8KB).</div>
                                </div>
                            </li>
                            <li className="flex items-center gap-3 p-3 bg-zinc-50 rounded border border-zinc-200">
                                <ArrowRight className="w-5 h-5 text-amber-500" />
                                <div>
                                    <div className="font-bold text-sm">Run Container</div>
                                    <div className="text-xs text-zinc-500">For long consecutive runs (e.g., [1000..50000]).</div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="w-full md:w-80 bg-zinc-900 p-6 rounded-xl border border-zinc-800 text-center">
                        <div className="text-xs font-bold text-zinc-500 uppercase mb-4">Performance Characteristics</div>
                        <ul className="text-sm text-zinc-300 space-y-2 text-left px-4 mb-6">
                            <li className="flex gap-2"><span className="text-blue-500">•</span> Memory-bandwidth bound</li>
                            <li className="flex gap-2"><span className="text-blue-500">•</span> Vectorized AND / OR</li>
                            <li className="flex gap-2"><span className="text-blue-500">•</span> Block-wise skipping</li>
                            <li className="flex gap-2"><span className="text-blue-500">•</span> Branch-free inner loops</li>
                        </ul>
                        <div className="text-xs text-zinc-500 border-t border-zinc-800 pt-4">
                            Used by: Lucene, Elasticsearch, Druid, Pinot, Spark, Snowflake, ClickHouse
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Phrase Queries */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">The Cost of Positions (Phrases)</h2>
                <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
                    <div className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Two-Phase Verification</h3>
                            <p className="text-foreground leading-relaxed">
                                Query: <code>"new york"</code>. Use phrase queries carefully. They require checking the <em>position</em> of every term match.
                                Position files are huge (3x-4x larger than doc lists).
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-white rounded border border-zinc-200 shadow-sm">
                                <div className="font-bold text-zinc-900 mb-1">Step 1: Boolean</div>
                                <div className="text-xs text-zinc-500">Intersect <code>new</code> AND <code>york</code></div>
                                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-2 inline-block">Fast ( RAM)</div>
                            </div>
                            <div className="flex items-center justify-center">
                                <ArrowRight className="w-6 h-6 text-zinc-400" />
                            </div>
                            <div className="p-4 bg-white rounded border border-zinc-200 shadow-sm">
                                <div className="font-bold text-zinc-900 mb-1">Step 2: Verification</div>
                                <div className="text-xs text-zinc-500">Load positions only for survivors</div>
                                <div className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded mt-2 inline-block">Slow (Disk I/O)</div>
                            </div>
                        </div>

                        <p className="text-sm text-zinc-600 italic text-center">
                            "Don't pay the I/O cost for documents that don't even have both terms."
                        </p>

                        <div className="bg-white p-4 rounded border border-zinc-200 shadow-sm text-sm">
                            <h4 className="font-bold text-zinc-900 mb-2">Additional Optimization: Rare-Term Anchoring</h4>
                            <p className="text-zinc-600 mb-2">
                                For <code>"new york"</code>, if <code>df("york") &lt;&lt; df("new")</code>:
                            </p>
                            <ol className="list-decimal pl-5 space-y-1 text-zinc-700">
                                <li>Iterate <strong>york</strong> positions.</li>
                                <li>Check if <strong>new</strong> exists at <code>pos - 1</code>.</li>
                            </ol>
                            <div className="mt-2 text-xs text-zinc-500 italic">
                                This minimizes position loads, comparisons, and Disk I/O.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Block-Max (Preview) */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">Block-Max and Upper-Bound Skipping (Preview)</h2>
                <div className="bg-zinc-900 text-zinc-300 p-8 rounded-xl border border-zinc-800">
                    <p className="mb-4 leading-relaxed">
                        Some engines store, per block: <strong>Max possible contribution to score</strong>.
                        <br />
                        During traversal:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mb-6 text-zinc-400">
                        <li>If a block cannot possibly beat the current threshold...</li>
                        <li>The <strong>entire block is skipped</strong>.</li>
                    </ul>
                    <div className="p-4 bg-zinc-800 rounded border border-zinc-700 italic text-center text-zinc-200">
                        "Only visit blocks that are even capable of producing competitive documents."
                    </div>
                    <div className="mt-4 text-xs text-zinc-500 text-center">
                        (This is where traversal begins to blend into ranking-aware retrieval.)
                    </div>
                </div>
            </section>

            {/* 7. Life Cycle of a Query */}
            {/* 7. Life Cycle of a Query (Redesigned) */}
            <section className="space-y-12">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold">Retrieval Architecture: A Concrete Example</h2>
                    <p className="text-xl text-muted-foreground">
                        Let's trace the query <code>"blue jeans"</code> through the system.
                    </p>
                </div>

                {/* 1. The Data Layout */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 font-mono text-sm">
                        <div className="flex items-center gap-2 mb-4 text-purple-400">
                            <Cpu className="w-5 h-5" />
                            <strong>1. RAM: Term Dictionary (FST)</strong>
                        </div>
                        <div className="text-zinc-500 mb-2">// Maps Term &rarr; File Pointer</div>
                        <div className="space-y-1 pl-4 border-l-2 border-purple-900 text-zinc-300">
                            <div>"blue"   &rarr; <span className="text-yellow-500">0xA1</span></div>
                            <div>"black"  &rarr; <span className="text-yellow-500">0xA8</span></div>
                            <div>"jeans"  &rarr; <span className="text-yellow-500">0xB2</span></div>
                            <div>"jacket" &rarr; <span className="text-yellow-500">0xB9</span></div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 font-mono text-sm">
                        <div className="flex items-center gap-2 mb-4 text-blue-400">
                            <Database className="w-5 h-5" />
                            <strong>2. DISK: Postings File</strong>
                        </div>
                        <div className="text-zinc-500 mb-2">// Compressed Blocks at Addresses</div>
                        <div className="space-y-4 pl-4 border-l-2 border-blue-900 text-zinc-300">
                            <div>
                                <div className="text-yellow-500 mb-1">@ 0xA1 (blue):</div>
                                <div className="text-zinc-500 pl-4">Block 1: [10, 23, 105, 500...]</div>
                                <div className="text-zinc-500 pl-4">Block 2: [1000, 1040...]</div>
                            </div>
                            <div>
                                <div className="text-yellow-500 mb-1">@ 0xB2 (jeans):</div>
                                <div className="text-zinc-500 pl-4">Block 1: [5, 23, 104, 500...]</div>
                                <div className="text-zinc-500 pl-4">Block 2: [900, 1040...]</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Execution Flow */}
                <div className="relative border-l-2 border-zinc-200 ml-4 space-y-12 py-4">

                    {/* Step 1 */}
                    <div className="relative pl-8">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-900 ring-4 ring-white"></div>
                        <h3 className="text-lg font-bold text-zinc-900 mb-2">Step 1: Dictionary Lookup</h3>
                        <div className="bg-zinc-50 p-4 rounded border border-zinc-200">
                            <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                                <span className="font-mono text-zinc-500">Input:</span>
                                <span className="font-mono font-bold">"blue", "jeans"</span>

                                <span className="font-mono text-zinc-500">Action:</span>
                                <span>Traverse FST in RAM.</span>

                                <span className="font-mono text-zinc-500">Result:</span>
                                <span className="font-mono">
                                    blue &rarr; <span className="bg-yellow-100 text-yellow-800 px-1 rounded">0xA1</span>,
                                    jeans &rarr; <span className="bg-yellow-100 text-yellow-800 px-1 rounded">0xB2</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative pl-8">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white"></div>
                        <h3 className="text-lg font-bold text-zinc-900 mb-2">Step 2: Access & Stream</h3>
                        <div className="bg-zinc-50 p-4 rounded border border-zinc-200">
                            <p className="text-sm text-zinc-700 mb-2">
                                The engine opens two streams to the Postings File. It does <strong>not</strong> load everything. It streams <strong>Block Headers</strong> first.
                            </p>
                            <div className="flex gap-4 font-mono text-xs mt-2">
                                <div className="bg-white px-2 py-1 border rounded">Stream A: @0xA1</div>
                                <div className="bg-white px-2 py-1 border rounded">Stream B: @0xB2</div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative pl-8">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-500 ring-4 ring-white"></div>
                        <h3 className="text-lg font-bold text-zinc-900 mb-2">Step 3: Block Skip Check</h3>
                        <div className="bg-zinc-50 p-4 rounded border border-zinc-200 space-y-4">
                            <div className="text-sm">We compare the <code>minDoc / maxDoc</code> headers of current blocks to see if they overlap.</div>

                            {/* Comparison 1 */}
                            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-3 rounded border border-zinc-200">
                                <div className="text-center">
                                    <div className="text-xs text-zinc-500 uppercase">Blue Block</div>
                                    <div className="font-mono font-bold">[10 ... 500]</div>
                                </div>
                                <div className="text-zinc-400"><ArrowRight className="w-4 h-4" /></div>
                                <div className="text-center">
                                    <div className="text-xs text-zinc-500 uppercase">Jeans Block</div>
                                    <div className="font-mono font-bold">[5 ... 104]</div>
                                </div>
                                <div className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">
                                    OVERLAP &rarr; DECODE
                                </div>
                            </div>

                            {/* Comparison 2 */}
                            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-3 rounded border border-zinc-200 opacity-75">
                                <div className="text-center">
                                    <div className="text-xs text-zinc-500 uppercase">Blue Block</div>
                                    <div className="font-mono font-bold text-zinc-500">[1000 ... 2000]</div>
                                </div>
                                <div className="text-zinc-400"><ArrowRight className="w-4 h-4" /></div>
                                <div className="text-center">
                                    <div className="text-xs text-zinc-500 uppercase">Jeans Block</div>
                                    <div className="font-mono font-bold text-zinc-500">[300 ... 900]</div>
                                </div>
                                <div className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-bold">
                                    NO OVERLAP &rarr; SKIP
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="relative pl-8">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-white"></div>
                        <h3 className="text-lg font-bold text-zinc-900 mb-2">Step 4: SIMD Decompression</h3>
                        <div className="bg-zinc-50 p-4 rounded border border-zinc-200">
                            <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                                <span className="font-mono text-zinc-500">Input:</span>
                                <span className="font-mono text-zinc-400">0x1F, 0xA2, 0x07... (Compressed Bytes)</span>

                                <span className="font-mono text-zinc-500">Action:</span>
                                <div><strong>SIMD Expand</strong> (AVX-512) to CPU Cache.</div>

                                <span className="font-mono text-zinc-500">Output:</span>
                                <span className="font-mono font-bold">[10, 23, 105, 500...]</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 5 */}
                    <div className="relative pl-8">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 ring-4 ring-white"></div>
                        <h3 className="text-lg font-bold text-zinc-900 mb-2">Step 5: Intersection & Phrase Check</h3>
                        <div className="bg-zinc-50 p-4 rounded border border-zinc-200">
                            <div className="mb-4">
                                <div className="text-sm font-bold mb-2">The "Zipper" (Intersection)</div>
                                <div className="font-mono text-sm bg-white p-2 border rounded text-zinc-600">
                                    Blue : [10, <strong className="text-green-600 bg-green-50">23</strong>, 105, <strong className="text-green-600 bg-green-50">500</strong>...]<br />
                                    Jeans: [5,  <strong className="text-green-600 bg-green-50">23</strong>, 104, <strong className="text-green-600 bg-green-50">500</strong>...]
                                </div>
                            </div>

                            <div>
                                <div className="text-sm font-bold mb-2">Phrase Verification (Optional)</div>
                                <p className="text-sm text-zinc-600">
                                    For <strong>Page 23</strong>: Load "Blue" positions. Load "Jeans" positions.
                                    Check: Is <code>Pos(Jeans) == Pos(Blue) + 1</code>?
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Final Output */}
                    <div className="relative pl-8">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-900 ring-4 ring-white p-1">
                            <div className="bg-white w-full h-full rounded-full"></div>
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 mb-2">Final Output</h3>
                        <div className="font-mono bg-zinc-900 text-green-400 p-4 rounded-lg">
                            [Doc 23, Doc 500, ...]
                        </div>
                        <p className="text-sm text-zinc-500 mt-2">
                            Pass to Ranking Engine (BM25) or Filter logic.
                        </p>
                    </div>
                </div>

                {/* Mental Model & Summary */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl border-2 border-zinc-200">
                        <h3 className="text-lg font-bold mb-4">One-Page Mental Picture</h3>
                        <div className="flex flex-col gap-3 items-center text-sm font-bold text-zinc-700">
                            <div className="p-2 border rounded bg-zinc-50 w-full text-center">Query</div>
                            <ArrowRight className="rotate-90 text-zinc-400" />
                            <div className="p-2 border rounded bg-purple-50 w-full text-center text-purple-900">RAM: FST Lookup (Get Pointers)</div>
                            <ArrowRight className="rotate-90 text-zinc-400" />
                            <div className="p-2 border rounded bg-blue-50 w-full text-center text-blue-900">DISK: Open Postings Streams</div>
                            <ArrowRight className="rotate-90 text-zinc-400" />
                            <div className="p-3 border-2 border-dashed border-zinc-300 rounded w-full text-center bg-zinc-50">
                                Loop:<br />
                                <span className="text-zinc-500 font-normal">Block Skip &rarr; SIMD Decode &rarr; Intersect</span>
                            </div>
                            <ArrowRight className="rotate-90 text-zinc-400" />
                            <div className="p-2 border rounded bg-green-50 w-full text-center text-green-900">Candidate DocID Set</div>
                        </div>
                    </div>

                    <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                            Why This Is Fast
                        </h3>
                        <ul className="space-y-3 text-sm text-zinc-700">
                            <li className="flex gap-2">
                                <span className="text-green-500 font-bold">✓</span>
                                <span><strong>Dictionary in RAM:</strong> Zero disk seeks to find "where the data is".</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-500 font-bold">✓</span>
                                <span><strong>Streaming IO:</strong> Postings are read sequentially, not randomly.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-500 font-bold">✓</span>
                                <span><strong>Block Skipping:</strong> Massive chunks of data are ignored without ever being decompressed.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-500 font-bold">✓</span>
                                <span><strong>SIMD:</strong> Vectorized instructions reduce CPU cycles per integer.</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </section>

            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/retrieval/recall-vs-precision" className="text-sm font-medium text-muted-foreground hover:text-primary">
                    ← Chapter 5.1: Recall vs Precision
                </Link>
                <Link href="/search/retrieval/bm25" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                    Chapter 5.3: Scoring (BM25) <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div >
    );
}
