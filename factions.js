import { SETTLEMENTS } from "./settlement-definitions.js";
import { player } from "./player-storage.js";

const FACTIONS = {
  alliance: { name: "Emerald Alliance" },
  dominion: { name: "Crimson Dominion" }
};

SETTLEMENTS.greenhaven.faction = "alliance";
SETTLEMENTS.emberfall.faction = "dominion";

player.factions = {
  alliance: 15,
  dominion: -5
};
