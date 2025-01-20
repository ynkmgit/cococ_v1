import { useState, useCallback } from 'react';
import { CharacterManager } from '@/utils/characterManager';
import { TurnManager } from '@/utils/turnManager';
import { SaveManager } from '@/utils/save/saveManager';

const SEVERE_DAMAGE_THRESHOLD = 0.5;

export const useGameState = () => {
  const [gameState, setGameState] = useState(() => {
    const saveManager = SaveManager.getInstance();
    const savedData = saveManager.getLatestSaveData();

    if (savedData) {
      const characterManager = new CharacterManager(savedData.characters);
      const turnManager = new TurnManager(savedData.characters);

      turnManager.round = savedData.round;
      turnManager.currentCharacterIndex = savedData.turnState.currentCharacterIndex;
      turnManager.actedCharacters = new Set(savedData.turnState.actedCharacters);

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

  const [isInTransaction, setIsInTransaction] = useState(false);

  const handleLoadGame = useCallback((saveData) => {
    if (!saveData) return;

    setIsInTransaction(true);
    try {
      setGameState(prev => {
        // キャラクターマネージャーの復元
        const characterManager = new CharacterManager(saveData.characters);

        // ターンマネージャーの復元
        const turnManager = new TurnManager(saveData.characters);
        turnManager.round = saveData.round;
        turnManager.currentCharacterIndex = saveData.turnState.currentCharacterIndex;
        turnManager.actedCharacters = new Set(saveData.turnState.actedCharacters);

        // SaveManagerの状態も更新
        const [round, turn] = saveData.id.split('_').map(Number);
        const saveManager = SaveManager.getInstance();
        saveManager.onRoundChange(round);
        saveManager.onTurnChange(turn);

        return {
          characterManager,
          turnManager
        };
      });
    } finally {
      setIsInTransaction(false);
    }
  }, []);

  const handleCharacterAdd = useCallback((newCharacter) => {
    setIsInTransaction(true);
    try {
      setGameState(prev => {
        const characterManager = new CharacterManager(prev.characterManager.getCharacters());
        const newCharacters = characterManager.addCharacter(newCharacter);

        const characterTurnManager = new TurnManager(newCharacters);
        characterTurnManager.round = prev.turnManager.round;
        characterTurnManager.actedCharacters = new Set(prev.turnManager.actedCharacters);
        characterTurnManager.updateCurrentCharacterIndex();

        return {
          characterManager: new CharacterManager(newCharacters),
          turnManager: characterTurnManager
        };
      });
    } finally {
      setIsInTransaction(false);
    }
  }, []);

  const handleCharacterUpdate = useCallback((id, updates) => {
    setIsInTransaction(true);
    try {
      setGameState(prev => {
        const characterManager = new CharacterManager(prev.characterManager.getCharacters());
        const newCharacters = characterManager.updateCharacter(id, updates);

        const characterTurnManager = new TurnManager(newCharacters);
        characterTurnManager.round = prev.turnManager.round;
        characterTurnManager.actedCharacters = new Set(prev.turnManager.actedCharacters);

        if ('dex' in updates || 'useGun' in updates) {
          characterTurnManager.updateCurrentCharacterIndex();
        } else if ('status' in updates) {
          const updatedCharacter = newCharacters.find(char => char.id === id);
          if (updatedCharacter) {
            characterTurnManager.onCharacterStatusChange(updatedCharacter);
          }
        }

        return {
          characterManager: new CharacterManager(newCharacters),
          turnManager: characterTurnManager
        };
      });
    } finally {
      setIsInTransaction(false);
    }
  }, []);

  const handleCharacterRemove = useCallback((id) => {
    setIsInTransaction(true);
    try {
      setGameState(prev => {
        const characterManager = new CharacterManager(prev.characterManager.getCharacters());
        const newCharacters = characterManager.removeCharacter(id);

        const characterTurnManager = new TurnManager(newCharacters);
        characterTurnManager.round = prev.turnManager.round;
        characterTurnManager.actedCharacters = new Set(prev.turnManager.actedCharacters);
        characterTurnManager.updateCurrentCharacterIndex();

        return {
          characterManager: new CharacterManager(newCharacters),
          turnManager: characterTurnManager
        };
      });
    } finally {
      setIsInTransaction(false);
    }
  }, []);

  const handleNextTurn = useCallback(() => {
    console.log('[handleNextTurn] Starting next turn transition');

    setIsInTransaction(true);
    try {
      setGameState(prev => {
        if (!prev.turnManager || !prev.characterManager) return prev;

        const characterTurnManager = new TurnManager(prev.characterManager.getCharacters());
        characterTurnManager.round = prev.turnManager.round;
        characterTurnManager.actedCharacters = new Set(prev.turnManager.actedCharacters);
        characterTurnManager.currentCharacterIndex = prev.turnManager.currentCharacterIndex;

        console.log('[handleNextTurn] Current round:', characterTurnManager.round);
        console.log('[handleNextTurn] Current character:', characterTurnManager.getCurrentCharacter());

        // ターン進行を実行
        characterTurnManager.nextTurn();

        console.log('[handleNextTurn] After nextTurn - New character:', characterTurnManager.getCurrentCharacter());

        // カスタムイベントの発火 - 保存前に発火
        const preAutoSaveEvent = new CustomEvent('preAutosave');
        document.querySelector('.save-controls')?.dispatchEvent(preAutoSaveEvent);

        // 次のターンの状態を保存
        const saveManager = SaveManager.getInstance();
        const savedData = saveManager.saveGameState(
          prev.characterManager.getCharacters(),
          characterTurnManager,
          true  // 自動保存フラグ
        );

        // 保存後のイベント発火
        if (savedData) {
          const postAutoSaveEvent = new CustomEvent('postAutosave', {
            detail: {
              savedData,
              characters: prev.characterManager.getCharacters(),
              currentCharacterIndex: characterTurnManager.currentCharacterIndex,
              actedCharacters: characterTurnManager.actedCharacters,
              round: characterTurnManager.round
            }
          });
          document.querySelector('.save-controls')?.dispatchEvent(postAutoSaveEvent);
        }

        return {
          characterManager: prev.characterManager,
          turnManager: characterTurnManager
        };
      });
    } finally {
      setIsInTransaction(false);
    }
  }, []);

  const handleCommandSelect = useCallback(({
    command,
    target,
    damage,
    isCounterAttack
  }) => {
    setIsInTransaction(true);
    try {
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
        const characterTurnManager = new TurnManager(updatedCharacters);
        characterTurnManager.round = prev.turnManager.round;
        characterTurnManager.actedCharacters = new Set(prev.turnManager.actedCharacters);
        characterTurnManager.currentCharacterIndex = prev.turnManager.currentCharacterIndex;


        return {
          characterManager: newCharacterManager,
          turnManager: characterTurnManager
        };
      });
    } finally {
      setIsInTransaction(false);
    }
  }, []);

  const handleRollback = useCallback(() => {
    setIsInTransaction(true);
    try {
      setGameState(prev => {
        if (!prev.turnManager || !prev.characterManager) return prev;

        const characterTurnManager = new TurnManager(prev.characterManager.getCharacters());
        characterTurnManager.round = prev.turnManager.round;
        characterTurnManager.actedCharacters = new Set(prev.turnManager.actedCharacters);
        characterTurnManager.currentCharacterIndex = prev.turnManager.currentCharacterIndex;


        return {
          characterManager: prev.characterManager,
          turnManager: characterTurnManager
        };
      });
    } finally {
      setIsInTransaction(false);
    }
  }, []);

  const handleResetGame = useCallback(() => {
    if (window.confirm('ゲームをリセットしてもよろしいですか？')) {
      const saveManager = SaveManager.getInstance();
      saveManager.clearAllSaves();

      setGameState({
        characterManager: new CharacterManager(),
        turnManager: new TurnManager()
      });
    }
  }, []);

  return {
    gameState,
    setGameState,
    handleNextTurn,
    handleResetGame,
    handleCommandSelect,
    handleRollback,
    handleCharacterAdd,
    handleCharacterUpdate,
    handleCharacterRemove,
    handleLoadGame,
    isInTransaction
  };
};
