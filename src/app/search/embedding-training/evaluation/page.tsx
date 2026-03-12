"use client";

import Link from "next/link";
import {
    ArrowRight, ArrowLeft, BarChart2, Target, AlertTriangle, CheckCircle, TrendingUp, Layers, XCircle, BookOpen
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    {
        title: "Retrieval evaluation is not classification evaluation",
        description: "Accuracy and F1 do not apply to ranked retrieval results. The metrics that matter are nDCG@K (for graded ranking quality), Recall@K (for coverage), and MRR (for first-hit usefulness). Each measures a different property of search quality."
    },
    {
        title: "An offline benchmark that does not include query family slices is incomplete",
        description: "A model can show a 3-point nDCG improvement on head queries while regressing on tail queries — and the aggregate metric will hide that regression. Good evaluation splits results by query type: head, tail, exact-match, semantic, navigational, informational."
    },
    {
        title: "Offline metrics gate experiments; online metrics decide deployment",
        description: "Offline evaluation is a necessary filter — if a model fails offline, it almost certainly fails online. But it is not a sufficient predictor of online success. A model that wins offline can still lose live due to stale labels, position bias in ground truth, or real user behavior not captured in the benchmark."
    },
    {
        title: "False negatives in the benchmark understate your model's quality",
        description: "If an actually-relevant document is not in your benchmark annotations, counting it as a miss means you are penalizing the model unfairly. The larger your corpus and the more queries you evaluate, the more your benchmark is contaminated with false negatives unless you take explicit mitigation steps."
    }
];

export default function EvaluationMetricsPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero Section */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 7.5</span>
                        <span>Training Embedding Models</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Evaluation Metrics for Embedding Models</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            How to measure whether your embedding model actually retrieves better results — nDCG, MRR, Recall@K, building reliable benchmarks, avoiding offline pitfalls, and the gap between offline metrics and live search quality.
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><BookOpen className="w-4 h-4" /> Benchmark Size</div>
                        <p className="text-2xl font-bold text-zinc-900 mb-2">1K–5K queries</p>
                        <p className="text-sm text-zinc-600">Good production benchmarks have 1K–5K queries with multi-document relevance judgments, not just single-positive pairs.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm"><Layers className="w-4 h-4" /> Query Slices</div>
                        <p className="text-2xl font-bold text-zinc-900 mb-2">Essential</p>
                        <p className="text-sm text-zinc-600">Aggregate metrics hide regressions. Head, tail, exact-match, and semantic slices each expose different model failure patterns.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-purple-700 font-medium text-sm"><BarChart2 className="w-4 h-4" /> Core Metrics</div>
                        <p className="text-2xl font-bold text-zinc-900 mb-2">nDCG, Recall, MRR</p>
                        <p className="text-sm text-zinc-600">Together these three capture ranking quality, coverage, and first-hit utility. None is sufficient on its own.</p>
                    </div>
                </div>

                {/* Tip Box */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                        <strong>Key Distinction:</strong> Retrieval evaluation is not classification evaluation. You are measuring ranked lists, not binary predictions. The position of a relevant document in the result set matters. A correct answer at rank 10 is much less valuable than the same answer at rank 1.
                    </div>
                </div>
            </div>

            {/* 1. What Are We Measuring? */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. What Are We Measuring?</h2>

                <p className="text-foreground leading-relaxed">
                    The goal of evaluation is to measure whether the embedding model returns the right documents at the top of the ranked list, across a representative sample of queries. This sounds simple, but it involves several moving pieces that can each fail silently: the quality of the ground truth labels, the representativeness of the query sample, the presence of false negatives in the annotation, and the difference between measuring rank quality vs. coverage.
                </p>

                <p className="text-foreground leading-relaxed">
                    A retrieval evaluation framework has three components: a set of queries, a document corpus, and relevance judgments (which documents are relevant for each query). The metrics compute some function of where the relevant documents appear in the model&apos;s ranked output. The higher the relevant documents rank, the better the metrics.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm">
                        <strong className="text-green-800 block mb-2">What good metrics capture</strong>
                        <ul className="text-green-700 space-y-1">
                            <li>• Rank position of relevant documents</li>
                            <li>• Fraction of all relevant docs retrieved (coverage)</li>
                            <li>• Whether the very first result is useful</li>
                            <li>• Graded relevance (very relevant vs marginally relevant)</li>
                        </ul>
                    </div>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm">
                        <strong className="text-red-800 block mb-2">What metrics cannot capture alone</strong>
                        <ul className="text-red-700 space-y-1">
                            <li>• Whether the retrieval model generalizes to new query types</li>
                            <li>• Real user satisfaction vs annotator preference</li>
                            <li>• Multi-turn or context-dependent relevance</li>
                            <li>• Latency or serving cost impact</li>
                        </ul>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. nDCG */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. nDCG@K: Normalized Discounted Cumulative Gain</h2>

                <p className="text-foreground leading-relaxed">
                    nDCG is the most comprehensive retrieval metric. It measures both whether a document is retrieved and where in the ranking it appears. Higher-positioned results receive more credit. Results are discounted by log2(rank + 1), so rank-1 is worth much more than rank-10. The DCG score is then normalized by the ideal DCG (the best possible ranking for that query) to produce a score in [0, 1].
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">ndcg.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">import</span><span className="text-zinc-300"> math</span></div>
                            <div className="mt-2"><span className="text-pink-400">def</span> <span className="text-yellow-300">dcg</span><span className="text-zinc-300">(relevances):</span></div>
                            <div className="pl-4 text-zinc-500"># relevances: list of graded relevance scores at each rank</div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> </span><span className="text-pink-400">sum</span><span className="text-zinc-300">(</span></div>
                            <div className="pl-8"><span className="text-zinc-300">rel / math.log2(rank + 2)</span></div>
                            <div className="pl-8"><span className="text-pink-400">for</span><span className="text-zinc-300"> rank, rel </span><span className="text-pink-400">in</span><span className="text-zinc-300"> </span><span className="text-yellow-300">enumerate</span><span className="text-zinc-300">(relevances)</span></div>
                            <div className="pl-4"><span className="text-zinc-300">)</span></div>
                            <div className="mt-2"><span className="text-pink-400">def</span> <span className="text-yellow-300">ndcg_at_k</span><span className="text-zinc-300">(retrieved_relevances, ideal_relevances, k=10):</span></div>
                            <div className="pl-4"><span className="text-zinc-300">actual = dcg(retrieved_relevances[:k])</span></div>
                            <div className="pl-4"><span className="text-zinc-300">best   = dcg(</span><span className="text-yellow-300">sorted</span><span className="text-zinc-300">(ideal_relevances, reverse=</span><span className="text-blue-300">True</span><span className="text-zinc-300">)[:k])</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> actual / best </span><span className="text-pink-400">if</span><span className="text-zinc-300"> best &gt; </span><span className="text-blue-300">0</span><span className="text-zinc-300"> </span><span className="text-pink-400">else</span><span className="text-zinc-300"> </span><span className="text-blue-300">0.0</span></div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-800">
                    <strong>When to use:</strong> nDCG is the primary metric when documents have graded relevance (very relevant, partially relevant, not relevant). It penalizes rank position continuously. nDCG@10 is the most common production metric for search ranking evaluation.
                </div>
            </section>

            <hr className="border-border" />

            {/* 3. MRR */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. MRR: Mean Reciprocal Rank</h2>

                <p className="text-foreground leading-relaxed">
                    Mean Reciprocal Rank measures how high up the <em>first correct result</em> appears in the ranked list. It gives 1/rank of the first relevant document. If the first relevant document is at rank 1, MRR = 1.0. At rank 3, MRR = 0.33. At rank 10, MRR = 0.1.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">mrr.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">reciprocal_rank</span><span className="text-zinc-300">(ranked_docs, relevant_docs):</span></div>
                            <div className="pl-4"><span className="text-pink-400">for</span><span className="text-zinc-300"> rank, doc </span><span className="text-pink-400">in</span><span className="text-zinc-300"> </span><span className="text-yellow-300">enumerate</span><span className="text-zinc-300">(ranked_docs, start=</span><span className="text-blue-300">1</span><span className="text-zinc-300">):</span></div>
                            <div className="pl-8"><span className="text-pink-400">if</span><span className="text-zinc-300"> doc </span><span className="text-pink-400">in</span><span className="text-zinc-300"> relevant_docs:</span></div>
                            <div className="pl-12"><span className="text-pink-400">return</span><span className="text-zinc-300"> </span><span className="text-blue-300">1</span><span className="text-zinc-300"> / rank</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> </span><span className="text-blue-300">0.0</span></div>
                            <div className="mt-2"><span className="text-pink-400">def</span> <span className="text-yellow-300">mean_reciprocal_rank</span><span className="text-zinc-300">(queries):</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> </span><span className="text-yellow-300">sum</span><span className="text-zinc-300">(reciprocal_rank(q.results, q.relevant) </span><span className="text-pink-400">for</span><span className="text-zinc-300"> q </span><span className="text-pink-400">in</span><span className="text-zinc-300"> queries) / </span><span className="text-yellow-300">len</span><span className="text-zinc-300">(queries)</span></div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-800">
                    <strong>When to use:</strong> MRR is best when there is a single best answer (FAQ systems, customer support). It strongly rewards getting the right answer at rank 1 and heavily penalizes it appearing lower. Less appropriate when multiple good answers exist.
                </div>
            </section>

            <hr className="border-border" />

            {/* 4. Recall@K and Precision@K */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Recall@K, Precision@K, and MAP</h2>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="border border-zinc-200 p-5 rounded-xl">
                        <h3 className="font-bold mb-3 flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Recall@K</h3>
                        <p className="text-sm text-zinc-600 mb-2">
                            Fraction of all relevant documents that appear in the top-K results. Measures coverage rather than ordering.
                        </p>
                        <code className="text-xs bg-zinc-100 px-2 py-1 rounded block text-zinc-700">Recall@K = |relevant ∩ top-K| / |relevant|</code>
                        <p className="text-xs text-zinc-500 mt-2">Critical for RAG pipelines where you need to ensure the right context is always retrieved.</p>
                    </div>
                    <div className="border border-zinc-200 p-5 rounded-xl">
                        <h3 className="font-bold mb-3 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500" /> Precision@K</h3>
                        <p className="text-sm text-zinc-600 mb-2">
                            Fraction of the top-K results that are relevant. High Precision@K means fewer false positives shown to the user.
                        </p>
                        <code className="text-xs bg-zinc-100 px-2 py-1 rounded block text-zinc-700">Precision@K = |relevant ∩ top-K| / K</code>
                        <p className="text-xs text-zinc-500 mt-2">Important when the user sees all K results (not just the top 1), such as in grid-based UIs.</p>
                    </div>
                    <div className="border border-zinc-200 p-5 rounded-xl">
                        <h3 className="font-bold mb-3 flex items-center gap-2"><BarChart2 className="h-5 w-5 text-purple-500" /> MAP</h3>
                        <p className="text-sm text-zinc-600 mb-2">
                            Mean Average Precision. Averages Precision@K over all ranks where a relevant document appears. Sensitive to both rank position and completeness.
                        </p>
                        <p className="text-xs text-zinc-500">Less commonly used in modern practice — nDCG handles graded relevance better.</p>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. Building a Reliable Benchmark */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. Building a Reliable Benchmark</h2>

                <p className="text-foreground leading-relaxed">
                    A benchmark is only as good as its query coverage, annotation quality, and leakage controls. Small benchmarks with biased queries give misleading feedback. The benchmark must represent the full distribution of production queries, not just the easy or common ones.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Benchmark Size</th>
                                <th className="text-left p-3 border-b font-semibold">Reliability</th>
                                <th className="text-left p-3 border-b font-semibold">What It Can Distinguish</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-mono">&lt; 200 queries</td><td className="p-3 text-red-700">Unreliable</td><td className="p-3 text-zinc-600">Only large improvements. High noise from query sampling variance.</td></tr>
                            <tr className="border-b"><td className="p-3 font-mono">200–500 queries</td><td className="p-3 text-amber-700">Minimal viable</td><td className="p-3 text-zinc-600">Directionally correct for major changes. Not suitable for final rollout decisions.</td></tr>
                            <tr className="border-b"><td className="p-3 font-mono">1K–5K queries</td><td className="p-3 text-green-700">Production grade</td><td className="p-3 text-zinc-600">Can distinguish +0.01 nDCG improvements across query slices. Required for gating releases.</td></tr>
                            <tr><td className="p-3 font-mono">5K+</td><td className="p-3 text-green-700">High confidence</td><td className="p-3 text-zinc-600">Rare to build this large. Useful for regression testing across many model versions.</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800 mt-6">Evaluation Slices That Matter</h3>
                <p className="text-foreground leading-relaxed mb-4">
                    Aggregate nDCG hides regressions on specific query types. Good evaluation always reports numbers per slice:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { label: "Head queries (top 5% by frequency)", desc: "High-volume, usually easier. The model will likely already perform well here. Watch for regression from aggressive domain adaptation." },
                        { label: "Tail queries (bottom 50% by frequency)", desc: "Most queries in the distribution are here. Models often degrade significantly on tail queries when over-fitted to head traffic." },
                        { label: "Exact-match intent", desc: "User is looking for a specific named document. Benchmark model vs BM25 here — embeddings sometimes lose on exact-match unless trained with lexical overlap." },
                        { label: "Semantic/paraphrase intent", desc: "User describes a concept without knowing the vocabulary. This is where embedding models should win over BM25 baseline." }
                    ].map(s => (
                        <div key={s.label} className="border border-zinc-200 p-4 rounded-lg text-sm">
                            <div className="font-bold text-zinc-900 mb-1">{s.label}</div>
                            <p className="text-zinc-600">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <hr className="border-border" />

            {/* 6. Offline Evaluation Pitfalls */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">6. Offline Evaluation Pitfalls</h2>

                <div className="space-y-4">
                    {[
                        { title: "False Negatives in Ground Truth", desc: "If a truly relevant document is not annotated, every retrieval of that document counts as a mistake. This understates model quality and distorts fine-tuning signal. Mitigation: use pooling annotation strategies, annotate top-K from multiple models, not just one.", color: "red" },
                        { title: "Train/Test Leakage", desc: "If the same query (or near-identical paraphrases) appear in both training and benchmark data, metrics are inflated. Split by query family, not by random row selection. Chronological splits prevent future test data from leaking into training.", color: "orange" },
                        { title: "Wrong Unit of Measurement", desc: "If your benchmark uses passage-level relevance but your model is evaluated at document level (or vice versa), metric values are incomparable. Always align the unit of the annotation with the unit of retrieval.", color: "yellow" },
                        { title: "ANN Index Approximation Effects", desc: "Approximate Nearest Neighbor indexes (HNSW, IVF) introduce recall loss at retrieval time that is not present during offline evaluation (which often uses exact search). ANN recall of 95% means 5% of optimal results are never scored — this is a realistic production baseline, not zero.", color: "purple" }
                    ].map(p => (
                        <div key={p.title} className={`border border-${p.color}-200 bg-${p.color}-50 p-5 rounded-xl`}>
                            <h3 className={`font-bold text-${p.color}-900 flex items-center gap-2 mb-2`}>
                                <AlertTriangle className="h-4 w-4" /> {p.title}
                            </h3>
                            <p className={`text-sm text-${p.color}-800`}>{p.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <hr className="border-border" />

            {/* 7. Offline → Online Connection */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">7. From Offline Metrics to Live Search</h2>

                <p className="text-foreground leading-relaxed">
                    Offline evaluation gates which models are worth testing. A model that regresses on offline metrics should not proceed to an A/B experiment — it almost certainly performs worse in production. But a model that improves offline does not automatically deliver live improvements:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 border border-green-200 p-5 rounded-xl text-sm">
                        <h3 className="font-bold text-green-800 mb-3">Offline nDCG improvement → Experiment</h3>
                        <p className="text-green-700">If a model improves nDCG@10 by ≥ 0.01–0.02 across all query slices (without cherry-picking), it is a strong candidate for A/B testing. The improvement should hold across head and tail, and both exact-match and semantic query types.</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 p-5 rounded-xl text-sm">
                        <h3 className="font-bold text-red-800 mb-3">Offline improvement ≠ guaranteed live win</h3>
                        <p className="text-red-700">Stale labels, position bias in ground truth, retraining on label distribution that does not match real users, or downstream re-rankers mitigating the embedding&apos;s weaknesses can all decouple offline and online metrics. Live A/B on CTR, session success, and zero-result rate is the final decision point.</p>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800">Practical Evaluation Workflow</h3>
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">evaluate_model.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">evaluate_model</span><span className="text-zinc-300">(model, benchmark, k=10):</span></div>
                            <div className="pl-4"><span className="text-zinc-300">results = &#123;&#125;</span></div>
                            <div className="pl-4 mt-2"><span className="text-pink-400">for</span><span className="text-zinc-300"> slice_name, queries </span><span className="text-pink-400">in</span><span className="text-zinc-300"> benchmark.slices.items():</span></div>
                            <div className="pl-8"><span className="text-zinc-300">ndcg_scores, mrr_scores, recall_scores = [], [], []</span></div>
                            <div className="pl-8"><span className="text-pink-400">for</span><span className="text-zinc-300"> q </span><span className="text-pink-400">in</span><span className="text-zinc-300"> queries:</span></div>
                            <div className="pl-12"><span className="text-zinc-300">ranked = model.retrieve(q.text, k=k)</span></div>
                            <div className="pl-12"><span className="text-zinc-300">ndcg_scores.append(ndcg_at_k(ranked, q.relevant, k))</span></div>
                            <div className="pl-12"><span className="text-zinc-300">mrr_scores.append(reciprocal_rank(ranked, q.relevant))</span></div>
                            <div className="pl-12"><span className="text-zinc-300">recall_scores.append(recall_at_k(ranked, q.relevant, k))</span></div>
                            <div className="pl-8"><span className="text-zinc-300">results[slice_name] = &#123;</span></div>
                            <div className="pl-12"><span className="text-green-300">&quot;nDCG@K&quot;</span><span className="text-zinc-300">: mean(ndcg_scores),</span></div>
                            <div className="pl-12"><span className="text-green-300">&quot;MRR&quot;</span><span className="text-zinc-300">: mean(mrr_scores),</span></div>
                            <div className="pl-12"><span className="text-green-300">&quot;Recall@K&quot;</span><span className="text-zinc-300">: mean(recall_scores)</span></div>
                            <div className="pl-8"><span className="text-zinc-300">&#125;</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> results</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 8. Reading Metric Changes */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">8. How to Read Metric Changes</h2>

                <p className="text-foreground leading-relaxed">
                    Knowing that nDCG improved by 0.02 is not enough. Good evaluation analysis reads the direction of change across all slices and metrics simultaneously to understand what actually shifted.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Pattern</th>
                                <th className="text-left p-3 border-b font-semibold">Likely Explanation</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-3 font-medium text-green-700">nDCG +0.02, Recall +0.03, MRR flat</td>
                                <td className="p-3 text-zinc-600">Model retrieves more complete result sets, but first-hit position unchanged</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3 font-medium text-green-700">MRR +0.05, nDCG flat, Recall flat</td>
                                <td className="p-3 text-zinc-600">Model improves first-hit accuracy but not comprehensive recall</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3 font-medium text-amber-600">nDCG +0.03 head, nDCG -0.01 tail</td>
                                <td className="p-3 text-zinc-600">Head over-fitting — training signal dominated by popular queries</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium text-red-600">All metrics improve offline, regress online</td>
                                <td className="p-3 text-zinc-600">Benchmark is stale, biased, or the model succeeds on annotation artifacts</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Key Takeaways */}
            <section>
                <KeyTakeaways takeaways={takeaways} />
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/embedding-training/fine-tuning" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 7.4 Fine-Tuning Strategies
                </Link>
                <Link href="/search/embedding-training/deployment" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    7.6 Production Deployment <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
