// exploration-engine.js
import { EXPLORATION_NODES } from "./exploration-nodes.js";

export function getNode(nodeId) {
  return EXPLORATION_NODES[nodeId];
}

export function moveToNode(player, nodeId) {
  player.location = nodeId;
  return getNode(nodeId);
}
