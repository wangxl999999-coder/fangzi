const app = getApp();
const api = require('../../utils/api');

Page({
  data: {
    activeType: 'all',
    houseList: [],
    page: 1,
    pageSize: 10,
    loading: false,
    noMore: false
  },

  onLoad() {
    this.loadFavorites();
  },

  onShow() {
    this.setData({ page: 1, houseList: [], noMore: false });
    this.loadFavorites();
  },

  onPullDownRefresh() {
    this.setData({ page: 1, houseList: [], noMore: false });
    this.loadFavorites().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadFavorites() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const result = await api.house.getFavorites({
        page: this.data.page,
        pageSize: this.data.pageSize,
        type: this.data.activeType === 'all' ? undefined : this.data.activeType
      });
      
      const newList = this.data.page === 1 ? result.list : [...this.data.houseList, ...result.list];
      
      this.setData({
        houseList: newList,
        noMore: result.list.length < this.data.pageSize
      });
    } catch (err) {
      console.error('加载收藏列表失败:', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  loadMore() {
    if (this.data.loading || this.data.noMore) return;
    this.setData({ page: this.data.page + 1 });
    this.loadFavorites();
  },

  switchType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ activeType: type, page: 1, houseList: [], noMore: false });
    this.loadFavorites();
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/house-detail/house-detail?id=${id}`
    });
  },

  async removeFavorite(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '提示',
      content: '确定取消收藏吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.house.toggleFavorite({ houseId: id });
            const newList = this.data.houseList.filter(item => item._id !== id);
            this.setData({ houseList: newList });
            wx.showToast({ title: '已取消收藏', icon: 'success' });
          } catch (err) {
            console.error('取消收藏失败:', err);
          }
        }
      }
    });
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' });
  }
});
