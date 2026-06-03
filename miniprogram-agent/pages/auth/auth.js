const app = getApp();
const api = require('../../utils/api');

Page({
  data: {
    isLoggedIn: false,
    authStatus: 'none',
    loginForm: {
      phone: '',
      code: ''
    },
    authForm: {
      realName: '',
      idCard: '',
      idCardFront: '',
      idCardBack: '',
      company: '',
      certificateNo: '',
      qualification: ''
    },
    countdown: 0
  },

  onLoad() {
    this.checkLoginStatus();
  },

  checkLoginStatus() {
    const isLoggedIn = !!app.globalData.token;
    const authStatus = app.globalData.userInfo?.authStatus || 'none';
    this.setData({ isLoggedIn, authStatus });
    
    if (isLoggedIn && authStatus === 'none') {
      this.loadAuthStatus();
    }
  },

  async loadAuthStatus() {
    try {
      const result = await api.auth.getStatus();
      this.setData({ authStatus: result.status });
    } catch (err) {
      console.error('加载认证状态失败:', err);
    }
  },

  onLoginInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`loginForm.${field}`]: e.detail.value
    });
  },

  onAuthInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`authForm.${field}`]: e.detail.value
    });
  },

  async sendCode() {
    const { phone } = this.data.loginForm;
    
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }

    try {
      await api.auth.sendCode({ phone });
      wx.showToast({ title: '验证码已发送', icon: 'success' });
      
      this.setData({ countdown: 60 });
      const timer = setInterval(() => {
        if (this.data.countdown > 0) {
          this.setData({ countdown: this.data.countdown - 1 });
        } else {
          clearInterval(timer);
        }
      }, 1000);
    } catch (err) {
      console.error('发送验证码失败:', err);
      wx.showToast({ title: '发送失败', icon: 'none' });
    }
  },

  async login() {
    const { phone, code } = this.data.loginForm;
    
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    if (!code || code.length !== 6) {
      wx.showToast({ title: '请输入验证码', icon: 'none' });
      return;
    }

    try {
      const result = await api.auth.login({ phone, code, role: 'agent' });
      app.setToken(result.token);
      app.setUserInfo(result.user);
      
      this.setData({ 
        isLoggedIn: true,
        authStatus: result.user.authStatus || 'none'
      });
      
      wx.showToast({ title: '登录成功', icon: 'success' });
    } catch (err) {
      console.error('登录失败:', err);
      wx.showToast({ title: '登录失败', icon: 'none' });
    }
  },

  uploadImage(e) {
    const field = e.currentTarget.dataset.field;
    
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          [`authForm.${field}`]: res.tempFilePaths[0]
        });
      }
    });
  },

  async submitAuth() {
    const { realName, idCard, idCardFront, idCardBack, company } = this.data.authForm;
    
    if (!realName) {
      wx.showToast({ title: '请输入真实姓名', icon: 'none' });
      return;
    }
    if (!idCard || idCard.length !== 18) {
      wx.showToast({ title: '请输入正确的身份证号', icon: 'none' });
      return;
    }
    if (!idCardFront) {
      wx.showToast({ title: '请上传身份证正面', icon: 'none' });
      return;
    }
    if (!idCardBack) {
      wx.showToast({ title: '请上传身份证反面', icon: 'none' });
      return;
    }
    if (!company) {
      wx.showToast({ title: '请输入所属公司', icon: 'none' });
      return;
    }

    try {
      await api.auth.submitAuth(this.data.authForm);
      this.setData({ authStatus: 'pending' });
      wx.showToast({ title: '提交成功，等待审核', icon: 'success' });
    } catch (err) {
      console.error('提交认证失败:', err);
      wx.showToast({ title: '提交失败', icon: 'none' });
    }
  },

  getStatusIcon(status) {
    const icons = {
      pending: '⏳',
      approved: '✅',
      rejected: '❌',
      none: '📋'
    };
    return icons[status] || icons.none;
  },

  getStatusText(status) {
    const texts = {
      pending: '认证审核中',
      approved: '已认证',
      rejected: '认证失败',
      none: '未认证'
    };
    return texts[status] || '未认证';
  }
});
