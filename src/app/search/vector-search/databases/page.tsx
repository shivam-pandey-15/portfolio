"use client";

import Link from "next/link";
import { Database, ArrowRight, ArrowLeft, Server, Cloud, Cog, Scale, Shield } from "lucide-react";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Start with pgvector, Migrate When Forced", description: "If you already use PostgreSQL and have <10M vectors, pgvector avoids new infrastructure. Migrate to a purpose-built DB only when you hit multi-tenant scaling limits, need advanced filtering, or exceed 50M vectors." },
    { title: "Purpose-Built for Scale and Features", description: "Pinecone, Qdrant, Weaviate, and Milvus handle billion-scale vectors with advanced ANN, metadata filtering, multi-tenancy, and real-time updates. They justify their operational overhead at scale." },
    { title: "Managed vs Self-Hosted Is the Real Decision", description: "Pinecone (fully managed) costs 3-5x more but eliminates operations. Qdrant/Milvus (self-hosted) cost less but require capacity planning, version management, backup automation, and on-call." },
    { title: "Elasticsearch KNN Is a Good Middle Ground", description: "If you already have Elasticsearch for keyword search, adding KNN vectors avoids a second system. Hybrid search (BM25 + vectors) works natively. Limited to ~50M vectors per shard." },
];

export default function DatabasesPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500 font-sans text-zinc-900 pb-20">
            <div className="space-y-8 border-b border-zinc-200 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 6.11</span>
                        <span>Vector &amp; Semantic Search</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Vector Database Comparison</h1>
                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                        <p className="text-xl font-medium leading-relaxed">
                            Choosing a vector database is one of the most consequential infrastructure decisions in semantic
                            search. This chapter compares the major options across architecture, performance, cost, and
                            operational complexity.
                        </p>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-cyan-700 font-medium text-sm"><Server className="w-4 h-4" /> Options</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">6+</p>
                        <p className="text-sm text-zinc-600">Major vector DB categories: pgvector, ES, Pinecone, Qdrant, Weaviate, Milvus.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-green-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm"><Cloud className="w-4 h-4" /> Managed Premium</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">3-5x</p>
                        <p className="text-sm text-zinc-600">Cost premium for fully managed over self-hosted. Saves ops burden.</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-purple-700 font-medium text-sm"><Scale className="w-4 h-4" /> Scale Threshold</div>
                        <p className="text-4xl font-bold text-zinc-900 mb-2">10M</p>
                        <p className="text-sm text-zinc-600">Vectors. Below this, pgvector is fine. Above: consider purpose-built.</p>
                    </div>
                </div>
            </div>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">1. The Landscape</h2>
                <p className="text-foreground leading-relaxed">
                    Vector databases fall into three categories: <strong>extensions to existing databases</strong> (pgvector,
                    Elasticsearch KNN), <strong>purpose-built open-source</strong> (Qdrant, Milvus, Weaviate), and
                    <strong> fully managed services</strong> (Pinecone, Zilliz Cloud). The right choice depends on your
                    existing infrastructure, scale, team size, and willingness to manage additional systems.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">2. Database Comparison</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-zinc-200 rounded-lg">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="text-left p-3 border-b font-semibold">Database</th>
                                <th className="text-left p-3 border-b font-semibold">Type</th>
                                <th className="text-left p-3 border-b font-semibold">Max Scale</th>
                                <th className="text-left p-3 border-b font-semibold">Best For</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b"><td className="p-3 font-medium">pgvector</td><td className="p-3">PG extension</td><td className="p-3">~10M</td><td className="p-3">Already using PostgreSQL, small-scale</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Elasticsearch</td><td className="p-3">Built-in KNN</td><td className="p-3">~50M/shard</td><td className="p-3">Existing ES stack, hybrid search</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Pinecone</td><td className="p-3">Managed</td><td className="p-3">Billions</td><td className="p-3">Zero-ops, fast start, VC-funded budgets</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Qdrant</td><td className="p-3">Open-source</td><td className="p-3">Billions</td><td className="p-3">Performance-critical, Rust ecosystem</td></tr>
                            <tr className="border-b"><td className="p-3 font-medium">Weaviate</td><td className="p-3">Open-source</td><td className="p-3">Billions</td><td className="p-3">ML pipeline integration, modules</td></tr>
                            <tr><td className="p-3 font-medium">Milvus</td><td className="p-3">Open-source</td><td className="p-3">Billions</td><td className="p-3">Largest scale, cloud-native</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">3. Decision Framework</h2>
                <p className="text-foreground leading-relaxed">
                    The decision tree is simpler than it appears: <strong>Do you already have PostgreSQL and
                    &lt;10M vectors?</strong> → pgvector. <strong>Already have Elasticsearch?</strong> → ES KNN.
                    <strong> Need zero operational burden?</strong> → Pinecone. <strong>Need maximum performance
                    at scale?</strong> → Qdrant or Milvus. <strong>Want ML pipeline integration?</strong> → Weaviate.
                </p>
                <p className="text-foreground leading-relaxed">
                    The most common mistake is over-engineering: teams of 3 people adopting Milvus when pgvector would
                    serve them for 2+ years. Start simple, migrate when you hit concrete scaling problems, not
                    theoretical ones. Every database migration is expensive — choose the simplest option that meets
                    your requirements for the next 12-18 months.
                </p>
            </section>

            <section className="space-y-8">
                <h2 className="text-3xl font-bold">4. Key Architectural Differences</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2"><Cog className="w-5 h-5 text-blue-500" /> Filtering Architecture</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            Pre-filtering (filter then search vectors) vs post-filtering (search vectors then filter) vs
                            in-filter (HNSW-aware filtering). Qdrant&apos;s payload filtering and Weaviate&apos;s pre-filtered
                            search handle sparse filters better than post-filtering approaches.
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2"><Shield className="w-5 h-5 text-green-500" /> Multi-Tenancy</h3>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                            How tenant isolation works: separate indexes (safe but expensive), partition-based (efficient
                            but shared resources), or filter-based (cheapest but no performance isolation). Critical for
                            SaaS applications serving multiple customers.
                        </p>
                    </div>
                </div>
            </section>

            <KeyTakeaways takeaways={takeaways} />

            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search/chunking" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6.10 Chunking Strategies
                </Link>
                <Link href="/search/vector-search/evaluation" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    6.12 Evaluating Quality <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
