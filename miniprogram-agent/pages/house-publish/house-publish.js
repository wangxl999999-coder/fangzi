const app = getApp();
const api = require('../../utils/api');

Page({
  data: {
    form: {
      type: 'rent',
      title: '',
      communityName: '',
      address: '',
      bedrooms: 3,
      livingrooms: 2,
      bathrooms: 1,
      area: '',
      price: '',
      priceUnit: 'month',
      floor: '',
      orientation: '',
      decoration: '',
      buildYear: '',
      facilities: [],
      features: [],
      description: '',
      contactName: '',
      contactPhone: '',
      images: []
    },
    bedroomOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    livingroomOptions: ['0', '1', '2', '3', '4'],
    bathroomOptions: ['1', '2', '3', '4'],
    bedroomIndex: 2,
    livingroomIndex: 2,
    bathroomIndex: 0,
    priceUnitOptions: ['元/月', '万元'],
    priceUnitIndex: 0,
    orientationOptions: ['东', '南', '西', '北', '南北', '东南', '西南', '东北', '西北'],
    orientationIndex: -1,
    decorationOptions: ['毛坯', '简装', '精装', '豪装'],
    decorationIndex: -1,
    facilityOptions: ['空调', '洗衣机', '冰箱', '电视', '热水器', '宽带', '天然气', '电梯', '车位', '沙发', '床', '衣柜'],
    featureOptions: ['近地铁', '学区房', '拎包入住', '南北通透', '采光好', '精装修', '新上房源', '随时看房']
  },

  onLoad(options) {
    if (options.id) {
      this.loadHouse(options.id);
    }
  },

  async loadHouse(id) {
    try {
      const house = await api.house.getDetail(id);
      this.setData({ form: { ...this.data.form, ...house } });
    } catch (err) {
      console.error('加载房源失败:', err);
    }
  },

  selectType(e) {
    const type = e.currentTarget.dataset.type;
    const priceUnit = type === 'sale' || type === 'new' ? 'total' : 'month';
    const priceUnitIndex = priceUnit === 'total' ? 1 : 0;
    this.setData({ 
      'form.type': type,
      'form.priceUnit': priceUnit,
      priceUnitIndex
    });
  },

  chooseImage() {
    wx.chooseImage({
      count: 9 - this.data.form.images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const images = [...this.data.form.images, ...res.tempFilePaths];
        this.setData({ 'form.images': images });
      }
    });
  },

  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = [...this.data.form.images];
    images.splice(index, 1);
    this.setData({ 'form.images': images });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`form.${field}`]: e.detail.value
    });
  },

  onBedroomChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      bedroomIndex: index,
      'form.bedrooms': this.data.bedroomOptions[index]
    });
  },

  onLivingroomChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      livingroomIndex: index,
      'form.livingrooms': this.data.livingroomOptions[index]
    });
  },

  onBathroomChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      bathroomIndex: index,
      'form.bathrooms': this.data.bathroomOptions[index]
    });
  },

  onPriceUnitChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      priceUnitIndex: index,
      'form.priceUnit': index === 0 ? 'month' : 'total'
    });
  },

  onOrientationChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      orientationIndex: index,
      'form.orientation': this.data.orientationOptions[index]
    });
  },

  onDecorationChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      decorationIndex: index,
      'form.decoration': this.data.decorationOptions[index]
    });
  },

  toggleFacility(e) {
    const value = e.currentTarget.dataset.value;
    const facilities = [...this.data.form.facilities];
    const index = facilities.indexOf(value);
    
    if (index > -1) {
      facilities.splice(index, 1);
    } else {
      facilities.push(value);
    }
    
    this.setData({ 'form.facilities': facilities });
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

  validate() {
    const form = this.data.form;
    if (!form.title) {
      wx.showToast({ title: '请输入房源标题', icon: 'none' });
      return false;
    }
    if (!form.communityName) {
      wx.showToast({ title: '请输入小区名称', icon: 'none' });
      return false;
    }
    if (!form.address) {
      wx.showToast({ title: '请输入详细地址', icon: 'none' });
      return false;
    }
    if (!form.area) {
      wx.showToast({ title: '请输入面积', icon: 'none' });
      return false;
    }
    if (!form.price) {
      wx.showToast({ title: '请输入价格', icon: 'none' });
      return false;
    }
    if (form.images.length === 0) {
      wx.showToast({ title: '请上传房源图片', icon: 'none' });
      return false;
    }
    return true;
  },

  async saveDraft() {
    if (!app.checkLogin()) return;
    
    try {
      await api.house.create({
        ...this.data.form,
        status: 'draft'
      });
      wx.showToast({ title: '草稿已保存', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (err) {
      console.error('保存草稿失败:', err);
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  async submit() {
    if (!app.checkLogin()) return;
    if (!this.validate()) return;
    
    try {
      await api.house.create({
        ...this.data.form,
        status: 'pending'
      });
      wx.showToast({ title: '发布成功，等待审核', icon: 'success' });
      setTimeout(() => {
        wx.switchTab({ url: '/pages/house-manage/house-manage' });
      }, 1500);
    } catch (err) {
      console.error('发布失败:', err);
      wx.showToast({ title: '发布失败', icon: 'none' });
    }
  }
});
