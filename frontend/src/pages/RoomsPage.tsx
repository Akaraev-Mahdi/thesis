import { useEffect, useState } from 'react';
import { Table, Button, Typography, message, Modal, Form, Input, Select, Popconfirm } from 'antd';
import type { TableColumnsType } from 'antd';
import api from '../api/axios';

const { Title } = Typography;

interface IDepartment {
  id: number;
  name: string;
}

interface IRoom {
  id: number;
  number: string;
  departmentId: number;
  department?: IDepartment;
  items?: any[];
}

const RoomsPage = () => {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, deptsRes] = await Promise.all([
        api.get('/rooms'),
        api.get('/departments')
      ]);
      setRooms(roomsRes.data);
      setDepartments(deptsRes.data);
    } catch (error) {
      message.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onFinish = async (values: any) => {
    try {
      await api.post('/rooms', values);
      message.success('Кабинет добавлен');
      setIsModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (e) {
      message.error('Ошибка при создании кабинета');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/rooms/${id}`);
      message.success('Кабинет удален');
      fetchData();
    } catch (e: any) {
      // Бэкенд вернет ошибку, если в комнате есть вещи (наша защита)
      message.error(e.response?.data?.message || 'Ошибка при удалении');
    }
  };

  const columns: TableColumnsType<IRoom> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Номер кабинета', dataIndex: 'number', key: 'number', sorter: (a, b) => a.number.localeCompare(b.number) },
    { 
      title: 'Подразделение', 
      key: 'department', 
      render: (_, record) => record.department?.name || 'Не указано',
      filters: departments.map(d => ({ text: d.name, value: d.name })),
      onFilter: (value, record) => record.department?.name === value,
    },
    {
      title: 'Действия',
      key: 'action',
      render: (_, record) => (
        <Popconfirm 
          title="Удалить кабинет?" 
          description="Удаление невозможно, если в кабинете есть имущество."
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
        <Title level={2} style={{ margin: 0 }}>Справочник кабинетов</Title>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>+ Добавить кабинет</Button>
      </div>

      <Table dataSource={rooms} columns={columns} rowKey="id" loading={loading} />

      <Modal 
        title="Новый кабинет" 
        open={isModalVisible} 
        onCancel={() => setIsModalVisible(false)} 
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="number" label="Номер кабинета" rules={[{ required: true, message: 'Введите номер' }]}>
            <Input placeholder="Например: 101, Кабинет ректора" />
          </Form.Item>
          <Form.Item name="departmentId" label="Подразделение" rules={[{ required: true, message: 'Выберите отдел' }]}>
            <Select placeholder="К какому отделу относится">
              {departments.map(d => (
                <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Сохранить</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomsPage;
