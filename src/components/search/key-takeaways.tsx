import { Sparkles } from "lucide-react";

interface Takeaway {
    title: string;
    description: string;
}

interface KeyTakeawaysProps {
    takeaways: Takeaway[];
    chapterTitle?: string;
}

export function KeyTakeaways({ takeaways, chapterTitle = "Key Takeaways" }: KeyTakeawaysProps) {
    return (
        <section className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-zinc-300 p-8 rounded-xl border border-zinc-800">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" /> {chapterTitle}
            </h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                {takeaways.map((item, i) => (
                    <div key={i} className="flex gap-4">
                        <span className="bg-indigo-500/10 p-2 rounded h-fit text-indigo-400 font-bold text-lg min-w-[3rem] text-center">
                            {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                            <h3 className="font-bold text-white mb-1">{item.title}</h3>
                            <p className="text-sm text-zinc-200 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
