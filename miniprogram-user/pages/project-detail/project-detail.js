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
    if (this.data.project.contactPhone) {
      wx.makePhoneCall({
        phoneNumber: this.data.project.contactPhone
      });
    }
  },

  goAppointment() {
    wx.showToast({ title: '预约功能', icon: 'none' });
  }
});
