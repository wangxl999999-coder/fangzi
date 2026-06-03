import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { 
  HomeOutlined, 
  UserOutlined, 
  EyeOutlined, 
  FileTextOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { system, house } from '../utils/api';

const Dashboard = () => {
  const [statistics, setStatistics] = useState({
    totalHouses: 0,
    totalUsers: 0,
    totalAgents: 0,
    totalViews: 0,
    pendingHouses: 0,
    pendingAuths: 0,
    pendingDemands: 0
  });

  const [trendData, setTrendData] = useState({ dates: [], values: [] });
  const [houseTypeData, setHouseTypeData] = useState([]);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const result = await system.getStatistics();
      setStatistics(result);
    } catch (err) {
      console.error('加载统计数据失败:', err);
      setStatistics({
        totalHouses: 1256,
        totalUsers: 8923,
        totalAgents: 156,
        totalViews: 45678,
        pendingHouses: 23,
        pendingAuths: 8,
        pendingDemands: 45
      });
    }

    setTrendData({
      dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      values: [1200, 1500, 1350, 1800, 2000, 2500, 2200]
    });

    setHouseTypeData([
      { value: 356, name: '整租' },
      { value: 234, name: '合租' },
      { value: 456, name: '出售' },
      { value: 210, name: '新房' }
    ]);
  };

  const lineOption = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: trendData.dates
    },
    yAxis: { type: 'value' },
    series: [{
      data: trendData.values,
      type: 'line',
      smooth: true,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255, 107, 107, 0.5)' },
            { offset: 1, color: 'rgba(255, 107, 107, 0.05)' }
          ]
        }
      },
      lineStyle: { color: '#ff6b6b' },
      itemStyle: { color: '#ff6b6b' }
    }]
  };

  const pieOption = {
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: houseTypeData,
      color: ['#ff6b6b', '#ffa8a8', '#ff8787', '#ffc9c9']
    }]
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>数据概览</h2>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总房源数"
              value={statistics.totalHouses}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#ff6b6b' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={statistics.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="经纪人"
              value={statistics.totalAgents}
              prefix={<UsergroupAddOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总浏览量"
              value={statistics.totalViews}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="待审核房源"
              value={statistics.pendingHouses}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#fa541c' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="待认证经纪人"
              value={statistics.pendingAuths}
              prefix={<UsergroupAddOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="待处理需求"
              value={statistics.pendingDemands}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card title="浏览趋势">
            <ReactECharts option={lineOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="房源类型分布">
            <ReactECharts option={pieOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
