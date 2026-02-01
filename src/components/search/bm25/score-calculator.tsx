"use client";

import { useState, useEffect } from "react";
import { Calculator } from "lucide-react";

export function ScoreCalculator() {
    const [inputs, setInputs] = useState({
        tf: 1,
        docLen: 10,
        avgDocLen: 100,
        idf: 3.0,
        k1: 1.2,
        b: 0.75
    });

    const [score, setScore] = useState(0);

    useEffect(() => {
        // BM25 Formula
        const { tf, docLen, avgDocLen, idf, k1, b } = inputs;

        // Numerator: TF * (k1 + 1)
        const numerator = tf * (k1 + 1);

        // Denominator: TF + k1 * (1 - b + b * (|D| / avgdl))
        const K = k1 * (1 - b + b * (docLen / avgDocLen));
        const denominator = tf + K;

        const result = idf * (numerator / denominator);
        setScore(result);
    }, [inputs]);

    const handleChange = (key: keyof typeof inputs, value: number) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 bg-zinc-900 text-zinc-100 p-6 rounded-xl border border-zinc-800 shadow-xl">
            {/* Left: Inputs */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-primary font-bold border-b border-zinc-800 pb-2">
                    <Calculator className="w-5 h-5" />
                    BM25 Score Simulator
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-zinc-400 font-medium">Term Frequency (TF)</label>
                        <input
                            type="number"
                            value={inputs.tf}
                            onChange={(e) => handleChange("tf", Number(e.target.value))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-zinc-400 font-medium">IDF (Rareness)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={inputs.idf}
                            onChange={(e) => handleChange("idf", Number(e.target.value))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-zinc-800">
                    <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Length Normalization</div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <label className="text-zinc-400">Doc Length (Words)</label>
                            <span className={inputs.docLen > inputs.avgDocLen ? "text-red-400" : "text-green-400"}>
                                Ratio: {(inputs.docLen / inputs.avgDocLen).toFixed(2)}x
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="500"
                            value={inputs.docLen}
                            onChange={(e) => handleChange("docLen", Number(e.target.value))}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="text-right text-xs font-mono text-zinc-300">{inputs.docLen} words</div>
                    </div>

                    <div className="space-y-1 opacity-50 pointer-events-none">
                        <label className="text-xs text-zinc-400">Avg Doc Length (Global)</label>
                        <input
                            type="number"
                            value={inputs.avgDocLen}
                            readOnly
                            className="w-full bg-zinc-800/50 border border-zinc-800 rounded px-3 py-2 text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Right: Output */}
            <div className="flex flex-col justify-center items-center space-y-4 bg-zinc-950/50 rounded-lg p-6 border border-zinc-800/50">
                <div className="text-sm text-zinc-500">Calculated Score</div>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 tabular-nums">
                    {score.toFixed(4)}
                </div>

                <div className="w-full grid grid-cols-2 gap-2 text-xs text-center pt-4 opacity-75">
                    <div className="bg-zinc-800 p-2 rounded">
                        <span className="block text-zinc-500 mb-1">Impact of TF</span>
                        <span className="font-mono text-blue-400">
                            {(inputs.tf / (inputs.tf + inputs.k1 * (1 - inputs.b + inputs.b * (inputs.docLen / inputs.avgDocLen)))).toFixed(2)}
                            <span className="text-zinc-600 ml-1">/ 1.0</span>
                        </span>
                    </div>
                    <div className="bg-zinc-800 p-2 rounded">
                        <span className="block text-zinc-500 mb-1">Length Penalty</span>
                        <span className="font-mono text-amber-400">
                            {(inputs.docLen / inputs.avgDocLen).toFixed(2)}
                            <span className="text-zinc-600 ml-1">x Avg</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
