const app = getApp();
const api = require('../../utils/api');

Page({
  data: {
    form: {
      phone: '',
      code: ''
    },
    agreed: false,
    countdown: 0
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`form.${field}`]: e.detail.value
    });
  },

  toggleAgree() {
    this.setData({ agreed: !this.data.agreed });
  },

  async sendCode() {
    const { phone } = this.data.form;
    
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
      wx.showToast({ title: '发送失败，请重试', icon: 'none' });
    }
  },

  async login() {
    const { phone, code } = this.data.form;
    
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    if (!code || code.length !== 6) {
      wx.showToast({ title: '请输入6位验证码', icon: 'none' });
      return;
    }
    if (!this.data.agreed) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' });
      return;
    }

    try {
      const result = await api.auth.login({ phone, code });
      app.setToken(result.token);
      app.setUserInfo(result.user);
      
      wx.showToast({ title: '登录成功', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
    } catch (err) {
      console.error('登录失败:', err);
      wx.showToast({ title: '登录失败，请重试', icon: 'none' });
    }
  },

  async wxLogin() {
    try {
      const wxInfo = await wx.login();
      const result = await api.auth.wxLogin({ code: wxInfo.code });
      app.setToken(result.token);
      app.setUserInfo(result.user);
      
      wx.showToast({ title: '登录成功', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
    } catch (err) {
      console.error('微信登录失败:', err);
      wx.showToast({ title: '微信登录失败', icon: 'none' });
    }
  }
});
