// global-events.js
// 3G-2: Global Event Generator

import { getWorldState, addRegionHistory } from "./world-state.js";
import { GlobalSim } from "./global-simulation.js";

export const GlobalEvents = {
  tick,
  triggerRandomEvent,
  EVENT_TABLE
};

// ------------------------------------------------------------
// EVENT DEFINITIONS
// ------------------------------------------------------------
const EVENT_TABLE = [
  // --- WEATHER EVENTS ---
  {
    id: "storm_front",
    weight: 10,
    run(world) {
      const path = pickRandomPath(world);
      GlobalSim.spawnWeatherFront(path, "storm", 1);
      addRegionHistory(path[0], "global_event", "A storm front has formed.");
    }
  },
  {
    id: "heatwave_front",
    weight: 6,
    run(world) {
      const path = pickRandomPath(world);
      GlobalSim.spawnWeatherFront(path, "heatwave", 1);
      addRegionHistory(path[0], "global_event", "A heatwave is sweeping across the land.");
    }
  },
  {
    id: "void_storm_front",
    weight: 3,
    run(world) {
      const path = pickRandomPath(world);
      GlobalSim.spawnWeatherFront(path, "void_storm", 1);
      addRegionHistory(path[0], "global_event", "A void storm tears open the sky.");
    }
  },

  // --- MIGRATIONS ---
  {
    id: "beast_migration",
    weight: 8,
    run(world) {
      const path = pickRandomPath(world);
      GlobalSim.spawnMigration(path, "wildlife", 2);
      addRegionHistory(path[0], "global_event", "A beast migration begins.");
    }
  },
  {
    id: "undead_march",
    weight: 5,
    run(world) {
      const path = pickRandomPath(world);
      GlobalSim.spawnMigration(path, "corruption", 3);
      addRegionHistory(path[0], "global_event", "An undead march stirs in the shadows.");
    }
  },

  // --- ELEMENTAL SURGES ---
  {
    id: "frost_bloom",
    weight: 4,
    run(world) {
      const region = pickRandomRegion(world);
      GlobalSim.spawnAnomaly(region, "frost", 2);
      addRegionHistory(region, "global_event", "A frost bloom spreads across the land.");
    }
  },
  {
    id: "fire_rift",
    weight: 4,
    run(world) {
      const region = pickRandomRegion(world);
      GlobalSim.spawnAnomaly(region, "fire", 2);
      addRegionHistory(region, "global_event", "A fire rift erupts with blazing fury.");
    }
  },
  {
    id: "void_tear",
    weight: 2,
    run(world) {
      const region = pickRandomRegion(world);
      GlobalSim.spawnAnomaly(region, "void", 3);
      addRegionHistory(region, "global_event", "A void tear distorts reality.");
    }
  },

  // --- GLOBAL MODIFIERS ---
  {
    id: "blood_moon",
    weight: 2,
    run(world) {
      GlobalSim.spawnGlobalModifier({
        dangerMult: 1.2,
        stabilityMult: 0.9,
        durationMs: 1000 * 60 * 60 * 2 // 2 hours
      });
      addGlobalHistory(world, "A Blood Moon rises, empowering dark forces.");
    }
  },
  {
    id: "solar_eclipse",
    weight: 2,
    run(world) {
      GlobalSim.spawnGlobalModifier({
        dangerMult: 1.1,
        stabilityMult: 1.1,
        durationMs: 1000 * 60 * 60 // 1 hour
      });
      addGlobalHistory(world, "A Solar Eclipse blankets the world in shadow.");
    }
  },

  // --- MERCHANT / ECONOMY ---
  {
    id: "merchant_caravan",
    weight: 6,
    run(world) {
      const region = pickRandomRegion(world);
      addRegionHistory(region, "global_event", "A rare merchant caravan arrives.");
      // You can hook this into your merchant system later
    }
  },

  // --- WORLD BOSS AWAKENINGS ---
  {
    id: "world_boss_stirs",
    weight: 1,
    run(world) {
      const region = pickRandomRegion(world);
      world.regions[region].worldBossAwakening = Date.now() + (1000 * 60 * 30); // 30 min timer
      addRegionHistory(region, "world_boss", "A powerful presence stirs beneath the earth...");
    }
  },

  // --- MYTHIC EVENTS ---
  {
    id: "planar_convergence",
    weight: 1,
    run(world) {
      GlobalSim.spawnGlobalModifier({
        dangerMult: 1.3,
        stabilityMult: 0.8,
        durationMs: 1000 * 60 * 60 * 3 // 3 hours
      });
      addGlobalHistory(world, "A Planar Convergence warps the fabric of reality.");
    }
  }
];

// ------------------------------------------------------------
// EVENT TICK
// ------------------------------------------------------------
function tick() {
  const world = getWorldState();
  ensureGlobalState(world);

  // 20% chance to trigger an event every global tick
  if (Math.random() < 0.2) {
    triggerRandomEvent(world);
  }
}

// ------------------------------------------------------------
// RANDOM EVENT SELECTION
// ------------------------------------------------------------
function triggerRandomEvent(world) {
  const event = weightedRandom(EVENT_TABLE);
  if (!event) return;

  event.run(world);
}

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------
function pickRandomRegion(world) {
  const keys = Object.keys(world.regions);
  return keys[Math.floor(Math.random() * keys.length)];
}

function pickRandomPath(world) {
  const keys = Object.keys(world.regions);
  const shuffled = keys.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.floor(Math.random() * 4) + 2);
}

function weightedRandom(list) {
  const total = list.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const e of list) {
    if ((r -= e.weight) <= 0) return e;
  }
}

function ensureGlobalState(world) {
  if (!world.global) {
    world.global = {
      weatherFronts: [],
      migrations: [],
      anomalies: [],
      globalModifiers: [],
      lastGlobalUpdate: Date.now()
    };
  }
}

function addGlobalHistory(world, message) {
  for (const regionKey in world.regions) {
    addRegionHistory(regionKey, "global_event", message);
  }
}
