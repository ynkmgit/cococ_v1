// キャラクター関連のユーティリティ関数
export const calculateHPPercentage = (current, max) => {
  return max > 0 ? (current / max) * 100 : 0;
};

// DEXの実効値を計算
export const calculateEffectiveDex = (dex, useGun) => {
  return useGun ? dex * 2 : dex;
};

// 転倒状態のチェック
export const isFallen = (character) => {
  return character.isFallen || character.status === 'fallen';
};

// 転倒状態の設定
export const setFallen = (character, isFallen) => {
  return {
    ...character,
    isFallen,
    status: isFallen ? 'fallen' : 'active'
  };
};

// 潜在狂気のチェック
export const hasLatentInsanity = (character) => {
  return character.hasLatentInsanity || character.status === 'latentInsanity';
};

// 潜在狂気の設定
export const setLatentInsanity = (character, hasLatentInsanity) => {
  return {
    ...character,
    hasLatentInsanity,
    status: hasLatentInsanity ? 'latentInsanity' : 'active'
  };
};

// 狂気発作のチェック
export const inInsanityAttack = (character) => {
  return character.inInsanityAttack || character.status === 'insanityAttack';
};

// 狂気発作の設定
export const setInsanityAttack = (character, inInsanityAttack) => {
  return {
    ...character,
    inInsanityAttack,
    status: inInsanityAttack ? 'insanityAttack' : 'active'
  };
};

// 意識不明状態のチェック
export const isUnconscious = (character) => {
  return character.isUnconscious || character.status === 'unconscious';
};

// 意識不明状態の設定
export const setUnconscious = (character, isUnconscious) => {
  return {
    ...character,
    isUnconscious,
    status: isUnconscious ? 'unconscious' : 'active'
  };
};

// 状態のバリデーションを更新
export const validateCharacter = (character) => {
  const errors = {};

  if (!character.name.trim()) {
    errors.name = 'キャラクター名を入力してください';
  }

  if (character.currentHP < 0) {
    errors.currentHP = '現在HPは0以上である必要があります';
  }

  if (character.maxHP < 0) {
    errors.maxHP = '最大HPは0以上である必要があります';
  }

  if (character.currentHP > character.maxHP) {
    errors.currentHP = '現在HPは最大HPを超えることはできません';
  }

  if (character.dex < 0) {
    errors.dex = 'DEXは0以上である必要があります';
  }

  // 新しい状態のバリデーション
  if (character.isFallen && character.isUnconscious) {
    errors.status = '転倒状態と意識不明状態は同時に発生しません';
  }

  if (character.inInsanityAttack && !character.hasLatentInsanity) {
    errors.status = '狂気発作は潜在狂気状態でのみ発生します';
  }

  return errors;
};
