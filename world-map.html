<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>World Map</title>

  <style>
    body {
      background: #0d0f14;
      color: #e8e8e8;
      font-family: system-ui, sans-serif;
      padding: 24px;
    }

    h1 {
      color: #7fffd4;
      margin-bottom: 4px;
    }

    #usernameDisplay {
      opacity: 0.8;
      margin-bottom: 20px;
    }

    .region-card {
      background: #11141c;
      border: 1px solid #262a36;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
    }

    .region-card h2 {
      margin-top: 0;
      color: #9af7ff;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      padding: 4px;
      border-bottom: 1px solid #1c1f28;
      font-size: 14px;
    }

    .stat-row:last-child {
      border-bottom: none;
    }

    .event {
      margin-top: 6px;
      padding: 6px;
      background: #1a1d24;
      border-radius: 4px;
      border: 1px solid #333;
      font-size: 13px;
    }

    .btn {
      margin-top: 12px;
      padding: 8px 12px;
      border-radius: 4px;
      border: 1px solid #444;
      background: #1a1d24;
      color: #eee;
      cursor: pointer;
    }

    .btn:hover {
      background: #222832;
    }

    .btn.disabled {
      opacity: 0.4;
      pointer-events: none;
    }

    .section {
      margin-top: 12px;
    }
  </style>
</head>

<body>

  <h1>World Map</h1>
  <div id="usernameDisplay"></div>
  <div id="mapContainer">Loading world...</div>

  <button class="btn" id="characterBtn">Character</button>
  <button class="btn" id="inventoryBtn">Inventory</button>
  <button class="btn" id="bestiaryBtn">Bestiary</button>
  
  <script type="module">
    import { WORLD_DATA } from "./world-data.js";
    import { BIOMES } from "./biomes.js";
    import { REGION_TO_BIOME } from "./region-to-biome.js";
    import { EncounterEngine } from "./encounters.js";
    import { initEncounters } from "./encounters.js";
    import { EnemyRegistry } from "./enemy-registry.js";
    import { WorldSim } from "./world-simulation.js";
    import { requireSession } from "./session-guard.js";

    /* ============================================================
       SESSION + INITIALIZATION
    ============================================================ */

    await requireSession();
    await initEncounters();
    await EnemyRegistry.loadAll();   // ⭐ REQUIRED
    await WorldSim.init();

    const { username } = window.syncState;

    document.getElementById("usernameDisplay").textContent =
      "Logged in as: " + username;

    /* ============================================================
       PLAYER LEVEL
    ============================================================ */
    let playerLevel = 1;
    try {
      const raw = localStorage.getItem("player_" + username);
      if (raw) {
        const p = JSON.parse(raw);
        playerLevel = Number(p.level || 1);
      }
    } catch (e) {
      console.warn("Failed to load player level", e);
    }

    /* ============================================================
       WORLD DATA FROM SIM
    ============================================================ */
    const REGION_UNLOCKS = WorldSim._getRegionUnlocks();
    const WORLD_BOSSES = WorldSim._getBossData();

    let worldState = {};
    try {
      worldState = WorldSim.getState() || {};
    } catch (e) {
      console.warn("WorldSim state failed", e);
      worldState = {};
    }

    /* ============================================================
       RENDER WORLD
    ============================================================ */
    function renderWorld() {
      const container = document.getElementById("mapContainer");
      const out = [];

      for (const regionKey in WORLD_DATA.regions) {
        const region = WORLD_DATA.regions[regionKey];
        const state = worldState[regionKey] || {};

        const biomeKey = REGION_TO_BIOME[regionKey] || region.biome;
        const biome = BIOMES[biomeKey];

        const [minLevel, maxLevel] = region.levelRange || [1, 999];
        const levelLocked = playerLevel < minLevel;

        const globallyUnlocked = REGION_UNLOCKS.unlocks[regionKey] ?? false;
        const bossActive = !!state.worldBoss;
        const bossLocked = !globallyUnlocked;

        const regionLocked = levelLocked || bossLocked;

        const events = region.eventPool?.length
          ? region.eventPool.map(e => `<div class="event">${format(e)}</div>`).join("")
          : "<div class='event'>None</div>";

        let lockMessage = "";
        if (levelLocked) lockMessage = `Requires Lv ${minLevel}`;
        else if (bossLocked) lockMessage = `Locked — Defeat the World Boss`;

        out.push(`
          <div class="region-card">
            <h2>${region.name}</h2>

            <div class="stat-row"><span>Biome</span><span>${format(biomeKey)}</span></div>
            <div class="stat-row"><span>Weather</span><span>${region.weatherPool?.join(", ") || "Unknown"}</span></div>
            <div class="stat-row"><span>Hazards</span><span>${biome?.hazards?.map(h => h.key).join(", ") || "None"}</span></div>
            <div class="stat-row"><span>Danger</span><span>${region.danger || "Moderate"}</span></div>

            <div class="stat-row">
              <span>World Boss</span>
              <span>${bossActive ? "Active" : globallyUnlocked ? "Defeated" : "Locked"}</span>
            </div>

            <div class="stat-row">
              <span>Level Range</span>
              <span>${minLevel} - ${maxLevel}</span>
            </div>

            <div class="section">
              <strong>Events:</strong>
              ${events}
            </div>

            <button class="btn ${regionLocked ? "disabled" : ""}"
              data-region="${regionKey}"
              data-locked="${regionLocked ? "1" : "0"}">
              ${regionLocked ? lockMessage : "Enter Region"}
            </button>
          </div>
        `);
      }

      container.innerHTML = out.join("");
    }

    renderWorld();

    /* ============================================================
       REGION CLICK HANDLER
    ============================================================ */
    document.getElementById("mapContainer").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-region]");
      if (!btn) return;

      const regionKey = btn.getAttribute("data-region");
      const locked = btn.getAttribute("data-locked") === "1";
      if (locked) return;

      const encounter = EncounterEngine.generate(regionKey, username);
      localStorage.setItem("current_encounter", JSON.stringify(encounter));
      window.location.href = "fight-interactive.html";
    });

    /* ============================================================
       NAVIGATION BUTTONS
    ============================================================ */
    document.getElementById("characterBtn").addEventListener("click", () => {
      window.location.href = "character.html";
    });

    document.getElementById("inventoryBtn").addEventListener("click", () => {
      window.location.href = "inventory.html";
    });

    document.getElementById("bestiaryBtn").addEventListener("click", () => {
      window.location.href = "bestiary.html";
    });

    /* ============================================================
       HELPERS
    ============================================================ */
    function format(str) {
      return String(str)
        .replace(/_/g, " ")
        .replace(/-/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
    }
  </script>

</body>
</html>
