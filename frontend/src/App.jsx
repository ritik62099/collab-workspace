import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import useAuthStore from './store/useAuthStore';

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return <AppRoutes />;
}

export default App;
