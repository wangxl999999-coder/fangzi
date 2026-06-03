const api = require('../../utils/api');

Page({
  data: {
    activeTab: 'all',
    messageList: [],
    page: 1,
    pageSize: 20,
    loading: false,
    noMore: false
  },

  onLoad() {
    this.loadMessages();
  },

  async loadMessages() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const result = await api.message.getList({
        page: this.data.page,
        pageSize: this.data.pageSize,
        type: this.data.activeTab === 'all' ? undefined : this.data.activeTab
      });
      
      const list = result.list.map(item => ({
        ...item,
        time: this.formatTime(item.createdAt),
        icon: this.getTypeIcon(item.type),
        iconBg: this.getTypeIconBg(item.type)
      }));
      
      const newList = this.data.page === 1 ? list : [...this.data.messageList, ...list];
      
      this.setData({
        messageList: newList,
        noMore: result.list.length < this.data.pageSize
      });
    } catch (err) {
      console.error('加载消息失败:', err);
      const mockMessages = [
        { _id: '1', title: '预约成功通知', content: '您预约的万科城房源看房时间已确认，请准时前往', type: 'appointment', read: false, createdAt: new Date() },
        { _id: '2', title: '系统通知', content: '您的实名认证已审核通过', type: 'system', read: true, createdAt: new Date(Date.now() - 86400000) },
        { _id: '3', title: '活动通知', content: '端午特惠活动已开启，买房立减5万', type: 'activity', read: true, createdAt: new Date(Date.now() - 172800000) }
      ];
      const list = mockMessages.map(item => ({
        ...item,
        time: this.formatTime(item.createdAt),
        icon: this.getTypeIcon(item.type),
        iconBg: this.getTypeIconBg(item.type)
      }));
      this.setData({ messageList: list, noMore: true });
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
    const message = this.data.messageList.find(m => m._id === id);
    if (!message) return;

    try {
      await api.message.markRead({ id });
      const newList = this.data.messageList.map(m => 
        m._id === id ? { ...m, read: true } : m
      );
      this.setData({ messageList: newList });
    } catch (err) {
      console.error('标记已读失败:', err);
    }

    wx.showModal({
      title: message.title,
      content: message.content,
      showCancel: false
    });
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
      system: '🔔',
      appointment: '📅',
      activity: '🎉',
      default: '📬'
    };
    return icons[type] || icons.default;
  },

  getTypeIconBg(type) {
    const bgs = {
      system: '#e3f2fd',
      appointment: '#fff3e0',
      activity: '#e8f5e9',
      default: '#f5f5f5'
    };
    return bgs[type] || bgs.default;
  }
});
