import { useEffect, useState } from 'react';

type GameUIProps = {
  children?: React.ReactNode;
};

export default function GameUI({ children }: GameUIProps) {
  const [isLandscape, setIsLandscape] = useState(window.innerWidth * 1.5 > window.innerHeight);

  useEffect(() => {
    const onResize = () => {
      setIsLandscape(window.innerWidth * 1.5 > window.innerHeight);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return (
    <div className={`${containerClassName} ${isLandscape ? 'flex-row items-stretch' : 'flex-col'}`}>
      {/* 竖屏时在顶部信息展示 */}
      {!isLandscape && <GameData></GameData>}
      {/* 游戏区域 */}
      <div className={isLandscape ? gameContainerLandscapeClassName : gameContainerPortraitClassName}>{children}</div>
      <div className="min-w-[500px] flex flex-col justify-between">
        {/* 横屏时在右侧顶部信息展示 */}
        {isLandscape && <GameData></GameData>}
        {/* 底部操作按钮 */}
        <div className="flex justify-space-between gap-[16px] w-full  ">
          <button className={btnClassName}>+1</button>
          <button className={btnClassName}>+5</button>
          <button className={btnClassName}>+10</button>
          <button className={btnClassName}>开始</button>
          <button className={btnClassName}>蓄力</button>
        </div>
      </div>
    </div>
  );
}

const containerClassName = 'w-full h-max  flex gap-[16px] justify-center items-center p-[20px]';
const gameContainerLandscapeClassName = 'flex-1 overflow-hidden';
const gameContainerPortraitClassName = 'w-full ';
const btnClassName = 'flex-1 text-[20px]';

const GameData = () => {
  return (
    <div className="w-full flex justify-space-between items-center gap-[12px] text-[24px]">
      {/* 左侧： 玩家弹珠、积分统计 */}
      <div className="flex flex-col flex-1 border-r border-r-gray-300 border-r-solid ">
        <div className="flex justify-space-between">
          <span>剩余弹珠：</span>
          <span>{0}</span>
        </div>
        <div className="flex justify-space-between">
          <span>积分：</span>
          <span>{0}</span>
        </div>
      </div>
      {/* 右侧： 本局信息 */}
      <div className="flex flex-col flex-2">
        <div className="flex justify-space-between">
          <div className="flex justify-space-between flex-1">
            <span>投入弹珠：</span>
            <span>{0}</span>
          </div>
          <div className="flex justify-space-between flex-1">
            <span>倍数：</span>
            <span>{0}</span>
          </div>
        </div>
        <div className="flex justify-space-between">
          <div className="flex justify-space-between flex-1">
            <span>奖励弹珠：</span>
            <span>{0}</span>
          </div>
          <div className="flex justify-space-between flex-1"></div>
        </div>
      </div>
    </div>
  );
};
