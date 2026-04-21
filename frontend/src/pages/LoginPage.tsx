import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const response = await api.post('/auth/login', values);
      // Сохраняем токен и данные пользователя
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      message.success('Вход выполнен успешно!');
      navigate('/items'); // Перенаправляем на таблицу вещей
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Ошибка при входе');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Система учёта</Title>
          <Typography.Text type="secondary">Введите логин и пароль для входа</Typography.Text>
        </div>
        
        <Form name="login" onFinish={onFinish} layout="vertical" size="large">
          <Form.Item name="login" rules={[{ required: true, message: 'Введите логин!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Логин" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>Войти</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
