const app = getApp();

const request = (url, method = 'GET', data = {}, options = {}) => {
  return new Promise((resolve, reject) => {
    const header = {
      'content-type': 'application/json'
    };

    if (app.globalData.token && !options.noAuth) {
      header.Authorization = `Bearer ${app.globalData.token}`;
    }

    wx.showLoading({
      title: options.loadingText || '加载中...',
      mask: true
    });

    wx.request({
      url: app.globalData.baseUrl + url,
      method,
      data,
      header,
      success: (res) => {
        wx.hideLoading();
        
        if (res.statusCode === 200) {
          if (res.data.code === 200) {
            resolve(res.data.data);
          } else if (res.data.code === 401) {
            app.logout();
            if (!options.noRedirect) {
              wx.navigateTo({
                url: '/pages/login/login'
              });
            }
            reject(res.data);
          } else {
            if (!options.noToast) {
              wx.showToast({
                title: res.data.message || '请求失败',
                icon: 'none'
              });
            }
            reject(res.data);
          }
        } else {
          if (!options.noToast) {
            wx.showToast({
              title: '网络错误',
              icon: 'none'
            });
          }
          reject(res);
        }
      },
      fail: (err) => {
        wx.hideLoading();
        if (!options.noToast) {
          wx.showToast({
            title: '网络连接失败',
            icon: 'none'
          });
        }
        reject(err);
      }
    });
  });
};

const get = (url, data = {}, options = {}) => request(url, 'GET', data, options);
const post = (url, data = {}, options = {}) => request(url, 'POST', data, options);
const put = (url, data = {}, options = {}) => request(url, 'PUT', data, options);
const del = (url, data = {}, options = {}) => request(url, 'DELETE', data, options);

module.exports = {
  get,
  post,
  put,
  del,
  request
};
