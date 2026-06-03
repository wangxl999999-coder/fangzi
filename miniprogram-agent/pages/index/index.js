const app = getApp();
const api = require('../../utils/api');

Page({
  data: {
    userInfo: null,
    stats: {
      todayViews: 0,
      todayAppointments: 0,
      todayCalls: 0,
      todayMessages: 0,
      totalHouses: 0,
      onlineHouses: 0,
      totalViews: 0,
      totalFavorites: 0
    },
    recentAppointments: []
  },

  onShow() {
    this.loadData();
  },

  async loadData() {
    if (!app.globalData.token) {
      this.setData({ userInfo: null });
      return;
    }

    this.setData({ userInfo: app.globalData.userInfo });
    
    try {
      const stats = await api.statistics.getOverview();
      const appointments = await api.message.getAppointments({ page: 1, pageSize: 5 });
      
      this.setData({ 
        stats,
        recentAppointments: appointments.list || []
      });
    } catch (err) {
      console.error('加载数据失败:', err);
      this.setData({
        stats: {
          todayViews: 24,
          todayAppointments: 3,
          todayCalls: 5,
          todayMessages: 8,
          totalHouses: 12,
          onlineHouses: 10,
          totalViews: 1256,
          totalFavorites: 89
        },
        recentAppointments: [
          { _id: '1', userName: '王先生', date: '06-05', time: '14:00', houseTitle: '万科城三室两厅', status: 'pending' },
          { _id: '2', userName: '李女士', date: '06-05', time: '10:30', houseTitle: '碧桂园精装两室', status: 'confirmed' }
        ]
      });
    }
  },

  getAuthStatusText(status) {
    const texts = {
      pending: '认证中',
      approved: '已认证',
      rejected: '认证失败',
      none: '未认证'
    };
    return texts[status] || '未认证';
  },

  getStatusText(status) {
    const texts = {
      pending: '待确认',
      confirmed: '已确认',
      completed: '已完成',
      cancelled: '已取消'
    };
    return texts[status] || status;
  },

  goLogin() {
    wx.navigateTo({ url: '/pages/auth/auth' });
  },

  goAuth() {
    wx.navigateTo({ url: '/pages/auth/auth' });
  },

  goPublish() {
    if (!app.checkLogin()) return;
    wx.navigateTo({ url: '/pages/house-publish/house-publish' });
  },

  goManage() {
    if (!app.checkLogin()) return;
    wx.switchTab({ url: '/pages/house-manage/house-manage' });
  },

  goAppointments() {
    if (!app.checkLogin()) return;
    wx.navigateTo({ url: '/pages/messages/messages' });
  },

  goStatistics() {
    if (!app.checkLogin()) return;
    wx.navigateTo({ url: '/pages/statistics/statistics' });
  }
});
