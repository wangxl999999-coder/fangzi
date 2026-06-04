const app = getApp();
const api = require('../../utils/api');

Page({
  data: {
    activeStatus: 'all',
    houseList: [],
    page: 1,
    pageSize: 10,
    loading: false,
    noMore: false
  },

  onLoad() {
    this.loadHouseList();
  },

  onShow() {
    this.setData({ page: 1, houseList: [], noMore: false });
    this.loadHouseList();
  },

  onPullDownRefresh() {
    this.setData({ page: 1, houseList: [], noMore: false });
    this.loadHouseList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadHouseList() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      let status = this.data.activeStatus;
      if (status === 'all') {
        status = undefined;
      } else if (status === 'online') {
        status = 'approved';
      }
      
      const result = await api.house.getMyList({
        page: this.data.page,
        pageSize: this.data.pageSize,
        status
      });
      
      const mappedList = result.list.map(item => ({
        ...item,
        status: item.status === 'approved' ? 'online' : item.status
      }));
      
      const newList = this.data.page === 1 ? mappedList : [...this.data.houseList, ...mappedList];
      
      this.setData({
        houseList: newList,
        noMore: result.list.length < this.data.pageSize
      });
    } catch (err) {
      console.error('加载房源列表失败:', err);
      const mockList = [
        {
          _id: '1',
          title: '万科城精装三室两厅南北通透',
          status: 'online',
          bedrooms: 3,
          livingrooms: 2,
          area: 120,
          decoration: '精装修',
          address: 'A区科技路1号',
          price: '5800',
          priceUnit: 'month',
          images: ['https://via.placeholder.com/220x180'],
          viewCount: 256,
          favoriteCount: 23,
          createdAt: new Date()
        }
      ];
      this.setData({ houseList: mockList, noMore: true });
    } finally {
      this.setData({ loading: false });
    }
  },

  loadMore() {
    if (this.data.loading || this.data.noMore) return;
    this.setData({ page: this.data.page + 1 });
    this.loadHouseList();
  },

  switchStatus(e) {
    const status = e.currentTarget.dataset.status;
    this.setData({ activeStatus: status, page: 1, houseList: [], noMore: false });
    this.loadHouseList();
  },

  getStatusText(status) {
    const texts = {
      online: '已上架',
      offline: '已下架',
      pending: '待审核',
      rejected: '已拒绝'
    };
    return texts[status] || status;
  },

  formatDate(date) {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  },

  editHouse(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/house-edit/house-edit?id=${id}`
    });
  },

  async toggleOnline(e) {
    const id = e.currentTarget.dataset.id;
    const status = e.currentTarget.dataset.status;
    const action = status === 'online' ? 'offline' : 'online';
    
    try {
      if (action === 'online') {
        await api.house.online(id);
      } else {
        await api.house.offline(id);
      }
      
      const newList = this.data.houseList.map(item => 
        item._id === id ? { ...item, status: action } : item
      );
      this.setData({ houseList: newList });
      wx.showToast({ title: `已${action === 'online' ? '上架' : '下架'}`, icon: 'success' });
    } catch (err) {
      console.error('操作失败:', err);
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  deleteHouse(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '提示',
      content: '确定删除该房源吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.house.delete(id);
            const newList = this.data.houseList.filter(item => item._id !== id);
            this.setData({ houseList: newList });
            wx.showToast({ title: '已删除', icon: 'success' });
          } catch (err) {
            console.error('删除失败:', err);
            wx.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      }
    });
  },

  goPublish() {
    wx.navigateTo({
      url: '/pages/house-publish/house-publish'
    });
  }
});
