// world-simulation.js
// Unified, persistent, merchant-aware world simulation engine.

import { WORLD_DATA } from "./world-data.js";
import { BIOMES } from "./biomes.js";
import { REGION_TO_BIOME } from "./region-to-biome.js";

import { WORLD_BOSSES } from "./world-boss-templates.js";
import { REGION_UNLOCKS } from "./region-unlock.js";

import { rotateMerchants } from "./merchant-rotation.js";

export const WorldSim = {
  _state: null,

  /* ============================================================
     INIT — loads or creates persistent world state
  ============================================================ */
  async init() {
    const saved = JSON.parse(localStorage.getItem("world_state"));

    if (saved) {
      this._state = saved;
    } else {
      this._state = {
        tickCount: 0,
        globalMerchant: null,
        lastTick: Date.now(),
      
        // NEW: world boss progression
        bosses: {},            // bossKey → { active, hp, maxHP, region, respawnAt }
        regionUnlocks: {},     // regionKey → boolean
      };
    }

    // Run a tick immediately to process offline time
    this.tick();
  },

  /* ============================================================
     TICK — advances world time + rotates merchants
  ============================================================ */
  tick() {
    const now = Date.now();
    const diffMinutes = Math.floor((now - this._state.lastTick) / 60000);

    if (diffMinutes <= 0) return;

    // Advance world time
    this._state.lastTick = now;

    // Merchant rotation (global + future biome/region/event merchants)
    this._state = rotateMerchants(this._state);

    // Future Phase 6: world boss progression
    // Future Phase 7: dungeon resets
    // Future Phase 8: weather/events/hazards reintegration

    this.save();
  },

  /* ============================================================
     SAVE
  ============================================================ */
  save() {
    localStorage.setItem("world_state", JSON.stringify(this._state));
  },

  /* ============================================================
     GET STATE
  ============================================================ */
  getState() {
    return this._state;
  }
};

/* ============================================================
   ACCESSORS — used by world-map, fight-interactive, etc.
============================================================ */
function _getBossData() {
  return WORLD_BOSSES;
}

function _getRegionUnlocks() {
  return REGION_UNLOCKS;
}

// Attach accessors to the main object
WorldSim._getBossData = _getBossData;
WorldSim._getRegionUnlocks = _getRegionUnlocks;
