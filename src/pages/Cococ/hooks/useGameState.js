import { useState, useCallback } from 'react';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { CharacterManager } from '@/utils/characterManager';
import { TurnManager } from '@/utils/turnManager';

const STORAGE_KEY = 'cococ_game_state';
const TURN_STORAGE_KEY = 'turnState';
const SEVERE_DAMAGE_THRESHOLD = 0.5;

export const useGameState = () => {
  const [gameState, setGameState] = useState(() => {
    const savedState = loadFromStorage(STORAGE_KEY);
    if (savedState) {
      const characterManager = new CharacterManager(savedState.characters);
      const turnManager = new TurnManager(savedState.characters);
      
      // 保存された状態を復元
      turnManager.restoreState(savedState);

      return {
        characterManager,
        turnManager
      };
    }
    return {
      characterManager: new CharacterManager(),
      turnManager: new TurnManager()
    };
  });

  const handleCharacterAdd = useCallback((newCharacter) => {
    setGameState(prev => {
      const characterManager = new CharacterManager(prev.characterManager.getCharacters());
      const newCharacters = characterManager.addCharacter(newCharacter);

      const newTurnManager = new TurnManager(newCharacters);
      newTurnManager.round = prev.turnManager.round;
      newTurnManager.turnCount = prev.turnManager.turnCount;
      newTurnManager.actedCharacters = new Set(prev.turnManager.actedCharacters);
      newTurnManager.commandCompletedCharacters = new Set(prev.turnManager.commandCompletedCharacters);
      newTurnManager.updateCurrentTurn();

      // キャラクター追加時のみ状態を保存
      // 既存のキャラクターの状態は維持したまま、新しいキャラクターを追加
      const savedState = loadFromStorage(STORAGE_KEY) || {};
      const updatedState = {
        ...savedState,
        characters: newCharacters,
        round: newTurnManager.round,
        currentTurn: newTurnManager.currentTurn,
        turnCount: newTurnManager.turnCount
      };
      saveToStorage(STORAGE_KEY, updatedState);

      return {
        characterManager: new CharacterManager(newCharacters),
        turnManager: newTurnManager
      };
    });
  }, []);

  const handleCharacterUpdate = useCallback((id, updates) => {
    setGameState(prev => {
      const characterManager = new CharacterManager(prev.characterManager.getCharacters());
      const newCharacters = characterManager.updateCharacter(id, updates);

      const newTurnManager = new TurnManager(newCharacters);
      newTurnManager.round = prev.turnManager.round;
      newTurnManager.turnCount = prev.turnManager.turnCount;
      newTurnManager.actedCharacters = new Set(prev.turnManager.actedCharacters);
      newTurnManager.commandCompletedCharacters = new Set(prev.turnManager.commandCompletedCharacters);
      newTurnManager.currentTurn = prev.turnManager.currentTurn;

      if ('dex' in updates || 'useGun' in updates) {
        newTurnManager.updateCurrentTurn();
      } else if ('status' in updates) {
        const updatedCharacter = newCharacters.find(char => char.id === id);
        if (updatedCharacter) {
          newTurnManager.onCharacterStatusChange(updatedCharacter);
        }
      }

      return {
        characterManager: new CharacterManager(newCharacters),
        turnManager: newTurnManager
      };
    });
  }, []);

  const handleCharacterRemove = useCallback((id) => {
    setGameState(prev => {
      const characterManager = new CharacterManager(prev.characterManager.getCharacters());
      const newCharacters = characterManager.removeCharacter(id);

      const newTurnManager = new TurnManager(newCharacters);
      newTurnManager.round = prev.turnManager.round;
      newTurnManager.turnCount = prev.turnManager.turnCount;
      newTurnManager.actedCharacters = new Set(prev.turnManager.actedCharacters);
      newTurnManager.commandCompletedCharacters = new Set(prev.turnManager.commandCompletedCharacters);
      newTurnManager.currentTurn = prev.turnManager.currentTurn;
      newTurnManager.updateCurrentTurn();

      // キャラクター削除時のみ状態を保存
      // 他のキャラクターの状態は維持したまま、キャラクターを削除
      const savedState = loadFromStorage(STORAGE_KEY) || {};
      const updatedState = {
        ...savedState,
        characters: newCharacters,
        round: newTurnManager.round,
        currentTurn: newTurnManager.currentTurn,
        turnCount: newTurnManager.turnCount
      };
      saveToStorage(STORAGE_KEY, updatedState);

      return {
        characterManager: new CharacterManager(newCharacters),
        turnManager: newTurnManager
      };
    });
  }, []);

  const handleNextTurn = useCallback(() => {
    setGameState(prev => {
      if (!prev.turnManager || !prev.characterManager) return prev;

      const newTurnManager = new TurnManager(prev.characterManager.getCharacters());
      newTurnManager.round = prev.turnManager.round;
      newTurnManager.turnCount = prev.turnManager.turnCount;
      newTurnManager.currentTurn = prev.turnManager.currentTurn;
      newTurnManager.actedCharacters = new Set(prev.turnManager.actedCharacters);
      newTurnManager.commandCompletedCharacters = new Set(prev.turnManager.commandCompletedCharacters);

      newTurnManager.nextTurn();

      // ターン進行時のみ状態を保存
      const state = {
        characters: prev.characterManager.getCharacters(),
        round: newTurnManager.round,
        currentTurn: newTurnManager.currentTurn,
        actedCharacters: Array.from(newTurnManager.actedCharacters),
        commandCompletedCharacters: Array.from(newTurnManager.commandCompletedCharacters),
        roundCount: newTurnManager.round,
        turnCount: newTurnManager.getTurnCount()
      };
      saveToStorage(STORAGE_KEY, state);

      return {
        characterManager: prev.characterManager,
        turnManager: newTurnManager
      };
    });
  }, []);

  const handleCommandSelect = useCallback(({
    command,
    target,
    damage,
    isCounterAttack
  }) => {
    setGameState(prev => {
      if (!prev.characterManager || !prev.turnManager) return prev;

      const characterManager = new CharacterManager(prev.characterManager.getCharacters());
      let updatedCharacters = characterManager.getCharacters();

      if (command.id === 'retire') {
        const currentCharId = prev.turnManager.getCurrentCharacter()?.id;
        if (currentCharId) {
          updatedCharacters = characterManager.updateCharacter(currentCharId, {
            status: 'retired'
          });
        }
      }
      else if (command.id === 'attack' || command.id === 'shoot') {
        const targetId = isCounterAttack ?
          prev.turnManager.getCurrentCharacter()?.id :
          target.id;

        if (targetId) {
          const character = characterManager.getCharacters().find(char => char.id === targetId);
          if (character) {
            const newHP = Math.max(0, character.currentHP - damage);
            const damageRatio = damage / character.currentHP;
            let conditions = [...(character.conditions || [])];

            if (damageRatio >= SEVERE_DAMAGE_THRESHOLD && !conditions.includes('重症')) {
              conditions.push('重症');
            }

            updatedCharacters = characterManager.updateCharacter(targetId, {
              currentHP: newHP,
              status: newHP === 0 ? 'retired' : character.status,
              conditions
            });
          }
        }
      }

      const newCharacterManager = new CharacterManager(updatedCharacters);
      const newTurnManager = new TurnManager(updatedCharacters);
      newTurnManager.round = prev.turnManager.round;
      newTurnManager.turnCount = prev.turnManager.turnCount;
      newTurnManager.currentTurn = prev.turnManager.currentTurn;
      newTurnManager.actedCharacters = new Set(prev.turnManager.actedCharacters);
      newTurnManager.commandCompletedCharacters = new Set(prev.turnManager.commandCompletedCharacters);

      const currentCharId = newTurnManager.getCurrentCharacter()?.id;
      if (currentCharId) {
        newTurnManager.setCommandCompleted(currentCharId, true);
      }

      return {
        characterManager: newCharacterManager,
        turnManager: newTurnManager
      };
    });
  }, []);

  const handleResetGame = useCallback(() => {
    if (window.confirm('ゲームをリセットしてもよろしいですか？')) {
      const newState = {
        characterManager: new CharacterManager(),
        turnManager: new TurnManager()
      };
      setGameState(newState);
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(TURN_STORAGE_KEY);
    }
  }, []);

  return {
    gameState,
    setGameState,
    handleNextTurn,
    handleResetGame,
    handleCommandSelect,
    handleCharacterAdd,
    handleCharacterUpdate,
    handleCharacterRemove
  };
};