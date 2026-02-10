// player-sprite.js

export const PLAYER_SPRITE = {
  image: null,
  loaded: false,

  frameWidth: 32,
  frameHeight: 32,

  // Animation timing
  frameIndex: 0,
  frameTimer: 0,
  frameInterval: 120, // ms per frame

  direction: "down", // "up", "down", "left", "right"
  moving: false
};

export function loadPlayerSprite() {
  const img = new Image();
  img.src = "./assets/player.png"; // your sprite sheet
  img.onload = () => {
    PLAYER_SPRITE.image = img;
    PLAYER_SPRITE.loaded = true;
  };
}

export function updatePlayerSprite(deltaTime) {
  if (!PLAYER_SPRITE.moving) {
    PLAYER_SPRITE.frameIndex = 0;
    return;
  }

  PLAYER_SPRITE.frameTimer += deltaTime;
  if (PLAYER_SPRITE.frameTimer >= PLAYER_SPRITE.frameInterval) {
    PLAYER_SPRITE.frameTimer = 0;
    PLAYER_SPRITE.frameIndex = (PLAYER_SPRITE.frameIndex + 1) % 4; // 4 frames per direction
  }
}

export function drawPlayerSprite(ctx, x, y) {
  if (!PLAYER_SPRITE.loaded) return;

  const dirIndex = {
    down: 0,
    left: 1,
    right: 2,
    up: 3
  }[PLAYER_SPRITE.direction];

  ctx.drawImage(
    PLAYER_SPRITE.image,
    PLAYER_SPRITE.frameIndex * PLAYER_SPRITE.frameWidth,
    dirIndex * PLAYER_SPRITE.frameHeight,
    PLAYER_SPRITE.frameWidth,
    PLAYER_SPRITE.frameHeight,
    x,
    y,
    PLAYER_SPRITE.frameWidth,
    PLAYER_SPRITE.frameHeight
  );
}
