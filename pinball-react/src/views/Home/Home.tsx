import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100 gap-[24px]">
      <h1 className="text-4xl font-bold text-primary-500 mb-24">欢迎来到弹弹珠</h1>

      <div className="flex flex-col  gap-[12px]">
        <Link to="/game" className={btnClassName1}>
          开始游戏
        </Link>
        <Link to="/login" className={btnClassName2}>
          登录
        </Link>
        <Link to="/register" className={btnClassName2}>
          注册
        </Link>
      </div>
    </div>
  );
};

const btnClassName1 = `
  px-6 py-3 bg-primary-500 text-white font-bold rounded transition-all 
  duration-300 hover:-translate-y-0.5 hover:shadow-md
`;
const btnClassName2 = `
  px-6 py-3 bg-white text-primary-500 border border-primary-500 font-bold 
  rounded transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md
`;

export default Home;
