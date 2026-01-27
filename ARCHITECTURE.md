S3ven RPG — Architecture Documentation
A complete overview of the engine, systems, data flow, and development phases.

1. High‑Level Overview
The S3ven RPG engine is a data‑driven, modular, JSON‑first RPG framework designed for:

Twitch integration

deterministic combat

scalable world simulation

extensible content (races, subraces, professions, enemies, items, regions)

long‑term maintainability

The core philosophy:

Data defines the world. Engines interpret the data. Nothing is hardcoded.

Every major system — combat, encounters, loot, merchants, world simulation — reads from JSON definitions and resolves behavior through modular JS engines.

2. Core Engine Layers
The engine is organized into five major layers:

2.1 Data Layer (JSON)
All canonical content lives here:

Races → race-definitions.json

Subraces → subrace-race-index.json, subrace-stat-profiles.json, subrace-ability-definitions.json

Professions → profession-definitions.json, profession-talent-trees.json, profession-synergies.json

Abilities → ability-definitions.json, enemy-abilities.json, enemy-ultimates.json

Enemies → enemies.json, enemy-variants.json, enemy-regions.json

Items & Loot → items.json, loot-tables.json, region-loot-tables.json, boss-loot-tables.json

Regions & World → regions.json, region-biomes.js, weatherTable.js, world-data.js

Merchants → merchant-types.json, merchant-inventory.json, merchant-tables.json

This layer is pure data — no logic.

2.2 Resolver Layer (Logic Engines)
These files interpret the data and perform game logic:

Combat & Abilities
ability-resolver.js

combat-engine.js

combat-flow.js

damage-helpers.js

Status Systems
status-engine.js

dot-hot-engine.js

shield-engine.js

cleanse-engine.js

Modifiers
world-modifiers.js

talent-modifiers.js

profession-weather-synergies.json

profession-biome-bonuses.json

Enemy Systems
enemy-registry.js

enemy-database.js

enemy-ai.js

enemy-ai-helpers.js

Encounter Systems
encounter-generator.js

encounters.js

region-encounter-tables.json

Merchant Systems
merchant-resolver.js

shop-engine.js

These engines are pure logic — they never define content.

2.3 UI Layer (HTML + JS)
All player‑facing interfaces:

character.html

inventory.html

fight-interactive.html

enemy.html

global-shop.html

daily-shop.html

world-admin.html

region-controls.html

These files call into the resolver layer.

2.4 API Layer
api.js  
Handles Twitch commands, player actions, and serverless endpoints.

2.5 World Simulation Layer
world-data.js

weatherTable.js

region-modifiers.js

region-biomes.js

This layer tracks:

world tick

time of day

weather

seasons

region modifiers

world events

3. Combat Architecture
Combat is resolved through a deterministic pipeline:

3.1 Turn Start
DOT/HOT processed

Buff/debuff durations tick

Status effects applied

Ultimate charge updated

3.2 Player/Enemy Action
Ability chosen

ability-resolver.js executes:

mana check

cooldown check

hit/crit resolution

damage calculation

shield absorption

status application

DOT/HOT scheduling

cleanse

lifesteal

AOE

world modifiers

talent modifiers

3.3 Turn End
Cooldowns tick

Status durations tick

Combat log updated

4. Data Flow Diagram
Code
JSON Data → Resolver Engines → Combat/Encounter/Merchant Logic → UI/API → Player
Or more detailed:

Code
race-definitions.json
subrace-ability-definitions.json
profession-definitions.json
enemy-abilities.json
items.json
regions.json
weatherTable.js
world-data.js
        ↓
   ability-resolver.js
   combat-engine.js
   status-engine.js
   dot-hot-engine.js
   shield-engine.js
   cleanse-engine.js
   world-modifiers.js
   talent-modifiers.js
        ↓
   encounter-generator.js
   enemy-ai.js
   merchant-resolver.js
        ↓
   UI (HTML/JS)
   Twitch API (api.js)
5. Content Architecture
5.1 Races
Defined in race-definitions.json

Tiered in race-tier-index.json

5.2 Subraces
Mapped in subrace-race-index.json

Stats in subrace-stat-profiles.json

Abilities in subrace-ability-definitions.json

5.3 Professions
Base stats in profession-definitions.json

Abilities in ability-definitions.json

Talent trees in profession-talent-trees.json

Synergies in profession-synergies.json

5.4 Enemies
Base stats in enemies.json

Variants in enemy-variants.json

Subrace in enemy-subrace.json

Abilities in enemy-abilities.json

Ultimates in enemy-ultimates.json

Region placement in enemy-regions.json

5.5 Items & Loot
Items in items.json

Loot tables in loot-tables.json

Region loot in region-loot-tables.json

Boss loot in boss-loot-tables.json

5.6 Regions & World
Regions in regions.json

Biomes in biomes.json

Weather in weatherTable.js

World tick in world-data.js





                          ┌──────────────────────────┐
                          │        PLAYERS           │
                          │   players.json           │
                          │   player-registry.js     │
                          │   player-storage.js      │
                          └───────────┬──────────────┘
                                      │
                                      ▼
                     ┌────────────────────────────────────┐
                     │            UI LAYER                 │
                     │ character.html / inventory.html     │
                     │ fight-interactive.html              │
                     │ enemy.html / encounter.html         │
                     │ world-admin.html / region-controls  │
                     └──────────────────┬──────────────────┘
                                        │
                                        ▼
                   ┌────────────────────────────────────────┐
                   │              API LAYER                  │
                   │               api.js                   │
                   │     (Twitch commands, endpoints)       │
                   └──────────────────┬─────────────────────┘
                                      │
                                      ▼
         ┌──────────────────────────────────────────────────────────┐
         │                     RESOLVER LAYER                       │
         │                                                          │
         │  ability-resolver.js   combat-engine.js   combat-flow.js │
         │  status-engine.js      dot-hot-engine.js  shield-engine  │
         │  cleanse-engine.js     world-modifiers.js talent-mods    │
         │  enemy-ai.js           enemy-ai-helpers.js               │
         │  encounter-generator.js encounter.js                     │
         │  merchant-resolver.js  shop-engine.js                    │
         └──────────────────┬───────────────────────────────────────┘
                            │
                            ▼
        ┌────────────────────────────────────────────────────────────┐
        │                         DATA LAYER                         │
        │                                                            │
        │  RACES: race-definitions.json, race-tier-index.json        │
        │  SUBRACES: subrace-race-index.json, subrace-abilities.json │
        │  PROFESSIONS: profession-definitions.json, talent-trees    │
        │  ABILITIES: ability-definitions.json, enemy-abilities.json │
        │  ENEMIES: enemies.json, enemy-variants.json                │
        │  ITEMS: items.json, loot-tables.json                       │
        │  REGIONS: regions.json, region-loot-tables.json            │
        │  WORLD: world-data.js, weatherTable.js, biomes.json        │
        │  MERCHANTS: merchant-types.json, merchant-inventory.json   │
        └──────────────────┬─────────────────────────────────────────┘
                            │
                            ▼
               ┌──────────────────────────────────────────┐
               │           WORLD SIMULATION                │
               │   world tick, seasons, weather, events    │
               │   region modifiers, biome effects          │
               └──────────────────────────────────────────┘





ENTER DUNGEON
     │
     ▼
 ┌───────────┐
 │ FLOOR 1   │
 │ Encounter │──► Combat Engine
 │ Event     │──► Event Resolver
 │ Treasure  │──► Loot Resolver
 └─────┬─────┘
       │
       ▼
 ┌───────────┐
 │ FLOOR 2   │
 │ (Harder)  │
 └─────┬─────┘
       │
       ▼
   ... repeat ...
       │
       ▼
 ┌──────────────┐
 │ BOSS FLOOR    │──► Legendary Boss Template
 └──────────────┘
       │
       ▼
   EXIT / REWARD
