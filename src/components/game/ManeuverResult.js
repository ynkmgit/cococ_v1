import React from 'react';
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

const ManeuverResult = ({
  attacker,
  defender,
  attackerSuccess,
  defenderSuccess,
  defenseType,
  onComplete
}) => {
  const attackerLevel = successLevelValue[attackerSuccess];
  const defenderLevel = successLevelValue[defenderSuccess];

  const determineResult = () => {
    // 攻撃側失敗ならマヌーバー失敗
    if (attackerSuccess === 'failure') {
      return {
        success: 'none',
        message: '戦闘マヌーバー失敗！'
      };
    }

    // 何もしない場合
    if (defenseType === 'no-action') {
      return {
        success: 'attacker',
        message: '戦闘マヌーバー成功！'
      };
    }

    // 通常の対抗判定
    if (defenseType === 'dodge') {
      // 回避の場合
      if (defenderLevel >= attackerLevel) {
        return {
          success: 'defender',
          message: '回避に成功！'
        };
      }
    } else if (defenseType === 'counter') {
      // 応戦の場合
      if (defenderLevel > attackerLevel) {
        return {
          success: 'defender',
          message: '応戦・防御マヌーバーに成功！'
        };
      }
    }

    // それ以外は攻撃側の勝利
    return {
      success: 'attacker',
      message: '戦闘マヌーバーに成功！'
    };
  };

  const result = determineResult();

  return (
    <div className="combat-result">
      <div className="combat-result-header">
        <h4 className="combat-result-title">戦闘マヌーバー結果</h4>
      </div>

      <div className="combat-result-content">
        <div className="success-comparison">
          <div className="participant-success">
            <span className="participant-name">{attacker.name}（攻撃）</span>
            <span className="success-level">{successLevelNames[attackerSuccess]}</span>
          </div>
          {defenderSuccess && (
            <>
              <div className="success-separator">VS</div>
              <div className="participant-success">
                <span className="participant-name">{defender.name}（防御側）</span>
                <span className="success-level">{successLevelNames[defenderSuccess]}</span>
              </div>
            </>
          )}
        </div>

        <div className="result-message">
          <p>{result.message}</p>
        </div>

        <button onClick={onComplete} className="close-button">
          完了
        </button>
      </div>
    </div>
  );
};

export default ManeuverResult;