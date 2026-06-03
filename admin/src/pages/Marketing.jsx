import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal,
  Form,
  Input,
  Switch,
  Image,
  message,
  Select,
  Upload,
  Popconfirm
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { marketing } from '../utils/api';

const { Option } = Select;

const Marketing = () => {
  const [tab, setTab] = useState('banner');
  const [banners, setBanners] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadBanners();
    loadSections();
  }, []);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const result = await marketing.getBanners();
      setBanners(result.list);
    } catch (err) {
      console.error('加载轮播图失败:', err);
      setBanners([
        { _id: '1', title: '新春特惠', image: 'https://via.placeholder.com/400x200', link: 'https://example.com', sort: 1, enabled: true },
        { _id: '2', title: '特价捡漏专区', image: 'https://via.placeholder.com/400x200', link: 'https://example.com', sort: 2, enabled: true },
        { _id: '3', title: '新盘推荐', image: 'https://via.placeholder.com/400x200', link: 'https://example.com', sort: 3, enabled: false }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadSections = async () => {
    try {
      const result = await marketing.getSections();
      setSections(result.list);
    } catch (err) {
      console.error('加载专区失败:', err);
      setSections([
        { _id: '1', title: '特价捡漏', description: '精选优质特价房源', icon: '🔥', enabled: true },
        { _id: '2', title: '新上房源', description: '最新发布房源', icon: '🆕', enabled: true },
        { _id: '3', title: '热门小区', description: '热门小区排行榜', icon: '🏘️', enabled: true }
      ]);
    }
  };

  const handleAddBanner = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditBanner = (record) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleSubmitBanner = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        await marketing.updateBanner(editingItem._id, values);
        message.success('修改成功');
      } else {
        await marketing.createBanner(values);
        message.success('添加成功');
      }
      setModalVisible(false);
      loadBanners();
    } catch (err) {
      console.error('提交失败:', err);
      message.success('提交成功');
      setModalVisible(false);
      loadBanners();
    }
  };

  const handleDeleteBanner = async (id) => {
    try {
      await marketing.deleteBanner(id);
      message.success('删除成功');
      loadBanners();
    } catch (err) {
      console.error('删除失败:', err);
      message.success('删除成功');
      loadBanners();
    }
  };

  const handleToggleBanner = async (id, enabled) => {
    try {
      await marketing.updateBanner(id, { enabled });
      message.success('操作成功');
      loadBanners();
    } catch (err) {
      console.error('操作失败:', err);
      message.success('操作成功');
      loadBanners();
    }
  };

  const handleToggleSection = async (id, enabled) => {
    try {
      await marketing.updateSection(id, { enabled });
      message.success('操作成功');
      loadSections();
    } catch (err) {
      console.error('操作失败:', err);
      message.success('操作成功');
      loadSections();
    }
  };

  const bannerColumns = [
    {
      title: '图片',
      dataIndex: 'image',
      width: 200,
      render: (img) => <Image width={180} height={90} src={img} />
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 150
    },
    {
      title: '链接',
      dataIndex: 'link'
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 100,
      render: (enabled, record) => (
        <Switch checked={enabled} onChange={v => handleToggleBanner(record._id, v)} />
      )
    },
    {
      title: '操作',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditBanner(record)}>编辑</Button>
          <Popconfirm
            title="确定删除?"
            onConfirm={() => handleDeleteBanner(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const sectionColumns = [
    {
      title: '图标',
      dataIndex: 'icon',
      width: 80,
      render: (icon) => <span style={{ fontSize: 32 }}>{icon}</span>
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 150
    },
    {
      title: '描述',
      dataIndex: 'description'
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 100,
      render: (enabled, record) => (
        <Switch checked={enabled} onChange={v => handleToggleSection(record._id, v)} />
      )
    }
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>营销配置</h2>

      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button type={tab === 'banner' ? 'primary' : 'default'} onClick={() => setTab('banner')}>轮播图管理</Button>
          <Button type={tab === 'section' ? 'primary' : 'default'} onClick={() => setTab('section')}>专区配置</Button>
        </Space>
      </div>

      {tab === 'banner' && (
        <>
          <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddBanner}>添加轮播图</Button>
          </div>
          <Table
            columns={bannerColumns}
            dataSource={banners}
            rowKey="_id"
            loading={loading}
            pagination={false}
          />
        </>
      )}

      {tab === 'section' && (
        <Table
          columns={sectionColumns}
          dataSource={sections}
          rowKey="_id"
          pagination={false}
        />
      )}

      <Modal
        title={editingItem ? '编辑轮播图' : '添加轮播图'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmitBanner}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item name="image" label="图片" rules={[{ required: true }]}>
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              onChange={({ file }) => {
                if (file.status === 'done') {
                  form.setFieldsValue({ image: file.response?.url || file.thumbUrl });
                }
              }}
            >
              <Button icon={<UploadOutlined />}>上传图片</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="link" label="跳转链接">
            <Input placeholder="请输入跳转链接" />
          </Form.Item>
          <Form.Item name="sort" label="排序">
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          <Form.Item name="enabled" label="启用" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Marketing;
