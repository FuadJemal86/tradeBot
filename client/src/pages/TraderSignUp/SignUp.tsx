import React, { useState, useEffect } from 'react';
import { MapPin, Eye, EyeOff, User, Mail, Lock, Phone, Globe, CheckCircle } from 'lucide-react';
import api from '../../service/api';
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { Alert, Snackbar, CircularProgress } from "@mui/material";

interface TraderFormData {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    location: string;
}
interface LocationData {
    city?: string;
    locality?: string;
    countryName?: string;
}

// Zod schema for deposit validation
const signUpSchema = z.object({
    fullName: z.string().min(1, "Please fill your name"),
    email: z.string().email("Please insert a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z.string().min(1, "Phone number is required"),
    location: z.string().min(1, "Location is required"),
});


type SignUpFormData = z.infer<typeof signUpSchema>;

function SignUp() {
    const [formData, setFormData] = useState<TraderFormData>({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        location: ''
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [locationLoading, setLocationLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            phone: "",
            location: "",
        },
    });

    useEffect(() => {
        detectLocation();
    }, []);

    const detectLocation = (): void => {
        setLocationLoading(true);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position: GeolocationPosition) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        const response = await fetch(
                            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                        );
                        const data: LocationData = await response.json();

                        const location = `${data.city || data.locality || 'Unknown City'}, ${data.countryName || 'Unknown Country'}`;
                        setFormData(prev => ({ ...prev, location }));
                    } catch (error) {
                        setFormData(prev => ({
                            ...prev,
                            location: `Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`
                        }));
                    }
                    setLocationLoading(false);
                },
                (error: GeolocationPositionError) => {
                    setLocationLoading(false);
                    if (error.code === error.PERMISSION_DENIED) {
                        setFormData(prev => ({ ...prev, location: 'Location access denied' }));
                    } else {
                        setFormData(prev => ({ ...prev, location: 'Unable to detect location' }));
                    }
                }
            );
        } else {
            setLocationLoading(false);
            setFormData(prev => ({ ...prev, location: 'Geolocation not supported' }));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

    };

    const onSubmit = async (data: SignUpFormData) => {
        setIsLoading(true);
        try {

            const result = await api.post("http://localhost:4000/trade/sign-up", data);
            if (result.data.status) {
                setAlert({ type: "success", message: result.data.message });
                setFormData({
                    fullName: '',
                    email: '',
                    password: '',
                    phone: '',
                    location: ''
                })
            } else {
                setAlert({ type: "error", message: result.data.message });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    const getPasswordStrength = (): { strength: string; color: string } => {
        const password = formData.password;
        if (!password) return { strength: '', color: '' };

        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z\d]/.test(password)) score++;

        if (score < 3) return { strength: 'Weak', color: 'text-red-500' };
        if (score < 4) return { strength: 'Fair', color: 'text-yellow-500' };
        return { strength: 'Strong', color: 'text-green-500' };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
            <div className="sm:mx-auto sm:w-full sm:max-w-md">

                <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">
                    Join TradeHub
                </h2>
                <p className="text-center text-gray-600 mb-8">
                    Create your trader account and start connecting with buyers worldwide
                </p>
            </div>

            <div className="sm:mx-auto w-full md:w-lg">
                <div className="bg-white py-8 px-6 shadow-xl rounded-xl sm:px-10 border border-gray-100">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-6">
                            <div className='grid space-y-6 md:flex space-x-3 md:space-y-0'>
                                {/* Full Name */}
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            {...register("fullName")}
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            autoComplete="name"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300 outline-none'
                                                }`}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    {errors.fullName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.fullName?.message}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            {...register("email")}
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 outline-none'
                                                }`}
                                            placeholder="Enter your email address"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        {...register("password")}
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 outline-none'
                                            }`}
                                        placeholder="Create a strong password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                {formData.password && passwordStrength.strength && (
                                    <p className={`mt-1 text-sm ${passwordStrength.color}`}>
                                        Password strength: {passwordStrength.strength}
                                    </p>
                                )}
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password?.message}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number (Optional)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        {...register("phone")}
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 outline-none'
                                            }`}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone?.message}</p>
                                )}
                            </div>

                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                    Location *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        {...register("location")}
                                        id="location"
                                        name="location"
                                        type="text"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className={`block w-full pl-10 pr-24 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300 outline-none'
                                            }`}
                                        placeholder="Enter your location"
                                    />
                                    <button
                                        type="button"
                                        onClick={detectLocation}
                                        disabled={locationLoading}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-green-600 hover:text-green-800 font-medium disabled:opacity-50"
                                    >
                                        {locationLoading ? 'Detecting...' : 'Auto-detect'}
                                    </button>
                                </div>
                                {errors.location && (
                                    <p className="mt-1 text-sm text-red-600">{errors.location?.message}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    We'll use this to connect you with relevant trading opportunities
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Create Trader Account
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>


                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <button
                                type="button"
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                            >
                                Sign in to your account
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500">
                        By creating an account, you agree to our{' '}
                        <a href="#" className="text-green-600 hover:text-green-800 font-medium">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-green-600 hover:text-green-800 font-medium">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;