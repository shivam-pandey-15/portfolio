import Link from "next/link";
import { ArrowRight, Search, Database, Cpu, Layers, Zap, Server } from "lucide-react";

const stages = [
    {
        id: "indexing",
        label: "Indexing",
        description: "Ingestion, tokenization, and inverted index construction.",
        icon: Database,
        href: "/search/indexing",
    },
    {
        id: "retrieval",
        label: "Retrieval",
        description: "Finding relevant documents from billions of records.",
        icon: Search,
        href: "/search/retrieval",
    },
    {
        id: "ranking",
        label: "Ranking",
        description: "Scoring and sorting results using ML models.",
        icon: Layers,
        href: "/search/ranking",
    },
    {
        id: "caching",
        label: "Caching",
        description: "Low-latency serving with Redis/Memcached patterns.",
        icon: Zap,
        href: "/search/caching",
    },
    {
        id: "infra",
        label: "Infrastructure",
        description: "Distributed systems, load balancing, and scaling.",
        icon: Server,
        href: "/search/infra",
    },
];

export default function SearchOverview() {
    return (
        <div className="min-h-screen p-8 md:p-12 lg:p-24 max-w-7xl mx-auto space-y-12">
            <div className="space-y-4">
                <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center">
                    ← Back to Systems Map
                </Link>
                <h1 className="text-4xl font-bold tracking-tight text-primary">Search System Architecture</h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                    An end-to-end explorations of a modern search engine. From the moment a document is crawled to the millisecond a query is served.
                </p>
            </div>

            {/* Visual Pipeline */}
            <section>
                <h2 className="text-2xl font-semibold mb-8">Request Lifecycle</h2>
                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="absolute top-12 left-0 w-full h-0.5 bg-border hidden lg:block -z-10" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                        {stages.map((stage, index) => (
                            <Link key={stage.id} href={stage.href} className="group block relative">
                                <div className="bg-card border border-border rounded-xl p-6 hover:border-primary hover:shadow-md transition-all duration-200 h-full flex flex-col items-start gap-4 z-10">
                                    <div className="p-3 bg-secondary rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <stage.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                                            {stage.label}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {stage.description}
                                        </p>
                                    </div>
                                </div>
                                {/* Arrow for linking steps (Visual only) */}
                                {index < stages.length - 1 && (
                                    <div className="hidden lg:block absolute top-10 -right-6 text-border z-0">
                                        <ArrowRight className="w-6 h-6" />
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-secondary/50 rounded-xl p-8 border border-border">
                <h3 className="font-semibold text-lg mb-2">System Constraints & Goals</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>Latency:</strong> p99 &lt; 200ms for end-to-end query serving.</li>
                    <li><strong>Scale:</strong> Support 1B+ documents and 10k QPS.</li>
                    <li><strong>Freshness:</strong> New documents indexed within 1 minute.</li>
                    <li><strong>Availability:</strong> 99.99% uptime with multi-region failover.</li>
                </ul>
            </section>
        </div>
    );
}
