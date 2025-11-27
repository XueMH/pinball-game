// src/store/slices/playerSlice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PlayerState } from '../types';

// 玩家状态初始值
const initialState: PlayerState = {
  remainingBalls: 1000,
  score: 0,
  totalWonBalls: 0,
};

const playerSlice = createSlice({
  name: 'player', // slice 名称，用于生成 action type，如 "player/setRemainingBalls"
  initialState,
  reducers: {
    // 设置剩余弹珠
    setRemainingBalls(state, action: PayloadAction<number>) {
      state.remainingBalls = action.payload;
    },
    // 增加积分
    addScore(state, action: PayloadAction<number>) {
      state.score += action.payload;
    },
    // 重置积分（回合结束或重新开始）
    resetScore(state) {
      state.score = 0;
    },
    // 增加赢得的弹珠总数
    addWonBalls(state, action: PayloadAction<number>) {
      state.totalWonBalls += action.payload;
    },
    // 重置剩余弹珠
    resetRemainingBalls(state) {
      state.remainingBalls = 0;
    },
  },
});

// 导出 actions 用于触发状态修改
export const { setRemainingBalls, addScore, resetScore, addWonBalls, resetRemainingBalls } = playerSlice.actions;

// 导出 reducer 供 store 使用
export default playerSlice.reducer;
