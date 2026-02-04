export const ENEMY_FAMILIES = {
  // =========================
  // HUMANOID / CIVILIZED
  // =========================
  elf: {
    key: "elf",
    tier: 1,
    baseHP: 95,
    baseATK: 12,
    baseDEF: 7,
    elementAffinity: { arcane: 0.10, nature: 0.10 },
    behavior: "skirmisher",
    flavor: "Graceful, long‑lived humanoids attuned to magic and nature.",
    familyModifiers: {
      hpMult: 0.95,
      atkMult: 1.10,
      defMult: 0.95,
      speedBias: 0.10,
      notes: "Agile and precise, but physically frail."
    }
  },

  dwarf: {
    key: "dwarf",
    tier: 1,
    baseHP: 115,
    baseATK: 11,
    baseDEF: 11,
    elementAffinity: { earth: 0.15, fire: 0.05 },
    behavior: "defensive",
    flavor: "Stout, resilient folk hardened by stone, steel, and deep places.",
    familyModifiers: {
      hpMult: 1.10,
      atkMult: 1.0,
      defMult: 1.15,
      speedBias: -0.05,
      notes: "High durability, low mobility."
    }
  },

  orc: {
    key: "orc",
    tier: 1,
    baseHP: 120,
    baseATK: 13,
    baseDEF: 8,
    elementAffinity: { fire: 0.05 },
    behavior: "aggressive",
    flavor: "Brutal warriors driven by strength, fury, and tribal honor.",
    familyModifiers: {
      hpMult: 1.10,
      atkMult: 1.15,
      defMult: 0.95,
      speedBias: 0.05,
      notes: "Hit hard, soak damage, but lack finesse."
    }
  },

  goblinoid: {
    key: "goblinoid",
    tier: 1,
    baseHP: 85,
    baseATK: 11,
    baseDEF: 7,
    elementAffinity: {},
    behavior: "skirmisher",
    flavor: "Cunning, opportunistic raiders who rely on numbers and dirty tricks.",
    familyModifiers: {
      hpMult: 0.95,
      atkMult: 1.05,
      defMult: 0.95,
      speedBias: 0.10,
      notes: "Fragile but numerous and crafty."
    }
  },

  beastkin: {
    key: "beastkin",
    tier: 1,
    baseHP: 105,
    baseATK: 12,
    baseDEF: 8,
    elementAffinity: { nature: 0.10 },
    behavior: "aggressive",
    flavor: "Humanoids with bestial traits, instincts, and heightened senses.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.10,
      defMult: 1.0,
      speedBias: 0.05,
      notes: "Blend humanoid tactics with animal ferocity."
    }
  },

  draconian: {
    key: "draconian",
    tier: 2,
    baseHP: 130,
    baseATK: 15,
    baseDEF: 12,
    elementAffinity: { fire: 0.15, arcane: 0.10 },
    behavior: "dominant",
    flavor: "Dragon‑blooded humanoids wielding elemental breath and scaled resilience.",
    familyModifiers: {
      hpMult: 1.10,
      atkMult: 1.20,
      defMult: 1.10,
      speedBias: 0.0,
      notes: "Miniature dragons in humanoid form."
    }
  },

  // =========================
  // UNDEAD / SUPERNATURAL
  // =========================
  lich: {
    key: "lich",
    tier: 3,
    baseHP: 140,
    baseATK: 18,
    baseDEF: 14,
    elementAffinity: { dark: 0.25, rot: 0.15, holy: 0.20 },
    behavior: "caster",
    flavor: "Undead archmages who traded mortality for eternal, forbidden power.",
    familyModifiers: {
      hpMult: 1.10,
      atkMult: 1.30,
      defMult: 1.10,
      speedBias: 0.0,
      notes: "High magic damage, strong anti‑life effects, vulnerable to holy."
    }
  },

  supernatural: {
    key: "supernatural",
    tier: 2,
    baseHP: 110,
    baseATK: 12,
    baseDEF: 9,
    elementAffinity: { arcane: 0.10, dark: 0.10 },
    behavior: "ethereal",
    flavor: "Beings that exist partially outside the mortal plane.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.05,
      defMult: 1.0,
      evasionBias: 0.10,
      notes: "Hard to pin down, often with mixed magical effects."
    }
  },

  // =========================
  // BESTIAL / MYTHIC
  // =========================
  chimera: {
    key: "chimera",
    tier: 2,
    baseHP: 140,
    baseATK: 17,
    baseDEF: 12,
    elementAffinity: { fire: 0.10, poison: 0.10 },
    behavior: "aggressive",
    flavor: "Hybrid beasts stitched from multiple predators and elemental traits.",
    familyModifiers: {
      hpMult: 1.10,
      atkMult: 1.20,
      defMult: 1.0,
      speedBias: 0.0,
      notes: "Unpredictable attack patterns and mixed damage types."
    }
  },

  dragonkin: {
    key: "dragonkin",
    tier: 2,
    baseHP: 135,
    baseATK: 16,
    baseDEF: 13,
    elementAffinity: { fire: 0.15, arcane: 0.10 },
    behavior: "dominant",
    flavor: "Lesser draconic beasts and kin of true dragons.",
    familyModifiers: {
      hpMult: 1.05,
      atkMult: 1.20,
      defMult: 1.05,
      speedBias: 0.0,
      notes: "Strong, proud, and elementally aligned."
    }
  },

  wyrm: {
    key: "wyrm",
    tier: 3,
    baseHP: 170,
    baseATK: 20,
    baseDEF: 16,
    elementAffinity: { ice: 0.10, dark: 0.10 },
    behavior: "feral",
    flavor: "Ancient serpentine dragons steeped in primordial magic.",
    familyModifiers: {
      hpMult: 1.20,
      atkMult: 1.25,
      defMult: 1.15,
      speedBias: -0.05,
      notes: "Slower but more ancient and brutal than lesser dragons."
    }
  },

  cosmic_fauna: {
    key: "cosmic_fauna",
    tier: 4,
    baseHP: 180,
    baseATK: 18,
    baseDEF: 16,
    elementAffinity: { arcane: 0.20, holy: 0.10 },
    behavior: "drifting",
    flavor: "Beasts that roam the void between stars, feeding on starlight and ether.",
    familyModifiers: {
      hpMult: 1.15,
      atkMult: 1.10,
      defMult: 1.10,
      speedBias: 0.05,
      notes: "Strange movement patterns and cosmic resistances."
    }
  },

  // =========================
  // TECH / MACHINE
  // =========================
  techborn: {
    key: "techborn",
    tier: 3,
    baseHP: 130,
    baseATK: 16,
    baseDEF: 14,
    elementAffinity: { lightning: 0.20, arcane: 0.10 },
    behavior: "mechanical",
    flavor: "Beings enhanced or created by advanced technology and arcane machinery.",
    familyModifiers: {
      hpMult: 1.05,
      atkMult: 1.15,
      defMult: 1.10,
      speedBias: 0.05,
      notes: "Synergize with machines and energy fields."
    }
  },

  machina: {
    key: "machina",
    tier: 3,
    baseHP: 150,
    baseATK: 17,
    baseDEF: 18,
    elementAffinity: { lightning: -0.15 },
    behavior: "mechanical",
    flavor: "Fully artificial war machines built for relentless efficiency.",
    familyModifiers: {
      hpMult: 1.20,
      atkMult: 1.10,
      defMult: 1.25,
      statusEffectImmunity: true,
      notes: "High armor, status‑immune, but vulnerable to lightning."
    }
  },

  // =========================
  // PLANAR / OUTER
  // =========================
  fiend: {
    key: "fiend",
    tier: 3,
    baseHP: 150,
    baseATK: 19,
    baseDEF: 15,
    elementAffinity: { fire: 0.20, dark: 0.20 },
    behavior: "aggressive",
    flavor: "Infernal entities born of hellish realms and endless malice.",
    familyModifiers: {
      hpMult: 1.10,
      atkMult: 1.25,
      defMult: 1.10,
      speedBias: 0.0,
      notes: "Stronger, more elite cousins of demons."
    }
  },

  planar_entity: {
    key: "planar_entity",
    tier: 3,
    baseHP: 135,
    baseATK: 16,
    baseDEF: 13,
    elementAffinity: { arcane: 0.15 },
    behavior: "unpredictable",
    flavor: "Beings native to other planes, shaped by alien laws of reality.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.10,
      defMult: 1.05,
      notes: "Planar traits vary; baseline leans toward magic and resistances."
    }
  },

  ethereal: {
    key: "ethereal",
    tier: 3,
    baseHP: 110,
    baseATK: 15,
    baseDEF: 8,
    elementAffinity: { arcane: 0.20, holy: -0.10 },
    behavior: "ethereal",
    flavor: "Creatures half‑phased into the Ethereal, slipping through matter and time.",
    familyModifiers: {
      hpMult: 0.95,
      atkMult: 1.15,
      defMult: 0.9,
      evasionBias: 0.20,
      notes: "Hard to hit, but fragile when pinned down."
    }
  },

  celestialborn: {
    key: "celestialborn",
    tier: 3,
    baseHP: 150,
    baseATK: 17,
    baseDEF: 16,
    elementAffinity: { holy: 0.25, arcane: 0.10 },
    behavior: "defensive",
    flavor: "Mortals infused with celestial essence and radiant purpose.",
    familyModifiers: {
      hpMult: 1.10,
      atkMult: 1.10,
      defMult: 1.15,
      notes: "Holy‑aligned, resilient, and disciplined."
    }
  },

  demonborn: {
    key: "demonborn",
    tier: 3,
    baseHP: 145,
    baseATK: 18,
    baseDEF: 14,
    elementAffinity: { fire: 0.20, dark: 0.15 },
    behavior: "aggressive",
    flavor: "Mortals tainted or empowered by infernal bloodlines.",
    familyModifiers: {
      hpMult: 1.05,
      atkMult: 1.20,
      defMult: 1.0,
      notes: "High aggression, strong dark/fire synergy."
    }
  },

  voidborn: {
    key: "voidborn",
    tier: 4,
    baseHP: 150,
    baseATK: 18,
    baseDEF: 15,
    elementAffinity: { dark: 0.20, arcane: 0.10 },
    behavior: "entropy",
    flavor: "Creatures whose essence is shaped by the emptiness between worlds.",
    familyModifiers: {
      hpMult: 1.10,
      atkMult: 1.15,
      defMult: 1.10,
      notes: "Warp reality, resist many mundane effects."
    }
  },

  spiritborn: {
    key: "spiritborn",
    tier: 2,
    baseHP: 105,
    baseATK: 13,
    baseDEF: 8,
    elementAffinity: { arcane: 0.10, nature: 0.10 },
    behavior: "ethereal",
    flavor: "Mortals deeply bound to spirits, ancestors, or elemental forces.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.05,
      defMult: 1.0,
      notes: "Blend physical and spiritual combat styles."
    }
  },

  elementalborn: {
    key: "elementalborn",
    tier: 2,
    baseHP: 115,
    baseATK: 14,
    baseDEF: 10,
    elementAffinity: { fire: 0.10, ice: 0.10, lightning: 0.10, earth: 0.10, water: 0.10 },
    behavior: "unpredictable",
    flavor: "Mortals whose blood carries the spark of elemental planes.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.10,
      defMult: 1.0,
      notes: "Element‑aligned attacks and resistances."
    }
  },

  titanborn: {
    key: "titanborn",
    tier: 3,
    baseHP: 170,
    baseATK: 18,
    baseDEF: 16,
    elementAffinity: { earth: 0.15, arcane: 0.10 },
    behavior: "brutal",
    flavor: "Descendants of titans, carrying fragments of colossal might.",
    familyModifiers: {
      hpMult: 1.15,
      atkMult: 1.15,
      defMult: 1.15,
      speedBias: -0.05,
      notes: "Heavy‑hitting, durable, slightly slow."
    }
  },

  divine_beast: {
    key: "divine_beast",
    tier: 4,
    baseHP: 180,
    baseATK: 19,
    baseDEF: 17,
    elementAffinity: { holy: 0.20, nature: 0.10 },
    behavior: "dominant",
    flavor: "Sacred beasts blessed by gods or born from divine realms.",
    familyModifiers: {
      hpMult: 1.20,
      atkMult: 1.20,
      defMult: 1.15,
      notes: "Blend mythic beast power with divine resilience."
    }
  },

  // =========================
  // COSMIC / TITANIC
  // =========================
  cosmic_entity: {
    key: "cosmic_entity",
    tier: 5,
    baseHP: 260,
    baseATK: 24,
    baseDEF: 22,
    elementAffinity: { holy: 0.20, arcane: 0.20 },
    behavior: "cosmic",
    flavor: "A being of pure cosmic divinity, transcending mortal comprehension.",
    familyModifiers: {
      hpMult: 1.40,
      atkMult: 1.40,
      defMult: 1.35,
      speedBias: 0.05,
      notes: "Divine‑cosmic hybrid; overwhelming stats and resistances."
    }
  },

  astral_horror: {
    key: "astral_horror",
    tier: 5,
    baseHP: 240,
    baseATK: 23,
    baseDEF: 20,
    elementAffinity: { arcane: 0.25, dark: 0.15 },
    behavior: "chaotic",
    flavor: "Nightmare shapes birthed from the Astral Sea and fractured thought.",
    familyModifiers: {
      hpMult: 1.30,
      atkMult: 1.35,
      defMult: 1.25,
      notes: "Reality‑warping attacks, strong mental and arcane pressure."
    }
  },

  titanic_beast: {
    key: "titanic_beast",
    tier: 4,
    baseHP: 260,
    baseATK: 22,
    baseDEF: 22,
    elementAffinity: { nature: 0.15, earth: 0.15 },
    behavior: "colossal",
    flavor: "World‑shaking beasts whose steps reshape the land.",
    familyModifiers: {
      hpMult: 1.40,
      atkMult: 1.25,
      defMult: 1.35,
      speedBias: -0.10,
      notes: "Slow but devastating, with massive AoE attacks."
    }
  },

  world_titan_family: {
    key: "world_titan_family",
    tier: 5,
    baseHP: 300,
    baseATK: 26,
    baseDEF: 24,
    elementAffinity: { earth: 0.25, arcane: 0.15 },
    behavior: "cataclysmic",
    flavor: "Titans whose very existence is bound to continents, storms, or oceans.",
    familyModifiers: {
      hpMult: 1.50,
      atkMult: 1.35,
      defMult: 1.40,
      speedBias: -0.15,
      notes: "Raid‑boss scale; reshape terrain and weather."
    }
  },

  worldbreaker: {
    key: "worldbreaker",
    tier: 6,
    baseHP: 340,
    baseATK: 30,
    baseDEF: 28,
    elementAffinity: { chaos: 0.25, earth: 0.20 },
    behavior: "cataclysmic",
    flavor: "Apocalyptic forces whose purpose is to unmake worlds.",
    familyModifiers: {
      hpMult: 1.70,
      atkMult: 1.60,
      defMult: 1.55,
      speedBias: 0.0,
      notes: "End‑tier threats; catastrophic AoE and phase‑changing mechanics."
    }
  },

  // =========================
  // META / CONCEPTUAL / NARRATIVE
  // =========================
  cosmic_construct: {
    key: "cosmic_construct",
    tier: 5,
    baseHP: 220,
    baseATK: 20,
    baseDEF: 22,
    elementAffinity: { arcane: 0.20, lightning: 0.10 },
    behavior: "mechanical",
    flavor: "Machines built to operate on a cosmic scale, maintaining or disrupting reality.",
    familyModifiers: {
      hpMult: 1.30,
      atkMult: 1.20,
      defMult: 1.35,
      notes: "Blend construct durability with cosmic effects."
    }
  },

  living_location: {
    key: "living_location",
    tier: 5,
    baseHP: 320,
    baseATK: 18,
    baseDEF: 26,
    elementAffinity: { earth: 0.25, arcane: 0.15 },
    behavior: "ancient",
    flavor: "Places that have awakened into full sentience and will.",
    familyModifiers: {
      hpMult: 1.80,
      atkMult: 1.0,
      defMult: 1.60,
      notes: "Immense HP and defense; attack through environmental hazards."
    }
  },

  artificial_life: {
    key: "artificial_life",
    tier: 4,
    baseHP: 160,
    baseATK: 16,
    baseDEF: 16,
    elementAffinity: { lightning: 0.15, arcane: 0.10 },
    behavior: "adaptive",
    flavor: "Created beings whose minds and bodies evolve beyond their original design.",
    familyModifiers: {
      hpMult: 1.15,
      atkMult: 1.10,
      defMult: 1.10,
      notes: "Adaptive behaviors, scaling threat over time."
    }
  },

  temporal_entity: {
    key: "temporal_entity",
    tier: 5,
    baseHP: 200,
    baseATK: 19,
    baseDEF: 18,
    elementAffinity: { arcane: 0.20 },
    behavior: "unpredictable",
    flavor: "Creatures unmoored from linear time, flickering across moments.",
    familyModifiers: {
      hpMult: 1.20,
      atkMult: 1.15,
      defMult: 1.15,
      evasionBias: 0.20,
      notes: "Time‑skipping, turn‑order manipulation, delayed effects."
    }
  },

  meta_entity: {
    key: "meta_entity",
    tier: 6,
    baseHP: 220,
    baseATK: 22,
    baseDEF: 20,
    elementAffinity: { arcane: 0.25 },
    behavior: "chaotic",
    flavor: "Beings aware of stories, rules, and the edges of reality itself.",
    familyModifiers: {
      hpMult: 1.30,
      atkMult: 1.30,
      defMult: 1.20,
      notes: "Break normal rules; may alter combat systems or UI."
    }
  },

  narrative_construct: {
    key: "narrative_construct",
    tier: 5,
    baseHP: 190,
    baseATK: 18,
    baseDEF: 18,
    elementAffinity: { arcane: 0.20 },
    behavior: "scripted",
    flavor: "Entities formed from stories, tropes, and narrative expectations.",
    familyModifiers: {
      hpMult: 1.15,
      atkMult: 1.10,
      defMult: 1.15,
      notes: "Behaviors tied to narrative beats or player actions."
    }
  },

  emotional: {
    key: "emotional",
    tier: 4,
    baseHP: 160,
    baseATK: 17,
    baseDEF: 15,
    elementAffinity: { arcane: 0.15 },
    behavior: "volatile",
    flavor: "Manifestations of pure feelings, from wrath to serenity.",
    familyModifiers: {
      hpMult: 1.10,
      atkMult: 1.15,
      defMult: 1.05,
      notes: "Apply mood‑based buffs/debuffs; swingy combat patterns."
    }
  },

  paradox_god: {
    key: "paradox_god",
    tier: 7,
    baseHP: 360,
    baseATK: 30,
    baseDEF: 30,
    elementAffinity: { arcane: 0.30, chaos: 0.30 },
    behavior: "cosmic",
    flavor: "Divinities born from contradictions, impossible truths, and broken causality.",
    familyModifiers: {
      hpMult: 1.80,
      atkMult: 1.70,
      defMult: 1.70,
      notes: "End‑tier, reality‑breaking bosses; ignore many normal rules."
    }
  },

  legendary_boss_template: {
    key: "legendary_boss_template",
    tier: 6,
    baseHP: 280,
    baseATK: 24,
    baseDEF: 24,
    elementAffinity: {},
    behavior: "cataclysmic",
    flavor: "A template for legendary encounters that define eras and stories.",
    familyModifiers: {
      hpMult: 1.60,
      atkMult: 1.50,
      defMult: 1.50,
      notes: "Baseline for raid‑level or seasonal bosses."
    }
  },

  hybrid: {
    key: "hybrid",
    tier: 3,
    baseHP: 135,
    baseATK: 15,
    baseDEF: 13,
    elementAffinity: {},
    behavior: "unpredictable",
    flavor: "Cross‑bred or fused beings that defy simple classification.",
    familyModifiers: {
      hpMult: 1.05,
      atkMult: 1.10,
      defMult: 1.05,
      notes: "Flexible, mixed traits from multiple families."
    }
  },

  forgotten_race: {
    key: "forgotten_race",
    tier: 4,
    baseHP: 170,
    baseATK: 17,
    baseDEF: 17,
    elementAffinity: { arcane: 0.15 },
    behavior: "ancient",
    flavor: "Peoples erased from history, lingering only in ruins and whispers.",
    familyModifiers: {
      hpMult: 1.20,
      atkMult: 1.10,
      defMult: 1.15,
      notes: "Rare, lore‑heavy encounters with unique mechanics."
    }
  },
  
  humanoid: {
    key: "humanoid",
    tier: 1,
    baseHP: 100,
    baseATK: 10,
    baseDEF: 8,
    elementAffinity: {},
    behavior: "balanced",
    flavor: "Standard mortal foes with adaptable tactics and varied combat styles.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.0,
      speedBias: 0.0,
      notes: "Versatile and predictable; no inherent strengths or weaknesses."
    }
  },

  beast: {
    key: "beast",
    tier: 1,
    baseHP: 120,
    baseATK: 12,
    baseDEF: 6,
    elementAffinity: { nature: 0.10 },
    behavior: "aggressive",
    flavor: "Instinct-driven creatures that rely on feral strength and speed.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.10,
      defMult: 1.0,
      speedBias: 0.05,
      notes: "Savage and instinctive, beasts strike quickly and hard."
    }
  },

  plantfolk: {
    key: "plantfolk",
    tier: 1,
    baseHP: 130,
    baseATK: 9,
    baseDEF: 10,
    elementAffinity: { nature: 0.20, fire: -0.20 },
    behavior: "defensive",
    flavor: "Living plant creatures with durable bodies and slow, deliberate movements.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 0.95,
      defMult: 1.15,
      statusEffectChanceMult: 1.10,
      notes: "Resilient but slow; often inflict nature-based debuffs."
    }
  },

  slimeborn: {
    key: "slimeborn",
    tier: 1,
    baseHP: 140,
    baseATK: 8,
    baseDEF: 12,
    elementAffinity: { poison: 0.15, acid: 0.20 },
    behavior: "unpredictable",
    flavor: "Amorphous creatures with high resilience and unusual attack patterns.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 0.9,
      defMult: 1.20,
      notes: "Slimes absorb damage well but hit lightly; often resistant to physical harm."
    }
  },

  slime: {
    key: "slime",
    tier: 1,
    baseHP: 120,
    baseATK: 8,
    baseDEF: 10,
    elementAffinity: { poison: 0.10, acid: 0.10 },
    behavior: "unpredictable",
    flavor: "Basic amorphous creatures with simple instincts and high resilience.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 0.9,
      defMult: 1.1,
      notes: "Slimes absorb damage well but hit lightly."
    }
  },

  insectoid: {
    key: "insectoid",
    tier: 1,
    baseHP: 90,
    baseATK: 11,
    baseDEF: 7,
    elementAffinity: { poison: 0.10 },
    behavior: "swarming",
    flavor: "Hive-driven creatures that rely on numbers, speed, and venom.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.05,
      defMult: 0.95,
      speedBias: 0.10,
      notes: "Fast and aggressive; often apply poison or swarm-based effects."
    }
  },

  arachnid: {
    key: "arachnid",
    tier: 1,
    baseHP: 100,
    baseATK: 12,
    baseDEF: 8,
    elementAffinity: { poison: 0.20 },
    behavior: "ambush",
    flavor: "Stealthy predators that strike from hiding with venom and webs.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.10,
      defMult: 1.0,
      statusEffectChanceMult: 1.20,
      notes: "High poison application and ambush damage."
    }
  },

  undead: {
    key: "undead",
    tier: 2,
    baseHP: 110,
    baseATK: 9,
    baseDEF: 10,
    elementAffinity: {
      holy: 0.20,
      poison: -0.20,
      rot: -0.20
    },
    behavior: "relentless",
    flavor: "Creatures animated by dark magic, resistant to pain and fear.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.10,
      statusEffectChanceMult: 1.15,
      specialRules: { decayTouch: true },
      notes: "Resilient and rot‑infused, with strong debuff potential."
    }
  },

  spirit: {
    key: "spirit",
    tier: 2,
    baseHP: 100,
    baseATK: 11,
    baseDEF: 6,
    elementAffinity: { arcane: 0.10, holy: -0.10 },
    behavior: "ethereal",
    flavor: "Ghostly entities that phase through matter and wield supernatural energy.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.05,
      defMult: 0.9,
      evasionBias: 0.15,
      notes: "Hard to hit; often apply arcane or fear-based effects."
    }
  },

  fae: {
    key: "fae",
    tier: 2,
    baseHP: 95,
    baseATK: 12,
    baseDEF: 7,
    elementAffinity: { nature: 0.15, arcane: 0.10 },
    behavior: "trickster",
    flavor: "Mischievous magical beings with deceptive abilities and unpredictable tactics.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.10,
      defMult: 0.95,
      speedBias: 0.10,
      notes: "High agility and magical trickery; often inflict charm or confusion."
    }
  },

  construct: {
    key: "construct",
    tier: 2,
    baseHP: 150,
    baseATK: 13,
    baseDEF: 14,
    elementAffinity: { lightning: -0.10 },
    behavior: "mechanical",
    flavor: "Artificial beings forged from metal, stone, or arcane machinery.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.10,
      defMult: 1.20,
      statusEffectImmunity: true,
      notes: "High durability; immune to many debuffs but weak to lightning."
    }
  },

  elemental: {
    key: "elemental",
    tier: 2,
    baseHP: 140,
    baseATK: 16,
    baseDEF: 12,
    elementAffinity: { arcane: 0.10 },
    behavior: "unpredictable",
    flavor: "Manifestations of raw elemental power, shaped by primal forces.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.20,
      defMult: 1.05,
      notes: "Elementals embody the forces of nature."
    }
  },

  demon: {
    key: "demon",
    tier: 2,
    baseHP: 150,
    baseATK: 18,
    baseDEF: 14,
    elementAffinity: { fire: 0.20 },
    behavior: "aggressive",
    flavor: "Malevolent beings from infernal realms, driven by destruction.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.25,
      defMult: 1.10,
      notes: "Demons strike with overwhelming force."
    }
  },

  dragon: {
    key: "dragon",
    tier: 2,
    baseHP: 160,
    baseATK: 20,
    baseDEF: 16,
    elementAffinity: { fire: 0.10, arcane: 0.10 },
    behavior: "dominant",
    flavor: "Majestic and terrifying apex predators infused with ancient magic.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.30,
      defMult: 1.20,
      notes: "Dragons are powerful, intelligent, and magically potent."
    }
  },

  // ⭐ All advanced families now include default multipliers
  abyssal_brute_family: {
    key: "abyssal_brute_family",
    tier: 4,
    baseHP: 220,
    baseATK: 22,
    baseDEF: 18,
    elementAffinity: { dark: 0.20, rot: 0.10 },
    behavior: "rampaging",
    flavor: "Massive horrors shaped by the Abyss, driven by hunger and violent instinct.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.30,
      defMult: 1.20,
      speedBias: -0.05,
      notes: "Brutal, overwhelming force; resistant to fear and pain, but slow and predictable."
    }
  },

  astral_family: {
    key: "astral_family",
    tier: 5,
    baseHP: 180,
    baseATK: 20,
    baseDEF: 14,
    elementAffinity: { arcane: 0.25, holy: 0.10 },
    behavior: "drifting",
    flavor: "Cosmic entities touched by the Astral Sea, guided by thought rather than instinct.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.25,
      defMult: 1.10,
      evasionBias: 0.10,
      notes: "Unpredictable and reality‑bending; often apply arcane, gravity, or mind‑warp effects."
    }
  },

  verdant_colossus_family: {
    key: "verdant_colossus_family",
    tier: 4,
    baseHP: 240,
    baseATK: 18,
    baseDEF: 22,
    elementAffinity: { nature: 0.30, fire: -0.20 },
    behavior: "ancient",
    flavor: "Towering plant‑titan hybrids, embodiments of ancient forests and primal growth.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.10,
      defMult: 1.35,
      statusEffectChanceMult: 1.20,
      notes: "Extremely durable; inflict roots, thorns, and nature‑based debuffs."
    }
  },

  phoenix_family: {
    key: "phoenix_family",
    tier: 4,
    baseHP: 170,
    baseATK: 24,
    baseDEF: 14,
    elementAffinity: { fire: 0.35, holy: 0.15 },
    behavior: "reborn",
    flavor: "Mythic firebirds of rebirth, blazing with divine flame and radiant fury.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.35,
      defMult: 1.05,
      specialRules: { rebirth: true },
      notes: "High fire damage, radiant bursts, and revival mechanics."
    }
  },

  worldrender_family: {
    key: "worldrender_family",
    tier: 6,
    baseHP: 300,
    baseATK: 28,
    baseDEF: 26,
    elementAffinity: { earth: 0.25, arcane: 0.20 },
    behavior: "cataclysmic",
    flavor: "Apocalyptic titans whose movements reshape continents and fracture reality.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.50,
      defMult: 1.40,
      speedBias: -0.10,
      notes: "World‑shaking blows, seismic ruptures, and catastrophic AoE effects."
    }
  },

  dog: {
    key: "dog",
    tier: 1,
    baseHP: 90,
    baseATK: 11,
    baseDEF: 6,
    elementAffinity: { nature: 0.05 },
    behavior: "aggressive",
    flavor: "Loyal, fast, and relentless pack hunters.",
    familyModifiers: {
      hpMult: 0.9,
      atkMult: 1.15,
      defMult: 0.9,
      speedBias: 0.10,
      notes: "Fast, coordinated pack attackers with high initiative."
    }
  },

  thief: {
    key: "thief",
    tier: 1,
    baseHP: 80,
    baseATK: 12,
    baseDEF: 5,
    elementAffinity: {},
    behavior: "skirmisher",
    flavor: "Quick, opportunistic fighters who strike from the shadows.",
    familyModifiers: {
      hpMult: 0.9,
      atkMult: 1.1,
      defMult: 0.9,
      speedBias: 0.15,
      notes: "High evasion, low defense, burst damage."
    }
  },
  
  bandit: {
    key: "bandit",
    tier: 1,
    baseHP: 100,
    baseATK: 11,
    baseDEF: 7,
    elementAffinity: {},
    behavior: "aggressive",
    flavor: "Ruthless raiders who fight with brute force and dirty tricks.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.1,
      defMult: 1.0,
      speedBias: 0.05,
      notes: "Stronger but slower than thieves; uses improvised weapons."
    }
  },
  
  miner: {
    key: "miner",
    tier: 1,
    baseHP: 110,
    baseATK: 10,
    baseDEF: 10,
    elementAffinity: { earth: 0.10 },
    behavior: "defensive",
    flavor: "Hardened laborers accustomed to danger beneath the earth.",
    familyModifiers: {
      hpMult: 1.1,
      atkMult: 1.0,
      defMult: 1.1,
      speedBias: -0.05,
      notes: "High defense, low speed, earth‑aligned."
    }
  },
  
  ritualist: {
    key: "ritualist",
    tier: 2,
    baseHP: 90,
    baseATK: 14,
    baseDEF: 6,
    elementAffinity: { dark: 0.10, arcane: 0.10 },
    behavior: "caster",
    flavor: "Practitioners of forbidden rites who channel unstable energies.",
    familyModifiers: {
      hpMult: 0.9,
      atkMult: 1.2,
      defMult: 0.9,
      speedBias: 0.0,
      notes: "High magic damage, fragile bodies."
    }
  },

  archer: {
    key: "archer",
    tier: 1,
    baseHP: 85,
    baseATK: 13,
    baseDEF: 6,
    elementAffinity: {},
    behavior: "ranged",
    flavor: "Skilled marksmen who strike from afar with deadly precision.",
    familyModifiers: {
      hpMult: 0.9,
      atkMult: 1.15,
      defMult: 0.9,
      speedBias: 0.05,
      notes: "High accuracy, low defense."
    }
  },

  warrior: {
    key: "warrior",
    tier: 1,
    baseHP: 120,
    baseATK: 12,
    baseDEF: 10,
    elementAffinity: {},
    behavior: "aggressive",
    flavor: "Disciplined melee fighters trained for direct combat.",
    familyModifiers: {
      hpMult: 1.1,
      atkMult: 1.1,
      defMult: 1.1,
      speedBias: 0.0,
      notes: "Balanced frontline fighters."
    }
  },

  monk: {
    key: "monk",
    tier: 2,
    baseHP: 100,
    baseATK: 14,
    baseDEF: 8,
    elementAffinity: { wind: 0.10 },
    behavior: "skirmisher",
    flavor: "Disciplined martial artists who channel inner energy.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.2,
      defMult: 1.0,
      speedBias: 0.10,
      notes: "Fast, precise, chi‑aligned fighters."
    }
  },
  
  assassin: {
    key: "assassin",
    tier: 2,
    baseHP: 80,
    baseATK: 16,
    baseDEF: 5,
    elementAffinity: { dark: 0.10 },
    behavior: "skirmisher",
    flavor: "Silent killers who strike before their victims can react.",
    familyModifiers: {
      hpMult: 0.8,
      atkMult: 1.3,
      defMult: 0.8,
      speedBias: 0.20,
      notes: "Extremely fast, extremely fragile."
    }
  },

  druid: {
    key: "druid",
    tier: 2,
    baseHP: 95,
    baseATK: 12,
    baseDEF: 7,
    elementAffinity: { nature: 0.20 },
    behavior: "caster",
    flavor: "Nature‑bound spellcasters who command beasts and the wilds.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.1,
      defMult: 0.9,
      speedBias: 0.0,
      notes: "Nature magic, healing, and beast synergy."
    }
  },

  warlock: {
    key: "warlock",
    tier: 2,
    baseHP: 90,
    baseATK: 15,
    baseDEF: 6,
    elementAffinity: { dark: 0.20, chaos: 0.10 },
    behavior: "caster",
    flavor: "Pact‑bound casters who wield forbidden power.",
    familyModifiers: {
      hpMult: 0.9,
      atkMult: 1.25,
      defMult: 0.9,
      speedBias: 0.0,
      notes: "High burst magic, self‑harm mechanics possible."
    }
  },
  
  witch: {
    key: "witch",
    tier: 2,
    baseHP: 85,
    baseATK: 14,
    baseDEF: 6,
    elementAffinity: { arcane: 0.15, dark: 0.10 },
    behavior: "caster",
    flavor: "Mystics who weave curses and hexes into their spells.",
    familyModifiers: {
      hpMult: 0.9,
      atkMult: 1.2,
      defMult: 0.9,
      speedBias: 0.0,
      notes: "Debuff‑heavy spellcasters."
    }
  },
  
  necromancer: {
    key: "necromancer",
    tier: 2,
    baseHP: 90,
    baseATK: 13,
    baseDEF: 6,
    elementAffinity: { dark: 0.20, rot: 0.10 },
    behavior: "caster",
    flavor: "Masters of undeath who command legions of the fallen.",
    familyModifiers: {
      hpMult: 0.9,
      atkMult: 1.2,
      defMult: 0.9,
      speedBias: 0.0,
      notes: "Summoning, rot damage, undead synergy."
    }
  },

  shaman: {
    key: "shaman",
    tier: 2,
    baseHP: 100,
    baseATK: 12,
    baseDEF: 7,
    elementAffinity: { lightning: 0.15, nature: 0.10 },
    behavior: "caster",
    flavor: "Spiritual conduits who channel elemental forces.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.15,
      defMult: 1.0,
      speedBias: 0.0,
      notes: "Elemental magic + support abilities."
    }
  },

  paladin: {
    key: "paladin",
    tier: 2,
    baseHP: 130,
    baseATK: 12,
    baseDEF: 12,
    elementAffinity: { holy: 0.20 },
    behavior: "defensive",
    flavor: "Holy warriors who blend martial prowess with divine protection.",
    familyModifiers: {
      hpMult: 1.2,
      atkMult: 1.0,
      defMult: 1.2,
      speedBias: -0.05,
      notes: "High defense, holy damage, anti‑undead."
    }
  },

  ranger: {
    key: "ranger",
    tier: 2,
    baseHP: 105,
    baseATK: 14,
    baseDEF: 9,
    elementAffinity: { nature: 0.10, wind: 0.05 },
    behavior: "skirmisher",
    flavor: "Wilderness experts who blend archery, traps, and swift melee strikes.",
    familyModifiers: {
      hpMult: 1.05,
      atkMult: 1.15,
      defMult: 1.0,
      speedBias: 0.10,
      notes: "Hybrid ranged/melee fighters with mobility and nature synergy."
    }
  },

  arcane: {
    key: "arcane",
    tier: 2,
    baseHP: 90,
    baseATK: 16,
    baseDEF: 7,
    elementAffinity: { arcane: 0.25 },
    behavior: "caster",
    flavor: "Scholars of raw magical force who wield pure arcane energy with precision.",
    familyModifiers: {
      hpMult: 0.9,
      atkMult: 1.25,
      defMult: 0.9,
      speedBias: 0.0,
      notes: "High burst magic, low defense, pure arcane scaling."
    }
  },

  trickster: {
    key: "trickster",
    tier: 2,
    baseHP: 85,
    baseATK: 13,
    baseDEF: 6,
    elementAffinity: { chaos: 0.15 },
    behavior: "skirmisher",
    flavor: "Chaotic fighters who manipulate luck and probability.",
    familyModifiers: {
      hpMult: 0.9,
      atkMult: 1.15,
      defMult: 0.9,
      speedBias: 0.10,
      notes: "Random effects, unpredictable actions."
    }
  },

  plant: {
    key: "plant",
    tier: 1,
    baseHP: 110,
    baseATK: 9,
    baseDEF: 12,
    elementAffinity: { nature: 0.20 },
    behavior: "defensive",
    flavor: "Sentient flora that defend their territory with natural resilience.",
    familyModifiers: {
      hpMult: 1.1,
      atkMult: 0.9,
      defMult: 1.2,
      speedBias: -0.10,
      notes: "High defense, slow, nature‑aligned."
    }
  },

  celestial: {
    key: "celestial",
    tier: 4,
    baseHP: 180,
    baseATK: 18,
    baseDEF: 20,
    elementAffinity: { holy: 0.25, arcane: 0.10 },
    behavior: "defensive",
    flavor: "Radiant beings of divine order and cosmic law.",
    familyModifiers: {
      hpMult: 1.3,
      atkMult: 1.2,
      defMult: 1.4,
      speedBias: 0.0,
      notes: "High defense, holy damage, anti‑dark."
    }
  },

  colossus: {
    key: "colossus",
    tier: 4,
    baseHP: 250,
    baseATK: 20,
    baseDEF: 25,
    elementAffinity: { earth: 0.20 },
    behavior: "defensive",
    flavor: "Towering giants of stone and ancient power.",
    familyModifiers: {
      hpMult: 1.5,
      atkMult: 1.2,
      defMult: 1.6,
      speedBias: -0.20,
      notes: "Extremely tanky, slow, earth‑aligned."
    }
  },
  
  demigod: {
    key: "demigod",
    tier: 5,
    baseHP: 220,
    baseATK: 22,
    baseDEF: 20,
    elementAffinity: { arcane: 0.20, holy: 0.20 },
    behavior: "balanced",
    flavor: "Half‑divine beings with immense latent power.",
    familyModifiers: {
      hpMult: 1.4,
      atkMult: 1.4,
      defMult: 1.4,
      speedBias: 0.10,
      notes: "High stats across the board."
    }
  },

  apocalypse: {
    key: "apocalypse",
    tier: 6,
    baseHP: 300,
    baseATK: 28,
    baseDEF: 24,
    elementAffinity: { chaos: 0.25, dark: 0.25 },
    behavior: "aggressive",
    flavor: "Harbingers of the end, embodying ruin and devastation.",
    familyModifiers: {
      hpMult: 1.6,
      atkMult: 1.6,
      defMult: 1.5,
      speedBias: 0.0,
      notes: "Raid‑boss tier; catastrophic abilities."
    }
  },

  
  giantkin: {
    key: "giantkin",
    tier: 2,
    baseHP: 180,
    baseATK: 17,
    baseDEF: 14,
    elementAffinity: { earth: 0.10 },
    behavior: "brutal",
    flavor: "Massive humanoids with overwhelming physical strength.",
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.20,
      defMult: 1.15,
      notes: "Slow but devastating; excel in raw physical combat."
    }
  },

  titan: {
    key: "titan",
    tier: 2,
    baseHP: 200,
    baseATK: 22,
    baseDEF: 18,
    elementAffinity: { "earth": 0.15, "arcane": 0.10 },
    behavior: "colossal",
    flavor: "Ancient beings of immense size and power, embodiments of natural forces.",
    familyModifiers: {
      hpMult: 1.0,        // defaulted (was missing)
      atkMult: 1.35,      // preserved
      defMult: 1.25,      // preserved
      speedBias: -0.05,   // titans are slow, fits your theme
      "statusEffectImmunity": false,
      notes: "Titans are near‑unstoppable forces of nature, slow but devastating."
    }
  },

  eldritch: {
    key: "eldritch",
    tier: 3,
    behavior: "chaotic",
    flavor: "Unknowable beings shaped by madness and impossible geometry.",
    elementAffinity: {},
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.0,
      notes: "Eldritch entities defy logic; their power varies wildly."
    }
  },

  aberration: {
    key: "aberration",
    tier: 3,
    behavior: "unstable",
    flavor: "Twisted lifeforms that defy natural biology.",
    elementAffinity: {},
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.0,
      notes: "Aberrations mutate unpredictably; no consistent strengths."
    }
  },

  astral: {
    key: "astral",
    tier: 3,
    behavior: "drifting",
    flavor: "Creatures touched by the Astral Sea and cosmic thought.",
    elementAffinity: {},
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.0,
      notes: "Astral beings are unpredictable but not inherently stronger."
    }
  },

  chaosborn: {
    key: "chaosborn",
    tier: 3,
    behavior: "volatile",
    flavor: "Entities infused with raw, unpredictable chaos energy.",
    elementAffinity: {},
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.0,
      notes: "Chaosborn fluctuate wildly; baseline stats remain neutral."
    }
  },

  mythic_beast: {
    key: "mythic_beast",
    tier: 3,
    behavior: "feral",
    flavor: "Legendary beasts of ancient power and impossible resilience.",
    elementAffinity: {},
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.0,
      notes: "Mythic beasts vary greatly; no universal stat pattern."
    }
  },

  mythic_undead: {
    key: "mythic_undead",
    tier: 3,
    behavior: "eternal",
    flavor: "Undead of mythic stature, animated by ancient curses.",
    elementAffinity: {},
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.0,
      notes: "Mythic undead are diverse; no consistent stat bias."
    }
  },

  void: {
    key: "void",
    tier: 4,
    behavior: "entropy",
    flavor: "Beings shaped by the emptiness between realities.",
    elementAffinity: {},
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.0,
      notes: "Void entities distort reality but lack consistent physical traits."
    }
  },

  outer_god: {
    key: "outer_god",
    tier: 4,
    behavior: "cosmic",
    flavor: "Vast cosmic intelligences whose motives transcend mortal logic.",
    elementAffinity: {},
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.0,
      notes: "Outer gods vary dramatically; baseline multipliers remain neutral."
    }
  },

  primordial: {
    key: "primordial",
    tier: 4,
    behavior: "ancient",
    flavor: "Primeval forces given form, older than the world itself.",
    elementAffinity: {},
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.0,
      notes: "Primordials embody raw creation; no universal stat pattern."
    }
  },

  anomaly: {
    key: "anomaly",
    tier: 5,
    behavior: "erratic",
    flavor: "Reality‑breaking entities that do not obey physical laws.",
    elementAffinity: {},
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.0,
      notes: "Anomalies are unpredictable; baseline multipliers stay neutral."
    }
  },

  parasite: {
    key: "parasite",
    tier: 5,
    behavior: "consuming",
    flavor: "Lifeforms that feed on hosts, energy, or even concepts.",
    elementAffinity: {},
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.0,
      notes: "Parasites vary by host; no inherent stat bias."
    }
  },

  amorphous: {
    key: "amorphous",
    tier: 5,
    behavior: "shifting",
    flavor: "Shapeless entities with fluid forms and unpredictable movement.",
    elementAffinity: {},
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.0,
      notes: "Amorphous beings shift constantly; baseline multipliers remain neutral."
    }
  },

  hivemind: {
    key: "hivemind",
    tier: 5,
    behavior: "collective",
    flavor: "Networked organisms acting as a single distributed intelligence.",
    elementAffinity: {},
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.0,
      notes: "Hiveminds vary by colony; no universal stat pattern."
    }
  },

  metaphysical_phenomenon: {
    key: "metaphysical_phenomenon",
    tier: 5,
    behavior: "conceptual",
    flavor: "Manifestations of ideas, emotions, or narrative forces.",
    elementAffinity: {},
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.0,
      notes: "Conceptual beings differ wildly; baseline multipliers stay neutral."
    }
  },

  divinity: {
    key: "divinity",
    tier: 6,
    behavior: "transcendent",
    flavor: "Godlike beings radiating overwhelming spiritual power.",
    elementAffinity: {},
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.0,
      notes: "Divine entities vary by domain; no fixed stat pattern."
    }
  },

  god: {
    key: "god",
    tier: 7,
    baseHP: 450,
    baseATK: 30,
    baseDEF: 28,
    elementAffinity: { holy: 0.30, arcane: 0.20 },
    behavior: "balanced",
    flavor: "A supreme divine entity whose presence bends reality and fate.",
    familyModifiers: {
      hpMult: 1.7,
      atkMult: 1.6,
      defMult: 1.6,
      speedBias: 0.10,
      notes: "Top-tier divine beings; overwhelming stats and divine resistances."
    }
  },

  paragon: {
    key: "paragon",
    tier: 6,
    behavior: "ascended",
    flavor: "Perfected forms of existence, embodiments of ultimate mastery.",
    elementAffinity: {},
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.0,
      notes: "Paragons transcend normal limits; baseline multipliers remain neutral."
    }
  },

  cosmic_entity: {
    key: "cosmic_entity",
    tier: 5,
    baseHP: 300,
    baseATK: 26,
    baseDEF: 22,
    elementAffinity: { holy: 0.20, arcane: 0.20 },
    behavior: "cosmic",
    flavor: "A being of pure cosmic divinity, transcending mortal comprehension.",
    familyModifiers: {
      hpMult: 1.4,
      atkMult: 1.4,
      defMult: 1.4,
      speedBias: 0.05,
      notes: "Cosmic entities wield divine and astral power beyond mortal limits."
    }
  },

  multiversal_paragon: {
    key: "multiversal_paragon",
    tier: 7,
    behavior: "omni",
    flavor: "Entities whose influence spans countless universes.",
    elementAffinity: {},
    familyModifiers: {
      hpMult: 1.0,
      atkMult: 1.0,
      defMult: 1.0,
      notes: "Multiversal paragons differ by reality; no universal stat bias."
    }
  }
};
