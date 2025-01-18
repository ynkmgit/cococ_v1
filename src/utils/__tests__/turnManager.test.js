import { TurnManager } from '../turnManager';

describe('TurnManager', () => {
  let mockLocalStorage;
  const mockCharacters = [
    { id: 1, name: 'Character 1', dex: 10, effectiveDex: 10, status: 'active' },
    { id: 2, name: 'Character 2', dex: 15, effectiveDex: 15, status: 'active' },
    { id: 3, name: 'Character 3', dex: 12, effectiveDex: 12, status: 'active' }
  ];

  beforeEach(() => {
    mockLocalStorage = {
      storage: {},
      getItem: jest.fn(key => mockLocalStorage.storage[key]),
      setItem: jest.fn((key, value) => {
        mockLocalStorage.storage[key] = value;
      }),
      clear: jest.fn(() => {
        mockLocalStorage.storage = {};
      })
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
  });

  // 既存のテスト
  it('保存された状態を正しく復元すること', () => {
    const savedState = {
      currentTurn: 1,
      round: 3,
      actedCharactersArray: [1],
      commandCompletedCharactersArray: [1]
    };
    mockLocalStorage.storage.turnState = JSON.stringify(savedState);

    const manager = new TurnManager(mockCharacters);
    const state = manager.getCurrentState();

    expect(state.currentTurn).toBe(1);
    expect(state.round).toBe(3);
    expect(state.actedCharacters.has(1)).toBe(true);
  });

  it('状態が正しく保存されること', () => {
    const manager = new TurnManager(mockCharacters);
    manager.nextTurn();

    expect(mockLocalStorage.setItem).toHaveBeenCalled();
    const savedState = JSON.parse(mockLocalStorage.storage.turnState);
    expect(savedState).toHaveProperty('currentTurn');
    expect(savedState).toHaveProperty('round');
    expect(savedState).toHaveProperty('actedCharactersArray');
    expect(savedState).toHaveProperty('commandCompletedCharactersArray');
  });

  it('保存された状態がない場合は初期値を使用すること', () => {
    mockLocalStorage.storage = {};
    const manager = new TurnManager(mockCharacters);
    const state = manager.getCurrentState();

    expect(state.currentTurn).toBe(0);
    expect(state.round).toBe(1);
    expect(state.actedCharacters.size).toBe(0);
  });

  // 新しいテストケース
  describe('アクションとDEX変更の処理', () => {
    it('行動順は実効DEXの高い順であること', () => {
      const manager = new TurnManager(mockCharacters);
      const actionableChars = manager.getNextActionableCharacters();
      
      expect(actionableChars[0].id).toBe(2); // DEX 15
      expect(actionableChars[1].id).toBe(3); // DEX 12
      expect(actionableChars[2].id).toBe(1); // DEX 10
    });

    it('行動済みキャラクターは次の行動対象から除外されること', () => {
      const manager = new TurnManager(mockCharacters);
      manager.actedCharacters.add(2); // DEX 15のキャラクターを行動済みに

      const actionableChars = manager.getNextActionableCharacters();
      expect(actionableChars[0].id).toBe(3); // DEX 12
      expect(actionableChars[1].id).toBe(1); // DEX 10
      expect(actionableChars).toHaveLength(2);
    });

    it('実効DEX変更後も行動済みキャラクターは次の行動対象から除外されること', () => {
      const manager = new TurnManager(mockCharacters);
      manager.actedCharacters.add(2); // DEX 15のキャラクターを行動済みに

      // DEX変更を含む新しいキャラクターリストを設定
      const updatedCharacters = [
        { ...mockCharacters[0], effectiveDex: 20 }, // DEX上昇
        { ...mockCharacters[1] }, // 行動済み
        { ...mockCharacters[2] }
      ];
      manager.characters = updatedCharacters;

      const actionableChars = manager.getNextActionableCharacters();
      expect(actionableChars[0].id).toBe(1); // DEX 20に上昇したが未行動
      expect(actionableChars[1].id).toBe(3); // DEX 12
      expect(actionableChars).toHaveLength(2);
    });

    it('ラウンド終了時に正しく行動済み状態がリセットされること', () => {
      const manager = new TurnManager(mockCharacters);
      
      // 全キャラクターを行動済みに
      mockCharacters.forEach(char => {
        manager.actedCharacters.add(char.id);
        manager.commandCompletedCharacters.add(char.id);
      });

      manager.updateCurrentTurn(); // これによって新ラウンドが開始される

      expect(manager.round).toBe(2);
      expect(manager.actedCharacters.size).toBe(0);
      expect(manager.commandCompletedCharacters.size).toBe(0);
    });

    it('コマンド完了時に正しく次のターンに移行すること', () => {
      const manager = new TurnManager(mockCharacters);
      const currentChar = manager.getCurrentCharacter();
      
      // コマンド完了を設定
      manager.setCommandCompleted(currentChar.id, true);
      manager.nextTurn();

      expect(manager.actedCharacters.has(currentChar.id)).toBe(true);
      expect(manager.commandCompletedCharacters.has(currentChar.id)).toBe(false);
    });

    it('実効DEX変更後もアクティブキャラクターの表示順が正しいこと', () => {
      const manager = new TurnManager(mockCharacters);
      
      // DEX変更を含む新しいキャラクターリストを設定
      const updatedCharacters = [
        { ...mockCharacters[0], effectiveDex: 20 }, // DEX上昇
        { ...mockCharacters[1] },
        { ...mockCharacters[2] }
      ];
      manager.characters = updatedCharacters;

      const activeChars = manager.getActiveCharacters();
      expect(activeChars[0].id).toBe(1); // DEX 20
      expect(activeChars[1].id).toBe(2); // DEX 15
      expect(activeChars[2].id).toBe(3); // DEX 12
    });

    it('不活性化されたキャラクターが行動済みリストから除外されること', () => {
      const manager = new TurnManager(mockCharacters);
      manager.actedCharacters.add(2);
      
      // Character 2を不活性化
      const updatedCharacter = { ...mockCharacters[1], status: 'inactive' };
      manager.onCharacterStatusChange(updatedCharacter);

      expect(manager.actedCharacters.has(2)).toBe(false);
      expect(manager.commandCompletedCharacters.has(2)).toBe(false);
    });
  });

  it('リセット時に状態が保存されること', () => {
    const manager = new TurnManager(mockCharacters);
    manager.reset();

    expect(mockLocalStorage.setItem).toHaveBeenCalled();
    const savedState = JSON.parse(mockLocalStorage.storage.turnState);
    expect(savedState.currentTurn).toBe(0);
    expect(savedState.round).toBe(1);
    expect(savedState.actedCharactersArray).toHaveLength(0);
  });
});