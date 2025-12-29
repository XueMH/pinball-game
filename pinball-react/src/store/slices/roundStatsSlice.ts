import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RoundStatsState } from '../types';

// 当局统计初始状态
const initialState: RoundStatsState = {
  balls投入: 0,
  multiplier: 1,
  isStarted: false,
  winMultiplier: 0, // 初始赢球倍数为0
  winExits: 0, // 初始赢球出口数量为0
  isFinished: false, // 游戏未完成
};

const roundStatsSlice = createSlice({
  name: 'round', // slice 名称，用于 action type 如 "round/setMultiplier"
  initialState,
  reducers: {
    // 设置投入弹珠数量
    set投入Balls(state, action: PayloadAction<number>) {
      state.balls投入 = action.payload;
    },
    // 增加投入弹珠
    increase投入Balls(state, action: PayloadAction<number>) {
      state.balls投入 += action.payload;
    },
    // 设置游戏倍率
    setMultiplier(state, action: PayloadAction<number>) {
      state.multiplier = action.payload;
    },
    // 设置是否开始
    setIsStarted(state, action: PayloadAction<boolean>) {
      state.isStarted = action.payload;
    },
    // 重置当局统计状态
    resetRoundStats(state) {
      state.balls投入 = 0;
      state.multiplier = 1;
      state.isStarted = false;
      state.winMultiplier = 0;
      state.winExits = 0;
      state.isFinished = false;
    },
    // 设置赢球倍数
    setWinMultiplier(state, action: PayloadAction<number>) {
      state.winMultiplier = action.payload;
    },
    // 设置赢球出口数量
    setWinExits(state, action: PayloadAction<number>) {
      state.winExits = action.payload;
    },
    // 设置游戏完成状态
    setIsFinished(state, action: PayloadAction<boolean>) {
      state.isFinished = action.payload;
    },
  },
});

// 导出 actions
export const { set投入Balls, increase投入Balls, setMultiplier, setIsStarted, resetRoundStats, setWinMultiplier, setWinExits, setIsFinished } =
  roundStatsSlice.actions;

// 导出 reducer
export default roundStatsSlice.reducer;
