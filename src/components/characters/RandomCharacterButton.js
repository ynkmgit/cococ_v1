import React from 'react';
import { generateRandomCharacter } from '../../utils/characterGenerator';

const RandomCharacterButton = ({ onAddCharacter }) => {
  const handleClick = () => {
    const randomCharacter = generateRandomCharacter();
    onAddCharacter(randomCharacter);
  };

  return (
    <button
      onClick={handleClick}
      className="btn btn-secondary"
      style={{ padding: 'var(--space-2) var(--space-4)' }}
    >
      ランダムキャラクターを追加
    </button>
  );
};

export default RandomCharacterButton;