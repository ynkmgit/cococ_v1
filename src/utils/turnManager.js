/**
 * ターン管理クラス
 */
export class TurnManager {
  /**
   * @param {import('./types').Character[]} characters - キャラクターリスト
   */
  constructor(characters = []) {
    this.characters = characters;
    this.currentCharacterIndex = 0;
    this.round = 1;
    this.actedCharacters = new Set();
    this.commandCompletedCharacters = new Set();

    // インスタンス化時に適切なインデックスを設定
    this.updateCurrentCharacterIndex();
  }

  /**
   * アクティブなキャラクターのみを取得し、実効DEXで降順ソート
   * @returns {import('./types').Character[]}
   */
  getActiveCharacters() {
    return this.characters
      .filter(char => char.status === 'active')
      .sort((a, b) => b.effectiveDex - a.effectiveDex);
  }

  /**
   * 次の行動可能なキャラクターのリストを取得
   * @returns {import('./types').Character[]}
   */
  getNextActionableCharacters() {
    return this.characters
      .filter(char =>
        char.status === 'active' &&
        !this.actedCharacters.has(char.id))
      .sort((a, b) => b.effectiveDex - a.effectiveDex);
  }

  /**
   * 現在のキャラクターIDを取得
   * @returns {number|null}
   */
  getCurrentCharacterId() {
    const activeChars = this.getActiveCharacters();
    if (this.currentCharacterIndex >= 0 && this.currentCharacterIndex < activeChars.length) {
      return activeChars[this.currentCharacterIndex].id;
    }
    return null;
  }

  /**
   * 現在のキャラクターを取得
   * @returns {import('./types').Character|null}
   */
  getCurrentCharacter() {
    const activeChars = this.getActiveCharacters();
    if (this.currentCharacterIndex >= 0 && this.currentCharacterIndex < activeChars.length) {
      return activeChars[this.currentCharacterIndex];
    }
    return null;
  }

  /**
   * 現在のキャラクターインデックスを更新
   */
  updateCurrentCharacterIndex() {
    const activeChars = this.getActiveCharacters();
    if (activeChars.length === 0) {
      this.reset();
      return;
    }

    const actionableChars = this.getNextActionableCharacters();

    if (actionableChars.length === 0) {
      if (activeChars.length > 0) {
        this.round++;
        this.actedCharacters.clear();
        this.commandCompletedCharacters.clear();
        this.updateCurrentCharacterIndex();
        return;
      } else {
        this.reset();
        return;
      }
    }

    const nextCharacter = actionableChars[0];
    this.currentCharacterIndex = activeChars.findIndex(char => char.id === nextCharacter.id);
  }

  /**
   * キャラクターのコマンド完了状態を設定
   * @param {number} characterId - キャラクターID
   * @param {boolean} completed - 完了状態
   */
  setCommandCompleted(characterId, completed = true) {
    if (completed) {
      this.commandCompletedCharacters.add(characterId);
    } else {
      this.commandCompletedCharacters.delete(characterId);
    }
  }

  /**
   * 現在のキャラクターのコマンドが完了しているか確認
   * @returns {boolean}
   */
  isCurrentCharacterCommandCompleted() {
    const currentChar = this.getCurrentCharacter();
    return currentChar ? this.commandCompletedCharacters.has(currentChar.id) : false;
  }

  /**
   * 次のキャラクターに進む
   * @returns {{ currentCharacterIndex: number, round: number, actedCharacters: Set<number> }}
   */
  nextTurn() {
    const currentChar = this.getCurrentCharacter();
    if (!currentChar || !this.commandCompletedCharacters.has(currentChar.id)) {
      return this.getCurrentState();
    }

    const activeCharacters = this.getActiveCharacters();
    if (activeCharacters.length === 0) {
      this.reset();
      return this.getCurrentState();
    }

    if (this.currentCharacterIndex >= 0 && this.currentCharacterIndex < activeCharacters.length) {
      const currentCharId = currentChar.id;
      this.actedCharacters.add(currentCharId);
      this.commandCompletedCharacters.delete(currentCharId);
    }

    this.updateCurrentCharacterIndex();
    return this.getCurrentState();
  }

  /**
   * キャラクターの状態変更時に呼び出す
   * @param {import('./types').Character} character - 状態が変更されたキャラクター
   */
  onCharacterStatusChange(character) {
    if (character.status !== 'active' && this.actedCharacters.has(character.id)) {
      this.actedCharacters.delete(character.id);
      this.commandCompletedCharacters.delete(character.id);
    }
    this.updateCurrentCharacterIndex();
  }

  /**
   * 現在の状態を取得
   * @returns {{ currentCharacterIndex: number, round: number, actedCharacters: Set<number> }}
   */
  getCurrentState() {
    if (this.getActiveCharacters().length === 0) {
      return {
        currentCharacterIndex: 0,
        round: 1,
        actedCharacters: new Set()
      };
    }

    return {
      currentCharacterIndex: this.currentCharacterIndex,
      round: this.round,
      actedCharacters: this.actedCharacters
    };
  }

  /**
   * ゲーム状態をリセット
   */
  reset() {
    this.currentCharacterIndex = 0;
    this.round = 1;
    this.actedCharacters.clear();
    this.commandCompletedCharacters.clear();
  }
}