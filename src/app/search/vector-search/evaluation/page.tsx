"use client";

import Link from "next/link";
import { BarChart3, ArrowRight, ArrowLeft, Target, TrendingUp, LineChart, FlaskConical, Users, Shuffle } from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Recall@K Is the Foundation", description: "If relevant documents don't make it into the candidate set, nothing downstream can fix it. Recall@K for the retrieval stage determines the ceiling for the entire search system. Measure it first." },
    { title: "nDCG@10 Is the Gold Standard", description: "Normalized Discounted Cumulative Gain handles graded relevance (not just binary) and accounts for position (higher-ranked = more important). If you track one metric, make it nDCG@10." },
    { title: "Build an Evaluation Dataset First", description: "50-100 representative queries with human-judged relevance is the most impactful investment in search quality. Without ground truth, you're optimizing blindly. LLM-as-judge can scale to thousands of judgments cheaply." },
    { title: "Offline → Shadow → A/B → Rollout", description: "The full deployment pipeline: measure offline metrics first, shadow deploy to compare live traffic, A/B test with 5-10% of users, then full rollout. Skipping steps causes silent quality degradation." },
];

export default function EvaluationPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.12</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Evaluating Search Quality</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            Building a search system without measuring its quality is like driving blindfolded. This chapter
                            covers Recall, Precision, MRR, nDCG, and MAP — plus how to build evaluation datasets and set up
                            the offline/online evaluation pipeline.
                        </p>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-indigo-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-indigo-700 font-medium text-sm"><Target className="w-4 h-4" /> Core Metrics</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">5</p>
                        <p className="text-sm text-zinc-600">Recall, Precision, MRR, nDCG, MAP — each answers a different question.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm"><Users className="w-4 h-4" /> Min Eval Queries</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">50-100</p>
                        <p className="text-sm text-zinc-600">Representative queries with judged relevance. The minimum viable eval set.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-purple-700 font-medium text-sm"><FlaskConical className="w-4 h-4" /> LLM Judge Cost</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">$0.01</p>
                        <p className="text-sm text-zinc-600">Per relevance judgment using GPT-4. ~80-90% agreement with humans.</p>
                    </div>
                </div>
            </div>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. Core Metrics</h2>
                <p className="text-foreground leading-relaxed">
                    Each metric answers a different question about your search system. <strong>Recall@K</strong> asks:
                    &quot;of all relevant documents, how many did we find in the top K?&quot; This is the foundation for
                    retrieval — a relevant document not retrieved can never be shown, regardless of ranking quality.
                    <strong> Precision@K</strong> asks the inverse: &quot;of the K results returned, how many are actually
                    relevant?&quot;
                </p>
                <p className="text-foreground leading-relaxed">
                    <strong>MRR</strong> (Mean Reciprocal Rank) measures how quickly the first relevant result appears —
                    critical for question-answering where users want one good answer fast. <strong>nDCG@K</strong>
                    (Normalized Discounted Cumulative Gain) is the gold standard: it handles graded relevance (Highly
                    relevant=3, Somewhat=2, Marginal=1, Irrelevant=0) and weights higher positions more heavily. A
                    highly relevant doc at rank 1 is far more valuable than at rank 10.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Metric</th>
                                <th className="text-left p-3 border-b font-semibold">Relevance</th>
                                <th className="text-left p-3 border-b font-semibold">Position-Aware</th>
                                <th className="text-left p-3 border-b font-semibold">Best For</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-medium">Recall@K</td><td className="p-3">Binary</td><td className="p-3">No (just top K)</td><td className="p-3">Retrieval stage evaluation</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Precision@K</td><td className="p-3">Binary</td><td className="p-3">No (just top K)</td><td className="p-3">User-facing result quality</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">MRR</td><td className="p-3">Binary</td><td className="p-3">Yes (1st hit)</td><td className="p-3">Question answering, navigation</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">nDCG@K</td><td className="p-3">Graded</td><td className="p-3">Yes (log discount)</td><td className="p-3">Overall ranking quality</td></tr>
                            <tr><td className="p-3 font-medium">MAP</td><td className="p-3">Binary</td><td className="p-3">Yes (avg precision)</td><td className="p-3">Academic benchmarks</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Building Evaluation Datasets</h2>
                <p className="text-foreground leading-relaxed">
                    The hardest part of search evaluation isn&apos;t computing metrics — it&apos;s getting ground truth
                    relevance judgments. You need a set of (query, document, relevance_score) triples. Three approaches:
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2"><Users className="w-5 h-5 text-blue-500" /> Human Annotation</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            The gold standard. 50-100 queries × 10-20 judged docs = 1,000-2,000 judgments. Achievable
                            in 1-2 days. Measure inter-annotator agreement (Cohen&apos;s κ &gt; 0.7).
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2"><LineChart className="w-5 h-5 text-green-500" /> Click-Through Data</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            Infer relevance from user behavior: clicked + long dwell (&gt;30s) = relevant. Scales to
                            millions of queries automatically but suffers from position and presentation bias.
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2"><FlaskConical className="w-5 h-5 text-purple-500" /> LLM-as-Judge</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            GPT-4 judges relevance at $0.01/pair with ~80-90% human agreement. Fast, cheap, consistent,
                            no annotator fatigue. Can generate thousands of judgments in minutes.
                        </p>
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. The Evaluation Pipeline</h2>
                <p className="text-foreground leading-relaxed">
                    Production search teams follow a strict pipeline: <strong>offline evaluation</strong> on a fixed dataset
                    before any change ships, <strong>shadow deployment</strong> to compare new vs old on live traffic without
                    affecting users, <strong>A/B testing</strong> with 5-10% of real users for 1-2 weeks, and finally
                    full rollout. Each stage catches different types of problems.
                </p>

                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># The deployment pipeline</div>
                    <div className="space-y-3">
                        <div><span className="text-green-400">1. Offline eval:</span> Run against eval dataset → metrics improve? → Proceed</div>
                        <div><span className="text-blue-400">2. Shadow deploy:</span> Run both systems on live traffic → log, don&apos;t serve new → Compare</div>
                        <div><span className="text-yellow-400">3. A/B test:</span> 5-10% users → monitor CTR, abandonment, dwell → 1-2 weeks</div>
                        <div><span className="text-purple-400">4. Full rollout:</span> Online metrics confirm → ship to 100%</div>
                        <div className="text-red-400 mt-2">⚠ Skipping steps = silent quality degradation</div>
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Online Metrics to Monitor</h2>
                <p className="text-foreground leading-relaxed">
                    Offline metrics tell you about retrieval accuracy. Online metrics tell you about user satisfaction.
                    The key online metrics are <strong>click-through rate</strong> (are results enticing?),
                    <strong> zero-result rate</strong> (is coverage sufficient?), <strong>abandonment rate</strong> (are
                    users finding what they need?), and <strong>reformulation rate</strong> (did the first attempt fail?).
                    Monitor all four — each catches different failure modes.
                </p>
            </section>

            <KeyTakeaways takeaways={takeaways} />

            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/databases" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.11 Vector Databases
                </Link>
                <Link href="/search/embedding-training" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    Chapter 7: Training Embeddings <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
