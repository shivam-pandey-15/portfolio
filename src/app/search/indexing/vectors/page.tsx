import { ArrowRight, Network, Layers, Search, CheckCircle2, Cpu, Zap, ArrowDown } from "lucide-react";
import Link from "next/link";

export default function Vectors() {
    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter 3.4: Indexing & Infrastructure</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Vector Indices (HNSW)</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Moving beyond keyword matching. Vector search finds semantically similar content by navigating
                    high-dimensional space using graph-based algorithms.
                </p>
            </div>

            <hr className="border-border" />

            {/* Meaning as Math */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">Meaning as Mathematical Coordinates</h2>
                <p className="text-foreground leading-relaxed">
                    How do you explain the meaning of "Queen" to a computer? You don't. You convert it into coordinates.
                    Modern embedding models (like OpenAI's text-embedding-3 or BERT) convert text into "vectors"—fixed-length
                    arrays of numbers that position concepts in a multi-dimensional semantic space. In this space, similarity isn't
                    about shared letters; it's about proximity. "Cat" and "Kitten" are neighbors, even though they share no characters.
                </p>

                <div className="bg-zinc-900 rounded-xl p-6">
                    <div className="text-zinc-400 text-sm mb-4">Text → 768-dimensional vector (simplified to 3D)</div>
                    <div className="font-mono text-sm space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-100">"cat"</span>
                            <span className="text-zinc-400">[0.21, 0.89, -0.52]</span>
                        </div>
                        <div className="flex justify-between items-center text-green-400 font-bold">
                            <span>"kitten"</span>
                            <span>[0.23, 0.85, -0.48] <span className="text-green-300 text-xs ml-2">← Close!</span></span>
                        </div>
                        <div className="flex justify-between items-center text-zinc-500">
                            <span>"laptop"</span>
                            <span>[0.91, -0.12, 0.78] <span className="text-zinc-600 text-xs ml-2">← Far apart</span></span>
                        </div>
                    </div>
                </div>

                {/* Semantic Space Visualization */}
                <div className="bg-zinc-100 rounded-xl p-8 relative h-64 overflow-hidden border-2 border-zinc-300">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]"></div>

                    {/* Cluster 1: Animals */}
                    <div className="absolute top-16 left-16">
                        <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">cat</div>
                    </div>
                    <div className="absolute top-20 left-28">
                        <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">kitten</div>
                    </div>
                    <div className="absolute top-12 left-36">
                        <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">dog</div>
                    </div>
                    <div className="absolute top-8 left-20 text-green-800 text-xs font-bold">Animals</div>

                    {/* Cluster 2: Tech */}
                    <div className="absolute bottom-20 right-20">
                        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">laptop</div>
                    </div>
                    <div className="absolute bottom-16 right-36">
                        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">computer</div>
                    </div>
                    <div className="absolute bottom-28 right-24 text-blue-800 text-xs font-bold">Technology</div>

                    {/* Distance Line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <line x1="180" y1="80" x2="480" y2="170" stroke="#ef4444" strokeWidth="2" strokeDasharray="8" />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-100 text-red-800 px-3 py-1 rounded text-xs font-bold border border-red-300">
                        Large Distance
                    </div>
                </div>
            </section>

            {/* The Brute Force Problem */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">The Brute Force Problem</h2>
                <p className="text-foreground leading-relaxed">
                    To find the closest match in this space, the naive approach is to measure the distance from your query vector
                    to <em>every single document vector</em> in your database. This is called "Exact kNN". It works perfectly for small datasets,
                    but the math is heavy. With 100 million documents and 768 dimensions per vector, a single query requires ~76 billion
                    floating-point operations. That takes seconds—far too slow for search.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="rounded-xl border-2 border-red-500 bg-red-50 p-6">
                        <div className="font-bold text-red-700 mb-3">Exact kNN (Brute Force)</div>
                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm text-zinc-100">
                            <div className="text-zinc-400">for each vector in corpus:</div>
                            <div className="pl-4">distance = cosine(query, vector)</div>
                            <div className="text-red-400 mt-2">100M vectors × 768 dims = 5 seconds</div>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-green-500 bg-green-50 p-6">
                        <div className="font-bold text-green-700 mb-3">Approximate kNN (HNSW)</div>
                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm text-zinc-100">
                            <div className="text-zinc-400">navigate graph of connections:</div>
                            <div className="pl-4">~150 distance calculations</div>
                            <div className="text-green-400 mt-2">100M vectors = 5 milliseconds</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HNSW Visualization */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold">HNSW: Hierarchical Navigable Small World</h2>
                <p className="text-foreground leading-relaxed">
                    To solve the scalability problem, we trade a tiny bit of accuracy for massive speed. HNSW is the state-of-the-art
                    algorithm for this. It builds a multi-layered graph, similar to a highway system. The top layers are "expressways"
                    with few stops (long links) that let you jump across the semantic universe quickly. As you get closer to your destination,
                    you drop down to "local roads" (dense connections) to find the exact neighborhood.
                </p>

                <div className="bg-zinc-900 rounded-xl p-8">
                    <div className="flex flex-col gap-6">
                        {/* Layer 2: Express */}
                        <div className="border-b border-dashed border-zinc-600 pb-6">
                            <div className="text-zinc-400 text-xs font-bold uppercase mb-3">Layer 2: Express (Long Jumps)</div>
                            <div className="flex justify-between items-center px-12">
                                <div className="w-5 h-5 rounded-full bg-blue-500 ring-4 ring-zinc-900"></div>
                                <div className="flex-1 h-px bg-blue-500/50 mx-6"></div>
                                <div className="w-5 h-5 rounded-full bg-blue-500 ring-4 ring-zinc-900"></div>
                            </div>
                        </div>

                        {/* Layer 1: Regional */}
                        <div className="border-b border-dashed border-zinc-600 pb-6">
                            <div className="text-zinc-400 text-xs font-bold uppercase mb-3">Layer 1: Regional</div>
                            <div className="flex justify-between items-center px-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="w-4 h-4 rounded-full bg-blue-400/60"></div>
                                ))}
                            </div>
                            <svg className="w-full h-4 opacity-30">
                                <path d="M40 8 L 100 8 L 200 8 L 300 8 L 400 8" stroke="currentColor" fill="none" className="text-blue-400" strokeWidth="1" />
                            </svg>
                        </div>

                        {/* Layer 0: Dense */}
                        <div>
                            <div className="text-zinc-400 text-xs font-bold uppercase mb-3">Layer 0: All Nodes (Local Connections)</div>
                            <div className="flex flex-wrap gap-1 justify-center">
                                {Array.from({ length: 60 }).map((_, i) => (
                                    <div key={i} className="w-2 h-2 rounded-full bg-zinc-600"></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 bg-zinc-800 p-4 rounded-lg text-zinc-300 text-sm text-center">
                        Search starts at top layer (big jumps), then drills down (smaller jumps).
                        <div className="text-green-400 font-bold mt-1">Result: ~150 distance comparisons instead of 100,000,000</div>
                    </div>
                </div>
            </section>

            {/* What is actually stored */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">What is Actually Stored? (HNSW Internals)</h2>
                <p className="text-foreground leading-relaxed">
                    It's easy to think of an index as "just the vectors". But HNSW is a graph.
                    On disk, it stores:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-zinc-900 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="font-bold text-zinc-100">Nodes (Vectors)</span>
                        </div>
                        <p className="text-sm text-zinc-400">
                            The raw floating-point arrays (e.g., 768 floats per document).
                            Heavy on storage.
                        </p>
                    </div>
                    <div className="bg-zinc-900 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-3 h-3 rounded-full bg-none border-2 border-blue-500"></div>
                            <span className="font-bold text-zinc-100">Edges (Proximity)</span>
                        </div>
                        <p className="text-sm text-zinc-400">
                            Adjacency lists connecting each node to its M closest neighbors.
                            The graph approximates a Delaunay Triangulation.
                        </p>
                    </div>
                </div>
                <p className="text-foreground mt-4 leading-relaxed">
                    <strong>How is it built?</strong> One vector at a time. When you insert a document, the system "searches"
                    for its nearest neighbors in the existing graph and draws edges to them. This greedy construction is
                    fast but approximate.
                </p>
            </section>

            {/* Where Vector Search Fits */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Where It Fits in the Search System</h2>
                <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded-r-xl">
                    <p className="font-bold text-amber-900 text-sm">
                        Critical Concept: Vector Search is for Recall, not Ranking.
                    </p>
                </div>
                <p className="text-foreground leading-relaxed">
                    A common misconception is that vector search replaces the whole search engine. It doesn't.
                    It replaces the <strong>Recall Stage</strong> (generating candidates).
                </p>
                <div className="bg-zinc-900 rounded-xl p-8 font-mono text-sm text-zinc-100 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 px-3 py-1 rounded text-white font-bold w-24 text-center">1. Recall</div>
                        <div>Fetch top 1,000 candidates via <span className="text-green-400">Vectors (Meaning)</span> + <span className="text-amber-400">Keywords (Exact)</span></div>
                    </div>
                    <div className="flex justify-center -my-2 ml-12"><ArrowDown className="w-5 h-5 text-zinc-600" /></div>
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-600 px-3 py-1 rounded text-white font-bold w-24 text-center">2. Blend</div>
                        <div>Normalize scores and merge lists (RRF or Linear Combination)</div>
                    </div>
                    <div className="flex justify-center -my-2 ml-12"><ArrowDown className="w-5 h-5 text-zinc-600" /></div>
                    <div className="flex items-center gap-4">
                        <div className="bg-green-600 px-3 py-1 rounded text-white font-bold w-24 text-center">3. Rank</div>
                        <div>Apply business rules (In Stock?) and strict LTR models</div>
                    </div>
                </div>
            </section>

            {/* Elasticsearch Configuration */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Vector Search in Elasticsearch</h2>
                <p className="text-foreground leading-relaxed">
                    Elasticsearch supports vector search natively through the dense_vector field type. You need to
                    generate embeddings externally (using models like sentence-transformers or OpenAI) and store them
                    alongside your documents. Here's how to configure the mapping and run a kNN query.
                </p>

                <div className="rounded-xl overflow-hidden border-2 border-zinc-300">
                    <div className="bg-zinc-200 px-4 py-2 text-sm font-mono text-zinc-700 border-b border-zinc-300">
                        Mapping with dense_vector
                    </div>
                    <pre className="bg-zinc-900 text-zinc-100 p-4 text-sm font-mono overflow-x-auto">
                        {`PUT /products
{
  "mappings": {
    "properties": {
      `}<span className="text-amber-400">"embedding"</span>{`: {
        "type": `}<span className="text-green-400">"dense_vector"</span>{`,
        "dims": `}<span className="text-blue-400">768</span>{`,           `}<span className="text-zinc-500">// Match your model output</span>{`
        "index": `}<span className="text-blue-400">true</span>{`,          `}<span className="text-zinc-500">// Enable HNSW indexing</span>{`
        "similarity": `}<span className="text-green-400">"cosine"</span>{`  `}<span className="text-zinc-500">// or "dot_product", "l2_norm"</span>{`
      }
    }
  }
}`}</pre>
                </div>

                <div className="rounded-xl overflow-hidden border-2 border-zinc-300">
                    <div className="bg-zinc-200 px-4 py-2 text-sm font-mono text-zinc-700 border-b border-zinc-300">
                        kNN Query
                    </div>
                    <pre className="bg-zinc-900 text-zinc-100 p-4 text-sm font-mono overflow-x-auto">
                        {`POST /products/_search
{
  `}<span className="text-amber-400">"knn"</span>{`: {
    "field": "embedding",
    "query_vector": [0.12, 0.45, -0.33, ...],  `}<span className="text-zinc-500">// 768 dims</span>{`
    "k": `}<span className="text-blue-400">10</span>{`,                                `}<span className="text-zinc-500">// Return top 10</span>{`
    "num_candidates": `}<span className="text-blue-400">100</span>{`                  `}<span className="text-zinc-500">// Speed vs accuracy</span>{`
  }
}`}</pre>
                </div>

                <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-xl">
                    <div className="font-bold text-blue-800 mb-2">The num_candidates Tradeoff</div>
                    <p className="text-sm text-blue-900">
                        Higher <code className="bg-blue-100 px-1 rounded">num_candidates</code> = more accurate but slower.
                        <br />
                        <strong>num_candidates: 50</strong>  fast, ~85% recall
                        <br />
                        <strong>num_candidates: 200</strong>  slower, ~98% recall
                    </p>
                </div>
            </section>

            {/* HNSW Parameters */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">HNSW Parameters (Tuning Guide)</h2>
                <p className="text-foreground leading-relaxed mb-6">
                    HNSW has three knobs that control the "Triangle of Trade-offs": <strong>Speed</strong>, <strong>Accuracy (Recall)</strong>, and <strong>Memory</strong>.
                    Understanding these is key to tuning your cluster.
                </p>
                <div className="grid gap-6 mb-8">
                    <div className="border border-border p-4 rounded-xl space-y-2 bg-zinc-50/50">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-foreground font-mono text-lg">m (Max Connections)</h3>
                            <span className="text-xs bg-zinc-200 px-2 py-1 rounded text-zinc-900 border border-zinc-300 font-bold">Build-time</span>
                        </div>
                        <p className="text-sm text-foreground">
                            <strong>Analogy:</strong> The number of friends each person keeps in their phone book.
                        </p>
                        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                            <li><strong>High M (e.g., 64)</strong>: Each node connects to many neighbors. You can jump to a destination in fewer hops. <span className="text-green-600 font-bold">Great recall</span>, but the index structure effectively consumes significantly more RAM per document.</li>
                            <li><strong>Low M (e.g., 16)</strong>: Each node knows few others. Small index footprint and fast updates, but you might get "stuck" in a local neighborhood and miss the true nearest neighbor.</li>
                        </ul>
                    </div>

                    <div className="border border-border p-4 rounded-xl space-y-2 bg-zinc-50/50">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-foreground font-mono text-lg">ef_construction</h3>
                            <span className="text-xs bg-zinc-200 px-2 py-1 rounded text-zinc-900 border border-zinc-300 font-bold">Build-time</span>
                        </div>
                        <p className="text-sm text-foreground">
                            <strong>Analogy:</strong> How thorough you are when vetting new friends.
                        </p>
                        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                            <li><strong>High ef (e.g., 200)</strong>: When adding a document, the system scans 200 candidates to find the <i>absolute optimal</i> `M` connections. The graph quality is pristine, but indexing CPU usage spikes.</li>
                            <li><strong>Low ef (e.g., 50)</strong>: We just grab the first decent neighbors we find. Indexing is fast, but the graph is "messy", leading to potentially worse search results later.</li>
                        </ul>
                    </div>

                    <div className="border border-border p-4 rounded-xl space-y-2 bg-blue-50/50">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-blue-900 font-mono text-lg">ef_search / num_candidates</h3>
                            <span className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-900 border border-blue-300 font-bold">Query-time</span>
                        </div>
                        <p className="text-sm text-blue-900">
                            <strong>Analogy:</strong> How many people you ask for directions at each intersection.
                        </p>
                        <ul className="text-sm text-blue-800 list-disc pl-5 space-y-1">
                            <li><strong>High (e.g., 100)</strong>: You carefully explore many possible paths. You almost certainly find the target, but latency increases.</li>
                            <li><strong>Low (e.g., 10)</strong>: You rush down the first promising path. Ultra-fast, but you might mistakenly arrive at a local optimum (incorrect match) rather than the global optimum.</li>
                        </ul>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">Parameter</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">What It Does</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Trade-off</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                            <tr><td className="px-4 py-2 font-mono text-foreground">M</td><td className="px-4 py-2 text-foreground">Max connections per node</td><td className="px-4 py-2 text-muted-foreground">Higher = better recall, more memory</td></tr>
                            <tr><td className="px-4 py-2 font-mono text-foreground">ef_construction</td><td className="px-4 py-2 text-foreground">Beam width during build</td><td className="px-4 py-2 text-muted-foreground">Higher = better graph, slower build</td></tr>
                            <tr><td className="px-4 py-2 font-mono text-foreground">num_candidates (ef)</td><td className="px-4 py-2 text-foreground">Candidates to explore at query time</td><td className="px-4 py-2 text-muted-foreground">Higher = better recall, slower search</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="rounded-xl border-2 border-border bg-white p-4">
                        <h4 className="font-bold text-foreground mb-2 text-sm">Product Search</h4>
                        <div className="text-xs text-muted-foreground space-y-1">
                            <div>M = 32, ef = 200</div>
                            <div className="text-green-700 font-bold">99% recall, 10ms</div>
                        </div>
                    </div>
                    <div className="rounded-xl border-2 border-border bg-white p-4">
                        <h4 className="font-bold text-foreground mb-2 text-sm">Log Analysis</h4>
                        <div className="text-xs text-muted-foreground space-y-1">
                            <div>M = 16, ef = 50</div>
                            <div className="text-green-700 font-bold">92% recall, 2ms</div>
                        </div>
                    </div>
                    <div className="rounded-xl border-2 border-border bg-white p-4">
                        <h4 className="font-bold text-foreground mb-2 text-sm">Recommendation</h4>
                        <div className="text-xs text-muted-foreground space-y-1">
                            <div>M = 24, ef = 100</div>
                            <div className="text-green-700 font-bold">97% recall, 5ms</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hybrid Search */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Hybrid Search: Keywords + Vectors</h2>
                <div className="text-foreground leading-relaxed">
                    <p className="mb-4">Why use both? Because they solve opposite problems:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong>Keyword Search (BM25)</strong> is precise but brittle. It finds "iPhone 15" but misses "Apple Phone".
                        </li>
                        <li>
                            <strong>Vector Search (HNSW)</strong> is broad but fuzzy. It finds "Apple Phone" but might return "Samsung Phone" (semantically close).
                        </li>
                        <li>
                            <strong>Hybrid Search</strong> combines them: vectors for <i>recall</i> (finding concepts) and keywords for <i>precision</i> (matching exact models).
                        </li>
                    </ul>
                </div>

                <div className="rounded-xl overflow-hidden border-2 border-zinc-300">
                    <div className="bg-zinc-200 px-4 py-2 text-sm font-mono text-zinc-700 border-b border-zinc-300">
                        Hybrid Query
                    </div>
                    <pre className="bg-zinc-900 text-zinc-100 p-4 text-sm font-mono overflow-x-auto">
                        {`{
  "query": {
    "match": { "title": "wireless keyboard", `}<span className="text-amber-400">"boost": 0.3</span>{` }
  },
  "knn": {
    "field": "title_vector",
    "query_vector": [...],
    "k": 50,
    `}<span className="text-amber-400">"boost": 0.7</span>{`
  }
}
`}<span className="text-zinc-500">// final_score = 0.3 × BM25 + 0.7 × vector_similarity</span></pre>
                </div>

                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">Use Case</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Keyword Weight</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Vector Weight</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                            <tr><td className="px-4 py-2 text-foreground">E-commerce (exact models matter)</td><td className="px-4 py-2 text-foreground">0.5</td><td className="px-4 py-2 text-foreground">0.5</td></tr>
                            <tr><td className="px-4 py-2 text-foreground">FAQ search (meaning matters)</td><td className="px-4 py-2 text-foreground">0.2</td><td className="px-4 py-2 text-green-700 font-bold">0.8</td></tr>
                            <tr><td className="px-4 py-2 text-foreground">Code search (exact tokens matter)</td><td className="px-4 py-2 text-green-700 font-bold">0.7</td><td className="px-4 py-2 text-foreground">0.3</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Memory & Quantization */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Memory & Quantization</h2>
                <p className="text-foreground leading-relaxed">
                    Vectors are heavy. A single 768-dimensional vector takes 3KB (floats). Multiply by 100 million documents,
                    and you need 300GB of RAM just for vectors. This gets expensive fast.
                    <strong>Quantization</strong> solves this by compressing 32-bit floats into 8-bit integers (or even 1-bit binaries),
                    sacrificing a tiny bit of precision for massive memory savings.
                </p>

                <div className="bg-zinc-900 rounded-xl p-6">
                    <div className="text-zinc-400 text-sm mb-4">Storage Formula: num_docs × dims × bytes_per_float</div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="font-mono text-sm text-zinc-100 space-y-1">
                            <div>10M products × 768 dims × 4 bytes</div>
                            <div>= <span className="text-amber-400">30.7 GB</span> (vectors only)</div>
                            <div>+ HNSW graph (~50% overhead)</div>
                            <div className="border-t border-zinc-700 pt-1">= <span className="text-red-400">~46 GB total</span></div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-green-400 uppercase mb-2">Quantization Reduces Memory 4x</div>
                            <div className="font-mono text-sm text-zinc-100 space-y-1">
                                <div>float32: 307 GB</div>
                                <div>int8: <span className="text-green-400 font-bold">77 GB</span> (4x smaller)</div>
                            </div>
                            <div className="mt-2 bg-zinc-800 px-3 py-2 rounded text-xs text-zinc-300">
                                ES 8.11+: <code className="text-green-400">"type": "int8_hnsw"</code>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Common Pitfalls */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Common Pitfalls</h2>
                <p className="text-foreground leading-relaxed">
                    Implementing vector search is deceptive. It looks easy ("just index the vectors!"), but the complexity hides in the operational details.
                    Here are the two ways teams most often destroy their search relevance.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-xl border-2 border-red-300 bg-red-50 p-5">
                        <h4 className="font-bold text-red-800 mb-3">Pitfall: Post-Filtering</h4>
                        <div className="bg-zinc-900 rounded-lg p-3 font-mono text-xs text-zinc-100">
                            <div className="text-red-400">// BAD: Find top 10, then filter</div>
                            <div>"knn": {'{'} "k": 10 {'}'}, "post_filter": ...</div>
                            <div className="text-zinc-500 mt-2">// Might return only 3 results!</div>
                        </div>
                        <div className="mt-3 bg-green-100 rounded p-2">
                            <div className="text-xs font-bold text-green-800">Fix: Pre-filter in knn</div>
                            <code className="text-xs text-green-900">"knn": {'{'} "filter": ... {'}'}</code>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-red-300 bg-red-50 p-5">
                        <h4 className="font-bold text-red-800 mb-3">Pitfall: Stale Embeddings</h4>
                        <div className="bg-zinc-900 rounded-lg p-3 font-mono text-xs text-zinc-100">
                            <div className="text-zinc-400">Day 1: "Blue Shoes $99" indexed</div>
                            <div className="text-zinc-400">Day 30: Text updated to "Red Shoes $299"</div>
                            <div className="text-red-400 mt-2">Vector still encodes "blue, shoes, affordable"!</div>
                        </div>
                        <div className="mt-3 bg-green-100 rounded p-2">
                            <div className="text-xs font-bold text-green-800">Fix: Re-embed on content change</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Failure Modes */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">When Vector Search Fails</h2>
                <p className="text-foreground leading-relaxed">
                    Vector search is magical, but it's not a silver bullet. If you remove keyword search entirely,
                    you will likely degrade the user experience in these specific scenarios:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="border p-5 rounded-xl bg-red-50 border-red-200">
                        <h4 className="font-bold text-red-900 mb-2">1. Exact SKU/ID Search</h4>
                        <p className="text-sm text-red-800 leading-relaxed">
                            <strong>Query:</strong> "iPhone 15 Pro Max 256GB"<br />
                            Vectors typically treat "128GB" and "256GB" as semantically identical synonyms.
                            Users searching for parts or IDs need exact character matching.
                        </p>
                    </div>
                    <div className="border p-5 rounded-xl bg-red-50 border-red-200">
                        <h4 className="font-bold text-red-900 mb-2">2. Out-of-Vocabulary Jargon</h4>
                        <p className="text-sm text-red-800 leading-relaxed">
                            <strong>Query:</strong> "X7000-Z Turbo"<br />
                            If the model has never seen this specific model number, it will hallucinate the closest concept (e.g., "fast car").
                            Keywords would correctly return 0 results.
                        </p>
                    </div>
                    <div className="border p-5 rounded-xl bg-red-50 border-red-200">
                        <h4 className="font-bold text-red-900 mb-2">3. Short/Ambiguous Queries</h4>
                        <p className="text-sm text-red-800 leading-relaxed">
                            <strong>Query:</strong> "GAP"<br />
                            A vector model might map this to "Space", "Interval", or "Clothing".
                            Without behavioral data, the vector space is often too broad.
                        </p>
                    </div>
                    <div className="border p-5 rounded-xl bg-red-50 border-red-200">
                        <h4 className="font-bold text-red-900 mb-2">4. Distribution Shift</h4>
                        <p className="text-sm text-red-800 leading-relaxed">
                            Models are trained on Wikipedia/Internet data. Your documents are niche technical manuals.
                            If you don't fine-tune, the "meaning" of words might not align with your domain.
                        </p>
                    </div>
                </div>
            </section>

            {/* Performance Benchmarks */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold">Performance Benchmarks</h2>
                <p className="text-foreground leading-relaxed">
                    How fast is HNSW? Incredibly fast. Because search is logarithmic `O(log N)`, doubling the data size
                    only adds a tiny constant amount of time. You can search billions of vectors in milliseconds.
                </p>
                <div className="bg-zinc-100 p-3 rounded-lg border border-zinc-200">
                    <p className="text-sm text-zinc-600 font-mono"><strong>Benchmark Spec:</strong> 10M products, 768 dimensions (m=16, ef_c=100)</p>
                </div>

                <div className="overflow-x-auto rounded-xl border-2 border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="text-left px-4 py-3 font-bold text-foreground">Configuration</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Recall@10</th>
                                <th className="text-left px-4 py-3 font-bold text-foreground">Latency (p50)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                            <tr><td className="px-4 py-2 font-mono text-foreground">ef=50</td><td className="px-4 py-2 text-foreground">92%</td><td className="px-4 py-2 text-green-700 font-bold">2ms</td></tr>
                            <tr><td className="px-4 py-2 font-mono text-foreground">ef=100</td><td className="px-4 py-2 text-foreground">96%</td><td className="px-4 py-2 text-foreground">4ms</td></tr>
                            <tr><td className="px-4 py-2 font-mono text-foreground">ef=200</td><td className="px-4 py-2 text-green-700 font-bold">98%</td><td className="px-4 py-2 text-foreground">8ms</td></tr>
                            <tr><td className="px-4 py-2 font-mono text-foreground">Brute force</td><td className="px-4 py-2 text-foreground">100%</td><td className="px-4 py-2 text-red-700 font-bold">500ms</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-xl">
                    <div className="font-bold text-blue-800 mb-2">Scaling Behavior</div>
                    <p className="text-sm text-blue-900 font-mono">
                        10M vectors: 4ms • 100M vectors: 8ms • 1B vectors: 15ms
                        <br />
                        <span className="text-blue-700">(Logarithmic scaling  10x data ≠ 10x latency)</span>
                    </p>
                </div>
            </section>

            {/* Key Takeaways */}
            <section className="bg-green-100 border-2 border-green-500 p-6 rounded-xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-800">
                    <CheckCircle2 className="w-5 h-5" /> Key Takeaways
                </h2>
                <ul className="space-y-2 text-sm text-green-900">
                    <li className="flex items-start gap-2">
                        <Network className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Vectors encode meaning</strong>  similar text produces nearby vectors in high-dimensional space.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Layers className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>HNSW uses hierarchical layers</strong> to navigate from coarse to fine, achieving O(log N) search.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Cpu className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Tune M and ef</strong> to balance memory, build time, and recall.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Zap className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Hybrid search is usually best</strong>  combine BM25 + vectors for best results.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Cpu className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Use int8 quantization</strong> to reduce memory 4x with minimal quality loss.</span>
                    </li>
                </ul>
            </section>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-border">
                <Link href="/search/indexing/bkd-docvalues" className="text-sm font-medium text-muted-foreground hover:text-primary">
                    ← 3.3 BKD Trees
                </Link>
                <Link href="/search/indexing/segments" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Next: Segments & Immutability <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
