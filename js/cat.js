window.Game = window.Game || {};

window.Game.Cat = function (startX, startY) {
  const Audio = window.Game.Audio;
  const Particles = window.Game.Particles;

  const DEFAULT_PHYSICS = {
    gravity: 1650,
    jumpForce: 660,
    runSpeed: 330,
    wallSlideSpeed: 110,
  };

  // Fallback SVG Sprite
  const EXACT_CAT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f2963f"/>
      <stop offset="65%" stop-color="#e47e28"/>
      <stop offset="100%" stop-color="#c96519"/>
    </linearGradient>
    <radialGradient id="headGrad" cx="46%" cy="44%" r="54%">
      <stop offset="0%" stop-color="#f6a24b"/>
      <stop offset="70%" stop-color="#e5812b"/>
      <stop offset="100%" stop-color="#c96418"/>
    </radialGradient>
    <radialGradient id="irisGrad" cx="50%" cy="68%" r="55%">
      <stop offset="0%" stop-color="#f2c464"/>
      <stop offset="48%" stop-color="#a45c1b"/>
      <stop offset="100%" stop-color="#482107"/>
    </radialGradient>
    <linearGradient id="earPink" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f099a6"/>
      <stop offset="100%" stop-color="#d67181"/>
    </linearGradient>
    <radialGradient id="bellGrad" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#fff4a3"/>
      <stop offset="55%" stop-color="#f2bd34"/>
      <stop offset="100%" stop-color="#a86a10"/>
    </radialGradient>
    <clipPath id="leftEyeClip">
      <path d="M 135,193 C 134,174 156,170 165,187 C 171,200 163,215 148,214 C 137,213 135,203 135,193 Z"/>
    </clipPath>
    <clipPath id="rightEyeClip">
      <path d="M 190,192 C 193,167 224,163 233,182 C 240,197 226,214 206,214 C 193,214 188,204 190,192 Z"/>
    </clipPath>
  </defs>
  <g stroke-linejoin="round" stroke-linecap="round">
    <path d="M 326,274 C 362,262 385,222 372,175" fill="none" stroke="#5c280c" stroke-width="30"/>
    <path d="M 326,274 C 362,262 385,222 372,175" fill="none" stroke="url(#bodyGrad)" stroke-width="24"/>
    <path d="M 345,264 C 352,256 360,258 364,264" fill="none" stroke="#be5316" stroke-width="8"/>
    <path d="M 362,240 C 370,234 378,236 382,242" fill="none" stroke="#be5316" stroke-width="9"/>
    <path d="M 367,212 C 375,207 383,209 386,215" fill="none" stroke="#be5316" stroke-width="9"/>
    <path d="M 364,187 C 373,182 381,184 384,189" fill="none" stroke="#be5316" stroke-width="8"/>
    <path d="M 357,183 C 344,165 347,145 358,140 C 370,135 384,152 386,178 L 379,173 L 374,181 L 367,174 L 362,183 Z" fill="#fff8ee" stroke="#5c280c" stroke-width="3.2"/>
  </g>
  <g stroke-linejoin="round" stroke-linecap="round">
    <path d="M 262,315 C 272,336 286,348 278,376 L 296,378 C 304,352 300,334 292,310 Z" fill="#c66018" stroke="#5c280c" stroke-width="3.2"/>
    <path d="M 277,364 L 283,368 L 289,363 L 296,367 L 294,386 L 272,386 Z" fill="#eadbcf"/>
    <path d="M 269,386 C 260,386 259,398 269,399 L 290,399 C 296,399 297,392 294,385" fill="#eadbcf" stroke="#5c280c" stroke-width="3.2"/>
    <path d="M 192,296 L 204,376 L 226,376 L 228,302 Z" fill="#d46d1f" stroke="#5c280c" stroke-width="3.2"/>
    <path d="M 203,358 L 210,362 L 217,357 L 226,361 L 226,386 L 202,386 Z" fill="#f7efe4"/>
    <path d="M 198,384 C 188,384 188,399 199,399 L 221,399 C 226,399 227,392 225,384" fill="#f7efe4" stroke="#5c280c" stroke-width="3.2"/>
  </g>
  <g stroke-linejoin="round" stroke-linecap="round">
    <path d="M 195,254 C 235,248 288,255 322,265 C 342,273 344,306 334,322 C 302,326 265,325 225,318 C 195,312 186,282 195,254 Z" fill="url(#bodyGrad)" stroke="#5c280c" stroke-width="3.4"/>
    <path d="M 258,253 L 271,254 L 265,282 Z" fill="#be5316"/>
    <path d="M 281,256 L 296,258 L 289,291 Z" fill="#be5316"/>
    <path d="M 307,260 L 320,264 L 311,288 Z" fill="#be5316"/>
  </g>
  <g stroke-linejoin="round" stroke-linecap="round">
    <path d="M 296,304 C 300,334 316,352 325,376 L 344,376 C 348,350 338,325 336,296" fill="url(#bodyGrad)" stroke="#5c280c" stroke-width="3.2"/>
    <path d="M 323,363 L 330,367 L 337,362 L 344,366 L 343,386 L 321,386 Z" fill="#fff8ee"/>
    <path d="M 321,384 C 312,384 312,399 323,399 L 342,399 C 347,399 348,391 344,384" fill="#fff8ee" stroke="#5c280c" stroke-width="3.2"/>
    <path d="M 192,254 C 182,265 182,276 188,283 L 182,288 C 185,296 190,301 196,304 L 192,310 C 204,321 218,328 236,330 C 238,308 232,276 222,256 Z" fill="#fff8ee" stroke="#5c280c" stroke-width="3.2"/>
    <path d="M 232,296 C 238,326 240,352 232,376 L 256,376 C 266,352 272,328 268,302" fill="url(#bodyGrad)" stroke="#5c280c" stroke-width="3.2"/>
    <path d="M 233,356 L 241,361 L 248,355 L 258,360 L 255,386 L 228,386 Z" fill="#fff8ee"/>
    <path d="M 228,383 C 218,383 218,399 230,399 L 252,399 C 258,399 259,391 255,383" fill="#fff8ee" stroke="#5c280c" stroke-width="3.2"/>
  </g>
  <g stroke-linejoin="round" stroke-linecap="round">
    <path d="M 185,250 C 204,260 228,252 243,237 L 246,246 C 230,263 204,271 187,261 Z" fill="#c82323" stroke="#5c280c" stroke-width="3.2"/>
    <circle cx="199" cy="272" r="9.5" fill="url(#bellGrad)" stroke="#5c280c" stroke-width="3"/>
  </g>
  <g stroke-linejoin="round" stroke-linecap="round">
    <path d="M 136,178 C 130,152 135,126 142,110 C 156,120 168,134 176,146 Z" fill="url(#headGrad)" stroke="#5c280c" stroke-width="3.4"/>
    <path d="M 139,172 C 135,152 139,130 144,117 C 154,126 163,138 168,148 Z" fill="url(#earPink)"/>
    <path d="M 212,142 C 224,122 237,108 248,98 C 262,122 268,156 262,186 Z" fill="url(#headGrad)" stroke="#5c280c" stroke-width="3.4"/>
    <path d="M 222,146 C 231,130 240,118 247,110 C 257,130 261,156 256,178 Z" fill="url(#earPink)"/>
    <path d="M 136,175 C 138,156 158,144 182,141 L 178,125 C 184,125 189,130 192,135 L 191,129 C 196,130 200,135 202,140 C 228,142 252,158 262,184 L 276,197 L 266,205 L 272,212 C 258,236 226,252 186,251 C 154,250 132,235 123,215 L 130,212 L 126,206 L 135,202 C 134,192 134,183 136,175 Z" fill="url(#headGrad)" stroke="#5c280c" stroke-width="3.4"/>
    <g><path d="M 135,193 C 134,174 156,170 165,187 C 171,200 163,215 148,214 C 137,213 135,203 135,193 Z" fill="#fcf4df"/><g clip-path="url(#leftEyeClip)"><ellipse cx="149" cy="195" rx="13.5" ry="16" fill="url(#irisGrad)"/><ellipse cx="149" cy="195" rx="8.5" ry="11" fill="#1b0b04"/><circle cx="144" cy="188" r="4.6" fill="#ffffff"/></g><path d="M 135,193 C 134,174 156,170 165,187 C 171,200 163,215 148,214 C 137,213 135,203 135,193 Z" fill="none" stroke="#2c1205" stroke-width="3"/></g>
    <g><path d="M 190,192 C 193,167 224,163 233,182 C 240,197 226,214 206,214 C 193,214 188,204 190,192 Z" fill="#fcf4df"/><g clip-path="url(#rightEyeClip)"><ellipse cx="206" cy="192" rx="16.5" ry="18.5" fill="url(#irisGrad)"/><ellipse cx="206" cy="192" rx="10.5" ry="12.8" fill="#1b0b04"/><circle cx="200" cy="184" r="5.5" fill="#ffffff"/></g><path d="M 190,192 C 193,167 224,163 233,182 C 240,197 226,214 206,214 C 193,214 188,204 190,192 Z" fill="none" stroke="#2c1205" stroke-width="3.2"/></g>
    <path d="M 171,206 C 161,206 156,214 159,223 C 161,232 169,238 179,238 C 191,238 199,231 199,221 C 199,212 191,206 181,206 Z" fill="#fff8ee"/>
    <path d="M 165,213 C 169,210 175,210 179,213 L 172,221 Z" fill="#ea7b91" stroke="#5c280c" stroke-width="2.6"/>
    <path d="M 172,221 L 172,225 C 168,229 162,228 160,224 M 172,225 C 177,230 186,229 190,222" fill="none" stroke="#5c280c" stroke-width="2.8"/>
  </g>
</svg>`;

  // Fallback SVG image
  let fallbackImg = new Image();
  let fallbackReady = false;
  fallbackImg.onload = function () { fallbackReady = true; };
  fallbackImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(EXACT_CAT_SVG);

  // 7x5 Sprite Sheet Loader (Rows: 0=Idle, 1=Walk, 2=Crouch, 3=Hurt, 4=Jump)
  const SHEET_COLS = 7;
  const SHEET_ROWS = 5;
  let sheetFrames = null; // Default classic 2D array [row][col]
  const skinSheets = {};  // Per-skin 2D array [row][col] for classic, crown, scarf, cyber, wings

  function cleanCellBackground(cellCanvas) {
    const w = cellCanvas.width;
    const h = cellCanvas.height;
    const octx = cellCanvas.getContext('2d');
    const imgData = octx.getImageData(0, 0, w, h);
    const d = imgData.data;

    // Edge-seeded flood fill to remove fake checkerboard & divider lines
    // without touching white fur inside the cat!
    const visited = new Uint8Array(w * h);
    const stack = new Int32Array(w * h);
    let sp = 0;

    function isBgPixel(idx4) {
      const r = d[idx4], g = d[idx4 + 1], b = d[idx4 + 2], a = d[idx4 + 3];
      if (a < 20) return true;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      // Light neutral grey/white checkerboard or thin grey row-divider line
      return max > 188 && (max - min) < 22;
    }

    function pushIfBg(x, y) {
      const p = y * w + x;
      if (visited[p]) return;
      if (isBgPixel(p * 4)) {
        visited[p] = 1;
        stack[sp++] = p;
      }
    }

    // Seed from all 4 borders of the cell
    for (let x = 0; x < w; x++) {
      pushIfBg(x, 0);
      pushIfBg(x, h - 1);
    }
    for (let y = 0; y < h; y++) {
      pushIfBg(0, y);
      pushIfBg(w - 1, y);
    }

    while (sp > 0) {
      const p = stack[--sp];
      d[p * 4 + 3] = 0;
      const x = p % w;
      const y = (p / w) | 0;
      if (x > 0) pushIfBg(x - 1, y);
      if (x < w - 1) pushIfBg(x + 1, y);
      if (y > 0) pushIfBg(x, y - 1);
      if (y < h - 1) pushIfBg(x, y + 1);
    }

    octx.putImageData(imgData, 0, 0);
  }

  function loadSkinSheet(skinId, candidates) {
    let idx = 0;
    function tryNext() {
      if (idx >= candidates.length) return;
      const src = candidates[idx++];
      const img = new Image();
      img.onload = function () {
        const isPreCleaned =
          src.includes('-clean.png') ||
          src.includes('image-crown.png') ||
          src.includes('image-glass.png') ||
          src.includes('image-scarf.png') ||
          src.includes('image-wings.png');
        const cellW = Math.floor(img.width / SHEET_COLS);
        const cellH = Math.floor(img.height / SHEET_ROWS);
        const grid = [];
        for (let r = 0; r < SHEET_ROWS; r++) {
          const rowArr = [];
          for (let c = 0; c < SHEET_COLS; c++) {
            const cell = document.createElement('canvas');
            cell.width = cellW;
            cell.height = cellH;
            const cctx = cell.getContext('2d');
            cctx.drawImage(img, c * cellW, r * cellH, cellW, cellH, 0, 0, cellW, cellH);
            if (!isPreCleaned) {
              try {
                cleanCellBackground(cell);
              } catch (e) {}
            }
            rowArr.push(cell);
          }
          grid.push(rowArr);
        }
        skinSheets[skinId] = grid;
        if (skinId === 'classic') {
          sheetFrames = grid;
        }
      };
      img.onerror = tryNext;
      img.src = src;
    }
    tryNext();
  }

  loadSkinSheet('classic', [
    'images/cat-sprite-clean.png',
    'images/cat-sprite.png',
    'cat-sprite-clean.png',
    'cat-sprite.png',
  ]);
  loadSkinSheet('crown', [
    'images/image-crown-clean.png',
    'images/image-crown.png',
    'image-crown-clean.png',
    'image-crown.png',
  ]);
  loadSkinSheet('scarf', [
    'images/image-scarf-clean.png',
    'images/image-scarf.png',
    'image-scarf-clean.png',
    'image-scarf.png',
  ]);
  loadSkinSheet('cyber', [
    'images/image-glass-clean.png',
    'images/image-glass.png',
    'image-glass-clean.png',
    'image-glass.png',
  ]);
  loadSkinSheet('wings', [
    'images/image-wings-clean.png',
    'images/image-wings.png',
    'image-wings-clean.png',
    'image-wings.png',
  ]);

  const cat = {
    x: startX,
    y: startY,
    w: 44,
    h: 44,
    vx: 0,
    vy: 0,
    facing: 1,
    onGround: false,
    onNarrow: false,
    wallDir: 0,
    crouching: false,
    nightVision: false,
    lives: 6,
    maxLives: 7,
    invulnTimer: 0,
    hurtTimer: 0,
    respawnLockTimer: 0,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    meowCooldown: 0,
    animTime: 0,
    walkTime: 0,
    crouchTime: 0,
    landTimer: 0,
    scaleX: 1,
    scaleY: 1,
    balancePhase: 0,
    ropeDip: 0,
    checkpointX: startX,
    checkpointY: startY,
    shieldEnabled: false,
    shieldActive: false,
    shieldTimer: 0,
    shieldRechargeSec: 0,
    skin: 'classic',
    hasWingsGlide: false,
    trailTimer: 0,
    physics: { ...DEFAULT_PHYSICS },
  };

  function resetPhysics() {
    cat.physics = { ...DEFAULT_PHYSICS };
  }

  function applyUpgrades(bonuses, preserveCurrentLives = false) {
    if (!bonuses) return;
    cat.maxLives = bonuses.maxLives;
    if (!preserveCurrentLives) {
      cat.lives = bonuses.startLives;
    } else if (cat.lives > cat.maxLives) {
      cat.lives = cat.maxLives;
    }
    cat.physics.runSpeed = Math.round(DEFAULT_PHYSICS.runSpeed * (bonuses.speedMult || 1));
    cat.physics.jumpForce = Math.round(DEFAULT_PHYSICS.jumpForce * (bonuses.jumpMult || 1));
    cat.shieldEnabled = !!bonuses.hasShield;
    cat.shieldRechargeSec = bonuses.shieldRechargeSec || 0;
    if (!preserveCurrentLives) {
      cat.shieldActive = cat.shieldEnabled;
      cat.shieldTimer = 0;
    } else if (cat.shieldEnabled && !cat.shieldActive && cat.shieldTimer <= 0) {
      cat.shieldActive = true;
    }
    cat.skin = bonuses.skin || 'classic';
    cat.hasWingsGlide = !!bonuses.hasWingsGlide;
  }

  function refillLives() {
    cat.lives = cat.maxLives;
    if (cat.shieldEnabled) {
      cat.shieldActive = true;
      cat.shieldTimer = 0;
    }
    cat.invulnTimer = 1.6;
    cat.hurtTimer = 0;
    cat.respawnLockTimer = 0.55;
    cat.jumpBufferTimer = 0;
    cat.x = cat.checkpointX;
    cat.y = cat.checkpointY;
    cat.vx = 0;
    cat.vy = 0;
  }

  function resolveCollisionsX(platforms) {
    cat.wallDir = 0;
    for (const p of platforms) {
      if (p.hiddenInDay && !cat.nightVision) continue;
      if (p.broken) continue;
      if (p.type === 'wind_zone') continue;
      if (p.type === 'phase_platform' && p.phaseSolid === false) continue;
      if (p.oneWay) continue;
      if (
        cat.x < p.x + p.w &&
        cat.x + cat.w > p.x &&
        cat.y + 4 < p.y + p.h &&
        cat.y + cat.h - 4 > p.y
      ) {
        if (cat.vx > 0) {
          cat.x = p.x - cat.w;
          cat.vx = 0;
          if (p.climbable !== false && !cat.onGround) cat.wallDir = 1;
        } else if (cat.vx < 0) {
          cat.x = p.x + p.w;
          cat.vx = 0;
          if (p.climbable !== false && !cat.onGround) cat.wallDir = -1;
        }
      }
    }
  }

  function resolveCollisionsY(platforms, prevBottom) {
    let landed = false;
    let currentNarrow = false;
    let standingPlatform = null;
    const wasAirborne = !cat.onGround;

    for (const p of platforms) {
      if (p.hiddenInDay && !cat.nightVision) continue;
      if (p.broken) continue;
      if (p.type === 'wind_zone') continue;
      if (p.type === 'phase_platform' && p.phaseSolid === false) continue;
      const overlapX = cat.x + 4 < p.x + p.w && cat.x + cat.w - 4 > p.x;
      if (!overlapX) continue;

      const effY = p.y + (p.sinkOffset || 0);

      if (p.oneWay) {
        if (cat.vy >= 0 && prevBottom <= effY + 10 && cat.y + cat.h >= effY) {
          cat.y = effY - cat.h;
          if (p.bouncy) {
            const mult = p.type === 'flower_bounce' ? 1.36 : 1.28;
            cat.vy = -cat.physics.jumpForce * mult;
            cat.scaleX = 0.84;
            cat.scaleY = 1.18;
            p.bounceAnim = 1;
            Audio.playJump();
            if (p.type === 'flower_bounce') {
              // Firm, poised botanical cushion dip (sturdy, no wild shaking!) & lush nectar burst
              const impactOffset = Math.max(-1, Math.min(1, ((cat.x + cat.w / 2) - (p.x + p.w / 2)) / (p.w * 0.5)));
              p.stemBend = Math.min(11, (p.stemBend || 0) + 7.5);
              p.stemBendVel = 48;
              p.stemLean = Math.max(-0.14, Math.min(0.14, (p.stemLean || 0) + impactOffset * 0.08));
              p.stemLeanVel = impactOffset * 1.45 + (cat.vx / 330) * 0.45;
              p.petalSpread = 0.85;
              if (Particles.spawnNectarBurst) {
                Particles.spawnNectarBurst(p.x + p.w / 2, p.y + 8);
              } else {
                Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 9, '#fde047');
              }
            } else if (p.type === 'mushroom') {
              // Soft elastic sponge compression & rebound on mushroom jump!
              const impactOffset = Math.max(-1, Math.min(1, ((cat.x + cat.w / 2) - (p.x + p.w / 2)) / (p.w * 0.5)));
              p.spongeSquish = 0.92;
              p.spongeVel = 8.5;
              p.spongeTilt = impactOffset * 0.14;
              p.spongeTiltVel = impactOffset * 1.8 + (cat.vx / 330) * 0.6;
              Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 11, '#fef08a');
            } else {
              Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 9, '#ffb35c');
            }
          } else {
            if (wasAirborne && cat.vy > 180) {
              cat.landTimer = 0.14;
              cat.scaleX = 1.13;
              cat.scaleY = 0.87;
              Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 5);
            }
            cat.vy = 0;
            landed = true;
            standingPlatform = p;
            if (p.narrow) currentNarrow = true;
          }
        }
      } else {
        if (cat.y < effY + p.h && cat.y + cat.h > effY) {
          if (cat.vy >= 0) {
            cat.y = effY - cat.h;
            if (wasAirborne && cat.vy > 180) {
              cat.landTimer = 0.14;
              cat.scaleX = 1.13;
              cat.scaleY = 0.87;
              Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 5);
            }
            cat.vy = 0;
            landed = true;
            standingPlatform = p;
            if (p.narrow) currentNarrow = true;
          } else if (cat.vy < 0) {
            cat.y = effY + p.h;
            cat.vy = 0;
          }
        }
      }
    }

    for (const p of platforms) {
      if (p.type === 'clothesline' || p.type === 'rigging' || p.type === 'cable') {
        if (p === standingPlatform) {
          p.catStanding = true;
          p.catLoadX = Math.max(0.08, Math.min(0.92, (cat.x + cat.w / 2 - p.x) / p.w));
          if (wasAirborne && prevBottom <= p.y + 10) {
            p.ropeSpringVel = (p.ropeSpringVel || 0) + 12;
          }
        } else {
          p.catStanding = false;
        }
      }
    }

    cat.onGround = landed;
    cat.onNarrow = currentNarrow;
    return standingPlatform;
  }

  function update(dt, input, level) {
    cat.animTime += dt;
    if (cat.invulnTimer > 0) cat.invulnTimer -= dt;
    if (cat.hurtTimer > 0) cat.hurtTimer = Math.max(0, cat.hurtTimer - dt);
    if (cat.respawnLockTimer > 0) cat.respawnLockTimer = Math.max(0, cat.respawnLockTimer - dt);
    if (cat.landTimer > 0) cat.landTimer = Math.max(0, cat.landTimer - dt);
    if (cat.meowCooldown > 0) cat.meowCooldown = Math.max(0, cat.meowCooldown - dt);

    // Shield automatic recharge
    if (cat.shieldEnabled && !cat.shieldActive) {
      cat.shieldTimer -= dt;
      if (cat.shieldTimer <= 0) {
        cat.shieldActive = true;
        Particles.spawnShieldBurst(cat.x + cat.w / 2, cat.y + cat.h / 2);
        Particles.spawnPopup(cat.x + cat.w / 2, cat.y - 18, '🛡️ درع جاهز!', '#7dd3fc');
      }
    }

    // Cosmetic skin sparkle trails while moving
    if (cat.skin !== 'classic' && (Math.abs(cat.vx) > 65 || !cat.onGround)) {
      cat.trailTimer += dt;
      if (cat.trailTimer >= 0.085) {
        cat.trailTimer = 0;
        const trailCol =
          cat.skin === 'crown'
            ? '#fde047'
            : cat.skin === 'scarf'
            ? '#f87171'
            : cat.skin === 'starlight'
            ? '#fef08a'
            : cat.skin === 'cyber'
            ? '#22d3ee'
            : '#fef3c7';
        Particles.spawnTrailDot(cat.x + cat.w / 2 - cat.facing * 12, cat.y + cat.h * 0.55, trailCol);
      }
    }

    cat.scaleX += (1 - cat.scaleX) * Math.min(1, dt * 14);
    cat.scaleY += (1 - cat.scaleY) * Math.min(1, dt * 14);

    const lockedByRespawn = cat.respawnLockTimer > 0;
    cat.crouching = !lockedByRespawn && (input.shift || input.down);
    if (cat.crouching && cat.onGround) {
      cat.crouchTime += dt;
    } else {
      cat.crouchTime = 0;
    }

    let moveDir = 0;
    if (!lockedByRespawn) {
      if (input.left) moveDir -= 1;
      if (input.right) moveDir += 1;
    }
    if (moveDir !== 0) cat.facing = moveDir;

    let targetSpeed = moveDir * cat.physics.runSpeed;
    if (cat.crouching && cat.onGround) {
      targetSpeed *= 0.52;
    }

    if (cat.onGround && cat.onNarrow && !cat.crouching && moveDir !== 0) {
      cat.balancePhase += dt * 12;
      targetSpeed += Math.sin(cat.balancePhase) * 65;
    }

    const accel = cat.onGround ? (cat.onSlippery ? 3.8 : 18) : 11;
    if (lockedByRespawn) {
      cat.vx = 0;
    } else {
      cat.vx += (targetSpeed - cat.vx) * Math.min(1, dt * accel);
    }

    // Crosswind Gust Zone physics (crouching anchors Mashmasha against headwinds!)
    for (const p of level.platforms) {
      if (p.type === 'wind_zone') {
        if (cat.x + cat.w > p.x && cat.x < p.x + p.w && cat.y + cat.h > p.y && cat.y < p.y + p.h) {
          const anchor = cat.crouching && cat.onGround ? 0.22 : 1;
          cat.vx += (p.windDir || 1) * (p.windForce || 540) * anchor * dt;
        }
      }
    }

    if (cat.onGround && Math.abs(cat.vx) > 20) {
      cat.walkTime += dt * (Math.abs(cat.vx) / cat.physics.runSpeed);
    }

    if (cat.onGround) {
      cat.coyoteTimer = 0.13;
    } else {
      cat.coyoteTimer = Math.max(0, cat.coyoteTimer - dt);
    }

    if (lockedByRespawn) {
      cat.jumpBufferTimer = 0;
    } else if (input.jumpPressed) {
      cat.jumpBufferTimer = 0.15;
    } else {
      cat.jumpBufferTimer = Math.max(0, cat.jumpBufferTimer - dt);
    }

    if (cat.jumpBufferTimer > 0) {
      if (cat.coyoteTimer > 0) {
        cat.vy = -cat.physics.jumpForce;
        cat.onGround = false;
        cat.coyoteTimer = 0;
        cat.jumpBufferTimer = 0;
        cat.scaleX = 0.88;
        cat.scaleY = 1.14;
        Audio.playJump();
        Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 5);
      } else if (cat.wallDir !== 0) {
        cat.vy = -cat.physics.jumpForce * 0.94;
        cat.vx = -cat.wallDir * cat.physics.runSpeed * 1.15;
        cat.facing = -cat.wallDir;
        cat.wallDir = 0;
        cat.jumpBufferTimer = 0;
        cat.scaleX = 0.88;
        cat.scaleY = 1.14;
        Audio.playJump();
        Audio.playWallScratch();
        Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h / 2, 6, '#ffd36e');
      }
    }

    if (!input.jumpHeld && cat.vy < -220) {
      cat.vy += cat.physics.gravity * 1.4 * dt;
    }

    cat.vy += cat.physics.gravity * dt;

    // Angel Wings smooth glide when holding jump while falling
    if (cat.hasWingsGlide && input.jumpHeld && !cat.onGround && cat.vy > 195 && cat.wallDir === 0) {
      cat.vy = Math.min(cat.vy, 215);
    }
    if (cat.wallDir !== 0 && cat.vy > cat.physics.wallSlideSpeed) {
      const pressingTowardWall =
        (cat.wallDir === 1 && input.right) || (cat.wallDir === -1 && input.left);
      if (pressingTowardWall) {
        cat.vy = cat.physics.wallSlideSpeed;
        if (Math.random() < dt * 10) {
          Particles.spawnDust(
            cat.wallDir === 1 ? cat.x + cat.w : cat.x,
            cat.y + cat.h * 0.5,
            1,
            '#e8c49a'
          );
        }
      }
    }
    if (cat.vy > 1050) cat.vy = 1050;

    cat.x += cat.vx * dt;
    if (cat.x < 0) {
      cat.x = 0;
      cat.vx = 0;
    }
    if (cat.x + cat.w > level.width) {
      cat.x = level.width - cat.w;
      cat.vx = 0;
    }
    resolveCollisionsX(level.platforms);

    const prevBottom = cat.y + cat.h;
    cat.y += cat.vy * dt;
    const standing = resolveCollisionsY(level.platforms, prevBottom);

    let activeDip = 0;
    for (const p of level.platforms) {
      if (p.type === 'clothesline' || p.type === 'rigging' || p.type === 'cable') {
        const targetSag = p.catStanding ? 11 : 0;
        p.ropeSag = p.ropeSag || 0;
        p.ropeSpringVel = p.ropeSpringVel || 0;
        const force = (targetSag - p.ropeSag) * 145;
        p.ropeSpringVel = (p.ropeSpringVel + force * dt) * Math.exp(-8.5 * dt);
        p.ropeSag = Math.max(-2, p.ropeSag + p.ropeSpringVel * dt);
        if (p === standing) {
          const t = p.catLoadX !== undefined ? p.catLoadX : 0.5;
          const baseSag = p.type === 'clothesline' ? 10 : p.type === 'rigging' ? 8 : 6;
          activeDip = (baseSag + p.ropeSag) * (2 * (1 - t) * t) + 1;
        }
      }
      if (p.type === 'flower_bounce') {
        // Firm, poised, critically-damped botanical spring (smooth gentle flex without excessive wobble!)
        p.stemBend = p.stemBend || 0;
        p.stemBendVel = p.stemBendVel || 0;
        p.stemLean = p.stemLean || 0;
        p.stemLeanVel = p.stemLeanVel || 0;
        p.petalSpread = p.petalSpread || 0;

        const bendForce = -p.stemBend * 210;
        p.stemBendVel = (p.stemBendVel + bendForce * dt) * Math.exp(-13.5 * dt);
        p.stemBend = Math.max(-3, Math.min(13, p.stemBend + p.stemBendVel * dt));

        const leanForce = -p.stemLean * 120;
        p.stemLeanVel = (p.stemLeanVel + leanForce * dt) * Math.exp(-10.5 * dt);
        p.stemLean = Math.max(-0.18, Math.min(0.18, p.stemLean + p.stemLeanVel * dt));

        if (p.petalSpread > 0) {
          p.petalSpread = Math.max(0, p.petalSpread - dt * 2.4);
        }
      }
      if (p.bounceAnim > 0) {
        p.bounceAnim = Math.max(0, p.bounceAnim - dt * 2.2);
      }
      if (p.type === 'mushroom') {
        // Elastic sponge spring-damper physics (squishes down & widens like a soft sponge, then springs back with a juicy jiggle!)
        p.spongeSquish = p.spongeSquish || 0;
        p.spongeVel = p.spongeVel || 0;
        p.spongeTilt = p.spongeTilt || 0;
        p.spongeTiltVel = p.spongeTiltVel || 0;

        const spForce = -p.spongeSquish * 240;
        p.spongeVel = (p.spongeVel + spForce * dt) * Math.exp(-7.5 * dt);
        p.spongeSquish = Math.max(-0.45, Math.min(1.05, p.spongeSquish + p.spongeVel * dt));

        const tForce = -p.spongeTilt * 180;
        p.spongeTiltVel = (p.spongeTiltVel + tForce * dt) * Math.exp(-8.0 * dt);
        p.spongeTilt = Math.max(-0.22, Math.min(0.22, p.spongeTilt + p.spongeTiltVel * dt));
      }
      if (p.type === 'crumble') {
        if (p === standing && !p.broken && !p.crumbleTimer) {
          p.crumbleTimer = 1.25;
        }
        if (p.crumbleTimer > 0) {
          p.crumbleTimer -= dt;
          if (p.crumbleTimer <= 0) {
            p.crumbleTimer = 0;
            p.broken = true;
            p.respawnTimer = 2.0;
            Particles.spawnDust(p.x + p.w / 2, p.y + p.h / 2, 10, '#bae6fd');
          }
        } else if (p.broken) {
          p.respawnTimer -= dt;
          if (p.respawnTimer <= 0) p.broken = false;
        }
      }
      if (p.type === 'seesaw') {
        let targetTilt = 0;
        if (p === standing) {
          const offset = Math.max(-1, Math.min(1, ((cat.x + cat.w / 2) - (p.x + p.w / 2)) / (p.w / 2)));
          targetTilt = offset * 0.25;
          cat.vx += Math.sin(p.tiltAngle || 0) * 280 * dt;
        }
        p.tiltAngle = (p.tiltAngle || 0) + (targetTilt - (p.tiltAngle || 0)) * Math.min(1, dt * 6);
      }
      if (p.type === 'escalator' && p === standing) {
        cat.x += (p.direction || 1) * (p.speed || 95) * dt;
      }
      if ((p.type === 'clock_gear' || p.type === 'waterwheel') && p === standing) {
        cat.x += (p.spinDir || 1) * (p.spinSpeed || 1.15) * 85 * dt;
      }
      if (p.type === 'boost_pad' && p === standing) {
        const bdir = p.boostDir || 1;
        cat.vx = bdir * Math.max(540, cat.physics.runSpeed * 1.65);
        cat.facing = bdir;
        if (Math.random() < dt * 25) {
          Particles.spawnTrailDot(cat.x + cat.w / 2, cat.y + cat.h - 4, '#22d3ee');
        }
      }
      if (p.type === 'sink_pad') {
        const targetSink = p === standing ? 40 : 0;
        p.sinkOffset = p.sinkOffset || 0;
        const rate = p === standing ? 26 : 56;
        if (p.sinkOffset < targetSink) {
          p.sinkOffset = Math.min(targetSink, p.sinkOffset + rate * dt);
        } else if (p.sinkOffset > targetSink) {
          p.sinkOffset = Math.max(targetSink, p.sinkOffset - rate * dt);
        }
        if (p === standing) {
          cat.y = p.y + p.sinkOffset - cat.h;
        }
      }
    }
    cat.onSlippery = !!(standing && standing.type === 'oil_deck');
    cat.ropeDip = activeDip;

    // Smoothly update trailing bee-style golden starlight motes/stars for 'starlight' skin
    const anchorX = cat.x + cat.w * 0.5;
    const anchorY = cat.y + (cat.crouching ? cat.h * 0.58 : cat.h * 0.42) + (cat.ropeDip || 0);
    if (!cat.starTrail || cat.starTrail.length === 0) {
      cat.starTrail = [];
      for (let i = 0; i < 7; i++) {
        cat.starTrail.push({
          x: anchorX - cat.facing * (12 + i * 8),
          y: anchorY + Math.sin(i * 1.1) * 6,
        });
      }
    } else {
      // Snap trail near Mashmasha if she respawned far away
      if (Math.hypot(cat.starTrail[0].x - anchorX, cat.starTrail[0].y - anchorY) > 260) {
        for (let i = 0; i < cat.starTrail.length; i++) {
          cat.starTrail[i].x = anchorX - cat.facing * (12 + i * 8);
          cat.starTrail[i].y = anchorY + Math.sin(i * 1.1) * 6;
        }
      }
      for (let i = 0; i < cat.starTrail.length; i++) {
        const node = cat.starTrail[i];
        const t = cat.animTime;
        let targetX, targetY;
        if (i === 0) {
          targetX = anchorX - cat.facing * 14 + Math.cos(t * 3.2) * 7;
          targetY = anchorY - 4 + Math.sin(t * 5.4) * 6;
        } else {
          const prev = cat.starTrail[i - 1];
          targetX = prev.x - cat.facing * 7.5 + Math.cos(t * 3.8 + i * 1.25) * 3.5;
          targetY = prev.y + Math.sin(t * 6.2 + i * 1.35) * 4.8;
        }
        const followRate = Math.min(1, dt * (15.5 - i * 1.15));
        node.x += (targetX - node.x) * followRate;
        node.y += (targetY - node.y) * followRate;
      }
    }
  }

  function takeDamage(reason, isFall = false) {
    if (cat.invulnTimer > 0 && !isFall) return false;

    // Guardian Shield absorbs the hit without losing a life!
    if (cat.shieldActive) {
      cat.shieldActive = false;
      cat.shieldTimer = cat.shieldRechargeSec || 35;
      cat.invulnTimer = 1.7;
      if (Audio.playShieldBreak) Audio.playShieldBreak();
      Particles.spawnShieldBurst(cat.x + cat.w / 2, cat.y + cat.h / 2);
      Particles.spawnPopup(cat.x + cat.w / 2, cat.y - 16, '🛡️ صدّ الدرع!', '#7dd3fc');
      if (isFall) {
        cat.respawnLockTimer = 0.55;
        cat.jumpBufferTimer = 0;
        cat.x = cat.checkpointX;
        cat.y = cat.checkpointY;
        cat.vx = 0;
        cat.vy = 0;
      } else {
        cat.vy = -260;
      }
      return true;
    }

    cat.lives = Math.max(0, cat.lives - 1);
    cat.invulnTimer = 1.6;
    cat.hurtTimer = 0.72; // Plays full 7-frame Row 3 Hurt animation!
    cat.respawnLockTimer = 0.55; // Brief movement input lock on checkpoint respawn so Mashmasha never accidentally runs off!
    cat.jumpBufferTimer = 0;
    Audio.playHurt();
    Particles.spawnPopup(cat.x + cat.w / 2, cat.y - 12, reason || '-1 ❤️', '#ff6b8b');

    cat.x = cat.checkpointX;
    cat.y = cat.checkpointY;
    cat.vx = 0;
    cat.vy = 0;
    return true;
  }

  function getSpriteFrameCoords() {
    // Rows: 0=Idle, 1=Walk, 2=Crouch, 3=Hurt, 4=Jump
    if (cat.hurtTimer > 0) {
      const progress = 1 - cat.hurtTimer / 0.72;
      const col = Math.min(6, Math.floor(progress * 7));
      return { row: 3, col };
    }
    if (!cat.onGround) {
      // Map vertical velocity across Jump transition frames 0..5
      let col = 2;
      if (cat.vy < -380) col = 1;
      else if (cat.vy < -100) col = 2;
      else if (cat.vy < 140) col = 3;
      else if (cat.vy < 380) col = 4;
      else col = 5;
      return { row: 4, col };
    }
    if (cat.landTimer > 0) {
      return { row: 4, col: 6 };
    }
    if (cat.crouching) {
      // Single consistent frame for Crouch (no size flicker)
      return { row: 2, col: 0 };
    }
    if (Math.abs(cat.vx) > 25) {
      const col = Math.floor(cat.walkTime * 12) % 7;
      return { row: 1, col };
    }
    // Idle (Row 0): gentle loop across consistent side-profile frames 0..5 (skipping mismatched frame 6)
    const col = Math.floor(cat.animTime * 4.5) % 6;
    return { row: 0, col };
  }

  function draw(ctx, camX, camY) {
    // Blink only after the Hurt animation finishes
    if (cat.hurtTimer <= 0 && cat.invulnTimer > 0 && Math.floor(cat.invulnTimer * 14) % 2 === 0) {
      return;
    }

    const cx = cat.x - camX + cat.w / 2;
    const by = cat.y - camY + cat.h + (cat.ropeDip || 0);

    ctx.save();
    ctx.translate(cx, by);

    // Ground shadow
    if (cat.onGround) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.36)';
      ctx.beginPath();
      ctx.ellipse(0, -1, 23, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (cat.nightVision) {
      ctx.shadowColor = '#4af2a1';
      ctx.shadowBlur = 12;
    }

    const useProcedural =
      window.Game.catRenderMode === 'procedural' &&
      window.Game.ProceduralCat &&
      typeof window.Game.ProceduralCat.draw === 'function';

    const hasOutfitSheet = !!(
      cat.skin &&
      cat.skin !== 'classic' &&
      cat.skin !== 'starlight' &&
      skinSheets[cat.skin]
    );
    const activeFrames =
      (cat.skin && skinSheets[cat.skin]) || skinSheets.classic || sheetFrames;

    // Warm sunlit golden pollen-starlight aura behind Mashmasha when wearing 'starlight'
    if (cat.skin === 'starlight') {
      const auraY = cat.crouching ? -19 : -24;
      const auraG = ctx.createRadialGradient(0, auraY, 6, 0, auraY, 38);
      auraG.addColorStop(0, 'rgba(254, 240, 138, 0.25)');
      auraG.addColorStop(0.6, 'rgba(251, 191, 36, 0.11)');
      auraG.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = auraG;
      ctx.beginPath();
      ctx.arc(0, auraY, 38, 0, Math.PI * 2);
      ctx.fill();
    }

    if (useProcedural) {
      // Pure programmatic vector articulated cat (1:1 reference architecture + palette/outfit hooks)
      ctx.save();
      ctx.scale(-cat.facing * cat.scaleX, cat.scaleY);
      window.Game.ProceduralCat.draw(ctx, cat);
      ctx.restore();
    } else {
      // Fallback behind-cat vector cosmetics only if dedicated outfit sprite sheet isn't loaded yet
      if (!hasOutfitSheet) {
        if (cat.skin === 'wings') {
          const flap = Math.sin(cat.animTime * (!cat.onGround ? 18 : 7)) * (!cat.onGround ? 0.36 : 0.14);
          ctx.save();
          ctx.translate(-cat.facing * 8, -28);
          ctx.rotate(-cat.facing * (0.25 + flap));
          ctx.fillStyle = 'rgba(255, 251, 235, 0.92)';
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-cat.facing * 24, -18, -cat.facing * 28, -4);
          ctx.quadraticCurveTo(-cat.facing * 20, 6, -cat.facing * 12, 8);
          ctx.quadraticCurveTo(-cat.facing * 6, 9, 0, 4);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        } else if (cat.skin === 'scarf') {
          const wave = Math.sin(cat.animTime * 11) * 5;
          ctx.save();
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 5.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(cat.facing * 4, -27);
          ctx.quadraticCurveTo(-cat.facing * 14, -29 + wave * 0.6, -cat.facing * 30, -24 + wave);
          ctx.stroke();
          ctx.strokeStyle = '#fca5a5';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(-cat.facing * 24, -26 + wave * 0.85);
          ctx.lineTo(-cat.facing * 30, -24 + wave);
          ctx.stroke();
          ctx.restore();
        }
      }

      if (activeFrames) {
        const { row, col } = getSpriteFrameCoords();
        const frame = activeFrames[row][col];
        // Sprite sheet frames face LEFT (-1), so flip with -cat.facing
        ctx.save();
        ctx.scale(-cat.facing * cat.scaleX, cat.scaleY);
        const drawW = 88;
        const drawH = Math.round((frame.height / frame.width) * drawW);
        ctx.drawImage(frame, -drawW * 0.5, -drawH + 6, drawW, drawH);
        ctx.restore();
      } else if (fallbackReady && fallbackImg) {
        const speedRatio = Math.min(1, Math.abs(cat.vx) / cat.physics.runSpeed);
        const runBob = cat.onGround && speedRatio > 0.08 ? Math.abs(Math.sin(cat.animTime * 16)) * -4.5 * speedRatio : 0;
        const crouchScaleY = cat.crouching && cat.onGround ? 0.8 : 1;
        ctx.save();
        ctx.scale(-cat.facing * cat.scaleX, cat.scaleY * crouchScaleY);
        const drawSize = 96;
        const pawAlignY = -drawSize * (399 / 500);
        ctx.drawImage(fallbackImg, -drawSize * 0.48, pawAlignY + runBob, drawSize, drawSize);
        ctx.restore();
      }

      // Front fallback vector Crown/Cyber if sheet pending
      const headY = cat.crouching ? -37 : -45;
      if (!hasOutfitSheet && cat.skin === 'crown') {
        ctx.save();
        ctx.translate(cat.facing * 6, headY - 3);
        ctx.rotate(cat.facing * 0.12);
        ctx.fillStyle = '#fbbf24';
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-9, 4);
        ctx.lineTo(-10, -5);
        ctx.lineTo(-4, 0);
        ctx.lineTo(0, -8);
        ctx.lineTo(4, 0);
        ctx.lineTo(10, -5);
        ctx.lineTo(9, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(0, -1, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (!hasOutfitSheet && cat.skin === 'cyber') {
        ctx.save();
        ctx.translate(cat.facing * 12, headY + 9);
        ctx.fillStyle = 'rgba(34, 211, 238, 0.85)';
        ctx.strokeStyle = '#0e7490';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(-8, -3.5, 16, 6.5, 3);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-5, -2, 6, 1.5);
        ctx.restore();
      }
    }

    if (cat.skin === 'starlight') {
      // Glowing bee-style golden starlight stars/motes (slightly larger than the bee's motes) that smoothly chase Mashmasha!
      const worldOriginX = cat.x + cat.w / 2;
      const worldOriginY = cat.y + cat.h + (cat.ropeDip || 0);
      const nodes = cat.starTrail && cat.starTrail.length ? cat.starTrail : [];
      for (let i = nodes.length - 1; i >= 0; i--) {
        const sx = nodes[i].x - worldOriginX;
        const sy = nodes[i].y - worldOriginY;
        const pulse = 0.84 + 0.16 * Math.sin(cat.animTime * 8.5 + i * 1.35);
        const baseR = (3.4 - i * 0.24) * pulse; // Larger than bee's 1.3px motes!
        const glowR = baseR * 3.4;

        // Soft sunlit golden halo around each chasing star (matching the bee's golden pollen glow)
        const sGlow = ctx.createRadialGradient(sx, sy, baseR * 0.3, sx, sy, glowR);
        sGlow.addColorStop(0, 'rgba(254, 240, 138, 0.62)');
        sGlow.addColorStop(0.55, 'rgba(251, 191, 36, 0.24)');
        sGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = sGlow;
        ctx.beginPath();
        ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Sparkling 4-point golden star flare + warm glowing mote disc
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(Math.sin(cat.animTime * 3.5 + i) * 0.28);
        const rayL = baseR * 1.95;
        const rayW = baseR * 0.48;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(254, 240, 138, 0.92)' : 'rgba(253, 224, 71, 0.88)';
        ctx.beginPath();
        ctx.moveTo(0, -rayL);
        ctx.quadraticCurveTo(rayW * 0.45, -rayW * 0.45, rayL, 0);
        ctx.quadraticCurveTo(rayW * 0.45, rayW * 0.45, 0, rayL);
        ctx.quadraticCurveTo(-rayW * 0.45, rayW * 0.45, -rayL, 0);
        ctx.quadraticCurveTo(-rayW * 0.45, -rayW * 0.45, 0, -rayL);
        ctx.closePath();
        ctx.fill();

        // Luminous warm starlight core (just like the bee's golden motes, scaled up)
        ctx.fillStyle = '#fef9c3';
        ctx.beginPath();
        ctx.arc(0, 0, baseR * 0.62, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Active Guardian Shield bubble
    if (cat.shieldActive) {
      const pulse = 0.82 + Math.sin(cat.animTime * 5) * 0.18;
      ctx.save();
      ctx.strokeStyle = `rgba(125, 211, 252, ${0.72 * pulse})`;
      ctx.fillStyle = `rgba(56, 189, 248, ${0.12 * pulse})`;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, -24, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  return {
    cat,
    resetPhysics,
    applyUpgrades,
    refillLives,
    update,
    takeDamage,
    draw,
  };
};
