const api = require('../../utils/api');

Page({
  data: {
    houseList: [],
    groupedList: [],
    totalCount: 0,
    page: 1,
    pageSize: 20,
    loading: false,
    noMore: false
  },

  onLoad() {
    this.loadHistory();
  },

  onPullDownRefresh() {
    this.setData({ page: 1, houseList: [], noMore: false });
    this.loadHistory().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadHistory() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const result = await api.house.getViewHistory({
        page: this.data.page,
        pageSize: this.data.pageSize
      });
      
      const newList = this.data.page === 1 ? result.list : [...this.data.houseList, ...result.list];
      const groupedList = this.groupByDate(newList);
      
      this.setData({
        houseList: newList,
        groupedList,
        totalCount: result.total || newList.length,
        noMore: result.list.length < this.data.pageSize
      });
    } catch (err) {
      console.error('加载浏览历史失败:', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  loadMore() {
    if (this.data.loading || this.data.noMore) return;
    this.setData({ page: this.data.page + 1 });
    this.loadHistory();
  },

  groupByDate(list) {
    const groups = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    list.forEach(item => {
      const date = new Date(item.viewedAt || item.createdAt);
      let dateStr;
      
      if (date.toDateString() === today.toDateString()) {
        dateStr = '今天';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateStr = '昨天';
      } else {
        dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
      }
      
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(item);
    });
    
    return Object.keys(groups).map(date => ({
      date,
      list: groups[date]
    }));
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/house-detail/house-detail?id=${id}`
    });
  },

  clearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定清空浏览历史吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.house.clearViewHistory();
            this.setData({ houseList: [], groupedList: [], totalCount: 0 });
            wx.showToast({ title: '已清空', icon: 'success' });
          } catch (err) {
            console.error('清空历史失败:', err);
          }
        }
      }
    });
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' });
  }
});
