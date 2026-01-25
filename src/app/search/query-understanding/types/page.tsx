"use client";

import { PieChart as PieIcon, Compass, ShoppingCart, Info, MapPin, ArrowRight, ArrowLeft, Lightbulb, Code2, BarChart3 } from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const intentData = [
    { name: "Informational", value: 60, color: "#3b82f6" },
    { name: "Navigational", value: 20, color: "#10b981" },
    { name: "Transactional", value: 10, color: "#f59e0b" },
    { name: "Commercial Inv.", value: 10, color: "#8b5cf6" },
];

const takeaways = [
    { title: "Classify First", description: "You cannot rank results until you know the query type." },
    { title: "Informational", description: "Goal: Answer. Metric: Time to Result. UI: Snippets." },
    { title: "Transactional", description: "Goal: Purchase. Metric: Conversion. UI: Product Grids." },
    { title: "Navigational", description: "Goal: Navigation. Metric: CTR@1. UI: Sitelinks." }
];



export default function TypesPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Chapter 2.2</p>
                <h1 className="text-4xl font-bold tracking-tight">Types of Queries</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Not all queries are created equal. Understanding the <strong>intent category</strong> is the first step to checking the right index.
                </p>
            </div>

            <hr className="border-border" />

            {/* Note on Taxonomy */}
            <div className="bg-secondary/20 border-l-4 border-primary p-4 rounded-r-lg">
                <p className="text-sm">
                    <strong>Why this matters:</strong> You heavily rank results differently based on type.
                    A transactional query ("buy running shoes") needs product grids. An informational query ("how to run") needs articles.
                    Getting this wrong is a catastrophic user experience failure.
                </p>
            </div>

            {/* Distribution Chart */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <PieIcon className="w-6 h-6" /> Intent Distribution
                </h2>

                <p className="text-muted-foreground">
                    This checkout breakdown shows the typical distribution of query intents on a general purpose search engine.
                    Note that <strong>Informational</strong> queries dominate the volume, but **Transactional** queries drive the revenue.
                </p>

                <div className="grid gap-6 md:grid-cols-2 items-center">
                    <div className="h-64 border border-border rounded-xl p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={intentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {intentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded bg-blue-500"></div>
                            <div>
                                <p className="font-bold text-sm">Informational (60%)</p>
                                <p className="text-xs text-muted-foreground">"how to", "what is", "history of"</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded bg-green-500"></div>
                            <div>
                                <p className="font-bold text-sm">Navigational (20%)</p>
                                <p className="text-xs text-muted-foreground">"facebook", "gmail login", "youtube"</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded bg-yellow-500"></div>
                            <div>
                                <p className="font-bold text-sm">Transactional (10%)</p>
                                <p className="text-xs text-muted-foreground">"buy iphone", "cheap flights", "download"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Production Metrics */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <BarChart3 className="w-6 h-6" /> Query Classification in Production
                </h2>
                <p className="text-muted-foreground">
                    Production systems classify queries in real-time to route them appropriately. Each query type has
                    a different primary goal, success metric, and failure state. Understanding these differences helps
                    you build specialized handling for each type rather than treating all queries the same.
                </p>
                <div className="border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/40 border-b border-border">
                            <tr>
                                <th className="p-4 font-medium">Query Type</th>
                                <th className="p-4 font-medium">Primary Goal</th>
                                <th className="p-4 font-medium">Success Metric</th>
                                <th className="p-4 font-medium">Failure State</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <tr>
                                <td className="p-4 font-medium text-blue-500">Informational</td>
                                <td className="p-4">Answer user's question</td>
                                <td className="p-4">Time to Result (short)</td>
                                <td className="p-4 text-muted-foreground">Pogo-sticking (user clicks back)</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-medium text-green-500">Navigational</td>
                                <td className="p-4">Get to specific page</td>
                                <td className="p-4">Top Result CTR (~100%)</td>
                                <td className="p-4 text-muted-foreground">User refines query</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-medium text-yellow-500">Transactional</td>
                                <td className="p-4">Purchase / Convert</td>
                                <td className="p-4">Conversion Rate</td>
                                <td className="p-4 text-muted-foreground">Zero results found</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-medium text-purple-500">Local</td>
                                <td className="p-4">Find physical place</td>
                                <td className="p-4">"Get Directions" clicks</td>
                                <td className="p-4 text-muted-foreground">Location mismatch</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Deep Dive Code */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Code2 className="w-6 h-6" /> Deep Dive: Signal Scoring
                </h2>

                <p className="text-muted-foreground">
                    Production systems don't just use keywords. They use multiple specialized scorers to calculate confidence for each intent type.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border tab-size-4">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">intent_scorers.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed text-gray-300">
                        <div className="flex flex-col gap-0.5">
                            {/* Navigational Scorer */}
                            <div><span className="text-blue-400">class</span> <span className="text-yellow-300">NavigationalScorer</span>:</div>
                            <div className="pl-4"><span className="text-blue-400">def</span> <span className="text-yellow-300">score</span>(self, query: str) -&gt; float:</div>
                            <div className="pl-8"><span className="text-white">score = </span><span className="text-orange-300">0.0</span></div>
                            <div className="pl-8 text-green-400"># 1. Exact match with top domains</div>
                            <div className="pl-8"><span className="text-pink-400">if</span> query <span className="text-pink-400">in</span> self.top_10k_domains:</div>
                            <div className="pl-12">score += <span className="text-orange-300">0.8</span></div>
                            <div className="pl-8 text-green-400"># 2. URL patterns</div>
                            <div className="pl-8"><span className="text-pink-400">if</span> <span className="text-green-300">"login"</span> <span className="text-pink-400">in</span> query <span className="text-pink-400">or</span> query.endswith(<span className="text-green-300">".com"</span>):</div>
                            <div className="pl-12">score += <span className="text-orange-300">0.5</span></div>
                            <div className="pl-8"><span className="text-pink-400">return</span> min(score, <span className="text-orange-300">1.0</span>)</div>

                            <div className="h-4"></div>

                            {/* Transactional Scorer */}
                            <div><span className="text-blue-400">class</span> <span className="text-yellow-300">TransactionalScorer</span>:</div>
                            <div className="pl-4"><span className="text-blue-400">def</span> <span className="text-yellow-300">score</span>(self, query: str) -&gt; float:</div>
                            <div className="pl-8"><span className="text-white">score = </span><span className="text-orange-300">0.0</span></div>
                            <div className="pl-8 text-green-400"># 1. Strong verbs</div>
                            <div className="pl-8"><span className="text-pink-400">if</span> any(w <span className="text-pink-400">in</span> query <span className="text-pink-400">for</span> w <span className="text-pink-400">in</span> [<span className="text-green-300">"buy"</span>, <span className="text-green-300">"order"</span>, <span className="text-green-300">"purchase"</span>]):</div>
                            <div className="pl-12">score += <span className="text-orange-300">0.9</span></div>
                            <div className="pl-8 text-green-400"># 2. Price signals</div>
                            <div className="pl-8"><span className="text-pink-400">if</span> <span className="text-green-300">"$"</span> <span className="text-pink-400">in</span> query <span className="text-pink-400">or</span> <span className="text-green-300">"price"</span> <span className="text-pink-400">in</span> query:</div>
                            <div className="pl-12">score += <span className="text-orange-300">0.6</span></div>
                            <div className="pl-8 text-green-400"># 3. Product pattern (Brand + Category + Model)</div>
                            <div className="pl-8"><span className="text-pink-400">if</span> self.ner.has_product_structure(query):</div>
                            <div className="pl-12">score += <span className="text-orange-300">0.4</span></div>
                            <div className="pl-8"><span className="text-pink-400">return</span> min(score, <span className="text-orange-300">1.0</span>)</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Structure & Frequency */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Lightbulb className="w-6 h-6" /> Structure & Frequency
                </h2>
                <p className="text-muted-foreground">
                    Query distribution follows a classic power law: a small number of "fat head" queries drive most of your traffic,
                    while an infinite "long tail" of rare, specific queries makes up the rest. Each segment requires different
                    optimization strategies caching works great for the head, but the tail needs robust query rewriting.
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500" /> Fat Head Queries
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                            Short, frequent, ambiguous. Top 20% of unique queries driving 80% of volume.
                        </p>
                        <div className="bg-secondary/30 p-3 rounded font-mono text-xs mb-3">
                            "shoes", "iphone", "pizza"
                        </div>
                        <ul className="text-xs space-y-1 font-medium">
                            <li className="text-green-500">✓ Use heavy caching (TTL 1h+)</li>
                            <li className="text-green-500">✓ Manual curation / Merchandising</li>
                            <li className="text-yellow-500">⚠ Beware of broad intent</li>
                        </ul>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500" /> Long Tail Queries
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                            Long, specific, rare. The "infinite tail" where users are very precise.
                        </p>
                        <div className="bg-secondary/30 p-3 rounded font-mono text-xs mb-3">
                            "red nike running shoes size 10 discount code"
                        </div>
                        <ul className="text-xs space-y-1 font-medium">
                            <li className="text-orange-500">✓ Rely on query rewriting</li>
                            <li className="text-orange-500">✓ Relax constraints if 0 results</li>
                            <li className="text-red-500">⚠ Cache miss rate is high</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Detailed Types Grid */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">The 4 Main Types</h2>
                <p className="text-muted-foreground">
                    Every query falls into one of four primary categories based on user intent. Correctly classifying the type
                    allows you to customize the entire search experience from which index to query, to how results are ranked,
                    to what UI treatment they receive. Getting this classification wrong leads to fundamental UX failures.
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Informational */}
                    <div className="border border-blue-500/20 rounded-xl p-6 bg-blue-500/5 hover:border-blue-500/40 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Info className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Informational</h3>
                                <p className="text-xs text-muted-foreground">"I want to know something"</p>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="bg-background/80 p-3 rounded border border-blue-100 dark:border-blue-900/30">
                                <span className="font-mono text-xs text-blue-600">Q:</span> "capital of france"
                            </div>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-1">
                                <li>Needs: Direct Answer / Knowledge Graph</li>
                                <li>Metrics: Time to Result (lower is better)</li>
                                <li>UI: Snippets, Answer Cards</li>
                            </ul>
                        </div>
                    </div>

                    {/* Navigational */}
                    <div className="border border-green-500/20 rounded-xl p-6 bg-green-500/5 hover:border-green-500/40 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <Compass className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Navigational</h3>
                                <p className="text-xs text-muted-foreground">"I want to go somewhere"</p>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="bg-background/80 p-3 rounded border border-green-100 dark:border-green-900/30">
                                <span className="font-mono text-xs text-green-600">Q:</span> "youtube", "united airlines login"
                            </div>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-1">
                                <li>Needs: Single correct link at #1</li>
                                <li>Metrics: Click through rate on #1 (should be ~100%)</li>
                                <li>UI: Sitelinks, "Did you mean"</li>
                            </ul>
                        </div>
                    </div>

                    {/* Transactional */}
                    <div className="border border-yellow-500/20 rounded-xl p-6 bg-yellow-500/5 hover:border-yellow-500/40 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-yellow-500/20 rounded-lg">
                                <ShoppingCart className="w-6 h-6 text-yellow-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Transactional</h3>
                                <p className="text-xs text-muted-foreground">"I want to do/buy something"</p>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="bg-background/80 p-3 rounded border border-yellow-100 dark:border-yellow-900/30">
                                <span className="font-mono text-xs text-yellow-600">Q:</span> "cheap flights to nyc", "buy iphone 15"
                            </div>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-1">
                                <li>Needs: Options, Price comparisons, Reviews</li>
                                <li>Metrics: Conversion Rate</li>
                                <li>UI: Grids, Filters, Sorting</li>
                            </ul>
                        </div>
                    </div>

                    {/* Local */}
                    <div className="border border-purple-500/20 rounded-xl p-6 bg-purple-500/5 hover:border-purple-500/40 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <MapPin className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Local</h3>
                                <p className="text-xs text-muted-foreground">"I want something near me"</p>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="bg-background/80 p-3 rounded border border-purple-100 dark:border-purple-900/30">
                                <span className="font-mono text-xs text-purple-600">Q:</span> "pizza near me", "plumbers open now"
                            </div>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-1">
                                <li>Needs: Geolocation, Maps, Hours</li>
                                <li>Metrics: "Get Directions" clicks</li>
                                <li>UI: Map Pack, Address details</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/query-understanding/definition" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Definition
                </Link>
                <Link href="/search/query-understanding/intent" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next: Intent vs Tokens <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
