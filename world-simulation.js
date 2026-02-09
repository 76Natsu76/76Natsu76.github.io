// world-simulation.js
// Unified, persistent, merchant-aware, boss-aware world simulation engine.

import { BossRespawnSystem } from "./boss-respawn-system.js";
import { rotateMerchants } from "./merchant-rotation.js";
import { REGION_UNLOCKS } from "./region-unlock.js";
import { tickSettlements } from "./settlement-simulation.js";
import { tickSettlementEconomy } from "./settlement-economy-simulation.js";

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

        // Region-based boss system
        regions: {},       // regionKey → { worldBossActive, worldBossAwakening, ... }
        regionUnlocks: {}  // regionKey → boolean
      };

      // Initialize region states
      this.initializeRegions();
    }

    // Process offline time immediately
    this.tick();
  },

  /* ============================================================
     Initialize region states if missing
  ============================================================ */
  initializeRegions() {
    // You can expand this list based on your actual region keys
    const regionKeys = [
      "forest",
      "plains",
      "cavern",
      "ruins",
      "desert",
      "firelands",
      "frostlands",
      "storm_peaks",
      "voidlands",
      "celestial",
      "primordial_grove",
      "astral_realm",
      "cataclysm"
    ];

    for (const key of regionKeys) {
      if (!this._state.regions[key]) {
        this._state.regions[key] = {
          worldBossActive: false,
          worldBossAwakening: null,
          dangerLevel: 1.0,
          stability: 1.0,
          elementalCharge: {}
        };
      }
    }
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
    this._state.tickCount++;

    // Merchant rotation
    this._state = rotateMerchants(this._state);

    // Boss respawn system
    BossRespawnSystem.tick();

    // Settlement system
    tickSettlements();
    tickSettlementEconomy();

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
function _getRegionUnlocks() {
  return REGION_UNLOCKS;
}

WorldSim._getRegionUnlocks = _getRegionUnlocks;
