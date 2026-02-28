import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { appraisalsAPI, kpiTemplatesAPI } from '../lib/api'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { PageTransition } from '../components/layout/PageTransition'

const RATING_OPTIONS = [1, 2, 3, 4, 5]

export function AppraisalForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [kpiTemplates, setKpiTemplates] = useState([])
  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    self_assessment: '',
    kpi_ratings: [],
    achievements: [{ title: '', description: '', date: '' }],
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const load = async () => {
      const { data: kpis } = await kpiTemplatesAPI.list()
      setKpiTemplates(kpis)
      if (isEdit) {
        try {
          const { data } = await appraisalsAPI.get(id)
          setForm({
            year: data.year,
            self_assessment: data.self_assessment || '',
            kpi_ratings: data.kpi_ratings?.length
              ? data.kpi_ratings.map((kr) => ({
                  kpi_template_id: kr.kpi_template_id,
                  rating: kr.rating,
                  comments: kr.comments || '',
                }))
              : kpis.map((k) => ({ kpi_template_id: k.id, rating: 3, comments: '' })),
            achievements: data.achievements?.length
              ? data.achievements.map((a) => ({ id: a.id, title: a.title, description: a.description || '', date: a.date || '' }))
              : [{ title: '', description: '', date: '' }],
          })
        } catch {
          navigate('/appraisals')
        }
      } else {
        setForm((f) => ({
          ...f,
          kpi_ratings: kpis.map((k) => ({ kpi_template_id: k.id, rating: 3, comments: '' })),
        }))
      }
    }
    load()
  }, [id, isEdit])

  const setKpi = (idx, field, value) => {
    setForm((f) => {
      const arr = [...(f.kpi_ratings || [])]
      if (!arr[idx]) arr[idx] = { kpi_template_id: '', rating: 3, comments: '' }
      arr[idx] = { ...arr[idx], [field]: value }
      return { ...f, kpi_ratings: arr }
    })
  }

  const addAchievement = () => {
    setForm((f) => ({ ...f, achievements: [...f.achievements, { title: '', description: '', date: '' }] }))
  }

  const setAchievement = (idx, field, value) => {
    setForm((f) => {
      const arr = [...f.achievements]
      arr[idx] = { ...arr[idx], [field]: value }
      return { ...f, achievements: arr }
    })
  }

  const removeAchievement = (idx) => {
    setForm((f) => ({ ...f, achievements: f.achievements.filter((_, i) => i !== idx) }))
  }

  const handleSubmit = async (e, submitToManager = false) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    const payload = {
      year: form.year,
      self_assessment: form.self_assessment,
      kpi_ratings: form.kpi_ratings.filter((kr) => kr.kpi_template_id),
      achievements: form.achievements.filter((a) => a.title.trim()),
    }
    try {
      if (isEdit) {
        await appraisalsAPI.update(id, payload)
        if (submitToManager) {
          await appraisalsAPI.submit(id)
        }
      } else {
        const { data } = await appraisalsAPI.create(payload)
        if (submitToManager) {
          await appraisalsAPI.submit(data.id)
        }
        navigate(`/appraisals/${data.id}`)
        return
      }
      navigate('/appraisals')
    } catch (err) {
      setErrors(err.response?.data?.errors || {})
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8">
        {isEdit ? 'Edit Appraisal' : 'New Appraisal'}
      </h1>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Info</h2>
          <Input
            label="Year"
            type="number"
            value={form.year}
            onChange={(e) => setForm((f) => ({ ...f, year: parseInt(e.target.value) || f.year }))}
            min={2020}
            max={2030}
            disabled={isEdit}
          />
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Self Assessment</label>
            <textarea
              className="w-full px-4 py-2.5 rounded-xl border bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all min-h-[120px]"
              value={form.self_assessment}
              onChange={(e) => setForm((f) => ({ ...f, self_assessment: e.target.value }))}
              placeholder="Describe your performance, achievements, and areas for improvement..."
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">KPI Ratings (1-5)</h2>
          <div className="space-y-4">
            {(form.kpi_ratings?.length ? form.kpi_ratings : kpiTemplates.map((k) => ({ kpi_template_id: k.id, rating: 3, comments: '' }))).map((kr, idx) => {
              const template = kpiTemplates.find((k) => k.id === kr.kpi_template_id)
              if (!template) return null
              return (
                <div key={template.id} className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                  <p className="font-medium text-slate-800 dark:text-slate-100">{template.name}</p>
                  <p className="text-sm text-slate-500 mb-2">{template.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {RATING_OPTIONS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setKpi(idx, 'rating', r)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          kr.rating === r
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                    placeholder="Comments (optional)"
                    value={kr.comments || ''}
                    onChange={(e) => setKpi(idx, 'comments', e.target.value)}
                  />
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Achievements</h2>
            <Button type="button" variant="secondary" size="sm" onClick={addAchievement}>
              Add
            </Button>
          </div>
          <div className="space-y-4">
            {form.achievements.map((a, idx) => (
              <div key={idx} className="flex gap-4 items-start p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                <div className="flex-1 space-y-3">
                  <Input
                    placeholder="Title"
                    value={a.title}
                    onChange={(e) => setAchievement(idx, 'title', e.target.value)}
                  />
                  <Input
                    placeholder="Description"
                    value={a.description}
                    onChange={(e) => setAchievement(idx, 'description', e.target.value)}
                  />
                  <Input
                    type="date"
                    placeholder="Date"
                    value={a.date}
                    onChange={(e) => setAchievement(idx, 'date', e.target.value)}
                  />
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeAchievement(idx)} className="text-rose-500">
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" loading={loading}>
            {isEdit ? 'Save' : 'Create'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => handleSubmit(e, true)}
            loading={loading}
          >
            Save & Submit
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/appraisals')}>
            Cancel
          </Button>
        </div>
      </form>
    </PageTransition>
  )
}
