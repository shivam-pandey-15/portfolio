import { ExternalLink } from "lucide-react";

export default function AdSection() {
    return (
        <div className="my-12 p-6 bg-secondary/30 border border-border rounded-xl">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Sponsored</p>
                    <h3 className="text-lg font-semibold mb-2">Want to build production-grade search?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Explore tools like Elasticsearch, Algolia, or Typesense to take your search from prototype to production.
                    </p>
                    <a
                        href="https://www.elastic.co"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                        Learn More <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
        </div>
    );
}
