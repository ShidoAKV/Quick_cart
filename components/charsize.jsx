"use client";
import { useState } from "react";
import { Ruler } from "lucide-react";

export default function ChartSize({ sizechartdata = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [tab, setTab] = useState("chart");


    return (
        <>
            <button
                onClick={() => {
                    setIsOpen(true);
                    setTab("chart");
                }}
                className="flex font-bold cursor-pointer items-center gap-2 text-blue-600 text-sm hover:text-blue-800"
            >
                <Ruler className="w-6 h-6" />
                SIZE CHART
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/80">
                    <div className="bg-neutral-900 text-white w-full max-w-md h-full shadow-xl animate-slide-in-right overflow-hidden">

                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-700">
                            <h2 className="text-lg font-semibold">
                                {tab === "chart" ? "Men’s Size Guide (India)" : "How to Measure"}
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-2xl font-bold text-gray-400 hover:text-white"
                            >
                                ×
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-700 text-sm">
                            <button
                                className={`w-1/2 p-2 text-center ${tab === "chart"
                                        ? "border-b-2 border-blue-500 font-semibold text-white"
                                        : "text-gray-400"
                                    }`}
                                onClick={() => setTab("chart")}
                            >
                                Size Chart
                            </button>
                            <button
                                className={`w-1/2 p-2 text-center ${tab === "measure"
                                        ? "border-b-2 border-blue-500 font-semibold text-white"
                                        : "text-gray-400"
                                    }`}
                                onClick={() => setTab("measure")}
                            >
                                How to Measure
                            </button>
                        </div>

                        {/* Chart View */}
                        {tab === "chart" && (
                            <div
                                className="p-4 h-[calc(100%-140px)] overflow-y-scroll scroll-smooth transform-gpu"
                                style={{
                                    willChange: 'transform',
                                    contain: 'layout paint',
                                    WebkitOverflowScrolling: 'touch',
                                    scrollbarGutter: 'stable',
                                }}
                            >
                                {sizechartdata?.map((typeEntry, index) => (
                                    <div key={index} className="mb-6">
                                        <h3 className="text-lg font-semibold mb-4 text-center">
                                            Category: <span className="text-blue-400">{typeEntry.type}</span> T-Shirt
                                        </h3>

                                        <table className="w-full text-sm border border-gray-700">
                                            <thead className="bg-gray-800 text-gray-300">
                                                <tr>
                                                    <th className="border border-gray-700 px-2 py-2">Size</th>
                                                    <th className="border border-gray-700 px-2 py-2">Chest (inch)</th>
                                                    <th className="border border-gray-700 px-2 py-2">Length (inch)</th>
                                                    <th className="border border-gray-700 px-2 py-2">Shoulder (inch)</th>
                                                    <th className="border border-gray-700 px-2 py-2">Sleeve (inch)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(typeEntry?.sizes || {}).map(([size, values]) => (
                                                    <tr key={size} className=" bg-neutral-900">
                                                        <td className="border border-gray-700 px-2 py-2">{size}</td>
                                                        <td className="border border-gray-700 px-2 py-2">{values.chest}</td>
                                                        <td className="border border-gray-700 px-2 py-2">{values.len}</td>
                                                        <td className="border border-gray-700 px-2 py-2">{values.sh}</td>
                                                        <td className="border border-gray-700 px-2 py-2">{values.slv}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* How to Measure View */}
                        {tab === "measure" && (
                            <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-140px)]">
                                <img
                                    src="/chartsize.jpeg"
                                    alt="Measurement Guide"
                                    
                                    className="w-full rounded shadow-md brightness-75"
                                />
                                <div className="text-sm space-y-2 text-gray-300">
                                    <p><strong className="text-xl text-gray-300">Chest:</strong> Measure around the fullest part of your chest while standing relaxed.</p>
                                    <p><strong className="text-xl text-gray-300">Shoulder:</strong> Measure straight across from one shoulder seam to the other.</p>
                                    <p><strong className="text-xl text-gray-300">Length:</strong> Measure from the top of the shoulder (near the neck) down to the hem.</p>
                                    <p><strong className="text-xl text-gray-300"> Sleeve:</strong> Measure from the shoulder seam to the end of the sleeve.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </>
    );
}
