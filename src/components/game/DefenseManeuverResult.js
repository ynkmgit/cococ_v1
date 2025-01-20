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

const DefenseManeuverResult = ({
  attacker,
  defender,
  attackerSuccess,
  defenderSuccess,
  onComplete
}) => {
  const attackerLevel = successLevelValue[attackerSuccess];
  const defenderLevel = successLevelValue[defenderSuccess];

  const determineResult = () => {
    // 両者失敗の場合
    if (attackerSuccess === 'failure' && defenderSuccess === 'failure') {
      return {
        success: 'none',
        message: '両者失敗！'
      };
    }

    // 応戦判定（防御側が高い場合のみ成功）
    if (defenderLevel > attackerLevel) {
      return {
        success: 'defender',
        message: '防御マヌーバーが成功！相手の行動を無効化しました。'
      };
    }

    // それ以外（同点を含む）は攻撃側の勝利
    return {
      success: 'attacker',
      message: '攻撃側の行動が成功！'
    };
  };

  const result = determineResult();

  return (
    <div className="combat-result">
      <div className="combat-result-header">
        <h4 className="combat-result-title">防御マヌーバー結果</h4>
      </div>

      <div className="combat-result-content">
        <div className="success-comparison">
          <div className="participant-success">
            <span className="participant-name">{attacker.name}（攻撃）</span>
            <span className="success-level">{successLevelNames[attackerSuccess]}</span>
          </div>
          <div className="success-separator">VS</div>
          <div className="participant-success">
            <span className="participant-name">{defender.name}（防御側）</span>
            <span className="success-level">{successLevelNames[defenderSuccess]}</span>
          </div>
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

export default DefenseManeuverResult;