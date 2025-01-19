import { useCallback } from 'react';

export const useCharacterActions = (gameState, setGameState, {
  handleCharacterAdd,
  handleCharacterUpdate,
  handleCharacterRemove
}) => {
  const handleAddCharacter = useCallback((newCharacter) => {
    handleCharacterAdd(newCharacter);
  }, [handleCharacterAdd]);

  const handleUpdateCharacter = useCallback((id, updates) => {
    handleCharacterUpdate(id, updates);
  }, [handleCharacterUpdate]);

  const handleRemoveCharacter = useCallback((id) => {
    handleCharacterRemove(id);
  }, [handleCharacterRemove]);

  return {
    handleAddCharacter,
    handleUpdateCharacter,
    handleRemoveCharacter
  };
};