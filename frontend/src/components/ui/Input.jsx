export function Input({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5 rounded-xl border bg-white/80 dark:bg-slate-800/80
          text-slate-900 dark:text-slate-100 placeholder-slate-400
          border-slate-200 dark:border-slate-600 focus:border-indigo-500
          focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-rose-500">{error}</p>
      )}
    </div>
  )
}
