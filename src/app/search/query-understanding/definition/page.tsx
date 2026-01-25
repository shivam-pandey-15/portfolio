"use client";

import { Search, Layers, Target, User, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, BarChart3, Code2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { KeyTakeaways } from "@/components/search/key-takeaways";

const informationLossData = [
    { dimension: "User Intent", know: 100, color: "#22c55e" },
    { dimension: "Spoken Query", know: 80, color: "#84cc16" },
    { dimension: "Typed Query", know: 40, color: "#eab308" },
    { dimension: "System Match", know: 25, color: "#ef4444" },
];

const takeaways = [
    { title: "Compressed Intent", description: "A query is compressed intent, not just text." },
    { title: "Context Matters", description: "Context (who, where, when) is just as important as content." },
    { title: "Ambiguity", description: "Most queries are ambiguous. The system must natively handle this." },
    { title: "Goal", description: "The goal is intent satisfaction, not just keyword matching." }
];

export default function DefinitionPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Chapter 2.1</p>
                <h1 className="text-4xl font-bold tracking-tight">What a Query Really Is</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    A query is not just text. It's a <strong>compressed expression of user intent</strong> with massive information loss.
                </p>
            </div>

            <hr className="border-border" />

            {/* Query Anatomy Visual */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">The Anatomy of a Query</h2>
                <p className="text-muted-foreground">
                    When a user types "running shoes", they aren't just entering two words they're compressing an entire mental model
                    into a brief search term. The gap between what they typed and what they meant represents the core challenge
                    of query understanding. Let's visualize this compression.
                </p>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* What user typed */}
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Search className="w-4 h-4" /> What the User Typed
                        </h3>
                        <div className="bg-secondary/30 p-4 rounded-lg text-center font-mono text-lg">
                            "running shoes"
                        </div>
                    </div>

                    {/* What user meant */}
                    <div className="border border-primary/30 rounded-xl p-6 bg-primary/5">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4" /> What the User Actually Meant
                        </h3>
                        <pre className="bg-background p-4 rounded-lg text-xs overflow-x-auto">
                            {`{
  "intent": "purchase",
  "category": "athletic footwear",
  "activity": "running",
  "gender": "unknown",
  "size": "unknown (will filter)",
  "price_range": "mid-range",
  "brand_preference": "none",
  "urgency": "unknown"
}`}
                        </pre>
                    </div>
                </div>
            </section>

            {/* Information Loss Chart */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <BarChart3 className="w-6 h-6" /> Quantifying Information Loss
                </h2>

                <p className="text-muted-foreground">
                    As users translate their thoughts into keywords, substantial information is lost. This chart quantifies that loss.
                    Notice how "System Match" initially captures only 25% of the original intent without intelligent understanding layers.
                </p>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-4">Information Retained (%)</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={informationLossData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#444" />
                                    <XAxis type="number" domain={[0, 100]} unit="%" fontSize={12} stroke="#888" tickLine={false} axisLine={false} />
                                    <YAxis type="category" dataKey="dimension" width={100} fontSize={12} stroke="#888" tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                    />
                                    <Bar dataKey="know" radius={4} name="% Info Retained">
                                        {informationLossData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center space-y-4">
                        <div className="bg-secondary/20 p-4 rounded-lg border border-border">
                            <p className="font-bold text-sm mb-1">The Search Engineer's Job</p>
                            <p className="text-sm text-muted-foreground">Our goal is to reverse this loss. We use context, history, and intelligent modeling to reconstruct the missing 75% of the original intent.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Industry Deep Dive */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Layers className="w-6 h-6" /> Industry Deep Dive
                </h2>

                <p className="text-muted-foreground">
                    Every major tech company parses queries to extract specific signals relevant to their domain.
                    Here is what "Query Understanding" looks like for different giants.
                </p>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Amazon */}
                    <div className="border border-border rounded-xl  overflow-hidden flex flex-col">
                        <div className="bg-secondary/40 px-4 py-3 border-b border-border">
                            <h3 className="font-bold text-sm">Amazon (E-commerce)</h3>
                            <p className="text-xs text-muted-foreground font-mono mt-1">"mens nike running shoes size 10"</p>
                        </div>
                        <div className="p-4 bg-[#1e1e1e] text-xs font-mono overflow-x-auto flex-1 text-gray-300">
                            <div className="text-green-300">"entities"</div>: {'{'}
                            <div className="pl-4 text-white">"gender": "mens",</div>
                            <div className="pl-4 text-white">"brand": "Nike",</div>
                            <div className="pl-4 text-white">"product": "running_shoes",</div>
                            <div className="pl-4 text-white">"size": 10</div>
                            {'}'},<br />
                            <div className="text-green-300">"intent"</div>: "product_search",<br />
                            <div className="text-green-300">"implicit"</div>: {'{'}
                            <div className="pl-4 text-white">"prime": true,</div>
                            <div className="pl-4 text-white">"delivery": "tomorrow"</div>
                            {'}'}
                        </div>
                    </div>

                    {/* Google */}
                    <div className="border border-border rounded-xl overflow-hidden flex flex-col">
                        <div className="bg-secondary/40 px-4 py-3 border-b border-border">
                            <h3 className="font-bold text-sm">Google (Local/General)</h3>
                            <p className="text-xs text-muted-foreground font-mono mt-1">"best pizza near me"</p>
                        </div>
                        <div className="p-4 bg-[#1e1e1e] text-xs font-mono overflow-x-auto flex-1 text-gray-300">
                            <div className="text-green-300">"intent"</div>: "find_business",<br />
                            <div className="text-green-300">"location"</div>: {'{'}
                            <div className="pl-4 text-white">"type": "near_user",</div>
                            <div className="pl-4 text-white">"lat": 40.71, "lon": -74.00</div>
                            {'}'},<br />
                            <div className="text-green-300">"filters"</div>: {'{'}
                            <div className="pl-4 text-white">"cuisine": "pizza",</div>
                            <div className="pl-4 text-white">"open_now": true,</div>
                            <div className="pl-4 text-white">"min_rating": 4.0</div>
                            {'}'}
                        </div>
                    </div>

                    {/* Spotify */}
                    <div className="border border-border rounded-xl overflow-hidden flex flex-col">
                        <div className="bg-secondary/40 px-4 py-3 border-b border-border">
                            <h3 className="font-bold text-sm">Spotify (Media)</h3>
                            <p className="text-xs text-muted-foreground font-mono mt-1">"sad songs for rainy days"</p>
                        </div>
                        <div className="p-4 bg-[#1e1e1e] text-xs font-mono overflow-x-auto flex-1 text-gray-300">
                            <div className="text-green-300">"mood"</div>: "sad",<br />
                            <div className="text-green-300">"context"</div>: "rainy_weather",<br />
                            <div className="text-green-300">"intent"</div>: "playlist_discovery",<br />
                            <div className="text-green-300">"expansion"</div>: [<br />
                            <div className="pl-4 text-white">"melancholy",</div>
                            <div className="pl-4 text-white">"acoustic",</div>
                            <div className="pl-4 text-white">"slow tempo"</div>
                            ]
                        </div>
                    </div>
                </div>
            </section>

            {/* Code Example */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Code2 className="w-6 h-6" /> Modeling a Query
                </h2>

                <p className="text-muted-foreground">
                    In code, we represent a query not as a string, but as robust object capturing all dimensions of intent.
                </p>

                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm font-mono border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-border">
                        <span className="text-muted-foreground">query_model.py</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <div className="flex flex-col gap-0.5">
                            <div>
                                <span className="text-pink-400">from</span> <span className="text-white">dataclasses</span> <span className="text-pink-400">import</span> <span className="text-white">dataclass, field</span>
                            </div>
                            <div>
                                <span className="text-pink-400">from</span> <span className="text-white">typing</span> <span className="text-pink-400">import</span> <span className="text-white">List, Dict, Optional</span>
                            </div>
                            <div>
                                <span className="text-white"> </span>
                            </div>
                            <div>
                                <span className="text-blue-400">@dataclass</span>
                            </div>
                            <div>
                                <span className="text-blue-400">class</span> <span className="text-yellow-300">SearchQuery</span><span className="text-white">:</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-green-400"># 1. Raw Input</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-white">raw_text: str</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-white"> </span>
                            </div>
                            <div className="pl-4">
                                <span className="text-green-400"># 2. Context (Who, Where, When)</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-white">user_id: str</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-white">region: str</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-white">timestamp: int</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-white"> </span>
                            </div>
                            <div className="pl-4">
                                <span className="text-green-400"># 3. Understanding Layers (Populated by pipeline)</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-white">normalized_text: Optional[str] = </span><span className="text-blue-400">None</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-white">entities: List[Dict] = field(default_factory=list) </span><span className="text-green-400"># [{'{'}'value': 'nike', 'type': 'brand'{'}'}]</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-white">intent: str = </span><span className="text-green-300">"unknown"</span> <span className="text-green-400"># transactional, informational...</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-white"> </span>
                            </div>
                            <div className="pl-4">
                                <span className="text-green-400"># 4. Expansion</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-white">expanded_terms: List[str] = field(default_factory=list)</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-white"> </span>
                            </div>
                            <div className="pl-4">
                                <span className="text-green-400"># 5. Execution Strategy</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-white">filters: Dict = field(default_factory=dict) </span><span className="text-green-400">{"# {'price': {'lt': 100}}"}</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-white">ranking_profile: str = </span><span className="text-green-300">"default"</span>
                            </div>
                            <div>
                                <span className="text-white"> </span>
                            </div>
                            <div>
                                <span className="text-green-400"># Usage</span>
                            </div>
                            <div>
                                <span className="text-white">query = SearchQuery(raw_text=</span><span className="text-green-300">"running shoes"</span><span className="text-white">, user_id=</span><span className="text-green-300">"u123"</span><span className="text-white">, region=</span><span className="text-green-300">"US"</span><span className="text-white">, timestamp=</span><span className="text-orange-300">1700000000</span><span className="text-white">)</span>
                            </div>
                            <div>
                                <span className="text-green-400"># Pipeline populates the rest...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Query Components */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Layers className="w-6 h-6" /> Query Components
                </h2>
                <p className="text-muted-foreground">
                    Every query can be decomposed into four fundamental components. Understanding these building blocks
                    helps you design pipelines that extract maximum signal from minimal input. Each component requires
                    different processing techniques and contributes uniquely to the final understanding.
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 text-primary">1. Tokens (Words)</h3>
                        <p className="text-sm text-muted-foreground mb-3">Raw text split by whitespace or punctuation.</p>
                        <div className="bg-secondary/30 p-3 rounded-lg font-mono text-sm">
                            "running shoes" → ["running", "shoes"]
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 text-blue-500">2. Entities</h3>
                        <p className="text-sm text-muted-foreground mb-3">Named entities extracted from query.</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-600 rounded text-xs">Brand: Nike</span>
                            <span className="px-2 py-1 bg-green-500/20 text-green-600 rounded text-xs">Category: shoes</span>
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-600 rounded text-xs">Size: 10</span>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 text-orange-500">3. Intent</h3>
                        <p className="text-sm text-muted-foreground mb-3">What the user wants to DO.</p>
                        <ul className="text-sm space-y-1">
                            <li><strong>Navigational:</strong> "Amazon login"</li>
                            <li><strong>Informational:</strong> "how to clean shoes"</li>
                            <li><strong>Transactional:</strong> "buy running shoes"</li>
                        </ul>
                    </div>

                    <div className="border border-border rounded-xl p-5">
                        <h3 className="font-bold mb-3 text-green-500">4. Context (Implicit)</h3>
                        <p className="text-sm text-muted-foreground mb-3">Information not in the query.</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• User location (IP, GPS)</li>
                            <li>• Device (mobile vs desktop)</li>
                            <li>• Time of day</li>
                            <li>• User history</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Real-World Case Studies */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <BarChart3 className="w-6 h-6" /> Real-World Case Studies
                </h2>
                <p className="text-muted-foreground">
                    Query understanding isn't one-size-fits-all. Different domains require radically different approaches.
                    These case studies from industry giants show how context, domain expertise, and user behavior shape
                    the entire query understanding pipeline.
                </p>

                <div className="space-y-6">
                    {/* Flipkart */}
                    <div className="rounded-xl border-2 border-amber-500 bg-amber-50 overflow-hidden">
                        <div className="bg-amber-500 text-white px-6 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingCart className="w-5 h-5" />
                                <span className="font-bold">FLIPKART</span>
                                <span className="text-amber-100 text-sm">E-commerce Sale Events</span>
                            </div>
                            <span className="text-xs bg-amber-600 px-2 py-1 rounded">100M+ searches/hour</span>
                        </div>
                        <div className="p-6 grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-bold text-amber-800">The Challenge</h4>
                                <p className="text-sm text-amber-900">
                                    During "Big Billion Days", query patterns shift dramatically. Price becomes the dominant
                                    intent signal users who normally search by brand switch to searching by budget.
                                </p>
                                <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                    <div className="text-zinc-500 mb-2"># Normal Day vs Sale Day</div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Normal:</span>
                                        <span className="text-green-400">"iPhone 15 Pro Max"</span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-zinc-400">Sale:</span>
                                        <span className="text-amber-400">"mobile under 15000"</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-bold text-amber-800">Query Distribution Shift</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-full bg-amber-200 rounded-full h-4">
                                            <div className="bg-amber-600 h-4 rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                        <span className="text-xs font-mono text-amber-800 w-12">65%</span>
                                    </div>
                                    <p className="text-xs text-amber-700">Price-based queries ("under X", "discount")</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-full bg-amber-200 rounded-full h-4">
                                            <div className="bg-amber-400 h-4 rounded-full" style={{ width: '25%' }}></div>
                                        </div>
                                        <span className="text-xs font-mono text-amber-800 w-12">25%</span>
                                    </div>
                                    <p className="text-xs text-amber-700">Brand + discount queries</p>
                                </div>
                                <div className="bg-amber-100 border border-amber-300 p-3 rounded-lg text-xs text-amber-800">
                                    <strong>Insight:</strong> Intent classifiers must be retrained for sale events or use dynamic confidence thresholds.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stack Overflow */}
                    <div className="rounded-xl border-2 border-orange-500 bg-orange-50 overflow-hidden">
                        <div className="bg-orange-500 text-white px-6 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Code2 className="w-5 h-5" />
                                <span className="font-bold">STACK OVERFLOW</span>
                                <span className="text-orange-100 text-sm">Developer Code Search</span>
                            </div>
                            <span className="text-xs bg-orange-600 px-2 py-1 rounded">50M queries/day</span>
                        </div>
                        <div className="p-6 grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-bold text-orange-800">The Challenge</h4>
                                <p className="text-sm text-orange-900">
                                    Developers paste error messages verbatim. Standard tokenizers destroy meaning by
                                    removing or splitting special characters that are semantically critical.
                                </p>
                                <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                    <div className="text-red-400">"TypeError: Cannot read property 'map' of undefined"</div>
                                    <div className="mt-2 text-zinc-500">Standard tokenizer output:</div>
                                    <div className="text-zinc-400 text-xs">["typeerror", "cannot", "read", "property", "map", "undefined"]</div>
                                    <div className="mt-2 text-zinc-500">Required output:</div>
                                    <div className="text-green-400 text-xs">["TypeError:", "Cannot read property", "'map'", "of undefined"]</div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-bold text-orange-800">Critical Distinctions</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-orange-200">
                                        <span className="text-2xl text-orange-600">≠</span>
                                        <div>
                                            <div className="font-mono text-sm"><span className="text-blue-600">useEffect</span> vs <span className="text-red-600">use effect</span></div>
                                            <div className="text-xs text-orange-700">Case and spacing matter</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-orange-200">
                                        <span className="text-2xl text-orange-600">≠</span>
                                        <div>
                                            <div className="font-mono text-sm"><span className="text-blue-600">===</span> vs <span className="text-red-600">==</span></div>
                                            <div className="text-xs text-orange-700">Operators are semantic, not noise</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-orange-100 border border-orange-300 p-3 rounded-lg text-xs text-orange-800">
                                    <strong>Insight:</strong> Custom tokenizers must preserve [], (), {'{}'}, ===, and other programming symbols.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Netflix */}
                    <div className="rounded-xl border-2 border-red-500 bg-red-50 overflow-hidden">
                        <div className="bg-red-600 text-white px-6 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5" />
                                <span className="font-bold">NETFLIX</span>
                                <span className="text-red-100 text-sm">Content Discovery</span>
                            </div>
                            <span className="text-xs bg-red-700 px-2 py-1 rounded">60% don't search</span>
                        </div>
                        <div className="p-6 grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-bold text-red-800">The Challenge</h4>
                                <p className="text-sm text-red-900">
                                    Most users browse rather than search. When they do search, queries are vague and
                                    rely heavily on implicit context: mood, time, who they're watching with.
                                </p>
                                <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm overflow-x-auto space-y-2">
                                    <div className="flex gap-3">
                                        <span className="text-zinc-500 w-16">Query:</span>
                                        <span className="text-amber-400">"that show about chess"</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="text-zinc-500 w-16">Intent:</span>
                                        <span className="text-green-400">The Queen's Gambit</span>
                                    </div>
                                    <div className="border-t border-zinc-700 pt-2 mt-2"></div>
                                    <div className="flex gap-3">
                                        <span className="text-zinc-500 w-16">Query:</span>
                                        <span className="text-amber-400">"sad movies"</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="text-zinc-500 w-16">Signal:</span>
                                        <span className="text-blue-400">Mood: melancholy, genre: drama</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-bold text-red-800">Personalization Dependency</h4>
                                <div className="bg-white p-4 rounded-lg border border-red-200 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-red-800">Query completeness</span>
                                        <span className="text-red-600 font-bold">~30%</span>
                                    </div>
                                    <div className="w-full bg-red-200 rounded-full h-3">
                                        <div className="bg-red-500 h-3 rounded-full" style={{ width: '30%' }}></div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-red-800">User profile fills gaps</span>
                                        <span className="text-green-600 font-bold">+70%</span>
                                    </div>
                                    <div className="w-full bg-green-200 rounded-full h-3">
                                        <div className="bg-green-500 h-3 rounded-full" style={{ width: '70%' }}></div>
                                    </div>
                                </div>
                                <div className="bg-red-100 border border-red-300 p-3 rounded-lg text-xs text-red-800">
                                    <strong>Insight:</strong> Query understanding must be deeply integrated with personalization user history is as important as query text.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Query Richness Spectrum */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Query Richness Spectrum</h2>
                <p className="text-muted-foreground">
                    Not all queries are created equal in terms of the information they carry. Sparse queries like "shoes" are
                    extremely common but provide almost no filtering signal. Rich queries with brand, size, and color give you
                    everything needed for an exact match. Your system must handle the entire spectrum gracefully.
                </p>

                <div className="relative">
                    {/* Spectrum bar */}
                    <div className="h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full mb-8" />

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="border-l-4 border-red-500 pl-4">
                            <h3 className="font-bold mb-2">Sparse (Hard)</h3>
                            <div className="bg-secondary/30 p-3 rounded text-sm font-mono mb-2">"shoes"</div>
                            <p className="text-xs text-muted-foreground">Millions of results, no filtering. Need fallback strategies.</p>
                        </div>

                        <div className="border-l-4 border-yellow-500 pl-4">
                            <h3 className="font-bold mb-2">Medium</h3>
                            <div className="bg-secondary/30 p-3 rounded text-sm font-mono mb-2">"running shoes men"</div>
                            <p className="text-xs text-muted-foreground">Some filtering applied. Clearer intent.</p>
                        </div>

                        <div className="border-l-4 border-green-500 pl-4">
                            <h3 className="font-bold mb-2">Rich (Easier)</h3>
                            <div className="bg-secondary/30 p-3 rounded text-sm font-mono mb-2">"nike air max 90 size 11 black"</div>
                            <p className="text-xs text-muted-foreground">Exact product match possible.</p>
                        </div>
                    </div>
                </div>
            </section>



            {/* Failure Case Studies */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-red-500" /> Failure Case Studies
                </h2>
                <p className="text-muted-foreground">
                    Query understanding failures are often subtle but devastating to user experience. These three common
                    failure modes show how even sophisticated systems can misinterpret user intent. Each represents a
                    fundamental challenge that requires specialized handling.
                </p>

                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Negation */}
                        <div>
                            <h3 className="font-bold text-red-500 mb-2">1. The Negation Problem</h3>
                            <div className="bg-background p-3 rounded border border-red-500/10 mb-2">
                                <p className="text-xs font-mono">Q: "laptop <span className="text-red-500 font-bold">without</span> touchscreen"</p>
                                <p className="text-xs mt-1 text-muted-foreground">Result: Touchscreen laptops</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                <span className="font-bold">Why:</span> System sees "touchscreen" as a keyword match and ignores the "without" stop word.
                            </p>
                        </div>

                        {/* Over-Correction */}
                        <div>
                            <h3 className="font-bold text-red-500 mb-2">2. The Over-Correction</h3>
                            <div className="bg-background p-3 rounded border border-red-500/10 mb-2">
                                <p className="text-xs font-mono">Q: "asics running shoes"</p>
                                <p className="text-xs mt-1 text-muted-foreground">Result: "Did you mean: <span className="text-red-500 font-bold">basics</span>?"</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                <span className="font-bold">Why:</span> Aggressive spell checker treats brand names as typos of common words.
                            </p>
                        </div>

                        {/* Context Blindness */}
                        <div>
                            <h3 className="font-bold text-red-500 mb-2">3. Context Blindness</h3>
                            <div className="bg-background p-3 rounded border border-red-500/10 mb-2">
                                <p className="text-xs font-mono">Q: "jaguar"</p>
                                <p className="text-xs mt-1 text-muted-foreground">Result: Animal biology page</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                <span className="font-bold">Why:</span> User was browsing car sites, but search engine ignored that intent signal.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technical Implementation */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Code2 className="w-6 h-6" /> Technical Implementation
                </h2>

                <p className="text-muted-foreground">
                    A high-performance intent understanding service must complete all this in <strong>under 50ms</strong>.
                </p>

                <div className="border border-border rounded-xl p-6 bg-[#1e1e1e] font-mono text-xs overflow-x-auto">
                    <div className="min-w-[600px] text-white space-y-2">
                        <div className="flex justify-between border-b border-gray-700 pb-2 mb-2 font-bold text-gray-400">
                            <span>Component</span>
                            <span>Latency Budget (P99)</span>
                        </div>
                        <div className="flex justify-between">
                            <span>1. Redis Cache Lookup</span>
                            <span className="text-green-400">3ms</span>
                        </div>
                        <div className="flex justify-between">
                            <span>2. Tokenization & Normalization</span>
                            <span className="text-green-400">1ms</span>
                        </div>
                        <div className="flex justify-between">
                            <span>3. Spell Correction (SymSpell)</span>
                            <span className="text-yellow-400">15ms</span>
                        </div>
                        <div className="flex justify-between">
                            <span>4. Entity Extraction (Distilled BERT)</span>
                            <span className="text-red-400">20ms</span>
                        </div>
                        <div className="flex justify-between">
                            <span>5. Intent Classification (XGBoost)</span>
                            <span className="text-green-400">8ms</span>
                        </div>
                        <div className="flex justify-between">
                            <span>6. Query Rewriting</span>
                            <span className="text-green-400">5ms</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-700 pt-2 mt-2 font-bold">
                            <span>TOTAL LATENCY</span>
                            <span className="text-orange-400">~52ms</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={takeaways} />


            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/query-understanding" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Query Understanding
                </Link>
                <Link href="/search/query-understanding/types" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next: Types of Queries <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
