import React, { useState } from 'react';
import { validateCharacter } from '@/utils/characterUtils';
import { CharacterManager } from '@/utils/characterManager';
import '@/styles/components/character/CharacterForm.css';

const CharacterForm = ({ onAddCharacter, editCharacter = null, onCancel, isAddForm = true }) => {
  const [newCharacter, setNewCharacter] = useState(editCharacter || {
    name: '',
    currentHP: 0,
    maxHP: 0,
    dex: 0,
    useGun: false,
    conditions: [],
    memo: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked :
      type === 'number' ? Number(value) : value;

    setNewCharacter(prev => {
      const updated = {
        ...prev,
        [name]: newValue
      };

      const manager = new CharacterManager([updated]);
      const [calculatedCharacter] = manager.getCharacters();
      return calculatedCharacter;
    });

    setErrors({});
  };

  const handleConditionToggle = (condition) => {
    setNewCharacter(prev => {
      const currentConditions = prev.conditions || [];
      const newConditions = currentConditions.includes(condition)
        ? currentConditions.filter(c => c !== condition)
        : [...currentConditions, condition];
      return {
        ...prev,
        conditions: newConditions
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateCharacter(newCharacter);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const manager = new CharacterManager([newCharacter]);
    const [finalCharacter] = manager.getCharacters();
    onAddCharacter(finalCharacter);

    if (!editCharacter) {
      setNewCharacter({
        name: '',
        currentHP: 0,
        maxHP: 0,
        dex: 0,
        useGun: false,
        conditions: [],
        memo: ''
      });
    }
    setErrors({});
  };

  return (
    <div className={`character-form-container ${isAddForm ? 'add-form' : 'edit-form'}`}>
      <header className="form-header">
        <h1 className="form-title">
          {editCharacter ? 'キャラクター編集' : '新規キャラクター追加'}
        </h1>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <label className="form-label">キャラクター名</label>
          <input
            type="text"
            name="name"
            value={newCharacter.name}
            onChange={handleInputChange}
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            placeholder="名前を入力"
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-section">
          <label className="form-label">HP</label>
          <div className="hp-input-group">
            <input
              type="number"
              name="currentHP"
              value={newCharacter.currentHP}
              onChange={handleInputChange}
              className={`hp-input ${errors.currentHP ? 'input-error' : ''}`}
              min="0"
              max={newCharacter.maxHP}
            />
            <span className="hp-separator">/</span>
            <input
              type="number"
              name="maxHP"
              value={newCharacter.maxHP}
              onChange={handleInputChange}
              className={`hp-input ${errors.maxHP ? 'input-error' : ''}`}
              min="0"
            />
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">DEX</label>
          <div className="dex-input-group">
            <input
              type="number"
              name="dex"
              value={newCharacter.dex}
              onChange={handleInputChange}
              className={`dex-input ${errors.dex ? 'input-error' : ''}`}
              min="0"
            />
            <span className="dex-modifier">
              補正後: {newCharacter.effectiveDex}
            </span>
          </div>
        </div>

        <div className="form-section">
          <div className="gun-toggle-group">
            <div
              className={`gun-toggle ${newCharacter.useGun ? 'active' : ''}`}
              onClick={() => handleInputChange({
                target: {
                  name: 'useGun',
                  type: 'checkbox',
                  checked: !newCharacter.useGun
                }
              })}
            />
            <span className="gun-toggle-label">
              {newCharacter.useGun ? '火器使用中' : '火器未使用'}
            </span>
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">状態</label>
          <div className="conditions-grid">
            {['重症', '転倒', '潜在狂気', '狂気発作', '意識不明', '拘束'].map((condition) => (
              <button
                key={condition}
                type="button"
                className={`condition-button ${newCharacter.conditions.includes(condition) ? 'active' : ''
                  }`}
                onClick={() => handleConditionToggle(condition)}
              >
                {condition}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">メモ</label>
          <textarea
            name="memo"
            value={newCharacter.memo}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="自由にメモを記入"
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="form-button danger"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="form-button primary"
          >
            {editCharacter ? '更新する' : 'キャラクターを追加'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CharacterForm;
