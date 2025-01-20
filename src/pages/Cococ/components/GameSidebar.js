import React from 'react';
import TurnDisplay from '@/components/game/TurnDisplay';
import ActionCommands from '@/components/game/ActionCommands';
import SaveControl from './SaveControl';

const GameSidebar = ({
  className,
  characters,
  currentCharacter,
  currentCharacterId,
  currentCharacterIndex,
  actedCharacters,
  round,
  isInTransaction,
  onNextTurn,
  onResetGame,
  onLoadGame,
  onCommandSelect
}) => {
  return (
    <aside className={className}>
      <div className="game-status border-b border-gray-200 pb-4">
        <h2 className="section-title font-bold text-lg mb-4">ゲーム状態</h2>
        {characters.length > 0 && (
          <TurnDisplay
            characters={characters}
            currentCharacterIndex={currentCharacterIndex}
            actedCharacters={actedCharacters}
            onNextTurn={onNextTurn}
            round={round}
          />
        )}
      </div>

      <div className="command-section border-b border-gray-200 py-4">
        <h3 className="subsection-title font-bold mb-4">行動選択</h3>
        {currentCharacter && (
          <ActionCommands
            characters={characters}
            currentCharacterId={currentCharacterId}
            onCommandSelect={onCommandSelect}
          />
        )}
      </div>

      <div className="save-section border-b border-gray-200 py-4">
        <h3 className="subsection-title font-bold mb-4">セーブ/ロード</h3>
        <SaveControl
          characters={characters}
          currentCharacterIndex={currentCharacterIndex}
          actedCharacters={actedCharacters}
          round={round}
          isInTransaction={isInTransaction}
          onLoadGame={onLoadGame}
        />
      </div>

      <div className="action-section py-4">
        <button
          onClick={onResetGame}
          className="reset-button bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full"
        >
          ゲームをリセット
        </button>
      </div>
    </aside>
  );
};

export default GameSidebar;
