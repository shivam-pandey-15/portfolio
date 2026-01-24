"use client";

import { ArrowRight, ArrowLeft, ArrowDown, Database, Terminal, AlertTriangle, CheckCircle2, XCircle, Search, FileText, Binary, Scale, Layers, LayoutGrid, Settings, List, Calendar, Filter, SortAsc } from "lucide-react";
import Link from "next/link";

export default function TextVsStructured() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 4.4: Data Foundation</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Text vs Structured Data</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Understanding when to use text analysis versus exact matching is fundamental to search performance and correctness.
                    Treating a SKU like a sentence is the most common variety of "silent killer" in search applications.
                </p>
            </div>

            <hr className="border-border" />

            {/* 1. The Fundamental Difference */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Scale className="w-8 h-8" /> The Fundamental Difference
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Text Field */}
                    <div className="rounded-xl border-2 border-violet-500 bg-violet-50 p-6">
                        <div className="flex items-center gap-2 text-violet-900 font-bold mb-4">
                            <FileText className="w-5 h-5" />
                            Text Fields (Analyzed)
                        </div>
                        <p className="text-sm text-violet-800 mb-4 h-12">
                            Designed for <strong>Human Language</strong>. The engine breaks strings into "tokens" to support partial matches.
                        </p>
                        <div className="bg-zinc-900 rounded-lg p-5 font-mono text-xs text-zinc-100 shadow-lg">
                            <div className="text-zinc-500 mb-2">// Input</div>
                            <div className="mb-4">"Apple MacBook Pro"</div>

                            <div className="text-zinc-500 mb-2">// Analyzer Output (Tokens)</div>
                            <div className="flex gap-2 text-violet-400">
                                <span className="bg-zinc-800 px-2 py-1 rounded">"apple"</span>
                                <span className="bg-zinc-800 px-2 py-1 rounded">"macbook"</span>
                                <span className="bg-zinc-800 px-2 py-1 rounded">"pro"</span>
                            </div>

                            <div className="mt-4 pt-4 border-t border-zinc-700">
                                <div className="text-zinc-500 mb-2">// Query: "macbook"</div>
                                <div className="text-green-400 font-bold">MATCH ✅</div>
                            </div>
                        </div>
                    </div>

                    {/* Structured Field */}
                    <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 p-6">
                        <div className="flex items-center gap-2 text-emerald-900 font-bold mb-4">
                            <Binary className="w-5 h-5" />
                            Structured Fields (Exact)
                        </div>
                        <p className="text-sm text-emerald-800 mb-4 h-12">
                            Designed for <strong>Machine Logic</strong>. The engine stores the value exactly as is.
                        </p>
                        <div className="bg-zinc-900 rounded-lg p-5 font-mono text-xs text-zinc-100 shadow-lg">
                            <div className="text-zinc-500 mb-2">// Input</div>
                            <div className="mb-4">"Apple"</div>

                            <div className="text-zinc-500 mb-2">// Stored Value</div>
                            <div className="flex gap-2 text-emerald-400">
                                <span className="bg-zinc-800 px-2 py-1 rounded">"Apple"</span>
                            </div>

                            <div className="mt-4 pt-4 border-t border-zinc-700">
                                <div className="text-zinc-500 mb-2">// Query: "apple"</div>
                                <div className="text-red-400 font-bold">NO MATCH ❌ <span className="text-zinc-500 text-[10px] font-normal">(Case sensitive)</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 1.1 Case Sensitivity */}
                <div className="bg-zinc-50 border-2 border-zinc-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-zinc-600" /> Case Sensitivity & Normalization
                    </h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-sm text-zinc-600 mb-4">
                                <code className="bg-zinc-100 px-1 rounded">keyword</code> fields are byte-level exact. "Apple" ≠ "apple".
                                To fix this without analyzing, use a <strong>Normalizer</strong>.
                            </p>
                            <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100">
                                <div className="text-zinc-500 mb-1">// Mapping</div>
                                <pre className="mb-2">{`"brand": {
  "type": "keyword",
  "normalizer": "lowercase"
}`}</pre>
                                <div className="text-green-400">Result: "Apple" stores as "apple"</div>
                            </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-bold text-sm text-blue-900 mb-2">Analyzer vs Normalizer</h4>
                            <ul className="text-xs text-blue-800 space-y-2">
                                <li><strong>Analyzer (Text):</strong> Tokenizes + Filters. Breaks string into multiple terms.</li>
                                <li><strong>Normalizer (Keyword):</strong> Whole string transformation (lowercase, asciifolding). Keep as single term.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Internal Data Structures */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Database className="w-8 h-8" /> Internal Data Structures
                </h2>
                <p className="text-foreground leading-relaxed">
                    Under the hood, Lucene uses completely different data structures for these two types.
                    Understanding this explains why "Range Queries on Strings" are slow and why "Full Text Search on Numbers" is wrong.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Inverted Index */}
                    <div className="bg-zinc-50 border-2 border-zinc-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Search className="w-5 h-5 text-zinc-600" /> Inverted Index (Text)
                        </h3>
                        <div className="bg-white border border-zinc-200 rounded-lg p-4 font-mono text-sm shadow-sm">
                            <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center mb-2 border-b border-zinc-100 pb-2 font-bold text-zinc-900">
                                <span>Term</span>
                                <span></span>
                                <span>Doc IDs</span>
                            </div>
                            <div className="space-y-2 text-zinc-600">
                                <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
                                    <span className="text-violet-700">"brown"</span>
                                    <ArrowRight className="w-3 h-3 text-zinc-400" />
                                    <span>[ 1, 2 ]</span>
                                </div>
                                <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
                                    <span className="text-violet-700">"fox"</span>
                                    <ArrowRight className="w-3 h-3 text-zinc-400" />
                                    <span>[ 1 ]</span>
                                </div>
                                <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
                                    <span className="text-violet-700">"quick"</span>
                                    <ArrowRight className="w-3 h-3 text-zinc-400" />
                                    <span>[ 1, 3 ]</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-zinc-500 mt-4 leading-relaxed">
                            <strong>Why it's fast:</strong> O(1) lookup. You ask for "fox", it gives you Doc 1 immediately.
                            <br />
                            <strong>Cost:</strong> High storage for "Posting Lists" (50GB+ for 1B docs).
                        </p>
                    </div>

                    {/* BKD Tree */}
                    <div className="bg-zinc-50 border-2 border-zinc-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-zinc-600" /> BKD Tree (Numeric/Geo)
                        </h3>
                        <div className="bg-white border border-zinc-200 rounded-lg p-4 flex flex-col items-center justify-center space-y-2 shadow-sm min-h-[160px]">
                            <div className="px-3 py-1 bg-zinc-100 border border-zinc-200 rounded text-xs">[ All Values ]</div>
                            <div className="w-px h-4 bg-zinc-300"></div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800">&lt; 1000</div>
                                    <div className="w-px h-2 bg-zinc-300"></div>
                                    <div className="flex gap-2 mt-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800">&gt;= 1000</div>
                                    <div className="w-px h-2 bg-zinc-300"></div>
                                    <div className="flex gap-2 mt-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-zinc-500 mt-4 leading-relaxed">
                            <strong>Why it's fast:</strong> O(log N) numeric range queries. It skips entire subtrees of data.
                            <br />
                            <strong>Optimization:</strong> Hundreds of times faster than comparing string "100" vs "200".
                        </p>
                    </div>
                </div>

                {/* 2.1 Why Text Range Queries Are Slow */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <h3 className="font-bold text-amber-900 mb-3 text-sm flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> Why Text Range Queries Are Slow
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-amber-800 mb-2">
                                Lexicographical sort is not numeric sort.
                                <br />"100" &gt; "2" is <strong className="text-red-600">FALSE</strong> in string world ("1" &lt; "2").
                            </p>
                            <div className="bg-white p-3 rounded border border-amber-100 font-mono text-xs text-zinc-600">
                                Terms: "1", "10", "100", "2", "20"
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-amber-800 mb-2">
                                <strong>Mechanism:</strong> To find range, Lucene must scan the Term Dictionary.
                                <br /><strong>BKD (Numeric):</strong> Skips entire blocks of data using the tree index.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2.2 Doc Values vs Inverted Index */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <SortAsc className="w-5 h-5 text-zinc-600" /> Doc Values vs Inverted Index
                    </h3>
                    <p className="text-foreground text-sm">
                        Search uses the Inverted Index (Term &rarr; Docs). Sorting and Aggregations need the reverse (Doc &rarr; Terms), called <strong>Doc Values</strong>.
                    </p>
                    <div className="overflow-x-auto rounded-xl border border-zinc-200">
                        <table className="w-full text-sm">
                            <thead className="bg-zinc-50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-semibold text-zinc-700">Structure</th>
                                    <th className="px-4 py-2 text-left font-semibold text-zinc-700">Used For</th>
                                    <th className="px-4 py-2 text-left font-semibold text-zinc-700">On Disk?</th>
                                    <th className="px-4 py-2 text-left font-semibold text-zinc-700">In Heap?</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 bg-white">
                                <tr>
                                    <td className="px-4 py-2 font-mono text-violet-700">Inverted Index</td>
                                    <td className="px-4 py-2">Search / Filtering</td>
                                    <td className="px-4 py-2">Yes</td>
                                    <td className="px-4 py-2 text-zinc-500">No (FST only)</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 font-mono text-emerald-700">Doc Values</td>
                                    <td className="px-4 py-2">Sorting / Aggregations</td>
                                    <td className="px-4 py-2">Yes</td>
                                    <td className="px-4 py-2 text-zinc-500">Memory Mapped (OS Cache)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-zinc-500">
                        * <code className="bg-zinc-100 px-1 rounded">text</code> fields don't have Doc Values by default (too heavy). That's why you can't sort on them.
                    </p>
                </div>
            </section>

            {/* 3. Common Mistakes */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8" /> Common Mistakes
                </h2>

                {/* Mistake 1 */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold">1. The "ID as Text" Trap</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* BAD */}
                        <div className="rounded-xl border-2 border-red-500 bg-red-50 p-6">
                            <div className="flex items-center gap-2 text-red-700 font-bold mb-4">
                                <XCircle className="w-5 h-5" /> BAD: SKU as Text
                            </div>
                            <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100 mb-4">
                                <div className="text-red-400">"sku": &#123; "type": "text" &#125;</div>
                                <div className="text-zinc-500 mt-2">// Document: "ABC-123"</div>
                                <div className="text-zinc-500">// Tokens: ["abc", "123"]</div>
                                <div className="mt-2 text-zinc-300">Query: "ABC-999"</div>
                                <div className="text-red-400 font-bold">MATCHES! (Shares "abc")</div>
                            </div>
                            <p className="text-xs text-red-800 font-medium">Result: False Positives on IDs.</p>
                        </div>
                        {/* GOOD */}
                        <div className="rounded-xl border-2 border-green-500 bg-green-50 p-6">
                            <div className="flex items-center gap-2 text-green-700 font-bold mb-4">
                                <CheckCircle2 className="w-5 h-5" /> GOOD: SKU as Keyword
                            </div>
                            <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100 mb-4">
                                <div className="text-green-400">"sku": &#123; "type": "keyword" &#125;</div>
                                <div className="text-zinc-500 mt-2">// Document: "ABC-123"</div>
                                <div className="text-zinc-500">// Token: "ABC-123" (Exact)</div>
                                <div className="mt-2 text-zinc-300">Query: "ABC-999"</div>
                                <div className="text-green-400 font-bold">NO MATCH (Different)</div>
                            </div>
                            <p className="text-xs text-green-800 font-medium">Result: Exact ID retrieval.</p>
                        </div>
                    </div>
                </div>

                {/* Mistake 2 */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold">2. The "Numeric String" Trap</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* BAD */}
                        <div className="rounded-xl border-2 border-red-500 bg-red-50 p-6">
                            <div className="flex items-center gap-2 text-red-700 font-bold mb-4">
                                <XCircle className="w-5 h-5" /> BAD: Price as String
                            </div>
                            <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100 mb-4">
                                <div className="text-zinc-500">// Values: "10.00", "2.00"</div>
                                <div className="mt-2 text-zinc-300">Sort: Ascending</div>
                                <div className="mt-2 text-red-400">
                                    1. "10.00"<br />
                                    2. "2.00"
                                </div>
                            </div>
                            <p className="text-xs text-red-800 font-medium">Result: "1" comes before "2". Sorting broken.</p>
                        </div>
                        {/* GOOD */}
                        <div className="rounded-xl border-2 border-green-500 bg-green-50 p-6">
                            <div className="flex items-center gap-2 text-green-700 font-bold mb-4">
                                <CheckCircle2 className="w-5 h-5" /> GOOD: Price as Float/Long
                            </div>
                            <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100 mb-4">
                                <div className="text-zinc-500">// Values: 10.00, 2.00</div>
                                <div className="mt-2 text-zinc-300">Sort: Ascending</div>
                                <div className="mt-2 text-green-400">
                                    1. 2.00<br />
                                    2. 10.00
                                </div>
                            </div>
                            <p className="text-xs text-green-800 font-medium">Result: Correct numeric sorting.</p>
                        </div>
                    </div>
                </div>

                {/* Mistake 4 - Cardinality */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> High Cardinality Warning (User IDs)
                    </h3>
                    <p className="text-sm text-amber-800 mb-4">
                        Aggregating on a high-cardinality <code className="bg-amber-100 px-1 rounded">keyword</code> field (like <span className="font-mono">user_id</span> with 100M values) forces Lucene to build <strong>Global Ordinals</strong>.
                    </p>
                    <div className="bg-white rounded border border-amber-100 p-4 text-xs font-mono text-zinc-600">
                        Memory Cost = 100M values × 8 bytes ≈ 800MB Heap<br />
                        Build Time = 30 seconds (Initial Query Latency Spike)
                    </div>
                    <div className="mt-4 text-sm text-amber-900 font-bold">
                        Fix: Use <span className="font-mono">execution_hint: "map"</span> or Composite Aggregations for high-cardinality fields.
                    </div>
                </div>
            </section>

            {/* 4. Performance Benchmarks */}
            <section className="space-y-8">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Terminal className="w-8 h-8" /> Performance Benchmarks
                    </h2>
                    <p className="text-foreground leading-relaxed">
                        The choice of data type impacts query speed by orders of magnitude.
                        Data based on 1M Documents.
                    </p>

                    <div className="overflow-x-auto rounded-xl border-2 border-border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-muted">
                                    <th className="text-left px-4 py-3 font-bold text-foreground">Query Type</th>
                                    <th className="text-left px-4 py-3 font-bold text-foreground">Field Type</th>
                                    <th className="text-left px-4 py-3 font-bold text-foreground">Latency</th>
                                    <th className="text-left px-4 py-3 font-bold text-foreground">Mechanism</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border bg-white">
                                <tr>
                                    <td className="px-4 py-3 font-medium">Exact Match</td>
                                    <td className="px-4 py-3 text-emerald-700 font-mono">keyword</td>
                                    <td className="px-4 py-3 text-emerald-700 font-bold">2ms</td>
                                    <td className="px-4 py-3 text-zinc-600">Hash Lookup</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">Range (&gt; 100)</td>
                                    <td className="px-4 py-3 text-emerald-700 font-mono">long</td>
                                    <td className="px-4 py-3 text-emerald-700 font-bold">3ms</td>
                                    <td className="px-4 py-3 text-zinc-600">BKD Tree Traversal</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">Range (&gt; "100")</td>
                                    <td className="px-4 py-3 text-red-600 font-mono">keyword</td>
                                    <td className="px-4 py-3 text-red-600 font-bold">50ms</td>
                                    <td className="px-4 py-3 text-zinc-600">Full Index Scan</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">Wildcard (*abc*)</td>
                                    <td className="px-4 py-3 text-red-600 font-mono">text</td>
                                    <td className="px-4 py-3 text-red-600 font-bold">500ms+</td>
                                    <td className="px-4 py-3 text-zinc-600">DFA Pattern Match</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* 5. Decision Matrix */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <LayoutGrid className="w-8 h-8" /> Decision Matrix
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                            <h4 className="font-bold text-violet-900 mb-2">Use TEXT (Analyzed) when:</h4>
                            <ul className="list-disc list-inside text-sm text-zinc-600 space-y-1">
                                <li>Human language (Descriptions, Reviews)</li>
                                <li>Fuzzy matching / Spell correction needed</li>
                                <li>Stemming required (running &rarr; run)</li>
                                <li>Relevance scoring is the priority</li>
                            </ul>
                        </div>
                        <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                            <h4 className="font-bold text-emerald-900 mb-2">Use KEYWORD (Exact) when:</h4>
                            <ul className="list-disc list-inside text-sm text-zinc-600 space-y-1">
                                <li>IDs, SKUs, Codes, Emails</li>
                                <li>Enums (Status: "Active", "Pending")</li>
                                <li>Aggregations (Facets) needed</li>
                                <li>Exact filtering required</li>
                            </ul>
                        </div>
                        <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                            <h4 className="font-bold text-blue-900 mb-2">Use NUMERIC/DATE when:</h4>
                            <ul className="list-disc list-inside text-sm text-zinc-600 space-y-1">
                                <li>Range queries (Price, Age, Date)</li>
                                <li>Sorting by value</li>
                                <li>Math aggregations (Sum, Avg)</li>
                            </ul>
                        </div>
                    </div>

                    {/* Best Practice Code */}
                    <div className="rounded-xl border-2 border-zinc-800 bg-zinc-900 p-6 flex flex-col justify-center">
                        <div className="text-zinc-400 text-xs uppercase tracking-wide font-bold mb-4">
                            🏆 Best Practice: The Multi-Field Pattern
                        </div>
                        <div className="font-mono text-sm text-zinc-100">
                            <pre>{`"title": {
  "type": "text",      // 1. Search (Fuzzy)
  "fields": {
    "raw": { 
      "type": "keyword" // 2. Sort/Aggs
    }
  }
},
"brand": {
  "type": "keyword",   // 1. Filter (Exact)
  "fields": {
    "search": { 
      "type": "text"    // 2. Search
    }
  }
}`}</pre>
                        </div>
                        <p className="text-zinc-500 text-xs mt-4">
                            Most fields need to be capable of both. Don't choose one. Use multi-fields to get the best of both worlds.
                        </p>
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
                        <FileText className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Text is for Search:</strong> Use it when you need partial matches, linguistic intelligence, and relevance scoring.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Binary className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Structured is for Filters:</strong> Use Keyword, Numeric, and Date for binary Yes/No filtering and sorting.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Watch Your IDs:</strong> Never index SKUs or UUIDs as text. It causes false positive matches.</span>
                    </li>
                </ul>
            </section>

            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/data/modeling" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 4.3 Modeling
                </Link>
                <Link href="/search/data/cleaning" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90">
                    Next: Cleaning Data <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
