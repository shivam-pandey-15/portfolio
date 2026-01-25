import { ArrowRight, BookOpen, Zap, Filter, ArrowDown, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "The Inverted Index", description: "Maps Term → Documents, enabling O(1) lookups for full-text search." },
    { title: "Intersection", description: "AND queries are intersections. The smallest posting list is processed first for efficiency." },
    { title: "Compression", description: "Techniques like delta encoding and VInt reduce storage by 40x for common terms." },
    { title: "Analysis Consistency", description: "The same analysis pipeline must be used at index time and query time." },
    { title: "Field Types", description: "Use 'text' for full-text search and 'keyword' for exact filtering/aggregations." }
];

export default function InvertedIndex() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 3.2: Indexing & Infrastructure</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">The Inverted Index</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    The data structure that makes text search possible. By flipping the relationship from
                    "document → words" to "word → documents", we achieve O(1) lookups across billions of documents.
                </p>
            </div>

            <hr className="border-border" />

            {/* Forward vs Inverted Visual */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">The Inversion That Changed Everything</h2>
                <p className="text-foreground leading-relaxed">
                    A traditional database stores documents and scans each one to find matches. An inverted index
                    pre-computes the answer to "which documents contain this word?" for every word in the corpus.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Forward Index */}
                    <div className="rounded-xl border-2 border-red-500 bg-red-50 p-6">
                        <div className="flex items-center gap-2 text-red-700 font-bold mb-4">
                            <BookOpen className="w-5 h-5" />
                            Forward Index (Database)
                        </div>
                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm">
                            <div className="text-zinc-300"><span className="text-amber-400">Doc 1:</span> "the quick brown fox"</div>
                            <div className="text-zinc-300"><span className="text-amber-400">Doc 2:</span> "quick brown dog"</div>
                            <div className="text-zinc-300"><span className="text-amber-400">Doc 3:</span> "lazy dog"</div>
                        </div>
                        <div className="mt-4 text-sm text-red-800 border-t border-red-200 pt-3">
                            To find "brown": Scan Doc 1, then Doc 2, then Doc 3...
                            <div className="font-bold text-red-900 mt-1">O(N)  Linear scan of all documents</div>
                        </div>
                    </div>

                    {/* Inverted Index */}
                    <div className="rounded-xl border-2 border-green-500 bg-green-50 p-6">
                        <div className="flex items-center gap-2 text-green-700 font-bold mb-4">
                            <Zap className="w-5 h-5" />
                            Inverted Index (Search Engine)
                        </div>
                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm space-y-1">
                            <div><span className="text-green-400">"brown"</span><span className="text-zinc-500"> →</span><span className="text-zinc-100"> [Doc 1, Doc 2]</span></div>
                            <div><span className="text-green-400">"dog"</span><span className="text-zinc-500">   →</span><span className="text-zinc-100"> [Doc 2, Doc 3]</span></div>
                            <div><span className="text-green-400">"quick"</span><span className="text-zinc-500"> →</span><span className="text-zinc-100"> [Doc 1, Doc 2]</span></div>
                        </div>
                        <div className="mt-4 text-sm text-green-800 border-t border-green-200 pt-3">
                            To find "brown": Direct lookup in dictionary.
                            <div className="font-bold text-green-900 mt-1">O(1)  Instant lookup regardless of corpus size</div>
                        </div>
                    </div>
                </div>
            </section >

            {/* The Core Components */}
            < section className="space-y-8" >
                <h2 className="text-3xl font-bold">Anatomy of an Inverted Index</h2>

                {/* Term Dictionary */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                        <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                        Term Dictionary (FST)
                    </h3>
                    <p className="text-foreground">
                        The term dictionary is a sorted index of every unique word. It uses a
                        <strong> Finite State Transducer (FST)</strong>  a compressed prefix tree that shares common prefixes and suffixes.
                    </p>

                    <div className="bg-zinc-900 rounded-xl p-6">
                        <div className="text-zinc-400 text-sm mb-4">Encoding: "apple", "apply", "application"</div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="flex items-center">
                                {['a', 'p', 'p', 'l'].map((char, i) => (
                                    <div key={i} className="flex items-center">
                                        <div className="w-8 h-8 rounded-full border-2 border-blue-500 bg-blue-900 flex items-center justify-center font-mono text-blue-100 font-bold">
                                            {char}
                                        </div>
                                        <div className="w-4 h-0.5 bg-blue-500"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col items-start gap-2 ml-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full border border-blue-500 bg-blue-900 flex items-center justify-center font-mono text-blue-100 text-xs">e</div>
                                    <span className="bg-green-700 text-green-100 px-2 py-0.5 rounded text-xs font-bold">apple</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full border border-blue-500 bg-blue-900 flex items-center justify-center font-mono text-blue-100 text-xs">y</div>
                                    <span className="bg-green-700 text-green-100 px-2 py-0.5 rounded text-xs font-bold">apply</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-zinc-500 text-xs font-mono">...ication</div>
                                    <span className="bg-green-700 text-green-100 px-2 py-0.5 rounded text-xs font-bold">application</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center mt-6 text-zinc-400 text-sm">
                            Shared prefixes compress storage. Lookup time = O(word length), not O(vocabulary size).
                        </div>
                    </div>
                </div>

                {/* Posting Lists */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                        <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                        Posting Lists (Compressed)
                    </h3>
                    <p className="text-foreground">
                        Each term points to a list of document IDs. These lists can contain millions of entries,
                        so we apply heavy compression.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="rounded-xl border-2 border-red-300 bg-red-50 p-4">
                            <div className="text-xs font-bold text-red-700 uppercase mb-2">Raw IDs (Expensive)</div>
                            <div className="bg-zinc-900 rounded p-3 font-mono text-sm text-zinc-100">
                                [100, 101, 102, 105, 200, 300]
                            </div>
                            <div className="text-xs text-red-700 mt-2">6 integers × 4 bytes = 24 bytes</div>
                        </div>
                        <div className="rounded-xl border-2 border-green-300 bg-green-50 p-4">
                            <div className="text-xs font-bold text-green-700 uppercase mb-2">Delta Encoded (Cheap)</div>
                            <div className="bg-zinc-900 rounded p-3 font-mono text-sm text-green-300">
                                [100, +1, +1, +3, +95, +100]
                            </div>
                            <div className="text-xs text-green-700 mt-2">Small deltas = fewer bytes. ~4x compression!</div>
                        </div>
                    </div>

                    <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-xl">
                        <div className="font-bold text-blue-800 mb-2">Real-World Compression</div>
                        <p className="text-sm text-blue-900">
                            The term "the" appears in 50 million documents.<br />
                            <strong>Uncompressed:</strong> 50M × 4 bytes = 200 MB<br />
                            <strong>Compressed:</strong> ~5 MB (40x smaller!)
                        </p>
                    </div>
                </div>
            </section >

            {/* Query Execution Step by Step */}
            < section className="space-y-8" >
                <h2 className="text-3xl font-bold">How a Query Executes</h2>
                <p className="text-foreground">
                    Let's trace exactly what happens when you search for <code className="bg-muted px-2 py-0.5 rounded text-foreground">"wireless keyboard"</code>
                </p>

                <div className="bg-zinc-900 rounded-xl p-6 space-y-6">
                    {/* Step 1 */}
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">1</div>
                        <div>
                            <h4 className="font-bold text-zinc-100">Parse & Analyze Query</h4>
                            <div className="font-mono text-sm text-zinc-300 mt-2">
                                "wireless keyboard" → tokens: [<span className="text-green-400">"wireless"</span>, <span className="text-green-400">"keyboard"</span>]
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">2</div>
                        <div>
                            <h4 className="font-bold text-zinc-100">Look Up Each Term in Dictionary</h4>
                            <div className="font-mono text-sm text-zinc-300 mt-2 space-y-1">
                                <div>FST lookup <span className="text-amber-400">"wireless"</span> → pointer to List A (~100ns)</div>
                                <div>FST lookup <span className="text-amber-400">"keyboard"</span> → pointer to List B (~100ns)</div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">3</div>
                        <div>
                            <h4 className="font-bold text-zinc-100">Retrieve Posting Lists</h4>
                            <div className="font-mono text-sm mt-2 space-y-1">
                                <div><span className="text-amber-400">"wireless"</span><span className="text-zinc-500"> →</span><span className="text-zinc-100"> [10, 45, 89, 234, </span><span className="text-green-400 font-bold">567</span><span className="text-zinc-100">, </span><span className="text-green-400 font-bold">890</span><span className="text-zinc-100">, 1234]</span></div>
                                <div><span className="text-amber-400">"keyboard"</span><span className="text-zinc-500"> →</span><span className="text-zinc-100"> [45, 123, </span><span className="text-green-400 font-bold">567</span><span className="text-zinc-100">, 789, </span><span className="text-green-400 font-bold">890</span><span className="text-zinc-100">, 2345]</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">4</div>
                        <div>
                            <h4 className="font-bold text-zinc-100">Intersect Lists (AND Query)</h4>
                            <p className="text-sm text-zinc-400 mt-1">Two-pointer merge algorithm. Both lists are sorted, so we walk them together.</p>
                            <div className="font-mono text-sm mt-2 bg-zinc-800 p-3 rounded">
                                <div className="text-zinc-500">// Find documents in BOTH lists</div>
                                <div className="text-zinc-100">Result: [<span className="text-green-400 font-bold">45, 567, 890</span>]</div>
                            </div>
                        </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">5</div>
                        <div>
                            <h4 className="font-bold text-zinc-100">Score & Rank (BM25)</h4>
                            <div className="font-mono text-xs mt-2 bg-zinc-800 p-3 rounded text-zinc-300">
                                <div><span className="text-zinc-500">def</span> bm25(doc, terms):</div>
                                <div className="pl-4">score = 0</div>
                                <div className="pl-4"><span className="text-zinc-500">for</span> term <span className="text-zinc-500">in</span> terms:</div>
                                <div className="pl-8">tf = term_frequency(term, doc)</div>
                                <div className="pl-8">idf = inverse_doc_frequency(term)</div>
                                <div className="pl-8">score += idf * tf_weight(tf)</div>
                                <div className="pl-4"><span className="text-zinc-500">return</span> score</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-green-100 border-2 border-green-500 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-green-800">Total Time: ~5 milliseconds</div>
                    <div className="text-sm text-green-700 mt-1">Across millions of documents</div>
                </div>
            </section>

            {/* Boolean Operations */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Boolean Operations on Posting Lists</h2>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="rounded-xl border-2 border-border p-4 bg-white">
                        <h4 className="font-bold text-foreground mb-2">AND (Intersection)</h4>
                        <div className="bg-zinc-900 rounded p-3 font-mono text-xs text-zinc-100">
                            <div>laptop: [1, 5, 23, 100]</div>
                            <div>macbook: [5, 23, 500]</div>
                            <div className="border-t border-zinc-700 mt-2 pt-2 text-green-400 font-bold">Result: [5, 23]</div>
                        </div>
                    </div>
                    <div className="rounded-xl border-2 border-border p-4 bg-white">
                        <h4 className="font-bold text-foreground mb-2">OR (Union)</h4>
                        <div className="bg-zinc-900 rounded p-3 font-mono text-xs text-zinc-100">
                            <div>laptop: [1, 5, 23]</div>
                            <div>tablet: [5, 50, 100]</div>
                            <div className="border-t border-zinc-700 mt-2 pt-2 text-green-400 font-bold">Result: [1, 5, 23, 50, 100]</div>
                        </div>
                    </div>
                    <div className="rounded-xl border-2 border-border p-4 bg-white">
                        <h4 className="font-bold text-foreground mb-2">NOT (Difference)</h4>
                        <div className="bg-zinc-900 rounded p-3 font-mono text-xs text-zinc-100">
                            <div>laptop: [1, 5, 23, 100]</div>
                            <div>apple: [5, 23]</div>
                            <div className="border-t border-zinc-700 mt-2 pt-2 text-green-400 font-bold">Result: [1, 100]</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Analysis Pipeline */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">The Analysis Pipeline</h2>
                <p className="text-foreground">
                    Before text enters the inverted index, it passes through an analysis pipeline.
                    <strong> The same analysis must happen at both index time and query time</strong>  otherwise queries won't match!
                </p>

                <div className="bg-zinc-900 rounded-xl p-6">
                    <div className="flex flex-col items-center gap-3">
                        <div className="bg-zinc-100 text-zinc-900 font-bold px-4 py-2 rounded-lg text-sm w-full max-w-xs text-center">
                            Raw Text: "Hello, C++ World!"
                        </div>
                        <ArrowDown className="w-5 h-5 text-zinc-500" />

                        <div className="bg-purple-900 border border-purple-600 rounded-lg p-3 w-full max-w-md">
                            <div className="text-purple-300 text-xs font-bold uppercase">Character Filters</div>
                            <div className="text-purple-100 text-sm mt-1">Strip HTML, map C++ → cpp, remove accents</div>
                        </div>
                        <ArrowDown className="w-5 h-5 text-zinc-500" />

                        <div className="bg-blue-900 border border-blue-600 rounded-lg p-3 w-full max-w-md">
                            <div className="text-blue-300 text-xs font-bold uppercase">Tokenizer</div>
                            <div className="text-blue-100 text-sm mt-1">Split on whitespace/punctuation → ["Hello", "cpp", "World"]</div>
                        </div>
                        <ArrowDown className="w-5 h-5 text-zinc-500" />

                        <div className="bg-green-900 border border-green-600 rounded-lg p-3 w-full max-w-md">
                            <div className="text-green-300 text-xs font-bold uppercase">Token Filters</div>
                            <div className="text-green-100 text-sm mt-1">Lowercase: "hello", Stemming: "run" → "run"</div>
                        </div>
                        <ArrowDown className="w-5 h-5 text-zinc-500" />

                        <div className="bg-zinc-100 text-zinc-900 font-bold px-4 py-2 rounded-lg text-sm w-full max-w-xs text-center">
                            Final Terms: ["hello", "cpp", "world"]
                        </div>
                    </div>
                </div>
            </section>

            {/* How Indexing is Built */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">How the Index is Built (Segments)</h2>
                <div className="bg-amber-100 border-l-4 border-amber-500 p-4">
                    <p className="font-bold text-amber-900 leading-tight">
                        The index is NOT a single updated file. It is a collection of immutable <strong>Segments</strong>.
                    </p>
                </div>
                <p className="text-foreground leading-relaxed">
                    You cannot efficiently insert a new document ID into the middle of a sorted compressed posting list on disk.
                    Instead, search engines use an <strong>LSM-Tree (Log Structured Merge)</strong> approach:
                </p>
                <ul className="list-decimal pl-6 space-y-2 text-foreground">
                    <li><strong>Buffer:</strong> New documents go into an in-memory buffer.</li>
                    <li><strong>Flush:</strong> When full, the buffer is written as a new mini-segment (Analysis happens here).</li>
                    <li><strong>Merge:</strong> Background threads pick small segments and merge them into larger ones, deleting "tombstones" (deleted docs).</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                    This explains why "Refresh" (making new segment visible) and "Commit" (fsync to disk) are different operations.
                </p>
            </section>

            {/* Common Pitfalls */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Common Pitfalls</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Pitfall 1: GUIDs */}
                    <div className="rounded-xl border-2 border-red-300 bg-red-50 p-5">
                        <h4 className="font-bold text-red-800 mb-3">Pitfall: GUIDs as Text</h4>
                        <div className="bg-zinc-900 rounded-lg p-3 font-mono text-xs text-zinc-100">
                            <div className="text-red-400">// BAD: Standard analyzer splits on hyphens</div>
                            <div>"550e8400-e29b-41d4-a716-446655440000"</div>
                            <div className="text-zinc-400">→ ["550e8400", "e29b", "41d4", ...]</div>
                            <div className="text-zinc-500 mt-2">// 5 terms instead of 1!</div>
                        </div>
                        <div className="mt-3 bg-green-100 rounded p-2">
                            <div className="text-xs font-bold text-green-800">Fix: Use keyword type</div>
                            <code className="text-xs text-green-900">"type": "keyword"</code>
                        </div>
                    </div>

                    {/* Pitfall 2: Aggregating on Text */}
                    <div className="rounded-xl border-2 border-red-300 bg-red-50 p-5">
                        <h4 className="font-bold text-red-800 mb-3">Pitfall: Aggregating on Text</h4>
                        <div className="bg-zinc-900 rounded-lg p-3 font-mono text-xs text-zinc-100">
                            <div className="text-red-400">// BAD: Aggregating on analyzed text</div>
                            <div>"Light Blue" → ["light", "blue"]</div>
                            <div className="text-zinc-400">Results: "light": 5000, "blue": 4000</div>
                            <div className="text-zinc-500 mt-2">// Not useful!</div>
                        </div>
                        <div className="mt-3 bg-green-100 rounded p-2">
                            <div className="text-xs font-bold text-green-800">Fix: Use keyword subfield</div>
                            <code className="text-xs text-green-900">"field": "color.keyword"</code>
                        </div>
                    </div>
                </div>
            </section>

            {/* Performance Benchmarks */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Performance Benchmarks</h2>
                <p className="text-muted-foreground">Dataset: 100 million product descriptions (~50 GB text)</p>

                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">Query Type</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Time</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                            <tr><td className="px-4 py-2 text-foreground">Single term</td><td className="px-4 py-2 text-green-700 font-bold">3ms</td><td className="px-4 py-2 text-muted-foreground">Index lookup + score top 1000</td></tr>
                            <tr><td className="px-4 py-2 text-foreground">AND (2 terms)</td><td className="px-4 py-2 text-green-700 font-bold">5ms</td><td className="px-4 py-2 text-muted-foreground">Intersection of posting lists</td></tr>
                            <tr><td className="px-4 py-2 text-foreground">AND (5 terms)</td><td className="px-4 py-2 text-foreground">12ms</td><td className="px-4 py-2 text-muted-foreground">Multiple intersections</td></tr>
                            <tr><td className="px-4 py-2 text-foreground">Phrase (2 words)</td><td className="px-4 py-2 text-foreground">8ms</td><td className="px-4 py-2 text-muted-foreground">Check positions</td></tr>
                            <tr><td className="px-4 py-2 text-foreground">Wildcard lap*</td><td className="px-4 py-2 text-amber-700">50ms</td><td className="px-4 py-2 text-muted-foreground">Scan term dictionary</td></tr>
                            <tr><td className="px-4 py-2 text-foreground">Wildcard *top</td><td className="px-4 py-2 text-red-700 font-bold">500ms</td><td className="px-4 py-2 text-muted-foreground">Must scan entire dictionary!</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-zinc-900 rounded-xl p-6">
                    <div className="text-zinc-400 text-sm mb-4">Memory Usage (100M docs, 50GB text)</div>
                    <div className="grid md:grid-cols-2 gap-6 font-mono text-sm text-zinc-100">
                        <div className="space-y-1">
                            <div>Raw text data: <span className="text-zinc-400">50 GB</span></div>
                            <div>Term dictionary (FST): <span className="text-green-400">500 MB</span></div>
                            <div>Posting lists: <span className="text-amber-400">8 GB</span></div>
                            <div>Position data: <span className="text-amber-400">25 GB</span></div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="bg-zinc-800 px-4 py-3 rounded-lg text-center">
                                <div className="text-zinc-400 text-xs">Total Inverted Index</div>
                                <div className="text-2xl font-bold text-green-400">~34 GB</div>
                                <div className="text-xs text-zinc-500">(0.68x raw text)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* When NOT to use */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-red-700">When NOT to use an Inverted Index</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="border border-red-200 bg-red-50 p-4 rounded-xl">
                        <h4 className="font-bold text-red-900 mb-2">Numeric Ranges</h4>
                        <p className="text-sm text-red-800">
                            Query: <code className="bg-red-100 px-1 rounded">price &gt; 100</code><br />
                            Inverted indexes must verify every unique word &gt; 100.
                            <br /><strong>Use: BKD Trees</strong>
                        </p>
                    </div>
                    <div className="border border-red-200 bg-red-50 p-4 rounded-xl">
                        <h4 className="font-bold text-red-900 mb-2">Semantic Similarity</h4>
                        <p className="text-sm text-red-800">
                            Query: "Similar to 'King'"<br />
                            Inverted index only finds exact character matches ("Kingdom").
                            <br /><strong>Use: Vectors</strong>
                        </p>
                    </div>
                    <div className="border border-red-200 bg-red-50 p-4 rounded-xl">
                        <h4 className="font-bold text-red-900 mb-2">Sorting / Aggregations</h4>
                        <p className="text-sm text-red-800">
                            "Group by Category"<br />
                            Uninverting (Doc-&gt;Term) is slow.
                            <br /><strong>Use: DocValues</strong>
                        </p>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />


            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/indexing/definition" className="text-sm font-medium text-muted-foreground hover:text-primary">
                    ← 3.1 What is an Index?
                </Link>
                <Link href="/search/indexing/bkd-docvalues" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Next: BKD Trees & DocValues <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
