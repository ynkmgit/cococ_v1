import React from 'react';
import TurnDisplay from '../../../components/game/TurnDisplay';
import ActionCommands from '../../../components/game/ActionCommands';

const GameSidebar = ({
  className,
  characters,
  currentCharacter,
  currentCharacterId,
  currentTurn,
  actedCharacters,
  round,
  isCommandCompleted,
  isInTransaction,
  onNextTurn,
  onResetGame,
  onCommandSelect,
  onRollback
}) => {
  return (
    <aside className={className}>
      <div className="game-status">
        <h2 className="section-title">ゲーム状態</h2>
        {characters.length > 0 && (
          <TurnDisplay
            characters={characters}
            currentTurn={currentTurn}
            actedCharacters={actedCharacters}
            onNextTurn={onNextTurn}
            onRollback={onRollback}
            round={round}
            isCommandCompleted={isCommandCompleted}
            isInTransaction={isInTransaction}
          />
        )}
      </div>
      
      <div className="command-section">
        <h3 className="subsection-title">行動コマンド</h3>
        {currentCharacter && (
          <ActionCommands 
            characters={characters}
            currentCharacterId={currentCharacterId}
            onCommandSelect={onCommandSelect}
          />
        )}
      </div>

      <div className="action-section">
        <button
          onClick={onResetGame}
          className="reset-button"
        >
          ゲームをリセット
        </button>
      </div>
    </aside>
  );
};

export default GameSidebar;