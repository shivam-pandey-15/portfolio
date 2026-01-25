"use client";

import { ArrowRight, ArrowLeft, ArrowDown, Database, Divide, Copy, AlertTriangle, CheckCircle2, XCircle, LayoutGrid, Network, Layers, FileJson, Scale } from "lucide-react";
import Link from "next/link";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Model for the Result Card", description: "The 'Document' is what you show the user, not necessarily a database row. Often, 10 DB rows = 1 Search Document." },
    { title: "The Denormalization Tax", description: "Search indices are 5x larger than the source DB due to inverted indices, doc values, and replicas. Plan storage accordingly." },
    { title: "Choose Your Granularity", description: "Use Field Collapsing for 'SKU-level precision with Product-level display'. Avoid Nested Objects for high-churn data." },
    { title: "Updates are Expensive", description: "In Lucene, every update is a Delete + Insert. Partial updates are a lie. Optimize for write throughput." }
];

export default function Modeling() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 4.3: Data Foundation</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Document Modeling</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    The "Document" is the atomic unit of search. Getting the granularity and structure wrong is a one-way door
                    that's expensive to fix. Unlike SQL normalization, search requires careful denormalization.
                </p>
            </div>

            <hr className="border-border" />

            {/* 1. What is a Document? */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <FileJson className="w-8 h-8" /> What is a "Document"?
                </h2>
                <p className="text-foreground leading-relaxed">
                    In Search, a document is <strong>what you retrieve and rank as one unit</strong>. It is not necessarily a database row, a file, or a product.
                    The golden rule of search modeling is simple but profound: <strong>Model based on what the user sees on the result card.</strong>
                </p>

                {/* 1.1 Document ≠ DB Row */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                    <h3 className="font-bold text-blue-900 mb-3 text-sm flex items-center gap-2">
                        <Database className="w-4 h-4" /> Document ≠ Database Row
                    </h3>
                    <p className="text-sm text-blue-800 mb-3">
                        A document is a <strong>ranking unit</strong>, not a storage unit. One database row can become:
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                        <div className="bg-white p-3 rounded border border-blue-100 text-center">
                            <div className="font-bold text-zinc-500 mb-1">0 Documents</div>
                            <div className="text-blue-900">Filtered out (Soft delete, banned)</div>
                        </div>
                        <div className="bg-white p-3 rounded border border-blue-100 text-center">
                            <div className="font-bold text-zinc-900 mb-1">1 Document</div>
                            <div className="text-blue-900">1:1 Mapping (Standard)</div>
                        </div>
                        <div className="bg-white p-3 rounded border border-blue-100 text-center">
                            <div className="font-bold text-zinc-900 mb-1">100 Documents</div>
                            <div className="text-blue-900">Variants, Time-series splits</div>
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-blue-200">
                        <p className="text-xs font-bold text-blue-900 mb-2">Examples:</p>
                        <ul className="list-disc list-inside text-xs text-blue-800 space-y-1">
                            <li><strong>Amazon:</strong> Product vs Offer vs Seller (3 different doc types)</li>
                            <li><strong>Zomato:</strong> Restaurant vs Outlet vs Menu Item</li>
                            <li><strong>YouTube:</strong> Video vs Video+TimeMarker (Chapter search)</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-zinc-50 border-2 border-zinc-300 rounded-xl p-6">
                    <h3 className="font-bold text-zinc-900 mb-4">Example: The E-commerce Dilemma</h3>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Result Card Visual */}
                        <div className="w-full md:w-1/2 bg-white border border-zinc-200 rounded-lg shadow-sm p-4">
                            <div className="flex gap-4">
                                <div className="w-24 h-24 bg-zinc-100 rounded flex items-center justify-center text-zinc-400 text-xs">IMAGE</div>
                                <div className="space-y-2 flex-1">
                                    <div className="font-bold text-lg">iPhone 15 Pro Max</div>
                                    <div className="text-yellow-500 text-sm">⭐⭐⭐⭐⭐ (2,341 reviews)</div>
                                    <div className="font-mono text-zinc-600">$999 - $1,499</div>
                                    <div className="text-xs text-blue-600">6 colors available</div>
                                </div>
                            </div>
                        </div>

                        {/* Analysis */}
                        <div className="w-full md:w-1/2 space-y-4">
                            <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100">
                                <div className="text-zinc-500">// Question: Is the document a Product or a SKU?</div>
                                <div className="mt-2 text-green-400">If Document = Product:</div>
                                <div className="pl-4">• 1 doc ("iPhone 15")</div>
                                <div className="pl-4">• Clean results (1 card)</div>
                                <div className="mt-2 text-red-400">If Document = SKU:</div>
                                <div className="pl-4">• 6 docs ("iPhone 15 Red", "Blue"...)</div>
                                <div className="pl-4">• Cluttered results (6 cards for same phone)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Granularity Decisions */}
            <section className="space-y-8">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Divide className="w-8 h-8" /> Granularity Strategy
                    </h2>
                    <p className="text-foreground leading-relaxed">
                        Let's analyze a "T-Shirt" product foundationally. It has a parent entity ("Classic Crew Tagless") and 6 concrete variations (Red S, Red M, Red L, Blue S, Blue M, Blue L).
                        We have three distinct ways to model this in Lucene, each with massive trade-offs for query accuracy and result display.
                    </p>

                    {/* The Cardinality Trap */}
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-rose-600" />
                            <h3 className="font-bold text-rose-900 text-sm">The Cardinality Trap</h3>
                        </div>
                        <p className="text-sm text-rose-800 mb-4 leading-relaxed">
                            Before choosing, you must understand cardinality. High cardinality fields (SKUs, IDs, Timestamps) are expensive in search engines.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                            <div className="bg-white p-3 rounded border border-rose-100">
                                <div className="font-bold text-green-700 mb-1">Low Cardinality (Safe)</div>
                                <div className="text-zinc-600">Brands, Categories, Cities</div>
                                <div className="text-zinc-400 mt-1 italic">Cacheable, Fast Aggregations</div>
                            </div>
                            <div className="bg-white p-3 rounded border border-rose-100">
                                <div className="font-bold text-red-700 mb-1">High Cardinality (Risk)</div>
                                <div className="text-zinc-600">SKUs, User IDs, Timestamps</div>
                                <div className="text-zinc-400 mt-1 italic">Explodes memory, Breaks Caches</div>
                            </div>
                        </div>
                        <div className="bg-rose-100 p-2 rounded text-xs text-rose-900 font-mono text-center">
                            Rule: If Field Cardinality ≈ Document Count, treat it as a performance risk.
                        </div>
                    </div>
                </div>

                {/* Option A: Product Level */}
                <div className="border-2 border-zinc-200 rounded-xl overflow-hidden">
                    <div className="bg-zinc-100 px-6 py-4 font-bold border-b border-zinc-200 flex justify-between">
                        <span>Option A: Product-Level Document (The "Flat" Approach)</span>
                        <span className="text-amber-600 font-mono text-xs uppercase tracking-wider border border-amber-200 bg-amber-50 px-2 py-1 rounded">Cross-Match Risk ⚠</span>
                    </div>
                    <div className="p-6 grid md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-sm text-foreground mb-4 font-bold">The Concept</p>
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                We treat the abstract "Product" as the document. All attributes from all variants are flattened into arrays.
                                This creates a "Soup of Attributes". We lose the knowledge of which color belongs to which size.
                            </p>
                            <div className="bg-zinc-900 rounded-lg p-5 font-mono text-xs text-zinc-100 shadow-xl">
                                <div className="text-zinc-500 mb-2">// One document represents the entire product</div>
                                <div>{`{`}</div>
                                <div className="pl-4"><span className="text-blue-400">"product_id"</span>: <span className="text-green-400">"tshirt_001"</span>,</div>
                                <div className="pl-4"><span className="text-blue-400">"title"</span>: <span className="text-green-400">"Classic Cotton Crew"</span>,</div>
                                <div className="pl-4"><span className="text-blue-400">"price_range"</span>: {`{ "min": 29.99, "max": 34.99 }`},</div>
                                <div className="pl-4 border-l-2 border-amber-500 ml-2 pl-2">
                                    <div className="text-zinc-500">// Flattened Soup ⚠</div>
                                    <div><span className="text-blue-400">"colors"</span>: [<span className="text-green-400">"Red"</span>, <span className="text-green-400">"Blue"</span>],</div>
                                    <div><span className="text-blue-400">"sizes"</span>: [<span className="text-green-400">"S"</span>, <span className="text-green-400">"M"</span>, <span className="text-green-400">"L"</span>],</div>
                                    <div><span className="text-blue-400">"skus_in_stock"</span>: [<span className="text-green-400">"red_s"</span>, <span className="text-green-400">"red_m"</span>, <span className="text-green-400">"blue_l"</span>]</div>
                                </div>
                                <div>{`}`}</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                                <div className="font-bold text-amber-900 mb-2 text-sm flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    The "Cross-Match" Problem
                                </div>
                                <p className="text-sm text-amber-800 leading-relaxed mb-3">
                                    If a user searches for <span className="font-bold bg-white/50 px-1 rounded">"Blue Small"</span>:
                                </p>
                                <ul className="list-disc list-inside text-sm text-amber-800 space-y-1 ml-1">
                                    <li>Query checks: Does doc have "Blue"? <strong>YES</strong>.</li>
                                    <li>Query checks: Does doc have "Small"? <strong>YES</strong>.</li>
                                    <li><strong>Result:</strong> Matches!</li>
                                </ul>
                                <p className="text-sm text-amber-800 leading-relaxed mt-3 border-t border-amber-200 pt-3">
                                    <strong>Reality:</strong> We might only have "Blue Large" in stock.
                                    You just showed a false positive result that the user cannot buy, leading to bounce/frustration.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Option B: SKU Level */}
                <div className="border-2 border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-zinc-100 px-6 py-4 font-bold border-b border-zinc-200 flex justify-between">
                        <span>Option B: SKU-Level Document (Total Denormalization)</span>
                        <span className="text-red-600 font-mono text-xs uppercase tracking-wider border border-red-200 bg-red-50 px-2 py-1 rounded">Pollution Risk ⚠</span>
                    </div>
                    <div className="p-6 grid md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-sm text-foreground mb-4 font-bold">The Concept</p>
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                We go to the other extreme. Every physical SKU becomes its own completely independent document.
                                We respect the physical reality of the inventory.
                            </p>
                            <div className="bg-zinc-900 rounded-lg p-5 font-mono text-xs text-zinc-100 shadow-xl space-y-3">
                                <div className="opacity-50 hover:opacity-100 transition-opacity">
                                    <div className="text-zinc-500">// Document 1</div>
                                    <div>{`{ "sku": "red_s", "title": "Cotton Crew", "color": "Red", "size": "S" }`}</div>
                                </div>
                                <div className="opacity-50 hover:opacity-100 transition-opacity">
                                    <div className="text-zinc-500">// Document 2</div>
                                    <div>{`{ "sku": "red_m", "title": "Cotton Crew", "color": "Red", "size": "M" }`}</div>
                                </div>
                                <div className="opacity-100 border-l-2 border-green-500 pl-2">
                                    <div className="text-zinc-500">// Document 3 (The only match for Blue L)</div>
                                    <div>{`{ "sku": "blue_l", "title": "Cotton Crew", "color": "Blue", "size": "L" }`}</div>
                                </div>
                                <div className="text-zinc-600 italic">// ... repeated 6 times for 6 variants</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                                <div className="font-bold text-red-900 mb-2 text-sm flex items-center gap-2">
                                    <Copy className="w-4 h-4" />
                                    The Result Pollution Problem
                                </div>
                                <p className="text-sm text-red-800 leading-relaxed mb-3">
                                    A general search for <span className="font-bold bg-white/50 px-1 rounded">"Cotton T-shirt"</span> will match ALL 6 documents.
                                </p>
                                <div className="bg-white rounded border border-red-200 p-3 text-xs text-red-900 font-mono">
                                    1. Cotton Crew (Red S)<br />
                                    2. Cotton Crew (Red M)<br />
                                    3. Cotton Crew (Red L)<br />
                                    4. Cotton Crew (Blue S)<br />
                                    ...
                                </div>
                                <p className="text-sm text-red-800 leading-relaxed mt-3">
                                    This "variant explosion" pushes other relevant products to Page 2. Users feel they are seeing duplicates and assume you have no variety.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Option C: Field Collapsing */}
                <div className="border-2 border-green-500 rounded-xl overflow-hidden shadow-md">
                    <div className="bg-green-50 px-6 py-4 font-bold border-b border-green-200 text-green-900 flex justify-between">
                        <span>Option C: SKU-Level + Field Collapsing (The Hybrid)</span>
                        <span className="text-green-700 font-mono text-xs uppercase tracking-wider border border-green-200 bg-green-100 px-2 py-1 rounded">Best Practice ✅</span>
                    </div>
                    <div className="p-6">
                        <div className="mb-6 max-w-3xl">
                            <p className="text-foreground leading-relaxed">
                                We index Option B (SKUs) to get perfect filtering, but we ask the Query Engine to <strong>"Collapse"</strong> results by `product_id`.
                                This means: "Find all matching SKUs, but straightforwardly only show me the best matching SKU per product."
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold text-zinc-900 text-sm mb-2">1. The Collapsing Query</h4>
                                <div className="bg-zinc-900 rounded-lg p-5 font-mono text-sm text-zinc-100 shadow-lg h-full">
                                    <div className="text-zinc-500 mb-2">// Find "Blue Shirt"</div>
                                    <div>{`{`}</div>
                                    <div className="pl-4"><span className="text-blue-400">"query"</span>: {`{ "match": { "title": "blue shirt" } },`}</div>

                                    <div className="pl-4 mt-4 border-l-2 border-green-500 ml-2 pl-2">
                                        <div className="text-zinc-500">// Grouping Magic</div>
                                        <div><span className="text-blue-400">"collapse"</span>: {`{`}</div>
                                        <div className="pl-4"><span className="text-blue-400">"field"</span>: <span className="text-green-400">"product_id"</span>,</div>
                                        <div className="pl-4"><span className="text-blue-400">"inner_hits"</span>: {`{`}</div>
                                        <div className="pl-8"><span className="text-blue-400">"name"</span>: <span className="text-green-400">"other_variants"</span>,</div>
                                        <div className="pl-8"><span className="text-blue-400">"size"</span>: <span className="text-green-400">5</span></div>
                                        <div className="pl-4">{`}`}</div>
                                        <div>{`}`}</div>
                                    </div>
                                    <div>{`}`}</div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-zinc-900 text-sm mb-2">2. The Structured Result</h4>
                                <div className="bg-zinc-900 rounded-lg p-5 font-mono text-sm text-zinc-100 shadow-lg h-full">
                                    <div className="text-zinc-500 mb-2">// Returns ONE hit per product</div>
                                    <div>{`{`}</div>
                                    <div className="pl-4"><span className="text-blue-400">"product_id"</span>: <span className="text-green-400">"tshirt_001"</span>,</div>
                                    <div className="pl-4"><span className="text-blue-400">"sku"</span>: <span className="text-green-400">"blue_l"</span>, <span className="text-zinc-500">// Best match!</span></div>
                                    <div className="pl-4"><span className="text-blue-400">"title"</span>: <span className="text-green-400">"Cotton Crew"</span>,</div>

                                    <div className="pl-4 mt-4 border-l-2 border-blue-500 ml-2 pl-2">
                                        <div className="text-zinc-500">// Other variants tucked inside</div>
                                        <div><span className="text-blue-400">"inner_hits"</span>: {`{`}</div>
                                        <div className="pl-4"><span className="text-blue-400">"other_variants"</span>: [</div>
                                        <div className="pl-8">{`{ "sku": "blue_m" },`}</div>
                                        <div className="pl-8">{`{ "sku": "blue_s" }`}</div>
                                        <div className="pl-4">]</div>
                                        <div>{`}`}</div>
                                    </div>
                                    <div>{`}`}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="font-bold text-zinc-900 text-xs mb-2 uppercase tracking-wide">Performance Trade-offs</h4>
                            <div className="overflow-x-auto rounded-lg border border-green-200">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="bg-green-100 border-b border-green-200">
                                            <th className="text-left px-4 py-3 font-bold text-green-900">Approach</th>
                                            <th className="text-left px-4 py-3 font-bold text-green-900">Query Time (100k)</th>
                                            <th className="text-left px-4 py-3 font-bold text-green-900">Why?</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-zinc-100">
                                        <tr>
                                            <td className="px-4 py-3 font-medium">No collapse (Option B)</td>
                                            <td className="px-4 py-3 font-mono">15ms</td>
                                            <td className="px-4 py-3 text-zinc-600">Pure streaming of results. No post-processing.</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">Collapse (Option C)</td>
                                            <td className="px-4 py-3 font-mono">35ms <span className="text-amber-600">(+133%)</span></td>
                                            <td className="px-4 py-3 text-zinc-600">Engine must group 1000s of hits by ID in memory.</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">Collapse + Inner Hits</td>
                                            <td className="px-4 py-3 font-mono">55ms <span className="text-red-600">(+267%)</span></td>
                                            <td className="px-4 py-3 text-zinc-600">Fetching extra data for every group bucket.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* When Collapsing Breaks */}
                            <div className="mt-8 pt-6 border-t border-zinc-200">
                                <h4 className="font-bold text-zinc-900 text-sm mb-4 flex items-center gap-2">
                                    <XCircle className="w-4 h-4 text-red-500" /> When Collapsing Breaks
                                </h4>
                                <p className="text-sm text-zinc-600 mb-4">
                                    Collapsing is a <strong>UX hack</strong>, not a true data model. It works for showing "Top N", but fails at scale.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-zinc-50 p-3 rounded border border-zinc-200">
                                        <div className="font-bold text-xs text-zinc-900 mb-1">1. Pagination Hell</div>
                                        <p className="text-xs text-zinc-500">
                                            "Page 2" is unstable because groups are calculated dynamically.
                                            A product on Page 1 might shift to Page 2 on refresh if scores drift slightly.
                                        </p>
                                    </div>
                                    <div className="bg-zinc-50 p-3 rounded border border-zinc-200">
                                        <div className="font-bold text-xs text-zinc-900 mb-1">2. Sorting Costs</div>
                                        <p className="text-xs text-zinc-500">
                                            Collapsing + Custom Sort (e.g. by Price) forces the engine to load ALL variants into heap memory to find the "min(price)" representative.
                                        </p>
                                    </div>
                                    <div className="bg-zinc-50 p-3 rounded border border-zinc-200">
                                        <div className="font-bold text-xs text-zinc-900 mb-1">3. Recall Accuracy</div>
                                        <p className="text-xs text-zinc-500">
                                            The "Best SKU" chosen to represent the group might not be the best visual match for the user's aesthetic, just the highest BM25 score.
                                        </p>
                                    </div>
                                    <div className="bg-zinc-50 p-3 rounded border border-zinc-200">
                                        <div className="font-bold text-xs text-zinc-900 mb-1">4. Distributed Cost</div>
                                        <p className="text-xs text-zinc-500">
                                            Every shard must perform the collapse independently, then send full groups to the coordinator node for a second merge.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Modeling Relationships */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Network className="w-8 h-8" /> Modeling Relationships
                </h2>
                <p className="text-foreground leading-relaxed">
                    Search engines are NoSQL stores. They hate joins. When you need to model relationships (Products have Variants, Authors have Books),
                    you must choose between three patterns, trading off between index performance, query performance, and flexibility.
                </p>

                <div className="space-y-4">
                    <div className="grid md:grid-cols-1 gap-12">
                        {/* 1. Flat Modeling */}
                        <div className="border-2 border-zinc-300 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-zinc-100 px-6 py-4 font-bold border-b border-zinc-200 flex justify-between">
                                <span>1. Flat Modeling (The "NoSQL" Default)</span>
                                <span className="text-zinc-600 font-mono text-xs uppercase tracking-wider border border-zinc-200 bg-white px-2 py-1 rounded">Fastest Read/Write ⚡</span>
                            </div>
                            <div className="p-6 grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-bold text-zinc-900 text-sm mb-3">The Mechanism</h4>
                                    <p className="text-sm text-zinc-700 leading-relaxed mb-4">
                                        Arrays of objects are "flattened" into parallel arrays of values.
                                        Internally, Lucene has no concept of "objects inside objects".
                                        It just sees a bag of values for each field.
                                    </p>
                                    <div className="bg-zinc-900 rounded-lg p-5 font-mono text-xs text-zinc-100 shadow-lg">
                                        <div className="text-zinc-500 mb-2">// How you send it:</div>
                                        <div>{`"authors": [`}</div>
                                        <div className="pl-4">{`{ "first": "John", "last": "Smith" },`}</div>
                                        <div className="pl-4">{`{ "first": "Alice", "last": "White" }`}</div>
                                        <div>{`]`}</div>

                                        <div className="text-zinc-500 mt-4 mb-2">// How Lucene stores it:</div>
                                        <div><span className="text-blue-400">"authors.first"</span>: [<span className="text-green-400">"John"</span>, <span className="text-green-400">"Alice"</span>]</div>
                                        <div><span className="text-blue-400">"authors.last"</span>: [<span className="text-green-400">"Smith"</span>, <span className="text-green-400">"White"</span>]</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-bold text-zinc-900 text-sm mb-3">The "Loss of Correlation" Trap</h4>
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                        <p className="text-sm text-amber-900 leading-relaxed">
                                            Because the connection between "Alice" and "White" is broken, a query for
                                            <span className="font-bold"> author="Alice Smith"</span> will MATCH!
                                        </p>
                                        <ul className="list-disc list-inside text-xs text-amber-800 mt-2 space-y-1">
                                            <li>Does valid doc have "Alice"? <strong>Yes</strong>.</li>
                                            <li>Does valid doc have "Smith"? <strong>Yes</strong>.</li>
                                            <li><strong>Result:</strong> False Positive.</li>
                                        </ul>
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                        <strong>Best For:</strong> Simple tags, flags, or attributes where combination doesn't matter (e.g. `tags: ["new", "sale"]`).
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Nested Objects */}
                        <div className="border-2 border-blue-500 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-blue-50 px-6 py-4 font-bold border-b border-blue-200 text-blue-900 flex justify-between">
                                <span>2. Nested Objects (The "Hidden Docs")</span>
                                <span className="text-blue-700 font-mono text-xs uppercase tracking-wider border border-blue-200 bg-blue-100 px-2 py-1 rounded">Correctness ✅</span>
                            </div>
                            <div className="p-6 grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-bold text-zinc-900 text-sm mb-3">The Mechanism</h4>
                                    <p className="text-sm text-zinc-700 leading-relaxed mb-4">
                                        Elasticsearch tricks Lucene by indexing each object as a separate, hidden "micro-document" right next to the parent.
                                        This preserves boundaries.
                                    </p>
                                    <div className="bg-zinc-900 rounded-lg p-5 font-mono text-xs text-zinc-100 shadow-lg">
                                        <div className="text-zinc-500 mb-2">// Lucene Segment Layout</div>
                                        <div className="bg-zinc-800 p-2 rounded mb-1 opacity-75">Doc 1: {`{ "first": "John", "last": "Smith" }`} <span className="text-zinc-500">(Hidden)</span></div>
                                        <div className="bg-zinc-800 p-2 rounded mb-1 opacity-75">Doc 2: {`{ "first": "Alice", "last": "White" }`} <span className="text-zinc-500">(Hidden)</span></div>
                                        <div className="bg-blue-900/30 border border-blue-500/50 p-2 rounded">Doc 3: {`{ "title": "Book Name", ... }`} <span className="text-blue-400">(Parent)</span></div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-bold text-zinc-900 text-sm mb-3">The Update Penalty</h4>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-900 leading-relaxed">
                                            <strong>Crucial:</strong> Because Lucene segments are immutable, you cannot update just one child.
                                            If you change "John" to "Jon", Elasticsearch must re-index the parent + ALL children.
                                        </p>
                                        <div className="mt-2 text-xs font-bold text-blue-800">
                                            Cost = O(N) where N is number of nested objects.
                                        </div>
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                        <strong>Best For:</strong> Static variants (colors/sizes) that rarely change but need strict filtering.
                                    </div>

                                    <div className="bg-zinc-100 p-3 rounded border border-zinc-200 mt-2">
                                        <div className="font-bold text-xs text-zinc-900 mb-1">Nested Query Cost Model</div>
                                        <p className="text-[10px] text-zinc-600 leading-normal">
                                            Lucene executes these as a <strong>Block Join</strong>. It iterates the hidden children to find matches, then walks up to the parent.
                                            While reads are fast, large nested arrays (e.g. 1000s of comments) break <span className="font-mono">segment merging</span> because the entire block must move together.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Parent-Child */}
                        <div className="border-2 border-purple-500 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-purple-50 px-6 py-4 font-bold border-b border-purple-200 text-purple-900 flex justify-between">
                                <span>3. Parent-Child (The "Join")</span>
                                <span className="text-purple-700 font-mono text-xs uppercase tracking-wider border border-purple-200 bg-purple-100 px-2 py-1 rounded">Update Speed 🚀</span>
                            </div>
                            <div className="p-6 grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-bold text-zinc-900 text-sm mb-3">The Mechanism</h4>
                                    <p className="text-sm text-zinc-700 leading-relaxed mb-4">
                                        Documents are fully independent but live on the same shard.
                                        A mapped "Join Field" links them. The "Join" happens at query time, not index time.
                                    </p>
                                    <div className="bg-zinc-900 rounded-lg p-5 font-mono text-xs text-zinc-100 shadow-lg">
                                        <div className="text-zinc-500 mb-2">// Independent Documents</div>
                                        <div className="mb-2">
                                            <span className="text-purple-400">PUT</span> /products/_doc/1 <br />
                                            {`{ "title": "MacBook", "join": "product" }`}
                                        </div>
                                        <div>
                                            <span className="text-purple-400">PUT</span> /products/_doc/2?routing=1 <br />
                                            {`{ "price": 2000, "join": { "name": "variant", "parent": "1" } }`}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-bold text-zinc-900 text-sm mb-3">The Query Latency Tax</h4>
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                        <p className="text-sm text-purple-900 leading-relaxed">
                                            Because the link is resolved at query time, these queries are <strong>10x slower</strong> than nested queries.
                                            They also consume significant Heap Memory for "Global Ordinals" to track the relationships.
                                        </p>
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                        <strong>Best For:</strong> High-churn data. Example: "Offer Prices" that change every minute for thousands of sellers.
                                    </div>

                                    <div className="bg-zinc-100 p-3 rounded border border-zinc-200 mt-2">
                                        <div className="font-bold text-xs text-zinc-900 mb-1">The Routing Constraint</div>
                                        <p className="text-[10px] text-zinc-600 leading-normal">
                                            Parent and Children <strong>must reside on the same shard</strong>. You MUST provide a <span className="font-mono">routing</span> key (parent ID).
                                            <br />
                                            <strong>Risk:</strong> Bad routing keys lead to "Hot Shards" where one shard handles 10x traffic. Rebalancing this is painful.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-50 border-2 border-zinc-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Scale className="w-5 h-5" /> Performance Comparison
                    </h3>
                    <div className="overflow-x-auto rounded-lg border border-zinc-200">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-zinc-100 border-b border-zinc-200">
                                    <th className="text-left px-4 py-2 font-bold">Operation</th>
                                    <th className="text-left px-4 py-2 font-bold">Flat</th>
                                    <th className="text-left px-4 py-2 font-bold">Nested</th>
                                    <th className="text-left px-4 py-2 font-bold">Parent-Child</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-zinc-100">
                                <tr>
                                    <td className="px-4 py-2 font-medium">Query (100K docs)</td>
                                    <td className="px-4 py-2 text-green-700 font-mono">15ms</td>
                                    <td className="px-4 py-2 text-amber-700 font-mono">20ms</td>
                                    <td className="px-4 py-2 text-red-700 font-mono font-bold">150ms</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 font-medium">Update Parent</td>
                                    <td className="px-4 py-2 text-green-700 font-mono">5ms</td>
                                    <td className="px-4 py-2 text-green-700 font-mono">5ms</td>
                                    <td className="px-4 py-2 text-green-700 font-mono">5ms</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 font-medium">Update Child</td>
                                    <td className="px-4 py-2 text-green-700 font-mono">5ms</td>
                                    <td className="px-4 py-2 text-red-700 font-mono">50ms (all children)</td>
                                    <td className="px-4 py-2 text-green-700 font-mono font-bold">5ms</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 font-medium">Memory Overhead</td>
                                    <td className="px-4 py-2 text-green-700">Low</td>
                                    <td className="px-4 py-2 text-amber-700">Medium</td>
                                    <td className="px-4 py-2 text-red-700 font-bold">High (global ordinals)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3.1 Update Strategies */}
                <div className="bg-zinc-50 border-2 border-zinc-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Scale className="w-5 h-5" /> Update Strategies & Reindexing Cost
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded border border-zinc-200 shadow-sm">
                            <div className="font-bold text-sm text-zinc-900 mb-2">1. Full Rebuild</div>
                            <p className="text-xs text-zinc-500 mb-3">Delete index, Create new, Ingest all.</p>
                            <div className="text-xs font-mono bg-zinc-100 p-1 rounded text-center">Expensive / Simple</div>
                            <div className="mt-2 text-[10px] text-zinc-400">Use for: Schema changes, Mapper parsing exceptions.</div>
                        </div>
                        <div className="bg-white p-4 rounded border border-zinc-200 shadow-sm">
                            <div className="font-bold text-sm text-zinc-900 mb-2">2. Partial Update</div>
                            <p className="text-xs text-zinc-500 mb-3">Send only changed fields.</p>
                            <div className="text-xs font-mono bg-zinc-100 p-1 rounded text-center">"Fake" In-Place</div>
                            <div className="mt-2 text-[10px] text-zinc-400">Lucene still does (Delete + Insert) under the hood. High segment churn.</div>
                        </div>
                        <div className="bg-white p-4 rounded border border-green-200 bg-green-50 shadow-sm">
                            <div className="font-bold text-sm text-green-900 mb-2">3. Alias Swap</div>
                            <p className="text-xs text-green-800 mb-3">Build Index B || Point Alias A &to; B</p>
                            <div className="text-xs font-mono bg-green-100 text-green-800 p-1 rounded text-center">Zero Downtime</div>
                            <div className="mt-2 text-[10px] text-green-700">The industry standard for schema migrations.</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. The Denormalization Tax */}
            <section className="space-y-6" >
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Scale className="w-8 h-8" /> The Denormalization Tax
                </h2>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <p className="text-foreground leading-relaxed mb-4">
                            In SQL, we normalize to reduce redundancy (store "Brand Name" once).
                            In Search, we <strong>denormalize</strong> for speed (copy "Brand Name" into every product).
                            This creates a massive storage footprint.
                        </p>
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                            <h4 className="font-bold text-amber-900 mb-2">Why is the Index 5x larger than DB?</h4>
                            <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
                                <li><strong>Inverted Index:</strong> Terms for searching</li>
                                <li><strong>Doc Values:</strong> Columns for sorting</li>
                                <li><strong>Stored Fields:</strong> JSON for retrieval</li>
                                <li><strong>Replicas:</strong> 1 copy = 2x storage</li>
                            </ul>
                        </div>
                    </div>
                    <div className="bg-zinc-900 rounded-xl p-6 font-mono text-sm text-zinc-100">
                        <div className="mb-2 text-zinc-500"># Storage Breakdown (100MB Raw Data)</div>
                        <div className="flex justify-between border-b border-zinc-700 py-1">
                            <span>Raw Data</span>
                            <span className="text-zinc-400">100 MB</span>
                        </div>
                        <div className="flex justify-between py-1 text-blue-400">
                            <span>+ Inverted Index</span>
                            <span>80 MB</span>
                        </div>
                        <div className="flex justify-between py-1 text-purple-400">
                            <span>+ Doc Values</span>
                            <span>40 MB</span>
                        </div>
                        <div className="flex justify-between py-1 text-green-400">
                            <span>+ Stored Fields</span>
                            <span>100 MB</span>
                        </div>
                        <div className="flex justify-between border-t border-zinc-500 py-2 mt-2 font-bold text-white">
                            <span>Total (Primary)</span>
                            <span>320 MB</span>
                        </div>
                        <div className="flex justify-between py-1 text-zinc-500">
                            <span>+ 1 Replica</span>
                            <span>320 MB</span>
                        </div>
                        <div className="flex justify-between border-t border-white py-2 mt-2 font-bold text-amber-400">
                            <span>Cluster Footprint</span>
                            <span>640 MB (6.4x)</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4.1 Consistency vs Freshness */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="font-bold text-amber-900 mb-3 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> The Hidden Cost: Consistency vs Freshness
                </h3>
                <p className="text-sm text-amber-800 leading-relaxed mb-4">
                    Search engines are <strong>Eventually Consistent</strong>. They are not transactionally correct like Postgres.
                    <br />
                    <span className="text-xs opacity-75">Ingestion pipelines are async. There is always a lag between "User Buy" and "Index Update".</span>
                </p>
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-3 rounded border border-amber-100">
                        <div className="font-bold text-xs text-zinc-900 mb-1">Scenario A: The "Ghost" Stock</div>
                        <p className="text-xs text-zinc-600">
                            Item is sold out in DB, but Search Index still says "In Stock". User clicks buy → Error.
                            <br /><strong>Fix:</strong> Check DB availability at checkout.
                        </p>
                    </div>
                    <div className="bg-white p-3 rounded border border-amber-100">
                        <div className="font-bold text-xs text-zinc-900 mb-1">Scenario B: Price Mismatch</div>
                        <p className="text-xs text-zinc-600">
                            Search shows $19.99 (old cache), Product Page shows $25.00.
                            <br /><strong>Fix:</strong> Frequent small-batch updates (NRT).
                        </p>
                    </div>
                </div>
            </div>

            {/* 6. Production Stories & Industry Playbook */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8" /> Real Production Failure Stories
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                        <div className="font-bold text-sm text-zinc-900 mb-2">1. The Variant Explosion</div>
                        <p className="text-xs text-zinc-600 mb-2">
                            An e-commerce site indexed every SKU (Option B) without collapsing.
                        </p>
                        <div className="bg-red-100 text-red-800 text-[10px] p-2 rounded font-mono">
                            Result: "Nike Shirt" returned 400 results (All Nike variants), burying Adidas completely. Relevance score dropped 80%.
                        </div>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                        <div className="font-bold text-sm text-zinc-900 mb-2">2. The Nested Throughput Death</div>
                        <p className="text-xs text-zinc-600 mb-2">
                            A log platform used Nested Objects for 'tags' on high-velocity logs.
                        </p>
                        <div className="bg-red-100 text-red-800 text-[10px] p-2 rounded font-mono">
                            Result: Indexing rate dropped 90% because every log update forced Lucene to rewrite the entire block of nested segments.
                        </div>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                        <div className="font-bold text-sm text-zinc-900 mb-2">3. The Parent-Child Latency</div>
                        <p className="text-xs text-zinc-600 mb-2">
                            A job board used Parent-Child for Company → Jobs.
                        </p>
                        <div className="bg-red-100 text-red-800 text-[10px] p-2 rounded font-mono">
                            Result: At 50M docs, queries took 800ms (p99) due to global ordinal loading. They had to switch to Denormalized Flat docs.
                        </div>
                    </div>
                </div>

                {/* Industry Playbook */}
                <div className="bg-zinc-900 text-zinc-100 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-zinc-400" /> Industry Modeling Playbook
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6 text-sm">
                        <div>
                            <div className="font-bold text-blue-400 mb-2">1. E-Commerce (Amazon/Shopify)</div>
                            <ul className="space-y-1 text-zinc-400 text-xs">
                                <li>• <strong>Model:</strong> Option C (SKU Docs + Collapse)</li>
                                <li>• <strong>Why:</strong> Need precise filtering (Size/Color) but grouped display.</li>
                                <li>• <strong>Trade-off:</strong> Higher query latency, better UX.</li>
                            </ul>
                        </div>
                        <div>
                            <div className="font-bold text-green-400 mb-2">2. Content/Media (Netflix/Spotify)</div>
                            <ul className="space-y-1 text-zinc-400 text-xs">
                                <li>• <strong>Model:</strong> Option A (Flat Product/Show)</li>
                                <li>• <strong>Why:</strong> "Variations" (Episodes) are rarely searched independently by attributes.</li>
                                <li>• <strong>Trade-off:</strong> Fast queries, duplicates impossible.</li>
                            </ul>
                        </div>
                        <div>
                            <div className="font-bold text-purple-400 mb-2">3. SaaS/B2B (Salesforce/Jira)</div>
                            <ul className="space-y-1 text-zinc-400 text-xs">
                                <li>• <strong>Model:</strong> Parent-Child (Account → Ticket)</li>
                                <li>• <strong>Why:</strong> Access controls (Parent) apply to all tickets. Tickets change constantly.</li>
                                <li>• <strong>Trade-off:</strong> Slow queries, instant security updates.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Decision Framework */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <LayoutGrid className="w-8 h-8" /> Decision Framework
                </h2>
                <p className="text-foreground leading-relaxed">
                    How do you choose? Answer these four questions to pick the correct model.
                </p>

                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">Question</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">If YES...</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">If NO...</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                            <tr>
                                <td className="px-4 py-4 font-medium">1. Are there many variations of the same item?</td>
                                <td className="px-4 py-4 text-zinc-600">Consider <strong>SKU + Collapsing</strong></td>
                                <td className="px-4 py-4 text-zinc-600">Model as <strong>Product</strong></td>
                            </tr>
                            <tr>
                                <td className="px-4 py-4 font-medium">2. Do filters need strictly correlated attributes? <br /><span className="text-xs text-muted-foreground">(e.g. Red MUST be Size L)</span></td>
                                <td className="px-4 py-4 text-zinc-600">Need <strong>Nested</strong> or <strong>Parent-Child</strong></td>
                                <td className="px-4 py-4 text-zinc-600"><strong>Flat</strong> arrays are faster</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-4 font-medium">3. Is your update rate extremely high? <br /><span className="text-xs text-muted-foreground">(e.g. Real-time inventory)</span></td>
                                <td className="px-4 py-4 text-zinc-600"><strong>Parent-Child</strong> (Update child only)</td>
                                <td className="px-4 py-4 text-zinc-600"><strong>Nested</strong> (Updates are expensive)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-4 font-medium">4. Has &gt; 1000 variants per product?</td>
                                <td className="px-4 py-4 text-zinc-600"><strong>Parent-Child</strong> or Split Indices</td>
                                <td className="px-4 py-4 text-zinc-600"><strong>Nested</strong> fits in a block</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-4 font-medium">5. Need stable pagination across pages?</td>
                                <td className="px-4 py-4 text-zinc-600"><strong>Avoid Collapse</strong> (Use Flat/Nested)</td>
                                <td className="px-4 py-4 text-zinc-600"><strong>Collapse</strong> is acceptable (First N High Confidence)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section >

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Mental Model Summary */}
            <section className="bg-zinc-900 border-2 border-zinc-700 p-8 rounded-xl text-center">
                <h2 className="text-2xl font-bold mb-6 text-white">Mental Model Summary: The 3 Axes</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-4 bg-zinc-800/50 rounded-lg">
                        <div className="text-4xl mb-3">🎯</div>
                        <h3 className="text-blue-400 font-bold mb-2">Relevance Correctness</h3>
                        <p className="text-sm text-zinc-400">Does "Red Small" actually match a Red Small item? (Nested/SKU wins here)</p>
                    </div>
                    <div className="p-4 bg-zinc-800/50 rounded-lg">
                        <div className="text-4xl mb-3">⚡</div>
                        <h3 className="text-green-400 font-bold mb-2">Query Latency</h3>
                        <p className="text-sm text-zinc-400">How fast does the search page load? (Flat wins here)</p>
                    </div>
                    <div className="p-4 bg-zinc-800/50 rounded-lg">
                        <div className="text-4xl mb-3">🔄</div>
                        <h3 className="text-purple-400 font-bold mb-2">Update Cost</h3>
                        <p className="text-sm text-zinc-400">How fast can inventory sync? (Parent-Child wins here)</p>
                    </div>
                </div>
                <div className="mt-8 text-zinc-500 font-mono text-sm border-t border-zinc-800 pt-6">
                    "You can only pick 2. Choose wisely."
                </div>
            </section>

            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/data/types" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 4.2 Data Types
                </Link>
                <Link href="/search/data/text-vs-structured" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90">
                    Next: Text vs Structured <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div >
    );
}
