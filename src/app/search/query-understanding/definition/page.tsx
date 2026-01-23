"use client";

import { Search, Layers, Target, User, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, BarChart3, Code2 } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";

const informationLossData = [
    { dimension: "User Intent", know: 100, color: "#22c55e" },
    { dimension: "Spoken Query", know: 80, color: "#84cc16" },
    { dimension: "Typed Query", know: 40, color: "#eab308" },
    { dimension: "System Match", know: 25, color: "#ef4444" },
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

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Flipkart */}
                    <div className="border border-border rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded text-xs font-bold">FLIPKART</span>
                            <span className="font-bold text-sm">Sale Events</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                            During "Big Billion Days", 100M+ searches/hour. Query patterns shift dramatically.
                        </p>
                        <ul className="text-xs space-y-2 bg-secondary/30 p-3 rounded">
                            <li className="flex justify-between">
                                <span>"mobile under 15000"</span>
                                <span className="font-mono text-muted-foreground">35%</span>
                            </li>
                            <li className="flex justify-between">
                                <span>"laptop discount"</span>
                                <span className="font-mono text-muted-foreground">20%</span>
                            </li>
                            <li className="text-muted-foreground italic mt-2">
                                Price becomes the dominant intent signal during sales.
                            </li>
                        </ul>
                    </div>

                    {/* Stack Overflow */}
                    <div className="border border-border rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-500 rounded text-xs font-bold">STACK OVERFLOW</span>
                            <span className="font-bold text-sm">Code Search</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                            Developers search differently. Exact syntax and error codes matter.
                        </p>
                        <div className="text-xs space-y-2 bg-secondary/30 p-3 rounded font-mono">
                            <p className="text-red-400">"TypeError: Cannot read property 'x'"</p>
                            <p className="text-blue-400">"useEffect" ≠ "use effect"</p>
                            <p className="text-muted-foreground italic font-sans mt-2">
                                Requires custom tokenizers that preserve symbols like [], (), ===.
                            </p>
                        </div>
                    </div>

                    {/* Netflix */}
                    <div className="border border-border rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-0.5 bg-red-500/20 text-red-500 rounded text-xs font-bold">NETFLIX</span>
                            <span className="font-bold text-sm">The "I don't know" Problem</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                            60% of users don't search, they browse. Those who do search use vague queries.
                        </p>
                        <ul className="text-xs space-y-2 bg-secondary/30 p-3 rounded">
                            <li className="flex justify-between">
                                <span>"that show about chess"</span>
                                <span className="font-mono text-muted-foreground">Context</span>
                            </li>
                            <li className="flex justify-between">
                                <span>"sad movies"</span>
                                <span className="font-mono text-muted-foreground">Mood</span>
                            </li>
                            <li className="text-muted-foreground italic mt-2">
                                Heavy reliance on personalization to fill gaps.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Query Richness Spectrum */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Query Richness Spectrum</h2>

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
            <section className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" /> Key Takeaways
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">1.</span>
                        <span>A query is <strong>compressed intent</strong>, not just text</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">2.</span>
                        <span><strong>Context is as important as content</strong> (who, where, when)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">3.</span>
                        <span><strong>Most queries are ambiguous</strong> — the system must handle this</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary font-bold">4.</span>
                        <span>The goal is <strong>intent satisfaction</strong>, not keyword matching</span>
                    </li>
                </ul>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/query-understanding" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Query Understanding
                </Link>
                <Link href="/search/query-understanding/types" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next: Types of Queries <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div >
    );
}
