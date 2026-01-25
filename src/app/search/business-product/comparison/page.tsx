import { Search, Sparkles, Compass, ArrowRight, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Search", description: "High intent, precision-focused (User: \"I want X\")" },
    { title: "Recommendation", description: "Low intent, engagement-focused (System: \"You might like Y\")" },
    { title: "Discovery", description: "Medium intent, exploration-focused (User: \"Show me category Z\")" },
    { title: "Hybrid Reality", description: "The best products (e.g., Netflix, Amazon) combine all three seamlessly." }
];

export default function ComparisonPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Chapter 1.3</p>
                <h1 className="text-4xl font-bold tracking-tight">Search vs Discovery vs Recommendation</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Three different problems that are often confused. Understanding the difference is crucial.
                </p>
            </div>

            <hr className="border-border" />

            {/* Three Pillars */}
            <section className="grid gap-6 md:grid-cols-3">
                <div className="border border-primary/50 rounded-xl p-6 bg-primary/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Search className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-bold text-xl">Search</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">User knows what they want.</p>
                    <ul className="text-sm space-y-2">
                        <li><strong>Input:</strong> Explicit query</li>
                        <li><strong>Output:</strong> Ranked list</li>
                        <li><strong>Goal:</strong> Precision</li>
                        <li><strong>Intent:</strong> High</li>
                    </ul>
                    <div className="mt-4 p-3 bg-background rounded-lg text-xs">
                        <strong>Example:</strong> "running shoes size 10"
                    </div>
                </div>

                <div className="border border-orange-500/50 rounded-xl p-6 bg-orange-500/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                            <Sparkles className="w-6 h-6 text-orange-500" />
                        </div>
                        <h3 className="font-bold text-xl">Recommendation</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">System suggests what user might like.</p>
                    <ul className="text-sm space-y-2">
                        <li><strong>Input:</strong> User history</li>
                        <li><strong>Output:</strong> Personalized suggestions</li>
                        <li><strong>Goal:</strong> Engagement</li>
                        <li><strong>Intent:</strong> Low</li>
                    </ul>
                    <div className="mt-4 p-3 bg-background rounded-lg text-xs">
                        <strong>Example:</strong> "Because you watched..."
                    </div>
                </div>

                <div className="border border-blue-500/50 rounded-xl p-6 bg-blue-500/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Compass className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="font-bold text-xl">Discovery</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">User is exploring, not hunting.</p>
                    <ul className="text-sm space-y-2">
                        <li><strong>Input:</strong> Clicks, filters</li>
                        <li><strong>Output:</strong> Navigation UX</li>
                        <li><strong>Goal:</strong> Exploration</li>
                        <li><strong>Intent:</strong> Medium</li>
                    </ul>
                    <div className="mt-4 p-3 bg-background rounded-lg text-xs">
                        <strong>Example:</strong> Browse Electronics → Phones
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="overflow-x-auto">
                <h2 className="text-2xl font-semibold mb-6">Side-by-Side Comparison</h2>
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-semibold">Aspect</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Search</th>
                            <th className="text-left py-3 px-4 font-semibold text-orange-500">Recommendation</th>
                            <th className="text-left py-3 px-4 font-semibold text-blue-500">Discovery</th>
                        </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                        <tr className="border-b border-border/50">
                            <td className="py-3 px-4 font-medium">User Intent</td>
                            <td className="py-3 px-4">High (knows what)</td>
                            <td className="py-3 px-4">Low (open to ideas)</td>
                            <td className="py-3 px-4">Medium (knows category)</td>
                        </tr>
                        <tr className="border-b border-border/50">
                            <td className="py-3 px-4 font-medium">Personalization</td>
                            <td className="py-3 px-4">Low-Medium</td>
                            <td className="py-3 px-4">Very High</td>
                            <td className="py-3 px-4">Medium</td>
                        </tr>
                        <tr className="border-b border-border/50">
                            <td className="py-3 px-4 font-medium">Latency Sensitivity</td>
                            <td className="py-3 px-4">Very High</td>
                            <td className="py-3 px-4">Medium</td>
                            <td className="py-3 px-4">Low</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 font-medium">Success Metric</td>
                            <td className="py-3 px-4">CTR, ZRR</td>
                            <td className="py-3 px-4">Engagement, CVR</td>
                            <td className="py-3 px-4">Browse depth</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* When to Use */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">When to Use Which</h2>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-3 text-primary">Search: The Direct Path</h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• Users with specific intent</li>
                            <li>• Transactional queries ("buy X")</li>
                            <li>• Repeat purchases</li>
                            <li>• Research queries ("compare X vs Y")</li>
                        </ul>
                    </div>

                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-3 text-orange-500">Recs: The Suggestion Engine</h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• Homepage personalization</li>
                            <li>• "You might also like" sections</li>
                            <li>• Email campaigns</li>
                            <li>• Cart upsells</li>
                        </ul>
                    </div>

                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-3 text-blue-500">Discovery: The Exploration Flow</h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• New users exploring</li>
                            <li>• Window shoppers</li>
                            <li>• Category exploration</li>
                            <li>• Gift shoppers</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Netflix Example */}
            <section className="bg-secondary/20 p-8 rounded-xl border border-border">
                <h2 className="text-xl font-semibold mb-4">The Hybrid Reality: Netflix</h2>
                <p className="text-muted-foreground mb-4">Netflix combines all three seamlessly:</p>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-background p-4 rounded-lg">
                        <p className="font-medium mb-2 flex items-center gap-2">
                            <Search className="w-4 h-4 text-primary" /> Search
                        </p>
                        <p className="text-sm text-muted-foreground">User types "comedy"</p>
                    </div>
                    <div className="bg-background p-4 rounded-lg">
                        <p className="font-medium mb-2 flex items-center gap-2">
                            <Compass className="w-4 h-4 text-blue-500" /> Discovery
                        </p>
                        <p className="text-sm text-muted-foreground">Browse by genre, trending</p>
                    </div>
                    <div className="bg-background p-4 rounded-lg">
                        <p className="font-medium mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-orange-500" /> Recommendation
                        </p>
                        <p className="text-sm text-muted-foreground">"Because you watched..."</p>
                    </div>
                </div>
            </section>

            {/* Common Mistakes */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Common Mistakes</h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="border border-red-500/30 rounded-xl p-6 bg-red-500/5">
                        <p className="font-medium mb-2 flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-500" /> "We have Elasticsearch, search is done"
                        </p>
                        <p className="text-sm text-muted-foreground">Reality: Search needs ranking, personalization, and continuous improvement.</p>
                    </div>

                    <div className="border border-red-500/30 rounded-xl p-6 bg-red-500/5">
                        <p className="font-medium mb-2 flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-500" /> Over-Personalizing Search
                        </p>
                        <p className="text-sm text-muted-foreground">Reality: "iPhone" should show iPhones, regardless of who searches.</p>
                    </div>

                    <div className="border border-red-500/30 rounded-xl p-6 bg-red-500/5">
                        <p className="font-medium mb-2 flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-500" /> Ignoring Discovery
                        </p>
                        <p className="text-sm text-muted-foreground">Reality: New users don't know your catalog. Discovery helps them explore.</p>
                    </div>

                    <div className="border border-red-500/30 rounded-xl p-6 bg-red-500/5">
                        <p className="font-medium mb-2 flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-500" /> Separate Teams, No Coordination
                        </p>
                        <p className="text-sm text-muted-foreground">Result: Conflicting experiences between search and recommendations.</p>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />


            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/business-product/failure" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> When Search Fails
                </Link>
                <Link href="/search/business-product/types" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next: Types of Search Systems <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
