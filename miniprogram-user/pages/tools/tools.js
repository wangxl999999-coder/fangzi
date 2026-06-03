Page({
  goTool(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({ url });
  }
});
