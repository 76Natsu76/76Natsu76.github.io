export function selectAbilitiesForEnemy(enemy, abilityPool) {
  const prof = enemy.profession;
  const elem = enemy.element;
  const sub = enemy.subrace;
  const variant = enemy.variant;
  const behaviors = enemy.flavorTags || [];

  const weighted = [];

  for (const ability of abilityPool) {
    let weight = 1;

    // Profession affinity
    if (ability.roleAffinity?.includes(PROFESSION_IDENTITY[prof]?.role)) {
      weight += 3;
    }

    // Element affinity
    if (ability.element === elem) {
      weight += 2;
    }

    // Behavior affinity
    if (ability.behaviorAffinity?.some(b => behaviors.includes(b))) {
      weight += 2;
    }

    // Variant affinity
    if (ability.variantAffinity?.includes(variant)) {
      weight += 2;
    }

    // Subrace passives (optional)
    if (SUBRACE_IDENTITY[sub]?.abilityBias?.includes(ability.key)) {
      weight += 2;
    }

    weighted.push({ ability, weight });
  }

  // Pick 2–4 abilities based on weights
  const selected = [];
  for (let i = 0; i < 3; i++) {
    const pick = weightedPick(weighted);
    if (pick) selected.push(pick);
  }

  return selected;
}

function weightedPick(list) {
  const total = list.reduce((sum, x) => sum + x.weight, 0);
  let roll = Math.random() * total;
  for (const item of list) {
    if ((roll -= item.weight) <= 0) return item.ability;
  }
  return null;
}
