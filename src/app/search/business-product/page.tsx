"use client";

import { ArrowRight, ArrowLeft, Target, TrendingUp, Search, Filter, BarChart3, PieChart } from "lucide-react";
import Link from "next/link";

export default function BusinessProductPage() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 1</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">The Business & Product of Search</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Search is not just an engineering problem; it's the highest-leverage product surface in most applications.
                    Before writing code, we must understand the metrics, the funnel, and the user intent.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                    <Link href="/search/business-product/importance" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        Start Chapter <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <hr className="border-border" />

            {/* Quick Links */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">In This Chapter</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Link href="/search/business-product/importance" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Target className="w-5 h-5 text-red-500" />
                            <h3 className="font-semibold group-hover:text-primary">1.1 Why Search is the Heart</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Why search functionality makes or breaks modern applications.</p>
                    </Link>

                    <Link href="/search/business-product/failure" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <TrendingUp className="w-5 h-5 text-amber-500" />
                            <h3 className="font-semibold group-hover:text-primary">1.2 When Search Fails</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">The cost of bad relevance: bounce rates, lost revenue, and frustration.</p>
                    </Link>

                    <Link href="/search/business-product/comparison" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Search className="w-5 h-5 text-blue-500" />
                            <h3 className="font-semibold group-hover:text-primary">1.3 Search vs Discovery</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Understanding the difference between "I know what I want" and "Show me what you have".</p>
                    </Link>

                    <Link href="/search/business-product/types" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Filter className="w-5 h-5 text-purple-500" />
                            <h3 className="font-semibold group-hover:text-primary">1.4 Types of Search Systems</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">E-commerce, Media, SaaS, and Enterprise search patterns.</p>
                    </Link>

                    <Link href="/search/business-product/funnel" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <PieChart className="w-5 h-5 text-green-500" />
                            <h3 className="font-semibold group-hover:text-primary">1.5 Search as a Funnel</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Mapping the user journey: Query → SERP → Click → Conversion.</p>
                    </Link>

                    <Link href="/search/business-product/metrics" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <BarChart3 className="w-5 h-5 text-zinc-500" />
                            <h3 className="font-semibold group-hover:text-primary">1.6 Success Metrics</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">How to measure quality: NDCG, MRR, CTR, and Zero Results Rate.</p>
                    </Link>
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/how-to-read" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 0. How to Read This
                </Link>
                <Link href="/search/query-understanding" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    Next Chapter: Query Understanding <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
