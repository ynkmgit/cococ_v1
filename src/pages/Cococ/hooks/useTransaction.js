import { useCallback, useState } from 'react';
import { CharacterManager } from '../../../utils/characterManager';
import { TurnManager } from '../../../utils/turnManager';

export const useTransaction = () => {
  const [pending, setPending] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  
  // トランザクション開始
  const begin = useCallback((state) => {
    // スナップショット作成
    const snapshotState = {
      characters: state.characterManager.getCharacters(),
      round: state.turnManager.round,
      currentTurn: state.turnManager.currentTurn,
      actedCharacters: Array.from(state.turnManager.actedCharacters),
      commandCompletedCharacters: Array.from(state.turnManager.commandCompletedCharacters)
    };
    setSnapshot(snapshotState);
    setPending(true);
  }, []);

  // トランザクション確定
  const commit = useCallback(() => {
    setPending(null);
    setSnapshot(null);
  }, []);

  // トランザクション取り消し
  const rollback = useCallback(() => {
    if (!snapshot) return null;

    // スナップショットから状態を復元
    const characterManager = new CharacterManager(snapshot.characters);
    const turnManager = new TurnManager(snapshot.characters);
    turnManager.round = snapshot.round;
    turnManager.currentTurn = snapshot.currentTurn;
    turnManager.actedCharacters = new Set(snapshot.actedCharacters);
    turnManager.commandCompletedCharacters = new Set(snapshot.commandCompletedCharacters);

    const result = {
      characterManager,
      turnManager
    };

    setPending(null);
    setSnapshot(null);
    return result;
  }, [snapshot]);

  // トランザクション中かどうか
  const isInTransaction = useCallback(() => {
    return pending !== null;
  }, [pending]);

  return {
    begin,
    commit,
    rollback,
    isInTransaction
  };
};