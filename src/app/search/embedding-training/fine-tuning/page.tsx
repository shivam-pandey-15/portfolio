"use client";

import Link from "next/link";
import {
    ArrowRight, ArrowLeft, Layers, Cpu, BarChart2, AlertTriangle, CheckCircle, Zap, Settings, XCircle
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    {
        title: "The strategic question is adapting, not creating",
        description: "You start from a model that already understands language. Fine-tuning teaches it your domain's vocabulary, entity relationships, and relevance judgments. The goal is not to create a new language understanding from scratch but to shift the embedding geometry toward your users' intent."
    },
    {
        title: "LoRA gives 70–80% of the benefit at 20–40% of the VRAM cost",
        description: "Low-Rank Adaptation freezes all base weights and trains only two small matrices per layer. This makes fine-tuning feasible on smaller hardware and reduces catastrophic forgetting. In most production deployments, LoRA is the default choice unless the domain is extremely specialized."
    },
    {
        title: "Matryoshka enables flexible quality-cost tradeoffs at serving time",
        description: "Matryoshka representations are trained so the first N dimensions are always a valid embedding on their own. This means you can serve at 64d, 256d, or 1024d from a single model, tuning for latency vs. quality dynamically per use case without retraining."
    },
    {
        title: "Forgetting is the silent cost of full fine-tuning without anchors",
        description: "Full fine-tuning can over-write general language understanding in favor of domain specifics, causing catastrophic forgetting on queries outside your training distribution. LoRA inherently mitigates this. For full fine-tuning, regularization toward base model weights is essential."
    }
];

export default function FineTuningPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero Section */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 7.4</span>
                        <span>Training Embedding Models</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Fine-Tuning Strategies</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            Full fine-tuning, LoRA adapters, Matryoshka embeddings, and knowledge distillation. How to choose the right strategy for your constraints, and the failure modes that silently damage models in production.
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-red-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-red-700 font-medium text-sm"><Cpu className="w-4 h-4" /> Full Fine-Tune</div>
                        <p className="text-2xl font-bold text-zinc-900 mb-2">100% VRAM</p>
                        <p className="text-sm text-zinc-600">All model parameters are updated. Maximum expressive power but highest memory cost and forgetting risk.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm"><Layers className="w-4 h-4" /> LoRA</div>
                        <p className="text-2xl font-bold text-zinc-900 mb-2">20–40% VRAM</p>
                        <p className="text-sm text-zinc-600">Trains only small rank-decomposed matrices per layer. Minimal forgetting. Production default for most teams.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><BarChart2 className="w-4 h-4" /> Matryoshka</div>
                        <p className="text-2xl font-bold text-zinc-900 mb-2">3–10x Compression</p>
                        <p className="text-sm text-zinc-600">Truncatable multi-scale embedding. One model serves many latency and storage operating points without retraining.</p>
                    </div>
                </div>

                {/* Tip Box */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                        <strong>Core Strategic Question:</strong> You are not choosing how to train a model. You are choosing how to update a model that already understands language, so that it understands your domain&apos;s vocabulary, entity relationships, and relevance judgments — at the lowest cost and risk of regression.
                    </div>
                </div>
            </div>

            {/* 1. The Four Strategies */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. The Four Main Fine-Tuning Strategies</h2>

                <p className="text-foreground leading-relaxed">
                    There is not a single fine-tuning method. The right strategy depends on dataset size, hardware constraints, how specialized the domain is, and whether you need flexible serving dimensions. These four strategies cover the practical spectrum from simple adaptation to full re-shaping of the embedding space.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    {[
                        { name: "Full Fine-Tuning", icon: "🔥", desc: "All parameters updated. Best for very specialized domains where the base model has little coverage. High VRAM, highest catastrophic forgetting risk.", verdict: "Risky" },
                        { name: "LoRA (Low-Rank Adaptation)", icon: "⚡", desc: "Freeze base weights. Add rank-decomposed adapter matrices. Only adapters are trained. Strong performance at fraction of the VRAM cost.", verdict: "Recommended Default" },
                        { name: "Matryoshka Representation Learning", icon: "🪆", desc: "Train so that first-N dimesnions are always a valid embedding. Single model supports multiple vector sizes at serving time.", verdict: "Best for multi-SLA serving" },
                        { name: "Knowledge Distillation", icon: "🎓", desc: "Match score distributions from a teacher cross-encoder or LLM judge. Transfers fine-grained ranking quality without requiring explicit triplets.", verdict: "Best for precision transfer" }
                    ].map(s => (
                        <div key={s.name} className="border border-zinc-200 p-5 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{s.icon}</span>
                                <div>
                                    <h3 className="font-bold text-zinc-900">{s.name}</h3>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.verdict === "Recommended Default" ? "bg-green-100 text-green-700" : s.verdict === "Risky" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>{s.verdict}</span>
                                </div>
                            </div>
                            <p className="text-sm text-zinc-600">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. Full Fine-Tuning */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Full Fine-Tuning</h2>

                <p className="text-foreground leading-relaxed">
                    Full fine-tuning enables all model parameters to be updated during training. This gives the model maximum flexibility to reshape the embedding space toward domain-specific concepts, including specialized vocabulary, entity types, and ranking preferences that the base model was never exposed to.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">full_finetune.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-zinc-500"># All parameters are trainable</span></div>
                            <div><span className="text-pink-400">for</span><span className="text-zinc-300"> param </span><span className="text-pink-400">in</span><span className="text-zinc-300"> model.parameters():</span></div>
                            <div className="pl-4"><span className="text-zinc-300">param.requires_grad = </span><span className="text-blue-300">True</span></div>
                            <div className="mt-2"><span className="text-zinc-300">optimizer = AdamW(model.parameters(), lr=</span><span className="text-blue-300">2e-5</span><span className="text-zinc-300">)</span></div>
                            <div className="mt-2 text-zinc-500"># Low learning rate is critical to avoid forgetting</div>
                            <div className="mt-2 text-zinc-500"># Use warmup + cosine decay schedule</div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm">
                        <strong className="text-green-800 block mb-2">When to Use</strong>
                        <ul className="text-green-700 space-y-1">
                            <li>• Very specialized domains (biomedical, legal)</li>
                            <li>• Large domain-specific training sets (&gt;100K pairs)</li>
                            <li>• Base model has very limited coverage of your vocabulary</li>
                        </ul>
                    </div>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm">
                        <strong className="text-red-800 block mb-2">Risks</strong>
                        <ul className="text-red-700 space-y-1">
                            <li>• Catastrophic forgetting of general language</li>
                            <li>• High VRAM requirement</li>
                            <li>• Requires regularization (weight decay, EWC)</li>
                        </ul>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 3. LoRA */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. LoRA: Low-Rank Adaptation</h2>

                <p className="text-foreground leading-relaxed">
                    LoRA freezes all base model weights and adds small pairs of low-rank matrices to each transformer layer. Only these adapter matrices are trained. The effective weight update is computed as the product of the two small matrices, which is added to the frozen base weight at inference time.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">lora_concept.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div className="text-zinc-500"># Base weight is frozen entirely</div>
                            <div><span className="text-zinc-300">W_frozen = pretrained_weight  </span><span className="text-zinc-500"># [d_out, d_in] — never updated</span></div>
                            <div className="mt-2 text-zinc-500"># Two small learned adapter matrices</div>
                            <div><span className="text-zinc-300">A = nn.Parameter(torch.randn(rank, d_in) * </span><span className="text-blue-300">0.01</span><span className="text-zinc-300">)</span></div>
                            <div><span className="text-zinc-300">B = nn.Parameter(torch.zeros(d_out, rank))</span></div>
                            <div className="mt-2 text-zinc-500"># Effective weight = frozen base + learned low-rank update</div>
                            <div><span className="text-zinc-300">W_effective = W_frozen + (alpha / rank) * B </span><span className="text-purple-400">@</span><span className="text-zinc-300"> A</span></div>
                            <div className="mt-2 text-zinc-500"># At inference: merge adapters into weights, zero serving overhead</div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Hyperparameter</th>
                                <th className="text-left p-3 border-b font-semibold">Typical Value</th>
                                <th className="text-left p-3 border-b font-semibold">Effect</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-medium">rank</td><td className="p-3 font-mono text-xs">8, 16, 32</td><td className="p-3 text-zinc-600">Controls adapter expressivity. Higher rank = more parameters but stronger adaptation.</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">alpha</td><td className="p-3 font-mono text-xs">rank to 2×rank</td><td className="p-3 text-zinc-600">Scales the adapter update magnitude. Start at rank value as default.</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">dropout</td><td className="p-3 font-mono text-xs">0.05 to 0.1</td><td className="p-3 text-zinc-600">Regularizes adapter matrices. Prevents overfit on small datasets.</td></tr>
                            <tr><td className="p-3 font-medium">target_modules</td><td className="p-3 font-mono text-xs">q_proj, v_proj</td><td className="p-3 text-zinc-600">Apply adapters to query and value projections. Adding k_proj improves quality but increases cost.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 4. Matryoshka */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Matryoshka Representation Learning</h2>

                <p className="text-foreground leading-relaxed">
                    Matryoshka Representation Learning (MRL) trains the model so that the first N dimensions are always a valid, coherent embedding on their own. This allows you to truncate the vector to any size (64d, 128d, 256d, 512d, 1024d) after training and still get useful retrieval quality — at meaningfully different latency and storage costs.
                </p>

                <p className="text-foreground leading-relaxed">
                    The architecture is identical to a standard bi-encoder. Only the loss function changes: instead of a single MNR loss on the full embedding, you compute MNR loss at each target dimensionality and sum them.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">matryoshka_loss.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">def</span> <span className="text-yellow-300">matryoshka_loss</span><span className="text-zinc-300">(q_embs, d_embs, dims=[</span><span className="text-blue-300">64, 128, 256, 512, 1024</span><span className="text-zinc-300">]):</span></div>
                            <div className="pl-4"><span className="text-zinc-300">total = </span><span className="text-blue-300">0.0</span></div>
                            <div className="pl-4"><span className="text-pink-400">for</span><span className="text-zinc-300"> d </span><span className="text-pink-400">in</span><span className="text-zinc-300"> dims:</span></div>
                            <div className="pl-8 text-zinc-500"># Truncate to first d dimensions</div>
                            <div className="pl-8"><span className="text-zinc-300">q_d = q_embs[:, :d]</span></div>
                            <div className="pl-8"><span className="text-zinc-300">d_d = d_embs[:, :d]</span></div>
                            <div className="pl-8 text-zinc-500"># Full MNR loss at this dimensionality</div>
                            <div className="pl-8"><span className="text-zinc-300">total += mnr_loss(q_d, d_d)</span></div>
                            <div className="pl-4"><span className="text-pink-400">return</span><span className="text-zinc-300"> total / len(dims)</span></div>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800">Production Operating Points</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Dimensions</th>
                                <th className="text-left p-3 border-b font-semibold">Use Case</th>
                                <th className="text-left p-3 border-b font-semibold">Tradeoff</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-mono">64d</td><td className="p-3 text-zinc-600">Autocomplete, fast type-ahead</td><td className="p-3 text-green-700">Fastest, lowest memory, minor quality loss</td></tr>
                            <tr className="border-b"><td className="p-3 font-mono">256d</td><td className="p-3 text-zinc-600">Main retrieval first-pass</td><td className="p-3 text-zinc-600">Good balance — default for most production deployments</td></tr>
                            <tr><td className="p-3 font-mono">1024d</td><td className="p-3 text-zinc-600">High-precision reranking stage</td><td className="p-3 text-red-700">Slower, higher memory, maximum quality</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. Choosing a Base Model */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. Choosing the Right Base Model</h2>

                <p className="text-foreground leading-relaxed">
                    The base model you start from affects fine-tuning outcomes more than training recipe details. Models that are already trained for retrieval converge faster, need less data, and produce better results after domain adaptation. Raw language models (BERT, RoBERTa) without retrieval pre-training require much larger datasets and more epochs to rival retrieval-specialized bases.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Model Family</th>
                                <th className="text-left p-3 border-b font-semibold">Params</th>
                                <th className="text-left p-3 border-b font-semibold">Standard Dim</th>
                                <th className="text-left p-3 border-b font-semibold">Best Use Case</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-3 font-medium">BGE (BAAI)</td>
                                <td className="p-3 text-zinc-600">110M–335M</td>
                                <td className="p-3 font-mono text-xs">768, 1024</td>
                                <td className="p-3 text-zinc-600">Strong MTEB scores, English/multilingual retrieval, instruction-prefix support</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3 font-medium">E5 (Microsoft)</td>
                                <td className="p-3 text-zinc-600">110M–560M</td>
                                <td className="p-3 font-mono text-xs">768, 1024</td>
                                <td className="p-3 text-zinc-600">Consistent cross-domain results, straightforward fine-tuning</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium">MiniLM (Sentence Transformers)</td>
                                <td className="p-3 text-zinc-600">22M–33M</td>
                                <td className="p-3 font-mono text-xs">384</td>
                                <td className="p-3 text-zinc-600">Latency-constrained mobile/edge deployments, lightweight APIs</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 6. Common Strategy Combos */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">6. Common Strategy Combinations</h2>

                <p className="text-foreground leading-relaxed">
                    These four combinations cover most real-world deployment scenarios. Higher combinations trade cost for capability.
                </p>

                <div className="grid md:grid-cols-2 gap-5">
                    {[
                        { label: "LoRA + In-Batch Negatives", desc: "The simplest and most common first step. Adapts domain vocabulary with minimal hardware requirements. Good starting point for any team.", tag: "Start here" },
                        { label: "LoRA + Hard Negatives + MNR", desc: "Adds hard negative mining to LoRA training. Teaches fine-grained boundaries. Most production deployments evolve to this.", tag: "Production default" },
                        { label: "Full Fine-Tune + Matryoshka + Distillation", desc: "High-capability setup for specialized domains. Rewrites the base model, trains multi-scale embeddings, and distills from a cross-encoder teacher.", tag: "High-investment" },
                        { label: "LoRA + Matryoshka", desc: "Memory-efficient fine-tuning combined with multi-scale serving flexibility. Allows a single model to serve multiple SLAs at different dimensions.", tag: "Efficiency optimized" }
                    ].map(c => (
                        <div key={c.label} className="border border-zinc-200 p-5 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-zinc-900">{c.label}</h3>
                                <span className="text-xs font-medium px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-full">{c.tag}</span>
                            </div>
                            <p className="text-sm text-zinc-600">{c.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <hr className="border-border" />

            {/* 7. Practical Decision Table */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">7. Practical Decision Table</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Situation</th>
                                <th className="text-left p-3 border-b font-semibold">Recommended Strategy</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">Limited GPU (&lt;1 GPU, 24GB), any domain</td><td className="p-3 text-zinc-600">LoRA on small base (MiniLM or BGE-small)</td></tr>
                            <tr className="border-b"><td className="p-3">Specialized domain, 50K+ training pairs</td><td className="p-3 text-zinc-600">Full fine-tuning with BGE or E5, low learning rate</td></tr>
                            <tr className="border-b"><td className="p-3">Multiple latency SLAs from one model</td><td className="p-3 text-zinc-600">Matryoshka loss, any base, multiple serving dims</td></tr>
                            <tr className="border-b"><td className="p-3">Have a strong cross-encoder teacher model</td><td className="p-3 text-zinc-600">Distillation (MarginMSE) to transfer precision</td></tr>
                            <tr><td className="p-3">Cold start, no click data yet</td><td className="p-3 text-zinc-600">LoRA on base model + synthetic LLM-generated pairs</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 8. Failure Modes */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">8. Fine-Tuning Failure Modes</h2>

                <div className="space-y-4">
                    {[
                        { title: "Catastrophic Forgetting", color: "red", desc: "Aggressive full fine-tuning rewrites general language understanding. Out-of-domain recall collapses while in-domain metrics improve. Fix: regularize toward base weights, use LoRA, reduce learning rate." },
                        { title: "Adapter Rank Lock-In", color: "orange", desc: "Using LoRA rank too low (rank=2 or rank=4) for a highly specialized domain. The adapters can't express enough domain-specific geometry shifts. Fix: increase rank incrementally and monitor nDCG@10." },
                        { title: "Dimension Truncation Cliff", color: "yellow", desc: "Matryoshka model performs well at full dimensions but drops sharply at 64d or 128d, suggesting the early dimensions were not trained to be independently coherent. Fix: ensure all target dims are in the loss function during training." },
                        { title: "Query-Document Serving Mismatch", color: "purple", desc: "Queries encoded with the new fine-tuned model, documents still indexed with the pre-fine-tune model. Scores become incoherent. Fix: always re-embed the full corpus after any weight update to the encoder." }
                    ].map(f => (
                        <div key={f.title} className={`border border-${f.color}-200 bg-${f.color}-50 p-5 rounded-xl`}>
                            <h3 className={`font-bold text-${f.color}-900 flex items-center gap-2 mb-2`}>
                                <XCircle className="h-4 w-4" /> {f.title}
                            </h3>
                            <p className={`text-sm text-${f.color}-800`}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Key Takeaways */}
            <section>
                <KeyTakeaways takeaways={takeaways} />
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/embedding-training/contrastive" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 7.3 Contrastive Learning
                </Link>
                <Link href="/search/embedding-training/evaluation" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    7.5 Evaluation Metrics <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
