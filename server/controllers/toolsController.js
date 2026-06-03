const { success, error } = require('../utils/response');

const calculateMortgage = async (req, res) => {
  try {
    const { totalPrice, downPaymentRatio, loanYears, interestRate, type = 'equal' } = req.body;
    
    const downPayment = totalPrice * (downPaymentRatio / 100);
    const loanAmount = totalPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = loanYears * 12;

    let monthlyPayment, totalPayment, totalInterest;

    if (type === 'equal') {
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      monthlyPayment = loanAmount * monthlyRate * factor / (factor - 1);
      totalPayment = monthlyPayment * totalMonths;
      totalInterest = totalPayment - loanAmount;
    } else {
      const monthlyPrincipal = loanAmount / totalMonths;
      const firstMonthInterest = loanAmount * monthlyRate;
      const firstMonthPayment = monthlyPrincipal + firstMonthInterest;
      const lastMonthPayment = monthlyPrincipal + monthlyPrincipal * monthlyRate;
      const averageMonthlyPayment = (firstMonthPayment + lastMonthPayment) / 2;
      totalInterest = (firstMonthInterest + monthlyPrincipal * monthlyRate) * totalMonths / 2;
      totalPayment = loanAmount + totalInterest;
      monthlyPayment = averageMonthlyPayment;
    }

    success(res, {
      totalPrice,
      downPayment,
      downPaymentRatio,
      loanAmount,
      loanYears,
      interestRate,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      type
    });
  } catch (err) {
    error(res, err.message);
  }
};

const estimatePrice = async (req, res) => {
  try {
    const { city, district, community, area, bedrooms, livingrooms, floor, buildYear, decoration } = req.body;
    
    const basePrices = {
      '北京': 60000,
      '上海': 58000,
      '广州': 35000,
      '深圳': 75000,
      '杭州': 40000,
      '南京': 32000,
      '成都': 18000,
      '武汉': 20000,
      '西安': 16000,
      '重庆': 14000,
      'default': 15000
    };

    let basePrice = basePrices[city] || basePrices['default'];
    
    const floorFactor = {
      '低楼层': 0.95,
      '中楼层': 1.0,
      '高楼层': 1.05,
      '底层': 0.9,
      '顶层': 1.02
    };
    basePrice *= (floorFactor[floor] || 1.0);

    const decorationFactor = {
      '毛坯': 0.9,
      '简装': 1.0,
      '精装': 1.15,
      '豪装': 1.3
    };
    basePrice *= (decorationFactor[decoration] || 1.0);

    const ageFactor = buildYear ? Math.max(0.7, 1 - (2024 - buildYear) * 0.01) : 1.0;
    basePrice *= ageFactor;

    const bedroomFactor = bedrooms <= 2 ? 0.95 : bedrooms >= 4 ? 1.05 : 1.0;
    basePrice *= bedroomFactor;

    const unitPrice = Math.round(basePrice);
    const totalPrice = Math.round(unitPrice * area);
    
    const minPrice = Math.round(totalPrice * 0.9);
    const maxPrice = Math.round(totalPrice * 1.1);

    success(res, {
      unitPrice,
      totalPrice,
      minPrice,
      maxPrice,
      priceRange: `${(minPrice / 10000).toFixed(1)}-${(maxPrice / 10000).toFixed(1)}万`,
      unitPriceRange: `${Math.round(unitPrice * 0.9)}-${Math.round(unitPrice * 1.1)}元/㎡`,
      factors: {
        city,
        area,
        bedrooms,
        floor,
        buildYear,
        decoration
      }
    });
  } catch (err) {
    error(res, err.message);
  }
};

const getPolicyList = async (req, res) => {
  try {
    const { city, type } = req.query;
    
    const policies = [
      {
        id: 1,
        title: '2024年最新购房政策解读',
        type: 'purchase',
        city: city || '全国',
        summary: '最新的限购、限贷政策调整，包括首付比例、贷款利率等优惠政策。',
        content: '一、限购政策\n1. 本市户籍家庭限购2套住房\n2. 非本市户籍家庭需缴纳社保满2年，限购1套\n\n二、限贷政策\n1. 首套房首付比例不低于30%\n2. 二套房首付比例不低于60%\n3. 三套及以上暂停贷款\n\n三、公积金政策\n1. 首套房公积金贷款最高额度调整为80万\n2. 二套房公积金贷款最高额度调整为60万\n3. 公积金贷款首付比例统一为20%',
        publishDate: '2024-01-15',
        source: '住房和城乡建设部'
      },
      {
        id: 2,
        title: '落户政策新规定',
        type: 'settle',
        city: city || '全国',
        summary: '放宽落户条件，人才引进政策，购房落户办理流程。',
        content: '一、人才引进落户\n1. 全日制本科及以上学历可直接落户\n2. 中级及以上职称可直接落户\n3. 技能人才积分落户\n\n二、购房落户\n1. 购买商品住房面积≥90㎡可落户\n2. 取得不动产权证后即可申请\n3. 配偶及未成年子女可随迁\n\n三、积分落户\n1. 基础分+加分项\n2. 每年按指标排名\n3. 社保缴纳年限累计计算',
        publishDate: '2024-02-01',
        source: '公安局'
      },
      {
        id: 3,
        title: '租房补贴政策',
        type: 'rent',
        city: city || '全国',
        summary: '新市民租房补贴申请条件、标准和流程。',
        content: '一、申请条件\n1. 本市无自有住房\n2. 已签订正式租赁合同\n3. 正常缴纳社保\n\n二、补贴标准\n1. 博士：每月3000元\n2. 硕士：每月2000元\n3. 本科：每月1000元\n4. 补贴期限最长3年\n\n三、申请流程\n1. 网上提交申请\n2. 资格审核\n3. 公示\n4. 按月发放',
        publishDate: '2024-02-15',
        source: '财政局'
      }
    ];

    const filtered = policies.filter(p => !type || p.type === type);
    
    success(res, filtered);
  } catch (err) {
    error(res, err.message);
  }
};

const getCityList = async (req, res) => {
  try {
    const cities = [
      { name: '北京', code: 'beijing', province: '北京', pinyin: 'beijing', hot: true },
      { name: '上海', code: 'shanghai', province: '上海', pinyin: 'shanghai', hot: true },
      { name: '广州', code: 'guangzhou', province: '广东', pinyin: 'guangzhou', hot: true },
      { name: '深圳', code: 'shenzhen', province: '广东', pinyin: 'shenzhen', hot: true },
      { name: '杭州', code: 'hangzhou', province: '浙江', pinyin: 'hangzhou', hot: true },
      { name: '南京', code: 'nanjing', province: '江苏', pinyin: 'nanjing', hot: true },
      { name: '成都', code: 'chengdu', province: '四川', pinyin: 'chengdu', hot: true },
      { name: '武汉', code: 'wuhan', province: '湖北', pinyin: 'wuhan', hot: true },
      { name: '西安', code: 'xian', province: '陕西', pinyin: 'xian', hot: false },
      { name: '重庆', code: 'chongqing', province: '重庆', pinyin: 'chongqing', hot: false },
      { name: '天津', code: 'tianjin', province: '天津', pinyin: 'tianjin', hot: false },
      { name: '苏州', code: 'suzhou', province: '江苏', pinyin: 'suzhou', hot: false },
      { name: '郑州', code: 'zhengzhou', province: '河南', pinyin: 'zhengzhou', hot: false },
      { name: '长沙', code: 'changsha', province: '湖南', pinyin: 'changsha', hot: false },
      { name: '青岛', code: 'qingdao', province: '山东', pinyin: 'qingdao', hot: false }
    ];

    const hotCities = cities.filter(c => c.hot);
    const allCities = cities.sort((a, b) => a.pinyin.localeCompare(b.pinyin));

    const grouped = {};
    allCities.forEach(city => {
      const letter = city.pinyin[0].toUpperCase();
      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(city);
    });

    success(res, { hotCities, allCities, grouped });
  } catch (err) {
    error(res, err.message);
  }
};

module.exports = {
  calculateMortgage,
  estimatePrice,
  getPolicyList,
  getCityList
};
