/**
 * セッションストレージへのデータ保存を行うユーティリティ関数
 */

/**
 * データをセッションストレージに保存
 * @param {string} key - 保存するデータのキー
 * @param {any} data - 保存するデータ（JSON.stringify可能なもの）
 */
export const saveToStorage = (key, data) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to sessionStorage:', error);
  }
};

/**
 * セッションストレージからデータを読み込み
 * @param {string} key - 読み込むデータのキー
 * @returns {any|null} 保存されていたデータ、またはnull
 */
export const loadFromStorage = (key) => {
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load from sessionStorage:', error);
    return null;
  }
};
