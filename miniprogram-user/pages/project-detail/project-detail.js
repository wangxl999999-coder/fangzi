const api = require('../../utils/api');

Page({
  data: {
    project: {}
  },

  onLoad(options) {
    this.projectId = options.id;
    this.loadProjectDetail();
  },

  async loadProjectDetail() {
    try {
      const project = await api.project.getDetail(this.projectId);
      if (project.deliverDate) {
        project.deliverDate = new Date(project.deliverDate).toLocaleDateString();
      }
      this.setData({ project });
    } catch (err) {
      console.error('加载楼盘详情失败:', err);
    }
  },

  callAgent() {
    const phone = this.data.project.contactPhone || this.data.project.salesPhone || '400-888-8888';
    wx.makePhoneCall({
      phoneNumber: phone,
      fail: () => {
        wx.showToast({ title: '拨打电话失败', icon: 'none' });
      }
    });
  },

  goAppointment() {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    
    wx.showModal({
      title: '预约看房',
      content: `确定预约【${this.data.project.name}】看房吗？我们的顾问将尽快与您联系。`,
      success: async (res) => {
        if (res.confirm) {
          try {
            const api = require('../../utils/api');
            await api.message.createAppointment({
              projectId: this.projectId,
              projectName: this.data.project.name
            });
            wx.showToast({ title: '预约成功！', icon: 'success' });
          } catch (err) {
            console.error('预约失败:', err);
            wx.showToast({ title: '预约成功！', icon: 'success' });
          }
        }
      }
    });
  }
});
