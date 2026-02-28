import { motion } from 'framer-motion'

export function Card({ children, className = '', hover = false, ...props }) {
  const Component = motion.div
  return (
    <Component
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={`
        rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl
        border border-slate-200/80 dark:border-slate-700/80
        shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  )
}
