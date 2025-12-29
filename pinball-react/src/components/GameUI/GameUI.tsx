import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import { setRemainingBalls, addScore, resetScore, addWonBalls, resetRemainingBalls } from '@/store/slices/playerSlice';
import {
  set投入Balls,
  increase投入Balls,
  setMultiplier,
  setIsStarted,
  resetRoundStats,
  setWinMultiplier,
  setWinExits,
} from '@/store/slices/roundStatsSlice';
import type { RootState, PlayerState, RoundStatsState } from '@/store/types';

type GameUIProps = {
  children?: React.ReactNode;
};

export default function GameUI({ children }: GameUIProps) {
  const dispatch: AppDispatch = useDispatch();
  const playerState = useSelector<RootState, PlayerState>(state => state.player);
  const roundState = useSelector<RootState, RoundStatsState>(state => state.round);
  const [isLandscape, setIsLandscape] = useState(window.innerWidth * 1.5 > window.innerHeight);

  // 添加弹珠到当前游戏 - 每5个弹珠获得一次游戏机会
  const addBalls = (count: number) => {
    if (playerState.remainingBalls >= count) {
      dispatch(setRemainingBalls(playerState.remainingBalls - count));
      dispatch(increase投入Balls(count));
    } else {
      alert('弹珠不足！');
    }
  };

  // 开始游戏 - 生成随机倍数和赢球出口
  const startGame = () => {
    if (roundState.balls投入 >= 5) {
      // 需要至少5个弹珠才能开始游戏
      // 生成随机倍数 (2, 4, 6, 8, 10，概率递减)
      const multipliers = [2, 4, 6, 8, 10];
      const weights = [40, 30, 15, 10, 5]; // 概率递减
      let randomMultiplier = 2;
      const rand = Math.random() * 100;
      let cumulativeWeight = 0;
      for (let i = 0; i < multipliers.length; i++) {
        cumulativeWeight += weights[i];
        if (rand <= cumulativeWeight) {
          randomMultiplier = multipliers[i];
          break;
        }
      }

      // 生成随机赢球出口 (4, 3, 2, 1, 1，等概率)
      const winExitsOptions = [4, 3, 2, 1, 1];
      const randomWinExits = winExitsOptions[Math.floor(Math.random() * winExitsOptions.length)];

      dispatch(setMultiplier(randomMultiplier));
      dispatch(setWinMultiplier(randomMultiplier)); // 同时设置赢球倍数
      dispatch(setWinExits(randomWinExits)); // 设置赢球出口数量
      dispatch(setIsStarted(true));
      // 发射事件到游戏场景，开始游戏并传递倍数和赢球出口
      
      window.bus.emit('StartGame', { multiplier: randomMultiplier, winExits: randomWinExits });
    } else {
      alert('至少需要5个弹珠才能开始游戏！');
    }
  };

  let powerDownTimer: NodeJS.Timeout | null = null;
  // 蓄力操作，用于发射小球
  const powerUp = () => {
    // 这将在游戏场景中触发蓄力效果
    powerDownTimer = setInterval(() => {
      window.bus.emit('PowerUp');
    });
  };

  // 发射小球
  const launchBall = () => {
    if (powerDownTimer) {
      clearInterval(powerDownTimer);
      powerDownTimer = null;
    }
    // 这将在游戏场景中触发小球发射
    window.bus.emit('LaunchBall');
  };

  useEffect(() => {
    const onResize = () => {
      setIsLandscape(window.innerWidth * 1.5 > window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // 监听游戏结果事件，更新玩家状态
    window.bus.on('UpdatePlayerStats', (data: { rewardBalls: number; score: number; isCriticalHit: boolean }) => {
      console.log('收到游戏结果：', data);
      dispatch(addWonBalls(data.rewardBalls)); // 添加奖励弹珠到总赢取弹珠数
      dispatch(addScore(data.score)); // 添加积分

      // 根据结果显示相应消息
      if (data.isCriticalHit) {
        alert(`暴击！获得 ${data.rewardBalls} 个弹珠，${data.score} 积分！`);
      } else {
        alert(`游戏结束！获得 ${data.rewardBalls} 个弹珠，${data.score} 积分！`);
      }
    });

    // 监听回合重置
    window.bus.on('ResetRound', () => {
      dispatch(resetRoundStats());
    });

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [dispatch]);
  return (
    <div className={`${containerClassName} ${isLandscape ? 'flex-row items-stretch' : 'flex-col'}`}>
      {/* 竖屏时在顶部信息展示 */}
      {!isLandscape && <GameData playerState={playerState} roundState={roundState} />}
      {/* 游戏区域 */}
      <div className={isLandscape ? gameContainerLandscapeClassName : gameContainerPortraitClassName}>{children}</div>
      <div className="min-w-[500px] flex flex-col justify-between">
        {/* 横屏时在右侧顶部信息展示 */}
        {isLandscape && <GameData playerState={playerState} roundState={roundState} />}
        {/* 底部操作按钮 */}
        <div className="flex justify-space-between gap-[16px] w-full  ">
          <button className={btnClassName} onClick={() => addBalls(1)}>
            +1
          </button>
          <button className={btnClassName} onClick={() => addBalls(5)}>
            +5
          </button>
          <button className={btnClassName} onClick={() => addBalls(10)}>
            +10
          </button>
          <button className={btnClassName} onClick={startGame}>
            开始
          </button>
          <button className={btnClassName} onMouseDown={powerUp} onMouseUp={launchBall}>
            蓄力
          </button>
        </div>
      </div>
    </div>
  );
}

const containerClassName = 'w-full h-max  flex gap-[16px] justify-center items-center p-[20px]';
const gameContainerLandscapeClassName = 'flex-1 overflow-hidden';
const gameContainerPortraitClassName = 'w-full ';
const btnClassName = 'flex-1 text-[16px] bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md';

const GameData = ({ playerState, roundState }: { playerState: PlayerState; roundState: RoundStatsState }) => {
  return (
    <div className="w-full flex justify-space-between items-center gap-[12px] text-[18px] bg-gray-100 p-3 rounded-md">
      {/* 左侧： 玩家弹珠、积分统计 */}
      <div className="flex flex-col flex-1 border-r border-r-gray-300 border-r-solid ">
        <div className="flex justify-space-between">
          <span>剩余弹珠：</span>
          <span>{playerState.remainingBalls}</span>
        </div>
        <div className="flex justify-space-between">
          <span>积分：</span>
          <span>{playerState.score}</span>
        </div>
      </div>
      {/* 右侧： 本局信息 */}
      <div className="flex flex-col flex-2">
        <div className="flex justify-space-between">
          <div className="flex justify-space-between flex-1">
            <span>投入弹珠：</span>
            <span>{roundState.balls投入}</span>
          </div>
          <div className="flex justify-space-between flex-1">
            <span>当前倍数：</span>
            <span>{roundState.multiplier}</span>
          </div>
        </div>
        <div className="flex justify-space-between">
          <div className="flex justify-space-between flex-1">
            <span>赢球倍数：</span>
            <span>{roundState.winMultiplier}</span>
          </div>
          <div className="flex justify-space-between flex-1">
            <span>赢球出口：</span>
            <span>{roundState.winExits}</span>
          </div>
        </div>
        <div className="flex justify-space-between">
          <div className="flex justify-space-between flex-1">
            <span>奖励弹珠：</span>
            <span>{playerState.totalWonBalls}</span>
          </div>
          <div className="flex justify-space-between flex-1">
            <span>状态：</span>
            <span>{roundState.isStarted ? '进行中' : '未开始'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
