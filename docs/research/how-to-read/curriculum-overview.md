# Research: What This Guide Covers (Curriculum Map)

## The Learning Journey: 24 Chapters from First Principles to Production

This guide takes you through the complete lifecycle of building, deploying, and operating search systems. Here's what you'll learn in each section:

---

## Part I: Foundations (Chapters 0-3)

### Chapter 0: How to Read This
*Where you are now.*
- Who this guide is for
- What problems it solves
- What "good search" actually means
- Search as a business lever
- How production differs from academic/LeetCode

### Chapter 1: The Business & Product of Search
*Why search matters to the business.*
- Search as the heart of modern products (Amazon, Google, Netflix)
- What happens when search fails: revenue, retention, trust
- Search vs Discovery vs Recommendation (they're different!)
- Types of search systems: e-commerce, document, code, log, media
- The search funnel: Query → Results → Click → Conversion
- Defining and measuring success: CTR, CVR, Zero Result Rate

### Chapter 2: Understanding the User Query
*The query is where it all begins.*
- What a query really is (intent compressed into tokens)
- Types of queries: navigational, informational, transactional, exploratory
- Intent vs tokens: "running shoes" means different things to different people
- Power laws & Zipf's law: why 20% of queries drive 80% of traffic
- The query understanding pipeline: normalization, tokenization, spell correction, synonyms, NER
- Query rewriting and expansion strategies
- Handling ambiguous queries ("apple" → fruit or company?)

### Chapter 3: Data - The Foundation
*Your search is only as good as your data.*
- Why search quality is primarily a data problem
- Types of data: catalog, behavioral, contextual
- Document modeling: flat vs hierarchical, attributes, facets
- Text fields vs structured fields: when to use each
- Data cleaning and normalization challenges
- Freshness: batch vs streaming updates
- Deletes, partial updates, and the reindexing problem

---

## Part II: The Search Pipeline (Chapters 4-7)

### Chapter 4: Ingestion & Indexing
*How data becomes searchable.*
- What an index actually is (and isn't)
- Inverted index from first principles: terms → documents
- Forward index: documents → terms
- Column stores for filtering and faceting
- Indexing structured + unstructured data together
- Sharding strategies: by document, by term, by tenant
- Replication for availability and throughput
- Near real-time (NRT) indexing
- Reindexing at scale without downtime

### Chapter 5: Retrieval
*Finding candidates fast.*
- Why retrieval is about RECALL, not precision
- Boolean retrieval: AND, OR, NOT
- TF-IDF and BM25: the classics that still work
- Filters, facets, and constraints
- Query execution plans: how the engine decides what to do
- Early termination and WAND algorithm: don't score everything
- Caching at the retrieval layer
- Approximate retrieval: HNSW, IVF, PQ
- Hybrid retrieval: combining keyword and vector

### Chapter 6: Vector & Semantic Search
*When keywords aren't enough.*
- Why keyword search fails: vocabulary mismatch problem
- Embeddings 101: representing text as vectors
- Bi-encoder vs Cross-encoder: speed vs accuracy trade-off
- Vector indexing basics: nearest neighbor search
- HNSW deep dive: the algorithm that powers modern vector search
- Latency vs recall trade-offs: the accuracy dial
- Hybrid ranking: combining BM25 with vectors
- When semantic search fails (and it does!)
- Cost of vector search at scale

### Chapter 7: Training Embedding Models ⭐ NEW
*Building domain-specific embeddings.*
- Why generic embeddings aren't good enough
- Training data: mining click pairs, hard negatives
- Contrastive learning: triplet loss, InfoNCE
- Fine-tuning pre-trained models (BERT, E5, GTE)
- Evaluation: Recall@K, MRR, embedding visualization
- Production: quantization, distillation, ONNX export

---

## Part III: Ranking & Presentation (Chapters 8-10)

### Chapter 8: Ranking
*Where the real battle is won.*
- Why ranking is everything: retrieval finds, ranking sorts
- Multi-stage architecture: retrieval → light ranker → heavy ranker
- Features for ranking: text relevance, popularity, freshness, personalization, business signals
- Rule-based ranking: simple but effective
- Learning to Rank (LTR): pointwise, pairwise, listwise
- Using click data safely: avoiding the feedback loop trap
- Exploration vs exploitation: showing new items
- Fighting feedback loops: the rich-get-richer problem

### Chapter 9: UI Layout & Result Display
*How you show results matters as much as what you show.*
- Visual hierarchy: what users see first
- Layout patterns: list vs card vs grid
- Snippet optimization: what text to show
- Rich results: images, ratings, prices
- Mobile design considerations
- Accessibility in search
- Performance: above-the-fold optimization

### Chapter 10: Ads in Search Results
*Monetization without destroying trust.*
- Why ads matter (80%+ of Google's revenue)
- Ad formats: text, shopping, video
- Sponsored vs organic: the transparency problem
- Balancing relevance vs revenue
- User trust and ad disclosure
- Ad ranking algorithms
- Metrics: CTR, CPC, Quality Score

---

## Part IV: Personalization & Performance (Chapters 11-12)

### Chapter 11: Personalization
*Tailoring results to the user.*
- Why personalization is hard
- User profiles: what to store, how to update
- Session-based intent: short-term signals
- Long-term vs short-term preferences
- Filter bubbles: the ethical dimension
- Architecture for personalized ranking
- Privacy and data boundaries

### Chapter 12: Caching & Performance
*Making it fast.*
- Where latency really comes from
- Types of caches: query result, filter, embedding, feature
- Semantic caching: a novel approach
- Cache invalidation: the hard problem
- Tail latency (P99): why averages lie
- Capacity planning for search
- QPS modeling: preparing for peak load
- Cost vs performance trade-offs

---

## Part V: Infrastructure (Chapters 13-14)

### Chapter 13: System Architecture Design ⭐ NEW
*Designing the complete system.*
- Reference architectures: Google, Amazon, Elastic patterns
- The query path: API Gateway → Retrieval → Ranking → Serving
- The indexing path: CDC → Kafka → Indexer → Search Engine
- Multi-tenant architecture
- API design patterns for search
- High availability: failover, circuit breakers, graceful degradation
- Build vs Buy decision framework
- Cost optimization strategies

### Chapter 14: Distributed Architecture
*Scaling search across machines.*
- Search as a distributed system
- Stateless vs stateful services
- Shards, replicas, and coordinators
- Fan-out and fan-in patterns
- Failure modes: what breaks and how
- Consistency models in search
- Multi-region search

---

## Part VI: Operations & Improvement (Chapters 15-17)

### Chapter 15: Evaluation & Metrics
*Measuring search quality.*
- Offline evaluation: Precision, Recall, NDCG, MRR
- Online evaluation: A/B testing, interleaving
- Guardrail metrics: what not to break
- Why metrics lie (Goodhart's law in action)
- Debugging relevance issues

### Chapter 16: Analytics & Feedback
*Learning from users.*
- What to log (and what not to)
- Query analytics: understanding your users
- Zero result mining: finding gaps
- Reformulation analysis: what are users trying to say?
- Ranking error analysis
- Building a continuous improvement loop

### Chapter 17: LLMs in Search
*Where AI fits (and where it doesn't).*
- Where LLMs actually help: query rewriting, intent classification
- Result summarization and extraction
- Tool-using agents for search
- RAG vs traditional search: they're complementary
- Why LLMs cannot replace search engines

---

## Part VII: Hands-On & Case Studies (Chapters 18-20)

### Chapter 18: Build from Scratch
*Code your own search engine.*
- Minimal inverted index in Python
- Basic BM25 ranking
- Adding filters and facets
- Adding vector search
- Adding learning to rank
- Making it distributed
- Production hardening

### Chapter 19: Case Studies
*How the best do it.*
- Amazon/Flipkart: e-commerce search at scale
- Google: web search architecture (conceptual)
- GitHub: code search challenges
- Netflix/Spotify: discovery-focused search
- Splunk/Elastic: log search

### Chapter 20: Failure Modes
*What breaks and why.*
- Relevance regressions
- Index bloat
- Latency explosions
- Feedback loop collapse
- Over-ML-ing the system

---

## Part VIII: Meta & Career (Chapters 21-24)

### Chapter 21: Org Structure
*How search teams work.*
- Why search teams are special
- Data, Infra, Relevance, Product splits
- Roadmap planning for search
- How big companies organize search

### Chapter 22: Startup Angle
*Your personal perspective.*
- Why existing systems fail students
- The semantic cache idea
- Personalized study search
- Feedback-driven ranking
- Cost-efficient architecture

### Chapter 23: Engineer's Mindset
*How to think about search.*
- Thinking in distributions, not examples
- Thinking in trade-offs
- Debugging by slicing
- Why great search engineers are rare

### Chapter 24: Appendix
*Reference materials.*
- Glossary of search terms
- Further reading list
- Papers to know
- System design interview mapping

---

## How to Use This Guide

### The Linear Path (Recommended for Beginners)
Read chapters 0-8 in order. This gives you the complete mental model from query to ranked results.

### The Practical Path (For Builders)
1. Read Chapters 0-1 (context)
2. Jump to Chapter 18 (Build from Scratch)
3. Return to Chapters 4-8 as you implement each component

### The Systems Path (For Infra Engineers)
Focus on: Chapters 4, 5, 12, 13, 14, 18

### The ML Path (For ML Engineers)
Focus on: Chapters 6, 7, 8, 11, 17

### The Interview Path (For Job Seekers)
Read: Chapters 1, 5, 8, 13, 14, 24.4 (Interview Mapping)
