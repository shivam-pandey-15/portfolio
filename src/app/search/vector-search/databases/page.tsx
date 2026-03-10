"use client";

import Link from "next/link";
import {
    Database, ArrowRight, ArrowLeft, Zap, Shield,
    Server, Cloud, Code2, Settings,
    GitBranch, BarChart3, Layers
} from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "pgvector: Simplest for <5M Vectors", description: "Zero additional infrastructure — CREATE EXTENSION away. ACID transactions, SQL filtering, joins. But: performance ceiling at >5M vectors, resource contention with OLTP, limited ANN sophistication." },
    { title: "Elasticsearch: Best for Hybrid Search", description: "Native BM25 + HNSW kNN with built-in RRF fusion. Mature ecosystem (Kibana, Elastic Cloud). But: segment merge rebuilds HNSW graph, on-heap vectors compete with JVM, not purpose-built for vectors." },
    { title: "Qdrant: Best Performance Per Dollar (Self-Hosted)", description: "Rust implementation delivers excellent QPS. Payload indexes enable efficient filtered search during HNSW traversal. Flexible deployment: Docker → K8s → Cloud. Scales to ~500M vectors." },
    { title: "Milvus: Purpose-Built for Billion Scale", description: "Distributed architecture handles 10B+ vectors. Widest index variety: HNSW, IVF-PQ, DiskANN, GPU indexes. But: requires etcd + MinIO + Pulsar — significant operational burden." },
    { title: "Don't Over-Engineer", description: "The most common mistake is choosing a specialized vector database for a use case pgvector or Elasticsearch handles perfectly. If you have <5M vectors and already run PostgreSQL, pgvector is the answer." },
];

export default function DatabasesPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            {/* Hero */}
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.11</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Vector Database Comparison</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            The landscape includes purpose-built databases (Pinecone, Qdrant, Milvus, Weaviate),
                            extensions of existing databases (pgvector), and search engines with vector capabilities
                            (Elasticsearch). Each makes fundamentally different tradeoffs in architecture, performance,
                            and operational complexity.
                        </p>
                    </div>
                </div>

                {/* Spectrum Visualization */}
                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="text-zinc-400 mb-4"># The Decision Spectrum: Integration ← → Specialization</div>
                    <div className="flex justify-between items-center text-xs">
                        <div className="text-center">
                            <div className="bg-zinc-700 rounded px-3 py-2 mb-1">pgvector</div>
                            <div className="text-green-400">Simplest ops</div>
                        </div>
                        <div className="text-center">
                            <div className="bg-zinc-700 rounded px-3 py-2 mb-1">Elasticsearch</div>
                            <div className="text-blue-400">Familiar</div>
                        </div>
                        <div className="text-center">
                            <div className="bg-zinc-700 rounded px-3 py-2 mb-1">Weaviate / Qdrant</div>
                            <div className="text-yellow-400">Balanced</div>
                        </div>
                        <div className="text-center">
                            <div className="bg-zinc-700 rounded px-3 py-2 mb-1">Pinecone / Milvus</div>
                            <div className="text-pink-400">Fastest at scale</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* pgvector */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">pgvector (PostgreSQL Extension)</h2>
                <p className="text-foreground leading-relaxed">
                    If you already run PostgreSQL, pgvector is the path of least resistance. One <code>CREATE
                    EXTENSION vector</code> and you have a working vector column type with HNSW indexing, cosine/L2/inner
                    product distance operators, and the ability to combine vector similarity with SQL WHERE clauses,
                    JOINs, and aggregations in a single query. No new infrastructure, no new operational runbook,
                    no new backup strategy. Your vectors live alongside your relational data with ACID guarantees.
                </p>

                <p className="text-foreground leading-relaxed">
                    The limitation is performance at scale. pgvector runs inside the PostgreSQL process, sharing
                    memory with your OLTP workload. HNSW index builds are single-threaded and lock the table. At
                    &gt;5M vectors, purpose-built databases outperform it by 2-5x on QPS. pgvector also lacks advanced
                    features like product quantization, tiered storage, or GPU-accelerated search. But for &lt;5M
                    vectors, none of that matters — and the SQL integration is unbeatable.
                </p>
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">pgvector_example.sql</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
                        <div className="flex flex-col gap-0.5">
                            <div><span className="text-pink-400">CREATE TABLE</span><span className="text-zinc-300"> products (</span></div>
                            <div className="pl-4"><span className="text-zinc-300">id </span><span className="text-blue-400">SERIAL PRIMARY KEY</span><span className="text-zinc-300">,</span></div>
                            <div className="pl-4"><span className="text-zinc-300">name </span><span className="text-blue-400">TEXT</span><span className="text-zinc-300">, price </span><span className="text-blue-400">DECIMAL</span><span className="text-zinc-300">,</span></div>
                            <div className="pl-4"><span className="text-zinc-300">embedding </span><span className="text-blue-400">VECTOR(768)</span></div>
                            <div><span className="text-zinc-300">);</span></div>
                            <div className="mt-2"><span className="text-zinc-500">-- Create HNSW index</span></div>
                            <div><span className="text-pink-400">CREATE INDEX ON</span><span className="text-zinc-300"> products </span><span className="text-pink-400">USING</span><span className="text-zinc-300"> hnsw (embedding vector_cosine_ops)</span></div>
                            <div><span className="text-zinc-300">  </span><span className="text-pink-400">WITH</span><span className="text-zinc-300"> (m = </span><span className="text-orange-300">16</span><span className="text-zinc-300">, ef_construction = </span><span className="text-orange-300">200</span><span className="text-zinc-300">);</span></div>
                            <div className="mt-2"><span className="text-zinc-500">-- Vector search with SQL filters — all in one query!</span></div>
                            <div><span className="text-pink-400">SELECT</span><span className="text-zinc-300"> name, price, </span><span className="text-orange-300">1</span><span className="text-zinc-300"> - (embedding &lt;=&gt; query_vec) </span><span className="text-pink-400">AS</span><span className="text-zinc-300"> similarity</span></div>
                            <div><span className="text-pink-400">FROM</span><span className="text-zinc-300"> products</span></div>
                            <div><span className="text-pink-400">WHERE</span><span className="text-zinc-300"> category = </span><span className="text-green-300">&apos;electronics&apos;</span><span className="text-zinc-300"> </span><span className="text-pink-400">AND</span><span className="text-zinc-300"> price &lt; </span><span className="text-orange-300">500</span></div>
                            <div><span className="text-pink-400">ORDER BY</span><span className="text-zinc-300"> embedding &lt;=&gt; query_vec </span><span className="text-pink-400">LIMIT</span><span className="text-zinc-300"> </span><span className="text-orange-300">10</span><span className="text-zinc-300">;</span></div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm">
                        <div className="font-bold text-green-800 mb-1">Strengths</div>
                        <ul className="text-green-700 space-y-1 list-disc list-inside">
                            <li>Zero additional infrastructure — one CREATE EXTENSION</li>
                            <li>ACID transactional consistency with relational data</li>
                            <li>Rich SQL filtering, joins, aggregations</li>
                        </ul>
                    </div>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm">
                        <div className="font-bold text-red-800 mb-1">Limitations</div>
                        <ul className="text-red-700 space-y-1 list-disc list-inside">
                            <li>Performance ceiling at &gt;5M vectors</li>
                            <li>Resource contention with OLTP workload</li>
                            <li>No PQ, tiered storage, or GPU search</li>
                        </ul>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* Elasticsearch */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">Elasticsearch (with kNN)</h2>
                <p className="text-foreground leading-relaxed">
                    Elasticsearch added dense vector fields and HNSW-based kNN search in version 8.0. The killer
                    feature is <strong>native hybrid search</strong>: a single query can combine BM25 text scoring
                    with kNN vector similarity using Reciprocal Rank Fusion (RRF) — no external orchestration
                    needed. If you already run Elasticsearch for text search, adding vector capabilities to
                    existing indices is straightforward.
                </p>

                <p className="text-foreground leading-relaxed">
                    The architectural limitation is that Elasticsearch wasn&apos;t designed for vectors. Each Lucene
                    segment contains its own HNSW graph, and segment merges trigger full graph rebuilds (causing CPU
                    spikes). Vectors are stored on-heap, competing with the JVM&apos;s garbage collector and text search
                    caches. At the same scale, purpose-built vector databases achieve 2-5x higher QPS. Still, for
                    teams already invested in the Elastic ecosystem, the operational simplicity of co-locating
                    text and vectors is often worth the performance trade-off.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm">
                        <div className="font-bold text-green-800 mb-1">Strengths</div>
                        <ul className="text-green-700 space-y-1 list-disc list-inside">
                            <li>Native hybrid search: BM25 + kNN with built-in RRF fusion</li>
                            <li>Mature ecosystem: Kibana, Elastic Cloud, decade of production use</li>
                            <li>Co-located text + vectors in same index</li>
                        </ul>
                    </div>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm">
                        <div className="font-bold text-red-800 mb-1">Limitations</div>
                        <ul className="text-red-700 space-y-1 list-disc list-inside">
                            <li>Segment merges rebuild HNSW graph (CPU spikes)</li>
                            <li>On-heap vectors compete with JVM/text search</li>
                            <li>Purpose-built DBs achieve 2-5x better QPS</li>
                        </ul>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* Pinecone, Qdrant, Weaviate, Milvus */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">Purpose-Built Vector Databases</h2>
                <p className="text-foreground leading-relaxed">
                    These databases are engineered from the ground up for vector workloads: custom memory layouts
                    for SIMD-optimized distance computation, purpose-built index structures, and APIs designed
                    around the embed-index-query workflow. They achieve the highest QPS and lowest latency at
                    scale, but come with varying levels of operational complexity. The four major options occupy
                    different points on the managed-vs-self-hosted and simplicity-vs-capability spectrum.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-3">Pinecone</h3>
                        <p className="text-sm text-zinc-700 mb-4">Fully managed, serverless. Zero operations — API endpoint, query it. Serverless pricing (pay per query/GB).</p>
                        <div className="text-xs space-y-1 text-zinc-600">
                            <p><strong className="text-green-700">Best for:</strong> Teams without infra expertise, startups, &lt;10M vectors</p>
                            <p><strong className="text-red-700">Watch out:</strong> Vendor lock-in, limited control, cost at high QPS</p>
                        </div>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-3">Qdrant</h3>
                        <p className="text-sm text-zinc-700 mb-4">Open-source, Rust. Payload indexes for filtered search during HNSW traversal. Docker → K8s → Cloud.</p>
                        <div className="text-xs space-y-1 text-zinc-600">
                            <p><strong className="text-green-700">Best for:</strong> Self-hosted perf, filtered search, up to ~500M vectors</p>
                            <p><strong className="text-red-700">Watch out:</strong> Younger ecosystem, no native BM25</p>
                        </div>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-3">Weaviate</h3>
                        <p className="text-sm text-zinc-700 mb-4">Open-source, Go. Native hybrid search (BM25 + vector). Modular vectorization (auto-embed via OpenAI/Cohere). Multi-tenancy.</p>
                        <div className="text-xs space-y-1 text-zinc-600">
                            <p><strong className="text-green-700">Best for:</strong> All-in-one hybrid search, SaaS multi-tenant, auto-embedding</p>
                            <p><strong className="text-red-700">Watch out:</strong> Memory intensive (~50% more overhead), slower QPS</p>
                        </div>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-3">Milvus</h3>
                        <p className="text-sm text-zinc-700 mb-4">Open-source, distributed. Widest index variety: HNSW, IVF-PQ, DiskANN, GPU indexes. Managed via Zilliz Cloud.</p>
                        <div className="text-xs space-y-1 text-zinc-600">
                            <p><strong className="text-green-700">Best for:</strong> 100M+ vectors, GPU-accelerated search, index variety</p>
                            <p><strong className="text-red-700">Watch out:</strong> Requires etcd + MinIO + Pulsar, high ops complexity</p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-border" />

            {/* Comparison Table */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">Head-to-Head Comparison</h2>
                <p className="text-foreground leading-relaxed">
                    The table below compares all six options across the dimensions that matter most in practice:
                    implementation language (affects performance characteristics), self-hosting support, maximum
                    practical scale, hybrid search capability, quantization options, operational complexity,
                    latency at 1M vectors, and approximate monthly cost. Use this as a starting point, then
                    drill into the specific factors that matter for your use case.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Feature</th>
                                <th className="text-left p-3 border-b font-semibold">pgvector</th>
                                <th className="text-left p-3 border-b font-semibold">ES</th>
                                <th className="text-left p-3 border-b font-semibold">Pinecone</th>
                                <th className="text-left p-3 border-b font-semibold">Qdrant</th>
                                <th className="text-left p-3 border-b font-semibold">Weaviate</th>
                                <th className="text-left p-3 border-b font-semibold">Milvus</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3">Language</td><td className="p-3">C</td><td className="p-3">Java</td><td className="p-3">—</td><td className="p-3">Rust</td><td className="p-3">Go</td><td className="p-3">Go+C++</td></tr>
                            <tr className="border-b"><td className="p-3">Self-hosted</td><td className="p-3 text-green-700">✅</td><td className="p-3 text-green-700">✅</td><td className="p-3 text-red-700">❌</td><td className="p-3 text-green-700">✅</td><td className="p-3 text-green-700">✅</td><td className="p-3 text-green-700">✅</td></tr>
                            <tr className="border-b"><td className="p-3">Max scale</td><td className="p-3">~5M</td><td className="p-3">~50M</td><td className="p-3">~100M+</td><td className="p-3">~500M</td><td className="p-3">~100M</td><td className="p-3 text-green-700 font-medium">10B+</td></tr>
                            <tr className="border-b"><td className="p-3">Hybrid search</td><td className="p-3 text-green-700">✅ FTS</td><td className="p-3 text-green-700">✅ Native</td><td className="p-3 text-red-700">❌</td><td className="p-3 text-red-700">❌</td><td className="p-3 text-green-700">✅</td><td className="p-3 text-red-700">❌</td></tr>
                            <tr className="border-b"><td className="p-3">Quantization</td><td className="p-3 text-red-700">❌</td><td className="p-3">Scalar</td><td className="p-3">Auto</td><td className="p-3">SQ/PQ/BQ</td><td className="p-3">PQ/BQ</td><td className="p-3">PQ/SQ8/GPU</td></tr>
                            <tr className="border-b"><td className="p-3">Ops complexity</td><td className="p-3 text-green-700">Minimal</td><td className="p-3">Medium</td><td className="p-3 text-green-700">Zero</td><td className="p-3">Low-Med</td><td className="p-3">Medium</td><td className="p-3 text-red-700">High</td></tr>
                            <tr className="border-b"><td className="p-3">Latency (1M)</td><td className="p-3">~5ms</td><td className="p-3">~3ms</td><td className="p-3">~2ms</td><td className="p-3 text-green-700">~1ms</td><td className="p-3">~3ms</td><td className="p-3 text-green-700">~1ms</td></tr>
                            <tr><td className="p-3">Cost (1M)</td><td className="p-3 text-green-700">~$50</td><td className="p-3">~$300</td><td className="p-3">~$70</td><td className="p-3">~$100</td><td className="p-3">~$150</td><td className="p-3">~$400+</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="border-border" />

            {/* Decision Framework */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">Decision Framework</h2>
                <p className="text-foreground leading-relaxed">
                    The most common mistake is over-engineering: choosing Milvus for 500K vectors, or Pinecone
                    when you already have PostgreSQL. Walk through these questions in order — stop at the first
                    "yes" that matches your situation. The flowchart below encodes the decision logic that
                    experienced teams follow.
                </p>
                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl font-mono text-sm">
                    <div className="space-y-2 text-xs">
                        <div><span className="text-blue-400">Q1:</span> Already use PostgreSQL with &lt;5M vectors?</div>
                        <div className="pl-4">→ YES → <span className="text-green-400">pgvector</span>. Stop here.</div>
                        <div className="mt-2"><span className="text-blue-400">Q2:</span> Need hybrid (keyword + vector) search?</div>
                        <div className="pl-4">→ YES + have ES → <span className="text-green-400">Stay with ES kNN</span></div>
                        <div className="pl-4">→ YES + no ES → <span className="text-green-400">Weaviate</span></div>
                        <div className="mt-2"><span className="text-blue-400">Q3:</span> Dedicated infrastructure team?</div>
                        <div className="pl-4">→ NO → <span className="text-green-400">Pinecone</span> or <span className="text-green-400">Qdrant Cloud</span></div>
                        <div className="mt-2"><span className="text-blue-400">Q4:</span> How many vectors?</div>
                        <div className="pl-4">→ &lt;100M → <span className="text-green-400">Qdrant</span></div>
                        <div className="pl-4">→ 100M-1B → <span className="text-green-400">Qdrant or Milvus</span></div>
                        <div className="pl-4">→ &gt;1B → <span className="text-green-400">Milvus</span></div>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/chunking" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.10 Chunking Strategies
                </Link>
                <Link href="/search/vector-search/evaluation" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.12 Evaluating Search Quality <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
