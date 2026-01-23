import { BarChart3, LineChart, AlertTriangle, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MetricsPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Chapter 1.6</p>
                <h1 className="text-4xl font-bold tracking-tight">Defining Success Metrics for Search</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    How do you know if your search is good? It's not as simple as "users find what they want."
                </p>
            </div>

            <hr className="border-border" />

            {/* Offline vs Online */}
            <section className="grid gap-6 md:grid-cols-2">
                <div className="border border-blue-500/30 rounded-xl p-6 bg-blue-500/5">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-500" /> Offline Metrics
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">Measured on a fixed dataset, before deployment.</p>
                    <ul className="text-sm space-y-2">
                        <li>✓ Used for model development</li>
                        <li>✓ Doesn't require production traffic</li>
                        <li>✗ Doesn't capture real user behavior</li>
                    </ul>
                </div>

                <div className="border border-green-500/30 rounded-xl p-6 bg-green-500/5">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LineChart className="w-5 h-5 text-green-500" /> Online Metrics
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">Measured on live traffic, after deployment.</p>
                    <ul className="text-sm space-y-2">
                        <li>✓ Reflects real user satisfaction</li>
                        <li>✓ Requires A/B testing infrastructure</li>
                        <li>✗ More expensive to measure</li>
                    </ul>
                </div>
            </section>

            {/* Offline Metrics Detail */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Offline Metrics</h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-2">Precision@K</h3>
                        <p className="text-sm text-muted-foreground mb-3">Of the top K results, how many are relevant?</p>
                        <div className="bg-secondary/30 p-3 rounded-lg text-xs font-mono">
                            Precision@K = Relevant in top K / K
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                            <strong>Example:</strong> Top 5 results: 4 relevant, 1 not. Precision@5 = 0.80
                        </p>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-2">Recall@K</h3>
                        <p className="text-sm text-muted-foreground mb-3">Of all relevant items, how many are in top K?</p>
                        <div className="bg-secondary/30 p-3 rounded-lg text-xs font-mono">
                            Recall@K = Relevant in top K / Total relevant
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                            <strong>Example:</strong> 100 relevant items exist, 40 in top 50. Recall@50 = 0.40
                        </p>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-2">NDCG</h3>
                        <p className="text-sm text-muted-foreground mb-3">Quality of ranking, giving more weight to top positions.</p>
                        <div className="bg-secondary/30 p-3 rounded-lg text-xs">
                            <p><strong>Intuition:</strong></p>
                            <p className="text-muted-foreground">Relevant item at #1 is better than at #10</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                            <strong>Range:</strong> 0 to 1 (1 is perfect ranking)
                        </p>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-2">MRR (Mean Reciprocal Rank)</h3>
                        <p className="text-sm text-muted-foreground mb-3">How high is the first relevant result?</p>
                        <div className="bg-secondary/30 p-3 rounded-lg text-xs font-mono">
                            MRR = Avg(1 / position of first relevant)
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                            <strong>Use:</strong> When user typically only wants one result
                        </p>
                    </div>
                </div>
            </section>

            {/* Online Metrics Detail */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Online Metrics</h2>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 font-semibold">Metric</th>
                                <th className="text-left py-3 px-4 font-semibold">What It Measures</th>
                                <th className="text-left py-3 px-4 font-semibold">Benchmarks</th>
                            </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                            <tr className="border-b border-border/50">
                                <td className="py-3 px-4 font-medium">CTR</td>
                                <td className="py-3 px-4">% of searches that result in a click</td>
                                <td className="py-3 px-4">E-commerce: 30-50%</td>
                            </tr>
                            <tr className="border-b border-border/50">
                                <td className="py-3 px-4 font-medium">Zero Result Rate</td>
                                <td className="py-3 px-4">% of searches with no results</td>
                                <td className="py-3 px-4">Good: &lt;5%, Bad: &gt;10%</td>
                            </tr>
                            <tr className="border-b border-border/50">
                                <td className="py-3 px-4 font-medium">Reformulation Rate</td>
                                <td className="py-3 px-4">% of searches followed by another search</td>
                                <td className="py-3 px-4">Good: &lt;15%, Bad: &gt;30%</td>
                            </tr>
                            <tr className="border-b border-border/50">
                                <td className="py-3 px-4 font-medium">Time to First Click</td>
                                <td className="py-3 px-4">How long until user clicks a result</td>
                                <td className="py-3 px-4">Good: &lt;5 seconds</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-medium">Conversion Rate</td>
                                <td className="py-3 px-4">% of searches that lead to purchase</td>
                                <td className="py-3 px-4">Average: 2-5%, Good: 5-10%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Offline vs Online Tradeoffs */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">The Offline-Online Tradeoff</h2>
                <p className="text-muted-foreground">
                    Offline and online metrics often disagree. Understanding why is critical.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 font-semibold">Scenario</th>
                                <th className="text-left py-3 px-4 font-semibold">Offline Result</th>
                                <th className="text-left py-3 px-4 font-semibold">Online Result</th>
                                <th className="text-left py-3 px-4 font-semibold">Why?</th>
                            </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                            <tr className="border-b border-border/50">
                                <td className="py-3 px-4 font-medium">Better reranker model</td>
                                <td className="py-3 px-4 text-green-600">NDCG +5%</td>
                                <td className="py-3 px-4 text-red-500">CTR unchanged</td>
                                <td className="py-3 px-4">Latency increased 200ms, users bounced</td>
                            </tr>
                            <tr className="border-b border-border/50">
                                <td className="py-3 px-4 font-medium">Add popular items boost</td>
                                <td className="py-3 px-4 text-red-500">NDCG -2%</td>
                                <td className="py-3 px-4 text-green-600">CTR +8%</td>
                                <td className="py-3 px-4">Users prefer familiar items, labels are stale</td>
                            </tr>
                            <tr className="border-b border-border/50">
                                <td className="py-3 px-4 font-medium">Personalization</td>
                                <td className="py-3 px-4 text-yellow-600">Can't measure</td>
                                <td className="py-3 px-4 text-green-600">Conv +12%</td>
                                <td className="py-3 px-4">Offline labels don't capture user preferences</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-medium">Remove duplicates</td>
                                <td className="py-3 px-4 text-green-600">Recall -10%</td>
                                <td className="py-3 px-4 text-green-600">CTR +15%</td>
                                <td className="py-3 px-4">Fewer items, but user sees diversity</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="border border-blue-500/30 rounded-xl p-5 bg-blue-500/5">
                        <h3 className="font-bold mb-2">When to Trust Offline</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Comparing ranking algorithms (A vs B)</li>
                            <li>• Fast iteration during development</li>
                            <li>• When labels are high-quality and fresh</li>
                            <li>• Regression testing before deploy</li>
                        </ul>
                    </div>

                    <div className="border border-green-500/30 rounded-xl p-5 bg-green-500/5">
                        <h3 className="font-bold mb-2">When to Trust Online</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Measuring actual user satisfaction</li>
                            <li>• Personalization features</li>
                            <li>• Speed/latency tradeoffs</li>
                            <li>• Final go/no-go decision</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
                    <p className="font-medium text-sm mb-2">🎯 The Golden Rule</p>
                    <p className="text-sm text-muted-foreground">
                        <strong>Offline metrics gate deployment. Online metrics confirm success.</strong>
                        <br />
                        Never ship something that regresses offline AND online. But a small offline regression might be acceptable if online wins big.
                    </p>
                </div>
            </section>

            {/* Metric Traps */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-yellow-500" /> Metric Traps
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="border border-yellow-500/30 rounded-xl p-5 bg-yellow-500/5">
                        <h3 className="font-bold mb-2">Goodhart's Law</h3>
                        <p className="text-sm text-muted-foreground mb-3">"When a measure becomes a target, it ceases to be a good measure."</p>
                        <div className="text-xs bg-background p-3 rounded-lg">
                            <strong>Example:</strong> Optimize for CTR → Show clickbait titles → Users click but don't convert
                        </div>
                    </div>

                    <div className="border border-yellow-500/30 rounded-xl p-5 bg-yellow-500/5">
                        <h3 className="font-bold mb-2">Vanity Metrics</h3>
                        <p className="text-sm text-muted-foreground mb-3">Metrics that look good but don't matter.</p>
                        <div className="text-xs bg-background p-3 rounded-lg">
                            <strong>Example:</strong> "We have 1M searches per day!" (But most return garbage)
                        </div>
                    </div>

                    <div className="border border-yellow-500/30 rounded-xl p-5 bg-yellow-500/5">
                        <h3 className="font-bold mb-2">Missing Context</h3>
                        <p className="text-sm text-muted-foreground mb-3">Same metric, different meaning.</p>
                        <div className="text-xs bg-background p-3 rounded-lg">
                            <strong>Example:</strong> 0% ZRR could mean great coverage OR returning irrelevant results instead of "no match"
                        </div>
                    </div>

                    <div className="border border-yellow-500/30 rounded-xl p-5 bg-yellow-500/5">
                        <h3 className="font-bold mb-2">Position Bias</h3>
                        <p className="text-sm text-muted-foreground mb-3">Higher results get more clicks regardless of relevance.</p>
                        <div className="text-xs bg-background p-3 rounded-lg">
                            <strong>Example:</strong> High CTR on #1 doesn't mean #1 is best  users just click top results
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard */}
            <section className="bg-secondary/20 p-8 rounded-xl border border-border">
                <h2 className="text-xl font-semibold mb-6">Recommended Dashboard</h2>

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <h3 className="font-bold mb-3">Daily Monitoring</h3>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-2 font-medium">Metric</th>
                                    <th className="text-left py-2 font-medium">Target</th>
                                    <th className="text-left py-2 font-medium">Alert If</th>
                                </tr>
                            </thead>
                            <tbody className="text-muted-foreground">
                                <tr className="border-b border-border/50">
                                    <td className="py-2">ZRR</td>
                                    <td className="py-2">&lt;5%</td>
                                    <td className="py-2 text-red-500">&gt;8%</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-2">CTR</td>
                                    <td className="py-2">&gt;35%</td>
                                    <td className="py-2 text-red-500">&lt;25%</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-2">P99 Latency</td>
                                    <td className="py-2">&lt;200ms</td>
                                    <td className="py-2 text-red-500">&gt;500ms</td>
                                </tr>
                                <tr>
                                    <td className="py-2">Search Volume</td>
                                    <td className="py-2">Baseline</td>
                                    <td className="py-2 text-red-500">-20%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <h3 className="font-bold mb-3">Weekly Review</h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span>Top zero-result queries → Add synonyms</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span>Low CTR queries → Check ranking</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span>Slow queries → Optimize or cache</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span>Conversion by query type → Business opportunities</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <section className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                <h2 className="text-lg font-semibold mb-4">Key Takeaways</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Offline metrics</strong> (NDCG, Precision) for development; <strong>Online metrics</strong> (CTR, ZRR) for production</li>
                    <li>• <strong>Zero Result Rate is the first metric to fix</strong>  direct revenue loss</li>
                    <li>• <strong>CTR can be misleading</strong>  high CTR + low conversion = clickbait</li>
                    <li>• <strong>Use multiple metrics together</strong>  no single metric tells the whole story</li>
                    <li>• <strong>Set alerts for anomalies</strong>  catch regressions early</li>
                </ul>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/business-product/funnel" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Search as a Funnel
                </Link>
                <Link href="/search/query-understanding" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next Chapter: Query Understanding <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
