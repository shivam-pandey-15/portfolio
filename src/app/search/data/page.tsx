"use client";

import { ArrowRight, ArrowLeft, ShieldCheck, FileType, LayoutTemplate, Scale, Eraser, Clock, Trash2 } from "lucide-react";
import Link from "next/link";

export default function DataFoundationPage() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 4</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Data Foundation</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Garbage in, garbage out. The search engine is only as good as the data you feed it.
                    This chapter covers the often-ignored but critical work of modeling, cleaning, and maintaining your data pipeline.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                    <Link href="/search/data/quality" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        Start Chapter <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <hr className="border-border" />

            {/* Quick Links */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">In This Chapter</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Link href="/search/data/quality" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            <h3 className="font-semibold group-hover:text-primary">4.1 Quality as a Data Problem</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Why code changes rarely fix data issues.</p>
                    </Link>

                    <Link href="/search/data/types" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <FileType className="w-5 h-5 text-blue-500" />
                            <h3 className="font-semibold group-hover:text-primary">4.2 Types of Data</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Text, Keyword, Numeric, Date, and Geo. Choosing the right tool.</p>
                    </Link>

                    <Link href="/search/data/modeling" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <LayoutTemplate className="w-5 h-5 text-purple-500" />
                            <h3 className="font-semibold group-hover:text-primary">4.3 Document Modeling</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Denormalization, nested objects, and parent-child relationships.</p>
                    </Link>

                    <Link href="/search/data/text-vs-structured" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Scale className="w-5 h-5 text-amber-500" />
                            <h3 className="font-semibold group-hover:text-primary">4.4 Text vs Structured</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">When to analyze and when to exact match. Common pitfalls.</p>
                    </Link>

                    <Link href="/search/data/cleaning" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Eraser className="w-5 h-5 text-zinc-500" />
                            <h3 className="font-semibold group-hover:text-primary">4.5 Cleaning & Normalization</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Dealing with HTML tags, encoding errors, and whitespace.</p>
                    </Link>

                    <Link href="/search/data/freshness" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Clock className="w-5 h-5 text-violet-500" />
                            <h3 className="font-semibold group-hover:text-primary">4.6 Freshness & Updates</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Near-real-time ingestion vs batch processing.</p>
                    </Link>

                    <Link href="/search/data/deletes" className="group border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <Trash2 className="w-5 h-5 text-red-500" />
                            <h3 className="font-semibold group-hover:text-primary">4.7 Deletes & Reindexing</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Handling soft deletes, hard deletes, and index aliasing.</p>
                    </Link>
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/indexing" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 3. Indexing & Infra
                </Link>
                <Link href="/search/retrieval" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors">
                    Next Chapter: Retrieval <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
