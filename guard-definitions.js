// guard-definitions.js

export const GUARD_STATS = {
  level: 10,
  hpMax: 80,
  atk: 12,
  def: 8,
  speed: 5,
  element: "physical"
};

export function createGuardInstance(id = "town_guard") {
  return {
    id,
    name: "Town Guard",
    isNPC: true,
    isGuard: true,
    level: GUARD_STATS.level,
    hpCurrent: GUARD_STATS.hpMax,
    hpMax: GUARD_STATS.hpMax,
    atk: GUARD_STATS.atk,
    def: GUARD_STATS.def,
    speed: GUARD_STATS.speed,
    element: GUARD_STATS.element
  };
}
