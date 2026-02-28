import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { appraisalsAPI } from '../lib/api'
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

export function Appraisals() {
  const [appraisals, setAppraisals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    appraisalsAPI.list()
      .then(({ data }) => setAppraisals(data))
      .catch(() => setAppraisals([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageTransition>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">My Appraisals</h1>
        <Link to="/appraisals/new">
          <Button>New Appraisal</Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Year</th>
                <th className="text-left px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Updated</th>
                <th className="text-right px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <TableRowSkeleton key={i} cols={4} />
              ))}
            </tbody>
          </table>
        ) : appraisals.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">No appraisals yet.</p>
            <Link to="/appraisals/new">
              <Button>Create your first appraisal</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Year</th>
                  <th className="text-left px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Updated</th>
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
                    <td className="px-4 py-3 font-medium">{a.year}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[a.status] || ''}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-sm">
                      {new Date(a.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Link to={`/appraisals/${a.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                      {a.status === 'draft' && (
                        <Link to={`/appraisals/${a.id}/edit`}>
                          <Button variant="secondary" size="sm">Edit</Button>
                        </Link>
                      )}
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
