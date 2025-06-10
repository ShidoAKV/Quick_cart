'use client';
import { useState, useEffect, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { useAppContext } from '@/context/AppContext';
import { ChevronDown } from 'lucide-react';
import Loadingcomponent from '../loading';
const AllProducts = () => {
    const { products } = useAppContext();

    const [filteredProducts, setFilteredProducts] = useState(products);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    const [filters, setFilters] = useState({
        type: [],
        material: [],
        color: [],
        size: [],
        price: [],
    });

    const tshirtTypes = ['Plain', 'Oversized', 'Printed'];

    const materials = useMemo(() => {
        const mats = new Set();
        products.forEach((p) => p.material && mats.add(p.material));
        return [...mats];
    }, [products]);

    const colors = useMemo(() => {
        const cols = new Set();
        products.forEach((p) => {
            const colorKeys = Object.keys(p.colorImageMap || {});
            colorKeys.forEach((c) => cols.add(c));
        });
        return [...cols];
    }, [products]);

    const sizes = useMemo(() => {
        const szs = new Set();
        products.forEach((p) =>
            p.size?.forEach((s) => szs.add(s))
        );
        return [...szs];
    }, [products]);

    const prices = [
        { label: 'Under ₹500', value: 'under500' },
        { label: '₹500 - ₹1000', value: '500to1000' },
        { label: 'Above ₹1000', value: 'above1000' },
    ];

    const allOptions = {
        type: tshirtTypes,
        material: materials,
        color: colors,
        size: sizes,
        price: prices,
    };

    const toggleOption = (category, option) => {
        setFilters((prev) => {
            const exists = prev[category].includes(option);
            const updated = exists
                ? prev[category].filter((item) => item !== option)
                : [...prev[category], option];
            return { ...prev, [category]: updated };
        });
    };

    const removeFilter = (category, option) => {
        setFilters((prev) => ({
            ...prev,
            [category]: prev[category].filter((item) => item !== option),
        }));
    };

    useEffect(() => {
        let filtered = products;

        if (filters.type.length)
            filtered = filtered.filter((p) => filters.type.includes(p.name));

        if (filters.material.length)
            filtered = filtered.filter((p) => filters.material.includes(p.material));

        if (filters.color.length)
            filtered = filtered.filter((p) =>
                filters.color.some((color) => p.color.includes(color))
            );

        if (filters.size.length)
            filtered = filtered.filter((p) =>
                filters.size.some((size) => p.size.includes(size))
            );

        if (filters.price.length)
            filtered = filtered.filter((p) => {
                return filters.price.some((price) => {
                    if (price === 'under500') return p.offerPrice < 500;
                    if (price === '500to1000') return p.offerPrice >= 500 && p.price <= 1000;
                    if (price === 'above1000') return p.offerPrice > 1000;
                });
            });

        setFilteredProducts(filtered);
    }, [filters, products]);

    const FilterSection = () => (
        <>
            {Object.entries(allOptions).map(([key, options]) => (
                <div key={key} className="mb-4">
                    <h3 className="font-semibold capitalize mb-1">{key}</h3>
                    {options.map((opt) => (
                        <label
                            key={opt.value || opt}
                            className="block text-sm mb-1 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={filters[key].includes(opt.value || opt)}
                                onChange={() => toggleOption(key, opt.value || opt)}
                            />
                            {opt.label || opt}
                        </label>
                    ))}
                </div>
            ))}
        </>
    );

    return (
        <>
            <div className="px-4 md:px-10 lg:px-32 pt-8 pb-28">
                <div className="mb-8 px-4 py-3 mix-blend-color bg-gradient-to-r from-gray-700 to-gray-900 rounded-md  md:hidden shadow text-white">
                    <h2 className="text-xl font-medium tracking-wide">Explore All Products</h2>
                </div>
                <div className="my-4 lg:block hidden text-gray-900">
                    <h2 className="text-2xl font-semibold tracking-wide text-left">Filter Items</h2>
                </div>


                <div className="hidden lg:flex flex-wrap gap-4 border border-gray-300 p-4 rounded-md bg-white mb-6">
                    {Object.keys(allOptions).map((category) => (
                        <div key={category} className="relative">
                            <button
                                onClick={() =>
                                    setActiveDropdown(
                                        activeDropdown === category ? null : category
                                    )
                                }
                                className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                <ChevronDown size={14} />
                            </button>

                            {activeDropdown === category && (
                                <div className="absolute top-10 left-0 z-30 bg-white border border-gray-300 shadow-md rounded-md w-52 p-2">
                                    {(allOptions[category] || []).map((opt) => (
                                        <label
                                            key={opt.value || opt}
                                            className="block text-sm px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={filters[category].includes(opt.value || opt)}
                                                onChange={() =>
                                                    toggleOption(category, opt.value || opt)
                                                }
                                                className="mr-2"
                                            />
                                            {opt.label || opt}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Active Filters */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {Object.entries(filters).flatMap(([category, values]) =>
                        values.map((value) => (
                            <div
                                key={`${category}-${value}`}
                                className="flex items-center gap-2 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                            >
                                {value}
                                <button
                                    className="font-bold"
                                    onClick={() => removeFilter(category, value)}
                                >
                                    ×
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))
                    ) : products?.length > 0 ? (
                        products.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-600">
                            No products found.
                        </p>
                    )}
                </div>

            </div>

            <div className="lg:hidden fixed bottom-4 left-0 right-0 z-50 px-4">
                <button
                    onClick={() => setShowMobileFilter(true)}
                    className="w-full bg-gray-900 text-white py-3 rounded-full text-center text-lg shadow-lg"
                >
                    Filters
                </button>
            </div>

            {/* Mobile Filter Drawer */}
            {showMobileFilter && (
                <div className="lg:hidden fixed inset-0 z-50 bg-gray-900 bg-opacity-40 flex justify-center items-end">
                    <div className="bg-white w-full max-h-[80vh] overflow-y-auto rounded-t-2xl p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Filters</h2>
                            <button
                                onClick={() => setShowMobileFilter(false)}
                                className="text-gray-500 font-bold text-lg"
                            >
                                ×
                            </button>
                        </div>
                        <FilterSection />
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default AllProducts;
