// quest-progress.js

export function updateQuestProgress(player, event) {
  for (const quest of player.quests.active) {
    const template = QUEST_TEMPLATES[quest.template];
    if (!template) continue;

    for (const obj of template.objectives) {
      // Hunt objective
      if (obj.enemyTag && event.type === "enemy_killed" && event.tags.includes(obj.enemyTag)) {
        quest.progress[obj.enemyTag] = (quest.progress[obj.enemyTag] || 0) + 1;
      }

      // Gather objective
      if (obj.item && event.type === "item_gathered" && event.item === obj.item) {
        quest.progress[obj.item] = (quest.progress[obj.item] || 0) + 1;
      }

      // Action objective
      if (obj.action && event.type === obj.action) {
        quest.progress[obj.action] = 1;
      }
    }
  }
}
