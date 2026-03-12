"use client";

import { ArrowRight, ArrowLeft, Brain, Zap, Layers, BarChart3, Cpu, GitBranch } from "lucide-react";
import Link from "next/link";

export default function EmbeddingTrainingPage() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 7</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Training &amp; Fine-Tuning Embeddings</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Move beyond zero-shot embeddings. This chapter covers when to train, how to build training data from user behavior, which fine-tuning strategies work at scale, how to measure quality, and how to deploy without breaking production.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                    <Link href="/search/embedding-training/why" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        Start Chapter <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <hr className="border-border" />

            {/* Quick Links */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">In This Chapter</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Link href="/search/embedding-training/why" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Brain className="w-5 h-5 text-blue-500" />
                            <h3 className="font-semibold group-hover:text-primary">7.1 Why Train Your Own</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">When off-the-shelf models plateau and domain shift justifies the cost of custom training.</p>
                    </Link>

                    <Link href="/search/embedding-training/training-data" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Layers className="w-5 h-5 text-purple-500" />
                            <h3 className="font-semibold group-hover:text-primary">7.2 Training Data: Click Pairs</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Mining high-quality training signals from user behavior, session awareness, and hard negatives.</p>
                    </Link>

                    <Link href="/search/embedding-training/contrastive" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Zap className="w-5 h-5 text-amber-500" />
                            <h3 className="font-semibold group-hover:text-primary">7.3 Contrastive Learning</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">InfoNCE loss, cosine similarity, batch size leveraging, and why bi-encoders dominate retrieval.</p>
                    </Link>

                    <Link href="/search/embedding-training/fine-tuning" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <GitBranch className="w-5 h-5 text-green-500" />
                            <h3 className="font-semibold group-hover:text-primary">7.4 Fine-Tuning Strategies</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Full training vs LoRA vs Matryoshka vs distillation—choose based on budget and constraints.</p>
                    </Link>

                    <Link href="/search/embedding-training/evaluation" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <BarChart3 className="w-5 h-5 text-cyan-500" />
                            <h3 className="font-semibold group-hover:text-primary">7.5 Evaluation Metrics</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">nDCG, Recall, MRR, slice-based evaluation, and why offline metrics gate experiments.</p>
                    </Link>

                    <Link href="/search/embedding-training/deployment" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Cpu className="w-5 h-5 text-pink-500" />
                            <h3 className="font-semibold group-hover:text-primary">7.6 Production Deployment</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Blue-green rollouts, backfills, consistency, quantization, and the vector mismatch trap.</p>
                    </Link>
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/vector-search" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 6. Vector Search
                </Link>
                <Link href="/search/ranking" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    Next: Ranking <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
