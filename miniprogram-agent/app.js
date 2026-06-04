App({
  globalData: {
    baseUrl: 'http://localhost:3001/api',
    token: '',
    userInfo: null,
    currentCity: '北京'
  },

  onLaunch() {
    const token = wx.getStorageSync('agentToken');
    const userInfo = wx.getStorageSync('agentUserInfo');
    if (token) {
      this.globalData.token = token;
    }
    if (userInfo) {
      this.globalData.userInfo = JSON.parse(userInfo);
    }
  },

  setToken(token) {
    this.globalData.token = token;
    wx.setStorageSync('agentToken', token);
  },

  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo;
    wx.setStorageSync('agentUserInfo', JSON.stringify(userInfo));
  },

  checkLogin() {
    if (!this.globalData.token) {
      wx.navigateTo({ url: '/pages/auth/auth' });
      return false;
    }
    return true;
  },

  logout() {
    this.globalData.token = '';
    this.globalData.userInfo = null;
    wx.removeStorageSync('agentToken');
    wx.removeStorageSync('agentUserInfo');
  }
});
