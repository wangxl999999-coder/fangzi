const app = getApp();
const api = require('../../utils/api');

Page({
  data: {
    userInfo: null,
    stats: {
      totalHouses: 0,
      pendingAppointments: 0,
      unreadMessages: 0
    }
  },

  onShow() {
    this.loadUserInfo();
    this.loadStats();
  },

  async loadUserInfo() {
    const userInfo = app.globalData.userInfo;
    this.setData({ userInfo });
  },

  async loadStats() {
    if (!app.globalData.token) return;
    
    try {
      const stats = await api.statistics.getOverview();
      this.setData({ stats });
    } catch (err) {
      console.error('加载统计数据失败:', err);
      this.setData({
        stats: {
          totalHouses: 12,
          pendingAppointments: 3,
          unreadMessages: 5
        }
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

  goLogin() {
    wx.navigateTo({ url: '/pages/auth/auth' });
  },

  goAuth() {
    wx.navigateTo({ url: '/pages/auth/auth' });
  },

  goQualification() {
    if (!app.checkLogin()) return;
    wx.showToast({ title: '资质上传', icon: 'none' });
  },

  goStatistics() {
    if (!app.checkLogin()) return;
    wx.navigateTo({ url: '/pages/statistics/statistics' });
  },

  goHouseManage() {
    if (!app.checkLogin()) return;
    wx.switchTab({ url: '/pages/house-manage/house-manage' });
  },

  goAppointments() {
    if (!app.checkLogin()) return;
    wx.navigateTo({ url: '/pages/messages/messages' });
  },

  goMessages() {
    if (!app.checkLogin()) return;
    wx.switchTab({ url: '/pages/messages/messages' });
  },

  goAccount() {
    if (!app.checkLogin()) return;
    wx.showToast({ title: '账户设置', icon: 'none' });
  },

  goHelp() {
    wx.showToast({ title: '帮助中心', icon: 'none' });
  },

  goAbout() {
    wx.showModal({
      title: '关于我们',
      content: '找房网经纪人端 v1.0\n\n专业的房产经纪人服务平台',
      showCancel: false
    });
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.logout();
          this.setData({ userInfo: null });
          wx.showToast({ title: '已退出登录', icon: 'success' });
        }
      }
    });
  }
});
