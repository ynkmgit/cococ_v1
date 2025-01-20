import React, { useCallback, useMemo } from 'react';
import GameSidebar from './components/GameSidebar';
import GameMain from './components/GameMain';
import { useGameState } from './hooks/useGameState';
import { useCharacterActions } from './hooks/useCharacterActions';
import gameEvents from '@/utils/GameEventEmitter';
import '@/styles/layout.css';
import '@/styles/form.css';
import '@/styles/character.css';

const Cococ = () => {
  const {
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
  } = useGameState();

  const {
    handleAddCharacter,
    handleUpdateCharacter,
    handleRemoveCharacter
  } = useCharacterActions(gameState, setGameState, {
    handleCharacterAdd,
    handleCharacterUpdate,
    handleCharacterRemove
  });

  const handleNextTurnWithEvents = useCallback(() => {
    const prevRound = gameState.turnManager.getCurrentState().round;
    handleNextTurn();

    const currentState = gameState.turnManager.getCurrentState();
    if (currentState.round > prevRound) {
      gameEvents.emit('round', { round: currentState.round });
    }

    const currentChar = gameState.turnManager.getCurrentCharacter();
    if (currentChar) {
      gameEvents.emit('turn', { characterName: currentChar.name });
    }
  }, [gameState, handleNextTurn]);

  const handleResetGameWithEvents = useCallback(() => {
    handleResetGame();
  }, [handleResetGame]);

  const handleLoadGameWithEvents = useCallback((saveData) => {
    handleLoadGame(saveData);
    gameEvents.emit('gameLoaded', {
      round: saveData.round,
      characterName: saveData.characters[saveData.turnState.currentCharacterIndex]?.name
    });
  }, [handleLoadGame]);

  const handleCommandSelectWithEvents = useCallback((commandData) => {
    const { command, target, damage, isRetire } = commandData;
    handleCommandSelect(commandData);

    const currentChar = gameState.turnManager.getCurrentCharacter();
    if (isRetire) {
      gameEvents.emit('command', {
        commandType: 'retire',
        character: currentChar.name
      });
    } else {
      gameEvents.emit('command', {
        commandType: command.id,
        attacker: currentChar.name,
        defender: target.name,
        result: damage > 0 ? `${damage}ダメージ` : ''
      });
    }
  }, [gameState, handleCommandSelect]);

  const handleRollbackWithEvents = useCallback(() => {
    handleRollback();
    gameEvents.emit('rollback', {
      characterName: gameState.turnManager.getCurrentCharacter()?.name
    });
  }, [gameState, handleRollback]);

  const handleUpdateCharacterWithEvents = useCallback((id, updates) => {
    const characters = gameState.characterManager.getCharacters();
    const oldChar = characters.find(c => c.id === id);
    handleUpdateCharacter(id, updates);

    if (oldChar && 'hp' in updates && oldChar.hp !== updates.hp) {
      gameEvents.emit('hp', {
        characterName: oldChar.name,
        oldValue: oldChar.hp,
        newValue: updates.hp
      });
    }
  }, [gameState, handleUpdateCharacter]);

  const gameData = useMemo(() => {
    const characters = gameState.characterManager.getCharacters();
    const currentState = gameState.turnManager.getCurrentState();
    const currentCharacter = gameState.turnManager.getCurrentCharacter();
    return {
      characters,
      currentState,
      currentCharacter,
      isCommandCompleted: gameState.turnManager.isCurrentCharacterCommandCompleted(),
      currentCharacterId: currentCharacter?.id || null,
    };
  }, [gameState]);

  const { characters, currentState, currentCharacter, isCommandCompleted, currentCharacterId } = gameData;
  const { round, currentCharacterIndex, actedCharacters } = currentState;

  return (
    <div className="game-container">
      <div className="game-sidebar left">
        <GameSidebar
          characters={characters}
          currentCharacter={currentCharacter}
          currentCharacterId={currentCharacterId}
          currentCharacterIndex={currentCharacterIndex}
          actedCharacters={actedCharacters}
          round={round}
          isCommandCompleted={isCommandCompleted}
          isInTransaction={isInTransaction}
          onNextTurn={handleNextTurnWithEvents}
          onResetGame={handleResetGameWithEvents}
          onLoadGame={handleLoadGameWithEvents}
          onCommandSelect={handleCommandSelectWithEvents}
          onRollback={handleRollbackWithEvents}
        />
      </div>

      <GameMain
        characters={characters}
        currentCharacterIndex={currentCharacterIndex}
        actedCharacters={actedCharacters}
        onAddCharacter={handleAddCharacter}
        onUpdateCharacter={handleUpdateCharacterWithEvents}
        onRemoveCharacter={handleRemoveCharacter}
      />
    </div>
  );
};

export default React.memo(Cococ);