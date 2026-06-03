const app = getApp();
const api = require('../../utils/api');

Page({
  data: {
    projectList: [],
    page: 1,
    pageSize: 10,
    loading: false,
    noMore: false
  },

  onLoad() {
    this.loadProjectList();
  },

  onPullDownRefresh() {
    this.setData({ page: 1, projectList: [], noMore: false });
    this.loadProjectList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadProjectList() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const result = await api.project.getList({
        page: this.data.page,
        pageSize: this.data.pageSize,
        city: app.globalData.currentCity
      });
      
      const newList = this.data.page === 1 ? result.list : [...this.data.projectList, ...result.list];
      
      this.setData({
        projectList: newList,
        noMore: result.list.length < this.data.pageSize
      });
    } catch (err) {
      console.error('加载新房列表失败:', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  loadMore() {
    if (this.data.loading || this.data.noMore) return;
    this.setData({ page: this.data.page + 1 });
    this.loadProjectList();
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/project-detail/project-detail?id=${id}`
    });
  },

  toggleFilter() {
    wx.showToast({ title: '筛选功能', icon: 'none' });
  }
});
