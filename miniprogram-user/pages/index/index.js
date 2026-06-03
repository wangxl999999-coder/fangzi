const app = getApp();
const api = require('../../utils/api');

Page({
  data: {
    currentCity: '北京',
    banners: [],
    categories: [],
    specialHouses: [],
    newHouses: [],
    hotCommunities: [],
    recommendHouses: [],
    showSearch: false,
    searchKeyword: '',
    searchResults: [],
    hotSearches: ['精装修', '近地铁', '学区房', '低总价', '南北通透', '拎包入住'],
    page: 1,
    pageSize: 10,
    loading: false,
    noMore: false
  },

  onLoad() {
    this.setData({
      currentCity: app.globalData.currentCity
    });
    this.loadHomeData();
  },

  onShow() {
    if (this.data.currentCity !== app.globalData.currentCity) {
      this.setData({
        currentCity: app.globalData.currentCity
      });
      this.loadHomeData();
    }
  },

  async loadHomeData() {
    try {
      const [homeData, specialHouses, newHouses, hotCommunities, recommendHouses] = await Promise.all([
        api.marketing.getHomeData({ city: this.data.currentCity }),
        api.house.getSpecial({ city: this.data.currentCity, limit: 10 }),
        api.house.getNew({ city: this.data.currentCity, limit: 10 }),
        api.community.getHot({ city: this.data.currentCity, limit: 5 }),
        api.house.getList({ city: this.data.currentCity, page: 1, pageSize: 5, sort: 'latest' })
      ]);

      this.setData({
        banners: homeData.banners,
        categories: homeData.categories,
        specialHouses,
        newHouses,
        hotCommunities,
        recommendHouses: recommendHouses.list
      });
    } catch (err) {
      console.error('加载首页数据失败:', err);
    }
  },

  onPullDownRefresh() {
    this.loadHomeData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    this.loadMore();
  },

  async loadMore() {
    if (this.data.loading || this.data.noMore) return;

    this.setData({ loading: true });

    try {
      const nextPage = this.data.page + 1;
      const result = await api.house.getList({
        city: this.data.currentCity,
        page: nextPage,
        pageSize: this.data.pageSize,
        sort: 'latest'
      });

      if (result.list.length === 0) {
        this.setData({ noMore: true });
      } else {
        this.setData({
          page: nextPage,
          recommendHouses: [...this.data.recommendHouses, ...result.list]
        });
      }
    } catch (err) {
      console.error('加载更多失败:', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  goCitySelect() {
    wx.navigateTo({
      url: '/pages/city-select/city-select'
    });
  },

  goSearch() {
    this.setData({ showSearch: true });
  },

  closeSearch() {
    this.setData({ showSearch: false });
  },

  stopPropagation() {
    // 阻止事件冒泡
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
    if (e.detail.value) {
      this.doSearch();
    }
  },

  async doSearch() {
    if (!this.data.searchKeyword) return;

    try {
      const result = await api.house.getList({
        keyword: this.data.searchKeyword,
        city: this.data.currentCity,
        page: 1,
        pageSize: 10
      });
      this.setData({ searchResults: result.list });
    } catch (err) {
      console.error('搜索失败:', err);
    }
  },

  onHotSearch(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ searchKeyword: keyword });
    this.doSearch();
  },

  clearSearch() {
    this.setData({
      searchKeyword: '',
      searchResults: []
    });
  },

  goBannerDetail(e) {
    const item = e.currentTarget.dataset.item;
    if (item.linkType === 'house' && item.linkId) {
      this.goHouseDetail({ currentTarget: { dataset: { id: item.linkId } } });
    } else if (item.linkUrl) {
      wx.navigateTo({
        url: '/pages/webview/webview?url=' + encodeURIComponent(item.linkUrl)
      });
    }
  },

  goCategory(e) {
    const item = e.currentTarget.dataset.item;
    let type = '';
    if (item.id === 'rent_whole' || item.id === 'rent_share') {
      type = item.id;
    } else {
      type = item.id;
    }
    wx.navigateTo({
      url: `/pages/house-list/house-list?type=${type}`
    });
  },

  goList(e) {
    const type = e.currentTarget.dataset.type;
    let url = '/pages/house-list/house-list';
    if (type === 'special') {
      url += '?isSpecial=1';
    } else if (type === 'new') {
      url += '?isNew=1';
    }
    wx.navigateTo({ url });
  },

  goCommunityList() {
    wx.navigateTo({
      url: '/pages/community-list/community-list'
    });
  },

  goHouseDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/house-detail/house-detail?id=${id}`
    });
  },

  goCommunityDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/community-detail/community-detail?id=${id}`
    });
  }
});
