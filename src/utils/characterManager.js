/**
 * キャラクター管理クラス
 */
export class CharacterManager {
  /**
   * @param {import('./types').Character[]} characters - 初期キャラクターリスト
   */
  constructor(characters = []) {
    this.characters = this.sortCharacters(characters.map(char => ({
      ...char,
      status: char.status || 'active',
      conditions: char.conditions || [],  // 状態異常の配列を追加
      effectiveDex: this.calculateEffectiveDex(char).effectiveDex
    })));
  }

  /**
   * キャラクターの追加
   * @param {Omit<import('./types').Character, 'id' | 'effectiveDex' | 'status'>} character 
   * @returns {import('./types').Character[]}
   */
  addCharacter(character) {
    const newCharacter = {
      ...character,
      id: Date.now(),
      status: 'active',
      conditions: [],  // 初期状態は空の配列
      effectiveDex: this.calculateEffectiveDex(character)
    };
    this.characters = this.sortCharacters([...this.characters, newCharacter]);
    return this.characters;
  }

  /**
   * キャラクターの更新
   * @param {number} id - 更新対象のキャラクターID
   * @param {Partial<import('./types').Character>} updates - 更新内容
   * @returns {import('./types').Character[]}
   */
  updateCharacter(id, updates) {
    const index = this.characters.findIndex(c => c.id === id);
    if (index === -1) return this.characters;

    const updatedCharacter = {
      ...this.characters[index],
      ...updates,
      conditions: updates.conditions || this.characters[index].conditions || []
    };
    updatedCharacter.effectiveDex = this.calculateEffectiveDex(updatedCharacter);

    const newCharacters = [...this.characters];
    newCharacters[index] = updatedCharacter;
    this.characters = this.sortCharacters(newCharacters);
    return this.characters;
  }

  /**
   * キャラクターの状態異常を追加
   * @param {number} id - 対象のキャラクターID
   * @param {string} condition - 追加する状態異常
   * @returns {import('./types').Character[]}
   */
  addCondition(id, condition) {
    const character = this.characters.find(c => c.id === id);
    if (!character) return this.characters;

    const conditions = [...(character.conditions || [])];
    if (!conditions.includes(condition)) {
      conditions.push(condition);
    }

    return this.updateCharacter(id, { conditions });
  }

  /**
   * キャラクターの状態異常を削除
   * @param {number} id - 対象のキャラクターID
   * @param {string} condition - 削除する状態異常
   * @returns {import('./types').Character[]}
   */
  removeCondition(id, condition) {
    const character = this.characters.find(c => c.id === id);
    if (!character) return this.characters;

    const conditions = (character.conditions || []).filter(c => c !== condition);
    return this.updateCharacter(id, { conditions });
  }

  /**
   * キャラクターの状態を更新
   * @param {number} id - 対象のキャラクターID
   * @param {('active'|'inactive'|'retired')} newStatus - 新しい状態
   * @returns {import('./types').Character[]}
   */
  updateCharacterStatus(id, newStatus) {
    return this.updateCharacter(id, { status: newStatus });
  }

  /**
   * キャラクターを離脱状態に変更
   * @param {number} id - 対象のキャラクターID
   * @returns {import('./types').Character[]}
   */
  retireCharacter(id) {
    return this.updateCharacter(id, { status: 'retired' });
  }

  /**
   * キャラクターの削除
   * @param {number} id - 削除対象のキャラクターID
   * @returns {import('./types').Character[]}
   */
  removeCharacter(id) {
    this.characters = this.characters.filter(char => char.id !== id);
    return this.characters;
  }

  /**
   * 実効DEXの計算
   * @param {Pick<import('./types').Character, 'dex' | 'useGun'>} character 
   * @returns {number}
   */
  calculateEffectiveDex(character) {
    const baseDex = character.dex || 0;
    const dexModifier = Math.floor((baseDex - 10) / 2);
    return {
      effectiveDex: character.useGun ? baseDex * 2 : baseDex,
      dexModifier
    };
  }

  /**
   * キャラクターのソート
   * @param {import('./types').Character[]} characters 
   * @returns {import('./types').Character[]}
   */
  sortCharacters(characters) {
    return [...characters].sort((a, b) => {
      // statusの優先順位を定義
      const statusPriority = {
        active: 0,
        inactive: 1,
        retired: 2
      };

      // まず参加状態でソート
      const statusDiff = statusPriority[a.status] - statusPriority[b.status];
      if (statusDiff !== 0) return statusDiff;

      // 同じ状態の場合は実効DEXでソート
      return b.effectiveDex - a.effectiveDex;
    });
  }

  /**
   * 現在のキャラクターリストを取得
   * @returns {import('./types').Character[]}
   */
  getCharacters() {
    return this.characters;
  }
}
