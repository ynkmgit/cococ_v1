import React from 'react';

/**
 * ターン制御コンポーネント
 * @param {Object} props
 * @param {import('../../utils/turnManager').TurnManager} props.turnManager - ターン管理クラスのインスタンス
 * @param {import('../../utils/characterManager').CharacterManager} props.characterManager - キャラクター管理クラスのインスタンス
 */
export function TurnControl({ turnManager, characterManager }) {
  const handleNextTurn = () => {
    // まずターンを進める
    turnManager.nextTurn();

    // 新しいターンの状態で自動保存イベントを発火
    const saveControls = document.querySelector('.save-controls');
    if (saveControls) {
      const autoSaveEvent = new CustomEvent('autosave', {
        detail: {
          characters: characterManager.getCharacters(),
          currentCharacterIndex: turnManager.currentCharacterIndex,
          actedCharacters: turnManager.actedCharacters,
          round: turnManager.round
        }
      });
      saveControls.dispatchEvent(autoSaveEvent);
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <button
        className="next-turn-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleNextTurn}
        disabled={!turnManager.isCurrentCharacterCommandCompleted()}
      >
        次のターンへ
      </button>
    </div>
  );
}