// encounter-loader.js — Phase 4 Overworld → Combat Bridge

import { PlayerStorage } from "./player-storage.js";
import { requireSession } from "./session-guard.js";
import { WORLD_DATA } from "./world-data.js";
import { ENEMY_REGISTRY } from "./enemy-registry.js";
import { buildCombatContext } from "./combat-engine.js";
import { seededRNG } from "./rng.js";

/************************************************************
 * ENEMY CONSTRUCTION HELPERS
 ************************************************************/

function scaleStats(base, mult) {
  const out = { ...base };
  out.hpMax = Math.floor(out.hpMax * mult);
  out.atk = Math.floor(out.atk * mult);
  out.def = Math.floor(out.def * mult);
  out.speed = Math.floor(out.speed * mult);
  return out;
}

function applyRarityScaling(enemy, rarity) {
  const mult = {
    common: 1.0,
    uncommon: 1.15,
    rare: 1.35,
    elite: 1.6,
    boss: 2.0
  }[rarity] || 1.0;

  return scaleStats(enemy, mult);
}

function applyDangerScaling(enemy, danger) {
  const mult = 1 + (danger - 1) * 0.25;
  return scaleStats(enemy, mult);
}

function applyChaosMutation(enemy, rng) {
  const mutated = { ...enemy };

  mutated.flavorTags = mutated.flavorTags || [];
  mutated.flavorTags.push("chaos-mutated");

  const statSpike = 1.1 + rng() * 0.25;
  mutated.hpMax = Math.floor(mutated.hpMax * statSpike);
  mutated.atk = Math.floor(mutated.atk * statSpike);
  mutated.def = Math.floor(mutated.def * statSpike);

  if (rng() < 0.5) mutated.element = "void";
  if (rng() < 0.3) mutated.speed = Math.floor(mutated.speed * 1.2);

  return mutated;
}

function applyCrisisModifiers(enemy, crisis) {
  if (!crisis) return enemy;

  const out = { ...enemy };
  out.flavorTags = out.flavorTags || [];

  switch (crisis) {
    case "plague":
      out.flavorTags.push("plagueborne");
      out.atk = Math.floor(out.atk * 1.1);
      break;
    case "warfront":
      out.flavorTags.push("war-charged");
      out.atk = Math.floor(out.atk * 1.15);
      out.def = Math.floor(out.def * 1.1);
      break;
    case "corruption":
      out.flavorTags.push("void-touched");
      out.element = "void";
      break;
    case "famine":
      out.flavorTags.push("desperate");
      out.speed = Math.floor(out.speed * 1.1);
      break;
  }

  return out;
}

function applyAnomalyModifiers(enemy, anomalyElement) {
  if (!anomalyElement) return enemy;

  const out = { ...enemy };
  out.flavorTags = out.flavorTags || [];

  out.flavorTags.push(`anomaly-${anomalyElement}`);

  if (anomalyElement === "void") {
    out.element = "void";
    out.atk = Math.floor(out.atk * 1.1);
  }
  if (anomalyElement === "frost") {
    out.element = "frost";
    out.def = Math.floor(out.def * 1.1);
  }
  if (anomalyElement === "fire") {
    out.element = "fire";
    out.atk = Math.floor(out.atk * 1.1);
  }
  if (anomalyElement === "arcane") {
    out.element = "arcane";
    out.speed = Math.floor(out.speed * 1.1);
  }

  return out;
}

function applyMigrationModifiers(enemy, faction) {
  if (!faction) return enemy;

  const out = { ...enemy };
  out.flavorTags = out.flavorTags || [];

  out.flavorTags.push(`migration-${faction}`);

  out.atk = Math.floor(out.atk * 1.1);
  out.speed = Math.floor(out.speed * 1.05);

  return out;
}

function applyGlobalModifiers(enemy, mods) {
  if (!mods || !mods.length) return enemy;

  const out = { ...enemy };
  out.flavorTags = out.flavorTags || [];

  for (const m of mods) {
    if (m.startsWith("global_")) {
      out.flavorTags.push(m);

      if (m === "global_increased_monsters") {
        out.hpMax = Math.floor(out.hpMax * 1.1);
      }
      if (m === "global_rare_creatures") {
        out.atk = Math.floor(out.atk * 1.1);
      }
      if (m === "global_void_incursion") {
        out.element = "void";
        out.atk = Math.floor(out.atk * 1.15);
      }
    }
  }

  return out;
}

/************************************************************
 * MAIN ENEMY BUILDER
 ************************************************************/

function buildEnemyFromEncounter(encounter) {
  const base = ENEMY_REGISTRY[encounter.family];
  if (!base) throw new Error(`Unknown enemy family: ${encounter.family}`);

  const rng = seededRNG(encounter.region + Date.now());

  let enemy = JSON.parse(JSON.stringify(base));

  enemy.rarity = encounter.rarity;
  enemy.region = encounter.region;
  enemy.biome = encounter.biome;
  enemy.weather = encounter.weather;
  enemy.crisis = encounter.crisis;
  enemy.danger = encounter.danger;
  enemy.flavorTags = enemy.flavorTags || [];

  enemy = applyRarityScaling(enemy, encounter.rarity);
  enemy = applyDangerScaling(enemy, encounter.danger);

  if (encounter.chaosMutated) {
    enemy = applyChaosMutation(enemy, rng);
  }

  if (encounter.crisis) {
    enemy = applyCrisisModifiers(enemy, encounter.crisis);
  }

  if (encounter.anomalyElement) {
    enemy = applyAnomalyModifiers(enemy, encounter.anomalyElement);
  }

  if (encounter.migrationFaction) {
    enemy = applyMigrationModifiers(enemy, encounter.migrationFaction);
  }

  enemy = applyGlobalModifiers(enemy, encounter.modifiers);

  enemy.hpCurrent = enemy.hpMax;

  return enemy;
}

/************************************************************
 * ENTRY POINT
 ************************************************************/

export async function loadEncounterForCombat() {
  await requireSession();

  const { username } = window.syncState;
  const player = PlayerStorage.load(username);

  const raw = sessionStorage.getItem("currentEncounter");
  if (!raw) {
    alert("No encounter found.");
    window.location.href = "world-map.html";
    return;
  }

  const encounter = JSON.parse(raw);

  const enemy = buildEnemyFromEncounter(encounter);

  const context = buildCombatContext(
    encounter.region,
    encounter.biome,
    encounter.weather,
    null,
    "solo",
    encounter
  );

  return { player, enemy, context };
}
