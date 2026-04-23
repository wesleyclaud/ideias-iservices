import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';
import { ProtectedRoute } from './router/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ServiceOrders from './pages/ServiceOrders/ServiceOrders';
import Contracts from './pages/Contracts/Contracts';
import Documents from './pages/Documents/Documents';
import Fuel from './pages/Fuel/Fuel';
import RoutesPage from './pages/Routes/Routes';
import Prospects from './pages/Prospects/Prospects';

export default function App() {
  const { initTheme } = useThemeStore();

  useEffect(() => { initTheme(); }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '14px',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="service-orders" element={<ServiceOrders />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="documents" element={<Documents />} />
          <Route path="fuel" element={<Fuel />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="prospects" element={<Prospects />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
