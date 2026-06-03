const app = getApp();
const api = require('../../utils/api');

Page({
  data: {
    communities: [],
    selectedCommunity: null,
    form: {
      area: '',
      bedrooms: '3',
      floor: 'mid',
      decoration: 'fine'
    },
    result: {
      show: false
    }
  },

  onLoad() {
    this.loadCommunities();
  },

  async loadCommunities() {
    try {
      const result = await api.community.getList({ city: app.globalData.currentCity, pageSize: 50 });
      this.setData({ communities: result.list });
    } catch (err) {
      console.error('加载小区列表失败:', err);
      const mockCommunities = [
        { _id: '1', name: '万科城', averagePrice: 15000 },
        { _id: '2', name: '恒大华府', averagePrice: 18000 },
        { _id: '3', name: '碧桂园', averagePrice: 12000 },
        { _id: '4', name: '保利花园', averagePrice: 14000 }
      ];
      this.setData({ communities: mockCommunities });
    }
  },

  onCommunityChange(e) {
    const index = e.detail.value;
    this.setData({
      selectedCommunity: this.data.communities[index]
    });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`form.${field}`]: e.detail.value
    });
  },

  selectBedroom(e) {
    this.setData({ 'form.bedrooms': e.currentTarget.dataset.value });
  },

  selectFloor(e) {
    this.setData({ 'form.floor': e.currentTarget.dataset.value });
  },

  selectDecoration(e) {
    this.setData({ 'form.decoration': e.currentTarget.dataset.value });
  },

  estimate() {
    if (!this.data.selectedCommunity) {
      wx.showToast({ title: '请选择小区', icon: 'none' });
      return;
    }
    if (!this.data.form.area || this.data.form.area <= 0) {
      wx.showToast({ title: '请输入房屋面积', icon: 'none' });
      return;
    }

    const basePrice = this.data.selectedCommunity.averagePrice || 15000;
    const area = parseFloat(this.data.form.area);
    
    let floorAdjust = 1.0;
    if (this.data.form.floor === 'low') floorAdjust = 0.95;
    if (this.data.form.floor === 'high') floorAdjust = 1.05;
    
    let decoAdjust = 1.0;
    if (this.data.form.decoration === 'simple') decoAdjust = 1.05;
    if (this.data.form.decoration === 'fine') decoAdjust = 1.15;
    
    let bedroomAdjust = 1.0;
    if (this.data.form.bedrooms === '2') bedroomAdjust = 1.02;
    if (this.data.form.bedrooms === '3') bedroomAdjust = 1.05;
    if (this.data.form.bedrooms === '4') bedroomAdjust = 1.08;

    const unitPrice = Math.round(basePrice * floorAdjust * decoAdjust * bedroomAdjust);
    const totalPrice = (unitPrice * area / 10000).toFixed(1);
    const minPrice = (parseFloat(totalPrice) * 0.95).toFixed(1);
    const maxPrice = (parseFloat(totalPrice) * 1.05).toFixed(1);
    
    const conditionScore = Math.round((decoAdjust * 0.5 + floorAdjust * 0.3 + bedroomAdjust * 0.2) * 100);

    this.setData({
      'result.show': true,
      'result.unitPrice': unitPrice.toLocaleString(),
      'result.totalPrice': totalPrice,
      'result.minPrice': minPrice,
      'result.maxPrice': maxPrice,
      'result.conditionScore': conditionScore
    });
  }
});
