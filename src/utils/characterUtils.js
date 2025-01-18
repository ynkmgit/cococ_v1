// キャラクター関連のユーティリティ関数
export const calculateHPPercentage = (current, max) => {
  return max > 0 ? (current / max) * 100 : 0;
};

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
  
  return errors;
};

// DEXの実効値を計算
export const calculateEffectiveDex = (dex, useGun) => {
  return useGun ? dex * 2 : dex;
};