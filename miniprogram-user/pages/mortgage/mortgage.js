Page({
  data: {
    form: {
      amount: '',
      years: '30',
      rate: '3.85',
      type: 'equal'
    },
    result: {
      show: false
    },
    showDetail: false
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`form.${field}`]: e.detail.value
    });
  },

  selectType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ 'form.type': type });
  },

  calculate() {
    const { amount, years, rate, type } = this.data.form;
    
    if (!amount || amount <= 0) {
      wx.showToast({ title: '请输入贷款金额', icon: 'none' });
      return;
    }
    if (!years || years <= 0) {
      wx.showToast({ title: '请输入贷款年限', icon: 'none' });
      return;
    }

    const principal = parseFloat(amount) * 10000;
    const monthlyRate = parseFloat(rate || 3.85) / 100 / 12;
    const months = parseInt(years) * 12;
    
    let monthlyPayment, totalInterest, totalPayment;
    let details = [];

    if (type === 'equal') {
      monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                       (Math.pow(1 + monthlyRate, months) - 1);
      totalPayment = monthlyPayment * months;
      totalInterest = totalPayment - principal;
      
      let remaining = principal;
      for (let i = 1; i <= months; i++) {
        const interest = remaining * monthlyRate;
        const principalPart = monthlyPayment - interest;
        remaining -= principalPart;
        details.push({
          month: i,
          payment: monthlyPayment.toFixed(2),
          principal: principalPart.toFixed(2),
          interest: interest.toFixed(2),
          remaining: Math.max(0, remaining).toFixed(2)
        });
      }
    } else {
      const monthlyPrincipal = principal / months;
      let remaining = principal;
      totalInterest = 0;
      totalPayment = 0;
      
      for (let i = 1; i <= months; i++) {
        const interest = remaining * monthlyRate;
        const payment = monthlyPrincipal + interest;
        remaining -= monthlyPrincipal;
        totalInterest += interest;
        totalPayment += payment;
        details.push({
          month: i,
          payment: payment.toFixed(2),
          principal: monthlyPrincipal.toFixed(2),
          interest: interest.toFixed(2),
          remaining: Math.max(0, remaining).toFixed(2)
        });
      }
      monthlyPayment = details[0]?.payment || 0;
    }

    this.setData({
      'result.show': true,
      'result.monthlyPayment': this.formatNumber(monthlyPayment),
      'result.totalInterest': this.formatNumber(totalInterest),
      'result.totalPayment': this.formatNumber(totalPayment),
      'result.details': details
    });
  },

  formatNumber(num) {
    return parseFloat(num).toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },

  toggleDetail() {
    this.setData({ showDetail: !this.data.showDetail });
  }
});
