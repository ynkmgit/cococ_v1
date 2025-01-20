import React from 'react';
import { CharacterManager } from '../../utils/characterManager';
import '../../styles/TurnDisplay.css';  // パスを更新

const TurnDisplay = ({
  characters,
  currentCharacterIndex,
  actedCharacters,
  onNextTurn,
  round,
}) => {
  const characterManager = new CharacterManager(characters);
  const sortedCharacters = characterManager.getCharacters();
  const currentCharacter = sortedCharacters[currentCharacterIndex];

  if (!currentCharacter) return null;

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
                <span className="weapon-status"> 火器</span>
              )}
            </div>
          </div>
        </div>
        <div className="action-controls">
          <button
            onClick={onNextTurn}
            className="next-turn-btn"
          >
            次のターンへ
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurnDisplay;
