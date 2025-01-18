import React, { useCallback, useMemo } from 'react';
import GameSidebar from './components/GameSidebar';
import GameMain from './components/GameMain';
import GameHistory from './components/GameHistory';
import { useGameState } from './hooks/useGameState';
import { useCharacterActions } from './hooks/useCharacterActions';
import { useGameHistory } from './hooks/useGameHistory';
import gameEvents from '../../utils/GameEventEmitter';
import './styles/layout.css';
import './styles/form.css';
import './styles/character.css';

const Cococ = () => {
  const {
    gameState,
    setGameState,
    handleNextTurn,
    handleResetGame,
    handleCommandSelect,
    handleRollback,
    isInTransaction
  } = useGameState();

  const {
    handleAddCharacter,
    handleUpdateCharacter,
    handleRemoveCharacter
  } = useCharacterActions(gameState, setGameState);

  const { history, clearHistory } = useGameHistory();

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
    clearHistory();
  }, [handleResetGame, clearHistory]);

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

  const handleUpdateCharacterWithEvents = useCallback((character, updates) => {
    const characters = gameState.characterManager.getCharacters();
    const oldChar = characters.find(c => c.id === character.id);
    handleUpdateCharacter(character, updates);
    
    if (oldChar && 'hp' in updates && oldChar.hp !== updates.hp) {
      gameEvents.emit('hp', {
        characterName: character.name,
        oldValue: oldChar.hp,
        newValue: updates.hp
      });
    }
  }, [gameState, handleUpdateCharacter]);

  const handleRollbackWithEvents = useCallback(() => {
    handleRollback();
    gameEvents.emit('rollback', {
      characterName: gameState.turnManager.getCurrentCharacter()?.name
    });
  }, [gameState, handleRollback]);

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
  const { round, currentTurn, actedCharacters } = currentState;

  return (
    <div className="game-container">
      <div className="game-sidebar left">
        <GameSidebar
          characters={characters}
          currentCharacter={currentCharacter}
          currentCharacterId={currentCharacterId}
          currentTurn={currentTurn}
          actedCharacters={actedCharacters}
          round={round}
          isCommandCompleted={isCommandCompleted}
          isInTransaction={isInTransaction}
          onNextTurn={handleNextTurnWithEvents}
          onResetGame={handleResetGameWithEvents}
          onCommandSelect={handleCommandSelectWithEvents}
          onRollback={handleRollbackWithEvents}
        />
      </div>
      
      <GameMain
        characters={characters}
        currentTurn={currentTurn}
        actedCharacters={actedCharacters}
        onAddCharacter={handleAddCharacter}
        onUpdateCharacter={handleUpdateCharacterWithEvents}
        onRemoveCharacter={handleRemoveCharacter}
      />

      <div className="game-sidebar right">
        <GameHistory history={history} />
      </div>
    </div>
  );
};

export default React.memo(Cococ);