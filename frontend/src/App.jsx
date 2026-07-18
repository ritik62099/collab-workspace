<<<<<<< HEAD
import React from 'react';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return <AppRoutes />;
};

export default App;
=======
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
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
