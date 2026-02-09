// trade-routes.js
import { getWorldState } from "./world-state.js";

export const TRADE_ROUTES = [
  { from: "greenhaven", to: "emberfall", resource: "herbs", rate: 1 },
  { from: "emberfall", to: "frostwatch", resource: "ore", rate: 1 }
];

export function tickTradeRoutes() {
  const world = getWorldState();

  for (const route of TRADE_ROUTES) {
    const from = world.settlements[route.from];
    const to = world.settlements[route.to];

    if (!from || !to) continue;

    const amount = route.rate * from.prosperity;

    from.economy.resources[route.resource] =
      (from.economy.resources[route.resource] || 0) - amount;

    to.economy.resources[route.resource] =
      (to.economy.resources[route.resource] || 0) + amount;
  }
}
