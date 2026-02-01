"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Info } from "lucide-react";

export function SaturationChart() {
    const [k1, setK1] = useState(1.2);

    // Generate data points
    const data = [];
    for (let tf = 0; tf <= 20; tf++) {
        const score = tf / (tf + k1);
        const linear = tf / (1 + 1); // Mock linear for comparison (k1=1 for baseline) vs no saturation? 
        // Actually just show the curve.
        data.push({
            tf,
            score: Number(score.toFixed(3)),
        });
    }

    return (
        <div className="bg-white border p-6 rounded-xl space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg">The Saturation Curve</h3>
                    <p className="text-sm text-muted-foreground">Term Frequency (TF) vs. Score Contribution</p>
                </div>
                <div className="text-right">
                    <div className="text-sm font-medium text-zinc-500 mb-1">k1 Parameter</div>
                    <div className="text-2xl font-mono font-bold text-primary">{k1.toFixed(1)}</div>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                        <XAxis
                            dataKey="tf"
                            label={{ value: "Term Occurrences (TF)", position: "insideBottom", offset: -20, style: { fill: '#6b7280', fontSize: 12 } }}
                            stroke="#9ca3af"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            domain={[0, 1.1]} // Asymptote is 1
                            label={{ value: "Score Impact", angle: -90, position: "insideLeft", style: { fill: '#6b7280', fontSize: 12 } }}
                            stroke="#9ca3af"
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                            formatter={(value: number | undefined) => [value, "Score"]}
                        />
                        <ReferenceLine y={1} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'Max Limit (1.0)', fill: '#ef4444', fontSize: 10 }} />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <div>
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 block">
                        Adjust k1 (Saturation Speed)
                    </label>
                    <input
                        type="range"
                        min="0.1"
                        max="5.0"
                        step="0.1"
                        value={k1}
                        onChange={(e) => setK1(parseFloat(e.target.value))}
                        className="w-full accent-primary h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-zinc-400 mt-1 font-mono">
                        <span>0.1 (Fast Saturation)</span>
                        <span>k1 = 1.2 (Default)</span>
                        <span>5.0 (Slow Saturation)</span>
                    </div>
                </div>

                <div className="bg-blue-50 text-blue-900 p-4 rounded-lg text-sm flex gap-3">
                    <Info className="w-5 h-5 flex-shrink-0 text-blue-600" />
                    <div>
                        <strong>What to notice:</strong> Even with huge TF (e.g., 20 spammy mentions), the score never exceeds 1.0.
                        Lower <code>k1</code> creates an L-shape (instant saturation). Higher <code>k1</code> looks more linear.
                    </div>
                </div>
            </div>
        </div>
    );
}
