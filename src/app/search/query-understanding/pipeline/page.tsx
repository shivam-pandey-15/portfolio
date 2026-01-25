"use client";

import { Settings, Zap, Clock, ArrowRight, ArrowLeft, CheckCircle2, Database, Server, Smartphone, Globe, Layers, Code2 } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const latencyData = [
    { stage: "Normalize", time: 5, color: "#22c55e" },
    { stage: "Spell Check", time: 12, color: "#f59e0b" },
    { stage: "NER", time: 10, color: "#6366f1" },
    { stage: "Intent", time: 3, color: "#ec4899" },
    { stage: "Expand", time: 3, color: "#14b8a6" },
    { stage: "Rewrite", time: 2, color: "#8b5cf6" },
];

const takeaways = [
    { title: "7-Stage Pipeline", description: "Query understanding is a deterministic pipeline: Clean -> Fix -> Extract -> Classify -> Enrich." },
    { title: "Latency Budget", description: "You have ~50ms total. P50 should be 35ms." },
    { title: "Bottlenecks", description: "Spell correction and NER are the most expensive steps." },
    { title: "Optimization", description: "Parallelize NER + Intent. Cache aggressively (head queries)." }
];

export default function PipelinePage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Chapter 2.5</p>
                <h1 className="text-4xl font-bold tracking-tight">The Query Understanding Pipeline</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Query understanding is not one step  it's a pipeline of transformations that must complete in &lt;50ms.
                </p>
            </div>

            <hr className="border-border" />

            {/* System Design Architecture */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Layers className="w-6 h-6" /> System Architecture
                </h2>

                <p className="text-muted-foreground">
                    This high-level architecture shows how a query flows from the user's device through the understanding layers before reaching the retrieval engine.
                </p>

                {/* Architecture Diagram */}
                <div className="border border-border rounded-xl bg-background/50 p-6 md:p-10 overflow-x-auto">
                    <div className="min-w-[800px] flex items-center justify-between gap-6 relative">

                        {/* Connecting Line - Behind */}
                        <div className="absolute top-12 left-10 right-10 h-0.5 bg-border -z-10" />

                        {/* Client */}
                        <div className="flex flex-col items-center gap-4 z-10">
                            <div className="w-24 h-24 bg-background border-2 border-border rounded-2xl flex flex-col items-center justify-center shadow-sm hover:border-primary/50 transition-colors">
                                <Smartphone className="w-8 h-8 text-muted-foreground mb-2" />
                                <span className="text-xs font-semibold">Client App</span>
                            </div>
                        </div>

                        {/* Gateway */}
                        <div className="flex flex-col items-center gap-4 z-10">
                            <div className="w-24 h-24 bg-blue-500/5 border-2 border-blue-500/20 rounded-2xl flex flex-col items-center justify-center shadow-sm hover:border-blue-500/50 transition-colors">
                                <Globe className="w-8 h-8 text-blue-500 mb-2" />
                                <span className="text-xs font-semibold">Gateway</span>
                            </div>
                        </div>

                        {/* The Pipeline Service - Main Focus */}
                        <div className="flex-1 z-10">
                            <div className="border-2 border-dashed border-indigo-500/30 bg-indigo-500/5 rounded-3xl p-6 relative">
                                <div className="absolute -top-3 left-6 px-2 bg-background/50 backdrop-blur-sm text-indigo-500 text-xs font-bold flex items-center gap-1">
                                    <Server className="w-3 h-3" /> Query Service
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-background border border-border p-3 rounded-lg text-center shadow-sm">
                                        <div className="text-[10px] text-muted-foreground mb-1">1. Clean</div>
                                        <div className="text-xs font-semibold">Normalize</div>
                                    </div>
                                    <div className="bg-background border border-border p-3 rounded-lg text-center shadow-sm">
                                        <div className="text-[10px] text-muted-foreground mb-1">2. Fix</div>
                                        <div className="text-xs font-semibold">Spell Check</div>
                                    </div>
                                    <div className="bg-background border border-border p-3 rounded-lg text-center shadow-sm">
                                        <div className="text-[10px] text-muted-foreground mb-1">3. Extract</div>
                                        <div className="text-xs font-semibold">NER</div>
                                    </div>
                                    <div className="bg-background border border-border p-3 rounded-lg text-center shadow-sm">
                                        <div className="text-[10px] text-muted-foreground mb-1">4. Classify</div>
                                        <div className="text-xs font-semibold">Intent</div>
                                    </div>
                                    <div className="bg-background border border-border p-3 rounded-lg text-center shadow-sm">
                                        <div className="text-[10px] text-muted-foreground mb-1">5. Enrich</div>
                                        <div className="text-xs font-semibold">Rewrite</div>
                                    </div>
                                    <div className="bg-background border border-border p-3 rounded-lg text-center shadow-sm flex items-center justify-center">
                                        <div className="text-xs font-mono text-muted-foreground">{`{json}`}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stores */}
                        <div className="flex flex-col gap-3 z-10 pl-4 border-l border-border border-dashed">
                            <div className="w-32 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex items-center gap-3">
                                <Database className="w-4 h-4 text-yellow-500" />
                                <span className="text-xs font-semibold">Redis Cache</span>
                            </div>
                            <div className="w-32 p-3 bg-green-500/5 border border-green-500/20 rounded-xl flex items-center gap-3">
                                <Database className="w-4 h-4 text-green-500" />
                                <span className="text-xs font-semibold">Vector DB</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Implementation Code */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Code2 className="w-6 h-6" /> Implementation
                </h2>

                <p className="text-muted-foreground">
                    A simplified Python implementation showing how the pipeline components fit together.
                    Notice the <span className="text-indigo-400">parallel execution</span> for independent tasks using asyncio.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border shadow-2xl">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-white/5">
                        <span className="text-muted-foreground">pipeline.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/40" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                            <div className="w-3 h-3 rounded-full bg-green-500/40" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div>
                                <span className="text-pink-400">import</span> <span className="text-white">asyncio</span>
                            </div>
                            <div>
                                <span className="text-pink-400">from</span> <span className="text-white">typing</span> <span className="text-pink-400">import</span> <span className="text-white">Dict, Any</span>
                            </div>
                            <div>
                                <span className="text-white"> </span>
                            </div>
                            <div>
                                <span className="text-blue-400">class</span> <span className="text-yellow-300">QueryPipeline</span><span className="text-white">:</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-blue-400">def</span> <span className="text-yellow-300">__init__</span><span className="text-white">(self):</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white">self.normalizer = TextNormalizer()</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white">self.spell_checker = SymSpellChecker()</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white">self.ner_model = BERTEntityExtractor()</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white">self.intent_model = FastTextIntentClassifier()</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white">self.expander = SynonymExpander()</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white"> </span>
                            </div>
                            <div className="pl-4">
                                <span className="text-blue-400">async def</span> <span className="text-yellow-300">process</span><span className="text-white">(self, raw_query: str) -&gt; Dict[str, Any]:</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-green-400"># 1. Normalization (CPU bound, fast)</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white">normalized = self.normalizer.normalize(raw_query)</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white"> </span>
                            </div>
                            <div className="pl-8">
                                <span className="text-green-400"># 2. Spell Check (Memory bound, dictionary lookup)</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white">corrected = self.spell_checker.correct(normalized)</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white"> </span>
                            </div>
                            <div className="pl-8">
                                <span className="text-green-400"># 3. Parallel Execution: NER & Intent are independent</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white">entities_future = self.ner_model.extract_async(corrected)</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white">intent_future = self.intent_model.predict_async(corrected)</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white"> </span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white">entities, intent = </span><span className="text-pink-400">await</span> <span className="text-white">asyncio.gather(entities_future, intent_future)</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white"> </span>
                            </div>
                            <div className="pl-8">
                                <span className="text-green-400"># 4. Expansion depending on intent</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white">expanded_terms = []</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-pink-400">if</span> <span className="text-white">intent.confidence &lt; </span><span className="text-orange-300">0.9</span> <span className="text-pink-400">or</span> <span className="text-white">intent.label == </span><span className="text-green-300">"broad"</span><span className="text-white">:</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-white">expanded_terms = self.expander.expand(corrected)</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white"> </span>
                            </div>
                            <div className="pl-8">
                                <span className="text-pink-400">return</span> <span className="text-white">{'{'}</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-green-300">"original"</span><span className="text-white">: raw_query,</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-green-300">"corrected"</span><span className="text-white">: corrected,</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-green-300">"entities"</span><span className="text-white">: entities,</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-green-300">"intent"</span><span className="text-white">: intent,</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-green-300">"expansion"</span><span className="text-white">: expanded_terms</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white">{'}'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latency Chart */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Clock className="w-6 h-6" /> Latency Breakdown
                </h2>

                <p className="text-muted-foreground">
                    Every millisecond counts. This chart breaks down the latency budget for a typical query.
                    Note how spell checking and NER consume the bulk of the time budget.
                </p>

                <div className="border border-border rounded-xl p-6">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={latencyData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#444" />
                                <XAxis type="number" domain={[0, 15]} unit="ms" stroke="#888" tickLine={false} axisLine={false} />
                                <YAxis type="category" dataKey="stage" width={80} stroke="#888" tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                />
                                <Bar dataKey="time" radius={4}>
                                    {latencyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-sm font-medium">⚡ Latency Budget: &lt;50ms total</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Spell correction and NER are the most expensive. Consider caching for head queries.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stage Details */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Stage Deep Dive</h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 text-green-500">Normalization</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Lowercase (case-fold for Unicode)</li>
                            <li>• Remove extra whitespace</li>
                            <li>• Unicode normalization (é → e)</li>
                            <li>• Handle special characters</li>
                        </ul>
                        <div className="mt-3 font-mono text-xs bg-secondary/30 p-2 rounded">
                            "Running SHOES" → "running shoes"
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 text-yellow-500">Spell Correction</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• SymSpell (edit distance 2)</li>
                            <li>• Phonetic matching</li>
                            <li>• Query log corrections</li>
                            <li>• Protect known brands</li>
                        </ul>
                        <div className="mt-3 font-mono text-xs bg-secondary/30 p-2 rounded">
                            "iphoen" → "iPhone" (query log)
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 text-purple-500">Entity Extraction (NER)</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Brand detection</li>
                            <li>• Category/product type</li>
                            <li>• Attributes (size, color)</li>
                            <li>• Price constraints</li>
                        </ul>
                        <div className="mt-3 flex flex-wrap gap-1">
                            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-600 rounded text-xs">Nike</span>
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-600 rounded text-xs">size 10</span>
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-600 rounded text-xs">under $100</span>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 text-pink-500">Intent Classification</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Navigational (go to page)</li>
                            <li>• Informational (learn)</li>
                            <li>• Transactional (buy)</li>
                            <li>• Local (near me)</li>
                        </ul>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-secondary/30 p-2 rounded">
                                "how to" → Informational
                            </div>
                            <div className="bg-secondary/30 p-2 rounded">
                                "buy X" → Transactional
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Monitoring */}
            <section className="bg-secondary/20 p-8 rounded-xl border border-border">
                <h2 className="text-xl font-semibold mb-4">Production Metrics</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-2 px-3 font-medium">Metric</th>
                                <th className="text-left py-2 px-3 font-medium">Target</th>
                                <th className="text-left py-2 px-3 font-medium">Alert If</th>
                            </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                            <tr className="border-b border-border/50">
                                <td className="py-2 px-3">P50 Latency</td>
                                <td className="py-2 px-3">35ms</td>
                                <td className="py-2 px-3 text-red-500">&gt;50ms</td>
                            </tr>
                            <tr className="border-b border-border/50">
                                <td className="py-2 px-3">P99 Latency</td>
                                <td className="py-2 px-3">65ms</td>
                                <td className="py-2 px-3 text-red-500">&gt;100ms</td>
                            </tr>
                            <tr className="border-b border-border/50">
                                <td className="py-2 px-3">Cache Hit Rate</td>
                                <td className="py-2 px-3">70%</td>
                                <td className="py-2 px-3 text-red-500">&lt;50%</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-3">NER F1 Score</td>
                                <td className="py-2 px-3">&gt;0.92</td>
                                <td className="py-2 px-3 text-red-500">&lt;0.85</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />


            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/query-understanding/power-laws" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Power Laws
                </Link>
                <Link href="/search/query-understanding/rewriting" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next: Query Rewriting <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
