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
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

const RightSideBar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    // Handle responsive layout
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            // Close sidebar on resize to mobile if it was open
            if (window.innerWidth < 1024 && sidebarOpen) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [sidebarOpen]);

    // Check for saved dark mode preference
    useEffect(() => {
        const isDarkMode = localStorage.getItem('theme') === 'dark';
        setDarkMode(isDarkMode);
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', newDarkMode);

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('darkModeChange', { detail: newDarkMode }));
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
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
                            onClick={toggleSidebar}
                            className={`md:hidden p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                }`}
                        >
                            {sidebarOpen ? (
                                <X size={20} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                            ) : (
                                <Menu size={20} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                            )}
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

            {/* Main Content and Sidebar Container */}
            <div className="flex">
                {/* Main Content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>

                {/* Sidebar Overlay for mobile */}
                {isMobile && sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Sidebar */}
                <aside className={`
                    fixed top-0 right-0 h-full w-64 shadow-lg z-30 transition-transform duration-300 ease-in-out
                    lg:relative lg:translate-x-0 lg:shadow-none
                    ${darkMode ? 'bg-gray-800' : 'bg-white'}
                    ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
                `}>
                    <div className="flex flex-col h-full">
                        {/* Sidebar Header */}
                        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between">
                                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    Menu
                                </h2>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="lg:hidden p-1 rounded-md transition-colors"
                                >
                                    <X size={20} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                                </button>
                            </div>
                        </div>

                        {/* Sidebar Navigation */}
                        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                            {sidebarItems.map((item, index) => (
                                <button
                                    key={index}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm rounded-md transition-colors
                                        ${item.active
                                            ? darkMode
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                            : darkMode
                                                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <item.icon size={18} />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default RightSideBar;