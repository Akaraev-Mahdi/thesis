import { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Typography, message, Modal, Form, Input, Select, Timeline } from 'antd';
import type { TableColumnsType } from 'antd';
import api from '../api/axios';
import * as XLSX from 'xlsx';

const { Title } = Typography;

// --- Интерфейсы ---
interface IDepartment {
  id: number;
  name: string;
}

interface IRoom {
  id: number;
  number: string;
  department?: IDepartment;
}

interface IItem {
  id: number;
  name: string;
  inventoryNumber: string;
  status: string;
  roomId: number;
  room?: IRoom;
}

const ItemsPage = () => {
  const [items, setItems] = useState<IItem[]>([]);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<IItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, roomsRes] = await Promise.all([
        api.get('/items'),
        api.get('/rooms')
      ]);
      setFilteredItems(itemsRes.data);
      setItems(itemsRes.data);
      setRooms(roomsRes.data);
    } catch (error) {
      message.error('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onFinish = async (values: any) => {
    try {
      if (editingItem) {
        await api.patch(`/items/${editingItem.id}`, values);
        message.success('Данные обновлены');
      } else {
        await api.post('/items', values);
        message.success('Предмет добавлен');
      }
      closeModal();
      fetchData();
    } catch (e: any) {
      // 1. Пытаемся достать сообщение от бэкенда
      const errorMessage = e.response?.data?.message;

      // 2. Если это массив (ошибки валидации DTO), соединяем их в строку
      if (Array.isArray(errorMessage)) {
        message.error(errorMessage.join(', '));
      } 
      // 3. Если это строка (наш BadRequestException из сервиса)
      else if (typeof errorMessage === 'string') {
        message.error(errorMessage);
      } 
      // 4. Если что-то совсем непонятное
      else {
        message.error('Произошла непредвиденная ошибка');
      }
      
      console.error('Полная ошибка:', e);
    }
  };

  const exportToExcel = () => {
    // Проверяем, есть ли что экспортировать
    if (filteredItems.length === 0) {
      message.warning('Нет данных для экспорта');
      return;
    }

    // Используем filteredItems вместо items
    const dataToExport = filteredItems.map(item => ({
      'Инвентарный номер': item.inventoryNumber,
      'Наименование': item.name,
      'Подразделение': item.room?.department?.name || '—',
      'Кабинет': item.room?.number || '—',
      'Статус': item.status === 'active' ? 'Активен' : item.status === 'repair' ? 'В ремонте' : 'Списан'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Оборудование");

    XLSX.writeFile(workbook, `Otchet_Filter_${new Date().toLocaleDateString()}.xlsx`);
    message.success(`Экспортировано строк: ${filteredItems.length}`);
  };

  const handleEdit = (record: IItem) => {
    setEditingItem(record);
    setIsModalVisible(true);
    // Используем setTimeout, чтобы форма успела инициализироваться в Modal
    setTimeout(() => {
      form.setFieldsValue({
        name: record.name,
        inventoryNumber: record.inventoryNumber,
        roomId: record.roomId,
        status: record.status
      });
    }, 100);
  };

  const showHistory = async (itemId: number) => {
    try {
      const res = await api.get(`/items/${itemId}/history`);
      setHistoryData(res.data);
      setIsHistoryVisible(true);
    } catch (e) {
      message.error('Не удалось загрузить историю');
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/items/${id}`);
      message.success('Предмет удален');
      fetchData();
    } catch (e) {
      message.error('Ошибка при удалении');
    }
  };

  const columns: TableColumnsType<IItem> = [
    {
      title: 'Инв. Номер',
      dataIndex: 'inventoryNumber',
      key: 'inventoryNumber',
      sorter: (a, b) => a.inventoryNumber.localeCompare(b.inventoryNumber),
    },
    {
      title: 'Наименование',
      dataIndex: 'name',
      key: 'name',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button type="primary" onClick={() => confirm()} size="small" style={{ width: 90 }}>Найти</Button>
            <Button onClick={() => { clearFilters?.(); confirm(); }} size="small" style={{ width: 90 }}>Сброс</Button>
          </Space>
        </div>
      ),
      onFilter: (value: any, record) => record.name.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: 'Подразделение',
      key: 'department',
      // Собираем список всех уникальных подразделений из массива комнат
      filters: Array.from(new Set(rooms.map(r => r.department?.name))).filter(Boolean).map(name => ({
        text: name ?? 'Неизвестно',
        value: name ?? '',
      })),
      filterSearch: true,
      onFilter: (value: any, record) => record.room?.department?.name === value,
      render: (_, record) => record.room?.department?.name || '—',
    },
    {
      title: 'Кабинет',
      key: 'room',
      // Собираем список всех уникальных номеров комнат
      filters: rooms.map(r => ({ text: r.number, value: r.number })),
      filterSearch: true,
      onFilter: (value: any, record) => record.room?.number === value,
      render: (_, record) => record.room?.number || '—',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      // Фильтр по статусу
      filters: [
        { text: 'Активен', value: 'active' },
        { text: 'В ремонте', value: 'repair' },
        { text: 'Списан', value: 'retired' },
      ],
      onFilter: (value: any, record) => record.status === value,
      render: (status: string) => {
        const colors: Record<string, string> = { active: 'green', repair: 'orange', retired: 'red' };
        const texts: Record<string, string> = { active: 'Активен', repair: 'В ремонте', retired: 'Списан' };
        return <Tag color={colors[status]}>{texts[status]?.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Действия',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>Изменить</Button>
          <Button type="link" onClick={() => showHistory(record.id)}>История</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Удалить</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Учёт мебели и оборудования</Title>
        <Space size="middle"> 
          <Button 
            onClick={exportToExcel} 
            size="large" // Делаем высоту как у основной кнопки
            style={{ 
              backgroundColor: '#217346', 
              color: 'white', 
              borderColor: '#217346',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Распечатать в Excel
          </Button>
          
          <Button 
            type="primary" 
            size="large" 
            onClick={() => setIsModalVisible(true)}
          >
            + Добавить предмет
          </Button>
        </Space>
      </div>

      <Table 
        dataSource={items} 
        columns={columns} 
        rowKey="id" 
        loading={loading} 
        onChange={(_pagination, _filters, _sorter, extra) => {
          // extra.currentDataSource содержит данные с учетом всех фильтров
          setFilteredItems(extra.currentDataSource);
        }}
        pagination={{ 
          pageSize: 10, 
          hideOnSinglePage: true, // Скрывать, если всего одна страница
          position: ['bottomCenter'] // Центрировать для красоты
        }}
      />

      <Modal
        title={editingItem ? "Редактирование" : "Новое имущество"}
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 'active' }}>
          <Form.Item name="name" label="Наименование" rules={[{ required: true, message: 'Введите название' }]}>
            <Input />
          </Form.Item>
          
          <Form.Item name="inventoryNumber" label="Инвентарный номер" rules={[{ required: true, message: 'Введите номер' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="roomId" label="Кабинет" rules={[{ required: true, message: 'Выберите кабинет' }]}>
            <Select placeholder="Выберите кабинет" showSearch optionFilterProp="children">
              {rooms.map((room) => (
                <Select.Option key={room.id} value={room.id}>
                  {room.number} {room.department ? `(${room.department.name})` : ''}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Статус" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="active">Активен</Select.Option>
              <Select.Option value="repair">В ремонте</Select.Option>
              <Select.Option value="retired">Списан</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="История перемещений объекта"
        open={isHistoryVisible}
        onCancel={() => setIsHistoryVisible(false)}
        footer={null}
        width={500}
        centered
      >
        <div style={{ padding: '20px 0' }}> 
          <Timeline
            style={{ marginTop: 20 }}
            items={historyData.map(h => ({
              color: 'blue',
              children: (
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                    {new Date(h.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <Typography.Text strong>{h.user?.fio}</Typography.Text> переместил:
                  </div>
                  <div style={{ marginTop: 5 }}>
                    <Tag>{h.fromRoom?.number || 'Начальный склад'}</Tag> 
                    <span style={{ margin: '0 8px' }}>→</span>
                    <Tag color="blue">{h.toRoom?.number}</Tag>
                  </div>
                </div>
              ),
            }))}
          />
          {historyData.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px' }}>Перемещений еще не было</div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ItemsPage;