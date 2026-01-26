// /js/merchant-inventory-store.js

import { initMerchantData, generateMerchantInventorySync } from './merchant-resolver.js';

const STORAGE_KEY = 'merchant_inventory_v1';

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export async function getMerchantInventory(merchantId, options = {}) {
  await initMerchantData();

  const store = loadStore();
  const todayKey = getTodayKey();

  const entry = store[merchantId];

  const needsRefresh =
    !entry ||
    entry.day !== todayKey ||
    options.forceRefresh;

  if (needsRefresh) {
    const generated = generateMerchantInventorySync(merchantId, options);

    store[merchantId] = {
      day: todayKey,
      inventory: generated.items
    };

    saveStore(store);
    return store[merchantId];
  }

  return entry;
}
