import React from 'react';
import { validateRound, formatRound } from '../../utils/gameUtils';

const RoundCounter = ({ round, onRoundChange }) => {
  const handleRoundChange = (newRound) => {
    onRoundChange(validateRound(newRound));
  };

  return (
    <div className="card section-sm">
      <div className="flex-between">
        <h2 className="text-xl font-bold">ラウンド数</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRoundChange(round - 1)}
            className="btn btn-primary px-3 py-1"
            disabled={round <= 1}
            aria-label="ラウンドを減らす"
          >
            -
          </button>
          <span
            className="text-xl font-bold min-w-[3rem] text-center"
            role="status"
            aria-label={`現在のラウンド: ${round}`}
          >
            {formatRound(round)}
          </span>
          <button
            onClick={() => handleRoundChange(round + 1)}
            className="btn btn-primary px-3 py-1"
            aria-label="ラウンドを増やす"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoundCounter;