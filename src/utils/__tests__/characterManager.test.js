import { CharacterManager } from '../characterManager';

describe('CharacterManager', () => {
  const mockCharacters = [
    {
      id: 1,
      name: 'Character 1',
      dex: 50,
      useGun: true,
      currentHP: 100,
      maxHP: 100,
      status: 'active'
    },
    {
      id: 2,
      name: 'Character 2',
      dex: 40,
      useGun: false,
      currentHP: 80,
      maxHP: 100,
      status: 'active'
    }
  ];

  it('キャラクターの初期化と実効DEXの計算が正しく行われること', () => {
    const manager = new CharacterManager(mockCharacters);
    const characters = manager.getCharacters();
    
    expect(characters[0].effectiveDex).toBe(100);
    expect(characters[1].effectiveDex).toBe(40);
  });

  it('キャラクターが実効DEX順にソートされること', () => {
    const manager = new CharacterManager(mockCharacters);
    const characters = manager.getCharacters();
    
    expect(characters[0].id).toBe(1);
    expect(characters[1].id).toBe(2);
  });

  it('キャラクターの追加が正しく動作すること', () => {
    const manager = new CharacterManager();
    const newCharacter = {
      name: 'New Character',
      dex: 60,
      useGun: true,
      currentHP: 90,
      maxHP: 90
    };

    const characters = manager.addCharacter(newCharacter);
    expect(characters[0].name).toBe('New Character');
    expect(characters[0].effectiveDex).toBe(120);
    expect(characters[0].status).toBe('active');
  });

  it('キャラクターの更新が正しく動作すること', () => {
    const manager = new CharacterManager(mockCharacters);
    const updated = manager.updateCharacter(1, { dex: 60 });
    
    expect(updated[0].dex).toBe(60);
    expect(updated[0].effectiveDex).toBe(120);
  });

  it('キャラクターの削除が正しく動作すること', () => {
    const manager = new CharacterManager(mockCharacters);
    const remaining = manager.removeCharacter(1);
    
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe(2);
  });

  it('参加状態の切り替えが正しく動作すること', () => {
    const manager = new CharacterManager(mockCharacters);
    const updated = manager.toggleCharacterStatus(1);
    
    expect(updated.find(c => c.id === 1).status).toBe('inactive');
    // 非参加キャラクターは後ろにソートされる
    expect(updated[0].id).toBe(2);
  });

  it('参加状態によるソートが正しく動作すること', () => {
    const mixedCharacters = [
      { ...mockCharacters[0], status: 'inactive' },
      { ...mockCharacters[1], status: 'active' }
    ];
    const manager = new CharacterManager(mixedCharacters);
    const sorted = manager.getCharacters();
    
    expect(sorted[0].id).toBe(2); // activeなキャラクターが先頭に
    expect(sorted[1].id).toBe(1);
  });
});
