import React from 'react';
import CharacterList from '@/components/characters/CharacterList';

const GameMain = ({
  characters,
  currentCharacterIndex,
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
          currentCharacterIndex={currentCharacterIndex}
          actedCharacters={actedCharacters}
        />
      </div>
    </div>
  );
};

export default GameMain;