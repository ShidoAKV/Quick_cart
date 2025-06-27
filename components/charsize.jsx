"use client";
import { useState } from "react";
import { Ruler } from "lucide-react";
export default function ChartSize() {
    const [isOpen, setIsOpen] = useState(false);
    const [tab, setTab] = useState("chart");

    const sizeChartData = [
        { size: "S", chestCm: "91–96", lengthCm: "66–68", shoulderCm: "42–44", sleeveCm: "20–22" },
        { size: "M", chestCm: "96–101", lengthCm: "68–70", shoulderCm: "44–46", sleeveCm: "21–23" },
        { size: "L", chestCm: "101–106", lengthCm: "70–72", shoulderCm: "46–48", sleeveCm: "22–24" },
        { size: "XL", chestCm: "106–111", lengthCm: "72–74", shoulderCm: "48–50", sleeveCm: "23–25" },
        { size: "XXL", chestCm: "111–116", lengthCm: "74–76", shoulderCm: "50–52", sleeveCm: "24–26" },
        { size: "3XL", chestCm: "116–121", lengthCm: "76–78", shoulderCm: "52–54", sleeveCm: "25–27" },
    ];

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
                <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
                    <div className="bg-white w-full max-w-md h-full shadow-xl animate-slide-in-right">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b ">
                            <h2 className="text-lg font-semibold ">
                                {tab === "chart" ? "Men’s Size Guide (India)" : "How to Measure"}
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-2xl font-bold text-gray-600 hover:text-black"
                            >
                                ×
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b text-sm">
                            <button
                                className={`cursor-pointer w-1/2 p-2 ${tab === "chart" ? "border-b-2 border-blue-600 font-semibold" : "text-gray-500"}`}
                                onClick={() => setTab("chart")}
                            >
                                Size Chart
                            </button>
                            <button
                                className={`cursor-pointer w-1/2 p-2 ${tab === "measure" ? "border-b-2 border-blue-600 font-semibold" : "text-gray-500"}`}
                                onClick={() => setTab("measure")}
                            >
                                How to Measure
                            </button>
                        </div>

                        {/* Chart View */}
                        {tab === "chart" && (
                            <div className="p-4 overflow-y-auto h-[calc(100%-140px)]">
                                <table className="w-full border text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-2 py-2">Size</th>
                                            <th className="border px-2 py-2">Chest (cm)</th>
                                            <th className="border px-2 py-2">Length (cm)</th>
                                            <th className="border px-2 py-2">Shoulder (cm)</th>
                                            <th className="border px-2 py-2">Sleeve (cm)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeChartData.map((item) => (
                                            <tr key={item.size}>
                                                <td className="border px-2 py-2">{item.size}</td>
                                                <td className="border px-2 py-2">{item.chestCm}</td>
                                                <td className="border px-2 py-2">{item.lengthCm}</td>
                                                <td className="border px-2 py-2">{item.shoulderCm}</td>
                                                <td className="border px-2 py-2">{item.sleeveCm}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* How to Measure View */}
                        {tab === "measure" && (
                            <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-140px)]">
                                <img
                                    src="/chartsize.jpeg"
                                    alt="Measurement Guide"
                                    className="w-full rounded shadow-md"
                                />
                                <div className="text-sm space-y-2">
                                    <p><strong>Chest:</strong> Measure around the fullest part of your chest while standing relaxed.</p>
                                    <p><strong>Shoulder:</strong> Measure straight across from one shoulder seam to the other.</p>
                                    <p><strong>Length:</strong> Measure from the top of the shoulder (near the neck) down to the hem.</p>
                                    <p><strong>Sleeve:</strong> Measure from the shoulder seam to the end of the sleeve.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
