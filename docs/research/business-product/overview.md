# Research: The Business & Product of Search (Chapter 1)

## Why Search Matters
- **E-commerce**: Search is the primary revenue driver (often 50-80% of GMV).
- **SaaS (Slack/Notion)**: Search is the productivity bottleneck.
- **Media (Netflix/Spotify)**: Search + Recs = Retention.

## The Cost of Bad Search
- **Zero Results**: direct churn.
- **Bad Ranking**: user frustration ("I know it's there").
- **Slow Search**: reduced interaction depth.

## Search vs Discovery vs Recs
-   **Search**: "I know what I want" (High Intent).
    -   *Input*: Query.
    -   *Goal*: Relevance.
-   **Recommendation**: "Show me what I might like" (Passive).
    -   *Input*: User History / Context.
    -   *Goal*: Engagement / Serendipity.
-   **Discovery**: Browsing categories / filters (Exploratory).

## Types of Search Systems
1.  **E-commerce**: Structured data + text. Heavy on business logic (availability, price, margin).
2.  **Document Search**: Unstructured text (Google, internal wikis). Heavy on NLP.
3.  **Code Search**: Structural understanding (ASTs + text). (GitHub).
4.  **Log Search**: High volume, time-series, exact match. (Splunk).

## The Funnel
1.  **Query**: User types "running shoes".
2.  **Recall**: System finds 10,000 matches.
3.  **Ranking**: System sorts top 100.
4.  **Presentation**: User sees top 10.
5.  **Click**: User CLICKS result #2.
6.  **Conversion**: User BUYS item.

## Metrics
-   **CTR (Click-Through Rate)**: Core relevance signal.
-   **MRR (Mean Reciprocal Rank)**: How high was the right answer?
-   **Zero Result Rate**: % of queries with 0 hits (Optimization opportunity).
-   **Latency (P50, P95, P99)**: Speed constraints.
