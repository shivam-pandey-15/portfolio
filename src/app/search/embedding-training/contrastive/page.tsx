"use client";

import Link from "next/link";
import {
    ArrowRight, ArrowLeft, Brain, Zap, BarChart2, AlertTriangle, CheckCircle, Layers, Settings
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    {
        title: "Geometry is the training objective, not labels",
        description: "Contrastive learning places matching pairs closer and non-matching pairs further apart in high-dimensional space. The model never sees explicit 'relevance' labels — it learns from the structural relationship between embeddings. Cosine similarity after L2 normalization is the standard distance metric."
    },
    {
        title: "Temperature controls how hard the problem is",
        description: "Lower temperature (0.02–0.05) sharpens the distribution, forcing the model to correctly rank even very similar pairs — strong signal but risk of collapse. Higher values (0.07–0.1) soften it, easier training but the model may not learn fine distinctions. Temperature is often the single most impactful hyperparameter."
    },
    {
        title: "Batch size multiplies free negatives",
        description: "With in-batch negatives, a batch of 1024 gives each query 1023 negatives at zero extra cost. Larger batch sizes are significantly more sample-efficient than additional epochs. But this requires high GPU memory and careful false negative filtering."
    },
    {
        title: "Recognize the five failure modes before training",
        description: "Representation collapse, false negative saturation, shortcut learning, overfitting, and embedding space drift are the most common failures. Each has a distinct diagnostic signature. Knowing them before training means you can identify what went wrong in hours rather than days."
    }
];

export default function ContrastiveLearningPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero Section */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 7.3</span>
                        <span>Training Embedding Models</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Contrastive Learning &amp; Losses</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            How contrastive objectives train models to shape vector space geometry. Cosine similarity, bi-encoders, InfoNCE/MNR loss, the temperature trick, batch size as free negatives, and why it all eventually collapses if you ignore the five failure modes.
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><Brain className="w-4 h-4" /> Architecture</div>
                        <p className="text-2xl font-bold text-zinc-900 mb-2">Bi-Encoders</p>
                        <p className="text-sm text-zinc-600">Dominant pattern in production: one shared encoder for queries and documents, scored by cosine similarity.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm"><Zap className="w-4 h-4" /> In-Batch Negatives</div>
                        <p className="text-2xl font-bold text-zinc-900 mb-2">1,024</p>
                        <p className="text-sm text-zinc-600">Free negatives per query in a batch of 1024. Larger batches provide dramatically more training signal at no extra data cost.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-amber-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-amber-700 font-medium text-sm"><Settings className="w-4 h-4" /> Temperature</div>
                        <p className="text-2xl font-bold text-zinc-900 mb-2">0.05</p>
                        <p className="text-sm text-zinc-600">Typical production default. Lower sharpens learning signal. Higher smooths difficulty. Most impactful single hyperparameter.</p>
                    </div>
                </div>

                {/* Tip Box */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                        <strong>Key Insight:</strong> Contrastive learning does not define what &quot;relevant&quot; means. It teaches the model a geometry — things that should be close are pulled together, things that should be far are pushed apart. Everything depends on the quality of your positive pairs and the difficulty of your negatives.
                    </div>
                </div>
            </div>

            {/* 1. The Geometric Objective */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. The Geometric Objective</h2>

                <p className="text-foreground leading-relaxed">
                    The central idea of contrastive learning is deceptively simple: encode similar things so that their vectors point in similar directions, and encode dissimilar things so their vectors point in different directions. Over many gradient steps, the encoder learns a map from raw text to a high-dimensional manifold where semantic similarity becomes spatial proximity.
                </p>

                <p className="text-foreground leading-relaxed">
                    This is not a classification task. There are no output classes. The model is never told what category a document belongs to. Instead, it is given pairs or triplets and trained to arrange them correctly in a continuous vector space. The distance that matters in production is <strong>cosine similarity</strong>.
                </p>

                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-xl">
                    <h3 className="font-bold text-lg mb-4">Why Contrastive Learning Over Other Approaches?</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <strong className="text-red-700 block mb-1">Classification head (MLM, cross-entropy)</strong>
                            <p className="text-zinc-600">Works for fixed taxonomies. Cannot generalize to queries and documents it has never seen labeled. Fails for open-vocabulary search.</p>
                        </div>
                        <div>
                            <strong className="text-green-700 block mb-1">Contrastive objective</strong>
                            <p className="text-zinc-600">Learns from structural relationships. Generalizes to unseen query-document pairs. Scales with data volume and batch size. Native support for retrieval.</p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. Cosine Similarity and the Math That Drives It */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Cosine Similarity: The Math That Drives the Geometry</h2>

                <p className="text-foreground leading-relaxed">
                    Cosine similarity measures the angle between two vectors, ignoring their magnitude. It is computed as the dot product of the vectors divided by the product of their L2 norms. This makes it invariant to vector magnitude, so it captures pure directional (semantic) similarity.
                </p>

                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-xl space-y-6 font-mono text-sm">
                    <div>
                        <p className="text-zinc-400 text-xs mb-2">Dot product</p>
                        <p className="text-base">a · b = Σᵢ aᵢ × bᵢ</p>
                    </div>
                    <div>
                        <p className="text-zinc-400 text-xs mb-2">L2 Norm</p>
                        <p className="text-base">‖a‖ = √(Σᵢ aᵢ²)</p>
                    </div>
                    <div>
                        <p className="text-zinc-400 text-xs mb-2">Cosine Similarity</p>
                        <p className="text-base">cos(a, b) = (a · b) / (‖a‖ × ‖b‖)</p>
                    </div>
                    <div className="border-t border-zinc-200 pt-4">
                        <p className="text-zinc-400 text-xs mb-2">The Production Identity — when both vectors are L2-normalized:</p>
                        <p className="text-base text-green-400">If ‖a‖ = ‖b‖ = 1, then  cos(a, b) = a · b</p>
                        <p className="text-zinc-500 text-xs mt-2">This means dotproduct and cosine similarity are identical for normalized vectors. Production systems always normalize, enabling fast MIPS (maximum inner product search) for nearest-neighbor retrieval.</p>
                    </div>
                </div>

                <p className="text-foreground leading-relaxed">
                    The practical implication: always normalize embedding vectors before any similarity computation or index insertion. This is not an optional optimization — it ensures the similarity score is on the [−1, 1] scale, enabling meaningful interpolation, thresholding, and score comparison across queries. A vector with a large magnitude and small cosine angle will appear falsely similar without normalization.
                </p>
            </section>

            <hr className="border-border" />

            {/* 3. Bi-Encoders vs Cross-Encoders */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Bi-Encoders vs Cross-Encoders</h2>

                <p className="text-foreground leading-relaxed">
                    The two dominant architectures for text matching are bi-encoders and cross-encoders. They differ in how they produce a relevance score — and that difference determines where each can be used in a real search system.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <Brain className="h-5 w-5 text-primary" /> Bi-Encoder
                        </h3>
                        <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border mb-4">
                            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                                <span className="text-muted-foreground text-xs">bi_encoder_score.py</span>
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                </div>
                            </div>
                            <div className="p-4 text-xs leading-relaxed">
                                <div><span className="text-pink-400">import</span> <span className="text-zinc-300">torch.nn.functional </span><span className="text-pink-400">as</span><span className="text-zinc-300"> F</span></div>
                                <div className="mt-2"><span className="text-pink-400">def</span> <span className="text-yellow-300">score</span><span className="text-zinc-300">(query, doc):</span></div>
                                <div className="pl-4"><span className="text-zinc-300">q = F.normalize(encoder(query), dim=-1)</span></div>
                                <div className="pl-4"><span className="text-zinc-300">d = F.normalize(encoder(doc), dim=-1)</span></div>
                                <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> (q * d).sum(dim=-1)</span></div>
                            </div>
                        </div>
                        <ul className="text-xs text-zinc-700 space-y-1">
                            <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Can pre-compute doc embeddings</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Scales to millions of docs</li>
                            <li className="flex items-center gap-2"><AlertTriangle className="w-3 h-3 text-amber-500" /> No token-level cross-attention</li>
                        </ul>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <Layers className="h-5 w-5 text-purple-500" /> Cross-Encoder
                        </h3>
                        <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border mb-4">
                            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                                <span className="text-muted-foreground text-xs">cross_encoder_score.py</span>
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                </div>
                            </div>
                            <div className="p-4 text-xs leading-relaxed">
                                <div><span className="text-pink-400">def</span> <span className="text-yellow-300">score</span><span className="text-zinc-300">(query, doc):</span></div>
                                <div className="pl-4 text-zinc-500"># Both texts tokenized together</div>
                                <div className="pl-4"><span className="text-zinc-300">inp = tokenize(query + </span><span className="text-green-300">&quot;[SEP]&quot;</span><span className="text-zinc-300"> + doc)</span></div>
                                <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> reranker(inp).logit</span></div>
                            </div>
                        </div>
                        <ul className="text-xs text-zinc-700 space-y-1">
                            <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Higher accuracy on close pairs</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Full cross-attention interaction</li>
                            <li className="flex items-center gap-2"><AlertTriangle className="w-3 h-3 text-amber-500" /> Cannot pre-compute, too slow at scale</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-800">
                    <strong>The Standard Architecture:</strong> Bi-encoder at retrieval (ANN index), cross-encoder as a reranker on the top-100 candidates. The bi-encoder provides recall, the cross-encoder provides precision. Training with contrastive objectives applies to the bi-encoder stage.
                </div>
            </section>

            <hr className="border-border" />

            {/* 4. InfoNCE / MNR Loss */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. InfoNCE / Multiple Negatives Ranking Loss</h2>

                <p className="text-foreground leading-relaxed">
                    Multiple Negatives Ranking (MNR) loss — also known as InfoNCE in the contrastive learning literature — is the dominant training objective for embedding models. Given a batch of (query, positive) pairs, each query treats every other positive in the batch as a negative. This makes the loss implicitly leverage in-batch negatives with no extra data.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">mnr_loss.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">import</span><span className="text-zinc-300"> torch</span></div>
                            <div><span className="text-pink-400">import</span><span className="text-zinc-300"> torch.nn.functional </span><span className="text-pink-400">as</span><span className="text-zinc-300"> F</span></div>
                            <div className="mt-2"><span className="text-pink-400">def</span> <span className="text-yellow-300">mnr_loss</span><span className="text-zinc-300">(q_embs, d_embs, temperature=0.05):</span></div>
                            <div className="pl-4 text-zinc-500 mt-1"># Normalize so dot product = cosine similarity</div>
                            <div className="pl-4"><span className="text-zinc-300">q = F.normalize(q_embs, dim=-1)</span></div>
                            <div className="pl-4"><span className="text-zinc-300">d = F.normalize(d_embs, dim=-1)</span></div>
                            <div className="pl-4 mt-2 text-zinc-500"># BxB similarity matrix, diagonal = positives</div>
                            <div className="pl-4"><span className="text-zinc-300">scores = torch.matmul(q, d.T) / temperature</span></div>
                            <div className="pl-4 mt-2 text-zinc-500"># Targets: each row, the correct column is the diagonal</div>
                            <div className="pl-4"><span className="text-zinc-300">labels = torch.arange(len(q), device=q.device)</span></div>
                            <div className="pl-4 mt-2 text-zinc-500"># Cross-entropy treats off-diagonal entries as negatives</div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> F.cross_entropy(scores, labels)</span></div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Temperature Control</h3>
                        <p className="text-zinc-700 leading-relaxed text-sm">
                            The temperature scalar τ controls how sharply the loss discriminates between positives and negatives. Lower temperature compresses the similarity distribution, making the model work harder to rank positives above negatives. Higher temperature softens it.
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-zinc-200 rounded-lg">
                                <thead className="bg-zinc-50">
                                    <tr>
                                        <th className="text-left p-3 border-b font-semibold">Temperature</th>
                                        <th className="text-left p-3 border-b font-semibold">Effect</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="p-3 font-mono text-xs">0.02</td>
                                        <td className="p-3 text-zinc-600 text-sm">Very sharp — strong learning signal, high collapse risk</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-3 font-mono text-xs">0.05</td>
                                        <td className="p-3 text-zinc-600 text-sm">Standard default — good balance for most tasks</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-mono text-xs">0.1</td>
                                        <td className="p-3 text-zinc-600 text-sm">Softer — gentler training, weaker fine distinctions</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Batch Size as Free Negatives</h3>
                        <p className="text-zinc-700 leading-relaxed text-sm">
                            The number of in-batch negatives grows linearly with batch size. A batch of 32 gives 31 negatives per query. A batch of 1024 gives 1023. This is a key reason why embedding training runs on large batch sizes — it is <em>free</em> additional training signal.
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-zinc-200 rounded-lg">
                                <thead className="bg-zinc-50">
                                    <tr>
                                        <th className="text-left p-3 border-b font-semibold">Batch Size</th>
                                        <th className="text-left p-3 border-b font-semibold">Free negatives</th>
                                        <th className="text-left p-3 border-b font-semibold">Memory</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b"><td className="p-3">32</td><td className="p-3 text-zinc-600">31</td><td className="p-3 text-green-700">Low</td></tr>
                                    <tr className="border-b"><td className="p-3">256</td><td className="p-3 text-zinc-600">255</td><td className="p-3 text-amber-700">Medium</td></tr>
                                    <tr><td className="p-3">1024</td><td className="p-3 text-zinc-600">1023</td><td className="p-3 text-red-700">High (multi-GPU)</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. Pooling Strategies */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. Pooling: Getting a Vector from Token Outputs</h2>

                <p className="text-foreground leading-relaxed">
                    A transformer encoder produces one vector per token. For a sentence embedding, you need a single vector. Pooling is how you aggregate token representations into a sentence-level embedding.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Method</th>
                                <th className="text-left p-3 border-b font-semibold">Description</th>
                                <th className="text-left p-3 border-b font-semibold">Best For</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-3 font-medium">CLS Token</td>
                                <td className="p-3 text-zinc-600">Use the embedding of the classification token [CLS]</td>
                                <td className="p-3 text-zinc-600">Models pre-trained with classification objective (BERT)</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3 font-medium">Mean Pooling</td>
                                <td className="p-3 text-zinc-600">Average all non-padding token embeddings</td>
                                <td className="p-3 text-zinc-600">Best default for sentence similarity and retrieval models; usually beats CLS</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium">Max Pooling</td>
                                <td className="p-3 text-zinc-600">Take the maximum value across tokens for each dimension</td>
                                <td className="p-3 text-zinc-600">Captures salient features; rarely best for retrieval</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p className="text-foreground leading-relaxed">
                    Mean pooling consistently outperforms CLS pooling for retrieval tasks except for models specifically fine-tuned with CLS-based contrastive objectives. Modern embedding models like E5 and BGE use mean pooling or task prompts that interact with the encoder before pooling. Use mean pooling as the default unless the model card specifies otherwise.
                </p>
            </section>

            <hr className="border-border" />

            {/* 6. Beyond Vanilla InfoNCE */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">6. Beyond Vanilla InfoNCE: Extended Loss Functions</h2>

                <p className="text-foreground leading-relaxed">
                    MNR/InfoNCE is the starting point, not the end. Several extensions address specific problems encountered in production training.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-zinc-200 p-5 rounded-xl">
                        <h3 className="font-bold mb-3">Triplet Loss</h3>
                        <p className="text-sm text-zinc-600 mb-2">Optimizes: <code className="bg-zinc-100 px-1 rounded">score(q, pos) - score(q, neg) &gt; margin</code>. Useful when you have explicit triplets and a margin to enforce. Less sample-efficient than MNR with in-batch negatives.</p>
                    </div>
                    <div className="border border-zinc-200 p-5 rounded-xl">
                        <h3 className="font-bold mb-3">MarginMSE</h3>
                        <p className="text-sm text-zinc-600 mb-2">Matches the margin between positive and negative scores from a teacher reranker. Excellent when you have soft labels from a more powerful model and want to distill ranking preferences rather than just relevance flags.</p>
                    </div>
                    <div className="border border-zinc-200 p-5 rounded-xl">
                        <h3 className="font-bold mb-3">KL-Divergence Distillation</h3>
                        <p className="text-sm text-zinc-600 mb-2">Minimize KL divergence between student score distribution and teacher score distribution over candidates. Transfers the full softmax distribution, not just the margin. Useful in knowledge distillation setups.</p>
                    </div>
                    <div className="border border-zinc-200 p-5 rounded-xl">
                        <h3 className="font-bold mb-3">Multi-Stage Training</h3>
                        <p className="text-sm text-zinc-600 mb-2">Start with MNR on large weakly labeled pairs → add hard negatives → fine-tune with MarginMSE from a teacher. This staged curriculum is how the strongest public embedding models are trained.</p>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 7. Five Failure Modes */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">7. Five Failure Modes to Diagnose Early</h2>

                <p className="text-foreground leading-relaxed">
                    Contrastive training can go wrong in a small set of well-understood ways. Knowing these patterns before training begins means you can read metrics and identify what happened in hours rather than days.
                </p>

                <div className="space-y-4">
                    <div className="border border-red-200 bg-red-50 p-5 rounded-xl">
                        <h3 className="font-bold text-red-900 flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4" /> Representation Collapse
                        </h3>
                        <p className="text-sm text-red-800">All query embeddings converge to the same point in vector space. Loss drops to near-zero immediately not because the model learned everything, but because it encodes all inputs identically. <strong>Diagnostic:</strong> STD of embedding dimensions collapses to nearly zero. Fix: increase temperature, reduce learning rate, check normalization.</p>
                    </div>

                    <div className="border border-orange-200 bg-orange-50 p-5 rounded-xl">
                        <h3 className="font-bold text-orange-900 flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4" /> False Negative Saturation
                        </h3>
                        <p className="text-sm text-orange-800">In-batch negatives often include documents that are actually relevant to the query. With large batches in dense domains, this dramatically exceeds 5%. <strong>Diagnostic:</strong> nDCG@10 stalls or regresses as batch size increases. Fix: deduplicate batch, track same-entity pairs, or use ANCE-style deduplication.</p>
                    </div>

                    <div className="border border-yellow-200 bg-yellow-50 p-5 rounded-xl">
                        <h3 className="font-bold text-yellow-900 flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4" /> Shortcut Learning
                        </h3>
                        <p className="text-sm text-yellow-800">The model learns surface features (product ID overlap, date prefix, brand name) rather than semantic meaning. <strong>Diagnostic:</strong> Strong in-domain performance but fails on paraphrase benchmarks and out-of-distribution queries. Fix: use soft labels from teacher, remove exact-match examples from training, add paraphrase augmentation.</p>
                    </div>

                    <div className="border border-zinc-200 bg-zinc-50 p-5 rounded-xl">
                        <h3 className="font-bold text-zinc-900 flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4" /> Overfitting to Query Patterns
                        </h3>
                        <p className="text-sm text-zinc-700">Benchmark nDCG improves but live search metrics plateau or regress. This often happens with small datasets and too many epochs. <strong>Diagnostic:</strong> Offline metrics diverge from online metrics. Fix: use linear warmup + cosine decay, add weight decay, use fewer unique queries with more negatives per query rather than more query-positive pairs.</p>
                    </div>

                    <div className="border border-purple-200 bg-purple-50 p-5 rounded-xl">
                        <h3 className="font-bold text-purple-900 flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4" /> Embedding Space Drift
                        </h3>
                        <p className="text-sm text-purple-800">After fine-tuning, existing document vectors in the ANN index are stale — they were computed by the old model. Serving a new query encoder against an old document index produces incoherent scores. <strong>Diagnostic:</strong> Norms of query vs document embeddings diverge. Fix: always trigger a full corpus re-embedding pass after model weight updates.</p>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 8. Practical Training Recipe */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">8. Practical Training Recipe</h2>

                <p className="text-foreground leading-relaxed">
                    Here is the minimal training loop structure that covers the key implementation choices: normalization before loss, proper device handling, and the hyperparameter surface to tune.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">train_biencoder.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">for</span><span className="text-zinc-300"> batch </span><span className="text-pink-400">in</span><span className="text-zinc-300"> train_loader:</span></div>
                            <div className="pl-4"><span className="text-zinc-300">queries, docs = batch</span></div>
                            <div className="pl-4 mt-2 text-zinc-500"># Forward pass through shared encoder</div>
                            <div className="pl-4"><span className="text-zinc-300">q_embs = encoder(queries)       </span><span className="text-zinc-500"># [B, D]</span></div>
                            <div className="pl-4"><span className="text-zinc-300">d_embs = encoder(docs)          </span><span className="text-zinc-500"># [B, D]</span></div>
                            <div className="pl-4 mt-2 text-zinc-500"># Mean-pool over tokens</div>
                            <div className="pl-4"><span className="text-zinc-300">q_embs = mean_pool(q_embs, queries.attention_mask)</span></div>
                            <div className="pl-4"><span className="text-zinc-300">d_embs = mean_pool(d_embs, docs.attention_mask)</span></div>
                            <div className="pl-4 mt-2 text-zinc-500"># Compute MNR loss</div>
                            <div className="pl-4"><span className="text-zinc-300">loss = mnr_loss(q_embs, d_embs, temperature=</span><span className="text-blue-300">0.05</span><span className="text-zinc-300">)</span></div>
                            <div className="pl-4 mt-2"><span className="text-zinc-300">optimizer.zero_grad()</span></div>
                            <div className="pl-4"><span className="text-zinc-300">loss.backward()</span></div>
                            <div className="pl-4"><span className="text-zinc-300">optimizer.step()</span></div>
                            <div className="pl-4"><span className="text-zinc-300">scheduler.step()</span></div>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800">Key Hyperparameters</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Hyperparameter</th>
                                <th className="text-left p-3 border-b font-semibold">Typical Range</th>
                                <th className="text-left p-3 border-b font-semibold">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-medium">Learning rate</td><td className="p-3 font-mono text-xs">1e-5 to 2e-4</td><td className="p-3 text-zinc-600">Lower for full fine-tune, higher for LoRA adapters</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Temperature</td><td className="p-3 font-mono text-xs">0.02 to 0.1</td><td className="p-3 text-zinc-600">0.05 is the most common default starting point</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Batch size</td><td className="p-3 font-mono text-xs">64 to 8192</td><td className="p-3 text-zinc-600">Bigger = more in-batch negatives = better signal</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Max seq length</td><td className="p-3 font-mono text-xs">128 to 512</td><td className="p-3 text-zinc-600">128 for queries, 256–512 for longer documents</td></tr>
                            <tr><td className="p-3 font-medium">Hard negatives</td><td className="p-3 font-mono text-xs">1 to 20 per pair</td><td className="p-3 text-zinc-600">Start with 1–3, increase as model quality improves</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Key Takeaways */}
            <section>
                <KeyTakeaways takeaways={takeaways} />
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/embedding-training/training-data" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 7.2 Training Data
                </Link>
                <Link href="/search/embedding-training/fine-tuning" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    7.4 Fine-Tuning Strategies <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
