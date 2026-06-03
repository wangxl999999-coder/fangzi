const app = getApp();
const api = require('../../utils/api');

Page({
  data: {
    searchKeyword: '',
    locationCity: null,
    hotCities: [],
    allCities: [],
    groupedCities: [],
    letters: []
  },

  onLoad() {
    this.loadCities();
  },

  async loadCities() {
    try {
      const result = await api.city.getList();
      
      const hotCities = result.filter(c => c.isHot).slice(0, 8);
      const groupedCities = this.groupByLetter(result);
      const letters = groupedCities.map(g => g.letter);
      
      this.setData({ 
        hotCities, 
        allCities: result,
        groupedCities,
        letters
      });
    } catch (err) {
      console.error('加载城市列表失败:', err);
      const mockCities = [
        { name: '北京', pinyin: 'beijing', isHot: true },
        { name: '上海', pinyin: 'shanghai', isHot: true },
        { name: '广州', pinyin: 'guangzhou', isHot: true },
        { name: '深圳', pinyin: 'shenzhen', isHot: true },
        { name: '杭州', pinyin: 'hangzhou', isHot: true },
        { name: '成都', pinyin: 'chengdu', isHot: true },
        { name: '武汉', pinyin: 'wuhan', isHot: true },
        { name: '西安', pinyin: 'xian', isHot: true },
        { name: '南京', pinyin: 'nanjing', isHot: false },
        { name: '重庆', pinyin: 'chongqing', isHot: false },
        { name: '苏州', pinyin: 'suzhou', isHot: false },
        { name: '天津', pinyin: 'tianjin', isHot: false }
      ];
      const hotCities = mockCities.filter(c => c.isHot);
      const groupedCities = this.groupByLetter(mockCities);
      const letters = groupedCities.map(g => g.letter);
      
      this.setData({ 
        hotCities, 
        allCities: mockCities,
        groupedCities,
        letters
      });
    }
  },

  groupByLetter(cities) {
    const groups = {};
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    cities.forEach(city => {
      const letter = (city.pinyin || city.name).charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(city);
    });

    return letters
      .filter(letter => groups[letter])
      .map(letter => ({
        letter,
        list: groups[letter]
      }));
  },

  onSearch(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
    
    if (!keyword) {
      const groupedCities = this.groupByLetter(this.data.allCities);
      this.setData({ groupedCities, letters: groupedCities.map(g => g.letter) });
      return;
    }

    const filtered = this.data.allCities.filter(c => 
      c.name.includes(keyword) || c.pinyin?.toLowerCase().includes(keyword.toLowerCase())
    );
    const groupedCities = this.groupByLetter(filtered);
    this.setData({ groupedCities, letters: groupedCities.map(g => g.letter) });
  },

  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        app.getLocationByCoords(res.latitude, res.longitude).then(city => {
          this.setData({ locationCity: city });
        }).catch(() => {
          this.setData({ locationCity: { name: '北京市' } });
        });
      },
      fail: () => {
        wx.showToast({ title: '定位失败，请手动选择', icon: 'none' });
      }
    });
  },

  selectCity(e) {
    const city = e.currentTarget.dataset.city;
    app.setCurrentCity(city.name);
    wx.showToast({ title: `已切换到${city.name}`, icon: 'success' });
    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  },

  scrollToLetter(e) {
    const letter = e.currentTarget.dataset.letter;
    wx.pageScrollTo({
      selector: `#letter-${letter}`,
      duration: 300
    });
  }
});
