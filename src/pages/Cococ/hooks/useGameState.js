import { useState, useCallback, useEffect } from 'react';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { CharacterManager } from '../../../utils/characterManager';
import { TurnManager } from '../../../utils/turnManager';
import { useTransaction } from './useTransaction';

const STORAGE_KEY = 'cococ_game_state';
const TURN_STORAGE_KEY = 'turnState';
const SEVERE_DAMAGE_THRESHOLD = 0.5; // HPの50%以上のダメージで重症

export const useGameState = () => {
  const transaction = useTransaction();
  
  const [gameState, setGameState] = useState(() => {
    const savedState = loadFromStorage(STORAGE_KEY);
    if (savedState) {
      const characterManager = new CharacterManager(savedState.characters);
      const turnManager = new TurnManager(savedState.characters);
      if (savedState.round) turnManager.round = savedState.round;
      if (savedState.currentTurn) turnManager.currentTurn = savedState.currentTurn;
      if (savedState.actedCharacters) turnManager.actedCharacters = new Set(savedState.actedCharacters);
      if (savedState.commandCompletedCharacters) {
        turnManager.commandCompletedCharacters = new Set(savedState.commandCompletedCharacters);
      }
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

  useEffect(() => {
    if (!gameState.characterManager || !gameState.turnManager) return;

    const state = {
      characters: gameState.characterManager.getCharacters(),
      round: gameState.turnManager.round,
      currentTurn: gameState.turnManager.currentTurn,
      actedCharacters: Array.from(gameState.turnManager.actedCharacters),
      commandCompletedCharacters: Array.from(gameState.turnManager.commandCompletedCharacters)
    };
    saveToStorage(STORAGE_KEY, state);
  }, [gameState]);

  const handleNextTurn = useCallback(() => {
    transaction.commit();
    setGameState(prev => {
      if (!prev.turnManager || !prev.characterManager) return prev;
      
      const currentTurnManager = prev.turnManager;
      currentTurnManager.nextTurn();
      
      return {
        characterManager: prev.characterManager,
        turnManager: currentTurnManager
      };
    });
  }, [transaction]);

  const handleResetGame = useCallback(() => {
    if (window.confirm('ゲームをリセットしてもよろしいですか？')) {
      const newState = {
        characterManager: new CharacterManager(),
        turnManager: new TurnManager()
      };
      setGameState(newState);
      
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TURN_STORAGE_KEY);
    }
  }, []);

  const handleCommandSelect = useCallback(({ 
    command, 
    target, 
    damage,
    isCounterAttack
  }) => {
    // コマンド選択時にトランザクション開始
    transaction.begin(gameState);

    setGameState(prev => {
      if (!prev.characterManager || !prev.turnManager) return prev;

      const characterManager = new CharacterManager(prev.characterManager.getCharacters());
      let updatedCharacters = characterManager.getCharacters();

      // 離脱コマンドの処理
      if (command.id === 'retire') {
        const currentCharId = prev.turnManager.getCurrentCharacter()?.id;
        if (currentCharId) {
          updatedCharacters = characterManager.updateCharacter(currentCharId, { 
            status: 'retired'
          });
        }
      }
      // 通常攻撃または射撃の場合にダメージを適用
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
  }, [transaction, gameState]);

  const handleRollback = useCallback(() => {
    const restoredState = transaction.rollback();
    if (restoredState) {
      setGameState(restoredState);
    }
  }, [transaction]);

  const handleDexChange = useCallback((characterId, newDex) => {
    if (transaction.isInTransaction()) {
      handleRollback();
    }
    setGameState(prev => {
      if (!prev.characterManager) return prev;
      
      const characterManager = new CharacterManager(prev.characterManager.getCharacters());
      const updatedCharacters = characterManager.updateCharacter(characterId, { dex: newDex });
      
      return {
        characterManager: new CharacterManager(updatedCharacters),
        turnManager: new TurnManager(updatedCharacters)
      };
    });
  }, [transaction, handleRollback]);

  return {
    gameState,
    setGameState,
    handleNextTurn,
    handleResetGame,
    handleCommandSelect,
    handleRollback,
    handleDexChange,
    isInTransaction: transaction.isInTransaction()
  };
};