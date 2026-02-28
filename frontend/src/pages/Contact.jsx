import { motion } from 'framer-motion';
import { PublicNavbar } from '../components/layout/PublicNavbar';

export function Contact() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
            <PublicNavbar />
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-6 text-center">Contact Us</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 text-center max-w-2xl mx-auto">
                        Have questions about AppraisePro? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
                    </p>

                    <div className="grid md:grid-cols-2 gap-12 bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700">
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Get in Touch</h2>
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                                    <input type="text" className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-teal-500 focus:border-teal-500 p-3" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                                    <input type="email" className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-teal-500 focus:border-teal-500 p-3" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                                    <textarea rows="4" className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-teal-500 focus:border-teal-500 p-3" placeholder="How can we help?"></textarea>
                                </div>
                                <button type="button" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-lg shadow-teal-500/30">
                                    Send Message
                                </button>
                            </form>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
                            <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-base font-medium text-slate-900 dark:text-white">Email</h4>
                                        <p className="mt-1 text-slate-500 dark:text-slate-400">support@appraisepro.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-base font-medium text-slate-900 dark:text-white">Location</h4>
                                        <p className="mt-1 text-slate-500 dark:text-slate-400">123 Business Avenue<br />Tech District, SF 94107</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
