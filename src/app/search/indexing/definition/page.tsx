import { Database, Search, ArrowRight, ArrowDown, HardDrive, AlertTriangle, CheckCircle2, Layers, Zap } from "lucide-react";
import Link from "next/link";

export default function Definition() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 3.1: Indexing & Infrastructure</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">What is an Index?</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Before a search engine can find anything, it must organize everything. An index is the pre-computed data structure
                    that makes sub-millisecond lookups possible across billions of documents.
                </p>
            </div>

            <hr className="border-border" />

            {/* Precise Definition */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">What Exactly IS an Index?</h2>
                <div className="bg-primary/5 border-2 border-primary p-6 rounded-xl">
                    <p className="text-lg text-foreground font-medium leading-relaxed">
                        An index in a search engine is a <strong>pre-computed data structure</strong> that maps terms to the documents that contain them,
                        enabling distinct lookup and retrieval without scanning every document. It flips the relationship from
                        "Document contains Terms" to "Term is in Documents".
                    </p>
                </div>
            </section>

            {/* Forward vs Inverted */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">Forward vs. Inverted Index</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-zinc-50 p-6 rounded-xl border-2 border-zinc-200">
                        <div className="text-xs font-bold text-zinc-500 uppercase mb-2">Forward Index</div>
                        <div className="text-xl font-bold text-zinc-900 mb-4">Document → Terms</div>
                        <div className="font-mono text-sm space-y-2 text-zinc-700 bg-white p-4 rounded border border-zinc-200">
                            <div>Doc 1: ["apple", "banana"]</div>
                            <div>Doc 2: ["banana", "cherry"]</div>
                        </div>
                        <div className="mt-4 text-xs text-zinc-500">
                            <strong>Good for:</strong> Storage, Retreiving full document content.
                            <br /><strong>Bad for:</strong> "Find docs with apple" (Must scan O(N)).
                        </div>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                        <div className="text-xs font-bold text-blue-500 uppercase mb-2">Inverted Index</div>
                        <div className="text-xl font-bold text-blue-900 mb-4">Term → Documents</div>
                        <div className="font-mono text-sm space-y-2 text-blue-800 bg-white p-4 rounded border border-blue-200">
                            <div>"apple": [Doc 1]</div>
                            <div>"banana": [Doc 1, Doc 2]</div>
                        </div>
                        <div className="mt-4 text-xs text-blue-600 font-bold">
                            Good for: Search (O(1) lookup).
                            <br />This is how search engines work.
                        </div>
                    </div>
                </div>
            </section>

            {/* The Library Metaphor - Visual */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">The Card Catalog Problem</h2>
                <p className="text-lg text-foreground leading-relaxed">
                    To understand the necessity of an index, imagine a library with one million books arranged purely by arrival date.
                    A visitor asks: <em>"Which books mention machine learning?"</em>. Without a lookup system, you would have to walk to the first shelf,
                    open the first book, scan every page for the phrase, and then repeat this process for the remaining 999,999 books.
                    This "linear scan" is how simple system tools like `grep` work, but it is impossible at scale.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Without Index */}
                    <div className="rounded-xl border-2 border-red-500 bg-red-50 p-6">
                        <div className="flex items-center gap-2 text-red-700 font-bold mb-4">
                            <Database className="w-5 h-5" />
                            Without an Index
                        </div>
                        <ul className="space-y-2 text-sm text-red-800">
                            <li>→ Walk to shelf 1, open book 1</li>
                            <li>→ Scan for "machine learning"... not found</li>
                            <li>→ Repeat for 1,000,000 books</li>
                            <li className="font-bold pt-2 text-red-900">Time: Several years of your life</li>
                        </ul>
                    </div>

                    {/* With Index */}
                    <div className="rounded-xl border-2 border-green-500 bg-green-50 p-6">
                        <div className="flex items-center gap-2 text-green-700 font-bold mb-4">
                            <Search className="w-5 h-5" />
                            With an Index
                        </div>
                        <ul className="space-y-2 text-sm text-green-800">
                            <li>→ Open card catalog</li>
                            <li>→ Look up "machine learning"</li>
                            <li>→ Find: Books #4521, #8903, #15234...</li>
                            <li className="font-bold pt-2 text-green-900">Time: 5 minutes</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Core Components & Construction */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">Inside the Black Box: Index Structure</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-foreground">1. Core Components</h3>
                        <p className="text-foreground text-sm">An inverted index consists of two main parts:</p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground">
                            <li><strong>Term Dictionary:</strong> A sorted list of all unique terms (vocabulary) in the corpus.</li>
                            <li><strong>Posting Lists:</strong> For each term, a list of Document IDs that contain it.</li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-foreground">2. Positional Information</h3>
                        <p className="text-foreground text-sm">
                            To support phrase queries (<em>"San Francisco"</em>) and proximity search (<em>"limit" NEAR "speed"</em>), the index stores positions:
                        </p>
                        <div className="bg-zinc-900 rounded p-3 font-mono text-xs text-zinc-100">
                            "limit": [<br />
                            &nbsp;&nbsp;{`{ doc_id: 1, positions: [10, 24] },`}<br />
                            &nbsp;&nbsp;{`{ doc_id: 5, positions: [2] }`}<br />
                            ]
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-100 border border-zinc-200 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-zinc-900 mb-4">How an Index is Built (Construction)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <div className="font-bold text-zinc-700 mb-1">1. Tokenize</div>
                            <div className="text-xs text-zinc-500">Break text into words</div>
                            <div className="mt-2 font-mono text-xs bg-white p-2 border rounded">"Hello World" → ["Hello", "World"]</div>
                        </div>
                        <div>
                            <div className="font-bold text-zinc-700 mb-1">2. Normalize</div>
                            <div className="text-xs text-zinc-500">Lowercase, Stem</div>
                            <div className="mt-2 font-mono text-xs bg-white p-2 border rounded">["hello", "world"]</div>
                        </div>
                        <div>
                            <div className="font-bold text-zinc-700 mb-1">3. Group</div>
                            <div className="text-xs text-zinc-500">Group by Term</div>
                            <div className="mt-2 font-mono text-xs bg-white p-2 border rounded">hello: [doc1], world: [doc1]</div>
                        </div>
                        <div>
                            <div className="font-bold text-zinc-700 mb-1">4. Write</div>
                            <div className="text-xs text-zinc-500">Flush to Disk</div>
                            <div className="mt-2 font-mono text-xs bg-white p-2 border rounded">Immutable Segment</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Fundamental Trade-off */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">The First Law of Search</h2>
                <div className="bg-primary text-primary-foreground p-8 rounded-xl">
                    <p className="text-2xl font-serif italic text-center">
                        "We pay upfront with slower writes and more storage to get faster reads."
                    </p>
                </div>

                <p className="text-foreground leading-relaxed">
                    This performance gain is not a free lunch. We are explicitly trading **write speed** and **storage space** to gain
                    **read speed**. Every time you add a document, the system must spend significant CPU time analyzing the text and
                    updating complex data structures. It also needs to store these structures on disk, often consuming 3-5x more space
                    than the raw data itself. Understanding this "First Law" is critical: search engines are optimized for
                    reading, not writing.
                </p>

                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">Aspect</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Traditional Database</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Search Engine</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <tr className="bg-white">
                                <td className="px-4 py-3 font-medium text-foreground">Write Speed</td>
                                <td className="px-4 py-3 text-green-700 font-semibold">Fast  just append</td>
                                <td className="px-4 py-3 text-amber-700 font-semibold">Slower  must analyze & index</td>
                            </tr>
                            <tr className="bg-white">
                                <td className="px-4 py-3 font-medium text-foreground">Text Search</td>
                                <td className="px-4 py-3 text-red-700 font-bold">5000ms  full table scan</td>
                                <td className="px-4 py-3 text-green-700 font-bold">5ms  index lookup</td>
                            </tr>
                            <tr className="bg-white">
                                <td className="px-4 py-3 font-medium text-foreground">Storage</td>
                                <td className="px-4 py-3 text-foreground">1x  just the data</td>
                                <td className="px-4 py-3 text-amber-700 font-semibold">3-5x  data + index structures</td>
                            </tr>
                            <tr className="bg-white">
                                <td className="px-4 py-3 font-medium text-foreground">Consistency</td>
                                <td className="px-4 py-3 text-green-700 font-semibold">Immediate</td>
                                <td className="px-4 py-3 text-amber-700 font-semibold">Eventually consistent (~1s delay)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* What Happens During Indexing */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">Anatomy of Document Indexing</h2>
                <p className="text-foreground">
                    When you send a JSON document to a search engine, it doesn't simply store the file like a database or file system.
                    Instead, it deconstructs the document field by field. It analyzes text, extracts numbers, and simultaneously
                    routes different data types into specialized data structures. This process transforms a single "document" into
                    entries across an Inverted Index (for text), BKD Trees (for numbers), and Columnar Stores (for sorting).
                </p>

                {/* Architecture Diagram */}
                <div className="bg-zinc-900 rounded-xl p-8 overflow-x-auto">
                    <div className="min-w-[600px] flex flex-col items-center gap-4">
                        {/* Input Document */}
                        <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-4 shadow-sm w-80">
                            <div className="text-xs font-bold text-zinc-400 uppercase mb-2">Input Document</div>
                            <pre className="text-sm font-mono text-zinc-100">{`{
  "title": "MacBook Pro M3",
  "price": 2499.99,
  "category": "laptops"
}`}</pre>
                        </div>

                        <ArrowDown className="w-6 h-6 text-zinc-500" />

                        {/* Analysis Pipeline */}
                        <div className="bg-blue-900 rounded-lg border border-blue-700 p-4 w-80">
                            <div className="text-xs font-bold text-blue-300 uppercase mb-2">Analysis Pipeline</div>
                            <div className="text-sm text-blue-100 font-mono">
                                "MacBook Pro M3" → ["macbook", "pro", "m3"]
                            </div>
                        </div>

                        <ArrowDown className="w-6 h-6 text-zinc-500" />

                        {/* Multiple Data Structures */}
                        <div className="grid grid-cols-4 gap-3 w-full max-w-2xl">
                            <div className="bg-violet-900 rounded-lg border border-violet-700 p-3">
                                <div className="text-[10px] font-bold text-violet-200 uppercase">Inverted Index</div>
                                <div className="text-[10px] text-violet-300 mt-1">Text Search</div>
                            </div>
                            <div className="bg-emerald-900 rounded-lg border border-emerald-700 p-3">
                                <div className="text-[10px] font-bold text-emerald-200 uppercase">BKD Tree</div>
                                <div className="text-[10px] text-emerald-300 mt-1">Range Queries</div>
                            </div>
                            <div className="bg-orange-900 rounded-lg border border-orange-700 p-3">
                                <div className="text-[10px] font-bold text-orange-200 uppercase">DocValues</div>
                                <div className="text-[10px] text-orange-300 mt-1">Sorting</div>
                            </div>
                            <div className="bg-rose-900 rounded-lg border border-rose-700 p-3">
                                <div className="text-[10px] font-bold text-rose-200 uppercase">Stored Fields</div>
                                <div className="text-[10px] text-rose-300 mt-1">Retrieval</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Write Amplification */}
                <div className="bg-amber-100 border-2 border-amber-500 p-5 rounded-xl">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-amber-900">Write Amplification</h4>
                            <p className="text-sm text-amber-800 mt-1">
                                A single document insert triggers approximately <strong>20 internal operations</strong>:
                                term dictionary updates, posting list appends, BKD tree insertions, and translog writes.
                                This operational overhead is the cost of sub-millisecond read performance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Index Hierarchy Architecture */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">The Index Hierarchy</h2>
                <p className="text-foreground">
                    A search "index" is not a single fileit's a distributed hierarchy designed for horizontal scaling and fault tolerance.
                </p>

                {/* Architecture Diagram */}
                <div className="bg-zinc-900 rounded-xl p-8 overflow-x-auto">
                    <div className="min-w-[500px] flex flex-col items-center gap-6">
                        {/* Index Level */}
                        <div className="bg-zinc-100 border-2 border-zinc-400 rounded-xl px-8 py-4 text-center">
                            <div className="font-bold text-lg text-zinc-900">INDEX: "products"</div>
                            <div className="text-xs text-zinc-600 mt-1">Logical Namespace</div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <div className="w-16 h-px bg-zinc-600"></div>
                            <code className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded">hash(doc_id) % N</code>
                            <div className="w-16 h-px bg-zinc-600"></div>
                        </div>

                        {/* Shards */}
                        <div className="grid grid-cols-3 gap-6">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="flex flex-col items-center gap-3">
                                    <div className="bg-blue-800 border border-blue-600 rounded-lg p-4 w-full text-center">
                                        <div className="font-bold text-blue-100">Shard {i}</div>
                                        <div className="text-xs text-blue-300">Primary</div>
                                    </div>
                                    <div className="w-px h-4 bg-zinc-600"></div>
                                    <div className="bg-zinc-800 border border-dashed border-zinc-600 rounded-lg p-3 w-full text-center">
                                        <div className="text-xs font-bold text-zinc-400">Replica</div>
                                    </div>
                                    <div className="flex gap-1 mt-2">
                                        <div className="h-1.5 w-6 bg-emerald-500 rounded-full"></div>
                                        <div className="h-1.5 w-4 bg-emerald-500 rounded-full"></div>
                                        <div className="h-1.5 w-3 bg-emerald-500 rounded-full"></div>
                                    </div>
                                    <div className="text-[10px] text-zinc-400">Segments</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Hierarchy Rules */}
                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">Level</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Purpose</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Changeable?</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <tr className="bg-white">
                                <td className="px-4 py-3 font-medium text-foreground">Index</td>
                                <td className="px-4 py-3 text-foreground">Logical namespace for querying</td>
                                <td className="px-4 py-3 text-foreground">Settings only</td>
                            </tr>
                            <tr className="bg-red-50">
                                <td className="px-4 py-3 font-medium text-foreground">Shards</td>
                                <td className="px-4 py-3 text-foreground">Horizontal partitioning</td>
                                <td className="px-4 py-3 text-red-700 font-bold">NO  fixed at creation</td>
                            </tr>
                            <tr className="bg-white">
                                <td className="px-4 py-3 font-medium text-foreground">Replicas</td>
                                <td className="px-4 py-3 text-foreground">Fault tolerance & read throughput</td>
                                <td className="px-4 py-3 text-green-700 font-bold">Yes, anytime</td>
                            </tr>
                            <tr className="bg-white">
                                <td className="px-4 py-3 font-medium text-foreground">Segments</td>
                                <td className="px-4 py-3 text-foreground">Immutable storage units</td>
                                <td className="px-4 py-3 text-muted-foreground">Automatic</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Creating an Index - Code */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Creating an Index in Elasticsearch</h2>
                <p className="text-foreground leading-relaxed">
                    Now that we understand the theory, what does this look like in practice? When you create an index,
                    you define its settings (infrastructure) and mappings (data structure). This is a one-time setup
                    decision that is expensive to change later.
                </p>

                <div className="rounded-xl overflow-hidden border-2 border-zinc-300">
                    <div className="bg-zinc-200 px-4 py-2 text-sm font-mono text-zinc-700 border-b border-zinc-300">
                        PUT /products
                    </div>
                    <pre className="bg-zinc-900 text-zinc-100 p-4 text-sm font-mono overflow-x-auto">
                        {`{
  "settings": {
    `}<span className="text-amber-400">"number_of_shards"</span>{`: 3,         `}<span className="text-zinc-500">// Fixed at creation!</span>{`
    `}<span className="text-amber-400">"number_of_replicas"</span>{`: 1,       `}<span className="text-zinc-500">// Can change later</span>{`
    `}<span className="text-amber-400">"refresh_interval"</span>{`: "1s"       `}<span className="text-zinc-500">// Near-realtime latency</span>{`
  },
  "mappings": {
    "properties": {
      `}<span className="text-amber-400">"title"</span>{`:      { "type": `}<span className="text-green-400">"text"</span>{`, "analyzer": "english" },
      `}<span className="text-amber-400">"price"</span>{`:      { "type": `}<span className="text-green-400">"float"</span>{` },
      `}<span className="text-amber-400">"category"</span>{`:   { "type": `}<span className="text-green-400">"keyword"</span>{` },
      `}<span className="text-amber-400">"created_at"</span>{`: { "type": `}<span className="text-green-400">"date"</span>{` }
    }
  }
}`}</pre>
                </div>

                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">Setting</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">What It Does</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Guidance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                            <tr>
                                <td className="px-4 py-3 font-mono text-xs text-foreground">number_of_shards: 3</td>
                                <td className="px-4 py-3 text-foreground">Splits data into 3 partitions</td>
                                <td className="px-4 py-3 text-muted-foreground">Target 20-50GB per shard</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-xs text-foreground">number_of_replicas: 1</td>
                                <td className="px-4 py-3 text-foreground">1 backup copy per shard</td>
                                <td className="px-4 py-3 text-muted-foreground">0 for dev, 1+ for prod</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-xs text-foreground">type: "text"</td>
                                <td className="px-4 py-3 text-foreground">Full-text searchable</td>
                                <td className="px-4 py-3 text-muted-foreground">Natural language content</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-xs text-foreground">type: "keyword"</td>
                                <td className="px-4 py-3 text-foreground">Exact matches only</td>
                                <td className="px-4 py-3 text-muted-foreground">IDs, categories, tags</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Sizing Guide */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Capacity Planning Reference</h2>
                <p className="text-foreground leading-relaxed">
                    How big will your index be? As a rule of thumb, the index takes up 3-5x the raw storage space of
                    your data due to the multiple data structures (Inverted Index, BKD Trees, DocValues, Stored Fields)
                    maintained for each document.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="rounded-xl border-2 border-border p-6 bg-white">
                        <div className="text-muted-foreground text-sm">Startup</div>
                        <div className="text-4xl font-bold text-foreground mt-1">100K</div>
                        <div className="mt-4 space-y-1 text-sm text-foreground">
                            <div>Raw: 200MB → Index: ~600MB</div>
                            <div>Shards: 1</div>
                            <div>Nodes: Single instance</div>
                        </div>
                    </div>
                    <div className="rounded-xl border-2 border-primary p-6 bg-primary/5">
                        <div className="text-muted-foreground text-sm">Growth Stage</div>
                        <div className="text-4xl font-bold text-foreground mt-1">10M</div>
                        <div className="mt-4 space-y-1 text-sm text-foreground">
                            <div>Raw: 20GB → Index: ~60GB</div>
                            <div>Shards: 2-3</div>
                            <div>Nodes: 3 (for HA)</div>
                        </div>
                    </div>
                    <div className="rounded-xl border-2 border-border p-6 bg-white">
                        <div className="text-muted-foreground text-sm">Enterprise</div>
                        <div className="text-4xl font-bold text-foreground mt-1">500M</div>
                        <div className="mt-4 space-y-1 text-sm text-foreground">
                            <div>Raw: 1TB → Index: ~3TB</div>
                            <div>Shards: 60-100</div>
                            <div>Nodes: 15-20 (multi-AZ)</div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900 p-4 rounded-xl text-center">
                    <div className="text-sm text-zinc-400">The Sizing Formula</div>
                    <div className="font-mono text-lg font-bold text-zinc-100 mt-1">Optimal Shards = Total Index Size ÷ 30GB</div>
                </div>
            </section>

            {/* When to Use What - Decision Guide */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">When to Use What: Decision Guide</h2>
                <p className="text-foreground">
                    Each indexing structure solves a different problem. Here's how to choose the right tool for your query patterns.
                </p>

                {/* Index Type Decision Table */}
                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">Query Pattern</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Use This</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Why</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                            <tr>
                                <td className="px-4 py-3 text-foreground">"wireless keyboard"</td>
                                <td className="px-4 py-3 font-bold text-violet-700">Inverted Index</td>
                                <td className="px-4 py-3 text-muted-foreground">Full-text search, tokenization, relevance</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-foreground">price &gt; 100 AND price &lt; 500</td>
                                <td className="px-4 py-3 font-bold text-emerald-700">BKD Tree</td>
                                <td className="px-4 py-3 text-muted-foreground">O(log N) range queries on numbers/dates</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-foreground">Sort by price ASC</td>
                                <td className="px-4 py-3 font-bold text-orange-700">DocValues</td>
                                <td className="px-4 py-3 text-muted-foreground">Column-oriented storage for fast sorting</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-foreground">Count by category</td>
                                <td className="px-4 py-3 font-bold text-orange-700">DocValues</td>
                                <td className="px-4 py-3 text-muted-foreground">Aggregations need doc → value lookups</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-foreground">"affordable laptop" (semantic)</td>
                                <td className="px-4 py-3 font-bold text-blue-700">Vector Index (HNSW)</td>
                                <td className="px-4 py-3 text-muted-foreground">Meaning-based matching, not keywords</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-foreground">Within 5km of location</td>
                                <td className="px-4 py-3 font-bold text-emerald-700">BKD Tree (2D)</td>
                                <td className="px-4 py-3 text-muted-foreground">geo_point uses 2D BKD internally</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-foreground">category = "laptops" (exact)</td>
                                <td className="px-4 py-3 font-bold text-violet-700">keyword type</td>
                                <td className="px-4 py-3 text-muted-foreground">Not analyzed, exact match, aggregatable</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Field Type Decision Guide */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-xl border-2 border-violet-300 bg-violet-50 p-5">
                        <h4 className="font-bold text-violet-800 mb-3">Use type: "text" when:</h4>
                        <ul className="text-sm text-violet-900 space-y-2">
                            <li>• Users search with natural language</li>
                            <li>• You need relevance ranking (BM25)</li>
                            <li>• Content varies in length (descriptions, titles)</li>
                            <li>• Stemming/synonyms are helpful</li>
                        </ul>
                    </div>

                    <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5">
                        <h4 className="font-bold text-emerald-800 mb-3">Use type: "keyword" when:</h4>
                        <ul className="text-sm text-emerald-900 space-y-2">
                            <li>• Exact matches only (IDs, emails, SKUs)</li>
                            <li>• Used in filters or aggregations</li>
                            <li>• Case-sensitive matching needed</li>
                            <li>• Low cardinality (categories, status)</li>
                        </ul>
                    </div>
                </div>

                {/* Hybrid Approach */}
                <div className="bg-blue-50 border-2 border-blue-300 p-5 rounded-xl">
                    <h4 className="font-bold text-blue-800 mb-3">The Power of Hybrid: text + keyword subfield</h4>
                    <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100">
                        <div className="text-zinc-400">// Best of both worlds</div>
                        <div>{`"title": {`}</div>
                        <div className="pl-2">{`"type": `}<span className="text-green-400">"text"</span>{`, `}<span className="text-zinc-500">// For full-text search</span></div>
                        <div className="pl-2">{`"fields": {`}</div>
                        <div className="pl-4">{`"raw": { "type": `}<span className="text-green-400">"keyword"</span>{` } `}<span className="text-zinc-500">// For exact match & aggs</span></div>
                        <div className="pl-2">{`}`}</div>
                        <div>{`}`}</div>
                    </div>
                    <p className="text-sm text-blue-800 mt-3">
                        Search on <code className="bg-blue-100 px-1 rounded">title</code>, aggregate on <code className="bg-blue-100 px-1 rounded">title.raw</code>.
                    </p>
                </div>

                {/* When to Use Vectors */}
                <div className="rounded-xl border-2 border-blue-300 bg-white p-6">
                    <h4 className="font-bold text-foreground mb-4">When to Add Vector Search</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="rounded-lg border border-green-300 bg-green-50 p-3">
                            <div className="font-bold text-green-800 text-sm mb-2">✓ Good Fit</div>
                            <ul className="text-xs text-green-900 space-y-1">
                                <li>• Users search with synonyms ("cheap" vs "affordable")</li>
                                <li>• Long-tail queries with zero keyword matches</li>
                                <li>• Similar item recommendations</li>
                                <li>• FAQ/support article search</li>
                            </ul>
                        </div>
                        <div className="rounded-lg border border-red-300 bg-red-50 p-3">
                            <div className="font-bold text-red-800 text-sm mb-2">✗ Not Needed</div>
                            <ul className="text-xs text-red-900 space-y-1">
                                <li>• Exact product model search ("iPhone 15 Pro")</li>
                                <li>• SKU or ID lookups</li>
                                <li>• Structured filters only (price, color)</li>
                                <li>• Small corpus with good keyword coverage</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Real World Use Cases */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Indexes Beyond Search Engines</h2>
                <p className="text-foreground">Inverted indexes aren't just for Google or Elasticsearch. They power:</p>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-zinc-50 p-4 rounded-xl border-2 border-zinc-200">
                        <div className="font-bold text-zinc-900 mb-1">Databases (Postgres GIN)</div>
                        <div className="text-xs text-zinc-600">PostgreSQL uses GIN (Generalized Inverted Index) for JSONB and text search.</div>
                    </div>
                    <div className="bg-zinc-50 p-4 rounded-xl border-2 border-zinc-200">
                        <div className="font-bold text-zinc-900 mb-1">Log Analytics</div>
                        <div className="text-xs text-zinc-600">Splunk and Datadog use inverted indexes to find error logs instantly.</div>
                    </div>
                    <div className="bg-zinc-50 p-4 rounded-xl border-2 border-zinc-200">
                        <div className="font-bold text-zinc-900 mb-1">E-Commerce Filters</div>
                        <div className="text-xs text-zinc-600">Facet counts on sidebars are powered by inverted index aggregations.</div>
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
                        <Zap className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>An index trades write performance and storage for O(1) read performance on text.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Layers className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>The hierarchy is Index → Shards → Replicas → Segments. Shard count cannot change.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <HardDrive className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>Target 20-50GB per shard. Plan capacity before you create the index.</span>
                    </li>
                </ul>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/query-understanding/ambiguity" className="text-sm font-medium text-muted-foreground hover:text-primary">
                    ← 2.7 Ambiguity
                </Link>
                <Link href="/search/indexing/inverted-index" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Next: The Inverted Index <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
