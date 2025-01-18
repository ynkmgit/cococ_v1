import React from 'react';
import { CharacterManager } from '../../utils/characterManager';
import './TurnDisplay.css';

const TurnDisplay = ({
  characters,
  currentTurn,
  actedCharacters,
  onNextTurn,
  onRollback,
  round,
  isCommandCompleted,
  isInTransaction
}) => {
  const characterManager = new CharacterManager(characters);
  const sortedCharacters = characterManager.getCharacters();
  const currentCharacter = sortedCharacters[currentTurn];

  if (!currentCharacter) return null;

  const handleRollback = () => {
    if (window.confirm('現在の行動をやり直しますか？')) {
      onRollback();
    }
  };

  return (
    <div className="game-header-content">
      <div className="game-status-display">
        <div className="turn-info">
          <div className="status-group">
            <div className="round-number">ラウンド {round}</div>
          </div>
          <div className="status-group">
            <div className="status-label">現在の行動</div>
            <div className="character-name">{currentCharacter.name}</div>
          </div>
          <div className="status-group">
            <div className="character-dex">
              DEX: {currentCharacter.effectiveDex}
              {currentCharacter.useGun && (
                <span className="weapon-status">火器</span>
              )}
            </div>
          </div>
        </div>
        <div className="action-controls">
          <button
            onClick={onNextTurn}
            className="next-turn-btn"
            disabled={!isCommandCompleted}
          >
            {isCommandCompleted ? "次のターンへ" : "行動を選択してください"}
          </button>
          {isCommandCompleted && (  // コマンドが完了している場合にのみ表示
            <button
              onClick={handleRollback}
              className="rollback-btn manual-rollback"
              title="このターンの行動をやり直します"
            >
              <span className="rollback-icon">↩️</span>
              行動をやり直す
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TurnDisplay;