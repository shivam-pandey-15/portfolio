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
        title: "3. Indexing & Infrastructure",
        href: "/search/indexing",
        items: [
            { title: "3.1 What is an Index?", href: "/search/indexing/definition" },
            { title: "3.2 Inverted Index (Text)", href: "/search/indexing/inverted-index" },
            { title: "3.3 BKD Trees & DocValues", href: "/search/indexing/bkd-docvalues" },
            { title: "3.4 Vector Indices (HNSW)", href: "/search/indexing/vectors" },
            { title: "3.5 Segments & Immutability", href: "/search/indexing/segments" },
            { title: "3.6 Sharding & Architecture", href: "/search/indexing/sharding" },
            { title: "3.7 Write & Query Path", href: "/search/indexing/paths" },
        ],
    },
    {
        title: "4. Data Foundation",
        href: "/search/data",
        items: [
            { title: "4.1 Quality as a data problem", href: "/search/data/quality" },
            { title: "4.2 Types of data", href: "/search/data/types" },
            { title: "4.3 Document modeling", href: "/search/data/modeling" },
            { title: "4.4 Text vs Structured", href: "/search/data/text-vs-structured" },
            { title: "4.5 Cleaning & Normalization", href: "/search/data/cleaning" },
            { title: "4.6 Freshness & Updates", href: "/search/data/freshness" },
            { title: "4.7 Deletes & Reindexing", href: "/search/data/deletes" },
        ],
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
        title: "7. Training Embedding Models",
        href: "/search/embedding-training",
        items: [
            { title: "7.1 Why train your own", href: "/search/embedding-training/why" },
            { title: "7.2 Training data: click pairs", href: "/search/embedding-training/training-data" },
            { title: "7.3 Contrastive learning", href: "/search/embedding-training/contrastive" },
            { title: "7.4 Fine-tuning strategies", href: "/search/embedding-training/fine-tuning" },
            { title: "7.5 Evaluation metrics", href: "/search/embedding-training/evaluation" },
            { title: "7.6 Production deployment", href: "/search/embedding-training/production" },
        ]
    },
    {
        title: "8. Ranking",
        href: "/search/ranking",
        items: [
            { title: "8.1 Ranking is everything", href: "/search/ranking/importance" },
            { title: "8.2 Multi-stage architecture", href: "/search/ranking/architecture" },
            { title: "8.3 Features", href: "/search/ranking/features" },
            { title: "8.4 Rule-based", href: "/search/ranking/rule-based" },
            { title: "8.5 Learning to Rank (LTR)", href: "/search/ranking/ltr" },
            { title: "8.6 Using click data", href: "/search/ranking/click-data" },
            { title: "8.7 Explore-Exploit", href: "/search/ranking/explore-exploit" },
            { title: "8.8 Feedback loops", href: "/search/ranking/feedback" },
        ]
    },
    {
        title: "9. UI Layout & Result Display",
        href: "/search/ui-layout",
        items: [
            { title: "9.1 Visual hierarchy", href: "/search/ui-layout/hierarchy" },
            { title: "9.2 List vs Card vs Grid", href: "/search/ui-layout/patterns" },
            { title: "9.3 Snippet optimization", href: "/search/ui-layout/snippets" },
            { title: "9.4 Rich results", href: "/search/ui-layout/rich-results" },
            { title: "9.5 Mobile design", href: "/search/ui-layout/mobile" },
            { title: "9.6 Accessibility", href: "/search/ui-layout/accessibility" },
            { title: "9.7 Performance", href: "/search/ui-layout/performance" },
        ]
    },
    {
        title: "10. Ads in Search Results",
        href: "/search/ads-in-search",
        items: [
            { title: "10.1 Why ads matter", href: "/search/ads-in-search/importance" },
            { title: "10.2 Ad formats", href: "/search/ads-in-search/formats" },
            { title: "10.3 Sponsored vs Organic", href: "/search/ads-in-search/sponsored-organic" },
            { title: "10.4 Relevance vs Revenue", href: "/search/ads-in-search/balance" },
            { title: "10.5 User trust", href: "/search/ads-in-search/trust" },
            { title: "10.6 Ad ranking", href: "/search/ads-in-search/ranking" },
            { title: "10.7 Metrics (CTR, CPC)", href: "/search/ads-in-search/metrics" },
        ]
    },
    {
        title: "11. Personalization",
        href: "/search/personalization",
        items: [
            { title: "11.1 Why it's hard", href: "/search/personalization/challenges" },
            { title: "11.2 User profiles", href: "/search/personalization/profiles" },
            { title: "11.3 Session intent", href: "/search/personalization/session" },
            { title: "11.4 Long vs Short term", href: "/search/personalization/signals" },
            { title: "11.5 Filter bubbles", href: "/search/personalization/bubbles" },
            { title: "11.6 Architecture", href: "/search/personalization/architecture" },
            { title: "11.7 Privacy", href: "/search/personalization/privacy" },
        ]
    },
    {
        title: "12. Caching & Performance",
        href: "/search/caching",
        items: [
            { title: "12.1 Latency sources", href: "/search/caching/latency" },
            { title: "12.2 Types of caches", href: "/search/caching/types" },
            { title: "12.3 Semantic cache", href: "/search/caching/semantic" },
            { title: "12.4 Invalidation", href: "/search/caching/invalidation" },
            { title: "12.5 Tail latency (P99)", href: "/search/caching/p99" },
            { title: "12.6 Capacity planning", href: "/search/caching/capacity" },
            { title: "12.7 QPS modeling", href: "/search/caching/qps" },
            { title: "12.8 Cost vs Performance", href: "/search/caching/tradeoffs" },
        ]
    },
    {
        title: "13. System Architecture Design",
        href: "/search/architecture-design",
        items: [
            { title: "13.1 Reference architectures", href: "/search/architecture-design/reference" },
            { title: "13.2 Query path (request flow)", href: "/search/architecture-design/query-path" },
            { title: "13.3 Indexing path (data flow)", href: "/search/architecture-design/indexing-path" },
            { title: "13.4 Multi-tenant architecture", href: "/search/architecture-design/multi-tenant" },
            { title: "13.5 API design patterns", href: "/search/architecture-design/api-design" },
            { title: "13.6 High availability", href: "/search/architecture-design/high-availability" },
            { title: "13.7 Build vs Buy", href: "/search/architecture-design/build-vs-buy" },
            { title: "13.8 Cost optimization", href: "/search/architecture-design/cost" },
        ]
    },
    {
        title: "14. Distributed Architecture",
        href: "/search/infra",
        items: [
            { title: "14.1 Distributed systems", href: "/search/infra/distributed" },
            { title: "14.2 Stateless vs Stateful", href: "/search/infra/state" },
            { title: "14.3 Shards & Replicas", href: "/search/infra/sharding" },
            { title: "14.4 Fan-out / Fan-in", href: "/search/infra/fanout" },
            { title: "14.5 Failure modes", href: "/search/infra/failures" },
            { title: "14.6 Consistency", href: "/search/infra/consistency" },
            { title: "14.7 Multi-region", href: "/search/infra/multi-region" },
        ]
    },
    {
        title: "15. Evaluation & Metrics",
        href: "/search/evaluation",
        items: [
            { title: "15.1 Offline evaluation", href: "/search/evaluation/offline" },
            { title: "15.2 Online evaluation", href: "/search/evaluation/online" },
            { title: "15.3 Guardrails", href: "/search/evaluation/guardrails" },
            { title: "15.4 Why metrics lie", href: "/search/evaluation/pitfalls" },
            { title: "15.5 Debugging", href: "/search/evaluation/debugging" },
        ]
    },
    {
        title: "16. Analytics & Feedback",
        href: "/search/analytics",
        items: [
            { title: "16.1 What to log", href: "/search/analytics/logging" },
            { title: "16.2 Query analytics", href: "/search/analytics/queries" },
            { title: "16.3 Zero results", href: "/search/analytics/zero-results" },
            { title: "16.4 Reformulation", href: "/search/analytics/reformulation" },
            { title: "16.5 Error analysis", href: "/search/analytics/errors" },
            { title: "16.6 Improvement loop", href: "/search/analytics/loop" },
        ]
    },
    {
        title: "17. LLMs in Search",
        href: "/search/llms",
        items: [
            { title: "17.1 Where they help", href: "/search/llms/use-cases" },
            { title: "17.2 Rewriting", href: "/search/llms/rewriting" },
            { title: "17.3 Intent", href: "/search/llms/intent" },
            { title: "17.4 Summarization", href: "/search/llms/summarization" },
            { title: "17.5 Agents", href: "/search/llms/agents" },
            { title: "17.6 RAG vs Search", href: "/search/llms/rag" },
            { title: "17.7 Limitations", href: "/search/llms/limitations" },
        ]
    },
    {
        title: "18. Build from Scratch",
        href: "/search/build-from-scratch",
        items: [
            { title: "18.1 Inverted index", href: "/search/build-from-scratch/index" },
            { title: "18.2 Ranking", href: "/search/build-from-scratch/ranking" },
            { title: "18.3 Filters", href: "/search/build-from-scratch/filters" },
            { title: "18.4 Vector search", href: "/search/build-from-scratch/vectors" },
            { title: "18.5 LTR", href: "/search/build-from-scratch/ltr" },
            { title: "18.6 Distributed", href: "/search/build-from-scratch/distributed" },
            { title: "18.7 Productionizing", href: "/search/build-from-scratch/production" },
        ]
    },
    {
        title: "19. Case Studies",
        href: "/search/case-studies",
        items: [
            { title: "19.1 Amazon/Flipkart", href: "/search/case-studies/ecommerce" },
            { title: "19.2 Google", href: "/search/case-studies/google" },
            { title: "19.3 GitHub", href: "/search/case-studies/code" },
            { title: "19.4 Netflix/Spotify", href: "/search/case-studies/media" },
            { title: "19.5 Log Search", href: "/search/case-studies/logs" },
        ]
    },
    {
        title: "20. Failure Modes",
        href: "/search/failures",
        items: [
            { title: "20.1 Regressions", href: "/search/failures/regressions" },
            { title: "20.2 Index bloat", href: "/search/failures/bloat" },
            { title: "20.3 Latency", href: "/search/failures/latency" },
            { title: "20.4 Loops", href: "/search/failures/loops" },
            { title: "20.5 Over-ML", href: "/search/failures/over-ml" },
        ]
    },
    {
        title: "21. Org Structure",
        href: "/search/org",
        items: [
            { title: "21.1 Special teams", href: "/search/org/special" },
            { title: "21.2 Splits", href: "/search/org/splits" },
            { title: "21.3 Roadmap", href: "/search/org/roadmap" },
            { title: "21.4 Big Tech", href: "/search/org/big-tech" },
        ]
    },
    {
        title: "22. Startup Angle",
        href: "/search/startup",
        items: [
            { title: "22.1 Failing students", href: "/search/startup/students" },
            { title: "22.2 Semantic cache", href: "/search/startup/cache" },
            { title: "22.3 Study search", href: "/search/startup/study" },
            { title: "22.4 Feedback ranking", href: "/search/startup/ranking" },
            { title: "22.5 Cost efficiency", href: "/search/startup/cost" },
        ]
    },
    {
        title: "23. Engineer's Mindset",
        href: "/search/mindset",
        items: [
            { title: "23.1 Distributions", href: "/search/mindset/distributions" },
            { title: "23.2 Tradeoffs", href: "/search/mindset/tradeoffs" },
            { title: "23.3 Slicing", href: "/search/mindset/slicing" },
            { title: "23.4 Rarity", href: "/search/mindset/rarity" },
        ]
    },
    {
        title: "24. Appendix",
        href: "/search/appendix",
        items: [
            { title: "24.1 Glossary", href: "/search/appendix/glossary" },
            { title: "24.2 Reading", href: "/search/appendix/reading" },
            { title: "24.3 Papers", href: "/search/appendix/papers" },
            { title: "24.4 Interviews", href: "/search/appendix/interviews" },
        ]
    },
];
