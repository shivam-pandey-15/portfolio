import { Filter, Magnet, Target, AlertTriangle, Layers, Search, ArrowDown, Share2, Scale, Microscope, Users, Calculator, Code, Coins, MessageSquare, Gauge } from "lucide-react";
import Link from "next/link";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const takeaways = [
    { title: "The Unrecoverable Error", description: "If Retrieval misses a document, the Ranker cannot save it. Retrieval sets the quality ceiling." },
    { title: "Vocabulary Gap", description: "Users rarely search for the exact words in the document. We must bridge this gap." },
    { title: "Dynamic Logic", description: "We treat Head (popular) and Tail (rare) queries completely differently to balance noise vs results." },
    { title: "Precision Costs Compute", description: "We cannot run expensive models on 1B documents. We buy Recall cheaply at Stage 1." },
    { title: "Diversity is Safety", description: "When intent is ambiguous, returning a diverse set protects against zero-recall failures." }
];

export default function RecallVsPrecision() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 5.1: Retrieval Architecture</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Why Retrieval is about Recall, Not Precision</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Retrieval is the art of casting a net, not throwing a spear. In a multi-stage search architecture,
                    the primary job of Stage 1 is to ensure the right answer is <em>in the building</em>.
                    Retrieval exists to satisfy latency, memory, and CPU budgets under a recall constraint — not to optimize relevance.
                    Everything else is secondary.
                </p>
            </div>

            <hr className="border-border" />

            {/* 1. The First Law */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">The First Law of Search</h2>
                <div className="bg-red-50 border-2 border-red-500 p-8 rounded-xl text-center">
                    <p className="text-2xl font-serif italic text-red-900">
                        "You cannot rank what you do not find."
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">The Recruiter Metaphor</h3>
                        <p className="text-foreground leading-relaxed">
                            To understand the distinct roles of retrieval and ranking, imagine a large tech company hiring for a job.
                        </p>
                        <p className="text-foreground leading-relaxed">
                            <strong>Retrieval (Stage 1)</strong> acts as the <strong>Recruiter</strong>. Their job is to source a pool of 1,000 potential candidates from LinkedIn.
                            The Recruiter uses broad keywords like "Engineer" or "Software". Their goal is to maximize <strong>Recall</strong>.
                            If they are too strict ("Must have 5 years of Rust experience and live in Boston"), they might accidentally filter out the perfect candidate
                            who has 4.5 years of experience or lives nearby. Being too precise here is dangerous.
                        </p>
                        <p className="text-foreground leading-relaxed">
                            <strong>Ranking (Stage 2)</strong> acts as the <strong>Hiring Manager</strong>. Their job is to interview the 10 candidates passed to them.
                            Their goal is <strong>Precision</strong>. They spend hours (compute) with each candidate to ensure they are the perfect fit.
                        </p>
                        <p className="text-foreground leading-relaxed">
                            The critical lesson: If the Recruiter is "too smart" and skips a candidate, the Hiring Manager never meets them.
                            The system fails, regardless of how good the Hiring Manager is.
                        </p>
                    </div>
                    <div className="bg-zinc-100 p-6 rounded-xl border-2 border-zinc-200">
                        <h4 className="font-bold text-zinc-900 mb-4">Architecture of Constraints</h4>
                        <p className="text-sm text-zinc-600 mb-4">
                            We design the system backwards from constraints. We know the Ranker is expensive (e.g., tens of milliseconds per batch), so it can only
                            score 500 documents. Therefore, Retrieval must filter 1,000,000,000 documents down to 500.
                        </p>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center p-3 bg-white rounded border border-zinc-200">
                                <div className="flex flex-col">
                                    <span className="font-bold text-zinc-900">Stage 1: Retrieval</span>
                                    <span className="text-xs text-zinc-500">The "Loose" Filter</span>
                                </div>
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-bold">Max Recall</span>
                            </div>
                            <div className="flex justify-center text-zinc-400">↓ 1,000 Candidates</div>
                            <div className="flex justify-between items-center p-3 bg-white rounded border border-zinc-200">
                                <div className="flex flex-col">
                                    <span className="font-bold text-zinc-900">Stage 2: Ranking</span>
                                    <span className="text-xs text-zinc-500">The "Tight" Sort</span>
                                </div>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-bold">Max Precision</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. The Probability Chain */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">The Mathematics of Loss</h2>
                <div className="space-y-4">
                    <p className="text-foreground">
                        Search is often visualized as a funnel, but mathematically it is a <strong>Chain of Independent Probabilities</strong>.
                        A funnel implies flow; a chain implies dependency. For a user to find their answer, a sequence of events must occur successfully,
                        and the probability of the final success is the product of the probabilities of each step.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 text-center">
                        <div className="font-bold text-zinc-900 mb-1">1. Index Coverage</div>
                        <p className="text-xs text-zinc-500 mb-3">P(Indexed)</p>
                        <p className="text-sm text-zinc-600">
                            Is the document technically ingestible? Is it in the shard we are querying? If not, P=0.
                        </p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-500 text-center relative shadow-sm">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm">
                            The Choke Point
                        </div>
                        <div className="font-bold text-blue-900 mb-1">2. Retrieval</div>
                        <p className="text-xs text-blue-700 mb-3">P(Retrieved)</p>
                        <p className="text-sm text-blue-800">
                            Does the query match the document? Does it survive top-K selection under BM25 scoring?
                        </p>
                    </div>
                    <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 text-center">
                        <div className="font-bold text-zinc-900 mb-1">3. Ranking</div>
                        <p className="text-xs text-zinc-500 mb-3">P(Ranked)</p>
                        <p className="text-sm text-zinc-600">
                            Does the neural network think this is relevant enough to be in slot #1?
                        </p>
                    </div>
                </div>

                <div className="bg-zinc-900 p-8 rounded-xl text-center">
                    <p className="text-sm text-zinc-400 mb-4 font-semibold uppercase tracking-widest">The "Unrecoverable Error" Rule</p>
                    <p className="text-xl md:text-2xl text-zinc-100 font-mono leading-relaxed">
                        If <span className="text-blue-400 font-bold">P(Retrieved)</span> = 0 <span className="text-zinc-500">then</span> P(Success) = 0
                    </p>
                    <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
                        It doesn't matter if your Ranker is 100% accurate (P=1.0). <br />
                        <code className="bg-zinc-800 px-1 rounded">1.0 × 0 = 0</code>. <br />
                        This mathematical reality forces Stage 1 to prioritize inclusion (Recall) over exclusion (Precision).
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Failure Mode A */}
                    <div className="p-6 rounded-xl border-2 border-green-200 bg-green-50/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Filter className="w-5 h-5 text-green-700" />
                            </div>
                            <h3 className="font-bold text-green-900">Failure Mode A: Noise (False Positive)</h3>
                        </div>
                        <div className="space-y-3 text-sm text-green-800">
                            <p className="leading-relaxed">
                                The system returns "Apple Pie" when you search for "iPhone". This is a False Positive.
                                Crucially, <strong>this is not a disaster</strong>. The subsequent Ranking stage (which is smarter)
                                will examine "Apple Pie", realize it has low semantic similarity to "iPhone", and push it to page 10.
                            </p>
                            <div className="font-bold pt-2 border-t border-green-200">Status: RECOVERABLE ✅</div>
                        </div>
                    </div>

                    {/* Failure Mode B */}
                    <div className="p-6 rounded-xl border-2 border-red-200 bg-red-50/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-red-700" />
                            </div>
                            <h3 className="font-bold text-red-900">Failure Mode B: Silence (False Negative)</h3>
                        </div>
                        <div className="space-y-3 text-sm text-red-800">
                            <p className="leading-relaxed">
                                The system returns nothing when you search for "Running Kicks", even though "Nike Running Shoes" exist.
                                <strong>The game is over.</strong> The Ranker never receives the correct document. It cannot fix what it cannot see.
                                The user sees an empty page or irrelevant results.
                            </p>
                            <div className="font-bold pt-2 border-t border-red-200">Status: FATAL ❌</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2.5 The Candidate Set Contract */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">The Candidate Set Contract</h2>
                <div className="bg-zinc-900 text-zinc-100 p-8 rounded-xl border border-zinc-800">
                    <div className="flex items-start gap-6">
                        <div className="p-3 bg-zinc-800 rounded-lg">
                            <Calculator className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-indigo-400">Retrieval is a Budget Allocator</h3>
                            <p className="text-zinc-300 leading-relaxed">
                                Retrieval does not return "results" in the traditional sense. It returns a <strong>Candidate Set</strong> under a strict contract.
                                It is not an accuracy system; it is a budget allocator.
                            </p>
                            <ul className="space-y-2 text-zinc-400">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    Must contain the true positives (Recall).
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                    Must be small enough to rank (Top-K).
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                    Must be cheap to compute (Latency).
                                </li>
                            </ul>
                            <div className="bg-black/30 p-4 rounded border-l-2 border-indigo-500 text-sm italic text-zinc-400">
                                "How many candidates can Stage 2 afford? 100? 500? This number dictates your entire architecture."
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. The Vocabulary Gap (Restored) */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">The Vocabulary Gap</h2>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-4">
                        <p className="text-foreground leading-relaxed">
                            A major reason for low recall is the <strong>Vocabulary Gap</strong>. This is the linguistic mismatch between
                            how users describe a problem and how your database describes the solution. Users use colloquialisms,
                            slang, or vague concepts. Databases contain formal titles, part numbers, and marketing copy.
                        </p>
                        <p className="text-foreground leading-relaxed">
                            In the example below, a "Precision-First" system fails because the tokens do not overlap.
                            <code className="bg-zinc-100 px-1 rounded ml-1">"cheap" != "budget"</code> and <code className="bg-zinc-100 px-1 rounded">"laptop" != "notebook"</code>.
                            An exact match system (like a basic <Link href="/search/indexing/inverted-index" className="text-primary hover:underline">Inverted Index</Link>) returns 0 results, causing high churn.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="p-4 bg-zinc-100 rounded-lg border border-zinc-200">
                                <div className="text-xs font-bold text-zinc-500 uppercase mb-2">User Types</div>
                                <div className="font-mono text-red-600 font-bold text-lg">"cheap laptop"</div>
                                <div className="text-xs text-zinc-400 mt-2">Intent: Low cost portable computer</div>
                            </div>
                            <div className="p-4 bg-zinc-100 rounded-lg border border-zinc-200">
                                <div className="text-xs font-bold text-zinc-500 uppercase mb-2">Database Has</div>
                                <div className="font-mono text-green-600 font-bold text-lg">"Budget Notebook"</div>
                                <div className="text-xs text-zinc-400 mt-2">Content: Low cost portable computer</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-shrink-0 bg-blue-50 p-8 rounded-xl border-2 border-blue-200 text-center w-full md:w-72">
                        <MessageSquare className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                        <div className="text-3xl font-bold text-blue-900 mb-2">0 Results</div>
                        <div className="text-sm text-blue-700 leading-tight">
                            The cost of demanding precision at Stage 1.
                            Revenue = $0.
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. The Cost of Intelligence */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">The Cost of Intelligence</h2>
                <p className="text-foreground leading-relaxed">
                    A common question is: <em>"Why can't we just use the smart AI model for everything?"</em>
                    Why do we need this "dumb" retrieval stage at all?
                    The answer is scale. Intelligence is computationally expensive.
                </p>
                <p className="text-foreground leading-relaxed">
                    The table below illustrates the orders of magnitude difference in cost.
                    <Link href="/search/retrieval/bm25" className="text-primary hover:underline">BM25 (Inverted Index)</Link> is 100,000x cheaper than a Cross-Encoder (BERT).
                    To search 1 billion documents in &lt;100ms, we <strong>must</strong> use the cheap algorithm first to filter the list down.
                </p>
                <div className="overflow-x-auto rounded-xl border-2 border-border shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-zinc-200">
                                <th className="px-6 py-4 font-bold text-zinc-900">Algorithm</th>
                                <th className="px-6 py-4 font-bold text-zinc-900">Complexity</th>
                                <th className="px-6 py-4 font-bold text-zinc-900">Cost per Query</th>
                                <th className="px-6 py-4 font-bold text-zinc-900">Ideal Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 bg-white">
                            <tr className="hover:bg-zinc-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-zinc-900">Exact Match (Boolean)</div>
                                    <div className="text-xs text-zinc-500">Inverted Index</div>
                                </td>
                                <td className="px-6 py-4 font-mono text-zinc-600">Sublinear</td>
                                <td className="px-6 py-4 text-green-600 font-bold">$0.000001</td>
                                <td className="px-6 py-4 text-zinc-600">
                                    Stage 1. Posting-list bounded, skip-based. Good for filtering IDs/Names.
                                </td>
                            </tr>
                            <tr className="hover:bg-zinc-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-blue-700">Vector Search (<Link href="/search/retrieval/ann" className="hover:underline">HNSW</Link>)</div>
                                    <div className="text-xs text-zinc-500">Approximate Nearest Neighbor</div>
                                </td>
                                <td className="px-6 py-4 font-mono text-zinc-600">Sublinear*</td>
                                <td className="px-6 py-4 text-amber-600 font-bold">$0.001 (relative)</td>
                                <td className="px-6 py-4 text-zinc-600">
                                    Stage 1. Bounded graph walk. Catches semantic misses.
                                </td>
                            </tr>
                            <tr className="hover:bg-zinc-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-violet-700">Cross-Encoder (BERT)</div>
                                    <div className="text-xs text-zinc-500">Deep Neural Network</div>
                                </td>
                                <td className="px-6 py-4 font-mono text-zinc-600">O(K * model)</td>
                                <td className="px-6 py-4 text-red-600 font-bold">$0.10</td>
                                <td className="px-6 py-4 text-zinc-600">
                                    Stage 2. Expensive per-pair scoring. Used only on top 50 results.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section >

            {/* 4.5 Two-Phase Retrieval (Interlude) */}
            < section className="space-y-8" >
                <h2 className="text-3xl font-bold">Two-Phase Retrieval (The Loop)</h2>
                <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
                    <p className="text-foreground leading-relaxed mb-4">
                        To balance cost and recall, many systems use a <strong>Two-Phase Retrieval</strong> process within Stage 1 itself.
                    </p>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold text-zinc-900 mb-2">Phase 1: Coarse Retrieval</h4>
                            <p className="text-sm text-zinc-600 mb-2">
                                Scans the entire index using the cheapest possible logic (Boolean/BM25).
                                Returns a top-N of ~10,000 document IDs.
                            </p>
                            <code className="text-xs bg-zinc-200 px-1 rounded">Cost: Microseconds</code>
                        </div>
                        <div>
                            <h4 className="font-bold text-zinc-900 mb-2">Phase 2: Refined Retrieval (Rescoring)</h4>
                            <p className="text-sm text-zinc-600 mb-2">
                                Takes those 10,000 IDs and rescores them using more expensive logic (e.g., phrase matching, lightweight vector distance) to pick the best 500.
                            </p>
                            <code className="text-xs bg-zinc-200 px-1 rounded">Cost: Milliseconds</code>
                        </div>
                    </div>
                </div>
            </section >

            {/* 4.5 Multi-Channel Recall */}
            < section className="space-y-8" >
                <h2 className="text-3xl font-bold">Multi-Channel Recall</h2>
                <div className="bg-zinc-50 p-8 rounded-xl border border-zinc-200">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Layers className="w-5 h-5 text-purple-600" />
                                The Union of Channels
                            </h3>
                            <p className="text-foreground leading-relaxed">
                                Modern retrieval is not one algorithm. It is a <strong>Union of Recall Channels</strong>.
                                No single algorithm catches every user intent.
                                <br />
                                <code className="bg-zinc-100 px-1 rounded text-sm mt-2 inline-block">Calculate Final Set = Union(Lexical, Semantic, Personalized, Curated)</code>
                            </p>
                            <ul className="space-y-2 text-sm text-zinc-700">
                                <li className="flex items-center gap-2"><span className="text-blue-500 font-bold">Lexical (BM25):</span> Catches exact part numbers and names.</li>
                                <li className="flex items-center gap-2"><span className="text-purple-500 font-bold">Semantic (ANN):</span> Catches concepts ("cheap" = "budget").</li>
                                <li className="flex items-center gap-2"><span className="text-amber-500 font-bold">Personalized:</span> Bias towards user's gender/size/history.</li>
                            </ul>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-zinc-100 w-full md:w-64">
                            <div className="text-center text-xs font-bold text-zinc-400 mb-2 uppercase">Simplified Architecture</div>
                            <div className="space-y-2">
                                <div className="p-2 bg-blue-50 text-blue-700 text-xs rounded text-center font-mono">BM25 (300 docs)</div>
                                <div className="text-center text-zinc-300 text-[10px]">+</div>
                                <div className="p-2 bg-purple-50 text-purple-700 text-xs rounded text-center font-mono">HNSW (200 docs)</div>
                                <div className="text-center text-zinc-300 text-[10px]">↓</div>
                                <div className="p-2 bg-zinc-800 text-white text-xs rounded text-center font-bold">Ranker (500 Unique)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* 5. Recall Drift (Restored) */}
            < section className="space-y-8" >
                <h2 className="text-3xl font-bold">When Recall Goes Too Far (Drift)</h2>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="space-y-4 flex-1">
                        <p className="text-foreground leading-relaxed">
                            Is "More Recall" always the answer? <strong>No.</strong> There is a tipping point called <strong>Recall Drift</strong>.
                            This happens when you widen the net so much that the valid results become statistically insignificant compared to the noise.
                        </p>
                        <p className="text-foreground leading-relaxed">
                            For example, if a user searches "Java Developer", and you aggressively expand synonyms to include "Coffee",
                            you might retrieve 5,000 job descriptions and 5,000 coffee shop locations.
                            If your Ranker (Stage 2) is only looking at the top 500 candidates, and the coffee shops randomly fill those slots,
                            the valid job descriptions are pushed out.
                        </p>
                    </div>
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl w-full md:w-1/3">
                        <h3 className="font-bold text-amber-900 mb-2">The Signal-to-Noise Ratio (SNR)</h3>
                        <p className="text-sm text-amber-800 leading-relaxed">
                            Strictly speaking, if <span className="font-mono">RelCount / TotalRetrieved &lt; 0.01%</span> (or even 0.1%),
                            the Ranker begins to fail purely due to probability.
                            You have buried the needle in the haystack.
                        </p>
                    </div>
                </div>
            </section >

            {/* 5.5 Recall Gating */}
            < section className="space-y-8" >
                <h2 className="text-3xl font-bold">Recall Gating & Budget Allocation</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <p className="text-foreground leading-relaxed">
                            Because we have multiple channels, we must enforce <strong>Per-Channel Quotas</strong>.
                            You never let one channel flood the candidate set.
                        </p>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-sm text-red-800">
                            <strong>Why?</strong> If Vector Search returns 500 "somewhat relevant" items, it pushes out the 5 "exact matches" from BM25.
                            The Ranker needs <em>diversity</em> to work.
                        </div>
                        <p className="text-foreground leading-relaxed">
                            Mechanisms like <strong>WAND</strong> (Weak AND) exist to enforce compute budget during scoring, not just during retrieval.
                        </p>
                    </div>
                    <div className="bg-zinc-900 text-zinc-100 p-6 rounded-xl font-mono text-sm">
                        <div className="text-zinc-500 mb-2">// Example Budget Config</div>
                        <div className="space-y-1">
                            <div><span className="text-purple-400">const</span> <span className="text-blue-400">RETRIEVAL_BUDGET</span> = 1000;</div>
                            <div className="text-zinc-500 mt-2">// Hard Caps per channel</div>
                            <div><span className="text-blue-400">bm25_quota</span>: 600, <span className="text-zinc-500">// Lexical base</span></div>
                            <div><span className="text-blue-400">vector_quota</span>: 300, <span className="text-zinc-500">// Semantic expansion</span></div>
                            <div><span className="text-blue-400">rule_quota</span>: 100   <span className="text-zinc-500">// "Featured" items</span></div>
                        </div>
                    </div>
                </div>
            </section >

            {/* 5.8 Query Understanding */}
            < section className="space-y-8" >
                <h2 className="text-3xl font-bold">Query Understanding Before Retrieval</h2>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="p-3 bg-amber-100 rounded-lg">
                        <Scale className="w-6 h-6 text-amber-700" />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Strategies depend on Intent</h3>
                        <p className="text-foreground leading-relaxed">
                            Retrieval is not one fixed pipeline. The strategy changes based on <strong>Query Classification</strong>.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded">
                                <div className="font-bold text-sm mb-1">Navigational</div>
                                <div className="text-xs text-zinc-500">"Login", "Returns"</div>
                                <div className="text-xs font-bold text-blue-600 mt-2">→ Disable Vector Search. Exact match only.</div>
                            </div>
                            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded">
                                <div className="font-bold text-sm mb-1">Broad / Exploration</div>
                                <div className="text-xs text-zinc-500">"Summer dress"</div>
                                <div className="text-xs font-bold text-purple-600 mt-2">→ Boost Vector Search quota.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* 6. Dynamic Logic: Head vs Tail */}
            < section className="space-y-8" >
                <h2 className="text-3xl font-bold">Head vs. Tail: How to Solve It</h2>
                <p className="text-foreground leading-relaxed">
                    This brings us to the ultimate implementation strategy. How do we balance the Vocabulary Gap (Need Recall) with Drift (Need Precision)?
                    We cannot use a single static configuration. We must use a <strong>Dynamic Strategy</strong> based on the query volume of the user's input.
                </p>

                {/* The Head */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg"><Target className="w-5 h-5 text-blue-700" /></div>
                        <h3 className="text-2xl font-bold">The Head (Popular Queries)</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 bg-zinc-50 p-6 rounded-xl border border-zinc-200">
                        <div>
                            <h4 className="font-bold mb-2">The Characteristics</h4>
                            <p className="text-sm text-zinc-600 mb-4 leading-relaxed">
                                A "Head" query is short, popular, and unambiguous. E.g., <strong>"Nike"</strong> or <strong>"iPhone"</strong>.
                                We have massive amounts of data for these. The risk is not missing a result; the risk is performance and noise.
                            </p>
                            <h4 className="font-bold mb-2">The Solution Logic</h4>
                            <ol className="list-decimal pl-5 text-sm space-y-3 text-zinc-700">
                                <li><strong>Volume Analysis:</strong> Billions of results exist.</li>
                                <li><strong>Recall Risk:</strong> Near zero.</li>
                                <li><strong>Precision Risk:</strong> High (Drift).</li>
                                <li><strong>Action:</strong> Use <code className="bg-zinc-200 px-1 rounded">operator: "AND"</code>. Tends towards strict matching.</li>
                            </ol>
                        </div>
                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100 overflow-x-auto">
                            <div className="text-zinc-500 mb-2">// 1. Head Strategy: Strict AND</div>
                            <div className="text-pink-400">GET</div> <span className="text-green-300">/products/_search</span>
                            <div>{`{`}</div>
                            <div className="pl-4">
                                <span className="text-blue-300">"query"</span>: {`{`}
                            </div>
                            <div className="pl-8">
                                <span className="text-blue-300">"match"</span>: {`{`}
                            </div>
                            <div className="pl-12">
                                <span className="text-blue-300">"title"</span>: {`{`}
                            </div>
                            <div className="pl-16">
                                <span className="text-blue-300">"query"</span>: <span className="text-orange-300">"nike shoes"</span>,
                            </div>
                            <div className="pl-16 bg-zinc-800 rounded px-1 w-fit border border-zinc-700">
                                <span className="text-blue-300">"operator"</span>: <span className="text-orange-300">"and"</span>
                            </div>
                            <div className="pl-12">{`}`}</div>
                            <div className="pl-8">{`}`}</div>
                            <div className="pl-4">{`}`}</div>
                            <div>{`}`}</div>
                        </div>
                    </div>
                </div>

                {/* The Tail */}
                <div className="space-y-4 pt-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-lg"><Microscope className="w-5 h-5 text-amber-700" /></div>
                        <h3 className="text-2xl font-bold">The Tail (Rare Queries)</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 bg-zinc-50 p-6 rounded-xl border border-zinc-200">
                        <div>
                            <h4 className="font-bold mb-2">The Characteristics</h4>
                            <p className="text-sm text-zinc-600 mb-4 leading-relaxed">
                                A "Tail" query is long, specific, and rare. E.g., <strong>"red nike hiking waterproof mens 12"</strong>.
                                We have almost no exact matches. The risk is showing zero results.
                            </p>
                            <h4 className="font-bold mb-2">The Solution Logic</h4>
                            <ol className="list-decimal pl-5 text-sm space-y-3 text-zinc-700">
                                <li><strong>Volume Analysis:</strong> 0-5 results exist.</li>
                                <li><strong>Recall Risk:</strong> Extreme (The Vocabulary Gap).</li>
                                <li><strong>Action:</strong> Use <code className="bg-zinc-200 px-1 rounded">operator: "OR"</code>. Tends towards expansion.</li>
                                <li><strong>Safety:</strong> Use <code className="bg-zinc-200 px-1 rounded">minimum_should_match: "75%"</code> to prevent total garbage.</li>
                            </ol>
                        </div>
                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-xs text-zinc-100 overflow-x-auto">
                            <div className="text-zinc-500 mb-2">// 2. Tail Strategy: Loose OR with Threshold</div>
                            <div className="text-pink-400">GET</div> <span className="text-green-300">/products/_search</span>
                            <div>{`{`}</div>
                            <div className="pl-4">
                                <span className="text-blue-300">"query"</span>: {`{`}
                            </div>
                            <div className="pl-8">
                                <span className="text-blue-300">"match"</span>: {`{`}
                            </div>
                            <div className="pl-12">
                                <span className="text-blue-300">"title"</span>: {`{`}
                            </div>
                            <div className="pl-16">
                                <span className="text-blue-300">"query"</span>: <span className="text-orange-300">"red nike hiking waterproof"</span>,
                            </div>
                            <div className="pl-16 bg-zinc-800 rounded px-1 w-fit border border-zinc-700">
                                <span className="text-blue-300">"operator"</span>: <span className="text-orange-300">"or"</span>,
                            </div>
                            <div className="pl-16 bg-zinc-800 rounded px-1 w-fit mt-1 border border-zinc-700">
                                <span className="text-blue-300">"minimum_should_match"</span>: <span className="text-orange-300">"75%"</span> <span className="text-zinc-500">// See <Link href="/search/retrieval/wand" className="text-primary hover:underline">WAND</Link></span>
                            </div>
                            <div className="pl-12">{`}`}</div>
                            <div className="pl-8">{`}`}</div>
                            <div className="pl-4">{`}`}</div>
                            <div>{`}`}</div>
                        </div>
                    </div>
                </div>
            </section >

            {/* 7. Diversity (Ambiguity) */}
            < section className="space-y-6" >
                <h2 className="text-3xl font-bold">Diversity as a Recall Constraint</h2>
                <div className="flex flex-col md:flex-row gap-8 items-center bg-zinc-900 text-zinc-100 p-8 rounded-xl">
                    <div className="flex-1 space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-violet-400" />
                            Why "Best" is Subjective
                        </h3>
                        <p className="text-zinc-300 leading-relaxed">
                            Traditional recall metrics assume there is a single "right" answer. In search, intent is often ambiguous.
                            If a user searches for <strong>"Jaguar"</strong>, what should the system return?
                        </p>
                        <ul className="list-disc pl-5 text-sm text-zinc-400 space-y-1">
                            <li>A car enthusiast wants the luxury vehicle.</li>
                            <li>A student researching biology wants the animal.</li>
                            <li>A sports fan wants the Jacksonville Jaguars NFL team.</li>
                        </ul>
                        <p className="text-zinc-300 leading-relaxed">
                            A <strong>Precision-First</strong> system will blindly guess the most statistically probable topic (likely Cars) and fill the page with 10 cars.
                            This achieves 100% precision for the car lover, but <strong>0% Recall</strong> for the other two groups. It is a failure.
                        </p>
                        <p className="text-zinc-300 leading-relaxed">
                            A <strong>Recall-First</strong> system acknowledges the ambiguity. It purposely returns a mix: 5 Cars, 3 Animals, and 2 Teams.
                            It delegates the final decision to the Ranker (which might know the user is a football fan) or simply presents the diversity to the user.
                        </p>
                    </div>
                    <div className="w-full md:w-1/3 bg-zinc-800 p-6 rounded-lg border border-zinc-700">
                        <div className="text-xs font-bold text-zinc-500 uppercase mb-4 text-center">Goal: Diverse Recall Set</div>
                        <div className="space-y-4">
                            <div className="h-6 rounded-full overflow-hidden flex bg-zinc-700">
                                <div className="w-1/2 bg-blue-500 flex items-center justify-center text-[9px] font-bold tracking-widest">CAR (50%)</div>
                                <div className="w-1/3 bg-emerald-500 flex items-center justify-center text-[9px] font-bold tracking-widest">ANIMAL (30%)</div>
                                <div className="w-1/6 bg-orange-500 flex items-center justify-center text-[9px] font-bold tracking-widest">TEAM</div>
                            </div>
                            <div className="text-center text-xs text-zinc-400 p-3 border border-zinc-600 rounded bg-zinc-800/50">
                                "The Ranker can sort this.<br />It cannot sort what isn't there."
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* 7.5 Negative Constraints */}
            < section className="space-y-8" >
                <h2 className="text-3xl font-bold">Negative Constraints (Hard Filters)</h2>
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-white rounded shadow-sm">
                            <Filter className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-red-900">Hard Filters vs Soft Recall</h3>
                            <p className="text-red-800 leading-relaxed">
                                There is one exception to the "Maximize Recall" rule: <strong>Hard Constraints</strong>.
                                If a user applies a filter (e.g., "In Stock Only"), it is illegal to return out-of-stock items, even if they are relevant.
                            </p>
                            <div className="grid md:grid-cols-3 gap-4 mt-2">
                                <div className="bg-white p-3 rounded border border-red-100 text-sm">
                                    <div className="font-bold text-zinc-900">Inventory</div>
                                    <div className="text-xs text-zinc-500">Stock = 0</div>
                                </div>
                                <div className="bg-white p-3 rounded border border-red-100 text-sm">
                                    <div className="font-bold text-zinc-900">Geography</div>
                                    <div className="text-xs text-zinc-500">Country Mismatch</div>
                                </div>
                                <div className="bg-white p-3 rounded border border-red-100 text-sm">
                                    <div className="font-bold text-zinc-900">Security</div>
                                    <div className="text-xs text-zinc-500">No Permissions</div>
                                </div>
                            </div>
                            <p className="text-red-800 text-sm italic">
                                Note: These filters live inside the <strong>Retrieval Layer</strong> (as boolean clauses), not the Ranker.
                                Why? Because you cannot rank what you are legally forbidden to show.
                            </p>
                        </div>
                    </div>
                </div>
            </section >


            <KeyTakeaways takeaways={takeaways} />



            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/retrieval" className="text-sm font-medium text-muted-foreground hover:text-primary">
                    ← Retrieval Overview
                </Link>
                {/* Future Link
                <Link href="/search/retrieval/wand" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Next: WAND Algorithm <ArrowRight className="w-4 h-4" />
                </Link>
                */}
            </div>
        </div >
    );
}
