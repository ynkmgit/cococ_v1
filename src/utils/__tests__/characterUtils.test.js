import { calculateHPPercentage, validateCharacter } from '../characterUtils';

describe('calculateHPPercentage', () => {
  it('正しいHP割合を計算すること', () => {
    expect(calculateHPPercentage(50, 100)).toBe(50);
    expect(calculateHPPercentage(75, 100)).toBe(75);
    expect(calculateHPPercentage(0, 100)).toBe(0);
    expect(calculateHPPercentage(100, 100)).toBe(100);
  });

  it('最大HPが0の場合は0を返すこと', () => {
    expect(calculateHPPercentage(0, 0)).toBe(0);
    expect(calculateHPPercentage(50, 0)).toBe(0);
  });
});

describe('validateCharacter', () => {
  it('有効なキャラクターの場合、エラーが空であること', () => {
    const character = {
      name: 'テスト',
      currentHP: 80,
      maxHP: 100
    };
    expect(validateCharacter(character)).toEqual({});
  });

  it('名前が空の場合、エラーを返すこと', () => {
    const character = {
      name: '',
      currentHP: 80,
      maxHP: 100
    };
    const errors = validateCharacter(character);
    expect(errors.name).toBe('キャラクター名を入力してください');
  });

  it('現在HPが負の値の場合、エラーを返すこと', () => {
    const character = {
      name: 'テスト',
      currentHP: -10,
      maxHP: 100
    };
    const errors = validateCharacter(character);
    expect(errors.currentHP).toBe('現在HPは0以上である必要があります');
  });

  it('最大HPが負の値の場合、エラーを返すこと', () => {
    const character = {
      name: 'テスト',
      currentHP: 80,
      maxHP: -10
    };
    const errors = validateCharacter(character);
    expect(errors.maxHP).toBe('最大HPは0以上である必要があります');
  });

  it('現在HPが最大HPを超える場合、エラーを返すこと', () => {
    const character = {
      name: 'テスト',
      currentHP: 150,
      maxHP: 100
    };
    const errors = validateCharacter(character);
    expect(errors.currentHP).toBe('現在HPは最大HPを超えることはできません');
  });
});