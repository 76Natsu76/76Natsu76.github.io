// building-definitions.js

export const BUILDING_TYPES = {
  INN: "inn",
  SHOP: "shop",
  HOUSE: "house",
  TOWN_HALL: "town_hall",
  GUARD_POST: "guard_post",
  TEMPLE: "temple"
};

export const BUILDINGS_BY_SETTLEMENT = {
  // Example: "starter_town"
  starter_town: [
    {
      id: "inn_main",
      type: BUILDING_TYPES.INN,
      name: "The Restful Ember",
      locked: false,
      trespassCrime: false,
      interiorId: "inn_main_interior"
    },
    {
      id: "shop_general",
      type: BUILDING_TYPES.SHOP,
      name: "Oakroot Provisions",
      locked: false,
      trespassCrime: false,
      interiorId: "shop_general_interior"
    },
    {
      id: "mayor_house",
      type: BUILDING_TYPES.HOUSE,
      name: "Mayor's Residence",
      locked: true,
      trespassCrime: true,
      interiorId: "mayor_house_interior"
    },
    {
      id: "guard_post",
      type: BUILDING_TYPES.GUARD_POST,
      name: "Town Watch Barracks",
      locked: false,
      trespassCrime: false,
      interiorId: "guard_post_interior"
    }
  ]
};
