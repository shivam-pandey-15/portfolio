"use client";

import Link from "next/link";
import { Scissors, ArrowRight, ArrowLeft, FileText, AlignLeft, Layers, Puzzle, Settings2 } from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Chunking Impacts Quality More Than Model Choice", description: "Bad chunking with a great embedding model produces worse results than good chunking with a mediocre model. The right chunk size and strategy can improve retrieval quality by 15-30% with zero model changes." },
    { title: "256-512 Tokens Is the Sweet Spot", description: "Too small (< 100 tokens): loses context, increases index size. Too large (> 1000 tokens): dilutes specific information, embedding can't capture everything. 256-512 tokens balances granularity with context." },
    { title: "Overlap Prevents Information Loss at Boundaries", description: "A fact that spans two chunks gets split and becomes unfindable by either chunk's embedding. 10-15% overlap (25-50 tokens) ensures boundary information appears in at least one chunk." },
    { title: "Structure-Aware Chunking Beats Character Splitting", description: "Split on document structure (sections, paragraphs, markdown headers) rather than fixed character counts. A chunk that starts mid-sentence produces a meaningless embedding." },
];

export default function ChunkingPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.10</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Document Chunking Strategies</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            Before you can embed a document, you must decide how to split it. This seemingly mundane
                            preprocessing step has an outsized impact on retrieval quality — arguably more than model choice.
                        </p>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-pink-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-pink-700 font-medium text-sm"><FileText className="w-4 h-4" /> Sweet Spot</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">256-512</p>
                        <p className="text-sm text-zinc-600">Tokens per chunk. Balances granularity with semantic completeness.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-amber-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-amber-700 font-medium text-sm"><Puzzle className="w-4 h-4" /> Overlap</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">10-15%</p>
                        <p className="text-sm text-zinc-600">Of chunk size as overlap. Prevents facts from being lost at boundaries.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><Layers className="w-4 h-4" /> Index Growth</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">5-20x</p>
                        <p className="text-sm text-zinc-600">More vectors than documents. 1M docs → 5-20M chunks to embed.</p>
                    </div>
                </div>
            </div>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. Why Chunking Matters</h2>
                <p className="text-foreground leading-relaxed">
                    Embedding models have a fixed context window (typically 512 tokens for BERT-based, 8K for newer models).
                    A 50-page legal document must be split into chunks that individually capture searchable concepts. The
                    critical insight: <strong>the chunk, not the document, is the unit of retrieval</strong>. Each chunk
                    gets its own embedding, and search returns chunks, not documents.
                </p>
                <p className="text-foreground leading-relaxed">
                    This means chunk quality directly determines retrieval quality. A chunk that starts mid-sentence and
                    ends mid-paragraph produces a meaningless embedding. A chunk that&apos;s too large dilutes the
                    specific information a user is looking for in a sea of surrounding text. A chunk that&apos;s too
                    small loses the context needed to understand the information.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Chunking Strategies</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2"><AlignLeft className="w-5 h-5 text-blue-500" /> Fixed-Size</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            Split every N tokens with M-token overlap. Simple, predictable, and works surprisingly well.
                            The baseline that other strategies are compared against. Use N=512, M=50 as starting values.
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-green-500" /> Sentence-Based</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            Group complete sentences up to a token limit. Preserves sentence boundaries so every chunk
                            starts and ends at natural breaks. Slightly better quality than fixed-size for prose.
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2"><Layers className="w-5 h-5 text-purple-500" /> Recursive</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            Try splitting by section → paragraph → sentence → character, keeping chunks under a max size.
                            LangChain&apos;s default. Respects document hierarchy while staying within token limits.
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2"><Settings2 className="w-5 h-5 text-orange-500" /> Structure-Aware</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            Parse document structure (markdown headers, HTML sections, code functions) and split at
                            structural boundaries. Best for technical documentation, code, and well-structured content.
                        </p>
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. The Overlap Problem</h2>
                <p className="text-foreground leading-relaxed">
                    Consider a document that states: &quot;The maximum batch size is 256. Performance degrades significantly
                    above this threshold.&quot; If this fact falls exactly at a chunk boundary, the first chunk gets
                    &quot;The maximum batch size is 256.&quot; and the second gets &quot;Performance degrades significantly
                    above this threshold.&quot; Neither chunk alone captures the complete fact. The query &quot;what causes
                    performance degradation?&quot; might miss chunk 1, while &quot;what is the maximum batch size?&quot;
                    might miss chunk 2.
                </p>
                <p className="text-foreground leading-relaxed">
                    Overlap solves this by duplicating text at chunk boundaries. With 10-15% overlap, both chunks contain
                    the full passage. The cost: 10-15% more chunks to embed and store. This is a good tradeoff — the
                    memory cost is linear while the retrieval quality improvement is significant for boundary-spanning facts.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Production Recommendations</h2>
                <p className="text-foreground leading-relaxed">
                    Start with <strong>recursive/sentence-based chunking at 256-512 tokens with 10-15% overlap</strong>.
                    For code, split by function/class. For markdown, split by headers. Always prepend the section title
                    or document metadata to each chunk so it has topical context even in isolation. Run A/B tests
                    comparing chunk sizes against your evaluation dataset — the optimal size varies by domain.
                </p>
            </section>

            <KeyTakeaways takeaways={takeaways} />

            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/cost" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.9 Cost at Scale
                </Link>
                <Link href="/search/vector-search/databases" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.11 Vector Databases <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
