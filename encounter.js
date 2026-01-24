// encounter.js
// Modernized client-side encounter generator (Option B)

(function () {
  // ============================================================
  // PUBLIC API
  // ============================================================

  window.EncounterEngine = {
    rollEncounter,
    loadEncounterFromSession,
    clearEncounter
  };

  // ============================================================
  // MAIN ENTRY POINT
  // ============================================================

  function rollEncounter(regionKey, enemyOverride = null) {
    const region = REGION_DEFINITIONS[regionKey];
    if (!region) {
      throw new Error(`Unknown region: ${regionKey}`);
    }

    // 1. Roll weather + event
    const weather = pickWeighted(region.weatherPool);
    const event = pickWeighted(region.eventPool);

    // 2. Roll rarity
    const rarity = pickWeighted(region.rarityWeights);

    // 3. Roll family
    const family = pickWeighted(region.enemyFamilies);

    // 4. Pick enemy template
    const enemyTemplate = enemyOverride
      ? ENEMY_TEMPLATES[enemyOverride]
      : pickEnemyTemplate(family, rarity);

    if (!enemyTemplate) {
      throw new Error(
        `No enemy template found for family=${family}, rarity=${rarity}`
      );
    }

    // 5. Build enemy object
    const enemy = buildEnemyInstance(
      enemyTemplate,
      region,
      rarity,
      weather,
      event
    );

    // 6. Build encounter object
    const encounter = {
      region: regionKey,
      biome: region.biome,
      weather,
      event,
      flavor: region.flavor || "",
      enemy
    };

    // 7. Save to sessionStorage
    sessionStorage.setItem(
      "encounter",
      JSON.stringify(encounter)
    );

    return encounter;
  }

  function loadEncounterFromSession() {
    const raw = sessionStorage.getItem("encounter");
    return raw ? JSON.parse(raw) : null;
  }

  function clearEncounter() {
    sessionStorage.removeItem("encounter");
  }

  // ============================================================
  // ENEMY INSTANCE BUILDER
  // ============================================================

  function buildEnemyInstance(
    template,
    region,
    rarity,
    weather,
    event
  ) {
    const level = rollLevel(region.levelRange);
    const rarityMult = rarityScaling(rarity);

    const baseHP = Math.round(
      template.baseHP * rarityMult * region.lootModifier
    );
    const baseATK = Math.round(
      template.attack * rarityMult
    );
    const baseDEF = Math.round(
      template.defense * rarityMult
    );

    const modifiers = [];

    // Weather modifiers
    if (weather && WEATHER_MODIFIERS[weather]) {
      modifiers.push(WEATHER_MODIFIERS[weather]);
    }

    // Event modifiers
    if (event && EVENT_MODIFIERS[event]) {
      modifiers.push(EVENT_MODIFIERS[event]);
    }

    // Region combat modifiers (converted to readable text)
    if (region.combatModifiers) {
      const cm = region.combatModifiers;
      if (cm.playerDEFMult && cm.playerDEFMult < 1) {
        modifiers.push({
          icon: "def_down.png",
          text: "Region: Player defense reduced"
        });
      }
      if (cm.enemyATKMult && cm.enemyATKMult > 1) {
        modifiers.push({
          icon: "atk_up.png",
          text: "Region: Enemy attack increased"
        });
      }
    }

    return {
      key: template.key,
      name: template.name,
      family: template.family,
      element: template.element || "neutral",
      rarity,
      level,

      hp: baseHP,
      hpMax: baseHP,
      attack: baseATK,
      defense: baseDEF,

      portrait:
        template.portrait ||
        `/assets/enemies/${template.key}.png`,

      flavor: template.flavor || "",
      modifiers
    };
  }

  // ============================================================
  // HELPERS
  // ============================================================

  function pickWeighted(pool) {
    if (!pool || !pool.length) return null;

    const total = pool.reduce((sum, p) => sum + p.weight, 0);
    let roll = Math.random() * total;

    for (const entry of pool) {
      if (roll < entry.weight) return entry.id;
      roll -= entry.weight;
    }
    return pool[pool.length - 1].id;
  }

  function pickEnemyTemplate(family, rarity) {
    const candidates = Object.values(ENEMY_TEMPLATES).filter(
      (e) =>
        e.family === family &&
        e.rarity.toLowerCase() === rarity.toLowerCase()
    );
    if (!candidates.length) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function rollLevel([min, max]) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function rarityScaling(rarity) {
    switch (rarity.toLowerCase()) {
      case "common":
        return 1.0;
      case "uncommon":
        return 1.1;
      case "rare":
        return 1.25;
      case "epic":
        return 1.45;
      case "elite":
        return 1.65;
      case "mythical":
        return 1.9;
      case "legendary":
        return 2.2;
      case "ancient":
        return 2.6;
      default:
        return 1.0;
    }
  }

  // ============================================================
  // WEATHER / EVENT MODIFIER DEFINITIONS
  // (You can expand these anytime)
  // ============================================================

  const WEATHER_MODIFIERS = {
    rain: {
      icon: "rain.png",
      text: "Rain: +10% lightning damage"
    },
    clear: {
      icon: "sun.png",
      text: "Clear Skies: No special effects"
    },
    storm: {
      icon: "storm.png",
      text: "Storm: +15% lightning damage"
    },
    heatwave: {
      icon: "heat.png",
      text: "Heatwave: +10% fire damage"
    },
    arcane_winds: {
      icon: "arcane.png",
      text: "Arcane Winds: +10% arcane damage"
    }
  };

  const EVENT_MODIFIERS = {
    beast_migration: {
      icon: "paw.png",
      text: "Beast Migration: Beast enemies gain +10% HP"
    },
    cosmic_flux: {
      icon: "cosmic.png",
      text: "Cosmic Flux: +10% arcane damage"
    },
    timeline_echo: {
      icon: "time.png",
      text: "Timeline Echo: Random stat fluctuations"
    },
    scorched_earth: {
      icon: "fire.png",
      text: "Scorched Earth: +10% fire damage"
    },
    titanic_footfall: {
      icon: "titan.png",
      text: "Titanic Footfall: +10% earth damage"
    }
  };
})();
