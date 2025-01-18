import { validateRound, formatRound } from '../gameUtils';

describe('validateRound', () => {
  it('正の数の場合はそのまま返すこと', () => {
    expect(validateRound(5)).toBe(5);
    expect(validateRound(10)).toBe(10);
    expect(validateRound(100)).toBe(100);
  });

  it('1未満の数値の場合は1を返すこと', () => {
    expect(validateRound(0)).toBe(1);
    expect(validateRound(-1)).toBe(1);
    expect(validateRound(-100)).toBe(1);
  });
});

describe('formatRound', () => {
  it('1桁の数字は2桁にゼロ埋めされること', () => {
    expect(formatRound(1)).toBe('01');
    expect(formatRound(5)).toBe('05');
    expect(formatRound(9)).toBe('09');
  });

  it('2桁以上の数字はそのまま文字列化されること', () => {
    expect(formatRound(10)).toBe('10');
    expect(formatRound(42)).toBe('42');
    expect(formatRound(100)).toBe('100');
  });
});