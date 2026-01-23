import { ArrowRight, Target, BookOpen, Lightbulb, Users, Map, Layers, Code, Brain, Briefcase, Rocket, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function HowToRead() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 0</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">How to Read This Guide</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    A structured journey from business problems to distributed systems engineering.
                    This isn't a blog or a textbook — it's your roadmap to becoming a search systems expert.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                    <Link href="/search/how-to-read/audience" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        Start Reading <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a href="#curriculum" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-lg font-medium hover:bg-secondary/50 transition-colors">
                        <Map className="w-4 h-4" /> View Full Curriculum
                    </a>
                </div>
            </div>

            <hr className="border-border" />

            {/* Quick Links */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">In This Chapter</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Link href="/search/how-to-read/audience" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Users className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold group-hover:text-primary">0.1 Who This Is For</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Engineers, ML practitioners, PMs, and founders who want to go beyond the basics.</p>
                    </Link>

                    <Link href="/search/how-to-read/problems" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Target className="w-5 h-5 text-orange-500" />
                            <h3 className="font-semibold group-hover:text-primary">0.2 Problems This Solves</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">The knowledge gaps that hold engineers back from building production-grade search.</p>
                    </Link>

                    <Link href="/search/how-to-read/what-is-good-search" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <h3 className="font-semibold group-hover:text-primary">0.3 What "Good Search" Means</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Relevance, speed, and discovery — the three pillars of search quality.</p>
                    </Link>

                    <Link href="/search/how-to-read/business-lever" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Briefcase className="w-5 h-5 text-blue-500" />
                            <h3 className="font-semibold group-hover:text-primary">0.4 Search as a Business Lever</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Why search is a profit center, not a cost center. Revenue impact and prioritization.</p>
                    </Link>

                    <Link href="/search/how-to-read/real-world-vs-leetcode" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Code className="w-5 h-5 text-purple-500" />
                            <h3 className="font-semibold group-hover:text-primary">0.5 Real-World vs LeetCode</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Why production search is nothing like interview problems.</p>
                    </Link>
                </div>
            </section>

            {/* Curriculum Overview */}
            <section id="curriculum" className="space-y-8 scroll-mt-8">
                <div className="flex items-center gap-3">
                    <Layers className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold">Full Curriculum: 24 Chapters</h2>
                </div>

                <p className="text-muted-foreground max-w-3xl">
                    This guide takes you through the complete lifecycle of building, deploying, and operating search systems.
                    Organized into 8 parts, from foundations to production operations.
                </p>

                {/* Parts Overview */}
                <div className="grid gap-6">
                    {/* Part I */}
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4">Part I: Foundations (Chapters 0-3)</h3>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="text-sm"><span className="font-medium">0. How to Read This</span> — Philosophy, audience, curriculum</div>
                            <div className="text-sm"><span className="font-medium">1. Business & Product</span> — Why search matters, metrics, funnels</div>
                            <div className="text-sm"><span className="font-medium">2. Query Understanding</span> — Intent, tokenization, power laws</div>
                            <div className="text-sm"><span className="font-medium">3. Indexing & Infra</span> — Inverted index, BKD trees, HNSW</div>
                        </div>
                    </div>

                    {/* Part II */}
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4">Part II: The Search Pipeline (Chapters 4-7)</h3>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="text-sm"><span className="font-medium">4. Data Foundation</span> — Modeling, cleaning, quality</div>
                            <div className="text-sm"><span className="font-medium">5. Retrieval</span> — BM25, filters, WAND, hybrid</div>
                            <div className="text-sm"><span className="font-medium">6. Vector Search</span> — Embeddings, HNSW, semantic</div>
                            <div className="text-sm"><span className="font-medium">7. Training Embeddings</span> — Contrastive learning, fine-tuning</div>
                        </div>
                    </div>

                    {/* Part III */}
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4">Part III: Ranking & Presentation (Chapters 8-10)</h3>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="text-sm"><span className="font-medium">8. Ranking</span> — LTR, features, multi-stage</div>
                            <div className="text-sm"><span className="font-medium">9. UI Layout</span> — Visual hierarchy, snippets, mobile</div>
                            <div className="text-sm"><span className="font-medium">10. Ads in Search</span> — Sponsored results, monetization</div>
                        </div>
                    </div>

                    {/* Part IV */}
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4">Part IV: Performance & Scale (Chapters 11-14)</h3>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="text-sm"><span className="font-medium">11. Personalization</span> — User profiles, session intent</div>
                            <div className="text-sm"><span className="font-medium">12. Caching</span> — Types, invalidation, P99</div>
                            <div className="text-sm"><span className="font-medium">13. System Architecture</span> — Query path, indexing path, API design</div>
                            <div className="text-sm"><span className="font-medium">14. Distributed Systems</span> — Sharding, replication, consistency</div>
                        </div>
                    </div>

                    {/* Part V */}
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4">Part V: Operations (Chapters 15-17)</h3>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="text-sm"><span className="font-medium">15. Evaluation</span> — NDCG, A/B testing, guardrails</div>
                            <div className="text-sm"><span className="font-medium">16. Analytics</span> — Logging, zero results, improvement loops</div>
                            <div className="text-sm"><span className="font-medium">17. LLMs in Search</span> — RAG, agents, limitations</div>
                        </div>
                    </div>

                    {/* Part VI-VIII */}
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4">Parts VI-VIII: Hands-On & Career (Chapters 18-24)</h3>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="text-sm"><span className="font-medium">18. Build from Scratch</span> — Code your own search engine</div>
                            <div className="text-sm"><span className="font-medium">19. Case Studies</span> — Amazon, Google, GitHub, Netflix</div>
                            <div className="text-sm"><span className="font-medium">20. Failure Modes</span> — What breaks and why</div>
                            <div className="text-sm"><span className="font-medium">21-24. Meta</span> — Org structure, mindset, appendix</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Learning Paths */}
            <section className="bg-secondary/20 p-8 rounded-xl border border-border space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Lightbulb className="w-6 h-6" /> Learning Paths
                </h2>
                <p className="text-muted-foreground">Choose based on your background and goals:</p>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-background p-4 rounded-lg border border-border">
                        <h3 className="font-bold mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-primary" /> Linear (Beginners)
                        </h3>
                        <p className="text-sm text-muted-foreground">Read chapters 0-8 in order for the complete mental model.</p>
                    </div>
                    <div className="bg-background p-4 rounded-lg border border-border">
                        <h3 className="font-bold mb-2 flex items-center gap-2">
                            <Code className="w-4 h-4 text-green-500" /> Practical (Builders)
                        </h3>
                        <p className="text-sm text-muted-foreground">Chapters 0-1, then jump to 18 (Build from Scratch), return to 3-8 as needed.</p>
                    </div>
                    <div className="bg-background p-4 rounded-lg border border-border">
                        <h3 className="font-bold mb-2 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-blue-500" /> Systems (Infra Engineers)
                        </h3>
                        <p className="text-sm text-muted-foreground">Focus on: 3, 5, 12, 13, 14, 18</p>
                    </div>
                    <div className="bg-background p-4 rounded-lg border border-border">
                        <h3 className="font-bold mb-2 flex items-center gap-2">
                            <Brain className="w-4 h-4 text-purple-500" /> ML Path
                        </h3>
                        <p className="text-sm text-muted-foreground">Focus on: 6, 7, 8, 11, 17</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search" className="text-sm font-medium text-muted-foreground hover:text-primary">
                    ← Back to Overview
                </Link>
                <Link href="/search/how-to-read/audience" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Start: Who This Is For <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
