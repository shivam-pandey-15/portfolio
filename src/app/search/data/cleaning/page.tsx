"use client";

import { ArrowRight, ArrowLeft, Eraser, Languages, CaseLower, Scissors, Filter, Sparkles, RefreshCw, AlertTriangle, CheckCircle2, Shield, Fingerprint, Mic, Music, Scale, Calendar, Copy, GitMerge, FileCheck } from "lucide-react";
import Link from "next/link";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "Index Meaning, Not Syntax", description: "Raw strings are useless. Normalize units (kg→g), dates (ISO), and entities (Golden Records) to enable powerful non-text queries." },
    { title: "Redact Early", description: "Never let PII enter the inverted index. It is technically difficult and expensive to remove individual terms later." },
    { title: "One Size Fits None", description: "E-commerce needs 'fuzzy' logic to convert users. Log search needs 'exact' logic to debug errors. Choose your pipeline per index." },
    { title: "The Golden Record", description: "Duplicate records split ranking signals. Always resolve entities to a single ID before indexing to maximize relevance." }
];

export default function CleaningPage() {
    return (
        <div className="space-y-24 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">Chapter 4.5</span>
                    <span>Data Foundation</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Cleaning & Normalization</h1>
                <div className="prose prose-lg dark:prose-invert max-w-3xl text-muted-foreground">
                    <p>
                        Search engines operate on a simple principle: <strong>Garbage In, Garbage Out</strong>.
                        If you index "iPhone" and a user searches for "iphone" (lowercase), a naive system returns zero results.
                    </p>
                    <p>
                        The cleaning pipeline is the unsung hero of search relevance. It bridges the gap between
                        <em>human expression</em> (messy, inconsistent, diverse) and <em>machine indexing</em> (rigid, binary, exact).
                        This page walks through the six critical stages of transforming raw chaos into queryable order.
                    </p>
                </div>
            </div>

            <hr className="border-border" />

            {/* Visual Pipeline */}
            <section className="bg-zinc-900 text-zinc-100 rounded-xl p-8 border border-zinc-800 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                <h2 className="text-2xl font-bold mb-4 relative z-10 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-indigo-400" /> The Ingestion Pipeline
                </h2>
                <p className="text-zinc-400 mb-8 max-w-2xl relative z-10">
                    Data travels through a one-way transformation tunnel. Once indexed, the original raw state is often discarded from the inverted index (though kept in storage).
                </p>

                <div className="grid md:grid-cols-4 gap-4 relative z-10">
                    <div className="space-y-3">
                        <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 min-h-[100px] flex flex-col justify-center">
                            <div className="text-xs text-zinc-500 mb-1">1. Raw Input</div>
                            <code className="text-red-300 font-mono text-sm">&lt;p&gt;Café!&lt;/p&gt;</code>
                        </div>
                        <div className="flex justify-center text-zinc-600"><ArrowRight className="w-5 h-5 rotate-90 md:rotate-0" /></div>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 min-h-[100px] flex flex-col justify-center">
                            <div className="text-xs text-zinc-500 mb-1">2. Char Filter</div>
                            <code className="text-amber-300 font-mono text-sm">Café!</code>
                            <div className="text-[10px] text-zinc-500 mt-1">Strip HTML</div>
                        </div>
                        <div className="flex justify-center text-zinc-600"><ArrowRight className="w-5 h-5 rotate-90 md:rotate-0" /></div>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 min-h-[100px] flex flex-col justify-center">
                            <div className="text-xs text-zinc-500 mb-1">3. Tokenizer</div>
                            <div className="flex gap-2">
                                <code className="bg-zinc-900 px-2 py-1 rounded text-blue-300 font-mono text-sm">Café</code>
                            </div>
                        </div>
                        <div className="flex justify-center text-zinc-600"><ArrowRight className="w-5 h-5 rotate-90 md:rotate-0" /></div>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 min-h-[100px] flex flex-col justify-center">
                            <div className="text-xs text-zinc-500 mb-1">4. Token Filter</div>
                            <div className="flex gap-2">
                                <code className="bg-zinc-900 px-2 py-1 rounded text-green-300 font-mono text-sm">cafe</code>
                            </div>
                            <div className="text-[10px] text-zinc-500 mt-1">Lowercase + ASCII Fold</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 1. Character Level */}
            <section className="space-y-8">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 px-2">
                        <Eraser className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">1. Character Filtering</h2>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
                            <p>
                                Before we even think about "words", we must sanitize the character stream.
                                Common sources like CMS inputs often contain hidden garbage: invisible control characters,
                                non-breaking spaces (`&nbsp;`), and leftover HTML tags that clutter the index.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                        <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                            <Scissors className="w-5 h-5" /> HTML Stripping
                        </h3>
                        <p className="text-sm text-zinc-600 mb-4">
                            Raw HTML adds noise. Ranking algorithms might think the word "div" or "span" is relevant if not removed.
                        </p>
                        <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                            <div className="grid grid-cols-2 divide-x divide-zinc-200 border-b border-zinc-200 bg-zinc-100 text-xs font-medium text-zinc-500">
                                <div className="p-2 text-center">Input</div>
                                <div className="p-2 text-center">Output</div>
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-zinc-200">
                                <div className="p-4 font-mono text-xs text-red-600 break-all">
                                    &lt;h1&gt;Hello &lt;b&gt;World&lt;/b&gt;&lt;/h1&gt;
                                </div>
                                <div className="p-4 font-mono text-xs text-green-600 font-bold">
                                    Hello World
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6">
                        <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                            <RefreshCw className="w-5 h-5" /> Mapping & Normalization
                        </h3>
                        <p className="text-sm text-zinc-600 mb-4">
                            Normalizing non-standard characters before tokenization keeps the index clean.
                        </p>
                        <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                            <div className="grid grid-cols-2 divide-x divide-zinc-200 border-b border-zinc-200 bg-zinc-100 text-xs font-medium text-zinc-500">
                                <div className="p-2 text-center">Input</div>
                                <div className="p-2 text-center">Output</div>
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-zinc-200 divide-y">
                                <div className="p-3 font-mono text-xs text-zinc-700">:)</div>
                                <div className="p-3 font-mono text-xs text-zinc-900">_happy_</div>
                                <div className="p-3 font-mono text-xs text-zinc-700">&nbsp; (Non-breaking space)</div>
                                <div className="p-3 font-mono text-xs text-zinc-900">" " (Space)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Compliance & Redaction (NEW) */}
            <section className="space-y-8">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 px-2">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">2. Compliance & PII Redaction</h2>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
                            <p>
                                In the age of GDPR and CCPA, accidentally indexing PII (Personally Identifiable Information) is a disaster.
                                Search indices are often immutable segments; "deleting" a single email address often requires expensive segment merging.
                                The best defense is to <strong>redact at the gate</strong>.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-pink-50/50 border border-pink-100 rounded-xl p-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <p className="text-sm text-zinc-700 leading-relaxed">
                                Use regex patterns to scan every incoming document. If a pattern matches, apply a redaction policy immediately.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-16 text-xs font-bold text-pink-800 uppercase text-right">Email</div>
                                    <code className="bg-white px-3 py-1 rounded border border-pink-200 text-xs font-mono text-pink-600 w-full">
                                        [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]&#123;2,&#125;
                                    </code>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-16 text-xs font-bold text-pink-800 uppercase text-right">Phone</div>
                                    <code className="bg-white px-3 py-1 rounded border border-pink-200 text-xs font-mono text-pink-600 w-full">
                                        \d&#123;3&#125;-\d&#123;3&#125;-\d&#123;4&#125;
                                    </code>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-pink-200 shadow-sm p-6">
                            <h3 className="font-bold text-pink-900 mb-4 flex items-center gap-2">
                                <Fingerprint className="w-4 h-4" /> Redaction vs. Masking
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs text-zinc-500 mb-1">Input</div>
                                    <div className="font-mono text-sm bg-zinc-50 p-2 rounded border border-zinc-200">
                                        Call me at 555-0123
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs text-pink-600 font-bold mb-1">Redaction (Remove)</div>
                                        <div className="font-mono text-sm bg-pink-50 text-pink-700 p-2 rounded border border-pink-100">
                                            Call me at [PHONE]
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-blue-600 font-bold mb-1">Masking (Obscure)</div>
                                        <div className="font-mono text-sm bg-blue-50 text-blue-700 p-2 rounded border border-blue-100">
                                            Call me at ***-**23
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* 3. Token Level Handling */}
            <section className="space-y-8">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 px-2">
                        <Languages className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">3. Token Normalization</h2>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
                            <p>
                                Once character streams are split into tokens (words), we face the challenge of <strong>variety</strong>.
                                Users type fast and loose. "iphone", "iPhone", and "IPHONE" are distinct byte sequences but semantically identical.
                                Normalization unifies these variations into a single canonical form.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6">
                    {/* Lowercase & Accents */}
                    <div className="bg-indigo-50 border-2 border-indigo-100 rounded-xl p-6 flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1 space-y-4">
                            <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                                <CaseLower className="w-5 h-5" /> Lowercasing & ASCII Folding
                            </h3>
                            <p className="text-sm text-indigo-800">
                                Searches are usually case-insensitive. We handle this at <strong>index time</strong>, not query time.
                                ASCII Folding converts special characters like `é`, `ñ`, `ç` into their basic ASCII equivalents `e`, `n`, `c`.
                            </p>
                        </div>
                        <div className="flex-1 w-full bg-white rounded-lg border border-indigo-200 p-4 shadow-sm">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-zinc-500">Raw Term</span>
                                    <span className="text-zinc-500">Indexed Term</span>
                                </div>
                                <div className="flex justify-between items-center font-mono text-sm border-b border-zinc-100 pb-2">
                                    <span className="text-red-500">iPhone</span>
                                    <ArrowRight className="w-4 h-4 text-zinc-300" />
                                    <span className="text-green-600 font-bold bg-green-50 px-2 rounded">iphone</span>
                                </div>
                                <div className="flex justify-between items-center font-mono text-sm border-b border-zinc-100 pb-2">
                                    <span className="text-red-500">Café</span>
                                    <ArrowRight className="w-4 h-4 text-zinc-300" />
                                    <span className="text-green-600 font-bold bg-green-50 px-2 rounded">cafe</span>
                                </div>
                                <div className="flex justify-between items-center font-mono text-sm">
                                    <span className="text-red-500">Düsseldorf</span>
                                    <ArrowRight className="w-4 h-4 text-zinc-300" />
                                    <span className="text-green-600 font-bold bg-green-50 px-2 rounded">dusseldorf</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stemming */}
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1 space-y-4">
                            <h3 className="font-bold text-amber-900 flex items-center gap-2">
                                <Filter className="w-5 h-5" /> Stemming
                            </h3>
                            <p className="text-sm text-amber-800">
                                Reducing words to their root form. This increases <strong>Recall</strong> (finding more matches)
                                at the slight cost of <strong>Precision</strong>.
                                <br /><br />
                                <em>Warning:</em> Aggressive stemming can hurt. "Organization" &rarr; "Organ" changes meaning entirely.
                            </p>
                        </div>
                        <div className="flex-1 w-full bg-white rounded-lg border border-amber-200 p-4 shadow-sm">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-zinc-500">Raw Term</span>
                                    <span className="text-zinc-500">Root Form</span>
                                </div>
                                <div className="flex justify-between items-center font-mono text-sm border-b border-zinc-100 pb-2">
                                    <span className="text-red-500">Running</span>
                                    <ArrowRight className="w-4 h-4 text-zinc-300" />
                                    <span className="text-green-600 font-bold bg-green-50 px-2 rounded">run</span>
                                </div>
                                <div className="flex justify-between items-center font-mono text-sm border-b border-zinc-100 pb-2">
                                    <span className="text-red-500">Banks</span>
                                    <ArrowRight className="w-4 h-4 text-zinc-300" />
                                    <span className="text-green-600 font-bold bg-green-50 px-2 rounded">bank</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Phonetic Analysis (NEW/EXPANDED) */}
            <section className="space-y-8">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 px-2">
                        <Mic className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">4. Phonetic Analysis</h2>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
                            <p>
                                What if the user doesn't know the spelling? "Fuzzy" search isn't magic; it's often <strong>Phonetic Encoding</strong>.
                                By reducing words to their pronunciation signature, we can match "Smith", "Smyth", and "Schmidt" because they <em>sound</em> the same.
                                This is essential for names, medication brands, and user-generated tags.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                                <Music className="w-4 h-4" /> The Soundex Algorithm
                            </h3>
                            <p className="text-sm text-orange-800 mb-3">
                                Invented in 1918. Keeps the first letter, drops vowels (A, E, I, O, U, H, W, Y), and maps consonants to 6 digits.
                            </p>
                            <ol className="list-decimal list-inside space-y-1 text-sm text-orange-800 font-mono">
                                <li><strong>B, F, P, V</strong> &rarr; 1</li>
                                <li><strong>C, G, J, K, Q, S, X, Z</strong> &rarr; 2</li>
                                <li><strong>D, T</strong> &rarr; 3</li>
                                <li><strong>L</strong> &rarr; 4</li>
                                <li><strong>M, N</strong> &rarr; 5</li>
                                <li><strong>R</strong> &rarr; 6</li>
                            </ol>
                        </div>
                    </div>

                    {/* Soundex Visual */}
                    <div className="bg-zinc-900 rounded-xl p-8 text-white relative overflow-hidden border border-zinc-800 shadow-xl">
                        <div className="text-center space-y-8 relative z-10 w-full">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="text-red-400 font-mono text-2xl font-bold">Smith</div>
                                <div className="text-blue-400 font-mono text-2xl font-bold">Smyth</div>
                            </div>

                            <div className="flex items-center justify-center gap-4 text-zinc-500">
                                <ArrowRight className="w-6 h-6 rotate-90" />
                                <div className="text-xs uppercase tracking-widest">Soundex</div>
                                <ArrowRight className="w-6 h-6 rotate-90" />
                            </div>

                            <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-lg">
                                <div className="text-4xl font-mono font-bold text-green-400 tracking-[0.5em] text-center">
                                    S530
                                </div>
                                <p className="text-zinc-500 text-xs mt-3">
                                    Match found! Both resolve to S (Keep 1st) - 5 (m) - 3 (t) - 0 (pad)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Semantic Normalization (NEW) */}
            <section className="space-y-8">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 px-2">
                        <Scale className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">5. Semantic Normalization</h2>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
                            <p>
                                Strings are easy; Values are hard. If a user filters for "Laptops under 1kg", a product listed as "900g"
                                will fail to match if you indexed it as a raw string.
                                <strong>Value Canonicalization</strong> converts human-readable units into machine-sortable base types.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="border border-border rounded-xl p-6 hover:border-emerald-500/50 transition-colors">
                        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                            <Scale className="w-4 h-4" /> Unit Normalization
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            You cannot sort products by weight if some are "1kg" and others are "500g".
                            <strong>Normalization to Base Units</strong> is critical for range queries.
                        </p>
                        <div className="space-y-2 font-mono text-xs">
                            <div className="flex justify-between p-2 bg-zinc-100 rounded">
                                <span className="text-red-500">"1.5 kg"</span>
                                <ArrowRight className="w-4 h-4 text-zinc-400" />
                                <span className="text-green-600">1500 (grams)</span>
                            </div>
                            <div className="flex justify-between p-2 bg-zinc-100 rounded">
                                <span className="text-red-500">"500g"</span>
                                <ArrowRight className="w-4 h-4 text-zinc-400" />
                                <span className="text-green-600">500 (grams)</span>
                            </div>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-6 hover:border-emerald-500/50 transition-colors">
                        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Date Standardization
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Relative dates are user-friendly but un-indexable. Parse them into ISO-8601 timestamps.
                        </p>
                        <div className="space-y-2 font-mono text-xs">
                            <div className="flex justify-between p-2 bg-zinc-100 rounded">
                                <span className="text-red-500">"Last Friday"</span>
                                <ArrowRight className="w-4 h-4 text-zinc-400" />
                                <span className="text-green-600">"2023-11-24T00:00:00Z"</span>
                            </div>
                            <div className="flex justify-between p-2 bg-zinc-100 rounded">
                                <span className="text-red-500">"2 days ago"</span>
                                <ArrowRight className="w-4 h-4 text-zinc-400" />
                                <span className="text-green-600">NOW() - 48h</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Record Hygiene (NEW) */}
            <section className="space-y-8">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-600 px-2">
                        <FileCheck className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">6. Record Hygiene</h2>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
                            <p>
                                The previous steps focused on cleaning *fields*. Now we must clean *records*.
                                Duplicate records dilute relevance signals if a user clicks Product A, but Product B is an identical duplicate,
                                your ranking algorithm gets split signals. <strong>Entity Resolution</strong> is the fix.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-cyan-50/50 border border-cyan-100 rounded-xl p-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-cyan-900 flex items-center gap-2">
                                <GitMerge className="w-5 h-5" /> Entity Resolution
                            </h3>
                            <p className="text-sm text-cyan-800 leading-relaxed">
                                Ingestion often gathers data from multiple sources. You might have "IBM", "I.B.M. Corp", and "International Business Machines" as separate rows.
                            </p>
                            <p className="text-sm text-cyan-800 leading-relaxed">
                                <strong>The Golden Record</strong> strategy merges these into a single Document ID, combining the diverse fields (e.g., Stock Symbol from source A, Headquarters from source B).
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-cyan-200 p-4 space-y-4">
                            <div className="flex gap-2 opacity-50">
                                <div className="w-8 h-8 rounded bg-red-100"></div>
                                <div className="w-8 h-8 rounded bg-red-100"></div>
                                <div className="text-xs text-red-500 flex items-center">Fragments</div>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400">
                                <ArrowRight className="w-4 h-4 rotate-90 ml-3" />
                                <span className="text-xs">Jaccard Similarity &gt; 0.85</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="h-10 w-full rounded bg-cyan-100 border border-cyan-300 flex items-center justify-center text-cyan-700 font-bold text-sm">
                                    Golden Record (ID: ibm-123)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Strategy: Context Matters (NEW) */}
            <section className="space-y-8">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 px-2">
                        <Filter className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">7. Strategy: Context Matters</h2>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
                            <p>
                                There is no "correct" way to clean data. It depends entirely on your domain.
                                Aggressive cleaning increases **Recall** (finding things) but hurts **Precision** (finding the *right* thing).
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* E-commerce */}
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase">E-Commerce</span>
                        </div>
                        <h4 className="font-bold text-zinc-900 mb-2">Maximum Recall</h4>
                        <p className="text-xs text-zinc-500 mb-4">
                            User wants to find the product even if they type "grey" instead of "gray" or "iphon" vs "iPhone".
                        </p>
                        <ul className="text-xs space-y-2">
                            <li className="flex gap-2 text-green-700">
                                <CheckCircle2 className="w-3 h-3 shrink-0" /> Aggressive Stemming
                            </li>
                            <li className="flex gap-2 text-green-700">
                                <CheckCircle2 className="w-3 h-3 shrink-0" /> Phonetic Matching
                            </li>
                            <li className="flex gap-2 text-green-700">
                                <CheckCircle2 className="w-3 h-3 shrink-0" /> Synonyms (TV = Tele)
                            </li>
                        </ul>
                    </div>

                    {/* Log Analytics */}
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-red-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded uppercase">Log Analytics</span>
                        </div>
                        <h4 className="font-bold text-zinc-900 mb-2">Exact Precision</h4>
                        <p className="text-xs text-zinc-500 mb-4">
                            Searching for "Error 500" should NOT match "Error 502". Case sensitivity often matters (variable names).
                        </p>
                        <ul className="text-xs space-y-2">
                            <li className="flex gap-2 text-red-700">
                                <Eraser className="w-3 h-3 shrink-0" /> Minimal Stemming
                            </li>
                            <li className="flex gap-2 text-red-700">
                                <Eraser className="w-3 h-3 shrink-0" /> No Phonetic
                            </li>
                            <li className="flex gap-2 text-green-700">
                                <CheckCircle2 className="w-3 h-3 shrink-0" /> Whitespace Only
                            </li>
                        </ul>
                    </div>

                    {/* Legal / Medical */}
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded uppercase">Legal / Docs</span>
                        </div>
                        <h4 className="font-bold text-zinc-900 mb-2">Hybrid approach</h4>
                        <p className="text-xs text-zinc-500 mb-4">
                            Need synonyms ("contract" = "agreement") but distinct entities ("Cancer" != "Canker").
                        </p>
                        <ul className="text-xs space-y-2">
                            <li className="flex gap-2 text-green-700">
                                <CheckCircle2 className="w-3 h-3 shrink-0" /> Lemmatization
                            </li>
                            <li className="flex gap-2 text-purple-700">
                                <Scale className="w-3 h-3 shrink-0" /> Curated Synonyms
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />

            {/* Footer with Stopwords */}
            <section className="bg-zinc-900 text-zinc-300 p-8 rounded-xl border border-zinc-800">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" /> Last Step: The Stopwords Debate
                </h2>

                <div className="space-y-6">
                    <p className="text-zinc-400 leading-relaxed max-w-3xl">
                        Stopwords are extremely common words (e.g., "the", "is", "at", "which") that traditionally were
                        filtered out to save space. However, modern search needs context.
                        <strong>"To be or not to be"</strong> becomes nothing if you remove stopwords.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mt-8">
                        {/* Option A: Removal */}
                        <div className="bg-red-500/5 p-6 rounded-lg border border-red-500/10">
                            <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2">
                                Strategy A: Remove Them
                            </h3>
                            <ul className="space-y-3 text-sm text-zinc-400">
                                <li className="flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                    <span><strong>Pro:</strong> Smaller Index (30-40% reduction).</span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                    <span><strong>Pro:</strong> Faster queries (fewer tokens to match).</span>
                                </li>
                                <li className="flex gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                                    <span><strong>Con:</strong> Loss of Meaning ("The Who" becomes "Who").</span>
                                </li>
                                <li className="flex gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                                    <span><strong>Con:</strong> Breaks exact phrase searches.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Option B: Keep Them */}
                        <div className="bg-green-500/5 p-6 rounded-lg border border-green-500/10">
                            <h3 className="font-bold text-green-400 mb-4 flex items-center gap-2">
                                Strategy B: Keep Them (Modern Standard)
                            </h3>
                            <ul className="space-y-3 text-sm text-zinc-400">
                                <li className="flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                    <span><strong>Pro:</strong> Full semantic understanding (LLM ready).</span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                    <span><strong>Pro:</strong> Supports Natural Language Queries using position.</span>
                                </li>
                                <li className="flex gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                                    <span><strong>Con:</strong> Larger storage footprint.</span>
                                </li>
                                <li className="flex gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                                    <span><strong>Con:</strong> Slower common-term matching (mitigated by "Common-Grams").</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/data/text-vs-structured" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 4.4 Text vs Structured
                </Link>
                <Link href="/search/data/freshness" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Next: Freshness & Updates <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
