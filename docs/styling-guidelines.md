# Visual & Content Guidelines for Search Engineering Guide

This document provides styling and content patterns for all blog pages in the Search Engineering Guide.

## Core Philosophy

Every section must follow this pattern:
1. **Heading** - Clear, descriptive title
2. **Explanatory Prose** - 2-4 sentences explaining the concept, why it matters, and connecting to reader's understanding
3. **Visualization** - Diagram, code block, table, or comparison that demonstrates the concept
4. **Insight/Impact** - A callout or conclusion that reinforces the key learning

---

## Content Requirements

### Explanatory Prose Between Headings and Visuals

**❌ Bad Example (what NOT to do):**
```tsx
<h2>The Multiplication Rule</h2>
<div className="bg-primary p-8">
  Final_Score = DataQuality × QueryUnderstanding × RankingModel
</div>
```

**✓ Good Example (from Chapter 3):**
```tsx
<h2>The Inversion That Changed Everything</h2>
<p className="text-foreground leading-relaxed">
  A traditional database stores documents and scans each one to find matches. An inverted index
  pre-computes the answer to "which documents contain this word?" for every word in the corpus.
  This conceptual flip—from "document → words" to "word → documents"—is what enables O(1) lookups
  across billions of documents and is the foundation of every modern search engine.
</p>
{/* Then the visualization */}
```

### Prose Guidelines

1. **Start with the "what"** - Define the concept clearly
2. **Explain the "why"** - Why does this matter? What problem does it solve?
3. **Connect to reader's context** - Reference familiar concepts or real-world scenarios
4. **Lead into the visual** - Phrase that transitions to the upcoming diagram/code

Example transitions:
- "To understand the difference, consider these two approaches:"
- "The following diagram illustrates this flow:"
- "Here's what this looks like in practice:"
- "Let's trace exactly what happens when..."

---

## Color Patterns (Light Mode Only)

Use solid light backgrounds with strong 2px borders. Do NOT add dark mode variants.

### Semantic Colors

| Purpose | Background | Border | Text |
|---------|------------|--------|------|
| **Good/Success** | `bg-green-50` | `border-green-500` | `text-green-700`, `text-green-800`, `text-green-900` |
| **Bad/Error** | `bg-red-50` | `border-red-500` | `text-red-700`, `text-red-800`, `text-red-900` |
| **Warning** | `bg-amber-50` | `border-amber-500` | `text-amber-700`, `text-amber-800`, `text-amber-900` |
| **Info/Neutral** | `bg-blue-50` | `border-blue-300` or `border-blue-500` | `text-blue-700`, `text-blue-800` |
| **Section Cards** | `bg-zinc-50` | `border-zinc-300` | `text-zinc-700` |

### Category Cards (Topic-specific sections)

```tsx
// Purple - graphs, relationships, abstract concepts
<div className="rounded-xl border-2 border-purple-500 bg-purple-50 p-6">

// Violet - text data, language
<div className="rounded-xl border-2 border-violet-500 bg-violet-50 p-6">

// Rose - behavioral data, signals, analytics
<div className="rounded-xl border-2 border-rose-500 bg-rose-50 p-6">

// Emerald - structured data, databases
<div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 p-6">

// Amber - warnings, semi-structured, flexible schemas
<div className="rounded-xl border-2 border-amber-500 bg-amber-50 p-6">

// Blue - infrastructure, systems, processes
<div className="rounded-xl border-2 border-blue-500 bg-blue-50 p-6">
```

---

## Code Block Styling

### Basic Code Block
```tsx
<div className="bg-zinc-900 rounded-xl p-6 font-mono text-sm text-zinc-100">
  <div className="text-zinc-500">// Comment explaining the code</div>
  <pre>{`actual code here`}</pre>
</div>
```

### Syntax Highlighting with Inline Spans
Use span elements for colored syntax within code:

```tsx
<div className="font-mono text-sm text-zinc-300 mt-2">
  "wireless keyboard" → tokens: [<span className="text-green-400">"wireless"</span>, <span className="text-green-400">"keyboard"</span>]
</div>
```

### Color Reference for Code
| Element | Color Class | Example |
|---------|-------------|---------|
| Success/Match values | `text-green-400` | matched doc IDs, correct values |
| Keywords/Identifiers | `text-amber-400` | query terms, field names |
| Comments/Keywords | `text-zinc-500` | `// comment`, `def`, `for`, `in` |
| Regular text | `text-zinc-100` or `text-zinc-300` | normal code |
| Errors/Bad values | `text-red-400` | errors, deprecated |
| Types/Secondary | `text-blue-400` | types, URLs |

### Nested Code Blocks (Inside Dark Sections)
```tsx
<div className="bg-zinc-900 rounded-xl p-6">
  {/* Content */}
  <div className="font-mono text-sm mt-2 bg-zinc-800 p-3 rounded">
    <div className="text-zinc-500">// Find documents in BOTH lists</div>
    <div className="text-zinc-100">Result: [<span className="text-green-400 font-bold">45, 567, 890</span>]</div>
  </div>
</div>
```

### Python/Code Indentation
```tsx
<div className="font-mono text-xs bg-zinc-800 p-3 rounded text-zinc-300">
  <div><span className="text-zinc-500">def</span> bm25(doc, terms):</div>
  <div className="pl-4">score = 0</div>
  <div className="pl-4"><span className="text-zinc-500">for</span> term <span className="text-zinc-500">in</span> terms:</div>
  <div className="pl-8">tf = term_frequency(term, doc)</div>
  <div className="pl-8">idf = inverse_doc_frequency(term)</div>
  <div className="pl-4"><span className="text-zinc-500">return</span> score</div>
</div>
```

### Inline Code Highlight (Within Colored Sections)
```tsx
<code className="bg-red-100 px-1 rounded">variable_name</code>
<code className="bg-amber-100 px-1 rounded">field_name</code>
<code className="bg-muted px-2 py-0.5 rounded text-foreground">neutral_code</code>
```

---

## Component Patterns

### Page Header
```tsx
<div className="space-y-6">
  <p className="text-sm text-muted-foreground uppercase tracking-wide">Chapter X.Y: Section Name</p>
  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Page Title</h1>
  <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
    Subtitle description that sets context and scope for this section.
  </p>
</div>
<hr className="border-border" />
```

### Section with Prose
```tsx
<section className="space-y-8">
  <h2 className="text-3xl font-bold">Section Title</h2>
  <p className="text-foreground leading-relaxed">
    Explanatory paragraph that introduces the concept, explains why it matters,
    and prepares the reader for the visualization that follows. This should be
    2-4 sentences that add context, not just repeat what the heading says.
  </p>
  {/* Visualization here */}
</section>
```

### Comparison Diagrams (Good vs Bad)
```tsx
<div className="grid md:grid-cols-2 gap-8">
  {/* Bad */}
  <div className="rounded-xl border-2 border-red-500 bg-red-50 p-6">
    <div className="flex items-center gap-2 text-red-700 font-bold mb-4">
      <Icon className="w-5 h-5" />
      Forward Index (Database)
    </div>
    <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm">
      {/* Code/diagram content */}
    </div>
    <div className="mt-4 text-sm text-red-800 border-t border-red-200 pt-3">
      Explanation of why this is slow/bad
      <div className="font-bold text-red-900 mt-1">O(N) - Linear scan</div>
    </div>
  </div>

  {/* Good */}
  <div className="rounded-xl border-2 border-green-500 bg-green-50 p-6">
    <div className="flex items-center gap-2 text-green-700 font-bold mb-4">
      <Icon className="w-5 h-5" />
      Inverted Index (Search Engine)
    </div>
    <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm">
      {/* Code/diagram content */}
    </div>
    <div className="mt-4 text-sm text-green-800 border-t border-green-200 pt-3">
      Explanation of why this is fast/good
      <div className="font-bold text-green-900 mt-1">O(1) - Instant lookup</div>
    </div>
  </div>
</div>
```

### Step-by-Step Process
```tsx
<div className="bg-zinc-900 rounded-xl p-6 space-y-6">
  <div className="flex gap-4">
    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">1</div>
    <div>
      <h4 className="font-bold text-zinc-100">Step Title</h4>
      <p className="text-sm text-zinc-400 mt-1">Explanation of what happens</p>
      <div className="font-mono text-sm text-zinc-300 mt-2">
        Technical details with <span className="text-green-400">highlighted</span> values
      </div>
    </div>
  </div>
</div>
```

### ASCII Architecture Diagrams
```tsx
<div className="bg-zinc-900 rounded-xl p-6 font-mono text-xs text-zinc-100 overflow-x-auto">
  <pre>{`┌─────────────────┐
│   Component A   │ ── Arrow ──┐
└─────────────────┘            │
                               ▼
                          ┌─────────┐
                          │  Link   │
                          └────┬────┘`}</pre>
</div>
```

### Tables
```tsx
<div className="overflow-x-auto rounded-xl border-2 border-border">
  <table className="w-full text-sm">
    <thead>
      <tr className="bg-muted">
        <th className="text-left px-4 py-3 font-bold text-foreground">Header</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-border bg-white">
      <tr>
        <td className="px-4 py-2 text-foreground">Normal</td>
        <td className="px-4 py-2 text-green-700 font-bold">Good</td>
        <td className="px-4 py-2 text-red-700 font-bold">Bad</td>
      </tr>
      <tr className="bg-green-50">
        <td className="px-4 py-2 text-green-800 font-bold">Best option</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Key Takeaways (Always at end, always green)
```tsx
<section className="bg-green-100 border-2 border-green-500 p-6 rounded-xl">
  <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-800">
    <CheckCircle2 className="w-5 h-5" /> Key Takeaways
  </h2>
  <ul className="space-y-2 text-sm text-green-900">
    <li className="flex items-start gap-2">
      <Zap className="w-4 h-4 shrink-0 mt-0.5" />
      <span>Concise, actionable point</span>
    </li>
  </ul>
</section>
```

### Navigation
```tsx
<div className="flex justify-between pt-8 border-t border-border">
  <Link href="/previous" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
    <ArrowLeft className="w-4 h-4" /> Previous Section
  </Link>
  <Link href="/next" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
    Next: Section Name <ArrowRight className="w-4 h-4" />
  </Link>
</div>
```

---

## Rules Summary

1. **No dark mode variants** - Keep styling simple with light mode only
2. **Use 2px borders** - `border-2` for cards and boxes
3. **Consistent rounded corners** - `rounded-xl` for containers, `rounded-lg` for nested
4. **Dark code backgrounds** - `bg-zinc-900 text-zinc-100`
5. **Color hierarchy** - Headers are darker (900), content is medium (700-800)
6. **Full content** - Include ALL content from research docs, don't summarize
7. **Explanatory prose** - Every heading must have 2-4 sentences BEFORE visualizations
8. **Lead-in phrases** - Transition smoothly from prose to visuals
9. **Verify calculations** - Double-check all math in examples
10. **Syntax highlighting** - Use inline spans with appropriate colors for code
