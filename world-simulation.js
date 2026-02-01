// world-simulation.js
// Unified, persistent, merchant-aware, boss-aware world simulation engine.

import { WORLD_BOSSES } from "./world-boss-templates.js";
import { REGION_UNLOCKS } from "./region-unlock.js";

import { rotateMerchants } from "./merchant-rotation.js";
import { updateWorldBosses } from "./world-boss-progression.js";

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

        // World boss progression
        bosses: {},        // bossKey → { active, hp, maxHP, region, respawnAt }
        regionUnlocks: {}  // regionKey → boolean
      };

      // Initialize boss states immediately
      this._state = updateWorldBosses(this._state);
    }

    // Process offline time immediately
    this.tick();
  },

  /* ============================================================
     TICK — advances world time + rotates merchants + bosses
  ============================================================ */
  tick() {
    const now = Date.now();
    const diffMinutes = Math.floor((now - this._state.lastTick) / 60000);

    if (diffMinutes <= 0) return;

    // Advance world time
    this._state.lastTick = now;

    // Merchant rotation
    this._state = rotateMerchants(this._state);

    // World boss progression
    this._state = updateWorldBosses(this._state);

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

WorldSim._getBossData = _getBossData;
WorldSim._getRegionUnlocks = _getRegionUnlocks;
