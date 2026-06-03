# 找房网 - 租房买房平台

一个完整的租房买房平台，包含用户端小程序、经纪人端小程序和PC管理后台。

## 项目结构

```
fangzi/
├── server/                 # 后端服务 (Node.js + Express + MongoDB)
│   ├── package.json
│   └── src/
│       ├── models/        # 数据模型
│       ├── routes/        # 路由
│       ├── middleware/    # 中间件
│       └── utils/         # 工具函数
├── miniprogram-user/       # 用户端微信小程序
│   ├── pages/             # 页面
│   ├── components/        # 组件
│   └── utils/             # 工具
├── miniprogram-agent/      # 经纪人端微信小程序
│   ├── pages/             # 页面
│   └── utils/             # 工具
└── admin/                  # PC管理后台 (React + Ant Design)
    ├── package.json
    └── src/
        ├── pages/         # 页面
        ├── components/    # 组件
        └── utils/         # 工具
```

## 功能模块

### 用户端小程序
- 首页：搜索、定位、分类导航、轮播图、专区
- 房源列表：筛选、排序、分页
- 房源详情：图集、VR看房、视频、收藏、分享
- 新房专区：楼盘列表、楼盘详情
- 实用工具：房贷计算器、房价估价、政策查询
- 个人中心：登录、收藏、浏览历史、发布需求

### 经纪人端小程序
- 工作台：数据统计、快捷操作、预约列表
- 房源管理：发布、编辑、上下架、删除
- 消息中心：预约通知、咨询消息、系统通知
- 数据统计：浏览趋势、房源排行
- 认证中心：实名认证、资质上传

### PC管理后台
- 数据概览：统计图表、关键指标
- 房源管理：审核、编辑、删除
- 用户管理：用户列表、禁用/启用
- 楼盘管理：楼盘CRUD
- 需求管理：求租求购需求处理
- 经纪人认证：认证审核
- 营销配置：轮播图、专区管理
- 系统设置：网站配置

## 快速开始

### 环境要求
- Node.js >= 14
- MongoDB >= 4.0
- 微信开发者工具

### 启动后端服务

```bash
cd server
npm install
npm run seed
npm run dev
```

服务启动在 http://localhost:3001

### 启动PC管理后台

```bash
cd admin
npm install
npm run dev
```

服务启动在 http://localhost:3000

### 微信小程序

1. 打开微信开发者工具
2. 导入 `miniprogram-user` 或 `miniprogram-agent` 目录
3. 修改 `utils/api.js` 中的接口地址为你的后端地址

## 默认账号

### 管理后台
- 用户名：admin
- 密码：admin123

## 技术栈

### 后端
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Multer

### 用户端/经纪人端
- 微信小程序原生开发
- WXML / WXSS / JavaScript

### 管理后台
- React 18
- Vite
- Ant Design 5
- React Router
- ECharts
- Axios

## 许可证

MIT
