const app = getApp();
const api = require('../../utils/api');

Page({
  data: {
    activeTab: 'appointment',
    messageList: [],
    page: 1,
    pageSize: 20,
    loading: false,
    noMore: false
  },

  onLoad() {
    this.loadMessages();
  },

  onShow() {
    this.setData({ page: 1, messageList: [], noMore: false });
    this.loadMessages();
  },

  async loadMessages() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const result = await api.message.getList({
        page: this.data.page,
        pageSize: this.data.pageSize,
        type: this.data.activeTab
      });
      
      const list = result.list.map(item => ({
        ...item,
        time: this.formatTime(item.createdAt)
      }));
      
      const newList = this.data.page === 1 ? list : [...this.data.messageList, ...list];
      
      this.setData({
        messageList: newList,
        noMore: result.list.length < this.data.pageSize
      });
    } catch (err) {
      console.error('加载消息失败:', err);
      const mockList = [
        { _id: '1', type: 'appointment', title: '新的看房预约', content: '王先生预约了万科城房源看房', time: '10分钟前', read: false, houseTitle: '万科城三室两厅', userName: '王先生' },
        { _id: '2', type: 'inquiry', title: '房源咨询', content: '李女士咨询碧桂园房源价格信息', time: '1小时前', read: true, houseTitle: '碧桂园精装两室' }
      ];
      this.setData({ messageList: mockList, noMore: true });
    } finally {
      this.setData({ loading: false });
    }
  },

  loadMore() {
    if (this.data.loading || this.data.noMore) return;
    this.setData({ page: this.data.page + 1 });
    this.loadMessages();
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab, page: 1, messageList: [], noMore: false });
    this.loadMessages();
  },

  async viewMessage(e) {
    const id = e.currentTarget.dataset.id;
    
    try {
      await api.message.markRead(id);
      const newList = this.data.messageList.map(m => 
        m._id === id ? { ...m, read: true } : m
      );
      this.setData({ messageList: newList });
    } catch (err) {
      console.error('标记已读失败:', err);
    }
  },

  formatTime(time) {
    const date = new Date(time);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },

  getTypeIcon(type) {
    const icons = {
      appointment: '📅',
      inquiry: '💬',
      system: '🔔',
      default: '📬'
    };
    return icons[type] || icons.default;
  }
});
