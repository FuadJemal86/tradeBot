import React, { useState, useEffect } from 'react';
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

const Products = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [darkMode, setDarkMode] = useState(false);
    const productsPerPage = 8;

    // Simulate localStorage check for dark mode (would normally be localStorage.getItem('darkMode'))
    useEffect(() => {
        const darkMode = localStorage.getItem('theme') === 'dark';
        setDarkMode(darkMode);
    }, []);

    // Sample product data
    const products = [
        {
            id: 1,
            name: "Premium Wireless Headphones",
            price: 199.99,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
            description: "High-quality wireless headphones with noise cancellation",
            location: "New York, NY"
        },
        {
            id: 2,
            name: "Smart Watch Series X",
            price: 299.99,
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
            description: "Advanced fitness tracking and smart notifications",
            location: "Los Angeles, CA"
        },
        {
            id: 3,
            name: "Professional Camera Lens",
            price: 899.99,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop",
            description: "50mm f/1.4 prime lens for professional photography",
            location: "Chicago, IL"
        },
        {
            id: 4,
            name: "Gaming Mechanical Keyboard",
            price: 149.99,
            rating: 4.6,
            image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop",
            description: "RGB backlit mechanical keyboard for gaming",
            location: "Austin, TX"
        },
        {
            id: 5,
            name: "Wireless Charging Pad",
            price: 49.99,
            rating: 4.4,
            image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=300&h=300&fit=crop",
            description: "Fast wireless charging for all compatible devices",
            location: "Seattle, WA"
        },
        {
            id: 6,
            name: "Bluetooth Speaker",
            price: 79.99,
            rating: 4.5,
            image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
            description: "Portable waterproof speaker with amazing sound",
            location: "Miami, FL"
        },
        {
            id: 7,
            name: "Smartphone Stand",
            price: 24.99,
            rating: 4.3,
            image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=300&h=300&fit=crop",
            description: "Adjustable phone stand for desk and bedside",
            location: "Denver, CO"
        },
        {
            id: 8,
            name: "USB-C Hub",
            price: 89.99,
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=300&h=300&fit=crop",
            description: "Multi-port USB-C hub with HDMI and charging",
            location: "Boston, MA"
        },
        {
            id: 9,
            name: "Wireless Mouse",
            price: 39.99,
            rating: 4.2,
            image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
            description: "Ergonomic wireless mouse with precision tracking",
            location: "Portland, OR"
        },
        {
            id: 10,
            name: "Monitor Stand",
            price: 119.99,
            rating: 4.6,
            image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=300&fit=crop",
            description: "Adjustable monitor stand with storage drawer",
            location: "Phoenix, AZ"
        }
    ];

    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        // In a real environment: localStorage.setItem('darkMode', newDarkMode);
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={14}
                className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : `${darkMode ? 'text-gray-600' : 'text-gray-300'}`}
            />
        ));
    };

    const sidebarItems = [
        { icon: Package, label: "Products", active: true },
        { icon: User, label: "Your Profile" },
        { icon: ConeIcon, label: "Sale Product" },
        { icon: Settings, label: "Settings" },
        { icon: LogOut, label: "Sign Out" }
    ];

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <header className={`shadow-sm border-b sticky top-0 z-40 transition-colors duration-300 ${darkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
                }`}>
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={`lg:hidden p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                }`}
                        >
                            <Menu size={20} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                        </button>
                        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            TradeBot
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                                }`}
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-900' : 'bg-blue-100'
                            }`}>
                            <User size={20} className="text-blue-600" />
                        </div>
                    </div>
                </div>
            </header>

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
                            {currentProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className={`rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 ${darkMode
                                        ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900/50'
                                        : 'bg-white border-gray-200'
                                        }`}
                                >
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={product.image}
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
                                            {renderStars(product.rating)}
                                            <span className={`text-sm ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                ({product.rating})
                                            </span>
                                        </div>

                                        <p className={`text-sm mb-3 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                            {product.description}
                                        </p>

                                        <div className={`flex items-center gap-1 mb-3 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'
                                            }`}>
                                            <MapPin size={14} />
                                            <span>{product.location}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-blue-600">
                                                ETB{product.price}
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

                {/* Right Sidebar - Simple Design */}
                <div className={`
                    fixed lg:static top-0 bottom-0 right-0 z-30 w-96 transform transition-transform duration-300 ease-in-out overflow-y-auto
                    ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                    `}>
                    <div className={`p-4 min-h-full ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        {/* Sidebar Card */}
                        <div className={`rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                            }`}>

                            {/* Header */}
                            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-100' : 'bg-blue-100'
                                            }`}>
                                            <User size={20} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                John Doe
                                            </h3>
                                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Premium User
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSidebarOpen(false)}
                                        className={`lg:hidden p-1.5 rounded hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        <X size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                                    </button>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="p-3">
                                <nav className="space-y-1">
                                    {sidebarItems.map((item, index) => (
                                        <button
                                            key={index}
                                            className={` w-full flex items-center gap-3 px-3 py-2 text-left text-sm rounded-md transition-colors
                                                    ${item.active
                                                    ? darkMode
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                                    : darkMode
                                                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                }
                                       `}
                                        >
                                            <item.icon size={18} />
                                            <span className="font-medium">{item.label}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Footer */}
                            <div className={`p-4 border-t text-center ${darkMode ? 'border-gray-700' : 'border-gray-200'
                                }`}>
                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    ShopHub v2.1.0
                                </p>
                            </div>
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
    );
};

export default Products;