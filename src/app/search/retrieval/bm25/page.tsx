import { SaturationChart } from "@/components/search/bm25/saturation-chart";
import { ScoreCalculator } from "@/components/search/bm25/score-calculator";
import { KeyTakeaways } from "@/components/search/key-takeaways";
import Link from "next/link";
import { ArrowRight, BarChart3, Binary, Divide, AlertTriangle, Database, Cpu } from "lucide-react";

export const metadata = {
    title: "Chapter 5.3: Scoring (BM25) | Search Engineering",
    description: "From TF-IDF to BM25: The evolution of modern relevance scoring."
};

const takeaways = [
    { title: "TF-IDF is the Ancestor", description: "It introduced the core ideas (Count + Rareness), but failed at scale due to lack of controls." },
    { title: "BM25 is the Fix", description: "It adds Saturation (k1) and Length Normalization (b) to make TF-IDF robust against spam and length bias." },
    { title: "Saturation Matters", description: "The first mention of a word is infinitely more valuable than the hundredth." },
    { title: "Unbeatable Baseline", description: "Despite AI advances, BM25 remains the fastest, cheapest, and most effective zero-shot retriever." }
];

export default function BM25Page() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 5.3</span>
                    <span>Scoring</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Scoring: From TF-IDF to BM25</h1>

                <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                    <p className="text-xl font-medium leading-relaxed">
                        Boolean retrieval tells us <em>what</em> matches. Scoring tells us <em>how well</em> it matches.
                    </p>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                    This chapter traces the evolution from the naive TF-IDF model to the industry-standard BM25 algorithm.
                    Understanding this progression is essential: BM25 is not magic — it is TF-IDF with two critical fixes.
                </p>

                {/* Stats Row */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm">
                            <BarChart3 className="w-4 h-4" /> Default Since
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">2015</p>
                        <p className="text-sm text-zinc-600">When Lucene/Elasticsearch switched from TF-IDF to BM25 as default.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-purple-700 font-medium text-sm">
                            <Binary className="w-4 h-4" /> k₁ Default
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">1.2</p>
                        <p className="text-sm text-zinc-600">The sweet spot for saturation. Lower = faster saturation.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm">
                            <Divide className="w-4 h-4" /> b Default
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">0.75</p>
                        <p className="text-sm text-zinc-600">Length normalization strength. 0 = off, 1 = full penalty.</p>
                    </div>
                </div>
            </div>

            <hr className="border-border" />

            {/* 1. From Boolean to Ranking */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. From Boolean to Ranking</h2>
                <p className="text-foreground leading-relaxed">
                    <Link href="/search/retrieval/boolean" className="text-primary hover:underline font-medium">Boolean retrieval</Link> produces a set: <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{"{DocA, DocB, DocC}"}</code>.
                    It tells us which documents contain our query terms, but not which one is <em>most relevant</em>.
                    Scoring transitions us from <strong>Sets to Lists</strong>.
                </p>
                <p className="text-foreground leading-relaxed">
                    We assume an <strong>additive model</strong>: if a query has 3 terms, the document's total score is the sum of contributions from each term.
                    This is why the formula you'll see below has a "Σ" (sum) at the front we compute a score per query term and add them all up.
                </p>
            </section>

            <hr className="border-border" />

            {/* 2. The Ancestor: TF-IDF */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. The Ancestor: TF-IDF</h2>
                <p className="text-foreground leading-relaxed">
                    Before BM25, there was <strong>TF-IDF</strong> (Term Frequency - Inverse Document Frequency).
                    It was the first principled attempt to turn "counting words" into a mathematical relevance score.
                    The idea is simple: words that appear often in a document should boost its score, but words that appear everywhere should be discounted.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* TF Card */}
                    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg space-y-4">
                        <h3 className="font-bold flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-blue-600" />
                            2.1 Term Frequency (TF)
                        </h3>
                        <p className="text-sm text-zinc-600">
                            "How often does the word appear in this document?"
                        </p>
                        <div className="bg-white border border-zinc-200 p-3 rounded font-mono text-sm text-center">
                            TF = count(term, document)
                        </div>
                        <div className="text-sm text-zinc-600 space-y-2 pt-3 border-t border-zinc-200">
                            <p><strong>Intuition:</strong> A document mentioning "Jeans" 5 times is likely more relevant than one mentioning it once.</p>
                            <p>Every occurrence is treated as <strong>evidence</strong> of relevance. More evidence → higher score.</p>
                            <p><strong>Problem:</strong> What if someone repeats "Jeans" 1,000 times? They get 1,000× the score. This is called keyword stuffing.</p>
                        </div>
                    </div>

                    {/* IDF Card */}
                    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg space-y-4">
                        <h3 className="font-bold flex items-center gap-2">
                            <Binary className="w-4 h-4 text-purple-600" />
                            2.2 Inverse Document Frequency (IDF)
                        </h3>
                        <p className="text-sm text-zinc-600">
                            "How rare is the word across the entire corpus?"
                        </p>
                        <div className="bg-white border border-zinc-200 p-3 rounded font-mono text-sm text-center">
                            IDF = log(N / n)
                        </div>
                        <div className="text-sm text-zinc-600 space-y-2 pt-3 border-t border-zinc-200">
                            <p><strong>N</strong> = Total documents in corpus. <strong>n</strong> = Documents containing this term.</p>
                            <p><strong>Intuition:</strong> Rooted in <strong>Information Theory</strong>. Rare events carry more information (Shannon Entropy).</p>
                            <p>The word "Zolpidem" appearing in 0.01% of docs is far more informative than "The" appearing in 100% of docs.</p>
                        </div>
                    </div>
                </div>

                {/* The TF-IDF Formula */}
                <div className="bg-gradient-to-r from-zinc-100 to-zinc-50 border border-zinc-200 p-8 rounded-xl text-center space-y-4">
                    <div className="text-sm uppercase tracking-widest text-zinc-500">The Classic TF-IDF Formula</div>
                    <div className="text-3xl md:text-4xl font-bold font-mono">
                        Score = Σ (TF × IDF)
                    </div>
                    <p className="text-sm text-zinc-600 max-w-xl mx-auto">
                        For each query term, multiply its frequency in the document (local) by its rarity in the corpus (global), then sum.
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 3. Why TF-IDF Fails */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Why TF-IDF Fails</h2>
                <p className="text-foreground leading-relaxed">
                    TF-IDF works for small demos, but it breaks catastrophically in production systems.
                    It has three fundamental flaws that allow bad actors to game the system and cause irrelevant documents to rank highly.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-red-50 border border-red-200 p-6 rounded-xl space-y-3 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 font-bold text-red-800">
                            <AlertTriangle className="w-4 h-4" /> No Saturation
                        </div>
                        <p className="text-sm text-red-700">
                            A document with 1,000 "Jeans" gets 1,000× the score. Keyword stuffing and spam win easily.
                            There's no concept of "diminishing returns" — the 100th mention is as valuable as the 1st.
                        </p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl space-y-3 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 font-bold text-amber-800">
                            <Divide className="w-4 h-4" /> No Length Normalization
                        </div>
                        <p className="text-sm text-amber-700">
                            A 10,000-word essay will naturally contain more matches than a 10-word title just by random chance.
                            Long documents dominate results even when less relevant.
                        </p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl space-y-3 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 font-bold text-orange-800">
                            <BarChart3 className="w-4 h-4" /> Linear Growth
                        </div>
                        <p className="text-sm text-orange-700">
                            Going from 1→2 matches is a huge signal. Going from 100→101 is almost noise.
                            TF-IDF treats both jumps identically (+1 to score).
                        </p>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 4. BM25: The Industrial Fix */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. BM25: The Industrial Fix</h2>
                <p className="text-foreground leading-relaxed">
                    <strong>BM25 (Best Match 25)</strong> is not a new algorithm it's TF-IDF with two critical patches.
                    It keeps the good parts (Frequency + Rareness) but fixes the flaws by adding <strong>Saturation</strong> and <strong>Length Normalization</strong>.
                </p>
                <p className="text-foreground leading-relaxed">
                    BM25 has been the default scoring algorithm in Lucene, Elasticsearch, and Solr since 2015.
                    When you search Google, Amazon, or any major search engine, the first-pass retrieval almost certainly uses BM25 or a close variant.
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">Key Insight</span>
                    </div>
                    <p className="text-blue-800">
                        BM25 is a probabilistic model derived from the Robertson-Spärck Jones framework.
                        The math is principled, not arbitrary — each component corresponds to a statistical assumption about relevance.
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. The Three BM25 Components */}
            <section className="space-y-12">
                <h2 className="text-3xl font-bold">5. The Three BM25 Components</h2>
                <p className="text-foreground leading-relaxed">
                    BM25 decomposes into three factors that are multiplied together for each query term.
                    Understanding each component independently makes the full formula much less intimidating.
                </p>

                {/* 5.1 Saturation */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" /> 5.1 TF Saturation
                    </h3>
                    <p className="text-foreground leading-relaxed">
                        Instead of using raw term count, BM25 applies a <strong>saturation curve</strong>.
                        The curve has an asymptote no matter how many times a word appears, its contribution approaches a maximum and never exceeds it.
                        This prevents keyword stuffing from working.
                    </p>
                    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg text-center">
                        <div className="text-xs text-zinc-500 mb-3">Saturated TF =</div>
                        <div className="inline-flex flex-col items-center font-mono">
                            <span className="text-lg font-bold text-blue-600 border-b-2 border-zinc-400 px-4 pb-1">TF</span>
                            <span className="text-lg font-bold pt-1">TF + k₁</span>
                        </div>
                    </div>
                    <p className="text-sm text-zinc-600">
                        <strong>k₁</strong> (typically 1.2) controls the curve shape.
                        Low k₁ → saturates quickly (binary-like: term is present or not).
                        High k₁ → saturates slowly (closer to raw TF).
                        The default of 1.2 is a sweet spot for most corpora.
                    </p>

                    {/* Example */}
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm space-y-2">
                        <div className="font-bold text-blue-800">Example (k₁ = 1.2):</div>
                        <div className="grid md:grid-cols-3 gap-4 text-center">
                            <div className="bg-white p-3 rounded border border-blue-100 space-y-1">
                                <div className="text-xs text-blue-600 font-medium">TF = 1</div>
                                <div className="font-mono text-xs text-zinc-600">
                                    <div>= 1 / (1 + 1.2)</div>
                                </div>
                                <div className="font-bold text-lg pt-2 border-t border-blue-100">= 0.45</div>
                            </div>
                            <div className="bg-white p-3 rounded border border-blue-100 space-y-1">
                                <div className="text-xs text-blue-600 font-medium">TF = 5</div>
                                <div className="font-mono text-xs text-zinc-600">
                                    <div>= 5 / (5 + 1.2)</div>
                                </div>
                                <div className="font-bold text-lg pt-2 border-t border-blue-100">= 0.81</div>
                            </div>
                            <div className="bg-white p-3 rounded border border-blue-100 space-y-1">
                                <div className="text-xs text-blue-600 font-medium">TF = 100</div>
                                <div className="font-mono text-xs text-zinc-600">
                                    <div>= 100 / (100 + 1.2)</div>
                                </div>
                                <div className="font-bold text-lg pt-2 border-t border-blue-100">= 0.99</div>
                            </div>
                        </div>
                        <p className="text-blue-700 text-xs pt-2 border-t border-blue-200">
                            Notice: Going from 1→5 adds 0.36. Going from 5→100 only adds 0.18. Diminishing returns!
                        </p>
                    </div>

                    <div className="max-w-2xl">
                        <SaturationChart />
                    </div>
                </div>

                {/* 5.2 IDF */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Binary className="w-5 h-5 text-purple-600" /> 5.2 IDF (Rareness)
                    </h3>
                    <p className="text-foreground leading-relaxed">
                        Same core idea as TF-IDF: rare words carry more signal than common words.
                        BM25 uses a slightly different formula with a probabilistic derivation that avoids negative weights for very common terms.
                    </p>
                    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg text-center">
                        <div className="inline-flex items-center gap-3 font-mono">
                            <span className="text-lg">IDF = log</span>
                            <span className="text-2xl">(</span>
                            <span>1 +</span>
                            <span className="inline-flex flex-col items-center">
                                <span className="text-purple-600 font-bold border-b-2 border-zinc-400 px-2 pb-1">N - n + 0.5</span>
                                <span className="pt-1">n + 0.5</span>
                            </span>
                            <span className="text-2xl">)</span>
                        </div>
                        <div className="text-xs text-zinc-500 mt-3">
                            N = total docs, n = docs containing term
                        </div>
                    </div>
                    <p className="text-sm text-zinc-600">
                        The <code>+0.5</code> smoothing ensures mathematical stability when a term appears in more than 50% of documents.
                        Without it, IDF could go negative, which would mean common words <em>hurt</em> relevance not what we want.
                    </p>
                    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg flex items-center justify-around text-center">
                        <div>
                            <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Common Word</div>
                            <div className="text-2xl font-bold">"The"</div>
                            <div className="text-sm text-zinc-500">IDF ≈ 0 (no signal)</div>
                        </div>
                        <div className="h-12 w-px bg-zinc-200"></div>
                        <div>
                            <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Rare Word</div>
                            <div className="text-2xl font-bold text-purple-600">"Zolpidem"</div>
                            <div className="text-sm text-zinc-500">IDF ≈ High (strong signal)</div>
                        </div>
                    </div>

                    {/* Example */}
                    <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-sm space-y-2">
                        <div className="font-bold text-purple-800">Example (N = 1,000,000 documents):</div>
                        <div className="grid md:grid-cols-2 gap-4 font-mono text-xs">
                            <div className="bg-white p-3 rounded border border-purple-100 space-y-1">
                                <div className="text-purple-600 font-sans font-medium">"the" in 950,000 docs</div>
                                <div className="text-zinc-500">IDF = log(1 +</div>
                                <div className="pl-4">(1,000,000 - 950,000 + 0.5)</div>
                                <div className="pl-4">/ (950,000 + 0.5)</div>
                                <div className="text-zinc-500">)</div>
                                <div className="font-bold text-lg pt-2 border-t border-purple-100">≈ 0.05</div>
                            </div>
                            <div className="bg-white p-3 rounded border border-purple-100 space-y-1">
                                <div className="text-purple-600 font-sans font-medium">"zolpidem" in 100 docs</div>
                                <div className="text-zinc-500">IDF = log(1 +</div>
                                <div className="pl-4">(1,000,000 - 100 + 0.5)</div>
                                <div className="pl-4">/ (100 + 0.5)</div>
                                <div className="text-zinc-500">)</div>
                                <div className="font-bold text-lg pt-2 border-t border-purple-100">≈ 9.21</div>
                            </div>
                        </div>
                        <p className="text-purple-700 text-xs pt-2 border-t border-purple-200">
                            The rare medical term carries ~180× more signal than the common word "the".
                        </p>
                    </div>
                </div>

                {/* 5.3 Length Norm */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Divide className="w-5 h-5 text-amber-600" /> 5.3 Length Normalization
                    </h3>
                    <p className="text-foreground leading-relaxed">
                        Long documents naturally contain more term occurrences just by having more words.
                        We need to penalize them to give short, dense documents a fair chance.
                        A 2-word title saying "Blue Jeans" should beat a 10,000-word essay that happens to mention "blue" and "jeans" once each.
                    </p>
                    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg text-center">
                        <div className="inline-flex items-center gap-2 font-mono">
                            <span className="text-lg">Length Factor =</span>
                            <span className="text-amber-600 font-bold">1 - b</span>
                            <span>+</span>
                            <span className="text-amber-600 font-bold">b</span>
                            <span>×</span>
                            <span className="inline-flex flex-col items-center">
                                <span className="font-bold border-b-2 border-zinc-400 px-2 pb-1">|D|</span>
                                <span className="pt-1">avgdl</span>
                            </span>
                        </div>
                        <div className="text-xs text-zinc-500 mt-3">
                            |D| = doc length, avgdl = average doc length
                        </div>
                    </div>
                    <p className="text-sm text-zinc-600">
                        <strong>|D|</strong> = document length. <strong>avgdl</strong> = average document length in corpus.
                        <strong>b</strong> (typically 0.75) controls normalization strength:
                        b = 0 means no normalization (length ignored). b = 1 means full normalization (strict penalty for long docs).
                    </p>

                    {/* Example */}
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-sm space-y-2">
                        <div className="font-bold text-amber-800">Example (avgdl = 100 words, b = 0.75):</div>
                        <div className="grid md:grid-cols-3 gap-4 text-center">
                            <div className="bg-white p-3 rounded border border-amber-100 space-y-1">
                                <div className="text-xs text-amber-600 font-medium">Short Doc (10 words)</div>
                                <div className="font-mono text-xs space-y-0.5 text-zinc-600">
                                    <div>= 1 - 0.75 + 0.75 ×</div>
                                    <div>(10 / 100)</div>
                                </div>
                                <div className="font-bold text-lg text-green-600 pt-2 border-t border-amber-100">= 0.325</div>
                                <div className="text-xs text-zinc-500">Score boosted 3×</div>
                            </div>
                            <div className="bg-white p-3 rounded border border-amber-100 space-y-1">
                                <div className="text-xs text-amber-600 font-medium">Average Doc (100 words)</div>
                                <div className="font-mono text-xs space-y-0.5 text-zinc-600">
                                    <div>= 1 - 0.75 + 0.75 ×</div>
                                    <div>(100 / 100)</div>
                                </div>
                                <div className="font-bold text-lg pt-2 border-t border-amber-100">= 1.0</div>
                                <div className="text-xs text-zinc-500">No change</div>
                            </div>
                            <div className="bg-white p-3 rounded border border-amber-100 space-y-1">
                                <div className="text-xs text-amber-600 font-medium">Long Doc (500 words)</div>
                                <div className="font-mono text-xs space-y-0.5 text-zinc-600">
                                    <div>= 1 - 0.75 + 0.75 ×</div>
                                    <div>(500 / 100)</div>
                                </div>
                                <div className="font-bold text-lg text-red-600 pt-2 border-t border-amber-100">= 4.0</div>
                                <div className="text-xs text-zinc-500">Score divided by 4</div>
                            </div>
                        </div>
                        <p className="text-amber-700 text-xs pt-2 border-t border-amber-200">
                            This factor goes in the denominator, so larger values = lower scores. Short docs get a boost!
                        </p>
                    </div>

                    <div className="max-w-2xl">
                        <ScoreCalculator />
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 6. The Full BM25 Formula */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">6. The Full BM25 Formula</h2>
                <p className="text-foreground leading-relaxed">
                    Now we can assemble the complete equation. For each query term, we compute an IDF weight multiplied by a saturated TF that's normalized by document length.
                    The final score is the sum across all query terms.
                </p>
                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl overflow-x-auto">
                    <div className="min-w-[500px] flex flex-col items-center gap-8">
                        <div className="font-mono text-lg md:text-xl font-bold text-center leading-relaxed">
                            <span className="text-zinc-400">Score(D, Q) = </span>
                            <span className="text-zinc-100">Σ </span>
                            <span className="text-purple-400">IDF(qᵢ)</span>
                            <span className="text-zinc-100"> × </span>
                            <span className="inline-flex flex-col items-center align-middle mx-2">
                                <span className="border-b border-zinc-600 pb-1 mb-1 text-blue-400">TF × (k₁ + 1)</span>
                                <span className="text-amber-400 text-base">TF + k₁ × (1 - b + b × |D|/avgdl)</span>
                            </span>
                        </div>

                        <div className="grid grid-cols-3 w-full max-w-xl border-t border-zinc-700 pt-6 gap-4 text-center text-sm">
                            <div>
                                <div className="text-purple-400 font-bold mb-1">IDF</div>
                                <div className="text-zinc-500">Global (corpus)</div>
                            </div>
                            <div>
                                <div className="text-blue-400 font-bold mb-1">Saturation</div>
                                <div className="text-zinc-500">Per-term</div>
                            </div>
                            <div>
                                <div className="text-amber-400 font-bold mb-1">Length</div>
                                <div className="text-zinc-500">Per-document</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 7. Execution Model */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">7. Execution Model</h2>
                <p className="text-foreground leading-relaxed">
                    The search engine doesn't loop over all documents. That would be O(N) which is far too slow.
                    Instead, it loops over query terms and uses the inverted index to find only documents that contain each term.
                    Scores are accumulated in a sparse data structure.
                </p>
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">bm25_scoring.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div>
                                <span className="text-blue-400">def</span> <span className="text-yellow-300">score_query</span><span className="text-white">(query: list[str], index: InvertedIndex) -&gt; dict[int, float]:</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-green-400">&quot;&quot;&quot;Score all documents matching query terms using BM25.&quot;&quot;&quot;</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-white">scores: dict[int, float] = {'{}'}</span>  <span className="text-gray-500"># sparse accumulator</span>
                            </div>
                            <div className="pl-4 text-white">&nbsp;</div>
                            <div className="pl-4">
                                <span className="text-pink-400">for</span> <span className="text-white">term</span> <span className="text-pink-400">in</span> <span className="text-white">query:</span>
                            </div>
                            <div className="pl-8">
                                <span className="text-white">idf = get_idf(term)</span>  <span className="text-gray-500"># cached, O(1)</span>
                            </div>
                            <div className="pl-8 text-white">&nbsp;</div>
                            <div className="pl-8">
                                <span className="text-pink-400">for</span> <span className="text-white">doc_id, tf</span> <span className="text-pink-400">in</span> <span className="text-white">index.postings(term):</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-white">norm = norms[doc_id]</span>  <span className="text-gray-500"># 1-byte lookup</span>
                            </div>
                            <div className="pl-12">
                                <span className="text-white">scores[doc_id] = scores.get(doc_id, </span><span className="text-orange-300">0</span><span className="text-white">) + bm25(tf, idf, norm)</span>
                            </div>
                            <div className="pl-4 text-white">&nbsp;</div>
                            <div className="pl-4">
                                <span className="text-pink-400">return</span> <span className="text-white">scores</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 8. Worked Example */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">8. Worked Example: "Blue Jeans"</h2>
                <p className="text-foreground leading-relaxed">
                    Let's compare TF-IDF and BM25 on a simple query. We have two documents:
                    Doc A is a short product title. Doc B is a long blog post that happens to mention the keywords more often.
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg space-y-4">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-lg">TF-IDF Result</h4>
                            <span className="bg-zinc-200 text-zinc-700 text-xs font-bold px-2 py-1 rounded">Naive</span>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span>Doc A: "Blue Jeans" (2 words)</span>
                                <span className="font-mono">2.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Doc B: Long essay (1000 words, 10 matches)</span>
                                <span className="font-mono">20.0</span>
                            </div>
                            <div className="pt-3 border-t border-zinc-200 text-amber-700 font-medium">
                                ⚠ Long Doc B wins unfairly due to more matches.
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-50 border-2 border-emerald-300 p-6 rounded-lg space-y-4">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-lg">BM25 Result</h4>
                            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">Robust</span>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span>Doc A: "Blue Jeans" (2 words)</span>
                                <span className="font-mono">2.2</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Doc B: Long essay (1000 words, 10 matches)</span>
                                <span className="font-mono">0.8</span>
                            </div>
                            <div className="pt-3 border-t border-zinc-200 text-emerald-700 font-medium">
                                ✓ Concise Doc A wins. Length normalization works.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 9. Parameter Behavior */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">9. Parameter Behavior</h2>
                <p className="text-foreground leading-relaxed">
                    BM25 has two tunable parameters: k₁ and b. The defaults (k₁=1.2, b=0.75) work well for most cases.
                    Only tune these if you have a proper evaluation dataset and metrics pipeline otherwise you're shooting in the dark.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                        <div className="font-mono font-bold text-blue-600 mb-1">k₁ = 0</div>
                        <div className="text-xs text-zinc-600">Binary mode. Only term presence matters.</div>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                        <div className="font-mono font-bold text-blue-600 mb-1">k₁ = 1.2</div>
                        <div className="text-xs text-zinc-600">Default. Balanced saturation.</div>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                        <div className="font-mono font-bold text-amber-600 mb-1">b = 0</div>
                        <div className="text-xs text-zinc-600">No length normalization.</div>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                        <div className="font-mono font-bold text-amber-600 mb-1">b = 0.75</div>
                        <div className="text-xs text-zinc-600">Default. Moderate penalty for long docs.</div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 10. Lucene Implementation */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">10. Lucene Implementation</h2>
                <p className="text-foreground leading-relaxed">
                    In practice, BM25 is implemented in <code>BM25Similarity.java</code> inside Lucene.
                    The implementation is highly optimized for cache efficiency and minimal memory access.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg space-y-2">
                        <h4 className="font-bold flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-blue-600" />
                            BM25Similarity.java
                        </h4>
                        <p className="text-sm text-zinc-600">
                            All scores are computed as 32-bit floats. IDF is pre-computed once at query time.
                            The saturation curve is evaluated per posting.
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg space-y-2">
                        <h4 className="font-bold flex items-center gap-2">
                            <Database className="w-4 h-4 text-purple-600" />
                            Norms (.nvd files)
                        </h4>
                        <p className="text-sm text-zinc-600">
                            Document lengths are not stored as raw integers. They are compressed to 1 byte per document.
                            This trades slight precision for massive RAM savings (billions of docs × 1 byte is manageable).
                        </p>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 11. What BM25 Does NOT Do */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">11. What BM25 Does NOT Do</h2>
                <p className="text-foreground leading-relaxed">
                    BM25 is a lexical matcher. It counts words. It has no understanding of meaning, context, or the world.
                    These limitations are fundamental they're not bugs that can be patched.
                </p>
                <ul className="grid md:grid-cols-2 gap-4">
                    <li className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm">
                        <span className="text-amber-600 font-bold mt-0.5">✗</span>
                        <div>
                            <strong>No semantic understanding.</strong> "laptop" and "computer" are completely different words to BM25.
                        </div>
                    </li>
                    <li className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm">
                        <span className="text-amber-600 font-bold mt-0.5">✗</span>
                        <div>
                            <strong>No phrase support.</strong> "New York" is just two words: "New" and "York". Word order is ignored.
                        </div>
                    </li>
                    <li className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm">
                        <span className="text-amber-600 font-bold mt-0.5">✗</span>
                        <div>
                            <strong>No authority signals.</strong> A spam page and Wikipedia are treated equally if they have the same TF/IDF.
                        </div>
                    </li>
                    <li className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm">
                        <span className="text-amber-600 font-bold mt-0.5">✗</span>
                        <div>
                            <strong>No freshness.</strong> A document from 1990 and one from today score identically.
                        </div>
                    </li>
                </ul>
            </section>

            <hr className="border-border" />

            {/* 12. Position in the Stack */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">12. Position in the Stack</h2>
                <p className="text-foreground leading-relaxed">
                    BM25 is typically the "Stage 1.5" scorer it runs after boolean retrieval and before expensive re-ranking.
                    Its job is to take millions of candidates and narrow them down to thousands that can be re-ranked by slower, more accurate models.
                </p>
                <div className="flex items-center gap-4 text-center max-w-3xl mx-auto py-4">
                    <div className="flex-1 p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                        <div className="font-bold">Retrieval</div>
                        <div className="text-xs text-zinc-500 mt-1">Boolean / Index</div>
                    </div>
                    <ArrowRight className="text-zinc-400" />
                    <div className="flex-1 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-lg">
                        <div className="font-bold text-emerald-700">BM25</div>
                        <div className="text-xs text-emerald-600 mt-1">Top 1000</div>
                    </div>
                    <ArrowRight className="text-zinc-400" />
                    <div className="flex-1 p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                        <div className="font-bold">Re-Ranking</div>
                        <div className="text-xs text-zinc-500 mt-1">AI / LTR</div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 13. Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/retrieval/boolean" className="text-sm font-medium text-muted-foreground hover:text-primary">
                    ← Chapter 5.2: Boolean Retrieval
                </Link>
                <Link href="/search/retrieval/filters" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                    Chapter 5.4: Filtering & Facets <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
