# Research: UI Layout & Search Result Presentation

## Overview
The way search results are displayed has a massive impact on:
- Click-through rate (CTR)
- User satisfaction
- Revenue (for e-commerce)
- Perception of quality

## Key Principles

### 1. Visual Hierarchy
- **Title**: Largest, bold, clickable
- **Snippet**: 2-3 lines of relevant context
- **Metadata**: URL, date, category (smaller, muted)
- **Actions**: Secondary buttons (Save, Share)

### 2. Scannability
Users don't read—they **scan**. Design for:
- F-pattern reading
- Visual anchors (thumbnails, icons)
- White space between results

### 3. Relevance Signals
Help users quickly assess relevance:
- **Highlighting** query terms in title/snippet
- **Badges**: "Top Result", "Sponsored", "New"
- **Rich snippets**: Ratings, prices, images

## Layout Patterns

### List View (Default)
```
┌─────────────────────────────────────┐
│ [Icon] **Title of Result**         │
│        Snippet text with query...  │
│        example.com · 2 hours ago   │
└─────────────────────────────────────┘
```
**Pros**: Information-dense, familiar
**Cons**: Can feel overwhelming with 100+ results

### Card View
```
┌──────────┐
│  [IMG]   │
│  Title   │
│  $99     │
└──────────┘
```
**Pros**: Visual, great for products/media
**Cons**: Less info per screen

### Grid View
- Best for: Images, products, people
- 2-4 columns
- Equal sizing

## Mobile Considerations
- **Infinite scroll** vs **Pagination**
- Larger touch targets (min 44x44 px)
- Simplify metadata on small screens
- Swipe gestures for actions

## Performance Impact
- **Above-the-fold** results must load < 1s
- Lazy load images below the fold
- Skeleton screens during loading

## A/B Testing Ideas
1. Snippet length (2 vs 3 lines)
2. Image size (thumbnail vs large preview)
3. Color of "Sponsored" badge
4. Position of filters (sidebar vs top)

## Real-World Examples

### Google
- Minimalist titles
- Blue links (trusted pattern)
- Rich snippets (FAQs, recipes, etc.)

### Amazon
- Product images dominant
- Price, rating, Prime badge
- "Sponsored" clearly labeled

### Airbnb
- Large images
- Price per night upfront
- Rating + review count

## References
- [Nielsen Norman Group: Search Results](https://www.nngroup.com/articles/search-results/)
- [Baymard Institute: E-commerce Search UX](https://baymard.com/blog)
- Google's SERP evolution over time

## Related Sections
- 7.3 Features for ranking (visual features matter!)
- 12.2 Query analytics (track which layouts perform best)
- 1.6 Success metrics (CTR depends on design)
