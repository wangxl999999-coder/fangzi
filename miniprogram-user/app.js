App({
  globalData: {
    baseUrl: 'http://localhost:3001/api',
    token: '',
    userInfo: null,
    currentCity: '北京',
    location: null
  },

  onLaunch() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    const currentCity = wx.getStorageSync('currentCity');
    
    if (token) {
      this.globalData.token = token;
    }
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }
    if (currentCity) {
      this.globalData.currentCity = currentCity;
    } else {
      this.getLocation();
    }
  },

  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.globalData.location = {
          lat: res.latitude,
          lng: res.longitude
        };
        this.getCityByLocation(res.latitude, res.longitude);
      },
      fail: () => {
        console.log('获取位置失败，使用默认城市');
      }
    });
  },

  getCityByLocation(lat, lng) {
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        location: `${lat},${lng}`,
        key: 'OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77'
      },
      success: (res) => {
        if (res.data.status === 0) {
          const city = res.data.result.address_component.city.replace('市', '');
          this.globalData.currentCity = city;
          wx.setStorageSync('currentCity', city);
        }
      },
      fail: () => {
        console.log('逆地址解析失败');
      }
    });
  },

  setToken(token) {
    this.globalData.token = token;
    wx.setStorageSync('token', token);
  },

  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);
  },

  setCity(city) {
    this.globalData.currentCity = city;
    wx.setStorageSync('currentCity', city);
  },

  logout() {
    this.globalData.token = '';
    this.globalData.userInfo = null;
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
  },

  checkLogin() {
    if (!this.globalData.token) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
      return false;
    }
    return true;
  }
});
