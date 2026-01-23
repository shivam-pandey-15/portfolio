import { BookOpen, Server, Scale, RefreshCw, Lightbulb, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RealWorldVsLeetCodePage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Chapter 0.5</p>
                <h1 className="text-4xl font-bold tracking-tight">Real-World Search vs LeetCode</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Why production search is nothing like the problems you solved in interviews.
                </p>
            </div>

            <hr className="border-border" />

            {/* The Gap */}
            <section className="grid gap-6 md:grid-cols-2">
                <div className="border border-border rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" /> What LeetCode Teaches
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                        <li>• Algorithms on clean, in-memory data structures</li>
                        <li>• Optimize for time complexity: O(n log n) good, O(n²) bad</li>
                        <li>• Single machine, deterministic execution</li>
                        <li>• "Correct" answer exists</li>
                    </ul>
                </div>
                <div className="border border-primary/50 rounded-xl p-6 bg-primary/5">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Server className="w-5 h-5" /> What Real Search Requires
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                        <li>• Distributed systems across 100s of nodes</li>
                        <li>• Optimize for P99 latency, not average case</li>
                        <li>• Network failures, partial results, eventual consistency</li>
                        <li>• "Relevance" is subjective and changes over time</li>
                    </ul>
                </div>
            </section>

            {/* Dimension Tables */}
            <section className="space-y-8">
                <h2 className="text-2xl font-semibold">The Five Dimensions of Difference</h2>

                {/* Data */}
                <div className="border border-border rounded-xl overflow-hidden">
                    <div className="bg-secondary/30 px-6 py-3 font-semibold flex items-center gap-2">
                        <Scale className="w-4 h-4" /> Dimension 1: Data
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-6 font-medium">Aspect</th>
                                <th className="text-left py-3 px-6 font-medium">LeetCode / Academia</th>
                                <th className="text-left py-3 px-6 font-medium">Production</th>
                            </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                            <tr className="border-b border-border/50"><td className="py-3 px-6">Size</td><td className="py-3 px-6">Fits in memory</td><td className="py-3 px-6">Petabytes across clusters</td></tr>
                            <tr className="border-b border-border/50"><td className="py-3 px-6">Format</td><td className="py-3 px-6">Clean JSON/array</td><td className="py-3 px-6">Dirty HTML, PDFs, inconsistent</td></tr>
                            <tr className="border-b border-border/50"><td className="py-3 px-6">Updates</td><td className="py-3 px-6">Static dataset</td><td className="py-3 px-6">Real-time streaming, 1000s/sec</td></tr>
                            <tr><td className="py-3 px-6">Quality</td><td className="py-3 px-6">Perfect</td><td className="py-3 px-6">Missing fields, duplicates, spam</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* Correctness */}
                <div className="border border-border rounded-xl overflow-hidden">
                    <div className="bg-secondary/30 px-6 py-3 font-semibold">Dimension 2: Correctness</div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-6 font-medium">Aspect</th>
                                <th className="text-left py-3 px-6 font-medium">Academic</th>
                                <th className="text-left py-3 px-6 font-medium">Production</th>
                            </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                            <tr className="border-b border-border/50"><td className="py-3 px-6">Ground truth</td><td className="py-3 px-6">Human-labeled relevance</td><td className="py-3 px-6">Inferred from clicks (noisy)</td></tr>
                            <tr className="border-b border-border/50"><td className="py-3 px-6">Evaluation</td><td className="py-3 px-6">Precision/Recall on test set</td><td className="py-3 px-6">A/B test on real traffic</td></tr>
                            <tr><td className="py-3 px-6">Success</td><td className="py-3 px-6">"Correct" output</td><td className="py-3 px-6">CTR, Revenue, Retention</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* Latency */}
                <div className="border border-border rounded-xl overflow-hidden">
                    <div className="bg-secondary/30 px-6 py-3 font-semibold">Dimension 3: Latency</div>
                    <div className="p-6 space-y-4">
                        <div className="bg-secondary/20 p-4 rounded-lg font-mono text-sm">
                            <p className="font-medium mb-2">Real constraint: You have 50ms total.</p>
                            <ul className="text-muted-foreground space-y-1">
                                <li>• Network: 10ms</li>
                                <li>• Retrieval: 15ms</li>
                                <li>• Ranking: 20ms</li>
                                <li>• Rendering: 5ms</li>
                            </ul>
                        </div>
                        <p className="text-muted-foreground">
                            Your fancy BERT reranker that takes 200ms? <strong>Unusable</strong> without distillation/caching.
                        </p>
                    </div>
                </div>

                {/* Failure Modes */}
                <div className="border border-border rounded-xl overflow-hidden">
                    <div className="bg-secondary/30 px-6 py-3 font-semibold">Dimension 4: Failure Modes</div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-6 font-medium">Aspect</th>
                                <th className="text-left py-3 px-6 font-medium">Academic</th>
                                <th className="text-left py-3 px-6 font-medium">Production</th>
                            </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                            <tr className="border-b border-border/50"><td className="py-3 px-6">Node failure</td><td className="py-3 px-6">Doesn't happen</td><td className="py-3 px-6">Daily occurrence</td></tr>
                            <tr className="border-b border-border/50"><td className="py-3 px-6">Partial results</td><td className="py-3 px-6">Not possible</td><td className="py-3 px-6">"4 of 5 shards, return best effort"</td></tr>
                            <tr><td className="py-3 px-6">Degradation</td><td className="py-3 px-6">Binary (works/broken)</td><td className="py-3 px-6">Graceful (disable features under load)</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* Feedback Loop */}
                <div className="border border-border rounded-xl overflow-hidden">
                    <div className="bg-secondary/30 px-6 py-3 font-semibold flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Dimension 5: The Feedback Loop
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="font-medium mb-2">Academic</p>
                                <p className="text-muted-foreground text-sm">Query → Retrieve → Rank → Evaluate (end)</p>
                            </div>
                            <div>
                                <p className="font-medium mb-2 text-primary">Production</p>
                                <p className="text-muted-foreground text-sm">Query → Retrieve → Rank → Serve → <strong>User interacts</strong> → Log → Retrain → Deploy → Repeat</p>
                            </div>
                        </div>
                        <p className="text-muted-foreground italic">This loop is the moat. Teams with good feedback loops improve continuously.</p>
                    </div>
                </div>
            </section>

            {/* Mental Model Shift */}
            <section className="bg-primary/5 border border-primary/20 rounded-xl p-8">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Lightbulb className="w-6 h-6" /> The Mental Model Shift
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <p className="font-mono text-sm text-muted-foreground">LeetCode Mindset</p>
                        <blockquote className="text-lg border-l-4 border-muted pl-4">
                            "Find the optimal solution."
                        </blockquote>
                    </div>
                    <div className="space-y-2">
                        <p className="font-mono text-sm text-primary">Production Mindset</p>
                        <blockquote className="text-lg border-l-4 border-primary pl-4">
                            "Find a good-enough solution that works 99.9% of the time, degrades gracefully the other 0.1%,
                            costs $X/month, and can be improved incrementally."
                        </blockquote>
                    </div>
                </div>
                <p className="mt-6 text-muted-foreground font-medium">This guide teaches the second mindset.</p>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/how-to-read/business-lever" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Search as a Business Lever
                </Link>
                <Link href="/search/business-product" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next Chapter: Business & Product <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
