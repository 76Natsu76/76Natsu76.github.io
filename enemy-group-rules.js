// enemy_group_rules.js
// Region‑themed enemy groups (Option C)

export const ENEMY_GROUP_RULES = {
  forest: {
    basic: ["beast", "slimeborn", "humanoid"],
    elite: ["druid", "shaman", "fae", "ranger"],
    boss: ["colossus", "titan", "nature_colossus"]
  },

  plains: {
    basic: ["humanoid", "beast"],
    elite: ["warrior", "archer", "ranger"],
    boss: ["giantkin", "titan"]
  },

  swamp: {
    basic: ["slimeborn", "undead", "beast"],
    elite: ["witch", "warlock", "necromancer"],
    boss: ["aberration", "amorphous", "parasite"]
  },

  cavern: {
    basic: ["slimeborn", "beast", "humanoid"],
    elite: ["miner", "construct", "elemental"],
    boss: ["colossus", "eldritch"]
  },

  ruins: {
    basic: ["undead", "humanoid"],
    elite: ["ritualist", "necromancer", "witch"],
    boss: ["mythic_undead", "aberration"]
  },

  trainers_city: {
    basic: ["humanoid"],
    elite: ["monk", "assassin", "paladin", "archer", "warrior"],
    boss: ["paragon"]
  },

  verdant_wildwood: {
    basic: ["beast", "plant", "fae"],
    elite: ["druid", "shaman", "nature_guardian"],
    boss: ["verdant_colossus_family"]
  },

  outcast_island: {
    basic: ["undead", "warlock", "assassin"],
    elite: ["void", "demon", "necromancer"],
    boss: ["abyssal_brute_family", "eldritch"]
  },

  desert: {
    basic: ["beast", "humanoid"],
    elite: ["fire_elemental", "chaosborn"],
    boss: ["dragon", "mythic_beast"]
  },

  mountains: {
    basic: ["beast", "humanoid"],
    elite: ["elemental", "construct"],
    boss: ["colossus", "titan"]
  },

  tundra: {
    basic: ["undead", "beast"],
    elite: ["ice_elemental", "wind_elemental"],
    boss: ["glacier_titan"]
  },

  spirit_kingdom: {
    basic: ["spirit", "elemental"],
    elite: ["astral_family", "arcane"],
    boss: ["divinity", "paragon"]
  },

  arcstone_enclave: {
    basic: ["arcane", "witch"],
    elite: ["ritualist", "astral_family"],
    boss: ["primordial"]
  },

  abyssal_scar: {
    basic: ["demon", "void"],
    elite: ["abyssal_brute_family", "eldritch"],
    boss: ["outer_god"]
  },

  void: {
    basic: ["void", "parasite"],
    elite: ["hivemind", "eldritch"],
    boss: ["void_god", "outer_god"]
  },

  molten_underdeep: {
    basic: ["fire_elemental", "chaosborn"],
    elite: ["demon", "dragon"],
    boss: ["worldrender_family"]
  },

  celestial: {
    basic: ["celestial"],
    elite: ["divinity"],
    boss: ["god"]
  },

  celestial_expanse: {
    basic: ["celestial"],
    elite: ["divinity", "paragon"],
    boss: ["multiversal_paragon"]
  },

  arcane_rift: {
    basic: ["arcane", "astral"],
    elite: ["primordial", "eldritch"],
    boss: ["outer_god"]
  },

  emberfang_ridge: {
    basic: ["fire_elemental"],
    elite: ["chaosborn"],
    boss: ["thunder_colossus"]
  },

  stormforge_sanctum: {
    basic: ["elemental"],
    elite: ["colossus", "titan"],
    boss: ["storm_titan"]
  },

  titanfall: {
    basic: ["giantkin"],
    elite: ["colossus", "titan"],
    boss: ["world_titan"]
  },

  void_frontier: {
    basic: ["void", "undead"],
    elite: ["colossus", "titan"],
    boss: ["void_monarch"]
  },

  shadow_labyrinth: {
    basic: ["undead", "void"],
    elite: ["assassin", "necromancer"],
    boss: ["death_knight"]
  },

  eternal_citadel: {
    basic: ["celestial"],
    elite: ["divinity"],
    boss: ["paragon"]
  },

  radiant_ascension_spire: {
    basic: ["celestial"],
    elite: ["divinity"],
    boss: ["god"]
  },

  seraphic_crucible: {
    basic: ["celestial"],
    elite: ["divinity", "paragon"],
    boss: ["multiversal_paragon"]
  },

  elderwood_heart: {
    basic: ["plant", "beast"],
    elite: ["druid", "shaman"],
    boss: ["verdant_colossus_family"]
  },

  primeval_overgrowth: {
    basic: ["plant", "beast"],
    elite: ["druid", "nature_guardian"],
    boss: ["sylvan_apex_behemoth"]
  },

  celestial_horizon: {
    basic: ["celestial"],
    elite: ["divinity", "paragon"],
    boss: ["multiversal_paragon"]
  },

  worlds_end_expanse: {
    basic: ["void", "demon"],
    elite: ["god", "outer_god"],
    boss: ["cosmic_crowned_terminarch"]
  },

  astral_nexus: {
    basic: ["astral", "arcane"],
    elite: ["eldritch", "primordial"],
    boss: ["outer_god", "multiversal_paragon"]
  }
};
