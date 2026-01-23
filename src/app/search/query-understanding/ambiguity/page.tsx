"use client";

import { HelpCircle, Shuffle, Target, ArrowRight, ArrowLeft, CheckCircle2, Code2, Layers, MousePointerClick, Brain, AlertTriangle, GitBranch } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";

const ambiguityData = [
    { length: "1 word", ambiguity: 85, color: "#ef4444" },
    { length: "2 words", ambiguity: 65, color: "#f59e0b" },
    { length: "3-4 words", ambiguity: 40, color: "#eab308" },
    { length: "5+ words", ambiguity: 15, color: "#22c55e" },
];

export default function AmbiguityPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Chapter 2.7</p>
                <h1 className="text-4xl font-bold tracking-tight">Handling Ambiguity</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Strict matching fails because language is imprecise. The same words mean different things to different users.
                </p>
            </div>

            <hr className="border-border" />

            {/* The Problem: Ambiguity by Numbers */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <HelpCircle className="w-6 h-6" /> The Scale of the Problem
                </h2>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Bar Chart */}
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-4">Ambiguity vs Query Length</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ambiguityData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#444" />
                                    <XAxis dataKey="length" fontSize={12} stroke="#888" tickLine={false} axisLine={false} />
                                    <YAxis domain={[0, 100]} unit="%" fontSize={12} stroke="#888" tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                    />
                                    <Bar dataKey="ambiguity" radius={4} name="% Ambiguous">
                                        {ambiguityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Production stats */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-secondary/20 p-6 rounded-xl border border-border flex-1">
                            <h3 className="font-bold mb-4">Ambiguity in Production</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-border/50 pb-2">
                                    <span className="text-sm">Google (Click Entropy)</span>
                                    <span className="font-mono font-bold text-red-400">~60%</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-border/50 pb-2">
                                    <span className="text-sm">Amazon (Category)</span>
                                    <span className="font-mono font-bold text-orange-400">~45%</span>
                                </div>
                                <div className="flex justify-between items-center pb-2">
                                    <span className="text-sm">Netflix (Genre)</span>
                                    <span className="font-mono font-bold text-red-500">~70%</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
                            <p className="text-sm"><strong>Key Insight:</strong> Short queries (1-2 words) are the most common AND the most ambiguous. You cannot solve search without handling them.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Types of Ambiguity */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Types of Ambiguity</h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 text-red-500">1. Lexical (Polysemy)</h3>
                        <p className="text-sm text-muted-foreground mb-3">Same word, completely unrelated meanings.</p>
                        <div className="bg-secondary/30 p-3 rounded-lg">
                            <div className="font-mono text-sm mb-2">"Apple"</div>
                            <div className="flex flex-wrap gap-2 text-xs">
                                <span className="bg-background border px-2 py-1 rounded">Tech Company</span>
                                <span className="bg-background border px-2 py-1 rounded">Fruit</span>
                                <span className="bg-background border px-2 py-1 rounded">Record Label</span>
                            </div>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 text-orange-500">2. Syntactic (Structure)</h3>
                        <p className="text-sm text-muted-foreground mb-3">Same words, different grammatical parsing.</p>
                        <div className="bg-secondary/30 p-3 rounded-lg">
                            <div className="font-mono text-sm mb-2">"small dog food"</div>
                            <div className="flex flex-wrap gap-2 text-xs">
                                <span className="bg-background border px-2 py-1 rounded">Food for small dogs</span>
                                <span className="bg-background border px-2 py-1 rounded">Small bag of food</span>
                            </div>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 text-blue-500">3. Intent</h3>
                        <p className="text-sm text-muted-foreground mb-3">Clear entity, unclear action.</p>
                        <div className="bg-secondary/30 p-3 rounded-lg">
                            <div className="font-mono text-sm mb-2">"iPhone 15"</div>
                            <div className="flex flex-wrap gap-2 text-xs">
                                <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded">Buy</span>
                                <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-1 rounded">Review</span>
                                <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-1 rounded">Specs</span>
                            </div>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 text-purple-500">4. Scope</h3>
                        <p className="text-sm text-muted-foreground mb-3">Vague specificity.</p>
                        <div className="bg-secondary/30 p-3 rounded-lg">
                            <div className="font-mono text-sm mb-2">"laptop"</div>
                            <div className="flex flex-wrap gap-2 text-xs">
                                <span className="bg-background border px-2 py-1 rounded">Buy now?</span>
                                <span className="bg-background border px-2 py-1 rounded">Researching?</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Signal Hierarchy */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Layers className="w-6 h-6" /> Signal Hierarchy for Disambiguation
                </h2>
                <p className="text-muted-foreground">
                    How do we know which meaning is correct? We rely on a hierarchy of signals, from strongest (personal) to weakest (population).
                </p>

                <div className="flex flex-col gap-2 max-w-2xl mx-auto">
                    {/* Pyramid visualization */}
                    <div className="bg-green-500/20 border border-green-500/30 p-4 rounded-t-xl text-center">
                        <h3 className="font-bold text-green-500">1. User History (Strongest)</h3>
                        <p className="text-xs text-muted-foreground">Bought "Python for Dummies" → Programmer</p>
                    </div>
                    <div className="bg-blue-500/20 border-x border-blue-500/30 p-4 text-center mx-4">
                        <h3 className="font-bold text-blue-500">2. Session Context</h3>
                        <p className="text-xs text-muted-foreground">Just searched "zoo hours" → "jaguar" is animal</p>
                    </div>
                    <div className="bg-yellow-500/20 border-x border-yellow-500/30 p-4 text-center mx-8">
                        <h3 className="font-bold text-yellow-500">3. Geo / Device</h3>
                        <p className="text-xs text-muted-foreground">In Brazil + iPhone → "jaguar" is animal</p>
                    </div>
                    <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-b-xl text-center mx-12">
                        <h3 className="font-bold text-red-500">4. Global Popularity (Weakest)</h3>
                        <p className="text-xs text-muted-foreground">Most people mean Apple Inc, not fruit</p>
                    </div>
                </div>
            </section>

            {/* Code: Click Entropy */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Code2 className="w-6 h-6" /> Measuring Ambiguity: Click Entropy
                </h2>

                <p className="text-muted-foreground">
                    We don't guess if a query is ambiguous. We measure it mathematically using <strong>Click Entropy</strong>. High entropy means users click on many different things (confused/diverse intent).
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">entropy.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div>
                                <span className="text-pink-400">from</span> <span className="text-white">math</span> <span className="text-pink-400">import</span> <span className="text-white">log2</span>
                            </div>
                            <div>
                                <span className="text-blue-400">def</span> <span className="text-yellow-300">calculate_click_entropy</span><span className="text-white">(clicks: Dict[str, int]) -&gt; float:</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-white">total_clicks = sum(clicks.values())</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-pink-400">if</span> <span className="text-white">total_clicks == </span><span className="text-orange-300">0</span><span className="text-white">:</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-pink-400">return</span> <span className="text-orange-300">0.0</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-white">entropy = </span><span className="text-orange-300">0.0</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-pink-400">for</span> <span className="text-white">count </span><span className="text-pink-400">in</span> <span className="text-white">clicks.values():</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white">probability = count / total_clicks</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white">entropy -= probability * log2(probability)</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-pink-400">return</span> <span className="text-white">entropy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Techniques */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <GitBranch className="w-6 h-6" /> Disambiguation Techniques
                </h2>

                <p className="text-muted-foreground">
                    We can't always pick a winner. When ambiguity is high, we change our UI strategy.
                </p>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Diversification */}
                    <div className="border border-border rounded-xl overflow-hidden flex flex-col">
                        <div className="bg-secondary/40 px-4 py-3 border-b border-border">
                            <h3 className="font-bold text-sm mb-1">1. Result Diversification</h3>
                            <p className="text-xs text-muted-foreground">
                                When we can't be sure, we hedge our bets. We deliberately mix results from different interpretations to ensure at least one is relevant (e.g., showing both "Apple" tech and fruit).
                            </p>
                        </div>
                        <div className="p-4 bg-[#1e1e1e] text-sm font-mono overflow-x-auto flex-1 text-gray-300">
                            <div className="flex flex-col gap-0.5">
                                <div><span className="text-blue-400">def</span> <span className="text-yellow-300">diversify_results</span><span className="text-white">(results, query):</span></div>
                                <div className="pl-4"><span className="text-pink-400">if</span> <span className="text-white">is_ambiguous(query):</span></div>
                                <div className="pl-8"><span className="text-white">interpretations = get_interpretations(query)</span></div>
                                <div className="pl-8"><span className="text-white">diversified = []</span></div>
                                <div className="pl-8"><span className="text-pink-400">for</span> <span className="text-white">i </span><span className="text-pink-400">in</span> <span className="text-white">range(10):</span></div>
                                <div className="pl-12"><span className="text-green-400"># Round-robin through meanings</span></div>
                                <div className="pl-12"><span className="text-white">interp = interpretations[i % len(interpretations)]</span></div>
                                <div className="pl-12"><span className="text-white">diversified.append(interp.pop(0))</span></div>
                                <div className="pl-8"><span className="text-pink-400">return</span> <span className="text-white">diversified</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Clarification */}
                    <div className="border border-border rounded-xl overflow-hidden flex flex-col">
                        <div className="bg-secondary/40 px-4 py-3 border-b border-border">
                            <h3 className="font-bold text-sm mb-1">2. Clarification UI (Chips)</h3>
                            <p className="text-xs text-muted-foreground">
                                If ambiguity is extreme (Entropy &gt; 2.0) and the query is short, don't guess. Ask the user. We show "Did you mean..." chips to let them self-disambiguate.
                            </p>
                        </div>
                        <div className="p-4 bg-[#1e1e1e] text-sm font-mono overflow-x-auto flex-1 text-gray-300">
                            <div className="flex flex-col gap-0.5">
                                <div><span className="text-white">clarification_ui = {'{'}</span></div>
                                <div className="pl-4"><span className="text-green-300">"type"</span><span className="text-white">: </span><span className="text-green-300">"inline_chips"</span><span className="text-white">,</span></div>
                                <div className="pl-4"><span className="text-green-300">"options"</span><span className="text-white">: [</span></div>
                                <div className="pl-8"><span className="text-white">{'{'}</span><span className="text-green-300">"label"</span><span className="text-white">: </span><span className="text-green-300">"Apple Tech"</span><span className="text-white">, </span><span className="text-green-300">"filter"</span><span className="text-white">: </span><span className="text-green-300">"cat:elec"</span><span className="text-white">{'}'},</span></div>
                                <div className="pl-8"><span className="text-white">{'{'}</span><span className="text-green-300">"label"</span><span className="text-white">: </span><span className="text-green-300">"Apple Fruit"</span><span className="text-white">, </span><span className="text-green-300">"filter"</span><span className="text-white">: </span><span className="text-green-300">"cat:food"</span><span className="text-white">{'}'},</span></div>
                                <div className="pl-8"><span className="text-white">{'{'}</span><span className="text-green-300">"label"</span><span className="text-white">: </span><span className="text-green-300">"Apple Music"</span><span className="text-white">, </span><span className="text-green-300">"filter"</span><span className="text-white">: </span><span className="text-green-300">"cat:music"</span><span className="text-white">{'}'}</span></div>
                                <div className="pl-4"><span className="text-white">]</span></div>
                                <div><span className="text-white">{'}'}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Review of Failure Modes */}
            <section className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-500">
                    <AlertTriangle className="w-5 h-5" /> When Disambiguation Fails: Graceful Degradation
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <p className="text-sm text-foreground/80">
                            Ambiguity resolution is probabilistic. We will be wrong. The system must degrade gracefully using a "Fallback Waterfall".
                        </p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex gap-2">
                                <span className="font-bold text-red-500">1.</span>
                                <span>Try Personalization (History)</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold text-red-500">2.</span>
                                <span>Try Diversification (Show all options)</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold text-red-500">3.</span>
                                <span>Ask for Clarification (Chips)</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold text-red-500">4.</span>
                                <span>Fallback to Most Popular (Global)</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-[#1e1e1e] p-4 rounded-lg text-sm font-mono overflow-x-auto border border-red-500/10 text-gray-300">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-blue-400">def</span> <span className="text-yellow-300">search_with_fallback</span><span className="text-white">(query, user):</span></div>
                            <div className="pl-4"><span className="text-pink-400">if</span> <span className="text-white">user.has_history():</span></div>
                            <div className="pl-8"><span className="text-pink-400">return</span> <span className="text-white">personalized_search(query)</span></div>
                            <div className="pl-4"><span className="text-white"> </span></div>
                            <div className="pl-4"><span className="text-pink-400">if</span> <span className="text-white">is_highly_ambiguous(query):</span></div>
                            <div className="pl-8"><span className="text-pink-400">return</span> <span className="text-white">search_diversified(query)</span></div>
                            <div className="pl-4"><span className="text-white"> </span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span> <span className="text-white">search_popular(query)</span></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Case Studies */}
            <section className="bg-secondary/20 p-8 rounded-xl border border-border">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-500" /> Industry Case Studies
                </h2>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-background p-4 rounded-lg border border-border">
                        <h3 className="font-bold mb-2 text-blue-500">Google</h3>
                        <p className="text-xs font-mono mb-2 text-muted-foreground">Query: "Apple"</p>
                        <p className="text-sm text-muted-foreground mb-3">
                            95% want the company, 5% want fruit.
                        </p>
                        <div className="text-xs bg-secondary/50 p-2 rounded">
                            <strong>Strategy:</strong> Show Company #1-3. Add "People Also Ask" about fruit to let users clarify.
                        </div>
                    </div>

                    <div className="bg-background p-4 rounded-lg border border-border">
                        <h3 className="font-bold mb-2 text-orange-500">Amazon</h3>
                        <p className="text-xs font-mono mb-2 text-muted-foreground">Query: "Python"</p>
                        <p className="text-sm text-muted-foreground mb-3">
                            Books? Movies? Pet supplies?
                        </p>
                        <div className="text-xs bg-secondary/50 p-2 rounded">
                            <strong>Strategy:</strong> Show results from dominant category (Books) but add sidebar facets for "Pet Supplies".
                        </div>
                    </div>

                    <div className="bg-background p-4 rounded-lg border border-border">
                        <h3 className="font-bold mb-2 text-green-500">Spotify</h3>
                        <p className="text-xs font-mono mb-2 text-muted-foreground">Query: "Sad Songs"</p>
                        <p className="text-sm text-muted-foreground mb-3">
                            Totally subjective mood.
                        </p>
                        <div className="text-xs bg-secondary/50 p-2 rounded">
                            <strong>Strategy:</strong> Usage-Based Personalization. Show "Sad Indie" if user listens to Indie.
                        </div>
                    </div>
                </div>
            </section>

            {/* Measuring Quality */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Target className="w-6 h-6" /> Measuring Success
                </h2>
                <div className="border border-border rounded-xl  overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-secondary/40 border-b border-border">
                            <tr>
                                <th className="p-3 text-left font-medium">Metric</th>
                                <th className="p-3 text-left font-medium">Definition</th>
                                <th className="p-3 text-left font-medium">Goal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            <tr>
                                <td className="p-3 font-mono text-xs">Reformulation Rate</td>
                                <td className="p-3 text-muted-foreground">User modifies query within 30s</td>
                                <td className="p-3 text-green-500">&lt; 15%</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-mono text-xs">First Click Position</td>
                                <td className="p-3 text-muted-foreground">Rank of the first result clicked</td>
                                <td className="p-3 text-green-500">&lt; 3</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-mono text-xs">Clarification CTR</td>
                                <td className="p-3 text-muted-foreground">Clicks on "Did you mean..." chips</td>
                                <td className="p-3 text-green-500">&gt; 50%</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-mono text-xs">Click Entropy</td>
                                <td className="p-3 text-muted-foreground">Diversity of clicks (math above)</td>
                                <td className="p-3 text-green-500">Decreasing</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/query-understanding/rewriting" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Query Rewriting
                </Link>
                <Link href="/search/data" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next Chapter: Data Foundation <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
