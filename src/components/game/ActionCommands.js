import React, { useState } from 'react';
import TargetSelector from './TargetSelector';
import DistanceSelector from './DistanceSelector';
import DefenseCommandSelector from './DefenseCommandSelector';
import SuccessLevelSelector from './SuccessLevelSelector';
import CombatResult from './CombatResult';
import ManeuverResult from './ManeuverResult';
import DefenseManeuverResult from './DefenseManeuverResult';
import GunAttackResult from './GunAttackResult';
import '../../styles/commands.css';

const successLevelValue = {
  'failure': 0,
  'normal': 1,
  'hard': 2,
  'extreme': 3
};

const ActionCommands = ({
  characters,
  currentCharacterId,
  onCommandSelect
}) => {
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [showTargetSelector, setShowTargetSelector] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [showDistanceSelector, setShowDistanceSelector] = useState(false);
  const [isZeroDistance, setIsZeroDistance] = useState(false);
  const [showDefenseSelector, setShowDefenseSelector] = useState(false);
  const [selectedDefense, setSelectedDefense] = useState(null);
  const [showAttackerSuccess, setShowAttackerSuccess] = useState(false);
  const [showDefenderSuccess, setShowDefenderSuccess] = useState(false);
  const [showCombatResult, setShowCombatResult] = useState(false);
  const [showManeuverResult, setShowManeuverResult] = useState(false);
  const [showDefenseManeuverResult, setShowDefenseManeuverResult] = useState(false);
  const [attackerSuccess, setAttackerSuccess] = useState(null);
  const [defenderSuccess, setDefenderSuccess] = useState(null);
  const [showGunAttack, setShowGunAttack] = useState(false);
  const [gunAttacks, setGunAttacks] = useState([]);

  // currentCharacterIdがない場合は何も表示しない
  if (!currentCharacterId) return null;

  const currentCharacter = characters.find(char => char.id === currentCharacterId);

  // 使用可能な行動を動的に生成
  let commands = [];

  if (currentCharacter.useGun) {
    commands = [
      {
        id: 'shoot',
        name: '火器攻撃',
        description: '火器攻撃を行う',
        icon: '🔫'
      },
      ...commands
    ];
  } else {
    commands = [
      {
        id: 'attack',
        name: '近接戦闘',
        description: 'ダメージを加える近接の攻撃',
        icon: '⚔️'
      },
      {
        id: 'maneuver',
        name: 'マヌーバー攻撃',
        description: 'ダメージを加えること以外の目的とする行動',
        icon: '🤼'
      },
      {
        id: 'retire',
        name: '離脱',
        description: '戦闘から離脱する',
        icon: '🚪'
      },
      ...commands
    ];
  }

  const handleCancel = () => {
    resetSelections();
  };
  const handleCommandClick = (command) => {
    setSelectedCommand(command);
    setSelectedTarget(null);
    setSelectedDefense(null);
    setAttackerSuccess(null);
    setDefenderSuccess(null);
    setShowDefenseSelector(false);
    setShowDistanceSelector(false);
    setIsZeroDistance(false);
    setShowAttackerSuccess(false);
    setShowDefenderSuccess(false);
    setShowCombatResult(false);
    setShowManeuverResult(false);
    setShowDefenseManeuverResult(false);
    setShowGunAttack(false);
    setGunAttacks([]);

    if (command.id === 'retire') {
      if (window.confirm('本当に離脱しますか？')) {
        onCommandSelect({
          command: command,
          target: currentCharacter,
          defenseType: null,
          attackerSuccess: null,
          defenderSuccess: null,
          damage: 0,
          isRetire: true
        });
      }
    } else if (command.id === 'shoot' || command.id === 'attack' || command.id === 'maneuver') {
      setShowTargetSelector(true);
    }
  };

  const handleTargetSelect = (target) => {
    setSelectedTarget(target);
    setShowTargetSelector(false);

    if (selectedCommand.id === 'shoot') {
      setShowDistanceSelector(true); // 距離選択を表示
    } else {
      setShowDefenseSelector(true);
    }
  };

  const handleDistanceSelect = (isZero) => {
    setIsZeroDistance(isZero);
    setShowDistanceSelector(false);

    if (isZero) {
      setShowDefenseSelector(true); // 0距離の場合は防御選択へ
    } else {
      setShowGunAttack(true); // 通常距離の場合は従来の射撃フローへ
    }
  };

  const handleGunShot = ({ success, damage, isZeroDistance: isZero }) => {
    onCommandSelect({
      command: selectedCommand,
      target: selectedTarget,
      defenseType: null,
      attackerSuccess: success,
      defenderSuccess: null,
      damage: damage,
      isGunAttack: true,
      isSingleShot: true,
      isZeroDistance: isZero
    });

    const newAttacks = [...gunAttacks, { success, damage }];
    setGunAttacks(newAttacks);
  };

  const handleGunAttackComplete = () => {
    resetSelections();
  };

  const handleDefenseSelect = (defenseType) => {
    console.log('Selected defense type:', defenseType);
    setSelectedDefense(defenseType);
    setShowDefenseSelector(false);

    if (selectedCommand.id === 'shoot' && isZeroDistance && defenseType === 'defense-maneuver') {
      // 0距離射撃での防御マヌーバー選択時は対抗ロールへ
      setShowAttackerSuccess(true);
    } else if (selectedCommand.id === 'shoot' && isZeroDistance) {
      // 0距離射撃で防御マヌーバー以外の選択時は射撃判定へ
      setShowGunAttack(true);
    } else {
      setShowAttackerSuccess(true);
    }
  };

  const handleAttackerSuccessSelect = (successLevel) => {
    setAttackerSuccess(successLevel);
    setShowAttackerSuccess(false);

    // 「何もしない」が選択された場合
    if (selectedDefense === 'no-action') {
      // 通常の結果画面に進む
      if (selectedCommand.id === 'attack') {
        setShowCombatResult(true);
      } else if (selectedCommand.id === 'maneuver') {
        setShowManeuverResult(true);
      }
    } else {
      // 「何もしない」以外は通常通り防御側の判定へ
      setShowDefenderSuccess(true);
    }
  };

  const handleDefenderSuccessSelect = (successLevel) => {
    setDefenderSuccess(successLevel);
    setShowDefenderSuccess(false);

    console.log('Command:', selectedCommand.id);
    console.log('Defense:', selectedDefense);

    // 攻撃側と防御側の成功度を比較
    const attackerLevel = successLevelValue[attackerSuccess];
    const defenderLevel = successLevelValue[successLevel];

    if (selectedCommand.id === 'shoot' && isZeroDistance && selectedDefense === 'defense-maneuver') {
      // 0距離射撃での防御マヌーバー
      if (attackerLevel === 0 || (defenderLevel > attackerLevel)) {
        // 攻撃側が失敗、または防御側が上回った場合のみ防御側の処理
        setShowDefenseManeuverResult(true);
      } else {
        // それ以外（攻撃側の成功度が高い、または同値）は攻撃成功
        setShowGunAttack(true);
      }
    } else if (selectedDefense === 'defense-maneuver') {
      // 通常の防御マヌーバー
      if (attackerLevel === 0 || (defenderLevel > attackerLevel)) {
        // 攻撃側が失敗、または防御側が上回った場合のみ防御側の処理
        setShowDefenseManeuverResult(true);
      } else {
        // それ以外（攻撃側の成功度が高い、または同値）は攻撃成功
        setShowCombatResult(true);
      }
    } else if (selectedCommand.id === 'attack') {
      setShowCombatResult(true);
    } else if (selectedCommand.id === 'maneuver') {
      setShowManeuverResult(true);
    }
  };

  const handleDamageSubmit = ({ amount, isCounterAttack }) => {
    if (selectedCommand && selectedTarget && selectedDefense && attackerSuccess) {
      onCommandSelect({
        command: selectedCommand,
        target: selectedTarget,
        defenseType: selectedDefense,
        attackerSuccess: attackerSuccess,
        defenderSuccess: defenderSuccess,
        damage: amount,
        isCounterAttack,
        isZeroDistance: selectedCommand.id === 'shoot' ? isZeroDistance : undefined
      });
    }
    resetSelections();
  };

  const handleManeuverComplete = () => {
    if (selectedCommand && selectedTarget && selectedDefense && attackerSuccess) {
      onCommandSelect({
        command: selectedCommand,
        target: selectedTarget,
        defenseType: selectedDefense,
        attackerSuccess: attackerSuccess,
        defenderSuccess: defenderSuccess,
        damage: 0,
        isManeuver: true,
        isZeroDistance: selectedCommand.id === 'shoot' ? isZeroDistance : undefined
      });
    }
    resetSelections();
  };

  const handleDefenseManeuverComplete = () => {
    if (selectedCommand && selectedTarget && selectedDefense && attackerSuccess) {
      onCommandSelect({
        command: selectedCommand,
        target: selectedTarget,
        defenseType: selectedDefense,
        attackerSuccess: attackerSuccess,
        defenderSuccess: defenderSuccess,
        damage: 0,
        isDefenseManeuver: true,
        isZeroDistance: selectedCommand.id === 'shoot' ? isZeroDistance : undefined
      });
    }
    resetSelections();
  };

  const resetSelections = () => {
    setSelectedCommand(null);
    setShowTargetSelector(false);
    setSelectedTarget(null);
    setShowDistanceSelector(false);
    setIsZeroDistance(false);
    setShowDefenseSelector(false);
    setSelectedDefense(null);
    setShowAttackerSuccess(false);
    setShowDefenderSuccess(false);
    setShowCombatResult(false);
    setShowManeuverResult(false);
    setShowDefenseManeuverResult(false);
    setShowGunAttack(false);
    setAttackerSuccess(null);
    setDefenderSuccess(null);
    setGunAttacks([]);
  };

  return (
    <div className="action-commands">
      {!showTargetSelector &&
        !showDistanceSelector &&
        !showDefenseSelector &&
        !showAttackerSuccess &&
        !showDefenderSuccess &&
        !showCombatResult &&
        !showManeuverResult &&
        !showDefenseManeuverResult &&
        !showGunAttack &&
        commands.map(command => (
          <button
            key={command.id}
            className={`command-button ${selectedCommand?.id === command.id ? 'selected' : ''}`}
            onClick={() => handleCommandClick(command)}
          >
            <span className="command-icon">{command.icon}</span>
            <div className="command-info">
              <span className="command-name">{command.name}</span>
              <span className="command-description">{command.description}</span>
            </div>
          </button>
        ))}

      {showTargetSelector && (
        <TargetSelector
          characters={characters}
          currentCharacterId={currentCharacterId}
          onTargetSelect={handleTargetSelect}
          onCancel={handleCancel}
        />
      )}

      {showDistanceSelector && (
        <DistanceSelector
          onDistanceSelect={handleDistanceSelect}
          onCancel={handleCancel}
        />
      )}

      {showGunAttack && selectedTarget && (
        <GunAttackResult
          attacker={currentCharacter}
          defender={selectedTarget}
          onSingleShot={handleGunShot}
          onComplete={handleGunAttackComplete}
          onCancel={handleCancel}
          previousShots={gunAttacks}
          isZeroDistance={isZeroDistance}
          skipSuccessCheck={
            selectedDefense === 'defense-maneuver' &&
            defenderSuccess &&
            attackerSuccess &&
            // 両方失敗でない場合に、攻撃側の成功度が防御側以上なら射撃側の勝利
            attackerSuccess !== 'failure' &&
            defenderSuccess !== 'failure' &&
            successLevelValue[attackerSuccess] >= successLevelValue[defenderSuccess]
          }
        />
      )}

      {showDefenseSelector && selectedTarget && (
        <DefenseCommandSelector
          target={selectedTarget}
          onDefenseSelect={handleDefenseSelect}
          onCancel={handleCancel}
          isGunAttack={selectedCommand.id === 'shoot'}
          isZeroDistance={isZeroDistance}
        />
      )}

      {showAttackerSuccess && currentCharacter && (
        <SuccessLevelSelector
          character={currentCharacter}
          isAttacker={true}
          onSuccessSelect={handleAttackerSuccessSelect}
          onCancel={handleCancel}
        />
      )}

      {showDefenderSuccess && selectedTarget && (
        <SuccessLevelSelector
          character={selectedTarget}
          isAttacker={false}
          onSuccessSelect={handleDefenderSuccessSelect}
          onCancel={handleCancel}
        />
      )}

      {showCombatResult && currentCharacter && selectedTarget && (
        <CombatResult
          attacker={currentCharacter}
          defender={selectedTarget}
          attackerSuccess={attackerSuccess}
          defenderSuccess={defenderSuccess}
          defenseType={selectedDefense}
          onDamageSubmit={handleDamageSubmit}
          onClose={handleCancel}
        />
      )}

      {showManeuverResult && currentCharacter && selectedTarget && (
        <ManeuverResult
          attacker={currentCharacter}
          defender={selectedTarget}
          attackerSuccess={attackerSuccess}
          defenderSuccess={defenderSuccess}
          defenseType={selectedDefense}
          onComplete={handleManeuverComplete}
        />
      )}

      {showDefenseManeuverResult && currentCharacter && selectedTarget && (
        <DefenseManeuverResult
          attacker={currentCharacter}
          defender={selectedTarget}
          attackerSuccess={attackerSuccess}
          defenderSuccess={defenderSuccess}
          onComplete={handleDefenseManeuverComplete}
        />
      )}
    </div>
  );
};

export default ActionCommands;