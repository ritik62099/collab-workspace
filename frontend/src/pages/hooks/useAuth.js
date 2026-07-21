import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const { user, isAuthenticated, login, register, logout, loading, error } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  };
};

export default useAuth;