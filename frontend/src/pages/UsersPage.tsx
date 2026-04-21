import { useEffect, useState } from 'react';
import { Table, Tag, Button, Typography, message, Modal, Form, Input, Select, Popconfirm } from 'antd';
import type { TableColumnsType } from 'antd';
import api from '../api/axios';

const { Title } = Typography;

interface IUser {
  id: number;
  fio: string;
  login: string;
  role: string;
  departmentId?: number;
  department?: { name: string };
}

const UsersPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, deptsRes] = await Promise.all([
        api.get('/users'),
        api.get('/departments')
      ]);
      setUsers(usersRes.data);
      setDepartments(deptsRes.data);
    } catch (error) {
      message.error('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onFinish = async (values: any) => {
    try {
      await api.post('/users', values);
      message.success('Пользователь создан');
      setIsModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (e: any) {
      message.error(e.response?.data?.message || 'Ошибка при создании');
    }
  };

  const columns: TableColumnsType<IUser> = [
    { title: 'ФИО', dataIndex: 'fio', key: 'fio' },
    { title: 'Логин', dataIndex: 'login', key: 'login' },
    { 
      title: 'Роль', 
      dataIndex: 'role', 
      key: 'role',
      render: (role: string) => {
        const colors: any = { ADMIN: 'volcano', MANAGER: 'blue', VIEWER: 'green' };
        return <Tag color={colors[role]}>{role}</Tag>;
      }
    },
    { 
      title: 'Подразделение', 
      render: (_, record) => record.department?.name || 'Все организации' 
    },
    {
      title: 'Действия',
      render: (_, record) => (
        <Popconfirm title="Удалить доступ?" onConfirm={() => api.delete(`/users/${record.id}`).then(fetchData)}>
          <Button type="link" danger>Удалить</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Управление доступом</Title>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>+ Новый пользователь</Button>
      </div>

      <Table dataSource={users} columns={columns} rowKey="id" loading={loading} />

      <Modal title="Создание пользователя" open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="fio" label="ФИО сотрудника" rules={[{ required: true }]}>
            <Input placeholder="Иванов Иван Иванович" />
          </Form.Item>
          
          <Form.Item name="login" label="Логин" rules={[{ required: true }]}>
            <Input placeholder="ivanov_ii" />
          </Form.Item>

          <Form.Item name="password" label="Пароль" rules={[{ required: true, min: 6 }]}>
            <Input.Password placeholder="Минимум 6 символов" />
          </Form.Item>

          <Form.Item name="role" label="Роль в системе" rules={[{ required: true }]}>
            <Select placeholder="Выберите права доступа">
              <Select.Option value="ADMIN">Администратор (Полный доступ)</Select.Option>
              <Select.Option value="MANAGER">Менеджер (Учет имущества)</Select.Option>
              <Select.Option value="VIEWER">Наблюдатель (Только отчеты)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="departmentId" label="Привязка к отделу (необязательно)">
            <Select placeholder="Выберите отдел" allowClear>
              {departments.map(d => <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>)}
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large">Создать аккаунт</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;