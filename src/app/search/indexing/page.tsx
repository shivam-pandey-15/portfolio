import Link from "next/link";
import { Database, ArrowLeft } from "lucide-react";

export default function IndexingPage() {
    return (
        <div className="min-h-screen p-8 md:p-12 max-w-4xl mx-auto space-y-8">
            <Link href="/search" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search Architecture
            </Link>

            <header className="space-y-4">
                <div className="p-3 bg-secondary w-fit rounded-lg">
                    <Database className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-primary">Indexing</h1>
                <p className="text-xl text-muted-foreground">
                    The foundation of search. Ingesting raw data, tokenizing text, and building efficient inverted indices.
                </p>
            </header>

            <div className="border border-dashed border-border rounded-xl p-12 text-center bg-secondary/20">
                <p className="text-muted-foreground">Detailed architecture breakdown coming soon.</p>
            </div>
        </div>
    );
}
