// REGION_MODIFIERS

const REGION_BIOME_PRESETS = {
  lowland:   { hpMult: 1.0, atkMult: 1.0, defMult: 1.0, speedMult: 1.0, elementAffinity: {} },
  forest:    { hpMult: 1.05, atkMult: 1.0, defMult: 1.0, speedMult: 1.0, elementAffinity: { nature: 0.1 } },
  swamp:     { hpMult: 1.1, atkMult: 0.95, defMult: 1.05, speedMult: 0.9, elementAffinity: { poison: 0.1 } },
  desert:    { hpMult: 1.0, atkMult: 1.05, defMult: 0.95, speedMult: 1.05, elementAffinity: { fire: 0.05 } },
  tundra:    { hpMult: 1.1, atkMult: 1.0, defMult: 1.05, speedMult: 0.9, elementAffinity: { ice: 0.1 } },
  mountain:  { hpMult: 1.1, atkMult: 1.05, defMult: 1.1, speedMult: 0.9, elementAffinity: { earth: 0.1 } },
  volcanic:  { hpMult: 1.0, atkMult: 1.1, defMult: 1.0, speedMult: 1.0, elementAffinity: { fire: 0.15 } },
  coastal:   { hpMult: 1.0, atkMult: 1.0, defMult: 1.0, speedMult: 1.05, elementAffinity: { water: 0.1 } },
  cavern:    { hpMult: 1.05, atkMult: 1.0, defMult: 1.1, speedMult: 0.95, elementAffinity: { earth: 0.05, shadow: 0.05 } },
  ruins:     { hpMult: 1.0, atkMult: 1.05, defMult: 1.0, speedMult: 1.0, elementAffinity: { arcane: 0.05 } },
  arcane:    { hpMult: 0.95, atkMult: 1.15, defMult: 0.95, speedMult: 1.05, elementAffinity: { arcane: 0.15 } },
  celestial: { hpMult: 1.05, atkMult: 1.05, defMult: 1.05, speedMult: 1.0, elementAffinity: { light: 0.15 } },
  void:      { hpMult: 1.05, atkMult: 1.1, defMult: 0.95, speedMult: 1.0, elementAffinity: { shadow: 0.15, void: 0.1 } },
  primeval:  { hpMult: 1.15, atkMult: 1.05, defMult: 1.05, speedMult: 0.95, elementAffinity: { nature: 0.15 } }
};

function clonePreset(key) {
  const p = REGION_BIOME_PRESETS[key];
  return p ? {
    hpMult: p.hpMult,
    atkMult: p.atkMult,
    defMult: p.defMult,
    speedMult: p.speedMult,
    elementAffinity: { ...(p.elementAffinity || {}) }
  } : { hpMult: 1, atkMult: 1, defMult: 1, speedMult: 1, elementAffinity: {} };
}

const REGION_MODIFIERS = {
  // early game / base biomes
  "forest-edge": clonePreset("forest"),
  "deep-forest": clonePreset("forest"),
  "plains-field": clonePreset("lowland"),
  "swamp-marsh": clonePreset("swamp"),
  "crystal-pass": clonePreset("mountain"),
  "cave-entrance": clonePreset("cavern"),
  "ruins-outskirts": clonePreset("ruins"),
  "desert-dunes": clonePreset("desert"),
  "highland-cliffs": clonePreset("mountain"),
  "volcano-rim": clonePreset("volcanic"),
  "tundra-wastes": clonePreset("tundra"),
  "mountain-peak": clonePreset("mountain"),
  "void-realm": clonePreset("void"),
  "astral-plane": clonePreset("celestial"),
  "abyss-gate": clonePreset("void"),
  "spirit-kingdom": clonePreset("celestial"),
  "outcast-island": clonePreset("coastal"),
  "trainers-city": clonePreset("lowland"),
  "titanfall": clonePreset("mountain"),

  // mid / late regions
  "verdant-woods": clonePreset("forest"),
  "frostlands": clonePreset("tundra"),
  "volcanic-wastes": clonePreset("volcanic"),
  "azure-coast": clonePreset("coastal"),
  "sunspire-highlands": clonePreset("mountain"),
  "void-spire": clonePreset("void"),
  "crystal-caverns": clonePreset("cavern"),
  "highlands-of-thorne": clonePreset("mountain"),
  "shattered-desert": clonePreset("desert"),
  "abyssal-scar": clonePreset("void"),
  "arcane-riftlands": clonePreset("arcane"),
  "primordial-grove": clonePreset("primeval"),
  "celestial-expanse": clonePreset("celestial"),
  "eternal-citadel": clonePreset("celestial"),
  "worldbreaker-horizon": clonePreset("void"),
  "astral-nexus": clonePreset("celestial"),
  "deep-caverns": clonePreset("cavern"),
  "ruined-kingdom": clonePreset("ruins"),
  "whispering-marsh": clonePreset("swamp"),
  "stormbreaker-coast": clonePreset("coastal"),
  "emberforge-depths": clonePreset("volcanic"),
  "crystalline-tundra": clonePreset("tundra"),
  "abyssal-deep": clonePreset("void"),

  // generic biomes
  "forest": clonePreset("forest"),
  "plains": clonePreset("lowland"),
  "cavern": clonePreset("cavern"),
  "ruins": clonePreset("ruins"),
  "swamp": clonePreset("swamp"),
  "desert": clonePreset("desert"),
  "tundra": clonePreset("tundra"),
  "mountains": clonePreset("mountain"),

  // high fantasy / late game
  "verdant-wildwood": clonePreset("forest"),
  "arcstone-enclave": clonePreset("arcane"),
  "emberfang-ridge": clonePreset("volcanic"),
  "void": clonePreset("void"),
  "celestial": clonePreset("celestial"),
  "arcane-rift": clonePreset("arcane"),
  "stormforge-sanctum": (() => {
    const p = clonePreset("volcanic");
    p.atkMult += 0.05;
    p.elementAffinity.light = (p.elementAffinity.light || 0) + 0.05;
    p.elementAffinity.storm = 0.15;
    return p;
  })(),
  "molten-underdeep": (() => {
    const p = clonePreset("volcanic");
    p.hpMult += 0.05;
    p.defMult += 0.05;
    p.elementAffinity.earth = (p.elementAffinity.earth || 0) + 0.05;
    return p;
  })(),
  "shadow-labyrinth": (() => {
    const p = clonePreset("ruins");
    p.elementAffinity.shadow = (p.elementAffinity.shadow || 0) + 0.15;
    return p;
  })(),
  "void-frontier": clonePreset("void"),
  "radiant-ascension-spire": clonePreset("celestial"),
  "seraphic-crucible": (() => {
    const p = clonePreset("celestial");
    p.atkMult += 0.05;
    p.elementAffinity.fire = (p.elementAffinity.fire || 0) + 0.05;
    return p;
  })(),
  "elderwood-heart": clonePreset("primeval"),
  "primeval-overgrowth": clonePreset("primeval"),
  "celestial-horizon": clonePreset("celestial"),
  "worlds-end-expanse": clonePreset("void")
};


// PROFESSION_STAT_MODIFIERS

const PROFESSION_STAT_MODIFIERS = {
  warrior: {
    hpMult: 1.15,
    atkMult: 1.05,
    defMult: 1.15,
    speedMult: 1.0,
    elementAffinity: {}
  },
  knight: {
    hpMult: 1.2,
    atkMult: 1.0,
    defMult: 1.2,
    speedMult: 0.95,
    elementAffinity: { light: 0.05 }
  },
  paladin: {
    hpMult: 1.2,
    atkMult: 1.0,
    defMult: 1.15,
    speedMult: 0.95,
    elementAffinity: { light: 0.15 }
  },
  rogue: {
    hpMult: 0.95,
    atkMult: 1.1,
    defMult: 0.9,
    speedMult: 1.25,
    elementAffinity: {}
  },
  ranger: {
    hpMult: 1.0,
    atkMult: 1.1,
    defMult: 1.0,
    speedMult: 1.15,
    elementAffinity: { nature: 0.05 }
  },
  mage: {
    hpMult: 0.9,
    atkMult: 1.25,
    defMult: 0.9,
    speedMult: 1.05,
    elementAffinity: { arcane: 0.15 }
  },
  sorcerer: {
    hpMult: 0.9,
    atkMult: 1.25,
    defMult: 0.9,
    speedMult: 1.05,
    elementAffinity: { fire: 0.1, arcane: 0.1 }
  },
  warlock: {
    hpMult: 0.95,
    atkMult: 1.2,
    defMult: 0.9,
    speedMult: 1.0,
    elementAffinity: { shadow: 0.15 }
  },
  necromancer: {
    hpMult: 0.95,
    atkMult: 1.15,
    defMult: 0.9,
    speedMult: 1.0,
    elementAffinity: { shadow: 0.15, poison: 0.05 }
  },
  druid: {
    hpMult: 1.15,
    atkMult: 1.0,
    defMult: 1.0,
    speedMult: 1.0,
    elementAffinity: { nature: 0.15 }
  },
  cleric: {
    hpMult: 1.1,
    atkMult: 1.0,
    defMult: 1.05,
    speedMult: 1.0,
    elementAffinity: { light: 0.15 }
  },
  berserker: {
    hpMult: 1.1,
    atkMult: 1.25,
    defMult: 0.9,
    speedMult: 1.1,
    elementAffinity: {}
  },
  monk: {
    hpMult: 1.05,
    atkMult: 1.1,
    defMult: 1.0,
    speedMult: 1.2,
    elementAffinity: {}
  },
  assassin: {
    hpMult: 0.9,
    atkMult: 1.3,
    defMult: 0.85,
    speedMult: 1.3,
    elementAffinity: {}
  }
};


// TAG_MODIFIERS (externalized version of the inline logic)

const TAG_MODIFIERS = {
  elite:    { hpMult: 1.25, atkMult: 1.15, defMult: 1.15, speedMult: 1.0 },
  miniboss: { hpMult: 1.5,  atkMult: 1.25, defMult: 1.25, speedMult: 1.0 },
  boss:     { hpMult: 2.0,  atkMult: 1.5,  defMult: 1.5,  speedMult: 1.0 },
  armored:  { hpMult: 1.0,  atkMult: 1.0,  defMult: 1.3,  speedMult: 0.95 },
  flying:   { hpMult: 0.95, atkMult: 1.0,  defMult: 0.9,  speedMult: 1.3 },
  spectral: { hpMult: 0.9,  atkMult: 1.1,  defMult: 0.7,  speedMult: 1.1 },
  giant:    { hpMult: 1.4,  atkMult: 1.1,  defMult: 1.1,  speedMult: 0.9 },
  swarm:    { hpMult: 0.8,  atkMult: 0.8,  defMult: 0.8,  speedMult: 1.1 }
};

function applyTagModifiers(base, tags) {
  let hp = base.hpMax;
  let atk = base.atk;
  let def = base.def;
  let speed = base.speed;
  for (const t of tags) {
    const m = TAG_MODIFIERS[t];
    if (!m) continue;
    if (m.hpMult) hp = Math.floor(hp * m.hpMult);
    if (m.atkMult) atk = Math.floor(atk * m.atkMult);
    if (m.defMult) def = Math.floor(def * m.defMult);
    if (m.speedMult) speed = Math.floor(speed * m.speedMult);
  }
  return { hpMax: hp, atk, def, speed };
}


// ELEMENT MATRIX + HELPERS

const ELEMENT_MATRIX = {
  fire:     { strongAgainst: ["ice", "nature"], weakAgainst: ["water", "earth"] },
  ice:      { strongAgainst: ["nature", "earth"], weakAgainst: ["fire"] },
  water:    { strongAgainst: ["fire"], weakAgainst: ["nature", "lightning"] },
  earth:    { strongAgainst: ["lightning"], weakAgainst: ["ice", "water"] },
  nature:   { strongAgainst: ["water"], weakAgainst: ["fire", "ice"] },
  lightning:{ strongAgainst: ["water"], weakAgainst: ["earth"] },
  light:    { strongAgainst: ["shadow", "void"], weakAgainst: [] },
  shadow:   { strongAgainst: ["light"], weakAgainst: [] },
  arcane:   { strongAgainst: ["all"], weakAgainst: [] },
  poison:   { strongAgainst: ["nature"], weakAgainst: ["earth"] },
  void:     { strongAgainst: ["all"], weakAgainst: ["light"] }
};

function getElementRelation(attackerElement, defenderElement) {
  if (!attackerElement || !defenderElement) return "neutral";
  const data = ELEMENT_MATRIX[attackerElement];
  if (!data) return "neutral";
  if (data.strongAgainst.includes("all") || data.strongAgainst.includes(defenderElement)) return "strong";
  if (data.weakAgainst.includes(defenderElement)) return "weak";
  return "neutral";
}

function getElementMultiplier(attackerElement, defenderElement) {
  const relation = getElementRelation(attackerElement, defenderElement);
  if (relation === "strong") return 1.25;
  if (relation === "weak") return 0.75;
  return 1.0;
}

function applyElementalDamage(baseDamage, attackerAffinity, defenderAffinity, attackerElement, defenderElement) {
  const atkAff = attackerElement ? (attackerAffinity[attackerElement] || 0) : 0;
  const defAff = defenderElement ? (defenderAffinity[defenderElement] || 0) : 0;
  const relationMult = getElementMultiplier(attackerElement, defenderElement);
  const affinityMult = 1 + atkAff - defAff;
  const totalMult = Math.max(0.25, relationMult * affinityMult);
  return Math.max(1, Math.floor(baseDamage * totalMult));
}
