import React from 'react';
import '../../styles/commands.css';

const DefenseCommandSelector = ({ 
  target, 
  onDefenseSelect, 
  onCancel,
  isGunAttack = false,
  isZeroDistance = false 
}) => {
  const baseDefenseCommands = [
    {
      id: 'dodge',
      name: '回避',
      description: '攻撃を避けようと試みる',
      icon: '💨'
    },
    {
      id: 'counter',
      name: '応戦',
      description: '攻撃に対して反撃を試みる',
      icon: '⚔️'
    },
    {
      id: 'defense-maneuver',
      name: '防御マヌーバー',
      description: '攻撃に対して特殊な防御行動を試みる',
      icon: '🛡️'
    },
    {
      id: 'no-action',
      name: '何もしない',
      description: '対抗ロールを行わず、攻撃の結果をそのまま受け入れる',
      icon: '🤚'
    }
  ];

  // 0距離の火器攻撃の場合は選択肢を制限
  const defenseCommands = isGunAttack && isZeroDistance
    ? [
        {
          id: 'defense-maneuver',
          name: '防御マヌーバー',
          description: '至近距離からの射撃に対して特殊な防御行動を試みる（対抗ロール）',
          icon: '🛡️'
        },
        {
          id: 'no-action',
          name: '何もしない',
          description: '対抗ロールを行わず、攻撃の結果をそのまま受け入れる',
          icon: '🤚'
        }
      ]
    : baseDefenseCommands;

  const handleDefenseSelect = (commandId) => {
    console.log('Selecting defense:', commandId); // デバッグ用
    onDefenseSelect(commandId);
  };

  return (
    <div className="defense-selector">
      <div className="defense-header">
        <h4 className="defense-title">
          {target.name}の対応を選択
          {isGunAttack && isZeroDistance && ' (0距離射撃)'}
        </h4>
        <button onClick={onCancel} className="cancel-button">×</button>
      </div>
      <div className="defense-list">
        {defenseCommands.map(command => (
          <button
            key={command.id}
            className="defense-button"
            onClick={() => handleDefenseSelect(command.id)}
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