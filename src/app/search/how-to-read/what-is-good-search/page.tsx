import { Target, Zap, Sparkles, AlertCircle, BarChart3, ArrowRight, ArrowLeft, Search, ShoppingCart, Play, FileText, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function WhatIsGoodSearchPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Chapter 0.3</p>
                <h1 className="text-4xl font-bold tracking-tight">What "Good Search" Actually Means</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    It's not about keyword matching. It's about intent satisfaction.
                </p>
            </div>

            <hr className="border-border" />

            {/* The Wrong Definition */}
            <section className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> The Naive Definition (Wrong)
                </h2>
                <blockquote className="text-lg italic text-muted-foreground border-l-4 border-red-500/50 pl-4">
                    "Good search returns documents that contain the query terms."
                </blockquote>
                <div className="mt-4 text-muted-foreground space-y-4">
                    <p>This definition fails immediately:</p>
                    <div className="bg-background p-4 rounded-lg border border-border">
                        <p className="font-mono text-sm">Query: "running shoes"</p>
                        <p className="font-mono text-sm mt-2">Result #1: Blog post titled "Why I stopped running shoes are bad for you"</p>
                        <p className="mt-2 text-sm">✓ Contains "running" ✓ Contains "shoes" → <strong className="text-red-500">Completely irrelevant</strong></p>
                    </div>
                    <div className="bg-background p-4 rounded-lg border border-border">
                        <p className="font-mono text-sm">Query: "cheap laptop"</p>
                        <p className="font-mono text-sm mt-2">Result #1: MacBook Pro ($2,499)</p>
                        <p className="mt-2 text-sm">✓ It IS a laptop → <strong className="text-red-500">User said "cheap"!</strong></p>
                    </div>
                </div>
            </section>

            {/* The Real Definition */}
            <section className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-primary mb-3">The Engineering Definition</h2>
                <div className="font-mono text-lg bg-background p-4 rounded-lg border">
                    Quality = P(user finds what they want | query, results, context)
                </div>
                <p className="mt-4 text-muted-foreground">
                    Good search is about <strong>probability of intent satisfaction</strong>,
                    not keyword matching. Context includes: who the user is, where they are, what device, time of day, and their history.
                </p>
            </section>

            {/* Three Pillars */}
            <section className="space-y-8">
                <h2 className="text-2xl font-semibold">The Three Pillars of Good Search</h2>

                <div className="grid gap-6">
                    {/* Relevance */}
                    <div className="border border-border rounded-xl p-6 bg-card">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary/10 rounded-md text-primary">
                                <Target className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg">1. Relevance</h3>
                            <span className="text-sm text-muted-foreground">Does the result match the user's intent?</span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="bg-secondary/30 p-4 rounded-lg">
                                <p className="font-medium text-sm mb-2">Textual Relevance</p>
                                <p className="text-xs text-muted-foreground">Query terms appear in document</p>
                                <p className="text-xs mt-2">Example: "iPhone case" → product contains those words</p>
                            </div>
                            <div className="bg-secondary/30 p-4 rounded-lg">
                                <p className="font-medium text-sm mb-2">Semantic Relevance</p>
                                <p className="text-xs text-muted-foreground">Meaning matches (even without exact terms)</p>
                                <p className="text-xs mt-2">Example: "mobile phone cover" → matches "iPhone case"</p>
                            </div>
                            <div className="bg-secondary/30 p-4 rounded-lg">
                                <p className="font-medium text-sm mb-2">Business Relevance</p>
                                <p className="text-xs text-muted-foreground">Available, in budget, shippable</p>
                                <p className="text-xs mt-2">Example: Out of stock items ranked lower</p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                            <p className="font-medium text-sm">🎯 Real failure:</p>
                            <p className="text-xs text-muted-foreground">
                                E-commerce site ranks "iPhone 12" above "iPhone 14" for query "iPhone."
                                Why? iPhone 12 has more reviews (popularity signal). But iPhone 14 is what most people want in 2024.
                            </p>
                        </div>
                    </div>

                    {/* Speed */}
                    <div className="border border-border rounded-xl p-6 bg-card">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-500/10 rounded-md text-orange-600">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg">2. Speed</h3>
                            <span className="text-sm text-muted-foreground">Did the user get results fast enough?</span>
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center gap-4 p-3 rounded-lg bg-green-500/10">
                                <span className="font-mono text-sm font-bold text-green-600">&lt; 100ms</span>
                                <span className="text-sm text-muted-foreground">Feels instant. User stays in flow. (Google's target)</span>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-lg bg-yellow-500/10">
                                <span className="font-mono text-sm font-bold text-yellow-600">100-300ms</span>
                                <span className="text-sm text-muted-foreground">Noticeable delay. Acceptable for complex queries.</span>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-lg bg-orange-500/10">
                                <span className="font-mono text-sm font-bold text-orange-600">300ms-1s</span>
                                <span className="text-sm text-muted-foreground">User patience tested. Might open a new tab.</span>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-lg bg-red-500/10">
                                <span className="font-mono text-sm font-bold text-red-600">&gt; 1s</span>
                                <span className="text-sm text-muted-foreground">High bounce risk. User might abandon the site.</span>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <p className="font-medium text-sm">⚡ The trade-off:</p>
                            <p className="text-xs text-muted-foreground">
                                Making search "smarter" (more ML, deeper reranking) makes it slower.
                                Good search is the <strong>optimal trade-off</strong>, not maximal intelligence.
                                A perfectly ranked result that takes 2 seconds is worse than "good enough" in 100ms.
                            </p>
                        </div>
                    </div>

                    {/* Discovery */}
                    <div className="border border-border rounded-xl p-6 bg-card">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-md text-blue-600">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg">3. Discovery</h3>
                            <span className="text-sm text-muted-foreground">Did the user find things they didn't know they wanted?</span>
                        </div>

                        <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-secondary/30">
                                <p className="font-medium text-sm">Exact Match</p>
                                <p className="text-xs text-muted-foreground">"iPhone 15 Pro 256GB Blue" → Exactly that product</p>
                            </div>
                            <div className="p-3 rounded-lg bg-secondary/30">
                                <p className="font-medium text-sm">Substitute</p>
                                <p className="text-xs text-muted-foreground">"iPhone 15" (out of stock) → "iPhone 14 Pro" (available, similar specs)</p>
                            </div>
                            <div className="p-3 rounded-lg bg-secondary/30">
                                <p className="font-medium text-sm">Serendipity</p>
                                <p className="text-xs text-muted-foreground">"running shoes" → "compression socks" (frequently bought together)</p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                            <p className="font-medium text-sm">✨ The discovery paradox:</p>
                            <p className="text-xs text-muted-foreground">
                                Users say they want "exactly what they searched for."
                                But the best search experiences <strong>surprise</strong> them.
                                Netflix, Spotify, Pinterest win by showing you things you didn't know you wanted.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Real World Examples */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Good Search in Action: Real Examples</h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="border border-border rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <ShoppingCart className="w-5 h-5 text-orange-500" />
                            <h3 className="font-bold">Amazon</h3>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• "running shoes" → filters by Prime eligibility, your size</li>
                            <li>• Shows "Customers also bought" for discovery</li>
                            <li>• Sponsored results clearly labeled (trust)</li>
                            <li>• Sub-100ms response times at massive scale</li>
                        </ul>
                    </div>

                    <div className="border border-border rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Search className="w-5 h-5 text-blue-500" />
                            <h3 className="font-bold">Google</h3>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• Featured snippets answer questions directly</li>
                            <li>• Knowledge panels for entity queries ("Barack Obama")</li>
                            <li>• Local results for "coffee near me" (context)</li>
                            <li>• "Did you mean" for typos</li>
                        </ul>
                    </div>

                    <div className="border border-border rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Play className="w-5 h-5 text-red-500" />
                            <h3 className="font-bold">Netflix</h3>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• Personalized results (your history matters)</li>
                            <li>• "Because you watched X" explanations</li>
                            <li>• Thumbnails change per user (discovery)</li>
                            <li>• Fuzzy matching for actor names</li>
                        </ul>
                    </div>

                    <div className="border border-border rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-5 h-5 text-green-500" />
                            <h3 className="font-bold">Notion</h3>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• Searches your own content (private)</li>
                            <li>• Recent pages weighted higher</li>
                            <li>• Cmd+K instant search (speed)</li>
                            <li>• Filters by page type, date</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Anti-Patterns */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-red-500" /> Anti-Patterns: What Bad Search Looks Like
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 font-semibold">Symptom</th>
                                <th className="text-left py-3 px-4 font-semibold">Underlying Problem</th>
                                <th className="text-left py-3 px-4 font-semibold">Fix</th>
                            </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                            <tr className="border-b border-border/50">
                                <td className="py-3 px-4">"Zero results" for common queries</td>
                                <td className="py-3 px-4">Missing synonyms, poor tokenization</td>
                                <td className="py-3 px-4">Add synonyms, improve query expansion</td>
                            </tr>
                            <tr className="border-b border-border/50">
                                <td className="py-3 px-4">First result is always wrong</td>
                                <td className="py-3 px-4">Bad ranking features or stale popularity</td>
                                <td className="py-3 px-4">Add freshness signal, tune features</td>
                            </tr>
                            <tr className="border-b border-border/50">
                                <td className="py-3 px-4">Slow on specific queries</td>
                                <td className="py-3 px-4">Expensive wildcards, large aggregations</td>
                                <td className="py-3 px-4">Profile slow queries, add caching</td>
                            </tr>
                            <tr className="border-b border-border/50">
                                <td className="py-3 px-4">Works locally, breaks in prod</td>
                                <td className="py-3 px-4">Cold start, cache misses, network</td>
                                <td className="py-3 px-4">Load testing, warm-up scripts</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4">Users always click result #3</td>
                                <td className="py-3 px-4">#1 and #2 are ads or irrelevant</td>
                                <td className="py-3 px-4">Audit top results, check ad ratio</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* How to Measure */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <BarChart3 className="w-6 h-6" /> How to Measure "Good"
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Offline */}
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-4">Offline Metrics (Before Deployment)</h3>
                        <table className="w-full text-sm">
                            <tbody className="text-muted-foreground">
                                <tr className="border-b border-border/50">
                                    <td className="py-2 font-medium">Precision@K</td>
                                    <td className="py-2">% of top K results that are relevant</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-2 font-medium">Recall@K</td>
                                    <td className="py-2">% of all relevant docs in top K</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-2 font-medium">NDCG</td>
                                    <td className="py-2">Quality of ranking order (normalized)</td>
                                </tr>
                                <tr>
                                    <td className="py-2 font-medium">MRR</td>
                                    <td className="py-2">How high is the first relevant result?</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Online */}
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-4">Online Metrics (In Production)</h3>
                        <table className="w-full text-sm">
                            <tbody className="text-muted-foreground">
                                <tr className="border-b border-border/50">
                                    <td className="py-2 font-medium">CTR</td>
                                    <td className="py-2">Are users clicking? (Engagement)</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-2 font-medium">Zero Result Rate</td>
                                    <td className="py-2">% of queries with no results</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-2 font-medium">Reformulation</td>
                                    <td className="py-2">% who search again (frustration)</td>
                                </tr>
                                <tr>
                                    <td className="py-2 font-medium">Conversion</td>
                                    <td className="py-2">Did search lead to purchase/action?</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* The Ultimate Test */}
            <section className="bg-secondary/20 p-8 rounded-xl border border-border">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" /> The Ultimate Test
                </h2>
                <blockquote className="text-lg italic border-l-4 border-primary pl-4 mb-4">
                    "If a user searches and leaves without clicking, was your search good or bad?"
                </blockquote>
                <p className="text-muted-foreground mb-4">
                    <strong>Answer:</strong> It depends.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-green-500/10 p-4 rounded-lg">
                        <p className="font-medium text-green-600 text-sm">✓ Good (no click needed)</p>
                        <p className="text-xs text-muted-foreground mt-1">User saw the answer in the snippet. "What's the capital of France?" → Paris shown in featured snippet.</p>
                    </div>
                    <div className="bg-red-500/10 p-4 rounded-lg">
                        <p className="font-medium text-red-600 text-sm">✗ Bad (gave up)</p>
                        <p className="text-xs text-muted-foreground mt-1">User saw irrelevant results and left. Zero engagement → search failed.</p>
                    </div>
                </div>
                <p className="mt-4 text-muted-foreground font-medium">
                    This nuance is why search is <em>hard</em>. You can't optimize a single metric.
                </p>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/how-to-read/problems" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Problems This Solves
                </Link>
                <Link href="/search/how-to-read/business-lever" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next: Search as a Business Lever <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
