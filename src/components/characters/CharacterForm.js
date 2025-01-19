import React, { useState } from 'react';
import { validateCharacter } from '../../utils/characterUtils';
import { CharacterManager } from '../../utils/characterManager';
import '../../styles/form.css';  // パスを更新

const CharacterForm = ({ onAddCharacter, editCharacter = null }) => {
  const [newCharacter, setNewCharacter] = useState(editCharacter || {
    name: '',
    currentHP: 0,
    maxHP: 0,
    dex: 0,
    useGun: false,
    conditions: []
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

  const handleSubmit = () => {
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
        conditions: []
      });
    }
    setErrors({});
  };

  const isConditionActive = (condition) => (newCharacter.conditions || []).includes(condition);

  return (
    <div className="character-form">
      <h2 className="form-title">{editCharacter ? 'キャラクター編集' : '新規キャラクター追加'}</h2>

      <div className="form-section">
        <div className="form-field">
          <label htmlFor="name" className="form-label">キャラクター名</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newCharacter.name}
            onChange={handleInputChange}
            className="form-input"
            placeholder="名前を入力"
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="currentHP" className="form-label">現在HP</label>
            <input
              type="number"
              id="currentHP"
              name="currentHP"
              value={newCharacter.currentHP}
              onChange={handleInputChange}
              className="form-input"
              min="0"
            />
            {errors.currentHP && <span className="error-text">{errors.currentHP}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="maxHP" className="form-label">最大HP</label>
            <input
              type="number"
              id="maxHP"
              name="maxHP"
              value={newCharacter.maxHP}
              onChange={handleInputChange}
              className="form-input"
              min="0"
            />
            {errors.maxHP && <span className="error-text">{errors.maxHP}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="dex" className="form-label">DEX</label>
            <input
              type="number"
              id="dex"
              name="dex"
              value={newCharacter.dex}
              onChange={handleInputChange}
              className="form-input"
              min="0"
            />
            {errors.dex && <span className="error-text">{errors.dex}</span>}
          </div>

          <div className="form-checkbox-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="useGun"
                checked={newCharacter.useGun}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <span>火器使用</span>
            </label>
          </div>
        </div>

        <div className="info-box">
          実効DEX: <strong>{newCharacter.effectiveDex || newCharacter.dex}</strong>
        </div>
      </div>

      <div className="form-section">
        <label className="form-label">状態異常</label>
        <div className="condition-group">
          <button
            type="button"
            onClick={() => handleConditionToggle('重症')}
            className={`condition-button ${isConditionActive('重症') ? 'active' : 'inactive'}`}
          >
            重症
            {isConditionActive('重症') && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="submit-button"
      >
        {editCharacter ? '更新する' : 'キャラクターを追加'}
      </button>
    </div>
  );
};

export default CharacterForm;