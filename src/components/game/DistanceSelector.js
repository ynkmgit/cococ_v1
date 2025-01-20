import React from 'react';
import '../../styles/commands.css';

const DistanceSelector = ({ onDistanceSelect, onCancel }) => {
  const distances = [
    {
      id: 'zero',
      name: '0距離',
      description: '至近距離での射撃',
      icon: '📏'
    },
    {
      id: 'normal',
      name: '通常距離',
      description: '通常の射程での射撃',
      icon: '🎯'
    }
  ];

  return (
    <div className="defense-selector">
      <div className="defense-header">
        <h4 className="defense-title">射撃距離を選択</h4>
        <button onClick={onCancel} className="cancel-button">×</button>
      </div>
      <div className="defense-list">
        {distances.map(distance => (
          <button
            key={distance.id}
            className="defense-button"
            onClick={() => onDistanceSelect(distance.id === 'zero')}
          >
            <span className="defense-icon">{distance.icon}</span>
            <div className="defense-info-group">
              <span className="defense-name">{distance.name}</span>
              <span className="defense-description">{distance.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DistanceSelector;