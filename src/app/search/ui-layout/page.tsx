export default function Page() { 
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">22. UI Layout & Result Display</h1>
      <p className="text-xl text-muted-foreground">
        The way you display search results matters as much as the ranking algorithm.
      </p>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2>Why Layout Matters</h2>
        <p>
          A perfectly ranked result that users can't parse is useless. Nielsen Norman Group research shows:
        </p>
        <ul>
          <li>Users scan in an F-pattern, not reading linearly</li>
          <li>The first 3 results get 75% of clicks</li>
          <li>Visual hierarchy affects perceived quality</li>
        </ul>
        <h3>Design Patterns</h3>
        <ul>
          <li><strong>List View:</strong> Information-dense, best for text-heavy results</li>
          <li><strong>Card View:</strong> Visual, great for products/media</li>
          <li><strong>Grid View:</strong> Best for images, equal-weight items</li>
        </ul>
        <h3>Mobile Considerations</h3>
        <p>Mobile accounts for 60%+ of searches. Design must accommodate:</p>
        <ul>
          <li>Smaller screens (prioritize above-the-fold)</li>
          <li>Touch targets (min 44x44px)</li>
          <li>Thumb-reachable actions</li>
        </ul>
      </div>
    </div>
  );
}
