import { AlertTriangle, Zap, Clock, Copy, Filter, DollarSign, ArrowRight, ArrowLeft, TrendingDown } from "lucide-react";
import Link from "next/link";

export default function FailurePage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Chapter 1.2</p>
                <h1 className="text-4xl font-bold tracking-tight">When Search Fails</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Revenue, retention, and trust all suffer when search doesn't work.
                </p>
            </div>

            <hr className="border-border" />

            {/* Case Studies */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Real-World Case Studies</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="border-l-4 border-red-500 bg-red-500/5 p-4 rounded-r-lg">
                        <p className="font-bold text-sm">Flipkart Big Billion Days</p>
                        <p className="text-xs text-muted-foreground mt-1">Search latency spiked to 3+ seconds during peak sale. Estimated ₹50Cr+ lost in 4 hours.</p>
                    </div>
                    <div className="border-l-4 border-orange-500 bg-orange-500/5 p-4 rounded-r-lg">
                        <p className="font-bold text-sm">Slack Enterprise</p>
                        <p className="text-xs text-muted-foreground mt-1">"Can't find anything" complaints. 15% increase in support tickets, customer churn.</p>
                    </div>
                    <div className="border-l-4 border-blue-500 bg-blue-500/5 p-4 rounded-r-lg">
                        <p className="font-bold text-sm">Booking.com</p>
                        <p className="text-xs text-muted-foreground mt-1">"Paris" query showed Paris, Texas first due to freshness signal. Social media mockery.</p>
                    </div>
                    <div className="border-l-4 border-purple-500 bg-purple-500/5 p-4 rounded-r-lg">
                        <p className="font-bold text-sm">GitHub (Pre-2023)</p>
                        <p className="text-xs text-muted-foreground mt-1">Developers couldn't find code. Used external tools. Complete search rewrite in 2023.</p>
                    </div>
                </div>
            </section>

            {/* Failure Modes */}
            <section className="space-y-8">
                <h2 className="text-2xl font-semibold">The 5 Failure Modes</h2>

                {/* Zero Results */}
                <div className="border border-red-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                        </div>
                        <h3 className="font-bold text-lg">1. Zero Results</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">User searches for something you have, but gets "No results found."</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-2 px-3">Query</th>
                                    <th className="text-left py-2 px-3">Catalog Has</th>
                                    <th className="text-left py-2 px-3">Root Cause</th>
                                </tr>
                            </thead>
                            <tbody className="text-muted-foreground">
                                <tr className="border-b border-border/50">
                                    <td className="py-2 px-3">"iPhone charger"</td>
                                    <td className="py-2 px-3">Lightning cables</td>
                                    <td className="py-2 px-3">Missing synonym</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-2 px-3">"grey sweater"</td>
                                    <td className="py-2 px-3">"gray sweater"</td>
                                    <td className="py-2 px-3">Spelling variation</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-3">"laptop under $500"</td>
                                    <td className="py-2 px-3">Laptops at $499</td>
                                    <td className="py-2 px-3">Price filter bug</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 p-3 bg-red-500/10 rounded-lg text-sm">
                        <strong>Impact:</strong> Industry average ZRR: 5-15%. Best-in-class (Amazon): &lt;2%. Each 1% reduction = ~1-2% revenue lift.
                    </div>
                </div>

                {/* Irrelevant Results */}
                <div className="border border-orange-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                            <TrendingDown className="w-5 h-5 text-orange-500" />
                        </div>
                        <h3 className="font-bold text-lg">2. Irrelevant Results</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">Results exist but they're wrong.</p>
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="bg-secondary/30 p-3 rounded-lg text-sm">
                            <p className="font-medium">Query: "cheap laptop"</p>
                            <p className="text-muted-foreground text-xs">Got: $2000 MacBook (popularity over intent)</p>
                        </div>
                        <div className="bg-secondary/30 p-3 rounded-lg text-sm">
                            <p className="font-medium">Query: "running shoes size 10"</p>
                            <p className="text-muted-foreground text-xs">Got: All sizes (filter not applied)</p>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-orange-500/10 rounded-lg text-sm">
                        <strong>The Position 1 Problem:</strong> 68% of clicks go to positions 1-3. Wrong #1 = failed search.
                    </div>
                </div>

                {/* Slow Search */}
                <div className="border border-yellow-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <Clock className="w-5 h-5 text-yellow-500" />
                        </div>
                        <h3 className="font-bold text-lg">3. Slow Search</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">Results are relevant but take too long.</p>
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded text-sm">
                            <span className="font-mono font-bold text-green-600 w-24">&lt; 100ms</span>
                            <span className="text-muted-foreground">Feels instant</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded text-sm">
                            <span className="font-mono font-bold text-yellow-600 w-24">300-1000ms</span>
                            <span className="text-muted-foreground">Attention wanders (-2% revenue)</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-red-500/10 rounded text-sm">
                            <span className="font-mono font-bold text-red-600 w-24">&gt; 1s</span>
                            <span className="text-muted-foreground">User opens new tab (-5% revenue)</span>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg text-sm">
                        <strong>Amazon data:</strong> 100ms latency = 1% revenue loss ($4B/year at their scale)
                    </div>
                </div>

                {/* Duplicates */}
                <div className="border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Copy className="w-5 h-5 text-blue-500" />
                        </div>
                        <h3 className="font-bold text-lg">4. Duplicate/Spam Results</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">Same product appears multiple times, or junk appears in results.</p>
                    <div className="bg-secondary/30 p-4 rounded-lg text-sm">
                        <p className="font-medium mb-2">Marketplace Problem:</p>
                        <p className="text-muted-foreground">Query "iPhone 15 case" → 47 identical listings from different sellers. User has to manually compare.</p>
                    </div>
                </div>

                {/* Broken Filters */}
                <div className="border border-purple-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Filter className="w-5 h-5 text-purple-500" />
                        </div>
                        <h3 className="font-bold text-lg">5. Broken Filters</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">User applies a filter, but results don't respect it.</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-2 px-3">Filter</th>
                                    <th className="text-left py-2 px-3">Expected</th>
                                    <th className="text-left py-2 px-3">Got</th>
                                </tr>
                            </thead>
                            <tbody className="text-muted-foreground">
                                <tr className="border-b border-border/50">
                                    <td className="py-2 px-3">"In stock only"</td>
                                    <td className="py-2 px-3">Available items</td>
                                    <td className="py-2 px-3">Out of stock (indexing lag)</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-3">"4+ stars"</td>
                                    <td className="py-2 px-3">Highly rated</td>
                                    <td className="py-2 px-3">3 reviews @ 5 stars each</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Revenue Impact */}
            <section className="bg-red-500/5 border border-red-500/20 rounded-xl p-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" /> Quantifying the Damage
                </h2>
                <div className="bg-background p-4 rounded-lg font-mono text-sm mb-4">
                    Lost Revenue = (Zero Result Searches × AOV × CVR) + (Slow Searches × Bounce Rate × AOV)
                </div>
                <div className="grid gap-4 md:grid-cols-4 text-center">
                    <div>
                        <p className="text-2xl font-bold">100K</p>
                        <p className="text-xs text-muted-foreground">Daily searches</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-500">8%</p>
                        <p className="text-xs text-muted-foreground">Zero result rate</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-500">$80K/day</p>
                        <p className="text-xs text-muted-foreground">Lost revenue</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-500">$29M/year</p>
                        <p className="text-xs text-muted-foreground">Annual impact</p>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/business-product/importance" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Why Search is the Heart
                </Link>
                <Link href="/search/business-product/comparison" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next: Search vs Discovery vs Recs <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
