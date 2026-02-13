// world-simulation.js
// Unified, persistent, merchant-aware, boss-aware world simulation engine.

import { BossRespawnSystem } from "./boss-respawn-system.js";
import { rotateMerchants } from "./merchant-rotation.js";
import { REGION_UNLOCKS } from "./region-unlock.js";
import { tickSettlements } from "./settlement-simulation.js";
import { tickSettlementEconomy } from "./settlement-economy-simulation.js";
import { tickTradeRoutes } from "./trade-routes.js";
import { evaluateSettlementCrisis, advanceSettlementCrisis } from "./settlement-crisis.js";
// NEW IMPORT
import { REGION_IDENTITY } from "./region-identity.js";
import { BIOME_IDENTITY } from "./biome-identity.js";

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
          elementalCharge: {},
        
          // ⭐ Phase D fields
          activeAnomaly: null,
          anomalyTimer: 0,
        
          activeMigration: null,
          migrationTimer: 0,
        
          activeGlobalModifier: null,
          globalTimer: 0,
        
          weatherFront: null,
          weatherTimer: 0
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
    tickTradeRoutes();
    const next = { ...worldState }; 
    for (const regionId of Object.keys(next.regions)) { 
      next.regions[regionId] = applyRegionDrift(next.regions[regionId], regionId); 
    }

    // Settlement crisis evaluation + progression
    for (const key of Object.keys(this._state.settlements || {})) {
      evaluateSettlementCrisis(key);
    
      const s = this._state.settlements[key];
      if (s.crisis && now - s.crisisStartedAt > 60 * 60 * 1000) {
        advanceSettlementCrisis(key);
        s.crisisStartedAt = now;
      }
    }
    // ============================================================
    // Phase D: Environmental Evolution
    // ============================================================
    for (const regionKey of Object.keys(this._state.regions)) {
      const r = this._state.regions[regionKey];
    
      evolveWeatherFront(regionKey, r);
      evolveAnomaly(regionKey, r);
      evolveMigration(regionKey, r);
      evolveGlobalModifiaer(regionKey, r);
    
      // Danger & stability drift
      driftRegionDangerAndStability(r);
    }

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

function evolveWeatherFront(regionKey, r) {
  r.weatherTimer++;

  // Change weather every 30–90 minutes
  if (r.weatherTimer > 30 && Math.random() < 0.05) {
    const weatherKeys = Object.keys(WEATHER_TYPES);
    r.weatherFront = weatherKeys[Math.floor(Math.random() * weatherKeys.length)];
    r.weatherTimer = 0;
  }
}

function evolveAnomaly(regionKey, r) {
  // If no anomaly, small chance to spawn one
  if (!r.activeAnomaly) {
    if (Math.random() < 0.02) { // 2% per tick
      const keys = Object.keys(ANOMALIES);
      r.activeAnomaly = keys[Math.floor(Math.random() * keys.length)];
      r.anomalyTimer = 0;
    }
    return;
  }

  // If active, increase timer
  r.anomalyTimer++;

  // Collapse after 20–60 minutes
  if (r.anomalyTimer > 20 && Math.random() < 0.05) {
    r.activeAnomaly = null;
    r.anomalyTimer = 0;
  }
}

function evolveMigration(regionKey, r) {
  if (!r.activeMigration) {
    if (Math.random() < 0.03) { // 3% per tick
      const keys = Object.keys(MIGRATIONS);
      r.activeMigration = keys[Math.floor(Math.random() * keys.length)];
      r.migrationTimer = 0;
    }
    return;
  }

  r.migrationTimer++;

  // Migrations dissipate after 15–45 minutes
  if (r.migrationTimer > 15 && Math.random() < 0.07) {
    r.activeMigration = null;
    r.migrationTimer = 0;
  }
}

function evolveGlobalModifier(regionKey, r) {
  if (!r.activeGlobalModifier) {
    if (Math.random() < 0.01) { // 1% per tick
      const keys = Object.keys(GLOBAL_MODIFIERS);
      r.activeGlobalModifier = keys[Math.floor(Math.random() * keys.length)];
      r.globalTimer = 0;
    }
    return;
  }

  r.globalTimer++;

  // Global modifiers last 30–120 minutes
  if (r.globalTimer > 30 && Math.random() < 0.03) {
    r.activeGlobalModifier = null;
    r.globalTimer = 0;
  }
}

function driftRegionDangerAndStability(r) {
  // Stability slowly returns to 1.0
  if (r.stability < 1.0) r.stability += 0.002;
  if (r.stability > 1.0) r.stability -= 0.002;

  // Danger slowly trends toward 1.0
  if (r.dangerLevel < 1.0) r.dangerLevel += 0.001;
  if (r.dangerLevel > 1.0) r.dangerLevel -= 0.001;

  // Anomalies increase danger
  if (r.activeAnomaly) r.dangerLevel += 0.002;

  // Migrations increase danger slightly
  if (r.activeMigration) r.dangerLevel += 0.001;

  // Global modifiers can swing danger
  if (r.activeGlobalModifier === "blood_moon") r.dangerLevel += 0.003;
  if (r.activeGlobalModifier === "verdant_bloom") r.dangerLevel -= 0.002;

  // Clamp
  r.dangerLevel = Math.max(0.5, Math.min(3.0, r.dangerLevel));
  r.stability = Math.max(0.0, Math.min(2.0, r.stability));
}

function applyRegionDrift(regionState, regionId) {
  const identity = REGION_IDENTITY[regionId];
  if (!identity) return regionState;

  const next = { ...regionState };

  if (typeof identity.stabilityDrift === "number") {
    next.stability = (next.stability || 0) + identity.stabilityDrift;
  }
  if (typeof identity.dangerDrift === "number") {
    next.danger = (next.danger || 0) + identity.dangerDrift;
  }

  return next;
}

