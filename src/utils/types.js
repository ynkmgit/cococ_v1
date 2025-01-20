/**
 * @typedef {'重症'|'転倒'|'潜在狂気'|'狂気発作'|'意識不明'|'拘束'} CharacterCondition
 */

/**
 * @typedef {Object} Character
 * @property {number} id - キャラクターの一意のID
 * @property {string} name - キャラクター名
 * @property {number} dex - 基本DEX値
 * @property {boolean} useGun - 火器使用の有無
 * @property {number} currentHP - 現在のHP
 * @property {number} maxHP - 最大HP
 * @property {number} effectiveDex - 計算済みの実効DEX
 * @property {('active'|'inactive'|'retired'|'fallen'|'latentInsanity'|'insanityAttack'|'unconscious'|'bound')} status - キャラクターの状態
 * @property {boolean} isFallen - 転倒状態か
 * @property {boolean} hasLatentInsanity - 潜在狂気状態か
 * @property {boolean} inInsanityAttack - 狂気発作中か
 * @property {boolean} isUnconscious - 意識不明状態か
 * @property {boolean} isBound - 拘束状態か
 */
