'use client';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { useAppContext } from '@/context/AppContext';
import { ChevronDown } from 'lucide-react';
import { CiFilter } from 'react-icons/ci';

const AllProducts = () => {
    const { products } = useAppContext();
    const searchParams = useSearchParams();
    const router = useRouter();

    const getFilterArray = (key) => searchParams.getAll(key) || [];

    const [filters, setFilters] = useState({
        type: getFilterArray('type'),
        material: getFilterArray('material'),
        color: getFilterArray('color'),
        size: getFilterArray('size'),
        price: getFilterArray('price'),
    });

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    const tshirtTypes = ['PLAIN', 'OVERSIZED', 'PRINTED'];

    const materials = useMemo(() => {
        const set = new Set();
        products.forEach(p => p.material && set.add(p.material));
        return [...set];
    }, [products]);

    const colors = useMemo(() => {
        const set = new Set();
        products.forEach(p => {
            const keys = Object.keys(p.colorImageMap || {});
            keys.forEach(k => set.add(k.trimEnd().toUpperCase()));
        });
        return [...set];
    }, [products]);

    const sizes = useMemo(() => {
        const set = new Set();
        products.forEach(p => p.size?.forEach(s => set.add(s)));
        return [...set];
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

    const updateURLParams = (newFilters) => {
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([key, arr]) => {
            arr.forEach(v => params.append(key, v));
        });
        router.push(`?${params.toString()}`);
    };

    const toggleOption = (category, option) => {
        const current = filters[category] || [];
        const exists = current.includes(option);
        const updated = exists
            ? current.filter(val => val !== option)
            : [...current, option];

        const newFilters = { ...filters, [category]: updated };
        setFilters(newFilters);
        updateURLParams(newFilters);
    };

    const removeFilter = (category, option) => {
        const updated = filters[category].filter(val => val !== option);
        const newFilters = { ...filters, [category]: updated };
        setFilters(newFilters);
        updateURLParams(newFilters);
    };

    const filteredProducts = useMemo(() => {
        let result = products;

        if (filters.type.length)
            result = result.filter(p =>
                p.color?.some(c => filters.type.includes(c))
            );
        if (filters.material.length)
            result = result.filter(p => filters.material.includes(p.material));
        if (filters.color.length)
            result = result.filter(p =>
                filters.color.some(c => Object.keys(p.colorImageMap || {}).includes(c))
            );
        if (filters.size.length)
            result = result.filter(p =>
                filters.size.some(s => p.size.includes(s))
            );
        if (filters.price.length)
            result = result.filter(p => {
                const price = Number(p.offerPrice);
                return filters.price.some(r => {
                    if (r === 'under500') return price < 500;
                    if (r === '500to1000') return price >= 500 && price <= 1000;
                    if (r === 'above1000') return price > 1000;
                });
            });

        return result;
    }, [products, filters]);

    const FilterSection = () => (
        <>
            {Object.entries(allOptions).map(([key, options]) => (
                <div key={key} className="mb-4">
                    <h3 className="font-semibold capitalize mb-1">{key}</h3>
                    {options?.map((opt) => (
                        <label key={opt.value || opt} className="block text-sm mb-1 cursor-pointer">
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
                <div className="mb-6 px-4 md:px-0 md:hidden">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-800">All Products</h1>

                    </div>
                    <p className="text-sm text-gray-500 mt-1">Browse our latest collection tailored for you.</p>
                </div>

                <div className="hidden md:flex max-w-2xl mx-auto flex-wrap gap-4 border border-gray-300 p-4 rounded-md bg-white mb-6">
                    <div className="flex items-center gap-2">
                        <CiFilter className="w-6 h-6" />
                        <h2 className="text-xl tracking-wide">Filters</h2>
                    </div>
                    {Object.keys(allOptions).map((category) => (
                        <div key={category} className="relative ">
                            <button
                                onClick={() =>
                                    setActiveDropdown(activeDropdown === category ? null : category)
                                }
                                className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                <ChevronDown size={14} />
                            </button>
                            {activeDropdown === category && (
                                <div className="absolute top-10  left-0 z-30 bg-white border border-gray-300 shadow-md rounded-md w-52 p-2">
                                    {(allOptions[category] || []).map((opt) => (
                                        <label
                                            key={opt.value || opt}
                                            className="block text-sm px-2 py-1 hover:bg-gray-100 cursor-pointer  "
                                        >
                                            <input
                                                type="checkbox"
                                                checked={filters[category].includes(opt.value || opt)}
                                                onChange={() => toggleOption(category, opt.value || opt)}
                                                className="mr-2 "
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
                        values?.map((value) => (
                            <div
                                key={`${category}-${value}`}
                                className="flex items-center gap-2 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                            >
                                {value}
                                <button className="font-bold" onClick={() => removeFilter(category, value)}>×</button>
                            </div>
                        ))
                    )}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.length > 0 ? (
                        filteredProducts?.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))
                    ) : (
                        <p>No product found</p>
                    )}
                </div>
            </div>

            <div className="md:hidden fixed bottom-4 left-0 right-0 z-50 px-4">
                <button
                    onClick={() => setShowMobileFilter(true)}
                    className="w-full bg-gray-900 text-white py-3 rounded-full text-center text-lg shadow-lg"
                >
                    Filters
                </button>
            </div>

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
