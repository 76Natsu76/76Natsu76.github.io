export const WORLD_MAP = {
  tileSize: 32,

  regions: {
    forest: {
      bounds: { x1: 0, y1: 0, x2: 500, y2: 500 },
      encounterTable: "forest_edge"
    },
    plains: {
      bounds: { x1: 500, y1: 0, x2: 1200, y2: 600 },
      encounterTable: "plains_field"
    },
    capital_city: {
      bounds: { x1: 1200, y1: 200, x2: 1500, y2: 500 },
      safeZone: true
    }
  },

  buildings: [
    { id: "greenhaven_inn", x: 100, y: 100, settlement: "greenhaven", buildingId: "inn_main" },
    { id: "greenhaven_shop", x: 120, y: 100, settlement: "greenhaven", buildingId: "shop_general" },
    { id: "throne_room", x: 1350, y: 350, settlement: "capital_city", buildingId: "throne_room" }
  ]
};
