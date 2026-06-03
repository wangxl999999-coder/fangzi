const { get, post, put, del } = require('./request');

module.exports = {
  auth: {
    sendSms: (data) => post('/auth/sms', data),
    login: (data) => post('/auth/login', data),
    logout: () => post('/auth/logout'),
    checkAuth: () => get('/auth/check')
  },

  user: {
    getInfo: () => get('/users/info'),
    updateInfo: (data) => put('/users/info', data),
    submitAuth: (data) => post('/users/auth', data),
    getAuthStatus: () => get('/users/auth/status'),
    switchRole: (data) => post('/users/role', data)
  },

  house: {
    getList: (params) => get('/houses', params),
    getDetail: (id) => get(`/houses/${id}`),
    getSpecial: (params) => get('/houses/special', params),
    getNew: (params) => get('/houses/new', params),
    create: (data) => post('/houses', data),
    update: (id, data) => put(`/houses/${id}`, data),
    delete: (id) => del(`/houses/${id}`),
    getMyList: (params) => get('/houses/my/list', params),
    toggleFavorite: (data) => post('/houses/favorite/toggle', data),
    getFavorites: (params) => get('/houses/favorite/list', params),
    getHistory: (params) => get('/houses/history/list', params),
    getStatistics: () => get('/houses/statistics/data')
  },

  community: {
    getList: (params) => get('/communities', params),
    getDetail: (id) => get(`/communities/${id}`),
    getHot: (params) => get('/communities/hot', params)
  },

  project: {
    getList: (params) => get('/projects', params),
    getDetail: (id) => get(`/projects/${id}`),
    getHot: (params) => get('/projects/hot', params)
  },

  demand: {
    getList: (params) => get('/demands', params),
    getDetail: (id) => get(`/demands/${id}`),
    create: (data) => post('/demands', data),
    update: (id, data) => put(`/demands/${id}`, data),
    delete: (id) => del(`/demands/${id}`),
    getMyList: (params) => get('/demands/my/list', params)
  },

  message: {
    getList: (params) => get('/messages', params),
    getUnreadCount: () => get('/messages/unread/count'),
    markRead: (id) => put(`/messages/${id}/read`),
    markAllRead: () => put('/messages/all/read'),
    createAppointment: (data) => post('/messages/appointment', data),
    getAppointments: (params) => get('/messages/appointment/list', params),
    updateAppointment: (data) => put('/messages/appointment/status', data)
  },

  marketing: {
    getBanners: (params) => get('/marketing/banners', params),
    getHomeData: (params) => get('/marketing/home', params)
  },

  tools: {
    calculateMortgage: (data) => post('/tools/mortgage', data),
    estimatePrice: (data) => post('/tools/estimate', data),
    getPolicies: (params) => get('/tools/policies', params),
    getCities: () => get('/tools/cities')
  }
};
