import Link from "next/link";
import { Search, Server, Database, Activity, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen p-8 md:p-12 lg:p-24 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-border pb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Systems Atlas</h1>
          <p className="text-muted-foreground mt-1">By Shivam Pandey</p>
        </div>
        <nav>
          <a href="https://github.com/shivam-pandey-15" className="text-sm font-medium hover:text-primary transition-colors">
            GitHub
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="space-y-6 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
          Explore real-world engineering systems.
        </h2>
        <p className="text-xl text-muted-foreground leading-relaxed">
          A high-quality systems exploration site. Dive into the architecture of search, recommendation engines, and massive-scale infrastructure.
          Not a bloga guided tour through the machine.
        </p>
      </section>

      {/* Systems Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Search System Card - Active */}
        <Link href="/search" className="group block h-full">
          <div className="h-full border border-border rounded-xl p-6 hover:border-primary transition-colors duration-200 bg-card hover:shadow-sm flex flex-col">
            <div className="mb-4 p-3 bg-secondary w-fit rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              Search Systems
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                Live
              </span>
            </h3>
            <p className="text-muted-foreground flex-grow">
              Understand the pipeline from crawling to ranking. Explore inverted indices, retrieval algorithms, and serving infrastructure.
            </p>
            <div className="mt-6 flex items-center text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
              Explore World <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>

      </section>
    </div>
  );
}
