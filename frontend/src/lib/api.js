import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (data) => api.post('/login', data),
  register: (data) => api.post('/register', data),
  logout: () => api.post('/logout'),
  user: () => api.get('/user'),
}

export const appraisalsAPI = {
  list: (params) => api.get('/appraisals', { params }),
  get: (id) => api.get(`/appraisals/${id}`),
  create: (data) => api.post('/appraisals', data),
  update: (id, data) => api.put(`/appraisals/${id}`, data),
  delete: (id) => api.delete(`/appraisals/${id}`),
  submit: (id) => api.post(`/appraisals/${id}/submit`),
  exportPdf: (id) => api.get(`/appraisals/${id}/export-pdf`, { responseType: 'blob' }),
  uploadDocument: (id, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/appraisals/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export const kpiTemplatesAPI = {
  list: () => api.get('/kpi-templates'),
}

export const departmentsAPI = {
  list: () => api.get('/departments'),
}

export const usersAPI = {
  list: (params) => api.get('/users', { params }),
  get: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  assignRole: (id, roleId) => api.post(`/users/${id}/assign-role`, { role_id: roleId }),
}

export const managerAPI = {
  teamAppraisals: (params) => api.get('/manager/team-appraisals', { params }),
  review: (id, data) => api.post(`/manager/appraisals/${id}/review`, data),
}

export const analyticsAPI = {
  get: (params) => api.get('/analytics', { params }),
}

export default api
