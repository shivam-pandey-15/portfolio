import { CheckCircle2, Database, Layers, Network, Zap, ArrowRight, ArrowLeft, BarChart3, Server } from "lucide-react";
import Link from "next/link";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "The Five Data Types", description: "Text (Unstructured), Structured (Exact), Semi-Structured (Flexible), Graph (Relationships), and Behavioral (Signals)." },
    { title: "The Three Views", description: "Source of Truth (OLTP), Search Index (Denormalized), and Feature Store (ML Signals). Don't try to make one DB do it all." },
    { title: "Event-Driven Integrity", description: "Use CDC (Debezium) and Kafka to populate your views. Never dual-write from the application." }
];

export default function TypesPage() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 4.2: Data Foundation</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Types of Data in Search</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Search engines don&apos;t operate on a single data type. Understanding the different data categories and their characteristics is essential for building scalable systems.
                </p>
            </div>

            <hr className="border-border" />

            {/* Data Taxonomy */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">The Data Taxonomy</h2>
                <p className="text-foreground leading-relaxed">
                    Every piece of data in a search system has distinct characteristics that affect how it should be
                    stored, indexed, and queried. Misunderstanding these differences leads to performance disasters like
                    storing prices as text (100x slower filtering) or treating behavioral signals as static documents.
                    The following taxonomy covers the five fundamental data types you&apos;ll encounter.
                </p>

                {/* A. Text Data */}
                <div className="rounded-xl border-2 border-violet-500 bg-violet-50 p-6 space-y-4">
                    <h3 className="text-xl font-bold text-violet-900">A. Text Data (Unstructured)</h3>
                    <p className="text-sm text-violet-800"><strong>Definition:</strong> Human-readable content with no fixed schema.</p>
                    <p className="text-sm text-violet-700">
                        Text is the foundation of search product titles, descriptions, reviews, articles. Unlike numbers,
                        text has no inherent structure. Before it can be searched, it must be analyzed: broken into tokens,
                        normalized to lowercase, and stemmed to root forms. This processing creates the inverted index.
                    </p>
                    <div className="bg-zinc-900 p-4 rounded font-mono text-xs overflow-x-auto">
                        <div className="text-zinc-100">{`{`}</div>
                        <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;title&quot;</span>: <span className="text-green-400">&quot;Apple MacBook Pro 16&quot;</span>,</div>
                        <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;description&quot;</span>: <span className="text-green-400">&quot;The most powerful MacBook...&quot;</span>,</div>
                        <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;reviews&quot;</span>: [<span className="text-green-400">&quot;Amazing laptop!&quot;</span>, <span className="text-green-400">&quot;Worth every penny&quot;</span>]</div>
                        <div className="text-zinc-100">{`}`}</div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="bg-violet-100">
                                <th className="text-left px-3 py-2">Property</th>
                                <th className="text-left px-3 py-2">Value</th>
                            </tr></thead>
                            <tbody className="bg-white">
                                <tr><td className="px-3 py-2">Entropy</td><td className="px-3 py-2">High (unpredictable content)</td></tr>
                                <tr><td className="px-3 py-2">Analysis Required</td><td className="px-3 py-2">Yes (tokenization, stemming)</td></tr>
                                <tr><td className="px-3 py-2">Query Type</td><td className="px-3 py-2">Full-text search, fuzzy matching</td></tr>
                                <tr><td className="px-3 py-2">Storage Cost</td><td className="px-3 py-2">High (inverted index overhead)</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-violet-100 p-3 rounded text-xs text-violet-800">
                        <strong>Real-World Scale:</strong> Amazon: Average product description = 500 words. With 500M products = 250 billion words to index. After tokenization: ~100 billion unique terms.
                    </div>
                </div>

                {/* B. Structured Data */}
                <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 p-6 space-y-4">
                    <h3 className="text-xl font-bold text-emerald-900">B. Structured Data (Exact Values)</h3>
                    <p className="text-sm text-emerald-800"><strong>Definition:</strong> Data with strict types and known value ranges.</p>
                    <p className="text-sm text-emerald-700">
                        Structured data includes prices, dates, ratings, stock counts, and coordinates. Unlike text, these values
                        don&apos;t need tokenization they&apos;re stored and queried exactly as-is. The key insight: use BKD trees
                        (not inverted indexes) for numeric ranges, achieving 100x faster filtering.
                    </p>
                    <div className="bg-zinc-900 p-4 rounded font-mono text-xs overflow-x-auto">
                        <div className="text-zinc-100">{`{`}</div>
                        <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;price&quot;</span>: <span className="text-blue-400">2499.99</span>,</div>
                        <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;stock_count&quot;</span>: <span className="text-blue-400">1523</span>,</div>
                        <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;release_date&quot;</span>: <span className="text-green-400">&quot;2024-01-15&quot;</span>,</div>
                        <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;rating&quot;</span>: <span className="text-blue-400">4.7</span></div>
                        <div className="text-zinc-100">{`}`}</div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="bg-emerald-100">
                                <th className="text-left px-3 py-2">Property</th>
                                <th className="text-left px-3 py-2">Value</th>
                            </tr></thead>
                            <tbody className="bg-white">
                                <tr><td className="px-3 py-2">Entropy</td><td className="px-3 py-2">Low (bounded values)</td></tr>
                                <tr><td className="px-3 py-2">Analysis Required</td><td className="px-3 py-2">No (stored exactly)</td></tr>
                                <tr><td className="px-3 py-2">Query Type</td><td className="px-3 py-2">Range, exact match, geo</td></tr>
                                <tr><td className="px-3 py-2">Storage Cost</td><td className="px-3 py-2">Low (BKD trees)</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-sm text-emerald-700">
                        Here&apos;s what a price filter query looks like. Notice how the range is in the filter context, not the query context:
                    </p>
                    <div className="bg-zinc-900 p-4 rounded font-mono text-xs overflow-x-auto">
                        <div className="text-zinc-500">// User query: &quot;Laptops between $500 and $1500&quot;</div>
                        <div className="text-zinc-100">{`{`}</div>
                        <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;query&quot;</span>: {`{`}</div>
                        <div className="text-zinc-100 pl-8"><span className="text-amber-400">&quot;bool&quot;</span>: {`{`}</div>
                        <div className="text-zinc-100 pl-12"><span className="text-amber-400">&quot;must&quot;</span>: {`{ `}<span className="text-amber-400">&quot;match&quot;</span>: {`{ `}<span className="text-amber-400">&quot;category&quot;</span>: <span className="text-green-400">&quot;laptops&quot;</span> {`} }`},</div>
                        <div className="text-zinc-100 pl-12"><span className="text-amber-400">&quot;filter&quot;</span>: {`{ `}<span className="text-amber-400">&quot;range&quot;</span>: {`{ `}<span className="text-amber-400">&quot;price&quot;</span>: {`{ `}<span className="text-amber-400">&quot;gte&quot;</span>: <span className="text-blue-400">500</span>, <span className="text-amber-400">&quot;lte&quot;</span>: <span className="text-blue-400">1500</span> {`} } }`}</div>
                        <div className="text-zinc-100 pl-8">{`}`}</div>
                        <div className="text-zinc-100 pl-4">{`}`}</div>
                        <div className="text-zinc-100">{`}`}</div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                        <div className="bg-emerald-100 p-3 rounded">
                            <div className="text-xl font-bold text-emerald-800">100M products</div>
                            <div className="text-xs text-emerald-600">Price filter</div>
                        </div>
                        <div className="bg-green-100 p-3 rounded">
                            <div className="text-xl font-bold text-green-700">5ms</div>
                            <div className="text-xs text-green-600">BKD Tree</div>
                        </div>
                        <div className="bg-red-100 p-3 rounded">
                            <div className="text-xl font-bold text-red-700">500ms</div>
                            <div className="text-xs text-red-600">String comparison (100x slower)</div>
                        </div>
                    </div>
                </div>

                {/* C. Semi-Structured Data */}
                <div className="rounded-xl border-2 border-amber-500 bg-amber-50 p-6 space-y-4">
                    <h3 className="text-xl font-bold text-amber-900">C. Semi-Structured Data (Flexible Schema)</h3>
                    <p className="text-sm text-amber-800"><strong>Definition:</strong> JSON objects with varying fields per document.</p>
                    <p className="text-sm text-amber-700">
                        Different product categories have different attributes: laptops have RAM and screen size, t-shirts
                        have size and material. This flexibility is powerful but dangerous uncontrolled schema can explode
                        your cluster&apos;s memory. The solution is the flattened type.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-zinc-900 p-4 rounded font-mono text-xs overflow-x-auto">
                            <div className="text-zinc-500">// Laptop specs</div>
                            <div className="text-zinc-100">{`{`}</div>
                            <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;specs&quot;</span>: {`{`}</div>
                            <div className="text-zinc-100 pl-8"><span className="text-amber-400">&quot;screen&quot;</span>: <span className="text-green-400">&quot;16 inch&quot;</span>,</div>
                            <div className="text-zinc-100 pl-8"><span className="text-amber-400">&quot;ram&quot;</span>: <span className="text-green-400">&quot;32GB&quot;</span></div>
                            <div className="text-zinc-100 pl-4">{`}`}</div>
                            <div className="text-zinc-100">{`}`}</div>
                        </div>
                        <div className="bg-zinc-900 p-4 rounded font-mono text-xs overflow-x-auto">
                            <div className="text-zinc-500">// T-Shirt specs</div>
                            <div className="text-zinc-100">{`{`}</div>
                            <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;specs&quot;</span>: {`{`}</div>
                            <div className="text-zinc-100 pl-8"><span className="text-amber-400">&quot;size&quot;</span>: <span className="text-green-400">&quot;Large&quot;</span>,</div>
                            <div className="text-zinc-100 pl-8"><span className="text-amber-400">&quot;color&quot;</span>: <span className="text-green-400">&quot;Navy&quot;</span></div>
                            <div className="text-zinc-100 pl-4">{`}`}</div>
                            <div className="text-zinc-100">{`}`}</div>
                        </div>
                    </div>
                    <div className="bg-amber-100 p-3 rounded text-sm text-amber-800 break-words">
                        <strong>The Challenge:</strong> Without control, Elasticsearch creates 10,000+ unique field names = mapping explosion = slow cluster.
                    </div>
                    <p className="text-sm text-amber-700">
                        The solution is to use the flattened type, which stores all nested key-value pairs without creating individual mappings:
                    </p>
                    <div className="bg-zinc-900 p-4 rounded font-mono text-xs overflow-x-auto">
                        <div className="text-zinc-500">// Solution: Flattened type</div>
                        <div className="text-zinc-100">{`{`}</div>
                        <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;mappings&quot;</span>: {`{`}</div>
                        <div className="text-zinc-100 pl-8"><span className="text-amber-400">&quot;properties&quot;</span>: {`{`}</div>
                        <div className="text-zinc-100 pl-12"><span className="text-amber-400">&quot;specs&quot;</span>: {`{ `}<span className="text-amber-400">&quot;type&quot;</span>: <span className="text-green-400">&quot;flattened&quot;</span> {`}`}</div>
                        <div className="text-zinc-100 pl-8">{`}`}</div>
                        <div className="text-zinc-100 pl-4">{`}`}</div>
                        <div className="text-zinc-100">{`}`}</div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="bg-amber-100">
                                <th className="text-left px-3 py-2">Approach</th>
                                <th className="text-left px-3 py-2">Pros</th>
                                <th className="text-left px-3 py-2">Cons</th>
                            </tr></thead>
                            <tbody className="bg-white">
                                <tr><td className="px-3 py-2">Dynamic mapping</td><td className="px-3 py-2">Full query power</td><td className="px-3 py-2 text-red-600">Mapping explosion</td></tr>
                                <tr><td className="px-3 py-2">Flattened</td><td className="px-3 py-2">Controlled size</td><td className="px-3 py-2 text-red-600">No range queries on values</td></tr>
                                <tr><td className="px-3 py-2">Nested object</td><td className="px-3 py-2">Structured queries</td><td className="px-3 py-2 text-red-600">Update cost</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* D. Graph Data */}
                <div className="rounded-xl border-2 border-blue-500 bg-blue-50 p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <Network className="w-5 h-5 text-blue-600" />
                        <h3 className="text-xl font-bold text-blue-900">D. Graph Data (Relationships)</h3>
                    </div>
                    <p className="text-sm text-blue-800"><strong>Definition:</strong> Connections between entities.</p>
                    <p className="text-sm text-blue-700">
                        Search doesn&apos;t exist in isolation products belong to categories, categories have parents, users purchase
                        products, brands make products. These relationships must be captured and made queryable. The challenge
                        is that graph traversals are slow at query time, so we pre-compute the results into flat documents.
                    </p>
                    <div className="bg-zinc-900 text-zinc-100 p-4 rounded font-mono text-xs overflow-x-auto">
                        <div><span className="text-blue-400">User</span> <span className="text-zinc-500">--[</span><span className="text-amber-400">purchased</span><span className="text-zinc-500">]--&gt;</span> <span className="text-green-400">Product</span></div>
                        <div><span className="text-blue-400">Product</span> <span className="text-zinc-500">--[</span><span className="text-amber-400">belongs_to</span><span className="text-zinc-500">]--&gt;</span> <span className="text-green-400">Category</span></div>
                        <div><span className="text-blue-400">Product</span> <span className="text-zinc-500">--[</span><span className="text-amber-400">made_by</span><span className="text-zinc-500">]--&gt;</span> <span className="text-green-400">Brand</span></div>
                        <div><span className="text-blue-400">Brand</span> <span className="text-zinc-500">--[</span><span className="text-amber-400">headquartered_in</span><span className="text-zinc-500">]--&gt;</span> <span className="text-green-400">Country</span></div>
                        <div><span className="text-blue-400">User</span> <span className="text-zinc-500">--[</span><span className="text-amber-400">follows</span><span className="text-zinc-500">]--&gt;</span> <span className="text-green-400">Brand</span></div>
                    </div>
                    <h4 className="font-bold text-blue-800">The Flattening Problem</h4>
                    <p className="text-sm text-blue-700">
                        In a graph database, entities are normalized and linked by IDs. For search, we must denormalize
                        by embedding related data directly into each document. This trades storage for query speed.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-zinc-900 p-3 rounded font-mono text-xs overflow-x-auto">
                            <div className="text-blue-400 mb-1">// Normalized (Graph DB)</div>
                            <div className="text-zinc-400">// Product</div>
                            <div className="text-zinc-100">{`{ `}<span className="text-amber-400">&quot;id&quot;</span>: <span className="text-green-400">&quot;prod_1&quot;</span>, <span className="text-amber-400">&quot;brand_id&quot;</span>: <span className="text-green-400">&quot;brand_nike&quot;</span> {`}`}</div>
                            <div className="text-zinc-400 mt-1">// Brand</div>
                            <div className="text-zinc-100">{`{ `}<span className="text-amber-400">&quot;id&quot;</span>: <span className="text-green-400">&quot;brand_nike&quot;</span>, <span className="text-amber-400">&quot;name&quot;</span>: <span className="text-green-400">&quot;Nike&quot;</span> {`}`}</div>
                        </div>
                        <div className="bg-zinc-900 p-3 rounded font-mono text-xs overflow-x-auto">
                            <div className="text-green-400 mb-1">// Denormalized (Search Index)</div>
                            <div className="text-zinc-100">{`{`}</div>
                            <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;id&quot;</span>: <span className="text-green-400">&quot;prod_1&quot;</span>,</div>
                            <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;brand&quot;</span>: {`{ `}<span className="text-amber-400">&quot;name&quot;</span>: <span className="text-green-400">&quot;Nike&quot;</span> {`}`}</div>
                            <div className="text-zinc-100">{`}`}</div>
                        </div>
                    </div>
                    <div className="bg-blue-100 p-3 rounded text-xs text-blue-800 break-words">
                        <strong>Flipkart Case Study:</strong> Category hierarchy 5 levels deep, 15,000 categories.
                        <br />Solution: Index all ancestor categories on product.
                        <br /><code className="text-blue-900 bg-blue-200 px-1 rounded">category_path: [&quot;Electronics&quot;, &quot;Mobiles&quot;, &quot;Smartphones&quot;]</code>
                    </div>
                </div>

                {/* E. Behavioral Data */}
                <div className="rounded-xl border-2 border-rose-500 bg-rose-50 p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-rose-600" />
                        <h3 className="text-xl font-bold text-rose-900">E. Behavioral Data (Signals)</h3>
                    </div>
                    <p className="text-sm text-rose-800"><strong>Definition:</strong> User interaction logs used for ranking.</p>
                    <p className="text-sm text-rose-700">
                        Every click, scroll, and purchase generates a data point. These signals feed machine learning models
                        that personalize and rank results. The challenge: behavioral data arrives as a firehose of raw events
                        that must be aggregated into features before they&apos;re useful.
                    </p>
                    <div className="bg-zinc-900 p-4 rounded font-mono text-xs overflow-x-auto">
                        <div className="text-zinc-100">{`{`}</div>
                        <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;event&quot;</span>: <span className="text-green-400">&quot;click&quot;</span>,</div>
                        <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;timestamp&quot;</span>: <span className="text-green-400">&quot;2024-01-15T10:30:00Z&quot;</span>,</div>
                        <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;user_id&quot;</span>: <span className="text-green-400">&quot;user_12345&quot;</span>,</div>
                        <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;query&quot;</span>: <span className="text-green-400">&quot;running shoes&quot;</span>,</div>
                        <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;product_id&quot;</span>: <span className="text-green-400">&quot;prod_nike_123&quot;</span>,</div>
                        <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;position&quot;</span>: <span className="text-blue-400">3</span>,</div>
                        <div className="text-zinc-100 pl-4"><span className="text-amber-400">&quot;dwell_time_ms&quot;</span>: <span className="text-blue-400">45000</span></div>
                        <div className="text-zinc-100">{`}`}</div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="bg-rose-100">
                                <th className="text-left px-3 py-2">Metric</th>
                                <th className="text-left px-3 py-2">E-commerce (1M DAU)</th>
                                <th className="text-left px-3 py-2">Google Scale</th>
                            </tr></thead>
                            <tbody className="bg-white">
                                <tr><td className="px-3 py-2">Clicks/day</td><td className="px-3 py-2">50M</td><td className="px-3 py-2 font-bold">8.5B</td></tr>
                                <tr><td className="px-3 py-2">Events/second</td><td className="px-3 py-2">600</td><td className="px-3 py-2 font-bold">100,000</td></tr>
                                <tr><td className="px-3 py-2">Storage/day</td><td className="px-3 py-2">50GB</td><td className="px-3 py-2 font-bold">10TB</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-sm text-rose-700">
                        Raw events must be aggregated into features via streaming pipelines. Here&apos;s a Flink job that calculates click counts per product:
                    </p>
                    <div className="bg-zinc-900 p-4 rounded font-mono text-xs overflow-x-auto">
                        <div className="text-zinc-500"># Flink streaming job</div>
                        <div className="text-zinc-100"><span className="text-blue-400">def</span> <span className="text-amber-400">aggregate_signals</span>(events_stream):</div>
                        <div className="text-zinc-100 pl-4"><span className="text-blue-400">return</span> events_stream \</div>
                        <div className="text-zinc-100 pl-8">.key_by(<span className="text-blue-400">lambda</span> e: e[<span className="text-green-400">&quot;product_id&quot;</span>]) \</div>
                        <div className="text-zinc-100 pl-8">.window(TumblingWindow.of(Time.minutes(<span className="text-blue-400">15</span>))) \</div>
                        <div className="text-zinc-100 pl-8">.aggregate(click_count=count())</div>
                        <div className="text-zinc-400 mt-2"># Output (stored in Feature Store)</div>
                        <div className="text-zinc-100">{`{ `}<span className="text-amber-400">&quot;product_id&quot;</span>: <span className="text-green-400">&quot;prod_nike_123&quot;</span>, <span className="text-amber-400">&quot;clicks_15m&quot;</span>: <span className="text-blue-400">47</span> {`}`}</div>
                    </div>
                </div>
            </section>

            {/* The Three Data Views */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">The Three Data Views</h2>
                <p className="text-foreground leading-relaxed">
                    The same underlying data must be represented differently depending on its purpose. Your relational
                    database optimizes for consistency and writes; your search index optimizes for fast reads; your feature
                    store optimizes for low-latency ML inference. These are complementary views, not competing systems.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border-2 border-zinc-300 p-5 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Database className="w-5 h-5 text-zinc-600" />
                            <h4 className="font-bold text-zinc-900">View 1: Source of Truth (OLTP)</h4>
                        </div>
                        <p className="text-xs text-zinc-600 mb-2"><strong>Purpose:</strong> Reliability, ACID compliance</p>
                        <p className="text-xs text-zinc-600 mb-2"><strong>Technology:</strong> PostgreSQL, MySQL, DynamoDB</p>
                        <p className="text-xs text-zinc-600"><strong>Schema:</strong> Normalized (3NF)</p>
                        <div className="bg-zinc-900 text-zinc-100 p-2 rounded font-mono text-xs mt-3 overflow-x-auto">
                            <div><span className="text-blue-400">CREATE TABLE</span> products (</div>
                            <div className="pl-4">id <span className="text-amber-400">UUID PRIMARY KEY</span></div>
                            <div>);</div>
                        </div>
                    </div>
                    <div className="bg-blue-50 border-2 border-blue-300 p-5 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Layers className="w-5 h-5 text-blue-600" />
                            <h4 className="font-bold text-blue-900">View 2: Search Index</h4>
                        </div>
                        <p className="text-xs text-blue-600 mb-2"><strong>Purpose:</strong> Fast retrieval</p>
                        <p className="text-xs text-blue-600 mb-2"><strong>Technology:</strong> Elasticsearch, Solr</p>
                        <p className="text-xs text-blue-600"><strong>Schema:</strong> Denormalized</p>
                        <div className="bg-zinc-900 text-zinc-100 p-2 rounded font-mono text-xs mt-3 overflow-x-auto">
                            <div>{`{`}</div>
                            <div className="pl-4"><span className="text-amber-400">&quot;title&quot;</span>: <span className="text-green-400">&quot;Nike Air Max&quot;</span>,</div>
                            <div className="pl-4"><span className="text-amber-400">&quot;brand&quot;</span>: <span className="text-green-400">&quot;Nike&quot;</span></div>
                            <div>{`}`}</div>
                        </div>
                    </div>
                    <div className="bg-green-50 border-2 border-green-300 p-5 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Server className="w-5 h-5 text-green-600" />
                            <h4 className="font-bold text-green-900">View 3: Feature Store</h4>
                        </div>
                        <p className="text-xs text-green-600 mb-2"><strong>Purpose:</strong> Fast ML feature lookup</p>
                        <p className="text-xs text-green-600 mb-2"><strong>Technology:</strong> Redis, Feast</p>
                        <p className="text-xs text-green-600"><strong>Schema:</strong> Aggregated signals</p>
                        <div className="bg-zinc-900 text-zinc-100 p-2 rounded font-mono text-xs mt-3 overflow-x-auto">
                            <div><span className="text-blue-400">class</span> ProductFeatures:</div>
                            <div className="pl-4">entities = [<span className="text-green-400">&quot;product_id&quot;</span>]</div>
                            <div className="pl-4">features = [...]</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Flow Architecture */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Data Flow Architecture</h2>
                <p className="text-foreground leading-relaxed">
                    How does data flow from your source database to all three views? The answer is <strong>event-driven
                        architecture</strong> with Kafka at the center. Changes in your database are captured via CDC (Change Data
                    Capture), streamed through Kafka, and processed by Flink/Spark to populate each view appropriately.
                    This pattern ensures consistency without dangerous dual-writes.
                </p>
                {/* Visual Flow Diagram */}
                <div className="bg-gradient-to-b from-zinc-900 to-zinc-800 rounded-xl p-8 overflow-x-auto">
                    {/* Row 1: Data Sources */}
                    <div className="flex justify-center gap-16 mb-6">
                        <div className="text-center">
                            <div className="bg-blue-600 text-white px-6 py-4 rounded-lg border-2 border-blue-400 shadow-lg shadow-blue-500/20">
                                <Database className="w-6 h-6 mx-auto mb-2" />
                                <div className="font-bold text-sm">Source DB</div>
                                <div className="text-xs text-blue-200">PostgreSQL</div>
                            </div>
                            <div className="mt-2 text-xs text-amber-400 font-mono">CDC (Debezium)</div>
                            <div className="text-zinc-400 text-2xl">↓</div>
                        </div>
                        <div className="text-center">
                            <div className="bg-rose-600 text-white px-6 py-4 rounded-lg border-2 border-rose-400 shadow-lg shadow-rose-500/20">
                                <BarChart3 className="w-6 h-6 mx-auto mb-2" />
                                <div className="font-bold text-sm">Click Stream</div>
                                <div className="text-xs text-rose-200">Frontend Events</div>
                            </div>
                            <div className="mt-2 text-xs text-amber-400 font-mono">Raw Events</div>
                            <div className="text-zinc-400 text-2xl">↓</div>
                        </div>
                    </div>

                    {/* Row 2: Kafka */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-amber-600 text-white px-10 py-4 rounded-lg border-2 border-amber-400 shadow-lg shadow-amber-500/30">
                            <div className="font-bold text-lg text-center">Apache Kafka</div>
                            <div className="text-xs text-amber-100 text-center">Event Streaming Platform</div>
                        </div>
                    </div>
                    <div className="text-center text-zinc-400 text-2xl mb-4">↓</div>

                    {/* Row 3: Stream Processor */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-purple-600 text-white px-8 py-4 rounded-lg border-2 border-purple-400 shadow-lg shadow-purple-500/30">
                            <div className="font-bold text-center">Stream Processor</div>
                            <div className="text-xs text-purple-200 text-center">Flink / Spark Streaming</div>
                        </div>
                    </div>

                    {/* Branching arrows */}
                    <div className="flex justify-center gap-16 text-zinc-400 mb-4">
                        <span className="text-2xl">↓</span>
                        <span className="text-2xl">↓</span>
                        <span className="text-2xl">↓</span>
                    </div>

                    {/* Row 4: Output Sinks */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-emerald-600 text-white p-4 rounded-lg border-2 border-emerald-400 text-center shadow-lg shadow-emerald-500/20">
                            <Layers className="w-5 h-5 mx-auto mb-1" />
                            <div className="font-bold text-sm">Search Index</div>
                            <div className="text-xs text-emerald-200">Elasticsearch</div>
                        </div>
                        <div className="bg-cyan-600 text-white p-4 rounded-lg border-2 border-cyan-400 text-center shadow-lg shadow-cyan-500/20">
                            <Server className="w-5 h-5 mx-auto mb-1" />
                            <div className="font-bold text-sm">Feature Store</div>
                            <div className="text-xs text-cyan-200">Redis / Feast</div>
                        </div>
                        <div className="bg-zinc-600 text-white p-4 rounded-lg border-2 border-zinc-400 text-center shadow-lg shadow-zinc-500/20">
                            <Database className="w-5 h-5 mx-auto mb-1" />
                            <div className="font-bold text-sm">Data Lake</div>
                            <div className="text-xs text-zinc-300">S3 / GCS</div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-xl border-2 border-green-500 bg-green-50 p-4">
                        <h4 className="font-bold text-green-800 mb-2">✓ Key Principles</h4>
                        <ul className="text-xs text-green-900 space-y-1">
                            <li>• <strong>Never dual-write:</strong> Don&apos;t write to DB and Search simultaneously</li>
                            <li>• <strong>Single source of truth:</strong> DB is authoritative, Search is a view</li>
                            <li>• <strong>Event-driven:</strong> Changes flow through Kafka, not direct API calls</li>
                            <li>• <strong>Rebuildable:</strong> Search index can be recreated from DB + Feature Store</li>
                        </ul>
                    </div>
                    <div className="rounded-xl border-2 border-red-500 bg-red-50 p-4">
                        <h4 className="font-bold text-red-800 mb-2">✗ Common Mistakes</h4>
                        <ul className="text-xs text-red-900 space-y-1">
                            <li>• Writing directly to Elasticsearch from application</li>
                            <li>• No CDC, leading to stale data</li>
                            <li>• Treating search as source of truth</li>
                            <li>• No way to rebuild index from scratch</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/data/quality" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 4.1 Data Quality
                </Link>
                <Link href="/search/data/modeling" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Next: Document Modeling <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
