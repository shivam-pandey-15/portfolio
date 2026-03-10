"use client";

import Link from "next/link";
import {
    BarChart3, ArrowRight, ArrowLeft, Zap, Target,
    Search, Eye, MessageSquare, Users,
    TrendingUp, Activity, CheckCircle2
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Recall@K Is the Foundation Metric", description: "If relevant documents aren't in the candidate set, nothing downstream can fix it. For multi-stage pipelines (retrieve→rerank), recall@K of the retrieval stage determines the ceiling for the entire system." },
    { title: "nDCG@K Is the Gold Standard for Ranking", description: "Handles graded relevance (not just binary) and position-aware weighting. If you can only track one metric, use nDCG@10. Primary metric used by academic IR competitions and major search companies." },
    { title: "Build an Evaluation Dataset (50-100 Queries)", description: "Human annotation is gold standard. Include head/torso/tail queries from real query logs. 2+ annotators, Cohen's kappa > 0.7. Total: 1K-4K judgments, achievable in 1-2 days." },
    { title: "LLM-as-Judge: Scalable Alternative", description: "~80-90% agreement with human judgments at ~$0.01-0.05 per judgment. Thousands of judgments in minutes. But: has its own biases, can be fooled by superficially relevant content." },
    { title: "The Full Pipeline: Offline → Shadow → A/B → Rollout", description: "Offline eval on static dataset → shadow deploy (run alongside, don't show) → A/B test 5-10% of users for 1-2 weeks → full rollout if online metrics improve. Skipping steps causes silent degradation." },
];

export default function EvaluationPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.12</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Evaluating Search Quality</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            Building a search system without measuring its quality is like driving blindfolded. This
                            chapter covers the standard metrics (Recall, Precision, MRR, nDCG, MAP), how to build
                            evaluation datasets, and the offline/online pipeline production teams use to continuously
                            measure and improve quality.
                        </p>
                    </div>
                </div>
            </div>

            {/* 1. Recall@K */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. Recall@K</h2>
                <p className="text-foreground leading-relaxed">
                    Recall measures completeness: of all the documents in your corpus that are actually relevant to the 
                    query, what fraction did your system find in its top K results? It is the <strong>most important
                    metric</strong> for the retrieval stage of a search pipeline. Why? Because retrieval is a bottleneck.
                    If a relevant document isn&apos;t found in the initial retrieval step, no downstream reranker or LLM
                    can magically conjure it.
                </p>

                <p className="text-foreground leading-relaxed">
                    A typical architecture retrieves 1,000 documents using fast vector search, then reranks the top 100
                    using a slower, more accurate cross-encoder. In this setup, your system&apos;s ultimate quality ceiling 
                    is strictly bounded by the Recall@1000 of the first stage.
                </p>
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">recall_at_k.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">recall_at_k</span><span className="text-zinc-300">(retrieved, relevant, k):</span></div>
                            <div className="pl-4"><span className="text-green-300">&quot;&quot;&quot;What fraction of relevant docs did we find in top K?&quot;&quot;&quot;</span></div>
                            <div className="pl-4"><span className="text-zinc-300">retrieved_at_k = </span><span className="text-yellow-300">set</span><span className="text-zinc-300">(retrieved[:k])</span></div>
                            <div className="pl-4"><span className="text-zinc-300">found = retrieved_at_k &amp; relevant</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> </span><span className="text-yellow-300">len</span><span className="text-zinc-300">(found) / </span><span className="text-yellow-300">len</span><span className="text-zinc-300">(relevant)</span></div>
                            <div className="mt-2"><span className="text-zinc-500"># Relevant: &#123;A, B, C, D, E&#125;</span></div>
                            <div><span className="text-zinc-500"># Retrieved top-10: [A, X, B, Y, Z, C, W, V, U, T]</span></div>
                            <div><span className="text-zinc-500"># recall@10 = |&#123;A,B,C&#125;| / |&#123;A,B,C,D,E&#125;| = 3/5 = 0.60</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. Precision@K */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Precision@K</h2>
                <p className="text-foreground leading-relaxed">
                    While recall asks &quot;did we find everything?&quot;, precision asks &quot;is what we found useful?&quot; It measures
                    noise: what fraction of the top K results returned to the user are actually relevant to their query?
                    A system that just returns the entire database has perfect recall, but terrible precision.
                </p>

                <p className="text-foreground leading-relaxed">
                    Precision is what users actually experience. If they look at the top 10 results and 8 of them are
                    junk, they perceive the engine as broken, regardless of whether the 2 good results were the only
                    relevant documents in the entire corpus. Precision@10 is heavily correlated with user satisfaction.
                </p>
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">precision_at_k.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">precision_at_k</span><span className="text-zinc-300">(retrieved, relevant, k):</span></div>
                            <div className="pl-4"><span className="text-green-300">&quot;&quot;&quot;What fraction of top K results are relevant?&quot;&quot;&quot;</span></div>
                            <div className="pl-4"><span className="text-zinc-300">found = </span><span className="text-yellow-300">set</span><span className="text-zinc-300">(retrieved[:k]) &amp; relevant</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> </span><span className="text-yellow-300">len</span><span className="text-zinc-300">(found) / k</span></div>
                            <div className="mt-2"><span className="text-zinc-500"># precision@10 = |&#123;A,B,C&#125;| / 10 = 0.30</span></div>
                            <div><span className="text-zinc-500"># precision@3  = |&#123;A,B&#125;| / 3 = 0.67</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 3. MRR */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Mean Reciprocal Rank (MRR)</h2>
                <p className="text-foreground leading-relaxed">
                    MRR cares about exactly one thing: how far down the page did the user have to scroll to find the 
                    <strong> first relevant result</strong>? It takes the reciprocal of that rank (1/rank) and averages 
                    it across all queries. If the first relevant result is at position 1, the score is 1.0. If it&apos;s at 
                    position 10, the score is 0.1.
                </p>

                <p className="text-foreground leading-relaxed">
                    This is the perfect metric for "known-item" or navigational searches — instances where the user is 
                    looking for a very specific fact, FAQ answer, or product page, and they stop reading as soon as they 
                    find it. It penalizes systems heavily for burying the right answer.
                </p>
                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="space-y-1 text-xs">
                        <div>Query 1: first relevant at rank 1 → 1/1 = <span className="text-green-400">1.0</span></div>
                        <div>Query 2: first relevant at rank 3 → 1/3 = <span className="text-yellow-400">0.33</span></div>
                        <div>Query 3: first relevant at rank 5 → 1/5 = <span className="text-red-400">0.20</span></div>
                        <div className="mt-2">MRR = (1.0 + 0.33 + 0.20) / 3 = <span className="text-blue-400">0.51</span></div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 4. nDCG@K */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. nDCG@K (Gold Standard)</h2>
                <p className="text-foreground leading-relaxed">
                    Binary metrics (relevant vs. irrelevant) fail to capture nuance. A perfect match document is better
                    than a tangentially related one, and putting the perfect match at rank 1 is much better than putting
                    it at rank 10. Normalized Discounted Cumulative Gain (nDCG) handles both of these requirements.
                </p>

                <p className="text-foreground leading-relaxed">
                    It uses <strong>graded relevance</strong> (e.g., 0=irrelevant, 1=marginal, 2=good, 3=perfect match)
                    and applies a logarithmic discount based on position, meaning scores at the top of the list contribute
                    far more to the final metric than scores at the bottom. The resulting number is normalized between 
                    0 (worst) and 1 (best possible ranking). This is the primary metric used by major search companies
                    and academic IR competitions.
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
                            <div className="mt-1"><span className="text-pink-400">def</span> <span className="text-yellow-300">dcg_at_k</span><span className="text-zinc-300">(relevance_scores, k):</span></div>
                            <div className="pl-4"><span className="text-green-300">&quot;&quot;&quot;Sum of relevance / log2(rank+1). Higher ranks contribute more.&quot;&quot;&quot;</span></div>
                            <div className="pl-4"><span className="text-zinc-300">dcg = </span><span className="text-orange-300">0.0</span></div>
                            <div className="pl-4"><span className="text-pink-400">for</span><span className="text-zinc-300"> i </span><span className="text-pink-400">in</span><span className="text-zinc-300"> </span><span className="text-yellow-300">range</span><span className="text-zinc-300">(</span><span className="text-yellow-300">min</span><span className="text-zinc-300">(k, </span><span className="text-yellow-300">len</span><span className="text-zinc-300">(relevance_scores))):</span></div>
                            <div className="pl-8"><span className="text-zinc-300">dcg += relevance_scores[i] / math.log2(i + </span><span className="text-orange-300">2</span><span className="text-zinc-300">)</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> dcg</span></div>
                            <div className="mt-1"><span className="text-pink-400">def</span> <span className="text-yellow-300">ndcg_at_k</span><span className="text-zinc-300">(retrieved_rel, ideal_rel, k):</span></div>
                            <div className="pl-4"><span className="text-green-300">&quot;&quot;&quot;Normalize DCG by ideal (perfect) ranking. Returns 0.0-1.0.&quot;&quot;&quot;</span></div>
                            <div className="pl-4"><span className="text-zinc-300">actual = dcg_at_k(retrieved_rel, k)</span></div>
                            <div className="pl-4"><span className="text-zinc-300">ideal = dcg_at_k(</span><span className="text-yellow-300">sorted</span><span className="text-zinc-300">(ideal_rel, reverse=</span><span className="text-orange-300">True</span><span className="text-zinc-300">), k)</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> actual / ideal </span><span className="text-pink-400">if</span><span className="text-zinc-300"> ideal &gt; </span><span className="text-orange-300">0</span><span className="text-zinc-300"> </span><span className="text-pink-400">else</span><span className="text-zinc-300"> </span><span className="text-orange-300">0.0</span></div>
                            <div className="mt-2"><span className="text-zinc-500"># System returns: [3, 2, 0, 1, 0]</span></div>
                            <div><span className="text-zinc-500"># Ideal:          [3, 2, 1, 0, 0]</span></div>
                            <div><span className="text-zinc-500"># nDCG@5 = 4.70 / 4.77 = 0.985 (nearly perfect!)</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. MAP */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. MAP (Mean Average Precision)</h2>
                <p className="text-foreground leading-relaxed">
                    If MRR focuses only on the first relevant document, and Precision@K ignores everything past K,
                    Mean Average Precision (MAP) tries to evaluate the entire returned list. For a single query, it
                    calculates the precision at every rank where a relevant document is found, and averages those 
                    precisions. Then it averages that number across all queries.
                </p>

                <p className="text-foreground leading-relaxed">
                    Because it requires knowing the total number of relevant documents for a query (to properly
                    penalize for missing them), MAP is very difficult to compute accurately in production systems 
                    with millions of documents. It is mostly used in academic benchmarks where datasets are fully annotated.
                </p>
                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="space-y-1 text-xs">
                        <div className="text-zinc-400"># Relevant: &#123;A, B, C&#125;   Retrieved: [A, X, B, Y, C]</div>
                        <div>A at rank 1: precision = 1/1 = <span className="text-green-400">1.00</span></div>
                        <div>B at rank 3: precision = 2/3 = <span className="text-yellow-400">0.67</span></div>
                        <div>C at rank 5: precision = 3/5 = <span className="text-yellow-400">0.60</span></div>
                        <div className="mt-2">AP = (1.00 + 0.67 + 0.60) / 3 = <span className="text-blue-400">0.76</span></div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 6. Choosing the Right Metric */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">6. Choosing the Right Metric</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Metric</th>
                                <th className="text-left p-3 border-b font-semibold">Relevance</th>
                                <th className="text-left p-3 border-b font-semibold">Position?</th>
                                <th className="text-left p-3 border-b font-semibold">Best For</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">Recall@K</td><td className="p-3">Binary</td><td className="p-3">No</td><td className="p-3">Retrieval stage evaluation</td></tr>
                            <tr className="border-b"><td className="p-3">Precision@K</td><td className="p-3">Binary</td><td className="p-3">No</td><td className="p-3">User-facing result quality</td></tr>
                            <tr className="border-b"><td className="p-3">MRR</td><td className="p-3">Binary</td><td className="p-3">Yes (first hit)</td><td className="p-3">Q&amp;A, navigation</td></tr>
                            <tr className="border-b bg-green-50"><td className="p-3 font-medium">nDCG@K</td><td className="p-3 font-medium">Graded</td><td className="p-3">Yes (log)</td><td className="p-3 font-medium">Overall ranking (gold standard)</td></tr>
                            <tr><td className="p-3">MAP</td><td className="p-3">Binary</td><td className="p-3">Yes (avg)</td><td className="p-3">Academic benchmarks</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-blue-800 mb-2">Recommendation</div>
                    <p className="text-blue-700">
                        Use <strong>Recall@K for retrieval</strong> (did we find the right candidates?) and{" "}
                        <strong>nDCG@K for ranking</strong> (are they in the right order?). If you can only track one
                        metric, use <strong>nDCG@10</strong>.
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 7. Building Evaluation Datasets */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">7. Building Evaluation Datasets</h2>
                <p className="text-foreground leading-relaxed">
                    Metrics are meaningless without a dataset to run them against. You cannot evaluate a search engine
                    by typing in 5 queries and eyeballing the results — you will inevitably overfit to those 5 queries
                    and introduce regressions elsewhere. You need a static dataset of queries and known-good document
                    mappings to run CI/CD pipelines against.
                </p>
                
                <p className="text-foreground leading-relaxed">
                    Building this dataset is often the highest-ROI activity a search team can do. It doesn&apos;t need to
                    be massive: a golden set of 50-100 representative queries (mixed head, torso, and tail) with 10-20
                    judged documents per query is enough to detect meaningful regressions. There are three main ways to
                    source these judgments:
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-3"><Users className="w-4 h-4 text-blue-600" /><h3 className="text-lg font-bold">Human Annotation</h3></div>
                        <p className="text-sm text-zinc-700 mb-3">Gold standard. 50-100 queries, 10-20 docs per query, 2+ annotators (Cohen&apos;s κ &gt; 0.7). 1K-4K judgments in 1-2 days.</p>
                        <p className="text-xs text-zinc-500">Include queries from real logs, especially hard/ambiguous ones.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-3"><Activity className="w-4 h-4 text-green-600" /><h3 className="text-lg font-bold">Click-Through Data</h3></div>
                        <p className="text-sm text-zinc-700 mb-3">Infer from behavior: clicked + long dwell (&gt;30s) = relevant. Scales to millions of queries automatically.</p>
                        <p className="text-xs text-zinc-500">Biased by position (rank 1 gets more clicks regardless).</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-3"><MessageSquare className="w-4 h-4 text-purple-600" /><h3 className="text-lg font-bold">LLM-as-Judge</h3></div>
                        <p className="text-sm text-zinc-700 mb-3">~80-90% agreement with humans at ~$0.01-0.05 per judgment. Thousands in minutes. No annotator fatigue.</p>
                        <p className="text-xs text-zinc-500">Has own biases, can be fooled by superficially relevant docs.</p>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 8. Online Metrics */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">8. Online Evaluation Metrics</h2>
                <p className="text-foreground leading-relaxed">
                    Offline metrics (nDCG, Recall) tell you if the algorithm is matching your expected judgments. Online
                    metrics tell you if <strong>real users are actually finding value</strong>. The ultimate test of
                    a search system is how humans interact with it in production.
                </p>

                <p className="text-foreground leading-relaxed">
                    These metrics are gathered entirely from telemetry and clickstream data. They are noisy — users 
                    click things by accident, or abandon searches because their phone rang — but in aggregate across 
                    thousands of queries, they provide the ground truth for A/B testing.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Metric</th>
                                <th className="text-left p-3 border-b font-semibold">Measures</th>
                                <th className="text-left p-3 border-b font-semibold">Signal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">Click-through rate</td><td className="p-3">% queries with clicks</td><td className="p-3">Higher = results look relevant</td></tr>
                            <tr className="border-b"><td className="p-3">Zero-result rate</td><td className="p-3">% queries with no results</td><td className="p-3">Lower = better coverage</td></tr>
                            <tr className="border-b"><td className="p-3">Abandonment rate</td><td className="p-3">% queries without clicks</td><td className="p-3">Lower = results useful</td></tr>
                            <tr className="border-b"><td className="p-3">Mean dwell time</td><td className="p-3">Time on clicked results</td><td className="p-3">Longer = content matched intent</td></tr>
                            <tr><td className="p-3">Reformulation rate</td><td className="p-3">% immediate re-searches</td><td className="p-3">Lower = first results good</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 9. The Pipeline */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">9. The Offline → Online Pipeline</h2>
                <p className="text-foreground leading-relaxed">
                    Mature search teams never deploy a ranking change directly to users. They follow a rigorous,
                    multi-stage pipeline to ensure that systemic quality improves and catastrophic failures are
                    caught early. Skipping steps in this pipeline is the primary cause of silent search degradation.
                </p>

                <p className="text-foreground leading-relaxed">
                    The process begins offline against the golden dataset (fast, safe), graduates to shadow deployment
                    to catch latency/infrastructure issues, moves to a limited A/B test to measure actual user
                    behavior, and only then rolls out fully.
                </p>
                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="space-y-3 text-xs">
                        <div><span className="text-orange-300">1.</span> Develop change (new model, params, chunking)</div>
                        <div className="text-zinc-500 pl-4">↓</div>
                        <div><span className="text-orange-300">2.</span> <span className="text-green-400">Offline evaluation</span> against eval dataset</div>
                        <div className="pl-4 text-zinc-400">If metrics improve → proceed. If degrade → iterate.</div>
                        <div className="text-zinc-500 pl-4">↓</div>
                        <div><span className="text-orange-300">3.</span> <span className="text-blue-400">Shadow deployment</span> — run alongside old, compare</div>
                        <div className="pl-4 text-zinc-400">Log both results, don&apos;t show new to users.</div>
                        <div className="text-zinc-500 pl-4">↓</div>
                        <div><span className="text-orange-300">4.</span> <span className="text-yellow-400">A/B test</span> — show new results to 5-10% of users</div>
                        <div className="pl-4 text-zinc-400">Monitor CTR, abandonment, dwell. Run 1-2 weeks.</div>
                        <div className="text-zinc-500 pl-4">↓</div>
                        <div><span className="text-orange-300">5.</span> <span className="text-green-400">Full rollout</span> if online metrics improve. <span className="text-red-400">Rollback</span> if not.</div>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/databases" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.11 Vector Database Comparison
                </Link>
                <Link href="/search" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    Back to Search Home <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
