import { useRoutes } from 'react-router-dom';
import Home from '@/views/Home/Home';
import Game from '@/views/Game/Game';
import Login from '@/views/Login/Login';
import Register from '@/views/Register/Register';

const AppRoutes = () => {
  // 路由配置数组
  const routes = [
    {
      path: '/game',
      element: <Game />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/',
      element: <Home />, // 默认路由
    },
  ];

  // 使用 useRoutes 来渲染路由
  return useRoutes(routes);
};

export default AppRoutes;
