// ゲーム進行関連のユーティリティ関数
export const validateRound = (round) => {
  return Math.max(1, round);
};

export const formatRound = (round) => {
  return round.toString().padStart(2, '0');
};