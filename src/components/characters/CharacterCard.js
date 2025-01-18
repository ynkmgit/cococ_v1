import React, { useState } from 'react';
import { calculateHPPercentage } from '../../utils/characterUtils';
import CharacterForm from './CharacterForm';

const CharacterCard = ({
  character,
  onUpdate,
  onRemove,
  isCurrentTurn = false,
  hasActed = false
}) => {
  const [isEditing, setIsEditing] = useState(false);

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

  // カードのスタイルを動的に生成
  const getCardStyle = () => {
    let style = 'card character-card ';

    switch (character.status) {
      case 'inactive':
        style += 'inactive-character border-gray-300 bg-gray-50 '; // 不参加キャラクターは薄いグレー背景とグレーの枠線
        break;
      case 'retired':
        style += 'retired-character border-gray-400 bg-gray-100 '; // 離脱キャラクターはより濃いグレー背景とグレーの枠線
        break;
      default:
        if (isCurrentTurn) {
          style += 'current-turn '; // 現在のターンのキャラクターは影付き
        }
        if (hasActed) {
          style += 'acted '; // 行動済みキャラクターは薄い青背景
        }
        break;
    }

    return style.trim();
  };

  // ステータスバッジのスタイルを改善
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
        />
        <button
          onClick={() => setIsEditing(false)}
          className="btn btn-danger"
          style={{ marginTop: 'var(--space-4)' }}
        >
          キャンセル
        </button>
      </div>
    );
  }

  const statusBadge = getStatusBadgeInfo();

  return (
    <div className={getCardStyle()}>
      <div className="character-card-header">
        <div className="flex-center" style={{ gap: 'var(--space-2)' }}>
          <h3 style={{
            fontWeight: 'bold',
            fontSize: '1.125rem',
            color: character.status !== 'active' ? 'var(--gray-600)' : 'inherit'
          }}>
            {character.name}
          </h3>
          <div className="flex-center" style={{ gap: 'var(--space-2)' }}>
            <button
              onClick={handleStatusToggle}
              className={`status-badge ${statusBadge.className}`}
              style={{
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.875rem',
                border: '1px solid'
              }}
            >
              {statusBadge.text}
            </button>
            {character.status === 'active' && (
              <span className={`action-status ${hasActed ? 'acted-badge' : 'waiting-badge'}`}>
                {hasActed ? '行動済' : '未行動'}
              </span>
            )}
          </div>
        </div>
        <div className="flex-center" style={{ gap: 'var(--space-2)' }}>
          <button
            onClick={() => {
              // キャラクターの複製を作成
              const copiedCharacter = {
                ...character,
                id: undefined, // 新しいIDが生成されるように
                name: `${character.name}のコピー`,
                status: 'active' // コピー時は活動状態にする
              };
              onUpdate(character.id, copiedCharacter, 'copy');
            }}
            className="btn btn-secondary"
            style={{ padding: 'var(--space-1) var(--space-2)' }}
          >
            複製
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-secondary"
            style={{ padding: 'var(--space-1) var(--space-2)' }}
          >
            編集
          </button>
          <button
            onClick={() => onRemove(character.id)}
            className="btn btn-danger"
            style={{ padding: 'var(--space-1) var(--space-2)' }}
          >
            削除
          </button>
        </div>
      </div>

      {/* 状態異常の表示エリアを追加 */}
      {character.conditions && character.conditions.length > 0 && (
        <div className="conditions-area" style={{
          marginTop: 'var(--space-2)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-2)'
        }}>
          {character.conditions.map((condition, index) => (
            <span
              key={index}
              className="condition-badge"
              style={{
                backgroundColor: condition === '重症' ? '#FEE2E2' : '#FEF3C7',
                color: condition === '重症' ? '#991B1B' : '#92400E',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                border: `1px solid ${condition === '重症' ? '#FECACA' : '#FDE68A'}`
              }}
            >
              {condition}
              <button
                onClick={() => handleConditionRemove(condition)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0 2px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="character-card-body">
        <div>
          <label htmlFor={`currentHP-${character.id}`} style={{
            display: 'block',
            marginBottom: 'var(--space-1)',
            color: character.status !== 'active' ? 'var(--gray-600)' : 'inherit'
          }}>
            現在HP
          </label>
          <input
            id={`currentHP-${character.id}`}
            type="number"
            value={character.currentHP}
            onChange={(e) => handleInputChange('currentHP', e.target.value)}
            className={`input ${character.status !== 'active' ? 'bg-gray-50' : ''}`}
            min="0"
            max={character.maxHP}
            disabled={character.status === 'retired'} // 離脱状態の場合は編集不可
          />
        </div>

        <div className="hp-bar" style={{ opacity: character.status !== 'active' ? 0.7 : 1 }}>
          <div
            className={`hp-bar-fill ${getHPBarClass()}`}
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
        <div style={{
          textAlign: 'center',
          fontSize: '0.875rem',
          color: character.status !== 'active' ? 'var(--gray-600)' : 'var(--gray-600)'
        }}>
          {character.currentHP} / {character.maxHP}
        </div>

        <div style={{ marginTop: 'var(--space-2)' }}>
          <div className="flex-between">
            <span style={{ color: character.status !== 'active' ? 'var(--gray-600)' : 'inherit' }}>DEX:</span>
            <span style={{ fontWeight: '500' }}>{character.dex}</span>
          </div>
          <div className="flex-between">
            <span style={{ color: character.status !== 'active' ? 'var(--gray-600)' : 'inherit' }}>火器使用:</span>
            <button
              onClick={handleGunToggle}
              className={`badge ${character.useGun ? 'badge-success' : 'badge-warning'}`}
              style={{ opacity: character.status !== 'active' ? 0.7 : 1 }}
              disabled={character.status === 'retired'} // 離脱状態の場合は編集不可
            >
              {character.useGun ? '有' : '無'}
            </button>
          </div>
          <div className="flex-between">
            <span style={{ color: character.status !== 'active' ? 'var(--gray-600)' : 'inherit' }}>実効DEX:</span>
            <span style={{ fontWeight: '500' }}>{character.effectiveDex}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;