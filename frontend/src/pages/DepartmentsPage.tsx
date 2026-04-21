import { useEffect, useState } from 'react';
import { Table, Button, Typography, message, Modal, Form, Input, Popconfirm } from 'antd';
import type { TableColumnsType } from 'antd';
import api from '../api/axios';

const { Title } = Typography;

interface IDepartment {
  id: number;
  name: string;
  room?: any[]; // Массив комнат для подсчета
}

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/departments');
      setDepartments(res.data);
    } catch (error) {
      message.error('Ошибка загрузки подразделений');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const onFinish = async (values: { name: string }) => {
    try {
      await api.post('/departments', values);
      message.success('Подразделение создано');
      setIsModalVisible(false);
      form.resetFields();
      fetchDepartments();
    } catch (e) {
      message.error('Ошибка при создании');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/departments/${id}`);
      message.success('Удалено');
      fetchDepartments();
    } catch (e: any) {
      message.error(e.response?.data?.message || 'Нельзя удалить отдел, в котором есть кабинеты');
    }
  };

  const columns: TableColumnsType<IDepartment> = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id',
      width: 100 
    },
    { 
      title: 'Название подразделения', 
      dataIndex: 'name', 
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    { 
        title: 'Кол-во кабинетов', 
        key: 'roomsCount',
        render: (_, record) => {
            return record.room ? record.room.length : 0;
        }
    },
    {
      title: 'Действия',
      key: 'action',
      render: (_, record) => (
        <Popconfirm 
          title="Удалить подразделение?" 
          onConfirm={() => handleDelete(record.id)}
          okText="Да"
          cancelText="Нет"
        >
          <Button type="link" danger>Удалить</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Структура организации</Title>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          + Добавить подразделение
        </Button>
      </div>

      <Table 
        dataSource={departments} 
        columns={columns} 
        rowKey="id" 
        loading={loading} 
      />

      <Modal 
        title="Новое подразделение" 
        open={isModalVisible} 
        onCancel={() => setIsModalVisible(false)} 
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item 
            name="name" 
            label="Название" 
            rules={[{ required: true, message: 'Введите название подразделения' }]}
          >
            <Input placeholder="Например: Кафедра ИТ" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Сохранить
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default DepartmentsPage;