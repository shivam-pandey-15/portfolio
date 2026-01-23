export type NavItem = {
    title: string;
    href: string;
    items?: NavItem[];
};

export const searchNavConfig: NavItem[] = [
    {
        title: "0. How to Read This",
        href: "/search/how-to-read",
        items: [
            { title: "0.1 Who this is for", href: "/search/how-to-read/audience" },
            { title: "0.2 Problems this solves", href: "/search/how-to-read/problems" },
            { title: "0.3 What 'good search' means", href: "/search/how-to-read/what-is-good-search" },
            { title: "0.4 Search as a business lever", href: "/search/how-to-read/business-lever" },
            { title: "0.5 Real-world vs LeetCode", href: "/search/how-to-read/real-world-vs-leetcode" },
        ]
    },
    {
        title: "1. The Business & Product",
        href: "/search/business-product",
        items: [
            { title: "1.1 Why search is the heart", href: "/search/business-product/importance" },
            { title: "1.2 When search fails", href: "/search/business-product/failure" },
            { title: "1.3 Search vs Discovery vs Recs", href: "/search/business-product/comparison" },
            { title: "1.4 Types of search systems", href: "/search/business-product/types" },
            { title: "1.5 Search as a funnel", href: "/search/business-product/funnel" },
            { title: "1.6 Success metrics", href: "/search/business-product/metrics" },
        ],
    },
    {
        title: "2. Understanding the User Query",
        href: "/search/query-understanding",
        items: [
            { title: "2.1 What a query really is", href: "/search/query-understanding/definition" },
            { title: "2.2 Types of queries", href: "/search/query-understanding/types" },
            { title: "2.3 Intent vs tokens", href: "/search/query-understanding/intent" },
            { title: "2.4 Power laws", href: "/search/query-understanding/power-laws" },
            { title: "2.5 Understanding pipeline", href: "/search/query-understanding/pipeline" },
            { title: "2.6 Rewriting & expansion", href: "/search/query-understanding/rewriting" },
            { title: "2.7 Ambiguity", href: "/search/query-understanding/ambiguity" },
        ],
    },
    {
        title: "3. Data: The Foundation",
        href: "/search/data",
        items: [
            { title: "3.1 Quality as a data problem", href: "/search/data/quality" },
            { title: "3.2 Types of data", href: "/search/data/types" },
            { title: "3.3 Document modeling", href: "/search/data/modeling" },
            { title: "3.4 Text vs Structured", href: "/search/data/text-vs-structured" },
            { title: "3.5 Cleaning & Normalization", href: "/search/data/cleaning" },
            { title: "3.6 Freshness & Updates", href: "/search/data/freshness" },
            { title: "3.7 Deletes & Reindexing", href: "/search/data/deletes" },
        ],
    },
    {
        title: "4. Ingestion & Indexing",
        href: "/search/indexing",
        items: [
            { title: "4.1 What is an index?", href: "/search/indexing/basics" },
            { title: "4.2 Inverted index", href: "/search/indexing/inverted-index" },
            { title: "4.3 Forward index", href: "/search/indexing/forward-index" },
            { title: "4.4 Column stores", href: "/search/indexing/column-stores" },
            { title: "4.5 Structured + Unstructured", href: "/search/indexing/hybrid-data" },
            { title: "4.6 Sharding strategies", href: "/search/indexing/sharding" },
            { title: "4.7 Replication", href: "/search/indexing/replication" },
            { title: "4.8 NRT indexing", href: "/search/indexing/nrt" },
            { title: "4.9 Reindexing at scale", href: "/search/indexing/reindexing" },
        ]
    },
    {
        title: "5. Retrieval",
        href: "/search/retrieval",
        items: [
            { title: "5.1 Recall vs Precision", href: "/search/retrieval/recall-vs-precision" },
            { title: "5.2 Boolean retrieval", href: "/search/retrieval/boolean" },
            { title: "5.3 TF-IDF and BM25", href: "/search/retrieval/bm25" },
            { title: "5.4 Filters & Facets", href: "/search/retrieval/filters" },
            { title: "5.5 Execution plans", href: "/search/retrieval/execution-plans" },
            { title: "5.6 WAND & Early termination", href: "/search/retrieval/wand" },
            { title: "5.7 Caching", href: "/search/retrieval/caching" },
            { title: "5.8 Approximate retrieval (ANN)", href: "/search/retrieval/ann" },
            { title: "5.9 Hybrid retrieval", href: "/search/retrieval/hybrid" },
        ]
    },
    {
        title: "6. Vector & Semantic Search",
        href: "/search/vector-search",
        items: [
            { title: "6.1 Keyword not enough", href: "/search/vector-search/limitations" },
            { title: "6.2 Embeddings 101", href: "/search/vector-search/embeddings" },
            { title: "6.3 Bi-encoder vs Cross-encoder", href: "/search/vector-search/encoders" },
            { title: "6.4 Vector indexing", href: "/search/vector-search/indexing" },
            { title: "6.5 HNSW deep dive", href: "/search/vector-search/hnsw" },
            { title: "6.6 Latency vs Recall", href: "/search/vector-search/tradeoffs" },
            { title: "6.7 Hybrid ranking", href: "/search/vector-search/hybrid-ranking" },
            { title: "6.8 Failure modes", href: "/search/vector-search/failures" },
            { title: "6.9 Cost at scale", href: "/search/vector-search/cost" },
        ]
    },
    {
        title: "7. Ranking",
        href: "/search/ranking",
        items: [
            { title: "7.1 Ranking is everything", href: "/search/ranking/importance" },
            { title: "7.2 Multi-stage architecture", href: "/search/ranking/architecture" },
            { title: "7.3 Features", href: "/search/ranking/features" },
            { title: "7.4 Rule-based", href: "/search/ranking/rule-based" },
            { title: "7.5 Learning to Rank (LTR)", href: "/search/ranking/ltr" },
            { title: "7.6 Using click data", href: "/search/ranking/click-data" },
            { title: "7.7 Explore-Exploit", href: "/search/ranking/explore-exploit" },
            { title: "7.8 Feedback loops", href: "/search/ranking/feedback" },
        ]
    },
    {
        title: "8. UI Layout & Result Display",
        href: "/search/ui-layout",
        items: [
            { title: "8.1 Visual hierarchy", href: "/search/ui-layout/hierarchy" },
            { title: "8.2 List vs Card vs Grid", href: "/search/ui-layout/patterns" },
            { title: "8.3 Snippet optimization", href: "/search/ui-layout/snippets" },
            { title: "8.4 Rich results", href: "/search/ui-layout/rich-results" },
            { title: "8.5 Mobile design", href: "/search/ui-layout/mobile" },
            { title: "8.6 Accessibility", href: "/search/ui-layout/accessibility" },
            { title: "8.7 Performance", href: "/search/ui-layout/performance" },
        ]
    },
    {
        title: "9. Ads in Search Results",
        href: "/search/ads-in-search",
        items: [
            { title: "9.1 Why ads matter", href: "/search/ads-in-search/importance" },
            { title: "9.2 Ad formats", href: "/search/ads-in-search/formats" },
            { title: "9.3 Sponsored vs Organic", href: "/search/ads-in-search/sponsored-organic" },
            { title: "9.4 Relevance vs Revenue", href: "/search/ads-in-search/balance" },
            { title: "9.5 User trust", href: "/search/ads-in-search/trust" },
            { title: "9.6 Ad ranking", href: "/search/ads-in-search/ranking" },
            { title: "9.7 Metrics (CTR, CPC)", href: "/search/ads-in-search/metrics" },
        ]
    },
    {
        title: "10. Personalization",
        href: "/search/personalization",
        items: [
            { title: "10.1 Why it's hard", href: "/search/personalization/challenges" },
            { title: "10.2 User profiles", href: "/search/personalization/profiles" },
            { title: "10.3 Session intent", href: "/search/personalization/session" },
            { title: "10.4 Long vs Short term", href: "/search/personalization/signals" },
            { title: "10.5 Filter bubbles", href: "/search/personalization/bubbles" },
            { title: "10.6 Architecture", href: "/search/personalization/architecture" },
            { title: "10.7 Privacy", href: "/search/personalization/privacy" },
        ]
    },
    {
        title: "11. Caching & Performance",
        href: "/search/caching",
        items: [
            { title: "11.1 Latency sources", href: "/search/caching/latency" },
            { title: "11.2 Types of caches", href: "/search/caching/types" },
            { title: "11.3 Semantic cache", href: "/search/caching/semantic" },
            { title: "11.4 Invalidation", href: "/search/caching/invalidation" },
            { title: "11.5 Tail latency (P99)", href: "/search/caching/p99" },
            { title: "11.6 Capacity planning", href: "/search/caching/capacity" },
            { title: "11.7 QPS modeling", href: "/search/caching/qps" },
            { title: "11.8 Cost vs Performance", href: "/search/caching/tradeoffs" },
        ]
    },
    {
        title: "12. Distributed Architecture",
        href: "/search/infra",
        items: [
            { title: "12.1 Distributed systems", href: "/search/infra/distributed" },
            { title: "12.2 Stateless vs Stateful", href: "/search/infra/state" },
            { title: "12.3 Shards & Replicas", href: "/search/infra/sharding" },
            { title: "12.4 Fan-out / Fan-in", href: "/search/infra/fanout" },
            { title: "12.5 Failure modes", href: "/search/infra/failures" },
            { title: "12.6 Consistency", href: "/search/infra/consistency" },
            { title: "12.7 Multi-region", href: "/search/infra/multi-region" },
        ]
    },
    {
        title: "13. Evaluation & Metrics",
        href: "/search/evaluation",
        items: [
            { title: "13.1 Offline evaluation", href: "/search/evaluation/offline" },
            { title: "13.2 Online evaluation", href: "/search/evaluation/online" },
            { title: "13.3 Guardrails", href: "/search/evaluation/guardrails" },
            { title: "13.4 Why metrics lie", href: "/search/evaluation/pitfalls" },
            { title: "13.5 Debugging", href: "/search/evaluation/debugging" },
        ]
    },
    {
        title: "14. Analytics & Feedback",
        href: "/search/analytics",
        items: [
            { title: "14.1 What to log", href: "/search/analytics/logging" },
            { title: "14.2 Query analytics", href: "/search/analytics/queries" },
            { title: "14.3 Zero results", href: "/search/analytics/zero-results" },
            { title: "14.4 Reformulation", href: "/search/analytics/reformulation" },
            { title: "14.5 Error analysis", href: "/search/analytics/errors" },
            { title: "14.6 Improvement loop", href: "/search/analytics/loop" },
        ]
    },
    {
        title: "15. LLMs in Search",
        href: "/search/llms",
        items: [
            { title: "15.1 Where they help", href: "/search/llms/use-cases" },
            { title: "15.2 Rewriting", href: "/search/llms/rewriting" },
            { title: "15.3 Intent", href: "/search/llms/intent" },
            { title: "15.4 Summarization", href: "/search/llms/summarization" },
            { title: "15.5 Agents", href: "/search/llms/agents" },
            { title: "15.6 RAG vs Search", href: "/search/llms/rag" },
            { title: "15.7 Limitations", href: "/search/llms/limitations" },
        ]
    },
    {
        title: "16. Build from Scratch",
        href: "/search/build-from-scratch",
        items: [
            { title: "16.1 Inverted index", href: "/search/build-from-scratch/index" },
            { title: "16.2 Ranking", href: "/search/build-from-scratch/ranking" },
            { title: "16.3 Filters", href: "/search/build-from-scratch/filters" },
            { title: "16.4 Vector search", href: "/search/build-from-scratch/vectors" },
            { title: "16.5 LTR", href: "/search/build-from-scratch/ltr" },
            { title: "16.6 Distributed", href: "/search/build-from-scratch/distributed" },
            { title: "16.7 Productionizing", href: "/search/build-from-scratch/production" },
        ]
    },
    {
        title: "17. Case Studies",
        href: "/search/case-studies",
        items: [
            { title: "17.1 Amazon/Flipkart", href: "/search/case-studies/ecommerce" },
            { title: "17.2 Google", href: "/search/case-studies/google" },
            { title: "17.3 GitHub", href: "/search/case-studies/code" },
            { title: "17.4 Netflix/Spotify", href: "/search/case-studies/media" },
            { title: "17.5 Log Search", href: "/search/case-studies/logs" },
        ]
    },
    {
        title: "18. Failure Modes",
        href: "/search/failures",
        items: [
            { title: "18.1 Regressions", href: "/search/failures/regressions" },
            { title: "18.2 Index bloat", href: "/search/failures/bloat" },
            { title: "18.3 Latency", href: "/search/failures/latency" },
            { title: "18.4 Loops", href: "/search/failures/loops" },
            { title: "18.5 Over-ML", href: "/search/failures/over-ml" },
        ]
    },
    {
        title: "19. Org Structure",
        href: "/search/org",
        items: [
            { title: "19.1 Special teams", href: "/search/org/special" },
            { title: "19.2 Splits", href: "/search/org/splits" },
            { title: "19.3 Roadmap", href: "/search/org/roadmap" },
            { title: "19.4 Big Tech", href: "/search/org/big-tech" },
        ]
    },
    {
        title: "20. Startup Angle",
        href: "/search/startup",
        items: [
            { title: "20.1 Failing students", href: "/search/startup/students" },
            { title: "20.2 Semantic cache", href: "/search/startup/cache" },
            { title: "20.3 Study search", href: "/search/startup/study" },
            { title: "20.4 Feedback ranking", href: "/search/startup/ranking" },
            { title: "20.5 Cost efficiency", href: "/search/startup/cost" },
        ]
    },
    {
        title: "21. Engineer's Mindset",
        href: "/search/mindset",
        items: [
            { title: "21.1 Distributions", href: "/search/mindset/distributions" },
            { title: "21.2 Tradeoffs", href: "/search/mindset/tradeoffs" },
            { title: "21.3 Slicing", href: "/search/mindset/slicing" },
            { title: "21.4 Rarity", href: "/search/mindset/rarity" },
        ]
    },
    {
        title: "22. Appendix",
        href: "/search/appendix",
        items: [
            { title: "22.1 Glossary", href: "/search/appendix/glossary" },
            { title: "22.2 Reading", href: "/search/appendix/reading" },
            { title: "22.3 Papers", href: "/search/appendix/papers" },
            { title: "22.4 Interviews", href: "/search/appendix/interviews" },
        ]
    },
];
