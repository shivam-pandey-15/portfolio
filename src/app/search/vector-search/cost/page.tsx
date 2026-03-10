"use client";

import Link from "next/link";
import {
    DollarSign, ArrowRight, ArrowLeft, Zap, AlertTriangle,
    HardDrive, Cpu, Cloud, Layers, TrendingDown,
    Server, MemoryStick
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Memory Is the Dominant Cost", description: "1B vectors × 768-dim float32 = 3 TB of RAM ≈ $25K/month on AWS (6× r6g.16xlarge). Non-linear scaling: 10x data costs ~7x more because larger instances have worse price/GB ratios." },
    { title: "Quantization Is the Single Biggest Lever", description: "Scalar int8 (4x compression) saves ~$19K/month at billion-scale with 2-5% recall loss. PQ (32x) saves ~$24K/month but needs two-phase search. This is always the first optimization." },
    { title: "DiskANN: 5-8x Cost Reduction at Billion Scale", description: "1B vectors: HNSW needs ~3.2 TB RAM ($25K/mo). DiskANN needs ~64 GB RAM + 3 TB SSD ($3-5K/mo). Latency tradeoff: <1ms → 5-20ms. Acceptable for most applications." },
    { title: "Two-Phase Search Is the Production Standard", description: "Search compressed index in RAM → re-score top-100 candidates with full-precision vectors from SSD. Result: PQ memory costs with 98%+ recall. SSD I/O: 100 × 3KB = 300KB ≈ 0.5ms on NVMe." },
    { title: "Matryoshka Embeddings: 3x Savings That Compound", description: "768-dim → 256-dim prefix with only 2-5% recall loss (trained for prefix quality). For 1B vectors: $25K → $8.3K/month. Compounds with quantization: 256-dim int8 = 12x total compression." },
];

export default function CostPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.9</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Cost of Vector Search at Scale</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            HNSW indexes require terabytes of RAM. Embedding models consume GPU hours. At billion-scale,
                            infrastructure costs can dominate a company&apos;s entire search budget. This chapter provides
                            concrete cost analysis and optimization strategies that can reduce costs by 10-30x.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-red-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-red-700 font-medium text-sm"><Server className="w-4 h-4" /> 1B Vectors (HNSW)</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">$25K/mo</p>
                        <p className="text-sm text-zinc-600">~3.2 TB RAM needed. 7× r6g.16xlarge instances at AWS on-demand pricing.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm"><TrendingDown className="w-4 h-4" /> With Quantization</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">$800/mo</p>
                        <p className="text-sm text-zinc-600">PQ (32x compression): 3 TB → 96 GB. 97% cost reduction with two-phase search.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><Cpu className="w-4 h-4" /> Embedding Cost (1B docs)</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">$600-$20K</p>
                        <p className="text-sm text-zinc-600">Local (MiniLM on A100): $600. API (OpenAI): ~$20K. Re-embedding on model upgrade repeats.</p>
                    </div>
                </div>
            </div>

            {/* 1. Embedding Cost */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. Embedding Generation Cost</h2>
                <p className="text-foreground leading-relaxed">
                    Before you can search vectors, you need to create them. Every document in your corpus must be
                    passed through a neural network to produce its embedding. This is a one-time cost per document
                    (plus re-embedding when documents change), but at scale it becomes substantial. The cost depends
                    on the model size: smaller models are faster and cheaper but produce lower-quality embeddings.
                    Larger models produce better embeddings but cost more to run. API-based models are convenient
                    but charge per token.
                </p>

                <p className="text-foreground leading-relaxed">
                    At <strong>1 billion documents</strong>, local embedding (all-MiniLM on A100) costs ~$600 in GPU
                    hours over ~55 hours of compute. A higher-quality model like e5-large costs ~$3,750 over 14 days
                    on a single GPU. API-based embedding (OpenAI) costs ~$20,000 with no GPU hardware needed, but
                    rate limits mean it could take days. <strong>Re-embedding cost</strong> is critical: when you
                    upgrade to a better model (which happens regularly as the field advances), you must re-embed
                    your entire corpus — a full repeat of the original cost.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Model</th>
                                <th className="text-left p-3 border-b font-semibold">Dims</th>
                                <th className="text-left p-3 border-b font-semibold">Speed (A100)</th>
                                <th className="text-left p-3 border-b font-semibold">Cost/1M docs</th>
                                <th className="text-left p-3 border-b font-semibold">MTEB</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">all-MiniLM-L6-v2</td><td className="p-3">384</td><td className="p-3">~5,000/sec</td><td className="p-3 text-green-700">~$0.60</td><td className="p-3">56.3</td></tr>
                            <tr className="border-b"><td className="p-3">all-mpnet-base-v2</td><td className="p-3">768</td><td className="p-3">~2,500/sec</td><td className="p-3">~$1.20</td><td className="p-3">57.8</td></tr>
                            <tr className="border-b"><td className="p-3">e5-large-v2</td><td className="p-3">1024</td><td className="p-3">~800/sec</td><td className="p-3">~$3.75</td><td className="p-3">62.2</td></tr>
                            <tr className="border-b"><td className="p-3">OpenAI text-embedding-3-small</td><td className="p-3">1536</td><td className="p-3">API</td><td className="p-3 text-red-700">~$20</td><td className="p-3">—</td></tr>
                            <tr><td className="p-3">Cohere embed-v3</td><td className="p-3">1024</td><td className="p-3">API</td><td className="p-3">~$10</td><td className="p-3">—</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 2. Storage Cost */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Storage Cost (Raw Vectors)</h2>
                <p className="text-foreground leading-relaxed">
                    The memory required to store vectors follows a simple formula:
                    <strong> memory_per_vector = dimensions × bytes_per_float</strong>. For 768-dimensional float32
                    vectors, that&apos;s 768 × 4 = 3,072 bytes (3 KB) per vector. These per-vector costs seem small,
                    but they compound brutally at scale. The table below shows how storage requirements grow as you
                    move from millions to billions of vectors, and how reducing precision (float16, int8) provides
                    significant savings.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Scale</th>
                                <th className="text-left p-3 border-b font-semibold">float32 (768d)</th>
                                <th className="text-left p-3 border-b font-semibold">float16</th>
                                <th className="text-left p-3 border-b font-semibold">int8</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">1M</td><td className="p-3">3 GB</td><td className="p-3">1.5 GB</td><td className="p-3">0.75 GB</td></tr>
                            <tr className="border-b"><td className="p-3">10M</td><td className="p-3">30 GB</td><td className="p-3">15 GB</td><td className="p-3">7.5 GB</td></tr>
                            <tr className="border-b"><td className="p-3">100M</td><td className="p-3">300 GB</td><td className="p-3">150 GB</td><td className="p-3">75 GB</td></tr>
                            <tr><td className="p-3 font-medium">1B</td><td className="p-3 text-red-700 font-medium">3,000 GB (3 TB)</td><td className="p-3">1,500 GB</td><td className="p-3 text-green-700">750 GB</td></tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-foreground leading-relaxed">
                    To put 3 TB in context: AWS r6g.16xlarge has 512 GB RAM at ~$3,600/month. You&apos;d need <strong>6
                    instances</strong> just for raw vectors — ~$21,600/month before index overhead.
                </p>
            </section>

            <hr className="border-border" />

            {/* 3. Infrastructure Cost */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Infrastructure Cost (Cloud)</h2>
                <p className="text-foreground leading-relaxed">
                    Here&apos;s what it actually costs to run vector search at various scales on cloud infrastructure.
                    These numbers are based on AWS pricing (on-demand, us-east-1, 2024) and should be treated as
                    illustrative. Notice the <strong>non-linear cost scaling</strong>: going from 100M to 1B
                    vectors (10x data) costs ~7x more in infrastructure because larger instances have worse
                    price/GB ratios and you need more of them, plus operational overhead increases.
                </p>

                <p className="text-foreground leading-relaxed">
                    <strong>Managed vector database costs</strong> (Pinecone, Weaviate Cloud, etc.) are typically
                    2-5x higher than self-managed cloud instances, but include operational overhead, scaling,
                    backups, and monitoring. For teams without dedicated infrastructure engineers, the managed
                    premium is often worth it.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Vectors</th>
                                <th className="text-left p-3 border-b font-semibold">HNSW RAM</th>
                                <th className="text-left p-3 border-b font-semibold">Instance</th>
                                <th className="text-left p-3 border-b font-semibold">Monthly</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">1M</td><td className="p-3">~4 GB</td><td className="p-3">r6g.large</td><td className="p-3">~$90</td></tr>
                            <tr className="border-b"><td className="p-3">10M</td><td className="p-3">~35 GB</td><td className="p-3">r6g.xlarge × 2</td><td className="p-3">~$360</td></tr>
                            <tr className="border-b"><td className="p-3">100M</td><td className="p-3">~350 GB</td><td className="p-3">r6g.8xlarge × 2</td><td className="p-3">~$3,600</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">1B</td><td className="p-3 font-medium">~3.2 TB</td><td className="p-3">r6g.16xlarge × 7</td><td className="p-3 text-red-700 font-medium">~$25,000</td></tr>
                            <tr><td className="p-3">10B</td><td className="p-3">~32 TB</td><td className="p-3">70+ instances</td><td className="p-3 text-red-700 font-medium">~$250,000</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* 4. Optimization Strategies */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Cost Optimization Strategies</h2>
                <p className="text-foreground leading-relaxed">
                    The good news is that several techniques can dramatically reduce vector search costs. The strategies
                    below are listed in order of impact — quantization alone can save $19K/month at billion-scale, and
                    combining multiple strategies can reduce costs by 10-30x while maintaining acceptable recall.
                </p>

                <h3 className="text-xl font-semibold text-zinc-800">Strategy 1: Quantization</h3>
                <p className="text-foreground leading-relaxed">
                    Quantization reduces the precision of each number in the vector, trading a small amount of accuracy
                    for massive memory savings. This is almost always the first optimization to apply because it&apos;s simple,
                    well-understood, and the recall impact is manageable. Scalar quantization maps each float32 dimension
                    to an int8 value (4x savings), while product quantization (PQ) compresses the full vector into ~96
                    sub-vector centroid IDs (32x savings).
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Method</th>
                                <th className="text-left p-3 border-b font-semibold">Compression</th>
                                <th className="text-left p-3 border-b font-semibold">Recall Loss</th>
                                <th className="text-left p-3 border-b font-semibold">Memory (1B)</th>
                                <th className="text-left p-3 border-b font-semibold">Monthly</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">float32</td><td className="p-3">1x</td><td className="p-3">—</td><td className="p-3">3,000 GB</td><td className="p-3">~$25,000</td></tr>
                            <tr className="border-b"><td className="p-3">float16</td><td className="p-3">2x</td><td className="p-3">&lt;1%</td><td className="p-3">1,500 GB</td><td className="p-3">~$12,500</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Scalar int8</td><td className="p-3">4x</td><td className="p-3">2-5%</td><td className="p-3 text-green-700">750 GB</td><td className="p-3 text-green-700">~$6,200</td></tr>
                            <tr><td className="p-3 font-medium">PQ (M=96)</td><td className="p-3 font-medium">32x</td><td className="p-3">5-15%</td><td className="p-3 text-green-700 font-medium">96 GB</td><td className="p-3 text-green-700 font-medium">~$800</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800">Strategy 2: DiskANN</h3>
                <p className="text-foreground leading-relaxed">
                    Microsoft&apos;s DiskANN stores the Vamana graph on SSD instead of RAM, keeping only compressed PQ
                    codes in memory. The fundamental insight is that SSD storage costs ~10x less per GB than RAM,
                    and modern NVMe SSDs can deliver the random I/O patterns needed for graph traversal with
                    acceptable latency (5-20ms per query vs. &lt;1ms for in-memory HNSW). For many applications,
                    10-20ms query latency is perfectly acceptable.
                </p>
                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="space-y-2">
                        <div>HNSW (1B, 768d):    ~3.2 TB RAM   → <span className="text-red-400">~$25,000/mo</span></div>
                        <div>DiskANN (1B, 768d):  ~64 GB RAM + 3 TB SSD → <span className="text-green-400">~$3,000-5,000/mo</span></div>
                        <div className="text-zinc-500">                       → 5-8x cost reduction</div>
                        <div className="mt-2">Latency: HNSW &lt;1ms  vs  DiskANN 5-20ms</div>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800">Strategy 3: Tiered Storage</h3>
                <p className="text-foreground leading-relaxed">
                    Not all vectors need to be in RAM. Production systems implement tiered storage based on access
                    patterns — recent and frequently accessed vectors stay in fast RAM (HNSW), moderately accessed
                    vectors move to SSD (DiskANN), and rarely accessed archival vectors live on cheap object storage.
                    The key is building a routing layer that directs queries to the appropriate tier based on
                    recency and access frequency.
                </p>
                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="space-y-2 text-xs">
                        <div><span className="text-green-400">Tier 1 (RAM):</span>  Hot vectors (recent, popular) → HNSW, &lt;1ms → 10-20% of corpus</div>
                        <div><span className="text-blue-400">Tier 2 (SSD):</span>  Warm vectors → DiskANN/IVF-PQ → 5-20ms, 5-10x cheaper</div>
                        <div><span className="text-yellow-400">Tier 3 (S3):</span>   Cold vectors → IVF-PQ on object storage → 100ms+, 50-100x cheaper</div>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-zinc-800">Strategy 4: Matryoshka Embeddings</h3>
                <p className="text-foreground leading-relaxed">
                    Lower dimensions mean less memory AND faster distance computation — a double win.
                    <strong> Matryoshka embeddings</strong> (Kusupati et al., 2022) are models specifically trained
                    to produce embeddings that are useful at any prefix length. You can take the first 256 dimensions
                    of a 768-dim Matryoshka embedding and still get good retrieval quality — typically only 2-5% recall
                    drop. This is different from post-hoc dimensionality reduction (PCA), which typically loses 5-15%
                    recall at the same reduction ratio.
                </p>
                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="space-y-2 text-xs">
                        <div>768-dim × 4 bytes = 3,072 bytes/vector</div>
                        <div>384-dim × 4 bytes = 1,536 bytes/vector → <span className="text-green-400">2x savings</span></div>
                        <div>256-dim × 4 bytes = 1,024 bytes/vector → <span className="text-green-400">3x savings</span></div>
                        <div>128-dim × 4 bytes =   512 bytes/vector → <span className="text-green-400">6x savings</span></div>
                        <div className="mt-2 text-zinc-400">Matryoshka models trained for prefix quality: 768→256 = only 2-5% recall drop</div>
                        <div className="text-zinc-400">Regular PCA: same reduction = 5-15% recall drop</div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* 5. Architecture Comparison */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">5. Architecture Cost Comparison (100M vectors, 768d)</h2>
                <p className="text-foreground leading-relaxed">
                    The right architecture depends on your latency requirements. If you can tolerate 10-15ms latency
                    (most applications can), DiskANN or IVF-PQ with re-scoring gives you 95%+ recall at a fraction
                    of HNSW&apos;s cost. The table below compares all major architectures at 100M vectors.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Architecture</th>
                                <th className="text-left p-3 border-b font-semibold">Memory</th>
                                <th className="text-left p-3 border-b font-semibold">Monthly</th>
                                <th className="text-left p-3 border-b font-semibold">Latency</th>
                                <th className="text-left p-3 border-b font-semibold">Recall</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">HNSW float32</td><td className="p-3">340 GB</td><td className="p-3">~$3,600</td><td className="p-3 text-green-700">&lt;1ms</td><td className="p-3">98%</td></tr>
                            <tr className="border-b"><td className="p-3">HNSW int8</td><td className="p-3">90 GB</td><td className="p-3">~$1,800</td><td className="p-3 text-green-700">&lt;1ms</td><td className="p-3">95%</td></tr>
                            <tr className="border-b"><td className="p-3">HNSW int8 + rescore</td><td className="p-3">90 GB + SSD</td><td className="p-3">~$1,850</td><td className="p-3">~5ms</td><td className="p-3">97%</td></tr>
                            <tr className="border-b"><td className="p-3">IVF-PQ</td><td className="p-3 text-green-700">12 GB</td><td className="p-3 text-green-700">~$180</td><td className="p-3">~2ms</td><td className="p-3">88%</td></tr>
                            <tr className="border-b"><td className="p-3">IVF-PQ + rescore</td><td className="p-3">12 GB + SSD</td><td className="p-3 text-green-700">~$230</td><td className="p-3">~10ms</td><td className="p-3">96%</td></tr>
                            <tr><td className="p-3 font-medium">DiskANN</td><td className="p-3 text-green-700">8 GB + SSD</td><td className="p-3 text-green-700">~$200</td><td className="p-3">~15ms</td><td className="p-3">95%</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/failures" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.8 When Semantic Search Fails
                </Link>
                <Link href="/search/vector-search/chunking" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.10 Chunking Strategies <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
