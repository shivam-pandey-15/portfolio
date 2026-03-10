"use client";

import Link from "next/link";
import {
    Cpu, ArrowRight, ArrowLeft, Zap, AlertTriangle,
    Layers, Binary, Brain, BookOpen, GitBranch,
    Target, TrendingUp, Gauge, Database, Code2
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Sparse → Dense Revolution", description: "From 100K-dim sparse TF-IDF vectors (mostly zeros) to compact 300-768 dim dense vectors that encode meaning. Word2Vec (2013) proved the distributional hypothesis: words in similar contexts get similar vectors." },
    { title: "Context Changes Everything (BERT, 2018)", description: "Word2Vec gives one vector per word ('bank' = same vector in all contexts). BERT produces contextual embeddings where the same word gets different vectors depending on surrounding text — solving the polysemy problem." },
    { title: "Contrastive Training Is the Key", description: "Modern search embeddings use MNR/InfoNCE loss: push query close to its relevant doc, push it away from all other docs in the batch. Batch size is critical — 1024 gives 1023 negatives per query, dramatically improving training signal." },
    { title: "Matryoshka Embeddings Cut Costs at Source", description: "Train the model to be useful at any prefix length: truncate 768→256 dims for 3x memory savings with only 2-5% quality loss. This compounds with PQ for even greater savings. The modern approach to dimension reduction." },
    { title: "Fine-Tune for Your Domain", description: "General models confuse domain terminology: legal 'consideration' ≠ 'thoughtfulness'. Even 500-1000 domain-specific training pairs significantly improve retrieval quality. Use MNR loss + hard negatives mined from BM25." },
];

export default function EmbeddingsPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero Section */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.2</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Embeddings 101</h1>

                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            Embeddings transform text into fixed-length vectors of floats where geometric proximity
                            encodes semantic similarity. This chapter traces the evolution from sparse bag-of-words to
                            modern dense embeddings, explaining architectures, training objectives, and practical
                            considerations for choosing and deploying embedding models.
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><Layers className="w-4 h-4" /> Dimension Evolution</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">100K→768</p>
                        <p className="text-sm text-zinc-600">From sparse TF-IDF (100K dims) to dense SBERT (768 dims). 130x compression with better quality.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm"><Zap className="w-4 h-4" /> SBERT Speedup</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">10,000x</p>
                        <p className="text-sm text-zinc-600">Finding similar pairs in 10K sentences: BERT takes 65 hours; SBERT takes 5 seconds.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-purple-700 font-medium text-sm"><Brain className="w-4 h-4" /> BERT Params</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">110M</p>
                        <p className="text-sm text-zinc-600">BERT-base: 12 layers, 768 hidden, 110M parameters. Trained 4 days on 16 TPUs.</p>
                    </div>
                </div>

                {/* Tip Box */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                        <strong>Prerequisites:</strong> This chapter assumes familiarity with Chapter 6.1 (Why Keyword Search
                        Is Not Enough). Understanding the vocabulary mismatch problem motivates why we need embeddings at all.
                        You should also have a basic understanding of neural networks and gradient descent.
                    </div>
                </div>
            </div>

            {/* 1. Sparse to Dense Evolution */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. From Sparse to Dense: The Evolution</h2>

                <h3 className="text-xl font-semibold text-zinc-800">Bag-of-Words / TF-IDF (Sparse)</h3>
                <p className="text-foreground leading-relaxed">
                    Traditional representations are <strong>sparse vectors</strong> with dimensions equal to the vocabulary
                    size. A vocabulary of 100,000 words produces 100,000-dimensional vectors where each dimension corresponds
                    to a word, and most values are zero. The word &quot;cat&quot; is as far from &quot;kitten&quot; as it is
                    from &quot;airplane&quot; — every word is orthogonal to every other word. This is the fundamental limitation
                    that dense embeddings solve.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">sparse_vs_dense.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-zinc-500"># TF-IDF: &quot;the cat sat on the mat&quot;</span></div>
                            <div><span className="text-zinc-500"># Vocab: [cat, dog, mat, on, sat, the, ...]</span></div>
                            <div><span className="text-zinc-300">vector = [1.2, 0, 0.8, 0.3, 0.9, 0.1, ..., 0, 0, 0]</span><span className="text-zinc-500">  # 100K dims</span></div>
                            <div className="mt-1"><span className="text-zinc-500"># Memory: 100K × 4 bytes = 400 KB per document</span></div>
                            <div><span className="text-zinc-500"># For 1M docs: 400 GB just for vectors (mostly zeros)</span></div>
                            <div className="mt-2"><span className="text-zinc-500"># Problem: No semantic awareness</span></div>
                            <div><span className="text-zinc-300">cosine(</span><span className="text-green-300">&quot;cat&quot;</span><span className="text-zinc-300">, </span><span className="text-green-300">&quot;kitten&quot;</span><span className="text-zinc-300">)</span><span className="text-zinc-500">  = 0.0  # orthogonal!</span></div>
                            <div><span className="text-zinc-300">cosine(</span><span className="text-green-300">&quot;cat&quot;</span><span className="text-zinc-300">, </span><span className="text-green-300">&quot;airplane&quot;</span><span className="text-zinc-300">)</span><span className="text-zinc-500"> = 0.0  # same distance!</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. Word2Vec */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Word2Vec (2013) — Static Word Embeddings</h2>
                <p className="text-foreground leading-relaxed">
                    Google&apos;s Word2Vec introduced <strong>dense, low-dimensional</strong> word representations (typically
                    100-300 dimensions). The core idea is the <strong>distributional hypothesis</strong>: words appearing in
                    similar contexts tend to have similar meanings. &quot;Coffee&quot; and &quot;tea&quot; both appear near
                    &quot;drink,&quot; &quot;cup,&quot; &quot;hot&quot; — so they get similar vectors.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                        <div className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                            <Target className="w-5 h-5" /> CBOW (Continuous Bag of Words)
                        </div>
                        <div className="space-y-2 text-sm text-blue-700">
                            <p>Predict the <strong>center word</strong> from its surrounding context words.</p>
                            <div className="bg-white border border-blue-200 p-3 rounded font-mono text-xs">
                                <div>Context: [&quot;the&quot;, &quot;cat&quot;, &quot;on&quot;, &quot;the&quot;]</div>
                                <div>Predict: <span className="text-blue-600 font-bold">&quot;sat&quot;</span></div>
                            </div>
                            <p className="text-blue-600">Faster training, better for frequent words. Window: 5-10 words.</p>
                        </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
                        <div className="font-bold text-green-800 mb-3 flex items-center gap-2">
                            <GitBranch className="w-5 h-5" /> Skip-gram
                        </div>
                        <div className="space-y-2 text-sm text-green-700">
                            <p>Predict the <strong>context words</strong> from a center word.</p>
                            <div className="bg-white border border-green-200 p-3 rounded font-mono text-xs">
                                <div>Center: <span className="text-green-600 font-bold">&quot;sat&quot;</span></div>
                                <div>Predict: [&quot;the&quot;, &quot;cat&quot;, &quot;on&quot;, &quot;the&quot;]</div>
                            </div>
                            <p className="text-green-600">Slower but better for rare words. Creates more training examples.</p>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800">Negative Sampling — Making Training Feasible</h3>
                <p className="text-foreground leading-relaxed">
                    The full softmax over 100K+ vocabulary is O(V) per training step — prohibitively expensive. Negative
                    sampling turns it into a binary classification problem: for each positive (word, context) pair, sample
                    5-20 random &quot;negative&quot; words and train the model to distinguish real context from noise.
                    This reduces complexity from O(V) to O(k) where k=5-20.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">negative_sampling.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">negative_sampling_loss</span><span className="text-zinc-300">(center, context_word, negative_words, k=5):</span></div>
                            <div className="pl-4"><span className="text-zinc-500">&quot;&quot;&quot;Binary classification instead of full softmax.&quot;&quot;&quot;</span></div>
                            <div className="pl-4"><span className="text-zinc-500"># Positive pair: center word + true context word</span></div>
                            <div className="pl-4"><span className="text-zinc-300">pos_loss = -log(sigmoid(dot(center, context_word)))</span></div>
                            <div className="pl-4"></div>
                            <div className="pl-4"><span className="text-zinc-500"># Negative pairs: center word + random words</span></div>
                            <div className="pl-4"><span className="text-zinc-300">neg_loss = </span><span className="text-yellow-300">sum</span><span className="text-zinc-300">(-log(sigmoid(-dot(center, neg)))</span></div>
                            <div className="pl-12"><span className="text-pink-400">for</span><span className="text-zinc-300"> neg </span><span className="text-pink-400">in</span><span className="text-zinc-300"> negative_words)</span></div>
                            <div className="pl-4"></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> pos_loss + neg_loss</span></div>
                            <div className="mt-2"><span className="text-zinc-500"># Reduces O(V=100,000) to O(k=5-20) per training step</span></div>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800">The Famous Result: Vector Arithmetic</h3>
                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># Word2Vec learns semantic relationships as vector operations</div>
                    <div className="space-y-2">
                        <div>vec(<span className="text-green-400">&quot;king&quot;</span>) - vec(<span className="text-blue-400">&quot;man&quot;</span>) + vec(<span className="text-pink-400">&quot;woman&quot;</span>) ≈ vec(<span className="text-yellow-400">&quot;queen&quot;</span>)</div>
                        <div>vec(<span className="text-green-400">&quot;Paris&quot;</span>) - vec(<span className="text-blue-400">&quot;France&quot;</span>) + vec(<span className="text-pink-400">&quot;Germany&quot;</span>) ≈ vec(<span className="text-yellow-400">&quot;Berlin&quot;</span>)</div>
                        <div>vec(<span className="text-green-400">&quot;walking&quot;</span>) - vec(<span className="text-blue-400">&quot;walk&quot;</span>) + vec(<span className="text-pink-400">&quot;swim&quot;</span>) ≈ vec(<span className="text-yellow-400">&quot;swimming&quot;</span>)</div>
                        <div className="mt-3 text-zinc-500">Dimensions: 300 (not 100,000). Dense: most values are non-zero.</div>
                        <div className="text-zinc-300">vec(&quot;cat&quot;) = [0.21, -0.04, 0.67, 0.15, ...]  <span className="text-zinc-500"># 300 dimensions</span></div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Dimensions</th>
                                <th className="text-left p-3 border-b font-semibold">Use Case</th>
                                <th className="text-left p-3 border-b font-semibold">Quality</th>
                                <th className="text-left p-3 border-b font-semibold">Memory (1M words)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">50-100</td><td className="p-3">Small datasets (&lt;100K sentences)</td><td className="p-3">Basic semantic capture</td><td className="p-3">200-400 MB</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">200-300</td><td className="p-3">General NLP (Google&apos;s default)</td><td className="p-3 font-medium text-green-700">Sweet spot</td><td className="p-3">800 MB - 1.2 GB</td></tr>
                            <tr><td className="p-3">768+</td><td className="p-3">Only with massive data</td><td className="p-3">Diminishing returns for W2V</td><td className="p-3">3+ GB</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-red-800 mb-2">Critical Limitation: One Vector Per Word</div>
                    <p className="text-red-700">
                        Word2Vec assigns <strong>one vector per word</strong>, regardless of context. &quot;Bank&quot; (river)
                        = &quot;bank&quot; (finance). This is the <strong>polysemy problem</strong> — and it&apos;s exactly
                        what BERT&apos;s contextual embeddings solve.
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 3. GloVe and FastText */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. GloVe and FastText — Incremental Improvements</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Database className="w-5 h-5 text-blue-500" /> GloVe (2014) — Stanford
                        </h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            Combined Word2Vec&apos;s local context with <strong>global co-occurrence statistics</strong>.
                            Builds a word-word co-occurrence matrix from the entire corpus and factorizes it. The key
                            insight: the <em>ratio</em> of co-occurrence probabilities encodes meaning.
                        </p>
                        <div className="bg-white border border-zinc-200 p-3 rounded font-mono text-xs text-zinc-600">
                            P(solid|ice) / P(solid|steam) = large → &quot;solid&quot; relates more to &quot;ice&quot;<br />
                            P(water|ice) / P(water|steam) ≈ 1 → &quot;water&quot; relates equally
                        </div>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Code2 className="w-5 h-5 text-green-500" /> FastText (2016) — Facebook
                        </h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            Extended Word2Vec with <strong>character n-grams</strong>. &quot;Running&quot; → [&lt;ru, run,
                            unn, nni, nin, ing, ng&gt;]. The word vector is the sum of all n-gram vectors. Can generate
                            embeddings for <strong>out-of-vocabulary</strong> words and handle misspellings.
                        </p>
                        <div className="bg-white border border-zinc-200 p-3 rounded font-mono text-xs text-zinc-600">
                            &quot;whre&quot; shares subwords with &quot;where&quot; → similar vector!<br />
                            Great for morphologically rich languages (Finnish, Turkish)
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 4. The Transformer Revolution */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. The Transformer Revolution: BERT (2018)</h2>
                <p className="text-foreground leading-relaxed">
                    BERT (Bidirectional Encoder Representations from Transformers) changed everything. Unlike Word2Vec,
                    BERT produces <strong>contextual embeddings</strong> where the same word gets different vectors depending
                    on context: &quot;I sat by the river <strong>bank</strong>&quot; produces a nature-related vector, while
                    &quot;I went to the <strong>bank</strong> to deposit money&quot; produces a finance-related vector.
                </p>

                <p className="text-foreground leading-relaxed">
                    BERT is <strong>pre-trained</strong> on massive corpora (Wikipedia + BookCorpus, 3.3B words),
                    <strong> bidirectional</strong> (reads text in both directions simultaneously, unlike GPT which is
                    left-to-right), and <strong>fine-tunable</strong> for specific downstream tasks.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Variant</th>
                                <th className="text-left p-3 border-b font-semibold">Layers</th>
                                <th className="text-left p-3 border-b font-semibold">Hidden Size</th>
                                <th className="text-left p-3 border-b font-semibold">Parameters</th>
                                <th className="text-left p-3 border-b font-semibold">Training</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-medium">BERT-base</td><td className="p-3">12</td><td className="p-3">768</td><td className="p-3">110M</td><td className="p-3">4 days, 16 TPUs</td></tr>
                            <tr><td className="p-3 font-medium">BERT-large</td><td className="p-3">24</td><td className="p-3">1024</td><td className="p-3">340M</td><td className="p-3">4 days, 64 TPUs</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
                    <div className="font-bold text-blue-800 mb-2">Problem for Search</div>
                    <p className="text-blue-700">
                        BERT produces <strong>per-token</strong> embeddings (one vector per word). To compare two sentences,
                        you&apos;d need to feed them jointly through BERT — this is O(N²) for N documents. Finding similar
                        pairs in 10K sentences would take <strong>65 hours</strong> with raw BERT.
                    </p>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. Sentence Transformers */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. Sentence Transformers — SBERT (2019)</h2>
                <p className="text-foreground leading-relaxed">
                    Sentence-BERT (Reimers &amp; Gurevych, 2019) solved the per-token problem by training Siamese/Triplet
                    networks that produce fixed-size vectors for entire sentences. The result: semantically similar sentences
                    are close in vector space. The speedup is transformative: <strong>10,000x faster</strong> than pure BERT
                    for finding similar pairs in 10K sentences (65 hours → 5 seconds).
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">sbert_usage.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">from</span><span className="text-zinc-300"> sentence_transformers </span><span className="text-pink-400">import</span><span className="text-zinc-300"> SentenceTransformer</span></div>
                            <div className="mt-1"><span className="text-zinc-300">model = SentenceTransformer(</span><span className="text-green-300">&apos;all-MiniLM-L6-v2&apos;</span><span className="text-zinc-300">)</span></div>
                            <div className="mt-1"><span className="text-zinc-500"># Internally:</span></div>
                            <div><span className="text-zinc-500"># 1. Tokenize input sentence</span></div>
                            <div><span className="text-zinc-500"># 2. Pass through transformer → per-token embeddings</span></div>
                            <div><span className="text-zinc-500"># 3. Apply POOLING → single vector:</span></div>
                            <div><span className="text-zinc-500">#    - Mean pooling (average all tokens) ← default, usually best</span></div>
                            <div><span className="text-zinc-500">#    - CLS pooling (use [CLS] token vector)</span></div>
                            <div><span className="text-zinc-500">#    - Max pooling (element-wise max across tokens)</span></div>
                            <div className="mt-1"><span className="text-zinc-300">query_vec = model.encode(</span><span className="text-green-300">&quot;How to fix a flat tire&quot;</span><span className="text-zinc-300">)</span><span className="text-zinc-500">      # [384]</span></div>
                            <div><span className="text-zinc-300">doc_vec   = model.encode(</span><span className="text-green-300">&quot;Steps for puncture repair&quot;</span><span className="text-zinc-300">)</span><span className="text-zinc-500">   # [384]</span></div>
                            <div className="mt-1"><span className="text-zinc-500"># Cosine similarity: ~0.82 (high match despite zero word overlap!)</span></div>
                            <div><span className="text-zinc-300">similarity = cosine_similarity(query_vec, doc_vec)</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 6. Training Loss Functions */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">6. Training Loss Functions for Search Embeddings</h2>
                <p className="text-foreground leading-relaxed">
                    The choice of loss function critically affects embedding quality. The dominant paradigm for search
                    embeddings is <strong>contrastive learning</strong>: push the query close to its relevant document
                    and away from all other documents in the batch.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-6 rounded-xl space-y-3">
                        <h3 className="font-bold text-lg text-green-800">MNR / InfoNCE</h3>
                        <p className="text-sm text-green-700 leading-relaxed">
                            <strong>THE dominant loss</strong> for search. Input: (anchor, positive) pairs only — negatives come
                            from other pairs in the batch. All other positives act as negatives. Larger batch = more negatives
                            = better training signal.
                        </p>
                        <p className="text-xs text-green-600 font-mono">batch_size=1024 → 1023 negatives per query</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-xl space-y-3">
                        <h3 className="font-bold text-lg text-blue-800">Triplet Loss</h3>
                        <p className="text-sm text-blue-700 leading-relaxed">
                            Input: (anchor, positive, negative) triplets with explicit negative mining. A margin parameter
                            controls minimum separation. Requires curating negatives, more setup than MNR.
                        </p>
                        <p className="text-xs text-blue-600 font-mono">d(a, pos) + margin &lt; d(a, neg)</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 p-6 rounded-xl space-y-3">
                        <h3 className="font-bold text-lg text-purple-800">Cosine Similarity Loss</h3>
                        <p className="text-sm text-purple-700 leading-relaxed">
                            Input: (sentence_A, sentence_B, similarity_score) triples. Good for Semantic Textual Similarity
                            (STS) tasks. Less effective for retrieval than MNR.
                        </p>
                        <p className="text-xs text-purple-600 font-mono">loss = MSE(cos(a, b), target_score)</p>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800">Hard Negative Mining</h3>
                <p className="text-foreground leading-relaxed">
                    Simple random negatives are too easy — the model doesn&apos;t learn fine distinctions. <strong>Hard
                    negatives</strong> are documents that are topically close but <em>not</em> relevant: for &quot;How to
                    train a puppy,&quot; a hard negative is &quot;How to train a machine learning model&quot; — similar
                    words, different meaning.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">hard_negatives.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">mine_hard_negatives</span><span className="text-zinc-300">(query, relevant_docs, index, model, top_k=30):</span></div>
                            <div className="pl-4"><span className="text-zinc-500">&quot;&quot;&quot;Use the model&apos;s own retrieval to find tricky negatives.&quot;&quot;&quot;</span></div>
                            <div className="pl-4"><span className="text-zinc-300">query_vec = model.encode(query)</span></div>
                            <div className="pl-4"><span className="text-zinc-300">candidates = index.search(query_vec, k=top_k)</span></div>
                            <div className="pl-4"></div>
                            <div className="pl-4"><span className="text-zinc-500"># Keep candidates NOT in the relevant set</span></div>
                            <div className="pl-4"><span className="text-zinc-300">hard_negatives = [c </span><span className="text-pink-400">for</span><span className="text-zinc-300"> c </span><span className="text-pink-400">in</span><span className="text-zinc-300"> candidates</span></div>
                            <div className="pl-16"><span className="text-pink-400">if</span><span className="text-zinc-300"> c.doc_id </span><span className="text-pink-400">not in</span><span className="text-zinc-300"> relevant_docs]</span></div>
                            <div className="pl-4"></div>
                            <div className="pl-4"><span className="text-zinc-500"># These are docs the model THINKS are relevant but aren&apos;t</span></div>
                            <div className="pl-4"><span className="text-zinc-500"># → Training on these forces finer distinctions</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> hard_negatives[:5]</span></div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                        <div className="font-semibold mb-1">BM25 negatives</div>
                        <p className="text-zinc-600">Top BM25 results not marked relevant — lexically similar but semantically different.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-lg">
                        <div className="font-semibold mb-1">Cross-encoder negatives</div>
                        <p className="text-zinc-600">Use teacher model to score all pairs, pick highest-scoring non-relevant. Most effective but expensive.</p>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 7. Modern Models and MTEB */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">7. Modern Embedding Models &amp; MTEB Benchmark</h2>
                <p className="text-foreground leading-relaxed">
                    The <strong>Massive Text Embedding Benchmark (MTEB)</strong> evaluates models across 8 task types and
                    56+ datasets. It&apos;s the standard leaderboard for comparing embedding models. Always benchmark on
                    your own domain data too — MTEB scores don&apos;t always predict domain-specific performance.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Model</th>
                                <th className="text-left p-3 border-b font-semibold">Dims</th>
                                <th className="text-left p-3 border-b font-semibold">MTEB Avg</th>
                                <th className="text-left p-3 border-b font-semibold">Speed</th>
                                <th className="text-left p-3 border-b font-semibold">Params</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">all-MiniLM-L6-v2</td><td className="p-3">384</td><td className="p-3">56.3</td><td className="p-3">Very Fast</td><td className="p-3">22M</td></tr>
                            <tr className="border-b"><td className="p-3">all-mpnet-base-v2</td><td className="p-3">768</td><td className="p-3">57.8</td><td className="p-3">Medium</td><td className="p-3">109M</td></tr>
                            <tr className="border-b"><td className="p-3">e5-large-v2</td><td className="p-3">1024</td><td className="p-3">62.2</td><td className="p-3">Slow</td><td className="p-3">335M</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">gte-large-en-v1.5</td><td className="p-3">1024</td><td className="p-3 font-medium text-green-700">65.4</td><td className="p-3">Slow</td><td className="p-3">434M</td></tr>
                            <tr className="border-b"><td className="p-3">nomic-embed-text-v1.5</td><td className="p-3">768</td><td className="p-3">62.3</td><td className="p-3">Fast</td><td className="p-3">137M</td></tr>
                            <tr><td className="p-3">text-embedding-3-small</td><td className="p-3">1536</td><td className="p-3">—</td><td className="p-3">API</td><td className="p-3">—</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 8. Distance Metrics & Matryoshka */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">8. Distance Metrics &amp; Dimension Reduction</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Metric</th>
                                <th className="text-left p-3 border-b font-semibold">Range</th>
                                <th className="text-left p-3 border-b font-semibold">When to Use</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-medium">Cosine Similarity</td><td className="p-3">[-1, 1]</td><td className="p-3">Default for text. Ignores magnitude, measures angle only.</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Dot Product</td><td className="p-3">(-∞, +∞)</td><td className="p-3">If L2-normalized (equivalent to cosine).</td></tr>
                            <tr className="border-b"><td className="p-3">Euclidean (L2)</td><td className="p-3">[0, +∞)</td><td className="p-3">Sometimes for images. Sensitive to magnitude.</td></tr>
                            <tr><td className="p-3">Manhattan (L1)</td><td className="p-3">[0, +∞)</td><td className="p-3">Sparse vectors, binary features.</td></tr>
                        </tbody>
                    </table>
                </div>

                <p className="text-foreground leading-relaxed">
                    <strong>Important:</strong> if vectors are L2-normalized (‖v‖ = 1), cosine similarity = dot product. Most
                    embedding models output normalized vectors, so cosine and dot product give identical rankings. Store
                    normalized vectors and use dot product for speed — it&apos;s a single <code>numpy.dot()</code> call.
                </p>

                <h3 className="text-xl font-semibold text-zinc-800">Matryoshka Embeddings (2022)</h3>
                <p className="text-foreground leading-relaxed">
                    The modern approach to dimension reduction: train the model to be useful at <strong>any prefix
                    length</strong>. The full 768-dim vector is most accurate, but you can truncate to 256 dims for
                    3x memory savings with only 2-5% quality loss. Remarkably, you just take the first N dimensions —
                    no PCA or retraining needed.
                </p>

                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># Matryoshka: flexible dimension usage</div>
                    <div className="space-y-2">
                        <div><span className="text-green-400">Full:</span>      [0.21, -0.04, 0.67, ..., 0.15]  <span className="text-zinc-500"># 768 dims (3072 bytes)</span></div>
                        <div><span className="text-yellow-400">Truncated:</span>  [0.21, -0.04, 0.67, ..., 0.33]  <span className="text-zinc-500"># 256 dims (1024 bytes, 3x less)</span></div>
                        <div><span className="text-blue-400">Further:</span>    [0.21, -0.04, 0.67, ..., 0.88]  <span className="text-zinc-500"># 64 dims  (256 bytes, 12x less)</span></div>
                        <div className="mt-3 text-zinc-300">truncated_vec = full_vec[:256]  <span className="text-zinc-500"># Just take first 256 dims!</span></div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Technique</th>
                                <th className="text-left p-3 border-b font-semibold">How</th>
                                <th className="text-left p-3 border-b font-semibold">Quality Loss</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">PCA</td><td className="p-3">Linear projection to lower dims</td><td className="p-3">5-10% at 256-dim</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium text-green-700">Matryoshka</td><td className="p-3">Truncate prefix from trained model</td><td className="p-3 font-medium text-green-700">2-5% at 256-dim</td></tr>
                            <tr className="border-b"><td className="p-3">Random projection</td><td className="p-3">Preserve distances via JL lemma</td><td className="p-3">5-15%</td></tr>
                            <tr><td className="p-3">Scalar quantization</td><td className="p-3">float32 → int8 (not dims)</td><td className="p-3">2-5%</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/limitations" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.1 Why Keyword Search Is Not Enough
                </Link>
                <Link href="/search/vector-search/encoders" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.3 Bi-Encoder vs Cross-Encoder <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
