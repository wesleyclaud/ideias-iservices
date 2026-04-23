import { useAuthStore } from '../store/authStore';
import { logout as logoutService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const { user, accessToken, setAuth, logout: clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const signOut = async () => {
    try { await logoutService(); } catch {}
    clearAuth();
    navigate('/login');
  };

  return { user, accessToken, setAuth, signOut, isAuthenticated: !!user };
};
