import React from 'react';
import '../../styles/commands.css';

const DefenseCommandSelector = ({ target, onDefenseSelect, onCancel }) => {
  // 基本の防御コマンド
  const baseDefenseCommands = [
    {
      id: 'counter',
      name: '応戦',
      description: '攻撃に対して反撃を試みる',
      icon: '⚔️'
    },
    {
      id: 'dodge',
      name: '回避',
      description: '攻撃を避けようと試みる',
      icon: '💨'
    }
  ];

  // 火器使用者でない場合のみマヌーバーを追加
  const defenseCommands = target.useGun
    ? baseDefenseCommands
    : [
      ...baseDefenseCommands,
    ];

  return (
    <div className="defense-selector">
      <div className="defense-header">
        <h4 className="defense-title">{target.name}の対応を選択</h4>
        <button onClick={onCancel} className="cancel-button">×</button>
      </div>
      <div className="defense-list">
        {defenseCommands.map(command => (
          <button
            key={command.id}
            className="defense-button"
            onClick={() => onDefenseSelect(command.id)}
          >
            <span className="defense-icon">{command.icon}</span>
            <div className="defense-info-group">
              <span className="defense-name">{command.name}</span>
              <span className="defense-description">{command.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DefenseCommandSelector;