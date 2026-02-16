export const SUBRACE_IDENTITY = {

  /* ============================================================
     HUMANOID
  ============================================================ */
  "human": {
    statMods: { hp: 0, atk: 0, def: 0, spd: 0 },
    resistances: [],
    weaknesses: [],
    behavior: ["adaptive", "tactical"],
    lootBias: { gold: +10, gear: +5 },
    flavor: "Versatile and resourceful, humans adapt to any battlefield."
  },

  "elf": {
    statMods: { hp: -5, atk: +5, def: 0, spd: +10 },
    resistances: ["nature", "light"],
    weaknesses: ["poison"],
    behavior: ["precise", "graceful"],
    lootBias: { gear: +10, magic: +5 },
    flavor: "Graceful and attuned to magic, elves strike with elegance."
  },

  "dwarf": {
    statMods: { hp: +10, atk: +5, def: +10, spd: -10 },
    resistances: ["earth", "metal"],
    weaknesses: ["lightning"],
    behavior: ["stubborn", "unyielding"],
    lootBias: { metal: +15, gear: +10 },
    flavor: "Stout and resilient, dwarves endure where others fall."
  },

  "orc": {
    statMods: { hp: +15, atk: +10, def: 0, spd: -5 },
    resistances: ["poison"],
    weaknesses: ["holy"],
    behavior: ["aggressive", "relentless"],
    lootBias: { gear: +5, materials: +10 },
    flavor: "Savage and powerful, orcs overwhelm foes with brute force."
  },

  /* ============================================================
     BEAST / ANIMAL
  ============================================================ */
  "beast": {
    statMods: { hp: +10, atk: +10, def: +5, spd: 0 },
    resistances: ["nature"],
    weaknesses: ["fire"],
    behavior: ["instinctive", "territorial"],
    lootBias: { materials: +15 },
    flavor: "A wild creature driven by instinct and survival."
  },

  "dire-beast": {
    statMods: { hp: +20, atk: +15, def: +10, spd: -5 },
    resistances: ["nature"],
    weaknesses: ["fire", "ice"],
    behavior: ["savage", "dominant"],
    lootBias: { materials: +20 },
    flavor: "A massive, terrifying beast of primal fury."
  },

  "spirit-beast": {
    statMods: { hp: 0, atk: +10, def: 0, spd: +10 },
    resistances: ["spirit", "dark"],
    weaknesses: ["holy"],
    behavior: ["ethereal", "haunting"],
    lootBias: { spirit: +15 },
    flavor: "A spectral creature bound to the spirit realm."
  },

  /* ============================================================
     UNDEAD
  ============================================================ */
  "skeleton": {
    statMods: { hp: -10, atk: +5, def: 0, spd: +5 },
    resistances: ["dark", "poison"],
    weaknesses: ["holy", "blunt"],
    behavior: ["mindless", "swarming"],
    lootBias: { bones: +20 },
    flavor: "A reanimated skeleton animated by necrotic energy."
  },

  "ghoul": {
    statMods: { hp: +10, atk: +10, def: 0, spd: 0 },
    resistances: ["dark", "poison"],
    weaknesses: ["holy", "fire"],
    behavior: ["ravenous", "feral"],
    lootBias: { flesh: +20 },
    flavor: "A ravenous undead creature hungry for flesh."
  },

  "wraith": {
    statMods: { hp: -20, atk: +15, def: -10, spd: +20 },
    resistances: ["dark", "void"],
    weaknesses: ["holy", "light"],
    behavior: ["ethereal", "haunting"],
    lootBias: { spirit: +20 },
    flavor: "A spectral undead that phases through matter to strike."
  },

  "lich": {
    statMods: { hp: -10, atk: +25, def: 0, spd: -5 },
    resistances: ["dark", "arcane"],
    weaknesses: ["holy"],
    behavior: ["commanding", "ritualistic"],
    lootBias: { magic: +25 },
    flavor: "An ancient undead sorcerer wielding forbidden magic."
  },

  /* ============================================================
     CONSTRUCT / ARTIFICIAL
  ============================================================ */
  "golem": {
    statMods: { hp: +30, atk: 0, def: +30, spd: -20 },
    resistances: ["earth", "metal"],
    weaknesses: ["lightning", "arcane"],
    behavior: ["slow", "unmoving"],
    lootBias: { metal: +20, cores: +10 },
    flavor: "A hulking construct of stone and magic."
  },

  "automaton": {
    statMods: { hp: +10, atk: +15, def: +5, spd: 0 },
    resistances: ["metal"],
    weaknesses: ["lightning"],
    behavior: ["mechanical", "precise"],
    lootBias: { metal: +15, gears: +10 },
    flavor: "A mechanical warrior built for efficiency."
  },

  "arcane-construct": {
    statMods: { hp: +10, atk: +20, def: +10, spd: -10 },
    resistances: ["arcane"],
    weaknesses: ["void"],
    behavior: ["programmed", "arcane"],
    lootBias: { magic: +20 },
    flavor: "A magical construct powered by pure arcane energy."
  },

  /* ============================================================
     SPIRIT / ETHEREAL
  ============================================================ */
  "spirit": {
    statMods: { hp: -10, atk: +10, def: -10, spd: +15 },
    resistances: ["spirit", "dark"],
    weaknesses: ["holy"],
    behavior: ["haunting", "ethereal"],
    lootBias: { spirit: +20 },
    flavor: "An ethereal being bound to the spiritual realm."
  },

  "ancestral-spirit": {
    statMods: { hp: 0, atk: +15, def: 0, spd: +10 },
    resistances: ["spirit", "light"],
    weaknesses: ["void"],
    behavior: ["protective", "ritualistic"],
    lootBias: { spirit: +25 },
    flavor: "A guardian spirit echoing ancient memories."
  },

  /* ============================================================
     VOID / ELDRITCH
  ============================================================ */
  "voidborn": {
    statMods: { hp: 0, atk: +20, def: -5, spd: +10 },
    resistances: ["void", "dark"],
    weaknesses: ["holy", "cosmic"],
    behavior: ["corruptive", "unpredictable"],
    lootBias: { void: +20 },
    flavor: "A creature warped by the emptiness between worlds."
  },

  "eldritch": {
    statMods: { hp: +10, atk: +25, def: +10, spd: 0 },
    resistances: ["void", "cosmic"],
    weaknesses: ["holy"],
    behavior: ["mind-breaking", "aberrant"],
    lootBias: { void: +25, cosmic: +15 },
    flavor: "A nightmare entity that distorts reality itself."
  },

  /* ============================================================
     SLIME / OOZE
  ============================================================ */
  "slime": {
    statMods: { hp: +15, atk: +5, def: +10, spd: -10 },
    resistances: ["poison", "water"],
    weaknesses: ["fire", "ice"],
    behavior: ["amorphous", "splitting"],
    lootBias: { ooze: +20 },
    flavor: "A gelatinous creature that engulfs anything in its path."
  },

  "acid-slime": {
    statMods: { hp: +10, atk: +10, def: 0, spd: -5 },
    resistances: ["poison"],
    weaknesses: ["ice"],
    behavior: ["corrosive", "melting"],
    lootBias: { ooze: +25 },
    flavor: "A corrosive ooze that melts armor and flesh alike."
  }

}; // END SUBRACE_IDENTITY
