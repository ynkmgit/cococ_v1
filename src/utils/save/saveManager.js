/**
 * セーブデータ管理クラス
 */
export class SaveManager {
  static instance = null;

  static getInstance() {
    if (!SaveManager.instance) {
      SaveManager.instance = new SaveManager();
    }
    return SaveManager.instance;
  }

  constructor() {
    if (SaveManager.instance) {
      return SaveManager.instance;
    }
    
    const savedState = sessionStorage.getItem('saveManagerState');
    if (savedState) {
      const { currentRound, currentTurn, saveCount } = JSON.parse(savedState);
      this.currentRound = currentRound;
      this.currentTurn = currentTurn;
      this.saveCount = saveCount;
    } else {
      this.currentRound = 1;
      this.currentTurn = 1;
      this.saveCount = 0;
    }
    
    SaveManager.instance = this;
  }

  persistState() {
    sessionStorage.setItem('saveManagerState', JSON.stringify({
      currentRound: this.currentRound,
      currentTurn: this.currentTurn,
      saveCount: this.saveCount
    }));
  }

  onRoundChange(newRound) {
    if (this.currentRound !== newRound) {
      console.log(`[SaveManager] Round change: ${this.currentRound} -> ${newRound}`);
      this.currentRound = newRound;
      this.currentTurn = 1;
      this.saveCount = 1;
      this.persistState();
    }
  }

  onTurnChange(newTurn) {
    if (this.currentTurn !== newTurn) {
      console.log(`[SaveManager] Turn change: ${this.currentTurn} -> ${newTurn}`);
      this.currentTurn = newTurn;
      this.saveCount = 1;
      this.persistState();
      return true;
    }
    return false;
  }

  saveGameState(characters, turnManager, isAutoSave = false) {
    const savedGames = this.getSavedGames();
    
    // アクティブキャラクターの数とアクティブキャラクターの行動済み数からターン数を計算
    const activeCharacters = turnManager.getActiveCharacters();
    const actedCharactersCount = Array.from(turnManager.actedCharacters).filter(id => 
      activeCharacters.some(char => char.id === id)
    ).length;
    const currentTurn = actedCharactersCount + 1;

    // ラウンドとターンの変更を検知
    const turnChanged = this.onTurnChange(currentTurn);
    const roundChanged = this.currentRound !== turnManager.round;

    // ラウンドの変更も処理
    if (roundChanged) {
      this.onRoundChange(turnManager.round);
    }

    // 自動保存の場合、ターンが変更されていない場合は保存をスキップ
    if (isAutoSave && !turnChanged && !roundChanged) {
      return null;
    }

    // 保存回数の更新（手動保存の場合のみ）
    if (!isAutoSave) {
      this.saveCount++;
      this.persistState();
    }

    console.log(`[SaveManager] Saving state - Round: ${turnManager.round}, Turn: ${currentTurn}, Auto: ${isAutoSave}`);
    console.log('[SaveManager] Current saves:', savedGames);

    const saveData = {
      id: `${this.currentRound}_${this.currentTurn}_${isAutoSave ? 1 : this.saveCount}`,
      name: `Round ${this.currentRound} - Turn ${this.currentTurn} - Save ${this.saveCount}`,
      characters,
      round: turnManager.round,
      turnState: {
        currentCharacterIndex: turnManager.currentCharacterIndex,
        actedCharacters: Array.from(turnManager.actedCharacters),
        commandCompletedCharacters: Array.from(turnManager.commandCompletedCharacters || [])
      }
    };

    console.log(`[SaveManager] Creating save: ${saveData.id}`);

    // 自動保存の場合は既存の同じターンのデータを更新
    const existingIndex = isAutoSave
      ? savedGames.findIndex(save => save.id.startsWith(`${this.currentRound}_${this.currentTurn}_`))
      : -1;

    if (existingIndex !== -1) {
      savedGames[existingIndex] = saveData;
    } else {
      savedGames.push(saveData);
    }

    sessionStorage.setItem('savedGames', JSON.stringify(savedGames));
    return saveData;
  }

  loadGameState(saveId) {
    const savedGames = this.getSavedGames();
    const saveData = savedGames.find(save => save.id === saveId);

    if (saveData) {
      const [round, turn, count] = saveId.split('_').map(Number);
      this.currentRound = round;
      this.currentTurn = turn;
      this.saveCount = count;
      this.persistState();
    }

    return saveData;
  }

  getLatestSaveData() {
    const savedGames = this.getSavedGames();
    if (savedGames.length === 0) return null;

    return savedGames[savedGames.length - 1];
  }

  getSavedGames() {
    const savedGames = sessionStorage.getItem('savedGames');
    return savedGames ? JSON.parse(savedGames) : [];
  }

  clearAllSaves() {
    sessionStorage.removeItem('savedGames');
    sessionStorage.removeItem('saveManagerState');
    this.currentRound = 1;
    this.currentTurn = 1;
    this.saveCount = 0;
    this.persistState();
  }
}