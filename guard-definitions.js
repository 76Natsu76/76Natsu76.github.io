// guard-definitions.js

export const GUARD_TIERS = {
  remote_village: { level: 10, hp: 60, atk: 8, def: 4 },
  village:        { level: 20, hp: 120, atk: 16, def: 8 },
  town:           { level: 50, hp: 300, atk: 40, def: 20 },
  city:           { level: 100, hp: 600, atk: 70, def: 50 },
  royal_capital:  { level: 500, hp: 3000, atk: 400, def: 250 }
};

export function createGuardInstance(settlementKey) {
  const tier = getGuardTierForSettlement(settlementKey);
  const stats = GUARD_TIERS[tier];

  return {
    id: "guard_" + tier,
    name: tier === "royal_capital" ? "Royal Guard" : "Town Guard",
    isNPC: true,
    isGuard: true,
    level: stats.level,
    hpCurrent: stats.hp,
    hpMax: stats.hp,
    atk: stats.atk,
    def: stats.def,
    speed: 5,
    element: "physical"
  };
}

function getGuardTierForSettlement(key) {
  const type = SETTLEMENTS[key].type;
  if (type === "village") return "village";
  if (type === "town") return "town";
  if (type === "city") return "city";
  if (key === "capital_city") return "royal_capital";
  return "remote_village";
}
