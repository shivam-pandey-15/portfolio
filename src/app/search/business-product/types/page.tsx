import { ShoppingCart, FileText, Globe, Code, Database, Play, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TypesPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Chapter 1.4</p>
                <h1 className="text-4xl font-bold tracking-tight">Types of Search Systems</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Not all search is the same. Different domains have different requirements.
                </p>
            </div>

            <hr className="border-border" />

            {/* Search Types Grid */}
            <section className="space-y-8">
                {/* E-commerce */}
                <div className="border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                            <ShoppingCart className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl">E-commerce Search</h3>
                            <p className="text-sm text-muted-foreground">Amazon, Flipkart, Shopify, Etsy</p>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="font-medium text-sm mb-2">Characteristics</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Structured data (price, brand, size)</li>
                                <li>• Business logic heavy (inventory, margins)</li>
                                <li>• Faceted navigation</li>
                                <li>• Personalization</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-medium text-sm mb-2">Real Problems</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• <strong>Variant explosion:</strong> Same shoe, 100 variants</li>
                                <li>• <strong>"Cheap" problem:</strong> Popularity over price intent</li>
                                <li>• <strong>Seller spam:</strong> 47 identical listings</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Document */}
                <div className="border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl">Document / Enterprise Search</h3>
                            <p className="text-sm text-muted-foreground">Notion, Confluence, SharePoint, Google Drive</p>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="font-medium text-sm mb-2">Characteristics</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Unstructured text (docs, PDFs, wikis)</li>
                                <li>• Access control critical</li>
                                <li>• Recency matters</li>
                                <li>• Entity extraction</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-medium text-sm mb-2">Real Problems</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• <strong>Permission explosion:</strong> 10M docs, user sees 1K</li>
                                <li>• <strong>Version confusion:</strong> 5 versions of same doc</li>
                                <li>• <strong>No click signal:</strong> How to measure success?</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Web */}
                <div className="border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <Globe className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl">Web Search</h3>
                            <p className="text-sm text-muted-foreground">Google, Bing, DuckDuckGo</p>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="font-medium text-sm mb-2">Characteristics</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Massive scale (billions of pages)</li>
                                <li>• Crawling required</li>
                                <li>• Link analysis (PageRank)</li>
                                <li>• Spam detection</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-medium text-sm mb-2">Real Problems</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• <strong>Freshness vs authority:</strong> News vs Wikipedia</li>
                                <li>• <strong>Local intent:</strong> "pizza near me"</li>
                                <li>• <strong>Zero-click:</strong> Featured snippets</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Code */}
                <div className="border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Code className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl">Code Search</h3>
                            <p className="text-sm text-muted-foreground">GitHub, Sourcegraph, Grep.app</p>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="font-medium text-sm mb-2">Characteristics</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Syntax-aware</li>
                                <li>• Regex/pattern support</li>
                                <li>• Exact match important</li>
                                <li>• Cross-repository</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-medium text-sm mb-2">Real Problems</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• <strong>Naming conventions:</strong> getUser vs get_user</li>
                                <li>• <strong>Symbol vs text:</strong> Function vs comment</li>
                                <li>• <strong>Monorepo scale:</strong> Billions of lines</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Log */}
                <div className="border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <Database className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl">Log / Observability Search</h3>
                            <p className="text-sm text-muted-foreground">Splunk, ELK, Datadog, Loki</p>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="font-medium text-sm mb-2">Characteristics</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Time-series data</li>
                                <li>• High volume (millions/second)</li>
                                <li>• Aggregations</li>
                                <li>• Retention policies</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-medium text-sm mb-2">Real Problems</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• <strong>Ingestion during incidents:</strong> 10x volume</li>
                                <li>• <strong>Hot/cold storage:</strong> Cost optimization</li>
                                <li>• <strong>Full-text cost:</strong> 1PB = expensive</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Media */}
                <div className="border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <Play className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl">Media Search</h3>
                            <p className="text-sm text-muted-foreground">YouTube, Spotify, Netflix, Pinterest</p>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="font-medium text-sm mb-2">Characteristics</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Multimodal (text, image, audio, video)</li>
                                <li>• Content understanding (ML)</li>
                                <li>• Personalization heavy</li>
                                <li>• Engagement focus</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-medium text-sm mb-2">Real Problems</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• <strong>Content understanding:</strong> What's IN the video?</li>
                                <li>• <strong>Audio search:</strong> "That song that goes..."</li>
                                <li>• <strong>Creator SEO abuse:</strong> Clickbait titles</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Matrix */}
            <section className="overflow-x-auto">
                <h2 className="text-2xl font-semibold mb-6">Comparison Matrix</h2>
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-semibold">Type</th>
                            <th className="text-left py-3 px-4 font-semibold">Personalization</th>
                            <th className="text-left py-3 px-4 font-semibold">Latency SLA</th>
                            <th className="text-left py-3 px-4 font-semibold">Key Challenge</th>
                            <th className="text-left py-3 px-4 font-semibold">Scale Example</th>
                        </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                        <tr className="border-b border-border/50">
                            <td className="py-3 px-4 font-medium">E-commerce</td>
                            <td className="py-3 px-4">Medium</td>
                            <td className="py-3 px-4">P99 &lt; 100ms</td>
                            <td className="py-3 px-4">Business logic</td>
                            <td className="py-3 px-4">500M products (Amazon)</td>
                        </tr>
                        <tr className="border-b border-border/50">
                            <td className="py-3 px-4 font-medium">Document</td>
                            <td className="py-3 px-4">Low</td>
                            <td className="py-3 px-4">P99 &lt; 500ms</td>
                            <td className="py-3 px-4">Permissions</td>
                            <td className="py-3 px-4">2B docs (Google Drive)</td>
                        </tr>
                        <tr className="border-b border-border/50">
                            <td className="py-3 px-4 font-medium">Web</td>
                            <td className="py-3 px-4">High</td>
                            <td className="py-3 px-4">P99 &lt; 200ms</td>
                            <td className="py-3 px-4">Spam</td>
                            <td className="py-3 px-4">130T pages (Google)</td>
                        </tr>
                        <tr className="border-b border-border/50">
                            <td className="py-3 px-4 font-medium">Code</td>
                            <td className="py-3 px-4">Low</td>
                            <td className="py-3 px-4">P99 &lt; 500ms</td>
                            <td className="py-3 px-4">Tokenization</td>
                            <td className="py-3 px-4">200M repos (GitHub)</td>
                        </tr>
                        <tr className="border-b border-border/50">
                            <td className="py-3 px-4 font-medium">Log</td>
                            <td className="py-3 px-4">None</td>
                            <td className="py-3 px-4">P99 &lt; 1s</td>
                            <td className="py-3 px-4">Volume</td>
                            <td className="py-3 px-4">1PB/day (Netflix)</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 font-medium">Media</td>
                            <td className="py-3 px-4">Very High</td>
                            <td className="py-3 px-4">P99 &lt; 200ms</td>
                            <td className="py-3 px-4">Content understanding</td>
                            <td className="py-3 px-4">800M videos (YouTube)</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/business-product/comparison" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Search vs Discovery vs Recs
                </Link>
                <Link href="/search/business-product/funnel" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    Next: Search as a Funnel <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
