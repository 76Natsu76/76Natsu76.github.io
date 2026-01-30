/************************************************************
 * resolveEnemy.js — GitHub-native, with BIOME modifiers
 * FINAL FIXED VERSION — applies profession bonuses correctly
 ************************************************************/

import { REGION_MODIFIERS } from "./region-modifiers.js";
import { PROFESSION_DEFINITIONS } from "./profession-definitions.js";
import { ENEMY_TAGS as TAG_MODIFIERS, applyTagModifiers } from "./enemy-tags.js";
import { RARITY_WEIGHTS as RARITY_MULTIPLIERS } from "./rarity-weights.js";

import { ENEMY_FAMILIES } from "./enemy-families.js";
import { ENEMY_VARIANTS } from "./enemy-variants.js";
import { ABILITY_DEFINITIONS } from "./ability-definitions.js";
import { ENEMY_ULTIMATES } from "./enemy-ultimates.js";

import { REGION_TO_BIOME } from "./region-to-biome.js";
import { BIOME_MODIFIERS } from "./biomes.js";

/************************************************************
 * MAIN RESOLVER
 ************************************************************/
export function resolveEnemy(raw, regionKey, tier) {
  /************************************************************
   * FAMILY
   ************************************************************/
  const familyId = raw.family || "unknown";
  const family = ENEMY_FAMILIES[familyId] || {};
  const famMods = family.familyModifiers || {};

  /************************************************************
   * RARITY
   ************************************************************/
  const rarity = raw.rarity || "common";
  const rarityData = RARITY_MULTIPLIERS[rarity] || {};

  /************************************************************
   * TAGS + VARIANTS
   ************************************************************/
  const tags = raw.tags || [];
  const variantKey = tags.find(t => ENEMY_VARIANTS[t]) || null;
  const variant = variantKey ? ENEMY_VARIANTS[variantKey] : null;

  /************************************************************
   * PROFESSION
   ************************************************************/
  const profKey = raw.profession || null;
  const prof = profKey && PROFESSION_DEFINITIONS[profKey]
    ? PROFESSION_DEFINITIONS[profKey]
    : null;

  const bonuses = prof?.bonuses || {};

  /************************************************************
   * REGION MODIFIERS
   ************************************************************/
  const regionMods = REGION_MODIFIERS[regionKey] || {
    hpMult: 1,
    atkMult: 1,
    defMult: 1,
    speedMult: 1,
    elementAffinity: {}
  };

  /************************************************************
   * BASE STATS (from enemy template)
   ************************************************************/
  const level = raw.level || 1;

  let hpMax = raw.baseHP || 1;
  let atk   = raw.baseATK || 1;
  let def   = raw.baseDEF || 0;
  let speed = raw.speed || Math.max(5, Math.floor(level * 0.2));

  /************************************************************
   * FAMILY MODIFIERS
   ************************************************************/
  if (famMods.hp)  hpMax = Math.floor(hpMax * famMods.hp);
  if (famMods.atk) atk   = Math.floor(atk   * famMods.atk);
  if (famMods.def) def   = Math.floor(def   * famMods.def);

  /************************************************************
   * RARITY MULTIPLIERS
   ************************************************************/
  if (rarityData.hpMult)  hpMax = Math.floor(hpMax * rarityData.hpMult);
  if (rarityData.atkMult) atk   = Math.floor(atk   * rarityData.atkMult);
  if (rarityData.defMult) def   = Math.floor(def   * rarityData.defMult);

  /************************************************************
   * VARIANT MULTIPLIERS
   ************************************************************/
  if (variant?.hpMult)   hpMax = Math.floor(hpMax * variant.hpMult);
  if (variant?.atkMult)  atk   = Math.floor(atk   * variant.atkMult);
  if (variant?.defMult)  def   = Math.floor(def   * variant.defMult);
  if (variant?.speedMult) speed = Math.floor(speed * variant.speedMult);

  /************************************************************
   * PROFESSION BONUSES (THE CRITICAL FIX)
   ************************************************************/
  if (bonuses.hpMult)    hpMax = Math.floor(hpMax * bonuses.hpMult);
  if (bonuses.atkMult)   atk   = Math.floor(atk   * bonuses.atkMult);
  if (bonuses.defMult)   def   = Math.floor(def   * bonuses.defMult);
  if (bonuses.speedMult) speed = Math.floor(speed * bonuses.speedMult);

  /************************************************************
   * REGION MODIFIERS
   ************************************************************/
  if (regionMods.hpMult)    hpMax = Math.floor(hpMax * regionMods.hpMult);
  if (regionMods.atkMult)   atk   = Math.floor(atk   * regionMods.atkMult);
  if (regionMods.defMult)   def   = Math.floor(def   * regionMods.defMult);
  if (regionMods.speedMult) speed = Math.floor(speed * regionMods.speedMult);

  /************************************************************
   * BIOME MODIFIERS
   ************************************************************/
  const biomeKey = REGION_TO_BIOME[regionKey] || null;
  const biomeMods = biomeKey ? BIOME_MODIFIERS[biomeKey] : null;

  if (biomeMods) {
    if (biomeMods.hpMult)    hpMax = Math.floor(hpMax * biomeMods.hpMult);
    if (biomeMods.atkMult)   atk   = Math.floor(atk   * biomeMods.atkMult);
    if (biomeMods.defMult)   def   = Math.floor(def   * biomeMods.defMult);
    if (biomeMods.speedMult) speed = Math.floor(speed * biomeMods.speedMult);
  }

  /************************************************************
   * TAG MODIFIERS
   ************************************************************/
  const tagged = applyTagModifiers({ hpMax, atk, def, speed }, tags);
  hpMax = tagged.hpMax;
  atk   = tagged.atk;
  def   = tagged.def;
  speed = tagged.speed;

  /************************************************************
   * LEVEL SCALING
   ************************************************************/
  hpMax = Math.floor(hpMax * (1 + level * 0.08));
  atk   = Math.floor(atk   * (1 + level * 0.06));
  def   = Math.floor(def   * (1 + level * 0.05));
  speed = Math.floor(speed * (1 + level * 0.02));

  /************************************************************
   * ELEMENT AFFINITY
   ************************************************************/
  const elementAffinity = {};

  if (family.elementAffinity)
    Object.assign(elementAffinity, family.elementAffinity);

  if (regionMods.elementAffinity)
    Object.assign(elementAffinity, regionMods.elementAffinity);

  if (bonuses.elementAffinity)
    Object.assign(elementAffinity, bonuses.elementAffinity);

  if (raw.element)
    elementAffinity[raw.element] =
      (elementAffinity[raw.element] || 0) + 0.1;

  /************************************************************
   * ABILITIES + ULTIMATE
   ************************************************************/
  const abilities = profKey && ABILITY_DEFINITIONS[profKey]
    ? Object.values(ABILITY_DEFINITIONS[profKey]).filter(Boolean)
    : [];

  const ultimate = profKey && ENEMY_ULTIMATES[profKey]
    ? ENEMY_ULTIMATES[profKey]
    : null;

  /************************************************************
   * FINAL RUNTIME OBJECT
   ************************************************************/
  return {
    key: raw.key || raw.name,
    name: raw.name || raw.key,
    family: familyId,
    region: regionKey,
    tier,
    rarity,
    profession: profKey,
    variant: variantKey,
    tags,
    level,

    elementAffinity,
    element: raw.element || null,

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
      region: regionKey,
      rarity,
      family: familyId,
      profession: profKey,
      variant: variantKey
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
