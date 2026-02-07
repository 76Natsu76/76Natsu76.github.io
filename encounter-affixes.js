// encounter-affixes.js

export const ENCOUNTER_AFFIXES = {
  enraged: {
    text: "Enemies deal +20% damage",
    apply(enemy) {
      enemy.atk = Math.floor(enemy.atk * 1.20);
    }
  },

  thick_skinned: {
    text: "Enemies gain +25% defense",
    apply(enemy) {
      enemy.def = Math.floor(enemy.def * 1.25);
    }
  },

  stormforged: {
    text: "Enemies gain +15% lightning damage",
    apply(enemy) {
      enemy.element = "lightning";
      enemy.atk = Math.floor(enemy.atk * 1.15);
    }
  },

  vampiric: {
    text: "Enemies heal for 10% of damage dealt",
    apply(enemy) {
      enemy.vampiric = 0.10;
    }
  }
};

export function rollEncounterAffixes(count = 1) {
  const keys = Object.keys(ENCOUNTER_AFFIXES);
  const chosen = [];

  for (let i = 0; i < count; i++) {
    const key = keys[Math.floor(Math.random() * keys.length)];
    chosen.push(key);
  }

  return chosen;
}

export function applyAffixesToEncounter(encounter, affixKeys) {
  encounter.affixes = affixKeys.map(k => ENCOUNTER_AFFIXES[k].text);

  for (const enemy of encounter.enemies) {
    for (const key of affixKeys) {
      ENCOUNTER_AFFIXES[key].apply(enemy);
    }
  }

  return encounter;
}
