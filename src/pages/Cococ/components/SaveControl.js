import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { SaveManager } from '@/utils/save/saveManager';

const SaveControl = ({
  characters,
  currentCharacterIndex,
  actedCharacters,
  round,
  isInTransaction,
  onLoadGame
}) => {
  const [savedGames, setSavedGames] = useState([]);
  const [selectedSaveId, setSelectedSaveId] = useState('');
  const saveManager = useMemo(() => new SaveManager(), []);

  // 保存されたゲームデータを読み込む関数
  const loadSavedGames = useCallback(() => {
    console.log("[SaveControl] Loading saved games");
    const games = saveManager.getSavedGames();
    setSavedGames([...games].reverse());
  }, [saveManager]);

  // コンポーネントマウント時に保存データを読み込む
  useEffect(() => {
    loadSavedGames();
  }, [loadSavedGames]);

  // イベントリスナーの登録
  useEffect(() => {
    const saveControls = document.querySelector('.save-controls');
    if (!saveControls) return;

    const handlePreAutoSave = () => {
      console.log("[SaveControl] Pre-autosave event received");
    };

    const handlePostAutoSave = (e) => {
      console.log("[SaveControl] Post-autosave event received", e.detail);
      if (e.detail?.savedData) {
        // 状態更新を次のレンダリングサイクルに遅延させる
        setTimeout(() => {
          loadSavedGames();
        }, 0);
      }
    };

    saveControls.addEventListener('preAutosave', handlePreAutoSave);
    saveControls.addEventListener('postAutosave', handlePostAutoSave);

    return () => {
      saveControls.removeEventListener('preAutosave', handlePreAutoSave);
      saveControls.removeEventListener('postAutosave', handlePostAutoSave);
    };
  }, [loadSavedGames]);

  // 手動保存処理
  const handleManualSave = () => {
    const turnManager = {
      round,
      currentCharacterIndex,
      actedCharacters,
      getCurrentCharacter: () => characters[currentCharacterIndex],
      getActiveCharacters: () => characters.filter(char => char.status === 'active'),
      commandCompletedCharacters: new Set()
    };

    const saveData = saveManager.saveGameState(
      characters,
      turnManager,
      false // 手動保存
    );

    if (saveData) {
      // 状態更新を次のレンダリングサイクルに遅延させる
      setTimeout(() => {
        loadSavedGames();
      }, 0);
    }
  };

  // 保存データの読み込み処理
  const handleLoadGame = () => {
    if (!selectedSaveId || isInTransaction) return;

    const saveData = saveManager.loadGameState(selectedSaveId);
    if (saveData) {
      onLoadGame(saveData);
      setSelectedSaveId(''); // 選択をリセット
      // 状態更新を次のレンダリングサイクルに遅延させる
      setTimeout(() => {
        loadSavedGames();
      }, 0);
    }
  };

  const formatSaveDataLabel = (game) => {
    return `ラウンド ${game.round} - ターン ${game.id.split('_')[1]} (保存${game.id.split('_')[2]})`;
  };

  return (
    <div className="save-controls flex flex-col gap-2">
      {/* 保存ボタン */}
      <button
        onClick={handleManualSave}
        className="save-button bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        disabled={isInTransaction}
      >
        現在の状態を保存
      </button>

      {/* セーブデータ選択 */}
      <div className="mt-4">
        <select
          value={selectedSaveId}
          onChange={(e) => setSelectedSaveId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        >
          <option value="">保存データを選択</option>
          {savedGames.map((game) => (
            <option key={game.id} value={game.id}>
              {formatSaveDataLabel(game)}
            </option>
          ))}
        </select>

        {/* 読み込みボタン */}
        <button
          onClick={handleLoadGame}
          className="load-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2 w-full"
          disabled={!selectedSaveId || isInTransaction}
        >
          選択したデータを読み込む
        </button>
      </div>
    </div>
  );
};

export default SaveControl;
