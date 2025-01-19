export class TurnManager {
  constructor(characters = []) {
    this.characters = characters;
    this.round = 1;  // ラウンド数の初期値を1に
    this.currentTurn = 0;
    this.actedCharacters = new Set();
    this.commandCompletedCharacters = new Set();
    this.turnCount = 1;  // ターン数の初期値を1に追加
  }

  nextTurn() {
    const currentCharacter = this.getCurrentCharacter();
    if (currentCharacter) {
      this.actedCharacters.add(currentCharacter.id);
    }

    // 全キャラクターが行動済みの場合
    if (this.isAllCharactersActed()) {
      this.round += 1;  // ラウンドを進める
      this.actedCharacters.clear();
      this.commandCompletedCharacters.clear();
      this.currentTurn = 0;
    } else {
      this.currentTurn++;
      this.turnCount++;  // ターン数をインクリメント
    }

    this.updateCurrentTurn();
  }

  getCurrentCharacter() {
    return this.characters[this.currentTurn] || null;
  }

  getCurrentState() {
    return {
      round: this.round,
      currentTurn: this.currentTurn,
      actedCharacters: this.actedCharacters
    };
  }

  isCurrentCharacterCommandCompleted() {
    const currentCharacter = this.getCurrentCharacter();
    return currentCharacter ? this.commandCompletedCharacters.has(currentCharacter.id) : false;
  }

  setCommandCompleted(characterId, completed) {
    if (completed) {
      this.commandCompletedCharacters.add(characterId);
    } else {
      this.commandCompletedCharacters.delete(characterId);
    }
  }

  // ターン数を取得するメソッドを追加
  getTurnCount() {
    return this.turnCount;
  }

  // 状態を復元するメソッドを追加
  restoreState(savedState) {
    if (savedState.round) this.round = savedState.round;
    if (savedState.currentTurn) this.currentTurn = savedState.currentTurn;
    if (savedState.turnCount) this.turnCount = savedState.turnCount;
    if (savedState.actedCharacters) {
      this.actedCharacters = new Set(savedState.actedCharacters);
    }
    if (savedState.commandCompletedCharacters) {
      this.commandCompletedCharacters = new Set(savedState.commandCompletedCharacters);
    }
  }

  isAllCharactersActed() {
    return this.characters.every(character => 
      this.actedCharacters.has(character.id) || 
      character.status === 'retired'
    );
  }

  updateCurrentTurn() {
    while (
      this.currentTurn < this.characters.length && 
      (this.actedCharacters.has(this.characters[this.currentTurn]?.id) || 
       this.characters[this.currentTurn]?.status === 'retired')
    ) {
      this.currentTurn++;
    }
  }

  onCharacterStatusChange(character) {
    if (character.status === 'retired') {
      this.updateCurrentTurn();
    }
  }
}