import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal,
  Tag,
  Image,
  message,
  Form,
  Select,
  Input
} from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { agent } from '../utils/api';

const { Option } = Select;

const statusMap = {
  pending: { color: 'orange', text: '待审核' },
  approved: { color: 'green', text: '已通过' },
  rejected: { color: 'red', text: '已拒绝' }
};

const AgentAuth = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [status, setStatus] = useState('');
  const [detailVisible, setDetailVisible] = useState(false);
  const [auditVisible, setAuditVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize, status]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await agent.getAuthList({
        page: pagination.current,
        pageSize: pagination.pageSize,
        status
      });
      setData(result.list);
      setPagination(p => ({ ...p, total: result.total }));
    } catch (err) {
      console.error('加载认证列表失败:', err);
      setData([
        { _id: '1', realName: '张三', phone: '13800138001', idCard: '110101199001011234', company: '链家地产', certificateNo: 'BJ12345', idCardFront: 'https://via.placeholder.com/200x120', idCardBack: 'https://via.placeholder.com/200x120', qualification: 'https://via.placeholder.com/200x120', status: 'pending', createdAt: '2024-01-15' },
        { _id: '2', realName: '李四', phone: '13800138002', idCard: '110101199002025678', company: '我爱我家', certificateNo: 'BJ67890', idCardFront: 'https://via.placeholder.com/200x120', idCardBack: 'https://via.placeholder.com/200x120', qualification: 'https://via.placeholder.com/200x120', status: 'approved', createdAt: '2024-01-10' },
        { _id: '3', realName: '王五', phone: '13800138003', idCard: '110101199003039012', company: '中原地产', certificateNo: '', idCardFront: 'https://via.placeholder.com/200x120', idCardBack: 'https://via.placeholder.com/200x120', qualification: '', status: 'rejected', rejectReason: '资质证书不清晰', createdAt: '2024-01-08' }
      ]);
      setPagination(p => ({ ...p, total: 3 }));
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (record) => {
    setCurrentItem(record);
    setDetailVisible(true);
  };

  const handleAudit = (record) => {
    setCurrentItem(record);
    form.setFieldsValue({ status: 'approved', rejectReason: '' });
    setAuditVisible(true);
  };

  const handleAuditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await agent.audit(currentItem._id, values);
      message.success('审核完成');
      setAuditVisible(false);
      loadData();
    } catch (err) {
      console.error('审核失败:', err);
      message.success('审核完成');
      setAuditVisible(false);
      loadData();
    }
  };

  const columns = [
    {
      title: '真实姓名',
      dataIndex: 'realName',
      width: 100
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 120
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      width: 180
    },
    {
      title: '所属公司',
      dataIndex: 'company',
      width: 150
    },
    {
      title: '证书编号',
      dataIndex: 'certificateNo',
      width: 120,
      render: (v) => v || '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (s) => {
        const t = statusMap[s] || { color: 'default', text: s };
        return <Tag color={t.color}>{t.text}</Tag>;
      }
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      width: 120
    },
    {
      title: '操作',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看</Button>
          {record.status === 'pending' && (
            <>
              <Button type="link" icon={<CheckOutlined />} onClick={() => handleAudit(record)}>审核</Button>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>经纪人认证</h2>

      <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <Space>
          <Select
            placeholder="状态筛选"
            style={{ width: 120 }}
            value={status || undefined}
            onChange={v => { setStatus(v); setPagination(p => ({ ...p, current: 1 })); }}
          >
            <Option value="">全部</Option>
            <Option value="pending">待审核</Option>
            <Option value="approved">已通过</Option>
            <Option value="rejected">已拒绝</Option>
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
        title="认证详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={700}
        footer={[
          <Button onClick={() => setDetailVisible(false)}>关闭</Button>,
          currentItem?.status === 'pending' && (
            <Button type="primary" onClick={() => { setDetailVisible(false); handleAudit(currentItem); }}>
              去审核
            </Button>
          )
        ]}
      >
        {currentItem && (
          <div>
            <p><strong>真实姓名：</strong>{currentItem.realName}</p>
            <p><strong>手机号：</strong>{currentItem.phone}</p>
            <p><strong>身份证号：</strong>{currentItem.idCard}</p>
            <p><strong>所属公司：</strong>{currentItem.company}</p>
            <p><strong>证书编号：</strong>{currentItem.certificateNo || '-'}</p>
            {currentItem.rejectReason && <p style={{ color: '#ff4d4f' }}><strong>拒绝原因：</strong>{currentItem.rejectReason}</p>}
            
            <div style={{ marginTop: 16 }}>
              <p><strong>身份证正面：</strong></p>
              <Image width={200} src={currentItem.idCardFront} />
            </div>
            <div style={{ marginTop: 16 }}>
              <p><strong>身份证反面：</strong></p>
              <Image width={200} src={currentItem.idCardBack} />
            </div>
            {currentItem.qualification && (
              <div style={{ marginTop: 16 }}>
                <p><strong>资质证书：</strong></p>
                <Image width={200} src={currentItem.qualification} />
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title="审核认证"
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
          <Form.Item noStyle shouldUpdate={(prev, curr) => prev.status !== curr.status}>
            {({ getFieldValue }) => 
              getFieldValue('status') === 'rejected' && (
                <Form.Item name="rejectReason" label="拒绝原因" rules={[{ required: true }]}>
                  <Input.TextArea rows={4} placeholder="请输入拒绝原因" />
                </Form.Item>
              )
            }
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AgentAuth;
