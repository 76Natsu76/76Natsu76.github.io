// migration.js
// Converts legacy KV → full modern player schema

import { PlayerStorage } from "./player-storage.js";

// -----------------------------
// JSON loader (works on GitHub Pages + Cloudflare)
// -----------------------------
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("Failed to load " + path);
  return res.json();
}

// Preload all definitions
const abilityDefs = await loadJSON("./ability-definitions.json");

// -----------------------------
// Helpers
// -----------------------------
function computeXpRequired(level) {
  const lvl = level || 1;
  return Math.floor(100 * lvl * lvl);
}

function detectPrimaryElement(affinity) {
  if (!affinity) return "none";
  const entries = Object.entries(affinity);
  if (!entries.length) return "none";
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

function computeEquipmentBonuses(equipment) {
  const out = { hp: 0, atk: 0, def: 0, speed: 0, crit: 0, critDmg: 0 };
  if (!equipment) return out;

  for (const slot of Object.keys(equipment)) {
    const item = equipment[slot];
    if (!item || !item.bonuses) continue;
    for (const [k, v] of Object.entries(item.bonuses)) {
      out[k] = (out[k] || 0) + v;
    }
  }
  return out;
}

function computeDerivedStats(p) {
  return {
    evade: (p.speed || 0) * 0.002,
    block: (p.def || 0) * 0.001,
    critChance: p.crit || 0,
    critDamage: p.critDmg || 1.5,
    powerScore: Math.floor(
      (p.atk || 0) * 1.5 + (p.def || 0) * 1.2 + (p.hpMax || 0) * 0.3
    )
  };
}

function resolveAbilities(old) {
  const out = [];
  if (!old.abilities) return out;

  for (const slot of Object.keys(old.abilities)) {
    const key = old.abilities[slot];
    if (!key) continue;

    const def = abilityDefs[key];

    if (!def) {
      out.push({
        key,
        name: key,
        description: "(Unknown legacy ability)",
        cooldown: old.cooldowns?.[key] ?? 0,
        icon: "/assets/abilities/default.png"
      });
      continue;
    }

    out.push({
      key,
      name: def.name,
      description: def.description,
      cooldown: def.cooldown ?? old.cooldowns?.[key] ?? 0,
      icon: def.icon || `/assets/abilities/${key}.png`,
      type: def.type,
      scaling: def.scaling
    });
  }

  return out;
}

// ============================================================
// MAIN RESOLVER
// ============================================================
export async function resolveLegacyPlayer(old) {
  if (!old) return null;

  const p = {};

  // Identity
  p.username = old.username;
  p.level = old.level ?? 1;
  p.race = old.race ?? "human";
  p.subrace = old.subrace ?? null;
  p.profession = old.profession ?? "adventurer";

  // XP
  p.xp = old.exp ?? 0;
  p.xpRequired = computeXpRequired(p.level);

  // Element
  p.elementAffinity = old.elementAffinity ?? {};
  p.element = detectPrimaryElement(p.elementAffinity);

  // Family
  p.family = old.family ?? old.regionMeta?.family ?? null;

  // Equipment
  p.equipment = {};
  if (old.equipment) {
    for (const slot of Object.keys(old.equipment)) {
      const item = old.equipment[slot];
      if (!item) continue;
      p.equipment[slot] = {
        name: item.name,
        rarity: item.rarity ?? "common",
        level: item.level ?? 1,
        bonuses: item.stats || item.bonuses || {}
      };
    }
  }

  // Inventory
  p.inventory = Array.isArray(old.inventory) ? old.inventory : [];

  // Abilities
  p.abilities = resolveAbilities(old);

  // Status Effects
  p.statusEffects = [];
  if (Array.isArray(old.status)) {
    p.statusEffects.push(...old.status);
  }
  if (old.activeEffects) {
    for (const key of Object.keys(old.activeEffects)) {
      const eff = old.activeEffects[key];
      p.statusEffects.push({
        name: key,
        duration: eff.duration ?? 0,
        stacks: eff.stacks ?? 1,
        description: eff.description ?? ""
      });
    }
  }

  // Region Progress
  p.regionProgress = {};
  if (old.regionMeta?.visitedRegions) {
    for (const region of Object.keys(old.regionMeta.visitedRegions)) {
      p.regionProgress[region] = 100;
    }
  }

  // Equipment bonuses
  const eq = computeEquipmentBonuses(p.equipment);

  // Final stats
  p.hpMax = (old.hpMax ?? old.hp ?? 10) + (eq.hp ?? 0);
  p.hpCurrent = Math.min(old.hp ?? p.hpMax, p.hpMax);

  p.atk = (old.atk ?? 1) + (eq.atk ?? 0);
  p.def = (old.def ?? 0) + (eq.def ?? 0);
  p.speed = (old.speed ?? 1) + (eq.speed ?? 0);

  p.crit = (old.critChance ?? 0) + (eq.crit ?? 0);
  p.critDmg = (old.critDamage ?? 1.5) + (eq.critDmg ?? 0);

  // Stats + derived
  p.stats = {
    hp: p.hpMax,
    atk: p.atk,
    def: p.def,
    speed: p.speed,
    crit: p.crit,
    critDmg: p.critDmg
  };
  p.derived = computeDerivedStats(p);

  // Adaptive profile
  p.adaptiveProfile = {
    playerHeals: 0,
    playerBuffs: 0,
    playerShields: 0,
    playerDOTsApplied: 0,
    playerCCsApplied: 0
  };

  // Misc
  p.gold = old.gold ?? 0;
  p.hardcore = old.hardcore ?? false;
  p.transcension = old.transcension ?? false;

  return p;
}
