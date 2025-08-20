import React, { useState, useEffect } from 'react';
import api from '../../service/api';
import { Alert, Snackbar, CircularProgress } from "@mui/material";


interface ProductFormData {
    name: string;
    description: string;
    category_id: string;
    trader_id: string;
    price: string;
    quantity: string;
    image1: File | null;
    image2: File | null;
    image3: File | null;
    image4: File | null;
}

const steps = ['Product Information', 'Images & Pricing'];

const categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
    { id: 3, name: 'Home & Garden' },
    { id: 4, name: 'Sports' },
    { id: 5, name: 'Books' },
];

const traders = [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Jane Doe' },
    { id: 3, name: 'Mike Johnson' },
    { id: 4, name: 'Sarah Wilson' },
];

const Spinner = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};

export default function ProductForm() {
    // For Claude artifacts - simulate localStorage check
    // In your actual implementation, use: localStorage.getItem('theme') === 'dark'
    const [isDark, setIsDark] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        category_id: '',
        trader_id: '',
        price: '',
        quantity: '',
        image1: null,
        image2: null,
        image3: null,
        image4: null,
    });
    const [errors, setErrors] = useState<Partial<ProductFormData>>({});
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [isLoading, setLoading] = useState(false)

    // In your actual app, uncomment this to check localStorage on mount:
    // In ProductForm component
    useEffect(() => {
        const isDarkMode = localStorage.getItem('theme') === 'dark';
        setIsDark(isDarkMode);

        // Listen for dark mode changes
        const handleDarkModeChange = (event: CustomEvent) => {
            setIsDark(event.detail);
        };

        window.addEventListener('darkModeChange', handleDarkModeChange as EventListener);
        return () => {
            window.removeEventListener('darkModeChange', handleDarkModeChange as EventListener);
        };
    }, []);

    const handleInputChange = (field: keyof ProductFormData) => (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleFileChange = (field: 'image1' | 'image2' | 'image3' | 'image4') =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                setFormData(prev => ({
                    ...prev,
                    [field]: file
                }));

                // Create preview URL for images
                if (file.type.startsWith("image/")) {
                    const url = URL.createObjectURL(file);
                    setFormData(prev => ({
                        ...prev,
                        url  // store preview separately
                    }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        [`${field}Preview`]: null
                    }));
                }
            }
        };


    const removeImage = (field: 'image1' | 'image2' | 'image3' | 'image4') => {
        setFormData(prev => ({
            ...prev,
            [field]: null
        }));
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Partial<ProductFormData> = {};

        if (step === 0) {
            if (!formData.name.trim()) newErrors.name = 'Product name is required';
            if (!formData.description.trim()) newErrors.description = 'Description is required';
            if (!formData.category_id) newErrors.category_id = 'Category is required';
            if (!formData.trader_id) newErrors.trader_id = 'Trader is required';
        }

        if (step === 1) {
            if (!formData.price || parseFloat(formData.price) <= 0) {
                newErrors.price = 'Valid price is required';
            }
            if (!formData.quantity || parseInt(formData.quantity) < 0) {
                newErrors.quantity = 'Valid quantity is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep(prevStep => prevStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(prevStep => prevStep - 1);
    };

    const handleSubmit = async () => {
        setLoading(true)
        try {
            if (validateStep(1)) {
                // Create FormData object for file uploads
                const formDataToSend = new FormData();

                // Add text fields
                formDataToSend.append('name', formData.name);
                formDataToSend.append('description', formData.description);
                formDataToSend.append('category_id', formData.category_id);
                formDataToSend.append('trader_id', formData.trader_id);
                formDataToSend.append('price', formData.price);
                formDataToSend.append('quantity', formData.quantity);

                // Add image files (only if they exist)
                if (formData.image1) formDataToSend.append('image1', formData.image1);
                if (formData.image2) formDataToSend.append('image2', formData.image2);
                if (formData.image3) formDataToSend.append('image3', formData.image3);

                if (formData.image4) formDataToSend.append('image4', formData.image4);
                const response = await api.post('/trade/post-product', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.data.status) {
                    setAlert({ type: "success", message: response.data.message });
                    setSubmitSuccess(true);
                    setFormData({
                        name: '',
                        description: '',
                        category_id: '',
                        trader_id: '',
                        price: '',
                        quantity: '',
                        image1: null,
                        image2: null,
                        image3: null,
                        image4: null,
                    });
                    setTimeout(() => {
                        setActiveStep(0);
                        setSubmitSuccess(false);
                    }, 3000);
                }
            }
        } catch (err) {
            console.log('Error submitting form:', err);
            // You might want to show an error message to the user here
        } finally {
            setLoading(false)
        }
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <div className="space-y-6">

                        {/* Product Name */}
                        <div className="relative">
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange('name')}
                                className={`
                                w-full px-4 pt-6 pb-2 text-base border rounded-lg transition-all duration-200
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}
                                ${errors.name ? 'border-red-500 ring-red-500' : ''}
                                `}
                                placeholder=" "
                            />
                            <label
                                htmlFor="name"
                                className={`
                                absolute left-4 transition-all duration-200 pointer-events-none
                                ${formData.name || document.activeElement?.id === 'name'
                                        ? 'top-2 text-xs font-medium text-blue-600'
                                        : 'top-4 text-base text-gray-500'
                                    }
                                    ${isDark ? 'text-gray-400' : ''}
                                    `}
                            >
                                Product Name *
                            </label>
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1 ml-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="relative">
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={handleInputChange('description')}
                                className={`
                  w-full px-4 pt-6 pb-2 text-base border rounded-lg transition-all duration-200 resize-none
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}
                  ${errors.description ? 'border-red-500 ring-red-500' : ''}
                `}
                                rows={4}
                                placeholder=" "
                            />
                            <label
                                htmlFor="description"
                                className={`
                  absolute left-4 transition-all duration-200 pointer-events-none
                  ${formData.description || document.activeElement?.id === 'description'
                                        ? 'top-2 text-xs font-medium text-blue-600'
                                        : 'top-4 text-base text-gray-500'
                                    }
                  ${isDark ? 'text-gray-400' : ''}
                `}
                            >
                                Description *
                            </label>
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1 ml-1">{errors.description}</p>
                            )}
                        </div>

                        {/* Category and Trader */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div className="relative">
                                <select
                                    id="category"
                                    value={formData.category_id}
                                    onChange={handleInputChange('category_id')}
                                    className={`
                                        w-full px-4 pt-6 pb-2 text-base border rounded-lg transition-all duration-200
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                        ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}
                                        ${errors.category_id ? 'border-red-500 ring-red-500' : ''}
                                    `}
                                >
                                    <option value=""></option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <label
                                    className={`
                                        absolute left-4 top-2 text-xs font-medium transition-all duration-200 pointer-events-none
                                        ${formData.category_id ? 'text-blue-600' : isDark ? 'text-gray-400' : 'text-gray-500'}
                                    `}
                                >
                                    Category *
                                </label>
                                {errors.category_id && (
                                    <p className="text-red-500 text-sm mt-1 ml-1">{errors.category_id}</p>
                                )}
                            </div>

                            {/* Trader */}
                            <div className="relative">
                                <select
                                    id="trader"
                                    value={formData.trader_id}
                                    onChange={handleInputChange('trader_id')}
                                    className={` w-full px-4 pt-6 pb-2 text-base border rounded-lg transition-all duration-200
                                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                                ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}
                                                ${errors.trader_id ? 'border-red-500 ring-red-500' : ''}
                                            `}
                                >
                                    <option value=""></option>
                                    {traders.map((trader) => (
                                        <option key={trader.id} value={trader.id}>
                                            {trader.name}
                                        </option>
                                    ))}
                                </select>
                                <label
                                    className={`absolute left-4 top-2 text-xs font-medium transition-all duration-200 pointer-events-none
                                                ${formData.trader_id ? 'text-blue-600' : isDark ? 'text-gray-400' : 'text-gray-500'}
                                            `}
                                >
                                    Trader *
                                </label>
                                {errors.trader_id && (
                                    <p className="text-red-500 text-sm mt-1 ml-1">{errors.trader_id}</p>
                                )}
                            </div>
                        </div>
                    </div >
                );

            case 1:
                return (
                    <div className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Price */}
                            <div className="relative">
                                <div className="relative">
                                    <span className={`absolute left-4 top-4 text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>$</span>
                                    <input
                                        type="number"
                                        id="price"
                                        value={formData.price}
                                        onChange={handleInputChange('price')}
                                        className={`w-full pl-8 pr-4 pt-6 pb-2 text-base border rounded-lg transition-all duration-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}
                            ${errors.price ? 'border-red-500 ring-red-500' : ''}
                            `}
                                        placeholder=" "
                                        min="0"
                                        step="0.01"
                                    />
                                    <label
                                        htmlFor="price"
                                        className={`absolute left-8 transition-all duration-200 pointer-events-none
                                                    ${formData.price || document.activeElement?.id === 'price'
                                                ? 'top-2 text-xs font-medium text-blue-600'
                                                : 'top-4 text-base text-gray-500'
                                            }
                                            ${isDark ? 'text-gray-400' : ''}
                                            `}
                                    >
                                        Price *
                                    </label>
                                </div>
                                {errors.price && (
                                    <p className="text-red-500 text-sm mt-1 ml-1">{errors.price}</p>
                                )}
                            </div>

                            {/* Quantity */}
                            <div className="relative">
                                <input
                                    type="number"
                                    id="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange('quantity')}
                                    className={`w-full px-4 pt-6 pb-2 text-base border rounded-lg transition-all duration-200
                                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                                ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}
                                                ${errors.quantity ? 'border-red-500 ring-red-500' : ''}
                                            `}
                                    placeholder=" "
                                    min="0"
                                />
                                <label
                                    htmlFor="quantity"
                                    className={`absolute left-4 transition-all duration-200 pointer-events-none
                    ${formData.quantity || document.activeElement?.id === 'quantity'
                                            ? 'top-2 text-xs font-medium text-blue-600'
                                            : 'top-4 text-base text-gray-500'
                                        }
                    ${isDark ? 'text-gray-400' : ''}
                  `}
                                >
                                    Quantity *
                                </label>
                                {errors.quantity && (
                                    <p className="text-red-500 text-sm mt-1 ml-1">{errors.quantity}</p>
                                )}
                            </div>
                        </div>

                        {/* Images */}
                        <div>
                            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Product Images (Optional)
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {(['image1', 'image2', 'image3', 'image4'] as const).map((imageField, index) => (
                                    <div
                                        key={imageField}
                                        className={`aspect-square border-2 border-dashed rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md
                                                    ${isDark ? 'border-gray-600 hover:border-blue-400' : 'border-gray-300 hover:border-blue-400'}
                                                    `}
                                    >
                                        {formData[imageField] ? (
                                            <div className="relative h-full group">
                                                <img
                                                    src={URL.createObjectURL(formData[imageField]!)}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <div className="text-center">
                                                        <p className="text-white text-xs mb-2 px-2 truncate">
                                                            {formData[imageField]!.name}
                                                        </p>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(imageField)}
                                                            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200 shadow-lg"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <label
                                                htmlFor={`image-${index}`}
                                                className={`h-full flex flex-col items-center justify-center cursor-pointer transition-colors duration-200
                                                ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-500'}
                                                `}
                                            >
                                                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-sm">Image {index + 1}</span>
                                                <input
                                                    type="file"
                                                    id={`image-${index}`}
                                                    accept="image/*"
                                                    onChange={handleFileChange(imageField)}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };


    return (
        <div className={`min-h-screen p-6 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <>
                {/* Material UI Snackbar */}
                <Snackbar
                    open={!!alert}
                    autoHideDuration={4000}
                    onClose={() => setAlert(null)}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                    <Alert
                        onClose={() => setAlert(null)}
                        severity={alert?.type}
                        variant="filled"
                        sx={{ fontSize: "1rem", boxShadow: 3, borderRadius: 2 }}
                    >
                        {alert?.message}
                    </Alert>
                </Snackbar>
            </>
            <div className="max-w-4xl mx-auto">
                <h1 className={`text-4xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Add New Product
                </h1>

                <div className={`rounded-xl shadow-xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="p-8">
                        {/* Stepper */}
                        <div className="flex items-center justify-center mb-8">
                            <div className="flex items-center space-x-4">
                                {steps.map((label, index) => (
                                    <div key={label} className="flex items-center">
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={` w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                                                       ${index <= activeStep
                                                        ? 'bg-blue-600 text-white shadow-lg'
                                                        : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                                                    } `}
                                            >
                                                {index < activeStep ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    index + 1
                                                )}
                                            </div>
                                            <span className={`font-medium text-sm hidden sm:inline transition-colors duration-300
                                                        ${index <= activeStep ? 'text-blue-600' : isDark ? 'text-gray-400' : 'text-gray-500'}
                                                    `}>
                                                {label}
                                            </span>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className={`w-16 h-0.5 mx-4 transition-colors duration-300
                                            ${index < activeStep ? 'bg-blue-600' : isDark ? 'bg-gray-700' : 'bg-gray-200'}
                                        `} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="mb-8">
                            {renderStepContent(activeStep)}
                        </div>

                        {/* Navigation Buttons */}
                        <div className={`flex justify-between items-center pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={activeStep === 0}
                                className={`
                                            flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
                                            ${activeStep === 0
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : isDark
                                            ? 'text-gray-300 hover:bg-gray-700 border border-gray-600'
                                            : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                                    }
                                            disabled:opacity-50
                                            `}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span>Back</span>
                            </button>

                            {activeStep === steps.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                                >
                                    {
                                        isLoading ? (
                                            <Spinner />
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )
                                    }

                                    <span>Create Product</span>
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <span>Next</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}