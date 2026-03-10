"use client";

import Link from "next/link";
import {
    Scissors, ArrowRight, ArrowLeft, Zap, AlertTriangle,
    Layers, FileText, Settings, Code2, Target,
    BarChart3, GitBranch
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Chunking Has More Impact Than Model Choice", description: "A mediocre embedding model with good chunks outperforms a great model with bad chunks. How you split documents determines what unit of information can be retrieved — and what context is lost." },
    { title: "256-512 Tokens Is the Sweet Spot", description: "Smaller chunks improve precision (find the exact fact). Larger chunks preserve context (understand the fact). 256-512 tokens captures 1-2 paragraphs — enough for coherent explanation with context, focused enough for a meaningful embedding." },
    { title: "Recursive Splitting Is the Best Default", description: "Try paragraph boundaries first (\\n\\n), fall back to sentences, then words. LangChain's default for good reason: paragraphs are usually ideal chunk boundaries. Handles most document types well out-of-the-box." },
    { title: "Always Prepend Context to Every Chunk", description: "Adding document title + section header to every chunk improves retrieval by 5-15%. 'pip install faiss-cpu' → vague. 'FAISS Library > Installation Guide: pip install faiss-cpu' → specific and accurate." },
    { title: "Overlap of 10-20% Prevents Information Loss", description: "Sentences split at chunk boundaries appear in full in at least one chunk. chunk_size=512 → overlap=50-100 tokens. Too much overlap (>30%) wastes storage and confuses retrieval with near-duplicate chunks." },
];

export default function ChunkingPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero */}
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
                            preprocessing step has an <strong>outsized impact on retrieval quality</strong> — arguably
                            more than the choice of embedding model. This chapter covers fixed-size, sentence-based,
                            recursive, semantic, and structure-aware chunking.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm"><Target className="w-4 h-4" /> Sweet Spot</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">256-512</p>
                        <p className="text-sm text-zinc-600">tokens per chunk. Balances precision (find the fact) with context (understand it).</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><Layers className="w-4 h-4" /> Context Boost</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">5-15%</p>
                        <p className="text-sm text-zinc-600">Retrieval improvement from prepending document/section title to every chunk.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-amber-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-amber-700 font-medium text-sm"><GitBranch className="w-4 h-4" /> Overlap</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">10-20%</p>
                        <p className="text-sm text-zinc-600">Of chunk size. Ensures sentences at boundaries appear in full.</p>
                    </div>
                </div>
            </div>

            {/* 1. Fixed-Size */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. Fixed-Size Chunking</h2>
                <p className="text-foreground leading-relaxed">
                    The simplest strategy: split text every N tokens regardless of content boundaries. The tokenizer
                    counts tokens (not characters), and you cut at every 512 (or whatever your target is). The
                    overlap parameter slides the window back by a fixed number of tokens, so sentences at chunk
                    boundaries appear in full in at least one chunk. This is the baseline approach that every
                    other strategy is measured against.
                </p>

                <p className="text-foreground leading-relaxed">
                    Fixed-size chunking works surprisingly well for homogeneous text (news articles, Wikipedia) where
                    paragraph boundaries occur naturally every 200-400 tokens. It fails badly on structured content
                    (code, tables, legal documents) where a 512-token cut might split a function body, table row,
                    or contract clause in half — producing two chunks that are each meaningless on their own.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">fixed_size_chunk.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">fixed_size_chunk</span><span className="text-zinc-300">(text, chunk_size=512, overlap=50):</span></div>
                            <div className="pl-4"><span className="text-zinc-300">tokens = tokenize(text)</span></div>
                            <div className="pl-4"><span className="text-zinc-300">chunks = []</span></div>
                            <div className="pl-4"><span className="text-zinc-300">start = </span><span className="text-orange-300">0</span></div>
                            <div className="pl-4"><span className="text-pink-400">while</span><span className="text-zinc-300"> start &lt; </span><span className="text-yellow-300">len</span><span className="text-zinc-300">(tokens):</span></div>
                            <div className="pl-8"><span className="text-zinc-300">end = start + chunk_size</span></div>
                            <div className="pl-8"><span className="text-zinc-300">chunks.append(detokenize(tokens[start:end]))</span></div>
                            <div className="pl-8"><span className="text-zinc-300">start = end - overlap</span><span className="text-zinc-500">  # Slide back for overlap</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> chunks</span></div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm">
                        <div className="font-bold text-green-800 mb-1">Advantages</div>
                        <ul className="text-green-700 space-y-1 list-disc list-inside">
                            <li>Simple and predictable — know exactly how many chunks</li>
                            <li>Fast — no NLP processing needed</li>
                            <li>Uniform embedding quality (consistent token count)</li>
                        </ul>
                    </div>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm">
                        <div className="font-bold text-red-800 mb-1">Disadvantages</div>
                        <ul className="text-red-700 space-y-1 list-disc list-inside">
                            <li>Splits mid-sentence, mid-paragraph, mid-table</li>
                            <li>Cause-and-effect separated across chunks</li>
                            <li>Code blocks fragmented into meaningless pieces</li>
                        </ul>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. Sentence-Based */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Sentence-Based Chunking</h2>
                <p className="text-foreground leading-relaxed">
                    An improvement over fixed-size: first split text into individual sentences using a sentence
                    tokenizer (NLTK&apos;s <code>sent_tokenize</code> or spaCy&apos;s sentence detector), then greedily
                    accumulate sentences into chunks until reaching the target token limit. <strong>No sentence is
                    ever split</strong> across chunks, which means every chunk contains only complete thoughts.
                    Overlap is measured in sentences, not tokens — carry over the last N sentences from the
                    previous chunk to the next.
                </p>

                <p className="text-foreground leading-relaxed">
                    This produces chunks of varying size (some may be 300 tokens, others 480) because sentence
                    lengths vary. The inconsistency is a trade-off worth making: complete sentences generate
                    much better embeddings than truncated fragments. The main limitation is that sentence
                    tokenizers can struggle with abbreviations ("Dr. Smith"), code snippets, or non-standard
                    formatting.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">sentence_chunk.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">import</span><span className="text-zinc-300"> nltk</span></div>
                            <div className="mt-1"><span className="text-pink-400">def</span> <span className="text-yellow-300">sentence_chunk</span><span className="text-zinc-300">(text, max_tokens=512, overlap_sentences=2):</span></div>
                            <div className="pl-4"><span className="text-zinc-300">sentences = nltk.sent_tokenize(text)</span></div>
                            <div className="pl-4"><span className="text-zinc-300">chunks, current = [], []</span></div>
                            <div className="pl-4"><span className="text-zinc-300">current_tokens = </span><span className="text-orange-300">0</span></div>
                            <div className="pl-4"><span className="text-pink-400">for</span><span className="text-zinc-300"> sent </span><span className="text-pink-400">in</span><span className="text-zinc-300"> sentences:</span></div>
                            <div className="pl-8"><span className="text-pink-400">if</span><span className="text-zinc-300"> current_tokens + count(sent) &gt; max_tokens </span><span className="text-pink-400">and</span><span className="text-zinc-300"> current:</span></div>
                            <div className="pl-12"><span className="text-zinc-300">chunks.append(</span><span className="text-green-300">&apos; &apos;</span><span className="text-zinc-300">.join(current))</span></div>
                            <div className="pl-12"><span className="text-zinc-300">current = current[-overlap_sentences:]</span><span className="text-zinc-500">  # Carry over N sentences</span></div>
                            <div className="pl-8"><span className="text-zinc-300">current.append(sent)</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> chunks</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 3. Recursive */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Recursive Character Splitting</h2>
                <p className="text-foreground leading-relaxed">
                    The most popular strategy in practice, and LangChain&apos;s default for good reason. Instead of
                    committing to one type of boundary (tokens or sentences), recursive splitting tries a hierarchy
                    of separators from best to worst. It first attempts to split on paragraph boundaries (double
                    newlines), which are the most natural semantic breaks. If a paragraph is still too long, it
                    falls back to line breaks, then sentences, then words, and finally individual characters.
                </p>

                <p className="text-foreground leading-relaxed">
                    This approach is pragmatic: for most documents, paragraph-level splitting captures ~80% of the
                    benefit of more advanced methods. It handles mixed-format documents gracefully (prose paragraphs
                    split nicely, while a long code block falls back to line-level splitting). The hierarchy below
                    shows the separators in order:
                </p>

                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># Separator hierarchy (best → fallback)</div>
                    <div className="space-y-1 text-xs">
                        <div>1. <span className="text-green-400">&quot;\n\n&quot;</span>  Paragraph boundaries — <span className="text-zinc-500">best semantic separation</span></div>
                        <div>2. <span className="text-blue-400">&quot;\n&quot;</span>    Line breaks — <span className="text-zinc-500">good for structured text</span></div>
                        <div>3. <span className="text-yellow-400">&quot;. &quot;</span>   Sentences — <span className="text-zinc-500">preserve complete thoughts</span></div>
                        <div>4. <span className="text-pink-400">&quot; &quot;</span>     Words — <span className="text-zinc-500">last resort</span></div>
                        <div>5. <span className="text-red-400">&quot;&quot;</span>      Characters — <span className="text-zinc-500">absolute fallback</span></div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-blue-800 mb-2">Why It&apos;s the Best Default</div>
                    <p className="text-blue-700">
                        Paragraphs are usually the ideal chunk boundary (complete thoughts). Trying them first captures
                        most of the benefit. When too long, falling back to sentences is a reasonable second choice.
                        Pragmatic and works well &quot;out of the box&quot; for most documents.
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 4. Semantic */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Semantic Chunking</h2>
                <p className="text-foreground leading-relaxed">
                    Rather than relying on formatting cues (newlines, punctuation), semantic chunking uses the
                    <strong>actual content</strong> to determine where to split. The idea: embed each sentence, then
                    compare adjacent sentence embeddings using cosine similarity. When similarity drops sharply
                    between sentence N and sentence N+1, that indicates a topic shift — and a natural place to
                    cut.
                </p>

                <p className="text-foreground leading-relaxed">
                    This produces the highest-quality chunks because each chunk contains a coherent topic. However,
                    it has a significant cost: you need to embed every sentence individually (O(N) model passes),
                    which is expensive for large corpora. There&apos;s also a circular dependency problem — you need
                    an embedding model to chunk, but you also need chunks to build your index. In practice, you
                    can use a small, fast model (e.g., all-MiniLM-L6) for chunking and a different, better model
                    for the final index embeddings.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">semantic_chunk.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">semantic_chunk</span><span className="text-zinc-300">(text, model, threshold=0.75):</span></div>
                            <div className="pl-4"><span className="text-zinc-300">sentences = nltk.sent_tokenize(text)</span></div>
                            <div className="pl-4"><span className="text-zinc-300">embeddings = [model.encode(s) </span><span className="text-pink-400">for</span><span className="text-zinc-300"> s </span><span className="text-pink-400">in</span><span className="text-zinc-300"> sentences]</span></div>
                            <div className="pl-4"><span className="text-zinc-300">chunks, current = [], [sentences[</span><span className="text-orange-300">0</span><span className="text-zinc-300">]]</span></div>
                            <div className="pl-4"><span className="text-pink-400">for</span><span className="text-zinc-300"> i </span><span className="text-pink-400">in</span><span className="text-zinc-300"> </span><span className="text-yellow-300">range</span><span className="text-zinc-300">(</span><span className="text-orange-300">1</span><span className="text-zinc-300">, </span><span className="text-yellow-300">len</span><span className="text-zinc-300">(sentences)):</span></div>
                            <div className="pl-8"><span className="text-zinc-300">sim = cosine_similarity(embeddings[i-</span><span className="text-orange-300">1</span><span className="text-zinc-300">], embeddings[i])</span></div>
                            <div className="pl-8"><span className="text-pink-400">if</span><span className="text-zinc-300"> sim &lt; threshold:</span><span className="text-zinc-500">  # Topic shift → new chunk</span></div>
                            <div className="pl-12"><span className="text-zinc-300">chunks.append(</span><span className="text-green-300">&apos; &apos;</span><span className="text-zinc-300">.join(current))</span></div>
                            <div className="pl-12"><span className="text-zinc-300">current = [sentences[i]]</span></div>
                            <div className="pl-8"><span className="text-pink-400">else</span><span className="text-zinc-300">:</span></div>
                            <div className="pl-12"><span className="text-zinc-300">current.append(sentences[i])</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> chunks</span></div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm">
                        <div className="font-bold text-green-800 mb-1">Advantages</div>
                        <p className="text-green-700">Topic-aware boundaries, adaptive sizing, best embedding quality per chunk</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm">
                        <div className="font-bold text-red-800 mb-1">Disadvantages</div>
                        <p className="text-red-700">Expensive (O(N) model passes), threshold sensitivity, circular dependency with model</p>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. Structure-Aware */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. Structure-Aware Chunking</h2>
                <p className="text-foreground leading-relaxed">
                    Many documents aren&apos;t flat prose — they have headers, subheaders, bullet lists, code blocks,
                    and tables. Structure-aware chunking parses this formatting and uses it to create chunks that
                    respect the document&apos;s own organization. A Markdown parser can split on <code>##</code> headers,
                    an HTML parser on <code>&lt;section&gt;</code> tags, a PDF parser on heading fonts.
                </p>

                <p className="text-foreground leading-relaxed">
                    The <strong>most impactful technique</strong> in structure-aware chunking (and one that applies
                    to ALL strategies) is <strong>context prepending</strong>: adding the document title and section
                    header to the beginning of every chunk. This single change improves retrieval by 5-15% because
                    it gives the embedding model crucial context about what the chunk is about. Without it, a chunk
                    containing "pip install faiss-cpu" could be about any library installation. With it, the chunk
                    says "FAISS Library &gt; Installation Guide: pip install faiss-cpu" — unambiguous.
                </p>

                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="space-y-2 text-xs">
                        <div className="text-zinc-400">Without context:</div>
                        <div>&quot;pip install faiss-cpu. For GPU: pip install faiss-gpu.&quot;</div>
                        <div className="text-red-400">→ Embedding: something about pip installation (vague)</div>
                        <div className="mt-2 text-zinc-400">With context:</div>
                        <div>&quot;<span className="text-green-400">FAISS Library &gt; Installation Guide:</span> pip install faiss-cpu...&quot;</div>
                        <div className="text-green-400">→ Embedding: installing the FAISS library (specific and accurate)</div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 6. Chunk Size Guidelines */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">6. Chunk Size Guidelines</h2>
                <p className="text-foreground leading-relaxed">
                    Chunk size is the single most important parameter in your chunking pipeline. Smaller chunks
                    (50-128 tokens) are highly precise — they contain exactly one fact and embed that fact well.
                    But they lack surrounding context, making it hard to understand the fact in isolation. Larger
                    chunks (512-1024 tokens) preserve context and narrative flow, but the embedding becomes a
                    blur of multiple topics, reducing precision. The sweet spot for most applications is
                    <strong>256-512 tokens</strong>, which captures 1-2 paragraphs — enough for a coherent
                    explanation with context, focused enough for a meaningful embedding.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Chunk Size</th>
                                <th className="text-left p-3 border-b font-semibold">Precision</th>
                                <th className="text-left p-3 border-b font-semibold">Context</th>
                                <th className="text-left p-3 border-b font-semibold">Best For</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">50-100 tokens</td><td className="p-3 text-green-700">Very high</td><td className="p-3 text-red-700">Very low</td><td className="p-3">FAQs, definitions, single facts</td></tr>
                            <tr className="border-b"><td className="p-3">128-256 tokens</td><td className="p-3 text-green-700">High</td><td className="p-3">Moderate</td><td className="p-3">Q&amp;A, customer support</td></tr>
                            <tr className="border-b bg-green-50"><td className="p-3 font-medium">256-512 tokens</td><td className="p-3">Balanced</td><td className="p-3">Good</td><td className="p-3 font-medium">General purpose (recommended!)</td></tr>
                            <tr className="border-b"><td className="p-3">512-1024 tokens</td><td className="p-3">Moderate</td><td className="p-3 text-green-700">High</td><td className="p-3">Technical docs, research papers</td></tr>
                            <tr><td className="p-3">1024+ tokens</td><td className="p-3 text-red-700">Low</td><td className="p-3 text-green-700">Very high</td><td className="p-3">Long-context models, summarization</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 7. Decision Matrix */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">7. Decision Matrix</h2>
                <p className="text-foreground leading-relaxed">
                    Choosing the right chunking strategy depends on your document types, quality requirements, and
                    computational budget. For most teams, <strong>recursive splitting is the right default</strong>
                    — it&apos;s fast, requires no ML model, and handles diverse document types well. Only move to
                    semantic chunking if you have specific quality requirements that recursive doesn&apos;t meet,
                    and the computational cost of embedding every sentence is acceptable.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Factor</th>
                                <th className="text-left p-3 border-b font-semibold">Fixed</th>
                                <th className="text-left p-3 border-b font-semibold">Sentence</th>
                                <th className="text-left p-3 border-b font-semibold">Recursive</th>
                                <th className="text-left p-3 border-b font-semibold">Semantic</th>
                                <th className="text-left p-3 border-b font-semibold">Structure</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-medium">Complexity</td><td className="p-3 text-green-700">Low</td><td className="p-3 text-green-700">Low</td><td className="p-3">Medium</td><td className="p-3 text-red-700">High</td><td className="p-3">Medium</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Speed</td><td className="p-3 text-green-700">Fastest</td><td className="p-3">Fast</td><td className="p-3">Fast</td><td className="p-3 text-red-700">Slow</td><td className="p-3">Medium</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Quality</td><td className="p-3">Acceptable</td><td className="p-3">Good</td><td className="p-3">Good</td><td className="p-3 text-green-700">Best</td><td className="p-3">Very Good</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Code/Tables</td><td className="p-3 text-red-700">Poor</td><td className="p-3 text-red-700">Poor</td><td className="p-3">Medium</td><td className="p-3">Medium</td><td className="p-3 text-green-700">Best</td></tr>
                            <tr><td className="p-3 font-medium">Recommended?</td><td className="p-3">✅ Baseline</td><td className="p-3">—</td><td className="p-3 text-green-700 font-medium">✅ Default</td><td className="p-3">—</td><td className="p-3">Structured docs</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/cost" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.9 Cost at Scale
                </Link>
                <Link href="/search/vector-search/databases" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.11 Vector Database Comparison <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
