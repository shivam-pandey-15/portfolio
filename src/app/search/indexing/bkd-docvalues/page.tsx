import { ArrowRight, Binary, Map as MapIcon, Database, AlertTriangle, CheckCircle2, MapPin, Table2 } from "lucide-react";
import Link from "next/link";

export default function BKDDocValues() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 3.3: Indexing & Infrastructure</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">BKD Trees & DocValues</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    The inverted index excels at text, but struggles with numbers. Range queries, sorting, and aggregations
                    require specialized data structures: BKD Trees and DocValues.
                </p>
            </div>

            <hr className="border-border" />

            {/* The Problem */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">Why Inverted Index Fails for Range Queries</h2>
                <p className="text-foreground leading-relaxed">
                    To find products priced between $100 and $200, an inverted index would need to look up every
                    possible price: "100", "100.01", "100.02"... That's potentially thousands of separate lookups.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="rounded-xl border-2 border-red-500 bg-red-50 p-6">
                        <div className="flex items-center gap-2 text-red-700 font-bold mb-4">
                            <Binary className="w-5 h-5" />
                            Inverted Index for Numbers
                        </div>
                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm text-zinc-100 space-y-1">
                            <div className="text-zinc-400">Query: price &gt; 100</div>
                            <div className="mt-2">1. Lookup "101" → [Doc1]</div>
                            <div>2. Lookup "102" → [Doc5]</div>
                            <div>3. Lookup "103" → [Doc2]</div>
                            <div className="text-zinc-500">...</div>
                            <div className="text-red-400 font-bold">990,000 lookups later...</div>
                        </div>
                        <div className="mt-4 font-bold text-red-800">Complexity: O(Range Size) ❌</div>
                    </div>

                    <div className="rounded-xl border-2 border-green-500 bg-green-50 p-6">
                        <div className="flex items-center gap-2 text-green-700 font-bold mb-4">
                            <MapIcon className="w-5 h-5" />
                            BKD Tree Approach
                        </div>
                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm text-zinc-100 space-y-1">
                            <div className="text-zinc-400">Query: price &gt; 100</div>
                            <div className="mt-2">1. Navigate to root</div>
                            <div>2. Follow branch "&gt;100"</div>
                            <div>3. Scan matching leaf blocks</div>
                        </div>
                        <div className="mt-4 font-bold text-green-800">Complexity: O(log N) ✅</div>
                    </div>
                </div>
            </section>

            {/* BKD Tree Visualization */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">How BKD Trees Work</h2>
                <p className="text-foreground">
                    A BKD tree recursively partitions numeric space. Think of it like repeatedly cutting a number line
                    in half until you isolate the range you need.
                </p>

                <div className="bg-zinc-900 rounded-xl p-8 overflow-x-auto">
                    <div className="min-w-[500px] flex flex-col items-center gap-4">
                        {/* Root */}
                        <div className="bg-zinc-100 border-2 border-zinc-400 rounded-lg px-6 py-3 text-center">
                            <div className="font-bold text-zinc-900">All Products ($0 - $500)</div>
                        </div>

                        <div className="w-px h-6 bg-zinc-600"></div>

                        {/* Level 1 */}
                        <div className="grid grid-cols-2 gap-16 relative">
                            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-zinc-600"></div>

                            <div className="flex flex-col items-center gap-2">
                                <div className="w-px h-4 bg-zinc-600"></div>
                                <div className="bg-zinc-700 border border-zinc-500 rounded-lg px-4 py-2 text-center">
                                    <div className="text-zinc-200 font-bold">$0 - $200</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="bg-zinc-800 border border-zinc-600 px-2 py-1 rounded text-xs text-zinc-300 text-center">$0-$100</div>
                                    <div className="bg-zinc-800 border border-zinc-600 px-2 py-1 rounded text-xs text-zinc-300 text-center">$100-$200</div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <div className="w-px h-4 bg-zinc-600"></div>
                                <div className="bg-green-700 border-2 border-green-400 rounded-lg px-4 py-2 text-center ring-2 ring-green-400 ring-offset-2 ring-offset-zinc-900">
                                    <div className="text-green-100 font-bold">$200 - $500 ✓</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="bg-green-800 border border-green-600 px-2 py-1 rounded text-xs text-green-200 text-center font-bold">$200-$350</div>
                                    <div className="bg-green-800 border border-green-600 px-2 py-1 rounded text-xs text-green-200 text-center font-bold">$350-$500</div>
                                </div>
                            </div>
                        </div>

                        <div className="text-zinc-400 text-sm text-center mt-4">
                            For query <code className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-200">price &gt; 200</code>,
                            the engine skips the entire left branch ($0-$200).
                        </div>
                    </div>
                </div>
            </section>

            {/* Performance Comparison */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Performance: The Numbers</h2>
                <p className="text-muted-foreground">Dataset: 100 million products with a price field</p>

                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">Query</th>
                                <th className="text-left px-4 py-3 font-bold text-red-700">Inverted Index</th>
                                <th className="text-left px-4 py-3 font-bold text-green-700">BKD Tree</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                            <tr>
                                <td className="px-4 py-3 font-mono text-xs text-foreground">price = 100</td>
                                <td className="px-4 py-3 text-foreground">5ms</td>
                                <td className="px-4 py-3 text-green-700 font-bold">2ms</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-xs text-foreground">price &gt; 100</td>
                                <td className="px-4 py-3 text-red-700 font-bold">5000ms (!)</td>
                                <td className="px-4 py-3 text-green-700 font-bold">10ms</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-xs text-foreground">price BETWEEN 100 AND 200</td>
                                <td className="px-4 py-3 text-red-700">500ms</td>
                                <td className="px-4 py-3 text-green-700 font-bold">5ms</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-xs text-foreground">price BETWEEN 100 AND 100000</td>
                                <td className="px-4 py-3 text-red-700 font-bold">Timeout</td>
                                <td className="px-4 py-3 text-green-700 font-bold">15ms</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* DocValues */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">DocValues: Columnar Storage for Sorting</h2>
                <p className="text-foreground leading-relaxed">
                    The inverted index answers "which documents contain term X?" But for sorting, we need the opposite:
                    "what is the value of field Y for document Z?" DocValues provide this reverse lookup efficiently.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="rounded-xl border-2 border-red-300 bg-red-50 p-6">
                        <h4 className="font-bold text-red-800 mb-3">Without DocValues (Slow)</h4>
                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100 space-y-1">
                            <div className="text-zinc-400">// Sort by price - parse each JSON</div>
                            <div>doc1 → parse {`{"title":"..", "price":2499}`}</div>
                            <div>doc2 → parse {`{"title":"..", "price":1299}`}</div>
                            <div>doc3 → parse {`{"title":"..", "price":1899}`}</div>
                            <div className="text-red-400 mt-2">10,000 JSON parses = 500ms</div>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-green-300 bg-green-50 p-6">
                        <h4 className="font-bold text-green-800 mb-3">With DocValues (Fast)</h4>
                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100 space-y-1">
                            <div className="text-zinc-400">// Pre-computed column of prices</div>
                            <div className="text-green-400">price_col: [2499, 1299, 1899, ...]</div>
                            <div className="mt-2 text-zinc-300">Just array index lookups!</div>
                            <div className="text-green-400 mt-2">10,000 lookups = 5ms</div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900 rounded-xl p-6">
                    <div className="text-zinc-400 text-sm mb-4">Row Store vs Column Store</div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <div className="text-xs font-bold text-zinc-500 uppercase mb-2">Row-Oriented (JSON _source)</div>
                            <div className="space-y-1 font-mono text-sm">
                                <div className="text-zinc-400">doc1: {`{title:"Mac", price:2499, stock:50}`}</div>
                                <div className="text-zinc-400">doc2: {`{title:"Dell", price:1299, stock:120}`}</div>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-blue-400 uppercase mb-2">Column-Oriented (DocValues)</div>
                            <div className="space-y-1 font-mono text-sm">
                                <div className="text-blue-300">price_col:  [2499, 1299, ...]</div>
                                <div className="text-zinc-500">title_col:  ["Mac", "Dell", ...]</div>
                                <div className="text-zinc-500">stock_col:  [50, 120, ...]</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Global Ordinals Warning */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Global Ordinals: The Memory Trap</h2>
                <p className="text-foreground">
                    For string aggregations, Elasticsearch converts strings to integers called "ordinals" for fast comparison.
                    This mapping is held in heap memory.
                </p>

                <div className="bg-amber-100 border-2 border-amber-500 p-5 rounded-xl">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-amber-900">Heap Memory Warning</h4>
                            <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm text-zinc-100 mt-3">
                                <div className="text-zinc-400">// 10,000 unique brands</div>
                                <div>10,000 × 30 bytes = <span className="text-green-400">300 KB</span> (Fine)</div>
                                <div className="mt-2 text-zinc-400">// 100 million unique user_ids</div>
                                <div>100M × 36 bytes = <span className="text-red-400 font-bold">3.6 GB of HEAP!</span></div>
                            </div>
                            <p className="text-sm text-amber-800 mt-3">
                                High-cardinality string aggregations can crash your cluster.
                                Use <code className="bg-amber-200 px-1 rounded">composite</code> aggregation for pagination or avoid aggregating on unique fields.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mapping Configuration */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Elasticsearch Field Type Reference</h2>

                <div className="rounded-xl overflow-hidden border-2 border-zinc-300">
                    <div className="bg-zinc-200 px-4 py-2 text-sm font-mono text-zinc-700 border-b border-zinc-300">
                        Index Mapping
                    </div>
                    <pre className="bg-zinc-900 text-zinc-100 p-4 text-sm font-mono overflow-x-auto">
                        {`{
  "mappings": {
    "properties": {
      `}<span className="text-amber-400">"title"</span>{`:      { "type": `}<span className="text-green-400">"text"</span>{`, "analyzer": "english" },
      `}<span className="text-amber-400">"category"</span>{`:   { "type": `}<span className="text-green-400">"keyword"</span>{` },  `}<span className="text-zinc-500">// Exact match, aggs</span>{`
      `}<span className="text-amber-400">"price"</span>{`:      { "type": `}<span className="text-green-400">"scaled_float"</span>{`, "scaling_factor": 100 },
      `}<span className="text-amber-400">"quantity"</span>{`:   { "type": `}<span className="text-green-400">"integer"</span>{` },
      `}<span className="text-amber-400">"location"</span>{`:   { "type": `}<span className="text-green-400">"geo_point"</span>{` }  `}<span className="text-zinc-500">// 2D BKD tree</span>{`
    }
  }
}`}</pre>
                </div>

                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">Type</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Bytes</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Use For</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                            <tr><td className="px-4 py-2 font-mono text-foreground">byte</td><td className="px-4 py-2 text-foreground">1</td><td className="px-4 py-2 text-foreground">Small enums (0-127)</td></tr>
                            <tr><td className="px-4 py-2 font-mono text-foreground">integer</td><td className="px-4 py-2 text-foreground">4</td><td className="px-4 py-2 text-foreground">Counts, quantities</td></tr>
                            <tr><td className="px-4 py-2 font-mono text-foreground">long</td><td className="px-4 py-2 text-foreground">8</td><td className="px-4 py-2 text-foreground">Timestamps, big IDs</td></tr>
                            <tr><td className="px-4 py-2 font-mono text-foreground">float</td><td className="px-4 py-2 text-foreground">4</td><td className="px-4 py-2 text-amber-700">Prices (has rounding errors!)</td></tr>
                            <tr className="bg-green-50"><td className="px-4 py-2 font-mono text-green-800 font-bold">scaled_float</td><td className="px-4 py-2 text-green-800">4</td><td className="px-4 py-2 text-green-800 font-bold">Money — no rounding!</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* Pro tip for money */}
                <div className="bg-green-50 border-2 border-green-300 p-4 rounded-xl">
                    <div className="font-bold text-green-800 mb-2">Pro Tip: Use scaled_float for Money</div>
                    <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100">
                        <div className="text-red-400">// BAD: Float has precision issues</div>
                        <div className="text-red-400">// 19.99 might become 19.989999771118164</div>
                        <div className="mt-3 text-green-400">// GOOD: Scaled float</div>
                        <div>{`"price": { "type": "scaled_float", "scaling_factor": 100 }`}</div>
                        <div className="text-zinc-400">// 19.99 stored as 1999 (integer), no precision loss</div>
                    </div>
                </div>
            </section>

            {/* Disabling DocValues */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Disabling DocValues (Space Optimization)</h2>
                <p className="text-foreground">
                    DocValues consume significant storage. If you never sort or aggregate on a field, you can disable them to save 30-50% storage.
                </p>

                <div className="rounded-xl overflow-hidden border-2 border-zinc-300">
                    <div className="bg-zinc-200 px-4 py-2 text-sm font-mono text-zinc-700 border-b border-zinc-300">
                        Disable DocValues for text you won't sort
                    </div>
                    <pre className="bg-zinc-900 text-zinc-100 p-4 text-sm font-mono overflow-x-auto">
                        {`{
  "mappings": {
    "properties": {
      `}<span className="text-amber-400">"description"</span>{`: {
        "type": `}<span className="text-green-400">"text"</span>{`,
        `}<span className="text-red-400">"doc_values": false</span>{`  `}<span className="text-zinc-500">// Can't sort/aggregate</span>{`
      }
    }
  }
}`}</pre>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-xl border-2 border-green-300 bg-green-50 p-4">
                        <h4 className="font-bold text-green-800 mb-2">When to Disable</h4>
                        <ul className="text-sm text-green-900 space-y-1">
                            <li>• Text fields you'll NEVER sort on</li>
                            <li>• Fields never used in aggregations</li>
                            <li>• Saves ~30-50% storage per field</li>
                        </ul>
                    </div>
                    <div className="rounded-xl border-2 border-red-300 bg-red-50 p-4">
                        <h4 className="font-bold text-red-800 mb-2">When NOT to Disable</h4>
                        <ul className="text-sm text-red-900 space-y-1">
                            <li>• Any field used in sorting</li>
                            <li>• Fields used in aggregations</li>
                            <li>• Fields used in script scoring</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Geo Queries */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <MapPin className="w-8 h-8" />
                    Geo Queries (BKD in 2D)
                </h2>
                <p className="text-foreground">
                    Geographic data is stored as a 2D BKD tree, enabling efficient location-based queries.
                </p>

                {/* Geo Point Mapping */}
                <div className="rounded-xl overflow-hidden border-2 border-zinc-300">
                    <div className="bg-zinc-200 px-4 py-2 text-sm font-mono text-zinc-700 border-b border-zinc-300">
                        Geo Point Index & Document
                    </div>
                    <pre className="bg-zinc-900 text-zinc-100 p-4 text-sm font-mono overflow-x-auto">
                        {`// Mapping
{ "location": { "type": `}<span className="text-green-400">"geo_point"</span>{` } }

// Document
{
  "name": "Starbucks",
  "location": { `}<span className="text-amber-400">"lat"</span>{`: 37.7749, `}<span className="text-amber-400">"lon"</span>{`: -122.4194 }
}`}</pre>
                </div>

                {/* 2D BKD Visualization */}
                <div className="bg-zinc-900 rounded-xl p-6">
                    <div className="text-zinc-400 text-sm mb-4">2D BKD Tree: Lat/Lon Space Partitioning</div>
                    <div className="grid grid-cols-2 grid-rows-2 gap-1 w-64 h-48 mx-auto">
                        <div className="bg-blue-800 border border-blue-600 rounded flex items-center justify-center text-blue-200 text-xs font-bold">
                            San Francisco
                        </div>
                        <div className="bg-zinc-700 border border-zinc-600 rounded flex items-center justify-center text-zinc-300 text-xs">
                            East Bay
                        </div>
                        <div className="bg-zinc-700 border border-zinc-600 rounded flex items-center justify-center text-zinc-300 text-xs">
                            South Bay
                        </div>
                        <div className="bg-zinc-700 border border-zinc-600 rounded flex items-center justify-center text-zinc-300 text-xs">
                            Mountains
                        </div>
                    </div>
                    <p className="text-center text-zinc-400 text-sm mt-4">
                        Geographic space split recursively like a quadtree
                    </p>
                </div>

                {/* Query Types */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-xl border-2 border-border bg-white p-6">
                        <h4 className="font-bold text-foreground mb-3">Distance Query: "Within 5km"</h4>
                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100">
                            <div>{`{`}</div>
                            <div className="pl-2">{`"geo_distance": {`}</div>
                            <div className="pl-4"><span className="text-amber-400">"distance"</span>: <span className="text-green-400">"5km"</span>,</div>
                            <div className="pl-4"><span className="text-amber-400">"location"</span>: {'{'} lat: 37.77, lon: -122.41 {'}'}</div>
                            <div className="pl-2">{`}`}</div>
                            <div>{`}`}</div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-3">
                            <strong>Execution:</strong> BKD finds bounding box, then calculates exact distances.
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-border bg-white p-6">
                        <h4 className="font-bold text-foreground mb-3">Bounding Box Query</h4>
                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100">
                            <div>{`{`}</div>
                            <div className="pl-2">{`"geo_bounding_box": {`}</div>
                            <div className="pl-4"><span className="text-amber-400">"location"</span>: {'{'}</div>
                            <div className="pl-6">"top_left": {'{'} lat: 38, lon: -123 {'}'},</div>
                            <div className="pl-6">"bottom_right": {'{'} lat: 37.5, lon: -122 {'}'}</div>
                            <div className="pl-4">{'}'}</div>
                            <div className="pl-2">{`}`}</div>
                            <div>{`}`}</div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-3">
                            <strong>Execution:</strong> Direct BKD tree traversal. Very fast!
                        </div>
                    </div>
                </div>
            </section>

            {/* Storage Efficiency */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Storage & Memory Benchmarks</h2>
                <p className="text-muted-foreground">Dataset: 100 million documents</p>

                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">Operation</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                            <tr><td className="px-4 py-2 text-foreground">BKD range query (price 100-200)</td><td className="px-4 py-2 text-green-700 font-bold">5ms</td></tr>
                            <tr><td className="px-4 py-2 text-foreground">DocValues sort (by price)</td><td className="px-4 py-2 text-foreground">50ms</td></tr>
                            <tr><td className="px-4 py-2 text-foreground">Aggregation (avg price)</td><td className="px-4 py-2 text-foreground">100ms</td></tr>
                            <tr><td className="px-4 py-2 text-foreground">Geo distance (within 5km)</td><td className="px-4 py-2 text-foreground">30ms</td></tr>
                            <tr><td className="px-4 py-2 text-foreground">Geo bounding box</td><td className="px-4 py-2 text-green-700 font-bold">10ms</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-zinc-900 rounded-xl p-6">
                    <div className="text-zinc-400 text-sm mb-4">Memory Usage Comparison (100M docs)</div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <div className="text-xs font-bold text-blue-400 uppercase mb-2">Numeric Field</div>
                            <div className="font-mono text-sm text-zinc-100 space-y-1">
                                <div>BKD tree: <span className="text-green-400">~50 MB</span></div>
                                <div>DocValues: <span className="text-amber-400">~400 MB</span></div>
                                <div className="border-t border-zinc-700 pt-1 mt-1">Total: ~450 MB</div>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-red-400 uppercase mb-2">Text Field (for comparison)</div>
                            <div className="font-mono text-sm text-zinc-100 space-y-1">
                                <div>Inverted index: <span className="text-red-400">~2 GB</span></div>
                                <div className="text-zinc-500">(DocValues not supported for analyzed text)</div>
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
                        <MapIcon className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>BKD trees</strong> enable O(log N) range queries on numeric, date, and geo fields.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Table2 className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>DocValues</strong> store data column-wise for fast sorting and aggregations.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Database className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>Use <strong>scaled_float for money</strong> to avoid precision issues.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>Watch for <strong>high-cardinality aggregations</strong> — they consume heap memory via global ordinals.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Disable DocValues</strong> on fields you never sort/aggregate to save 30-50% storage.</span>
                    </li>
                </ul>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/indexing/inverted-index" className="text-sm font-medium text-muted-foreground hover:text-primary">
                    ← 3.2 Inverted Index
                </Link>
                <Link href="/search/indexing/vectors" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Next: Vector Search (HNSW) <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
