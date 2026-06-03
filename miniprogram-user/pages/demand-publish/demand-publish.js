const app = getApp();
const api = require('../../utils/api');

Page({
  data: {
    demandType: 'rent',
    bedroomOptions: ['1室', '2室', '3室', '4室', '5室+'],
    selectedBedrooms: [],
    areaOptions: ['不限', '50以下', '50-70', '70-90', '90-120', '120-140', '140以上'],
    minAreaIndex: 0,
    maxAreaIndex: 0,
    regionOptions: [
      ['不限', 'A区', 'B区', 'C区', 'D区'],
      ['不限', '商圈1', '商圈2', '商圈3']
    ],
    regionIndex: [0, 0],
    regionText: '',
    featureOptions: ['近地铁', '精装修', '有电梯', '带车位', '拎包入住', '南北通透'],
    form: {
      minPrice: '',
      maxPrice: '',
      moveDate: '',
      features: [],
      description: ''
    }
  },

  onLoad(options) {
    if (options.type) {
      this.setData({ demandType: options.type });
    }
  },

  switchType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ demandType: type });
  },

  toggleBedroom(e) {
    const value = e.currentTarget.dataset.value;
    const selected = [...this.data.selectedBedrooms];
    const index = selected.indexOf(value);
    
    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(value);
    }
    
    this.setData({ selectedBedrooms: selected });
  },

  onMinAreaChange(e) {
    this.setData({ minAreaIndex: parseInt(e.detail.value) });
  },

  onMaxAreaChange(e) {
    this.setData({ maxAreaIndex: parseInt(e.detail.value) });
  },

  onRegionChange(e) {
    const index = e.detail.value;
    const regionText = this.data.regionOptions[0][index[0]] + ' ' + this.data.regionOptions[1][index[1]];
    this.setData({ 
      regionIndex: index,
      regionText: regionText === '不限 不限' ? '不限' : regionText
    });
  },

  onMoveDateChange(e) {
    this.setData({ 'form.moveDate': e.detail.value });
  },

  toggleFeature(e) {
    const value = e.currentTarget.dataset.value;
    const features = [...this.data.form.features];
    const index = features.indexOf(value);
    
    if (index > -1) {
      features.splice(index, 1);
    } else {
      features.push(value);
    }
    
    this.setData({ 'form.features': features });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`form.${field}`]: e.detail.value
    });
  },

  async submit() {
    if (!app.checkLogin()) return;

    if (this.data.selectedBedrooms.length === 0) {
      wx.showToast({ title: '请选择期望户型', icon: 'none' });
      return;
    }

    try {
      await api.demand.create({
        type: this.data.demandType,
        bedrooms: this.data.selectedBedrooms,
        minArea: this.data.areaOptions[this.data.minAreaIndex],
        maxArea: this.data.areaOptions[this.data.maxAreaIndex],
        minPrice: this.data.form.minPrice,
        maxPrice: this.data.form.maxPrice,
        region: this.data.regionText,
        moveDate: this.data.form.moveDate,
        features: this.data.form.features,
        description: this.data.form.description
      });

      wx.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (err) {
      console.error('发布失败:', err);
      wx.showToast({ title: '发布失败，请重试', icon: 'none' });
    }
  }
});
