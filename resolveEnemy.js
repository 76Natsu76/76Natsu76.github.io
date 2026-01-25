// resolveEnemy.js

import { REGION_MODIFIERS } from "./world-simulation.js";
import { PROFESSION_STAT_MODIFIERS } from "./profession-stat-modifiers.js";
import { TAG_MODIFIERS, applyTagModifiers } from "./tag-modifiers.js";
import { ELEMENT_MATRIX, applyElementalDamage } from "./element-helpers.js";
import { RARITY_MULTIPLIERS } from "./rarity-multipliers.js";
import { ENEMY_FAMILIES } from "./enemy-families.js";
import { ENEMY_VARIANTS } from "./enemy-variants.js";
import { ABILITY_DEFINITIONS } from "./ability-definitions.js";
import { ENEMY_ULTIMATES } from "./enemy-ultimates.js";
import { chooseBossActionV3, chooseEnemyActionV3 } from "./enemy-ai.js";

export function resolveEnemy(raw, regionKey, tier) {
  const familyId = raw.family || "unknown";
  const family = ENEMY_FAMILIES[familyId] || {};
  const famMods = family.familyModifiers || {};
  const rarity = raw.rarity || "common";
  const rarityData = RARITY_MULTIPLIERS[rarity] || {};
  const tags = raw.tags || [];
  const variant = tags.find(t => ENEMY_VARIANTS[t]) || null;
  const v = variant ? ENEMY_VARIANTS[variant] : null;
  const prof = raw.profession || null;
  const profStats = prof && PROFESSION_STAT_MODIFIERS[prof] ? PROFESSION_STAT_MODIFIERS[prof] : {};
  const regionMods = REGION_MODIFIERS[regionKey] || {
    hpMult: 1,
    atkMult: 1,
    defMult: 1,
    speedMult: 1,
    elementAffinity: {}
  };
  const level = raw.level || 1;

  let hpMax = raw.baseHP || 1;
  let atk = raw.baseATK || 1;
  let def = raw.baseDEF || 0;
  let speed = raw.speed || Math.max(5, Math.floor(level * 0.2));

  if (famMods.hp) hpMax = Math.floor(hpMax * famMods.hp);
  if (famMods.atk) atk = Math.floor(atk * famMods.atk);
  if (famMods.def) def = Math.floor(def * famMods.def);

  if (rarityData.hpMult) hpMax = Math.floor(hpMax * rarityData.hpMult);
  if (rarityData.atkMult) atk = Math.floor(atk * rarityData.atkMult);
  if (rarityData.defMult) def = Math.floor(def * rarityData.defMult);

  if (v && v.hpMult) hpMax = Math.floor(hpMax * v.hpMult);
  if (v && v.atkMult) atk = Math.floor(atk * v.atkMult);
  if (v && v.defMult) def = Math.floor(def * v.defMult);
  if (v && v.speedMult) speed = Math.floor(speed * v.speedMult);

  if (profStats.hpMult) hpMax = Math.floor(hpMax * profStats.hpMult);
  if (profStats.atkMult) atk = Math.floor(atk * profStats.atkMult);
  if (profStats.defMult) def = Math.floor(def * profStats.defMult);
  if (profStats.speedMult) speed = Math.floor(speed * profStats.speedMult);

  if (regionMods.hpMult) hpMax = Math.floor(hpMax * regionMods.hpMult);
  if (regionMods.atkMult) atk = Math.floor(atk * regionMods.atkMult);
  if (regionMods.defMult) def = Math.floor(def * regionMods.defMult);
  if (regionMods.speedMult) speed = Math.floor(speed * regionMods.speedMult);

  const tagged = applyTagModifiers({ hpMax, atk, def, speed }, tags);
  hpMax = tagged.hpMax;
  atk = tagged.atk;
  def = tagged.def;
  speed = tagged.speed;

  hpMax = Math.floor(hpMax * (1 + level * 0.08));
  atk = Math.floor(atk * (1 + level * 0.06));
  def = Math.floor(def * (1 + level * 0.05));
  speed = Math.floor(speed * (1 + level * 0.02));

  const elementAffinity = {};
  if (family.elementAffinity) Object.assign(elementAffinity, family.elementAffinity);
  if (regionMods.elementAffinity) Object.assign(elementAffinity, regionMods.elementAffinity);
  if (profStats.elementAffinity) Object.assign(elementAffinity, profStats.elementAffinity);
  if (raw.element) elementAffinity[raw.element] = (elementAffinity[raw.element] || 0) + 0.1;

  const abilities = prof && ABILITY_DEFINITIONS[prof] ? Object.values(ABILITY_DEFINITIONS[prof]).filter(Boolean) : [];
  const ultimate = prof && ENEMY_ULTIMATES[prof] ? ENEMY_ULTIMATES[prof] : null;

  return {
    key: raw.key || raw.name,
    name: raw.name || raw.key,
    family: familyId,
    region: regionKey || raw.region || null,
    tier,
    rarity,
    profession: prof,
    variant,
    tags,
    level,
    elementAffinity,
    hpCurrent: hpMax,
    hpMax,
    atk,
    def,
    speed,
    abilities,
    ultimate,
    isBoss: tags.includes("boss"),
    statusEffects: [],
    cooldowns: {},
    pendingAction: null,
    currentCharge: 0,
    ultimateUses: {},
    adaptiveProfile: {
      playerHeals: 0,
      playerBuffs: 0,
      playerShields: 0,
      playerDOTsApplied: 0,
      playerCCsApplied: 0
    },
    lootContext: {
      region: regionKey || raw.region || null,
      rarity,
      family: familyId,
      profession: prof,
      variant
    },
    behaviorProfile: {
      aggression: family.aggression || 1,
      caution: family.caution || 1,
      burst: family.burst || 1,
      sustain: family.sustain || 1
    },
    isPlayer: false
  };
}
