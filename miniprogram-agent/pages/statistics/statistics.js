const api = require('../../utils/api');

Page({
  data: {
    dateType: 'week',
    overview: {
      totalViews: 1256,
      totalFavorites: 89,
      totalAppointments: 24,
      totalCalls: 36
    },
    trendData: [],
    houseRanking: []
  },

  onLoad() {
    this.loadData();
  },

  selectDate(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ dateType: type });
    this.loadData();
  },

  async loadData() {
    try {
      const overview = await api.statistics.getOverview();
      const trend = await api.statistics.getTrend({ type: this.data.dateType });
      const houseStats = await api.statistics.getHouseStats();
      
      this.setData({
        overview,
        trendData: trend.list,
        houseRanking: houseStats.ranking
      });
    } catch (err) {
      console.error('加载统计数据失败:', err);
      this.setData({
        trendData: [
          { date: '周一', value: 120, percent: 60 },
          { date: '周二', value: 180, percent: 80 },
          { date: '周三', value: 150, percent: 70 },
          { date: '周四', value: 220, percent: 95 },
          { date: '周五', value: 200, percent: 88 },
          { date: '周六', value: 240, percent: 100 },
          { date: '周日', value: 190, percent: 82 }
        ],
        houseRanking: [
          { _id: '1', title: '万科城精装三室', image: 'https://via.placeholder.com/100x75', views: 256, favorites: 32 },
          { _id: '2', title: '碧桂园精装两室', image: 'https://via.placeholder.com/100x75', views: 198, favorites: 24 },
          { _id: '3', title: '恒大华府大四居', image: 'https://via.placeholder.com/100x75', views: 156, favorites: 18 }
        ]
      });
    }
  }
});
