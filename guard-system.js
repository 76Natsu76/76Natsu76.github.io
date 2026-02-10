// guard-system.js
import { reportCrime, CRIME_TYPES } from "./crime-system.js";

export function evaluateGuardResponse(player, settlementKey) {
  const bounty = player.bounty?.[settlementKey] || 0;

  if (bounty <= 0) return "ignore";
  if (bounty < 50) return "warn";
  if (bounty < 150) return "chase";
  if (bounty < 300) return "attack";
  return "kill";
}

export function guardInteract(player, settlementKey) {
  const response = evaluateGuardResponse(player, settlementKey);

  switch (response) {
    case "warn":
      return "A guard warns you to behave.";
    case "chase":
      return "Guards are chasing you!";
    case "attack":
      return "Guards attack!";
    case "kill":
      return "Guards attempt to execute you!";
  }
}
