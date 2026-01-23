import { ArrowRight, BarChart3, Cloud, Layout, Search, Zap } from "lucide-react";
import Link from "next/link";

export default function PowerLawsPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-primary">2.4 Query Distributions & Power Laws</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Why 20% of your queries generate 80% of your traffic, and why the remaining 80% are the hardest to solve.
                </p>
            </div>

            <hr className="border-border" />

            {/* The Concept */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">The Zipfian Reality</h2>
                <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground">
                    <p>
                        In almost every search system—whether web search (Google), e-commerce (Amazon), or media (Spotify)—user queries follow a <strong>Power Law distribution</strong>, specifically <a href="https://en.wikipedia.org/wiki/Zipf%27s_law" target="_blank" className="text-primary hover:underline">Zipf's Law</a>.
                    </p>
                    <p>
                        Mathematician George Zipf observed that the frequency of any word is inversely proportional to its rank in the frequency table. In search, this means:
                    </p>
                    <blockquote className="border-l-4 border-primary pl-4 italic my-4">
                        The most popular query is searched twice as often as the second most popular query, and three times as often as the third, and so on.
                    </blockquote>
                </div>

                {/* Visualizer (CSS Chart) */}
                <div className="bg-secondary/20 p-8 rounded-xl border border-border">
                    <h3 className="font-semibold text-lg mb-6">The Search Demand Curve</h3>
                    <div className="flex items-end justify-between h-48 gap-2 px-4 pb-4 border-b border-border/50">
                        {/* Head */}
                        <div className="w-1/4 h-full bg-primary/20 rounded-t-sm flex flex-col justify-end group relative">
                            <div className="bg-primary w-full h-[80%] rounded-t-sm transition-all group-hover:bg-primary/90" />
                            <div className="absolute -bottom-8 left-0 w-full text-center text-xs font-bold text-primary">Head</div>
                            <div className="absolute top-2 w-full text-center text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                "iphone"
                            </div>
                        </div>
                        {/* Torso */}
                        <div className="w-1/3 h-full bg-orange-500/10 rounded-t-sm flex flex-col justify-end group relative">
                            <div className="bg-orange-500 w-full h-[30%] rounded-t-sm transition-all group-hover:bg-orange-500/90" />
                            <div className="absolute -bottom-8 left-0 w-full text-center text-xs font-bold text-orange-600">Torso</div>
                            <div className="absolute top-[50%] w-full text-center text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                "iphone 15 pro case"
                            </div>
                        </div>
                        {/* Tail */}
                        <div className="w-1/2 h-full bg-blue-500/10 rounded-t-sm flex flex-col justify-end group relative">
                            <div className="bg-blue-500 w-full h-[5%] rounded-t-sm transition-all group-hover:bg-blue-500/90" />
                            <div className="absolute -bottom-8 left-0 w-full text-center text-xs font-bold text-blue-600">Long Tail</div>
                            <div className="absolute top-[80%] w-full text-center text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                "blue silicone case for iphone 15..."
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 text-sm text-center text-muted-foreground">
                        Rank of Query (Frequency &rarr;)
                    </div>
                </div>
            </section>

            {/* Engineering Strategies */}
            <section className="space-y-8">
                <h2 className="text-2xl font-semibold">Engineering Strategy by Segment</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* The Head */}
                    <div className="border border-border rounded-xl p-6 bg-card">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary/10 rounded-md text-primary"><Zap size={20} /></div>
                            <h3 className="font-bold">The Head</h3>
                        </div>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <p><span className="font-semibold text-foreground">Docs:</span> Top 20%</p>
                            <p><span className="font-semibold text-foreground">Traffic:</span> ~70-80%</p>
                            <hr className="border-border/50" />
                            <p className="font-medium text-foreground">Tactics:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Aggressive Caching (Redis/CDN)</li>
                                <li>Manual Curation / Merchandising</li>
                                <li>Pre-computed result sets</li>
                            </ul>
                        </div>
                    </div>

                    {/* The Torso */}
                    <div className="border border-border rounded-xl p-6 bg-card">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-500/10 rounded-md text-orange-600"><Layout size={20} /></div>
                            <h3 className="font-bold">The Torso</h3>
                        </div>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <p><span className="font-semibold text-foreground">Docs:</span> Middle 30%</p>
                            <p><span className="font-semibold text-foreground">Traffic:</span> ~15-20%</p>
                            <hr className="border-border/50" />
                            <p className="font-medium text-foreground">Tactics:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Query Expansion</li>
                                <li>Synonym Mapping</li>
                                <li>Spell Correction</li>
                                <li>Standard Ranking Models</li>
                            </ul>
                        </div>
                    </div>

                    {/* The Tail */}
                    <div className="border border-border rounded-xl p-6 bg-card">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-md text-blue-600"><Search size={20} /></div>
                            <h3 className="font-bold">The Long Tail</h3>
                        </div>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <p><span className="font-semibold text-foreground">Docs:</span> Bottom 50%</p>
                            <p><span className="font-semibold text-foreground">Traffic:</span> ~5-10%</p>
                            <hr className="border-border/50" />
                            <p className="font-medium text-foreground">Tactics:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Vector Search (Embeddings)</li>
                                <li>LLM / RAG Pipelines</li>
                                <li>Zero-result Fallbacks</li>
                                <li>No Caching (Hit rate ~0%)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* References */}
            <section className="bg-secondary/20 p-8 rounded-xl border border-border">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Cloud className="w-5 h-5" /> References & Further Reading
                </h2>
                <ul className="space-y-3 text-muted-foreground text-sm">
                    <li>
                        <span className="font-semibold text-foreground">1. The Long Tail.</span> Chris Anderson (2004).
                        <span className="italic"> Wired Magazine.</span> The foundational piece on how the internet shifts focus from mass markets to niches.
                    </li>
                    <li>
                        <span className="font-semibold text-foreground">2. Introduction to Information Retrieval.</span> Manning, Raghavan, Schütze (2008).
                        <a href="https://nlp.stanford.edu/IR-book/" target="_blank" className="text-primary hover:underline ml-1">
                            Chapter 5: Index compression (Zipf's law discussion)
                        </a>.
                    </li>
                    <li>
                        <span className="font-semibold text-foreground">3. Analysis of Query Logs.</span> Ricardo Baeza-Yates (2005).
                        Discusses the distribution of web queries and the implications for caching.
                    </li>
                </ul>
            </section>

            <div className="flex justify-between pt-8">
                <Link href="/search/query-understanding/intent" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center">
                    ← 2.3 Intent vs Tokens
                </Link>
                <Link href="/search/query-understanding/pipeline" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    Next: Understanding Pipeline <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
