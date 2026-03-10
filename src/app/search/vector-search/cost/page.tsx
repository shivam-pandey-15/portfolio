"use client";

import Link from "next/link";
import { DollarSign, ArrowRight, ArrowLeft, HardDrive, Cpu, TrendingDown, Calculator } from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Memory Dominates TCO", description: "Vector search is RAM-hungry: 1B vectors × 768 dims × 4 bytes = 3 TB of raw storage. HNSW graph overhead adds 50-100%. At AWS on-demand pricing, this means $15K-30K/month just for vector memory." },
    { title: "Product Quantization Cuts Cost 10-30x", description: "PQ reduces per-vector memory from 3,072 bytes to 96 bytes. At 1B vectors, that's 96 GB vs 3 TB — the difference between a single server and a 20-node cluster. Two-phase re-scoring recovers most accuracy." },
    { title: "DiskANN Changes the Economics", description: "Store compressed vectors in RAM + full vectors on SSD. Achieves >95% recall at 10-100x lower cost than full HNSW. Makes billion-scale search economically feasible on commodity hardware." },
    { title: "Matryoshka Embeddings Reduce Costs at Source", description: "Truncating from 768 to 256 dims saves 3x memory, 3x index size, 3x distance computation — with only 2-5% recall loss. This compounds with PQ for even greater savings." },
];

export default function CostPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.9</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Cost of Vector Search at Scale</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            Vector search is expensive. At billion-scale, infrastructure costs can dominate your entire
                            search budget. Understanding the cost structure is essential for architecture decisions.
                        </p>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm"><HardDrive className="w-4 h-4" /> Raw Vector Storage</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">3 TB</p>
                        <p className="text-sm text-zinc-600">1B vectors × 768 dims × 4 bytes (float32). Before any index overhead.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><TrendingDown className="w-4 h-4" /> PQ Savings</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">32x</p>
                        <p className="text-sm text-zinc-600">Product Quantization: 3,072 bytes → 96 bytes per vector.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-amber-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-amber-700 font-medium text-sm"><Calculator className="w-4 h-4" /> Monthly Cost</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">$17-29K</p>
                        <p className="text-sm text-zinc-600">Estimated AWS cost for 1B vectors with HNSW (full precision).</p>
                    </div>
                </div>
            </div>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. Memory Math</h2>
                <p className="text-foreground leading-relaxed">
                    Vector search cost is fundamentally a memory problem. Unlike keyword search where the inverted index
                    can live partially on disk, vector search algorithms (especially HNSW) need the graph structure in RAM
                    for fast traversal. Random access patterns during graph navigation make disk-based solutions 100x slower.
                </p>
                <p className="text-foreground leading-relaxed">
                    The base calculation is straightforward: <strong>vectors × dimensions × bytes_per_dim</strong>. But
                    HNSW adds 50-100% overhead for graph structure (neighbor lists, layering metadata). At M=16, each
                    node stores ~128 bytes of neighbor pointers. For 1B vectors: 3 TB vectors + 1.5-3 TB graph overhead
                    = 4.5-6 TB total RAM needed.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Configuration</th>
                                <th className="text-left p-3 border-b font-semibold">Per Vector</th>
                                <th className="text-left p-3 border-b font-semibold">1B Vectors</th>
                                <th className="text-left p-3 border-b font-semibold">Est. Monthly</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">HNSW float32</td><td className="p-3">~4.5 KB</td><td className="p-3">~4.5 TB RAM</td><td className="p-3 font-bold text-red-600">$29K</td></tr>
                            <tr className="border-b"><td className="p-3">HNSW + SQ (int8)</td><td className="p-3">~1.5 KB</td><td className="p-3">~1.5 TB RAM</td><td className="p-3">$10K</td></tr>
                            <tr className="border-b"><td className="p-3">IVF-PQ</td><td className="p-3">~128 B</td><td className="p-3">~128 GB RAM</td><td className="p-3 font-bold text-green-600">$0.9K</td></tr>
                            <tr><td className="p-3">DiskANN (SSD)</td><td className="p-3">~160 B RAM + SSD</td><td className="p-3">~160 GB RAM + SSD</td><td className="p-3 font-bold text-green-600">$1.5K</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Compression Strategies</h2>
                <p className="text-foreground leading-relaxed">
                    <strong>Scalar Quantization (SQ)</strong> converts float32 to int8, reducing each dimension from 4 bytes
                    to 1 byte — a 4x compression. Quality loss is minimal (~1-2% recall) because the quantization error is
                    small relative to the distances between vectors. This is the easiest cost optimization with the highest
                    ROI.
                </p>
                <p className="text-foreground leading-relaxed">
                    <strong>Product Quantization (PQ)</strong> achieves 32x compression by splitting vectors into sub-vectors
                    and representing each with a codebook index. Combined with IVF, it reduces 1B vectors from 3 TB to ~96 GB.
                    <strong>Matryoshka embeddings</strong> offer a complementary reduction by truncating dimensions: 768→256
                    gives 3x savings with ~3% recall loss, and these savings compound with PQ.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. DiskANN: SSD-Based Search</h2>
                <p className="text-foreground leading-relaxed">
                    DiskANN (Microsoft Research, 2019) stores the full graph on NVMe SSD with only compressed vectors
                    in RAM. A search query navigates the compressed in-memory graph to identify candidate regions, then
                    fetches full-precision vectors from SSD for exact re-scoring. Achieves &gt;95% recall at
                    5-10ms latency — 5-10x slower than pure HNSW but at 10-30x lower cost.
                </p>
                <p className="text-foreground leading-relaxed">
                    The economics are compelling: NVMe SSDs cost ~$0.08/GB/month vs RAM at ~$6/GB/month — a 75x
                    cost difference per gigabyte. DiskANN makes billion-scale vector search economically feasible
                    on commodity hardware.
                </p>
            </section>

            <KeyTakeaways takeaways={takeaways} />

            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/failures" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.8 Failure Modes
                </Link>
                <Link href="/search/vector-search/chunking" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.10 Chunking <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
