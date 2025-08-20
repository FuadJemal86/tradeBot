import React, { useEffect, useState } from 'react'
import {
    User,
    Settings,
    LogOut,
    Package,
    Star,
    MapPin,
    Eye,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    Moon,
    Sun,
    ConeIcon
} from 'lucide-react';
import api from '../../service/api';

interface Product {
    id: number,
    name: string
    quantity: number,
    description: string,
    image1: string,
    image2: string,
    image3: string,
    image4: string,
    product_price: {
        price: string
    }[],
    trader: {
        location: string
    },
    rate: {
        rate: number
    }[]
}


function Products() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [darkMode, setDarkMode] = useState(false);
    const [product, setProducts] = useState<Product[]>([])
    const productsPerPage = 8;

    // Simulate localStorage check for dark mode (would normally be localStorage.getItem('darkMode'))
    useEffect(() => {
        const isDarkMode = localStorage.getItem('theme') === 'dark';
        setDarkMode(isDarkMode);

        // Listen for dark mode changes
        const handleDarkModeChange = (event: CustomEvent) => {
            setDarkMode(event.detail);
        };

        window.addEventListener('darkModeChange', handleDarkModeChange as EventListener);
        return () => {
            window.removeEventListener('darkModeChange', handleDarkModeChange as EventListener);
        };
    }, []);

    const fetchData = async () => {
        try {
            const result = await api.get('/trade/get-product')
            if (result.data.status) {
                const data = result.data.products
                setProducts(data)
            } else {
                console.log(result.data.message)
            }

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])



    const totalPages = Math.ceil(product.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = product.slice(startIndex, startIndex + productsPerPage);


    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={14}
                className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : `${darkMode ? 'text-gray-600' : 'text-gray-300'}`}
            />
        ));
    };



    return (
        <div>
            <div className="flex">
                {/* Main Content */}
                <div className="flex-1">
                    <div className="p-6">
                        <div className="mb-8">
                            <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                Products
                            </h2>
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                Discover amazing products from our collection
                            </p>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {product.map((product) => (
                                <div
                                    key={product.id}
                                    className={`rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 ${darkMode
                                        ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900/50'
                                        : 'bg-white border-gray-200'
                                        }`}
                                >
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={`http://localhost:4000/${product?.image1}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    <div className="p-4">
                                        <h3 className={`font-semibold mb-2 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-800'
                                            }`}>
                                            {product.name}
                                        </h3>

                                        <div className="flex items-center gap-1 mb-2">
                                            {renderStars(product.rate[0]?.rate)}
                                            <span className={`text-sm ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                ({product.rate[0]?.rate})
                                            </span>
                                        </div>

                                        <p className={`text-sm mb-3 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                            {product.description}
                                        </p>

                                        <div className={`flex items-center gap-1 mb-3 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'
                                            }`}>
                                            <MapPin size={14} />
                                            <span>{product.trader?.location}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-blue-600">
                                                ETB{product.product_price[0]?.price}
                                            </span>
                                            <button className="flex items-center rounded-full bg-green-500 text-white hover:bg-green-700 transition-colors p-1.5 text-sm font-medium">
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${darkMode
                                    ? 'text-gray-300 bg-gray-800 border-gray-600 hover:bg-gray-700'
                                    : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <ChevronLeft size={16} />
                                Previous
                            </button>

                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : darkMode
                                                ? 'text-gray-300 bg-gray-800 border border-gray-600 hover:bg-gray-700'
                                                : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${darkMode
                                    ? 'text-gray-300 bg-gray-800 border-gray-600 hover:bg-gray-700'
                                    : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                Next
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>



                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </div>
        </div>
    )
}

export default Products
