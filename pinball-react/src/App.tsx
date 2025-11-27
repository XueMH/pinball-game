import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/router'; // 引入我们刚刚创建的路由配置文件
import { Provider } from 'react-redux';
import { store, persistor } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <AppRoutes /> {/* 渲染路由 */}
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;
