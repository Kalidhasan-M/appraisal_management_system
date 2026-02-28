import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { appraisalsAPI, analyticsAPI, managerAPI } from '../lib/api'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PageTransition } from '../components/layout/PageTransition'
import { CardSkeleton } from '../components/ui/Skeleton'

export function Dashboard() {
  const { user, isAdmin, isManager } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [appraisals, setAppraisals] = useState([])
  const [teamAppraisals, setTeamAppraisals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const year = new Date().getFullYear()
        if (isAdmin || isManager) {
          const [aRes, tRes] = await Promise.all([
            analyticsAPI.get({ year }),
            managerAPI.teamAppraisals({ status: 'submitted' }),
          ])
          setAnalytics(aRes.data)
          setTeamAppraisals(tRes.data)
        } else {
          const { data } = await appraisalsAPI.list()
          setAppraisals(data)
        }
      } catch {
        setAppraisals([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isAdmin, isManager])

  if (loading && (isAdmin || isManager)) {
    return (
      <PageTransition>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8">
          Welcome, {user?.name}
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8">
        Welcome, {user?.name}
      </h1>

      {(isAdmin || isManager) && analytics && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-6">
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Employees</p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{analytics.total_employees}</p>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6">
                <p className="text-sm text-slate-600 dark:text-slate-400">Pending Reviews</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">{analytics.pending_reviews}</p>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6">
                <p className="text-sm text-slate-600 dark:text-slate-400">Completed ({analytics.year})</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{analytics.completed_this_year}</p>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="p-6">
                <p className="text-sm text-slate-600 dark:text-slate-400">Draft</p>
                <p className="text-3xl font-bold text-slate-600 dark:text-slate-400 mt-1">{analytics.draft_count}</p>
              </Card>
            </motion.div>
          </div>

          {teamAppraisals.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Pending Team Reviews</h2>
              <div className="space-y-3">
                {teamAppraisals.slice(0, 5).map((a) => (
                  <div key={a.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                    <div>
                      <p className="font-medium">{a.user?.name}</p>
                      <p className="text-sm text-slate-500">{a.year} • {a.user?.department?.name}</p>
                    </div>
                    <Link to={`/team/${a.id}`}>
                      <Button variant="secondary" size="sm">Review</Button>
                    </Link>
                  </div>
                ))}
              </div>
              <Link to="/team" className="block mt-4 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">
                View all →
              </Link>
            </Card>
          )}
        </>
      )}

      {!isAdmin && !isManager && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Quick Actions</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Submit your annual self appraisal and track your progress.
            </p>
            <Link to="/appraisals/new">
              <Button>New Appraisal</Button>
            </Link>
          </Card>

          {appraisals.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Recent Appraisals</h2>
              <div className="space-y-3">
                {appraisals.slice(0, 5).map((a) => (
                  <div key={a.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                    <div>
                      <p className="font-medium">{a.year}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        a.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' :
                        a.status === 'rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400' :
                        a.status === 'submitted' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {a.status}
                      </span>
                    </div>
                    <Link to={`/appraisals/${a.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>
                ))}
              </div>
              <Link to="/appraisals" className="block mt-4 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">
                View all →
              </Link>
            </Card>
          )}
        </div>
      )}
    </PageTransition>
  )
}
