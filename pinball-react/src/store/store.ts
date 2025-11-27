// src/store/store.ts

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import playerReducer from './slices/playerSlice';
import roundReducer from './slices/roundStatsSlice';

import storage from 'redux-persist/lib/storage'; // 使用 localStorage 作为持久化存储
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// Redux-Persist 配置：哪些 slice 要持久化存储
const rootPersistConfig = {
  key: 'root', // 存储 key 的根名称
  storage, // 使用 browser localStorage
  whitelist: ['player', 'round'], // 只有这两个模块会持久化
};

// 合并多个 slice reducer
const rootReducer = combineReducers({
  player: playerReducer,
  round: roundReducer,
});

// 用 persistReducer 包裹根 reducer，生成持久化版本
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // redux-persist 自动触发的这些 action 会检验序列化性，这里忽略它们
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 创建 persistor 用于控制持久化流程
export const persistor = persistStore(store);

// 导出类型以便在组件里使用 useDispatch/useSelector 时类型安全
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
