const app = getApp();
const api = require('../../utils/api');

Page({
  data: {
    type: '',
    sort: 'latest',
    sortText: '最新发布',
    sortOptions: {
      'latest': '最新发布',
      'price_asc': '价格↑',
      'price_desc': '价格↓',
      'area': '面积↓',
      'distance': '距离最近'
    },
    sortActive: false,
    filterActive: {
      price: false,
      area: false,
      houseType: false
    },
    showSort: false,
    showFilter: {
      price: false,
      area: false,
      houseType: false
    },
    showMoreFilter: false,
    houseList: [],
    page: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    noMore: false,
    filters: {
      priceMin: null,
      priceMax: null,
      areaMin: null,
      areaMax: null,
      bedrooms: null,
      floor: [],
      decoration: [],
      facilities: [],
      propertyType: '',
      orientation: []
    },
    customPriceMin: '',
    customPriceMax: ''
  },

  onLoad(options) {
    if (options.type) {
      this.setData({ type: options.type });
      const titles = {
        'new': '新房',
        'secondhand': '二手房',
        'rent_whole': '整租',
        'rent_share': '合租',
        'shop': '商铺'
      };
      if (titles[options.type]) {
        wx.setNavigationBarTitle({ title: titles[options.type] });
      }
    }
    if (options.isSpecial) {
      wx.setNavigationBarTitle({ title: '特价捡漏' });
    }
    if (options.isNew) {
      wx.setNavigationBarTitle({ title: '新上房源' });
    }
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
      const params = {
        page: this.data.page,
        pageSize: this.data.pageSize,
        sort: this.data.sort,
        city: app.globalData.currentCity
      };

      if (this.data.type) params.type = this.data.type;
      if (this.data.filters.priceMin !== null) params.priceMin = this.data.filters.priceMin;
      if (this.data.filters.priceMax !== null) params.priceMax = this.data.filters.priceMax;
      if (this.data.filters.areaMin !== null) params.areaMin = this.data.filters.areaMin;
      if (this.data.filters.areaMax !== null) params.areaMax = this.data.filters.areaMax;
      if (this.data.filters.bedrooms !== null) params.bedrooms = this.data.filters.bedrooms;
      if (this.data.filters.floor.length > 0) params.floor = this.data.filters.floor.join(',');
      if (this.data.filters.decoration.length > 0) params.decoration = this.data.filters.decoration.join(',');
      if (this.data.filters.facilities.length > 0) params.facilities = this.data.filters.facilities.join(',');
      if (this.data.filters.propertyType) params.propertyType = this.data.filters.propertyType;
      if (this.data.filters.orientation.length > 0) params.orientation = this.data.filters.orientation.join(',');
      if (app.globalData.location) {
        params.lat = app.globalData.location.lat;
        params.lng = app.globalData.location.lng;
      }

      const result = await api.house.getList(params);
      
      const newList = this.data.page === 1 ? result.list : [...this.data.houseList, ...result.list];
      
      this.setData({
        houseList: newList,
        total: result.total,
        noMore: result.list.length < this.data.pageSize
      });
    } catch (err) {
      console.error('加载房源列表失败:', err);
    } finally {
      this.setData({ loading: false });
    }
  },

  loadMore() {
    if (this.data.loading || this.data.noMore) return;
    this.setData({ page: this.data.page + 1 });
    this.loadHouseList();
  },

  toggleSort() {
    const showSort = !this.data.showSort;
    this.setData({
      showSort,
      sortActive: showSort,
      showFilter: { price: false, area: false, houseType: false },
      filterActive: { price: false, area: false, houseType: false }
    });
  },

  toggleFilter(e) {
    const type = e.currentTarget.dataset.type;
    const show = !this.data.showFilter[type];
    
    this.setData({
      showSort: false,
      sortActive: false,
      showFilter: {
        price: type === 'price' ? show : false,
        area: type === 'area' ? show : false,
        houseType: type === 'houseType' ? show : false
      },
      filterActive: {
        price: type === 'price' ? show : false,
        area: type === 'area' ? show : false,
        houseType: type === 'houseType' ? show : false
      }
    });
  },

  closeDropdown() {
    this.setData({
      showSort: false,
      showFilter: { price: false, area: false, houseType: false },
      sortActive: false,
      filterActive: { price: false, area: false, houseType: false }
    });
  },

  selectSort(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({
      sort: value,
      sortText: this.data.sortOptions[value],
      page: 1,
      houseList: [],
      noMore: false
    });
    this.closeDropdown();
    this.loadHouseList();
  },

  selectPrice(e) {
    const min = e.currentTarget.dataset.min;
    const max = e.currentTarget.dataset.max;
    
    this.setData({
      filters: {
        ...this.data.filters,
        priceMin: min === '' ? null : Number(min),
        priceMax: max === '' ? null : Number(max)
      },
      customPriceMin: '',
      customPriceMax: '',
      page: 1,
      houseList: [],
      noMore: false
    });
    this.closeDropdown();
    this.loadHouseList();
  },

  onCustomPriceMin(e) {
    this.setData({ customPriceMin: e.detail.value });
  },

  onCustomPriceMax(e) {
    this.setData({ customPriceMax: e.detail.value });
  },

  applyCustomPrice() {
    const min = this.data.customPriceMin;
    const max = this.data.customPriceMax;
    
    this.setData({
      filters: {
        ...this.data.filters,
        priceMin: min ? Number(min) : null,
        priceMax: max ? Number(max) : null
      },
      page: 1,
      houseList: [],
      noMore: false
    });
    this.closeDropdown();
    this.loadHouseList();
  },

  selectArea(e) {
    const min = e.currentTarget.dataset.min;
    const max = e.currentTarget.dataset.max;
    
    this.setData({
      filters: {
        ...this.data.filters,
        areaMin: min === '' ? null : Number(min),
        areaMax: max === '' ? null : Number(max)
      },
      page: 1,
      houseList: [],
      noMore: false
    });
    this.closeDropdown();
    this.loadHouseList();
  },

  selectBedrooms(e) {
    const value = e.currentTarget.dataset.value;
    
    this.setData({
      filters: {
        ...this.data.filters,
        bedrooms: value === '' ? null : value
      },
      page: 1,
      houseList: [],
      noMore: false
    });
    this.closeDropdown();
    this.loadHouseList();
  },

  showMoreFilter() {
    this.setData({ showMoreFilter: true });
  },

  hideMoreFilter() {
    this.setData({ showMoreFilter: false });
  },

  stopPropagation() {
    // 阻止事件冒泡
  },

  toggleFloor(e) {
    const value = e.currentTarget.dataset.value;
    const floors = [...this.data.filters.floor];
    const index = floors.indexOf(value);
    
    if (index > -1) {
      floors.splice(index, 1);
    } else {
      floors.push(value);
    }
    
    this.setData({
      filters: { ...this.data.filters, floor: floors }
    });
  },

  toggleDecoration(e) {
    const value = e.currentTarget.dataset.value;
    const decorations = [...this.data.filters.decoration];
    const index = decorations.indexOf(value);
    
    if (index > -1) {
      decorations.splice(index, 1);
    } else {
      decorations.push(value);
    }
    
    this.setData({
      filters: { ...this.data.filters, decoration: decorations }
    });
  },

  toggleFacility(e) {
    const value = e.currentTarget.dataset.value;
    const facilities = [...this.data.filters.facilities];
    const index = facilities.indexOf(value);
    
    if (index > -1) {
      facilities.splice(index, 1);
    } else {
      facilities.push(value);
    }
    
    this.setData({
      filters: { ...this.data.filters, facilities: facilities }
    });
  },

  selectProperty(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({
      filters: {
        ...this.data.filters,
        propertyType: this.data.filters.propertyType === value ? '' : value
      }
    });
  },

  toggleOrientation(e) {
    const value = e.currentTarget.dataset.value;
    const orientations = [...this.data.filters.orientation];
    const index = orientations.indexOf(value);
    
    if (index > -1) {
      orientations.splice(index, 1);
    } else {
      orientations.push(value);
    }
    
    this.setData({
      filters: { ...this.data.filters, orientation: orientations }
    });
  },

  resetFilter() {
    this.setData({
      filters: {
        priceMin: null,
        priceMax: null,
        areaMin: null,
        areaMax: null,
        bedrooms: null,
        floor: [],
        decoration: [],
        facilities: [],
        propertyType: '',
        orientation: []
      },
      customPriceMin: '',
      customPriceMax: ''
    });
  },

  applyMoreFilter() {
    this.setData({
      showMoreFilter: false,
      page: 1,
      houseList: [],
      noMore: false
    });
    this.loadHouseList();
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/house-detail/house-detail?id=${id}`
    });
  }
});
