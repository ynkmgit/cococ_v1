class GameEventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  emit(eventName, data) {
    const listeners = this.listeners.get(eventName) || [];
    listeners.forEach(callback => callback(data));

    // '*' リスナーにも通知
    const wildcardListeners = this.listeners.get('*') || [];
    wildcardListeners.forEach(callback => callback({ type: eventName, data }));
  }

  subscribe(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName).push(callback);

    // アンサブスクライブ用の関数を返す
    return () => {
      const listeners = this.listeners.get(eventName);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }
}

export default new GameEventEmitter();