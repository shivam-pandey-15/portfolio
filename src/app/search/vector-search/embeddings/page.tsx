"use client";

import Link from "next/link";
import { Brain, ArrowRight, ArrowLeft, Boxes, Binary, TrendingUp, Layers, Ruler, Sparkles } from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Embeddings Map Meaning to Geometry", description: "Words, sentences, and documents are compressed into fixed-size vectors where semantic similarity corresponds to geometric proximity. 'Happy' and 'joyful' are nearby; 'happy' and 'refrigerator' are far apart." },
    { title: "SBERT Changed Everything", description: "Sentence-BERT uses siamese networks with contrastive loss to produce sentence embeddings 100x faster than cross-encoders. MNR loss with in-batch negatives is the standard training approach for modern bi-encoders." },
    { title: "Dimensions Are a Tradeoff", description: "768 dimensions is the standard (BERT-base). More dimensions capture more nuance but cost more memory and compute. Matryoshka embeddings let you truncate to 256 dims with only 2-5% recall loss." },
    { title: "Fine-Tuning Is Almost Always Worth It", description: "General models trained on web text misinterpret domain jargon. Even 1,000-5,000 domain-specific training pairs can improve retrieval quality by 5-15% on domain-specific queries." },
];

export default function EmbeddingsPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.2</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Embeddings 101</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            How text becomes numbers. Embeddings are the foundation of semantic search — they compress
                            meaning into fixed-size vectors where similar concepts cluster together in geometric space.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-purple-700 font-medium text-sm">
                            <Boxes className="w-4 h-4" /> Standard Dimensions
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">768</p>
                        <p className="text-sm text-zinc-600">BERT-base embedding size. Each number captures one aspect of meaning.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm">
                            <Binary className="w-4 h-4" /> Memory per Vector
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">3 KB</p>
                        <p className="text-sm text-zinc-600">768 dims × 4 bytes (float32). 1B vectors = 3 TB of raw storage.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm">
                            <TrendingUp className="w-4 h-4" /> MTEB Benchmark
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">56-75</p>
                        <p className="text-sm text-zinc-600">Score range across models. Higher = better semantic understanding.</p>
                    </div>
                </div>
            </div>

            {/* Section 1 */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. From Words to Vectors</h2>
                <p className="text-foreground leading-relaxed">
                    The journey from text to vectors begins with Word2Vec (Mikolov et al., 2013), which demonstrated a
                    remarkable property: words trained on large text corpora organize themselves in vector space such that
                    semantic relationships become geometric operations. The famous example — <strong>king - man + woman ≈ queen</strong> —
                    showed that vector arithmetic could capture analogies, gender relationships, and conceptual hierarchies.
                </p>
                <p className="text-foreground leading-relaxed">
                    Word2Vec uses a shallow neural network trained on a simple task: given a word, predict its surrounding
                    context (Skip-gram), or given context, predict the center word (CBOW). The hidden layer weights become
                    the word embeddings. Through training on billions of words, the model learns that &quot;king&quot; and
                    &quot;queen&quot; appear in similar contexts, so their vectors end up nearby. Words like &quot;king&quot;
                    and &quot;refrigerator&quot; appear in very different contexts, so their vectors are far apart.
                </p>

                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># Evolution from words to sentences to documents</div>
                    <div className="space-y-3">
                        <div><span className="text-green-400">Word2Vec (2013):</span> One vector per word → &quot;king&quot; = [0.2, -0.4, ...]</div>
                        <div><span className="text-blue-400">BERT (2018):</span> Contextual embeddings → &quot;bank&quot; has different vectors in &quot;river bank&quot; vs &quot;bank account&quot;</div>
                        <div><span className="text-purple-400">SBERT (2019):</span> Sentence embeddings → encode(&quot;How to fix a flat tire&quot;) = [0.1, 0.3, ...]</div>
                        <div><span className="text-yellow-400">Modern (2024):</span> Matryoshka + MTEB → truncate 768→256 dims with ~3% quality loss</div>
                    </div>
                </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Sentence-BERT and Training Losses</h2>
                <p className="text-foreground leading-relaxed">
                    Raw BERT produces contextual token embeddings, but to get a sentence embedding you need to pool
                    (typically mean-pool) all tokens. This works poorly because BERT wasn&apos;t trained for this task.
                    Sentence-BERT (Reimers &amp; Gurevych, 2019) fixes this by <strong>fine-tuning BERT with a siamese
                    network</strong>: two copies of BERT process two sentences independently, and the training loss
                    encourages similar sentences to produce nearby vectors.
                </p>
                <p className="text-foreground leading-relaxed">
                    The dominant training approach is <strong>Multiple Negatives Ranking (MNR) loss</strong>: for each
                    positive pair (query, relevant_doc), all other queries&apos; relevant documents in the same batch
                    serve as implicit negatives. With a batch size of 256, each positive pair trains against 255
                    negatives — providing a rich training signal without explicitly mining hard negatives. This &quot;in-batch
                    negatives&quot; trick makes training efficient and is used by virtually all modern embedding models.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2"><Layers className="w-5 h-5 text-purple-500" /> MNR Loss</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            Multiple Negatives Ranking loss. Uses in-batch negatives — other queries&apos; positive
                            documents become negatives for free. Batch size 256 → 255 negatives per pair. The standard
                            for modern bi-encoders.
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2"><Ruler className="w-5 h-5 text-blue-500" /> Triplet Loss</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            (anchor, positive, negative) triplets. Push positive closer and negative farther by a margin.
                            Simpler but requires explicit negative mining. Better for fine-grained similarity distinctions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Dimensions and the Quality-Cost Tradeoff</h2>
                <p className="text-foreground leading-relaxed">
                    Each dimension in an embedding captures one &quot;aspect&quot; of meaning. More dimensions = more
                    nuance, but also more memory, more compute for distance calculations, and slower indexing. The
                    standard 768-dim BERT-base vector stores 3 KB as float32. At 1 billion vectors, that&apos;s 3 TB
                    of raw storage before any index overhead.
                </p>
                <p className="text-foreground leading-relaxed">
                    <strong>Matryoshka embeddings</strong> (Kusupati et al., 2022) offer an elegant solution: models
                    trained with a multi-scale loss that makes the first N dimensions useful at any prefix length. You
                    can truncate a 768-dim Matryoshka embedding to 256 dimensions and still get 95-98% of the retrieval
                    quality — saving 3x memory and making distance computation 3x faster.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Dimensions</th>
                                <th className="text-left p-3 border-b font-semibold">Bytes/Vector</th>
                                <th className="text-left p-3 border-b font-semibold">1B Vectors</th>
                                <th className="text-left p-3 border-b font-semibold">Recall Impact</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">768 (full)</td><td className="p-3">3,072</td><td className="p-3">3 TB</td><td className="p-3">Baseline</td></tr>
                            <tr className="border-b"><td className="p-3">384</td><td className="p-3">1,536</td><td className="p-3">1.5 TB</td><td className="p-3">~2% loss</td></tr>
                            <tr className="border-b"><td className="p-3">256 (Matryoshka)</td><td className="p-3">1,024</td><td className="p-3">1 TB</td><td className="p-3">~3% loss</td></tr>
                            <tr><td className="p-3">128</td><td className="p-3">512</td><td className="p-3">500 GB</td><td className="p-3">~8% loss</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Fine-Tuning for Your Domain</h2>
                <p className="text-foreground leading-relaxed">
                    General-purpose embedding models are trained on web text — Wikipedia, web crawls, Reddit. They work
                    well for general queries but misinterpret domain-specific terminology. In legal text, &quot;consideration&quot;
                    means something exchanged in a contract, not thoughtfulness. A general model maps it to the wrong
                    region of vector space.
                </p>
                <p className="text-foreground leading-relaxed">
                    Fine-tuning on as few as 1,000-5,000 domain-specific (query, relevant_document) pairs can improve
                    domain retrieval quality by 5-15%. The process is straightforward: freeze the lower transformer
                    layers, train the top layers and pooling head with MNR loss on your domain pairs. This takes 1-4
                    hours on a single GPU and is one of the highest-ROI investments in search quality.
                </p>
            </section>

            <KeyTakeaways takeaways={takeaways} />

            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/limitations" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.1 Why Keywords Aren&apos;t Enough
                </Link>
                <Link href="/search/vector-search/encoders" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.3 Bi-Encoder vs Cross-Encoder <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
