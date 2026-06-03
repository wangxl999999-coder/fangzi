const app = getApp();
const api = require('../../utils/api');

Page({
  data: {
    house: {},
    currentImageIndex: 0,
    activeTab: 'image',
    isFavorite: false,
    showPreview: false,
    previewIndex: 0,
    showAppointment: false,
    showFullDesc: false,
    appointmentForm: {
      name: '',
      phone: '',
      date: '',
      time: '',
      remark: ''
    },
    facilityIcons: {
      '空调': '❄️',
      '洗衣机': '🧺',
      '冰箱': '🧊',
      '电视': '📺',
      '热水器': '🚿',
      '宽带': '📶',
      '天然气': '🔥',
      '电梯': '🛗',
      '车位': '🚗',
      '沙发': '🛋️',
      '床': '🛏️',
      '衣柜': '🚪',
      '厨房': '🍳',
      '阳台': '🌻'
    }
  },

  onLoad(options) {
    this.houseId = options.id;
    this.loadHouseDetail();
    this.checkFavorite();
  },

  async loadHouseDetail() {
    try {
      const house = await api.house.getDetail(this.houseId);
      this.setData({ house });
    } catch (err) {
      console.error('加载房源详情失败:', err);
    }
  },

  async checkFavorite() {
    if (!app.globalData.token) return;
    
    try {
      const userInfo = app.globalData.userInfo;
      if (userInfo && userInfo.favorites) {
        const isFavorite = userInfo.favorites.includes(this.houseId);
        this.setData({ isFavorite });
      }
    } catch (err) {
      console.error('检查收藏状态失败:', err);
    }
  },

  onScroll() {
    // 滚动事件处理
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  previewImage(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      showPreview: true,
      previewIndex: index
    });
  },

  closePreview() {
    this.setData({ showPreview: false });
  },

  onPreviewChange(e) {
    this.setData({ previewIndex: e.detail.current });
  },

  formatTime(time) {
    if (!time) return '';
    const date = new Date(time);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return '今天发布';
    if (days === 1) return '昨天发布';
    if (days < 7) return `${days}天前发布`;
    if (days < 30) return `${Math.floor(days / 7)}周前发布`;
    if (days < 365) return `${Math.floor(days / 30)}个月前发布`;
    return `${Math.floor(days / 365)}年前发布`;
  },

  getFacilityIcon(facility) {
    return this.data.facilityIcons[facility] || '🏠';
  },

  toggleDesc() {
    this.setData({ showFullDesc: !this.data.showFullDesc });
  },

  async toggleFavorite() {
    if (!app.checkLogin()) return;

    try {
      const result = await api.house.toggleFavorite({ houseId: this.houseId });
      this.setData({ isFavorite: result.isFavorite });
      
      const userInfo = app.globalData.userInfo;
      if (result.isFavorite) {
        userInfo.favorites.push(this.houseId);
      } else {
        const index = userInfo.favorites.indexOf(this.houseId);
        if (index > -1) userInfo.favorites.splice(index, 1);
      }
      app.setUserInfo(userInfo);
      
      wx.showToast({
        title: result.isFavorite ? '收藏成功' : '已取消收藏',
        icon: 'success'
      });
    } catch (err) {
      console.error('操作收藏失败:', err);
    }
  },

  onShareAppMessage() {
    const house = this.data.house;
    return {
      title: house.title,
      path: `/pages/house-detail/house-detail?id=${this.houseId}`,
      imageUrl: house.images[0]
    };
  },

  onShareTimeline() {
    const house = this.data.house;
    return {
      title: house.title,
      imageUrl: house.images[0]
    };
  },

  callAgent() {
    const phone = this.data.house.contactPhone;
    if (!phone) return;
    
    wx.makePhoneCall({
      phoneNumber: phone,
      fail: () => {
        wx.showToast({
          title: '呼叫失败',
          icon: 'none'
        });
      }
    });
  },

  goAppointment() {
    if (!app.checkLogin()) return;
    
    const userInfo = app.globalData.userInfo;
    this.setData({
      showAppointment: true,
      'appointmentForm.name': userInfo?.nickname || '',
      'appointmentForm.phone': userInfo?.phone || ''
    });
  },

  closeAppointment() {
    this.setData({ showAppointment: false });
  },

  stopPropagation() {
    // 阻止事件冒泡
  },

  onAppointmentInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`appointmentForm.${field}`]: e.detail.value
    });
  },

  onDateChange(e) {
    this.setData({ 'appointmentForm.date': e.detail.value });
  },

  onTimeChange(e) {
    this.setData({ 'appointmentForm.time': e.detail.value });
  },

  async submitAppointment() {
    const form = this.data.appointmentForm;
    
    if (!form.name) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    if (!form.phone || !/^1[3-9]\d{9}$/.test(form.phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    if (!form.date) {
      wx.showToast({ title: '请选择日期', icon: 'none' });
      return;
    }
    if (!form.time) {
      wx.showToast({ title: '请选择时间', icon: 'none' });
      return;
    }

    try {
      await api.message.createAppointment({
        houseId: this.houseId,
        agentId: this.data.house.owner._id,
        name: form.name,
        phone: form.phone,
        date: form.date,
        time: form.time,
        remark: form.remark
      });

      wx.showToast({ title: '预约成功', icon: 'success' });
      this.setData({ showAppointment: false });
    } catch (err) {
      console.error('提交预约失败:', err);
    }
  },

  goCommunityDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.navigateTo({
      url: `/pages/community-detail/community-detail?id=${id}`
    });
  },

  openMap() {
    const house = this.data.house;
    const location = house.location;
    
    if (location && location.lat && location.lng) {
      wx.openLocation({
        latitude: location.lat,
        longitude: location.lng,
        name: house.communityName || house.title,
        address: house.address,
        scale: 18
      });
    } else {
      wx.chooseLocation({
        success: () => {},
        fail: () => {
          wx.showToast({ title: '无法获取位置', icon: 'none' });
        }
      });
    }
  }
});
