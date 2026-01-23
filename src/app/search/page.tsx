import Link from "next/link";
import { ArrowRight, Database, Cpu } from "lucide-react";

export default function SearchOverview() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
                    Building Search Systems
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    A first-principles guide to building production-grade search engines.
                    From inverted indices to vector search at scale.
                </p>
                <div className="flex items-center gap-4 pt-4">
                    <Link href="/search/business-product" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                        Start Reading <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <a href="https://github.com/shivam-pandey-15" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        View on GitHub
                    </a>
                </div>
            </div>

            <hr className="border-border" />

            {/* Introduction / Philosophy Section instead of Visual Pipeline */}
            <section className="bg-secondary/20 rounded-xl p-8 border border-border">
                <h3 className="font-semibold text-lg mb-4">About this Project</h3>
                <p className="text-muted-foreground mb-4">
                    This isn't just a blog. It's a living document of engineering tradeoffs.
                    Most resources teach you how to write `index.add(doc)`. This guide teaches you what happens when
                    you have 100 million documents and your P99 latency spikes to 2 seconds.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Database className="w-4 h-4" /> Real-world constraints
                    </div>
                    <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4" /> Systems thinking
                    </div>
                </div>
            </section>
        </div>
    );
}
