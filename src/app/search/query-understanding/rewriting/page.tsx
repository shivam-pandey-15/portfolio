"use client";

import { RefreshCw, Plus, Minus, ArrowRight, ArrowLeft, Zap, AlertTriangle, TrendingUp, Code2 } from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const precisionRecallData = [
    { expansion: "None", recall: 20, precision: 95 },
    { expansion: "Synonyms", recall: 50, precision: 90 },
    { expansion: "Semantic", recall: 80, precision: 65 },
    { expansion: "Broad", recall: 95, precision: 30 },
];

export default function RewritingPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Chapter 2.6</p>
                <h1 className="text-4xl font-bold tracking-tight">Query Rewriting & Expansion</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Users type imperfect queries. Rewriting and expansion bridge the gap between query and corpus.
                </p>
            </div>

            <hr className="border-border" />

            {/* Precision vs Recall Chart */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" /> The Expansion Trade-off
                </h2>

                <p className="text-muted-foreground">
                    This graph visualizes the classic trade-off in query rewriting: as you expand queries more aggressively (moving left to right),
                    you find more results (Recall increases), but the relevance of those results typically drops (Precision decreases).
                </p>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-4">Precision vs Recall by Expansion Level</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={precisionRecallData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#444" />
                                    <XAxis dataKey="expansion" fontSize={12} stroke="#888" tickLine={false} axisLine={false} />
                                    <YAxis domain={[0, 100]} unit="%" fontSize={12} stroke="#888" tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="recall" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} name="Recall" />
                                    <Area type="monotone" dataKey="precision" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} name="Precision" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center space-y-4">
                        <p className="text-muted-foreground">
                            Expansion is a balancing act. The crossover point is where you maximize finding relevant items without flooding the user with junk.
                        </p>
                        <div className="bg-secondary/20 p-4 rounded-lg border border-border">
                            <p className="font-bold text-sm mb-1">Key Insight</p>
                            <p className="text-sm text-muted-foreground">The sweet spot is usually "Synonyms + High Confidence Semantic". Going broader often hurts user experience more than it helps.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Code Example */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Code2 className="w-6 h-6" /> Rewriting Logic
                </h2>

                <p className="text-muted-foreground">
                    How query rewriting looks in code. This example shows both simple synonym expansion and LLM-based rewriting.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">rewriter.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <div className="flex flex-col gap-0.5">
                            <div>
                                <span className="text-blue-400">class</span> <span className="text-yellow-300">QueryRewriter</span><span className="text-white">:</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-blue-400">def</span> <span className="text-yellow-300">rewrite</span><span className="text-white">(self, query: str) -&gt; Dict:</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-green-400"># 1. Structure Extraction (Regex/Templates)</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-green-400"># "nike shoes under $100" -&gt; brand:nike, price&lt;100</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white">structured = self.template_matcher.extract(query)</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-pink-400">if</span> <span className="text-white">structured:</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-pink-400">return</span> <span className="text-white">structured</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-white"> </span>
                            </div>
                            <div className="pl-8">
                                <span className="text-green-400"># 2. Synonym Expansion</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-green-400"># "sneakers" -&gt; "sneakers OR athletic shoes"</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white">expanded_query = self.synonym_engine.expand(query)</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white"> </span>
                            </div>
                            <div className="pl-8">
                                <span className="text-green-400"># 3. LLM Rewriting (Slow, use only for complex queries)</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-pink-400">if</span> <span className="text-white">self.is_complex(query):</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-green-400"># Prompt: "Convert user query to Elasticsearch filter JSON..."</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-white">llm_response = self.llm_client.complete(</span>
                            </div>
                            <div className="pl-16">
                                <span className="text-white">prompt=</span><span className="text-blue-400">f</span><span className="text-green-300">"Rewrite this for search: {'{'}query{'}'}"</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-white">)</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-pink-400">return</span> <span className="text-white">json.loads(llm_response)</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-white"> </span>
                            </div>
                            <div className="pl-8">
                                <span className="text-pink-400">return</span> <span className="text-white">{'{'}</span><span className="text-green-300">"match"</span><span className="text-white">: expanded_query{'}'}</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white"> </span>
                            </div>
                            <div className="pl-4">
                                <span className="text-green-400"># Usage</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-white">rewriter = QueryRewriter()</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-green-400"># Output: {'{'} 'bool': {'{'} 'must': [{'{'} 'term': {'{'} 'brand': 'nike' {'}'} {'}'}, {'{'} 'range': {'{'} 'price': {'{'} 'lt': 100 {'}'} {'}'} {'}'}] {'}'} {'}'}</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-white">print(rewriter.rewrite(</span><span className="text-green-300">"nike shoes under $100"</span><span className="text-white">))</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expansion Spectrum */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">The Expansion Spectrum</h2>

                <div className="border border-border rounded-xl p-6">
                    <div className="relative">
                        {/* Spectrum bar */}
                        <div className="h-4 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-full mb-2" />
                        <div className="flex justify-between text-xs text-muted-foreground mb-6">
                            <span>No Expansion</span>
                            <span>Light</span>
                            <span>Moderate</span>
                            <span>Heavy</span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="text-center">
                                <p className="font-bold text-blue-500">High Precision</p>
                                <p className="text-xs text-muted-foreground">Many zero results</p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-blue-400">Synonyms only</p>
                                <p className="text-xs text-muted-foreground">Safe expansion</p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-yellow-500">+ Related terms</p>
                                <p className="text-xs text-muted-foreground">Balanced</p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-red-500">High Recall</p>
                                <p className="text-xs text-muted-foreground">Some noise</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Query Rewriting */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <RefreshCw className="w-6 h-6" /> Query Rewriting
                </h2>

                <div className="border border-border rounded-xl p-6">
                    <h3 className="font-bold mb-4">Structured Query Conversion</h3>

                    <div className="grid gap-4 lg:grid-cols-2">
                        {/* Input */}
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Input:</p>
                            <div className="bg-secondary/30 p-4 rounded-lg font-mono text-sm">
                                "blue nike running shoes size 10 under $100"
                            </div>
                        </div>

                        {/* Output */}
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Output:</p>
                            <pre className="bg-primary/10 border border-primary/30 p-4 rounded-lg text-xs overflow-x-auto">
                                {`{
  "text_query": "running shoes",
  "filters": {
    "color": "blue",
    "brand": "Nike",
    "size": "10",
    "price": {"max": 100}
  }
}`}
                            </pre>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-2">Entity → Filter</h3>
                        <p className="text-sm text-muted-foreground mb-2">Extract entities, convert to filters</p>
                        <div className="text-xs bg-secondary/30 p-2 rounded">
                            "Nike" → brand:Nike
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-2">Template Matching</h3>
                        <p className="text-sm text-muted-foreground mb-2">Common patterns to structure</p>
                        <div className="text-xs bg-secondary/30 p-2 rounded">
                            "X under $Y" → price_max:Y
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-2">LLM Rewriting</h3>
                        <p className="text-sm text-muted-foreground mb-2">For natural language queries</p>
                        <div className="text-xs bg-secondary/30 p-2 rounded">
                            "comfy shoes for standing" → cushioned, supportive
                        </div>
                    </div>
                </div>
            </section>

            {/* Case Studies */}
            <section className="bg-secondary/20 p-8 rounded-xl border border-border">
                <h2 className="text-xl font-semibold mb-6">Industry Case Studies</h2>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-background p-4 rounded-lg">
                        <h3 className="font-bold mb-2 text-orange-500">Amazon</h3>
                        <p className="text-sm text-muted-foreground mb-2">Multi-layer approach:</p>
                        <ul className="text-xs space-y-1">
                            <li>1. Dictionary (60%, 98% precision)</li>
                            <li>2. Templates (20%, 95% precision)</li>
                            <li>3. ML Model (15%, 88% precision)</li>
                            <li>4. LLM fallback (5%, cached)</li>
                        </ul>
                    </div>

                    <div className="bg-background p-4 rounded-lg">
                        <h3 className="font-bold mb-2 text-blue-500">Google</h3>
                        <p className="text-sm text-muted-foreground mb-2">Key learnings:</p>
                        <ul className="text-xs space-y-1">
                            <li>• Over-expansion hurts more than under</li>
                            <li>• Show original results first</li>
                            <li>• Mark expanded clearly</li>
                        </ul>
                    </div>

                    <div className="bg-background p-4 rounded-lg">
                        <h3 className="font-bold mb-2 text-green-500">Spotify</h3>
                        <p className="text-sm text-muted-foreground mb-2">Mood expansion:</p>
                        <ul className="text-xs space-y-1">
                            <li>• "sad" → audio features</li>
                            <li>• Personalized by history</li>
                            <li>• Genre diversification</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Dynamic Expansion */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Zap className="w-6 h-6" /> Adaptive Expansion
                </h2>

                <div className="border border-border rounded-xl p-6">
                    <h3 className="font-bold mb-4">Adjust expansion based on result count:</h3>

                    <div className="grid gap-3">
                        <div className="flex items-center gap-4 p-3 bg-green-500/10 rounded-lg">
                            <span className="text-2xl font-bold text-green-500">&gt;100</span>
                            <div className="flex-1">
                                <p className="font-medium">Results: Many</p>
                                <p className="text-xs text-muted-foreground">Don't expand (preserve precision)</p>
                            </div>
                            <span className="px-3 py-1 bg-green-500/20 rounded text-xs">No Expansion</span>
                        </div>

                        <div className="flex items-center gap-4 p-3 bg-yellow-500/10 rounded-lg">
                            <span className="text-2xl font-bold text-yellow-500">20-100</span>
                            <div className="flex-1">
                                <p className="font-medium">Results: Good</p>
                                <p className="text-xs text-muted-foreground">Light expansion (synonyms only)</p>
                            </div>
                            <span className="px-3 py-1 bg-yellow-500/20 rounded text-xs">Light</span>
                        </div>

                        <div className="flex items-center gap-4 p-3 bg-red-500/10 rounded-lg">
                            <span className="text-2xl font-bold text-red-500">0</span>
                            <div className="flex-1">
                                <p className="font-medium">Results: Zero</p>
                                <p className="text-xs text-muted-foreground">Heavy expansion + relax constraints</p>
                            </div>
                            <span className="px-3 py-1 bg-red-500/20 rounded text-xs">Fallback</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <section className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                <h2 className="text-lg font-semibold mb-4">Key Takeaways</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Expansion increases recall</strong> but can hurt precision</li>
                    <li>• <strong>Rewriting converts to structured</strong>  better for filtering</li>
                    <li>• <strong>Don't expand brands, constraints, negations</strong></li>
                    <li>• <strong>Tiered approach</strong>  expand more as results decrease</li>
                    <li>• <strong>Learn from clicks</strong>  best synonyms from user behavior</li>
                </ul>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/query-understanding/pipeline" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Understanding Pipeline
                </Link>
                <Link href="/search/query-understanding/ambiguity" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next: Handling Ambiguity <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
