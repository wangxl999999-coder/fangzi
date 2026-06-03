import request from './request';

export const auth = {
  login: (data) => request.post('/login', data),
  logout: () => request.post('/logout')
};

export const house = {
  getList: (params) => request.get('/houses', { params }),
  getDetail: (id) => request.get(`/houses/${id}`),
  update: (id, data) => request.put(`/houses/${id}`, data),
  delete: (id) => request.delete(`/houses/${id}`),
  audit: (id, data) => request.post(`/houses/${id}/audit`, data),
  getStatistics: () => request.get('/houses/statistics')
};

export const user = {
  getList: (params) => request.get('/users', { params }),
  getDetail: (id) => request.get(`/users/${id}`),
  update: (id, data) => request.put(`/users/${id}`, data),
  delete: (id) => request.delete(`/users/${id}`),
  disable: (id, disabled) => request.put(`/users/${id}/disable`, { disabled })
};

export const project = {
  getList: (params) => request.get('/projects', { params }),
  create: (data) => request.post('/projects', data),
  update: (id, data) => request.put(`/projects/${id}`, data),
  delete: (id) => request.delete(`/projects/${id}`)
};

export const demand = {
  getList: (params) => request.get('/demands', { params }),
  update: (id, data) => request.put(`/demands/${id}`, data),
  delete: (id) => request.delete(`/demands/${id}`)
};

export const agent = {
  getAuthList: (params) => request.get('/agents/auth', { params }),
  audit: (id, data) => request.post(`/agents/${id}/audit`, data)
};

export const marketing = {
  getBanners: (params) => request.get('/banners', { params }),
  createBanner: (data) => request.post('/banners', data),
  updateBanner: (id, data) => request.put(`/banners/${id}`, data),
  deleteBanner: (id) => request.delete(`/banners/${id}`),
  getSections: (params) => request.get('/sections', { params }),
  updateSection: (id, data) => request.put(`/sections/${id}`, data)
};

export const system = {
  getStatistics: () => request.get('/statistics'),
  getSettings: () => request.get('/settings'),
  updateSettings: (data) => request.put('/settings', data)
};
