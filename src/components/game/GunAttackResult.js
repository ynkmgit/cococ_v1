import React, { useState } from 'react';
import '../../styles/commands.css';
import SuccessLevelSelector from './SuccessLevelSelector';

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
  isZeroDistance = false,
  skipSuccessCheck = false  // 防御マヌーバー勝利時のスキップフラグ
}) => {
  const [totalShots, setTotalShots] = useState(null);
  const [currentAttackSuccess, setCurrentAttackSuccess] = useState(null);
  const [currentDamage, setCurrentDamage] = useState('0');
  const [showDamageInput, setShowDamageInput] = useState(false);
  const [showSuccessSelector, setShowSuccessSelector] = useState(!skipSuccessCheck);

  // 防御マヌーバー勝利時は自動的に通常成功として扱う
  React.useEffect(() => {
    if (skipSuccessCheck) {
      setShowSuccessSelector(false);
      setShowDamageInput(true);
      setCurrentAttackSuccess('normal');
    }
  }, [skipSuccessCheck]);

  const handleSuccessSelect = (success) => {
    setCurrentAttackSuccess(success);
    if (successLevelValue[success] >= successLevelValue['normal']) {
      setShowSuccessSelector(false);
      setShowDamageInput(true);
    } else {
      handleShot(success, 0);
    }
  };

  const handleDamageSubmit = (e) => {
    e.preventDefault();
    const damage = parseInt(currentDamage, 10) || 0;
    handleShot(currentAttackSuccess || 'normal', damage);  // skipSuccessCheck時はnormalを使用
  };

  const handleShot = (success, damage) => {
    onSingleShot({
      success,
      damage,
      isZeroDistance
    });

    setCurrentAttackSuccess(null);
    setCurrentDamage('0');
    setShowDamageInput(false);
    setShowSuccessSelector(!skipSuccessCheck);  // skipSuccessCheck時は表示しない

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
        <h4 className="combat-result-title">戦闘結果</h4>
        <button onClick={handleCancel} className="cancel-button">×</button>
      </div>

      <div className="combat-result-content">
        {showSuccessSelector && (
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
              射撃ダメージ
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
      </div>
    </div>
  );
};

export default GunAttackResult;