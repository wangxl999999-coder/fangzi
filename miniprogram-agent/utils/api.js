const request = require('./request');

const api = {
  auth: {
    login: (data) => request({ url: '/agent/auth/login', method: 'POST', data }),
    sendCode: (data) => request({ url: '/agent/auth/send-code', method: 'POST', data }),
    submitAuth: (data) => request({ url: '/agent/auth/submit', method: 'POST', data }),
    getStatus: () => request({ url: '/agent/auth/status' })
  },

  house: {
    getMyList: (params) => request({ url: '/agent/houses', data: params }),
    create: (data) => request({ url: '/agent/houses', method: 'POST', data }),
    update: (id, data) => request({ url: `/agent/houses/${id}`, method: 'PUT', data }),
    delete: (id) => request({ url: `/agent/houses/${id}`, method: 'DELETE' }),
    offline: (id) => request({ url: `/agent/houses/${id}/offline`, method: 'POST' }),
    online: (id) => request({ url: `/agent/houses/${id}/online`, method: 'POST' }),
    getDetail: (id) => request({ url: `/agent/houses/${id}` })
  },

  message: {
    getList: (params) => request({ url: '/agent/messages', data: params }),
    getAppointments: (params) => request({ url: '/agent/appointments', data: params }),
    markRead: (id) => request({ url: `/agent/messages/${id}/read`, method: 'POST' }),
    confirmAppointment: (id) => request({ url: `/agent/appointments/${id}/confirm`, method: 'POST' })
  },

  statistics: {
    getOverview: () => request({ url: '/agent/statistics/overview' }),
    getHouseStats: () => request({ url: '/agent/statistics/houses' }),
    getTrend: (params) => request({ url: '/agent/statistics/trend', data: params })
  },

  user: {
    getProfile: () => request({ url: '/agent/user/profile' }),
    updateProfile: (data) => request({ url: '/agent/user/profile', method: 'PUT', data })
  }
};

module.exports = api;
