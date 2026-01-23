"use client";

import { BarChart3, TrendingUp, DollarSign, Settings, ArrowRight, ArrowLeft, Code2 } from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const distributionData = [
    { name: "Head (1%)", queries: 30, color: "#ef4444" },
    { name: "Torso (10%)", queries: 30, color: "#f59e0b" },
    { name: "Tail (89%)", queries: 40, color: "#22c55e" },
];

const investmentData = [
    { name: "Head", investment: 40, impact: 50 },
    { name: "Torso", investment: 30, impact: 30 },
    { name: "Tail", investment: 30, impact: 20 },
];

const tailCurveData = Array.from({ length: 50 }, (_, i) => ({
    rank: i + 1,
    frequency: Math.pow(1 / (i + 1), 0.8) * 100,
}));

export default function PowerLawsPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Chapter 2.4</p>
                <h1 className="text-4xl font-bold tracking-tight">Power Laws in Search</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Query distribution follows a power law: a tiny fraction of queries generate most traffic.
                </p>
            </div>

            <hr className="border-border" />

            {/* Power Law Curve */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" /> The Power Law Distribution
                </h2>

                <p className="text-muted-foreground">
                    This curve (Zipf's Law) represents one of the most fundamental truths in search.
                    The "Head" (red) represents safe, frequent queries. The "Tail" (green) is where the complexityand often the high-value intentlives.
                </p>

                <div className="border border-border rounded-xl p-6">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={tailCurveData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#444" />
                                <XAxis dataKey="rank" label={{ value: "Query Rank", position: "bottom", offset: -5, fill: "#888" }} stroke="#888" tickLine={false} axisLine={false} />
                                <YAxis label={{ value: "Frequency", angle: -90, position: "insideLeft", fill: "#888" }} stroke="#888" tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                />
                                <defs>
                                    <linearGradient id="colorFreq" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                                        <stop offset="20%" stopColor="#f59e0b" stopOpacity={0.6} />
                                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0.4} />
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="frequency" stroke="#6366f1" fill="url(#colorFreq)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4 text-sm">
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500" /> Head
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-yellow-500" /> Torso
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500" /> Tail
                        </span>
                    </div>
                </div>
            </section>

            {/* Code Example */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Code2 className="w-6 h-6" /> Adaptive Optimization Strategy
                </h2>

                <p className="text-muted-foreground">
                    We can't treat all queries the same. In code, we apply different time-to-live (TTL) and processing depths based on query frequency.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">optimization.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <div className="flex flex-col gap-0.5">
                            <div>
                                <span className="text-blue-400">def</span> <span className="text-yellow-300">get_optimization_config</span><span className="text-white">(query: str, frequency: int):</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-green-400"># HEAD Queries (Top 1%)</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-green-400"># Strategy: Aggressive Caching, Pre-computed Results</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-pink-400">if</span> <span className="text-white">frequency &gt; </span><span className="text-orange-300">100000</span><span className="text-white">:</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-pink-400">return</span> <span className="text-white">{'{'}</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-green-300">"cache_ttl"</span><span className="text-white">: </span><span className="text-orange-300">3600</span><span className="text-white">, </span><span className="text-green-400"># Cache for 1 hour</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-green-300">"enable_deep_learning_rerank"</span><span className="text-white">: </span><span className="text-blue-400">False</span><span className="text-white">, </span><span className="text-green-400"># Too slow, use pre-compute</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-green-300">"use_approximate_knn"</span><span className="text-white">: </span><span className="text-blue-400">False</span> <span className="text-green-400"># Need exact top results</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white">{'}'}</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white"> </span>
                            </div>
                            <div className="pl-4">
                                <span className="text-green-400"># TAIL Queries (Bottom 90%)</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-green-400"># Strategy: Expensive Compute, No Caching</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-pink-400">elif</span> <span className="text-white">frequency &lt; </span><span className="text-orange-300">100</span><span className="text-white">:</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-pink-400">return</span> <span className="text-white">{'{'}</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-green-300">"cache_ttl"</span><span className="text-white">: </span><span className="text-orange-300">60</span><span className="text-white">, </span><span className="text-green-400"># Cache for 1 min (rarely hit again)</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-green-300">"enable_deep_learning_rerank"</span><span className="text-white">: </span><span className="text-blue-400">True</span><span className="text-white">, </span><span className="text-green-400"># Need semantics to understand</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-green-300">"use_approximate_knn"</span><span className="text-white">: </span><span className="text-blue-400">True</span><span className="text-white">, </span><span className="text-green-400"># Approximate is fine for recall</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-green-300">"query_expansion"</span><span className="text-white">: </span><span className="text-green-300">"aggressive"</span> <span className="text-green-400"># Try hard to find matches</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white">{'}'}</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white"> </span>
                            </div>
                            <div className="pl-4">
                                <span className="text-green-400"># TORSO</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-pink-400">return</span> <span className="text-white">{'{'}</span><span className="text-green-300">"cache_ttl"</span><span className="text-white">: </span><span className="text-orange-300">600</span><span className="text-white">, </span><span className="text-green-300">"enable_deep_learning_rerank"</span><span className="text-white">: </span><span className="text-blue-400">True</span><span className="text-white">{'}'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Traffic Distribution */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <BarChart3 className="w-6 h-6" /> Traffic Distribution
                </h2>

                <p className="text-muted-foreground">
                    A visual breakdown of how a small percentage of distinct queries accounts for the massive majority of total search volume.
                </p>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Pie Chart */}
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-4 text-center">% of Total Traffic</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={distributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        dataKey="queries"
                                        label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {distributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid gap-4 grid-cols-1">
                        <div className="border border-red-500/30 rounded-xl p-5 bg-red-500/5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Head Queries</p>
                                    <p className="text-2xl font-bold">1% of unique</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-red-500">30%</p>
                                    <p className="text-xs text-muted-foreground">of traffic</p>
                                </div>
                            </div>
                        </div>

                        <div className="border border-yellow-500/30 rounded-xl p-5 bg-yellow-500/5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Torso Queries</p>
                                    <p className="text-2xl font-bold">10% of unique</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-yellow-500">30%</p>
                                    <p className="text-xs text-muted-foreground">of traffic</p>
                                </div>
                            </div>
                        </div>

                        <div className="border border-green-500/30 rounded-xl p-5 bg-green-500/5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Tail Queries</p>
                                    <p className="text-2xl font-bold">89% of unique</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-green-500">40%</p>
                                    <p className="text-xs text-muted-foreground">of traffic</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Infrastructure Implications */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Settings className="w-6 h-6" /> The Scalability Paradox
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <span className="p-1.5 bg-red-500/10 rounded text-red-500"><Settings className="w-4 h-4" /></span>
                            Head Queries = CPU Problem
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            High QPS (Queries Per Second). Serving "iphone" 10,000 times/sec requires massive compute if not cached.
                        </p>
                        <ul className="text-xs space-y-2 bg-secondary/30 p-3 rounded font-mono">
                            <li className="flex justify-between">
                                <span>Cache Hit Rate</span>
                                <span className="text-green-500">99.9%</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Latency Target</span>
                                <span className="text-green-500">&lt; 10ms</span>
                            </li>
                        </ul>
                    </div>
                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <span className="p-1.5 bg-green-500/10 rounded text-green-500"><Settings className="w-4 h-4" /></span>
                            Tail Queries = IO Problem
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Huge Index. Serving "1994 toyota corolla alternator bolt size" requires scanning massive indices on disk.
                        </p>
                        <ul className="text-xs space-y-2 bg-secondary/30 p-3 rounded font-mono">
                            <li className="flex justify-between">
                                <span>Cache Hit Rate</span>
                                <span className="text-red-500">&lt; 5%</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Latency Target</span>
                                <span className="text-yellow-500">&lt; 200ms</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Strategies by Segment */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Settings className="w-6 h-6" /> Strategies by Segment
                </h2>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="border border-red-500/30 rounded-xl p-5 bg-red-500/5">
                        <h3 className="font-bold mb-3 text-red-500">Head Strategy</h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• Manual tuning & curation</li>
                            <li>• Heavy caching (5 min TTL)</li>
                            <li>• Dedicated A/B testing</li>
                            <li>• Query-specific rules</li>
                        </ul>
                    </div>

                    <div className="border border-yellow-500/30 rounded-xl p-5 bg-yellow-500/5">
                        <h3 className="font-bold mb-3 text-yellow-500">Torso Strategy</h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• Category-level rules</li>
                            <li>• Template matching</li>
                            <li>• Click models (aggregated)</li>
                            <li>• Facet optimization</li>
                        </ul>
                    </div>

                    <div className="border border-green-500/30 rounded-xl p-5 bg-green-500/5">
                        <h3 className="font-bold mb-3 text-green-500">Tail Strategy</h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• Semantic/vector search</li>
                            <li>• Query relaxation</li>
                            <li>• Fallback strategies</li>
                            <li>• LLM rewriting</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/query-understanding/intent" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Intent vs Tokens
                </Link>
                <Link href="/search/query-understanding/pipeline" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next: Understanding Pipeline <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
