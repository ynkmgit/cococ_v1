import React from 'react';
import CharacterList from '../../../components/characters/CharacterList';

const GameMain = ({
  characters,
  currentTurn,
  actedCharacters,
  onAddCharacter,
  onUpdateCharacter,
  onRemoveCharacter
}) => {
  return (
    <div className="game-main">
      <div className="game-main-inner">
        <CharacterList
          characters={characters}
          onAddCharacter={onAddCharacter}
          onUpdateCharacter={onUpdateCharacter}
          onRemoveCharacter={onRemoveCharacter}
          currentTurn={currentTurn}
          actedCharacters={actedCharacters}
        />
      </div>
    </div>
  );
};

export default GameMain;