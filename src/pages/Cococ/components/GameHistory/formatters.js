export const historyFormatters = {
  round: (data) => ({
    icon: '🔄',
    text: `ラウンド${data.round}開始`,
  }),
  
  turn: (data) => ({
    icon: '👉',
    text: `${data.characterName}のターン`,
  }),
  
  command: (data) => {
    const configs = {
      attack: {
        icon: '⚔️',
        format: (d) => ({
          text: `${d.attacker}の攻撃`,
          details: `→ ${d.defender} (${d.result})`
        })
      },
      shoot: {
        icon: '🔫',
        format: (d) => ({
          text: `${d.attacker}の射撃`,
          details: `→ ${d.defender} (${d.result})`
        })
      },
      maneuver: {
        icon: '🔄',
        format: (d) => ({
          text: `${d.attacker}のマヌーバー`,
          details: `→ ${d.defender} (${d.result})`
        })
      },
      retire: {
        icon: '🚪',
        format: (d) => ({
          text: `${d.character}が離脱`
        })
      }
    };

    const config = configs[data.commandType];
    if (!config) {
      return {
        icon: '❓',
        text: 'Unknown command',
      };
    }

    const formatted = config.format(data);
    return {
      icon: config.icon,
      ...formatted
    };
  },

  hp: (data) => ({
    icon: '❤️',
    text: `${data.characterName}のHP変更`,
    details: `${data.oldValue} → ${data.newValue}`
  }),

  rollback: (data) => ({
    icon: '↩️',
    text: `${data.characterName}の行動をやり直し`,
  })
};