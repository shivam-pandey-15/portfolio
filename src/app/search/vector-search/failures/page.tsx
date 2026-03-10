"use client";

import Link from "next/link";
import {
    AlertTriangle, ArrowRight, ArrowLeft, Zap, Shield,
    Search, Eye, Globe, Ban, TrendingDown,
    MessageSquare, Database
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Failures Are Silent, Not Obvious", description: "Unlike keyword search (zero results = obvious failure), semantic search always returns something. The danger: it returns confidently wrong results that users trust. You can't detect failures without evaluation." },
    { title: "Exact Match Is the Achilles' Heel", description: "SKU-2847-B ≈ SKU-2847-C in embedding space. iPhone 15 Pro Max 256GB Blue ≈ 512GB Black (cosine ~0.98). Product codes, case numbers, and error codes should always go through keyword search." },
    { title: "Negation Is Invisible to Bi-Encoders", description: "'hotels with pool' ≈ 'hotels without pool' (cosine ~0.95). Mean pooling dilutes the single 'not' token across 10+ tokens. Cross-encoder reranking and boolean filters are the primary mitigations." },
    { title: "Domain Mismatch Causes Silent Misinterpretation", description: "'Consideration' maps to 'thoughtfulness' instead of 'something exchanged in a contract' (legal). 'Positive' maps to 'upbeat' instead of 'test result' (medical). Fine-tuning even 1K-5K domain pairs helps significantly." },
    { title: "Quality Degrades at Scale — Same Parameters, Worse Results", description: "Recall@10 drops from 0.98 at 1M to ~0.92 at 100M with identical HNSW parameters. The curse of dimensionality: in 768 dims, all points become roughly equidistant. Must increase ef_search 2-3x as data grows." },
];

export default function FailuresPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.8</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">When Semantic Search Fails</h1>
                    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed text-red-900">
                            Semantic search is not a silver bullet. It has seven systematic failure modes that are
                            <strong> insidious</strong>: the system always returns results, but those results may be
                            confidently wrong. This chapter catalogues each failure pattern, explains the underlying
                            causes, and provides concrete mitigations.
                        </p>
                    </div>
                </div>
            </div>

            {/* 1. Exact Match */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. Exact Match Requirements</h2>
                <p className="text-foreground leading-relaxed">
                    Embeddings compress meaning into fixed-dimensional vectors, optimizing for semantic similarity
                    and losing <strong>surface-level precision</strong> in the process. Two strings that look almost 
                    identical to a human—differing by only one critical character or number—can produce effectively
                    identical embeddings.
                </p>

                <p className="text-foreground leading-relaxed">
                    This is catastrophic in e-commerce, legal, and medical domains. A user searching for "iPhone 15 
                    Pro Max 256GB Blue" does not want the 512GB Black version, even though structurally and semantically 
                    the queries are 98% identical. Product SKUs, case numbers, and model identifiers are completely 
                    opaque to embedding models unless they happened to appear frequently in the training data.
                </p>
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">exact_match_failure.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-zinc-500"># Nearly identical embeddings for DIFFERENT products:</span></div>
                            <div><span className="text-zinc-300">embed(</span><span className="text-green-300">&quot;iPhone 15 Pro Max 256GB Blue&quot;</span><span className="text-zinc-300">) ≈ embed(</span><span className="text-green-300">&quot;iPhone 15 Pro Max 512GB Black&quot;</span><span className="text-zinc-300">)</span></div>
                            <div><span className="text-zinc-500"># Cosine similarity ≈ 0.98! Wrong color AND wrong storage.</span></div>
                            <div className="mt-2"><span className="text-zinc-500"># Product codes are meaningless to embedding models:</span></div>
                            <div><span className="text-zinc-300">embed(</span><span className="text-green-300">&quot;SKU-2847-B&quot;</span><span className="text-zinc-300">) ≈ embed(</span><span className="text-green-300">&quot;SKU-2847-C&quot;</span><span className="text-zinc-300">)</span><span className="text-zinc-500">  # Completely different products!</span></div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm">
                        <div className="font-bold text-red-800 mb-1">Affected Domains</div>
                        <ul className="text-red-700 space-y-1 list-disc list-inside">
                            <li><strong>E-commerce:</strong> SKU, model number, color, size</li>
                            <li><strong>Legal:</strong> Case numbers, statute references</li>
                            <li><strong>Engineering:</strong> Error codes, config params</li>
                            <li><strong>Medical:</strong> Drug names (metformin vs metoprolol)</li>
                        </ul>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm">
                        <div className="font-bold text-green-800 mb-1">Mitigation</div>
                        <p className="text-green-700">Hybrid search with BM25 weighted higher for identifier queries. Use metadata filters (structured fields for SKU, size, color) as hard constraints, not soft semantic matches.</p>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. Information Loss */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Information Loss in Compression</h2>
                <p className="text-foreground leading-relaxed">
                    When you embed a paragraph using a model like all-MiniLM-L6-v2, you are compressing hundreds of 
                    words into exactly 384 floating-point numbers (about 1.5KB of data). This compression is lossy.
                    The embedding is forced to capture the <strong>general gist</strong> or primary topic of the text,
                    sacrificing specific details, numbers, and secondary clauses.
                </p>

                <p className="text-foreground leading-relaxed">
                    If a document contains a list of five specific features, the embedding might capture that it is a 
                    "feature list for product X", but it cannot mathematically retain the exact values of all five 
                    features. When queried for one specific feature value, the semantic match will be weak.
                </p>
                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="space-y-2 text-xs">
                        <div className="text-zinc-400">Document: &quot;The 2024 Toyota Camry has a 2.5L engine producing</div>
                        <div className="text-zinc-400">  203 HP and 184 lb-ft, achieving 28/39 mpg. MSRP $28,400.&quot;</div>
                        <div className="mt-2">Embedding: <span className="text-yellow-400">[0.12, -0.05, 0.78, ..., 0.33]</span> ← <span className="text-zinc-500">768 numbers</span></div>
                        <div className="mt-2 text-zinc-500">The embedding captures: &quot;Toyota sedan and its specs&quot;</div>
                        <div className="text-red-400">It CANNOT distinguish: 203 HP vs 250 HP, $28,400 vs $35,000</div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-blue-800 mb-2">Mitigations</div>
                    <p className="text-blue-700">
                        <strong>Structured metadata</strong> for numerical attributes (price, HP, ratings).{" "}
                        <strong>Smaller chunks</strong> preserve more per-fact detail.{" "}
                        <strong>ColBERT</strong> retains per-token embeddings instead of compressing to one vector.
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 3. Domain Mismatch */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Domain Mismatch</h2>
                <p className="text-foreground leading-relaxed">
                    Most off-the-shelf embedding models (including OpenAI&apos;s <code>text-embedding-3</code>) are trained 
                    on massive corpora of general web text. They learn the statistical distributions and meanings of 
                    words as they are used by the general public. 
                </p>

                <p className="text-foreground leading-relaxed">
                    When applied to specialized domains, they systematically misinterpret domain terminology. The same word
                    meaning entirely different things in different contexts causes the model to <strong>confidently pick 
                    the wrong meaning</strong> without flagging any uncertainty to the user. This is particularly dangerous 
                    in legal, financial, and medical search.
                </p>
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">domain_mismatch.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-zinc-500"># Legal:</span></div>
                            <div><span className="text-zinc-300">embed(</span><span className="text-green-300">&quot;consideration&quot;</span><span className="text-zinc-300">)</span> <span className="text-zinc-500"># Model: &quot;thoughtfulness&quot; ← WRONG</span></div>
                            <div><span className="text-zinc-500"># Legal meaning: &quot;something of value exchanged in a contract&quot;</span></div>
                            <div className="mt-1"><span className="text-zinc-500"># Finance:</span></div>
                            <div><span className="text-zinc-300">embed(</span><span className="text-green-300">&quot;call&quot;</span><span className="text-zinc-300">)</span> <span className="text-zinc-500"># Model: &quot;phone call&quot; ← WRONG</span></div>
                            <div><span className="text-zinc-500"># Finance: &quot;call option — right to buy at a strike price&quot;</span></div>
                            <div className="mt-1"><span className="text-zinc-500"># Medicine:</span></div>
                            <div><span className="text-zinc-300">embed(</span><span className="text-green-300">&quot;discharge&quot;</span><span className="text-zinc-300">)</span> <span className="text-zinc-500"># Model: &quot;to fire from a job&quot; ← WRONG</span></div>
                            <div><span className="text-zinc-500"># Medical: &quot;fluid from a wound&quot; or &quot;release from hospital&quot;</span></div>
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-amber-800 mb-2">Mitigations</div>
                    <p className="text-amber-700">
                        <strong>Fine-tune</strong> on 1K-5K domain pairs.{" "}
                        <strong>Domain-specific models:</strong> PubMedBERT, LegalBERT, FinBERT.{" "}
                        <strong>Hybrid search:</strong> BM25 handles domain terms literally.
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 4. Negation */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Negation and Logic</h2>
                <p className="text-foreground leading-relaxed">
                    Bi-encoder architectures (the standard for vector search) are notoriously bad at handling negation 
                    and boolean logic. When a user explicitly asks for something to be excluded, the semantic search 
                    engine will often return exactly what they asked to avoid.
                </p>

                <p className="text-foreground leading-relaxed">
                    This happens because embedding models are optimized to measure <strong>topical similarity</strong>, 
                    not logical truth. A query about "hotels with pools" and "hotels without pools" share 90% of their 
                    tokens and are discussing the exact same topic (hotel amenities). In the embedding space, they are 
                    nearly identical neighbors.
                </p>
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">negation_failure.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-zinc-300">embed(</span><span className="text-green-300">&quot;hotels with pool&quot;</span><span className="text-zinc-300">)  ≈  embed(</span><span className="text-green-300">&quot;hotels without pool&quot;</span><span className="text-zinc-300">)</span></div>
                            <div><span className="text-zinc-500"># Cosine similarity ≈ 0.95! The opposite query is nearly identical.</span></div>
                            <div className="mt-1"><span className="text-zinc-300">embed(</span><span className="text-green-300">&quot;foods that are NOT gluten-free&quot;</span><span className="text-zinc-300">)  ≈  embed(</span><span className="text-green-300">&quot;gluten-free foods&quot;</span><span className="text-zinc-300">)</span></div>
                            <div><span className="text-zinc-500"># Could return exactly wrong results for celiac sufferers!</span></div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm"><div className="font-bold text-green-800 mb-1">Boolean Filters</div><p className="text-green-700">&quot;WITHOUT pool&quot; → query: &quot;hotels&quot; + filter: pool=false</p></div>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm"><div className="font-bold text-green-800 mb-1">Cross-Encoder Reranking</div><p className="text-green-700">Joint query-doc attention detects the mismatch via cross-attention</p></div>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm"><div className="font-bold text-green-800 mb-1">Query Understanding</div><p className="text-green-700">Pre-processing layer converts negation to structured filters</p></div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. Scalability Degradation */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. Scalability Degradation</h2>
                <p className="text-foreground leading-relaxed">
                    A semantic search system that performs flawlessly on 100,000 documents might degrade significantly 
                    when scaled to 100 million documents, even if no code changes. This isn&apos;t just an infrastructure 
                    problem; it&apos;s a mathematical reality of high-dimensional geometry known as the <strong>curse of 
                    dimensionality</strong>.
                </p>

                <p className="text-foreground leading-relaxed">
                    As you add more vectors to a fixed-dimensional space (e.g., 768 dimensions), the space becomes 
                    crowded. The distance between the "best" match and the "100th best" match shrinks to an imperceptible 
                    margin. Approximate Nearest Neighbor (ANN) algorithms rely on clear distance gradients to navigate 
                    their graphs. When distances become uniform, ANN algorithms get stuck in local minima and fail to 
                    find the true nearest neighbors, causing recall to silently drop.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Scale</th>
                                <th className="text-left p-3 border-b font-semibold">Recall@10 (default params)</th>
                                <th className="text-left p-3 border-b font-semibold">Why It Degrades</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">1M</td><td className="p-3 text-green-700">~0.98</td><td className="p-3">Few candidates in the &quot;almost as close&quot; region</td></tr>
                            <tr className="border-b"><td className="p-3">100M</td><td className="p-3 text-amber-700">~0.92</td><td className="p-3">More candidates crowd the narrow distance band</td></tr>
                            <tr><td className="p-3">1B</td><td className="p-3 text-red-700">Requires retuning</td><td className="p-3">Hub nodes + local minima + graph quality degradation</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 6. Short Queries */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">6. Short Queries</h2>
                <p className="text-foreground leading-relaxed">
                    Dense embeddings thrive on context. When a user types a full sentence, the surrounding words clarify 
                    the intent of ambiguous terms. When a user types a single word, the embedding model has no context to 
                    pull from, forcing it to average all possible meanings of that word into a single, vague vector.
                </p>

                <p className="text-foreground leading-relaxed">
                    If a user searches for "python", does the embedding represent the programming language, the snake, or 
                    the British comedy troupe? The resulting vector will sit halfway between all three clusters in the 
                    embedding space, retrieving a confusing mix of results from different domains. Keyword search (BM25) 
                    is often safer for 1-2 word queries because it looks for exact lexical matches rather than trying to 
                    guess the semantic center of mass.
                </p>
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">short_queries.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-zinc-300">embed(</span><span className="text-green-300">&quot;python&quot;</span><span className="text-zinc-300">)</span></div>
                            <div><span className="text-zinc-500"># Programming language? The snake? Monty Python?</span></div>
                            <div><span className="text-zinc-500"># No context to disambiguate → vague vector in between all meanings.</span></div>
                            <div className="mt-1"><span className="text-zinc-300">embed(</span><span className="text-green-300">&quot;crash&quot;</span><span className="text-zinc-300">)</span></div>
                            <div><span className="text-zinc-500"># Software? Car? Stock market? Band?</span></div>
                            <div><span className="text-zinc-500"># Embedding becomes average of all possible meanings.</span></div>
                        </div>
                    </div>
                </div>
                <p className="text-foreground leading-relaxed">
                    <strong>Mitigations:</strong> Query expansion (&quot;python&quot; → &quot;python programming
                    language&quot;). Fallback to BM25 for queries under 3 words (alpha=0.3-0.4). User context and session
                    history for disambiguation.
                </p>
            </section>

            <hr className="border-border" />

            {/* 7. Training Data Bias */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">7. Training Data Bias</h2>
                <p className="text-foreground leading-relaxed">
                    Embeddings are a reflection of the data they were trained on. Because most foundational models are 
                    trained on dumps of the public internet (Common Crawl, Wikipedia, Reddit), they inherit the biases, 
                    blind spots, and temporal freezing of that data. Semantic search systems built on these models will 
                    pass these biases directly to your users.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-sm"><div className="font-bold text-amber-800 mb-1">Language Bias</div><p className="text-amber-700">Over-represent English/Western web content. Underrepresented languages get lower-quality embeddings.</p></div>
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-sm"><div className="font-bold text-amber-800 mb-1">Recency Bias</div><p className="text-amber-700">Models trained to 2023 don&apos;t know 2024+ events. Combine with date-based boosting.</p></div>
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-sm"><div className="font-bold text-amber-800 mb-1">Cultural Bias</div><p className="text-amber-700">&quot;nurse&quot; closer to &quot;she&quot; than &quot;he&quot; because training data disproportionately associates nursing with women.</p></div>
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-sm"><div className="font-bold text-amber-800 mb-1">Popularity Bias</div><p className="text-amber-700">Python has better embeddings than Haskell — more web presence = better training signal.</p></div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 8. Trust Framework */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">When to Trust Semantic Search</h2>
                <p className="text-foreground leading-relaxed">
                    Given these systematic failure modes, building a robust search engine requires knowing exactly when 
                    to rely on semantic search and when to fall back to traditional techniques. A modern search architecture 
                    uses semantic search as one tool in a larger orchestration layer, rather than a silver bullet.
                </p>

                <p className="text-foreground leading-relaxed">
                    The table below provides a framework for deciding how heavily to weight vector similarity versus 
                    keyword matching or structured filtering based on the <em>type</em> of query being processed by 
                    your query understanding layer.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Scenario</th>
                                <th className="text-left p-3 border-b font-semibold">Semantic?</th>
                                <th className="text-left p-3 border-b font-semibold">Keyword?</th>
                                <th className="text-left p-3 border-b font-semibold">Best Approach</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">Conceptual queries</td><td className="p-3 text-green-700">✅ High</td><td className="p-3 text-red-700">❌ Low</td><td className="p-3">Semantic-heavy hybrid</td></tr>
                            <tr className="border-b"><td className="p-3">Exact identifiers</td><td className="p-3 text-red-700">❌ Low</td><td className="p-3 text-green-700">✅ High</td><td className="p-3">Keyword-heavy hybrid</td></tr>
                            <tr className="border-b"><td className="p-3">Domain jargon</td><td className="p-3 text-amber-600">⚠️ if fine-tuned</td><td className="p-3 text-green-700">✅ High</td><td className="p-3">Fine-tuned + keyword</td></tr>
                            <tr className="border-b"><td className="p-3">Negation queries</td><td className="p-3 text-red-700">❌ Low</td><td className="p-3 text-amber-600">⚠️</td><td className="p-3">Boolean filters + cross-encoder</td></tr>
                            <tr className="border-b"><td className="p-3">Short queries (1-2 words)</td><td className="p-3 text-amber-600">⚠️</td><td className="p-3 text-green-700">✅ High</td><td className="p-3">Keyword fallback</td></tr>
                            <tr className="border-b"><td className="p-3">Numerical comparison</td><td className="p-3 text-red-700">❌ Low</td><td className="p-3 text-red-700">❌ Low</td><td className="p-3">Structured metadata filters</td></tr>
                            <tr><td className="p-3">Time-sensitive queries</td><td className="p-3 text-amber-600">⚠️</td><td className="p-3 text-green-700">✅ High</td><td className="p-3">Recency boosting + hybrid</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/hybrid-ranking" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.7 Hybrid Ranking Pipelines
                </Link>
                <Link href="/search/vector-search/cost" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.9 Cost at Scale <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
