import { motion } from 'framer-motion';
import { PublicNavbar } from '../components/layout/PublicNavbar';

export function About() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
            <PublicNavbar />
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-6">About Us</h1>
                    <div className="prose prose-lg prose-teal dark:prose-invert max-w-none">
                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                            We believe that appraisals shouldn't be a chore. They should be a catalyst for growth,
                            development, and meaningful conversations between managers and their teams.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
                                <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Our Mission</h2>
                                <p className="text-slate-600 dark:text-slate-300">
                                    Our mission is to simplify performance management while making it more effective. We're
                                    building tools that help organizations align their goals, track KPIs effortlessly, and
                                    foster a culture of continuous feedback.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
                                <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Why AppraisePro?</h2>
                                <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                                    <li className="flex items-center"><span className="text-teal-500 mr-2 font-bold">✓</span> Modern, intuitive interface</li>
                                    <li className="flex items-center"><span className="text-teal-500 mr-2 font-bold">✓</span> Customizable KPI templates</li>
                                    <li className="flex items-center"><span className="text-teal-500 mr-2 font-bold">✓</span> Deep analytics and insights</li>
                                    <li className="flex items-center"><span className="text-teal-500 mr-2 font-bold">✓</span> Secure role-based access</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
