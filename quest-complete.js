// quest-complete.js

export function checkQuestCompletion(player) {
  const completed = [];

  for (const quest of player.quests.active) {
    const template = QUEST_TEMPLATES[quest.template];
    let done = true;

    for (const obj of template.objectives) {
      const key = obj.item || obj.enemyTag || obj.action;
      const required = obj.amount ?? 1;
      const current = quest.progress[key] || 0;

      if (current < required) {
        done = false;
        break;
      }
    }

    if (done) completed.push(quest);
  }

  for (const quest of completed) {
    finishQuest(player, quest);
  }
}

function finishQuest(player, quest) {
  const template = QUEST_TEMPLATES[quest.template];

  // Rewards
  player.gold += template.rewards.gold || 0;
  player.exp += template.rewards.exp || 0;

  // Move to completed
  player.quests.active = player.quests.active.filter(q => q.id !== quest.id);
  player.quests.completed.push(quest);
}
