"use client";

import Link from "next/link";
import {
    ArrowRight, ArrowLeft, Server, Zap, RefreshCcw, AlertTriangle, CheckCircle, Database, BarChart2, XCircle, ShieldCheck
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    {
        title: "Treat query and document inference as two separate pipelines",
        description: "Query encoding is latency-sensitive — it happens on every search request. Document encoding is throughput-sensitive — it runs as a batch job that must complete before stale docs pile up. Optimizing both with the same technique is a common mistake. ONNX + GPU helps queries; batching + async workers help documents."
    },
    {
        title: "A full corpus re-embedding pass must be triggered after any weight update",
        description: "After fine-tuning, all previously indexed document vectors were produced by the old model. Serving new query vectors against old document vectors produces incoherent scores. This is the most common production failure and is entirely preventable with a gated deployment process."
    },
    {
        title: "Blue-green rollouts protect against catastrophic embedding failures",
        description: "The shadow index pattern allows you to build and validate a new embedding index in parallel before cutting over any traffic. If validation fails, you revert instantly with zero user impact. This should be the standard deployment model for every embedding update."
    },
    {
        title: "Monitor embedding health directly, not just query latency",
        description: "Embedding-specific metrics — vector norm distribution, cosine similarity of near-duplicate docs, ANN recall spot-checks — catch model degradation before it surfaces in business metrics. Standard infrastructure monitoring cannot see these signals."
    }
];

export default function DeploymentPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero Section */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 7.6</span>
                        <span>Training Embedding Models</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Production Deployment of Embedding Models</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            How to take a fine-tuned embedding model from training to production safely. ONNX export, query vs. document pipelines, blue-green rollouts, caching, dynamic batching, monitoring, and the five failure modes that hit teams after launch.
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-red-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-red-700 font-medium text-sm"><AlertTriangle className="w-4 h-4" /> Common Mistake</div>
                        <p className="text-2xl font-bold text-zinc-900 mb-2">Vector Mismatch</p>
                        <p className="text-sm text-zinc-600">New query encoder + old document index = incoherent scores. Always re-embed the full corpus after any weight update.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm"><Zap className="w-4 h-4" /> Optimization</div>
                        <p className="text-2xl font-bold text-zinc-900 mb-2">2–10x Speedup</p>
                        <p className="text-sm text-zinc-600">ONNX export + quantization (FP32→INT8) typically delivers 2–10x inference speedup with under 1% quality loss.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><RefreshCcw className="w-4 h-4" /> Re-Embedding</div>
                        <p className="text-2xl font-bold text-zinc-900 mb-2">Required</p>
                        <p className="text-sm text-zinc-600">After every model update, the full document corpus must be re-embedded and the ANN index rebuilt before cutover.</p>
                    </div>
                </div>

                {/* Tip Box */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                        <strong>Deployment Complexity:</strong> Shipping an embedding model is not like shipping a classifier. A classifier update affects predictions. An embedding model update affects every vector in your index. Small model weight changes propagate to every document at serving time. This requires a different deployment pattern than standard ML serving.
                    </div>
                </div>
            </div>

            {/* 1. Two Inference Pipelines */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. Two Inference Pipelines: Query and Document</h2>

                <p className="text-foreground leading-relaxed">
                    Embedding inference splits into two fundamentally different jobs. Query encoding happens on every search request — it must be fast, with p99 latency under 50ms for most search applications. Document encoding runs as a batch job — it must be throughput-efficient to finish re-embedding millions of documents before query-vs-document drift accumulates.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                            <Zap className="h-5 w-5" /> Online Query Pipeline
                        </h3>
                        <p className="text-sm text-blue-800 mb-3">Constraint: latency. Every search request waits for this to complete. Users are present.</p>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Model: ONNX-exported, INT8-quantized on GPU</li>
                            <li>• Batch size: 1 or small batches (1-4)</li>
                            <li>• Caching: LRU on popular query embeddings</li>
                            <li>• Target: p99 &lt; 20–50ms</li>
                        </ul>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
                        <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                            <Server className="h-5 w-5" /> Offline Document Pipeline
                        </h3>
                        <p className="text-sm text-green-800 mb-3">Constraint: throughput and cost. Batch job, no user waiting. Must finish before stale index causes drift.</p>
                        <ul className="text-sm text-green-700 space-y-1">
                            <li>• Model: FP16 or INT8, maximized GPU utilization</li>
                            <li>• Batch size: 256–2048 per GPU, async multi-worker</li>
                            <li>• Trigger: any model weight update</li>
                            <li>• Target: complete full corpus before cutover</li>
                        </ul>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. Model Export and Optimization */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Model Export and Optimization</h2>

                <p className="text-foreground leading-relaxed">
                    Serving a raw PyTorch model in production is inefficient. ONNX export removes Python overhead and enables hardware-specific optimizations. Combined with quantization, this typically delivers 2–10x speedups with under 1% quality degradation when done correctly.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">export_onnx.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">import</span><span className="text-zinc-300"> onnxruntime </span><span className="text-pink-400">as</span><span className="text-zinc-300"> ort</span></div>
                            <div className="mt-2 text-zinc-500"># Export PyTorch model to ONNX format</div>
                            <div><span className="text-zinc-300">torch.onnx.export(</span></div>
                            <div className="pl-4"><span className="text-zinc-300">model,</span></div>
                            <div className="pl-4"><span className="text-zinc-300">dummy_input,</span></div>
                            <div className="pl-4"><span className="text-green-300">&quot;model.onnx&quot;</span><span className="text-zinc-300">,</span></div>
                            <div className="pl-4"><span className="text-zinc-300">opset_version=</span><span className="text-blue-300">17</span><span className="text-zinc-300">,</span></div>
                            <div className="pl-4"><span className="text-zinc-300">input_names=[</span><span className="text-green-300">&quot;input_ids&quot;</span><span className="text-zinc-300">, </span><span className="text-green-300">&quot;attention_mask&quot;</span><span className="text-zinc-300">],</span></div>
                            <div className="pl-4"><span className="text-zinc-300">output_names=[</span><span className="text-green-300">&quot;last_hidden_state&quot;</span><span className="text-zinc-300">],</span></div>
                            <div className="pl-4"><span className="text-zinc-300">dynamic_axes=&#123;</span><span className="text-green-300">&quot;input_ids&quot;</span><span className="text-zinc-300">: &#123;</span><span className="text-blue-300">0</span><span className="text-zinc-300">: </span><span className="text-green-300">&quot;batch&quot;</span><span className="text-zinc-300">, </span><span className="text-blue-300">1</span><span className="text-zinc-300">: </span><span className="text-green-300">&quot;seq_len&quot;</span><span className="text-zinc-300">&#125;&#125;</span></div>
                            <div><span className="text-zinc-300">)</span></div>
                            <div className="mt-2 text-zinc-500"># Load optimized session for inference</div>
                            <div><span className="text-zinc-300">session = ort.InferenceSession(</span></div>
                            <div className="pl-4"><span className="text-green-300">&quot;model.onnx&quot;</span><span className="text-zinc-300">,</span></div>
                            <div className="pl-4"><span className="text-zinc-300">providers=[</span><span className="text-green-300">&quot;CUDAExecutionProvider&quot;</span><span className="text-zinc-300">, </span><span className="text-green-300">&quot;CPUExecutionProvider&quot;</span><span className="text-zinc-300">]</span></div>
                            <div><span className="text-zinc-300">)</span></div>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800">Quantization Levels</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Precision</th>
                                <th className="text-left p-3 border-b font-semibold">Memory</th>
                                <th className="text-left p-3 border-b font-semibold">Speed</th>
                                <th className="text-left p-3 border-b font-semibold">Risk</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-mono">FP32</td><td className="p-3 text-zinc-600">Baseline</td><td className="p-3 text-zinc-600">Baseline</td><td className="p-3 text-green-700">None — reference</td></tr>
                            <tr className="border-b"><td className="p-3 font-mono">FP16</td><td className="p-3 text-zinc-600">50% of FP32</td><td className="p-3 text-zinc-600">1.5–2x</td><td className="p-3 text-zinc-600">Minimal — standard for GPU inference</td></tr>
                            <tr><td className="p-3 font-mono">INT8</td><td className="p-3 text-zinc-600">25% of FP32</td><td className="p-3 text-zinc-600">2–4x on CPU/NPU</td><td className="p-3 text-amber-700">Must validate — embedding norms can shift</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm text-red-800">
                    <strong>Quantization Warning:</strong> INT8 quantization is not safe to apply without validation. Embedding norms shift after quantization, especially after L2 normalization. Always benchmark quantized vs. FP32 on your nDCG evaluation benchmark before shipping INT8 to production.
                </div>
            </section>

            <hr className="border-border" />

            {/* 3. Blue-Green Rollouts */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Blue-Green Rollouts for Embedding Updates</h2>

                <p className="text-foreground leading-relaxed">
                    Standard blue-green deployment swaps a new model version in place of the old one. For embedding models, this requires an additional step: the document index must be fully rebuilt with the new model before any query traffic uses it. Swapping model weights without rebuilding the index is the most common and most damaging embedding deployment mistake.
                </p>

                <div className="space-y-3">
                    {[
                        { step: "1", title: "Start parallel shadow index", desc: "Begin encoding all corpus documents with the new model into a shadow ANN index. Keep the current (blue) index serving all live traffic. No user impact." },
                        { step: "2", title: "Validate shadow index offline", desc: "Run your full nDCG benchmark against the shadow index. Compare all query slices against the current index. Reject if any slice regresses." },
                        { step: "3", title: "Canary traffic (1–5%)", desc: "Route a small fraction of live queries against the shadow index. Monitor CTR, zero-result rate, and session quality in real time. Watch ANN recall metrics." },
                        { step: "4", title: "Gradual rollout (10% → 50% → 100%)", desc: "Increase traffic incrementally. Hold at each step for enough time to detect regressions. Automated rollback triggers on metric degradation." },
                        { step: "5", title: "Decommission old index", desc: "Only after 100% traffic has been confirmed stable for 24–48 hours, delete the old document index. Retain model weights and training artifacts for rollback." }
                    ].map(s => (
                        <div key={s.step} className="flex gap-4 border border-zinc-200 p-4 rounded-lg">
                            <div className="bg-primary/10 text-primary font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">{s.step}</div>
                            <div>
                                <div className="font-semibold text-sm text-zinc-900">{s.title}</div>
                                <p className="text-sm text-zinc-600 mt-1">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <hr className="border-border" />

            {/* 4. Dynamic Batching and Caching */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Dynamic Batching and Embedding Caching</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Dynamic Batching</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            GPU utilization collapses when you process one query at a time. Dynamic batching collects multiple concurrent requests into a single inference call, amortizing GPU overhead across all requests. Frameworks like NVIDIA Triton Inference Server support dynamic batching natively with configurable latency budgets.
                        </p>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            Key tradeoff: batching increases throughput but adds queuing latency. Set the batch window (time budget before flushing the batch) to be less than your p99 latency target. Starting batch window: 5–15ms.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Query Embedding Cache</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            Popular head queries repeat constantly. Caching their embeddings avoids redundant model inference. A simple LRU cache keyed on the normalized query string (lowercased, whitespace-stripped) typically achieves 15–40% hit rate depending on query distribution.
                        </p>
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-800">
                            <strong>Cache Invalidation:</strong> When the model is updated, all cached embeddings become stale (produced by the old encoder). Flush the entire cache atomically on every model deployment.
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. Monitoring */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. Embedding-Specific Monitoring</h2>

                <p className="text-foreground leading-relaxed">
                    Standard infrastructure monitoring (CPU, memory, latency) does not catch embedding-specific degradation. These signals require custom instrumentation but are essential for detecting model health problems before they propagate into user experience metrics.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-zinc-800">Infrastructure Metrics</h3>
                        {[
                            { m: "Query encoder p50/p99 latency", n: "Track separately from total search latency to isolate encoder regressions" },
                            { m: "Throughput (QPS)", n: "Monitor per serving instance to detect overload before latency spikes" },
                            { m: "GPU utilization", n: "Low utilization often means batch sizes are too small" },
                            { m: "Index build time", n: "Track re-embedding job duration to catch model slowdowns early" }
                        ].map(i => (
                            <div key={i.m} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <div><strong className="text-zinc-900">{i.m}:</strong> <span className="text-zinc-600">{i.n}</span></div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-zinc-800">Embedding Health Metrics</h3>
                        {[
                            { m: "Vector norm distribution", n: "Should be stable across model versions. Drift indicates quantization issue or bad normalization layer" },
                            { m: "ANN recall spot-checks", n: "Periodically run exact search vs ANN on sample queries to confirm recall is within target (>95%)" },
                            { m: "Cosine similarity of near-duplicate docs", n: "Should be very high (>0.98). Low similarity after update indicates embedding space drift" },
                            { m: "Business metrics (CTR, zero-result rate)", n: "Final arbiter. Embedding health metrics gate the diagnosis, business metrics confirm user impact" }
                        ].map(i => (
                            <div key={i.m} className="flex items-start gap-2 text-sm">
                                <BarChart2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <div><strong className="text-zinc-900">{i.m}:</strong> <span className="text-zinc-600">{i.n}</span></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 6. Production Failure Modes */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">6. Five Common Production Failure Modes</h2>

                <div className="space-y-4">
                    {[
                        { title: "Vector Space Mismatch After Update", color: "red", desc: "The new fine-tuned query encoder is deployed but old document vectors remain in the index. Scores become incoherent — queries return wrong results but without obvious errors. Fix: mandatory full re-embedding pipeline before any encoder is deployed to production." },
                        { title: "INT8 Quantization Norm Shift", color: "orange", desc: "After INT8 quantization, embedding norms can shift in ways that break cosine similarity. Affected models may have good nDCG on benchmark but fail on queries at threshold boundary. Fix: always validate quantized model against full nDCG benchmark before shipping." },
                        { title: "ANN Index Stale After Massive Doc Ingestion", color: "yellow", desc: "If documents are added to the corpus but not encoded and added to the ANN index promptly, search misses newly added content. This is invisible until a user searches for something that only exists in the new documents. Fix: streaming index updates or bounded re-indexing schedules." },
                        { title: "Cache Serving Stale Embeddings", color: "purple", desc: "Query embeddings cached before a model update are served post-update. The cached query vector was produced by the old encoder and is compared against document vectors from the new encoder. Fix: flush embedding cache atomically on every model deployment." },
                        { title: "Batch Size Cap at Serving Underutilizes GPU", color: "zinc", desc: "Serving configured with batch_size=1 leaves 95%+ GPU capacity idle under load. When traffic spikes, latency jumps because requests queue instead of batching. Fix: configure dynamic batching with max_batch=32-64 and latency budget of 10-20ms." }
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

            <hr className="border-border" />

            {/* 7. Deployment Checklist */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">7. Production Deployment Checklist</h2>

                <p className="text-foreground leading-relaxed">
                    Before shipping any embedding model update to production, verify every item in this checklist. A single missed step is enough to produce incoherent search results for all users.
                </p>

                <div className="space-y-3">
                    {[
                        { item: "Offline benchmark passes on all query slices (no regressions vs. current model)", critical: true },
                        { item: "ONNX export validated — output cosine similarities match PyTorch for N random queries", critical: true },
                        { item: "Quantization validated — nDCG delta within 0.5% of FP32 reference on benchmark", critical: true },
                        { item: "Full corpus re-embedding job queued and will complete before traffic cutover", critical: true },
                        { item: "Shadow ANN index built from new document vectors and validated offline", critical: true },
                        { item: "Query embedding cache flush scheduled to fire atomically with traffic cutover", critical: true },
                        { item: "Rollback plan documented — old index retained and rollback takes under 5 minutes", critical: false },
                        { item: "Monitoring dashboards updated — vector norm baseline set for new model", critical: false },
                        { item: "ANN recall spot-check scheduled for 1 hour post-cutover", critical: false },
                        { item: "On-call team notified of deployment window and escalation path", critical: false }
                    ].map((c, i) => (
                        <div key={i} className={`flex items-start gap-3 p-4 border rounded-lg ${c.critical ? "border-primary/20 bg-primary/5" : "border-zinc-200"}`}>
                            <ShieldCheck className={`w-5 h-5 flex-shrink-0 mt-0.5 ${c.critical ? "text-primary" : "text-zinc-400"}`} />
                            <div className="flex-1">
                                <span className="text-sm font-medium text-zinc-900">{c.item}</span>
                                {c.critical && <span className="ml-2 text-xs text-primary font-medium">Required</span>}
                            </div>
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
                <Link href="/search/embedding-training/evaluation" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 7.5 Evaluation Metrics
                </Link>
                <Link href="/search/embedding-training" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    Chapter 7 Overview <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
