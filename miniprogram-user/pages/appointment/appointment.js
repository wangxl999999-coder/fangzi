const api = require('../../utils/api');

Page({
  data: {
    activeTab: 'pending',
    appointmentList: [],
    page: 1,
    pageSize: 10,
    loading: false,
    noMore: false
  },

  onLoad() {
    this.loadAppointments();
  },

  onShow() {
    this.setData({ page: 1, appointmentList: [], noMore: false });
    this.loadAppointments();
  },

  onPullDownRefresh() {
    this.setData({ page: 1, appointmentList: [], noMore: false });
    this.loadAppointments().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadAppointments() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const result = await api.message.getAppointments({
        page: this.data.page,
        pageSize: this.data.pageSize,
        status: this.data.activeTab
      });
      
      const newList = this.data.page === 1 ? result.list : [...this.data.appointmentList, ...result.list];
      
      this.setData({
        appointmentList: newList,
        noMore: result.list.length < this.data.pageSize
      });
    } catch (err) {
      console.error('加载预约列表失败:', err);
      const mockList = [
        {
          _id: '1',
          status: 'pending',
          date: '2024-06-05',
          time: '14:00',
          houseTitle: '万科城精装三室两厅',
          housePrice: '180',
          priceUnit: 'total',
          houseAddress: 'A区科技路1号',
          houseImage: 'https://via.placeholder.com/180x135',
          agentName: '张经理',
          agentPhone: '13800138000'
        }
      ];
      this.setData({ appointmentList: mockList, noMore: true });
    } finally {
      this.setData({ loading: false });
    }
  },

  loadMore() {
    if (this.data.loading || this.data.noMore) return;
    this.setData({ page: this.data.page + 1 });
    this.loadAppointments();
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab, page: 1, appointmentList: [], noMore: false });
    this.loadAppointments();
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

  goHouseDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/house-detail/house-detail?id=${id}`
    });
  },

  callAgent(e) {
    const phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({ phoneNumber: phone });
  },

  async cancelAppointment(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '提示',
      content: '确定取消预约吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.message.cancelAppointment({ id });
            const newList = this.data.appointmentList.map(item => 
              item._id === id ? { ...item, status: 'cancelled' } : item
            );
            this.setData({ appointmentList: newList });
            wx.showToast({ title: '已取消', icon: 'success' });
          } catch (err) {
            console.error('取消预约失败:', err);
          }
        }
      }
    });
  },

  async completeAppointment(e) {
    const id = e.currentTarget.dataset.id;
    
    try {
      await api.message.completeAppointment({ id });
      const newList = this.data.appointmentList.map(item => 
        item._id === id ? { ...item, status: 'completed' } : item
      );
      this.setData({ appointmentList: newList });
      wx.showToast({ title: '已完成', icon: 'success' });
    } catch (err) {
      console.error('确认完成失败:', err);
    }
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' });
  }
});
