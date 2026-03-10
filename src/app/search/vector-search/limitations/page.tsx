"use client";

import Link from "next/link";
import {
    Search, ArrowRight, ArrowLeft, AlertTriangle, XCircle,
    HelpCircle, Brain, ShieldAlert, BookOpen, MessageSquare,
    Stethoscope, Scale, Code2, Globe, FileQuestion, Sparkles
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Vocabulary Mismatch Is Fundamental", description: "Users and authors describe the same concept with different words. Furnas et al. (1987) showed users agree on the same term only 20% of the time — BM25 finds zero matches for the other 80%. This isn't an edge case; it's the norm." },
    { title: "Five Distinct Failure Modes", description: "Synonym blindness, polysemy confusion, conceptual queries, cross-domain vocabulary gaps, and short queries — each represents a structurally different way lexical matching fails, and no single fix addresses all of them." },
    { title: "Traditional Fixes Are Band-Aids", description: "Stemming, synonym dictionaries, query expansion, n-grams, and pseudo-relevance feedback each help at the margins but introduce new problems. Synonym dictionaries require constant curation and can't handle context-dependent meanings." },
    { title: "Hybrid Search Is the Production Answer", description: "Neither keyword nor semantic search alone is sufficient. Keyword search excels at exact IDs and structured data; semantic search excels at conceptual queries. Modern systems combine both for robust retrieval across all query types." },
];

export default function LimitationsPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero Section */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.1</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Why Keyword Search Is Not Enough</h1>

                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            BM25 and TF-IDF match words, not meaning. When users say &quot;affordable&quot; and documents say
                            &quot;budget,&quot; keyword search sees zero overlap. This vocabulary mismatch problem is the
                            fundamental motivation for everything in Chapter 6.
                        </p>
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                        Keyword search is the backbone of information retrieval, but it operates on <strong>lexical matching</strong>:
                        a document only matches if it contains the exact terms in the query. This creates a deep, structural problem
                        for real-world search where users and documents express the same concept in wildly different words.
                    </p>
                </div>

                {/* Stats Row */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-red-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-red-700 font-medium text-sm">
                            <XCircle className="w-4 h-4" /> Term Agreement
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">~20%</p>
                        <p className="text-sm text-zinc-600">Any two people choose the same word for a concept only 20% of the time (Furnas et al., 1987).</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-amber-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-amber-700 font-medium text-sm">
                            <HelpCircle className="w-4 h-4" /> Failure Modes
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">5</p>
                        <p className="text-sm text-zinc-600">Synonym blindness, polysemy, conceptual queries, cross-domain gaps, short queries.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm">
                            <Brain className="w-4 h-4" /> The Fix
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">Hybrid</p>
                        <p className="text-sm text-zinc-600">Neither keyword nor semantic alone — production systems always combine both approaches.</p>
                    </div>
                </div>

                {/* Tip Box */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                        <strong>Key Insight:</strong> This chapter motivates the entire vector search chapter. Every technique
                        in chapters 6.2-6.12 exists because of the limitations described here. Understanding <em>why</em> keyword
                        search fails helps you choose <em>when</em> to apply semantic search — and when not to.
                    </div>
                </div>
            </div>

            {/* 1. The Vocabulary Mismatch Problem */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. The Vocabulary Mismatch Problem</h2>
                <p className="text-foreground leading-relaxed">
                    George Furnas and colleagues at Bell Labs conducted a landmark study in 1987 that quantified what every
                    search engineer eventually discovers: people are remarkably inconsistent in the words they choose to describe
                    the same concept. When asked to name a common object or action, two people independently chose the same word
                    only about <strong>20% of the time</strong>. This means that for any given query-document pair describing
                    the same concept, there&apos;s an 80% chance the user&apos;s query term simply doesn&apos;t appear in the
                    relevant document.
                </p>

                <p className="text-foreground leading-relaxed">
                    For BM25 and TF-IDF, which score relevance based on exact term overlap between query and document, this is
                    catastrophic. A document about &quot;affordable smartphones&quot; scores zero for the query &quot;budget
                    mobile phones&quot; because there&apos;s no term overlap — despite perfect semantic relevance.
                    The search system doesn&apos;t return bad results; it returns <strong>no results</strong> for queries
                    where the vocabulary happens to diverge.
                </p>

                <p className="text-foreground leading-relaxed">
                    This isn&apos;t a bug to be fixed with clever engineering — it&apos;s a fundamental limitation of the
                    bag-of-words assumption that underlies all keyword-based retrieval. As long as scoring depends on matching
                    character sequences, any vocabulary gap between user and author creates a blind spot that no amount of BM25
                    parameter tuning can resolve.
                </p>

                {/* Visual: The Vocabulary Gap */}
                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># The Vocabulary Gap in Action</div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <div className="text-zinc-500">User queries vs Document language:</div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-400 w-44">&quot;cheap flights&quot;</span>
                                    <span className="text-zinc-500">→</span>
                                    <span className="text-green-400">&quot;budget airline tickets&quot;</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-400 w-44">&quot;stomach ache remedies&quot;</span>
                                    <span className="text-zinc-500">→</span>
                                    <span className="text-green-400">&quot;GI discomfort treatment&quot;</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-400 w-44">&quot;best phone for photos&quot;</span>
                                    <span className="text-zinc-500">→</span>
                                    <span className="text-green-400">&quot;camera comparison&quot;</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-400 w-44">&quot;fix a flat tire&quot;</span>
                                    <span className="text-zinc-500">→</span>
                                    <span className="text-green-400">&quot;puncture repair guide&quot;</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-zinc-500">BM25 scores for each pair:</div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="bg-red-500/30 h-4 w-0 rounded"></div>
                                    <span className="text-red-400 font-bold">0.0</span>
                                    <span className="text-zinc-500">zero word overlap</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-red-500/30 h-4 w-0 rounded"></div>
                                    <span className="text-red-400 font-bold">0.0</span>
                                    <span className="text-zinc-500">zero word overlap</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-red-500/30 h-4 w-0 rounded"></div>
                                    <span className="text-red-400 font-bold">0.0</span>
                                    <span className="text-zinc-500">zero word overlap</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-red-500/30 h-4 w-0 rounded"></div>
                                    <span className="text-red-400 font-bold">0.0</span>
                                    <span className="text-zinc-500">zero word overlap</span>
                                </div>
                            </div>
                            <div className="text-yellow-400 mt-4 text-xs">
                                Every pair is semantically identical but lexically invisible
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-blue-800 mb-2">The Core Insight</div>
                    <p className="text-blue-700">
                        The vocabulary mismatch problem is <strong>pervasive</strong>, not exceptional. It affects every domain,
                        every language, and every user population. The 20% agreement rate from Furnas et al. has been replicated
                        across dozens of studies. Any search system that depends solely on lexical matching is fundamentally
                        limited to serving at most 20% of user information needs optimally.
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. Real-World Impact */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Real-World Impact by Domain</h2>
                <p className="text-foreground leading-relaxed">
                    The vocabulary mismatch isn&apos;t an abstract academic concern — it costs real money,
                    wastes human time, and in some domains, risks human safety. Understanding the impact
                    by domain reveals why different industries are investing millions in semantic search.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-red-500" /> E-Commerce
                        </h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            A user searching &quot;sneakers&quot; won&apos;t find products listed as &quot;running shoes&quot;
                            or &quot;trainers.&quot; The store has exactly what the customer wants, but keyword search returns
                            zero results — and the customer leaves. At scale, this vocabulary gap translates directly to lost
                            revenue. Amazon estimates that every 100ms of latency costs 1% of sales; invisible inventory due
                            to vocabulary mismatch costs far more.
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Stethoscope className="w-5 h-5 text-blue-500" /> Healthcare
                        </h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            A patient searching &quot;heart attack symptoms&quot; might miss a critical article about
                            &quot;myocardial infarction indicators.&quot; The information isn&apos;t just useful — it could
                            be life-saving — but the lexical barrier prevents discovery. Medical terminology creates an
                            extreme version of the cross-domain vocabulary gap.
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Scale className="w-5 h-5 text-purple-500" /> Legal
                        </h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            Attorneys looking for cases about &quot;breach of contract&quot; need to also find
                            &quot;contractual violation,&quot; &quot;default on agreement,&quot; and &quot;failure to perform
                            obligations.&quot; Missing any of these synonymous formulations means missing potentially
                            critical precedent that could change case outcomes.
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-green-500" /> Enterprise Knowledge
                        </h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            Employees searching &quot;how to set up VPN&quot; might not find the IT article titled
                            &quot;Remote Access Network Configuration Guide.&quot; The knowledge exists, people need it,
                            but vocabulary mismatch makes it invisible. This leads to duplicate documentation, support
                            ticket escalation, and knowledge silos.
                        </p>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 3. Five Failure Modes */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Five Failure Modes of Keyword Search</h2>
                <p className="text-foreground leading-relaxed">
                    The vocabulary mismatch manifests in five distinct patterns, each representing a different type of
                    linguistic gap that keyword search cannot bridge. Understanding these patterns reveals why semantic
                    search exists and what specific problems it solves.
                </p>

                {/* Failure Mode 1 */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 p-6 rounded-xl">
                    <h3 className="font-bold text-red-800 mb-3 text-lg flex items-center gap-2">
                        <Search className="w-5 h-5" /> 1. Synonym Blindness
                    </h3>
                    <p className="text-sm text-red-700 leading-relaxed mb-4">
                        The most obvious failure: different words for the same concept produce zero match. &quot;automobile&quot;
                        vs. &quot;car&quot; vs. &quot;vehicle&quot; vs. &quot;motor car&quot; — these are all the same thing,
                        but BM25 treats them as completely unrelated terms. A document about &quot;automobile maintenance&quot;
                        is invisible to a query for &quot;car repair.&quot;
                    </p>
                    <p className="text-sm text-red-700 leading-relaxed">
                        Traditional mitigation is <strong>synonym dictionaries</strong>, but these are fundamentally limited.
                        They require manual curation by domain experts, must be updated constantly as language evolves, can
                        introduce noise (not all synonyms are appropriate in all contexts), and never achieve complete coverage.
                        A synonym dictionary might define &quot;car ↔ automobile,&quot; but it won&apos;t capture &quot;whip&quot;
                        (slang), &quot;ride,&quot; or industry terms like &quot;unit&quot; (car dealerships).
                    </p>
                </div>

                {/* Failure Mode 2 */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 p-6 rounded-xl">
                    <h3 className="font-bold text-purple-800 mb-3 text-lg flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" /> 2. Polysemy (Same Word, Different Meaning)
                    </h3>
                    <p className="text-sm text-purple-700 leading-relaxed mb-4">
                        The inverse problem: a single word has <strong>multiple unrelated meanings</strong>, and keyword search
                        cannot distinguish between them. &quot;Bank&quot; could mean a financial institution, a river bank,
                        a blood bank, or a data bank. &quot;Apple&quot; could be a fruit or a technology company. &quot;Python&quot;
                        could be a snake, a programming language, or a Monty Python reference.
                    </p>
                    <p className="text-sm text-purple-700 leading-relaxed">
                        When a user searches for &quot;python crash,&quot; are they looking for a snake attack video or a
                        Python programming error? BM25 has no way to know — it matches documents containing both &quot;python&quot;
                        and &quot;crash&quot; regardless of meaning. This is not a problem synonym dictionaries can solve. It
                        requires understanding the <strong>context</strong> around words, which is exactly what embedding models provide.
                    </p>
                </div>

                {/* Failure Mode 3 */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-6 rounded-xl">
                    <h3 className="font-bold text-blue-800 mb-3 text-lg flex items-center gap-2">
                        <FileQuestion className="w-5 h-5" /> 3. Conceptual and Intent-Based Queries
                    </h3>
                    <p className="text-sm text-blue-700 leading-relaxed mb-4">
                        Modern users increasingly express their search needs as questions or concepts rather than keyword
                        fragments: &quot;things to do when bored,&quot; &quot;how does the economy affect housing prices,&quot;
                        &quot;why does my car make a grinding noise when I brake.&quot; BM25 can only work with the individual
                        terms — documents about &quot;entertainment ideas&quot; or &quot;hobby suggestions&quot; won&apos;t
                        match because they don&apos;t contain the word &quot;bored.&quot;
                    </p>
                    <p className="text-sm text-blue-700 leading-relaxed">
                        This is becoming increasingly critical as search interfaces evolve. Voice search, conversational AI,
                        and natural language interfaces all produce full sentences, not keyword fragments. A search system
                        built only for &quot;laptop reviews 2024&quot; will fail when users ask &quot;what laptop should I
                        buy for college?&quot;
                    </p>
                </div>

                {/* Failure Mode 4 */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-6 rounded-xl">
                    <h3 className="font-bold text-green-800 mb-3 text-lg flex items-center gap-2">
                        <Globe className="w-5 h-5" /> 4. Cross-Domain and Cross-Register Gaps
                    </h3>
                    <p className="text-sm text-green-700 leading-relaxed mb-4">
                        Technical communities develop specialized vocabulary that doesn&apos;t overlap with everyday language.
                        A software engineer&apos;s &quot;deploy to production&quot; is a manager&apos;s &quot;launch the update.&quot;
                        A doctor&apos;s &quot;idiopathic etiology&quot; is a patient&apos;s &quot;they don&apos;t know what&apos;s
                        causing it.&quot; A lawyer&apos;s &quot;tortious interference&quot; is a layperson&apos;s &quot;they messed
                        up my business deal.&quot;
                    </p>
                    <p className="text-sm text-green-700 leading-relaxed">
                        When the searcher and the document author come from different professional or cultural backgrounds,
                        keyword matching breaks down completely. The semantic meaning is identical, but the surface-level
                        text shares no terms.
                    </p>
                </div>

                {/* Failure Mode 5 */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 p-6 rounded-xl">
                    <h3 className="font-bold text-amber-800 mb-3 text-lg flex items-center gap-2">
                        <Code2 className="w-5 h-5" /> 5. The Short Query Problem
                    </h3>
                    <p className="text-sm text-amber-700 leading-relaxed mb-4">
                        Most real-world search queries are surprisingly short — typically <strong>2-3 words</strong>. This
                        gives BM25 very little signal to work with. &quot;python error&quot; — which error? In what context?
                        What version? &quot;best restaurant&quot; — best by what criteria? What cuisine? What location?
                    </p>
                    <p className="text-sm text-amber-700 leading-relaxed">
                        With so few terms, keyword search returns an overwhelming number of partially relevant results.
                        The user must dig through pages of results, mentally filtering based on context that the search
                        engine couldn&apos;t understand. Embedding models address this by mapping even short queries into
                        a rich vector space where proximity to documents captures latent meaning beyond the literal words.
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 4. Traditional Fixes */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Traditional Attempts to Fix This</h2>
                <p className="text-foreground leading-relaxed">
                    Search engineers have developed several techniques to bridge the vocabulary gap within keyword-based
                    systems. While each helps incrementally, none solves the fundamental problem. Understanding their
                    limitations explains why the industry moved to embedding-based approaches.
                </p>

                <p className="text-foreground leading-relaxed">
                    <strong>Stemming and Lemmatization</strong> reduce words to their root form: &quot;running&quot; →
                    &quot;run,&quot; &quot;better&quot; → &quot;good.&quot; This helps with morphological variations but
                    doesn&apos;t cross word boundaries. &quot;Automobile&quot; will never stem to &quot;car.&quot;
                    <strong> Synonym Dictionaries</strong> map related words but require human curation, can&apos;t scale,
                    get stale, and introduce false synonyms — &quot;light&quot; means &quot;not heavy&quot; in &quot;light
                    bag&quot; but &quot;illumination&quot; in &quot;light source.&quot;
                </p>

                <p className="text-foreground leading-relaxed">
                    <strong>Query expansion</strong> automatically adds related terms but dramatically hurts precision
                    because the expanded terms are often noisy. Expanding &quot;java&quot; to include &quot;coffee&quot;
                    will pollute programming search results. <strong>Pseudo-relevance feedback</strong> takes top results
                    from the initial query, extracts common terms, and re-runs — but amplifies any errors in the initial
                    results. If the first page of results is off-topic, PRF pushes results further off-topic.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Technique</th>
                                <th className="text-left p-3 border-b font-semibold">What It Helps</th>
                                <th className="text-left p-3 border-b font-semibold">What It Can&apos;t Fix</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-medium">Stemming</td><td className="p-3">&quot;running&quot; ↔ &quot;run&quot;</td><td className="p-3">&quot;car&quot; ↔ &quot;automobile&quot;</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Synonyms</td><td className="p-3">&quot;car&quot; ↔ &quot;automobile&quot;</td><td className="p-3">Context-dependent meanings</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Query expansion</td><td className="p-3">Related terms</td><td className="p-3">Precision (adds noise)</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">N-grams</td><td className="p-3">Multi-word phrases</td><td className="p-3">Conceptual matching</td></tr>
                            <tr><td className="p-3 font-medium">PRF</td><td className="p-3">Domain vocabulary</td><td className="p-3">Initial bad results cascade</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># The maintenance burden of manual synonym management</div>
                    <div className="space-y-2">
                        <div><span className="text-green-400">synonyms.txt (v1):</span> car, automobile, vehicle</div>
                        <div><span className="text-green-400">synonyms.txt (v47):</span> car, automobile, vehicle, auto, ride, whip, wheels, ...</div>
                        <div><span className="text-yellow-400">6 months later:</span> 12,000 synonym groups × 8 languages = 96,000 rules</div>
                        <div><span className="text-red-400">Problem:</span> &quot;light beer&quot; expands to &quot;lamp beer&quot; 🍺💡</div>
                        <div><span className="text-red-400">Problem:</span> &quot;java developer&quot; expands to &quot;coffee developer&quot; ☕</div>
                        <div className="text-zinc-500 mt-2">Synonym dictionaries are incremental band-aids on a fundamental architectural limitation</div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. The Semantic Search Promise */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. The Semantic Search Promise</h2>
                <p className="text-foreground leading-relaxed">
                    Semantic search solves the vocabulary mismatch by representing both queries and documents as <strong>dense
                    vectors in a shared embedding space</strong> where geometric proximity encodes semantic similarity. The
                    core insight is revolutionary: instead of comparing words, compare <strong>meanings</strong>. An embedding
                    model learns that &quot;cheap flights&quot; and &quot;budget airline tickets&quot; express the same intent,
                    even though they share zero words.
                </p>

                <p className="text-foreground leading-relaxed">
                    This works because embedding models are trained on billions of text examples, learning that words appearing
                    in similar contexts have similar meanings. The model doesn&apos;t need a synonym dictionary — it has learned
                    a continuous, high-dimensional map of language where meaning, not spelling, determines location.
                </p>

                {/* Code Example */}
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">semantic_vs_keyword.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-zinc-500"># BM25: &quot;cheap flights&quot; vs &quot;budget airline tickets&quot;</span></div>
                            <div><span className="text-zinc-300">bm25_score = </span><span className="text-orange-300">0.0</span><span className="text-zinc-500">  # No matching terms → zero score</span></div>
                            <div className="mt-2"><span className="text-zinc-500"># Semantic search: Both map to nearby points in vector space</span></div>
                            <div><span className="text-zinc-300">query_vec = embed(</span><span className="text-green-300">&quot;cheap flights&quot;</span><span className="text-zinc-300">)</span><span className="text-zinc-500">          # [0.21, -0.08, 0.78, ...]</span></div>
                            <div><span className="text-zinc-300">doc_vec   = embed(</span><span className="text-green-300">&quot;budget airline tickets&quot;</span><span className="text-zinc-300">)</span><span className="text-zinc-500"> # [0.19, -0.11, 0.81, ...]</span></div>
                            <div><span className="text-zinc-300">cosine_similarity(query_vec, doc_vec) ≈ </span><span className="text-green-400 font-bold">0.95</span><span className="text-zinc-500">  # High similarity!</span></div>
                            <div className="mt-2"><span className="text-zinc-500"># Even more impressively:</span></div>
                            <div><span className="text-zinc-300">embed(</span><span className="text-green-300">&quot;how to fix a flat tire&quot;</span><span className="text-zinc-300">)</span><span className="text-zinc-500"> ≈ embed(&quot;puncture repair guide&quot;)</span></div>
                            <div><span className="text-zinc-300">embed(</span><span className="text-green-300">&quot;stomach ache remedies&quot;</span><span className="text-zinc-300">)</span><span className="text-zinc-500"> ≈ embed(&quot;GI treatment options&quot;)</span></div>
                            <div><span className="text-zinc-300">embed(</span><span className="text-green-300">&quot;my car won&apos;t start&quot;</span><span className="text-zinc-300">)</span><span className="text-zinc-500">    ≈ embed(&quot;ignition troubleshooting&quot;)</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 6. Why Not Just Use Semantic Search? */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">6. Why Not Replace Keyword Search Entirely?</h2>
                <p className="text-foreground leading-relaxed">
                    If semantic search is so powerful, why not replace keyword search entirely? Because semantic search has
                    its own failure modes that are the <strong>mirror image</strong> of keyword search&apos;s weaknesses.
                    Understanding these is critical for making the right architectural decisions.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg text-red-800">🎯 Exact Match Failure</h3>
                        <p className="text-sm text-red-700 leading-relaxed">
                            Searching for &quot;SKU-2847-B&quot; returns similar-looking SKUs because embeddings treat all
                            alphanumeric codes as roughly equivalent. Keyword search finds the exact string instantly.
                            Product IDs, case numbers, error codes — all require exact matching.
                        </p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg text-orange-800">📉 Information Loss</h3>
                        <p className="text-sm text-orange-700 leading-relaxed">
                            Embeddings compress an entire document into ~768 floats. Specific numbers, dates, measurements,
                            and exact phrases are lost. &quot;What is the horsepower of a 2024 Camry?&quot; requires exact
                            facts, not semantic similarity.
                        </p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg text-amber-800">🚫 Negation Blindness</h3>
                        <p className="text-sm text-amber-700 leading-relaxed">
                            &quot;Hotels with pool&quot; and &quot;hotels without pool&quot; produce nearly identical
                            embeddings (cosine ≈ 0.95). The logical negation &quot;without&quot; barely changes the vector
                            because bi-encoders are trained for topical similarity, not logical structure.
                        </p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg text-yellow-800">💰 Computational Cost</h3>
                        <p className="text-sm text-yellow-700 leading-relaxed">
                            Generating embeddings requires neural network inference. Comparing billions of vectors requires
                            specialized indexes and significant RAM. All of this costs significantly more than inverted indexes.
                            At billion-scale, vector infrastructure can cost $15-30K/month.
                        </p>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> The Production Answer
                    </div>
                    <p className="text-blue-700">
                        <strong>Hybrid search</strong> (Chapter 6.7): combine keyword precision with semantic understanding.
                        BM25 handles exact IDs, negation, and structured queries. Vectors handle vocabulary mismatch, conceptual
                        queries, and intent matching. Together they provide robust retrieval for every query type.
                    </p>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Chapter 6 Overview
                </Link>
                <Link href="/search/vector-search/embeddings" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.2 Embeddings 101 <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
