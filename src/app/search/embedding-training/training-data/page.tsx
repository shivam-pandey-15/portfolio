"use client";

import Link from "next/link";
import {
    AlertTriangle, Database, Fingerprint, Bug, Filter, GitBranch,
    KeyRound, ArrowRight, ArrowLeft, CheckCircle, XCircle, Lightbulb
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    {
        title: "Data quality beats model cleverness",
        description: "High-quality training data is the main determinant of custom embedding performance. A mediocre training recipe with great domain pairs usually beats an elegant loss function trained on noisy signals. Two teams can start from the same model and get completely different results based solely on data quality."
    },
    {
        title: "Build positive pairs from sessions, not single events",
        description: "A single click is too thin. Good positive pairs come from session-aware behavioral evidence — click + long dwell time + no immediate reformulation + successful session ending. Filtering out pogo-sticking and accidental taps is as important as collecting clicks."
    },
    {
        title: "Hard negatives teach the fine distinctions that matter",
        description: "Random negatives are useful early but don't teach the model the fine semantic boundaries your users care about. Hard negatives — like 'iPhone 15 case' vs 'iPhone 15 charger' — force the model to learn precise distinctions that random sampling never provides."
    },
    {
        title: "False negatives silently damage the vector space",
        description: "A false negative (treating an actually relevant document as irrelevant) is the most dangerous training flaw. It pushes good documents away from relevant queries permanently. Filtering, debiasing, and excluding near-duplicates matter as much as data volume."
    }
];

export default function TrainingDataPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero Section */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 7.2</span>
                        <span>Training Embedding Models</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Training Data: Click Pairs &amp; Hard Negatives</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            Why data quality matters more than model cleverness. How to turn messy behavioral exhaust into clean training triplets, why hard negatives are essential, and what false negatives silently do to your vector space.
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><Filter className="w-4 h-4" /> Filter Rate</div>
                        <p className="text-2xl font-bold text-zinc-900 mb-2">&gt; 50%</p>
                        <p className="text-sm text-zinc-600">Expected discard rate of raw clicks due to pogo-sticking, low dwell time, and positional bias noise.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-red-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-red-700 font-medium text-sm"><Bug className="w-4 h-4" /> Primary Toxin</div>
                        <p className="text-2xl font-bold text-zinc-900 mb-2">False Negatives</p>
                        <p className="text-sm text-zinc-600">The most dangerous training flaw — pushing actually relevant documents away from queries in vector space.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-amber-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-amber-700 font-medium text-sm"><GitBranch className="w-4 h-4" /> Negative Strategy</div>
                        <p className="text-2xl font-bold text-zinc-900 mb-2">In-Batch + Hard</p>
                        <p className="text-sm text-zinc-600">The standard mix: in-batch negatives for volume, hard negatives for fine-grained semantic boundaries.</p>
                    </div>
                </div>

                {/* Tip Box */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                        <strong>The Core Principle:</strong> An embedding model is not given direct definitions of relevance. It infers relevance from examples. If your positives are weak, your embedding space becomes fuzzy. If your negatives are too easy, the model learns only coarse separation. If your dataset is biased by ranking, your model faithfully reproduces that bias.
                    </div>
                </div>
            </div>

            {/* 1. Executive Summary */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. Executive Summary: Data Dominates Outcomes</h2>

                <p className="text-foreground leading-relaxed">
                    For embedding training, data quality matters more than model cleverness. A mediocre training recipe with high-quality domain pairs usually beats an elegant loss function trained on noisy signals. In production search, the most valuable supervision often comes from user behavior: what they searched, what they clicked, what they ignored, how long they stayed, and whether the session ended successfully.
                </p>

                <p className="text-foreground leading-relaxed">
                    That does not mean raw click logs are ground truth. Clicks are shaped by rank position, UI bias, freshness, brand familiarity, and even accidental taps. The central job of this chapter is to explain how to turn messy behavioral exhaust into training examples that teach the model something useful rather than simply recreating old ranking mistakes.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-red-50 border border-red-200 p-5 rounded-xl text-sm">
                        <div className="font-bold text-red-900 mb-2">Team A (Poor outcome)</div>
                        <p className="text-red-800">Uses raw clicks with no filtering and random negatives. Model faithfully learns the old system&apos;s rank distribution — including all its biases.</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-5 rounded-xl text-sm">
                        <div className="font-bold text-green-900 mb-2">Team B (Good outcome)</div>
                        <p className="text-green-800">Uses cleaned sessions, dwell thresholds, hard negatives, and leakage controls. Gives the model a better map of what &quot;good retrieval&quot; actually means.</p>
                    </div>
                </div>

                <p className="text-foreground leading-relaxed">
                    Team B is not using a better architecture. They are giving the model better training signal. The difference in outcomes is almost entirely determined by data quality decisions made before the first training step.
                </p>
            </section>

            <hr className="border-border" />

            {/* 2. Types of Training Signal */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Types of Training Signal</h2>

                <p className="text-foreground leading-relaxed">
                    Search training data comes from three main sources. Understanding the trade-offs of each helps you decide what mix to use and how much cleanup is needed before training.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <KeyRound className="h-5 w-5 text-primary" />
                            Explicit Labels
                        </h3>
                        <p className="text-sm text-zinc-600 mb-4">
                            Human annotation, thumbs up/down, quality reviews, or labeled duplicate questions from experts.
                        </p>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <strong className="text-green-700 block mb-1">Advantages</strong>
                                <ul className="list-disc pl-3 text-zinc-600 space-y-1">
                                    <li>High precision</li>
                                    <li>Unambiguous</li>
                                    <li>Good for eval too</li>
                                </ul>
                            </div>
                            <div>
                                <strong className="text-red-700 block mb-1">Disadvantages</strong>
                                <ul className="list-disc pl-3 text-zinc-600 space-y-1">
                                    <li>Expensive &amp; slow</li>
                                    <li>Hard to scale</li>
                                    <li>Often too small</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Fingerprint className="h-5 w-5 text-primary" />
                            Implicit Feedback
                        </h3>
                        <p className="text-sm text-zinc-600 mb-4">
                            Result clicks, dwell time, add-to-cart, ticket resolution, purchases, copy/download actions, session abandonment.
                        </p>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <strong className="text-green-700 block mb-1">Advantages</strong>
                                <ul className="list-disc pl-3 text-zinc-600 space-y-1">
                                    <li>Large volume</li>
                                    <li>Continuously refreshed</li>
                                    <li>Real user intent</li>
                                </ul>
                            </div>
                            <div>
                                <strong className="text-red-700 block mb-1">Disadvantages</strong>
                                <ul className="list-disc pl-3 text-zinc-600 space-y-1">
                                    <li>Biased by rank/UI</li>
                                    <li>Position effects</li>
                                    <li>Requires debiasing</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Database className="h-5 w-5 text-primary" />
                            Synthetic Data
                        </h3>
                        <p className="text-sm text-zinc-600 mb-4">
                            LLM-generated pseudo-queries from documents, expert seeds, or distilled signals from rerankers and FAQ mappings.
                        </p>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <strong className="text-green-700 block mb-1">Advantages</strong>
                                <ul className="list-disc pl-3 text-zinc-600 space-y-1">
                                    <li>Works without clicks</li>
                                    <li>Cold start support</li>
                                    <li>Controllable quality</li>
                                </ul>
                            </div>
                            <div>
                                <strong className="text-red-700 block mb-1">Disadvantages</strong>
                                <ul className="list-disc pl-3 text-zinc-600 space-y-1">
                                    <li>Too clean / polished</li>
                                    <li>Misses real patterns</li>
                                    <li>Bootstrap only</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 3. Turning Logs Into Pairs */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Turning Logs Into Query-Positive Pairs</h2>

                <p className="text-foreground leading-relaxed">
                    A single click event is too thin to be reliable. Good pipelines reconstruct <strong>full sessions</strong>: the original query, the ranked list shown, the clicked result, its position, dwell time, any follow-up queries, and the final success event if available. This lets you distinguish genuinely useful clicks from positional accidents and pogo-sticking.
                </p>

                <p className="text-foreground leading-relaxed">
                    Behavioral data is powerful because it links a query to a decision. A user typed something, saw results, chose one item, maybe spent time with it, maybe converted, maybe reformulated. That sequence contains much richer supervision than isolated text similarity. The user never explicitly labeled the document, but their behavior strongly implies it.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Session Signal</th>
                                <th className="text-left p-3 border-b font-semibold">Interpretation</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-3 font-medium text-green-700">Click + long dwell time</td>
                                <td className="p-3 text-zinc-600">Strong positive — document was useful</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3 font-medium text-green-700">Click + conversion (purchase, close ticket)</td>
                                <td className="p-3 text-zinc-600">Very strong positive — document solved the need</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3 font-medium text-red-600">Click + short dwell + immediate reformulation</td>
                                <td className="p-3 text-zinc-600">Weak or noisy positive — pogo-sticking, likely discard</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium text-orange-600">High exposure, no clicks</td>
                                <td className="p-3 text-zinc-600">Potential negative evidence — shown prominently but skipped</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800 mt-6">Session Pipeline in Code</h3>
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">build_positive_pairs.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">build_positive_pairs</span><span className="text-zinc-300">(session_logs, min_dwell=20):</span></div>
                            <div className="pl-4"><span className="text-zinc-300">pairs = []</span></div>
                            <div className="pl-4 mt-2"><span className="text-pink-400">for</span><span className="text-zinc-300"> session </span><span className="text-pink-400">in</span><span className="text-zinc-300"> session_logs:</span></div>
                            <div className="pl-8"><span className="text-pink-400">if</span><span className="text-zinc-300"> </span><span className="text-pink-400">not</span><span className="text-zinc-300"> session.query: </span><span className="text-pink-400">continue</span></div>
                            <div className="pl-8 mt-2"><span className="text-pink-400">for</span><span className="text-zinc-300"> click </span><span className="text-pink-400">in</span><span className="text-zinc-300"> session.clicks:</span></div>
                            <div className="pl-12 text-zinc-500"># Ignore accidental / short-dwell clicks</div>
                            <div className="pl-12"><span className="text-pink-400">if</span><span className="text-zinc-300"> click.dwell_seconds &lt; min_dwell: </span><span className="text-pink-400">continue</span></div>
                            <div className="pl-12 text-zinc-500 mt-2"># Ignore pogo-sticking (quick reformulation)</div>
                            <div className="pl-12"><span className="text-pink-400">if</span><span className="text-zinc-300"> session.reformulated_within_seconds(10): </span><span className="text-pink-400">continue</span></div>
                            <div className="pl-12 mt-2"><span className="text-zinc-300">pairs.append(&#123;</span><span className="text-green-300">&quot;query&quot;</span><span className="text-zinc-300">: session.query, </span><span className="text-green-300">&quot;doc_id&quot;</span><span className="text-zinc-300">: click.doc_id&#125;)</span></div>
                            <div className="pl-4 mt-2"><span className="text-pink-400">return</span><span className="text-zinc-300"> pairs</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 4. Biases Hidden in Click Data */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. The Biases Hidden in Click Data</h2>

                <p className="text-foreground leading-relaxed">
                    Raw click data is biased in multiple compounding ways. Training naively on unfiltered clicks means teaching the model to reproduce the old ranking system&apos;s biases, not to learn genuine relevance. Understanding these biases is essential before deciding how much to trust any behavioral signal.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="border border-zinc-200 p-4 rounded-lg text-sm">
                            <div className="font-bold text-zinc-900 mb-2">Position Bias</div>
                            <p className="text-zinc-600">Users examine top results more than lower results. A rank-1 result gets clicked partly because it is better, but also because it is seen first. Training naively on raw clicks teaches the model the old system&apos;s rank distribution, not actual relevance.</p>
                        </div>
                        <div className="border border-zinc-200 p-4 rounded-lg text-sm">
                            <div className="font-bold text-zinc-900 mb-2">Presentation Bias</div>
                            <p className="text-zinc-600">A result with a bright thumbnail, trusted brand, or bolded snippet gets more clicks even if less relevant. In e-commerce, image quality and price badges distort behavior. In knowledge search, document titles dominate clicks even when content is weak.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="border border-zinc-200 p-4 rounded-lg text-sm">
                            <div className="font-bold text-zinc-900 mb-2">Freshness Bias</div>
                            <p className="text-zinc-600">Users may prefer newer content because it appears recent, not because it is more semantically relevant. This can leak freshness preference into the embedding space even when it should be handled later by a separate freshness signal.</p>
                        </div>
                        <div className="border border-zinc-200 p-4 rounded-lg text-sm">
                            <div className="font-bold text-zinc-900 mb-2">Popularity Bias</div>
                            <p className="text-zinc-600">Popular items absorb more clicks. A model trained only on clicks may collapse toward popular entities and under-serve the long tail — exactly the tail that training was supposed to fix.</p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. Negative Sampling Strategy */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. Negative Sampling: Where Systems Win or Waste Training</h2>

                <p className="text-foreground leading-relaxed">
                    If the query is &quot;reset mac vpn&quot; and your negative is a cooking recipe, the model learns almost nothing. That negative was already far away in semantic space before training. Easy negatives give coarse separation. They do not teach the model the fine semantic boundaries that distinguish good retrieval from mediocre retrieval in production.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Negative Type</th>
                                <th className="text-left p-3 border-b font-semibold">Description</th>
                                <th className="text-left p-3 border-b font-semibold">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-3 font-medium">Random negative</td>
                                <td className="p-3 text-zinc-600">Arbitrary document from corpus</td>
                                <td className="p-3 text-zinc-600">Easy baseline signal only — use early, not exclusively</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3 font-medium">In-batch negative</td>
                                <td className="p-3 text-zinc-600">Positive for another query in same batch</td>
                                <td className="p-3 text-green-700 font-medium">Highly efficient, huge volume from batch size</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3 font-medium">Lexical hard negative</td>
                                <td className="p-3 text-zinc-600">Shares many words but is wrong factually</td>
                                <td className="p-3 text-green-700 font-medium">Strong for fine-grained semantic separation</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3 font-medium">Behavioral negative</td>
                                <td className="p-3 text-zinc-600">Highly exposed, consistently not clicked</td>
                                <td className="p-3 text-zinc-600">Strong if debiased well — removes position effects</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium">Model-mined negative</td>
                                <td className="p-3 text-zinc-600">Retrieved by current dense model but judged wrong</td>
                                <td className="p-3 text-green-700 font-medium">Excellent for late-stage refinement</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start mt-4">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Hard Negatives Teach Distinctions</h3>
                        <p className="text-zinc-700 leading-relaxed text-sm">
                            Hard negatives are valuable precisely because they are dangerous. They look relevant. The model must learn the subtle difference between a document that almost answers the query and one that actually does. That distinction is exactly what separates a mediocre retrieval system from a precise one.
                        </p>
                        <p className="text-zinc-700 leading-relaxed text-sm">
                            A practical negative mining curriculum: start with in-batch negatives, add BM25-mined lexical lookalikes, then add top-k ANN results from the current model. This curriculum usually works better than jumping straight to only the hardest negatives from the start.
                        </p>
                    </div>

                    <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-sm">
                        <h4 className="font-bold text-red-800 flex items-center gap-2 mb-4">
                            <Bug className="h-5 w-5" /> Hard Negatives in Action
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <div className="font-bold text-zinc-900">Query: &quot;iphone 15 charger&quot;</div>
                                <div className="text-green-700 mt-1 text-xs">✔ Positive: USB-C charging adapter for iPhone 15</div>
                                <div className="text-red-700 text-xs">✘ Hard Negative: iPhone 15 protective case (looks close!)</div>
                            </div>
                            <hr className="border-red-200" />
                            <div>
                                <div className="font-bold text-zinc-900">Query: &quot;postgres replication lag&quot;</div>
                                <div className="text-green-700 mt-1 text-xs">✔ Positive: Runbook for diagnosing replica lag</div>
                                <div className="text-red-700 text-xs">✘ Hard Negative: Documentation for replication setup</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 6. False Negatives */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">6. False Negatives: The Silent Model Killer</h2>

                <p className="text-foreground leading-relaxed">
                    A false negative is a document that is labeled or treated as irrelevant even though it is actually relevant to the query. In search, this happens constantly because multiple documents can satisfy any given information need. If you train the model to push away a document that users would actually find helpful, you permanently damage the embedding space in ways that are hard to diagnose.
                </p>

                <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                    <div className="font-bold text-red-900 mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" /> Example
                    </div>
                    <div className="space-y-2 text-sm text-red-800">
                        <p><strong>Query:</strong> &quot;benefits enrollment deadline&quot;</p>
                        <p className="text-green-800"><strong>Positive doc from clicks:</strong> HR annual enrollment guide</p>
                        <p className="text-red-800"><strong>False &quot;Negative&quot; doc:</strong> Benefits FAQ page with the same enrollment deadline</p>
                    </div>
                    <p className="text-sm text-red-700 mt-3">
                        If you push the FAQ page away from this query, you damage the embedding space for anyone who would have found it useful — and those are real users.
                    </p>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800">How Teams Reduce False Negatives</h3>
                <ul className="space-y-2 text-foreground">
                    <li className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Exclude documents from the same category or entity cluster as the positive
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Remove near-duplicates and documents with very high lexical overlap with the positive
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Use teacher rerankers or LLM judges to filter documents that are plausibly relevant before treating them as negatives
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Prefer &quot;shown above clicked result and skipped&quot; as negatives — that is much stronger evidence than being simply unclicked
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Skip any negative whose lexical AND semantic similarity to the query are both high — ambiguity means uncertainty about its relevance
                    </li>
                </ul>
            </section>

            <hr className="border-border" />

            {/* 7. Building the Dataset */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">7. Building the Dataset: Schemas and Splits</h2>

                <p className="text-foreground leading-relaxed">
                    The concrete output of a good training data pipeline is a dataset of query-document pairs or triplets, formatted consistently and split by query family rather than by random sampling.
                </p>

                <h3 className="text-xl font-semibold text-zinc-800">Recommended Record Formats</h3>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-sm">
                        <div className="font-bold text-zinc-900 mb-2">Pair Format</div>
                        <div className="bg-[#1e1e1e] rounded p-3 font-mono text-xs text-zinc-300">
                            <div>&#123;</div>
                            <div className="pl-2 text-green-300">&quot;query&quot;: &quot;reset sso token&quot;,</div>
                            <div className="pl-2 text-green-300">&quot;positive&quot;: &quot;Runbook for SSO token reset&quot;</div>
                            <div>&#125;</div>
                        </div>
                        <p className="text-zinc-500 mt-2">Simplest. Used with in-batch negatives from the loss function.</p>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-sm">
                        <div className="font-bold text-zinc-900 mb-2">Triplet Format</div>
                        <div className="bg-[#1e1e1e] rounded p-3 font-mono text-xs text-zinc-300">
                            <div>&#123;</div>
                            <div className="pl-2 text-green-300">&quot;query&quot;: &quot;reset sso token&quot;,</div>
                            <div className="pl-2 text-green-300">&quot;positive&quot;: &quot;Runbook for SSO...&quot;,</div>
                            <div className="pl-2 text-red-400">&quot;negative&quot;: &quot;SSO admin policy...&quot;</div>
                            <div>&#125;</div>
                        </div>
                        <p className="text-zinc-500 mt-2">Includes an explicit hard negative. Best for fine-grained domains.</p>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-sm">
                        <div className="font-bold text-zinc-900 mb-2">Multi-Positive Format</div>
                        <div className="bg-[#1e1e1e] rounded p-3 font-mono text-xs text-zinc-300">
                            <div>&#123;</div>
                            <div className="pl-2 text-green-300">&quot;query&quot;: &quot;benefits deadline&quot;,</div>
                            <div className="pl-2 text-blue-300">&quot;positives&quot;: [</div>
                            <div className="pl-4 text-green-300">&quot;Annual enrollment guide...&quot;,</div>
                            <div className="pl-4 text-green-300">&quot;Benefits FAQ policy...&quot;</div>
                            <div className="pl-2 text-blue-300">]</div>
                            <div>&#125;</div>
                        </div>
                        <p className="text-zinc-500 mt-2">Use when multiple docs are genuinely relevant. Avoids false negatives.</p>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800 mt-8">Split by Query Family, Not Just Rows</h3>
                <p className="text-foreground leading-relaxed mb-4">
                    One of the easiest ways to fool yourself is to let near-identical query variants leak across train and test splits. Random row splitting is not sufficient. Good splits require:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm">
                        <div className="font-bold text-red-800 mb-2">❌ Bad Split (Leaky)</div>
                        <p className="text-red-700">Train: &quot;reset okta token&quot;</p>
                        <p className="text-red-700">Test: &quot;how do i reset okta token&quot;</p>
                        <p className="text-red-600 mt-2 text-xs">These are the same intent. The model will appear to generalize when it has merely memorized the intent.</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm">
                        <div className="font-bold text-green-800 mb-2">✔ Good Split (Family-Based)</div>
                        <p className="text-green-700">Group by normalized query intent first</p>
                        <p className="text-green-700">Split chronologically when possible</p>
                        <p className="text-green-600 mt-2 text-xs">Ensures real generalization is measured, not intent memorization.</p>
                    </div>
                </div>

                <p className="text-foreground leading-relaxed mt-4">
                    Additional principles: keep head and tail queries balanced in every split. Preserve domain slices so you can diagnose failures. Never let future clicks appear in the training split when splitting by time.
                </p>
            </section>

            <hr className="border-border" />

            {/* 8. Bootstrap Strategies */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">8. Bootstrap Strategies When You Lack Click Data</h2>

                <p className="text-foreground leading-relaxed">
                    Cold start systems, private knowledge bases, new products, and low-traffic enterprise search systems often have no usable click logs. In these cases, there are three viable paths to bootstrap a training dataset before real user behavior accumulates.
                </p>

                <div className="space-y-5">
                    <div className="border border-zinc-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <Database className="h-5 w-5 text-blue-500" />
                            Synthetic Queries from Documents
                        </h3>
                        <p className="text-sm text-zinc-700 leading-relaxed mb-3">
                            LLMs can generate plausible user queries from each document or chunk. This works well for new products, private knowledge bases, and high-value domains with no click logs. But synthetic data tends to be too clean and polished — real user queries are messy, abbreviated, and misspelled. Synthetic query generation should include prompt diversity:
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600">
                            <span>• Short keyword queries (2-4 words)</span>
                            <span>• Natural-language questions</span>
                            <span>• Error-message style queries</span>
                            <span>• Synonym-rich variants</span>
                            <span>• Abbreviations and acronyms</span>
                            <span>• Novice and expert phrasing</span>
                        </div>
                    </div>

                    <div className="border border-zinc-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <KeyRound className="h-5 w-5 text-green-500" />
                            Expert-Labeled Seeds
                        </h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            Even 500 to 2,000 carefully labeled query-document examples can be extremely useful for both evaluation and early fine-tuning when combined with in-batch negatives. Small expert-labeled sets are especially valuable for high-stakes domains (medical, legal, financial) where synthetic data quality cannot be trusted.
                        </p>
                    </div>

                    <div className="border border-zinc-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <GitBranch className="h-5 w-5 text-purple-500" />
                            Weak Supervision from Existing Systems
                        </h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            Distill training signal from high-performing rerankers, curated FAQ mappings (question → article), support macros linked to specific articles, manual merchandised results, or human-curated collection pages. These are often underused data sources that give you pseudo-labels without requiring full annotation.
                        </p>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 9. Dataset Quality Checklist */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">9. Dataset Quality Checklist</h2>

                <p className="text-foreground leading-relaxed">
                    Before investing compute in training, validate your dataset against these six questions. If several answers are &quot;no,&quot; better training code will not save the project. Data quality decisions made here determine outcomes more than any architectural choice.
                </p>

                <div className="space-y-3">
                    {[
                        { q: "Are positives actually useful, or merely clicked?", note: "Click-through alone is not sufficient. Verify with dwell time, conversion, or explicit quality review." },
                        { q: "Are negatives hard enough to teach real distinctions?", note: "If all negatives are already far away from the query, the model won't learn fine-grained boundaries." },
                        { q: "Have we filtered likely false negatives?", note: "Documents in the same category as the positive that are unlabeled may actually be relevant." },
                        { q: "Is the dataset balanced across head and tail queries?", note: "If 90% of pairs are head queries, the model over-fits to popular queries and leaves the tail uncovered." },
                        { q: "Are train/dev/test splits leakage-safe?", note: "Split by query family or time window, not by random row selection." },
                        { q: "Does the dataset reflect live production behavior?", note: "If collected 18 months ago before a major product change, the signal may be stale or misleading." }
                    ].map(({ q, note }, i) => (
                        <div key={i} className="border border-zinc-200 p-4 rounded-lg">
                            <div className="flex items-start gap-3">
                                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                                <div>
                                    <p className="font-semibold text-sm text-zinc-900">{q}</p>
                                    <p className="text-xs text-zinc-500 mt-1">{note}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Key Takeaways */}
            <section>
                <KeyTakeaways takeaways={takeaways} />
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/embedding-training/why" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 7.1 Why Train Your Own
                </Link>
                <Link href="/search/embedding-training/contrastive" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    7.3 Contrastive Learning <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
