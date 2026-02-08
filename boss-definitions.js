// boss-definitions.js
// Canonical world boss definitions for all regions

import { BOSS_LOOT_TABLES } from "./boss-loot-tables.js";

export const WORLD_BOSSES = {
  // ------------------------------------------------------------
  // FOREST REGION
  // ------------------------------------------------------------
  giant_boar: {
    key: "giant_boar",
    name: "Giant Boar",
    region: "forest",
    element: "nature",
    level: 120,
    awakeningDelayMs: 30 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["giant_boar"],
    phases: [
      {
        name: "Raging Charge",
        abilities: ["boar_charge", "ground_stomp"]
      },
      {
        name: "Frenzied Gore",
        abilities: ["frenzy_swipe", "thornburst"]
      }
    ],
    enrage: {
      threshold: 0.15,
      ability: "nature_overload"
    },
    flavor: "A colossal beast whose fury shakes the forest floor."
  },

  nature_guardian: {
    key: "nature_guardian",
    name: "Nature Guardian",
    region: "forest",
    element: "nature",
    level: 180,
    awakeningDelayMs: 45 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["nature_guardian"],
    phases: [
      {
        name: "Awakening",
        abilities: ["root_snare", "barkshield"]
      },
      {
        name: "Ancient Wrath",
        abilities: ["vine_whip", "forestquake"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "ancient_overgrowth"
    },
    flavor: "An ancient protector awakened by imbalance in the forest."
  },

  // ------------------------------------------------------------
  // PLAINS REGION
  // ------------------------------------------------------------
  centaur_lancer: {
    key: "centaur_lancer",
    name: "Centaur Lancer",
    region: "plains",
    element: "physical",
    level: 200,
    awakeningDelayMs: 45 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["centaur_lancer"],
    phases: [
      {
        name: "Warrior's Charge",
        abilities: ["lance_charge", "hoof_crush"]
      },
      {
        name: "Sunsteel Fury",
        abilities: ["sunsteel_spear", "battle_roar"]
      }
    ],
    enrage: {
      threshold: 0.25,
      ability: "sunsteel_overdrive"
    },
    flavor: "A warlord of the plains, feared for his relentless charges."
  },

  // ------------------------------------------------------------
  // CAVERN / MOUNTAIN REGION
  // ------------------------------------------------------------
  minotaur: {
    key: "minotaur",
    name: "Minotaur",
    region: "cavern",
    element: "earth",
    level: 260,
    awakeningDelayMs: 60 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["minotaur"],
    phases: [
      {
        name: "Labyrinth Guardian",
        abilities: ["earth_shatter", "bull_rush"]
      },
      {
        name: "Stoneblood Rage",
        abilities: ["stonehide", "labyrinth_crush"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "earthquake_rampage"
    },
    flavor: "A towering beast forged in the depths of ancient caverns."
  },

  // ------------------------------------------------------------
  // RUINS / UNDEAD REGION
  // ------------------------------------------------------------
  necromancer_adept: {
    key: "necromancer_adept",
    name: "Necromancer Adept",
    region: "ruins",
    element: "dark",
    level: 300,
    awakeningDelayMs: 45 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["necromancer_adept"],
    phases: [
      {
        name: "Bonecaller",
        abilities: ["summon_skeletons", "dark_bolt"]
      },
      {
        name: "Soulbinder",
        abilities: ["soul_chain", "necrotic_blast"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "deathly_convergence"
    },
    flavor: "A twisted mage who binds souls to fuel forbidden rituals."
  },

  banshee: {
    key: "banshee",
    name: "Banshee",
    region: "ruins",
    element: "spirit",
    level: 320,
    awakeningDelayMs: 45 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["banshee"],
    phases: [
      {
        name: "Wailing Apparition",
        abilities: ["haunting_wail", "spectral_touch"]
      },
      {
        name: "Screaming Tempest",
        abilities: ["soul_scream", "ethereal_blast"]
      }
    ],
    enrage: {
      threshold: 0.15,
      ability: "wail_of_doom"
    },
    flavor: "A tormented spirit whose screams tear through the veil."
  },

  // ------------------------------------------------------------
  // DESERT REGION
  // ------------------------------------------------------------
  serpent_guardian: {
    key: "serpent_guardian",
    name: "Serpent Guardian",
    region: "desert",
    element: "poison",
    level: 350,
    awakeningDelayMs: 60 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["serpent_guardian"],
    phases: [
      {
        name: "Sandcoil",
        abilities: ["venom_spit", "sand_bind"]
      },
      {
        name: "Desert Wrath",
        abilities: ["sandstorm_blast", "toxic_fang"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "dune_serpent_frenzy"
    },
    flavor: "A colossal serpent that slithers beneath the burning sands."
  },

  // ------------------------------------------------------------
  // FIRELANDS REGION
  // ------------------------------------------------------------
  hellhound: {
    key: "hellhound",
    name: "Hellhound",
    region: "firelands",
    element: "fire",
    level: 380,
    awakeningDelayMs: 60 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["hellhound"],
    phases: [
      {
        name: "Infernal Hunt",
        abilities: ["flame_bite", "ember_trail"]
      },
      {
        name: "Blazing Rampage",
        abilities: ["hellfire_burst", "inferno_howl"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "infernal_overdrive"
    },
    flavor: "A beast born of flame, leaving scorched earth in its wake."
  },

  // ------------------------------------------------------------
  // FROSTLANDS REGION
  // ------------------------------------------------------------
  frost_wyrm: {
    key: "frost_wyrm",
    name: "Frost Wyrm",
    region: "frostlands",
    element: "ice",
    level: 420,
    awakeningDelayMs: 75 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["frost_wyrm"],
    phases: [
      {
        name: "Frozen Breath",
        abilities: ["ice_breath", "frostbite"]
      },
      {
        name: "Glacial Terror",
        abilities: ["blizzard_wing", "frozen_spike"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "absolute_zero"
    },
    flavor: "A draconic terror that freezes the land with every wingbeat."
  },

  glacier_titan: {
    key: "glacier_titan",
    name: "Glacier Titan",
    region: "frostlands",
    element: "ice",
    level: 450,
    awakeningDelayMs: 90 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["glacier_titan"],
    phases: [
      {
        name: "Frozen Colossus",
        abilities: ["icequake", "glacial_slam"]
      },
      {
        name: "Permafrost Wrath",
        abilities: ["frostnova", "titan_crush"]
      }
    ],
    enrage: {
      threshold: 0.25,
      ability: "eternal_frost"
    },
    flavor: "A towering construct of ancient ice, slow but unstoppable."
  },

  // ------------------------------------------------------------
  // STORM PEAKS REGION
  // ------------------------------------------------------------
  storm_drake: {
    key: "storm_drake",
    name: "Storm Drake",
    region: "storm_peaks",
    element: "lightning",
    level: 480,
    awakeningDelayMs: 75 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["storm_drake"],
    phases: [
      {
        name: "Tempest Wing",
        abilities: ["lightning_breath", "storm_wing"]
      },
      {
        name: "Thunderous Rage",
        abilities: ["thunder_crash", "tempest_surge"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "storm_overload"
    },
    flavor: "A skyborne terror that commands the fury of storms."
  },

  thunder_colossus: {
    key: "thunder_colossus",
    name: "Thunder Colossus",
    region: "storm_peaks",
    element: "lightning",
    level: 500,
    awakeningDelayMs: 90 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["thunder_colossus"],
    phases: [
      {
        name: "Charged Titan",
        abilities: ["shockwave", "charged_strike"]
      },
      {
        name: "Tempest Core",
        abilities: ["storm_pulse", "thunder_burst"]
      }
    ],
    enrage: {
      threshold: 0.25,
      ability: "storm_titan_overdrive"
    },
    flavor: "A massive construct crackling with boundless lightning."
  },

  // ------------------------------------------------------------
  // VOIDLANDS REGION
  // ------------------------------------------------------------
  void_reaver: {
    key: "void_reaver",
    name: "Void Reaver",
    region: "voidlands",
    element: "void",
    level: 550,
    awakeningDelayMs: 90 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["void_reaver"],
    phases: [
      {
        name: "Reality Tear",
        abilities: ["void_slash", "rift_burst"]
      },
      {
        name: "Abyssal Hunger",
        abilities: ["consume_light", "void_rend"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "nothingness_unbound"
    },
    flavor: "A creature that devours reality itself."
  },

  abyss_watcher: {
    key: "abyss_watcher",
    name: "Abyss Watcher",
    region: "voidlands",
    element: "void",
    level: 580,
    awakeningDelayMs: 90 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["abyss_watcher"],
    phases: [
      {
        name: "Shadowblade",
        abilities: ["shadow_slash", "void_step"]
      },
      {
        name: "Watcher’s Judgment",
        abilities: ["abyssal_gaze", "shadow_burst"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "abyssal_overdrive"
    },
    flavor: "A silent sentinel that judges all who enter the void."
  },

  void_monarch: {
    key: "void_monarch",
    name: "Void Monarch",
    region: "voidlands",
    element: "void",
    level: 620,
    awakeningDelayMs: 120 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["void_monarch"],
    phases: [
      {
        name: "Crown of Shadows",
        abilities: ["monarch_slam", "void_sigil"]
      },
      {
        name: "Singularity Reign",
        abilities: ["gravity_crush", "void_singularity"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "crown_of_oblivion"
    },
    flavor: "A sovereign of the void whose presence bends reality."
  },

  void_leviathan: {
    key: "void_leviathan",
    name: "Void Leviathan",
    region: "voidlands",
    element: "void",
    level: 650,
    awakeningDelayMs: 120 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["void_leviathan"],
    phases: [
      {
        name: "Abyssal Maw",
        abilities: ["void_bite", "abyssal_wave"]
      },
      {
        name: "Cosmic Dread",
        abilities: ["void_torrent", "leviathan_crush"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "abyssal_cataclysm"
    },
    flavor: "A colossal void beast that drifts between dimensions."
  },

  null_eater_sovereignling: {
    key: "null_eater_sovereignling",
    name: "Null-Eater Sovereignling",
    region: "voidlands",
    element: "void",
    level: 600,
    awakeningDelayMs: 120 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["null_eater_sovereignling"],
    phases: [
      {
        name: "Null Pulse",
        abilities: ["null_burst", "void_drain"]
      },
      {
        name: "Entropy Surge",
        abilities: ["entropy_wave", "reality_unmake"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "null_overdrive"
    },
    flavor: "A fragment of a greater void entity, hungry for existence."
  },

  shadow_colossus: {
    key: "shadow_colossus",
    name: "Shadow Colossus",
    region: "voidlands",
    element: "dark",
    level: 580,
    awakeningDelayMs: 90 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["shadow_colossus"],
    phases: [
      {
        name: "Umbra Form",
        abilities: ["shadow_crush", "dark_wave"]
      },
      {
        name: "Eclipse Titan",
        abilities: ["umbra_slam", "shadowquake"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "eternal_nightfall"
    },
    flavor: "A titan forged from pure shadow."
  },

  // ------------------------------------------------------------
  // CELESTIAL REALM
  // ------------------------------------------------------------
  celestial_guardian: {
    key: "celestial_guardian",
    name: "Celestial Guardian",
    region: "celestial",
    element: "holy",
    level: 700,
    awakeningDelayMs: 120 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["celestial_guardian"],
    phases: [
      {
        name: "Radiant Ward",
        abilities: ["holy_blast", "shield_of_light"]
      },
      {
        name: "Judgment Dawn",
        abilities: ["radiant_spear", "sunflare"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "divine_overdrive"
    },
    flavor: "A guardian of the heavens, blazing with holy power."
  },

  celestial_archon: {
    key: "celestial_archon",
    name: "Celestial Archon",
    region: "celestial",
    element: "holy",
    level: 740,
    awakeningDelayMs: 120 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["celestial_archon"],
    phases: [
      {
        name: "Starlit Blade",
        abilities: ["stellar_slash", "radiant_wave"]
      },
      {
        name: "Astral Judgment",
        abilities: ["cosmic_smite", "archon_burst"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "astral_overdrive"
    },
    flavor: "A celestial commander wielding the power of the stars."
  },

  celestial_radiant_tyrant: {
    key: "celestial_radiant_tyrant",
    name: "Radiant Tyrant",
    region: "celestial",
    element: "holy",
    level: 780,
    awakeningDelayMs: 150 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["celestial_radiant_tyrant"],
    phases: [
      {
        name: "Solar Dominion",
        abilities: ["solar_burst", "tyrant_smite"]
      },
      {
        name: "Blinding Ascension",
        abilities: ["sunflare_storm", "radiant_cataclysm"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "solar_overdrive"
    },
    flavor: "A tyrant of pure radiance whose presence scorches the heavens."
  },

  divine_sentinel: {
    key: "divine_sentinel",
    name: "Divine Sentinel",
    region: "celestial",
    element: "holy",
    level: 820,
    awakeningDelayMs: 150 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["divine_sentinel"],
    phases: [
      {
        name: "Sanctified Guard",
        abilities: ["holy_barrier", "judgment_strike"]
      },
      {
        name: "Wrath of the Sentinel",
        abilities: ["divine_sunder", "radiant_wave"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "divine_judgment"
    },
    flavor: "A towering sentinel forged from divine will."
  },

  halo_crest_archsentinel: {
    key: "halo_crest_archsentinel",
    name: "Halo-Crest Archsentinel",
    region: "celestial",
    element: "holy",
    level: 860,
    awakeningDelayMs: 180 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["halo_crest_archsentinel"],
    phases: [
      {
        name: "Halo Guard",
        abilities: ["halo_smite", "radiant_barrier"]
      },
      {
        name: "Archsentinel Ascension",
        abilities: ["sunlance_burst", "halo_overdrive"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "celestial_convergence"
    },
    flavor: "A supreme guardian crowned with a halo of pure light."
  },

  divine_forged_paragon: {
    key: "divine_forged_paragon",
    name: "Divine-Forged Paragon",
    region: "celestial",
    element: "holy",
    level: 900,
    awakeningDelayMs: 180 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["divine_forged_paragon"],
    phases: [
      {
        name: "Paragon's Judgment",
        abilities: ["sunblade_arc", "holy_cleave"]
      },
      {
        name: "Divine Forging",
        abilities: ["radiant_forge", "paragon_smite"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "paragon_overdrive"
    },
    flavor: "A paragon of divine craftsmanship, wielding holy power made manifest."
  },

  // ------------------------------------------------------------
  // PRIMORDIAL GROVE / ARCANE NATURE REGION
  // ------------------------------------------------------------
  verdant_colossus: {
    key: "verdant_colossus",
    name: "Verdant Colossus",
    region: "primordial_grove",
    element: "nature",
    level: 700,
    awakeningDelayMs: 120 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["verdant_colossus"],
    phases: [
      {
        name: "Ancient Growth",
        abilities: ["vine_crush", "barkskin"]
      },
      {
        name: "Grove's Wrath",
        abilities: ["thornstorm", "earthbind"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "primordial_overgrowth"
    },
    flavor: "A colossal guardian born from the heart of the ancient grove."
  },

  primordial_wyrm: {
    key: "primordial_wyrm",
    name: "Primordial Wyrm",
    region: "primordial_grove",
    element: "arcane",
    level: 760,
    awakeningDelayMs: 150 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["primordial_wyrm"],
    phases: [
      {
        name: "Arcane Roots",
        abilities: ["arcane_breath", "mana_spike"]
      },
      {
        name: "Worldroot Ascendant",
        abilities: ["rootflare", "arcane_overgrowth"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "worldroot_cataclysm"
    },
    flavor: "A wyrm infused with the primal arcane essence of the worldroot."
  },

  // ------------------------------------------------------------
  // ASTRAL REALM
  // ------------------------------------------------------------
  astral_sovereign: {
    key: "astral_sovereign",
    name: "Astral Sovereign",
    region: "astral_realm",
    element: "arcane",
    level: 900,
    awakeningDelayMs: 180 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["astral_sovereign"],
    phases: [
      {
        name: "Cosmic Pulse",
        abilities: ["astral_burst", "starfall"]
      },
      {
        name: "Sovereign of the Stars",
        abilities: ["cosmic_rend", "astral_collapse"]
      }
    ],
    enrage: {
      threshold: 0.20,
      ability: "supernova"
    },
    flavor: "A ruler of the astral plane, wielding the power of collapsing stars."
  },

  // ------------------------------------------------------------
  // CATACLYSM ZONE
  // ------------------------------------------------------------
  apocalypse_crowned_worldrender: {
    key: "apocalypse_crowned_worldrender",
    name: "Apocalypse-Crowned Worldrender",
    region: "cataclysm",
    element: "void",
    level: 1000,
    awakeningDelayMs: 240 * 60 * 1000,
    lootTable: BOSS_LOOT_TABLES["apocalypse_crowned_worldrender"],
    phases: [
      {
        name: "Cataclysmic Awakening",
        abilities: ["voidquake", "apocalypse_burst"]
      },
      {
        name: "Worldrender Ascendant",
        abilities: ["reality_fracture", "cataclysm_wave"]
      }
    ],
    enrage: {
      threshold: 0.25,
      ability: "end_of_all_things"
    },
    flavor: "A world-ending titan whose awakening signals the collapse of reality."
  }
};
