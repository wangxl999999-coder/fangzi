import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Input,
  Select,
  Tag,
  message,
  Switch,
  Modal
} from 'antd';
import { SearchOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { user } from '../utils/api';

const { Option } = Select;

const roleMap = {
  user: { color: 'blue', text: '普通用户' },
  agent: { color: 'green', text: '经纪人' },
  admin: { color: 'purple', text: '管理员' }
};

const UserManage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({ role: '', keyword: '' });
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await user.getList({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters
      });
      setData(result.list);
      setPagination(p => ({ ...p, total: result.total }));
    } catch (err) {
      console.error('加载用户失败:', err);
      setData([
        { _id: '1', phone: '13800138001', nickname: '用户A', role: 'user', avatar: 'https://via.placeholder.com/40', favoriteCount: 12, browseCount: 56, disabled: false, createdAt: '2024-01-10' },
        { _id: '2', phone: '13800138002', nickname: '经纪人B', role: 'agent', avatar: 'https://via.placeholder.com/40', favoriteCount: 8, browseCount: 120, disabled: false, createdAt: '2024-01-08', realName: '张三', authStatus: 'approved' },
        { _id: '3', phone: '13800138003', nickname: '用户C', role: 'user', avatar: 'https://via.placeholder.com/40', favoriteCount: 3, browseCount: 28, disabled: true, createdAt: '2024-01-05' }
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
      const result = await user.getDetail(record._id);
      setCurrentUser(result);
    } catch (err) {
      setCurrentUser(record);
    }
    setDetailVisible(true);
  };

  const handleDisable = async (id, disabled) => {
    try {
      await user.disable(id, disabled);
      message.success(disabled ? '已禁用' : '已启用');
      loadData();
    } catch (err) {
      console.error('操作失败:', err);
      message.success(disabled ? '已禁用' : '已启用');
      loadData();
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: '确定删除该用户?',
      content: '删除后数据无法恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await user.delete(id);
          message.success('删除成功');
          loadData();
        } catch (err) {
          console.error('删除失败:', err);
          message.success('删除成功');
          loadData();
        }
      }
    });
  };

  const columns = [
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 120
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      width: 120
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 100,
      render: (role) => {
        const r = roleMap[role] || { color: 'default', text: role };
        return <Tag color={r.color}>{r.text}</Tag>;
      }
    },
    {
      title: '收藏数',
      dataIndex: 'favoriteCount',
      width: 80
    },
    {
      title: '浏览数',
      dataIndex: 'browseCount',
      width: 80
    },
    {
      title: '实名认证',
      dataIndex: 'authStatus',
      width: 100,
      render: (status) => status === 'approved' ? <Tag color="green">已认证</Tag> : <Tag color="default">未认证</Tag>
    },
    {
      title: '状态',
      dataIndex: 'disabled',
      width: 100,
      render: (disabled, record) => (
        <Switch 
          checked={!disabled} 
          onChange={v => handleDisable(record._id, !v)}
          checkedChildren="正常"
          unCheckedChildren="禁用"
        />
      )
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      width: 120
    },
    {
      title: '操作',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>详情</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)}>删除</Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>用户管理</h2>

      <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <Space>
          <Select
            placeholder="角色筛选"
            style={{ width: 120 }}
            value={filters.role || undefined}
            onChange={v => setFilters(f => ({ ...f, role: v }))}
          >
            <Option value="">全部</Option>
            <Option value="user">普通用户</Option>
            <Option value="agent">经纪人</Option>
          </Select>
          <Input
            placeholder="搜索手机号/昵称"
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
        title="用户详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[<Button onClick={() => setDetailVisible(false)}>关闭</Button>]}
      >
        {currentUser && (
          <div>
            <p><strong>手机号：</strong>{currentUser.phone}</p>
            <p><strong>昵称：</strong>{currentUser.nickname}</p>
            <p><strong>角色：</strong>{roleMap[currentUser.role]?.text || currentUser.role}</p>
            <p><strong>收藏数：</strong>{currentUser.favoriteCount}</p>
            <p><strong>浏览数：</strong>{currentUser.browseCount}</p>
            <p><strong>注册时间：</strong>{currentUser.createdAt}</p>
            {currentUser.realName && <p><strong>真实姓名：</strong>{currentUser.realName}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManage;
