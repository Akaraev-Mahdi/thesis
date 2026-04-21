import React from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import { 
  DatabaseOutlined, 
  ClusterOutlined, 
  UserOutlined, 
  LogoutOutlined,
  HomeOutlined 
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { key: '/items', icon: <DatabaseOutlined />, label: 'Оборудование' },
    { key: '/departments', icon: <ClusterOutlined />, label: 'Подразделения' },
    { key: '/rooms', icon: <HomeOutlined />, label: 'Кабинеты' },
    { key: '/users', icon: <UserOutlined />, label: 'Пользователи' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6, textAlign: 'center', color: 'white', lineHeight: '32px' }}>
          УЧЁТ ИМУЩЕСТВА
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
            Выйти
          </Button>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG, overflow: 'initial' }}>
          <Outlet /> {/* Здесь будут рендериться страницы */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;