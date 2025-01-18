import React from 'react';
import '../../styles/commands.css';

const successLevels = [
  {
    id: 'failure',
    name: '失敗',
    description: '判定に失敗',
    icon: '❌'
  },
  {
    id: 'normal',
    name: '通常',
    description: '通常成功',
    icon: '✅'
  },
  {
    id: 'hard',
    name: 'ハード',
    description: 'ハード成功',
    icon: '⭐'
  },
  {
    id: 'extreme',
    name: 'イクストリーム',
    description: 'イクストリーム成功',
    icon: '🌟'
  }
];

const SuccessLevelSelector = ({ 
  character, 
  isAttacker = false, 
  onSuccessSelect,
  onCancel
}) => {
  const title = isAttacker ? '攻撃側' : '防御側';

  return (
    <div className="success-selector">
      <div className="success-header">
        <h4 className="success-title">{character.name}の成功度を選択（{title}）</h4>
        <button onClick={onCancel} className="cancel-button">×</button>
      </div>
      <div className="success-list">
        {successLevels.map(level => (
          <button
            key={level.id}
            className="success-button"
            onClick={() => onSuccessSelect(level.id)}
          >
            <span className="success-icon">{level.icon}</span>
            <div className="success-info-group">
              <span className="success-name">{level.name}</span>
              <span className="success-description">{level.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuccessLevelSelector;