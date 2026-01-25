import { AlertTriangle, CheckCircle2, Database, DollarSign, ShieldAlert, Zap, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "It's a Data Problem", description: "80% of search quality failures are data issues, not algorithm issues. Ranking models cannot fix broken data." },
    { title: "The Five Failures", description: "Field Contamination, Schema Drift, Implicit Nulls, Semantic Duplication, and Join Loss are the most common root causes." },
    { title: "High ROI Fixes", description: "Simple ingestion gates (like rejecting null prices) can save millions in lost revenue with minimal engineering effort." },
    { title: "Automate Quality", description: "Build automated quality gates in your ingestion pipeline. Reject bad data before it enters the index." }
];

export default function QualityPage() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 4.1: Data Foundation</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Quality as a Data Problem</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Most engineering teams treat search as a <strong>Ranking Problem</strong> (Algorithms, Learning to Rank, Vectors).
                    In reality, <strong>80% of search quality failures are Data Problems</strong>. No ranking model can fix broken data.
                </p>
            </div>

            <hr className="border-border" />

            {/* The Multiplication Rule */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">The Core Thesis: The Multiplication Rule</h2>
                <p className="text-foreground leading-relaxed">
                    Search quality is a product of multiple factors, not a sum. When you multiply components together,
                    a weakness in any single factor drags down the entire result. This fundamental truth explains why
                    teams who focus exclusively on ranking algorithms often fail to improve user experience they&apos;re
                    optimizing a multiplier while ignoring a factor that may be stuck at 0.5.
                </p>
                <div className="bg-primary text-primary-foreground p-8 rounded-xl">
                    <p className="text-2xl font-mono text-center">
                        Final_Score = DataQuality × QueryUnderstanding × RankingModel
                    </p>
                </div>
                <p className="text-foreground leading-relaxed">
                    If DataQuality = 0.5 (50% of data is correct), your maximum possible score is 0.5.
                    No amount of BERT fine-tuning or vector embeddings can overcome garbage data. This is the fundamental law of search quality.
                </p>
            </section>

            {/* Real World Examples */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">The Cost of Bad Data: Real-World Examples</h2>
                <p className="text-foreground leading-relaxed">
                    Data quality failures aren&apos;t abstract concerns they have concrete, measurable costs. The following
                    case studies come from real production systems and demonstrate how seemingly small data issues
                    can cascade into millions of dollars in lost revenue or, in critical domains, put lives at risk.
                </p>

                {/* Example 1: The $1.25M/day Null Price Bug */}
                <div className="rounded-xl border-2 border-red-500 bg-red-50 p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-red-600" />
                        <h3 className="text-xl font-bold text-red-900">Example 1: The $1.25M/day Null Price Bug</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2 text-sm text-red-800">
                            <p><strong>Company:</strong> Mid-size E-commerce (10M products)</p>
                            <p><strong>Bug:</strong> 5% of products had <code className="bg-red-100 px-1 rounded">price: null</code></p>
                            <p><strong>UI Behavior:</strong> Displayed as &quot;$0.00&quot;</p>
                            <p><strong>User Behavior:</strong> Clicked, saw real price in cart, abandoned</p>
                        </div>
                        <div className="bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-xs">
                            <div className="text-zinc-500">// The Math</div>
                            <div>Daily searches: 1,000,000</div>
                            <div>Searches showing null-price products: 5%</div>
                            <div>Users clicking &quot;$0.00&quot; items: 20%</div>
                            <div>Abandonment when real price seen: 90%</div>
                            <div>Average Order Value: $50</div>
                            <div className="mt-2 pt-2 border-t border-zinc-700">
                                Lost orders = 1M × 0.05 × 0.20 × 0.90 = 9,000/day
                            </div>
                            <div className="font-bold text-red-400">Lost revenue = 9,000 × $50 = $450,000/day</div>
                        </div>
                    </div>
                    <div className="bg-green-100 p-3 rounded text-sm text-green-800">
                        <strong>Fix:</strong> Added ingestion gate that rejected products without valid price.
                        <br /><strong>Time to fix:</strong> 2 hours of engineering.
                        <br /><strong>ROI:</strong> $450K × 365 = $164M/year saved by a 2-hour fix.
                    </div>
                </div>

                {/* Example 2: The Pandemic Mask Crisis */}
                <div className="rounded-xl border-2 border-amber-500 bg-amber-50 p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="w-6 h-6 text-amber-600" />
                        <h3 className="text-xl font-bold text-amber-900">Example 2: The Pandemic Mask Crisis (Field Nulls)</h3>
                    </div>
                    <p className="text-sm text-amber-800">
                        <strong>Company:</strong> Healthcare marketplace | <strong>Context:</strong> March 2020, N95 mask shortage
                        <br /><strong>Bug:</strong> <code className="bg-amber-100 px-1 rounded">mask_type</code> field was optional in schema.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-zinc-900 text-zinc-100 p-3 rounded font-mono text-xs overflow-x-auto">
                            <div className="text-green-400 mb-1">// 80% indexed correctly</div>
                            <div>{`{ `}<span className="text-amber-400">&quot;title&quot;</span>: <span className="text-green-400">&quot;3M N95 Respirator&quot;</span>, <span className="text-amber-400">&quot;mask_type&quot;</span>: <span className="text-green-400">&quot;N95&quot;</span> {`}`}</div>
                        </div>
                        <div className="bg-zinc-900 text-zinc-100 p-3 rounded font-mono text-xs overflow-x-auto">
                            <div className="text-red-400 mb-1">// 20% missing field entirely</div>
                            <div>{`{ `}<span className="text-amber-400">&quot;title&quot;</span>: <span className="text-green-400">&quot;KN95 Professional Mask&quot;</span> {`}`}</div>
                            <div className="text-red-500 mt-1">// mask_type field completely absent</div>
                        </div>
                    </div>
                    <div className="bg-red-100 p-3 rounded text-sm text-red-800">
                        <strong>The Query:</strong> <code>{`{ "query": { "term": { "mask_type": "N95" } } }`}</code>
                        <br /><strong>Result:</strong> 20% of legitimate N95/KN95 masks returned 0 results. During a pandemic. With life-or-death stakes.
                    </div>
                    <div className="bg-zinc-900 text-zinc-100 p-4 rounded font-mono text-xs overflow-x-auto">
                        <div className="text-zinc-500"># Fix: Ingestion validator</div>
                        <div><span className="text-blue-400">def</span> <span className="text-amber-400">validate_mask</span>(doc):</div>
                        <div className="pl-4"><span className="text-blue-400">if</span> <span className="text-green-400">&quot;mask&quot;</span> <span className="text-blue-400">in</span> doc[<span className="text-green-400">&quot;title&quot;</span>].lower():</div>
                        <div className="pl-8"><span className="text-blue-400">if</span> <span className="text-green-400">&quot;mask_type&quot;</span> <span className="text-blue-400">not in</span> doc <span className="text-blue-400">or</span> doc[<span className="text-green-400">&quot;mask_type&quot;</span>] <span className="text-blue-400">is None</span>:</div>
                        <div className="pl-12"><span className="text-blue-400">raise</span> ValidationError(<span className="text-green-400">&quot;mask_type required for mask products&quot;</span>)</div>
                    </div>
                </div>

                {/* Example 3: SEO Spam */}
                <div className="rounded-xl border-2 border-purple-500 bg-purple-50 p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <Database className="w-6 h-6 text-purple-600" />
                        <h3 className="text-xl font-bold text-purple-900">Example 3: The &quot;iPhone Case&quot; SEO Spam (Field Contamination)</h3>
                    </div>
                    <p className="text-sm text-purple-800">
                        <strong>Company:</strong> Electronics marketplace | <strong>Bug:</strong> Sellers stuffed keywords into product titles
                    </p>
                    <div className="bg-zinc-900 text-zinc-100 p-3 rounded font-mono text-xs overflow-x-auto">
                        <div>{`{`}</div>
                        <div className="pl-4"><span className="text-amber-400">&quot;title&quot;</span>: <span className="text-green-400">&quot;iPhone 15 Pro Max Case Cover Samsung Galaxy S24...&quot;</span>,</div>
                        <div className="pl-4"><span className="text-amber-400">&quot;actual_compatibility&quot;</span>: [<span className="text-green-400">&quot;iPhone 15 Pro Max&quot;</span>]</div>
                        <div>{`}`}</div>
                    </div>
                    <div className="text-sm text-purple-800">
                        <strong>The Problem:</strong>
                        <ul className="list-disc pl-5 mt-1">
                            <li>User searches &quot;Samsung Galaxy S24 case&quot;</li>
                            <li>Results show iPhone cases (because &quot;Samsung Galaxy S24&quot; is in title)</li>
                            <li>User loses trust, leaves site</li>
                        </ul>
                    </div>
                    <div className="bg-zinc-900 text-zinc-100 p-4 rounded font-mono text-xs overflow-x-auto">
                        <div className="text-zinc-500"># Detection Algorithm</div>
                        <div><span className="text-blue-400">def</span> <span className="text-amber-400">detect_title_spam</span>(title, category):</div>
                        <div className="pl-4">expected_brands = get_category_brands(category)</div>
                        <div className="pl-4">title_brands = extract_brand_mentions(title)</div>
                        <div className="pl-4 mt-2 text-zinc-500"># If title has &gt; 3 brand mentions, likely spam</div>
                        <div className="pl-4"><span className="text-blue-400">if</span> len(title_brands) &gt; <span className="text-blue-400">3</span>:</div>
                        <div className="pl-8"><span className="text-blue-400">return True</span></div>
                        <div className="pl-4 mt-2 text-zinc-500"># If title mentions brands outside category</div>
                        <div className="pl-4">foreign_brands = title_brands - expected_brands</div>
                        <div className="pl-4"><span className="text-blue-400">if</span> len(foreign_brands) &gt; <span className="text-blue-400">1</span>:</div>
                        <div className="pl-8"><span className="text-blue-400">return True</span></div>
                        <div className="pl-4 mt-2"><span className="text-blue-400">return False</span></div>
                        <div className="mt-2 text-zinc-500"># Action: Flagged docs get quality_score: 0.1</div>
                    </div>
                </div>
            </section>

            {/* The Five Data Quality Failures */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">The Five Data Quality Failures </h2>
                <p className="text-foreground leading-relaxed">
                    After analyzing hundreds of search quality incidents across different companies and domains,
                    a clear pattern emerges: most failures fall into one of five categories. Understanding this
                    taxonomy helps you build systematic defenses and quickly diagnose issues when they occur.
                </p>

                {/* A. Field Contamination */}
                <div className="rounded-xl border-2 border-zinc-300 bg-zinc-50 p-6 space-y-4">
                    <h3 className="text-lg font-bold text-zinc-900">A. Field Contamination</h3>
                    <p className="text-sm text-zinc-700"><strong>Definition:</strong> Wrong data in the right field.</p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded border border-zinc-200">
                            <div className="text-xs font-bold text-red-700 mb-1">❌ Bad: HTML in Description</div>
                            <div className="font-mono text-xs bg-zinc-900 text-zinc-100 p-2 rounded">
                                {`description: "<div class=\\"product-info\\"><p>Great <b>shoes</b>!</p></div>"`}
                            </div>
                            <div className="text-xs text-zinc-500 mt-2">
                                Tokens: [&quot;div&quot;, &quot;class&quot;, &quot;product&quot;, &quot;info&quot;, &quot;p&quot;, &quot;great&quot;, &quot;b&quot;, &quot;shoes&quot;]
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded border border-zinc-200">
                            <div className="text-xs font-bold text-green-700 mb-1">✓ Fix: HTML stripping at ingestion</div>
                            <div className="font-mono text-xs bg-zinc-900 text-zinc-100 p-2 rounded overflow-x-auto">
                                <div><span className="text-blue-400">from</span> bs4 <span className="text-blue-400">import</span> BeautifulSoup</div>
                                <div className="mt-2"><span className="text-blue-400">def</span> <span className="text-amber-400">clean_html</span>(text):</div>
                                <div className="pl-4">soup = BeautifulSoup(text, <span className="text-green-400">&quot;html.parser&quot;</span>)</div>
                                <div className="pl-4"><span className="text-blue-400">return</span> soup.get_text(separator=<span className="text-green-400">&quot; &quot;</span>).strip()</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* B. Schema Drift */}
                <div className="rounded-xl border-2 border-zinc-300 bg-zinc-50 p-6 space-y-4">
                    <h3 className="text-lg font-bold text-zinc-900">B. Schema Drift</h3>
                    <p className="text-sm text-zinc-700"><strong>Definition:</strong> Field type changes over time without migration.</p>
                    <div className="bg-zinc-900 text-zinc-100 p-4 rounded font-mono text-xs">
                        <div className="text-zinc-500"># Timeline Example</div>
                        <div>2022-01: color = &quot;Red&quot;           <span className="text-zinc-500"># string</span></div>
                        <div>2022-06: color = &quot;RED&quot;           <span className="text-zinc-500"># different case</span></div>
                        <div>2023-01: color = &quot;#FF0000&quot;       <span className="text-zinc-500"># hex code</span></div>
                        <div>2023-06: color = {`{"name": "Red", "hex": "#FF0000"}`}  <span className="text-zinc-500"># object!</span></div>
                    </div>
                    <div className="text-sm text-zinc-700">
                        <strong>Elasticsearch Behavior:</strong> First document sets the mapping. Conflicting types cause indexing failures. Silent data loss if dynamic mapping is off.
                    </div>
                </div>

                {/* C. The Implicit Null Problem */}
                <div className="rounded-xl border-2 border-zinc-300 bg-zinc-50 p-6 space-y-4">
                    <h3 className="text-lg font-bold text-zinc-900">C. The Implicit Null Problem</h3>
                    <p className="text-sm text-zinc-700"><strong>Definition:</strong> Missing fields treated inconsistently.</p>
                    <div className="bg-zinc-900 text-zinc-100 p-4 rounded font-mono text-xs overflow-x-auto">
                        <div className="text-zinc-500"># The ranking formula</div>
                        <div><span className="text-blue-400">def</span> <span className="text-amber-400">rank_score</span>(doc):</div>
                        <div className="pl-4">relevance = calculate_bm25(query, doc)</div>
                        <div className="pl-4">popularity = doc.get(<span className="text-green-400">&quot;click_count&quot;</span>, <span className="text-red-400">???</span>)  <span className="text-zinc-500"># What value for new items?</span></div>
                        <div className="pl-4"><span className="text-blue-400">return</span> relevance * <span className="text-blue-400">0.7</span> + popularity * <span className="text-blue-400">0.3</span></div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="bg-zinc-100">
                                <th className="text-left px-3 py-2">Strategy</th>
                                <th className="text-left px-3 py-2">Value for Null</th>
                                <th className="text-left px-3 py-2">Effect</th>
                            </tr></thead>
                            <tbody className="bg-white">
                                <tr><td className="px-3 py-2">Zero</td><td className="px-3 py-2">0</td><td className="px-3 py-2">New items buried at bottom</td></tr>
                                <tr><td className="px-3 py-2">Average</td><td className="px-3 py-2">500</td><td className="px-3 py-2">Spam gets free boost</td></tr>
                                <tr><td className="px-3 py-2">Negative</td><td className="px-3 py-2">-1</td><td className="px-3 py-2">Explicitly deprioritized</td></tr>
                                <tr className="bg-green-50"><td className="px-3 py-2 font-bold">Median (Best)</td><td className="px-3 py-2">100</td><td className="px-3 py-2">Neutral starting point</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-zinc-900 text-zinc-100 p-4 rounded font-mono text-xs overflow-x-auto">
                        <div className="text-zinc-500"># Best Practice</div>
                        <div><span className="text-blue-400">def</span> <span className="text-amber-400">safe_popularity</span>(doc):</div>
                        <div className="pl-4"><span className="text-blue-400">if</span> <span className="text-green-400">&quot;click_count&quot;</span> <span className="text-blue-400">not in</span> doc <span className="text-blue-400">or</span> doc[<span className="text-green-400">&quot;click_count&quot;</span>] <span className="text-blue-400">is None</span>:</div>
                        <div className="pl-8 text-zinc-500"># Use category median, not global</div>
                        <div className="pl-8"><span className="text-blue-400">return</span> get_category_median_clicks(doc[<span className="text-green-400">&quot;category&quot;</span>])</div>
                        <div className="pl-4"><span className="text-blue-400">return</span> doc[<span className="text-green-400">&quot;click_count&quot;</span>]</div>
                    </div>
                </div>

                {/* D. Semantic Duplication */}
                <div className="rounded-xl border-2 border-zinc-300 bg-zinc-50 p-6 space-y-4">
                    <h3 className="text-lg font-bold text-zinc-900">D. Semantic Duplication</h3>
                    <p className="text-sm text-zinc-700"><strong>Definition:</strong> Same real-world entity indexed multiple times.</p>
                    <div className="bg-zinc-900 text-zinc-100 p-4 rounded font-mono text-xs overflow-x-auto">
                        <div className="text-zinc-500">// Seller A</div>
                        <div>{`{ `}<span className="text-amber-400">&quot;id&quot;</span>: <span className="text-green-400">&quot;seller-a-iphone15&quot;</span>, <span className="text-amber-400">&quot;title&quot;</span>: <span className="text-green-400">&quot;Apple iPhone 15 128GB&quot;</span> {`}`}</div>
                        <div className="text-zinc-500 mt-2">// Seller B</div>
                        <div>{`{ `}<span className="text-amber-400">&quot;id&quot;</span>: <span className="text-green-400">&quot;seller-b-iphone15&quot;</span>, <span className="text-amber-400">&quot;title&quot;</span>: <span className="text-green-400">&quot;iPhone 15 128 GB (Apple)&quot;</span> {`}`}</div>
                        <div className="text-zinc-500 mt-2">// Seller C</div>
                        <div>{`{ `}<span className="text-amber-400">&quot;id&quot;</span>: <span className="text-green-400">&quot;seller-c-iphone15&quot;</span>, <span className="text-amber-400">&quot;title&quot;</span>: <span className="text-green-400">&quot;APPLE iPHONE 15 - 128GB&quot;</span> {`}`}</div>
                    </div>
                    <p className="text-sm text-zinc-700">
                        <strong>User Search:</strong> &quot;iPhone 15&quot; → <strong>Results Page:</strong> Same phone shown 3 times, variety destroyed
                    </p>
                    <div className="bg-zinc-900 text-zinc-100 p-4 rounded font-mono text-xs overflow-x-auto">
                        <div className="text-zinc-500"># Solution: Entity Resolution Pipeline</div>
                        <div><span className="text-blue-400">def</span> <span className="text-amber-400">deduplicate_results</span>(results):</div>
                        <div className="pl-4">seen_entities = set()</div>
                        <div className="pl-4">unique_results = []</div>
                        <div className="pl-4 mt-2"><span className="text-blue-400">for</span> result <span className="text-blue-400">in</span> results:</div>
                        <div className="pl-8 text-zinc-500"># Get canonical entity ID</div>
                        <div className="pl-8">entity_id = get_entity_id(result)</div>
                        <div className="pl-8 mt-2"><span className="text-blue-400">if</span> entity_id <span className="text-blue-400">not in</span> seen_entities:</div>
                        <div className="pl-12">seen_entities.add(entity_id)</div>
                        <div className="pl-12">unique_results.append(result)</div>
                        <div className="pl-4 mt-2"><span className="text-blue-400">return</span> unique_results</div>
                    </div>
                </div>

                {/* E. Join Loss */}
                <div className="rounded-xl border-2 border-zinc-300 bg-zinc-50 p-6 space-y-4">
                    <h3 className="text-lg font-bold text-zinc-900">E. Join Loss</h3>
                    <p className="text-sm text-zinc-700"><strong>Definition:</strong> Related entities become stale/inconsistent.</p>
                    <div className="text-sm space-y-1">
                        <div>Day 1: Brand &quot;Facebook&quot; exists with brand_id: 123</div>
                        <div>Day 2: Brand renamed to &quot;Meta&quot; in Brand table</div>
                        <div className="text-red-600 font-bold">Day 3: Products still show &quot;Facebook&quot; in search (stale join)</div>
                    </div>
                    <div className="bg-zinc-900 text-zinc-100 p-4 rounded font-mono text-xs overflow-x-auto">
                        <div className="text-zinc-500"># Fix: Event-Driven Reindexing</div>
                        <div><span className="text-amber-400">@on_event</span>(<span className="text-green-400">&quot;brand.updated&quot;</span>)</div>
                        <div><span className="text-blue-400">def</span> <span className="text-amber-400">handle_brand_update</span>(brand_id, new_data):</div>
                        <div className="pl-4">products = get_products_by_brand(brand_id)</div>
                        <div className="pl-4"><span className="text-blue-400">for</span> product <span className="text-blue-400">in</span> products:</div>
                        <div className="pl-8 text-zinc-500"># Reindex with fresh brand data</div>
                        <div className="pl-8">reindex_product(product.id)</div>
                    </div>
                </div>
            </section>

            {/* Building a Data Quality System */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Engineering: Building a Data Quality System</h2>
                <p className="text-foreground leading-relaxed">
                    Knowing the failure modes is only half the battle. You need automated systems that catch problems
                    before they reach production. The following patterns show how to build quality gates into your
                    ingestion pipeline, turning reactive firefighting into proactive prevention.
                </p>

                <div className="bg-zinc-900 rounded-xl p-6 font-mono text-sm text-zinc-100 overflow-x-auto">
                    <div className="text-zinc-500 mb-4"># The Quality Score Card - Ingestion Validator</div>
                    <div><span className="text-blue-400">class</span> <span className="text-amber-400">DataQualityValidator</span>:</div>
                    <div className="mt-2 pl-4">RULES = {`{`}</div>
                    <div className="pl-8"><span className="text-green-400">&quot;title&quot;</span>: {`{`}</div>
                    <div className="pl-12"><span className="text-green-400">&quot;required&quot;</span>: <span className="text-blue-400">True</span>,</div>
                    <div className="pl-12"><span className="text-green-400">&quot;min_length&quot;</span>: <span className="text-blue-400">10</span>,</div>
                    <div className="pl-12"><span className="text-green-400">&quot;max_length&quot;</span>: <span className="text-blue-400">200</span>,</div>
                    <div className="pl-12"><span className="text-green-400">&quot;no_html&quot;</span>: <span className="text-blue-400">True</span>,</div>
                    <div className="pl-8">{`}`},</div>
                    <div className="pl-8"><span className="text-green-400">&quot;price&quot;</span>: {`{`}</div>
                    <div className="pl-12"><span className="text-green-400">&quot;required&quot;</span>: <span className="text-blue-400">True</span>,</div>
                    <div className="pl-12"><span className="text-green-400">&quot;type&quot;</span>: <span className="text-green-400">&quot;float&quot;</span>,</div>
                    <div className="pl-12"><span className="text-green-400">&quot;min_value&quot;</span>: <span className="text-blue-400">0.01</span>,</div>
                    <div className="pl-12"><span className="text-green-400">&quot;max_value&quot;</span>: <span className="text-blue-400">1000000</span>,</div>
                    <div className="pl-8">{`}`},</div>
                    <div className="pl-8"><span className="text-green-400">&quot;image_url&quot;</span>: {`{`}</div>
                    <div className="pl-12"><span className="text-green-400">&quot;required&quot;</span>: <span className="text-blue-400">True</span>,</div>
                    <div className="pl-12"><span className="text-green-400">&quot;must_resolve&quot;</span>: <span className="text-blue-400">True</span>,  <span className="text-zinc-500"># HTTP 200</span></div>
                    <div className="pl-12"><span className="text-green-400">&quot;min_dimensions&quot;</span>: (<span className="text-blue-400">100</span>, <span className="text-blue-400">100</span>),</div>
                    <div className="pl-8">{`}`},</div>
                    <div className="pl-4">{`}`}</div>
                    <div className="mt-4 pl-4"><span className="text-blue-400">def</span> <span className="text-amber-400">validate</span>(<span className="text-amber-400">self</span>, doc):</div>
                    <div className="pl-8">score = <span className="text-blue-400">1.0</span></div>
                    <div className="pl-8">errors = []</div>
                    <div className="pl-8 mt-2"><span className="text-blue-400">for</span> field, rules <span className="text-blue-400">in</span> self.RULES.items():</div>
                    <div className="pl-12">field_score, field_errors = self.validate_field(doc, field, rules)</div>
                    <div className="pl-12">score *= field_score</div>
                    <div className="pl-12">errors.extend(field_errors)</div>
                    <div className="pl-8 mt-2"><span className="text-blue-400">return</span> {`{`}</div>
                    <div className="pl-12"><span className="text-green-400">&quot;score&quot;</span>: score,</div>
                    <div className="pl-12"><span className="text-green-400">&quot;passed&quot;</span>: score &gt;= <span className="text-blue-400">0.8</span>,</div>
                    <div className="pl-12"><span className="text-green-400">&quot;errors&quot;</span>: errors</div>
                    <div className="pl-8">{`}`}</div>
                </div>

                {/* Quality Metrics Dashboard */}
                <h3 className="text-xl font-bold">Quality Metrics Dashboard</h3>
                <p className="text-foreground leading-relaxed">
                    Every data quality system needs measurable metrics with alerting thresholds. The following five dimensions
                    cover the essential aspects of data health. When any metric drops below its threshold, automated alerts
                    should notify the team before bad data reaches users.
                </p>
                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">Metric</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Formula</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Alert Threshold</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                            <tr><td className="px-4 py-3 font-medium text-foreground">Completeness</td><td className="px-4 py-3 font-mono text-xs text-foreground">docs_with_field / total_docs</td><td className="px-4 py-3 text-red-600 font-bold">&lt; 99.9%</td></tr>
                            <tr><td className="px-4 py-3 font-medium text-foreground">Validity</td><td className="px-4 py-3 font-mono text-xs text-foreground">valid_values / non_null_values</td><td className="px-4 py-3 text-red-600 font-bold">&lt; 99%</td></tr>
                            <tr><td className="px-4 py-3 font-medium text-foreground">Freshness</td><td className="px-4 py-3 font-mono text-xs text-foreground">now - last_updated</td><td className="px-4 py-3 text-red-600 font-bold">&gt; 24 hours</td></tr>
                            <tr><td className="px-4 py-3 font-medium text-foreground">Uniqueness</td><td className="px-4 py-3 font-mono text-xs text-foreground">unique_entities / total_docs</td><td className="px-4 py-3 text-red-600 font-bold">&lt; 95%</td></tr>
                            <tr><td className="px-4 py-3 font-medium text-foreground">Consistency</td><td className="px-4 py-3 font-mono text-xs text-foreground">docs_matching_schema / total_docs</td><td className="px-4 py-3 text-red-600 font-bold">&lt; 99.99%</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* The Quality Score Formula */}
                <div className="bg-zinc-100 border-2 border-zinc-200 p-6 rounded-xl space-y-4">
                    <h4 className="font-bold text-zinc-900">The Quality Score Formula</h4>
                    <p className="text-sm text-zinc-700">
                        The quality score combines all field-level checks into a single number between 0 and 1. Each field
                        contributes based on its completeness (C), validity (V), and business weight (w). The geometric mean
                        ensures that a zero in any critical field tanks the entire score.
                    </p>
                    <div className="bg-white p-4 rounded border font-mono text-center text-lg">
                        QS(d) = ∏<sub>i=1</sub><sup>n</sup> (w<sub>i</sub> · C(f<sub>i</sub>) · V(f<sub>i</sub>))<sup>1/n</sup>
                    </div>
                    <div className="text-sm text-zinc-600">
                        Where: C(f<sub>i</sub>) = Completeness (1 if present, 0 if null), V(f<sub>i</sub>) = Validity (1 if valid, 0-1 if partially valid), w<sub>i</sub> = Business weight
                    </div>

                    {/* Worked Example */}
                    <div className="bg-white border border-zinc-300 rounded-lg p-4 space-y-3">
                        <h5 className="font-bold text-zinc-800">Worked Example: Product Document</h5>
                        <div className="bg-zinc-900 text-zinc-100 p-3 rounded font-mono text-xs overflow-x-auto">
                            <div>{`{ `}<span className="text-amber-400">&quot;title&quot;</span>: <span className="text-green-400">&quot;Nike Air Max&quot;</span>, <span className="text-amber-400">&quot;price&quot;</span>: <span className="text-blue-400">129.99</span>, <span className="text-amber-400">&quot;image_url&quot;</span>: <span className="text-red-400">null</span> {`}`}</div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-3 text-sm">
                            <div className="bg-green-50 p-3 rounded border border-green-200">
                                <div className="font-bold text-green-800">title (w=1.0)</div>
                                <div className="text-green-700">C=1, V=1 → <span className="font-mono">1.0 × 1 × 1 = 1.0</span></div>
                            </div>
                            <div className="bg-green-50 p-3 rounded border border-green-200">
                                <div className="font-bold text-green-800">price (w=1.0)</div>
                                <div className="text-green-700">C=1, V=1 → <span className="font-mono">1.0 × 1 × 1 = 1.0</span></div>
                            </div>
                            <div className="bg-red-50 p-3 rounded border border-red-200">
                                <div className="font-bold text-red-800">image_url (w=0.8)</div>
                                <div className="text-red-700">C=0, V=0 → <span className="font-mono">0.8 × 0 × 0 = 0</span></div>
                            </div>
                        </div>
                        <div className="bg-amber-50 p-3 rounded border border-amber-300 text-center">
                            <span className="font-mono text-amber-900">QS = (1.0 × 1.0 × 0)<sup>1/3</sup> = <strong className="text-red-600">0.0</strong></span>
                            <div className="text-sm text-amber-700 mt-1">→ Missing image kills the score. Document rejected.</div>
                        </div>
                    </div>
                </div>

                {/* Decision Rule with Examples */}
                <h4 className="font-bold text-zinc-900">Decision Rules with Examples</h4>
                <div className="grid md:grid-cols-3 gap-4">
                    {/* Green: Perfect Score */}
                    <div className="bg-green-50 border-2 border-green-300 p-4 rounded-xl space-y-3">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-800">QS ≥ 0.9</div>
                            <div className="text-sm text-green-700">Index immediately</div>
                        </div>
                        <div className="bg-zinc-900 text-zinc-100 p-2 rounded font-mono text-xs overflow-x-auto">
                            <div>{`{`}</div>
                            <div className="pl-2"><span className="text-amber-400">&quot;title&quot;</span>: <span className="text-green-400">&quot;Nike Air Max 90&quot;</span>,</div>
                            <div className="pl-2"><span className="text-amber-400">&quot;price&quot;</span>: <span className="text-blue-400">129.99</span>,</div>
                            <div className="pl-2"><span className="text-amber-400">&quot;image&quot;</span>: <span className="text-green-400">&quot;✓ Valid URL&quot;</span></div>
                            <div>{`}`}</div>
                        </div>
                        <div className="text-center font-mono text-sm text-green-800">
                            QS = <span className="font-bold">0.95</span> ✓
                        </div>
                    </div>

                    {/* Amber: Partial Score */}
                    <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-xl space-y-3">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-amber-800">0.7 ≤ QS &lt; 0.9</div>
                            <div className="text-sm text-amber-700">Index with warning</div>
                        </div>
                        <div className="bg-zinc-900 text-zinc-100 p-2 rounded font-mono text-xs overflow-x-auto">
                            <div>{`{`}</div>
                            <div className="pl-2"><span className="text-amber-400">&quot;title&quot;</span>: <span className="text-green-400">&quot;Shoe&quot;</span>, <span className="text-zinc-500">// too short</span></div>
                            <div className="pl-2"><span className="text-amber-400">&quot;price&quot;</span>: <span className="text-blue-400">129.99</span>,</div>
                            <div className="pl-2"><span className="text-amber-400">&quot;image&quot;</span>: <span className="text-green-400">&quot;✓ Valid URL&quot;</span></div>
                            <div>{`}`}</div>
                        </div>
                        <div className="text-center font-mono text-sm text-amber-800">
                            QS = <span className="font-bold">0.78</span> ⚠️
                        </div>
                    </div>

                    {/* Red: Failed Score */}
                    <div className="bg-red-50 border-2 border-red-300 p-4 rounded-xl space-y-3">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-800">QS &lt; 0.7</div>
                            <div className="text-sm text-red-700">Reject document</div>
                        </div>
                        <div className="bg-zinc-900 text-zinc-100 p-2 rounded font-mono text-xs overflow-x-auto">
                            <div>{`{`}</div>
                            <div className="pl-2"><span className="text-amber-400">&quot;title&quot;</span>: <span className="text-green-400">&quot;Nike Air Max&quot;</span>,</div>
                            <div className="pl-2"><span className="text-amber-400">&quot;price&quot;</span>: <span className="text-red-400">null</span>,</div>
                            <div className="pl-2"><span className="text-amber-400">&quot;image&quot;</span>: <span className="text-red-400">&quot;broken.jpg&quot;</span></div>
                            <div>{`}`}</div>
                        </div>
                        <div className="text-center font-mono text-sm text-red-800">
                            QS = <span className="font-bold">0.0</span> ✗
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/indexing/paths" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 3.7 Write &amp; Query Path
                </Link>
                <Link href="/search/data/types" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Next: Types of Data <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
