# Research: Query Distributions & Power Laws

## Key Concepts
- Zipf's Law: frequency ∝ 1/rank
- Head-Torso-Tail distribution
- Engineering implications for each segment

## References
1. **The Long Tail** - Chris Anderson (2004)
   - Original article: https://www.wired.com/2004/10/tail/
   - Explains how internet economics favor niche markets

2. **Introduction to Information Retrieval** - Manning, Raghavan, Schütze
   - Chapter 5: Index compression
   - Discusses Zipf's law in context of term frequency
   - Link: https://nlp.stanford.edu/IR-book/

3. **Analysis of Query Logs** - Ricardo Baeza-Yates (2005)
   - Studies query distribution patterns
   - Implications for caching strategies

## Engineering Strategies

### The Head (20% of queries, 80% of traffic)
- Aggressive caching (Redis, CDN)
- Manual curation / merchandising
- Pre-computed results
- Example: "iphone" query on Amazon

### The Torso (30% of queries, 15% of traffic)
- Query expansion
- Synonym mapping
- Spell correction
- Standard ranking models

### The Long Tail (50% of queries, 5% of traffic)
- Vector search / embeddings
- LLM-based understanding
- Zero-result fallbacks
- No caching (hit rate ≈ 0%)

## Visualization Ideas
- Bar chart showing frequency distribution
- Interactive demo showing cache hit rates
- Real-world examples from major search engines

## Related Topics
- 9.2 Types of caches
- 6.2 Embeddings for tail queries
- 12.3 Zero result mining
