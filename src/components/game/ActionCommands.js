import React, { useState } from 'react';
import TargetSelector from './TargetSelector';
import DefenseCommandSelector from './DefenseCommandSelector';
import SuccessLevelSelector from './SuccessLevelSelector';
import CombatResult from './CombatResult';
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
  const [showDefenseSelector, setShowDefenseSelector] = useState(false);
  const [selectedDefense, setSelectedDefense] = useState(null);
  const [showAttackerSuccess, setShowAttackerSuccess] = useState(false);
  const [showDefenderSuccess, setShowDefenderSuccess] = useState(false);
  const [showCombatResult, setShowCombatResult] = useState(false);
  const [attackerSuccess, setAttackerSuccess] = useState(null);
  const [defenderSuccess, setDefenderSuccess] = useState(null);
  const [showGunAttack, setShowGunAttack] = useState(false);
  const [gunAttacks, setGunAttacks] = useState([]);

  // currentCharacterIdがない場合は何も表示しない
  if (!currentCharacterId) return null;

  const currentCharacter = characters.find(char => char.id === currentCharacterId);

  // 使用可能なコマンドを動的に生成
  let commands = [];

  if (currentCharacter.useGun) {
    commands = [
      {
        id: 'shoot',
        name: '射撃',
        description: '火器での射撃を行う',
        icon: '🔫'
      },
      ...commands
    ];
  } else {
    commands = [
      {
        id: 'attack',
        name: '攻撃',
        description: '通常攻撃を行う',
        icon: '⚔️'
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

  const handleCommandClick = (command) => {
    setSelectedCommand(command);
    setSelectedTarget(null);
    setSelectedDefense(null);
    setAttackerSuccess(null);
    setDefenderSuccess(null);
    setShowDefenseSelector(false);
    setShowAttackerSuccess(false);
    setShowDefenderSuccess(false);
    setShowCombatResult(false);
    setShowGunAttack(false);
    setGunAttacks([]);

    if (command.id === 'retire') {
      // 離脱コマンドの場合は確認後に即時実行
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
    } else if (command.id === 'shoot') {
      setShowTargetSelector(true);
    } else if (command.id === 'attack') {
      setShowTargetSelector(true);
    }
  };

  const handleTargetSelect = (target) => {
    setSelectedTarget(target);
    setShowTargetSelector(false);

    if (selectedCommand.id === 'shoot') {
      setShowGunAttack(true);
    } else {
      setShowDefenseSelector(true);
    }
  };

  const handleGunShot = ({ success, damage }) => {
    onCommandSelect({
      command: selectedCommand,
      target: selectedTarget,
      defenseType: null,
      attackerSuccess: success,
      defenderSuccess: null,
      damage: damage,
      isGunAttack: true,
      isSingleShot: true
    });

    const newAttacks = [...gunAttacks, { success, damage }];
    setGunAttacks(newAttacks);
  };

  const handleGunAttackComplete = () => {
    resetSelections();
  };

  const handleDefenseSelect = (defenseType) => {
    setSelectedDefense(defenseType);
    setShowDefenseSelector(false);
    setShowAttackerSuccess(true);
  };

  const handleAttackerSuccessSelect = (successLevel) => {
    setAttackerSuccess(successLevel);
    setShowAttackerSuccess(false);
    setShowDefenderSuccess(true);
  };

  const handleDefenderSuccessSelect = (successLevel) => {
    setDefenderSuccess(successLevel);
    setShowDefenderSuccess(false);
    setShowCombatResult(true);
  };

  const handleDamageSubmit = ({ amount, isCounterAttack }) => {
    if (selectedCommand && selectedTarget && selectedDefense && attackerSuccess && defenderSuccess) {

      onCommandSelect({
        command: selectedCommand,
        target: selectedTarget,
        defenseType: selectedDefense,
        attackerSuccess: attackerSuccess,
        defenderSuccess: defenderSuccess,
        damage: amount,
        isCounterAttack,
      });
    }
    resetSelections();
  };

  const handleCancel = () => {
    resetSelections();
  };

  const resetSelections = () => {
    setSelectedCommand(null);
    setShowTargetSelector(false);
    setSelectedTarget(null);
    setShowDefenseSelector(false);
    setSelectedDefense(null);
    setShowAttackerSuccess(false);
    setShowDefenderSuccess(false);
    setShowCombatResult(false);
    setShowGunAttack(false);
    setAttackerSuccess(null);
    setDefenderSuccess(null);
    setGunAttacks([]);
  };

  return (
    <div className="action-commands">
      {/* 初期コマンド選択 */}
      {!showTargetSelector &&
        !showDefenseSelector &&
        !showAttackerSuccess &&
        !showDefenderSuccess &&
        !showCombatResult &&
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

      {/* ターゲット選択 */}
      {showTargetSelector && (
        <TargetSelector
          characters={characters}
          currentCharacterId={currentCharacterId}
          onTargetSelect={handleTargetSelect}
          onCancel={handleCancel}
        />
      )}

      {/* 銃撃戦結果 */}
      {showGunAttack && selectedTarget && (
        <GunAttackResult
          attacker={currentCharacter}
          defender={selectedTarget}
          onSingleShot={handleGunShot}
          onComplete={handleGunAttackComplete}
          onCancel={handleCancel}
          previousShots={gunAttacks}
        />
      )}

      {/* 防御コマンド選択 */}
      {showDefenseSelector && selectedTarget && (
        <DefenseCommandSelector
          target={selectedTarget}
          onDefenseSelect={handleDefenseSelect}
          onCancel={handleCancel}
        />
      )}

      {/* 攻撃側成功度選択 */}
      {showAttackerSuccess && currentCharacter && (
        <SuccessLevelSelector
          character={currentCharacter}
          isAttacker={true}
          onSuccessSelect={handleAttackerSuccessSelect}
          onCancel={handleCancel}
        />
      )}

      {/* 防御側成功度選択 */}
      {showDefenderSuccess && selectedTarget && (
        <SuccessLevelSelector
          character={selectedTarget}
          isAttacker={false}
          onSuccessSelect={handleDefenderSuccessSelect}
          onCancel={handleCancel}
        />
      )}

      {/* 戦闘結果表示 */}
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
    </div>
  );
};

export default ActionCommands;