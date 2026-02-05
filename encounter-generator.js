import { EncounterEngine } from "./encounter-engine.js";

export function generateEncounter(regionKey, playerState) {
  return EncounterEngine.generate(regionKey, playerState);
}
