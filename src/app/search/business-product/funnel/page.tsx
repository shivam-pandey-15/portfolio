import { Search, Database, BarChart2, Layout, MousePointer, Eye, ShoppingCart, ArrowRight, ArrowLeft, ArrowDown } from "lucide-react";
import Link from "next/link";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "P0 Priority", description: "Fix zero results. It causes direct revenue loss and user abandonment." },
    { title: "P1 Priority", description: "Improve ranking. Users rarely go past the first page." },
    { title: "Funnel Leakage", description: "Search is a 7-stage funnel. Leakage compounds at every step." },
    { title: "Presentation", description: "Bad snippets or slow load times kill conversion even with perfect ranking." }
];

export default function FunnelPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Chapter 1.5</p>
                <h1 className="text-4xl font-bold tracking-tight">Search as a Funnel</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Search is not a single action. It's a multi-stage funnel with leakage at each step.
                </p>
            </div>

            <hr className="border-border" />

            {/* The Funnel */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">The 7-Stage Search Funnel</h2>

                <div className="max-w-xl mx-auto space-y-2">
                    {/* Stage 1 */}
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Search className="w-4 h-4" />
                            <span className="font-bold">Query</span>
                        </div>
                        <p className="text-xs text-muted-foreground">100%  User types something</p>
                    </div>
                    <ArrowDown className="w-4 h-4 mx-auto text-muted-foreground" />

                    {/* Stage 2 */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Database className="w-4 h-4" />
                            <span className="font-bold">Retrieval</span>
                        </div>
                        <p className="text-xs text-muted-foreground">95%  5% zero results</p>
                    </div>
                    <ArrowDown className="w-4 h-4 mx-auto text-muted-foreground" />

                    {/* Stage 3 */}
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <BarChart2 className="w-4 h-4" />
                            <span className="font-bold">Ranking</span>
                        </div>
                        <p className="text-xs text-muted-foreground">90%  5% irrelevant in top 10</p>
                    </div>
                    <ArrowDown className="w-4 h-4 mx-auto text-muted-foreground" />

                    {/* Stage 4 */}
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Layout className="w-4 h-4" />
                            <span className="font-bold">Presentation</span>
                        </div>
                        <p className="text-xs text-muted-foreground">85%  5% bad UX/slow</p>
                    </div>
                    <ArrowDown className="w-4 h-4 mx-auto text-muted-foreground" />

                    {/* Stage 5 */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <MousePointer className="w-4 h-4" />
                            <span className="font-bold">Click</span>
                        </div>
                        <p className="text-xs text-muted-foreground">30%  55% no click</p>
                    </div>
                    <ArrowDown className="w-4 h-4 mx-auto text-muted-foreground" />

                    {/* Stage 6 */}
                    <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Eye className="w-4 h-4" />
                            <span className="font-bold">Engagement</span>
                        </div>
                        <p className="text-xs text-muted-foreground">20%  10% bounce</p>
                    </div>
                    <ArrowDown className="w-4 h-4 mx-auto text-muted-foreground" />

                    {/* Stage 7 */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <ShoppingCart className="w-4 h-4" />
                            <span className="font-bold">Conversion</span>
                        </div>
                        <p className="text-xs text-muted-foreground">5%  Final purchase/action</p>
                    </div>
                </div>
            </section>

            {/* Stage Details */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Optimization by Stage</h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <Search className="w-4 h-4 text-primary" /> 1. Query
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">User types something in the search box.</p>
                        <div className="text-sm">
                            <p className="font-medium mb-1">Leakage</p>
                            <ul className="text-muted-foreground space-y-1 text-xs">
                                <li>• Abandonment (started but didn't submit)</li>
                                <li>• Typos</li>
                                <li>• Vague queries</li>
                            </ul>
                        </div>
                        <div className="mt-3 text-sm">
                            <p className="font-medium mb-1">Fix</p>
                            <p className="text-xs text-muted-foreground">Autocomplete, spell correction, query suggestions</p>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <Database className="w-4 h-4 text-blue-500" /> 2. Retrieval
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">System finds candidate documents.</p>
                        <div className="text-sm">
                            <p className="font-medium mb-1">Leakage</p>
                            <ul className="text-muted-foreground space-y-1 text-xs">
                                <li>• Zero results</li>
                                <li>• Low recall (relevant items missed)</li>
                            </ul>
                        </div>
                        <div className="mt-3 text-sm">
                            <p className="font-medium mb-1">Fix</p>
                            <p className="text-xs text-muted-foreground">Synonyms, stemming, fuzzy matching, vector search</p>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <BarChart2 className="w-4 h-4 text-purple-500" /> 3. Ranking
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">System orders candidates by relevance.</p>
                        <div className="text-sm">
                            <p className="font-medium mb-1">Leakage</p>
                            <ul className="text-muted-foreground space-y-1 text-xs">
                                <li>• Best item at position 50, not 1</li>
                                <li>• Popularity ≠ relevance</li>
                            </ul>
                        </div>
                        <div className="mt-3 text-sm">
                            <p className="font-medium mb-1">Fix</p>
                            <p className="text-xs text-muted-foreground">Feature engineering, LTR, business rules</p>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <Layout className="w-4 h-4 text-orange-500" /> 4. Presentation
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">System displays results to user.</p>
                        <div className="text-sm">
                            <p className="font-medium mb-1">Leakage</p>
                            <ul className="text-muted-foreground space-y-1 text-xs">
                                <li>• Slow load (user leaves)</li>
                                <li>• Bad snippets (can't tell relevance)</li>
                            </ul>
                        </div>
                        <div className="mt-3 text-sm">
                            <p className="font-medium mb-1">Fix</p>
                            <p className="text-xs text-muted-foreground">Fast rendering, rich snippets, highlighting</p>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <MousePointer className="w-4 h-4 text-yellow-500" /> 5. Click
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">User clicks on a result.</p>
                        <div className="text-sm">
                            <p className="font-medium mb-1">Leakage</p>
                            <ul className="text-muted-foreground space-y-1 text-xs">
                                <li>• No click (user saw results but didn't click)</li>
                                <li>• Pogo-sticking (click → back → click another)</li>
                            </ul>
                        </div>
                        <div className="mt-3 text-sm">
                            <p className="font-medium mb-1">Fix</p>
                            <p className="text-xs text-muted-foreground">Better titles, position optimization, diversity</p>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4 text-green-500" /> 6-7. Engage & Convert
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">User takes desired action.</p>
                        <div className="text-sm">
                            <p className="font-medium mb-1">Leakage</p>
                            <ul className="text-muted-foreground space-y-1 text-xs">
                                <li>• Bounce (returns to search immediately)</li>
                                <li>• Cart abandonment</li>
                            </ul>
                        </div>
                        <div className="mt-3 text-sm">
                            <p className="font-medium mb-1">Fix</p>
                            <p className="text-xs text-muted-foreground">Better product pages, streamlined checkout</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Real Numbers */}
            <section className="bg-secondary/20 p-8 rounded-xl border border-border">
                <h2 className="text-xl font-semibold mb-6">Real Funnel Numbers</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-2 px-3 font-medium">Stage</th>
                                <th className="text-right py-2 px-3 font-medium">Count</th>
                                <th className="text-right py-2 px-3 font-medium">Drop</th>
                            </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                            <tr className="border-b border-border/50">
                                <td className="py-2 px-3">Query</td>
                                <td className="py年 2 px-3 text-right">100,000</td>
                                <td className="py-2 px-3 text-right"></td>
                            </tr>
                            <tr className="border-b border-border/50">
                                <td className="py-2 px-3">Retrieval</td>
                                <td className="py-2 px-3 text-right">95,000</td>
                                <td className="py-2 px-3 text-right text-red-500">-5%</td>
                            </tr>
                            <tr className="border-b border-border/50">
                                <td className="py-2 px-3">Ranking (good top 10)</td>
                                <td className="py-2 px-3 text-right">85,500</td>
                                <td className="py-2 px-3 text-right text-red-500">-10%</td>
                            </tr>
                            <tr className="border-b border-border/50">
                                <td className="py-2 px-3">Presentation</td>
                                <td className="py-2 px-3 text-right">81,225</td>
                                <td className="py-2 px-3 text-right text-red-500">-5%</td>
                            </tr>
                            <tr className="border-b border-border/50">
                                <td className="py-2 px-3">Click</td>
                                <td className="py-2 px-3 text-right">32,490</td>
                                <td className="py-2 px-3 text-right text-red-500">-60%</td>
                            </tr>
                            <tr className="border-b border-border/50">
                                <td className="py-2 px-3">Engagement</td>
                                <td className="py-2 px-3 text-right">22,743</td>
                                <td className="py-2 px-3 text-right text-red-500">-30%</td>
                            </tr>
                            <tr className="font-medium">
                                <td className="py-2 px-3 text-green-600">Conversion</td>
                                <td className="py-2 px-3 text-right text-green-600">5,686</td>
                                <td className="py-2 px-3 text-right">5.69% CVR</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />


            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/business-product/types" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Types of Search Systems
                </Link>
                <Link href="/search/business-product/metrics" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next: Success Metrics <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
