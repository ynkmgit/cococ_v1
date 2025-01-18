import { generateRandomCharacter } from '../characterGenerator';

describe('characterGenerator', () => {
  it('ランダムキャラクターが適切な形式で生成されること', () => {
    const character = generateRandomCharacter();

    // 必須プロパティの存在チェック
    expect(character).toHaveProperty('name');
    expect(character).toHaveProperty('dex');
    expect(character).toHaveProperty('useGun');
    expect(character).toHaveProperty('currentHP');
    expect(character).toHaveProperty('maxHP');
    expect(character).toHaveProperty('status');

    // 値の範囲チェック
    expect(character.dex).toBeGreaterThanOrEqual(30);
    expect(character.dex).toBeLessThanOrEqual(70);
    expect(character.maxHP).toBeGreaterThanOrEqual(30);
    expect(character.maxHP).toBeLessThanOrEqual(100);
    expect(character.currentHP).toBe(character.maxHP);
    expect(character.status).toBe('active');
    expect(typeof character.useGun).toBe('boolean');
    expect(typeof character.name).toBe('string');
    expect(character.name.length).toBeGreaterThan(0);
  });

  it('複数回生成で異なるキャラクターが生成されること', () => {
    const character1 = generateRandomCharacter();
    const character2 = generateRandomCharacter();
    const character3 = generateRandomCharacter();

    // 少なくとも1つのプロパティが異なることを確認
    const allSame = 
      character1.name === character2.name && 
      character2.name === character3.name &&
      character1.dex === character2.dex &&
      character2.dex === character3.dex &&
      character1.maxHP === character2.maxHP &&
      character2.maxHP === character3.maxHP;

    expect(allSame).toBe(false);
  });
});