import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { appraisalsAPI } from '../lib/api'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PageTransition } from '../components/layout/PageTransition'
import { Skeleton } from '../components/ui/Skeleton'

const statusColors = {
  draft: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  submitted: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
  under_review: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400',
  rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400',
}

export function AppraisalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [appraisal, setAppraisal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    appraisalsAPI.get(id)
      .then(({ data }) => setAppraisal(data))
      .catch(() => navigate('/appraisals'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await appraisalsAPI.submit(id)
      setAppraisal((a) => ({ ...a, status: 'submitted' }))
    } finally {
      setSubmitting(false)
    }
  }

  const handleExport = async () => {
    try {
      const { data } = await appraisalsAPI.exportPdf(id)
      const url = URL.createObjectURL(new Blob([data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `appraisal-${appraisal?.year}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {}
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { data } = await appraisalsAPI.uploadDocument(id, file)
      setAppraisal((a) => ({ ...a, documents: [...(a.documents || []), data] }))
    } finally {
      setUploading(false)
      e.target.value = ''
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

  const canEdit = appraisal.status === 'draft'
  const canExport = ['approved', 'rejected'].includes(appraisal.status)

  return (
    <PageTransition>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Appraisal {appraisal.year}
          </h1>
          <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full font-medium ${statusColors[appraisal.status] || ''}`}>
            {appraisal.status}
          </span>
        </div>
        <div className="flex gap-2">
          {canEdit && (
            <>
              <Link to={`/appraisals/${id}/edit`}>
                <Button variant="secondary">Edit</Button>
              </Link>
              <Button onClick={handleSubmit} loading={submitting}>
                Submit for Review
              </Button>
            </>
          )}
          {canExport && (
            <Button variant="secondary" onClick={handleExport}>
              Export PDF
            </Button>
          )}
        </div>
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
            {appraisal.kpi_ratings?.map((kr) => (
              <div key={kr.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div>
                  <p className="font-medium">{kr.kpi_template?.name}</p>
                  <p className="text-sm text-slate-500">{kr.comments}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">Self: {kr.rating}/5</span>
                  {kr.manager_rating != null && (
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      Manager: {kr.manager_rating}/5
                    </span>
                  )}
                </div>
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
                    {a.date && <p className="text-xs text-slate-400">{a.date}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {canEdit && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Documents</h2>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <input type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFileUpload} disabled={uploading} />
              {uploading ? 'Uploading...' : 'Upload Document'}
            </label>
            {appraisal.documents?.length > 0 && (
              <ul className="mt-4 space-y-2">
                {appraisal.documents.map((d) => (
                  <li key={d.id} className="text-sm text-slate-600 dark:text-slate-400">
                    {d.original_name}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        {appraisal.manager_comments && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Manager Comments</h2>
            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{appraisal.manager_comments}</p>
            {appraisal.manager_rating && (
              <p className="mt-2 font-semibold text-indigo-600 dark:text-indigo-400">
                Overall Rating: {appraisal.manager_rating}/5
              </p>
            )}
          </Card>
        )}
      </div>
    </PageTransition>
  )
}
