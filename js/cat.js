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
  let sheetFrames = null; // 2D array [row][col] of cleaned transparent offscreen canvases

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

  (function tryLoadSpriteSheet() {
    const candidates = [
      'images/cat-sprite-clean.png',
      'images/cat-sprite.png',
      'cat-sprite-clean.png',
      'cat-sprite.png',
    ];
    let idx = 0;
    function tryNext() {
      if (idx >= candidates.length) return;
      const src = candidates[idx++];
      const img = new Image();
      img.onload = function () {
        const isPreCleaned = src.endsWith('cat-sprite-clean.png');
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
        sheetFrames = grid;
      };
      img.onerror = tryNext;
      img.src = src;
    }
    tryNext();
  })();

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
    physics: { ...DEFAULT_PHYSICS },
  };

  function resetPhysics() {
    cat.physics = { ...DEFAULT_PHYSICS };
  }

  function resolveCollisionsX(platforms) {
    cat.wallDir = 0;
    for (const p of platforms) {
      if (p.hiddenInDay && !cat.nightVision) continue;
      if (p.broken) continue;
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
      const overlapX = cat.x + 4 < p.x + p.w && cat.x + cat.w - 4 > p.x;
      if (!overlapX) continue;

      if (p.oneWay) {
        if (cat.vy >= 0 && prevBottom <= p.y + 8 && cat.y + cat.h >= p.y) {
          cat.y = p.y - cat.h;
          if (p.bouncy) {
            cat.vy = -cat.physics.jumpForce * 1.28;
            cat.scaleX = 0.86;
            cat.scaleY = 1.15;
            p.bounceAnim = 1;
            Audio.playJump();
            Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 8, '#ffb35c');
          } else {
            if (wasAirborne && cat.vy > 180) {
              cat.landTimer = 0.14;
              Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 5);
            }
            cat.vy = 0;
            landed = true;
            standingPlatform = p;
            if (p.narrow) currentNarrow = true;
          }
        }
      } else {
        if (cat.y < p.y + p.h && cat.y + cat.h > p.y) {
          if (cat.vy >= 0) {
            cat.y = p.y - cat.h;
            if (wasAirborne && cat.vy > 180) {
              cat.landTimer = 0.14;
              Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 5);
            }
            cat.vy = 0;
            landed = true;
            standingPlatform = p;
            if (p.narrow) currentNarrow = true;
          } else if (cat.vy < 0) {
            cat.y = p.y + p.h;
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
    if (cat.landTimer > 0) cat.landTimer = Math.max(0, cat.landTimer - dt);
    if (cat.meowCooldown > 0) cat.meowCooldown = Math.max(0, cat.meowCooldown - dt);

    cat.scaleX += (1 - cat.scaleX) * Math.min(1, dt * 14);
    cat.scaleY += (1 - cat.scaleY) * Math.min(1, dt * 14);

    cat.crouching = input.shift || input.down;
    if (cat.crouching && cat.onGround) {
      cat.crouchTime += dt;
    } else {
      cat.crouchTime = 0;
    }

    let moveDir = 0;
    if (input.left) moveDir -= 1;
    if (input.right) moveDir += 1;
    if (moveDir !== 0) cat.facing = moveDir;

    let targetSpeed = moveDir * cat.physics.runSpeed;
    if (cat.crouching && cat.onGround) {
      targetSpeed *= 0.52;
    }

    if (cat.onGround && cat.onNarrow && !cat.crouching && moveDir !== 0) {
      cat.balancePhase += dt * 12;
      targetSpeed += Math.sin(cat.balancePhase) * 65;
    }

    const accel = cat.onGround ? 18 : 11;
    cat.vx += (targetSpeed - cat.vx) * Math.min(1, dt * accel);

    if (cat.onGround && Math.abs(cat.vx) > 20) {
      cat.walkTime += dt * (Math.abs(cat.vx) / cat.physics.runSpeed);
    }

    if (cat.onGround) {
      cat.coyoteTimer = 0.1;
    } else {
      cat.coyoteTimer = Math.max(0, cat.coyoteTimer - dt);
    }

    if (input.jumpPressed) {
      cat.jumpBufferTimer = 0.12;
    } else {
      cat.jumpBufferTimer = Math.max(0, cat.jumpBufferTimer - dt);
    }

    if (cat.jumpBufferTimer > 0) {
      if (cat.coyoteTimer > 0) {
        cat.vy = -cat.physics.jumpForce;
        cat.onGround = false;
        cat.coyoteTimer = 0;
        cat.jumpBufferTimer = 0;
        Audio.playJump();
        Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h, 5);
      } else if (cat.wallDir !== 0) {
        cat.vy = -cat.physics.jumpForce * 0.94;
        cat.vx = -cat.wallDir * cat.physics.runSpeed * 1.15;
        cat.facing = -cat.wallDir;
        cat.wallDir = 0;
        cat.jumpBufferTimer = 0;
        Audio.playJump();
        Audio.playWallScratch();
        Particles.spawnDust(cat.x + cat.w / 2, cat.y + cat.h / 2, 6, '#ffd36e');
      }
    }

    if (!input.jumpHeld && cat.vy < -220) {
      cat.vy += cat.physics.gravity * 1.4 * dt;
    }

    cat.vy += cat.physics.gravity * dt;
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
      if (p.type === 'crumble') {
        if (p === standing && !p.broken && !p.crumbleTimer) {
          p.crumbleTimer = 0.55;
        }
        if (p.crumbleTimer > 0) {
          p.crumbleTimer -= dt;
          if (p.crumbleTimer <= 0) {
            p.crumbleTimer = 0;
            p.broken = true;
            p.respawnTimer = 3.2;
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
    }
    cat.ropeDip = activeDip;
  }

  function takeDamage(reason) {
    if (cat.invulnTimer > 0) return false;
    cat.lives = Math.max(0, cat.lives - 1);
    cat.invulnTimer = 1.6;
    cat.hurtTimer = 0.72; // Plays full 7-frame Row 3 Hurt animation!
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

    if (sheetFrames) {
      const { row, col } = getSpriteFrameCoords();
      const frame = sheetFrames[row][col];
      // Sprite sheet frames face LEFT (-1), so flip with -cat.facing
      ctx.scale(-cat.facing * cat.scaleX, cat.scaleY);
      const drawW = 88;
      const drawH = Math.round((frame.height / frame.width) * drawW);
      ctx.drawImage(frame, -drawW * 0.5, -drawH + 6, drawW, drawH);
    } else if (fallbackReady && fallbackImg) {
      const speedRatio = Math.min(1, Math.abs(cat.vx) / cat.physics.runSpeed);
      const runBob = cat.onGround && speedRatio > 0.08 ? Math.abs(Math.sin(cat.animTime * 16)) * -4.5 * speedRatio : 0;
      const crouchScaleY = cat.crouching && cat.onGround ? 0.8 : 1;
      ctx.scale(-cat.facing * cat.scaleX, cat.scaleY * crouchScaleY);
      const drawSize = 96;
      const pawAlignY = -drawSize * (399 / 500);
      ctx.drawImage(fallbackImg, -drawSize * 0.48, pawAlignY + runBob, drawSize, drawSize);
    }

    ctx.restore();
  }

  return {
    cat,
    resetPhysics,
    update,
    takeDamage,
    draw,
  };
};
