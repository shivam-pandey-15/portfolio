"use client";

import Link from "next/link";
import { Layers, ArrowRight, ArrowLeft, Boxes, Grid3x3, Minimize2, BarChart3, Database } from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Brute-Force Doesn't Scale", description: "Exact nearest neighbor search is O(N×D) per query. At 1B vectors × 768 dims, that's 768 billion multiplications per query — about 30 seconds on modern hardware. ANN algorithms trade small accuracy loss for 1000x+ speedup." },
    { title: "IVF Partitions the Space", description: "Inverted File Index clusters vectors into cells using k-means. At search time, only nprobe cells (out of nlist total) are searched. With nlist=4096 and nprobe=64, you search only 1.5% of the data." },
    { title: "Product Quantization Compresses Vectors", description: "PQ splits each 768-dim vector into 96 sub-vectors of 8 dims, replacing each with a 1-byte centroid ID. Compression: 3072 bytes → 96 bytes (32x). Distance computation uses precomputed lookup tables (ADC)." },
    { title: "IVF-PQ Is the Workhorse", description: "Combining IVF (search fewer vectors) with PQ (each vector is smaller) gives multiplicative savings. This is the default choice for 10M-1B scale when memory is constrained and HNSW is too expensive." },
];

export default function IndexingPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.4</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Vector Indexing Basics</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            How to search billions of vectors without comparing every one. IVF partitions the search space,
                            Product Quantization compresses vectors 32x, and their combination is the workhorse of large-scale
                            vector search.
                        </p>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-amber-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-amber-700 font-medium text-sm"><Grid3x3 className="w-4 h-4" /> IVF Cells</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">4,096</p>
                        <p className="text-sm text-zinc-600">Typical nlist for 100M vectors. Each cell is a Voronoi region.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 font-medium text-sm"><Minimize2 className="w-4 h-4" /> PQ Compression</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">32x</p>
                        <p className="text-sm text-zinc-600">768-dim float32 (3KB) → 96 bytes with Product Quantization.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm"><Database className="w-4 h-4" /> Memory Savings</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">$24K/mo</p>
                        <p className="text-sm text-zinc-600">Saved vs float32 HNSW at 1B vectors using IVF-PQ.</p>
                    </div>
                </div>
            </div>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. Why ANN Instead of Exact Search?</h2>
                <p className="text-foreground leading-relaxed">
                    Exact nearest neighbor search computes the distance between the query vector and every single
                    vector in the database. For 1 billion vectors at 768 dimensions, that&apos;s 768 billion floating-point
                    multiplications per query. Even on modern GPUs, this takes about 30 seconds — far too slow for
                    real-time search. Approximate Nearest Neighbor (ANN) algorithms trade a small amount of accuracy
                    (typically 2-10% recall loss) for 1000x+ speedup by cleverly avoiding most distance computations.
                </p>
                <p className="text-foreground leading-relaxed">
                    The key insight is that most vectors in the database are clearly not nearest neighbors — they&apos;re
                    in completely different regions of the vector space. ANN algorithms exploit this by organizing vectors
                    into structures that let you quickly skip irrelevant regions, only computing exact distances for
                    vectors that are plausibly close to the query.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. IVF: Inverted File Index</h2>
                <p className="text-foreground leading-relaxed">
                    IVF partitions the vector space into <strong>Voronoi cells</strong> using k-means clustering.
                    Each vector is assigned to its nearest centroid. At search time, instead of scanning all vectors,
                    you find the closest centroids to the query and only search vectors within those cells.
                </p>
                <p className="text-foreground leading-relaxed">
                    With <code>nlist=4096</code> cells and <code>nprobe=64</code> (searching 64 cells), you examine
                    only 64/4096 = 1.5% of the data. For 100M vectors, that&apos;s scanning ~1.5M vectors instead
                    of 100M — a 65x speedup. The tradeoff is that if the true nearest neighbor sits in cell #65
                    (the first cell you didn&apos;t probe), you miss it. Higher nprobe = better recall, more latency.
                </p>

                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># IVF search: partition → probe → scan</div>
                    <div className="space-y-2">
                        <div><span className="text-green-400">1. Train:</span> k-means on sample → 4096 centroids (takes hours, done once)</div>
                        <div><span className="text-green-400">2. Index:</span> assign each vector to nearest centroid → inverted lists</div>
                        <div><span className="text-blue-400">3. Search:</span> find 64 closest centroids to query vector</div>
                        <div><span className="text-blue-400">4. Scan:</span> brute-force search within those 64 cells only</div>
                        <div className="text-zinc-500 mt-2">Vectors searched: 64/4096 × 100M = ~1.5M (1.5% of data)</div>
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Product Quantization: Compression</h2>
                <p className="text-foreground leading-relaxed">
                    Product Quantization (PQ) compresses vectors by splitting them into sub-vectors and replacing
                    each sub-vector with the index of its nearest centroid from a learned codebook. A 768-dim vector
                    is split into 96 sub-vectors of 8 dimensions each. Each 8-dim sub-vector is quantized to one of
                    256 centroids (stored as 1 byte). Result: 768 × 4 bytes = 3072 bytes → 96 × 1 byte = 96 bytes.
                    A <strong>32x compression</strong>.
                </p>
                <p className="text-foreground leading-relaxed">
                    Distance computation uses <strong>Asymmetric Distance Computation (ADC)</strong>: precompute a
                    lookup table of distances from the query sub-vectors to all 256 centroids in each subspace.
                    Then each PQ-encoded vector&apos;s distance is just 96 table lookups + additions — no floating-point
                    multiplications at all. This makes PQ search extremely fast even without SIMD optimization.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. IVF-PQ: The Production Combination</h2>
                <p className="text-foreground leading-relaxed">
                    IVF-PQ combines the spatial partitioning of IVF with the compression of PQ. First, IVF narrows
                    the search to a small subset of cells. Then within those cells, PQ-compressed vectors enable fast
                    distance computation with 32x less memory. At 1B vectors, IVF-PQ requires ~96 GB of RAM instead
                    of HNSW&apos;s ~3.2 TB — a <strong>33x reduction in infrastructure cost</strong>.
                </p>
                <p className="text-foreground leading-relaxed">
                    The recall tradeoff is real: IVF-PQ at default settings achieves ~85-90% recall@10 compared to
                    HNSW&apos;s ~98%. But with two-phase search (PQ retrieve top 1000 → exact re-score to get top 10),
                    effective recall jumps to ~96% while memory stays at PQ levels. This is why IVF-PQ with re-scoring
                    is the default for memory-constrained billion-scale deployments.
                </p>
            </section>

            <KeyTakeaways takeaways={takeaways} />

            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/encoders" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.3 Bi-Encoder vs Cross-Encoder
                </Link>
                <Link href="/search/vector-search/hnsw" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.5 HNSW Deep Dive <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
