import { useCallback } from 'react';
import { CharacterManager } from '../../../utils/characterManager';
import { TurnManager } from '../../../utils/turnManager';

export const useCharacterActions = (gameState, setGameState) => {
  const handleAddCharacter = useCallback((newCharacter) => {
    const characterManager = new CharacterManager(gameState.characterManager.getCharacters());
    const newCharacters = characterManager.addCharacter(newCharacter);
    
    // 新しいTurnManagerインスタンスを作成し、状態を引き継ぐ
    const newTurnManager = new TurnManager(newCharacters);
    newTurnManager.round = gameState.turnManager.round;
    newTurnManager.actedCharacters = new Set(gameState.turnManager.actedCharacters);
    newTurnManager.commandCompletedCharacters = new Set(gameState.turnManager.commandCompletedCharacters);
    newTurnManager.updateCurrentTurn();
    
    setGameState({
      characterManager,
      turnManager: newTurnManager
    });
  }, [gameState, setGameState]);

  const handleUpdateCharacter = useCallback((id, updates) => {
    const characterManager = new CharacterManager(gameState.characterManager.getCharacters());
    const newCharacters = characterManager.updateCharacter(id, updates);
    
    // 新しいTurnManagerインスタンスを作成し、状態を引き継ぐ
    const newTurnManager = new TurnManager(newCharacters);
    newTurnManager.round = gameState.turnManager.round;
    newTurnManager.actedCharacters = new Set(gameState.turnManager.actedCharacters);
    newTurnManager.commandCompletedCharacters = new Set(gameState.turnManager.commandCompletedCharacters);
    
    // DEXの変更があった場合は、ターンの再計算を行う
    if ('dex' in updates || 'useGun' in updates) {
      newTurnManager.updateCurrentTurn();
    } else if ('status' in updates) {
      const updatedCharacter = newCharacters.find(char => char.id === id);
      if (updatedCharacter) {
        newTurnManager.onCharacterStatusChange(updatedCharacter);
      }
    }

    setGameState({
      characterManager,
      turnManager: newTurnManager
    });
  }, [gameState, setGameState]);

  const handleRemoveCharacter = useCallback((id) => {
    const characterManager = new CharacterManager(gameState.characterManager.getCharacters());
    const newCharacters = characterManager.removeCharacter(id);
    
    // 新しいTurnManagerインスタンスを作成し、状態を引き継ぐ
    const newTurnManager = new TurnManager(newCharacters);
    newTurnManager.round = gameState.turnManager.round;
    newTurnManager.actedCharacters = new Set(gameState.turnManager.actedCharacters);
    newTurnManager.commandCompletedCharacters = new Set(gameState.turnManager.commandCompletedCharacters);
    newTurnManager.updateCurrentTurn();

    setGameState({
      characterManager,
      turnManager: newTurnManager
    });
  }, [gameState, setGameState]);

  return {
    handleAddCharacter,
    handleUpdateCharacter,
    handleRemoveCharacter
  };
};