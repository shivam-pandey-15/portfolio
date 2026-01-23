import { AlertTriangle, Zap, Target, Bug, Shield, ArrowRight, ArrowLeft, LineChart, MessageSquare, Clock } from "lucide-react";
import Link from "next/link";

export default function ProblemsPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Chapter 0.2</p>
                <h1 className="text-4xl font-bold tracking-tight">Problems This Guide Solves</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    The knowledge gaps that hold engineers back from building production-grade search systems.
                </p>
            </div>

            <hr className="border-border" />

            {/* Problems */}
            <section className="space-y-10">
                {/* Problem 1 */}
                <div className="border-l-4 border-red-500 pl-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <h3 className="text-xl font-bold">Problem 1: "I don't know what I don't know"</h3>
                    </div>
                    <p className="text-muted-foreground">
                        Most engineers learn search by reading Elasticsearch docs (know <em>how</em> to add a doc),
                        copy-pasting Stack Overflow (know <em>what</em> worked for someone else), and trial and error
                        (no systematic mental model).
                    </p>

                    <div className="bg-secondary/30 p-4 rounded-lg">
                        <p className="font-medium mb-2">🎯 Real example:</p>
                        <p className="text-sm text-muted-foreground">
                            Engineer at a marketplace spends 2 weeks debugging "why results are random."
                            Root cause: they indexed price as a string ("$49.99") instead of a number (49.99).
                            Sorting by string gave: $10, $100, $20, $200.
                            <br /><br />
                            <strong className="text-foreground">Time wasted:</strong> 2 weeks.
                            <strong className="text-foreground ml-4">With proper knowledge:</strong> 5 minutes.
                        </p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                        <p className="font-medium text-primary">This guide provides:</p>
                        <p className="text-muted-foreground">A structured curriculum from business problem to production system.
                            No more "I didn't know I needed to think about that."</p>
                    </div>
                </div>

                {/* Problem 2 */}
                <div className="border-l-4 border-orange-500 pl-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-orange-500" />
                        <h3 className="text-xl font-bold">Problem 2: "The tutorial worked, production didn't"</h3>
                    </div>
                    <p className="text-muted-foreground">
                        <strong>Scenario:</strong> Engineer builds search for 10K products. Works great.
                        Company grows to 10M products. Search breaks: indexing takes 12 hours,
                        P99 latency is 2 seconds, ranking is random garbage.
                    </p>

                    <div className="bg-secondary/30 p-4 rounded-lg">
                        <p className="font-medium mb-2">🎯 Real example:</p>
                        <p className="text-sm text-muted-foreground">
                            E-commerce startup used a single-node Elasticsearch cluster for 2 years.
                            Black Friday traffic 10x'd. The node ran out of heap memory. Search went down for 4 hours.
                            <br /><br />
                            <strong className="text-foreground">Revenue lost:</strong> ~$200K.
                            <strong className="text-foreground ml-4">Prevention cost:</strong> ~$500/month for proper sharding.
                        </p>
                    </div>

                    <p className="text-muted-foreground">
                        <strong>Root cause:</strong> Didn't understand sharding strategies, segment merging,
                        or feature engineering for ranking at scale.
                    </p>

                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                        <p className="font-medium text-primary">This guide teaches:</p>
                        <p className="text-muted-foreground">How to think about scale from Day 1. Chapters 4, 13, 14 are dedicated to this.</p>
                    </div>
                </div>

                {/* Problem 3 */}
                <div className="border-l-4 border-blue-500 pl-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-blue-500" />
                        <h3 className="text-xl font-bold">Problem 3: "My ML model is great but search sucks"</h3>
                    </div>
                    <p className="text-muted-foreground">
                        <strong>Scenario:</strong> ML team trains a state-of-the-art reranker.
                        Offline NDCG: 0.85 (excellent). Online CTR: No improvement.
                    </p>

                    <div className="bg-secondary/30 p-4 rounded-lg">
                        <p className="font-medium mb-2">🎯 Real example:</p>
                        <p className="text-sm text-muted-foreground">
                            Team spent 3 months building a BERT-based reranker. Deployed it.
                            Performance dashboards showed: latency went from 50ms to 800ms. CTR dropped.
                            <br /><br />
                            <strong className="text-foreground">The problem:</strong> BERT can only rerank 100 docs in the latency budget.
                            But retrieval was returning garbage in the top 100. Model was reranking trash.
                            <br /><br />
                            <strong className="text-foreground">The fix:</strong> Improve retrieval first (BM25 tuning + vector hybrid).
                            Then the reranker actually had good candidates to work with.
                        </p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                        <p className="font-medium text-primary">This guide teaches:</p>
                        <p className="text-muted-foreground">End-to-end pipeline thinking. You can't rank what you don't retrieve. Chapters 5, 6, 7, 8 cover this.</p>
                    </div>
                </div>

                {/* Problem 4 */}
                <div className="border-l-4 border-yellow-500 pl-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <Bug className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-xl font-bold">Problem 4: "Search is slow and I don't know why"</h3>
                    </div>
                    <p className="text-muted-foreground">
                        <strong>Scenario:</strong> Average latency is 50ms, but P99 is 800ms.
                    </p>

                    <div className="bg-secondary/30 p-4 rounded-lg">
                        <p className="font-medium mb-2">🎯 Common causes (from real incidents):</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• <strong>Cold shards:</strong> One replica hadn't been queried in hours. JVM needed to warm up.</li>
                            <li>• <strong>Heavy aggregation:</strong> Facet on a field with 10M unique values (colors, sizes were not normalized).</li>
                            <li>• <strong>Cross-cluster timeout:</strong> One datacenter had a network blip, query waited for timeout.</li>
                            <li>• <strong>GC pause:</strong> Indexing heavy load caused garbage collection during query serving.</li>
                            <li>• <strong>Slow disk:</strong> One node's SSD was degraded, pulling down the whole cluster's P99.</li>
                        </ul>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                        <p className="font-medium text-primary">This guide teaches:</p>
                        <p className="text-muted-foreground">Systematic latency debugging by understanding internal architecture. Chapters 12, 14 cover caching and distributed systems.</p>
                    </div>
                </div>

                {/* Problem 5 */}
                <div className="border-l-4 border-purple-500 pl-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-purple-500" />
                        <h3 className="text-xl font-bold">Problem 5: "We keep breaking search with every release"</h3>
                    </div>
                    <p className="text-muted-foreground">
                        <strong>Scenario:</strong> PM says "Add this new field to ranking."
                        Engineer adds it. Relevance drops 20%.
                    </p>

                    <div className="bg-secondary/30 p-4 rounded-lg">
                        <p className="font-medium mb-2">🎯 Real example:</p>
                        <p className="text-sm text-muted-foreground">
                            Team added "product popularity" as a ranking signal. Seemed logical.
                            But "popularity" was defined as "total sales all-time."
                            Result: Old bestsellers (discontinued, out of stock) ranked #1.
                            New products (actually available) were buried.
                            <br /><br />
                            <strong className="text-foreground">The fix:</strong> Use "sales velocity" (last 30 days) not "total sales."
                            But also: Set up offline evaluation to catch this BEFORE deployment.
                        </p>
                    </div>

                    <p className="text-muted-foreground">
                        <strong>Root cause:</strong> No offline evaluation pipeline, no A/B testing framework, no guardrail metrics.
                    </p>

                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                        <p className="font-medium text-primary">This guide teaches:</p>
                        <p className="text-muted-foreground">Safe deployment practices. Chapter 15 (Evaluation) and Chapter 16 (Analytics) are dedicated to this.</p>
                    </div>
                </div>

                {/* Problem 6 - NEW */}
                <div className="border-l-4 border-green-500 pl-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-green-500" />
                        <h3 className="text-xl font-bold">Problem 6: "I can't explain search to my stakeholders"</h3>
                    </div>
                    <p className="text-muted-foreground">
                        <strong>Scenario:</strong> VP asks "Why does adding synonyms take 3 sprints?"
                        You know it's complex but can't articulate why.
                    </p>

                    <div className="bg-secondary/30 p-4 rounded-lg">
                        <p className="font-medium mb-2">🎯 The communication gap:</p>
                        <p className="text-sm text-muted-foreground">
                            Synonyms aren't just a config file. You need to:
                            <br />1. Decide: query-time or index-time expansion?
                            <br />2. Build: a synonym management UI (who adds them?)
                            <br />3. Validate: "laptop" → "notebook" is wrong (notebooks are paper)
                            <br />4. Test: Do the synonyms actually improve relevance?
                            <br />5. Monitor: Did recall go up? Did precision go down?
                            <br /><br />
                            Without this context, it sounds like you're sandbagging.
                        </p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                        <p className="font-medium text-primary">This guide teaches:</p>
                        <p className="text-muted-foreground">The vocabulary and mental models to communicate with business stakeholders. Every chapter includes the "why" not just the "how."</p>
                    </div>
                </div>
            </section>

            {/* Summary Table */}
            <section className="overflow-x-auto">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <LineChart className="w-6 h-6" /> What This Guide Unlocks
                </h2>
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-semibold">Before</th>
                            <th className="text-left py-3 px-4 font-semibold">After</th>
                        </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                        <tr className="border-b border-border/50">
                            <td className="py-3 px-4">"Search is a black box"</td>
                            <td className="py-3 px-4">Understand every layer: Query → Retrieval → Ranking → Serving</td>
                        </tr>
                        <tr className="border-b border-border/50">
                            <td className="py-3 px-4">"It works on my laptop"</td>
                            <td className="py-3 px-4">Design for 100M docs, 10K QPS from day one</td>
                        </tr>
                        <tr className="border-b border-border/50">
                            <td className="py-3 px-4">"My model is accurate"</td>
                            <td className="py-3 px-4">Understand where ML fits in the full pipeline</td>
                        </tr>
                        <tr className="border-b border-border/50">
                            <td className="py-3 px-4">"I don't know why it's slow"</td>
                            <td className="py-3 px-4">Systematic latency debugging with specific patterns</td>
                        </tr>
                        <tr className="border-b border-border/50">
                            <td className="py-3 px-4">"We break relevance every release"</td>
                            <td className="py-3 px-4">Offline evaluation + A/B testing + guardrails</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4">"I can't explain this to my PM"</td>
                            <td className="py-3 px-4">Vocabulary and frameworks for stakeholder communication</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* Time Saved */}
            <section className="bg-green-500/10 p-8 rounded-xl border border-green-500/20">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Time This Guide Saves You
                </h2>
                <div className="grid gap-4 md:grid-cols-3 text-center">
                    <div>
                        <p className="text-3xl font-bold text-green-600">100+ hrs</p>
                        <p className="text-sm text-muted-foreground mt-1">Debugging production issues</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-green-600">6 months</p>
                        <p className="text-sm text-muted-foreground mt-1">Learning through trial and error</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-green-600">$100K+</p>
                        <p className="text-sm text-muted-foreground mt-1">Avoiding costly mistakes</p>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/how-to-read/audience" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Who This Is For
                </Link>
                <Link href="/search/how-to-read/what-is-good-search" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next: What Good Search Means <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
