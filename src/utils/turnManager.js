/**
 * ターン管理クラス
 */
export class TurnManager {
  /**
   * @param {import('./types').Character[]} characters - キャラクターリスト
   */
  constructor(characters = []) {
    this.characters = characters;
    
    // localStorageから状態を復元
    const savedState = localStorage.getItem('turnState');
    if (savedState) {
      const { currentTurn, round, actedCharactersArray, commandCompletedCharactersArray } = JSON.parse(savedState);
      this.currentTurn = currentTurn;
      this.round = round;
      this.actedCharacters = new Set(actedCharactersArray);
      this.commandCompletedCharacters = new Set(commandCompletedCharactersArray);
    } else {
      this.currentTurn = 0;
      this.round = 1;
      this.actedCharacters = new Set();
      this.commandCompletedCharacters = new Set();
    }

    // インスタンス化時に適切なターンを設定
    this.updateCurrentTurn();
  }

  /**
   * アクティブなキャラクターのみを取得し、実効DEXで降順ソート
   * @returns {import('./types').Character[]}
   */
  getActiveCharacters() {
    // 行動済みのキャラクターは除外せず、純粋にアクティブなキャラクターを実効DEX順にソート
    return this.characters
      .filter(char => char.status === 'active')
      .sort((a, b) => b.effectiveDex - a.effectiveDex);
  }

  /**
   * 次の行動可能なキャラクターのリストを取得
   * @returns {import('./types').Character[]}
   */
  getNextActionableCharacters() {
    // 行動可能なキャラクター（アクティブかつ未行動）のみを実効DEX順にソート
    return this.characters
      .filter(char => 
        char.status === 'active' && 
        !this.actedCharacters.has(char.id))
      .sort((a, b) => b.effectiveDex - a.effectiveDex);
  }

  /**
   * 現在のターンのキャラクターIDを取得
   * @returns {number|null}
   */
  getCurrentCharacterId() {
    const activeChars = this.getActiveCharacters();
    if (this.currentTurn >= 0 && this.currentTurn < activeChars.length) {
      return activeChars[this.currentTurn].id;
    }
    return null;
  }

  /**
   * 現在のターンのキャラクターを取得
   * @returns {import('./types').Character|null}
   */
  getCurrentCharacter() {
    const activeChars = this.getActiveCharacters();
    if (this.currentTurn >= 0 && this.currentTurn < activeChars.length) {
      return activeChars[this.currentTurn];
    }
    return null;
  }

  /**
   * 現在のターンを更新
   * 行動済みでないアクティブキャラクターの中で最も実効DEXが高いキャラクターのターンにする
   */
  updateCurrentTurn() {
    const activeChars = this.getActiveCharacters();
    if (activeChars.length === 0) {
      this.reset();
      return;
    }

    // 行動可能なキャラクターを取得
    const actionableChars = this.getNextActionableCharacters();
    
    if (actionableChars.length === 0) {
      if (activeChars.length > 0) {
        // アクティブなキャラクターがいる場合は次のラウンドへ
        this.round++;
        this.actedCharacters.clear();
        this.commandCompletedCharacters.clear();
        this.updateCurrentTurn();
        return;
      } else {
        this.reset();
        return;
      }
    }

    // 次の行動キャラクターを、アクティブキャラクター配列のインデックスとして設定
    const nextCharacter = actionableChars[0];
    this.currentTurn = activeChars.findIndex(char => char.id === nextCharacter.id);
    
    this.saveState();
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
    this.saveState();
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
   * 状態を永続化
   */
  saveState() {
    const state = {
      currentTurn: this.currentTurn,
      round: this.round,
      actedCharactersArray: Array.from(this.actedCharacters),
      commandCompletedCharactersArray: Array.from(this.commandCompletedCharacters)
    };
    localStorage.setItem('turnState', JSON.stringify(state));
  }

  /**
   * 次のターンに進む
   * @returns {{ currentTurn: number, round: number, actedCharacters: Set<number> }}
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

    // 現在のキャラクターを行動済みにする
    if (this.currentTurn >= 0 && this.currentTurn < activeCharacters.length) {
      const currentCharId = currentChar.id;
      this.actedCharacters.add(currentCharId);
      this.commandCompletedCharacters.delete(currentCharId);  // コマンド完了状態をリセット
    }

    // 次の行動可能なキャラクターを探す
    this.updateCurrentTurn();
    
    return this.getCurrentState();
  }

  /**
   * キャラクターの状態変更時に呼び出す
   * @param {import('./types').Character} character - 状態が変更されたキャラクター
   */
  onCharacterStatusChange(character) {
    // inactiveまたはretiredになった場合、行動済みリストから削除
    if (character.status !== 'active' && this.actedCharacters.has(character.id)) {
      this.actedCharacters.delete(character.id);
      this.commandCompletedCharacters.delete(character.id);  // コマンド完了状態もリセット
    }
    this.updateCurrentTurn();
    this.saveState();
  }

  /**
   * 現在のターン情報を取得
   * @returns {{ currentTurn: number, round: number, actedCharacters: Set<number> }}
   */
  getCurrentState() {
    // アクティブキャラクターがいない場合は初期状態を返す
    if (this.getActiveCharacters().length === 0) {
      return {
        currentTurn: 0,
        round: 1,
        actedCharacters: new Set()
      };
    }

    return {
      currentTurn: this.currentTurn,
      round: this.round,
      actedCharacters: this.actedCharacters
    };
  }

  /**
   * ゲーム状態をリセット
   */
  reset() {
    this.currentTurn = 0;
    this.round = 1;
    this.actedCharacters.clear();
    this.commandCompletedCharacters.clear();
    this.saveState();
  }
}