import { motion } from 'framer-motion';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { Link } from 'react-router-dom';

export function Home() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
            <PublicNavbar />

            {/* Hero Section */}
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
                <motion.div
                    className="text-center max-w-3xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800 text-teal-600 dark:text-teal-400 font-semibold text-sm mb-6">
                        <span className="flex h-2 w-2 rounded-full bg-teal-500 mr-2 animate-pulse"></span>
                        The Future of Appraisals
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
                        Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-600">Team's Performance</span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                        A beautiful, intuitive, and modern appraisal management system designed to bring the best out of your employees with meaningful KPIs and feedback.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link to="/register" className="inline-flex justify-center items-center rounded-full bg-teal-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-500/30 hover:bg-teal-500 transition-all hover:-translate-y-1">
                            Start Free Trial
                        </Link>
                        <Link to="/about" className="inline-flex justify-center items-center rounded-full bg-white dark:bg-slate-800 px-8 py-3.5 text-base font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                            Learn more
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Floating Mockup Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8, type: 'spring' }}
                    className="mt-20 relative max-w-5xl mx-auto"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 to-transparent blur-3xl -z-10 rounded-full h-[300px] w-full mt-20" />
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        className="rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-2 h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-indigo-500/5" />
                        <div className="text-center z-10">
                            <div className="grid grid-cols-3 gap-6 opacity-30 px-10">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                                ))}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent" />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
