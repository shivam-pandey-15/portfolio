"use client";

import { GitCompare, AlertCircle, Check, X, ArrowRight, ArrowLeft, Zap, BookOpen, TrendingDown, Code2 } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const gapData = [
    { scenario: "Negation", token_match: 10, intent_match: 95 },
    { scenario: "Synonyms", token_match: 25, intent_match: 90 },
    { scenario: "Modifiers", token_match: 40, intent_match: 85 },
    { scenario: "Entities", token_match: 55, intent_match: 90 },
];

const takeaways = [
    { title: "Tokens vs Intent", description: "The literal words typed are just a hint. You must infer the underlying goal." },
    { title: "Synonyms", description: "Table stakes. You must handle \"couch\" vs \"sofa\" and \"sneakers\" vs \"shoes\"." },
    { title: "Hard Problems", description: "Negation (\"without\") and modifiers (\"cheap\", \"best\") require logic, not just matching." },
    { title: "Hybrid Wins", description: "Use tokens for precision (exact match) and semantics (vectors) for recall." }
];

export default function IntentPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Chapter 2.3</p>
                <h1 className="text-4xl font-bold tracking-tight">Intent vs Tokens</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Tokens are what the user typed. Intent is what they meant. These often diverge  and understanding this gap is fundamental to building good search.
                </p>
            </div>

            <hr className="border-border" />

            {/* The Core Problem */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <BookOpen className="w-6 h-6" /> The Core Problem
                </h2>

                <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p>
                        Traditional search engines work by matching tokens (words) in the query against tokens in documents.
                        This sounds reasonable until you realize that <strong>users express intent through words, but intent and words are not the same thing</strong>.
                    </p>
                    <p>
                        When a user types <code>"cheap laptop"</code>, they don't want documents containing the word "cheap"
                        they want laptops under a certain price. When they type <code>"laptop without touchscreen"</code>,
                        matching "touchscreen" actually gives them the opposite of what they want.
                    </p>
                </div>
            </section>

            {/* Intent Categories (Google Framework) */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Zap className="w-6 h-6" /> Intent Categories (Google Framework)
                </h2>
                <p className="text-muted-foreground">
                    Google famously categorizes queries into "Do, Know, Go". Here is how we handle them differently.
                </p>

                <div className="space-y-6">
                    {/* Navigational (Go) */}
                    <div className="border border-border rounded-xl bg-card overflow-hidden">
                        <div className="w-full flex items-center justify-between p-4 bg-secondary/10 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/10 rounded-lg text-green-500 font-bold text-xs">GO</div>
                                <h3 className="font-semibold">Navigational Intent</h3>
                            </div>
                        </div>

                        <div className="p-4">
                            <p className="text-sm text-muted-foreground mb-4">
                                The user wants to go to a specific website or page. They are using search as a bookmark bar.
                            </p>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="bg-background p-3 rounded-lg border border-border">
                                    <p className="text-xs font-bold mb-2">Examples</p>
                                    <ul className="text-xs space-y-1 text-muted-foreground">
                                        <li>• "facebook login"</li>
                                        <li>• "youtube" (Homepage)</li>
                                        <li>• "hbo max"</li>
                                        <li>• "united airlines support"</li>
                                    </ul>
                                </div>
                                <div className="bg-background p-3 rounded-lg border border-border">
                                    <p className="text-xs font-bold mb-2">System Action</p>
                                    <ul className="text-xs space-y-1 text-muted-foreground">
                                        <li>• Show single official link at #1</li>
                                        <li>• Show sitelinks (sub-pages)</li>
                                        <li>• Don't show ads if brand owner</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Informational (Know) */}
                    <div className="border border-border rounded-xl bg-card overflow-hidden">
                        <div className="w-full flex items-center justify-between p-4 bg-secondary/10 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 font-bold text-xs">KNOW</div>
                                <h3 className="font-semibold">Informational Intent</h3>
                            </div>
                        </div>

                        <div className="p-4">
                            <p className="text-sm text-muted-foreground mb-4">
                                The user wants to learn something. These queries make up 80% of web searches but monetize poorly.
                            </p>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="bg-background p-3 rounded-lg border border-border">
                                    <p className="text-xs font-bold mb-2">Examples</p>
                                    <ul className="text-xs space-y-1 text-muted-foreground">
                                        <li>• "how to tie a tie"</li>
                                        <li>• "how to upload video to youtube"</li>
                                        <li>• "capital of france"</li>
                                    </ul>
                                </div>
                                <div className="bg-background p-3 rounded-lg border border-border">
                                    <p className="text-xs font-bold mb-2">System Action</p>
                                    <ul className="text-xs space-y-1 text-muted-foreground">
                                        <li>• Show Direct Answer / Snippet</li>
                                        <li>• Show "People Also Ask"</li>
                                        <li>• Rank authoritative content (Wikipedia)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transactional (Do) */}
                    <div className="border border-border rounded-xl bg-card overflow-hidden">
                        <div className="w-full flex items-center justify-between p-4 bg-secondary/10 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 font-bold text-xs">DO</div>
                                <h3 className="font-semibold">Transactional Intent</h3>
                            </div>
                        </div>

                        <div className="p-4">
                            <p className="text-sm text-muted-foreground mb-4">
                                The user wants to buy or perform an action. This is where the money is (Ads, E-commerce).
                            </p>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="bg-background p-3 rounded-lg border border-border">
                                    <p className="text-xs font-bold mb-2">Examples</p>
                                    <ul className="text-xs space-y-1 text-muted-foreground">
                                        <li>• "buy iphone 15"</li>
                                        <li>• "cheap flights to nyc"</li>
                                        <li>• "download spotify"</li>
                                    </ul>
                                </div>
                                <div className="bg-background p-3 rounded-lg border border-border">
                                    <p className="text-xs font-bold mb-2">System Action</p>
                                    <ul className="text-xs space-y-1 text-muted-foreground">
                                        <li>• Show Shopping Grid</li>
                                        <li>• Show Filters (Price, Brand)</li>
                                        <li>• Show Reviews and Ratings</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Data Gap Chart */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <TrendingDown className="w-6 h-6" /> Quantifying the Gap
                </h2>

                <p className="text-muted-foreground">
                    This checkout breakdown shows the gap between token matching and intent understanding.
                </p>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-4">Success Rate: Token vs Intent Matching</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={gapData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#444" />
                                    <XAxis dataKey="scenario" fontSize={12} stroke="#888" tickLine={false} axisLine={false} />
                                    <YAxis domain={[0, 100]} unit="%" fontSize={12} stroke="#888" tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="token_match" name="Token Match" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="intent_match" name="Intent Match" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center space-y-4">
                        <div className="bg-secondary/20 p-4 rounded-lg border border-border">
                            <p className="font-bold text-red-500 mb-1">Negation Failure</p>
                            <p className="text-sm text-muted-foreground">Token matching fails 90% of the time on negation because it treats "without" as just another word or noise.</p>
                        </div>
                        <div className="bg-secondary/20 p-4 rounded-lg border border-border">
                            <p className="font-bold text-orange-500 mb-1">Synonym Gap</p>
                            <p className="text-sm text-muted-foreground">Token matching misses 75% of relevant results when users use synonyms (e.g., "sofa" instead of "couch") that aren't in the product text.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Deep Dive: Tokens vs Entities */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Code2 className="w-6 h-6" /> Deep Dive: Tokens vs Entities
                </h2>
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">analysis.py</span>
                        <div className="flex gap-1.5 align-middle">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-gray-300">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">analyze_query</span>(query: str):</div>
                            <div className="pl-4 text-green-400"># 1. Naive Tokenization (What Solr/ES do by default)</div>
                            <div className="pl-4">tokens = query.split()</div>
                            <div className="pl-4">print(tokens) <span className="text-green-400"># ["iphone", "without", "camera"]</span></div>
                            <div className="pl-4 text-red-400"># RESULT: Returns phones that have "camera" in description</div>
                            <div className="pl-4"></div>
                            <div className="pl-4 text-green-400"># 2. Entity First Strategy (What we want)</div>
                            <div className="pl-4">entities = ner.extract(query)</div>
                            <div className="pl-4">print(entities)</div>
                            <div className="pl-4"><span className="text-purple-400">{"{"}</span></div>
                            <div className="pl-8"><span className="text-green-300">"product"</span>: <span className="text-green-300">"iphone"</span>,</div>
                            <div className="pl-8"><span className="text-green-300">"exclusion"</span>: <span className="text-green-300">"camera"</span> <span className="text-green-400"># 'without' triggers exclusion logic</span></div>
                            <div className="pl-4"><span className="text-purple-400">{"}"}</span></div>
                            <div className="pl-4 text-green-400"># RESULT: Apply filter `must_not: features.contains("camera")`</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Code Solutions for Failures */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Code2 className="w-6 h-6" /> Solutions for Common Failures
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="border border-border rounded-xl overflow-hidden">
                        <div className="bg-secondary/40 px-4 py-3 border-b border-border">
                            <h3 className="font-bold text-sm">The "Cheap" Problem</h3>
                            <p className="text-xs text-muted-foreground mt-1">Removing the word "cheap" and applying a price filter.</p>
                        </div>
                        <div className="p-4 bg-[#1e1e1e] text-xs font-mono overflow-x-auto text-gray-300">
                            <div><span className="text-blue-400">if</span> <span className="text-green-300">"cheap"</span> <span className="text-blue-400">in</span> query_tokens:</div>
                            <div className="pl-4">query_tokens.remove(<span className="text-green-300">"cheap"</span>)</div>
                            <div className="pl-4">filters[<span className="text-green-300">"price"</span>] = <span className="text-purple-400">{"{"}</span> <span className="text-green-300">"lt"</span>: median_price * <span className="text-orange-300">0.5</span> <span className="text-purple-400">{"}"}</span></div>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl overflow-hidden">
                        <div className="bg-secondary/40 px-4 py-3 border-b border-border">
                            <h3 className="font-bold text-sm">The Negation Problem</h3>
                            <p className="text-xs text-muted-foreground mt-1">Converting "without X" to rigid exclusion.</p>
                        </div>
                        <div className="p-4 bg-[#1e1e1e] text-xs font-mono overflow-x-auto text-gray-300">
                            <div><span className="text-blue-400">if</span> <span className="text-green-300">"without"</span> <span className="text-blue-400">in</span> tokens:</div>
                            <div className="pl-4">idx = tokens.index(<span className="text-green-300">"without"</span>)</div>
                            <div className="pl-4">excluded_term = tokens[idx + <span className="text-orange-300">1</span>]</div>
                            <div className="pl-4">must_not_terms.append(excluded_term)</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Precision-Recall */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <GitCompare className="w-6 h-6" /> Precision vs Recall Strategy
                </h2>
                <p className="text-muted-foreground">
                    A token-only search has high precision but low recall (misses synonyms).
                    A semantic-only search has high recall but low precision (drifts topic).
                    The industry standard is <strong>Dynamic Hybrid Retrieval</strong>.
                </p>
                <div className="bg-[#1e1e1e] rounded-xl p-4 font-mono text-xs text-gray-300">
                    <div><span className="text-blue-400">def</span> <span className="text-yellow-300">calculate_hybrid_score</span>(bm25_score, vector_score):</div>
                    <div className="pl-4"><span className="text-green-400"># 60% weight to exact matches (Precision)</span></div>
                    <div className="pl-4"><span className="text-green-400"># 40% weight to semantic matches (Recall)</span></div>
                    <div className="pl-4"><span className="text-blue-400">return</span> (<span className="text-orange-300">0.6</span> * normalize(bm25_score)) + (<span className="text-orange-300">0.4</span> * vector_score)</div>
                </div>
            </section>

            {/* Bridging Techniques */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Zap className="w-6 h-6" /> Bridging the Gap
                </h2>

                <p className="text-muted-foreground">
                    There are three main approaches to bridging the token-intent gap, each with trade-offs:
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3">1. Synonym Expansion</h3>
                        <div className="bg-secondary/30 p-3 rounded-lg text-sm font-mono mb-3">
                            "couch" → "couch OR sofa OR loveseat"
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                            Add known synonyms to the query. Simple and interpretable, but requires manual curation
                            and can reduce precision if synonyms are too broad.
                        </p>
                        <div className="flex gap-2 text-xs">
                            <span className="text-green-500">✓ Interpretable</span>
                            <span className="text-red-500">✗ Manual work</span>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3">2. Semantic Search</h3>
                        <div className="bg-secondary/30 p-3 rounded-lg text-sm font-mono mb-3">
                            embed("couch") ≈ embed("sofa")
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                            Use embeddings to find semantically similar content. Automatic and handles unseen synonyms,
                            but can over-generalize and is less interpretable.
                        </p>
                        <div className="flex gap-2 text-xs">
                            <span className="text-green-500">✓ Automatic</span>
                            <span className="text-red-500">✗ Black box</span>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3">3. Hybrid Approach</h3>
                        <div className="bg-secondary/30 p-3 rounded-lg text-xs mb-3">
                            <p>1. Token match (BM25) for precision</p>
                            <p>2. Semantic rerank for relevance</p>
                            <p>3. Fallback to semantic if needed</p>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                            Combine both: use tokens for high-confidence matches, semantics for recall.
                            This is the approach most production systems use.
                        </p>
                        <div className="flex gap-2 text-xs">
                            <span className="text-green-500">✓ Best of both</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />


            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/query-understanding/types" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Types of Queries
                </Link>
                <Link href="/search/query-understanding/power-laws" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next: Power Laws <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
