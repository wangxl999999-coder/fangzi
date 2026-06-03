import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HouseManage from './pages/HouseManage';
import UserManage from './pages/UserManage';
import ProjectManage from './pages/ProjectManage';
import DemandManage from './pages/DemandManage';
import Marketing from './pages/Marketing';
import Settings from './pages/Settings';
import AgentAuth from './pages/AgentAuth';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="houses" element={<HouseManage />} />
          <Route path="users" element={<UserManage />} />
          <Route path="projects" element={<ProjectManage />} />
          <Route path="demands" element={<DemandManage />} />
          <Route path="agent-auth" element={<AgentAuth />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
};

export default App;
