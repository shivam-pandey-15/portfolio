"use client";

import Link from "next/link";
import { Cpu, ArrowRight, ArrowLeft, Zap, Target, Gauge, Split } from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Bi-Encoders for Speed", description: "Encode query and documents independently → precompute all document vectors offline. Search is a single nearest-neighbor lookup. Handles millions of candidates in milliseconds." },
    { title: "Cross-Encoders for Accuracy", description: "Process query and document jointly through full cross-attention. 10-20% more accurate than bi-encoders but 1000x slower — only viable for reranking the top 20-100 candidates." },
    { title: "Retrieve-Then-Rerank Pipeline", description: "The standard production pattern: bi-encoder retrieves top 100 candidates in <5ms, then cross-encoder reranks those 100 for precise ordering. Combines the speed of one with the accuracy of the other." },
    { title: "ColBERT: The Middle Ground", description: "Late interaction stores per-token embeddings and computes MaxSim at search time. 2-5x slower than bi-encoders but much more accurate, while being 100x faster than cross-encoders." },
];

export default function EncodersPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.3</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Bi-Encoder vs Cross-Encoder</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            The fundamental speed-accuracy tradeoff in neural retrieval. Bi-encoders process queries
                            and documents independently for speed; cross-encoders process them jointly for accuracy.
                            The best systems use both in a retrieve-then-rerank pipeline.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm"><Zap className="w-4 h-4" /> Bi-Encoder Speed</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">&lt;5ms</p>
                        <p className="text-sm text-zinc-600">Single vector lookup against precomputed document embeddings.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><Target className="w-4 h-4" /> Cross-Encoder Gain</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">+10-20%</p>
                        <p className="text-sm text-zinc-600">Accuracy improvement from joint query-document processing.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-purple-700 font-medium text-sm"><Gauge className="w-4 h-4" /> ColBERT Sweet Spot</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">100x</p>
                        <p className="text-sm text-zinc-600">Faster than cross-encoders while retaining most of their accuracy.</p>
                    </div>
                </div>
            </div>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. The Independence Question</h2>
                <p className="text-foreground leading-relaxed">
                    The core architectural decision in neural retrieval is whether to process the query and document
                    <strong> independently</strong> (bi-encoder) or <strong>jointly</strong> (cross-encoder). This choice
                    determines everything: latency, accuracy, precomputation ability, and what scale you can serve.
                </p>
                <p className="text-foreground leading-relaxed">
                    A <strong>bi-encoder</strong> runs each input through a separate transformer, producing independent
                    embedding vectors. The query vector is compared to precomputed document vectors using cosine similarity.
                    Because document embeddings are computed offline, search-time cost is just one transformer forward pass
                    (for the query) plus a nearest-neighbor lookup — milliseconds regardless of corpus size.
                </p>
                <p className="text-foreground leading-relaxed">
                    A <strong>cross-encoder</strong> concatenates query and document into a single input and passes it
                    through one transformer. Every query token can attend to every document token through full cross-attention,
                    enabling fine-grained matching that bi-encoders miss. But this means you must run a full transformer
                    forward pass for <em>every</em> query-document pair — making it 1000x slower than a bi-encoder for the
                    same corpus size.
                </p>

                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># Architecture comparison</div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <div className="text-green-400 font-bold">Bi-Encoder (SBERT)</div>
                            <div className="text-zinc-300">Query  → Transformer → vec_q [768]</div>
                            <div className="text-zinc-300">Doc    → Transformer → vec_d [768]</div>
                            <div className="text-zinc-300">Score  = cosine(vec_q, vec_d)</div>
                            <div className="text-zinc-500 mt-2">✅ Precompute doc vecs offline</div>
                            <div className="text-zinc-500">✅ Search 1B docs in &lt;5ms</div>
                            <div className="text-zinc-500">❌ No cross-attention → misses nuance</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-blue-400 font-bold">Cross-Encoder (BERT reranker)</div>
                            <div className="text-zinc-300">[CLS] query [SEP] doc → Transformer</div>
                            <div className="text-zinc-300">Score = classifier(CLS_output)</div>
                            <div className="text-zinc-500 mt-2">✅ Full cross-attention → best accuracy</div>
                            <div className="text-zinc-500">❌ Must run for every pair at query time</div>
                            <div className="text-zinc-500">❌ Can only score ~20-100 candidates</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. The Retrieve-Then-Rerank Pipeline</h2>
                <p className="text-foreground leading-relaxed">
                    The production answer to the speed-accuracy tradeoff is <strong>retrieve-then-rerank</strong>: use a
                    fast bi-encoder to retrieve the top 100 candidates from the full corpus (milliseconds), then use a
                    slow-but-accurate cross-encoder to rerank those 100 candidates into the optimal order (~50ms for 100
                    pairs on GPU). Total latency: ~55ms with the accuracy of a cross-encoder.
                </p>
                <p className="text-foreground leading-relaxed">
                    This pipeline is the standard architecture at Google, Bing, Amazon, and virtually every production
                    search system using neural retrieval. The bi-encoder handles scale (searching billions), while the
                    cross-encoder handles precision (ordering the final results perfectly).
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. ColBERT: Late Interaction</h2>
                <p className="text-foreground leading-relaxed">
                    ColBERT (Khattab &amp; Zaharia, 2020) introduces a <strong>late interaction</strong> architecture
                    that sits between bi-encoders and cross-encoders. Instead of compressing each input to a single
                    vector, ColBERT stores <em>per-token</em> embeddings and computes a MaxSim operation at search time:
                    for each query token, find its maximum similarity to any document token, then sum these maxima.
                </p>
                <p className="text-foreground leading-relaxed">
                    This preserves fine-grained token-level matching (like cross-encoders) while still allowing document
                    embeddings to be precomputed (like bi-encoders). The tradeoff is storage: instead of one 768-dim vector
                    per document, you store ~100 vectors (one per token). This 100x storage increase enables
                    accuracy close to cross-encoders at speeds close to bi-encoders.
                </p>
            </section>

            <KeyTakeaways takeaways={takeaways} />

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
