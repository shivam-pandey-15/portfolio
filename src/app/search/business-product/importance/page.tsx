"use client";

import { Heart, TrendingUp, DollarSign, Shield, ArrowRight, ArrowLeft, Building2, ShoppingCart, Search, Code, Play, Database, Network, SlidersHorizontal, Scaling, BarChart4, Brain, Lock } from "lucide-react";
import Link from "next/link";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "The Intent Ingestion Layer", description: "Search is 'Pull' mode (High Intent, High Conversion). Users define what they want, unlike 'Push' feeds." },
    { title: "The Control Plane", description: "Search ranks not just by relevance but by business logic (margin, inventory). It directs the product's economy." },
    { title: "The Trust Contract", description: "Users trust the top result implicitly. Prioritizing short-term revenue over relevance breaks this trust and causes churn." },
    { title: "Scale is Structural", description: "Linear content growth leads to exponential index complexity. 15% of queries are new every day." }
];

export default function ImportancePage() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Header / Thesis */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 1.1</span>
                    <span>The Heart of the Product</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Why Search is the Heart</h1>

                <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                    <p className="text-xl font-medium leading-relaxed">
                        Every successful digital product eventually turns into a search company, whether it planned to or not.
                    </p>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                    It starts with a list. Then the list grows. Then you add pagination. Then you add filters.
                    Eventually, navigation collapses under the weight of your own success.
                    At scale, Search ceases to be a feature and becomes the <strong>primary interface</strong> to your application.
                </p>
            </div>

            <hr className="border-border" />

            {/* 1. The Intent Ingestion Layer */}
            <section className="space-y-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Network className="w-6 h-6 text-blue-500" /> The Intent Ingestion Layer
                </h2>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <p className="text-muted-foreground">
                            Modern interfaces have two modes: <strong>Push</strong> (Discovery) and <strong>Pull</strong> (Search).
                            While "Push" engages users passively, "Pull" captures users at their moment of highest intent.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                                <div className="bg-zinc-200 p-2 rounded-lg text-zinc-600 font-bold text-xs uppercase tracking-wider mt-1">Push</div>
                                <div>
                                    <div className="font-bold text-zinc-900">Feeds & Notifications</div>
                                    <div className="text-sm text-zinc-500 mt-1">"Show me something interesting."</div>
                                    <div className="text-xs font-medium text-red-500 mt-2">Low Conversion (1-2%)</div>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200 shadow-sm ring-1 ring-blue-100">
                                <div className="bg-blue-600 p-2 rounded-lg text-white font-bold text-xs uppercase tracking-wider mt-1">Pull</div>
                                <div>
                                    <div className="font-bold text-blue-900">Search</div>
                                    <div className="text-sm text-blue-700 mt-1">"I want exactly THIS right now."</div>
                                    <div className="text-xs font-medium text-green-600 mt-2">High Conversion (8-15%)</div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Visual Rep */}
                    <div className="h-full bg-zinc-900 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden border border-zinc-800">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
                        <div className="relative z-10 text-center space-y-4">
                            <div className="text-5xl font-bold text-white tracking-tighter">High Intent</div>
                            <div>
                                <ArrowRight className="w-8 h-8 text-zinc-500 mx-auto rotate-90 md:rotate-0" />
                            </div>
                            <div className="text-5xl font-bold text-green-400 tracking-tighter">$$$</div>
                            <p className="text-sm text-zinc-400 mt-4 max-w-[200px] mx-auto">
                                Search users are <strong>2-3x</strong> more likely to convert than browsers.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Industry Benchmarks (Fact Checked) */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BarChart4 className="w-6 h-6 text-green-500" /> The Economics of Search
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 relative overflow-hidden group hover:border-green-500/50 transition-colors">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm">
                                <ShoppingCart className="w-4 h-4" /> Amazon
                            </div>
                            <p className="text-4xl font-bold text-zinc-900 mb-2">6x</p>
                            <p className="text-sm text-zinc-600">
                                Conversion rate lift for search users (12%) vs browsers (2%).
                            </p>
                        </div>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm">
                                <Search className="w-4 h-4" /> Google
                            </div>
                            <p className="text-4xl font-bold text-zinc-900 mb-2">8.5B+</p>
                            <p className="text-sm text-zinc-600">
                                Searches per day. The "Database of Human Intent".
                            </p>
                        </div>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 relative overflow-hidden group hover:border-red-500/50 transition-colors">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 text-red-700 font-medium text-sm">
                                <Play className="w-4 h-4" /> Netflix
                            </div>
                            <p className="text-4xl font-bold text-zinc-900 mb-2">80%</p>
                            <p className="text-sm text-zinc-600">
                                Content discovered via Search & Recommendations, not navigation.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. The Control Plane */}
            <section className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <SlidersHorizontal className="w-6 h-6 text-purple-500" /> Search is the Control Plane
                    </h2>
                    <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                        Case Study: The $100M Weight
                    </span>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
                            <p>
                                Search is not a passive utility; it is the active <strong>Director</strong> of your product's economy.
                                Engineers often think of search as "finding string matches."
                                Product Leaders know search is about "allocating attention."
                            </p>
                            <p>
                                The code on the right illustrates a classic tension in Search Engineering: <strong>Relevance vs. Business Logic</strong>.
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>Weight Rating (0.5)</strong>: High quality items (User Goal).</li>
                                <li><strong>Weight Margin (0.1 &rarr; 0.4)</strong>: High profit items (Business Goal).</li>
                            </ul>
                            <p>
                                By tweaking this single float value, the team prioritized high-margin "House Brands" over "User Favorites."
                                <strong>The Result?</strong> A massive short-term revenue spike ($100M), but a degradation of trust (-5%) as results felt "spammy."
                            </p>
                        </div>
                    </div>

                    {/* Concrete Example */}
                    <div className="bg-zinc-900 text-zinc-100 p-6 rounded-xl border border-zinc-800 font-mono text-sm leading-relaxed shadow-lg">
                        <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                            <span className="text-purple-400">// config/ranking_v1.ts</span>
                            <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-400">Production Hotfix</span>
                        </div>

                        <div className="opacity-50">weight_price = 0.3</div>
                        <div className="opacity-50">weight_rating = 0.5</div>
                        <div className="text-red-400 font-bold bg-red-900/10 -mx-2 px-2 rounded">- weight_margin = 0.1</div>
                        <div className="text-green-400 font-bold bg-green-900/10 -mx-2 px-2 rounded">+ weight_margin = 0.4</div>

                        <div className="mt-6 pt-4 border-t border-zinc-700 space-y-3">
                            <div className="flex items-start gap-3">
                                <DollarSign className="w-5 h-5 text-green-500 shrink-0" />
                                <div>
                                    <span className="text-green-400 font-bold block">Revenue +15%</span>
                                    <span className="text-zinc-500 text-xs">High margin items flood top 5</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-red-500 shrink-0" />
                                <div>
                                    <span className="text-red-400 font-bold block">Trust -5%</span>
                                    <span className="text-zinc-500 text-xs">Users churn due to "irrelevant" ads</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. The Psychology of Search */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Brain className="w-6 h-6 text-pink-500" /> The Psychology: The Trust Contract
                </h2>
                <div className="bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-100 rounded-xl p-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-bold text-pink-900 mb-2 flex items-center gap-2">
                                <Lock className="w-4 h-4" /> The Confessional
                            </h3>
                            <p className="text-sm text-pink-800 leading-relaxed">
                                Users type things into search boxes they wouldn't say to their closest friends.
                                Search queries are the rawest, most honest signal of user intent available.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-pink-900 mb-2 flex items-center gap-2">
                                <Shield className="w-4 h-4" /> The Oracle
                            </h3>
                            <p className="text-sm text-pink-800 leading-relaxed">
                                Users trust the top result. If result #1 is irrelevant, they don't blame the query;
                                they blame the product. "This app is broken."
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-pink-900 mb-2 flex items-center gap-2">
                                <Database className="w-4 h-4" /> The Habit
                            </h3>
                            <p className="text-sm text-pink-800 leading-relaxed">
                                Reliable search creates "Search First" users. These are your power users.
                                They retain longer, buy more, and churn less.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Team Intersection */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-orange-500" /> The Intersection of All Teams
                </h2>
                <p className="text-muted-foreground">
                    Because search is the control plane, every department eventually becomes a stakeholder.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                        <div className="font-bold text-zinc-900 mb-1">Product</div>
                        <div className="text-xs text-zinc-500">Demands Discovery & UX</div>
                    </div>
                    <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                        <div className="font-bold text-zinc-900 mb-1">Business</div>
                        <div className="text-xs text-zinc-500">Demands Conversion</div>
                    </div>
                    <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                        <div className="font-bold text-zinc-900 mb-1">Legal/Trust</div>
                        <div className="text-xs text-zinc-500">Demands Safety & Policy</div>
                    </div>
                    <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                        <div className="font-bold text-zinc-900 mb-1">Engineering</div>
                        <div className="text-xs text-zinc-500">Demands Latency & Scale</div>
                    </div>
                </div>
            </section>

            {/* 6. Complexity Growth */}
            <section className="bg-zinc-900 text-zinc-100 rounded-xl p-8 border border-zinc-800">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Scaling className="w-5 h-5 text-red-500" /> Why Search Grows Faster Than Product
                </h2>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <ul className="space-y-4 text-zinc-400 text-sm">
                        <li className="flex items-center gap-3">
                            <span className="bg-red-500/10 text-red-500 p-1 rounded">
                                <ArrowRight className="w-4 h-4" />
                            </span>
                            <span><strong>Data Volume:</strong> Content grows linearly; Index size grows with tokens (exponentially).</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="bg-red-500/10 text-red-500 p-1 rounded">
                                <ArrowRight className="w-4 h-4" />
                            </span>
                            <span><strong>Query Variety:</strong> 15% of daily Google searches have never been seen before.</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="bg-red-500/10 text-red-500 p-1 rounded">
                                <ArrowRight className="w-4 h-4" />
                            </span>
                            <span><strong>Edge Cases:</strong> Typos, synonyms, and multi-lingual needs grow with every user.</span>
                        </li>
                    </ul>
                    <div className="text-center md:text-right">
                        <blockquote className="text-xl font-medium text-white italic border-l-2 border-red-500 pl-4 md:border-l-0 md:border-r-2 md:pr-4">
                            "Scale makes search structural, not optional."
                        </blockquote>
                    </div>
                </div>
            </section>

            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/business-product" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Chapter 1 Overview
                </Link>
                <Link href="/search/business-product/failure" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Next: When Search Fails <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}