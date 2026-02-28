import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

export function PublicNavbar() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    const links = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-teal-600">
                            AppraisePro
                        </Link>
                    </div>
                    <div className="hidden md:flex space-x-8 items-center">
                        {links.map((link) => (
                            <div key={link.path} className="relative">
                                <Link
                                    to={link.path}
                                    className={`text-sm font-medium transition-colors hover:text-teal-600 dark:hover:text-teal-400 ${location.pathname === link.path ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-300'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                                {location.pathname === link.path && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-teal-600 dark:bg-teal-400"
                                    />
                                )}
                            </div>
                        ))}
                        <div className="flex items-center space-x-4 pl-4 border-l border-slate-200 dark:border-slate-700">
                            {isAuthenticated ? (
                                <Link to="/dashboard" className="text-slate-600 dark:text-slate-300 font-medium hover:text-teal-600 dark:hover:text-teal-400">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="text-slate-600 dark:text-slate-300 font-medium hover:text-teal-600 dark:hover:text-teal-400">
                                        Login
                                    </Link>
                                    <Link to="/register" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full font-medium transition-all shadow-md shadow-teal-500/20">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
