import { DollarSign, TrendingUp, ShieldCheck, Rocket, Calculator, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BusinessLeverPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Chapter 0.4</p>
                <h1 className="text-4xl font-bold tracking-tight">Search as a Business Lever</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Why search is a profit center, not a cost center.
                </p>
            </div>

            <hr className="border-border" />

            {/* Revenue Connection */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <DollarSign className="w-6 h-6" /> The Revenue Connection
                </h2>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
                        <p className="text-4xl font-bold text-green-600">43%</p>
                        <p className="text-sm text-muted-foreground mt-2">of e-commerce visitors go directly to search</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 text-center">
                        <p className="text-4xl font-bold text-blue-600">2-3x</p>
                        <p className="text-sm text-muted-foreground mt-2">higher conversion for search users vs browsers</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                        <p className="text-4xl font-bold text-red-600">12%</p>
                        <p className="text-sm text-muted-foreground mt-2">revenue drop per 100ms of added latency</p>
                    </div>
                </div>
            </section>

            {/* Case Study */}
            <section className="bg-secondary/20 p-8 rounded-xl border border-border space-y-6">
                <h2 className="text-xl font-semibold">Case Study: The Zero Result Problem</h2>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Company</p>
                        <p>Mid-size e-commerce, 500K products</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Problem</p>
                        <p>8% of searches return zero results</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Analysis</p>
                        <ul className="text-muted-foreground space-y-1">
                            <li>• 8% zero result rate × 100K daily searches = 8,000 frustrated users/day</li>
                            <li>• If 20% of those would have converted at $50 AOV → $80K/day lost</li>
                            <li>• Annual impact: ~$29M</li>
                        </ul>
                    </div>
                    <div className="pt-4 border-t border-border">
                        <p className="text-sm font-medium text-green-600">Fix</p>
                        <p className="text-muted-foreground">Added spell correction + synonym expansion</p>
                        <p className="font-medium mt-2">Result: Zero result rate dropped to 2%. Revenue up 6%.</p>
                    </div>
                </div>
            </section>

            {/* The Moat */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6" /> The Competitive Moat
                </h2>

                <p className="text-muted-foreground">Search is hard to copy because of:</p>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-2">Data Flywheel</h3>
                        <p className="text-sm text-muted-foreground">
                            Better search → More users → More click data → Even better search
                        </p>
                    </div>
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-2">Behavioral Signals</h3>
                        <p className="text-sm text-muted-foreground">
                            Your click logs are proprietary. Competitors can't replicate.
                        </p>
                    </div>
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-2">Domain Knowledge</h3>
                        <p className="text-sm text-muted-foreground">
                            Synonyms, entity extraction, business rules encoded over years.
                        </p>
                    </div>
                </div>
            </section>

            {/* Executive Communication */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" /> Talking to Leadership
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                        <p className="text-sm font-medium text-red-600 mb-2">❌ Wrong</p>
                        <p className="text-muted-foreground italic">
                            "We need to upgrade Elasticsearch to version 8."
                        </p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6">
                        <p className="text-sm font-medium text-green-600 mb-2">✓ Right</p>
                        <p className="text-muted-foreground italic">
                            "Our zero-result rate is 8%, costing ~$80K/day. Upgrading enables spell correction,
                            reducing this to 3%. ROI: 4-6 months."
                        </p>
                    </div>
                </div>

                <div className="bg-secondary/20 p-6 rounded-xl border border-border">
                    <p className="font-mono text-sm">
                        Business Impact = (Query Volume) × (Conversion Rate Delta) × (AOV)
                    </p>
                </div>
            </section>

            {/* Prioritization */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Calculator className="w-6 h-6" /> Prioritization Framework
                </h2>

                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-semibold">Problem</th>
                            <th className="text-left py-3 px-4 font-semibold">Impact</th>
                            <th className="text-left py-3 px-4 font-semibold">Effort</th>
                            <th className="text-left py-3 px-4 font-semibold">Priority</th>
                        </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                        <tr className="border-b border-border/50">
                            <td className="py-3 px-4">Zero results on head queries</td>
                            <td className="py-3 px-4 text-red-600 font-medium">Very High</td>
                            <td className="py-3 px-4 text-green-600">Low</td>
                            <td className="py-3 px-4 font-bold">P0</td>
                        </tr>
                        <tr className="border-b border-border/50">
                            <td className="py-3 px-4">Slow latency (P99 &gt; 500ms)</td>
                            <td className="py-3 px-4 text-orange-600 font-medium">High</td>
                            <td className="py-3 px-4 text-yellow-600">Medium</td>
                            <td className="py-3 px-4 font-bold">P1</td>
                        </tr>
                        <tr className="border-b border-border/50">
                            <td className="py-3 px-4">Bad ranking on long-tail</td>
                            <td className="py-3 px-4 text-yellow-600 font-medium">Medium</td>
                            <td className="py-3 px-4 text-red-600">High</td>
                            <td className="py-3 px-4 font-bold">P2</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4">Personalization</td>
                            <td className="py-3 px-4 text-yellow-600 font-medium">Medium</td>
                            <td className="py-3 px-4 text-red-600">Very High</td>
                            <td className="py-3 px-4 font-bold">P3</td>
                        </tr>
                    </tbody>
                </table>

                <p className="text-sm text-muted-foreground">
                    <strong>Rule of thumb:</strong> Fix the head queries first (20% of queries = 80% of revenue).
                    Then optimize the long tail for marginal gains.
                </p>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/how-to-read/what-is-good-search" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> What Good Search Means
                </Link>
                <Link href="/search/how-to-read/real-world-vs-leetcode" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next: Real-World vs LeetCode <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
