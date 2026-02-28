import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { usersAPI, departmentsAPI, kpiTemplatesAPI } from '../lib/api'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { PageTransition } from '../components/layout/PageTransition'
import { CardSkeleton } from '../components/ui/Skeleton'

const TABS = ['users', 'departments', 'kpis']

export function Admin() {
  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [departments, setDepartments] = useState([])
  const [kpis, setKpis] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        if (tab === 'users') {
          const { data } = await usersAPI.list({ per_page: 50 })
          setUsers(Array.isArray(data) ? data : (data?.data ?? []))
        } else if (tab === 'departments') {
          const { data } = await departmentsAPI.list()
          setDepartments(data)
        } else {
          const { data } = await kpiTemplatesAPI.list()
          setKpis(data)
        }
      } catch {
        if (tab === 'users') setUsers([])
        else if (tab === 'departments') setDepartments([])
        else setKpis([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tab])

  const userList = Array.isArray(users) ? users : (users?.data ?? [])

  return (
    <PageTransition>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8">Admin</h1>

      <div className="flex gap-2 mb-8">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl font-medium capitalize transition-all ${
              tab === t
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : tab === 'users' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Email</th>
                  <th className="text-left px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Role</th>
                  <th className="text-left px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Department</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                        {u.role?.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{u.department?.name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : tab === 'departments' ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {departments.map((d) => (
              <div key={d.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{d.name}</p>
                  <p className="text-sm text-slate-500">{d.description}</p>
                  <p className="text-xs text-slate-400">{d.users_count ?? 0} users</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {kpis.map((k) => (
              <div key={k.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{k.name}</p>
                  <p className="text-sm text-slate-500">{k.description}</p>
                  <p className="text-xs text-slate-400">Weight: {k.weight}%</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {(tab === 'users' && userList.length === 0) ||
        (tab === 'departments' && departments.length === 0) ||
        (tab === 'kpis' && kpis.length === 0) ? (
          <div className="p-12 text-center text-slate-500">No data.</div>
        ) : null}
      </Card>
    </PageTransition>
  )
}
