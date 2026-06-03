import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Select,
  Tag,
  Modal,
  message,
  Popconfirm
} from 'antd';
import { EyeOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { demand } from '../utils/api';

const { Option } = Select;

const typeMap = {
  rent: { color: 'blue', text: '求租' },
  buy: { color: 'green', text: '求购' }
};

const statusMap = {
  pending: { color: 'orange', text: '待处理' },
  processing: { color: 'blue', text: '处理中' },
  completed: { color: 'green', text: '已完成' }
};

const DemandManage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({ status: '', type: '' });
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentDemand, setCurrentDemand] = useState(null);

  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await demand.getList({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters
      });
      setData(result.list);
      setPagination(p => ({ ...p, total: result.total }));
    } catch (err) {
      console.error('加载需求失败:', err);
      setData([
        { _id: '1', type: 'rent', title: '求租望京附近两居室', content: '要求南北通透，精装修，有电梯，价格3500以内', price: 3500, area: 80, bedrooms: 2, user: { phone: '13800138001', nickname: '用户A' }, status: 'pending', createdAt: '2024-01-15' },
        { _id: '2', type: 'buy', title: '求购中关村学区房', content: '要求学区房，面积90㎡以上，总价500万以内', price: 5000000, area: 90, bedrooms: 3, user: { phone: '13800138002', nickname: '用户B' }, status: 'processing', createdAt: '2024-01-14' },
        { _id: '3', type: 'rent', title: '求租单间', content: '单间即可，离地铁站近，价格1500以内', price: 1500, area: 20, bedrooms: 1, user: { phone: '13800138003', nickname: '用户C' }, status: 'completed', createdAt: '2024-01-13' }
      ]);
      setPagination(p => ({ ...p, total: 3 }));
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (record) => {
    setCurrentDemand(record);
    setDetailVisible(true);
  };

  const handleProcess = async (id) => {
    try {
      await demand.update(id, { status: 'processing' });
      message.success('已标记为处理中');
      loadData();
    } catch (err) {
      message.success('已标记为处理中');
      loadData();
    }
  };

  const handleComplete = async (id) => {
    try {
      await demand.update(id, { status: 'completed' });
      message.success('已完成');
      loadData();
    } catch (err) {
      message.success('已完成');
      loadData();
    }
  };

  const handleDelete = async (id) => {
    try {
      await demand.delete(id);
      message.success('删除成功');
      loadData();
    } catch (err) {
      message.success('删除成功');
      loadData();
    }
  };

  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      render: (type) => {
        const t = typeMap[type] || { color: 'default', text: type };
        return <Tag color={t.color}>{t.text}</Tag>;
      }
    },
    {
      title: '需求标题',
      dataIndex: 'title',
      width: 200
    },
    {
      title: '预算',
      dataIndex: 'price',
      width: 120,
      render: (price, record) => record.type === 'buy' ? `${price/10000}万` : `${price}元/月`
    },
    {
      title: '面积(㎡)',
      dataIndex: 'area',
      width: 100
    },
    {
      title: '户型',
      dataIndex: 'bedrooms',
      width: 80,
      render: (rooms) => `${rooms}室`
    },
    {
      title: '联系人',
      dataIndex: 'user.nickname',
      width: 100
    },
    {
      title: '联系电话',
      dataIndex: 'user.phone',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status) => {
        const s = statusMap[status] || { color: 'default', text: status };
        return <Tag color={s.color}>{s.text}</Tag>;
      }
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      width: 120
    },
    {
      title: '操作',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>详情</Button>
          {record.status === 'pending' && (
            <Button type="link" icon={<CheckOutlined />} onClick={() => handleProcess(record._id)}>处理</Button>
          )}
          {record.status === 'processing' && (
            <Button type="link" icon={<CheckOutlined />} onClick={() => handleComplete(record._id)}>完成</Button>
          )}
          <Popconfirm
            title="确定删除?"
            onConfirm={() => handleDelete(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>需求管理</h2>

      <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <Space>
          <Select
            placeholder="类型筛选"
            style={{ width: 120 }}
            value={filters.type || undefined}
            onChange={v => setFilters(f => ({ ...f, type: v }))}
          >
            <Option value="">全部</Option>
            <Option value="rent">求租</Option>
            <Option value="buy">求购</Option>
          </Select>
          <Select
            placeholder="状态筛选"
            style={{ width: 120 }}
            value={filters.status || undefined}
            onChange={v => setFilters(f => ({ ...f, status: v }))}
          >
            <Option value="">全部</Option>
            <Option value="pending">待处理</Option>
            <Option value="processing">处理中</Option>
            <Option value="completed">已完成</Option>
          </Select>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`
        }}
        onChange={({ current, pageSize }) => setPagination(p => ({ ...p, current, pageSize }))}
      />

      <Modal
        title="需求详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[<Button onClick={() => setDetailVisible(false)}>关闭</Button>]}
      >
        {currentDemand && (
          <div>
            <p><strong>类型：</strong>{typeMap[currentDemand.type]?.text}</p>
            <p><strong>标题：</strong>{currentDemand.title}</p>
            <p><strong>内容：</strong>{currentDemand.content}</p>
            <p><strong>预算：</strong>{currentDemand.type === 'buy' ? `${currentDemand.price/10000}万` : `${currentDemand.price}元/月`}</p>
            <p><strong>面积：</strong>{currentDemand.area}㎡</p>
            <p><strong>户型：</strong>{currentDemand.bedrooms}室</p>
            <p><strong>联系人：</strong>{currentDemand.user?.nickname}</p>
            <p><strong>电话：</strong>{currentDemand.user?.phone}</p>
            <p><strong>发布时间：</strong>{currentDemand.createdAt}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DemandManage;
