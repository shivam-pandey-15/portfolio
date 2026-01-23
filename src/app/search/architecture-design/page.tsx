export default function Page() { 
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">14. System Architecture Design</h1>
      <p className="text-xl text-muted-foreground">
        How to architect production search systems end-to-end.
      </p>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2>Beyond Individual Components</h2>
        <p>
          Previous chapters covered individual pieces: indexing, retrieval, ranking. 
          This chapter shows how to wire them together into a production system.
        </p>
        <h3>What You'll Learn</h3>
        <ul>
          <li>Reference architectures: Google, Amazon, Elasticsearch patterns</li>
          <li>Query path: API Gateway → Retrieval → Ranking → Serving</li>
          <li>Indexing path: CDC → Kafka → Indexer → Search Engine</li>
          <li>Multi-tenant architecture and resource isolation</li>
          <li>API design: REST, pagination, response schemas</li>
          <li>High availability: failover, circuit breakers, degradation</li>
          <li>Build vs Buy decision framework</li>
          <li>Cost optimization: compute, storage, caching trade-offs</li>
        </ul>
      </div>
    </div>
  );
}
