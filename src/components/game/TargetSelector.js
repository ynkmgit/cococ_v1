import React from 'react';
import '../../styles/commands.css';

const TargetSelector = ({ characters, currentCharacterId, onTargetSelect, onCancel }) => {
  // currentCharacterIdがnullの場合は何も表示しない
  if (!currentCharacterId) return null;

  // 参加中（非離脱）かつ現在のキャラクター以外をターゲットとして抽出
  const targetCharacters = characters.filter(char => 
    char.id !== currentCharacterId && 
    char.status === 'active' // アクティブなキャラクターのみを対象とする
  );

  // ターゲットが存在しない場合のUI
  if (targetCharacters.length === 0) {
    return (
      <div className="target-selector">
        <div className="target-header">
          <h4 className="target-title">対象を選択</h4>
          <button onClick={onCancel} className="cancel-button">×</button>
        </div>
        <div className="target-empty">
          <p>選択可能な対象がいません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="target-selector">
      <div className="target-header">
        <h4 className="target-title">対象を選択</h4>
        <button onClick={onCancel} className="cancel-button">×</button>
      </div>
      <div className="target-list">
        {targetCharacters.map(character => (
          <button
            key={character.id}
            className="target-button"
            onClick={() => onTargetSelect(character)}
          >
            <div className="target-info-group">
              <span className="target-name">{character.name}</span>
              <span className="target-info">HP: {character.hp}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TargetSelector;