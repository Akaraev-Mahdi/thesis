import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ItemsPage from './pages/ItemsPage';
import MainLayout from './components/MainLayout';
import RoomsPage from './pages/RoomsPage';
import DepartmentsPage from './pages/DepartmentsPage';
import UsersPage from './pages/UsersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Все страницы внутри MainLayout требуют авторизации */}
        <Route element={<MainLayout />}>
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/items" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

