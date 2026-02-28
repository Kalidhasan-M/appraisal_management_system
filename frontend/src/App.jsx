import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/layout/Layout'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Appraisals } from './pages/Appraisals'
import { AppraisalForm } from './pages/AppraisalForm'
import { AppraisalDetail } from './pages/AppraisalDetail'
import { TeamAppraisals } from './pages/TeamAppraisals'
import { TeamReview } from './pages/TeamReview'
import { Admin } from './pages/Admin'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { Blog } from './pages/Blog'

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blog" element={<Blog />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="appraisals" element={<ProtectedRoute roles={['employee']}><Appraisals /></ProtectedRoute>} />
        <Route path="appraisals/new" element={<ProtectedRoute roles={['employee']}><AppraisalForm /></ProtectedRoute>} />
        <Route path="appraisals/:id" element={<ProtectedRoute roles={['employee']}><AppraisalDetail /></ProtectedRoute>} />
        <Route path="appraisals/:id/edit" element={<ProtectedRoute roles={['employee']}><AppraisalForm /></ProtectedRoute>} />
        <Route path="team" element={<ProtectedRoute roles={['manager', 'admin']}><TeamAppraisals /></ProtectedRoute>} />
        <Route path="team/:id" element={<ProtectedRoute roles={['manager', 'admin']}><TeamReview /></ProtectedRoute>} />
        <Route path="admin" element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <AppRoutes />
    </AnimatePresence>
  )
}
