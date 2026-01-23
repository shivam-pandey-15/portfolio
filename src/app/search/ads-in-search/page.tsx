export default function Page() { 
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">21. Ads in Search Results</h1>
      <p className="text-xl text-muted-foreground">
        How search engines balance user experience with monetization through advertising.
      </p>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2>Overview</h2>
        <p>
          Search advertising is a multi-billion dollar industry. Google makes 80%+ of its revenue from search ads. 
          But poorly implemented ads destroy user trust. This section explores how to balance relevance with revenue.
        </p>
        <h3>Key Topics</h3>
        <ul>
          <li>Ad formats (text, shopping, video)</li>
          <li>Sponsored vs organic results</li>
          <li>Ad ranking algorithms</li>
          <li>Metrics: CTR, CPC, Quality Score</li>
          <li>User trust and transparency</li>
        </ul>
      </div>
    </div>
  );
}
