// 定义玩家模块（player）状态类型：
export interface PlayerState {
  remainingBalls: number; // 剩余弹珠数量
  score: number; // 当前积分
  totalWonBalls: number; // 总共赢得的弹珠数量
}

// 定义当局统计模块（round stats）状态类型：
export interface RoundStatsState {
  balls投入: number; // 投入的弹珠数量
  multiplier: number; // 游戏倍率
  isStarted: boolean; // 是否已经开始
}

// 根状态 RootState，组合以上两个模块
export interface RootState {
  player: PlayerState;
  round: RoundStatsState;
}
