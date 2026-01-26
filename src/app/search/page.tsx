import Link from "next/link";
import { ArrowRight, Database, Cpu, Search, Layers, Network, Brain } from "lucide-react";

export default function SearchOverview() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="space-y-8">
                <div className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-sm text-amber-500">
                    <span className="flex h-2 w-2 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
                    In Progress
                </div>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
                    Systems Atlas: <br className="hidden md:block" />
                    <span className="text-foreground">Search Engineering Guide</span>
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    A comprehensive field guide to building production-grade search systems.
                    From the bits of an <strong>Inverted Index</strong> to the architecture of <strong>Distributed Retrieval</strong>.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link
                        href="/search/how-to-read"
                        className="inline-flex items-center justify-center rounded-lg text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 py-3"
                    >
                        Start Reading (Chapter 0) <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                        href="/search/business-product"
                        className="inline-flex items-center justify-center rounded-lg text-base font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors h-12 px-8 py-3"
                    >
                        Jump to Business Case
                    </Link>
                </div>
            </div>

            <hr className="border-border" />

            {/* Scope / Pipeline Visual */}
            <section className="bg-zinc-900 text-zinc-100 rounded-2xl p-8 md:p-12 border border-zinc-800 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

                <h2 className="text-2xl md:text-3xl font-bold mb-8 relative z-10">What We Cover</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                    <div className="space-y-4">
                        <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Database className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">Foundations</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            How data is actually stored. Doc Values, BKD Trees, and why "Text" is expensive.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                            <Layers className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">Indexing</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            The write path. Analysis chains, tokenizers, and handling high-throughput ingestion.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                            <Search className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">Retrieval</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            The read path. Recall vs Precision, BM25, and query expansion strategies.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="h-12 w-12 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                            <Network className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">Architecture</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Sharding, replication, caching policies, and designing for P99 latency.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="h-12 w-12 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400">
                            <Brain className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">Machine Learning</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Learning to Rank (LTR), vector search (HNSW), and embedding models.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                            <Cpu className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">Operations</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Evaluation metrics (NDCG), zero-result debugging, and capacity planning.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
