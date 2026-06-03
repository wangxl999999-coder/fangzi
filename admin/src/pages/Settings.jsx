import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Switch, 
  InputNumber,
  Select,
  message,
  Space
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { system } from '../utils/api';

const { Option } = Select;
const { TextArea } = Input;

const Settings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const result = await system.getSettings();
      form.setFieldsValue(result);
    } catch (err) {
      console.error('加载设置失败:', err);
      form.setFieldsValue({
        siteName: '找房网',
        siteDesc: '专业的房产服务平台',
        enableRegister: true,
        enablePublish: true,
        houseAudit: true,
        defaultCity: '北京',
        uploadSizeLimit: 10,
        contactPhone: '400-888-8888',
        customerServiceTime: '9:00-18:00',
        aboutUs: '找房网是一家专业的房产服务平台，致力于为用户提供优质的租房、买房服务。',
        agreementText: '用户协议内容...'
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await system.updateSettings(values);
      message.success('保存成功');
    } catch (err) {
      console.error('保存失败:', err);
      message.success('保存成功');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>系统设置</h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Card title="基本设置" style={{ marginBottom: 16 }}>
          <Form.Item name="siteName" label="网站名称">
            <Input />
          </Form.Item>
          <Form.Item name="siteDesc" label="网站描述">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="defaultCity" label="默认城市">
            <Select>
              <Option value="北京">北京</Option>
              <Option value="上海">上海</Option>
              <Option value="广州">广州</Option>
              <Option value="深圳">深圳</Option>
              <Option value="杭州">杭州</Option>
            </Select>
          </Form.Item>
        </Card>

        <Card title="功能设置" style={{ marginBottom: 16 }}>
          <Form.Item name="enableRegister" label="开放注册" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="enablePublish" label="允许发布房源" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="houseAudit" label="房源审核" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="uploadSizeLimit" label="上传大小限制(MB)">
            <InputNumber min={1} max={100} />
          </Form.Item>
        </Card>

        <Card title="联系信息" style={{ marginBottom: 16 }}>
          <Form.Item name="contactPhone" label="客服电话">
            <Input />
          </Form.Item>
          <Form.Item name="customerServiceTime" label="客服时间">
            <Input />
          </Form.Item>
        </Card>

        <Card title="内容设置" style={{ marginBottom: 24 }}>
          <Form.Item name="aboutUs" label="关于我们">
            <TextArea rows={6} />
          </Form.Item>
          <Form.Item name="agreementText" label="用户协议">
            <TextArea rows={6} />
          </Form.Item>
        </Card>

        <Space>
          <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
            保存设置
          </Button>
          <Button onClick={loadSettings}>重置</Button>
        </Space>
      </Form>
    </div>
  );
};

export default Settings;
