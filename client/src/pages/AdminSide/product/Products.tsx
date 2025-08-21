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
    Edit,
    Trash2,
    MoreHorizontal
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Button } from '../../../components/ui/button';
import api from '../../../service/api';

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
    const productsPerPage = 10;

    // Check for dark mode from localStorage
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

    const handleEdit = (productId: number) => {
        console.log('Edit product:', productId);
        // Add your edit logic here - you can navigate to edit page or open modal
        // Example: navigate(`/products/edit/${productId}`)
    };

    const handleDelete = async (productId: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const result = await api.delete(`/trade/delete-product/${productId}`);
                if (result.data.status) {
                    // Remove from local state after successful deletion
                    setProducts(product.filter(p => p.id !== productId));
                    console.log('Product deleted successfully');
                } else {
                    console.log('Failed to delete product:', result.data.message);
                }
            } catch (err) {
                console.log('Error deleting product:', err);
            }
        }
    };

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
        <div className={darkMode ? 'bg-gray-900 min-h-screen' : 'bg-gray-50 min-h-screen'}>
            <div className="flex">
                {/* Main Content */}
                <div className="flex-1">
                    <div className="p-6">
                        <div className="mb-8">
                            <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                Products
                            </h2>
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                Manage your products collection
                            </p>
                        </div>

                        {/* Products Table */}
                        <div className={`rounded-lg border shadow-sm ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                            <Table>
                                <TableHeader>
                                    <TableRow className={darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}>
                                        <TableHead className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>ID</TableHead>
                                        <TableHead className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Product Name</TableHead>
                                        <TableHead className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Quantity</TableHead>
                                        <TableHead className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Price</TableHead>
                                        <TableHead className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Location</TableHead>
                                        <TableHead className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Rating</TableHead>
                                        <TableHead className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</TableHead>
                                        <TableHead className={`text-right font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentProducts.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                                            >
                                                No products found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        currentProducts.map((productItem, index) => (
                                            <TableRow
                                                key={productItem.id}
                                                className={`${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                                            >
                                                <TableCell className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                    <div className="font-medium max-w-xs truncate" title={productItem.name}>
                                                        {productItem.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                                                    {productItem.quantity}
                                                </TableCell>
                                                <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                    <span className="text-blue-600 font-semibold text-lg">
                                                        ETB {productItem.product_price?.[0]?.price || 'N/A'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin size={14} className="text-gray-500" />
                                                        <span className="max-w-xs truncate" title={productItem.trader?.location}>
                                                            {productItem.trader?.location || 'N/A'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(productItem.rate?.[0]?.rate || 0)}
                                                        <span className={`text-sm ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            ({productItem.rate?.[0]?.rate || 0})
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className={`max-w-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    <div className="truncate" title={productItem.description}>
                                                        {productItem.description || 'No description'}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className={`h-8 w-8 p-0 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                                                            >
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                                                        >
                                                            <DropdownMenuItem
                                                                onClick={() => handleEdit(productItem.id)}
                                                                className={`cursor-pointer ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDelete(productItem.id)}
                                                                className="text-red-600 cursor-pointer hover:bg-red-50 focus:bg-red-50 dark:hover:bg-red-900/20"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`flex items-center gap-2 ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <ChevronLeft size={16} />
                                    Previous
                                </Button>

                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let pageNumber;
                                        if (totalPages <= 5) {
                                            pageNumber = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNumber = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNumber = totalPages - 4 + i;
                                        } else {
                                            pageNumber = currentPage - 2 + i;
                                        }

                                        return (
                                            <Button
                                                key={pageNumber}
                                                variant={currentPage === pageNumber ? "default" : "outline"}
                                                onClick={() => setCurrentPage(pageNumber)}
                                                className={`w-10 h-10 ${currentPage === pageNumber
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                    : darkMode
                                                        ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNumber}
                                            </Button>
                                        );
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center gap-2 ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        )}

                        {/* Products Count */}
                        <div className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}>
                            Showing {startIndex + 1} to {Math.min(startIndex + productsPerPage, product.length)} of {product.length} products
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