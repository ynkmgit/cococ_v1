import React, { useState, useRef } from 'react';
import { calculateHPPercentage } from '@/utils/characterUtils';
import CharacterForm from './CharacterForm';
import '@/styles/components/character/CharacterCard.css';

const CharacterCard = ({
  character,
  onUpdate,
  onRemove,
  isCurrentCharacter = false,
  hasActed = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [isEditingHP, setIsEditingHP] = useState(false);
  const [memoInput, setMemoInput] = useState(character.memo || '');
  const hpInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    if (field === 'currentHP') {
      onUpdate(character.id, {
        currentHP: Number(value)
      });
    }
  };

  const handleEditSubmit = (updatedCharacter) => {
    onUpdate(character.id, updatedCharacter);
    setIsEditing(false);
  };

  const handleStatusToggle = () => {
    const newStatus = (() => {
      switch (character.status) {
        case 'active': return 'inactive';
        case 'inactive': return 'retired';
        case 'retired': return 'active';
        default: return 'active';
      }
    })();
    onUpdate(character.id, { status: newStatus });
  };

  const handleGunToggle = () => {
    onUpdate(character.id, {
      useGun: !character.useGun
    });
  };

  const handleConditionRemove = (condition) => {
    const newConditions = (character.conditions || []).filter(c => c !== condition);
    onUpdate(character.id, { conditions: newConditions });
  };

  const hpPercentage = calculateHPPercentage(character.currentHP, character.maxHP);
  const getHPBarClass = () => {
    if (hpPercentage <= 25) return 'hp-bar-low';
    if (hpPercentage <= 50) return 'hp-bar-medium';
    return '';
  };

  const getCardStyle = () => {
    let style = 'card character-card ';

    switch (character.status) {
      case 'inactive':
        style += 'inactive-character ';
        break;
      case 'retired':
        style += 'retired-character ';
        break;
      default:
        if (isCurrentCharacter) {
          style += 'current-character ';
        }
        if (hasActed) {
          style += 'acted ';
        }
        break;
    }

    return style.trim();
  };

  const getStatusBadgeInfo = () => {
    switch (character.status) {
      case 'active':
        return { text: '参加中', className: 'status-active bg-green-100 text-green-800 border-green-200' };
      case 'inactive':
        return { text: '不参加', className: 'status-inactive bg-gray-100 text-gray-800 border-gray-200' };
      case 'retired':
        return { text: '離脱', className: 'status-retired bg-gray-200 text-gray-800 border-gray-300' };
      default:
        return { text: '不明', className: '' };
    }
  };

  if (isEditing) {
    return (
      <div className={getCardStyle()}>
        <CharacterForm
          editCharacter={character}
          onAddCharacter={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  const statusBadge = getStatusBadgeInfo();

  return (
    <div className={getCardStyle()}>
      <header className="character-card-header">
        <div className="character-actions-row">
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-secondary character-action-button"
          >
            編集
          </button>
          <button
            onClick={() => {
              const copiedCharacter = {
                ...character,
                id: undefined,
                name: `${character.name}のコピー`,
                status: 'active'
              };
              onUpdate(character.id, copiedCharacter, 'copy');
            }}
            className="btn btn-secondary character-action-button"
          >
            複製
          </button>
          <button
            onClick={() => {
              if (window.confirm(`${character.name}を本当に削除しますか？`)) {
                onRemove(character.id);
              }
            }}
            className="btn btn-danger character-action-button"
          >
            削除
          </button>
        </div>

        <h1 className="character-name">
          {character.name}
        </h1>

        <div className="character-status-row">
          <button
            onClick={handleStatusToggle}
            className={`status-badge ${statusBadge.className}`}
          >
            {statusBadge.text}
          </button>
          {character.status === 'active' && (
            <span className={`action-status ${hasActed ? 'acted-badge' : 'waiting-badge'}`}>
              {hasActed ? '行動済' : '未行動'}
            </span>
          )}
        </div>
      </header>

      <main>
        {character.conditions && character.conditions.length > 0 && (
          <div className="conditions-area">
            {character.conditions.map((condition, index) => (
              <span
                key={index}
                className={`condition-badge ${condition === '重症' ? 'condition-badge-severe' :
                  condition === '転倒' ? 'condition-badge-fall' :
                    condition === '潜在狂気' ? 'condition-badge-latent' :
                      condition === '狂気発作' ? 'condition-badge-madness' :
                        condition === '意識不明' ? 'condition-badge-unconscious' :
                          condition === '拘束' ? 'condition-badge-bound' : 'condition-badge-other'
                  }`}
              >
                {condition}
                <button
                  onClick={() => handleConditionRemove(condition)}
                  className="condition-remove-button"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div>
          <div className="hp-container">
            <label
              className={`stat-label ${character.status !== 'active' ? 'inactive' : ''}`}
            >
              HP:
            </label>
            <div className="hp-display">
              <div className={`hp-bar ${character.status !== 'active' ? 'inactive' : ''}`}>
                <div
                  className={`hp-bar-fill ${getHPBarClass()}`}
                  style={{ width: `${hpPercentage}%` }}
                />
              </div>
              {isEditingHP ? (
                <input
                  type="number"
                  value={character.currentHP}
                  onChange={(e) => handleInputChange('currentHP', e.target.value)}
                  className="hp-input"
                  min="0"
                  max={character.maxHP}
                  disabled={character.status === 'retired'}
                  ref={hpInputRef}
                  onBlur={() => setIsEditingHP(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsEditingHP(false);
                    }
                  }}
                />
              ) : (
                <div
                  className="hp-text"
                  onClick={() => setIsEditingHP(true)}
                >
                  {character.currentHP} / {character.maxHP}
                </div>
              )}
            </div>
          </div>

          <div className="character-stats">
            <div className="stat-row">
              <div className="dex-container">
                <span className="dex-label">DEX</span>
                <span className="dex-value">{character.dex}</span>
                <span className="dex-modifier">補正後: {character.effectiveDex}</span>
              </div>
              <div className="gun-toggle-container">
                <div
                  onClick={handleGunToggle}
                  className={`gun-toggle ${character.useGun ? 'active' : ''}`}
                  disabled={character.status === 'retired'}
                  aria-label="火器使用"
                />
                <span className="gun-toggle-label">
                  {character.useGun ? '火器使用中' : '火器未使用'}
                </span>
              </div>
            </div>
          </div>

          <div className="character-memo">
            <div className="memo-label">メモ:</div>
            {isEditingMemo ? (
              <div className="memo-edit">
                <textarea
                  value={memoInput}
                  onChange={(e) => setMemoInput(e.target.value)}
                  className="memo-textarea"
                  rows="3"
                />
                <div className="memo-edit-buttons">
                  <button
                    onClick={() => {
                      onUpdate(character.id, { memo: memoInput });
                      setIsEditingMemo(false);
                    }}
                    className="btn btn-primary"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => {
                      setMemoInput(character.memo || '');
                      setIsEditingMemo(false);
                    }}
                    className="btn btn-secondary"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="memo-content"
                onClick={() => setIsEditingMemo(true)}
                data-empty={!character.memo}
              >
                {character.memo || 'クリックしてメモを追加'}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CharacterCard;
