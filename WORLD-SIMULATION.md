# World Simulation — Identity Integration

Region identity defines two drift values:

- **stabilityDrift** — how stable the region becomes over time
- **dangerDrift** — how dangerous the region becomes over time

These are applied each world tick:

```js
regionState.stability += identity.stabilityDrift;
regionState.danger += identity.dangerDrift;
