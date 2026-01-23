import { Heart, TrendingUp, DollarSign, Shield, ArrowRight, ArrowLeft, Building2, ShoppingCart, Search, Code, Play, Database } from "lucide-react";
import Link from "next/link";

export default function ImportancePage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Chapter 1.1</p>
                <h1 className="text-4xl font-bold tracking-tight">Why Search is the Heart of Modern Products</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Search is not a feature. It's the primary interface between user intent and product value.
                </p>
            </div>

            <hr className="border-border" />

            {/* Key Stats */}
            <section className="grid gap-4 md:grid-cols-3">
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
                    <p className="text-4xl font-bold text-green-600">40-50%</p>
                    <p className="text-sm text-muted-foreground mt-2">of Amazon revenue from search-initiated sessions</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 text-center">
                    <p className="text-4xl font-bold text-blue-600">2-3x</p>
                    <p className="text-sm text-muted-foreground mt-2">higher conversion for search users vs browsers</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 text-center">
                    <p className="text-4xl font-bold text-purple-600">8.5B</p>
                    <p className="text-sm text-muted-foreground mt-2">Google searches per day globally</p>
                </div>
            </section>

            {/* Company Examples */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Building2 className="w-6 h-6" /> Search-Centric Companies
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="border border-border rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <ShoppingCart className="w-5 h-5 text-orange-500" />
                            <h3 className="font-bold">Amazon</h3>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• Search bar is #1 most clicked element on homepage</li>
                            <li>• A9 (search engine) has 1000+ dedicated engineers</li>
                            <li>• "Customers who search are 2-3x more likely to convert"</li>
                            <li>• 40-50% of revenue from search-initiated sessions</li>
                        </ul>
                    </div>

                    <div className="border border-border rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Search className="w-5 h-5 text-blue-500" />
                            <h3 className="font-bold">Google</h3>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• $200B+ annual revenue, almost entirely from search ads</li>
                            <li>• Processes 8.5 billion searches per day</li>
                            <li>• Entire company built around search quality</li>
                            <li>• "One search covers 60% of user needs in 2 clicks"</li>
                        </ul>
                    </div>

                    <div className="border border-border rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Play className="w-5 h-5 text-red-500" />
                            <h3 className="font-bold">Netflix</h3>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• 80% of content watched via search/recommendations</li>
                            <li>• Personalized results (same query, different results per user)</li>
                            <li>• Thumbnails dynamically selected based on user taste</li>
                        </ul>
                    </div>

                    <div className="border border-border rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Code className="w-5 h-5 text-gray-500" />
                            <h3 className="font-bold">GitHub</h3>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• Code search is #1 feature request for 5+ years</li>
                            <li>• New search (2023) indexes 200M+ repositories</li>
                            <li>• 99% of developers use search as primary navigation</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Why Search Matters */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Heart className="w-6 h-6 text-red-500" /> Why Search Matters
                </h2>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-500" /> High Intent
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">Users who search know what they want. They're further down the funnel.</p>
                        <table className="w-full text-xs">
                            <tbody>
                                <tr className="border-b border-border/50">
                                    <td className="py-1">Browse homepage</td>
                                    <td className="py-1 text-right">1-2% CVR</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="py-1">Click category</td>
                                    <td className="py-1 text-right">3-5% CVR</td>
                                </tr>
                                <tr className="font-medium text-primary">
                                    <td className="py-1">Use search</td>
                                    <td className="py-1 text-right">8-15% CVR</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-500" /> Trust Signal
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Users trust search to "just work." When it fails:
                        </p>
                        <ul className="text-sm text-muted-foreground mt-3 space-y-1">
                            <li>• They blame the product, not themselves</li>
                            <li>• They lose confidence in inventory</li>
                            <li>• They churn</li>
                        </ul>
                    </div>

                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <Database className="w-4 h-4 text-purple-500" /> Retention Driver
                        </h3>
                        <p className="text-sm text-muted-foreground">Good search creates habits:</p>
                        <ul className="text-sm text-muted-foreground mt-3 space-y-1">
                            <li>• "I know I can find it here"</li>
                            <li>• Lower cognitive load → higher retention</li>
                            <li>• Power users search 5-10x more</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* The Data Flywheel */}
            <section className="bg-primary/5 border border-primary/20 rounded-xl p-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" /> The Competitive Moat
                </h2>
                <p className="text-muted-foreground mb-4">Search is hard to copy because of the data flywheel:</p>
                <div className="bg-background rounded-lg p-4 font-mono text-sm text-center">
                    Better search → More users → More clicks → Better training data → Better search
                </div>
                <div className="grid gap-4 md:grid-cols-3 mt-6">
                    <div className="text-center">
                        <p className="font-medium">Data Flywheel</p>
                        <p className="text-xs text-muted-foreground">More usage = better models</p>
                    </div>
                    <div className="text-center">
                        <p className="font-medium">Domain Knowledge</p>
                        <p className="text-xs text-muted-foreground">Synonyms, entities encoded over years</p>
                    </div>
                    <div className="text-center">
                        <p className="font-medium">Behavioral Signals</p>
                        <p className="text-xs text-muted-foreground">Your click logs are proprietary</p>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <section className="bg-secondary/20 p-6 rounded-xl border border-border">
                <h2 className="text-lg font-semibold mb-4">Key Takeaways</h2>
                <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <span className="text-primary">1.</span>
                        <span><strong>Search is revenue-critical</strong>, not a commodity feature</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary">2.</span>
                        <span><strong>Search users convert 2-3x higher</strong> than browsers</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary">3.</span>
                        <span><strong>Search quality compounds</strong> through data flywheels</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary">4.</span>
                        <span><strong>Search is a competitive moat</strong> that's hard to replicate</span>
                    </li>
                </ul>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/business-product" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Business & Product
                </Link>
                <Link href="/search/business-product/failure" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next: When Search Fails <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
