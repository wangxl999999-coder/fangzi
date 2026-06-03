const app = getApp();
const api = require('../../utils/api');

Page({
  data: {
    userInfo: null,
    stats: {
      favorites: 0,
      viewHistory: 0,
      appointments: 0,
      demands: 0
    },
    unreadCount: 0
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
      const stats = await api.user.getStats();
      const messages = await api.message.getList({ page: 1, pageSize: 100 });
      const unreadCount = messages.list.filter(m => !m.read).length;
      this.setData({ stats, unreadCount });
    } catch (err) {
      console.error('加载统计数据失败:', err);
    }
  },

  goLogin() {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  editProfile() {
    wx.showToast({ title: '编辑个人信息', icon: 'none' });
  },

  goFavorites() {
    if (!app.checkLogin()) return;
    wx.navigateTo({ url: '/pages/favorites/favorites' });
  },

  goHistory() {
    if (!app.checkLogin()) return;
    wx.navigateTo({ url: '/pages/history/history' });
  },

  goAppointment() {
    if (!app.checkLogin()) return;
    wx.navigateTo({ url: '/pages/appointment/appointment' });
  },

  goDemand() {
    if (!app.checkLogin()) return;
    wx.showToast({ title: '我的需求', icon: 'none' });
  },

  goPublishDemand(e) {
    if (!app.checkLogin()) return;
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({ url: `/pages/demand-publish/demand-publish?type=${type}` });
  },

  goTools() {
    wx.navigateTo({ url: '/pages/tools/tools' });
  },

  goAgent() {
    wx.showToast({ title: '请下载经纪人端', icon: 'none' });
  },

  goMessages() {
    if (!app.checkLogin()) return;
    wx.navigateTo({ url: '/pages/messages/messages' });
  },

  goAbout() {
    wx.showModal({
      title: '关于我们',
      content: '找房网 v1.0\n\n专业的房产信息平台，为您提供租房、买房、新房等一站式房产服务。',
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
