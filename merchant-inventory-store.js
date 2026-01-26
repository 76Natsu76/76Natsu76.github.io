// merchant-inventory-store.js

import fs from 'fs';
import path from 'path';
import { generateMerchantInventory } from './merchant-resolver.js';

const STORE_PATH = path.resolve('./merchant-inventory.json');

/**
 * Load the current merchant inventory store from disk.
 */
function loadStore() {
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return {}; // empty store
  }
}

/**
 * Save the store back to disk.
 */
function saveStore(store) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

/**
 * Get inventory for a merchant.
 * If expired or missing, regenerate.
 */
export function getMerchantInventory(merchantId, options = {}) {
  const store = loadStore();
  const now = Date.now();

  const entry = store[merchantId];

  const refreshInterval = options.refreshInterval ?? 24 * 60 * 60 * 1000; // default: 24h

  const needsRefresh =
    !entry ||
    !entry.timestamp ||
    now - entry.timestamp > refreshInterval ||
    options.forceRefresh;

  if (needsRefresh) {
    const newInventory = generateMerchantInventory(merchantId, options);

    store[merchantId] = {
      timestamp: now,
      inventory: newInventory.items
    };

    saveStore(store);

    return store[merchantId];
  }

  return entry;
}

/**
 * Force-refresh all merchants.
 */
export function refreshAllMerchants(options = {}) {
  const store = loadStore();
  const now = Date.now();

  for (const merchantId of Object.keys(store)) {
    const newInventory = generateMerchantInventory(merchantId, options);
    store[merchantId] = {
      timestamp: now,
      inventory: newInventory.items
    };
  }

  saveStore(store);
  return store;
}
