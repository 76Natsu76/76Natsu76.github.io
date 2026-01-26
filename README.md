# S3ven RPG — 76Natsu76.github.io

A fully data‑driven, Twitch‑integrated RPG engine built on JSON definitions and modular JavaScript systems.

The project is designed so that **almost everything** — enemies, loot, professions, races, subraces, abilities, regions, merchants — is defined in data files, with resolvers and engines reading from those definitions.

---

## High-level architecture

### Core concepts

- **Players**  
  - Stored in `players.json`  
  - Runtime helpers in `player-registry.js`, `player-storage.js`  
  - UI in `character.html`, `inventory.html`, `levelup.html`, `player-inspector.html`

- **Enemies**  
  - Canonical data in:
    - `enemies.json`
    - `enemy-variants.json`
    - `enemy-subrace.json`
    - `enemy-tags.json`
    - `enemy-abilities.json`
    - `enemy-ultimates.json`
    - `enemy-families.json`
    - `enemy-regions.json`
  - Runtime helpers in:
    - `enemy-database.js`
    - `enemy-registry.js`
    - `resolveEnemy.js`

- **Races & Subraces**  
  - Races in `race-definitions.json`  
  - Race tiers in `race-tier-index.json`  
  - Subrace mapping in `subrace-race-index.json`  
  - Subrace stat profiles in `subrace-stat-profiles.json`  
  - Subrace abilities in `subrace-ability-definitions.json`

- **Professions**  
  - Definitions in `profession-definitions.json`  
  - Talent trees in `profession-talent-trees.json`  
  - Synergies in:
    - `profession-synergies.json`
    - `profession-biome-bonuses.json`
    - `profession-weather-synergies.json`  
  - Starter kits in `profession-starter-kits.json`

- **Abilities & Status**  
  - Profession abilities in `ability-definitions.json`  
  - Subrace abilities in `subrace-ability-definitions.json`  
  - Enemy abilities in `enemy-abilities.json`  
  - Resolution in:
    - `ability-resolver.js`
    - `combat-engine.js`
    - `combat-flow.js`
    - `damage-helpers.js`
    - `status-effects.js`
    - `status-engine.js`
    - `dot-hot-engine.js`
    - `shield-engine.js`
    - `cleanse-engine.js`

- **World & Regions**  
  - Regions in `regions.json`  
  - Region → biome mapping in `region-to-biome.js`  
  - Region biomes in `region-biomes.js`  
  - Region encounter tables in `region-encounter-tables.json`  
  - Region loot tables in `region-loot-tables.json`  
  - Region tier bands in `region-tier-bands.json`  
  - Region race pools in `region-race-pools.json`  
  - Region modifiers in `region-modifiers.js`  
  - World data in `world-data.js`  
  - Biomes in `biomes.json` and `biome-presets.js`  
  - Weather in `weatherTable.js`  
  - World admin UIs in `world-admin.html`, `world-map-admin.html`, `region-controls.html`

- **Loot & Items**  
  - Items in `items.json`  
  - Item registry in `item-registry.js`  
  - Global loot tables in `loot-tables.json`  
  - Boss loot in `boss-loot-tables.json`  
  - Region loot in `region-loot-tables.json`  
  - Rarity weights in `rarity-weights.json`

- **Shops & Merchants**  
  - Shop pools in `shop-pool.json`  
  - Shop engine in `shop-engine.js`, `shop.js`, `shop-ui.js`  
  - Merchant types in `merchant-types.json`  
  - Merchant personalities in `merchant-personalities.json`  
  - Merchant instances in `merchant-instances.json`  
  - Merchant inventory in `merchant-inventory.json`  
  - Merchant resolver in `merchant-resolver.js`  
  - Shop UIs in `global-shop.html`, `daily-shop.html`, `shop-pool-editor.html`

- **Twitch / API**  
  - API endpoints in `api.js`  
  - Login / redirect flows in `login.html`, `index.html`, `landing.html`  
  - Various UIs in `action-cases.html`, `enemy.html`, `encounter.html`, `fight-interactive.html`, etc.

---

## Race taxonomy

Races are defined in `race-definitions.json` and indexed in `race-tier-index.json`.

The canonical race list (67 total):

- **Part 1**  
  humanoid, elf, dwarf, orc, goblinoid, beastkin, draconian, undead, demonborn, voidborn,  
  celestialborn, spiritborn, elementalborn, titanborn, giantkin, colossus, fae, chimera, construct, plantfolk

- **Part 2**  
  slimeborn, insectoids, arachnids, supernatural, astralborn, chaosborn, dragonkin, aberration, eldritch, lich,  
  mimic, beast, amorphous, techborn, machina, dragon, wyrm, spirit, mythic_beast, divinity

- **Part 3**  
  celestial, fiend, primordial, ethereal, titan, outer_god, planar_entity, anomaly, legendary_boss_template, paragon,  
  hybrid, forgotten_race, cosmic_construct, metaphysical_phenomenon, parasite, cosmic_fauna, mythic_undead, hivemind, living_location, artificial_life

- **Part 4**  
  temporal_entity, divine_beast, meta_entity, narrative_construct, emotional, paradox_god, multiversal_paragon

Subraces are mapped in `subrace-race-index.json` and their stat/ability profiles live in:

- `subrace-stat-profiles.json`
- `subrace-ability-definitions.json`

---

## How to add a new enemy

1. **Define the enemy base entry**  
   - Add a new entry in `enemies.json` with:
     - `key`
     - `name`
     - `race`
     - `subrace`
     - `profession` (if applicable)
     - base stats (hp, atk, def, etc.)

2. **Assign variants (optional)**  
   - Add variant entries in `enemy-variants.json` if this enemy has multiple difficulty tiers or flavors.

3. **Assign subrace & tags**  
   - Ensure the `subrace` exists in `subrace-race-index.json` and `subrace-stat-profiles.json`.  
   - Add any thematic tags in `enemy-tags.json` (e.g. `["undead", "elite", "fire"]`).

4. **Hook into regions**  
   - Add the enemy key to appropriate region pools in `enemy-regions.json` and/or `region-encounter-tables.json`.

5. **Assign abilities**  
   - Add ability keys in `enemy-abilities.json` and `enemy-ultimates.json` (if it has an ultimate).  
   - Make sure those ability keys exist in `ability-definitions.json` or `enemy-abilities.json`.

6. **Verify in runtime**  
   - `enemy-database.js` / `enemy-registry.js` / `resolveEnemy.js` will pull the data together.  
   - Test via `encounter.html` / `fight-interactive.html`.

---

## How to add loot

1. **Add the item**  
   - Create a new item entry in `items.json` with:
     - `id`
     - `name`
     - `type` (weapon, armor, consumable, etc.)
     - `rarity`
     - any stat modifiers or special effects

2. **Register the item**  
   - Ensure `item-registry.js` can resolve it by `id`.

3. **Add to loot tables**  
   - Global drops: `loot-tables.json`  
   - Region-specific: `region-loot-tables.json`  
   - Boss-specific: `boss-loot-tables.json`  
   - Merchant stock: `merchant-inventory.json`, `merchant-tables.json`

4. **Balance rarity**  
   - Adjust `rarity-weights.json` if you introduce a new rarity or want to rebalance drop chances.

---

## How to add a profession

1. **Define the profession**  
   - Add a new entry in `profession-definitions.json`:
     - base stats
     - resource type (mana, rage, etc.)
     - flavor text

2. **Starter kit**  
   - Add a starter kit entry in `profession-starter-kits.json`:
     - starting equipment IDs (must exist in `items.json`)
     - starting consumables, if any

3. **Abilities**  
   - Add abilities for this profession in `ability-definitions.json` under the profession key.  
   - Each ability should define:
     - `key`, `name`
     - `basePower`, `scalingPerLevel`
     - `manaCost`, `cooldown`
     - `combatTags`
     - `statusEffects` (if any)
     - `description`

4. **Talent tree**  
   - Add a talent tree entry in `profession-talent-trees.json`:
     - nodes, prerequisites, bonuses  
   - Hook into `talent-modifiers.js` if you want talents to affect damage or other combat behavior.

5. **Synergies**  
   - Add profession-specific synergies in:
     - `profession-synergies.json`
     - `profession-biome-bonuses.json`
     - `profession-weather-synergies.json`

---

## How to add a race

1. **Add race definition**  
   - Add a new race entry in `race-definitions.json`:
     - `key`
     - `name`
     - base flavor and any global modifiers

2. **Tier index**  
   - Add the race to `race-tier-index.json` with its tier (e.g. common, rare, mythic, cosmic).

3. **Subraces**  
   - Add subraces for this race in `subrace-race-index.json`.  
   - Define their stat profiles in `subrace-stat-profiles.json`.  
   - Define their abilities in `subrace-ability-definitions.json`.

4. **Region pools**  
   - Add the race to appropriate region pools in `region-race-pools.json`.

---

## How to add a subrace

1. **Map the subrace to a race**  
   - In `subrace-race-index.json`, add:
     ```json
     "wolfkin": "beastkin"
     ```

2. **Define stat profile**  
   - In `subrace-stat-profiles.json`, add:
     ```json
     "wolfkin": {
       "hpMult": 1.1,
       "atkMult": 1.1,
       "defMult": 1.0,
       "speedMult": 1.1
     }
     ```

3. **Define subrace abilities**  
   - In `subrace-ability-definitions.json`, add:
     ```json
     "beastkin": {
       "wolfkin": {
         "howl_of_the_pack": { ... ability object ... }
       }
     }
     ```

4. **Use in enemies**  
   - In `enemies.json`, set `subrace: "wolfkin"` for any enemy that uses it.

---

## How to add an ability

1. **Decide the owner**  
   - Profession ability → `ability-definitions.json`  
   - Subrace ability → `subrace-ability-definitions.json`  
   - Enemy-only ability → `enemy-abilities.json`

2. **Define the ability object**  
   Example (profession ability):

   ```json
   "acolyte": {
     "minor_heal": {
       "key": "minor_heal",
       "name": "Minor Heal",
       "basePower": 0.0,
       "scalingPerLevel": 0.05,
       "manaCost": 10,
       "cooldown": 1,
       "combatTags": ["holy", "heal", "support"],
       "statusEffects": [
         { "type": "heal_flat", "power": 12, "duration": 0, "stack": "add" }
       ],
       "description": "A simple prayer restores a small amount of health."
     }
   }
3. **Status Effects**  
   - Use statusEffects to attach DOTs, HOTs, shields, buffs, debuffs, cleanses, etc.
   - status-engine.js, dot-hot-engine.js, shield-engine.js, and cleanse-engine.js interpret these.


4. **Ultimates**
   - Add isUltimate, chargeRequired, usesPerCombat if it’s an ultimate.
   - Wire ultimate charge logic in your combat flow (e.g. in combat-engine.js / combat-flow.js).

## How to update talent trees

1. **Edit profession-talent-trees.json**
   - Add or modify nodes, prerequisites, and bonuses.

2. **Hook into talent-modifiers.js**
   - Read the attacker’s talent state (however you store it) and adjust:
     - damage
     - crit chance
     - resource costs
     - status durations

 - Example:
   ```javascript
    // talent-modifiers.js
    if (attacker.talents?.fire_mastery && ability.combatTags?.includes('fire')) {
      dmg *= 1.1;
    }
3. **UI / allocation**

 - Ensure your talent allocation UI (if any) writes to the same structure that talent-modifiers.js expects.

## World tick & seasons

 - The world uses a tick counter (stored in world-data.js and/or related files).
 - Time is tracked in minutes, and seasons rotate weekly.
 - Seasons and ticks can influence:
     - encounter tables
     - shop inventories
     - region modifiers
     - profession/weather synergies

 These hooks are intended to be wired through:
  - region-modifiers.js
  - world-modifiers.js
  - profession-weather-synergies.json

## Philosophy
 - **Data first: JSON defines the world; JS reads and resolves it.**
 - **No magic constants: everything important lives in a file you can edit.**
 - **Composable systems: enemies, races, professions, abilities, regions, merchants all plug into shared engines.**
 - **Twitch‑friendly: the architecture is designed so viewers can interact via commands that map cleanly to data‑driven actions.**

# Developer Quickguide

This project is fully data‑driven.
Almost everything is defined in JSON and resolved by modular JS engines.

## Add a new enemy
1. Add base entry → enemies.json
2. Add subrace → enemy-subrace.json
3. Add abilities → enemy-abilities.json
4. Add region placement → enemy-regions.json
5. Add loot → region-loot-tables.json or boss-loot-tables.json

## Add a new item
1. Add item → items.json
2. Add to loot tables → loot-tables.json, region-loot-tables.json, etc.
3. Add to merchant pools → merchant-inventory.json

## Add a new profession
1. Add definition → profession-definitions.json
2. Add abilities → ability-definitions.json
3. Add talent tree → profession-talent-trees.json
4. Add starter kit → profession-starter-kits.json

## Add a new race
1. Add race → race-definitions.json
2. Add subraces → subrace-race-index.json
3. Add subrace stats → subrace-stat-profiles.json
4. Add subrace abilities → subrace-ability-definitions.json

## Add a new ability
1. Add ability object → appropriate JSON file
2.. Ensure status effects follow the schema

3. Ability auto‑resolves via ability-resolver.js

## Combat Flow
 - combat-engine.js
     - handles turn order
 - ability-resolver.js
     - handles ability execution
 - status-engine.js
     - handles DOT/HOT/buffs/debuffs
 - shield-engine.js
     - handles shields
 - cleanse-engine.js
     - handles cleanses

## World Integration
 - Biomes → biomes.json
 - Weather → weatherTable.js
 - Regions → regions.json
 - World modifiers → world-modifiers.js

   
## Welcome to the multiversal canon.
