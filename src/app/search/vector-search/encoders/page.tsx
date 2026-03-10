"use client";

import Link from "next/link";
import {
    Cpu, ArrowRight, ArrowLeft, Zap, Target, Gauge, Split,
    AlertTriangle, BookOpen, GitMerge, TrendingUp, Scale,
    Network, Binary
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Bi-Encoders for Speed", description: "Encode query and documents independently → precompute all document vectors offline. Search is a single ANN lookup. Handles billions of candidates in <15ms. The entire first-stage retrieval of every major search engine." },
    { title: "Cross-Encoders for Accuracy", description: "Process query and document jointly through full cross-attention. 10-20% more accurate than bi-encoders on hard queries (negation, ambiguity) but 1000x slower — only viable for reranking the top 20-100 candidates." },
    { title: "Retrieve-Then-Rerank Pipeline", description: "The industry standard: bi-encoder retrieves top 100 candidates (~15ms), cross-encoder reranks those 100 (~150ms). Total ~165ms. Used by Google, Bing, Amazon, and virtually all modern search systems." },
    { title: "ColBERT: Late Interaction Middle Ground", description: "Stores per-token embeddings and computes MaxSim at search time. Pre-computable like bi-encoders but retains token-level matching like cross-encoders. The tradeoff is ~32x more storage per document." },
    { title: "Knowledge Distillation Closes the Gap", description: "Train a bi-encoder to mimic cross-encoder judgments. The student bi-encoder recovers ~50-90% of the accuracy gap while keeping full pre-computation benefits. A key technique for production quality." },
];

export default function EncodersPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero Section */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.3</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Bi-Encoder vs Cross-Encoder</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            The critical architectural decision in neural search: process query and document independently
                            (fast, scalable) or jointly (accurate, slow). This distinction fundamentally shapes how a
                            search system is built, what hardware it needs, and what quality users experience.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm"><Zap className="w-4 h-4" /> Bi-Encoder Latency</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">~15ms</p>
                        <p className="text-sm text-zinc-600">Query encode (10ms) + ANN search (5ms). Regardless of corpus size.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><Target className="w-4 h-4" /> Cross-Encoder Gain</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">MRR +0.06</p>
                        <p className="text-sm text-zinc-600">MS MARCO: bi-encoder MRR@10 ≈ 0.33-0.38, cross-encoder ≈ 0.39-0.42.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-purple-700 font-medium text-sm"><Gauge className="w-4 h-4" /> Pipeline Total</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">~165ms</p>
                        <p className="text-sm text-zinc-600">Retrieve-then-rerank: 15ms retrieval + 150ms reranking = near-instant.</p>
                    </div>
                </div>
            </div>

            {/* 1. Bi-Encoder Architecture */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. Bi-Encoder (Dual Encoder)</h2>
                <p className="text-foreground leading-relaxed">
                    A bi-encoder processes two inputs <strong>independently</strong> through separate (or shared) encoder
                    networks. The query and document never &quot;see&quot; each other during encoding — each is transformed
                    into a fixed-size vector in isolation, and similarity is measured post-hoc using cosine similarity or
                    dot product. This separation is both the defining feature and the key advantage.
                </p>

                <p className="text-foreground leading-relaxed">
                    Because the document encoder runs independently of any query, document embeddings can be
                    <strong> pre-computed once and stored</strong>. At query time, only the query needs encoding (a single
                    forward pass, ~5-10ms), then the pre-computed document vectors are searched using an ANN index.
                    Consider a corpus of 10M documents: encode all 10M offline (takes hours on GPU), store in HNSW,
                    and search in ~15ms per query regardless of corpus size.
                </p>

                <div className="bg-zinc-900 p-8 rounded-xl font-mono text-sm border border-zinc-800">
                    <div className="text-zinc-400 mb-6"># Bi-Encoder architecture</div>
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex w-full justify-between items-start gap-8">
                            {/* Query Path */}
                            <div className="flex-1 flex flex-col items-center gap-4">
                                <div className="bg-blue-950/50 border border-blue-900/50 text-blue-300 px-4 py-3 rounded-lg text-center w-full">
                                    <div className="text-xs text-blue-400/70 mb-1 uppercase tracking-wider">Query</div>
                                    &quot;cheap flights to NYC&quot;
                                </div>
                                <div className="text-zinc-600 text-lg">↓</div>
                                <div className="bg-zinc-800 border border-zinc-700 text-yellow-400 px-6 py-3 rounded-lg shadow-lg w-full text-center">
                                    [Encoder A]
                                </div>
                                <div className="text-zinc-600 text-lg">↓</div>
                                <div className="bg-blue-950/30 border border-blue-900/30 text-blue-300 px-4 py-2 rounded font-mono text-xs w-full text-center">
                                    query_vector [768]
                                </div>
                            </div>

                            {/* Document Path */}
                            <div className="flex-1 flex flex-col items-center gap-4">
                                <div className="bg-green-950/50 border border-green-900/50 text-green-300 px-4 py-3 rounded-lg text-center w-full">
                                    <div className="text-xs text-green-400/70 mb-1 uppercase tracking-wider">Document</div>
                                    &quot;Budget airline tickets New York&quot;
                                </div>
                                <div className="text-zinc-600 text-lg">↓</div>
                                <div className="bg-zinc-800 border border-zinc-700 text-yellow-400 px-6 py-3 rounded-lg shadow-lg w-full text-center">
                                    [Encoder B]
                                </div>
                                <div className="text-zinc-600 text-lg">↓</div>
                                <div className="bg-green-950/30 border border-green-900/30 text-green-300 px-4 py-2 rounded font-mono text-xs w-full text-center">
                                    doc_vector [768]
                                </div>
                            </div>
                        </div>

                        {/* Similarity */}
                        <div className="w-full flex flex-col items-center -mt-2">
                            <div className="w-[50%] h-8 border-l-2 border-r-2 border-b-2 border-zinc-700 rounded-b-xl"></div>
                            <div className="text-zinc-600 text-lg leading-none -mt-1">↓</div>
                            <div className="bg-yellow-950/30 border border-yellow-900/50 text-yellow-300 px-6 py-3 rounded-xl mt-2 z-10 w-fit">
                                cosine_similarity(q, d) = 0.87
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">bi_encoder_search.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">bi_encoder_search</span><span className="text-zinc-300">(query, model, ann_index, top_k=10):</span></div>
                            <div className="pl-4"><span className="text-zinc-500">&quot;&quot;&quot;</span></div>
                            <div className="pl-4"><span className="text-zinc-500">Bi-encoder: encode query and documents independently.</span></div>
                            <div className="pl-4"><span className="text-zinc-500">Documents are pre-encoded offline — this is where the speed comes from.</span></div>
                            <div className="pl-4"><span className="text-zinc-500">&quot;&quot;&quot;</span></div>
                            <div className="pl-4"><span className="text-zinc-500"># Step 1: Encode query at search time (~5-10ms)</span></div>
                            <div className="pl-4"><span className="text-zinc-300">query_vec = model.encode(query)</span><span className="text-zinc-500">  # [768]</span></div>
                            <div className="pl-4"></div>
                            <div className="pl-4"><span className="text-zinc-500"># Step 2: ANN search against pre-encoded doc vectors (~1-5ms)</span></div>
                            <div className="pl-4"><span className="text-zinc-300">results = ann_index.search(query_vec, top_k)</span></div>
                            <div className="pl-4"></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> results</span><span className="text-zinc-500">  # Total: ~10-15ms for millions of documents</span></div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Feature</th>
                                <th className="text-left p-3 border-b font-semibold">Benefit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-medium">Pre-computation</td><td className="p-3">Document vectors computed offline once → query-time cost is minimal</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Scalability</td><td className="p-3">Search billions of documents in &lt;10ms using ANN indexes</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Caching</td><td className="p-3">Frequently repeated queries can cache their query vectors</td></tr>
                            <tr><td className="p-3 font-medium">Independence</td><td className="p-3">New documents indexed without re-encoding existing vectors</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-red-800 mb-2">The Information Bottleneck</div>
                    <p className="text-red-700">
                        The fundamental weakness of bi-encoders: the entire meaning of a query or document is compressed
                        into a single fixed-size vector (768 floats = 3KB). This compression is inherently lossy.
                        <strong> &quot;Not available in blue&quot;</strong> and <strong>&quot;available in blue&quot;</strong>
                        produce nearly identical embeddings. A 10-page report gets the same 768 floats as a 2-sentence tweet.
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. Cross-Encoder */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Cross-Encoder Architecture</h2>
                <p className="text-foreground leading-relaxed">
                    A cross-encoder processes query and document <strong>jointly</strong> in a single transformer pass. The
                    two inputs are concatenated with a separator token and fed through the model together, allowing full
                    cross-attention between all tokens from both inputs across all 12 transformer layers.
                </p>

                <p className="text-foreground leading-relaxed">
                    Every token in the query can <strong>attend to</strong> every token in the document. The model learns
                    complex patterns: &quot;the query asks about price (&apos;cheap&apos;) and the document mentions price
                    (&apos;budget&apos;)&quot; or &quot;the query mentions &apos;NYC&apos; and the document says &apos;New
                    York.&apos;&quot; These token-level interactions produce the cross-encoder&apos;s superior accuracy.
                </p>

                <div className="bg-zinc-900 p-8 rounded-xl font-mono text-sm border border-zinc-800">
                    <div className="text-zinc-400 mb-6"># Cross-Encoder architecture</div>
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-blue-950/20 border border-blue-900/30 text-blue-300 px-6 py-4 rounded-lg text-center w-full">
                            <span className="text-zinc-500">[CLS]</span> cheap flights to NYC <span className="text-zinc-500">[SEP]</span> Budget airline tickets New York <span className="text-zinc-500">[EOS]</span>
                        </div>
                        <div className="text-zinc-600 text-lg">↓</div>
                        <div className="bg-zinc-800 border border-zinc-700 text-yellow-400 px-8 py-4 rounded-xl shadow-lg w-full max-w-md text-center">
                            <div className="font-bold text-base mb-1">[Single Transformer]</div>
                            <div className="text-zinc-400 text-xs font-sans">(12 layers, full cross-attention between ALL tokens)</div>
                        </div>
                        <div className="text-zinc-600 text-lg">↓</div>
                        <div className="bg-green-950/30 border border-green-900/50 text-green-400 px-8 py-3 rounded-xl text-lg font-bold shadow-lg">
                            relevance_score = 0.92
                        </div>
                    </div>
                </div>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">cross_encoder_score.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">from</span><span className="text-zinc-300"> transformers </span><span className="text-pink-400">import</span><span className="text-zinc-300"> AutoModelForSequenceClassification, AutoTokenizer</span></div>
                            <div className="mt-1"><span className="text-zinc-300">model = AutoModelForSequenceClassification.from_pretrained(</span></div>
                            <div className="pl-4"><span className="text-green-300">&apos;cross-encoder/ms-marco-MiniLM-L-6-v2&apos;</span><span className="text-zinc-300">)</span></div>
                            <div className="mt-1"><span className="text-pink-400">def</span> <span className="text-yellow-300">cross_encoder_score</span><span className="text-zinc-300">(query, document):</span></div>
                            <div className="pl-4"><span className="text-zinc-500">&quot;&quot;&quot;Must be computed for EVERY query-document pair. No pre-computation.&quot;&quot;&quot;</span></div>
                            <div className="pl-4"><span className="text-zinc-300">inputs = tokenizer(query, document, return_tensors=</span><span className="text-green-300">&apos;pt&apos;</span><span className="text-zinc-300">,</span></div>
                            <div className="pl-20"><span className="text-zinc-300">truncation=</span><span className="text-orange-300">True</span><span className="text-zinc-300">, max_length=</span><span className="text-orange-300">512</span><span className="text-zinc-300">)</span></div>
                            <div className="pl-4"><span className="text-zinc-300">score = model(**inputs).logits[</span><span className="text-orange-300">0</span><span className="text-zinc-300">]</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> score.item()</span></div>
                            <div className="mt-2"><span className="text-zinc-500"># 1000 candidates × 50ms = 50 seconds ← too slow for retrieval</span></div>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800">Why Cross-Encoders Win on Hard Queries</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl space-y-2">
                        <h4 className="font-bold text-blue-800">Handling Negation</h4>
                        <p className="text-sm text-blue-700">&quot;Hotels with a pool&quot; vs &quot;Hotels without a pool&quot; — cross-encoder sees &quot;with&quot; and &quot;without&quot; in direct attention with &quot;pool.&quot; Bi-encoder produces nearly identical vectors.</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-5 rounded-xl space-y-2">
                        <h4 className="font-bold text-green-800">Resolving Ambiguity</h4>
                        <p className="text-sm text-green-700">For &quot;Paris Hilton,&quot; the cross-encoder looks at the document to determine if it&apos;s about the celebrity or a hotel in Paris. Bi-encoder commits to one interpretation.</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 p-5 rounded-xl space-y-2">
                        <h4 className="font-bold text-purple-800">Question-Answer Alignment</h4>
                        <p className="text-sm text-purple-700">&quot;Who invented the telephone?&quot; + &quot;Bell patented the telephone in 1876&quot; — cross-encoder determines this directly answers the question. Bi-encoder knows both are about telephones.</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl space-y-2">
                        <h4 className="font-bold text-amber-800">Comparative Context</h4>
                        <p className="text-sm text-amber-700">&quot;Is Python faster than Java?&quot; — cross-encoder distinguishes a comparative article (relevant) from one that merely mentions both languages (not relevant).</p>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 3. Head-to-Head Comparison */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Head-to-Head Comparison</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Criterion</th>
                                <th className="text-left p-3 border-b font-semibold">Bi-Encoder</th>
                                <th className="text-left p-3 border-b font-semibold">Cross-Encoder</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-medium">Encoding</td><td className="p-3">Independent (query and doc never interact)</td><td className="p-3">Joint (full cross-attention)</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Pre-computation</td><td className="p-3 text-green-700">✅ Yes (offline)</td><td className="p-3 text-red-700">❌ No (must process pairs at query time)</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Query latency (1M docs)</td><td className="p-3">~10-15ms total</td><td className="p-3">~50ms × 1M = impossible</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Scalability</td><td className="p-3">Billions via ANN</td><td className="p-3">Hundreds (practical limit)</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">MS MARCO MRR@10</td><td className="p-3">0.33-0.38</td><td className="p-3 font-medium text-green-700">0.39-0.42</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Negation handling</td><td className="p-3 text-red-600">Poor</td><td className="p-3 text-green-700">Excellent</td></tr>
                            <tr><td className="p-3 font-medium">Use case</td><td className="p-3">First-stage retrieval</td><td className="p-3">Second-stage reranking</td></tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-foreground leading-relaxed">
                    The accuracy gap may look small in aggregate metrics, but it&apos;s concentrated in the <strong>hardest
                    queries</strong> — exactly the ones where user satisfaction matters most. On simple queries, both approaches
                    perform similarly. On ambiguous, nuanced, or complex queries, cross-encoders substantially outperform.
                </p>
            </section>

            <hr className="border-border" />

            {/* 4. The Production Pipeline */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. The Production Pipeline: Retrieve-Then-Rerank</h2>
                <p className="text-foreground leading-relaxed">
                    Understanding the tradeoffs above leads to an elegant solution: use <strong>both</strong> architectures
                    in a cascade. The bi-encoder handles the computationally hard part (searching millions of documents),
                    and the cross-encoder handles the quality-critical part (fine-grained ranking of the top candidates).
                </p>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-6 rounded-xl">
                    <h3 className="font-bold text-green-800 mb-4 text-lg">Two-Stage Pipeline</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white border border-green-200 p-4 rounded-lg">
                            <div className="font-bold text-green-700 mb-2">Stage 1: Bi-Encoder Retrieval</div>
                            <div className="space-y-1 text-sm text-green-600">
                                <p>Search 10M docs → Top 100 candidates</p>
                                <p>Latency: ~10-15ms</p>
                                <p>Method: encode query + HNSW search</p>
                                <p>Goal: 95-98% recall@100</p>
                            </div>
                        </div>
                        <div className="bg-white border border-green-200 p-4 rounded-lg">
                            <div className="font-bold text-green-700 mb-2">Stage 2: Cross-Encoder Reranking</div>
                            <div className="space-y-1 text-sm text-green-600">
                                <p>Re-score 100 candidates → Top 10</p>
                                <p>Latency: ~150-200ms (100 × ~1.5ms GPU)</p>
                                <p>Method: joint encoding per pair</p>
                                <p>Goal: Optimal ordering of final results</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-green-700">
                        <strong>Total:</strong> ~15ms + ~150ms = ~165ms — well within the &lt;200ms threshold users perceive
                        as &quot;instant.&quot; Quality approaches what you&apos;d get running the cross-encoder over all 10M documents.
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. Knowledge Distillation */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. Knowledge Distillation</h2>
                <p className="text-foreground leading-relaxed">
                    A powerful technique: <strong>train the bi-encoder to mimic the cross-encoder&apos;s judgments</strong>.
                    Score training pairs with the cross-encoder (teacher), then train the bi-encoder (student) to produce
                    embeddings whose cosine similarity matches the teacher&apos;s relevance scores. This produces bi-encoders
                    that are significantly better than those trained only on labeled data, because the cross-encoder provides
                    rich, nuanced relevance signals beyond simple binary labels.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">distillation.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-zinc-500"># Step 1: Score training pairs with cross-encoder (teacher)</span></div>
                            <div><span className="text-zinc-300">teacher_scores = []</span></div>
                            <div><span className="text-pink-400">for</span><span className="text-zinc-300"> query, doc </span><span className="text-pink-400">in</span><span className="text-zinc-300"> training_pairs:</span></div>
                            <div className="pl-4"><span className="text-zinc-300">score = cross_encoder_score(query, doc)</span></div>
                            <div className="pl-4"><span className="text-zinc-300">teacher_scores.append(score)</span></div>
                            <div className="mt-2"><span className="text-zinc-500"># Step 2: Train bi-encoder (student) to match teacher scores</span></div>
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">distillation_loss</span><span className="text-zinc-300">(bi_encoder, query, doc, teacher_score):</span></div>
                            <div className="pl-4"><span className="text-zinc-300">q_vec = bi_encoder.encode(query)</span></div>
                            <div className="pl-4"><span className="text-zinc-300">d_vec = bi_encoder.encode(doc)</span></div>
                            <div className="pl-4"><span className="text-zinc-300">student_score = cosine_similarity(q_vec, d_vec)</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> MSE(student_score, teacher_score)</span></div>
                            <div className="mt-2"><span className="text-zinc-500"># Result: bi-encoder with ~90-95% of cross-encoder accuracy</span></div>
                            <div><span className="text-zinc-500"># while retaining full pre-computation benefits</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 6. ColBERT: Late Interaction */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">6. ColBERT: The Late Interaction Middle Ground</h2>
                <p className="text-foreground leading-relaxed">
                    ColBERT (Khattab &amp; Zaharia, 2020) introduces <strong>late interaction</strong>: encode query and
                    document independently (like a bi-encoder), but keep <em>all token embeddings</em> instead of compressing
                    to a single vector. At search time, compute MaxSim: for each query token, find its maximum similarity to
                    any document token, then sum these maxima.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">colbert_maxsim.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-zinc-500"># ColBERT: keep ALL token embeddings (not just one vector)</span></div>
                            <div><span className="text-zinc-300">query_tokens = model.encode_query(</span><span className="text-green-300">&quot;cheap flights NYC&quot;</span><span className="text-zinc-300">)</span><span className="text-zinc-500">    # [5 × 128]</span></div>
                            <div><span className="text-zinc-300">doc_tokens   = model.encode_doc(</span><span className="text-green-300">&quot;Budget airline tickets&quot;</span><span className="text-zinc-300">)</span><span className="text-zinc-500"> # [4 × 128]</span></div>
                            <div className="mt-1"><span className="text-pink-400">def</span> <span className="text-yellow-300">maxsim</span><span className="text-zinc-300">(query_tokens, doc_tokens):</span></div>
                            <div className="pl-4"><span className="text-zinc-500">&quot;&quot;&quot;For each query token, find max-similarity doc token. Sum.&quot;&quot;&quot;</span></div>
                            <div className="pl-4"><span className="text-zinc-300">score = </span><span className="text-orange-300">0</span></div>
                            <div className="pl-4"><span className="text-pink-400">for</span><span className="text-zinc-300"> q_tok </span><span className="text-pink-400">in</span><span className="text-zinc-300"> query_tokens:</span></div>
                            <div className="pl-8"><span className="text-zinc-300">max_sim = </span><span className="text-yellow-300">max</span><span className="text-zinc-300">(cosine_sim(q_tok, d_tok) </span><span className="text-pink-400">for</span><span className="text-zinc-300"> d_tok </span><span className="text-pink-400">in</span><span className="text-zinc-300"> doc_tokens)</span></div>
                            <div className="pl-8"><span className="text-zinc-300">score += max_sim</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> score</span></div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Approach</th>
                                <th className="text-left p-3 border-b font-semibold">Pre-compute?</th>
                                <th className="text-left p-3 border-b font-semibold">Token Interaction</th>
                                <th className="text-left p-3 border-b font-semibold">Accuracy</th>
                                <th className="text-left p-3 border-b font-semibold">Storage</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-medium">Bi-encoder</td><td className="p-3 text-green-700">✅ fully</td><td className="p-3">None</td><td className="p-3">Good</td><td className="p-3">1 vector/doc</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">ColBERT</td><td className="p-3 text-green-700">✅ tokens</td><td className="p-3">Late (MaxSim)</td><td className="p-3 text-green-700">Very good</td><td className="p-3">N_tokens vectors/doc</td></tr>
                            <tr><td className="p-3 font-medium">Cross-encoder</td><td className="p-3 text-red-700">❌ none</td><td className="p-3">Full attention</td><td className="p-3 font-medium text-green-700">Best</td><td className="p-3">N/A (no vectors)</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 7. Choosing the Right Architecture */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">7. Choosing the Right Architecture</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 border border-green-200 p-6 rounded-xl space-y-3">
                        <h3 className="font-bold text-lg text-green-800">Bi-Encoder Alone</h3>
                        <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                            <li>Need sub-10ms latency</li>
                            <li>Corpus &gt;100M documents</li>
                            <li>Moderate accuracy requirements</li>
                            <li>No GPU budget for reranking</li>
                        </ul>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl space-y-3">
                        <h3 className="font-bold text-lg text-blue-800">Bi-Encoder + Cross-Encoder</h3>
                        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                            <li>Can tolerate ~200ms latency</li>
                            <li>Hard queries matter (e-commerce, legal)</li>
                            <li>Have GPU capacity for reranking</li>
                            <li>Corpus &gt;1M documents</li>
                        </ul>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl space-y-3">
                        <h3 className="font-bold text-lg text-purple-800">Cross-Encoder Alone</h3>
                        <ul className="text-sm text-purple-700 space-y-1 list-disc list-inside">
                            <li>Corpus &lt;10K documents</li>
                            <li>Can afford O(N) scoring per query</li>
                            <li>Maximum accuracy critical (medical)</li>
                        </ul>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl space-y-3">
                        <h3 className="font-bold text-lg text-amber-800">ColBERT</h3>
                        <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
                            <li>Need bi-encoder speed + better accuracy</li>
                            <li>Have storage budget for ~32x more per doc</li>
                            <li>Fine-grained relevance distinctions</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/embeddings" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.2 Embeddings 101
                </Link>
                <Link href="/search/vector-search/indexing" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.4 Vector Indexing <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
