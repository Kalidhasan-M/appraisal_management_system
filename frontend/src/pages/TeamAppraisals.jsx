import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { managerAPI } from '../lib/api'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PageTransition } from '../components/layout/PageTransition'
import { TableRowSkeleton } from '../components/ui/Skeleton'

const statusColors = {
  draft: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  submitted: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
  under_review: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400',
  rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400',
}

export function TeamAppraisals() {
  const [appraisals, setAppraisals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    managerAPI.teamAppraisals({ status: filter || undefined })
      .then(({ data }) => setAppraisals(data))
      .catch(() => setAppraisals([]))
      .finally(() => setLoading(false))
  }, [filter])

  return (
    <PageTransition>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Team Appraisals</h1>
        <div className="flex gap-2">
          {['', 'submitted', 'under_review', 'approved', 'rejected'].map((s) => (
            <button
              key={s || 'all'}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Employee</th>
                <th className="text-left px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Department</th>
                <th className="text-left px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Year</th>
                <th className="text-left px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Status</th>
                <th className="text-right px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <TableRowSkeleton key={i} cols={5} />
              ))}
            </tbody>
          </table>
        ) : appraisals.length === 0 ? (
          <div className="p-12 text-center text-slate-600 dark:text-slate-400">
            No team appraisals found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Employee</th>
                  <th className="text-left px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Department</th>
                  <th className="text-left px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Year</th>
                  <th className="text-left px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Status</th>
                  <th className="text-right px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appraisals.map((a, i) => (
                  <motion.tr
                    key={a.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{a.user?.name}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{a.user?.department?.name || '-'}</td>
                    <td className="px-4 py-3">{a.year}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[a.status] || ''}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/team/${a.id}`}>
                        <Button variant={['submitted', 'under_review'].includes(a.status) ? 'primary' : 'ghost'} size="sm">
                          {['submitted', 'under_review'].includes(a.status) ? 'Review' : 'View'}
                        </Button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PageTransition>
  )
}
