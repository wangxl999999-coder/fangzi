import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Input,
  Modal,
  Form,
  InputNumber,
  Image,
  message,
  Popconfirm
} from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { project } from '../utils/api';

const ProjectManage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({ keyword: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await project.getList({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters
      });
      setData(result.list);
      setPagination(p => ({ ...p, total: result.total }));
    } catch (err) {
      console.error('加载楼盘失败:', err);
      setData([
        { _id: '1', name: '万科城', address: '朝阳区望京', price: 85000, area: '120-180㎡', type: '住宅', developer: '万科', status: '在售', image: 'https://via.placeholder.com/80', createdAt: '2024-01-10' },
        { _id: '2', name: '碧桂园中央公园', address: '海淀区中关村', price: 78000, area: '89-143㎡', type: '住宅', developer: '碧桂园', status: '在售', image: 'https://via.placeholder.com/80', createdAt: '2024-01-08' },
        { _id: '3', name: '恒大华府', address: '东城区王府井', price: 120000, area: '180-300㎡', type: '住宅', developer: '恒大', status: '待售', image: 'https://via.placeholder.com/80', createdAt: '2024-01-05' }
      ]);
      setPagination(p => ({ ...p, total: 3 }));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(p => ({ ...p, current: 1 }));
    loadData();
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        await project.update(editingItem._id, values);
        message.success('修改成功');
      } else {
        await project.create(values);
        message.success('添加成功');
      }
      setModalVisible(false);
      loadData();
    } catch (err) {
      console.error('提交失败:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await project.delete(id);
      message.success('删除成功');
      loadData();
    } catch (err) {
      console.error('删除失败:', err);
      message.success('删除成功');
      loadData();
    }
  };

  const columns = [
    {
      title: '图片',
      dataIndex: 'image',
      width: 100,
      render: (img) => <Image width={80} height={60} src={img} />
    },
    {
      title: '楼盘名称',
      dataIndex: 'name',
      width: 180
    },
    {
      title: '位置',
      dataIndex: 'address'
    },
    {
      title: '价格(元/㎡)',
      dataIndex: 'price',
      width: 120
    },
    {
      title: '面积范围',
      dataIndex: 'area',
      width: 120
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 80
    },
    {
      title: '开发商',
      dataIndex: 'developer',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (s) => s === '在售' ? <span style={{ color: '#52c41a' }}>在售</span> : <span style={{ color: '#faad14' }}>待售</span>
    },
    {
      title: '操作',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>楼盘管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加楼盘</Button>
      </div>

      <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="搜索楼盘名称"
            style={{ width: 200 }}
            value={filters.keyword}
            onChange={e => setFilters(f => ({ ...f, keyword: e.target.value }))}
            onPressEnter={handleSearch}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>搜索</Button>
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
        title={editingItem ? '编辑楼盘' : '添加楼盘'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="楼盘名称" rules={[{ required: true }]}>
            <Input placeholder="请输入楼盘名称" />
          </Form.Item>
          <Form.Item name="address" label="位置" rules={[{ required: true }]}>
            <Input placeholder="请输入位置" />
          </Form.Item>
          <Form.Item name="price" label="价格(元/㎡)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} placeholder="请输入价格" />
          </Form.Item>
          <Form.Item name="area" label="面积范围">
            <Input placeholder="如：89-143㎡" />
          </Form.Item>
          <Form.Item name="type" label="类型">
            <Input placeholder="如：住宅、商铺" />
          </Form.Item>
          <Form.Item name="developer" label="开发商">
            <Input placeholder="请输入开发商" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select defaultValue="在售">
              <Option value="在售">在售</Option>
              <Option value="待售">待售</Option>
              <Option value="售罄">售罄</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectManage;
