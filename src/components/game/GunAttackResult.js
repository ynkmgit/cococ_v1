import React, { useState } from 'react';
import SuccessLevelSelector from './SuccessLevelSelector';
import '../../styles/commands.css';

const successLevelValue = {
  'failure': 0,
  'normal': 1,
  'hard': 2,
  'extreme': 3
};

const successLevelNames = {
  'failure': '失敗',
  'normal': '通常成功',
  'hard': 'ハード成功',
  'extreme': 'イクストリーム成功'
};

const GunAttackResult = ({
  attacker,
  defender,
  onSingleShot,
  onComplete,
  onCancel,
  previousShots = [],
  isZeroDistance = false
}) => {
  const [totalShots, setTotalShots] = useState(null);
  const [currentAttackSuccess, setCurrentAttackSuccess] = useState(null);
  const [currentDamage, setCurrentDamage] = useState('0');
  const [showDamageInput, setShowDamageInput] = useState(false);

  const handleShotsSelect = (shots) => {
    setTotalShots(shots);
  };

  const handleSuccessSelect = (success) => {
    setCurrentAttackSuccess(success);
    if (successLevelValue[success] >= successLevelValue['normal']) {
      setShowDamageInput(true);
    } else {
      handleShot(success, 0);
    }
  };

  const handleDamageSubmit = (e) => {
    e.preventDefault();
    const damage = parseInt(currentDamage, 10) || 0;
    handleShot(currentAttackSuccess, damage);
  };

  const handleShot = (success, damage) => {
    const finalDamage = isZeroDistance ? Math.ceil(damage * 1.5) : damage;
    
    onSingleShot({ 
      success, 
      damage: finalDamage, 
      isZeroDistance 
    });
    
    setCurrentAttackSuccess(null);
    setCurrentDamage('');
    setShowDamageInput(false);

    if (previousShots.length + 1 >= totalShots) {
      onComplete();
    }
  };

  const handleCancel = () => {
    if (previousShots.length > 0) {
      onComplete();
    } else {
      onCancel();
    }
  };

  return (
    <div className="combat-result">
      <div className="combat-result-header">
        <h4 className="combat-result-title">射撃</h4>
        <button onClick={handleCancel} className="cancel-button">×</button>
      </div>

      <div className="combat-result-content">
        {totalShots === null && (
          <div className="shots-selector">
            <h5 className="section-subtitle">射撃回数を選択</h5>
            <div className="command-buttons">
              {[1, 2, 3].map(num => (
                <button
                  key={num}
                  onClick={() => handleShotsSelect(num)}
                  className="command-button"
                >
                  <span className="command-icon">🎯</span>
                  <div className="command-info">
                    <span className="command-name">{num}回射撃</span>
                    <span className="command-description">{num}回の射撃を行う</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {totalShots !== null && (
          <>
            <div className="status-display">
              残り射撃回数: {totalShots - previousShots.length}回
            </div>

            {previousShots.length > 0 && (
              <div className="previous-results">
                <h5 className="section-subtitle">射撃結果</h5>
                {previousShots.map((shot, index) => (
                  <div key={index} className="result-item">
                    {index + 1}回目: {successLevelNames[shot.success]}
                    {successLevelValue[shot.success] >= successLevelValue['normal'] &&
                      ` - ${shot.damage}ダメージ`
                    }
                  </div>
                ))}
              </div>
            )}

            {previousShots.length < totalShots && !currentAttackSuccess && !showDamageInput && (
              <SuccessLevelSelector
                character={attacker}
                isAttacker={true}
                onSuccessSelect={handleSuccessSelect}
                onCancel={handleCancel}
              />
            )}

            {showDamageInput && (
              <form onSubmit={handleDamageSubmit} className="damage-input-form">
                <label htmlFor="damage" className="damage-input-label">
                  {previousShots.length + 1}回目の射撃ダメージ
                </label>
                <div className="damage-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    id="damage"
                    type="number"
                    min="0"
                    value={currentDamage}
                    onChange={(e) => setCurrentDamage(e.target.value)}
                    className="damage-input"
                    placeholder="ダメージを入力"
                    required
                  />
                  <button type="submit" className="damage-submit-button" style={{ width: '100%' }}>
                    確定
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GunAttackResult;