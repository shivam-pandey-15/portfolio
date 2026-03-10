"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, ArrowLeft, XCircle, Fingerprint, Globe, Ban, TrendingDown } from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Failures Are Silent", description: "Unlike keyword search (zero results = obvious failure), semantic search always returns results. The danger is returning confidently wrong results that users trust. Monitor for relevance degradation, not just zero-results." },
    { title: "Exact Match Is the Achilles' Heel", description: "Embeddings compress 'iPhone 15 Pro Max 256GB Blue' and '512GB Black' into nearly identical vectors. Product codes, case numbers, and error codes should always go through keyword search, never pure semantic." },
    { title: "Negation Is Invisible", description: "Bi-encoders produce nearly identical embeddings for 'hotels with pool' and 'hotels without pool' (cosine ≈ 0.95). Cross-encoder reranking and boolean filters are the only reliable mitigations." },
    { title: "Domain Mismatch Causes Systematic Errors", description: "General models misinterpret 'consideration' (legal: contract element), 'positive' (medical: test result), and 'call' (finance: option type). Fine-tuning on 1K-5K domain pairs is essential for specialized applications." },
];

export default function FailuresPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.8</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">When Semantic Search Fails</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            Semantic search is not a silver bullet. It has systematic failure modes that are insidious precisely
                            because the system always returns results — they&apos;re just confidently wrong.
                        </p>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-red-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-red-700 font-medium text-sm"><XCircle className="w-4 h-4" /> Failure Modes</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">7</p>
                        <p className="text-sm text-zinc-600">Distinct failure patterns catalogued in this chapter.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-amber-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-amber-700 font-medium text-sm"><Fingerprint className="w-4 h-4" /> Exact Match Loss</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">~0.98</p>
                        <p className="text-sm text-zinc-600">Cosine similarity between &quot;256GB Blue&quot; and &quot;512GB Black&quot; iPhone variants.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-purple-700 font-medium text-sm"><Ban className="w-4 h-4" /> Negation Similarity</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">0.95</p>
                        <p className="text-sm text-zinc-600">&quot;Hotels with pool&quot; ≈ &quot;Hotels without pool&quot; in embedding space.</p>
                    </div>
                </div>
            </div>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. Exact Match Requirements</h2>
                <p className="text-foreground leading-relaxed">
                    Embeddings compress meaning into fixed-dimensional vectors, and in doing so, they lose
                    <strong> surface-level precision</strong>. Two strings that look almost identical to a human can produce
                    effectively identical embeddings, even when the difference matters enormously. A search for &quot;SKU-2847-B&quot;
                    produces a semantically meaningless embedding that might match completely unrelated products.
                </p>
                <p className="text-foreground leading-relaxed">
                    This is prevalent in e-commerce (exact SKU/model/color), legal (case numbers, statute references),
                    engineering (error codes, configuration parameters), and medical (drug names — metformin vs metoprolol
                    produce dangerously similar embeddings). The mitigation is always <strong>hybrid search</strong>: combine
                    semantic retrieval with exact-match keyword retrieval and structured metadata filters.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Negation and Logic</h2>
                <p className="text-foreground leading-relaxed">
                    Bi-encoders systematically fail to handle negation. The word &quot;not&quot; has minimal impact on the
                    resulting vector because it&apos;s just one token averaged into the mean-pooled representation. &quot;Hotels
                    with pool&quot; and &quot;hotels without pool&quot; produce cosine similarity ≈ 0.95 — the model barely
                    registers the logical flip.
                </p>
                <p className="text-foreground leading-relaxed">
                    This happens because bi-encoders are trained for <strong>topical similarity</strong>, not logical
                    structure. Cross-encoder reranking handles negation much better because full cross-attention allows
                    &quot;not&quot; in the query to interact with &quot;pool&quot; in the document. For hard negation,
                    convert to structured boolean filters: &quot;hotels without pool&quot; → semantic: &quot;hotels&quot;
                    + filter: pool=false.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Domain Mismatch</h2>
                <p className="text-foreground leading-relaxed">
                    Most embedding models are trained on general web text. When applied to specialized domains, they
                    misinterpret terminology: &quot;consideration&quot; means thoughtfulness to the model but means
                    &quot;something exchanged in a contract&quot; in law. &quot;Positive&quot; means optimistic but
                    means a diagnostic result in medicine.
                </p>
                <p className="text-foreground leading-relaxed">
                    The fix is <strong>fine-tuning</strong> on domain-specific data or using domain-specific models
                    (PubMedBERT, LegalBERT, FinBERT). Even 1,000 domain pairs can significantly improve results.
                    Hybrid search also helps since BM25 matches the literal term without trying to interpret it.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Other Failure Modes</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg">📉 Scalability Degradation</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            At 100M+ vectors, ANN recall degrades even with same parameters.
                            The curse of dimensionality makes all distances converge, requiring
                            parameter retuning and sharding as data grows.
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg">📝 Short Queries</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            1-2 word queries like &quot;python&quot; or &quot;crash&quot; provide too little
                            context for disambiguation. The embedding sits in a vague region between
                            all possible meanings. Favor BM25 weight for short queries.
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg">📦 Information Compression</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            A 768-dim vector cannot preserve every fact from a long document.
                            Specific numbers, measurements, and exact phrases don&apos;t survive
                            the compression. Use structured metadata for numerical attributes.
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg">🎯 Training Bias</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            Models inherit biases from training data: language bias (English-dominant),
                            recency bias (can&apos;t know about 2024 events), and popularity bias
                            (Python has better embeddings than Haskell).
                        </p>
                    </div>
                </div>
            </section>

            <KeyTakeaways takeaways={takeaways} />

            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/hybrid-ranking" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.7 Hybrid Ranking
                </Link>
                <Link href="/search/vector-search/cost" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.9 Cost at Scale <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
