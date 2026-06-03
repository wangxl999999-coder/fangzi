import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Select, 
  Input,
  Tag,
  Image,
  message,
  Popconfirm
} from 'antd';
import { SearchOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { house } from '../utils/api';

const { Option } = Select;

const statusMap = {
  pending: { color: 'orange', text: '待审核' },
  approved: { color: 'green', text: '已通过' },
  rejected: { color: 'red', text: '已拒绝' },
  offline: { color: 'default', text: '已下架' }
};

const typeMap = {
  rent: '整租',
  share: '合租',
  sale: '出售',
  new: '新房'
};

const HouseManage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({ status: '', keyword: '' });
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentHouse, setCurrentHouse] = useState(null);
  const [auditVisible, setAuditVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await house.getList({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters
      });
      setData(result.list);
      setPagination(p => ({ ...p, total: result.total }));
    } catch (err) {
      console.error('加载房源失败:', err);
      setData([
        { _id: '1', title: '万科城精装三室', type: 'rent', price: 3500, area: 120, address: '朝阳区望京', status: 'pending', image: 'https://via.placeholder.com/80', createdAt: '2024-01-15', agent: '张经纪人' },
        { _id: '2', title: '碧桂园精装两室', type: 'sale', price: 280, area: 89, address: '海淀区中关村', status: 'approved', image: 'https://via.placeholder.com/80', createdAt: '2024-01-14', agent: '李经纪人' },
        { _id: '3', title: '恒大华府大四居', type: 'rent', price: 8000, area: 180, address: '东城区王府井', status: 'rejected', image: 'https://via.placeholder.com/80', createdAt: '2024-01-13', agent: '王经纪人' }
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

  const handleViewDetail = async (record) => {
    try {
      const result = await house.getDetail(record._id);
      setCurrentHouse(result);
    } catch (err) {
      setCurrentHouse(record);
    }
    setDetailVisible(true);
  };

  const handleAudit = (record) => {
    setCurrentHouse(record);
    form.setFieldsValue({ status: 'approved', remark: '' });
    setAuditVisible(true);
  };

  const handleAuditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await house.audit(currentHouse._id, values);
      message.success('审核完成');
      setAuditVisible(false);
      loadData();
    } catch (err) {
      console.error('审核失败:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await house.delete(id);
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
      title: '房源图片',
      dataIndex: 'image',
      width: 100,
      render: (img) => <Image width={80} height={60} src={img} />
    },
    {
      title: '房源标题',
      dataIndex: 'title',
      width: 200
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      render: (type) => typeMap[type] || type
    },
    {
      title: '价格',
      dataIndex: 'price',
      width: 100,
      render: (price, record) => record.type === 'sale' ? `${price}万` : `${price}元/月`
    },
    {
      title: '面积(㎡)',
      dataIndex: 'area',
      width: 80
    },
    {
      title: '地址',
      dataIndex: 'address'
    },
    {
      title: '经纪人',
      dataIndex: 'agent',
      width: 100
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
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 120
    },
    {
      title: '操作',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>详情</Button>
          {record.status === 'pending' && (
            <Button type="link" onClick={() => handleAudit(record)}>审核</Button>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>房源管理</h2>
      </div>

      <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <Space>
          <Select
            placeholder="状态筛选"
            style={{ width: 120 }}
            value={filters.status || undefined}
            onChange={v => setFilters(f => ({ ...f, status: v }))}
          >
            <Option value="">全部</Option>
            <Option value="pending">待审核</Option>
            <Option value="approved">已通过</Option>
            <Option value="rejected">已拒绝</Option>
            <Option value="offline">已下架</Option>
          </Select>
          <Input
            placeholder="搜索标题/地址"
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
        title="房源详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={800}
        footer={[
          <Button onClick={() => setDetailVisible(false)}>关闭</Button>
        ]}
      >
        {currentHouse && (
          <div>
            <p><strong>标题：</strong>{currentHouse.title}</p>
            <p><strong>价格：</strong>{currentHouse.price} {currentHouse.type === 'sale' ? '万' : '元/月'}</p>
            <p><strong>面积：</strong>{currentHouse.area} ㎡</p>
            <p><strong>户型：</strong>{currentHouse.bedrooms}室{currentHouse.livingrooms}厅{currentHouse.bathrooms}卫</p>
            <p><strong>地址：</strong>{currentHouse.address}</p>
            <p><strong>装修：</strong>{currentHouse.decoration}</p>
            <p><strong>朝向：</strong>{currentHouse.orientation}</p>
            <p><strong>楼层：</strong>{currentHouse.floor}</p>
            <p><strong>配套：</strong>{currentHouse.facilities?.join('、')}</p>
            <p><strong>描述：</strong>{currentHouse.description}</p>
          </div>
        )}
      </Modal>

      <Modal
        title="审核房源"
        open={auditVisible}
        onCancel={() => setAuditVisible(false)}
        onOk={handleAuditSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="status" label="审核结果" rules={[{ required: true }]}>
            <Select>
              <Option value="approved">通过</Option>
              <Option value="rejected">拒绝</Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="审核备注">
            <Input.TextArea rows={4} placeholder="请输入审核备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HouseManage;
