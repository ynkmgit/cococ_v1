import React, { useState } from 'react';
import CharacterCard from './CharacterCard';
import CharacterForm from './CharacterForm';
import RandomCharacterButton from './RandomCharacterButton';

const CharacterList = ({ 
  characters, 
  onAddCharacter, 
  onUpdateCharacter, 
  onRemoveCharacter,
  currentCharacterIndex = 0,
  actedCharacters = new Set()
}) => {
  const [showForm, setShowForm] = useState(false);
  const [showInactive, setShowInactive] = useState(true); // 不参加・離脱キャラの表示設定

  // 実効DEX順でソートされた全キャラクターリスト
  const sortedCharacters = [...characters].sort((a, b) => b.effectiveDex - a.effectiveDex);
  
  // 表示するキャラクターをフィルタリング
  const displayCharacters = showInactive 
    ? sortedCharacters 
    : sortedCharacters.filter(char => char.status === 'active');

  // アクティブなキャラクターのみを取得してインデックスを計算（ターン管理用）
  const activeCharacters = sortedCharacters.filter(char => char.status === 'active');
  const currentCharacter = activeCharacters[currentCharacterIndex];

  return (
    <div className="section">
      <div className="card">
        <div className="flex-between">
          <h2 className="section-title">キャラクター一覧</h2>
          <div className="flex-center" style={{ gap: 'var(--space-2)' }}>
            {!showForm && (
              <>
                <RandomCharacterButton onAddCharacter={onAddCharacter} />
                <button
                  onClick={() => setShowInactive(!showInactive)}
                  className="btn btn-secondary"
                >
                  {showInactive ? '不参加キャラを非表示' : '不参加キャラを表示'}
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary"
                >
                  キャラクターを追加
                </button>
              </>
            )}
          </div>
        </div>

        {showForm && (
          <div className="section">
            <CharacterForm
              onAddCharacter={(character) => {
                onAddCharacter(character);
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
      </div>

      <div className="character-list">
        {displayCharacters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onUpdate={(id, updatedCharacter, action) => {
              if (action === 'copy') {
                // コピーの場合は新しいキャラクターとして追加
                onAddCharacter(updatedCharacter);
              } else {
                // 通常の更新
                onUpdateCharacter(id, updatedCharacter);
              }
            }}
            onRemove={onRemoveCharacter}
            isCurrentCharacter={currentCharacter && character.id === currentCharacter.id}
            hasActed={actedCharacters.has(character.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CharacterList;