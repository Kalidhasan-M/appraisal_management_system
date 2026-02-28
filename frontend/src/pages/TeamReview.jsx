import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { managerAPI, appraisalsAPI } from '../lib/api'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { PageTransition } from '../components/layout/PageTransition'
import { Skeleton } from '../components/ui/Skeleton'

const RATING_OPTIONS = [1, 2, 3, 4, 5]

export function TeamReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [appraisal, setAppraisal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    status: 'approved',
    manager_comments: '',
    manager_rating: 3,
    kpi_ratings: [],
  })

  useEffect(() => {
    managerAPI.teamAppraisals()
      .then(({ data }) => {
        const a = data.find((x) => x.id === parseInt(id))
        if (!a) navigate('/team')
        else {
          setAppraisal(a)
          setForm({
            status: a.status === 'submitted' || a.status === 'under_review' ? 'approved' : a.status,
            manager_comments: a.manager_comments || '',
            manager_rating: a.manager_rating || 3,
            kpi_ratings: (a.kpi_ratings || []).map((kr) => ({
              kpi_rating_id: kr.id,
              manager_rating: kr.manager_rating ?? kr.rating,
              manager_comments: kr.manager_comments || '',
            })),
          })
        }
      })
      .catch(() => navigate('/team'))
      .finally(() => setLoading(false))
  }, [id])

  const setKpi = (idx, field, value) => {
    setForm((f) => {
      const arr = [...f.kpi_ratings]
      arr[idx] = { ...arr[idx], [field]: value }
      return { ...f, kpi_ratings: arr }
    })
  }

  const handleSubmit = async (status) => {
    setSaving(true)
    try {
      await managerAPI.review(id, { ...form, status })
      navigate('/team')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !appraisal) {
    return (
      <PageTransition>
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </PageTransition>
    )
  }

  const canReview = ['submitted', 'under_review'].includes(appraisal.status)

  return (
    <PageTransition>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Review: {appraisal.user?.name} - {appraisal.year}
        </h1>
        <Button variant="ghost" onClick={() => navigate('/team')}>
          ← Back
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Self Assessment</h2>
          <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
            {appraisal.self_assessment || 'No self assessment provided.'}
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">KPI Ratings</h2>
          <div className="space-y-4">
            {appraisal.kpi_ratings?.map((kr, idx) => (
              <div key={kr.id} className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                <p className="font-medium mb-2">{kr.kpi_template?.name}</p>
                <p className="text-sm text-slate-500 mb-2">Employee: {kr.rating}/5 - {kr.comments}</p>
                {canReview && (
                  <div className="flex flex-wrap gap-2 items-center mt-2">
                    <span className="text-sm font-medium">Your rating:</span>
                    {RATING_OPTIONS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setKpi(idx, 'manager_rating', r)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          (form.kpi_ratings[idx]?.manager_rating ?? kr.rating) === r
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                    <input
                      type="text"
                      className="flex-1 min-w-[150px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                      placeholder="Comments"
                      value={form.kpi_ratings[idx]?.manager_comments || ''}
                      onChange={(e) => setKpi(idx, 'manager_comments', e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Achievements</h2>
          {!appraisal.achievements?.length ? (
            <p className="text-slate-500">No achievements recorded.</p>
          ) : (
            <ul className="space-y-2">
              {appraisal.achievements.map((a) => (
                <li key={a.id} className="flex gap-2">
                  <span className="text-indigo-500">•</span>
                  <div>
                    <p className="font-medium">{a.title}</p>
                    {a.description && <p className="text-sm text-slate-500">{a.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {canReview && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Your Review</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Overall Rating (1-5)</label>
                <div className="flex gap-2">
                  {RATING_OPTIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, manager_rating: r }))}
                      className={`w-12 h-12 rounded-lg font-medium transition-all ${
                        form.manager_rating === r
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Comments</label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-xl border bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all min-h-[100px]"
                  value={form.manager_comments}
                  onChange={(e) => setForm((f) => ({ ...f, manager_comments: e.target.value }))}
                  placeholder="Add your feedback..."
                />
              </div>
              <div className="flex gap-4">
                <Button onClick={() => handleSubmit('approved')} loading={saving}>
                  Approve
                </Button>
                <Button variant="danger" onClick={() => handleSubmit('rejected')} loading={saving}>
                  Reject
                </Button>
                <Button variant="secondary" onClick={() => handleSubmit('under_review')} loading={saving}>
                  Under Review
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageTransition>
  )
}
