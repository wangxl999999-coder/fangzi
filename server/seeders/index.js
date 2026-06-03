require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const House = require('../models/House');
const Community = require('../models/Community');
const Project = require('../models/Project');
const Banner = require('../models/Banner');
const City = require('../models/City');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seed = async () => {
  try {
    console.log('开始清除旧数据...');
    await User.deleteMany({});
    await House.deleteMany({});
    await Community.deleteMany({});
    await Project.deleteMany({});
    await Banner.deleteMany({});
    await City.deleteMany({});

    console.log('创建管理员账号...');
    const admin = await User.create({
      phone: '13800000000',
      password: await bcrypt.hash('admin123', 10),
      nickname: '管理员',
      role: 'admin',
      realName: '系统管理员',
      authStatus: 'approved'
    });

    console.log('创建测试用户...');
    const users = await User.create([
      {
        phone: '13800000001',
        nickname: '张三',
        role: 'user',
        city: '北京',
        authStatus: 'approved'
      },
      {
        phone: '13800000002',
        nickname: '李房东',
        role: 'landlord',
        realName: '李明',
        idCard: '110101199001011234',
        city: '北京',
        authStatus: 'approved'
      },
      {
        phone: '13800000003',
        nickname: '王经理',
        role: 'agent',
        realName: '王芳',
        idCard: '110101199202022345',
        company: '链家地产',
        agentLicense: 'BJ202300123',
        city: '北京',
        authStatus: 'approved'
      },
      {
        phone: '13800000004',
        nickname: '陈房东',
        role: 'landlord',
        realName: '陈强',
        idCard: '310101198803033456',
        city: '上海',
        authStatus: 'approved'
      },
      {
        phone: '13800000005',
        nickname: '刘经理',
        role: 'agent',
        realName: '刘洋',
        idCard: '310101199104044567',
        company: '中原地产',
        agentLicense: 'SH202300456',
        city: '上海',
        authStatus: 'approved'
      }
    ]);

    console.log('创建城市数据...');
    await City.create([
      { name: '北京', code: 'beijing', province: '北京', pinyin: 'beijing', hot: true, sort: 1 },
      { name: '上海', code: 'shanghai', province: '上海', pinyin: 'shanghai', hot: true, sort: 2 },
      { name: '广州', code: 'guangzhou', province: '广东', pinyin: 'guangzhou', hot: true, sort: 3 },
      { name: '深圳', code: 'shenzhen', province: '广东', pinyin: 'shenzhen', hot: true, sort: 4 },
      { name: '杭州', code: 'hangzhou', province: '浙江', pinyin: 'hangzhou', hot: true, sort: 5 },
      { name: '南京', code: 'nanjing', province: '江苏', pinyin: 'nanjing', hot: true, sort: 6 },
      { name: '成都', code: 'chengdu', province: '四川', pinyin: 'chengdu', hot: true, sort: 7 },
      { name: '武汉', code: 'wuhan', province: '湖北', pinyin: 'wuhan', hot: true, sort: 8 }
    ]);

    console.log('创建小区数据...');
    const communities = await Community.create([
      {
        name: '万科城市花园',
        city: '北京',
        district: '朝阳区',
        address: '北京市朝阳区望京西路88号',
        location: { lat: 39.9891, lng: 116.4714 },
        buildYear: 2018,
        propertyType: '商品房',
        propertyYears: 70,
        developer: '万科地产',
        propertyCompany: '万科物业',
        propertyFee: '3.5元/㎡/月',
        totalBuildings: 15,
        totalHouses: 1200,
        parkingRatio: '1:1.2',
        greenRate: '35%',
        volumeRate: '2.5',
        averagePrice: 68000,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20residential%20apartment%20building%20exterior%20with%20garden&image_size=square_hd',
        description: '万科城市花园位于望京核心区域，交通便利，配套完善。',
        facilities: ['游泳池', '健身房', '儿童乐园', '篮球场', '24小时安保', '智能门禁'],
        isHot: true,
        houseCount: 25,
        rentCount: 18
      },
      {
        name: '保利中央公园',
        city: '北京',
        district: '海淀区',
        address: '北京市海淀区中关村大街100号',
        location: { lat: 39.9847, lng: 116.3058 },
        buildYear: 2020,
        propertyType: '商品房',
        propertyYears: 70,
        developer: '保利地产',
        propertyCompany: '保利物业',
        propertyFee: '4.2元/㎡/月',
        totalBuildings: 12,
        totalHouses: 960,
        parkingRatio: '1:1.5',
        greenRate: '40%',
        volumeRate: '2.2',
        averagePrice: 82000,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20residential%20complex%20with%20park%20landscape&image_size=square_hd',
        description: '保利中央公园位于中关村核心区，毗邻多所名校。',
        facilities: ['中央公园', '会所', '网球场', '儿童游乐场', '智能安防'],
        isHot: true,
        houseCount: 18,
        rentCount: 12
      },
      {
        name: '碧桂园凤凰城',
        city: '上海',
        district: '浦东新区',
        address: '上海市浦东新区张江高科技园区博云路2号',
        location: { lat: 31.2099, lng: 121.6048 },
        buildYear: 2019,
        propertyType: '商品房',
        propertyYears: 70,
        developer: '碧桂园',
        propertyCompany: '碧桂园物业',
        propertyFee: '3.8元/㎡/月',
        totalBuildings: 20,
        totalHouses: 1600,
        parkingRatio: '1:1.2',
        greenRate: '38%',
        volumeRate: '2.4',
        averagePrice: 75000,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20highrise%20apartment%20building%20shanghai&image_size=square_hd',
        description: '碧桂园凤凰城位于张江核心区域，紧邻地铁13号线。',
        facilities: ['室内泳池', '健身中心', '亲子乐园', '多功能球场', '商业街'],
        isHot: true,
        houseCount: 32,
        rentCount: 25
      },
      {
        name: '恒大名都',
        city: '上海',
        district: '松江区',
        address: '上海市松江区泗泾镇恒泽路1号',
        location: { lat: 31.1226, lng: 121.2894 },
        buildYear: 2017,
        propertyType: '商品房',
        propertyYears: 70,
        developer: '恒大地产',
        propertyCompany: '恒大金碧物业',
        propertyFee: '3.2元/㎡/月',
        totalBuildings: 18,
        totalHouses: 1440,
        parkingRatio: '1:1',
        greenRate: '36%',
        volumeRate: '2.0',
        averagePrice: 52000,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20residential%20community%20with%20lake&image_size=square_hd',
        description: '恒大名都位于泗泾地铁站旁，出行便利。',
        facilities: ['湖景园林', '恒温泳池', '健身会所', '双语幼儿园'],
        isHot: false,
        houseCount: 15,
        rentCount: 20
      },
      {
        name: '龙湖春江郦城',
        city: '广州',
        district: '天河区',
        address: '广州市天河区珠江新城兴盛路10号',
        location: { lat: 23.1291, lng: 113.2644 },
        buildYear: 2021,
        propertyType: '商品房',
        propertyYears: 70,
        developer: '龙湖地产',
        propertyCompany: '龙湖智慧服务',
        propertyFee: '4.5元/㎡/月',
        totalBuildings: 8,
        totalHouses: 640,
        parkingRatio: '1:1.8',
        greenRate: '42%',
        volumeRate: '2.8',
        averagePrice: 95000,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20riverside%20apartment%20guangzhou&image_size=square_hd',
        description: '龙湖春江郦城位于珠江新城核心，江景豪宅。',
        facilities: ['江景会所', '天际泳池', '私家庭园', '顶级物业服务'],
        isHot: true,
        houseCount: 8,
        rentCount: 5
      }
    ]);

    console.log('创建房源数据...');
    const houseImages = [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20bright%20living%20room%20interior%20design&image_size=square_hd',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20bedroom%20with%20big%20window&image_size=square_hd',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20kitchen%20interior%20design&image_size=square_hd',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20bathroom%20interior&image_size=square_hd',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=spacious%20balcony%20with%20city%20view&image_size=square_hd'
    ];

    const houses = await House.create([
      {
        title: '望京万科城市花园 南北通透三居 精装修 拎包入住',
        type: 'secondhand',
        price: 680,
        priceUnit: 'total',
        area: 120,
        bedrooms: 3,
        livingrooms: 2,
        bathrooms: 2,
        floor: '中楼层/25层',
        totalFloor: 25,
        decoration: '精装',
        orientation: '南北',
        buildYear: 2018,
        propertyYears: 70,
        propertyType: '商品房',
        address: '北京市朝阳区望京西路88号',
        city: '北京',
        district: '朝阳区',
        community: communities[0]._id,
        communityName: '万科城市花园',
        location: { lat: 39.9891, lng: 116.4714 },
        images: houseImages,
        vrUrl: '',
        videoUrl: '',
        description: '此房南北通透，户型方正，采光好，通风佳。精装修，拎包即可入住。小区环境优美，物业管理完善。周边配套齐全，交通便利，临近地铁15号线望京站。',
        features: ['南北通透', '采光好', '精装修', '拎包入住', '近地铁'],
        facilities: ['空调', '洗衣机', '冰箱', '电视', '热水器', '宽带', '天然气', '电梯'],
        tags: ['满五唯一', '学区房', '近地铁'],
        owner: users[2]._id,
        ownerType: 'agent',
        contactName: '王经理',
        contactPhone: '13800000003',
        isSpecial: true,
        isNew: true,
        isHot: true,
        status: 'approved'
      },
      {
        title: '中关村保利中央公园 豪华装修大四居 学区房',
        type: 'secondhand',
        price: 1280,
        priceUnit: 'total',
        area: 180,
        bedrooms: 4,
        livingrooms: 3,
        bathrooms: 3,
        floor: '高楼层/20层',
        totalFloor: 20,
        decoration: '豪装',
        orientation: '南北',
        buildYear: 2020,
        propertyYears: 70,
        propertyType: '商品房',
        address: '北京市海淀区中关村大街100号',
        city: '北京',
        district: '海淀区',
        community: communities[1]._id,
        communityName: '保利中央公园',
        location: { lat: 39.9847, lng: 116.3058 },
        images: houseImages,
        description: '此房为小区楼王位置，视野开阔，可俯瞰整个小区园林。豪华装修，品牌家电全送。对口中关村一小，学区未用。',
        features: ['楼王位置', '豪华装修', '学区房', '视野好'],
        facilities: ['中央空调', '新风系统', '智能家居', '双开门冰箱', '洗衣机', '烘干机'],
        tags: ['学区房', '豪华装修', '满二'],
        owner: users[2]._id,
        ownerType: 'agent',
        contactName: '王经理',
        contactPhone: '13800000003',
        isSpecial: false,
        isNew: false,
        isHot: true,
        status: 'approved'
      },
      {
        title: '望京万科城市花园 精装一居 整租 近地铁',
        type: 'rent_whole',
        price: 7500,
        priceUnit: 'monthly',
        area: 65,
        bedrooms: 1,
        livingrooms: 1,
        bathrooms: 1,
        floor: '中楼层/25层',
        totalFloor: 25,
        decoration: '精装',
        orientation: '南',
        buildYear: 2018,
        address: '北京市朝阳区望京西路88号',
        city: '北京',
        district: '朝阳区',
        community: communities[0]._id,
        communityName: '万科城市花园',
        location: { lat: 39.9891, lng: 116.4714 },
        images: houseImages,
        description: '精装修一居室，家电齐全，拎包入住。小区环境好，物业管理规范。步行5分钟到地铁15号线望京站。',
        features: ['近地铁', '精装修', '拎包入住', '随时看房'],
        facilities: ['空调', '洗衣机', '冰箱', '电视', '热水器', '宽带', '天然气', '电梯'],
        tags: ['近地铁', '精装修', '随时看房'],
        owner: users[1]._id,
        ownerType: 'landlord',
        contactName: '李房东',
        contactPhone: '13800000002',
        isSpecial: true,
        isNew: true,
        isHot: false,
        status: 'approved',
        rentDeposit: '押一付三',
        rentPayment: '季付'
      },
      {
        title: '望京SOHO附近 次卧出租 精装修 家电齐全',
        type: 'rent_share',
        price: 3200,
        priceUnit: 'monthly',
        area: 18,
        bedrooms: 1,
        livingrooms: 0,
        bathrooms: 1,
        floor: '中楼层/28层',
        totalFloor: 28,
        decoration: '精装',
        orientation: '南',
        buildYear: 2019,
        address: '北京市朝阳区望京街9号',
        city: '北京',
        district: '朝阳区',
        communityName: '望京西园',
        location: { lat: 39.9966, lng: 116.4764 },
        images: houseImages,
        description: '主卧带独立卫生间，朝南采光好。室友都是互联网上班族，作息规律，好相处。公共区域干净整洁，定期保洁。',
        features: ['主卧独卫', '朝南', '近地铁', '室友nice'],
        facilities: ['空调', '洗衣机', '冰箱', '热水器', '宽带', '电梯'],
        tags: ['近地铁', '独卫', '朝南'],
        owner: users[1]._id,
        ownerType: 'landlord',
        contactName: '李房东',
        contactPhone: '13800000002',
        isSpecial: false,
        isNew: true,
        isHot: false,
        status: 'approved',
        rentDeposit: '押一付一',
        rentPayment: '月付'
      },
      {
        title: '张江碧桂园凤凰城 精装两居 南北通透 急售',
        type: 'secondhand',
        price: 580,
        priceUnit: 'total',
        area: 95,
        bedrooms: 2,
        livingrooms: 2,
        bathrooms: 1,
        floor: '高楼层/22层',
        totalFloor: 22,
        decoration: '精装',
        orientation: '南北',
        buildYear: 2019,
        propertyYears: 70,
        propertyType: '商品房',
        address: '上海市浦东新区张江高科技园区博云路2号',
        city: '上海',
        district: '浦东新区',
        community: communities[2]._id,
        communityName: '碧桂园凤凰城',
        location: { lat: 31.2099, lng: 121.6048 },
        images: houseImages,
        description: '此房南北通透，户型方正实用。精装修，保养良好。业主因置换急售，价格可谈。',
        features: ['南北通透', '精装修', '急售', '价格可谈'],
        facilities: ['空调', '洗衣机', '冰箱', '电视', '热水器', '宽带'],
        tags: ['急售', '满五唯一', '近地铁'],
        owner: users[4]._id,
        ownerType: 'agent',
        contactName: '刘经理',
        contactPhone: '13800000005',
        isSpecial: true,
        isNew: true,
        isHot: true,
        status: 'approved'
      },
      {
        title: '松江恒大名都 简装三居 整租 适合家庭',
        type: 'rent_whole',
        price: 4500,
        priceUnit: 'monthly',
        area: 110,
        bedrooms: 3,
        livingrooms: 2,
        bathrooms: 2,
        floor: '低楼层/18层',
        totalFloor: 18,
        decoration: '简装',
        orientation: '南北',
        buildYear: 2017,
        address: '上海市松江区泗泾镇恒泽路1号',
        city: '上海',
        district: '松江区',
        community: communities[3]._id,
        communityName: '恒大名都',
        location: { lat: 31.1226, lng: 121.2894 },
        images: houseImages,
        description: '三居室，南北通透，采光好。简单装修，基本家电齐全。适合一家人居住，有电梯。',
        features: ['三居室', '南北通透', '有电梯', '适合家庭'],
        facilities: ['空调', '洗衣机', '冰箱', '热水器', '天然气', '电梯'],
        tags: ['适合家庭', '南北通透'],
        owner: users[3]._id,
        ownerType: 'landlord',
        contactName: '陈房东',
        contactPhone: '13800000004',
        isSpecial: false,
        isNew: false,
        isHot: false,
        status: 'approved',
        rentDeposit: '押二付一',
        rentPayment: '月付'
      },
      {
        title: '天河CBD 临街旺铺 人流量大 适合餐饮',
        type: 'shop',
        price: 28000,
        priceUnit: 'monthly',
        area: 150,
        bedrooms: 0,
        livingrooms: 0,
        bathrooms: 1,
        floor: '底层/3层',
        totalFloor: 3,
        decoration: '简装',
        orientation: '南',
        buildYear: 2015,
        address: '广州市天河区珠江新城兴盛路10号',
        city: '广州',
        district: '天河区',
        community: communities[4]._id,
        communityName: '龙湖春江郦城',
        location: { lat: 23.1291, lng: 113.2644 },
        images: houseImages,
        description: '临街旺铺，位于CBD核心区域，人流量大。适合做餐饮、奶茶、便利店等。上下两层，使用面积大。',
        features: ['临街', '人流量大', '上下两层', '可做餐饮'],
        facilities: ['上水', '下水', '排烟', '三相电', '空调'],
        tags: ['临街旺铺', '可做餐饮'],
        owner: users[3]._id,
        ownerType: 'landlord',
        contactName: '陈房东',
        contactPhone: '13800000004',
        isSpecial: true,
        isNew: false,
        isHot: true,
        status: 'approved',
        shopType: '临街商铺',
        shopArea: '套内120㎡'
      }
    ]);

    console.log('创建新房楼盘数据...');
    await Project.create([
      {
        name: '华润橡树湾',
        city: '北京',
        district: '丰台区',
        address: '北京市丰台区丽泽商务区凤凰嘴街5号',
        location: { lat: 39.8523, lng: 116.3245 },
        price: 95000,
        priceUnit: '元/㎡',
        totalPriceStart: 950,
        houseType: [
          { bedrooms: 3, livingrooms: 2, area: 100, price: 950, name: 'A户型' },
          { bedrooms: 4, livingrooms: 2, area: 130, price: 1235, name: 'B户型' },
          { bedrooms: 4, livingrooms: 3, area: 160, price: 1520, name: 'C户型' }
        ],
        areaRange: { min: 100, max: 160 },
        developer: '华润置地',
        propertyCompany: '华润万象生活',
        propertyFee: '6.8元/㎡/月',
        propertyYears: 70,
        volumeRate: '2.8',
        greenRate: '30%',
        totalHouses: 800,
        parkingRatio: '1:2',
        decoration: '精装',
        openDate: new Date('2024-03-15'),
        deliverDate: new Date('2026-06-30'),
        saleStatus: '在售',
        images: houseImages,
        description: '华润橡树湾位于丽泽金融商务区核心位置，毗邻地铁14号线东管头站。项目规划8栋住宅楼，配套约2万㎡商业。',
        features: ['品牌开发商', '精装修', '近地铁', '商业配套'],
        facilities: ['会所', '泳池', '健身房', '儿童乐园', '社区商业'],
        isHot: true,
        isNew: true,
        status: 'approved'
      },
      {
        name: '中海寰宇时代',
        city: '上海',
        district: '闵行区',
        address: '上海市闵行区七宝镇新镇路1200号',
        location: { lat: 31.1556, lng: 121.3578 },
        price: 82000,
        priceUnit: '元/㎡',
        totalPriceStart: 738,
        houseType: [
          { bedrooms: 3, livingrooms: 2, area: 90, price: 738, name: 'A户型' },
          { bedrooms: 3, livingrooms: 2, area: 110, price: 902, name: 'B户型' },
          { bedrooms: 4, livingrooms: 2, area: 130, price: 1066, name: 'C户型' }
        ],
        areaRange: { min: 90, max: 130 },
        developer: '中海地产',
        propertyCompany: '中海物业',
        propertyFee: '5.5元/㎡/月',
        propertyYears: 70,
        volumeRate: '2.2',
        greenRate: '35%',
        totalHouses: 1200,
        parkingRatio: '1:1.5',
        decoration: '精装',
        openDate: new Date('2024-01-20'),
        deliverDate: new Date('2025-12-31'),
        saleStatus: '在售',
        images: houseImages,
        description: '中海寰宇时代位于七宝生态商务区，紧邻地铁12号线七莘路站。项目打造低密度精装住宅，配套完善。',
        features: ['品牌房企', '地铁盘', '精装修', '低密度'],
        facilities: ['健身会所', '恒温泳池', '亲子中心', '社区商业'],
        isHot: true,
        isNew: true,
        status: 'approved'
      },
      {
        name: '保利天汇',
        city: '广州',
        district: '天河区',
        address: '广州市天河区奥体路悦景路交界处',
        location: { lat: 23.1678, lng: 113.4234 },
        price: 78000,
        priceUnit: '元/㎡',
        totalPriceStart: 624,
        houseType: [
          { bedrooms: 3, livingrooms: 2, area: 80, price: 624, name: 'A户型' },
          { bedrooms: 3, livingrooms: 2, area: 100, price: 780, name: 'B户型' },
          { bedrooms: 4, livingrooms: 2, area: 120, price: 936, name: 'C户型' },
          { bedrooms: 4, livingrooms: 3, area: 140, price: 1092, name: 'D户型' }
        ],
        areaRange: { min: 80, max: 140 },
        developer: '保利发展',
        propertyCompany: '保利物业',
        propertyFee: '4.8元/㎡/月',
        propertyYears: 70,
        volumeRate: '3.0',
        greenRate: '30%',
        totalHouses: 2000,
        parkingRatio: '1:1.5',
        decoration: '精装',
        openDate: new Date('2023-12-25'),
        deliverDate: new Date('2026-03-31'),
        saleStatus: '在售',
        images: houseImages,
        description: '保利天汇位于天河智慧城核心，地铁21号线大观南路站直达。项目是总建面约80万㎡的大型综合体。',
        features: ['大型社区', '地铁上盖', '综合体', '精装修'],
        facilities: ['幼儿园', '小学', '会所', '泳池', '10万㎡商业'],
        isHot: true,
        isNew: false,
        status: 'approved'
      }
    ]);

    console.log('创建轮播图数据...');
    await Banner.create([
      {
        title: '特价房源限时抢购',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=real%20estate%20promotion%20banner%20special%20offer&image_size=landscape_16_9',
        linkType: 'none',
        position: 'home',
        city: '',
        sort: 5,
        status: 'active'
      },
      {
        title: '新楼盘盛大开盘',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=new%20real%20estate%20project%20grand%20opening%20banner&image_size=landscape_16_9',
        linkType: 'none',
        position: 'home',
        city: '',
        sort: 4,
        status: 'active'
      },
      {
        title: '返乡置业季 优惠多多',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=spring%20festival%20home%20buying%20promotion%20banner&image_size=landscape_16_9',
        linkType: 'none',
        position: 'home',
        city: '',
        sort: 3,
        status: 'active'
      },
      {
        title: '精装好房 拎包入住',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20furnished%20apartment%20promotion%20banner&image_size=landscape_16_9',
        linkType: 'none',
        position: 'new',
        city: '',
        sort: 2,
        status: 'active'
      },
      {
        title: '租房特惠 首月减500',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=rental%20apartment%20special%20discount%20banner&image_size=landscape_16_9',
        linkType: 'none',
        position: 'rent',
        city: '',
        sort: 1,
        status: 'active'
      }
    ]);

    console.log('数据初始化完成！');
    console.log('管理员账号: 13800000000 / admin123');
    console.log('测试用户:');
    console.log('  普通用户: 13800000001 / 验证码登录');
    console.log('  房东(北京): 13800000002 / 验证码登录');
    console.log('  经纪人(北京): 13800000003 / 验证码登录');
    console.log('  房东(上海): 13800000004 / 验证码登录');
    console.log('  经纪人(上海): 13800000005 / 验证码登录');
    console.log('默认验证码: 123456 (查看控制台输出)');
    
    process.exit(0);
  } catch (err) {
    console.error('数据初始化失败:', err);
    process.exit(1);
  }
};

seed();
