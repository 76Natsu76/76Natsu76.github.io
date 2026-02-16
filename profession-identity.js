export const PROFESSION_IDENTITY = {

  /* ============================================================
     PHYSICAL / MARTIAL
  ============================================================ */

  "warrior": {
    role: "striker",
    statProfile: { hp: +10, atk: +10, def: +5, spd: 0 },
    behavior: ["aggressive", "direct", "frontline"],
    elements: ["earth", "neutral"],
    themes: ["weapon mastery", "battle cries"],
    flavor: "A disciplined fighter who excels in direct combat."
  },

  "knight": {
    role: "tank",
    statProfile: { hp: +15, atk: +5, def: +15, spd: -5 },
    behavior: ["protective", "steadfast"],
    elements: ["holy", "earth"],
    themes: ["shields", "defensive stances"],
    flavor: "A stalwart defender clad in heavy armor."
  },

  "berserker": {
    role: "striker",
    statProfile: { hp: +10, atk: +20, def: -5, spd: +5 },
    behavior: ["reckless", "frenzied"],
    elements: ["fire", "chaos"],
    themes: ["rage", "self‑buffs"],
    flavor: "A furious warrior who grows stronger as the battle intensifies."
  },

  "rogue": {
    role: "skirmisher",
    statProfile: { hp: -5, atk: +10, def: -5, spd: +15 },
    behavior: ["evasive", "opportunistic"],
    elements: ["dark", "neutral"],
    themes: ["bleeds", "poisons", "stealth"],
    flavor: "A swift and cunning fighter who strikes from the shadows."
  },

  "ranger": {
    role: "striker",
    statProfile: { hp: 0, atk: +10, def: 0, spd: +10 },
    behavior: ["ranged", "mobile"],
    elements: ["wind", "nature"],
    themes: ["arrows", "animal companions"],
    flavor: "A master of ranged combat and wilderness tactics."
  },

  "monk": {
    role: "skirmisher",
    statProfile: { hp: 0, atk: +10, def: +5, spd: +15 },
    behavior: ["disciplined", "counterattacking"],
    elements: ["wind", "holy"],
    themes: ["martial arts", "inner focus"],
    flavor: "A disciplined martial artist who channels inner strength."
  },

  "barbarian": {
    role: "bruiser",
    statProfile: { hp: +20, atk: +15, def: 0, spd: -5 },
    behavior: ["aggressive", "unpredictable"],
    elements: ["earth", "fire"],
    themes: ["rage", "heavy swings"],
    flavor: "A wild warrior who overwhelms foes with brute strength."
  },

  "duelist": {
    role: "striker",
    statProfile: { hp: -5, atk: +15, def: 0, spd: +10 },
    behavior: ["precise", "counterattacking"],
    elements: ["neutral"],
    themes: ["ripostes", "bleeds"],
    flavor: "A swift and elegant fighter who excels in single combat."
  },

  "guardian": {
    role: "tank",
    statProfile: { hp: +20, atk: 0, def: +20, spd: -10 },
    behavior: ["protective", "anchored"],
    elements: ["earth", "holy"],
    themes: ["shields", "taunts"],
    flavor: "A towering protector who shields allies from harm."
  },

  "dragoon": {
    role: "striker",
    statProfile: { hp: +5, atk: +15, def: 0, spd: +5 },
    behavior: ["leaping", "aerial"],
    elements: ["wind", "lightning"],
    themes: ["jumps", "piercing attacks"],
    flavor: "A lancer who strikes from above with devastating force."
  },

  /* ============================================================
     MAGICAL / ELEMENTAL
  ============================================================ */

  "pyromancer": {
    role: "caster",
    statProfile: { hp: -10, atk: +20, def: -10, spd: 0 },
    behavior: ["ranged", "volatile"],
    elements: ["fire"],
    themes: ["burns", "explosions"],
    flavor: "A fire mage who incinerates foes with blazing spells."
  },

  "cryomancer": {
    role: "caster",
    statProfile: { hp: -10, atk: +15, def: 0, spd: -5 },
    behavior: ["control", "slow"],
    elements: ["ice"],
    themes: ["freezes", "shards"],
    flavor: "A frost mage who freezes enemies in their tracks."
  },

  "electromancer": {
    role: "caster",
    statProfile: { hp: -10, atk: +20, def: -5, spd: +5 },
    behavior: ["burst", "chain"],
    elements: ["electric"],
    themes: ["lightning", "overload"],
    flavor: "A storm mage who unleashes crackling arcs of lightning."
  },

  "geomancer": {
    role: "controller",
    statProfile: { hp: +10, atk: +10, def: +10, spd: -10 },
    behavior: ["anchored", "zone control"],
    elements: ["earth"],
    themes: ["quakes", "barriers"],
    flavor: "A stone‑shaping mage who commands the earth itself."
  },

  "aeromancer": {
    role: "caster",
    statProfile: { hp: -5, atk: +15, def: -5, spd: +15 },
    behavior: ["mobile", "evasive"],
    elements: ["wind"],
    themes: ["gusts", "knockbacks"],
    flavor: "A wind mage who dances through battle with swift magic."
  },

  "hydromancer": {
    role: "caster",
    statProfile: { hp: -5, atk: +10, def: 0, spd: 0 },
    behavior: ["flowing", "adaptive"],
    elements: ["water"],
    themes: ["healing", "tides"],
    flavor: "A water mage who bends tides and currents to their will."
  },

  "arcanist": {
    role: "caster",
    statProfile: { hp: -10, atk: +20, def: -10, spd: 0 },
    behavior: ["focused", "high‑damage"],
    elements: ["arcane"],
    themes: ["pure magic", "mana burn"],
    flavor: "A master of raw arcane power."
  },

  "chronomancer": {
    role: "controller",
    statProfile: { hp: -10, atk: +10, def: -5, spd: +20 },
    behavior: ["manipulative", "temporal"],
    elements: ["arcane", "cosmic"],
    themes: ["time dilation", "rewinds"],
    flavor: "A time‑bending mage who alters the flow of battle."
  },

  "illusionist": {
    role: "controller",
    statProfile: { hp: -10, atk: +5, def: -10, spd: +15 },
    behavior: ["deceptive", "confusing"],
    elements: ["arcane", "light"],
    themes: ["clones", "charms"],
    flavor: "A trickster mage who manipulates perception."
  },

  "necromancer": {
    role: "caster",
    statProfile: { hp: -10, atk: +15, def: -5, spd: 0 },
    behavior: ["summoner", "drain"],
    elements: ["dark", "void"],
    themes: ["minions", "life drain"],
    flavor: "A death mage who commands the dead."
  },

  "warlock": {
    role: "caster",
    statProfile: { hp: -10, atk: +20, def: -10, spd: 0 },
    behavior: ["cursed", "sacrificial"],
    elements: ["void", "chaos"],
    themes: ["hexes", "soulfire"],
    flavor: "A pact‑bound caster who wields forbidden power."
  },

  "druid": {
    role: "hybrid",
    statProfile: { hp: +5, atk: +5, def: +5, spd: 0 },
    behavior: ["adaptive", "nature‑bound"],
    elements: ["nature", "earth"],
    themes: ["shapeshifting", "growth"],
    flavor: "A nature mage who channels the wild."
  },

  "shaman": {
    role: "support",
    statProfile: { hp: 0, atk: +5, def: 0, spd: 0 },
    behavior: ["ritualistic", "totemic"],
    elements: ["spirit", "storm"],
    themes: ["totems", "ancestral magic"],
    flavor: "A spiritual caster who communes with ancestral forces."
  },

  "spellblade": {
    role: "hybrid",
    statProfile: { hp: 0, atk: +10, def: 0, spd: +5 },
    behavior: ["agile", "enchanted"],
    elements: ["arcane", "elemental"],
    themes: ["enchanted strikes"],
    flavor: "A warrior‑mage who blends steel and sorcery."
  },

  /* ============================================================
     HOLY / LIGHT
  ============================================================ */

  "cleric": {
    role: "support",
    statProfile: { hp: +5, atk: 0, def: +10, spd: -5 },
    behavior: ["protective", "healing"],
    elements: ["holy"],
    themes: ["heals", "wards"],
    flavor: "A holy healer who protects allies with divine magic."
  },

  "paladin": {
    role: "tank",
    statProfile: { hp: +15, atk: +5, def: +15, spd: -5 },
    behavior: ["righteous", "unyielding"],
    elements: ["holy", "light"],
    themes: ["smite", "aura"],
    flavor: "A holy knight who smites evil and shields allies."
  },

  "crusader": {
    role: "bruiser",
    statProfile: { hp: +10, atk: +10, def: +10, spd: -5 },
    behavior: ["zealous", "relentless"],
    elements: ["holy", "fire"],
    themes: ["burning justice"],
    flavor: "A zealot who channels holy fire into devastating attacks."
  },

  "lightweaver": {
    role: "caster",
    statProfile: { hp: -10, atk: +15, def: -5, spd: +5 },
    behavior: ["radiant", "supportive"],
    elements: ["light"],
    themes: ["blinding light", "purification"],
    flavor: "A radiant mage who weaves light into powerful spells."
  },

  "oracle": {
    role: "support",
    statProfile: { hp: -5, atk: 0, def: 0, spd: +10 },
    behavior: ["predictive", "insightful"],
    elements: ["light", "cosmic"],
    themes: ["prophecy", "foresight"],
    flavor: "A seer who glimpses possible futures."
  },

  /* ============================================================
     DARK / VOID
  ============================================================ */

  "shadowblade": {
    role: "skirmisher",
    statProfile: { hp: -5, atk: +15, def: -5, spd: +15 },
    behavior: ["stealthy", "assassin"],
    elements: ["dark"],
    themes: ["shadow strikes"],
    flavor: "An assassin who moves unseen through darkness."
  },

  "voidcaller": {
    role: "caster",
    statProfile: { hp: -10, atk: +20, def: -10, spd: 0 },
    behavior: ["chaotic", "summoner"],
    elements: ["void"],
    themes: ["void rifts", "entropy"],
    flavor: "A caster who channels the raw emptiness of the void."
  },

  "occultist": {
    role: "controller",
    statProfile: { hp: -10, atk: +10, def: -5, spd: 0 },
    behavior: ["ritualistic", "hexing"],
    elements: ["dark", "void"],
    themes: ["curses", "rituals"],
    flavor: "A practitioner of forbidden rites."
  },

  "reaper": {
    role: "striker",
    statProfile: { hp: 0, atk: +20, def: -5, spd: +10 },
    behavior: ["executioner", "relentless"],
    elements: ["dark"],
    themes: ["scythes", "death marks"],
    flavor: "A relentless executioner who harvests souls."
  },

  /* ============================================================
     BEAST / CREATURE
  ============================================================ */

  "beast": {
    role: "bruiser",
    statProfile: { hp: +10, atk: +10, def: +5, spd: 0 },
    behavior: ["feral", "instinctive"],
    elements: ["nature"],
    themes: ["claws", "roars"],
    flavor: "A wild creature driven by instinct."
  },

  "dire-beast": {
    role: "bruiser",
    statProfile: { hp: +20, atk: +15, def: +10, spd: -5 },
    behavior: ["savage", "territorial"],
    elements: ["nature"],
    themes: ["mauls", "charges"],
    flavor: "A massive beast of terrifying strength."
  },

  "alpha-beast": {
    role: "leader",
    statProfile: { hp: +25, atk: +20, def: +10, spd: 0 },
    behavior: ["dominant", "commanding"],
    elements: ["nature"],
    themes: ["pack leadership"],
    flavor: "A dominant predator that commands lesser beasts."
  },

  "spirit-beast": {
    role: "caster",
    statProfile: { hp: 0, atk: +10, def: 0, spd: +10 },
    behavior: ["ethereal", "supportive"],
    elements: ["spirit"],
    themes: ["spirit claws", "howls"],
    flavor: "A spectral creature bound to the spirit realm."
  },

  "feral-stalker": {
    role: "skirmisher",
    statProfile: { hp: -5, atk: +15, def: -5, spd: +15 },
    behavior: ["ambush", "evasive"],
    elements: ["dark", "nature"],
    themes: ["pounce", "bleeds"],
    flavor: "A stealthy predator that hunts from the shadows."
  },

  /* ============================================================
     CONSTRUCT / ARTIFICIAL
  ============================================================ */

  "golem": {
    role: "tank",
    statProfile: { hp: +30, atk: 0, def: +30, spd: -20 },
    behavior: ["slow", "unmoving"],
    elements: ["earth"],
    themes: ["slam", "fortify"],
    flavor: "A hulking construct of stone and magic."
  },

  "automaton": {
    role: "striker",
    statProfile: { hp: +10, atk: +15, def: +5, spd: 0 },
    behavior: ["mechanical", "precise"],
    elements: ["metal"],
    themes: ["gears", "precision"],
    flavor: "A mechanical warrior built for efficiency."
  },

  "war-machine": {
    role: "bruiser",
    statProfile: { hp: +20, atk: +20, def: +10, spd: -10 },
    behavior: ["relentless", "heavy"],
    elements: ["metal", "fire"],
    themes: ["cannons", "overheat"],
    flavor: "A devastating engine of destruction."
  },

  "arcane-construct": {
    role: "caster",
    statProfile: { hp: +10, atk: +20, def: +10, spd: -10 },
    behavior: ["programmed", "arcane"],
    elements: ["arcane"],
    themes: ["arcane beams", "mana shields"],
    flavor: "A magical construct powered by pure arcane energy."
  },

  /* ============================================================
     UNDEAD
  ============================================================ */

  "skeleton": {
    role: "skirmisher",
    statProfile: { hp: -10, atk: +5, def: 0, spd: +5 },
    behavior: ["mindless", "swarming"],
    elements: ["dark"],
    themes: ["bone strikes"],
    flavor: "A reanimated skeleton driven by necrotic energy."
  },

  "ghoul": {
    role: "bruiser",
    statProfile: { hp: +10, atk: +10, def: 0, spd: 0 },
    behavior: ["feral", "ravenous"],
    elements: ["dark", "poison"],
    themes: ["infect", "rend"],
    flavor: "A ravenous undead creature hungry for flesh."
  },

  "wraith": {
    role: "skirmisher",
    statProfile: { hp: -20, atk: +15, def: -10, spd: +20 },
    behavior: ["ethereal", "haunting"],
    elements: ["dark", "void"],
    themes: ["phase attacks", "life drain"],
    flavor: "A spectral undead that phases through matter to strike."
  },

  "lich": {
    role: "caster",
    statProfile: { hp: -10, atk: +25, def: 0, spd: -5 },
    behavior: ["commanding", "summoner"],
    elements: ["dark", "arcane"],
    themes: ["necrotic blasts", "undead mastery"],
    flavor: "An ancient undead sorcerer wielding forbidden magic."
  },

  /* ============================================================
     SUPPORT / UTILITY
  ============================================================ */

  "bard": {
    role: "support",
    statProfile: { hp: 0, atk: +5, def: 0, spd: +10 },
    behavior: ["inspirational", "disruptive"],
    elements: ["light", "wind"],
    themes: ["songs", "buffs", "debuffs"],
    flavor: "A charismatic performer whose melodies shape the battlefield."
  },

  "alchemist": {
    role: "support",
    statProfile: { hp: 0, atk: +10, def: 0, spd: 0 },
    behavior: ["tactical", "experimental"],
    elements: ["poison", "fire"],
    themes: ["bombs", "elixirs"],
    flavor: "A volatile scientist who weaponizes chemical concoctions."
  },

  "engineer": {
    role: "controller",
    statProfile: { hp: +5, atk: +10, def: +5, spd: -5 },
    behavior: ["constructive", "strategic"],
    elements: ["metal", "fire"],
    themes: ["turrets", "gadgets"],
    flavor: "A battlefield technician deploying mechanical tools and traps."
  },

  "tinkerer": {
    role: "support",
    statProfile: { hp: -5, atk: +5, def: 0, spd: +5 },
    behavior: ["improvisational", "clever"],
    elements: ["metal", "arcane"],
    themes: ["devices", "quick fixes"],
    flavor: "A crafty inventor who improvises tools mid‑battle."
  },

  "herbalist": {
    role: "support",
    statProfile: { hp: 0, atk: 0, def: 0, spd: 0 },
    behavior: ["calm", "restorative"],
    elements: ["nature"],
    themes: ["healing herbs", "toxins"],
    flavor: "A nature‑focused healer who uses plants for aid or harm."
  },

  /* ============================================================
     JOKE / CHAOS / SPECIAL
  ============================================================ */

  "jester": {
    role: "chaos",
    statProfile: { hp: -10, atk: +10, def: -10, spd: +20 },
    behavior: ["unpredictable", "trickster"],
    elements: ["chaos"],
    themes: ["pranks", "random effects"],
    flavor: "A chaotic performer whose antics defy logic."
  },

  "chaosborn": {
    role: "striker",
    statProfile: { hp: +5, atk: +20, def: -5, spd: +10 },
    behavior: ["unstable", "erratic"],
    elements: ["chaos", "void"],
    themes: ["mutations", "wild surges"],
    flavor: "A being warped by raw chaotic energy."
  },

  "mimic": {
    role: "ambusher",
    statProfile: { hp: +20, atk: +15, def: +10, spd: -10 },
    behavior: ["deceptive", "lurking"],
    elements: ["dark"],
    themes: ["disguise", "devour"],
    flavor: "A shapeshifting predator disguised as an object."
  },

  "slime": {
    role: "bruiser",
    statProfile: { hp: +15, atk: +5, def: +10, spd: -10 },
    behavior: ["amorphous", "splitting"],
    elements: ["water", "poison"],
    themes: ["engulf", "divide"],
    flavor: "A gelatinous creature that engulfs anything in its path."
  },

  "cosmic-horror": {
    role: "boss",
    statProfile: { hp: +40, atk: +30, def: +20, spd: +10 },
    behavior: ["eldritch", "mind‑breaking"],
    elements: ["cosmic", "void"],
    themes: ["madness", "reality warp"],
    flavor: "An unfathomable entity whose presence distorts reality."
  }

}; // END PROFESSION_IDENTITY
