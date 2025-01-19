import React from 'react';
import { historyFormatters } from './formatters';
import '@/styles/gameHistory.css';

const HistoryItem = ({ type, data, timestamp }) => {
  // フォーマッター呼び出しの安全性を確保
  const formatter = historyFormatters[type];
  if (!formatter) {
    console.warn(`Unknown history type: ${type}`);
    return null;
  }

  const formatted = formatter(data);
  if (!formatted) {
    console.warn(`Failed to format history item: ${type}`);
    return null;
  }

  return (
    <div className="history-item">
      <span className="history-icon">{formatted.icon}</span>
      <div className="history-content">
        <div className="history-text">{formatted.text}</div>
        {formatted.details && (
          <div className="history-details">{formatted.details}</div>
        )}
        <div className="history-time">{timestamp}</div>
      </div>
    </div>
  );
};

const GameHistory = ({ history }) => {
  return (
    <div className="game-history">
      <h3 className="history-title">履歴</h3>
      <div className="history-list">
        {history.filter(Boolean).map((item, index) => (
          <HistoryItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default GameHistory;