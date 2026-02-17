import { CODEX } from "./codex.js";

export function registerIdentityDiscovery(enemy) {
  if (!enemy) return;

  // Profession
  if (enemy.profession && CODEX.professions[enemy.profession]) {
    CODEX.professions[enemy.profession].discovered = true;
  }

  // Element
  if (enemy.element && CODEX.elements[enemy.element]) {
    CODEX.elements[enemy.element].discovered = true;
  }

  // Subrace
  if (enemy.subrace && CODEX.subraces[enemy.subrace]) {
    CODEX.subraces[enemy.subrace].discovered = true;
  }

  // Variant
  if (enemy.variant && CODEX.variants[enemy.variant]) {
    CODEX.variants[enemy.variant].discovered = true;
  }
}
