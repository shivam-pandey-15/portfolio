"use client";

import Link from "next/link";
import {
    Lightbulb, ArrowRight, ArrowLeft, Activity, AlertTriangle,
    Target, XCircle, CheckCircle, TrendingUp
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    {
        title: "Off-the-shelf models plateau",
        description: "General embeddings handle generic queries well but fail on proprietary vocabulary, internal acronyms, and asymmetric search formats (short queries to long docs). The hard queries are precisely where user trust breaks — and those are exactly what zero-shot models miss."
    },
    {
        title: "Training is about geometry, not general intelligence",
        description: "Fine-tuning doesn't make the model 'smart'. It simply reshapes the vector space so that domain-specific queries land geometrically closer to the right documents. You are editing local neighborhoods, not teaching the model general language understanding."
    },
    {
        title: "Use a three-condition decision rule",
        description: "Only train if: (1) zero-shot baseline is materially below your quality bar by more than ~0.03 NDCG, (2) you have enough training signal — clicks, labels, or synthetic data, AND (3) the lift justifies the MLOps overhead. All three must be true."
    },
    {
        title: "Nail the fundamentals before training",
        description: "Most retrieval problems are solved by better chunking, hybrid search, metadata filtering, or fixing evaluation pipelines — not by jumping straight to custom training. Exhaust BM25 + zero-shot dense retrieval before writing any training loops."
    }
];

export default function WhyTrainYourOwnPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero Section */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 7.1</span>
                        <span>Training Embedding Models</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Why Train Your Own Embedding Model</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            When to move past zero-shot embeddings and the strategic ROI of aligning the vector space to your specific domain vocabulary, user behavior, and business objectives. Training is justified — but not always.
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><Target className="w-4 h-4" /> The Goal</div>
                        <p className="text-2xl font-bold text-zinc-900 mb-2">Geometry</p>
                        <p className="text-sm text-zinc-600">You are changing local neighborhoods in vector space, not creating general intelligence. Domain neighbors move closer; irrelevant ones move farther.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm"><Activity className="w-4 h-4" /> Minimum Gap</div>
                        <p className="text-2xl font-bold text-zinc-900 mb-2">&gt; 0.03 NDCG</p>
                        <p className="text-sm text-zinc-600">The typical minimum quality lift needed to justify the added operational cost of custom training over a strong base model.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-amber-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-amber-700 font-medium text-sm"><AlertTriangle className="w-4 h-4" /> Prerequisite</div>
                        <p className="text-2xl font-bold text-zinc-900 mb-2">Hybrid First</p>
                        <p className="text-sm text-zinc-600">Exhaust BM25 + zero-shot dense retrieval before writing any custom PyTorch loops. Most teams skip this and significantly overbuild.</p>
                    </div>
                </div>

                {/* Tip Box */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                        <strong>Chapter Context:</strong> Chapter 6 explained why semantic search helps with vocabulary mismatch. Chapter 7 extends that idea: semantic search only works as well as the embedding space reflects your domain. If your retrieval space was learned from internet text while your users search private enterprise docs, &quot;semantic&quot; may still not mean &quot;business-relevant.&quot;
                    </div>
                </div>
            </div>

            {/* 1. Executive Summary */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. Executive Summary</h2>

                <p className="text-foreground leading-relaxed">
                    General-purpose embedding models are surprisingly strong, which is exactly why many teams stop too early. They can give you a fast baseline for semantic search, FAQ retrieval, and recommendation, but they are not trained on your company vocabulary, your ranking objectives, or your users&apos; real query behavior.
                </p>

                <p className="text-foreground leading-relaxed">
                    Training is justified only when there is a meaningful gap between baseline quality and business need, and when you have enough domain-specific signal to close that gap. If your corpus contains proprietary jargon, asymmetric search behavior, uncommon product or entity names, or success criteria that differ from public benchmarks, then fine-tuning can materially improve retrieval quality. If your use case is generic and your evaluation set is small or noisy, training often adds complexity without enough upside.
                </p>

                <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-3 text-blue-900 font-bold">
                        <Lightbulb className="h-5 w-5" /> The Goal Is Geometry, Not General Intelligence
                    </div>
                    <p className="text-blue-800 text-sm leading-relaxed">
                        The practical goal is not to build a magical model. It is to shift the embedding space so that the neighbors your business cares about become geometrically close, while irrelevant but lexically similar items move farther away. Fine-tuning reshapes who lives near whom in vector space — nothing more, but nothing less.
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. The Core Problem */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. The Core Problem: Zero-Shot Models Plateau</h2>

                <p className="text-foreground leading-relaxed">
                    Modern embedding APIs and open models are trained on huge corpora of web text, QA pairs, and public retrieval datasets. That gives them broad language understanding, but broad is not the same as precise. In a real product, the hard queries are rarely generic. They involve internal acronyms, product names, issue codes, workflow conventions, or domain-specific intent that never appears in public training data.
                </p>

                <p className="text-foreground leading-relaxed">
                    Consider an internal company search system. Query: &quot;phoenix rollback checklist.&quot; Relevant document: &quot;Project Phoenix release recovery SOP.&quot; A general model understands &quot;rollback&quot; and &quot;checklist&quot; but does not know that &quot;Phoenix&quot; is a critical project codename rather than a city or a mythological bird. The zero-shot model might partially cluster the right concepts but not tightly enough to rank the recovery SOP above every generic rollback document in the corpus.
                </p>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            The Plateau Pattern
                        </h3>
                        <ol className="list-decimal pl-5 space-y-3 text-sm text-zinc-700">
                            <li><strong>Demo success:</strong> The baseline looks amazing on common queries and demo scenarios.</li>
                            <li><strong>Obvious handling:</strong> Standard semantic matches work flawlessly in testing.</li>
                            <li><strong>The tail fails:</strong> Domain-specific queries and long-tail intents remain weak in production.</li>
                            <li><strong>Trust breaks:</strong> Those tail failures are exactly where user trust and engagement degrades.</li>
                        </ol>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm">
                            <div className="font-bold text-red-800 mb-1">Domain Vocabulary Blindness</div>
                            <p className="text-red-700">The model tokenizes <code className="bg-red-100 px-1 rounded">ERR_AUTH_702</code> as subword pieces but doesn&apos;t map it close to the password-reset runbook users actually need to find.</p>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg text-sm">
                            <div className="font-bold text-orange-800 mb-1">Asymmetric Search Mismatch</div>
                            <p className="text-orange-700">A short query like &quot;vpn timeout mac&quot; expects a long 500-word troubleshooting article. The model must learn this asymmetric mapping that base training never provided.</p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 3. Where Off-the-Shelf Models Fail */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Where Off-the-Shelf Models Fail</h2>

                <p className="text-foreground leading-relaxed">
                    The plateau is not random. It appears in four recurring patterns that all stem from the gap between what the model was trained on and what your production system actually needs to do. Understanding which pattern you face shapes the training strategy you should pursue.
                </p>

                <div className="space-y-5">
                    <div className="border border-zinc-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-500" />
                            1. Domain Vocabulary and Entity Blindness
                        </h3>
                        <p className="text-sm text-zinc-700 leading-relaxed mb-3">
                            The most common failure is that the model does not know your important entities well enough. That can include product codes, feature names, internal team names, legal clauses, medical terminology, error signatures, and marketplace taxonomy. The model may tokenize these strings, but tokenization is not understanding. A model can process <code className="bg-zinc-100 px-1 rounded text-xs">ERR_AUTH_702</code> as subword pieces while still failing to map it close to the password-reset runbook users actually need.
                        </p>
                        <p className="text-sm text-zinc-500 italic">Symptom: searches for internal product names, codes, or jargon return generic, loosely related results.</p>
                    </div>

                    <div className="border border-zinc-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-500" />
                            2. Asymmetric Search Structure
                        </h3>
                        <p className="text-sm text-zinc-700 leading-relaxed mb-3">
                            Many general embedding models are trained on sentence-to-sentence similarity tasks. Production search is almost always asymmetric: queries are 2 to 8 words, messy, abbreviated, vague — while documents are 200 to 2,000 words, structured, formal, often repetitive. A user types &quot;vpn timeout mac&quot; and expects a long troubleshooting article with the right fix. The model must learn that a short fragment can still be a strong pointer to a much longer document. Fine-tuning teaches that asymmetric mapping directly through domain click pairs.
                        </p>
                        <p className="text-sm text-zinc-500 italic">Symptom: short tail queries fail to surface the long structured documents that would actually answer them.</p>
                    </div>

                    <div className="border border-zinc-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-500" />
                            3. Business Objective Mismatch
                        </h3>
                        <p className="text-sm text-zinc-700 leading-relaxed mb-3">
                            Public retrieval benchmarks optimize for generic relevance. Your system may care about conversion likelihood, resolution rate, policy compliance, freshness, coverage of eligible inventory, or correctness on exact entities. Those are fundamentally different objectives. If your product search needs &quot;available, in-stock, high-margin, region-eligible&quot; items, then pure semantic closeness is not enough. Training can make first-stage dense retrieval more aligned with documents that actually succeed later in the funnel.
                        </p>
                        <p className="text-sm text-zinc-500 italic">Symptom: high semantic similarity scores on benchmark but poor downstream conversion or task completion in production.</p>
                    </div>

                    <div className="border border-zinc-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-500" />
                            4. Behavioral Drift Over Time
                        </h3>
                        <p className="text-sm text-zinc-700 leading-relaxed mb-3">
                            Language changes. Catalogs change. User habits change. New features create new search terms. Enterprise systems accumulate new project names and workflows. A fixed public model cannot keep up with those shifts unless you adapt it or supplement it aggressively with lexical features. This is especially visible after product launches, taxonomy migrations, rebranding events, new regulatory programs, seasonal catalog changes, or internal org restructuring.
                        </p>
                        <p className="text-sm text-zinc-500 italic">Symptom: search quality slowly degrades after product changes even though the model hasn&apos;t changed at all.</p>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 4. Real ROI Case */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. The Real ROI Case for Training</h2>

                <p className="text-foreground leading-relaxed">
                    Quality gains only matter if they change outcomes. Training is worth it when better nearest neighbors create downstream business value. That value usually shows up through one of four specific improvement paths. Each maps a retrieval improvement to a concrete, measurable business effect.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Improvement Path</th>
                                <th className="text-left p-3 border-b font-semibold">Retrieval Effect</th>
                                <th className="text-left p-3 border-b font-semibold">Business Outcome</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-3 font-medium">Better recall</td>
                                <td className="p-3 text-zinc-600">More relevant candidates enter top-K</td>
                                <td className="p-3 text-zinc-600">Reranker has more chances to succeed; fewer zero-result sessions</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3 font-medium">Better precision</td>
                                <td className="p-3 text-zinc-600">Fewer obviously wrong results at top</td>
                                <td className="p-3 text-zinc-600">Higher trust and lower immediate reformulation rate</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3 font-medium">Tail performance</td>
                                <td className="p-3 text-zinc-600">Rare domain queries match correctly</td>
                                <td className="p-3 text-zinc-600">Fewer frustrating dead ends for power users and experts</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium">Domain grounding</td>
                                <td className="p-3 text-zinc-600">Important entities cluster tightly in vector space</td>
                                <td className="p-3 text-zinc-600">Higher task completion and fewer escalations to human support</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p className="text-foreground leading-relaxed">
                    Concrete examples: In support search, better retrieval lowers ticket deflection failure. In e-commerce, it increases add-to-cart from semantically phrased queries. In internal knowledge search, it reduces time-to-answer. In code or doc search, it improves retrieval of the exact fix or design note. The question is not whether training helps in theory — it is whether the lift in your system is large enough to justify the cost.
                </p>
            </section>

            <hr className="border-border" />

            {/* 5. Practical Decision Framework */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. A Practical Decision Framework</h2>

                <p className="text-foreground leading-relaxed">
                    The decision to train should be driven by a simple three-condition rule. Fine-tuning should usually happen only if all three are true simultaneously. If any one of these is missing, hybrid search with a strong base model is often the better move.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 p-5 rounded-xl text-sm">
                        <div className="font-bold text-green-900 mb-2">Condition 1</div>
                        <p className="text-green-800">The zero-shot baseline is <strong>materially below</strong> the quality bar — typically more than a 0.03 NDCG gap between current and target quality.</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-5 rounded-xl text-sm">
                        <div className="font-bold text-green-900 mb-2">Condition 2</div>
                        <p className="text-green-800">You have <strong>enough training signal</strong> to actually move the model — clicks, explicit labels, or sufficient synthetic data from your domain.</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-5 rounded-xl text-sm">
                        <div className="font-bold text-green-900 mb-2">Condition 3</div>
                        <p className="text-green-800">The quality lift is <strong>valuable enough</strong> to justify ongoing MLOps overhead: data pipelines, experiments, backfills, and drift monitoring.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mt-6">
                    <div>
                        <h3 className="text-xl font-bold mb-4">When You Probably Should NOT Train</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-zinc-200 rounded-lg">
                                <thead className="bg-zinc-50">
                                    <tr>
                                        <th className="text-left p-3 border-b font-semibold">Situation</th>
                                        <th className="text-left p-3 border-b font-semibold">Better Choice</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="p-3">Small, generic corpus</td>
                                        <td className="p-3 text-zinc-600">Strong base model</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-3">No labeled data or clicks</td>
                                        <td className="p-3 text-zinc-600">Hybrid BM25 + zero-shot</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-3">Exact match dominates</td>
                                        <td className="p-3 text-zinc-600">Lexical search first</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-3">Low engineering capacity</td>
                                        <td className="p-3 text-zinc-600">Managed embeddings API</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3">No benchmark yet</td>
                                        <td className="p-3 text-zinc-600">Build eval before training</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">When Training Is Worth Exploring</h3>
                        <ul className="space-y-2 text-sm text-zinc-700">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                Domain-specific terms dominate failure cases in your error analysis
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                The same bad query classes appear repeatedly in search logs
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                Enough click or label data exists for stable train/test splits
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                Business can benefit from even modest gains in top-10 quality
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                Corpus is large enough that semantic recall meaningfully matters
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                You already have a decent indexing and evaluation foundation
                            </li>
                        </ul>
                    </div>
                </div>

                <h3 className="text-xl font-bold mt-8">A Decision Workflow in Code</h3>
                <p className="text-foreground leading-relaxed mb-4">
                    This is not mathematical purity. The purpose is to force the team to compare expected lift against real operational cost before investing:
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">decision_matrix.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">should_train_embeddings</span><span className="text-zinc-300">(baseline_ndcg, target_ndcg, has_labels, query_failures, team_maturity):</span></div>
                            <div className="pl-4"><span className="text-zinc-300">gap = target_ndcg - baseline_ndcg</span></div>
                            <div className="pl-4 mt-2"><span className="text-pink-400">if</span><span className="text-zinc-300"> gap &lt;= </span><span className="text-orange-300">0.03</span><span className="text-zinc-300">:</span></div>
                            <div className="pl-8"><span className="text-pink-400">return</span><span className="text-green-300"> &quot;Probably not worth custom training yet&quot;</span></div>
                            <div className="pl-4 mt-2"><span className="text-pink-400">if</span><span className="text-zinc-300"> </span><span className="text-pink-400">not</span><span className="text-zinc-300"> has_labels:</span></div>
                            <div className="pl-8"><span className="text-pink-400">return</span><span className="text-green-300"> &quot;Collect click data or synthetic pairs first&quot;</span></div>
                            <div className="pl-4 mt-2"><span className="text-pink-400">if</span><span className="text-zinc-300"> query_failures &lt; </span><span className="text-orange-300">200</span><span className="text-zinc-300">:</span></div>
                            <div className="pl-8"><span className="text-pink-400">return</span><span className="text-green-300"> &quot;Build a larger error set before deciding&quot;</span></div>
                            <div className="pl-4 mt-2"><span className="text-pink-400">if</span><span className="text-zinc-300"> team_maturity == </span><span className="text-green-300">&quot;low&quot;</span><span className="text-zinc-300">:</span></div>
                            <div className="pl-8"><span className="text-pink-400">return</span><span className="text-green-300"> &quot;Prefer managed models or hybrid retrieval&quot;</span></div>
                            <div className="pl-4 mt-2"><span className="text-pink-400">return</span><span className="text-green-300"> &quot;Training is justified — proceed carefully&quot;</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 6. What Training Actually Changes */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">6. What Training Actually Changes</h2>

                <p className="text-foreground leading-relaxed">
                    A useful mental model is that fine-tuning edits local geometry. It does not suddenly make the model &quot;smart&quot; in a general sense. Instead, it changes who lives near whom in vector space. Before fine-tuning, a general model has organized the space according to public internet distributions. Fine-tuning shifts that organization toward your domain&apos;s relevance structure.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <h3 className="text-red-800 font-bold mb-4 text-lg">Before Fine-Tuning</h3>
                        <ul className="space-y-3 text-sm text-red-700">
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5 text-red-400 font-bold">✗</span>
                                &quot;refund dispute&quot; sits near generic payment-policy pages
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5 text-red-400 font-bold">✗</span>
                                &quot;phoenix rollback checklist&quot; sits near unrelated rollback docs
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5 text-red-400 font-bold">✗</span>
                                &quot;wireless earbuds for running&quot; sits near general headphone pages
                            </li>
                        </ul>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <h3 className="text-green-800 font-bold mb-4 text-lg">After Fine-Tuning</h3>
                        <ul className="space-y-3 text-sm text-green-700">
                            <li className="flex items-start gap-2">
                                <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-green-500" />
                                Refund escalation workflow moves closer to &quot;refund dispute&quot;
                            </li>
                            <li className="flex items-start gap-2">
                                <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-green-500" />
                                Project Phoenix recovery SOP moves closer to its specific queries
                            </li>
                            <li className="flex items-start gap-2">
                                <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-green-500" />
                                Running-focused earbuds cluster nearer to workout-intent queries
                            </li>
                        </ul>
                    </div>
                </div>

                <p className="text-foreground leading-relaxed">
                    The geometry shift is local. A well-tuned model improves the key neighborhoods without necessarily breaking unrelated ones. But this is why evaluation on slices matters so much: you must verify that fixing the domain tail did not damage general-purpose queries, head queries, or exact-match search behavior.
                </p>
            </section>

            <hr className="border-border" />

            {/* 7. Hidden Costs */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">7. The Hidden Costs of Training</h2>

                <p className="text-foreground leading-relaxed">
                    Teams usually think about GPU hours first, but that is rarely the largest cost. The real burden includes data cleaning pipelines, evaluation set creation, experiment tracking, index backfills whenever the model updates, serving versioning, monitoring for drift, and re-training costs as the corpus evolves. These all compound over the lifetime of the system.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-lg text-sm">
                        <div className="font-bold text-zinc-900 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" /> Catastrophic Forgetting
                        </div>
                        <p className="text-zinc-600">The model improves intensely on your domain but loses general language behavior. Mixing in some general-domain retrieval data during training helps preserve broader semantic behavior.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-lg text-sm">
                        <div className="font-bold text-zinc-900 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" /> Eval Leakage
                        </div>
                        <p className="text-zinc-600">Training and evaluation data overlap, producing fake inflated quality numbers offline. Proper split design by query family — not just random row splits — is critical to avoid this.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-lg text-sm">
                        <div className="font-bold text-zinc-900 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" /> Vector Mismatch
                        </div>
                        <p className="text-zinc-600">A trained model fails in production because inference chunking, normalization, or tokenization didn&apos;t match training. All pipelines must stay fully consistent across versions and deployments.</p>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <section>
                <KeyTakeaways takeaways={takeaways} />
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/evaluation" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.12 Evaluating Search Quality
                </Link>
                <Link href="/search/embedding-training/training-data" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    7.2 Training Data <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
