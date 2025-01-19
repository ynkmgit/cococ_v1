import { useState, useEffect, useCallback } from 'react';
import gameEvents from '@/utils/GameEventEmitter';
import { saveToStorage, loadFromStorage } from '../utils/storage';

const HISTORY_STORAGE_KEY = 'cococ_game_history';

const formatTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
};

export const useGameHistory = () => {
  const [history, setHistory] = useState(() => loadFromStorage(HISTORY_STORAGE_KEY) || []);

  // 履歴が更新されるたびに保存
  useEffect(() => {
    saveToStorage(HISTORY_STORAGE_KEY, history);
  }, [history]);

  useEffect(() => {
    const unsubscribe = gameEvents.subscribe('*', (event) => {
      setHistory(prev => [...prev, {
        type: event.type,
        data: event.data,
        timestamp: formatTime()
      }]);
    });

    return unsubscribe;
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    sessionStorage.removeItem(HISTORY_STORAGE_KEY);
  }, []);

  return {
    history,
    clearHistory
  };
};
