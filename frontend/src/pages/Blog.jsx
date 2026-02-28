import { motion } from 'framer-motion';
import { PublicNavbar } from '../components/layout/PublicNavbar';

export function Blog() {
    const posts = [
        {
            id: 1,
            title: '5 Ways to Make Appraisals More Meaningful',
            excerpt: 'Discover how to transform annual reviews from a dreaded chore into a powerful driver of engagement and growth.',
            date: 'Mar 1, 2026',
            author: 'Sarah Jenkins',
            category: 'Management'
        },
        {
            id: 2,
            title: 'The Future of Goal Setting',
            excerpt: 'Move beyond traditional OKRs with real-time feedback and dynamic KPIs that adapt to your business needs.',
            date: 'Feb 24, 2026',
            author: 'David Chen',
            category: 'Strategy'
        },
        {
            id: 3,
            title: 'Common Mistakes in Performance Reviews',
            excerpt: 'Are you falling into the recency bias trap? Learn about the most common appraisal mistakes and how to avoid them.',
            date: 'Feb 15, 2026',
            author: 'Emma Rodriguez',
            category: 'Leadership'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
            <PublicNavbar />
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Our Blog</h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Insights, strategies, and best practices for modern performance management.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 flex flex-col"
                            >
                                <div className="h-48 bg-teal-100 dark:bg-teal-900/30 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-indigo-500/20 mix-blend-multiply" />
                                    <div className="absolute inset-0 flex items-center justify-center text-teal-600/20 dark:text-teal-400/10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center text-sm mb-4">
                                        <span className="text-teal-600 dark:text-teal-400 font-semibold">{post.category}</span>
                                        <span className="mx-2 text-slate-300 dark:text-slate-600">•</span>
                                        <span className="text-slate-500 dark:text-slate-400">{post.date}</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">{post.title}</h2>
                                    <p className="text-slate-600 dark:text-slate-400 mb-6 flex-1 line-clamp-3">{post.excerpt}</p>
                                    <div className="flex items-center text-sm font-medium text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-700 pt-4 mt-auto">
                                        By {post.author}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
