import { ArrowRight, Target, BookOpen, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function HowToRead() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-primary">How to Read This Book</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    This isn't a traditional blog or textbook. It's a structured journey from business problems to distributed systems engineering.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" /> Who this is for
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><strong>Engineers:</strong> Who want to move beyond "using Elasticsearch" to building it.</li>
                        <li><strong>Product Managers:</strong> Who need to understand why search is a trade-off between recall and latency.</li>
                        <li><strong>Founders:</strong> Who need to understand when to buy (Algolia) vs build (Lucene).</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" /> What you will learn
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>How to maximize <strong>Revenue</strong>, not just Relevance.</li>
                        <li>Why <strong>Data Quality</strong> matters more than your ranking algorithm.</li>
                        <li>How to scale to <strong>100M+ documents</strong> without burning cash.</li>
                    </ul>
                </div>
            </div>

            <section className="bg-secondary/20 p-8 rounded-xl border border-border">
                <h2 className="text-2xl font-semibold mb-4">The Philosophy: Search as a Business Lever</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                    Most tutorials focus on the <em>how</em> (inverted indices, vector databases). We focus on the <em>why</em>.
                    Real-world search is about solving a business problem. If your search engine returns perfect results
                    but takes 2 seconds to load, you lose money. If it's fast but irrelevant, you lose trust.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    We move beyond LeetCode-style algorithms to discuss <strong>System Design</strong>, <strong>Trade-offs</strong>, and <strong>Production Constraints</strong>.
                </p>
            </section>

            <div className="flex justify-end pt-8">
                <Link href="/search/business-product" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    Next: Business & Product <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
