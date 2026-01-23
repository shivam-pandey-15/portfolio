import { Users, Code, Brain, Briefcase, Rocket, ArrowRight, ArrowLeft, GraduationCap, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AudiencePage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Chapter 0.1</p>
                <h1 className="text-4xl font-bold tracking-tight">Who This Guide Is For</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Engineers, ML practitioners, product managers, and founders who want to go beyond
                    "using a search API" to understanding how search systems actually work.
                </p>
            </div>

            <hr className="border-border" />

            {/* Audience Cards */}
            <section className="space-y-8">
                <h2 className="text-2xl font-semibold">Primary Audiences</h2>

                <div className="grid gap-6">
                    {/* Engineers */}
                    <div className="border border-border rounded-xl p-6 bg-card">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                <Code className="w-6 h-6" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <h3 className="text-xl font-bold">Software Engineers (Backend/Platform)</h3>
                                <p className="text-muted-foreground">
                                    <strong>Profile:</strong> 2-5 years experience building APIs and services.
                                    Knows databases, REST, microservices. Has "used" Elasticsearch/Algolia
                                    but doesn't understand the internals.
                                </p>

                                <div className="bg-secondary/30 p-4 rounded-lg">
                                    <p className="font-medium mb-2">📍 Common situation:</p>
                                    <p className="text-sm text-muted-foreground italic">
                                        "I followed a tutorial to set up Elasticsearch. It worked for 10K products.
                                        Now we have 10M and everything is slow. I don't know where to start."
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <p className="font-medium">What you'll learn:</p>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                                        <li>Move from "consumer of search API" to "builder of search infrastructure"</li>
                                        <li>Understand trade-offs: Why does ranking matter more than retrieval?</li>
                                        <li>Debug production issues: Why is P99 latency spiking?</li>
                                        <li>Schema design, sharding strategies, and reindexing without downtime</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ML Engineers */}
                    <div className="border border-border rounded-xl p-6 bg-card">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-orange-500/10 rounded-lg text-orange-600">
                                <Brain className="w-6 h-6" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <h3 className="text-xl font-bold">ML Engineers / Data Scientists</h3>
                                <p className="text-muted-foreground">
                                    <strong>Profile:</strong> Strong in embeddings, LLMs, recommendation systems.
                                    Weak in systems engineering (distributed systems, caching, latency).
                                </p>

                                <div className="bg-secondary/30 p-4 rounded-lg">
                                    <p className="font-medium mb-2">📍 Common situation:</p>
                                    <p className="text-sm text-muted-foreground italic">
                                        "My BERT reranker has 0.85 NDCG offline. But when we deployed it, CTR didn't change.
                                        The team says it's 'too slow' but I don't understand what that means for search."
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <p className="font-medium">What you'll learn:</p>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                                        <li>How to take a model from Jupyter notebook to production search</li>
                                        <li>The full pipeline: Retrieval → Ranking → Serving</li>
                                        <li>Feature stores, model serving latency, where ML fits in</li>
                                        <li>Why retrieval is the bottleneck (can't rank what you don't retrieve)</li>
                                        <li>Training embeddings on click data, dealing with position bias</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Managers */}
                    <div className="border border-border rounded-xl p-6 bg-card">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-600">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <h3 className="text-xl font-bold">Product Managers (Technical)</h3>
                                <p className="text-muted-foreground">
                                    <strong>Profile:</strong> Owns the search experience for an e-commerce or SaaS product.
                                    Reports to leadership on search KPIs.
                                </p>

                                <div className="bg-secondary/30 p-4 rounded-lg">
                                    <p className="font-medium mb-2">📍 Common situation:</p>
                                    <p className="text-sm text-muted-foreground italic">
                                        "I asked the team to 'add synonyms' and they said it would take 3 sprints.
                                        Why? Also, why can't we just use ChatGPT for search?"
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <p className="font-medium">What you'll learn:</p>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                                        <li>Vocabulary to communicate with engineering: recall, precision, P99</li>
                                        <li>Why some improvements are 2-week projects and others are 6-month investments</li>
                                        <li>Framework for prioritizing: relevance vs latency vs personalization</li>
                                        <li>How to read search dashboards and identify opportunities</li>
                                        <li>When to push back on "it's too hard" vs when to trust the team</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Founders */}
                    <div className="border border-border rounded-xl p-6 bg-card">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-500/10 rounded-lg text-green-600">
                                <Rocket className="w-6 h-6" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <h3 className="text-xl font-bold">Founders / CTOs</h3>
                                <p className="text-muted-foreground">
                                    <strong>Profile:</strong> Building a product where search is core (marketplace, knowledge base, etc.).
                                    Need to make build-vs-buy decisions.
                                </p>

                                <div className="bg-secondary/30 p-4 rounded-lg">
                                    <p className="font-medium mb-2">📍 Common situation:</p>
                                    <p className="text-sm text-muted-foreground italic">
                                        "We started with Algolia but it's costing $10K/month. Should we migrate to Elasticsearch?
                                        Also, our engineer says we need a 'vector database' now. What even is that?"
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <p className="font-medium">What you'll learn:</p>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                                        <li>When to use Algolia vs Elasticsearch vs Typesense vs build custom</li>
                                        <li>What's the minimum viable search stack for a startup?</li>
                                        <li>How search affects retention and revenue (with numbers)</li>
                                        <li>How to hire for search roles, what to look for</li>
                                        <li>Red flags: over-engineering vs under-investing</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Prerequisites */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <GraduationCap className="w-6 h-6" /> Prerequisites
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-3 text-green-600">✓ You should know</h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• Basic programming (Python, JavaScript, or similar)</li>
                            <li>• What an API is and how HTTP works</li>
                            <li>• What a database is (SQL or NoSQL)</li>
                            <li>• Basic data structures (arrays, hash maps)</li>
                        </ul>
                    </div>
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-3 text-blue-600">○ Nice to have</h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• Experience with Elasticsearch, Solr, or Algolia</li>
                            <li>• Basic understanding of distributed systems</li>
                            <li>• Familiarity with ML concepts (embeddings)</li>
                            <li>• Production experience with high-traffic systems</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Who This Is NOT For */}
            <section className="bg-secondary/20 p-8 rounded-xl border border-border">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" /> Who This Is NOT For
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <span className="text-red-500">✗</span>
                        <span><strong>Complete beginners</strong>  You need basic programming skills first. Try freeCodeCamp or similar.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-500">✗</span>
                        <span><strong>Academic IR researchers</strong>  This is practical, not theoretical. We skip the math proofs.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-500">✗</span>
                        <span><strong>Copy-paste coders</strong>  You won't find "paste this YAML" tutorials here. We focus on understanding.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-500">✗</span>
                        <span><strong>People looking for quick fixes</strong>  Search is complex. This guide respects that complexity.</span>
                    </li>
                </ul>
            </section>

            {/* Time Investment */}
            <section className="border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" /> Time Investment
                </h2>
                <div className="grid gap-4 md:grid-cols-3 text-center">
                    <div className="p-4">
                        <p className="text-3xl font-bold text-primary">2-3 hrs</p>
                        <p className="text-sm text-muted-foreground mt-1">To understand the fundamentals (Ch 0-3)</p>
                    </div>
                    <div className="p-4">
                        <p className="text-3xl font-bold text-orange-500">10-15 hrs</p>
                        <p className="text-sm text-muted-foreground mt-1">To complete the core curriculum (Ch 0-14)</p>
                    </div>
                    <div className="p-4">
                        <p className="text-3xl font-bold text-green-500">30+ hrs</p>
                        <p className="text-sm text-muted-foreground mt-1">For deep mastery with exercises (All chapters)</p>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/how-to-read" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> How to Read This
                </Link>
                <Link href="/search/how-to-read/problems" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next: Problems This Solves <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
