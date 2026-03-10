"use client";

import Link from "next/link";
import { Search, ArrowRight, ArrowLeft, AlertTriangle, XCircle, HelpCircle, Brain } from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Vocabulary Mismatch Is Fundamental", description: "Users and authors describe the same concept with different words. Furnas et al. (1987) showed users agree on the same term only 20% of the time — BM25 finds zero matches for the other 80%." },
    { title: "Semantic Failures Are Invisible", description: "Unlike zero-result failures, keyword search silently returns wrong results when synonyms, polysemy, or conceptual gaps exist. Users blame themselves, not the search system." },
    { title: "Stemming and Synonyms Don't Scale", description: "Traditional fixes like stemming, synonym dictionaries, and query expansion help at the margins but require constant manual maintenance and can't handle novel vocabulary or cross-domain queries." },
    { title: "Dense Retrieval Complements, Not Replaces", description: "Semantic search solves vocabulary mismatch but introduces its own failures (exact match, negation, domain jargon). The production solution is always hybrid: BM25 + vectors together." },
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
                            fundamental motivation for semantic search.
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-red-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-red-700 font-medium text-sm">
                            <XCircle className="w-4 h-4" /> Term Agreement
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">~20%</p>
                        <p className="text-sm text-zinc-600">Users agree on the same keyword for a concept only 20% of the time (Furnas 1987).</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-amber-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-amber-700 font-medium text-sm">
                            <HelpCircle className="w-4 h-4" /> Failure Modes
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">6+</p>
                        <p className="text-sm text-zinc-600">Synonym blindness, polysemy, conceptual queries, acronyms, multilingual, negation.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm">
                            <Brain className="w-4 h-4" /> The Fix
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">Hybrid</p>
                        <p className="text-sm text-zinc-600">Neither keyword nor semantic alone — production systems combine both approaches.</p>
                    </div>
                </div>
            </div>

            {/* Section 1: The Vocabulary Mismatch Problem */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. The Vocabulary Mismatch Problem</h2>
                <p className="text-foreground leading-relaxed">
                    George Furnas and colleagues at Bell Labs conducted a landmark study in 1987 that quantified what every
                    search engineer eventually discovers: people are remarkably inconsistent in the words they choose to describe
                    the same concept. When asked to name a common object or action, two people independently chose the same word
                    only about 20% of the time. This means that for any given query-document pair describing the same concept,
                    there&apos;s an 80% chance the user&apos;s query term simply doesn&apos;t appear in the relevant document.
                </p>
                <p className="text-foreground leading-relaxed">
                    For BM25 and TF-IDF, which score relevance based on exact term overlap between query and document, this is
                    catastrophic. A document about &quot;affordable smartphones&quot; scores zero for the query &quot;budget
                    mobile phones&quot; because there&apos;s no term overlap — despite perfect semantic relevance.
                    The search system doesn&apos;t return bad results; it returns <strong>no results</strong> for queries
                    where the vocabulary happens to diverge.
                </p>
                <p className="text-foreground leading-relaxed">
                    This isn&apos;t a bug to fix — it&apos;s a fundamental limitation of the bag-of-words assumption that
                    underlies all keyword-based retrieval. As long as scoring depends on matching character sequences,
                    any vocabulary gap between user and author creates a blind spot that no amount of BM25 tuning can resolve.
                </p>
            </section>

            {/* Section 2: Failure Modes */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Six Failure Modes of Keyword Search</h2>
                <p className="text-foreground leading-relaxed">
                    The vocabulary mismatch manifests in several distinct patterns, each representing a different type of
                    linguistic gap that keyword search cannot bridge. Understanding these patterns reveals why semantic
                    search exists and what specific problems it solves.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg">🔍 Synonym Blindness</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            &quot;car&quot; vs &quot;automobile&quot; vs &quot;vehicle.&quot; BM25 treats these as completely
                            unrelated terms. A document about &quot;automobile maintenance&quot; gets zero score for the
                            query &quot;car repair&quot; even though it&apos;s exactly what the user needs.
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg">🎭 Polysemy Confusion</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            &quot;Python&quot; matches programming language docs AND snake docs. &quot;Apple&quot; matches
                            the company AND the fruit. BM25 can&apos;t distinguish which meaning the user intends — it
                            returns all documents containing the string regardless of context.
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg">💡 Conceptual Queries</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            &quot;How to make my website faster&quot; requires understanding the concept of web performance
                            optimization. The best document might use terms like &quot;CDN,&quot; &quot;lazy loading,&quot;
                            and &quot;caching&quot; — none of which appear in the query.
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg">🌐 Cross-Language Gaps</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            Acronyms (ML vs Machine Learning), abbreviations (JS vs JavaScript), and multilingual content
                            (Kubernetes documentation existing in English while the query is in Spanish) create zero-overlap
                            scenarios that are completely opaque to keyword matching.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 3: Why Traditional Fixes Fail */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Why Traditional Fixes Don&apos;t Scale</h2>
                <p className="text-foreground leading-relaxed">
                    Search teams have tried to patch keyword search for decades. Stemming reduces &quot;running,&quot;
                    &quot;runs,&quot; and &quot;ran&quot; to the common stem &quot;run.&quot; Synonym dictionaries map
                    &quot;car&quot; → &quot;automobile.&quot; Query expansion adds related terms automatically. These
                    techniques help at the margins but have fundamental limitations.
                </p>
                <p className="text-foreground leading-relaxed">
                    Synonym dictionaries require <strong>manual curation</strong> — someone must define every mapping.
                    For a large e-commerce catalog, this means maintaining tens of thousands of synonym rules across
                    multiple languages. New products, brands, and slang constantly create gaps. And synonyms are
                    context-dependent: &quot;light&quot; as a synonym for &quot;not heavy&quot; is wrong when the user
                    means &quot;lamp.&quot;
                </p>

                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># The maintenance burden of manual synonym management</div>
                    <div className="space-y-2">
                        <div><span className="text-green-400">synonyms.txt (v1):</span> car, automobile, vehicle</div>
                        <div><span className="text-green-400">synonyms.txt (v47):</span> car, automobile, vehicle, auto, ride, whip, wheels, ...</div>
                        <div><span className="text-yellow-400">6 months later:</span> 12,000 synonym groups × 8 languages = 96,000 rules</div>
                        <div><span className="text-red-400">Problem:</span> &quot;light beer&quot; expands to &quot;lamp beer&quot; 🍺💡</div>
                    </div>
                </div>
            </section>

            {/* Section 4: The Promise of Semantic Search */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. The Promise of Dense Retrieval</h2>
                <p className="text-foreground leading-relaxed">
                    Semantic search solves vocabulary mismatch by representing both queries and documents as dense vectors
                    in a shared embedding space. Instead of matching character sequences, it matches <strong>meaning</strong>.
                    &quot;Affordable smartphones&quot; and &quot;budget mobile phones&quot; produce similar vectors because
                    the embedding model learned from billions of text examples that these phrases mean the same thing.
                </p>
                <p className="text-foreground leading-relaxed">
                    But semantic search introduces its own failure modes: it struggles with exact identifiers (SKU codes),
                    negation (&quot;not&quot; barely changes the embedding), and domain-specific terminology. This is why
                    modern production systems use <strong>hybrid search</strong> — combining the precision of BM25 keyword
                    matching with the semantic understanding of dense vectors. Neither alone is sufficient.
                </p>
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
