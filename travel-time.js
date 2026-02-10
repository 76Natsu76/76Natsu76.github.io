// travel-time.js

export function calculateTravelTime(from, to, mountSpeed = 1) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  const baseSpeed = 100; // units per minute
  const timeMinutes = dist / (baseSpeed * mountSpeed);

  return Math.ceil(timeMinutes * 60 * 1000); // ms
}
