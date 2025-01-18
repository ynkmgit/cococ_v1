import React, { useState } from 'react';
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

const CombatResult = ({
  attacker,
  defender,
  attackerSuccess,
  defenderSuccess,
  defenseType,
  isManeuver = false,
  onDamageSubmit,
  onClose
}) => {
  const [damage, setDamage] = useState('');

  const attackerLevel = successLevelValue[attackerSuccess];
  const defenderLevel = successLevelValue[defenderSuccess];

  const determineResult = () => {
    // 両者失敗の場合を先に判定
    if (attackerSuccess === 'failure' && defenderSuccess === 'failure') {
      return {
        success: 'none',
        message: '両者失敗！攻撃は不発に終わった',
        showDamageInput: false,
        showCompleteButton: true
      };
    }

    if (isManeuver) {
      if (attackerLevel > defenderLevel) {
        return {
          success: 'attacker',
          message: 'マヌーバー成功！',
          showDamageInput: false,
          showCompleteButton: true
        };
      } else {
        return {
          success: 'defender',
          message: 'マヌーバー失敗...',
          showDamageInput: false,
          showCompleteButton: true
        };
      }
    } else if (defenseType === 'dodge') {
      // 回避の場合
      if (defenderLevel >= attackerLevel) {
        return {
          success: 'defender',
          message: '回避に成功！',
          showDamageInput: false,
          showCompleteButton: true
        };
      }
    } else if (defenseType === 'counter') {
      // 応戦の場合
      if (defenderLevel > attackerLevel) {
        return {
          success: 'defender',
          message: '応戦に成功！反撃を行います。',
          showDamageInput: true,
          showCompleteButton: false
        };
      }
    }

    // それ以外は攻撃側の勝利
    return {
      success: 'attacker',
      message: '攻撃が命中！',
      showDamageInput: true,
      showCompleteButton: false
    };
  };

  const result = determineResult();

  const handleDamageSubmit = (e) => {
    e.preventDefault();
    const damageValue = parseInt(damage, 10) || 0;
    onDamageSubmit({
      amount: damageValue,
      isCounterAttack: result.success === 'defender' && defenseType === 'counter'
    });
  };

  const handleComplete = () => {
    onDamageSubmit({
      amount: 0,
      isCounterAttack: false
    });
  };

  return (
    <div className="combat-result">
      <div className="combat-result-header">
        <h4 className="combat-result-title">{isManeuver ? 'マヌーバー結果' : '戦闘結果'}</h4>
        <button onClick={onClose} className="cancel-button">×</button>
      </div>

      <div className="combat-result-content">
        <div className="success-comparison">
          <div className="participant-success">
            <span className="participant-name">{attacker.name}（{isManeuver ? 'マヌーバー側' : '攻撃側'}）</span>
            <span className="success-level">{successLevelNames[attackerSuccess]}</span>
          </div>
          <div className="success-separator">VS</div>
          <div className="participant-success">
            <span className="participant-name">{defender.name}（{
              isManeuver ? '防御側' :
                defenseType === 'dodge' ? '回避' :
                  defenseType === 'counter' ? '応戦' : '不明'
            }）</span>
            <span className="success-level">{successLevelNames[defenderSuccess]}</span>
          </div>
        </div>

        <div className="result-message">
          <p>{result.message}</p>
        </div>

        {result.showDamageInput && (
          <form onSubmit={handleDamageSubmit} className="damage-input-form">
            <label htmlFor="damage" className="damage-input-label">
              {result.success === 'defender' ? '反撃' : '攻撃'}ダメージ
            </label>
            <div className="damage-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                id="damage"
                type="number"
                min="0"
                value={damage}
                onChange={(e) => setDamage(e.target.value)}
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

        {result.showCompleteButton && (
          <button onClick={handleComplete} className="close-button">
            完了
          </button>
        )}
      </div>
    </div>
  );
};

export default CombatResult;