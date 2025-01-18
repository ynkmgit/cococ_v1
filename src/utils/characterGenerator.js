/**
 * ランダムなキャラクター名を生成
 * @returns {string}
 */
const generateRandomName = () => {
  const prefixes = ['戦士', '冒険者', '放浪者', '傭兵', '旅人', '商人', '騎士', '盗賊', '狩人', '流浪人'];
  const suffixes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix}${suffix}`;
};

/**
 * 範囲内のランダムな数値を生成
 * @param {number} min 最小値
 * @param {number} max 最大値
 * @returns {number}
 */
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * ランダムなキャラクターを生成
 * @returns {Omit<import('./types').Character, 'id' | 'effectiveDex'>}
 */
export const generateRandomCharacter = () => {
  const dex = getRandomNumber(30, 70);
  const maxHP = getRandomNumber(30, 100);

  return {
    name: generateRandomName(),
    dex,
    useGun: Math.random() > 0.7, // 30%の確率で火器所持
    currentHP: maxHP,
    maxHP,
    status: 'active'
  };
};
