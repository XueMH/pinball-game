import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 登录逻辑待实现
    console.log('登录信息:', { email, password });
  };

  return (
    <div className="max-w-md mx-auto my-24 p-8 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center text-primary-500 mb-6">登录</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-primary-500 text-white font-bold rounded-md hover:bg-primary-600 transition-colors duration-200"
        >
          登录
        </button>
        <div className="text-center text-gray-600 mt-4">
          还没有账号?{' '}
          <Link to="/register" className="text-primary-500 hover:underline">
            立即注册
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
