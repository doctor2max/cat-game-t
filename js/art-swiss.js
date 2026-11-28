/* ============================================================================
   STAGE 28 ART ENGINE: SWISS COUNTRYSIDE (الريف السويسري • جبال الألب، لاوتربرونن وماترهورن)
   MUSEUM-GRADE ALPINE REALISM + 60FPS TILE BAKING + LIVING SWISS SPECTACLE:
     • Horizon: Crisp Sunlit Alpine Sky, 3D Faceted Matterhorn Peak with Snow Plumes,
       Lauterbrunnen / Staubbach Cliff Waterfalls, Curved Landwasser Stone Viaduct
       with Live Glacier Express Train, Volumetric Cumulus Clouds & Edelweiss Motes
     • Far Panorama (0.22x Baked): Terraced Emerald Alpine Meadows, Dark-Timber
       Bernese Oberland Chalets with Red Geranium Window Boxes & Stone-Weighted Roofs,
       Alpine Church Steeple & Distant Wildflower Pastures
     • Midground (0.42x Baked + 60fps Live Overlay): Glacial Turquoise Lake Brienz,
       Multi-Tier Shaded Alpine Pine & Spruce Forests, Live Aerial Seilbahn Cableway,
       Grazing Spotted Simmental Dairy Cows, Soaring Golden Eagles & Wooden Rowboats
     • Foreground Wonders & Brand-New Swiss Mechanics:
       - Crystal Glacial Mountain Streams & Carved Village Dorfbrunnen Checkpoints
       - Rolling Giant Emmental Cheese Wheel & Alpine Dairy Chute (Meow wedge stop!)
       - Ornate Swiss Cuckoo-Clock Gantry (Swinging Pinecone Pendulum + Pop-Out Perch!)
       - Panoramic Mountain Cableway (WORLD-FIXED Steel Pylons & Cables!)
       - Glacier Express Cogwheel Funicular (WORLD-FIXED Stone Rack Viaduct!)
       - Glacial Waterfall Hydro-Mill Wheel (4 Rotating Walkable Oak Paddles!)
       - Grounded Alpine Hay-Wagon Bounce Cart (Elastic Compressed Hay Physics!)
       - Swiss Alphorn Herder & Concentric Golden Acoustic Updraft Rings
       - Friendly Alpine St. Bernard Rescue Hut (+1 💜) & Grindelwald Clocktower Gate
   ============================================================================ */
(function () {
  'use strict';
  window.Game = window.Game || {};
  const Art = window.Game.Art;
  if (!Art) return;

  const prevDrawPlatform = Art.drawPlatform;
  const prevDrawCheckpoint = Art.drawCheckpoint;

  const GRANITE_PAL = ['#cbd5e1', '#b8c4d4', '#dce4ee', '#94a3b8', '#a8b6c8', '#8393a8'];
  const TIMBER_PAL = ['#8b5a2b', '#784820', '#9c6634', '#633816', '#a46e3b', '#522c10'];

  function makeOffscreen(w, h, fn) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const cctx = c.getContext('2d');
    fn(cctx, w, h);
    return c;
  }

  function fillAshlar(ctx, x, y, w, h, rowH, blkW, pal, seed, minBx, maxBx) {
    const rows = Math.ceil(h / rowH);
    const lo = minBx !== undefined ? minBx : -blkW;
    const hi = maxBx !== undefined ? maxBx : w + blkW;
    for (let r = 0; r < rows; r++) {
      const ry = y + r * rowH;
      const off = (r % 2) * (blkW * 0.5);
      for (let bx = -blkW + off; bx < w + blkW; bx += blkW) {
        if (bx + blkW < lo || bx > hi) continue;
        const idx = Math.abs((seed || 11) + r * 13 + Math.floor(bx / blkW) * 19) % pal.length;
        ctx.fillStyle = pal[idx];
        ctx.fillRect(x + bx + 0.8, ry + 0.8, blkW - 1.6, rowH - 1.6);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.fillRect(x + bx + 1.0, ry + 1.0, blkW - 2.0, 1.4);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.24)';
        ctx.fillRect(x + bx + 0.8, ry + rowH - 1.6, blkW - 1.6, 1.4);
      }
    }
  }

  function drawSwissFlag(ctx, x, y, size, time, phase) {
    const wave = Math.sin(time * 6.0 + (phase || 0)) * 2.0;
    ctx.save();
    ctx.fillStyle = '#dc2626';
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + size * 0.5, y + wave, x + size, y + wave * 0.6);
    ctx.lineTo(x + size, y + size + wave * 0.6);
    ctx.quadraticCurveTo(x + size * 0.5, y + size + wave, x, y + size);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const cx = x + size * 0.5;
    const cy = y + size * 0.5 + wave * 0.45;
    const arm = size * 0.29;
    const thick = size * 0.19;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - arm, cy - thick * 0.5, arm * 2, thick);
    ctx.fillRect(cx - thick * 0.5, cy - arm, thick, arm * 2);
    ctx.restore();
  }

  let swissCloudSprite = null;
  let swissHorizonCache = null;

  function renderSwissCloudShape(ctx) {
    ctx.fillStyle = '#93c5fd';
    ctx.beginPath();
    ctx.ellipse(0, 14, 82, 16, 0, 0, Math.PI * 2);
    ctx.ellipse(-42, 11, 48, 13, 0, 0, Math.PI * 2);
    ctx.ellipse(44, 11, 50, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.arc(-44, 1, 26, 0, Math.PI * 2);
    ctx.arc(-15, -10, 34, 0, Math.PI * 2);
    ctx.arc(20, -12, 36, 0, Math.PI * 2);
    ctx.arc(48, 2, 25, 0, Math.PI * 2);
    ctx.ellipse(0, 5, 72, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-42, -3, 21, 0, Math.PI * 2);
    ctx.arc(-15, -14, 29, 0, Math.PI * 2);
    ctx.arc(18, -16, 31, 0, Math.PI * 2);
    ctx.arc(45, -2, 20, 0, Math.PI * 2);
    ctx.ellipse(0, -1, 60, 13, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawVolumetricCloud(ctx, cx, cy, sx, sy, alpha) {
    if (!swissCloudSprite && typeof document !== 'undefined' && document.createElement) {
      swissCloudSprite = makeOffscreen(196, 92, (cctx) => {
        cctx.translate(98, 54);
        renderSwissCloudShape(cctx);
      });
    }
    if (swissCloudSprite) {
      const dw = 196 * sx;
      const dh = 92 * sy;
      const dx = cx - 98 * sx;
      if (dx + dw < -20 || dx > 1320) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.drawImage(swissCloudSprite, dx, cy - 54 * sy, dw, dh);
      ctx.restore();
      return;
    }
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(sx, sy);
    ctx.globalAlpha = alpha;
    renderSwissCloudShape(ctx);
    ctx.restore();
  }

  function drawAlpinePine(ctx, cx, baseY, h, shade) {
    ctx.save();
    ctx.translate(cx, baseY);
    const trunkH = h * 0.22;
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-h * 0.055, -trunkH, h * 0.11, trunkH);
    const tiers = 5;
    for (let t = 0; t < tiers; t++) {
      const frac = t / (tiers - 1);
      const ty = -trunkH - frac * (h * 0.72);
      const tw = h * (0.34 - frac * 0.22);
      const th = h * (0.28 - frac * 0.05);
      // Shadowed left & sunlit right sculpted pine bough cluster
      const g = ctx.createLinearGradient(-tw, ty, tw, ty);
      g.addColorStop(0.0, shade === 'far' ? '#064e3b' : '#052e16');
      g.addColorStop(0.52, shade === 'far' ? '#047857' : '#14532d');
      g.addColorStop(1.0, shade === 'far' ? '#10b981' : '#15803d');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, ty - th);
      ctx.bezierCurveTo(tw * 0.35, ty - th * 0.35, tw * 0.85, ty - th * 0.1, tw, ty + 4);
      ctx.quadraticCurveTo(tw * 0.5, ty + 1, 0, ty + 6);
      ctx.quadraticCurveTo(-tw * 0.5, ty + 1, -tw, ty + 4);
      ctx.bezierCurveTo(-tw * 0.85, ty - th * 0.1, -tw * 0.35, ty - th * 0.35, 0, ty - th);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function drawBerneseChalet(ctx, x, baseY, bw, bh, seed) {
    const y = baseY - bh;
    ctx.save();
    // 1. Whitewashed stone ground cellar story
    ctx.fillStyle = '#e2e8f0';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.4;
    ctx.fillRect(x + 5, baseY - 34, bw - 10, 34);
    ctx.strokeRect(x + 5, baseY - 34, bw - 10, 34);
    // Stacked alpine firewood under eaves
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 8, baseY - 14, 16, 14);
    ctx.fillStyle = '#d97706';
    for (let fx = x + 10; fx <= x + 21; fx += 4) {
      for (let fy = baseY - 11; fy <= baseY - 3; fy += 4) {
        ctx.beginPath();
        ctx.arc(fx, fy, 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Warm honey-aged Bernese larch timber upper stories
    const wG = ctx.createLinearGradient(x, y + 26, x + bw, baseY - 34);
    wG.addColorStop(0, '#b45309');
    wG.addColorStop(0.55, '#92400e');
    wG.addColorStop(1, '#5c2b0e');
    ctx.fillStyle = wG;
    ctx.strokeStyle = '#291509';
    ctx.lineWidth = 1.5;
    ctx.fillRect(x + 2, y + 26, bw - 4, bh - 60);
    ctx.strokeRect(x + 2, y + 26, bw - 4, bh - 60);
    // Horizontal interlocking log courses
    ctx.strokeStyle = 'rgba(41, 16, 5, 0.35)';
    ctx.lineWidth = 1.0;
    for (let ly = y + 32; ly < baseY - 36; ly += 6) {
      ctx.beginPath();
      ctx.moveTo(x + 3, ly);
      ctx.lineTo(x + bw - 3, ly);
      ctx.stroke();
    }

    // 3. Carved wooden balcony with bright red Swiss geranium flower boxes!
    const balY = baseY - 56;
    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = '#291509';
    ctx.lineWidth = 1.3;
    ctx.fillRect(x - 4, balY, bw + 8, 12);
    ctx.strokeRect(x - 4, balY, bw + 8, 12);
    for (let px0 = x; px0 < x + bw; px0 += 8) {
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(px0 + 2, balY + 2.5, 3, 7);
    }
    // Red geranium flower boxes overflowing along balcony rail
    ctx.fillStyle = '#15803d';
    ctx.fillRect(x, balY - 4, bw, 4.5);
    for (let gx = x + 5; gx < x + bw - 4; gx += 9) {
      ctx.fillStyle = (gx + (seed || 0)) % 2 === 0 ? '#ef4444' : '#f43f5e';
      ctx.beginPath();
      ctx.arc(gx, balY - 4.5, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Shuttered alpine windows with warm interior light
    const cols = bw >= 84 ? 3 : 2;
    const winW = 13, winH = 17;
    const gap = (bw - cols * winW) / (cols + 1);
    for (let c = 0; c < cols; c++) {
      const wx = x + gap + c * (winW + gap);
      const wy = y + 38;
      // Painted green-and-red alpine shutters
      ctx.fillStyle = '#15803d';
      ctx.fillRect(wx - 4.5, wy, 4.2, winH);
      ctx.fillRect(wx + winW + 0.3, wy, 4.2, winH);
      ctx.fillStyle = '#fef9c3';
      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = 1.5;
      ctx.fillRect(wx, wy, winW, winH);
      ctx.strokeRect(wx, wy, winW, winH);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(wx + winW * 0.5, wy);
      ctx.lineTo(wx + winW * 0.5, wy + winH);
      ctx.moveTo(wx, wy + winH * 0.5);
      ctx.lineTo(wx + winW, wy + winH * 0.5);
      ctx.stroke();
    }

    // 5. Wide Overhanging Alpine Gable Roof with Stone Weights & Brick Chimney
    ctx.fillStyle = '#78716c';
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 1.2;
    ctx.fillRect(x + bw * 0.68, y + 2, 10, 18);
    ctx.strokeRect(x + bw * 0.68, y + 2, 10, 18);
    const roofG = ctx.createLinearGradient(x, y, x, y + 32);
    roofG.addColorStop(0, '#64748b');
    roofG.addColorStop(0.5, '#475569');
    roofG.addColorStop(1, '#1e293b');
    ctx.fillStyle = roofG;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x - 14, y + 30);
    ctx.lineTo(x + bw * 0.5, y - 4);
    ctx.lineTo(x + bw + 14, y + 30);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Carved cream gable bargeboard trim
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(x - 12, y + 30);
    ctx.lineTo(x + bw * 0.5, y - 2);
    ctx.lineTo(x + bw + 12, y + 30);
    ctx.stroke();
    ctx.restore();
  }

  // =========================================================================
  // 1. CRISP ALPINE SKY, 3D MATTERHORN PEAK, WATERFALLS & LANDWASSER VIADUCT
  // =========================================================================
  function drawMatterhornPeakStatic(ctx, cx, baseY, w, h) {
    ctx.save();
    const apexX = cx + w * 0.04;
    const apexY = baseY - h;

    // 1. Sunlit Snow-White East Face (right)
    const eastG = ctx.createLinearGradient(apexX, apexY, cx + w * 0.52, baseY);
    eastG.addColorStop(0.00, '#ffffff');
    eastG.addColorStop(0.45, '#e0f2fe');
    eastG.addColorStop(0.82, '#93c5fd');
    eastG.addColorStop(1.00, '#475569');
    ctx.fillStyle = eastG;
    ctx.beginPath();
    ctx.moveTo(apexX, apexY);
    ctx.bezierCurveTo(apexX + w * 0.10, baseY - h * 0.58, cx + w * 0.34, baseY - h * 0.24, cx + w * 0.52, baseY);
    ctx.lineTo(cx - w * 0.04, baseY);
    ctx.bezierCurveTo(cx - w * 0.02, baseY - h * 0.45, apexX - w * 0.04, baseY - h * 0.72, apexX, apexY);
    ctx.closePath();
    ctx.fill();

    // 2. Shadowed Slate-Blue North/West Face (left)
    const westG = ctx.createLinearGradient(cx - w * 0.50, baseY - h * 0.3, apexX, apexY);
    westG.addColorStop(0.00, '#334155');
    westG.addColorStop(0.55, '#475569');
    westG.addColorStop(0.85, '#64748b');
    westG.addColorStop(1.00, '#cbd5e1');
    ctx.fillStyle = westG;
    ctx.beginPath();
    ctx.moveTo(apexX, apexY);
    ctx.bezierCurveTo(apexX - w * 0.14, baseY - h * 0.68, cx - w * 0.30, baseY - h * 0.30, cx - w * 0.52, baseY);
    ctx.lineTo(cx - w * 0.04, baseY);
    ctx.bezierCurveTo(cx - w * 0.02, baseY - h * 0.45, apexX - w * 0.04, baseY - h * 0.72, apexX, apexY);
    ctx.closePath();
    ctx.fill();

    // Exposed dark granite crag striations on sunlit face for 3D alpine realism
    ctx.fillStyle = 'rgba(51, 65, 85, 0.42)';
    ctx.beginPath();
    ctx.moveTo(apexX + 4, apexY + h * 0.16);
    ctx.lineTo(apexX + w * 0.14, baseY - h * 0.44);
    ctx.lineTo(apexX + w * 0.06, baseY - h * 0.38);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + w * 0.12, baseY - h * 0.32);
    ctx.lineTo(cx + w * 0.28, baseY - h * 0.08);
    ctx.lineTo(cx + w * 0.16, baseY - h * 0.06);
    ctx.closePath();
    ctx.fill();

    // Crisp sunlit snow-crest ridge spine
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.90)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(apexX, apexY);
    ctx.bezierCurveTo(apexX - w * 0.04, baseY - h * 0.72, cx - w * 0.02, baseY - h * 0.45, cx - w * 0.04, baseY);
    ctx.stroke();
    ctx.restore();
  }

  function drawMatterhornPlume(ctx, cx, baseY, w, h, time) {
    const apexX = cx + w * 0.04;
    const apexY = baseY - h;
    const plumeLen = 58 + Math.sin(time * 2.2) * 14;
    const pG = ctx.createLinearGradient(apexX, apexY, apexX + plumeLen, apexY - 12);
    pG.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
    pG.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = pG;
    ctx.beginPath();
    ctx.moveTo(apexX, apexY);
    ctx.quadraticCurveTo(apexX + plumeLen * 0.5, apexY - 14 + Math.sin(time * 3) * 4, apexX + plumeLen, apexY - 6);
    ctx.quadraticCurveTo(apexX + plumeLen * 0.5, apexY + 6, apexX, apexY + 7);
    ctx.closePath();
    ctx.fill();
  }

  function drawSwissSkyAndHorizon(ctx, camX, w, h, time) {
    // Crisp high-altitude Swiss Alpine sunlit sky
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.80);
    sky.addColorStop(0.00, '#0284c7');
    sky.addColorStop(0.28, '#0ea5e9');
    sky.addColorStop(0.58, '#7dd3fc');
    sky.addColorStop(0.82, '#e0f2fe');
    sky.addColorStop(1.00, '#f8fafc');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Warm Golden Morning Alpine Sun & Light Shafts
    const sunX = 960 - (camX * 0.01) % 240;
    const sunY = 92;
    ctx.save();
    for (let ray = -2; ray <= 2; ray++) {
      const rG = ctx.createLinearGradient(sunX, sunY, sunX + ray * 160 - 80, 480);
      rG.addColorStop(0, 'rgba(255, 251, 235, 0.25)');
      rG.addColorStop(1, 'rgba(255, 251, 235, 0)');
      ctx.fillStyle = rG;
      ctx.beginPath();
      ctx.moveTo(sunX - 16, sunY);
      ctx.lineTo(sunX + 16, sunY);
      ctx.lineTo(sunX + ray * 160 - 45, 480);
      ctx.lineTo(sunX + ray * 160 - 135, 480);
      ctx.closePath();
      ctx.fill();
    }
    const halo = ctx.createRadialGradient(sunX, sunY, 12, sunX, sunY, 195);
    halo.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
    halo.addColorStop(0.32, 'rgba(254, 249, 195, 0.55)');
    halo.addColorStop(1, 'rgba(186, 230, 253, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 195, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Volumetric Alpine Cumulus Clouds
    const cSpan = w + 460;
    for (let i = 0; i < 8; i++) {
      const cx0 = (((i * 210 - camX * 0.02 + time * 5.2) % cSpan) + cSpan) % cSpan - 230;
      const cy0 = 64 + (i % 3) * 34;
      drawVolumetricCloud(ctx, cx0, cy0, 0.95 + (i % 3) * 0.2, 0.75 + (i % 2) * 0.14, 0.88);
    }

    // Iconic 3D Alpine Mountain Range (GPU Baked Peaks, Cliffs & Viaduct + Live Plumes, Waterfall & Train!)
    const renderStaticSwissRange = (rCtx, mx) => {
      drawMatterhornPeakStatic(rCtx, mx + 220, 445, 360, 205);
      drawMatterhornPeakStatic(rCtx, mx + 1240, 448, 390, 220);
      drawMatterhornPeakStatic(rCtx, mx + 740, 445, 450, 315);

      const wfX = mx + 1045;
      const cliffG = rCtx.createLinearGradient(wfX - 110, 270, wfX + 110, 455);
      cliffG.addColorStop(0, '#64748b');
      cliffG.addColorStop(0.55, '#475569');
      cliffG.addColorStop(1, '#334155');
      rCtx.fillStyle = cliffG;
      rCtx.beginPath();
      rCtx.moveTo(wfX - 115, 455);
      rCtx.lineTo(wfX - 88, 295);
      rCtx.lineTo(wfX + 58, 285);
      rCtx.lineTo(wfX + 115, 455);
      rCtx.closePath();
      rCtx.fill();

      const vx0 = mx + 360, vy0 = 408;
      rCtx.fillStyle = '#94a3b8';
      rCtx.strokeStyle = '#475569';
      rCtx.lineWidth = 1.0;
      rCtx.fillRect(vx0, vy0, 310, 8);
      for (let a = 0; a < 5; a++) {
        const px0 = vx0 + a * 62;
        rCtx.fillStyle = '#94a3b8';
        rCtx.fillRect(px0, vy0 + 8, 12, 54);
        rCtx.beginPath();
        rCtx.moveTo(px0 + 12, vy0 + 8);
        rCtx.lineTo(px0 + 62, vy0 + 8);
        rCtx.lineTo(px0 + 62, vy0 + 28);
        rCtx.quadraticCurveTo(px0 + 37, vy0 + 6, px0 + 12, vy0 + 28);
        rCtx.closePath();
        rCtx.fill();
      }
    };

    if (!swissHorizonCache && typeof document !== 'undefined' && document.createElement) {
      swissHorizonCache = makeOffscreen(1540, 356, (cctx) => {
        cctx.translate(0, -118);
        renderStaticSwissRange(cctx, 0);
      });
    }

    const mOff = -((camX * 0.07) % 1540);
    for (let mx = mOff - 1540; mx < w + 1540; mx += 1540) {
      if (mx + 1540 < 0 || mx > w) continue;
      if (swissHorizonCache) {
        ctx.drawImage(swissHorizonCache, mx, 118);
      } else {
        renderStaticSwissRange(ctx, mx);
      }
      // Live summit snow plumes
      drawMatterhornPlume(ctx, mx + 220, 445, 360, 205, time + 0.8);
      drawMatterhornPlume(ctx, mx + 1240, 448, 390, 220, time + 1.9);
      drawMatterhornPlume(ctx, mx + 740, 445, 450, 315, time);

      // Live animated Staubbach waterfall ribbon & rising mist puffs
      const wfX = mx + 1045;
      const wfG = ctx.createLinearGradient(wfX, 290, wfX, 448);
      wfG.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
      wfG.addColorStop(0.6, 'rgba(186, 230, 253, 0.80)');
      wfG.addColorStop(1, 'rgba(224, 242, 254, 0.25)');
      ctx.fillStyle = wfG;
      const sway = Math.sin(time * 2.5) * 3;
      ctx.beginPath();
      ctx.moveTo(wfX - 9, 290);
      ctx.lineTo(wfX + 9, 290);
      ctx.quadraticCurveTo(wfX + 14 + sway, 370, wfX + 18 + sway, 448);
      ctx.lineTo(wfX - 16 + sway, 448);
      ctx.quadraticCurveTo(wfX - 12 + sway, 370, wfX - 9, 290);
      ctx.closePath();
      ctx.fill();
      for (let m = 0; m < 4; m++) {
        const mf = (time * 0.7 + m * 0.25) % 1;
        ctx.fillStyle = `rgba(255, 255, 255, ${(0.55 * (1 - mf)).toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(wfX + Math.sin(time * 2 + m * 2) * 14, 446 - mf * 26, 10 + mf * 16, 0, Math.PI * 2);
        ctx.fill();
      }

      // Live distant miniature red-and-silver Glacier Express train gliding across viaduct
      const vx0 = mx + 360, vy0 = 408;
      const gTrainX = vx0 + ((time * 26) % 270);
      for (let c = 0; c < 3; c++) {
        const cx1 = gTrainX + c * 22;
        if (cx1 > vx0 && cx1 < vx0 + 292) {
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(cx1, vy0 - 7, 19, 7);
          ctx.fillStyle = '#e0f2fe';
          ctx.fillRect(cx1 + 2, vy0 - 6, 15, 3);
        }
      }
    }
  }

  // =========================================================================
  // 2. SWISS ALPINE VALLEY PANORAMA: VERDANT PASTURES, WINDING RIVER & GRAZING COWS
  // =========================================================================
  let swissFarCache = null;
  let swissMidCache = null;

  // Seamless periodic S-curve for the balanced, crystal-clear Alpine valley river (period = 1680px)
  function valleyRiverCenterY(lx, span) {
    const u = (lx / span) * Math.PI * 2;
    return 515 + Math.sin(u * 2) * 8.5 + Math.cos(u) * 4.5;
  }
  function valleyRiverHalfW(lx, span) {
    const u = (lx / span) * Math.PI * 2;
    return 19.5 + Math.sin(u + 0.8) * 3.0 + Math.cos(u * 2 - 0.4) * 1.5;
  }

  function drawGrazingSwissCow(ctx, cx, cy, scale, facing, breed, time, phase) {
    // Lifelike grazing cycle: mostly head-down nibbling lush grass, periodically lifting head calmly
    const cyc = Math.sin(time * 0.85 + phase);
    const grazeFrac = cyc > 0.52 ? Math.max(0, 1 - (cyc - 0.52) / 0.42) : 1; // 1 = head down grazing, 0 = head raised looking out
    const nibble = grazeFrac > 0.5 ? Math.sin(time * 6.2 + phase * 2.3) * 1.1 : 0;
    const headDrop = grazeFrac * 7.5 + nibble * 0.45;
    const headPitch = grazeFrac * 0.48 + nibble * 0.04;
    const tailSwish = Math.sin(time * 3.1 + phase * 1.7) * 3.2;
    const bellSwing = Math.sin(time * 2.6 + phase) * 0.16;

    const isBraun = breed === 'braunvieh';
    const isFribourg = breed === 'fribourg';
    const baseCoat = isBraun ? '#9a6b43' : '#fdfcf7';
    const baseShadow = isBraun ? '#6b4423' : '#e2e8f0';
    const patchCol = isBraun ? '#784c28' : isFribourg ? '#1e293b' : '#c2591b';
    const farLegCol = isBraun ? '#5c3a1e' : '#cbd5e1';
    const nearLegCol = isBraun ? '#855834' : '#f8fafc';

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(facing * scale, scale);

    // Soft pasture contact shadow nestled in grass
    ctx.fillStyle = 'rgba(15, 62, 32, 0.28)';
    ctx.beginPath();
    ctx.ellipse(1.5, 10.2, 16.5, 3.1, 0, 0, Math.PI * 2);
    ctx.fill();

    // Far-side legs + dark cloven hooves
    ctx.strokeStyle = farLegCol;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-9.5, 1.5); ctx.lineTo(-10.2, 9.2);
    ctx.moveTo(6.2, 1.5); ctx.lineTo(5.4, 9.2);
    ctx.stroke();

    // Rosy alpine dairy udder
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.ellipse(-4.8, 4.8, 3.8, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Swishing tufted tail
    ctx.strokeStyle = isBraun ? '#452711' : patchCol;
    ctx.lineWidth = 1.35;
    ctx.beginPath();
    ctx.moveTo(-13.8, -2.5);
    ctx.quadraticCurveTo(-18.2, 2.0, -16.8 + tailSwish * 0.45, 7.2);
    ctx.stroke();
    ctx.fillStyle = isBraun ? '#291509' : patchCol;
    ctx.beginPath();
    ctx.ellipse(-16.8 + tailSwish * 0.45, 7.6, 1.8, 1.2, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Sculpted 3D barrel torso + sunlit dorsal spine highlight
    const bodyG = ctx.createLinearGradient(0, -9, 0, 6.5);
    bodyG.addColorStop(0.0, isBraun ? '#b68356' : '#ffffff');
    bodyG.addColorStop(0.65, baseCoat);
    bodyG.addColorStop(1.0, baseShadow);
    ctx.fillStyle = bodyG;
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.72)';
    ctx.lineWidth = 1.05;
    ctx.beginPath();
    ctx.moveTo(-13.5, -2.2);
    ctx.bezierCurveTo(-14.2, -8.2, -3.5, -8.8, 8.8, -6.8);
    ctx.bezierCurveTo(13.2, -5.8, 13.8, 3.2, 8.5, 4.8);
    ctx.bezierCurveTo(1.0, 6.2, -10.5, 5.4, -13.5, -2.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Characteristic Simmental / Fribourg coat markings (clipped cleanly to body)
    if (!isBraun) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(-0.5, -1.2, 13.5, 6.8, 0, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = patchCol;
      ctx.beginPath();
      ctx.ellipse(-4.5, -3.2, 5.8, 4.4, 0.22, 0, Math.PI * 2);
      ctx.ellipse(5.2, -2.4, 4.1, 3.5, -0.18, 0, Math.PI * 2);
      ctx.ellipse(-11.2, -0.5, 3.4, 3.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Near-side legs + hooves
    ctx.strokeStyle = nearLegCol;
    ctx.lineWidth = 2.6;
    for (const [lx0, lx1] of [[-6.5, -6.0], [8.8, 9.6]]) {
      ctx.beginPath();
      ctx.moveTo(lx0, 1.8);
      ctx.lineTo(lx1, 9.6);
      ctx.stroke();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(lx1 - 1.4, 8.8, 2.8, 1.5);
    }

    // Muscular dewlap & neck sloping toward grass when grazing
    ctx.fillStyle = isBraun ? '#8c5d38' : patchCol;
    ctx.beginPath();
    ctx.moveTo(7.5, -6.2);
    ctx.lineTo(13.8, -4.2 + headDrop * 0.72);
    ctx.lineTo(11.5, 3.2 + headDrop * 0.65);
    ctx.quadraticCurveTo(8.2, 3.8, 7.2, 1.5);
    ctx.closePath();
    ctx.fill();

    // Traditional Swiss embroidered red leather collar + swaying golden Treichel cowbell!
    const colX = 10.2, colY = 2.2 + headDrop * 0.55;
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2.1;
    ctx.beginPath();
    ctx.moveTo(8.8, -5.2 + headDrop * 0.35);
    ctx.lineTo(colX + 0.8, colY);
    ctx.stroke();
    ctx.save();
    ctx.translate(colX + 0.8, colY + 0.8);
    ctx.rotate(bellSwing);
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 0.85;
    ctx.beginPath();
    ctx.arc(0, 2.0, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Articulated grazing head, white blaze, rosy/cream muzzle & curved Alpine horns
    ctx.save();
    ctx.translate(13.6, -1.8 + headDrop * 0.78);
    ctx.rotate(headPitch);
    ctx.fillStyle = isBraun ? '#784c28' : patchCol;
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.75)';
    ctx.lineWidth = 0.95;
    ctx.beginPath();
    ctx.ellipse(2.0, 0.6, 5.5, 3.8, 0.26, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Ear
    ctx.beginPath();
    ctx.ellipse(-1.8, -2.2, 2.4, 1.3, -0.4, 0, Math.PI * 2);
    ctx.fill();
    // Forehead white blaze (Simmental/Fribourg) or Braunvieh pale muzzle ring
    if (!isBraun) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(1.6, -0.4, 2.4, 2.1, 0.25, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = isBraun ? '#fef3c7' : '#fda4af';
    ctx.beginPath();
    ctx.ellipse(6.2 + nibble * 0.2, 1.9, 2.4, 1.9, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Curved ivory horns & gentle dark eye
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(-0.4, -2.4);
    ctx.quadraticCurveTo(-0.8, -6.2, 2.0, -5.6);
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(2.6, -0.3, 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Lush emerald grass blades & buttercup right at hooves & grazing muzzle so the cow sits IN the pasture!
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    for (const gx of [-9, -2, 7, 17.5]) {
      ctx.moveTo(gx, 10.2);
      ctx.lineTo(gx - 1.2, 6.8);
      ctx.moveTo(gx + 1.5, 10.2);
      ctx.lineTo(gx + 2.8, 7.0);
    }
    ctx.stroke();
    if (grazeFrac > 0.6) {
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(19.2, 8.2, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawSwissMidground(mainCtx, camX, w, h, time) {
    const farSpan = 1640, farPad = 120;
    const midSpan = 1680, midPad = 120;

    // --- LAYER 1 (0.22x): Baked Sunlit Emerald Alpine Foothills, Winding Footpaths, Bernese Chalets & Church ---
    if (!swissFarCache && typeof document !== 'undefined' && document.createElement) {
      swissFarCache = makeOffscreen(farSpan + farPad * 2, 640, (ctx) => {
        const vx = farPad;
        // Sun-drenched rolling emerald-to-spruce Alpine foothills
        const hG = ctx.createLinearGradient(0, 368, 0, 545);
        hG.addColorStop(0.00, '#86efac');
        hG.addColorStop(0.24, '#22c55e');
        hG.addColorStop(0.62, '#16a34a');
        hG.addColorStop(1.00, '#14532d');
        ctx.fillStyle = hG;
        ctx.beginPath();
        ctx.moveTo(vx - 60, 555);
        ctx.bezierCurveTo(vx + 240, 392, vx + 520, 372, vx + 820, 404);
        ctx.bezierCurveTo(vx + 1140, 434, vx + 1380, 378, vx + farSpan + 60, 555);
        ctx.closePath();
        ctx.fill();

        // Soft sunlit pasture terrace ribbons & winding country footpaths on the distant hills
        ctx.strokeStyle = 'rgba(217, 249, 157, 0.30)';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(vx - 40, 456);
        ctx.bezierCurveTo(vx + 380, 418, vx + 840, 452, vx + farSpan + 40, 426);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(254, 243, 199, 0.42)';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(vx + 180, 474);
        ctx.bezierCurveTo(vx + 390, 488, vx + 550, 466, vx + 710, 462);
        ctx.bezierCurveTo(vx + 890, 462, vx + 1060, 484, vx + 1220, 472);
        ctx.stroke();

        // Distant alpine pine clusters
        for (const [px0, py0, ph] of [[70, 468, 60], [110, 472, 50], [440, 450, 66], [480, 456, 54], [890, 462, 64], [935, 466, 52], [1390, 456, 66], [1440, 462, 56]]) {
          drawAlpinePine(ctx, vx + px0, py0, ph, 'far');
        }

        // Iconic 3D Whitewashed Swiss Village Church & Alpine Clocktower Steeple (مبنى كنيسة وبرج ساعة سويسري متقن في الخلفية)
        const chX = vx + 710, chY = 462;
        ctx.save();
        // Soft hillside contact shadow & low limestone churchyard wall
        ctx.fillStyle = 'rgba(20, 83, 45, 0.30)';
        ctx.beginPath();
        ctx.ellipse(chX + 4, chY + 2, 42, 6.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#cbd5e1';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 0.9;
        ctx.fillRect(chX - 36, chY - 6, 74, 6);
        ctx.strokeRect(chX - 36, chY - 6, 74, 6);

        // 1. Tall 3D Clocktower Steeple (rising cleanly behind/beside nave with sunlit & shaded faces!)
        const twX = chX - 11, twW = 22, twSideW = 8, twTop = chY - 98;
        const twFrontG = ctx.createLinearGradient(twX, twTop, twX + twW, twTop);
        twFrontG.addColorStop(0, '#ffffff');
        twFrontG.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = twFrontG;
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.1;
        ctx.fillRect(twX, twTop, twW, 60);
        ctx.strokeRect(twX, twTop, twW, 60);
        // Shaded 3D right side wall of tower
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(twX + twW, twTop + 2, twSideW, 58);
        ctx.strokeRect(twX + twW, twTop + 2, twSideW, 58);
        // Limestone corner quoins & stone string-course cornice
        ctx.fillStyle = '#cbd5e1';
        for (let qy = twTop + 4; qy < chY - 46; qy += 8) {
          ctx.fillRect(twX + 0.6, qy, 3.2, 4.2);
          ctx.fillRect(twX + twW - 3.8, qy + 3, 3.2, 4.2);
        }
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(twX - 1.5, twTop + 14, twW + twSideW + 2, 2.6);
        // Arched louvered belfry window with tiny golden bell inside
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(twX + 6.5, twTop + 3.5, 9, 10, [4.5, 4.5, 0, 0]);
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(twX + 11, twTop + 10.5, 2.3, Math.PI, 0);
        ctx.fill();
        // Miniature Crisp Swiss Clock Face (gold bezel + white enamel dial + ticks + hands!)
        const mClkX = twX + twW * 0.5, mClkY = twTop + 26;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(mClkX, mClkY, 6.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 0.85;
        for (let t = 0; t < 4; t++) {
          const ta = (t * Math.PI) / 2;
          ctx.beginPath();
          ctx.moveTo(mClkX + Math.cos(ta) * 3.8, mClkY + Math.sin(ta) * 3.8);
          ctx.lineTo(mClkX + Math.cos(ta) * 5.2, mClkY + Math.sin(ta) * 5.2);
          ctx.stroke();
        }
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(mClkX, mClkY); ctx.lineTo(mClkX - 2.6, mClkY - 2.4);
        ctx.moveTo(mClkX, mClkY); ctx.lineTo(mClkX + 3.4, mClkY - 1.4);
        ctx.stroke();
        ctx.fillStyle = '#dc2626';
        ctx.beginPath(); ctx.arc(mClkX, mClkY, 0.9, 0, Math.PI * 2); ctx.fill();

        // Faceted Overlapping-Shingle Alpine Spire Roof (flared eaves + sunlit/shaded facets + golden cross)
        const spBaseY = twTop + 1;
        const spApexY = twTop - 38;
        const spCx = twX + twW * 0.5;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(twX - 4, spBaseY);
        ctx.quadraticCurveTo(spCx - 5, spBaseY - 14, spCx, spApexY);
        ctx.quadraticCurveTo(spCx + 7, spBaseY - 14, twX + twW + twSideW + 3, spBaseY);
        ctx.closePath();
        ctx.clip();
        // Sunlit left facet & shaded right facet
        ctx.fillStyle = '#475569';
        ctx.fillRect(twX - 5, spApexY, twW + twSideW + 10, 40);
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(spCx, spApexY);
        ctx.lineTo(twX + twW + twSideW + 4, spBaseY);
        ctx.lineTo(spCx + 2, spBaseY);
        ctx.closePath();
        ctx.fill();
        // Shingle courses on spire
        ctx.strokeStyle = 'rgba(226, 232, 240, 0.28)';
        ctx.lineWidth = 0.75;
        for (let sy = spApexY + 7; sy < spBaseY; sy += 5) {
          ctx.beginPath(); ctx.moveTo(twX - 4, sy); ctx.lineTo(twX + twW + twSideW + 4, sy); ctx.stroke();
        }
        ctx.restore();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(twX - 4, spBaseY);
        ctx.quadraticCurveTo(spCx - 5, spBaseY - 14, spCx, spApexY);
        ctx.quadraticCurveTo(spCx + 7, spBaseY - 14, twX + twW + twSideW + 3, spBaseY);
        ctx.closePath();
        ctx.stroke();
        // Gilded orb & slender alpine cross finial
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(spCx, spApexY); ctx.lineTo(spCx, spApexY - 9);
        ctx.moveTo(spCx - 3, spApexY - 6); ctx.lineTo(spCx + 3, spApexY - 6);
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        ctx.beginPath(); ctx.arc(spCx, spApexY - 1, 2.0, 0, Math.PI * 2); ctx.fill();

        // 2. 3D Village Church Nave (Sunlit Front Gable + Shaded Right Wing + Dressed Granite Plinth)
        const nvL = chX - 27, nvW = 46, nvH = 38, nvTop = chY - nvH;
        const nvG = ctx.createLinearGradient(nvL, nvTop, nvL + nvW, chY);
        nvG.addColorStop(0, '#ffffff');
        nvG.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = nvG;
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.15;
        ctx.fillRect(nvL, nvTop, nvW, nvH);
        ctx.strokeRect(nvL, nvTop, nvW, nvH);
        // Shaded 3D right side extension of nave
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(nvL + nvW, nvTop + 2, 12, nvH - 2);
        ctx.strokeRect(nvL + nvW, nvTop + 2, 12, nvH - 2);
        // Dressed stone plinth along base
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(nvL, chY - 7, nvW + 12, 7);
        // Arched oak church portal + flanking warm-lit lancet windows
        ctx.fillStyle = '#5c2d0c';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.roundRect(nvL + 18, chY - 19, 10, 19, [5, 5, 0, 0]);
        ctx.fill();
        ctx.stroke();
        for (const wx0 of [nvL + 6, nvL + 33, nvL + nvW + 3.5]) {
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.roundRect(wx0, nvTop + 12, 6, 12, [3, 3, 0, 0]);
          ctx.fill();
          ctx.stroke();
        }
        // Under-eave shadow cast by overhanging terracotta roof
        ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
        ctx.fillRect(nvL, nvTop, nvW + 12, 3.5);

        // 3. Realistic Terracotta-Shingled Pitched Roof (قرميد متراكب مع تدرج إضاءة وظل)
        const rfApexY = nvTop - 22;
        const rfMidX = nvL + nvW * 0.5;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(nvL - 5, nvTop + 2);
        ctx.lineTo(rfMidX, rfApexY);
        ctx.lineTo(nvL + nvW + 15, nvTop + 2);
        ctx.closePath();
        ctx.clip();
        const chRfG = ctx.createLinearGradient(nvL - 5, rfApexY, nvL + nvW + 15, nvTop + 2);
        chRfG.addColorStop(0.0, '#dc2626');
        chRfG.addColorStop(0.5, '#b91c1c');
        chRfG.addColorStop(1.0, '#7f1d1d');
        ctx.fillStyle = chRfG;
        ctx.fillRect(nvL - 6, rfApexY - 2, nvW + 24, 28);
        // Individual staggered terracotta shingle rows
        for (let r = 0; r < 5; r++) {
          const ry = rfApexY + 4 + r * 4.2;
          ctx.strokeStyle = 'rgba(69, 10, 10, 0.55)';
          ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.moveTo(nvL - 6, ry); ctx.lineTo(nvL + nvW + 16, ry); ctx.stroke();
          ctx.strokeStyle = 'rgba(254, 202, 202, 0.28)';
          ctx.lineWidth = 0.6;
          for (let tx = nvL - 4 + (r % 2) * 3; tx < nvL + nvW + 14; tx += 6) {
            ctx.beginPath(); ctx.moveTo(tx, ry - 4); ctx.lineTo(tx, ry); ctx.stroke();
          }
        }
        ctx.restore();
        ctx.strokeStyle = '#450a0a';
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(nvL - 5, nvTop + 2);
        ctx.lineTo(rfMidX, rfApexY);
        ctx.lineTo(nvL + nvW + 15, nvTop + 2);
        ctx.closePath();
        ctx.stroke();
        // Crisp cream eaves bargeboard
        ctx.strokeStyle = '#fef3c7';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(nvL - 4, nvTop + 2);
        ctx.lineTo(rfMidX, rfApexY + 1);
        ctx.lineTo(nvL + nvW + 4, nvTop + 2);
        ctx.stroke();
        ctx.restore();

        // Bernese Oberland Timber Chalets nestled high on the sunlit meadows
        drawBerneseChalet(ctx, vx + 165, 486, 86, 98, 11);
        drawBerneseChalet(ctx, vx + 285, 476, 80, 92, 23);
        drawBerneseChalet(ctx, vx + 545, 478, 90, 102, 37);
        drawBerneseChalet(ctx, vx + 995, 484, 86, 98, 51);
        drawBerneseChalet(ctx, vx + 1130, 476, 82, 94, 67);
        drawBerneseChalet(ctx, vx + 1485, 484, 88, 100, 79);
      });
    }
    if (swissFarCache) {
      const farOff = -(((camX * 0.22) % farSpan) + farSpan) % farSpan;
      for (let bx = farOff - farSpan; bx < w + farSpan; bx += farSpan) {
        if (bx + farSpan + farPad < 0 || bx - farPad > w) continue;
        mainCtx.drawImage(swissFarCache, bx - farPad, 0);
      }
    }

    // --- LAYER 2 (0.40x): Baked Lush Green Valley Meadows, Pure Crystal River & 3D Wooden Arch Bridge ---
    if (!swissMidCache && typeof document !== 'undefined' && document.createElement) {
      const totalW = midSpan + midPad * 2;
      swissMidCache = makeOffscreen(totalW, 700, (ctx) => {
        const vx = midPad;

        // 1. Sweeping Lush Green Valley Pastures (المروج الخضراء الممتدة في الأسفل — y = 436 .. 700)
        const valG = ctx.createLinearGradient(0, 436, 0, 680);
        valG.addColorStop(0.00, '#a3e635');
        valG.addColorStop(0.18, '#4ade80');
        valG.addColorStop(0.46, '#22c55e');
        valG.addColorStop(0.76, '#16a34a');
        valG.addColorStop(1.00, '#14532d');
        ctx.fillStyle = valG;
        ctx.beginPath();
        ctx.moveTo(0, 700);
        for (let x = 0; x <= totalW; x += 42) {
          const lx = x - vx;
          const u = (lx / midSpan) * Math.PI * 2;
          const hy = 444 + Math.sin(u * 2 + 0.4) * 9 + Math.cos(u * 3) * 5;
          ctx.lineTo(x, hy);
        }
        ctx.lineTo(totalW, 700);
        ctx.closePath();
        ctx.fill();

        // Sunlit rolling meadow swells & soft clover shadow contours across the valley floor
        for (const [baseY, amp, col] of [
          [466, 7, 'rgba(217, 249, 157, 0.34)'],
          [554, 9, 'rgba(190, 242, 100, 0.30)'],
          [580, 8, 'rgba(20, 83, 45, 0.28)'],
        ]) {
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.moveTo(0, baseY + 26);
          for (let x = 0; x <= totalW; x += 40) {
            const u = ((x - vx) / midSpan) * Math.PI * 2;
            ctx.lineTo(x, baseY + Math.sin(u * 2 + baseY * 0.1) * amp);
          }
          ctx.lineTo(totalW, baseY + 26);
          ctx.closePath();
          ctx.fill();
        }

        // Winding country footpath connecting both meadows directly through the 3D wooden arch bridge!
        const brFarX = 818, brNearX = 862;
        const brFarY = valleyRiverCenterY(brFarX, midSpan) - valleyRiverHalfW(brFarX, midSpan);
        const brNearY = valleyRiverCenterY(brNearX, midSpan) + valleyRiverHalfW(brNearX, midSpan);
        for (const baseOff of [vx, vx - midSpan, vx + midSpan]) {
          if (baseOff + 1140 < 0 || baseOff + 600 > totalW) continue;
          ctx.strokeStyle = 'rgba(238, 212, 170, 0.62)';
          ctx.lineWidth = 6.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(baseOff + 635, 452);
          ctx.bezierCurveTo(baseOff + 725, 466, baseOff + 785, 476, baseOff + brFarX, brFarY - 2);
          ctx.moveTo(baseOff + brNearX, brNearY + 3);
          ctx.bezierCurveTo(baseOff + 895, 558, baseOff + 985, 574, baseOff + 1115, 590);
          ctx.stroke();
        }

        // 2. REBUILT FROM SCRATCH: BALANCED, LIQUID-CRYSTAL SWISS ALPINE RIVER
        //    (حجم متناسق وطبيعي + ماء زجاجي نقي يكشف القاع الرملي والحصى والنباتات بعمق حقيقي!)
        const traceRiverChannel = (padTop, padBot) => {
          ctx.beginPath();
          for (let x = 0; x <= totalW; x += 12) {
            const lx = x - vx;
            const ry = valleyRiverCenterY(lx, midSpan) - valleyRiverHalfW(lx, midSpan) - padTop;
            if (x === 0) ctx.moveTo(x, ry); else ctx.lineTo(x, ry);
          }
          for (let x = totalW; x >= 0; x -= 12) {
            const lx = x - vx;
            ctx.lineTo(x, valleyRiverCenterY(lx, midSpan) + valleyRiverHalfW(lx, midSpan) + padBot);
          }
          ctx.closePath();
        };

        // 2A. Crisp Natural Turf Undercut Lip & Warm Sunlit Pebble Margin (no thick grey wall!)
        ctx.fillStyle = '#5c4033';
        traceRiverChannel(2.4, 1.4);
        ctx.fill();
        ctx.fillStyle = '#ebe3d2';
        traceRiverChannel(0.9, 1.8);
        ctx.fill();

        // 2B. Clip to Water Channel -> Pure Crystal Aquamarine-Sapphire Water & Visible Submerged Riverbed!
        ctx.save();
        traceRiverChannel(0, 0);
        ctx.clip();

        // Pure luminous Alpine glacial water & sunlit shallow sandbar gradient
        const waterG = ctx.createLinearGradient(0, 488, 0, 544);
        waterG.addColorStop(0.00, '#cffafe');
        waterG.addColorStop(0.16, '#67e8f9');
        waterG.addColorStop(0.42, '#14b8a6');
        waterG.addColorStop(0.58, '#0284c7');
        waterG.addColorStop(0.84, '#5eead4');
        waterG.addColorStop(1.00, '#fef3c7');
        ctx.fillStyle = waterG;
        ctx.fillRect(0, 482, totalW, 70);

        // Sunlit golden-sand & limestone underwater shoals on the inside river bends
        ctx.fillStyle = 'rgba(254, 243, 199, 0.32)';
        for (const shoalOff of [190, 560, 1040, 1430]) {
          for (const baseOff of [vx, vx - midSpan, vx + midSpan]) {
            const sx0 = baseOff + shoalOff;
            if (sx0 < -80 || sx0 > totalW + 80) continue;
            const cyS = valleyRiverCenterY(shoalOff, midSpan);
            const hwS = valleyRiverHalfW(shoalOff, midSpan);
            const side = shoalOff % 200 === 190 ? 0.52 : -0.52;
            ctx.beginPath();
            ctx.ellipse(sx0, cyS + side * hwS, 54, hwS * 0.36, 0.05, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Subtle far-bank turf overhang shadow cast onto crystal water edge
        ctx.fillStyle = 'rgba(12, 74, 110, 0.18)';
        ctx.beginPath();
        for (let x = 0; x <= totalW; x += 16) {
          const lx = x - vx;
          const y0 = valleyRiverCenterY(lx, midSpan) - valleyRiverHalfW(lx, midSpan);
          if (x === 0) ctx.moveTo(x, y0); else ctx.lineTo(x, y0);
        }
        for (let x = totalW; x >= 0; x -= 16) {
          const lx = x - vx;
          const y1 = valleyRiverCenterY(lx, midSpan) - valleyRiverHalfW(lx, midSpan) + 4.8;
          ctx.lineTo(x, y1);
        }
        ctx.closePath();
        ctx.fill();

        // Curated, Well-Spaced Submerged River Cobbles & Smooth Glacial Stones (Depth-Attenuated Clarity!)
        const BED_STONES = ['#f8fafc', '#fef3c7', '#e2e8f0', '#cbd5e1', '#fde68a', '#bae6fd'];
        for (let px0 = 16; px0 < totalW - 16; px0 += 26) {
          const lx = px0 - vx;
          const cyR = valleyRiverCenterY(lx, midSpan);
          const hwR = valleyRiverHalfW(lx, midSpan);
          for (let row = 0; row < 3; row++) {
            const seed = Math.abs(Math.imul(px0 * 19 + row * 83, 2654435761)) >>> 0;
            if (row === 1 && seed % 3 === 0) continue;
            const jx = px0 + ((seed % 11) - 5) * 1.4;
            const frac = (row === 0 ? -0.62 : row === 1 ? -0.04 : 0.60) + (((seed >> 4) % 7) - 3) * 0.04;
            const depth = 1 - Math.min(1, Math.abs(frac));
            const sy = cyR + frac * hwR;
            const rx = 3.2 + (seed % 4) * 1.1;
            const ry = 1.35 + (seed % 3) * 0.45;

            ctx.globalAlpha = 0.24 - depth * 0.08;
            ctx.fillStyle = '#083344';
            ctx.beginPath();
            ctx.ellipse(jx + 0.9, sy + 1.0, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.globalAlpha = 0.56 - depth * 0.24;
            ctx.fillStyle = BED_STONES[seed % BED_STONES.length];
            ctx.beginPath();
            ctx.ellipse(jx, sy, rx, ry, ((seed % 5) - 2) * 0.08, 0, Math.PI * 2);
            ctx.fill();

            ctx.globalAlpha = 0.36 - depth * 0.14;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(jx - rx * 0.2, sy - ry * 0.25, rx * 0.45, ry * 0.35, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;

        // Delicate Submerged Emerald River-Moss Filaments Streaming Gently with Current
        ctx.lineCap = 'round';
        for (let wx0 = 32; wx0 < totalW - 32; wx0 += 64) {
          const lx = wx0 - vx;
          const cyR = valleyRiverCenterY(lx, midSpan);
          const hwR = valleyRiverHalfW(lx, midSpan);
          const wy0 = cyR + (wx0 % 128 === 32 ? -0.44 : 0.46) * hwR;
          ctx.strokeStyle = 'rgba(5, 150, 105, 0.44)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(wx0, wy0);
          ctx.quadraticCurveTo(wx0 + 9, wy0 - 1.8, wx0 + 18, wy0 + 0.5);
          ctx.moveTo(wx0 + 3, wy0 + 1.8);
          ctx.quadraticCurveTo(wx0 + 11, wy0 + 2.8, wx0 + 16, wy0 + 1.4);
          ctx.stroke();
        }

        // Glassy Sky-Reflection Specular Sheen near Upper Bank (gives unmistakable wet liquid-glass surface!)
        const skySheen = ctx.createLinearGradient(0, 488, 0, 524);
        skySheen.addColorStop(0.00, 'rgba(240, 249, 255, 0.40)');
        skySheen.addColorStop(0.45, 'rgba(186, 230, 253, 0.14)');
        skySheen.addColorStop(1.00, 'rgba(186, 230, 253, 0)');
        ctx.fillStyle = skySheen;
        ctx.fillRect(0, 484, totalW, 42);
        ctx.restore(); // end river water clip

        // 2C. Delicate Shoreline Meniscus, Occasional Bank Pebbles & Sculpted Emerged River Boulders
        ctx.strokeStyle = 'rgba(240, 253, 250, 0.65)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let x = 0; x <= totalW; x += 14) {
          const lx = x - vx;
          const topY = valleyRiverCenterY(lx, midSpan) - valleyRiverHalfW(lx, midSpan) + 0.8;
          if (x === 0) ctx.moveTo(x, topY); else ctx.lineTo(x, topY);
        }
        ctx.stroke();

        for (let x = 22; x < totalW - 22; x += 42) {
          const lx = x - vx;
          if (Math.abs(((lx % midSpan) + midSpan) % midSpan - 840) < 48) continue;
          const cyR = valleyRiverCenterY(lx, midSpan);
          const hwR = valleyRiverHalfW(lx, midSpan);
          ctx.fillStyle = x % 84 === 22 ? '#f8fafc' : '#cbd5e1';
          ctx.beginPath();
          ctx.ellipse(x, cyR + hwR + 1.2, 4.8, 1.8, -0.06, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#15803d';
          ctx.beginPath();
          ctx.ellipse(x + 16, cyR + hwR + 2.2, 8.2, 2.5, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3 Sculpted Partially-Emerged Mossy Alpine Boulders inside the Crystal River
        for (const bOff of [285, 1185, 1515]) {
          for (const baseOff of [vx, vx - midSpan, vx + midSpan]) {
            const bx0 = baseOff + bOff;
            if (bx0 < -40 || bx0 > totalW + 40) continue;
            const by0 = valleyRiverCenterY(bOff, midSpan) + (bOff === 1185 ? -4 : 4);
            ctx.fillStyle = 'rgba(8, 51, 68, 0.30)';
            ctx.beginPath();
            ctx.ellipse(bx0 + 1.2, by0 + 2.6, 11.0, 4.2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.80)';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.ellipse(bx0 + 0.5, by0 + 1.2, 9.6, 3.3, 0, 0, Math.PI * 2);
            ctx.stroke();
            const bG = ctx.createLinearGradient(bx0, by0 - 6, bx0, by0 + 2);
            bG.addColorStop(0, '#ffffff');
            bG.addColorStop(0.55, '#e2e8f0');
            bG.addColorStop(1, '#64748b');
            ctx.fillStyle = bG;
            ctx.beginPath();
            ctx.ellipse(bx0, by0 - 1.0, 8.2, 3.9, -0.08, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // 3. MASTERPIECE 3D-PERSPECTIVE SWISS ARCHED TIMBER BRIDGE (جسر خشبي سويسري مقوّس ثلاثي الأبعاد عبر الضفتين!)
        for (const baseOff of [vx, vx - midSpan, vx + midSpan]) {
          const cxB = baseOff + 840;
          if (cxB < -110 || cxB > totalW + 110) continue;

          const fx = baseOff + brFarX, fy = brFarY - 1.5;
          const nx = baseOff + brNearX, ny = brNearY + 2.5;
          const halfDeckW = 11.5;
          const archLift = 12.5;

          const deckPt = (u, sideOffset) => {
            const wScale = 0.88 + u * 0.24;
            const camber = 4 * u * (1 - u) * archLift;
            return {
              x: fx + (nx - fx) * u + sideOffset * wScale,
              y: fy + (ny - fy) * u - camber,
            };
          };

          ctx.save();
          // 1) Translucent underwater arch shadow cast onto the crystal-clear river below!
          ctx.fillStyle = 'rgba(8, 51, 68, 0.22)';
          ctx.beginPath();
          ctx.moveTo(fx - halfDeckW + 3, fy + 4);
          ctx.lineTo(fx + halfDeckW + 5, fy + 4);
          ctx.lineTo(nx + halfDeckW + 6, ny - 1);
          ctx.lineTo(nx - halfDeckW + 3, ny - 1);
          ctx.closePath();
          ctx.fill();

          // 2) Dressed Alpine Limestone Abutments planted firmly on BOTH dry grassy banks!
          const drawAbutment = (ax, ay, aw, ah) => {
            const stG = ctx.createLinearGradient(ax - aw * 0.5, ay, ax + aw * 0.5, ay + ah);
            stG.addColorStop(0, '#f1f5f9');
            stG.addColorStop(0.5, '#cbd5e1');
            stG.addColorStop(1, '#64748b');
            ctx.fillStyle = stG;
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.roundRect(ax - aw * 0.5, ay, aw, ah, 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(ax - aw * 0.5 - 1, ay - 1.5, aw + 2, 2.5);
          };
          drawAbutment(fx, fy - 2, 27, 8.5);

          // 3) Far/East Back Railing (drawn BEHIND the wooden plank walkway for true 3D corridor depth!)
          const railH = 9.5;
          const numBays = 5;
          ctx.strokeStyle = '#5c2d0c';
          ctx.lineWidth = 1.15;
          ctx.beginPath();
          for (let b = 0; b < numBays; b++) {
            const p0 = deckPt(b / numBays, halfDeckW);
            const p1 = deckPt((b + 1) / numBays, halfDeckW);
            ctx.moveTo(p0.x, p0.y - 1.5); ctx.lineTo(p1.x, p1.y - railH + 1.2);
            ctx.moveTo(p0.x, p0.y - railH + 1.2); ctx.lineTo(p1.x, p1.y - 1.5);
          }
          ctx.stroke();
          for (let b = 0; b <= numBays; b++) {
            const p = deckPt(b / numBays, halfDeckW);
            ctx.strokeStyle = '#451a03';
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, p.y - railH);
            ctx.stroke();
          }
          ctx.strokeStyle = '#92400e';
          ctx.lineWidth = 1.9;
          ctx.beginPath();
          for (let b = 0; b <= 12; b++) {
            const p = deckPt(b / 12, halfDeckW);
            if (b === 0) ctx.moveTo(p.x, p.y - railH); else ctx.lineTo(p.x, p.y - railH);
          }
          ctx.stroke();

          // 4) Shaded Underside Timber Arch Vault & Heavy Curved Larch Arch Stringer Rib!
          const archL0 = deckPt(0.04, -halfDeckW);
          const archL1 = deckPt(0.96, -halfDeckW);
          const archMid = deckPt(0.50, -halfDeckW);
          ctx.strokeStyle = '#3b1d0a';
          ctx.lineWidth = 3.4;
          ctx.beginPath();
          ctx.moveTo(archL0.x + 2, archL0.y + 4.5);
          ctx.quadraticCurveTo(archMid.x + 2, archMid.y - 3.5, archL1.x - 1, archL1.y + 4.5);
          ctx.stroke();

          // 5) Cambered Wooden Walkway Deck + 14 Individual Transverse Honey-Oak Planks!
          const deckG = ctx.createLinearGradient(fx, fy - archLift, nx, ny);
          deckG.addColorStop(0.0, '#d97706');
          deckG.addColorStop(0.5, '#f59e0b');
          deckG.addColorStop(1.0, '#b45309');
          ctx.fillStyle = deckG;
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (let s = 0; s <= 14; s++) {
            const p = deckPt(s / 14, -halfDeckW);
            if (s === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
          }
          for (let s = 14; s >= 0; s--) {
            const p = deckPt(s / 14, halfDeckW);
            ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Transverse wooden deck plank seams
          ctx.strokeStyle = 'rgba(69, 26, 3, 0.46)';
          ctx.lineWidth = 0.95;
          ctx.beginPath();
          for (let s = 1; s < 14; s++) {
            const pL = deckPt(s / 14, -halfDeckW + 0.8);
            const pR = deckPt(s / 14, halfDeckW - 0.8);
            ctx.moveTo(pL.x, pL.y);
            ctx.lineTo(pR.x, pR.y);
          }
          ctx.stroke();

          // Sunlit side fascia timber stringer beam along near edge of deck
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          for (let s = 0; s <= 14; s++) {
            const p = deckPt(s / 14, -halfDeckW);
            if (s === 0) ctx.moveTo(p.x, p.y + 1.6); else ctx.lineTo(p.x, p.y + 1.6);
          }
          ctx.stroke();

          // Near-bank stone abutment grounding the front landing of the bridge
          drawAbutment(nx, ny - 2, 30, 9.5);

          // 6) Foreground West Railing: Swiss Andreaskreuz (X-Braced) Timber Balustrade, Pyramid Post Caps & Red Geraniums!
          ctx.strokeStyle = '#92400e';
          ctx.lineWidth = 1.35;
          ctx.beginPath();
          for (let b = 0; b < numBays; b++) {
            const p0 = deckPt(b / numBays, -halfDeckW);
            const p1 = deckPt((b + 1) / numBays, -halfDeckW);
            ctx.moveTo(p0.x, p0.y - 1.5); ctx.lineTo(p1.x, p1.y - railH + 1.2);
            ctx.moveTo(p0.x, p0.y - railH + 1.2); ctx.lineTo(p1.x, p1.y - 1.5);
            ctx.moveTo(p0.x, p0.y - 3.0); ctx.lineTo(p1.x, p1.y - 3.0);
          }
          ctx.stroke();

          for (let b = 0; b <= numBays; b++) {
            const p = deckPt(b / numBays, -halfDeckW);
            ctx.fillStyle = '#78350f';
            ctx.strokeStyle = '#291509';
            ctx.lineWidth = 0.9;
            ctx.fillRect(p.x - 1.4, p.y - railH - 1, 2.8, railH + 2);
            ctx.strokeRect(p.x - 1.4, p.y - railH - 1, 2.8, railH + 2);
            ctx.fillStyle = '#fde68a';
            ctx.fillRect(p.x - 1.6, p.y - railH - 2.0, 3.2, 1.4);
          }

          // Curved sunlit top handrail
          ctx.strokeStyle = '#b45309';
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          for (let b = 0; b <= 14; b++) {
            const p = deckPt(b / 14, -halfDeckW);
            if (b === 0) ctx.moveTo(p.x, p.y - railH); else ctx.lineTo(p.x, p.y - railH);
          }
          ctx.stroke();
          ctx.strokeStyle = '#fef3c7';
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          for (let b = 0; b <= 14; b++) {
            const p = deckPt(b / 14, -halfDeckW);
            if (b === 0) ctx.moveTo(p.x, p.y - railH - 0.8); else ctx.lineTo(p.x, p.y - railH - 0.8);
          }
          ctx.stroke();

          // Blooming Crimson Swiss Geranium Flowerboxes hung on the central bays!
          for (const uFl of [0.30, 0.50, 0.70]) {
            const pf = deckPt(uFl, -halfDeckW - 1.2);
            ctx.fillStyle = '#7c2d12';
            ctx.fillRect(pf.x - 4.5, pf.y - 6.5, 9, 3.2);
            ctx.fillStyle = '#15803d';
            ctx.beginPath();
            ctx.ellipse(pf.x, pf.y - 6.8, 5.2, 2.0, 0.15, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(pf.x - 2.4, pf.y - 7.6, 1.5, 0, Math.PI * 2);
            ctx.arc(pf.x + 0.4, pf.y - 8.1, 1.6, 0, Math.PI * 2);
            ctx.arc(pf.x + 2.8, pf.y - 7.3, 1.4, 0, Math.PI * 2);
            ctx.fill();
          }

          // Warm Wrought-Iron Bridge Entrance Lanterns on far & near newel posts
          for (const uLan of [0, 1]) {
            const pl = deckPt(uLan, -halfDeckW);
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(pl.x, pl.y - railH - 2);
            ctx.lineTo(pl.x, pl.y - railH - 7.5);
            ctx.stroke();
            ctx.fillStyle = 'rgba(254, 240, 138, 0.42)';
            ctx.beginPath();
            ctx.arc(pl.x, pl.y - railH - 9, 4.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fef08a';
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 0.9;
            ctx.fillRect(pl.x - 2.0, pl.y - railH - 11.2, 4.0, 4.4);
            ctx.strokeRect(pl.x - 2.0, pl.y - railH - 11.2, 4.0, 4.4);
          }

          ctx.restore();
        }

        // 4. Valley Spruce Clusters & Rustic Split-Rail Pasture Fences Framing Grazing Paddocks
        ctx.strokeStyle = 'rgba(120, 53, 15, 0.72)';
        ctx.lineWidth = 1.6;
        for (const [fxStart, fxEnd, fyBase] of [[80, 540, 462], [960, 1490, 464], [210, 740, 566]]) {
          for (const baseOff of [vx, vx - midSpan, vx + midSpan]) {
            const x0 = baseOff + fxStart, x1 = baseOff + fxEnd;
            if (x1 < 0 || x0 > totalW) continue;
            ctx.beginPath();
            ctx.moveTo(x0, fyBase - 5); ctx.lineTo(x1, fyBase - 3);
            ctx.moveTo(x0, fyBase - 1.5); ctx.lineTo(x1, fyBase + 0.5);
            for (let p = x0; p <= x1; p += 26) {
              ctx.moveTo(p, fyBase - 7); ctx.lineTo(p, fyBase + 2);
            }
            ctx.stroke();
          }
        }

        // Valley wildflower carpets (buttercups, white daisies, clover — kept clear of river & footpath!)
        for (let f = 0; f < 130; f++) {
          const fx0 = (f * 53) % totalW;
          const lx = fx0 - vx;
          const rY = valleyRiverCenterY(lx, midSpan);
          const hwR = valleyRiverHalfW(lx, midSpan);
          const fy0 = f % 2 === 0 ? 452 + (f % 6) * 5.0 : 548 + (f % 7) * 5.2;
          if (Math.abs(fy0 - rY) < hwR + 8) continue;
          ctx.fillStyle = f % 3 === 0 ? '#fde047' : f % 5 === 0 ? '#fb7185' : '#ffffff';
          ctx.beginPath();
          ctx.arc(fx0, fy0, f % 4 === 0 ? 2.1 : 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Valley spruce clusters (placed cleanly on upper & lower banks clear of the river!)
        for (const [tx0, ty0, th] of [
          [42, 468, 70], [74, 472, 54],
          [585, 462, 66],
          [935, 466, 72], [968, 470, 56],
          [1545, 464, 74], [1582, 470, 58],
          [1160, 562, 80], [1202, 566, 62],
        ]) {
          for (const baseOff of [vx, vx - midSpan, vx + midSpan]) {
            const sx = baseOff + tx0;
            if (sx < -60 || sx > totalW + 60) continue;
            ctx.fillStyle = 'rgba(20, 83, 45, 0.26)';
            ctx.beginPath();
            ctx.ellipse(sx + 8, ty0 + 2, th * 0.28, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            drawAlpinePine(ctx, sx, ty0, th, 'mid');
          }
        }
      });
    }

    const midOff = -(((camX * 0.40) % midSpan) + midSpan) % midSpan;
    if (swissMidCache) {
      for (let bx = midOff - midSpan; bx < w + midSpan; bx += midSpan) {
        if (bx + midSpan + midPad < 0 || bx - midPad > w) continue;
        mainCtx.drawImage(swissMidCache, bx - midPad, 0);
      }
    }

    // --- LAYER 3 (LIVE 60FPS VALLEY SPECTACLE: FLUID CONTINUOUS CURRENTS, CAUSTICS, TROUT, COWS & SEILBAHN!) ---
    // 3A. Silky Continuous Traveling Streamlines, Breathing Caustics, Boulder V-Wakes & Swimming Trout!
    mainCtx.save();
    mainCtx.lineCap = 'round';
    mainCtx.lineJoin = 'round';

    // 1) 3 Continuous Liquid Streamlines Flowing Seamlessly Along the River's Exact S-Curve (NO broken dashes!)
    for (let lane = 0; lane < 3; lane++) {
      const baseFrac = -0.38 + lane * 0.38;
      const freq = 0.032 + lane * 0.007;
      const spd = 2.6 + lane * 0.45;
      mainCtx.strokeStyle = lane === 1 ? 'rgba(240, 253, 250, 0.38)' : 'rgba(186, 230, 253, 0.28)';
      mainCtx.lineWidth = lane === 1 ? 1.35 : 1.0;
      mainCtx.beginPath();
      for (let sx = -16; sx <= w + 16; sx += 16) {
        const worldLx = sx - midOff;
        const modLx = ((worldLx % midSpan) + midSpan) % midSpan;
        const underBridge = modLx > 812 && modLx < 868;
        const cyR = valleyRiverCenterY(worldLx, midSpan);
        const hwR = valleyRiverHalfW(worldLx, midSpan);
        const wave = Math.sin(worldLx * freq - time * spd + lane * 2.1) * (hwR * 0.14)
                   + Math.cos(worldLx * 0.017 - time * 1.6 + lane) * 1.1;
        const pyStream = cyR + baseFrac * hwR + wave;
        if (sx === -16 || underBridge) mainCtx.moveTo(sx, pyStream);
        else mainCtx.lineTo(sx, pyStream);
      }
      mainCtx.stroke();
    }

    // 2) Organic Breathing Underwater Sunlight Caustic Cells Drifting Gently on the Riverbed
    mainCtx.strokeStyle = 'rgba(224, 252, 254, 0.34)';
    mainCtx.lineWidth = 0.95;
    mainCtx.beginPath();
    const causticDrift = (time * 18) % 64;
    for (let sx = -64 + causticDrift; sx < w + 64; sx += 64) {
      const worldLx = sx - midOff;
      const modLx = ((worldLx % midSpan) + midSpan) % midSpan;
      if (modLx > 806 && modLx < 874) continue;
      const cyR = valleyRiverCenterY(worldLx, midSpan);
      const hwR = valleyRiverHalfW(worldLx, midSpan);
      const breathe = 1 + 0.22 * Math.sin(time * 2.4 + sx * 0.05);
      const yCell = cyR + Math.sin(worldLx * 0.03 + 0.7) * (hwR * 0.34);
      mainCtx.moveTo(sx - 9 * breathe, yCell);
      mainCtx.quadraticCurveTo(sx, yCell - 3.2 * breathe, sx + 9 * breathe, yCell);
      mainCtx.quadraticCurveTo(sx, yCell + 3.2 * breathe, sx - 9 * breathe, yCell);
    }
    mainCtx.stroke();

    // 3) Living Trailing V-Wake Ripples Behind the 3 Emerged River Boulders!
    mainCtx.strokeStyle = 'rgba(255, 255, 255, 0.52)';
    mainCtx.lineWidth = 1.1;
    mainCtx.beginPath();
    for (const bOff of [285, 1185, 1515]) {
      for (let tileX = midOff - midSpan; tileX < w + midSpan; tileX += midSpan) {
        const bx0 = tileX + bOff;
        if (bx0 < -40 || bx0 > w + 40) continue;
        const by0 = valleyRiverCenterY(bOff, midSpan) + (bOff === 1185 ? -4 : 4);
        const flutter = Math.sin(time * 4.6 + bOff) * 1.2;
        mainCtx.moveTo(bx0 + 7, by0 - 1.5);
        mainCtx.quadraticCurveTo(bx0 + 18, by0 - 3.8 + flutter, bx0 + 30, by0 - 2.2 - flutter * 0.5);
        mainCtx.moveTo(bx0 + 7, by0 + 2.2);
        mainCtx.quadraticCurveTo(bx0 + 18, by0 + 4.5 - flutter, bx0 + 28, by0 + 3.2 + flutter * 0.5);
      }
    }
    mainCtx.stroke();

    // 4) Graceful Swimming Swiss Alpine Brook Trout casting real 3D shadows onto the sunlit riverbed!
    for (let f = 0; f < 5; f++) {
      const dir = f % 2 === 0 ? 1 : -1;
      const speed = 19 + (f % 3) * 5;
      const worldFishX = ((f * 336 + dir * time * speed) % midSpan + midSpan) % midSpan;
      if (worldFishX > 808 && worldFishX < 872) continue;
      for (let tileX = midOff - midSpan; tileX < w + midSpan; tileX += midSpan) {
        const fx = tileX + worldFishX;
        if (fx < -24 || fx > w + 24) continue;
        const cyR = valleyRiverCenterY(worldFishX, midSpan);
        const hwR = valleyRiverHalfW(worldFishX, midSpan);
        const fy = cyR + Math.sin(time * 1.7 + f * 2.1) * (hwR * 0.34);
        const wag = Math.sin(time * 9.5 + f * 1.7) * 1.4;

        mainCtx.fillStyle = 'rgba(8, 51, 68, 0.30)';
        mainCtx.beginPath(); mainCtx.ellipse(fx + 1.5, fy + 4.2, 4.8, 1.3, 0, 0, Math.PI * 2); mainCtx.fill();

        mainCtx.fillStyle = '#f1f5f9';
        mainCtx.beginPath(); mainCtx.ellipse(fx, fy, 4.9, 1.55, 0, 0, Math.PI * 2); mainCtx.fill();
        mainCtx.fillStyle = '#0f766e';
        mainCtx.beginPath(); mainCtx.ellipse(fx + dir * 0.5, fy - 0.4, 3.8, 0.75, 0, 0, Math.PI * 2); mainCtx.fill();
        mainCtx.fillStyle = '#fda4af';
        mainCtx.beginPath();
        mainCtx.moveTo(fx - dir * 4.3, fy);
        mainCtx.lineTo(fx - dir * 7.4, fy - 1.8 + wag);
        mainCtx.lineTo(fx - dir * 7.4, fy + 1.8 + wag);
        mainCtx.closePath(); mainCtx.fill();
      }
    }
    mainCtx.restore();

    // 3B. Aerial Swiss Gondola Cableway (Seilbahn) gliding high across the valley!
    mainCtx.save();
    mainCtx.strokeStyle = 'rgba(30, 41, 59, 0.46)';
    mainCtx.lineWidth = 1.7;
    mainCtx.beginPath();
    mainCtx.moveTo(0, 328);
    mainCtx.quadraticCurveTo(w * 0.5, 360, w, 300);
    mainCtx.stroke();
    mainCtx.strokeStyle = 'rgba(71, 85, 105, 0.32)';
    mainCtx.lineWidth = 1.0;
    mainCtx.beginPath();
    mainCtx.moveTo(0, 332);
    mainCtx.quadraticCurveTo(w * 0.5, 364, w, 304);
    mainCtx.stroke();
    for (let g = 0; g < 2; g++) {
      const u = ((time * 0.045 + g * 0.5 - (camX * 0.00012)) % 1 + 1) % 1;
      const gx = u * w;
      const gy = (1 - u) * (1 - u) * 328 + 2 * (1 - u) * u * 360 + u * u * 300;
      const sway = Math.sin(time * 2.2 + g * 3) * 0.04;
      mainCtx.save();
      mainCtx.translate(gx, gy);
      mainCtx.rotate(sway);
      mainCtx.fillStyle = '#334155';
      mainCtx.fillRect(-7, -2.5, 14, 4);
      mainCtx.fillStyle = '#fbbf24';
      mainCtx.beginPath();
      mainCtx.arc(-4.5, -0.5, 1.6, 0, Math.PI * 2);
      mainCtx.arc(4.5, -0.5, 1.6, 0, Math.PI * 2);
      mainCtx.fill();
      mainCtx.strokeStyle = '#334155';
      mainCtx.lineWidth = 1.8;
      mainCtx.beginPath();
      mainCtx.moveTo(0, 1.5); mainCtx.lineTo(0, 14);
      mainCtx.moveTo(-6, 14); mainCtx.lineTo(0, 9); mainCtx.lineTo(6, 14);
      mainCtx.stroke();
      mainCtx.fillStyle = '#f8fafc';
      mainCtx.fillRect(-13, 13, 26, 3.5);
      const gCab = mainCtx.createLinearGradient(0, 15, 0, 32);
      gCab.addColorStop(0, '#ef4444');
      gCab.addColorStop(0.55, '#dc2626');
      gCab.addColorStop(1, '#7f1d1d');
      mainCtx.fillStyle = gCab;
      mainCtx.strokeStyle = '#450a0a';
      mainCtx.lineWidth = 1.2;
      mainCtx.beginPath();
      mainCtx.roundRect(-15, 15, 30, 18, [3, 3, 6, 6]);
      mainCtx.fill();
      mainCtx.stroke();
      mainCtx.fillStyle = '#bae6fd';
      for (const wx of [-12, -3.5, 5]) mainCtx.fillRect(wx, 17, 7, 8);
      mainCtx.fillStyle = '#ffffff';
      mainCtx.fillRect(-13, 26, 26, 1.4);
      mainCtx.fillRect(-1.2, 27.6, 2.4, 4.4);
      mainCtx.fillRect(-3.4, 29.0, 6.8, 1.8);
      mainCtx.restore();
    }
    mainCtx.restore();

    // 3C. Naturalistic Herds of Grazing Swiss Cows on the Sunny Pastures Framing the Crystal River!
    const VALLEY_COWS = [
      { lx: 195, y: 470, sc: 0.88, dir: 1, breed: 'simmental', ph: 0.4 },
      { lx: 355, y: 474, sc: 0.94, dir: -1, breed: 'braunvieh', ph: 1.9 },
      { lx: 505, y: 468, sc: 0.86, dir: 1, breed: 'fribourg', ph: 3.1 },
      { lx: 1095, y: 472, sc: 0.90, dir: -1, breed: 'simmental', ph: 2.4 },
      { lx: 1295, y: 475, sc: 0.96, dir: 1, breed: 'braunvieh', ph: 4.2 },
      // Closer lush riverside pasture herd on the sunny lower meadow bank!
      { lx: 395, y: 549, sc: 1.12, dir: 1, breed: 'simmental', ph: 1.1 },
      { lx: 625, y: 553, sc: 1.16, dir: -1, breed: 'braunvieh', ph: 2.8 },
      { lx: 1365, y: 548, sc: 1.14, dir: -1, breed: 'simmental', ph: 0.7 },
    ];
    for (let tileX = midOff - midSpan; tileX < w + midSpan; tileX += midSpan) {
      if (tileX + midSpan < -60 || tileX > w + 60) continue;
      for (const cw of VALLEY_COWS) {
        const sx = tileX + cw.lx;
        if (sx < -45 || sx > w + 45) continue;
        drawGrazingSwissCow(mainCtx, sx, cw.y, cw.sc, cw.dir, cw.breed, time, cw.ph);
      }
    }

    // 3D. Soaring Feathered Alpine Golden Eagles & Floating White Edelweiss/Dandelion Seeds
    for (let e = 0; e < 4; e++) {
      const ex = ((e * 340 + time * (24 + e * 4) - camX * 0.14) % (w + 180) + (w + 180)) % (w + 180) - 90;
      const ey = 96 + (e % 3) * 42 + Math.sin(time * 1.9 + e * 2) * 10;
      const wing = Math.sin(time * 4.8 + e * 1.7) * 5.5;
      mainCtx.save();
      mainCtx.translate(ex, ey);
      mainCtx.fillStyle = '#451a03';
      mainCtx.beginPath();
      mainCtx.moveTo(-3, 1); mainCtx.lineTo(-8, 5); mainCtx.lineTo(-4, 6);
      mainCtx.lineTo(0, 2); mainCtx.lineTo(5, -1);
      mainCtx.closePath();
      mainCtx.fill();
      mainCtx.strokeStyle = '#451a03';
      mainCtx.lineWidth = 2.4;
      mainCtx.lineCap = 'round';
      mainCtx.beginPath();
      mainCtx.moveTo(-17, -wing);
      mainCtx.quadraticCurveTo(-7, -4.5, 0, 0);
      mainCtx.quadraticCurveTo(7, -4.5, 17, -wing);
      mainCtx.stroke();
      mainCtx.restore();
    }
    mainCtx.fillStyle = 'rgba(255, 255, 255, 0.72)';
    for (let m = 0; m < 10; m++) {
      const mx = ((m * 149 - camX * 0.52 + time * 16) % w + w) % w;
      const my = 160 + ((m * 79 + Math.sin(time * 1.6 + m) * 26) % 340);
      mainCtx.beginPath();
      mainCtx.arc(mx, my, 1.7, 0, Math.PI * 2);
      mainCtx.fill();
    }
  }

  // =========================================================================
  // 3. FOREGROUND LIQUID-CRYSTAL GLACIAL STREAM & DORFBRUNNEN CHECKPOINT
  // =========================================================================
  function drawSwissAlpineStream(ctx, px, py, w, h, time) {
    const viewW = ctx._viewW || 1024;
    if (px + w < -40 || px > viewW + 40) return;
    const visL = Math.max(0, -px - 40);
    const visR = Math.min(w, viewW - px + 40);
    if (visR <= visL) return;

    const surfY = py - 6;
    const fullH = h + 6;
    const waveY = (localX) =>
      surfY +
      Math.sin((px + localX) * 0.030 - time * 3.0) * 2.2 +
      Math.cos((px + localX) * 0.068 - time * 1.9) * 0.9;

    ctx.save();
    const traceStream = () => {
      ctx.beginPath();
      ctx.moveTo(px, surfY + fullH);
      for (let x = 0; x <= w; x += 16) {
        ctx.lineTo(px + x, waveY(x));
      }
      ctx.lineTo(px + w, surfY + fullH);
      ctx.closePath();
    };

    ctx.save();
    traceStream();
    ctx.clip();

    // 1. Pure Luminous Crystal-Turquoise & Sapphire Glacial Water + Sunlit Sandy Bottom Glow
    const bedG = ctx.createLinearGradient(px, surfY, px, surfY + fullH);
    bedG.addColorStop(0.00, 'rgba(165, 243, 252, 0.86)');
    bedG.addColorStop(0.26, 'rgba(45, 212, 191, 0.88)');
    bedG.addColorStop(0.62, 'rgba(2, 132, 199, 0.92)');
    bedG.addColorStop(0.88, 'rgba(13, 148, 136, 0.94)');
    bedG.addColorStop(1.00, 'rgba(245, 222, 179, 0.96)');
    ctx.fillStyle = bedG;
    ctx.fillRect(px + visL, surfY - 4, visR - visL, fullH + 8);

    // 2. Diagonal Sunlit Underwater Rays Piercing the Pure Water
    for (let r = Math.max(24, Math.floor(visL / 135) * 135 + 24); r < visR; r += 135) {
      const rayShift = Math.sin(time * 1.2 + r * 0.02) * 7;
      const rayG = ctx.createLinearGradient(px + r + rayShift, surfY, px + r + rayShift + 26, surfY + fullH);
      rayG.addColorStop(0, 'rgba(240, 253, 250, 0.26)');
      rayG.addColorStop(1, 'rgba(240, 253, 250, 0)');
      ctx.fillStyle = rayG;
      ctx.beginPath();
      ctx.moveTo(px + r + rayShift - 5, surfY);
      ctx.lineTo(px + r + rayShift + 15, surfY);
      ctx.lineTo(px + r + rayShift + 46, surfY + fullH);
      ctx.lineTo(px + r + rayShift + 10, surfY + fullH);
      ctx.closePath();
      ctx.fill();
    }

    // 3. Well-Spaced, Sculpted Natural Riverbed Cobbles Visible Through the Clear Water
    const STREAM_COBBLES = ['#f8fafc', '#fef3c7', '#e2e8f0', '#cbd5e1', '#bae6fd', '#fde68a'];
    const firstBx = Math.max(18, Math.floor(visL / 32) * 32 + 18);
    const lastBx = Math.min(w - 18, Math.ceil(visR / 32) * 32 + 18);
    for (let bx = firstBx; bx <= lastBx; bx += 32) {
      const s1 = Math.abs((bx * 17 + Math.round(w)) % STREAM_COBBLES.length);
      const rx = 10.5 + (s1 % 3) * 3.0;
      const ry = 4.2 + (s1 % 2) * 1.3;
      const sy = surfY + fullH - 8 - (s1 % 3) * 6.5;
      // Soft underwater shadow on the riverbed
      ctx.globalAlpha = 0.28;
      ctx.fillStyle = '#083344';
      ctx.beginPath();
      ctx.ellipse(px + bx + 1.5, sy + 2.0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      // Refracted cobble body
      ctx.globalAlpha = 0.62;
      ctx.fillStyle = STREAM_COBBLES[s1];
      ctx.beginPath();
      ctx.ellipse(px + bx, sy, rx, ry, ((s1 % 3) - 1) * 0.1, 0, Math.PI * 2);
      ctx.fill();
      // Sunlit top crescent
      ctx.globalAlpha = 0.38;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(px + bx - rx * 0.2, sy - ry * 0.26, rx * 0.44, ry * 0.34, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 4. Gently Swaying Submerged Emerald River-Moss
    ctx.lineCap = 'round';
    for (let wx0 = Math.max(32, Math.floor(visL / 84) * 84 + 32); wx0 < visR - 20; wx0 += 84) {
      const sway = Math.sin(time * 2.6 + wx0 * 0.08) * 5.5;
      const baseB = surfY + fullH - 3;
      ctx.strokeStyle = 'rgba(5, 150, 105, 0.50)';
      ctx.lineWidth = 1.9;
      ctx.beginPath();
      ctx.moveTo(px + wx0, baseB);
      ctx.quadraticCurveTo(px + wx0 + 10 + sway * 0.4, baseB - 12, px + wx0 + 22 + sway, baseB - 19);
      ctx.moveTo(px + wx0 + 6, baseB);
      ctx.quadraticCurveTo(px + wx0 + 15 + sway * 0.3, baseB - 9, px + wx0 + 25 + sway * 0.7, baseB - 14);
      ctx.stroke();
    }

    // 5. Sleek Alpine Trout Gliding Smoothly with Crisp Offset Riverbed Shadows!
    const numFish = Math.max(2, Math.min(5, Math.floor(w / 170)));
    for (let f = 0; f < numFish; f++) {
      const dir = f % 2 === 0 ? 1 : -1;
      const spanW = Math.max(90, w - 80);
      const localFx = 40 + (((f * 137 + dir * time * (26 + f * 5)) % spanW + spanW) % spanW);
      if (localFx < visL - 26 || localFx > visR + 26) continue;
      const fy = surfY + 24 + (f % 2) * 14 + Math.sin(time * 2.1 + f * 1.9) * 2.8;
      const wag = Math.sin(time * 10 + f) * 2.0;
      ctx.fillStyle = 'rgba(8, 51, 68, 0.32)';
      ctx.beginPath(); ctx.ellipse(px + localFx + 3.0, fy + 13, 8.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath(); ctx.ellipse(px + localFx, fy, 8.8, 2.7, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0f766e';
      ctx.beginPath(); ctx.ellipse(px + localFx + dir * 0.6, fy - 0.8, 7.0, 1.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fda4af';
      ctx.beginPath();
      ctx.moveTo(px + localFx - dir * 7.6, fy);
      ctx.lineTo(px + localFx - dir * 12.4, fy - 3.0 + wag);
      ctx.lineTo(px + localFx - dir * 12.4, fy + 3.0 + wag);
      ctx.closePath();
      ctx.fill();
    }

    // 6. Continuous Silky Flowing Current Ribbons & Breathing Caustic Cells (fluid water motion!)
    const reflG = ctx.createLinearGradient(px, surfY, px, surfY + 22);
    reflG.addColorStop(0.0, 'rgba(240, 249, 255, 0.42)');
    reflG.addColorStop(1.0, 'rgba(240, 249, 255, 0)');
    ctx.fillStyle = reflG;
    ctx.fillRect(px + visL, surfY - 2, visR - visL, 24);

    const waveStart = Math.max(0, Math.floor(visL / 16) * 16);
    const waveEnd = Math.min(w, Math.ceil(visR / 16) * 16);
    for (let lane = 0; lane < 3; lane++) {
      const baseOffY = 10 + lane * 13;
      ctx.strokeStyle = lane === 0 ? 'rgba(240, 253, 250, 0.42)' : 'rgba(186, 230, 253, 0.28)';
      ctx.lineWidth = lane === 0 ? 1.45 : 1.05;
      ctx.beginPath();
      for (let x = waveStart; x <= waveEnd; x += 16) {
        const yFlow = surfY + baseOffY +
          Math.sin((px + x) * (0.036 + lane * 0.006) - time * (3.2 - lane * 0.35) + lane * 1.8) * 2.4;
        if (x === waveStart) ctx.moveTo(px + x, yFlow);
        else ctx.lineTo(px + x, yFlow);
      }
      ctx.stroke();
    }

    // Breathing diamond caustic cells on stream bed
    ctx.strokeStyle = 'rgba(224, 252, 254, 0.34)';
    ctx.lineWidth = 1.05;
    ctx.beginPath();
    const cDrift = (time * 22) % 56;
    for (let rx = Math.floor(visL / 56) * 56 - 56 + cDrift; rx < visR + 56; rx += 56) {
      const br = 1 + 0.2 * Math.sin(time * 2.5 + rx * 0.06);
      const cyC = surfY + 36 + (Math.abs(Math.round(rx / 56)) % 2) * 14;
      ctx.moveTo(px + rx - 10 * br, cyC);
      ctx.quadraticCurveTo(px + rx, cyC - 3.8 * br, px + rx + 10 * br, cyC);
      ctx.quadraticCurveTo(px + rx, cyC + 3.8 * br, px + rx - 10 * br, cyC);
    }
    ctx.stroke();
    ctx.restore(); // end stream clip

    // 7. Crisp Glassy Surface Wave Crest
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    for (let x = waveStart; x <= waveEnd; x += 16) {
      const wy = waveY(x);
      if (x === waveStart) ctx.moveTo(px + x, wy);
      else ctx.lineTo(px + x, wy);
    }
    ctx.stroke();

    ctx.restore();
  }

  function drawSwissCheckpoint(ctx, cp, cx, cy, time) {
    const lit = !!cp.activated;
    const baseY = cy + (cp.h || 32);
    ctx.save();
    ctx.translate(cx + 22, baseY);

    // Ground cobblestone apron
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.beginPath();
    ctx.ellipse(4, 1, 28, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    if (lit) {
      const halo = ctx.createRadialGradient(2, -46, 5, 2, -46, 58);
      halo.addColorStop(0, 'rgba(254, 240, 138, 0.70)');
      halo.addColorStop(0.55, 'rgba(45, 212, 191, 0.28)');
      halo.addColorStop(1, 'rgba(45, 212, 191, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(2, -46, 58, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fluted Octagonal Honey-Larch Dorfbrunnen Column + Forged Iron Collars + Stone Plinth
    ctx.fillStyle = '#94a3b8';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.4;
    ctx.fillRect(-19, -8, 20, 8);
    ctx.strokeRect(-19, -8, 20, 8);

    const postG = ctx.createLinearGradient(-16, -76, -2, 0);
    postG.addColorStop(0, '#d97706');
    postG.addColorStop(0.45, '#92400e');
    postG.addColorStop(1, '#451a03');
    ctx.fillStyle = postG;
    ctx.strokeStyle = '#291509';
    ctx.lineWidth = 1.6;
    ctx.fillRect(-16, -76, 14, 68);
    ctx.strokeRect(-16, -76, 14, 68);
    // Vertical wood fluting & iron bands
    ctx.strokeStyle = 'rgba(254, 243, 199, 0.35)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(-12, -74); ctx.lineTo(-12, -10);
    ctx.moveTo(-6, -74); ctx.lineTo(-6, -10);
    ctx.stroke();
    ctx.fillStyle = '#334155';
    ctx.fillRect(-17, -68, 16, 2.5);
    ctx.fillRect(-17, -28, 16, 2.5);

    // Embossed Swiss Canton Crest Shield on fountain post
    ctx.fillStyle = '#dc2626';
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.roundRect(-14.5, -58, 11, 13, [2, 2, 6, 6]);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-12, -52.5, 6, 2);
    ctx.fillRect(-10, -54.5, 2, 6);

    // Carved wooden capital + overflowing crimson Geranium bowl + gilded pinecone finial!
    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = '#291509';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.roundRect(-19, -80, 20, 5, 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#15803d';
    for (const lx of [-16, -12, -6, -2]) {
      ctx.beginPath(); ctx.arc(lx, -81, 3.8, 0, Math.PI * 2); ctx.fill();
    }
    for (const [gx, gy, col] of [[-15, -83, '#ef4444'], [-11, -85, '#f43f5e'], [-6, -84, '#ef4444'], [-3, -82, '#fb7185']]) {
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(gx, gy, 2.6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.ellipse(-9, -89, 3.2, 4.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Ornate S-curved brass spout + wrought-iron scroll bracket + sparkling water jet
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-2, -45);
    ctx.quadraticCurveTo(5, -45, 7, -38);
    ctx.stroke();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-2, -39);
    ctx.quadraticCurveTo(6, -40, 10, -36);
    ctx.stroke();

    if (lit) {
      ctx.strokeStyle = '#5eead4';
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.moveTo(10, -36);
      ctx.quadraticCurveTo(16, -29, 15 + Math.sin(time * 14) * 1.2, -17);
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(10.5, -36);
      ctx.quadraticCurveTo(15.5, -29, 14.8 + Math.sin(time * 14) * 1.0, -18);
      ctx.stroke();
    }

    // Chiseled Alpine Granite Octagonal Trough Basin with mossy lip & rippling water
    const trG = ctx.createLinearGradient(-4, -20, 28, 0);
    trG.addColorStop(0, '#f1f5f9');
    trG.addColorStop(0.5, '#94a3b8');
    trG.addColorStop(1, '#475569');
    ctx.fillStyle = trG;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(-4, -20, 32, 20, [2, 2, 5, 5]);
    ctx.fill();
    ctx.stroke();
    // Carved panel relief & moss tuft on granite basin
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.35)';
    ctx.lineWidth = 1.1;
    ctx.strokeRect(0, -13, 24, 9);
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(23, -19.5, 4.5, 1.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = lit ? '#2dd4bf' : '#64748b';
    ctx.fillRect(-1.5, -18, 27, 4.5);
    if (lit) {
      ctx.strokeStyle = '#ccfbf1';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.ellipse(15, -16, 4 + Math.sin(time * 10) * 1.5, 1.4, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  // =========================================================================
  // 4. MONUMENTAL GRINDELWALD CHALET & SWISS RAILWAY CLOCKTOWER GOAL GATE
  // =========================================================================
  function drawSwissGoalGate(ctx, g, gx, gy, time, label) {
    ctx.save();
    const cx = gx + g.w * 0.5;
    const botY = gy + g.h;
    const gw = Math.max(148, g.w + 34);
    const leftX = cx - gw * 0.5;
    const rightX = cx + gw * 0.5;
    const topY = gy - 26;

    // Ground contact shadow beneath monumental gate
    ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
    ctx.beginPath();
    ctx.ellipse(cx, botY + 1, gw * 0.56, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. TOWERING HALF-TIMBERED & LIMESTONE SWISS CLOCKTOWER (برج الساعة السويسري بتفاصيل معمارية دقيقة)
    const twL = cx - 32, twW = 64, twTop = topY - 126;
    const twG = ctx.createLinearGradient(twL, 0, twL + twW, 0);
    twG.addColorStop(0.00, '#fffdf9');
    twG.addColorStop(0.52, '#f1f5f9');
    twG.addColorStop(0.86, '#cbd5e1');
    twG.addColorStop(1.00, '#94a3b8');
    ctx.fillStyle = twG;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.6;
    ctx.fillRect(twL, twTop, twW, 134);
    ctx.strokeRect(twL, twTop, twW, 134);

    // Interlocking dressed limestone corner quoins along both vertical tower edges
    for (let qi = 0; qi < 10; qi++) {
      const qy = twTop + 8 + qi * 11.5;
      const qW = qi % 2 === 0 ? 8.5 : 5.5;
      ctx.fillStyle = qi % 2 === 0 ? '#e2e8f0' : '#cbd5e1';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 0.7;
      ctx.fillRect(twL + 0.8, qy, qW, 9.2);
      ctx.strokeRect(twL + 0.8, qy, qW, 9.2);
      ctx.fillStyle = qi % 2 === 0 ? '#cbd5e1' : '#94a3b8';
      ctx.fillRect(twL + twW - qW - 0.8, qy, qW, 9.2);
      ctx.strokeRect(twL + twW - qW - 0.8, qy, qW, 9.2);
    }

    // Authentic carved walnut Fachwerk half-timbering & diagonal braces around clock chamber
    ctx.fillStyle = '#5c2d0c';
    ctx.fillRect(twL + 3, twTop + 5, twW - 6, 4.2);
    ctx.fillRect(twL + 3, twTop + 69, twW - 6, 4.5);
    ctx.fillRect(twL + 3, twTop + 5, 4.2, 68);
    ctx.fillRect(twL + twW - 7.2, twTop + 5, 4.2, 68);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.moveTo(twL + 6, twTop + 70); ctx.lineTo(twL + 16, twTop + 9);
    ctx.moveTo(twL + twW - 6, twTop + 70); ctx.lineTo(twL + twW - 16, twTop + 9);
    ctx.stroke();

    // Molded projecting limestone cornice dividing clock chamber from arched belfry
    const corG = ctx.createLinearGradient(0, twTop + 72, 0, twTop + 79);
    corG.addColorStop(0, '#f8fafc');
    corG.addColorStop(0.55, '#cbd5e1');
    corG.addColorStop(1, '#64748b');
    ctx.fillStyle = corG;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.1;
    ctx.fillRect(twL - 3, twTop + 72, twW + 6, 6.5);
    ctx.strokeRect(twL - 3, twTop + 72, twW + 6, 6.5);
    // Soft shadow under cornice
    ctx.fillStyle = 'rgba(15, 23, 42, 0.20)';
    ctx.fillRect(twL + 1, twTop + 78.5, twW - 2, 4);

    // Twin Gothic Arched Belfry Openings with angled wooden louvers & gleaming bronze station bell!
    for (const bx of [cx - 17, cx + 4]) {
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.roundRect(bx, topY - 43, 13, 22, [6.5, 6.5, 0, 0]);
      ctx.fill();
      ctx.stroke();
      // Gleaming miniature bronze bell visible inside belfry arch
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(bx + 4.5, topY - 35);
      ctx.lineTo(bx + 8.5, topY - 35);
      ctx.lineTo(bx + 10.2, topY - 28);
      ctx.lineTo(bx + 2.8, topY - 28);
      ctx.closePath();
      ctx.fill();
      // Angled timber belfry louvers
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.1;
      for (let ly = topY - 37; ly <= topY - 25; ly += 4) {
        ctx.beginPath(); ctx.moveTo(bx + 1.5, ly); ctx.lineTo(bx + 11.5, ly); ctx.stroke();
      }
    }

    // Shadow cast beneath the clocktower spire eaves
    ctx.fillStyle = 'rgba(15, 23, 42, 0.30)';
    ctx.fillRect(twL, twTop, twW, 7.5);

    // 1B. STEEP OVERLAPPING SHINGLED ALPINE SPIRE ROOF (قرميد وألواح أردواز متراكبة للبرج + كرة مذهّبة)
    const spBaseY = twTop + 5;
    const spApexY = twTop - 64;
    const spHalfW = 42;
    const traceSpire = () => {
      ctx.beginPath();
      ctx.moveTo(cx - spHalfW, spBaseY);
      ctx.quadraticCurveTo(cx - 21, spBaseY - 22, cx, spApexY);
      ctx.quadraticCurveTo(cx + 21, spBaseY - 22, cx + spHalfW, spBaseY);
      ctx.closePath();
    };
    ctx.save();
    traceSpire();
    ctx.clip();
    // Base slate-charcoal sunlit-left / shaded-right 3D cone shading
    const spG = ctx.createLinearGradient(cx - spHalfW, spApexY, cx + spHalfW, spBaseY);
    spG.addColorStop(0.00, '#64748b');
    spG.addColorStop(0.46, '#475569');
    spG.addColorStop(0.52, '#334155');
    spG.addColorStop(1.00, '#0f172a');
    ctx.fillStyle = spG;
    ctx.fillRect(cx - spHalfW - 2, spApexY - 2, spHalfW * 2 + 4, spBaseY - spApexY + 6);
    // Overlapping staggered scalloped/diamond alpine slate shingle courses!
    const spireRows = 11;
    const rowStep = (spBaseY - spApexY) / spireRows;
    for (let r = 1; r <= spireRows; r++) {
      const ry = spApexY + r * rowStep;
      const t = r / spireRows;
      const hw = spHalfW * (0.14 + t * 0.92);
      const tileW = 6.5;
      const off = (r % 2) * (tileW * 0.5);
      // Dark under-course overlap shadow
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.58)';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(cx - hw, ry); ctx.lineTo(cx + hw, ry); ctx.stroke();
      // Individual overlapping shingle tabs with subtle sunlit left/right tone
      for (let tx = cx - hw - tileW + off; tx < cx + hw + tileW; tx += tileW) {
        const isSunlit = tx < cx;
        ctx.fillStyle = isSunlit
          ? ((Math.round(tx) + r) % 3 === 0 ? 'rgba(148, 163, 184, 0.30)' : 'rgba(100, 116, 139, 0.22)')
          : 'rgba(15, 23, 42, 0.24)';
        ctx.beginPath();
        ctx.moveTo(tx, ry - rowStep);
        ctx.lineTo(tx + tileW, ry - rowStep);
        ctx.lineTo(tx + tileW, ry - 1.5);
        ctx.quadraticCurveTo(tx + tileW * 0.5, ry + 1.5, tx, ry - 1.5);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = isSunlit ? 'rgba(226, 232, 240, 0.22)' : 'rgba(15, 23, 42, 0.42)';
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }
    // Crisp sunlit 3D central spire rib highlight
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.36)';
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(cx - 0.8, spApexY); ctx.lineTo(cx - 0.8, spBaseY); ctx.stroke();
    ctx.restore();
    traceSpire();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.6;
    ctx.stroke();
    // Carved wooden under-eave fascia & rafter dentils along base of spire
    ctx.fillStyle = '#451a03';
    ctx.fillRect(cx - spHalfW + 1, spBaseY - 1, spHalfW * 2 - 2, 3.2);
    // Copper collar, gleaming 3D gilded orb & ornate wrought-iron Swiss weathervane cross
    ctx.fillStyle = '#b45309';
    ctx.fillRect(cx - 3.5, spApexY - 2, 7, 5);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(cx, spApexY - 3); ctx.lineTo(cx, spApexY - 19);
    ctx.moveTo(cx - 5.5, spApexY - 13); ctx.lineTo(cx + 5.5, spApexY - 13);
    ctx.stroke();
    const orbG = ctx.createRadialGradient(cx - 1.5, spApexY - 5, 0.6, cx, spApexY - 3.5, 4.8);
    orbG.addColorStop(0, '#fefce8');
    orbG.addColorStop(0.45, '#fbbf24');
    orbG.addColorStop(1, '#92400e');
    ctx.fillStyle = orbG;
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.arc(cx, spApexY - 3.5, 4.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 1C. HYPER-DETAILED WORKING SWISS SBB MONUMENTAL CLOCK FACE (ساعة سويسرية دقيقة بإطار نحاسي وعقارب وظل زجاجي)
    const clkY = twTop + 39;
    const clkR = 23.0;
    // Recessed circular stone surround + soft drop shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.34)';
    ctx.beginPath(); ctx.arc(cx + 1.2, clkY + 1.6, clkR + 3.2, 0, Math.PI * 2); ctx.fill();
    // Multi-layered brushed antique-brass outer bezel
    const bezG = ctx.createLinearGradient(cx - clkR, clkY - clkR, cx + clkR, clkY + clkR);
    bezG.addColorStop(0.00, '#fef08a');
    bezG.addColorStop(0.32, '#f59e0b');
    bezG.addColorStop(0.68, '#b45309');
    bezG.addColorStop(1.00, '#451a03');
    ctx.fillStyle = bezG;
    ctx.strokeStyle = '#291509';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, clkY, clkR + 2.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 12 tiny brass rivets around the outer bezel
    ctx.fillStyle = '#fef9c3';
    for (let rv = 0; rv < 12; rv++) {
      const ra = (rv * Math.PI) / 6;
      ctx.beginPath(); ctx.arc(cx + Math.cos(ra) * (clkR + 1.1), clkY + Math.sin(ra) * (clkR + 1.1), 0.75, 0, Math.PI * 2); ctx.fill();
    }
    // Ivory-enamel porcelain dial with subtle inner depth gradient
    const dialG = ctx.createRadialGradient(cx - 5, clkY - 5, 2, cx, clkY, clkR);
    dialG.addColorStop(0.00, '#ffffff');
    dialG.addColorStop(0.75, '#f8fafc');
    dialG.addColorStop(1.00, '#cbd5e1');
    ctx.fillStyle = dialG;
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.arc(cx, clkY, clkR - 0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Delicate inner chapter ring
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.22)';
    ctx.lineWidth = 0.75;
    ctx.beginPath(); ctx.arc(cx, clkY, clkR - 5.8, 0, Math.PI * 2); ctx.stroke();
    // All 60 precision minute ticks + bold Swiss SBB baton hour markers!
    for (let mIdx = 0; mIdx < 60; mIdx++) {
      const a = (mIdx * Math.PI) / 30;
      const isHour = mIdx % 5 === 0;
      const isCardinal = mIdx % 15 === 0;
      ctx.strokeStyle = isHour ? '#0f172a' : 'rgba(15, 23, 42, 0.55)';
      ctx.lineWidth = isCardinal ? 2.4 : isHour ? 1.7 : 0.65;
      const rIn = isCardinal ? clkR - 6.8 : isHour ? clkR - 5.6 : clkR - 3.2;
      const rOut = clkR - 1.8;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * rIn, clkY + Math.sin(a) * rIn);
      ctx.lineTo(cx + Math.cos(a) * rOut, clkY + Math.sin(a) * rOut);
      ctx.stroke();
    }
    // Sculpted hands with realistic cast shadow onto enamel dial!
    const hrA = time * 0.08 - Math.PI * 0.35;
    const minA = time * 0.65 - Math.PI * 0.15;
    const secA = time * 2.4 - Math.PI * 0.5;
    const drawTaperedHand = (ang, len, backLen, baseW, col, shOff) => {
      ctx.save();
      ctx.translate(cx + shOff, clkY + shOff);
      ctx.rotate(ang);
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(-backLen, -baseW * 0.65);
      ctx.lineTo(len, -baseW * 0.28);
      ctx.lineTo(len + 1.4, 0);
      ctx.lineTo(len, baseW * 0.28);
      ctx.lineTo(-backLen, baseW * 0.65);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };
    // Hand shadows
    drawTaperedHand(hrA, 11.5, 3.2, 2.3, 'rgba(15, 23, 42, 0.22)', 1.1);
    drawTaperedHand(minA, 16.5, 4.0, 1.8, 'rgba(15, 23, 42, 0.20)', 1.3);
    // Main steel-black hour & minute hands
    drawTaperedHand(hrA, 11.5, 3.2, 2.3, '#0f172a', 0);
    drawTaperedHand(minA, 16.5, 4.0, 1.8, '#0f172a', 0);
    // Iconic Crimson Swiss SBB Mondaine Paddle Second Hand
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 1.45;
    ctx.beginPath();
    ctx.moveTo(cx - Math.cos(secA) * 4.8, clkY - Math.sin(secA) * 4.8);
    ctx.lineTo(cx + Math.cos(secA) * 16.2, clkY + Math.sin(secA) * 16.2);
    ctx.stroke();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(cx + Math.cos(secA) * 15.8, clkY + Math.sin(secA) * 15.8, 2.7, 0, Math.PI * 2);
    ctx.fill();
    // Gleaming brass center hub pin
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(cx, clkY, 2.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Subtle curved glass crystal reflection arc across upper-left quadrant
    ctx.fillStyle = 'rgba(255, 255, 255, 0.34)';
    ctx.beginPath();
    ctx.ellipse(cx - 5.5, clkY - 6.8, 10.5, 5.2, -0.55, 0, Math.PI * 2);
    ctx.fill();

    // 2. RADIANT WARM GOLDEN VICTORY HEARTH PORTAL INSIDE CHALET ARCHWAY
    const portalR = gw * 0.275;
    const archCy = gy + 44;
    const pGlow = ctx.createRadialGradient(cx, botY - 46, 5, cx, botY - 46, portalR * 1.68);
    pGlow.addColorStop(0.00, 'rgba(255, 255, 255, 0.98)');
    pGlow.addColorStop(0.35, 'rgba(254, 240, 138, 0.90)');
    pGlow.addColorStop(0.70, 'rgba(45, 212, 191, 0.44)');
    pGlow.addColorStop(1.00, 'rgba(13, 148, 136, 0)');
    ctx.fillStyle = pGlow;
    ctx.beginPath();
    ctx.arc(cx, botY - 46, portalR * 1.68, 0, Math.PI * 2);
    ctx.fill();

    // 3. CARVED GRANITE & HONEY-TIMBER GRAND CHALET PORTAL BODY
    const traceGate = () => {
      ctx.beginPath();
      ctx.moveTo(leftX, botY);
      ctx.lineTo(leftX, topY + 26);
      ctx.lineTo(rightX, topY + 26);
      ctx.lineTo(rightX, botY);
      ctx.lineTo(cx + portalR, botY);
      ctx.lineTo(cx + portalR, archCy);
      ctx.arc(cx, archCy, portalR, 0, Math.PI, true);
      ctx.lineTo(cx - portalR, botY);
      ctx.closePath();
    };
    ctx.save();
    traceGate();
    ctx.clip();
    fillAshlar(ctx, leftX, topY + 54, gw, botY - (topY + 54), 12, 22, GRANITE_PAL, 43);
    // Upper honey-larch interlocked chalet story
    const chG = ctx.createLinearGradient(leftX, topY + 26, rightX, topY + 56);
    chG.addColorStop(0.0, '#d97706');
    chG.addColorStop(0.5, '#b45309');
    chG.addColorStop(1.0, '#78350f');
    ctx.fillStyle = chG;
    ctx.fillRect(leftX, topY + 26, gw, 30);
    ctx.strokeStyle = 'rgba(41, 16, 5, 0.48)';
    ctx.lineWidth = 1.15;
    for (let ly = topY + 32; ly <= topY + 50; ly += 6) {
      ctx.beginPath(); ctx.moveTo(leftX, ly); ctx.lineTo(rightX, ly); ctx.stroke();
    }
    // Timber belt-course molding & cast roof eave shadow
    ctx.fillStyle = '#451a03';
    ctx.fillRect(leftX, topY + 53, gw, 3.5);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
    ctx.fillRect(leftX, topY + 26, gw, 5.5);
    ctx.restore();
    traceGate();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Stepped granite base plinths on both portal piers
    for (const pxB of [leftX - 2, cx + portalR]) {
      const bwP = pxB < cx ? (cx - portalR - leftX + 2) : (rightX - (cx + portalR) + 2);
      ctx.fillStyle = '#94a3b8';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.2;
      ctx.fillRect(pxB, botY - 12, bwP, 12);
      ctx.strokeRect(pxB, botY - 12, bwP, 12);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(pxB + 1, botY - 11, bwP - 2, 2.5);
    }

    // Individual Radiating Carved Limestone Arch Voussoirs + Prominent Carved Keystone!
    const numV = 11;
    const innerR = portalR;
    const outerR = portalR + 9.5;
    for (let vi = 0; vi < numV; vi++) {
      const a0 = Math.PI + (vi / numV) * Math.PI;
      const a1 = Math.PI + ((vi + 1) / numV) * Math.PI;
      const isKey = vi === Math.floor(numV / 2);
      const rOut = isKey ? outerR + 3.5 : outerR;
      ctx.fillStyle = isKey ? '#f8fafc' : (vi % 2 === 0 ? '#e2e8f0' : '#cbd5e1');
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.05;
      ctx.beginPath();
      ctx.arc(cx, archCy, rOut, a0, a1);
      ctx.arc(cx, archCy, innerR, a1, a0, true);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    // Recessed 3D stone intrados lip inside archway
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.42)';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(cx, archCy, portalR - 0.8, Math.PI, Math.PI * 2);
    ctx.stroke();

    // Flanking Shuttered Chalet Windows (leaded panes + geraniums) & Warm Wrought-Iron Station Lanterns!
    for (const side of [-1, 1]) {
      const wx = cx + side * (gw * 0.34);
      // Multi-pane leaded window + glass reflection
      const wG = ctx.createLinearGradient(wx - 8, topY + 32, wx + 8, topY + 48);
      wG.addColorStop(0, '#fefce8');
      wG.addColorStop(1, '#facc15');
      ctx.fillStyle = wG;
      ctx.strokeStyle = '#291509';
      ctx.lineWidth = 1.2;
      ctx.fillRect(wx - 7.5, topY + 32, 15, 16);
      ctx.strokeRect(wx - 7.5, topY + 32, 15, 16);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(wx, topY + 32); ctx.lineTo(wx, topY + 48);
      ctx.moveTo(wx - 7.5, topY + 40); ctx.lineTo(wx + 7.5, topY + 40);
      ctx.stroke();
      // Louvered green Swiss shutters with red/white alpine accents
      for (const shX of [wx - 12.2, wx + 7.6]) {
        ctx.fillStyle = '#15803d';
        ctx.strokeStyle = '#052e16';
        ctx.lineWidth = 0.9;
        ctx.fillRect(shX, topY + 32, 4.6, 16);
        ctx.strokeRect(shX, topY + 32, 4.6, 16);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(shX + 0.8, topY + 38.5, 3.0, 3.0);
      }
      // Wooden flowerbox overflowing with green leaves & red geraniums
      ctx.fillStyle = '#7c2d12';
      ctx.fillRect(wx - 9, topY + 48, 18, 4.2);
      ctx.fillStyle = '#16a34a';
      ctx.beginPath(); ctx.ellipse(wx, topY + 47.8, 9.2, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      for (const fx0 of [-5.5, 0, 5.5]) {
        ctx.fillStyle = fx0 === 0 ? '#f43f5e' : '#ef4444';
        ctx.beginPath(); ctx.arc(wx + fx0, topY + 46.8, 2.3, 0, Math.PI * 2); ctx.fill();
      }

      // Ornate wrought-iron Swiss station lantern with warm volumetric halo
      const lx = cx + side * (portalR + 14.5);
      const ly = gy + 56;
      const lHalo = ctx.createRadialGradient(lx, ly + 4, 2, lx, ly + 4, 18);
      lHalo.addColorStop(0, 'rgba(254, 240, 138, 0.55)');
      lHalo.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = lHalo;
      ctx.beginPath(); ctx.arc(lx, ly + 4, 18, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(lx + side * 7, ly - 7); ctx.lineTo(lx, ly - 7); ctx.lineTo(lx, ly - 2);
      ctx.moveTo(lx + side * 6, ly - 2); ctx.quadraticCurveTo(lx + side * 2, ly - 5, lx + side * 1, ly - 7);
      ctx.stroke();
      // Copper lantern hood + glowing glass cage
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(lx - 6.5, ly - 1.5); ctx.lineTo(lx, ly - 5.5); ctx.lineTo(lx + 6.5, ly - 1.5); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(lx - 4.8, ly - 1.5, 9.6, 12.5, 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath(); ctx.moveTo(lx, ly - 1.5); ctx.lineTo(lx, ly + 11); ctx.stroke();
    }

    // Chiseled threshold step & plush red-and-gold station welcome carpet
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(cx - portalR, botY - 3, portalR * 2, 3);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(cx - portalR + 4, botY - 5.5, (portalR - 4) * 2, 5.5);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(cx - portalR + 4, botY - 5.5, (portalR - 4) * 2, 1.4);

    // 4. REALISTIC OVERLAPPING TERRACOTTA TILE GABLE ROOF (القرميد العلوي الواقعي للبوابة + حواف خشبية مزخرفة)
    const rfLeft = leftX - 24;
    const rfRight = rightX + 24;
    const rfBotY = topY + 31;
    const rfPeakY = topY - 21;
    const traceChaletRoof = () => {
      ctx.beginPath();
      ctx.moveTo(rfLeft, rfBotY);
      ctx.lineTo(cx, rfPeakY);
      ctx.lineTo(rfRight, rfBotY);
      ctx.closePath();
    };

    // Exposed dark-timber rafter tails projecting beneath overhanging eaves
    ctx.fillStyle = '#451a03';
    for (let rx = leftX - 18; rx <= rightX + 18; rx += 12) {
      ctx.fillRect(rx - 2, rfBotY - 1, 4, 5.5);
    }

    ctx.save();
    traceChaletRoof();
    ctx.clip();
    // Rich warm Alpine clay-terracotta base slope gradient (sunlit left -> shaded right)
    const roofG = ctx.createLinearGradient(rfLeft, rfPeakY, rfRight, rfBotY);
    roofG.addColorStop(0.00, '#dc2626');
    roofG.addColorStop(0.45, '#b91c1c');
    roofG.addColorStop(0.55, '#991b1b');
    roofG.addColorStop(1.00, '#5c1414');
    ctx.fillStyle = roofG;
    ctx.fillRect(rfLeft - 2, rfPeakY - 2, rfRight - rfLeft + 4, rfBotY - rfPeakY + 6);

    // Staggered rows of individual 3D curved clay terracotta tiles (صفوف قرميد فخاري متراكبة!)
    const TILE_PAL_SUN = ['#dc2626', '#c2410c', '#b91c1c', '#d9480f', '#b45309'];
    const TILE_PAL_SHD = ['#991b1b', '#7c2d12', '#7f1d1d', '#9a3412', '#6b1c14'];
    const tileRows = 8;
    const tRowH = (rfBotY - rfPeakY) / tileRows;
    const tW = 9.5;
    for (let r = 0; r < tileRows; r++) {
      const ryTop = rfPeakY + r * tRowH;
      const ryBot = ryTop + tRowH;
      const off = (r % 2) * (tW * 0.5);
      // Soft dark cast shadow under each overlapping course of tiles
      ctx.fillStyle = 'rgba(41, 10, 10, 0.42)';
      ctx.fillRect(rfLeft, ryBot - 1.4, rfRight - rfLeft, 2.2);
      for (let tx = rfLeft - tW + off; tx < rfRight + tW; tx += tW) {
        const isSun = tx + tW * 0.5 < cx;
        const pal = isSun ? TILE_PAL_SUN : TILE_PAL_SHD;
        const cIdx = Math.abs(Math.round(tx) * 7 + r * 13) % pal.length;
        ctx.fillStyle = pal[cIdx];
        ctx.beginPath();
        ctx.moveTo(tx + 0.5, ryTop);
        ctx.lineTo(tx + tW - 0.5, ryTop);
        ctx.lineTo(tx + tW - 0.5, ryBot - 2.2);
        ctx.quadraticCurveTo(tx + tW * 0.5, ryBot + 1.4, tx + 0.5, ryBot - 2.2);
        ctx.closePath();
        ctx.fill();
        // Subtle sunlit convex clay highlight along left side of each barrel tile
        ctx.strokeStyle = isSun ? 'rgba(254, 215, 170, 0.34)' : 'rgba(254, 202, 202, 0.14)';
        ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.moveTo(tx + 2.2, ryTop + 0.8);
        ctx.lineTo(tx + 2.2, ryBot - 2.2);
        ctx.stroke();
        // Crisp dark tile-side seam
        ctx.strokeStyle = 'rgba(41, 10, 10, 0.46)';
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(tx + tW - 0.5, ryTop);
        ctx.lineTo(tx + tW - 0.5, ryBot - 1.5);
        ctx.stroke();
      }
    }
    ctx.restore();

    // Heavy rounded clay verge/ridge cap tiles stepping along both gable slopes!
    traceChaletRoof();
    ctx.strokeStyle = '#3b0a0a';
    ctx.lineWidth = 2.0;
    ctx.stroke();
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(rfLeft + 1, rfBotY - 1);
    ctx.lineTo(cx, rfPeakY + 1);
    ctx.lineTo(rfRight - 1, rfBotY - 1);
    ctx.stroke();
    // Carved cream Swiss gingerbread bargeboard trim + scalloped gable lace!
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(rfLeft + 6, rfBotY - 1);
    ctx.lineTo(cx, rfPeakY + 5);
    ctx.lineTo(rfRight - 6, rfBotY - 1);
    ctx.stroke();
    // Peak ridge crown cap
    ctx.fillStyle = '#c2410c';
    ctx.strokeStyle = '#450a0a';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, rfPeakY + 1, 4.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Sculpted Swiss Canton Crest Medallion in gable peak
    ctx.fillStyle = '#dc2626';
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(cx - 8, topY + 2, 16, 17, [2, 2, 8, 8]);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 5, topY + 8.6, 10, 2.8);
    ctx.fillRect(cx - 1.4, topY + 5.0, 2.8, 10);

    // Twin fluttering square Swiss flags on brass-tipped poles mounted to roof eaves
    for (const side of [-1, 1]) {
      const fx = cx + side * (gw * 0.5 - 2);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(fx, topY + 27);
      ctx.lineTo(fx, topY - 15);
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath(); ctx.arc(fx, topY - 16, 2.2, 0, Math.PI * 2); ctx.fill();
      drawSwissFlag(ctx, fx, topY - 14, 15, time, side === -1 ? 0 : 1.5);
    }

    // Floating Banner Plaque
    const isEn = window.Game.I18n && window.Game.I18n.isEn();
    const text = isEn ? 'GRINDELWALD • SWISS ALPS' : (label || 'محطة غريندلفالد • جبال الألب');
    const bob = Math.sin(time * 2.6) * 3;
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    const tw = Math.max(205, ctx.measureText(text).width + 34);
    ctx.fillStyle = 'rgba(185, 28, 28, 0.95)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.roundRect(cx - tw * 0.5, topY - 220 + bob, tw, 24, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, cx, topY - 204 + bob);
    ctx.restore();
  }

  // =========================================================================
  // 5. MUSEUM-GRADE FOREGROUND SURFACES & 13 SWISS ALPINE MECHANICS
  // =========================================================================
  function drawSwissPlatform(ctx, p, px, py, nv, time) {
    // 1. SWISS COUNTRYSIDE GRASSY HILLSIDE, WARM COUNTRY DIRT TRAIL & RUSTIC WOODEN FENCE
    //    (منحدر عشبي أخضر متدرج مع طريق ترابية ريفية وسياج خشبي مطلّ على المروج والنهر في الأسفل!)
    if (p.type === 'swiss_meadow') {
      const viewW = ctx._viewW || 1024;
      const visMinX = Math.max(-48, -px - 48);
      const visMaxX = Math.min(p.w + 48, viewW - px + 48);
      const baseWorldX = p.x || 0;

      // Helper: keep wooden fence open at huts, Dorfbrunnen fountains, timber shafts, herders, cauldrons & station gate
      const isFenceClearZone = (wx) => {
        if (
          (wx >= 715 && wx <= 875) ||
          (wx >= 1835 && wx <= 1950) || (wx >= 2040 && wx <= 2295) ||
          (wx >= 2865 && wx <= 2965) ||
          (wx >= 4125 && wx <= 4370) || (wx >= 5170 && wx <= 5345) || (wx >= 5560 && wx <= 5715) ||
          (wx >= 6005 && wx <= 6105) ||
          (wx >= 9225 && wx <= 9325) ||
          (wx >= 11035 && wx <= 11150) || (wx >= 11290 && wx <= 11545) || (wx >= 11570 && wx <= 11815) ||
          (wx >= 12405 && wx <= 12505) ||
          (wx >= 14225 && wx <= 14400) || (wx >= 14660 && wx <= 14815) ||
          (wx >= 15555 && wx <= 15655) ||
          (wx >= 17025 && wx <= 17140) || (wx >= 17270 && wx <= 17525) ||
          (wx >= 18695 && wx <= 18795) || (wx >= 19505 && wx <= 19680) || (wx >= 19890 && wx <= 20045) ||
          wx >= 20340
        ) {
          return true;
        }
        return false;
      };

      ctx.save();
      ctx.translate(px, py);

      // --- A. RUSTIC SWISS SPLIT-RAIL WOODEN PASTURE FENCE (السياج الخشبي الريفي خلف الطريق الترابية) ---
      if (p.w >= 260) {
        const postStep = 48;
        const firstPost = Math.max(26, Math.floor((visMinX - 48) / postStep) * postStep + 26);
        const lastPost = Math.min(p.w - 26, Math.ceil((visMaxX + 48) / postStep) * postStep + 26);
        const activePosts = [];
        for (let lx = firstPost; lx <= lastPost; lx += postStep) {
          if (lx < 24 || lx > p.w - 24) continue;
          const wx = baseWorldX + lx;
          if (isFenceClearZone(wx)) continue;
          const bayIdx = Math.floor(wx / postStep);
          // Leave occasional airy viewpoint gaps (1 post every 8) so the valley vista breathes naturally!
          if (bayIdx % 8 === 5) continue;
          activePosts.push({ lx, wx, bayIdx });
        }

        // 1. Hand-split horizontal larch timber rails between consecutive posts
        for (let i = 0; i < activePosts.length - 1; i++) {
          const a = activePosts[i];
          const b = activePosts[i + 1];
          if (b.lx - a.lx > postStep + 4) continue;
          const sag = ((a.bayIdx % 3) - 1) * 0.7;
          for (const [ry, thick] of [[-18.5, 3.8], [-9.2, 3.8]]) {
            // Underside bark shadow
            ctx.strokeStyle = '#3b1d0a';
            ctx.lineWidth = thick + 1.0;
            ctx.beginPath();
            ctx.moveTo(a.lx, ry + 0.6);
            ctx.quadraticCurveTo((a.lx + b.lx) * 0.5, ry + sag + 0.8, b.lx, ry + 0.4);
            ctx.stroke();
            // Warm weathered honey-cedar split rail
            ctx.strokeStyle = '#a16207';
            ctx.lineWidth = thick;
            ctx.beginPath();
            ctx.moveTo(a.lx, ry);
            ctx.quadraticCurveTo((a.lx + b.lx) * 0.5, ry + sag, b.lx, ry - 0.2);
            ctx.stroke();
            // Sunlit upper wood grain highlight
            ctx.strokeStyle = '#fde68a';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(a.lx + 2, ry - 1.2);
            ctx.quadraticCurveTo((a.lx + b.lx) * 0.5, ry + sag - 1.2, b.lx - 2, ry - 1.4);
            ctx.stroke();
          }
        }

        // 2. Vertical hand-hewn Alpine larch posts with beveled rain-caps & forged iron nail heads
        for (const pt of activePosts) {
          const lean = ((pt.bayIdx * 17) % 5 - 2) * 0.45;
          const topY = -24.5 - (pt.bayIdx % 2) * 1.2;
          const pG = ctx.createLinearGradient(pt.lx - 3.5, topY, pt.lx + 3.5, topY);
          pG.addColorStop(0.0, '#d97706');
          pG.addColorStop(0.52, '#92400e');
          pG.addColorStop(1.0, '#451a03');
          ctx.fillStyle = pG;
          ctx.strokeStyle = '#291509';
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(pt.lx - 3.2, 2.5);
          ctx.lineTo(pt.lx - 3.0 + lean, topY + 2.6);
          ctx.lineTo(pt.lx + lean, topY);
          ctx.lineTo(pt.lx + 3.2 + lean, topY + 2.6);
          ctx.lineTo(pt.lx + 3.2, 2.5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          // Sunlit chamfered wooden post cap
          ctx.strokeStyle = '#fef3c7';
          ctx.lineWidth = 1.15;
          ctx.beginPath();
          ctx.moveTo(pt.lx - 2.6 + lean, topY + 2.5);
          ctx.lineTo(pt.lx + lean, topY + 0.5);
          ctx.stroke();
          // Forged iron rail nails
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(pt.lx + lean * 0.7, -18.5, 1.1, 0, Math.PI * 2);
          ctx.arc(pt.lx + lean * 0.35, -9.2, 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- B. CASCADING EMERALD GRASSY HILLSIDE SLOPE (المنحدر العشبي الأخضر المتدرج — ZERO Stone Masonry!) ---
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(0, 0, p.w, p.h, [10, 10, 14, 14]);
      ctx.clip();

      // Rich 5-stop sunlit-to-deep-spruce grassy hillside gradient
      const hillG = ctx.createLinearGradient(0, 8, 0, p.h);
      hillG.addColorStop(0.00, '#84cc16');
      hillG.addColorStop(0.18, '#22c55e');
      hillG.addColorStop(0.48, '#16a34a');
      hillG.addColorStop(0.78, '#15803d');
      hillG.addColorStop(1.00, '#064e3b');
      ctx.fillStyle = hillG;
      ctx.fillRect(0, 0, p.w, p.h);

      const segStep = 36;
      const segStart = Math.max(0, Math.floor(visMinX / segStep) * segStep - segStep);
      const segEnd = Math.min(p.w, Math.ceil(visMaxX / segStep) * segStep + segStep);

      // Rolling 3D grassy slope swells & sunlit meadow contour ridges cascading down the hillside
      if (segEnd > segStart) {
        // Upper sunlit meadow swell (y ~ 34..48)
        ctx.fillStyle = 'rgba(163, 230, 53, 0.26)';
        ctx.beginPath();
        ctx.moveTo(segStart, 14);
        for (let lx = segStart; lx <= segEnd; lx += segStep) {
          const wx = baseWorldX + lx;
          ctx.lineTo(lx, 41 + Math.sin(wx * 0.022) * 5.5 + Math.cos(wx * 0.048) * 2.5);
        }
        ctx.lineTo(segEnd, 14);
        ctx.closePath();
        ctx.fill();

        // Mid-hillside contour crest highlight & soft hollow shadow (y ~ 64..78)
        ctx.strokeStyle = 'rgba(187, 247, 208, 0.30)';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let lx = segStart; lx <= segEnd; lx += segStep) {
          const wx = baseWorldX + lx;
          const cy0 = 42 + Math.sin(wx * 0.022) * 5.5 + Math.cos(wx * 0.048) * 2.5;
          if (lx === segStart) ctx.moveTo(lx, cy0); else ctx.lineTo(lx, cy0);
        }
        ctx.stroke();

        ctx.fillStyle = 'rgba(5, 46, 22, 0.28)';
        ctx.beginPath();
        ctx.moveTo(segStart, p.h);
        for (let lx = segStart; lx <= segEnd; lx += segStep) {
          const wx = baseWorldX + lx;
          ctx.lineTo(lx, 71 + Math.cos(wx * 0.019 + 1.1) * 6.5 + Math.sin(wx * 0.043) * 2.8);
        }
        ctx.lineTo(segEnd, p.h);
        ctx.closePath();
        ctx.fill();
      }

      // Natural Moss-Cushioned Alpine Fieldstones & Slope Wildflowers nestled in the grass slope
      const rockStep = 156;
      const firstRock = Math.max(44, Math.floor(visMinX / rockStep) * rockStep + 44);
      const lastRock = Math.min(p.w - 44, Math.ceil(visMaxX / rockStep) * rockStep + 44);
      for (let rx = firstRock; rx <= lastRock; rx += rockStep) {
        if (rx < 38 || rx > p.w - 38) continue;
        const wx = baseWorldX + rx;
        const hSeed = Math.abs(Math.round(wx * 0.13));
        const ry = 46 + (hSeed % 3) * 14;
        // Soft grass shadow under fieldstone
        ctx.fillStyle = 'rgba(5, 46, 22, 0.34)';
        ctx.beginPath();
        ctx.ellipse(rx + 1, ry + 5.5, 14, 4.2, 0.06, 0, Math.PI * 2);
        ctx.fill();
        // Organic rounded limestone field boulder (sunlit silver-cream top, slate underside)
        const rG = ctx.createLinearGradient(rx, ry - 6, rx, ry + 6);
        rG.addColorStop(0.0, '#f1f5f9');
        rG.addColorStop(0.55, '#cbd5e1');
        rG.addColorStop(1.0, '#64748b');
        ctx.fillStyle = rG;
        ctx.beginPath();
        ctx.ellipse(rx, ry, 11.5, 5.8, -0.08, 0, Math.PI * 2);
        ctx.fill();
        if (hSeed % 2 === 0) {
          ctx.fillStyle = '#e2e8f0';
          ctx.beginPath();
          ctx.ellipse(rx + 10.5, ry + 2.4, 6.2, 3.6, 0.12, 0, Math.PI * 2);
          ctx.fill();
        }
        // Emerald grass blades & buttercups overlapping base of boulder
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(rx - 9, ry + 5.5); ctx.lineTo(rx - 11, ry - 0.5);
        ctx.moveTo(rx - 3, ry + 6.0); ctx.lineTo(rx - 2, ry + 0.5);
        ctx.moveTo(rx + 6, ry + 5.8); ctx.lineTo(rx + 8, ry + 0.5);
        ctx.stroke();
      }

      // Scattered hillside grass tufts & tiny slope dandelions/clover
      const tuftStep = 44;
      const firstTuft = Math.max(20, Math.floor(visMinX / tuftStep) * tuftStep + 20);
      const lastTuft = Math.min(p.w - 20, Math.ceil(visMaxX / tuftStep) * tuftStep + 20);
      for (let tx = firstTuft; tx <= lastTuft; tx += tuftStep) {
        if (tx < 18 || tx > p.w - 18) continue;
        const wx = baseWorldX + tx;
        const s = Math.abs(Math.round(wx * 0.09));
        const ty = 32 + (s % 4) * 14;
        ctx.strokeStyle = s % 2 === 0 ? '#86efac' : '#4ade80';
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(tx - 3, ty + 4); ctx.lineTo(tx - 5, ty - 2);
        ctx.moveTo(tx, ty + 4); ctx.lineTo(tx + 0.5, ty - 3);
        ctx.moveTo(tx + 3, ty + 4); ctx.lineTo(tx + 5, ty - 1.5);
        ctx.stroke();
        if (s % 3 === 0) {
          ctx.fillStyle = s % 6 === 0 ? '#ffffff' : '#fde047';
          ctx.beginPath();
          ctx.arc(tx + 1, ty - 3.5, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- C. BACK LUSH GRASS VERGE + WARM WINDING COUNTRY DIRT & PEBBLE TRAIL (الطريق الترابية الريفية) ---
      // 1. Sunlit green grass verge along the back edge beneath the wooden fence
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(0, 0, p.w, 4.5);
      ctx.fillStyle = '#bef264';
      ctx.fillRect(0, 0, p.w, 1.8);

      // 2. Warm undulating country dirt & gravel trail (y ~ 2.2 .. 15.0)
      if (segEnd > segStart) {
        const pathStart = Math.max(6, segStart);
        const pathEnd = Math.min(p.w - 6, segEnd);
        if (pathEnd > pathStart) {
          const dirtG = ctx.createLinearGradient(0, 1.5, 0, 16);
          dirtG.addColorStop(0.00, '#c89662');
          dirtG.addColorStop(0.28, '#f5deb3');
          dirtG.addColorStop(0.65, '#dfb27c');
          dirtG.addColorStop(1.00, '#9c6638');
          ctx.fillStyle = dirtG;
          ctx.beginPath();
          for (let lx = pathStart; lx <= pathEnd; lx += 24) {
            const wx = baseWorldX + lx;
            const topEdge = 2.4 + Math.sin(wx * 0.042) * 1.1;
            if (lx === pathStart) ctx.moveTo(lx, topEdge); else ctx.lineTo(lx, topEdge);
          }
          for (let lx = pathEnd; lx >= pathStart; lx -= 24) {
            const wx = baseWorldX + lx;
            const botEdge = 13.8 + Math.cos(wx * 0.036 + 0.7) * 1.5;
            ctx.lineTo(lx, botEdge);
          }
          ctx.closePath();
          ctx.fill();

          // Subtle sunlit footpath track crown & wheel rut along the dirt trail
          ctx.strokeStyle = 'rgba(255, 251, 235, 0.45)';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          for (let lx = pathStart; lx <= pathEnd; lx += 24) {
            const wx = baseWorldX + lx;
            const cyTrack = 7.4 + Math.sin(wx * 0.039 + 0.3) * 1.1;
            if (lx === pathStart) ctx.moveTo(lx, cyTrack); else ctx.lineTo(lx, cyTrack);
          }
          ctx.stroke();

          ctx.strokeStyle = 'rgba(120, 53, 15, 0.20)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (let lx = pathStart; lx <= pathEnd; lx += 24) {
            const wx = baseWorldX + lx;
            const cyRut = 10.6 + Math.cos(wx * 0.036 + 0.7) * 1.2;
            if (lx === pathStart) ctx.moveTo(lx, cyRut); else ctx.lineTo(lx, cyRut);
          }
          ctx.stroke();
        }
      }

      // Scattered natural limestone pebbles & warm gravel grains on the dirt trail
      const pebStep = 22;
      const firstPeb = Math.max(12, Math.floor(visMinX / pebStep) * pebStep + 12);
      const lastPeb = Math.min(p.w - 12, Math.ceil(visMaxX / pebStep) * pebStep + 12);
      for (let px0 = firstPeb; px0 <= lastPeb; px0 += pebStep) {
        if (px0 < 10 || px0 > p.w - 10) continue;
        const wx = baseWorldX + px0;
        const ps = Math.abs(Math.round(wx * 0.37));
        const py0 = 4.8 + (ps % 5) * 1.6;
        ctx.fillStyle = ps % 3 === 0 ? '#fef9c3' : ps % 2 === 0 ? '#e2e8f0' : '#92400e';
        ctx.beginPath();
        ctx.ellipse(px0, py0, 1.8 + (ps % 2) * 0.7, 1.0, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore(); // end hillside clip

      // --- D. ICONIC SWISS "WANDERWEG" YELLOW HIKING TRAIL SIGNPOST ---
      if (p.w >= 650 && 112 >= visMinX && 68 <= visMaxX) {
        const signX = 92;
        ctx.fillStyle = '#78350f';
        ctx.strokeStyle = '#291509';
        ctx.lineWidth = 1.2;
        ctx.fillRect(signX - 2.2, -30, 4.4, 31);
        ctx.strokeRect(signX - 2.2, -30, 4.4, 31);
        ctx.fillStyle = '#facc15';
        ctx.strokeStyle = '#713f12';
        ctx.beginPath();
        ctx.moveTo(signX - 11, -27);
        ctx.lineTo(signX + 13, -27);
        ctx.lineTo(signX + 19, -22.5);
        ctx.lineTo(signX + 13, -18);
        ctx.lineTo(signX - 11, -18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(signX + 11.5, -24.5, 4.2, 4.2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(signX + 11.5, -23.1, 4.2, 1.4);
      }

      // --- E. FRONT LUSH WILDFLOWER VERGE BORDERING THE DIRT TRAIL (Edelweiss, Gentian, Clover & Buttercups!) ---
      const sway = Math.sin(time * 2.2 + baseWorldX * 0.01) * 1.4;
      const gStep = 18;
      const firstGx = Math.max(10, Math.floor(visMinX / gStep) * gStep + 10);
      const lastGx = Math.min(p.w - 10, Math.ceil(visMaxX / gStep) * gStep + 10);
      for (let gx = firstGx; gx <= lastGx; gx += gStep) {
        if (gx < 10 || gx > p.w - 10) continue;
        const wx = baseWorldX + gx;
        // Soft rounded emerald turf clumps framing the front edge of the dirt path
        ctx.fillStyle = gx % 36 === 10 ? '#22c55e' : '#16a34a';
        ctx.beginPath();
        ctx.ellipse(gx + 4, 14.2 + (gx % 3) * 0.6, 7.5, 2.8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Swaying grass blades along the back & front trail verges
        ctx.strokeStyle = gx % 36 === 10 ? '#86efac' : '#4ade80';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(gx + 1, 2.2);
        ctx.lineTo(gx - 0.5 + sway, -4.5);
        ctx.moveTo(gx + 6, 2.2);
        ctx.lineTo(gx + 7.5 + sway, -3.8);
        ctx.moveTo(gx + 4, 14.5);
        ctx.lineTo(gx + 5.2 + sway * 0.7, 9.8);
        ctx.stroke();

        const seed = Math.abs((Math.round(wx) * 7) % 10);
        if (seed === 1) {
          // Star-petaled white Swiss Edelweiss
          const fx = gx + 4 + sway * 0.6, fy = -4.0;
          ctx.fillStyle = '#f8fafc';
          for (let pt = 0; pt < 7; pt++) {
            const a = (pt * Math.PI * 2) / 7;
            ctx.beginPath();
            ctx.ellipse(fx + Math.cos(a) * 2.7, fy + Math.sin(a) * 2.7, 2.1, 0.9, a, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#eab308';
          ctx.beginPath(); ctx.arc(fx, fy, 1.4, 0, Math.PI * 2); ctx.fill();
        } else if (seed === 4) {
          // Royal-blue trumpet Alpine Gentian (Enzian)
          const fx = gx + 5 + sway * 0.5, fy = -3.6;
          ctx.fillStyle = '#1d4ed8';
          ctx.beginPath();
          ctx.moveTo(fx - 3.0, fy - 2.0);
          ctx.lineTo(fx + 3.0, fy - 2.0);
          ctx.lineTo(fx + 1.1, fy + 2.6);
          ctx.lineTo(fx - 1.1, fy + 2.6);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#93c5fd';
          ctx.beginPath(); ctx.arc(fx, fy - 1.8, 1.2, 0, Math.PI * 2); ctx.fill();
        } else if (seed === 7) {
          // Crimson Alpine Clover / Alpenrose blossom
          const fx = gx + 4 + sway * 0.5, fy = -3.8;
          ctx.fillStyle = '#f43f5e';
          for (let pt = 0; pt < 5; pt++) {
            const a = (pt * Math.PI * 2) / 5;
            ctx.beginPath(); ctx.arc(fx + Math.cos(a) * 1.6, fy + Math.sin(a) * 1.6, 1.4, 0, Math.PI * 2); ctx.fill();
          }
          ctx.fillStyle = '#fef08a';
          ctx.beginPath(); ctx.arc(fx, fy, 1.0, 0, Math.PI * 2); ctx.fill();
        } else if (seed === 9) {
          // Golden alpine buttercup on the front grass lip
          ctx.fillStyle = '#facc15';
          ctx.beginPath(); ctx.arc(gx + 5 + sway * 0.4, 11.2, 2.0, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();
      return true;
    }

    // 2. CARVED BERNESE CHALET BALCONY DECK (Beveled larch planks, pierced heart/diamond chalet lace apron, S-curved corbels, cascading geraniums & swaying lantern!)
    if (p.type === 'swiss_chalet_deck') {
      ctx.save();
      ctx.translate(px, py);

      // S-curved carved timber corbel brackets + forged iron straps underneath
      const corbels = p.w >= 170 ? [18, p.w * 0.5 - 6, p.w - 30] : [16, p.w - 28];
      for (const bx of corbels) {
        const cG = ctx.createLinearGradient(bx, p.h, bx + 12, p.h + 20);
        cG.addColorStop(0, '#78350f');
        cG.addColorStop(1, '#3b1b06');
        ctx.fillStyle = cG;
        ctx.strokeStyle = '#291509';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(bx, p.h - 1);
        ctx.lineTo(bx + 12, p.h - 1);
        ctx.bezierCurveTo(bx + 12, p.h + 9, bx + 8, p.h + 13, bx + 8, p.h + 20);
        ctx.lineTo(bx + 3, p.h + 20);
        ctx.bezierCurveTo(bx + 3, p.h + 12, bx, p.h + 8, bx, p.h - 1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Iron bolt & strap
        ctx.fillStyle = '#334155';
        ctx.fillRect(bx + 2, p.h + 2, 8, 2.2);
      }

      // Gently swaying warm wrought-iron chalet lantern beneath center of wide balconies
      if (p.w >= 180) {
        const lSway = Math.sin(time * 2.4 + (p.x || 0) * 0.02) * 0.10;
        ctx.save();
        ctx.translate(p.w * 0.5, p.h + 16);
        ctx.rotate(lSway);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 5); ctx.stroke();
        ctx.fillStyle = 'rgba(254, 240, 138, 0.30)';
        ctx.beginPath(); ctx.arc(0, 10, 11, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.roundRect(-4, 5, 8, 9, 2); ctx.fill(); ctx.stroke();
        ctx.restore();
      }

      // Pierced fretwork chalet lace apron hanging along lower edge
      ctx.fillStyle = '#78350f';
      ctx.strokeStyle = '#291509';
      ctx.lineWidth = 1.1;
      for (let ax = 8; ax < p.w - 14; ax += 12) {
        ctx.beginPath();
        ctx.moveTo(ax, p.h - 2);
        ctx.lineTo(ax + 6, p.h + 6);
        ctx.lineTo(ax + 12, p.h - 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Main honey-larch deck body with beveled plank seams & wood grain
      const tG = ctx.createLinearGradient(0, 0, 0, p.h);
      tG.addColorStop(0, '#fbbf24');
      tG.addColorStop(0.24, '#d97706');
      tG.addColorStop(0.72, '#92400e');
      tG.addColorStop(1, '#451a03');
      ctx.fillStyle = tG;
      ctx.strokeStyle = '#291509';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(0, 0, p.w, p.h, 3);
      ctx.fill();
      ctx.stroke();

      // Sunlit top plank rim + vertical plank joints + brass nail heads
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(2, 1, p.w - 4, 2.5);
      ctx.strokeStyle = 'rgba(41, 21, 9, 0.42)';
      ctx.lineWidth = 1.0;
      for (let jx = 28; jx < p.w - 12; jx += 28) {
        ctx.beginPath(); ctx.moveTo(jx, 1); ctx.lineTo(jx, p.h - 1); ctx.stroke();
      }

      // Carved cream-gold geometric Edelweiss/diamond inlay along fascia
      ctx.fillStyle = '#fef3c7';
      for (let dx = 18; dx < p.w - 18; dx += 20) {
        ctx.beginPath();
        ctx.moveTo(dx, 6.5);
        ctx.lineTo(dx + 4.2, 12);
        ctx.lineTo(dx, 17.5);
        ctx.lineTo(dx - 4.2, 12);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#78350f';
        ctx.beginPath(); ctx.arc(dx, 12, 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fef3c7';
      }

      // Overflowing Bernese Pelargonium Geranium flowerboxes with trailing vines!
      const boxes = p.w >= 210 ? [10, p.w * 0.5 - 19, p.w - 48] : [8, p.w - 44];
      for (const fx of boxes) {
        ctx.fillStyle = '#9a3412';
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(fx, p.h - 7, 36, 9, 2);
        ctx.fill();
        ctx.stroke();
        // Trailing green ivy tendrils
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(fx + 5, p.h + 2); ctx.quadraticCurveTo(fx + 2, p.h + 9, fx + 6, p.h + 13);
        ctx.moveTo(fx + 30, p.h + 2); ctx.quadraticCurveTo(fx + 33, p.h + 8, fx + 29, p.h + 12);
        ctx.stroke();
        // Lush foliage cushion
        ctx.fillStyle = '#16a34a';
        for (let lx = fx + 4; lx <= fx + 32; lx += 6.5) {
          ctx.beginPath(); ctx.arc(lx, p.h - 7, 4.4, 0, Math.PI * 2); ctx.fill();
        }
        // Multi-toned crimson, scarlet & rose geranium flower clusters
        const cols = ['#dc2626', '#f43f5e', '#fb7185', '#ef4444'];
        let ci = 0;
        for (let lx = fx + 5; lx <= fx + 31; lx += 7.5) {
          ctx.fillStyle = cols[ci++ % cols.length];
          ctx.beginPath(); ctx.arc(lx, p.h - 9.5, 3.0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fecdd3';
          ctx.beginPath(); ctx.arc(lx - 0.7, p.h - 10.3, 1.0, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();
      return true;
    }

    // 3. CLIMBABLE STACKED ALPINE TIMBER TOWER WALL (Individually shaded 3D horizontal larch logs, growth-ring saddle-notched log ends, moss tufts, forged iron cleats & mini chalet window!)
    if (p.type === 'swiss_timber_wall') {
      ctx.save();
      ctx.translate(px, py);

      // Individually shaded horizontal cylindrical larch logs!
      const logH = 14;
      for (let ly = 0, idx = 0; ly < p.h; ly += logH, idx++) {
        const curH = Math.min(logH, p.h - ly);
        const lG = ctx.createLinearGradient(0, ly, 0, ly + curH);
        lG.addColorStop(0.0, idx % 2 === 0 ? '#d97706' : '#ca8a04');
        lG.addColorStop(0.32, '#b45309');
        lG.addColorStop(0.78, '#78350f');
        lG.addColorStop(1.0, '#3b1b06');
        ctx.fillStyle = lG;
        ctx.fillRect(0, ly, p.w, curH);
        ctx.strokeStyle = '#291509';
        ctx.lineWidth = 1.1;
        ctx.strokeRect(0, ly, p.w, curH);

        // Subtle horizontal wood-grain knots
        ctx.strokeStyle = 'rgba(254, 243, 199, 0.22)';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(5, ly + 3.5);
        ctx.lineTo(p.w - 5, ly + 3.5);
        ctx.stroke();

        // Saddle-notched protruding log ends with spiral tree growth-rings every 2nd course!
        if (idx % 2 === 1 && ly < p.h - 8) {
          for (const ex of [-3.5, p.w + 3.5]) {
            ctx.fillStyle = '#fde68a';
            ctx.strokeStyle = '#451a03';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.arc(ex, ly + curH * 0.5, 5.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = '#b45309';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.arc(ex, ly + curH * 0.5, 2.7, 0, Math.PI * 2);
            ctx.stroke();
          }
          // Tiny emerald moss tuft in log notch
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.ellipse(idx % 4 === 1 ? 4 : p.w - 4, ly + curH, 3.5, 1.5, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Miniature cozy chalet window mid-tower
      if (p.h >= 140) {
        const wy = Math.round(p.h * 0.44);
        ctx.fillStyle = '#fef08a';
        ctx.strokeStyle = '#291509';
        ctx.lineWidth = 1.3;
        ctx.fillRect(p.w * 0.5 - 6, wy, 12, 14);
        ctx.strokeRect(p.w * 0.5 - 6, wy, 12, 14);
        ctx.strokeStyle = '#78350f';
        ctx.beginPath();
        ctx.moveTo(p.w * 0.5, wy); ctx.lineTo(p.w * 0.5, wy + 14);
        ctx.moveTo(p.w * 0.5 - 6, wy + 7); ctx.lineTo(p.w * 0.5 + 6, wy + 7);
        ctx.stroke();
        ctx.fillStyle = '#15803d';
        ctx.fillRect(p.w * 0.5 - 9.5, wy, 3.5, 14);
        ctx.fillRect(p.w * 0.5 + 6, wy, 3.5, 14);
      }

      // Forged iron & brass-riveted climbing cleats along tower face
      for (let ry = 22; ry < p.h - 14; ry += 28) {
        if (p.h >= 140 && Math.abs(ry - p.h * 0.44 - 6) < 12) continue;
        const rG = ctx.createLinearGradient(0, ry, 0, ry + 6);
        rG.addColorStop(0, '#fef3c7');
        rG.addColorStop(1, '#d97706');
        ctx.fillStyle = rG;
        ctx.strokeStyle = '#291509';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.roundRect(4, ry, p.w - 8, 5.5, 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(7, ry + 2.7, 1.4, 0, Math.PI * 2);
        ctx.arc(p.w - 7, ry + 2.7, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Mini shingled gable cap & climb indicator
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-2, 0, p.w + 4, 3.5);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⬆', p.w * 0.5, 15);
      ctx.restore();
      return true;
    }

    // 4. GROUNDED ALPINE HAY-WAGON BOUNCE CART (Traditional Swiss Heuwagen with flared ladder-racks, pitchfork, wildflowers, drawbar, Swiss crest & 12-spoke iron-rimmed wheels!)
    if (p.type === 'swiss_hay_bounce') {
      const groundOff = Math.max(48, 615 - (p.y || 548));
      let squish = 0;
      if (p.bounceAnim > 0) {
        const u = 1 - p.bounceAnim;
        squish = Math.sin(u * Math.PI * 2.5) * Math.exp(-u * 2.6) * 16;
      }
      ctx.save();
      ctx.translate(px, py);

      // Ground contact shadow
      ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
      ctx.beginPath();
      ctx.ellipse(p.w * 0.5, groundOff - 1, p.w * 0.52, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wooden pitchfork handle peeking diagonally from the hayloft!
      const hayTopY = squish;
      ctx.save();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.w - 28, hayTopY + 10);
      ctx.lineTo(p.w - 8, hayTopY - 14);
      ctx.stroke();
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(p.w - 10, hayTopY - 16, 5, 3);
      ctx.restore();

      // Flared wooden Heuwagen side ladder-racks (Leiterwagen) cradling the hay
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.2;
      for (const side of [-1, 1]) {
        const baseX = side < 0 ? 10 : p.w - 10;
        const tipX = side < 0 ? -4 : p.w + 4;
        ctx.beginPath();
        ctx.moveTo(baseX, 28);
        ctx.lineTo(tipX, hayTopY + 5);
        ctx.moveTo(baseX + (side < 0 ? 7 : -7), 28);
        ctx.lineTo(tipX + (side < 0 ? 8 : -8), hayTopY + 3);
        ctx.stroke();
      }

      // Lush 3D golden sun-cured alpine hay mound + layered straw wisps
      const hayG = ctx.createLinearGradient(0, hayTopY - 12, 0, 32);
      hayG.addColorStop(0.0, '#fefce8');
      hayG.addColorStop(0.28, '#fde047');
      hayG.addColorStop(0.68, '#eab308');
      hayG.addColorStop(1.0, '#a16207');
      ctx.fillStyle = hayG;
      ctx.strokeStyle = '#854d0e';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(6, 29);
      ctx.bezierCurveTo(-2, hayTopY + 2, 20, hayTopY - 11, p.w * 0.5, hayTopY - 9);
      ctx.bezierCurveTo(p.w - 20, hayTopY - 11, p.w + 2, hayTopY + 2, p.w - 6, 29);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Fine criss-crossing golden straw wisps & protruding rim stalks
      ctx.strokeStyle = '#fef9c3';
      ctx.lineWidth = 1.35;
      for (let s = 14; s < p.w - 14; s += 11) {
        ctx.beginPath();
        ctx.moveTo(s, hayTopY + 2 + (s % 3) * 2);
        ctx.quadraticCurveTo(s + 5, hayTopY + 10, s + 9, hayTopY + 17);
        ctx.stroke();
      }
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.1;
      for (let s = 20; s < p.w - 20; s += 15) {
        ctx.beginPath();
        ctx.moveTo(s + 6, hayTopY + 6);
        ctx.quadraticCurveTo(s, hayTopY + 14, s - 4, hayTopY + 21);
        ctx.stroke();
      }

      // Tucked wildflowers (white daisies, blue gentians & red poppy) in the hay
      for (const [dx, dy, col] of [[24, 11, '#ffffff'], [44, 15, '#3b82f6'], [p.w - 44, 14, '#ef4444'], [p.w - 24, 11, '#ffffff']]) {
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(dx, hayTopY + dy, 3.0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.arc(dx, hayTopY + dy, 1.2, 0, Math.PI * 2); ctx.fill();
      }

      // Subtle bounce chevron cue woven in golden straw
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(p.w * 0.5 - 8, hayTopY + 10);
      ctx.lineTo(p.w * 0.5, hayTopY + 2);
      ctx.lineTo(p.w * 0.5 + 8, hayTopY + 10);
      ctx.stroke();

      // Mortised oak wagon bed + forged iron corner brackets + front drawbar tongue
      const bedY = 26;
      const bedH = Math.max(18, groundOff - bedY - 14);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.moveTo(p.w - 8, bedY + bedH - 3);
      ctx.lineTo(p.w + 18, groundOff - 4);
      ctx.moveTo(p.w + 8, bedY + bedH + 3);
      ctx.lineTo(p.w + 8, groundOff - 1);
      ctx.stroke();

      const bedG = ctx.createLinearGradient(0, bedY, 0, bedY + bedH);
      bedG.addColorStop(0, '#b45309');
      bedG.addColorStop(1, '#5c2d0c');
      ctx.fillStyle = bedG;
      ctx.strokeStyle = '#291509';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(6, bedY, p.w - 12, bedH, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#d97706';
      for (let sx = 13; sx < p.w - 18; sx += 16) {
        ctx.fillRect(sx, bedY + 3, 9, bedH - 6);
      }
      // Center Swiss crest shield
      ctx.fillStyle = '#dc2626';
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.roundRect(p.w * 0.5 - 9, bedY + 2.5, 18, 15, [2, 2, 6, 6]);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(p.w * 0.5 - 5.5, bedY + 8.8, 11, 2.6);
      ctx.fillRect(p.w * 0.5 - 1.3, bedY + 5.0, 2.6, 10);

      // Detailed 12-spoke iron-tyred wooden wagon wheels with brass axle hubcaps!
      const wheelR = 17.0;
      const wheelY = groundOff - wheelR;
      for (const wx of [28, p.w - 28]) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.18)';
        ctx.beginPath(); ctx.arc(wx + 1, wheelY + 1, wheelR, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 3.2;
        ctx.beginPath(); ctx.arc(wx, wheelY, wheelR, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.arc(wx, wheelY, wheelR - 2.4, 0, Math.PI * 2); ctx.stroke();
        ctx.lineWidth = 1.4;
        for (let sp = 0; sp < 6; sp++) {
          const a = (sp * Math.PI) / 6;
          ctx.beginPath();
          ctx.moveTo(wx - Math.cos(a) * (wheelR - 2.5), wheelY - Math.sin(a) * (wheelR - 2.5));
          ctx.lineTo(wx + Math.cos(a) * (wheelR - 2.5), wheelY + Math.sin(a) * (wheelR - 2.5));
          ctx.stroke();
        }
        ctx.fillStyle = '#fbbf24';
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.arc(wx, wheelY, 4.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#451a03';
        ctx.beginPath(); ctx.arc(wx, wheelY, 1.6, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
      return true;
    }

    // 5. PANORAMIC SWISS MOUNTAIN CABLEWAY (Riveted pylons with concrete footings, ladders & sheave batteries; cabin with 8-wheel bogie, exterior ski rack, interior seats & wrap-around glass!)
    if (p.type === 'swiss_cable_car') {
      const worldOff = (p.x || 0) - px;
      const worldOffY = (p.y || 0) - py;
      const sX = p.startX !== undefined ? p.startX : p.x;
      const eX = p.endX !== undefined ? p.endX : p.x + 360;
      const sY = p.startY !== undefined ? p.startY : p.y;
      const towerL = (sX - worldOff) - 38;
      const towerR = (eX + p.w - worldOff) + 38;
      const cableY = (sY - worldOffY) - 58;

      ctx.save();
      for (const tx of [towerL, towerR]) {
        const towerH = Math.max(160, 740 - cableY);
        // Galvanized lattice steel tower legs + maintenance ladder
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3.8;
        ctx.beginPath();
        ctx.moveTo(tx - 19, cableY + towerH);
        ctx.lineTo(tx - 7, cableY - 12);
        ctx.moveTo(tx + 19, cableY + towerH);
        ctx.lineTo(tx + 7, cableY - 12);
        ctx.stroke();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        for (let ly = cableY + 8; ly < cableY + towerH - 20; ly += 22) {
          const frac = (ly - cableY) / towerH;
          const hw = 7 + frac * 11;
          ctx.beginPath();
          ctx.moveTo(tx - hw, ly); ctx.lineTo(tx + hw, ly + 19);
          ctx.moveTo(tx + hw, ly); ctx.lineTo(tx - hw, ly + 19);
          ctx.moveTo(tx - hw, ly); ctx.lineTo(tx + hw, ly);
          ctx.stroke();
        }
        // Concrete foundation footing near valley bank
        ctx.fillStyle = '#94a3b8';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.4;
        ctx.fillRect(tx - 23, 603 - worldOffY, 46, 18);
        ctx.strokeRect(tx - 23, 603 - worldOffY, 46, 18);
        // Crossarm girder + 4-sheave pulley battery + aviation beacon + Swiss pennant
        ctx.fillStyle = '#dc2626';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(tx - 26, cableY - 12, 52, 10, 2); ctx.fill(); ctx.stroke();
        for (const sx0 of [-18, -6, 6, 18]) {
          ctx.fillStyle = '#fbbf24';
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 1.0;
          ctx.beginPath(); ctx.arc(tx + sx0, cableY - 6.5, 3.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }
        drawSwissFlag(ctx, tx, cableY - 26, 10, time, tx * 0.01);
      }
      // Heavy steel track rope + upper haulage cable
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 3.4;
      ctx.beginPath(); ctx.moveTo(towerL - 26, cableY - 2); ctx.lineTo(towerR + 26, cableY - 2); ctx.stroke();
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(towerL - 26, cableY - 8); ctx.lineTo(towerR + 26, cableY - 8); ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.translate(px, py);
      // 8-wheel articulated Swiss Seilbahn carriage bogie + hydraulic damper cylinder
      ctx.fillStyle = '#334155'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(p.w * 0.5 - 30, -66, 60, 11, 3); ctx.fill(); ctx.stroke();
      for (const wx of [-21, -7, 7, 21]) {
        ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.0;
        ctx.beginPath(); ctx.arc(p.w * 0.5 + wx, -60.5, 3.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      // Hydraulic anti-sway damper
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(p.w * 0.5 + 18, -55); ctx.lineTo(p.w * 0.5 + 8, -32); ctx.stroke();
      // Main forged steel hanger arm + roof A-frame brace
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 4.2;
      ctx.beginPath();
      ctx.moveTo(p.w * 0.5, -55); ctx.lineTo(p.w * 0.5, -4);
      ctx.moveTo(p.w * 0.5 - 32, 0); ctx.lineTo(p.w * 0.5, -18); ctx.lineTo(p.w * 0.5 + 32, 0);
      ctx.stroke();

      // Walkable non-slip ribbed aluminum roof platform + safety edge rail
      const rfG = ctx.createLinearGradient(0, -3, 0, 8);
      rfG.addColorStop(0, '#ffffff'); rfG.addColorStop(1, '#cbd5e1');
      ctx.fillStyle = rfG; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.roundRect(3, -2, p.w - 6, 9, [5, 5, 0, 0]); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#64748b';
      for (let rx = 10; rx < p.w - 10; rx += 10) ctx.fillRect(rx, -1, 4, 2);

      // Aerodynamic crimson & snow-white Swiss panoramic gondola body + rubber bumper
      const cabG = ctx.createLinearGradient(0, 7, 0, 50);
      cabG.addColorStop(0, '#ef4444'); cabG.addColorStop(0.52, '#dc2626'); cabG.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = cabG; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.roundRect(5, 7, p.w - 10, 43, [2, 2, 10, 10]); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.roundRect(3, 42, p.w - 6, 4.5, 2); ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(7, 30.5, p.w - 14, 2.8);

      // Panoramic tinted glass windows with interior benches & hanging hand-straps!
      const winW = (p.w - 46) / 4;
      for (let wi = 0; wi < 4; wi++) {
        const wx = 12 + wi * ((p.w - 30) / 4);
        const winG = ctx.createLinearGradient(wx, 10, wx, 29);
        winG.addColorStop(0, '#e0f2fe'); winG.addColorStop(0.5, '#7dd3fc'); winG.addColorStop(1, '#0369a1');
        ctx.fillStyle = winG; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.roundRect(wx, 10, winW, 18.5, 3); ctx.fill(); ctx.stroke();
        // Interior bench & passenger grab-strap
        ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
        ctx.fillRect(wx + 2, 24, winW - 4, 3.5);
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)'; ctx.lineWidth = 1.0;
        ctx.beginPath(); ctx.moveTo(wx + winW * 0.5, 10); ctx.lineTo(wx + winW * 0.5, 15); ctx.stroke();
        // Crisp diagonal sky reflection
        ctx.strokeStyle = 'rgba(255,255,255,0.70)'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(wx + 4, 24); ctx.lineTo(wx + 11, 13); ctx.stroke();
      }
      // Sliding door seam + Swiss cross crest + cabin number
      ctx.strokeStyle = '#450a0a'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(p.w * 0.5, 8); ctx.lineTo(p.w * 0.5, 49); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(p.w * 0.5 - 6.5, 36.5, 13, 3.6);
      ctx.fillRect(p.w * 0.5 - 1.8, 31.8, 3.6, 13);

      // Exterior alpine ski & snowboard rack mounted on right side of cabin!
      ctx.fillStyle = '#334155';
      ctx.fillRect(p.w - 7, 18, 5, 20);
      ctx.strokeStyle = '#fde047'; ctx.lineWidth = 2.0;
      ctx.beginPath(); ctx.moveTo(p.w - 3, 9); ctx.lineTo(p.w - 3, 41); ctx.stroke();
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.0;
      ctx.beginPath(); ctx.moveTo(p.w - 0.5, 11); ctx.lineTo(p.w - 0.5, 41); ctx.stroke();
      ctx.restore();
      return true;
    }

    // 6. GLACIER EXPRESS COGWHEEL FUNICULAR (Stone arch voussoirs, toothed rack rail, overhead pantograph, panoramic roof windows & spinning brass cogwheel!)
    if (p.type === 'swiss_funicular_car') {
      const dir = (p.moveDir || 1) >= 0 ? 1 : -1;
      const wheelRot = (p.x || 0) * 0.09;
      const worldOff = (p.x || 0) - px;
      const sX = p.startX !== undefined ? p.startX : p.x;
      const eX = p.endX !== undefined ? p.endX : p.x + 360;
      const trackL = (sX - worldOff) - 56;
      const trackR = (eX + p.w - worldOff) + 56;
      const trackW = Math.max(p.w + 110, trackR - trackL);
      const railY = py + 56;

      ctx.save();
      const spanCount = 3;
      const spanW = trackW / spanCount;
      for (let si = 0; si <= spanCount; si++) {
        const pierX = trackL + si * spanW;
        const pierH = Math.max(120, 740 - (railY + 12));
        const pG = ctx.createLinearGradient(pierX - 15, 0, pierX + 15, 0);
        pG.addColorStop(0, '#f1f5f9'); pG.addColorStop(0.5, '#94a3b8'); pG.addColorStop(1, '#475569');
        ctx.fillStyle = pG; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.5;
        ctx.fillRect(pierX - 14, railY + 12, 28, pierH);
        ctx.strokeRect(pierX - 14, railY + 12, 28, pierH);
        //Pier cap coping stone & masonry courses
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(pierX - 17, railY + 10, 34, 4);
        ctx.strokeStyle = 'rgba(30,41,59,0.28)'; ctx.lineWidth = 1;
        for (let my = railY + 26; my < railY + pierH; my += 16) {
          ctx.beginPath(); ctx.moveTo(pierX - 14, my); ctx.lineTo(pierX + 14, my); ctx.stroke();
        }
        if (si < spanCount) {
          const midX = pierX + spanW * 0.5;
          const archR = Math.min(spanW * 0.42, 48);
          ctx.strokeStyle = '#64748b'; ctx.lineWidth = 7;
          ctx.beginPath(); ctx.arc(midX, railY + 14 + archR, archR, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
          // Radiating arch voussoir joints + keystone
          ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.1;
          for (let va = 1.18; va <= 1.84; va += 0.16) {
            const a = Math.PI * va;
            ctx.beginPath();
            ctx.moveTo(midX + Math.cos(a) * (archR - 3.5), railY + 14 + archR + Math.sin(a) * (archR - 3.5));
            ctx.lineTo(midX + Math.cos(a) * (archR + 3.5), railY + 14 + archR + Math.sin(a) * (archR + 3.5));
            ctx.stroke();
          }
        }
      }
      // Viaduct deck girder + wooden sleepers + steel running rails + TOOTHED ABT COGWHEEL RACK RAIL!
      ctx.fillStyle = '#334155'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.5;
      ctx.fillRect(trackL - 10, railY + 2, trackW + 20, 10);
      ctx.strokeRect(trackL - 10, railY + 2, trackW + 20, 10);
      ctx.fillStyle = '#f8fafc'; ctx.fillRect(trackL - 10, railY, trackW + 20, 2.5);
      ctx.fillStyle = '#fbbf24';
      for (let rx = trackL; rx < trackR; rx += 8) {
        ctx.fillRect(rx, railY - 2.2, 4, 2.5);
      }
      ctx.restore();

      ctx.save();
      ctx.translate(px, py);
      // Warm alpine headlight beam
      const headX = dir >= 0 ? p.w - 3 : 3;
      const beamG = ctx.createLinearGradient(headX, 39, headX + dir * 74, 39);
      beamG.addColorStop(0, 'rgba(254, 240, 138, 0.52)');
      beamG.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = beamG;
      ctx.beginPath();
      ctx.moveTo(headX, 34); ctx.lineTo(headX + dir * 74, 20); ctx.lineTo(headX + dir * 74, 57); ctx.lineTo(headX, 44);
      ctx.closePath(); ctx.fill();

      // Compact low-profile roof insulators & folded pantograph strip (walkable roof stays clear!)
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(p.w * 0.5 - 22, -3.5, 44, 3.5);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(p.w * 0.5 - 26, -2.5, 6, 2.5);
      ctx.fillRect(p.w * 0.5 + 20, -2.5, 6, 2.5);

      // Walkable pearl-white aerodynamic coach roof + panoramic curved skylight windows!
      ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.roundRect(2, 0, p.w - 4, 11, [7, 7, 0, 0]); ctx.fill(); ctx.stroke();

      const trG = ctx.createLinearGradient(0, 10, 0, 50);
      trG.addColorStop(0, '#ef4444'); trG.addColorStop(0.55, '#dc2626'); trG.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = trG;
      ctx.beginPath(); ctx.roundRect(4, 10, p.w - 8, 40, [0, 0, 5, 5]); ctx.fill(); ctx.stroke();
      // Signature white Glacier Express cheatline + Swiss cross flank
      ctx.fillStyle = '#ffffff'; ctx.fillRect(6, 32.5, p.w - 12, 4.5);

      // Wrap-around curved skyline panoramic windows with red headrest seats!
      for (let wx = 13; wx < p.w - 28; wx += 27) {
        const wG = ctx.createLinearGradient(wx, 5, wx, 30);
        wG.addColorStop(0, '#e0f2fe'); wG.addColorStop(0.48, '#7dd3fc'); wG.addColorStop(1, '#0284c7');
        ctx.fillStyle = wG; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.35;
        ctx.beginPath(); ctx.roundRect(wx, 5.5, 22, 24.5, [6, 6, 2, 2]); ctx.fill(); ctx.stroke();
        // Interior plush seat headrest
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(wx + 4, 23, 5, 6);
        ctx.fillRect(wx + 13, 23, 5, 6);
        ctx.strokeStyle = 'rgba(255,255,255,0.68)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(wx + 4, 26); ctx.lineTo(wx + 12, 9); ctx.stroke();
      }
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 7.5px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('✚ GLACIER EXPRESS ✚', p.w * 0.5, 45.5);

      // Underframe bogies + snowplow cowcatchers + SPINNING BRASS COGWHEEL GEAR!
      ctx.fillStyle = '#1e293b'; ctx.fillRect(14, 49, p.w - 28, 5);
      // Angled snowplows at both ends
      ctx.fillStyle = '#475569';
      ctx.beginPath(); ctx.moveTo(14, 49); ctx.lineTo(4, 55); ctx.lineTo(16, 55); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(p.w - 14, 49); ctx.lineTo(p.w - 4, 55); ctx.lineTo(p.w - 16, 55); ctx.closePath(); ctx.fill();

      // Center spinning brass Abt cogwheel engaging rack teeth!
      ctx.save();
      ctx.translate(p.w * 0.5, 52.5);
      ctx.rotate(wheelRot * 1.4);
      ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let cg = 0; cg < 8; cg++) {
        const a1 = (cg * Math.PI) / 4;
        const a2 = a1 + Math.PI / 8;
        if (cg === 0) ctx.moveTo(Math.cos(a1) * 6.5, Math.sin(a1) * 6.5);
        else ctx.lineTo(Math.cos(a1) * 6.5, Math.sin(a1) * 6.5);
        ctx.lineTo(Math.cos(a2) * 4.2, Math.sin(a2) * 4.2);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();

      for (const bx of [28, 48, p.w - 48, p.w - 28]) {
        ctx.save();
        ctx.translate(bx, 52.5);
        ctx.rotate(wheelRot);
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-3.6, 0); ctx.lineTo(3.6, 0); ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = '#fef08a'; ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.arc(headX, 39, 4.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
      return true;
    }

    // 7. ROLLING GIANT EMMENTAL CHEESE WHEEL & ALPINE DAIRY CHALET (Alpkäserei with stone base, smoking chimney, stacked cellar cheeses, copper churns & 3D waxed Emmentaler AOP wheel!)
    if (p.type === 'swiss_cheese_wheel') {
      const floorY = py + p.h;
      const worldOff = (p.x || 0) - px;
      const minScreenX = (p.minX !== undefined ? p.minX : p.x) - worldOff;
      const maxScreenX = (p.maxX !== undefined ? p.maxX : p.x + 280) - worldOff;
      const wheelScreenX = (p.wheelX !== undefined ? p.wheelX : p.x + 60) - worldOff;
      const rad = p.wheelR || 26;
      const wheelScreenY = floorY - rad - (p.wheelHop || 0);

      ctx.save();
      const chuteX = maxScreenX + 12;
      // Stone chimney + gentle woodsmoke puffs on Alpkäserei dairy hut
      ctx.fillStyle = '#64748b'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.3;
      ctx.fillRect(chuteX + 38, floorY - 98, 10, 22);
      ctx.strokeRect(chuteX + 38, floorY - 98, 10, 22);
      for (let sm = 0; sm < 2; sm++) {
        const sf = ((time * 0.7 + sm * 0.5) % 1);
        ctx.fillStyle = `rgba(248, 250, 252, ${(0.55 * (1 - sf)).toFixed(2)})`;
        ctx.beginPath(); ctx.arc(chuteX + 43 + sf * 10, floorY - 102 - sf * 18, 3.5 + sf * 4, 0, Math.PI * 2); ctx.fill();
      }

      // Alpkäserei timber dairy chalet + granite foundation
      const houseG = ctx.createLinearGradient(chuteX, floorY - 78, chuteX + 58, floorY);
      houseG.addColorStop(0, '#d97706'); houseG.addColorStop(0.6, '#92400e'); houseG.addColorStop(1, '#5c2d0c');
      ctx.fillStyle = houseG; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.6;
      ctx.fillRect(chuteX, floorY - 76, 58, 76); ctx.strokeRect(chuteX, floorY - 76, 58, 76);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(chuteX, floorY - 14, 58, 14); ctx.strokeRect(chuteX, floorY - 14, 58, 14);

      // Wood-shingle alpine roof weighted with grey river stones!
      ctx.fillStyle = '#475569'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.moveTo(chuteX - 12, floorY - 74); ctx.lineTo(chuteX + 29, floorY - 102); ctx.lineTo(chuteX + 70, floorY - 74);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      for (const rx of [chuteX + 4, chuteX + 18, chuteX + 38, chuteX + 50]) {
        ctx.beginPath(); ctx.ellipse(rx, floorY - 79 - (rx === chuteX + 18 || rx === chuteX + 38 ? 7 : 1), 3.8, 2.0, 0, 0, Math.PI * 2); ctx.fill();
      }

      // Hanging wrought-iron copper cheese-kettle tavern sign
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(chuteX, floorY - 68); ctx.lineTo(chuteX - 14, floorY - 68); ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(chuteX - 10, floorY - 61, 4.2, 0, Math.PI); ctx.fill();

      // Open arched cellar doorway showing aging cheese shelves inside!
      ctx.fillStyle = '#1c1008';
      ctx.beginPath(); ctx.roundRect(chuteX + 8, floorY - 48, 34, 48, [16, 16, 0, 0]); ctx.fill();
      ctx.fillStyle = '#eab308';
      ctx.beginPath(); ctx.roundRect(chuteX + 13, floorY - 35, 22, 6, 3); ctx.fill();
      ctx.beginPath(); ctx.roundRect(chuteX + 14, floorY - 24, 20, 6, 3); ctx.fill();

      // KÄSEREI plaque + Swiss cross
      ctx.fillStyle = '#7f1d1d'; ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 1.0;
      ctx.fillRect(chuteX + 4, floorY - 68, 50, 13); ctx.strokeRect(chuteX + 4, floorY - 68, 50, 13);
      ctx.fillStyle = '#fef08a'; ctx.font = 'bold 7.5px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('ALPKÄSEREI', chuteX + 29, floorY - 58.5);

      // Pair of polished copper & silver Swiss milk churns (Milchkanne) beside doorway
      ctx.fillStyle = '#d97706'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.roundRect(chuteX + 48, floorY - 25, 13, 25, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fde68a'; ctx.fillRect(chuteX + 51, floorY - 22, 3, 18);
      ctx.fillStyle = '#cbd5e1'; ctx.strokeStyle = '#334155';
      ctx.beginPath(); ctx.roundRect(chuteX + 58, floorY - 20, 11, 20, 3); ctx.fill(); ctx.stroke();

      // Timber cheese-rolling guide rail & left bumper stop-post
      ctx.fillStyle = '#78350f'; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.2;
      ctx.fillRect(minScreenX - 6, floorY - 14, 8, 14); ctx.strokeRect(minScreenX - 6, floorY - 14, 8, 14);
      ctx.fillStyle = '#78350f'; ctx.fillRect(minScreenX, floorY - 5, (maxScreenX - minScreenX) + 16, 5);
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(minScreenX, floorY - 5, (maxScreenX - minScreenX) + 16, 1.5);

      // Rolling Emmentaler AOP Wheel shadow + 3D beveled waxed cheese drum!
      ctx.fillStyle = 'rgba(15,23,42,0.30)';
      ctx.beginPath(); ctx.ellipse(wheelScreenX, floorY - 1, rad * 0.94, 4.8, 0, 0, Math.PI * 2); ctx.fill();

      ctx.save();
      ctx.translate(wheelScreenX, wheelScreenY);
      ctx.rotate(p.wheelRot || 0);
      // Outer red-and-amber waxed Swiss AOP rind band
      const chG = ctx.createRadialGradient(-7, -7, 3, 0, 0, rad);
      chG.addColorStop(0.0, '#fefce8');
      chG.addColorStop(0.55, '#fde047');
      chG.addColorStop(0.84, '#eab308');
      chG.addColorStop(1.0, '#a16207');
      ctx.fillStyle = chG; ctx.strokeStyle = '#991b1b'; ctx.lineWidth = 3.0;
      ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      // Cream inner bevel ring + tiny red AOP Swiss crosses on rim
      ctx.strokeStyle = 'rgba(254, 249, 195, 0.80)'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(0, 0, rad - 3.6, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#dc2626';
      for (let cr = 0; cr < 4; cr++) {
        const ca = (cr * Math.PI) / 2;
        ctx.save();
        ctx.translate(Math.cos(ca) * (rad - 6.5), Math.sin(ca) * (rad - 6.5));
        ctx.fillRect(-2.5, -0.8, 5, 1.6);
        ctx.fillRect(-0.8, -2.5, 1.6, 5);
        ctx.restore();
      }
      // Concave 3D shaded Emmental cheese eyes (Löcher) with inner rim highlight!
      for (const [hx, hy, hr] of [[-9, -7, 4.8], [8, -8, 4.1], [9, 7, 5.0], [-8, 8, 3.9], [0, 0.5, 4.4], [-1, -13, 2.5], [2, 13, 2.6]]) {
        ctx.fillStyle = '#854d0e'; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ca8a04'; ctx.beginPath(); ctx.arc(hx + 0.9, hy + 0.9, hr * 0.76, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fef9c3'; ctx.lineWidth = 0.9;
        ctx.beginPath(); ctx.arc(hx, hy, hr, 0.2, 1.8); ctx.stroke();
      }
      ctx.restore();

      if (p.wedgedTimer > 0) {
        ctx.fillStyle = '#b45309'; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(wheelScreenX - rad - 12, floorY); ctx.lineTo(wheelScreenX - rad + 5, floorY - 14); ctx.lineTo(wheelScreenX - rad + 5, floorY);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fef08a'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('🧀 SAFE!', wheelScreenX, wheelScreenY - rad - 8);
      }
      ctx.restore();
      return true;
    }

    // 8. ORNATE BRIENZ SWISS CUCKOO-CLOCK TOWER (Carved walnut post with climbing ivy, twin hanging cast-iron pinecone weights on chains, gingerbread eaves, shuttered windows, double cuckoo doors & multi-colored bird!)
    if (p.type === 'swiss_cuckoo_clock') {
      const cx = px + p.w * 0.5;
      const ay = py;
      const len = p.chainLen || 156;
      const ang = p.pendulumAngle || 0;
      const bx = cx + Math.sin(ang) * len;
      const by = ay + 12 + Math.cos(ang) * len;
      const groundScreenY = ay + Math.max(180, 615 - (p.y || 376));

      ctx.save();
      // Carved walnut pedestal post + climbing green ivy vine + stepped granite plinth
      const postG = ctx.createLinearGradient(cx - 10, 0, cx + 10, 0);
      postG.addColorStop(0, '#b45309'); postG.addColorStop(0.5, '#78350f'); postG.addColorStop(1, '#3b1b06');
      ctx.fillStyle = postG; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.6;
      ctx.fillRect(cx - 10, ay + 10, 20, groundScreenY - (ay + 10));
      ctx.strokeRect(cx - 10, ay + 10, 20, groundScreenY - (ay + 10));
      // Climbing ivy spiral on clock post
      ctx.strokeStyle = '#15803d'; ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let vy = ay + 24; vy < groundScreenY - 22; vy += 18) {
        const vxOff = Math.sin(vy * 0.08) * 7;
        if (vy === ay + 24) ctx.moveTo(cx + vxOff, vy);
        else ctx.lineTo(cx + vxOff, vy);
      }
      ctx.stroke();
      ctx.fillStyle = '#22c55e';
      for (let vy = ay + 32; vy < groundScreenY - 26; vy += 26) {
        const vxOff = Math.sin(vy * 0.08) * 7;
        ctx.beginPath(); ctx.ellipse(cx + vxOff + 3, vy, 3.6, 2.0, 0.4, 0, Math.PI * 2); ctx.fill();
      }
      // Stepped granite base plinth
      ctx.fillStyle = '#94a3b8'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.5;
      ctx.fillRect(cx - 24, groundScreenY - 16, 48, 16);
      ctx.strokeRect(cx - 24, groundScreenY - 16, 48, 16);
      ctx.fillStyle = '#e2e8f0'; ctx.fillRect(cx - 22, groundScreenY - 14, 44, 3);

      // Twin traditional cast-iron pinecone clock weights hanging on brass chains!
      for (const [wxOff, wLen] of [[-21, 58 + Math.sin(time * 0.8) * 6], [21, 74 - Math.sin(time * 0.8) * 6]]) {
        ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1.3;
        ctx.setLineDash([2.5, 2]);
        ctx.beginPath(); ctx.moveTo(cx + wxOff, ay + 12); ctx.lineTo(cx + wxOff, ay + 12 + wLen); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#475569'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(cx + wxOff, ay + 18 + wLen, 4.5, 8.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }

      // Ornate Brienz carved walnut chalet clock-case + side green-shuttered windows!
      const boxG = ctx.createLinearGradient(cx - 38, ay - 50, cx + 38, ay + 14);
      boxG.addColorStop(0, '#b45309'); boxG.addColorStop(0.5, '#78350f'); boxG.addColorStop(1, '#451a03');
      ctx.fillStyle = boxG; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.roundRect(cx - 38, ay - 50, 76, 64, 5); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.2;
      ctx.strokeRect(cx - 33, ay - 45, 66, 54);
      // Tiny green chalet shutters & red geraniums flanking dial
      for (const sxOff of [-28, 20]) {
        ctx.fillStyle = '#15803d';
        ctx.fillRect(cx + sxOff, ay - 22, 8, 14);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(cx + sxOff + 4, ay - 7, 2.3, 0, Math.PI * 2); ctx.fill();
      }

      // Steep carved chalet gable roof + scalloped gingerbread lace + carved oak-leaf crest!
      ctx.fillStyle = '#991b1b'; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(cx - 50, ay - 44); ctx.lineTo(cx, ay - 78); ctx.lineTo(cx + 50, ay - 44); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#fef3c7'; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(cx - 45, ay - 46); ctx.lineTo(cx, ay - 73); ctx.lineTo(cx + 45, ay - 46); ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath(); ctx.arc(cx, ay - 79, 3.6, 0, Math.PI * 2); ctx.fill();

      // Cream enamel Roman-style dial + ornate brass bezel + filigree hands
      ctx.fillStyle = '#fefce8'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(cx, ay - 10, 14.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#1c1917';
      for (let hr = 0; hr < 12; hr++) {
        const a = (hr * Math.PI) / 6;
        ctx.beginPath(); ctx.arc(cx + Math.cos(a) * 11, ay - 10 + Math.sin(a) * 11, hr % 3 === 0 ? 1.4 : 0.75, 0, Math.PI * 2); ctx.fill();
      }
      ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.moveTo(cx, ay - 10); ctx.lineTo(cx + Math.cos(time * 2.2) * 9.5, ay - 10 + Math.sin(time * 2.2) * 9.5);
      ctx.moveTo(cx, ay - 10); ctx.lineTo(cx + Math.cos(time * 0.35) * 6.5, ay - 10 + Math.sin(time * 0.35) * 6.5);
      ctx.stroke();

      // Arched Cuckoo Loft + Swinging Double Doors + Walkable Carved Perch + Detailed Cuckoo Bird!
      const pop = p.cuckooOut || 0;
      ctx.fillStyle = '#1c1008';
      ctx.beginPath(); ctx.roundRect(cx - 11, ay - 45, 22, 16, [8, 8, 0, 0]); ctx.fill();
      // Hinged little wooden doors (open outward as pop increases!)
      const doorOpen = Math.max(2, pop * 7);
      ctx.fillStyle = '#d97706'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.0;
      ctx.fillRect(cx - 11 - doorOpen, ay - 43, 6, 14); ctx.strokeRect(cx - 11 - doorOpen, ay - 43, 6, 14);
      ctx.fillRect(cx + 5 + doorOpen, ay - 43, 6, 14); ctx.strokeRect(cx + 5 + doorOpen, ay - 43, 6, 14);

      if (pop > 0.15) {
        const perchW = 84 * pop;
        const pG = ctx.createLinearGradient(0, ay - 29, 0, ay - 20);
        pG.addColorStop(0, '#fde047'); pG.addColorStop(0.5, '#d97706'); pG.addColorStop(1, '#78350f');
        ctx.fillStyle = pG; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.roundRect(cx - perchW * 0.5, ay - 29, perchW, 9.5, 3); ctx.fill(); ctx.stroke();
        // Accordion brass bellows scissor-brace under perch
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(cx - perchW * 0.35, ay - 20); ctx.lineTo(cx, ay - 29); ctx.lineTo(cx + perchW * 0.35, ay - 20);
        ctx.stroke();

        // Sculpted Alpine Cuckoo Bird (slate-blue plumage, barred white breast, fanned tail, flapping wing, open yellow beak!)
        const wFlap = Math.sin(time * 16) * 4.5;
        ctx.save();
        ctx.translate(cx, ay - 36);
        ctx.scale(pop, 1);
        // Fanned white-spotted tail
        ctx.fillStyle = '#0369a1';
        ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(-15, -5); ctx.lineTo(-13, 3); ctx.closePath(); ctx.fill();
        // Plump bird body + cream barred breast
        ctx.fillStyle = '#0284c7'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.ellipse(0, 0, 9.0, 5.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath(); ctx.ellipse(3, 2, 5.5, 3.2, 0, 0, Math.PI * 2); ctx.fill();
        // Flapping wing
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.moveTo(-1, -1); ctx.lineTo(-9, -8 + wFlap); ctx.lineTo(-4, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
        // Head + eye + open singing yellow beak
        ctx.fillStyle = '#0284c7';
        ctx.beginPath(); ctx.arc(7, -3.5, 4.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(10, -5); ctx.lineTo(16, -6.2); ctx.lineTo(11, -3.2);
        ctx.moveTo(10, -3.2); ctx.lineTo(15.5, -1.5); ctx.lineTo(10, -1.8);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(8, -4.2, 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(8.3, -4.2, 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Gleaming brass pendulum rod + 3D imbricated pinecone/oak-leaf bob!
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3.2;
      ctx.beginPath(); ctx.moveTo(cx, ay + 12); ctx.lineTo(bx, by); ctx.stroke();

      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(-ang);
      // Carved green oak-leaf crown atop brass pinecone bob
      ctx.fillStyle = '#16a34a'; ctx.strokeStyle = '#14532d'; ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.ellipse(-5, -18, 5, 2.8, -0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(5, -18, 5, 2.8, 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      const pcG = ctx.createRadialGradient(-4, -5, 2, 0, 0, 21);
      pcG.addColorStop(0, '#fef9c3'); pcG.addColorStop(0.45, '#f59e0b'); pcG.addColorStop(1, '#78350f');
      ctx.fillStyle = pcG; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.ellipse(0, 0, 15, 20, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(69,26,3,0.52)'; ctx.lineWidth = 1.15;
      for (let sy = -12; sy <= 12; sy += 5) {
        ctx.beginPath(); ctx.arc(-3, sy, 6, 0.2, Math.PI - 0.2); ctx.stroke();
        ctx.beginPath(); ctx.arc(3, sy + 2, 6, 0.2, Math.PI - 0.2); ctx.stroke();
      }
      ctx.restore();
      ctx.restore();
      return true;
    }

    // 9. GLACIAL WATERFALL HYDRO-MILL WHEEL (Stepped ashlar pier with arched tailrace, timber trestle flume, frothing waterfall + mist, bolted double-rim oak wheel & dripping mossy buckets!)
    if (p.type === 'swiss_waterwheel_mill') {
      const r = p.radius || 104;
      const ang0 = p.wheelAngle || 0;
      const pierH = Math.max(120, 720 - py);
      ctx.save();

      // Stepped granite ashlar mill pier + arched tailrace tunnel at base
      const pierG = ctx.createLinearGradient(px - 24, 0, px + 24, 0);
      pierG.addColorStop(0, '#e2e8f0'); pierG.addColorStop(0.5, '#94a3b8'); pierG.addColorStop(1, '#475569');
      ctx.fillStyle = pierG; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.6;
      ctx.fillRect(px - 24, py - 14, 48, pierH);
      ctx.strokeRect(px - 24, py - 14, 48, pierH);
      ctx.strokeStyle = 'rgba(30,41,59,0.28)'; ctx.lineWidth = 1.0;
      for (let my = py + 4; my < py + pierH; my += 16) {
        ctx.beginPath(); ctx.moveTo(px - 24, my); ctx.lineTo(px + 24, my); ctx.stroke();
      }
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.roundRect(px - 13, py + 58, 26, 44, [13, 13, 0, 0]); ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath(); ctx.ellipse(px - 18, py - 13, 6, 2.2, 0, 0, Math.PI * 2); ctx.fill();

      // Overhead timber trestle aqueduct flume + multi-layered glacial cascade + mist halo!
      ctx.strokeStyle = '#5c2d0c'; ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.moveTo(px - r - 22, py - r - 13); ctx.lineTo(px - r - 22, py - r + 18);
      ctx.moveTo(px - r + 8, py - r - 13); ctx.lineTo(px - r - 22, py - r + 10);
      ctx.stroke();
      const flG = ctx.createLinearGradient(0, py - r - 27, 0, py - r - 13);
      flG.addColorStop(0, '#b45309'); flG.addColorStop(1, '#5c2d0c');
      ctx.fillStyle = flG; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.5;
      ctx.fillRect(px - r - 34, py - r - 26, r + 24, 13);
      ctx.strokeRect(px - r - 34, py - r - 26, r + 24, 13);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(px - r - 32, py - r - 28, r + 20, 3);

      // Pouring turquoise & whitewater cascade onto top paddles
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.72)'; ctx.lineWidth = 10.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(px - 13, py - r - 15); ctx.quadraticCurveTo(px + 3, py - r, px + 11, py - r + 32); ctx.stroke();
      ctx.strokeStyle = 'rgba(240, 249, 255, 0.94)'; ctx.lineWidth = 5.2;
      ctx.beginPath(); ctx.moveTo(px - 13, py - r - 15); ctx.quadraticCurveTo(px + 2, py - r + 1, px + 10 + Math.sin(time * 12) * 2, py - r + 30); ctx.stroke();
      for (let d = 0; d < 5; d++) {
        const df = ((time * 2.6 + d * 0.2) % 1);
        ctx.fillStyle = `rgba(240, 249, 255, ${(0.9 * (1 - df * 0.5)).toFixed(2)})`;
        ctx.beginPath(); ctx.arc(px + 4 + df * 15, py - r + 6 + df * 28, 3.0 * (1 - df * 0.35), 0, Math.PI * 2); ctx.fill();
      }

      // Rotating double-rimmed oak mill wheel with 8 radial spokes, iron gussets & brass governor gear!
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(ang0);
      ctx.strokeStyle = '#5c2d0c'; ctx.lineWidth = 10.5;
      ctx.beginPath(); ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#92400e'; ctx.lineWidth = 4.0;
      ctx.beginPath(); ctx.arc(0, 0, r * 0.60, 0, Math.PI * 2); ctx.stroke();

      // Bolt rivets around outer oak rim
      ctx.fillStyle = '#cbd5e1';
      for (let rv = 0; rv < 12; rv++) {
        const ra = (rv * Math.PI) / 6;
        ctx.beginPath(); ctx.arc(Math.cos(ra) * r * 0.85, Math.sin(ra) * r * 0.85, 1.7, 0, Math.PI * 2); ctx.fill();
      }

      ctx.strokeStyle = '#451a03'; ctx.lineWidth = 5.0;
      for (let sp = 0; sp < 4; sp++) {
        const a = (sp * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(-Math.cos(a) * r * 0.85, -Math.sin(a) * r * 0.85);
        ctx.lineTo(Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85);
        ctx.stroke();
      }
      // Central forged iron flange + brass hubcap
      ctx.fillStyle = '#334155'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(0, 0, 19, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Walkable oak bucket-paddles with iron straps, wet sheen, moss & live dripping water!
      if (p.blades) {
        const camOffX = p.x - px;
        const camOffY = p.y - py;
        for (let bi = 0; bi < p.blades.length; bi++) {
          const b = p.blades[bi];
          const bx = b.x - camOffX;
          const by = b.y - camOffY;
          // Bucket trough underside
          ctx.fillStyle = '#3b1b06';
          ctx.beginPath();
          ctx.moveTo(bx + 6, by + b.h);
          ctx.lineTo(bx + 14, by + b.h + 6);
          ctx.lineTo(bx + b.w - 14, by + b.h + 6);
          ctx.lineTo(bx + b.w - 6, by + b.h);
          ctx.closePath();
          ctx.fill();

          const pG = ctx.createLinearGradient(bx, by, bx, by + b.h);
          pG.addColorStop(0, '#fbbf24'); pG.addColorStop(0.45, '#b45309'); pG.addColorStop(1, '#451a03');
          ctx.fillStyle = pG; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.roundRect(bx, by, b.w, b.h, 3); ctx.fill(); ctx.stroke();
          // Forged iron straps + rivets
          ctx.fillStyle = '#334155';
          ctx.fillRect(bx + 10, by, 3.5, b.h);
          ctx.fillRect(bx + b.w - 13.5, by, 3.5, b.h);
          // Wet glacial sheen + emerald moss strip
          ctx.fillStyle = '#7dd3fc';
          ctx.fillRect(bx + 15, by + 1, b.w - 30, 2.2);
          ctx.fillStyle = '#4ade80';
          ctx.fillRect(bx + 3, by + 1, 7, 3);
          // Live dripping water droplets beneath each paddle
          const dropOff = ((time * 3.2 + bi * 0.37) % 1);
          ctx.fillStyle = `rgba(186, 230, 253, ${(0.85 * (1 - dropOff)).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(bx + 24 + (bi % 2) * 32, by + b.h + 3 + dropOff * 16, 2.0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      return true;
    }

    // 10. SWISS ALPHORN HERDER & RESONANT GOLDEN ACOUSTIC UPDRAFT RINGS (Full anatomical Appenzell Senn herder in embroidered waistcoat, silver Göller chain, birch-wrapped 3.5m spruce Alphorn on wooden trestle peg & floral bell!)
    if (p.type === 'swiss_alphorn_gust') {
      const floorY = py + p.h;
      const cx = px + p.w * 0.5;
      ctx.save();
      ctx.translate(cx, floorY);

      // Resonant golden acoustic updraft column + harmonic rings + floating notes!
      if (p.hornActive) {
        const maxH = p.boostTimer > 0 ? 255 : 225;
        const colG = ctx.createLinearGradient(10, -44, 10, -44 - maxH);
        colG.addColorStop(0.0, 'rgba(254, 240, 138, 0.48)');
        colG.addColorStop(0.65, 'rgba(251, 191, 36, 0.20)');
        colG.addColorStop(1.0, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = colG;
        ctx.beginPath();
        ctx.moveTo(-8, -42); ctx.lineTo(-34, -44 - maxH); ctx.lineTo(48, -44 - maxH); ctx.lineTo(24, -42);
        ctx.closePath(); ctx.fill();

        for (let k = 0; k < 6; k++) {
          const frac = ((time * 1.45 + k / 6) % 1);
          const ry = -44 - frac * maxH;
          const rw = 14 + frac * 28;
          ctx.strokeStyle = `rgba(254, 240, 138, ${((1 - frac) * 0.94).toFixed(2)})`;
          ctx.lineWidth = 2.8;
          ctx.beginPath(); ctx.ellipse(8, ry, rw, 5.5 + frac * 4, 0, 0, Math.PI * 2); ctx.stroke();
          if (k % 2 === 0) {
            ctx.fillStyle = `rgba(254, 249, 195, ${((1 - frac) * 0.96).toFixed(2)})`;
            ctx.font = 'bold 13px sans-serif';
            ctx.fillText(k === 0 ? '♫' : '♪', 8 + (k === 2 ? -1 : 1) * (13 + frac * 14), ry);
          }
        }
      } else if (p.hornWarn) {
        const pulse = 0.5 + 0.5 * Math.sin(time * 18);
        ctx.strokeStyle = `rgba(253, 224, 71, ${(0.45 + pulse * 0.45).toFixed(2)})`;
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.ellipse(8, -42 - pulse * 10, 16, 6, 0, 0, Math.PI * 2); ctx.stroke();
      }

      // Pegged spruce musician platform stage
      const stG = ctx.createLinearGradient(0, -11, 0, 0);
      stG.addColorStop(0, '#b45309'); stG.addColorStop(1, '#5c2d0c');
      ctx.fillStyle = stG; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(-42, -10, 84, 10, [3, 3, 0, 0]); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fde68a'; ctx.fillRect(-40, -9, 80, 2);

      // Full Anatomical Swiss Alphornbläser (Appenzell Senn Herder)
      const breath = p.hornActive ? 1.8 : Math.sin(time * 3) * 0.7;
      // Buckled alpine leather shoes + white wool stockings + dark breeches
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.ellipse(-30, -11.5, 5.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(-20, -11.5, 5.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-32, -21, 5, 9); ctx.fillRect(-23, -21, 5, 9);
      ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.roundRect(-33, -35, 16, 15, 3); ctx.fill(); ctx.stroke();

      // Puffed white linen shirt sleeves + Scarlet embroidered Appenzell waistcoat + Silver chain!
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.0;
      ctx.beginPath(); ctx.ellipse(-34, -48, 5.5, 6.5, 0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      const vstG = ctx.createLinearGradient(-34, -58, -16, -34);
      vstG.addColorStop(0, '#ef4444'); vstG.addColorStop(1, '#991b1b');
      ctx.fillStyle = vstG; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.roundRect(-33, -57, 18 + breath * 0.5, 23, 4); ctx.fill(); ctx.stroke();
      // Embroidered gold suspenders + silver buttons + watch chain
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-30, -56, 3, 21); ctx.fillRect(-21, -56, 3, 21);
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(-30, -46); ctx.quadraticCurveTo(-24, -41, -19, -46); ctx.stroke();

      // Expressive shaded head: rosy puffed cheeks, twirled mustache, eyes & feathered Sennenhut!
      ctx.fillStyle = '#fde2cc'; ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.arc(-24, -65, 7.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fca5a5';
      ctx.beginPath(); ctx.arc(-20.5, -63.5, 2.2 + breath * 0.35, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(-21.5, -66.5, 1.2, 0, Math.PI * 2); ctx.fill();
      // Brown handlebar mustache
      ctx.strokeStyle = '#5c2d0c'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(-22, -62); ctx.quadraticCurveTo(-18, -61, -16.5, -63); ctx.stroke();
      // Traditional black/green felt alpine hat + floral ribbon + eagle feather
      ctx.fillStyle = '#14532d'; ctx.strokeStyle = '#052e16'; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.ellipse(-24, -71, 13, 3.2, -0.08, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(-24, -71.5, 7.2, Math.PI, 0); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2.0;
      ctx.beginPath(); ctx.moveTo(-31, -72); ctx.lineTo(-17, -72); ctx.stroke();
      ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(-19, -74); ctx.quadraticCurveTo(-12, -83, -16, -87); ctx.stroke();

      // Articulated arm & hand gripping the spruce Alphorn near ivory mouthpiece
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4.2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-26, -51); ctx.lineTo(-15, -56); ctx.stroke();
      ctx.fillStyle = '#fde2cc';
      ctx.beginPath(); ctx.arc(-14, -56.5, 2.6, 0, Math.PI * 2); ctx.fill();

      // Wooden forked trestle support peg holding the Alphorn above the stage
      ctx.strokeStyle = '#78350f'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(-3, -10); ctx.lineTo(-3, -24); ctx.stroke();

      // 3.5m Hand-Crafted Spruce Alphorn with Birch-Bark Wrapping Rings & Painted Bell!
      ctx.strokeStyle = '#291509'; ctx.lineWidth = 7.6; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-17, -62);
      ctx.bezierCurveTo(-6, -42, 0, -20, 9, -20);
      ctx.quadraticCurveTo(15, -20, 10, -36);
      ctx.stroke();
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 5.2;
      ctx.stroke();
      // Decorative dark birch-bark binding rings along horn tube
      ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.6;
      for (const [bx0, by0] of [[-12, -52], [-7, -39], [-2, -26], [4, -20]]) {
        ctx.beginPath(); ctx.arc(bx0, by0, 3.0, 0, Math.PI * 2); ctx.stroke();
      }
      // Flared upturned wooden Alphorn bell with Swiss cross & Edelweiss rim!
      ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.ellipse(9, -38, 13.5, 6.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#991b1b';
      ctx.beginPath(); ctx.ellipse(9, -38, 9.0, 3.8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(7.5, -34.5, 3, 1.2); ctx.fillRect(8.4, -35.4, 1.2, 3);
      ctx.restore();
      return true;
    }

    // 11. SWISS FONDUE CAULDRON & STRETCHING CHEESE-BRIDGE (Gingham-draped chalet table, copper Rechaud spirit burner, glazed Caquelon with Swiss & ibex frieze, crossed fondue forks & braided cheese arch!)
    if (p.type === 'swiss_fondue_cauldron') {
      const floorY = py + p.h;
      const cx = px + p.w * 0.5;
      const chilled = (p.bridgeTimer || 0) > 0;
      ctx.save();
      ctx.translate(cx, floorY);

      // Ground shadow
      ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
      ctx.beginPath(); ctx.ellipse(0, 0, 38, 4.5, 0, 0, Math.PI * 2); ctx.fill();

      // Carved chalet trestle table + red-and-white Swiss gingham cloth trim!
      ctx.fillStyle = '#5c2d0c'; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.5;
      ctx.fillRect(-29, -15, 8, 15); ctx.strokeRect(-29, -15, 8, 15);
      ctx.fillRect(21, -15, 8, 15); ctx.strokeRect(21, -15, 8, 15);
      ctx.fillRect(-25, -9, 50, 3.5);
      ctx.fillStyle = '#92400e';
      ctx.beginPath(); ctx.roundRect(-38, -23, 76, 9, 2); ctx.fill(); ctx.stroke();
      // Red & white gingham tablecloth runner
      for (let gx = -34; gx <= 28; gx += 6) {
        ctx.fillStyle = ((gx + 34) / 6) % 2 === 0 ? '#dc2626' : '#ffffff';
        ctx.fillRect(gx, -22, 6, 4.5);
      }

      // Wrought-iron & hammered copper Rechaud burner stand + spirit flame
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-18, -23); ctx.lineTo(-14, -31);
      ctx.moveTo(18, -23); ctx.lineTo(14, -31);
      ctx.moveTo(-20, -29); ctx.lineTo(20, -29);
      ctx.stroke();
      ctx.fillStyle = '#d97706'; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.roundRect(-9, -27, 18, 4, 2); ctx.fill(); ctx.stroke();

      if (!chilled) {
        const fl = Math.sin(time * 18) * 2.5;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.78)';
        ctx.beginPath(); ctx.ellipse(0, -29, 12, 4.5 + fl * 0.25, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.ellipse(0, -30.5, 6.5, 3.5 + fl * 0.35, 0, 0, Math.PI * 2); ctx.fill();
      }

      // Two long fondue forks dipping into the pot with toasted bread cubes!
      ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-8, -54); ctx.lineTo(-24, -71);
      ctx.moveTo(8, -54); ctx.lineTo(23, -70);
      ctx.stroke();
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(-21, -68); ctx.lineTo(-26, -73);
      ctx.moveTo(20, -67); ctx.lineTo(25, -72);
      ctx.stroke();
      // Golden crusty bread cube on side plate
      ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.0;
      ctx.fillRect(26, -28, 7, 5.5); ctx.strokeRect(26, -28, 7, 5.5);

      // Glazed crimson earthenware Caquelon pot + turned wooden handle + white Swiss folk frieze!
      ctx.strokeStyle = '#92400e'; ctx.lineWidth = 5.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-26, -45); ctx.lineTo(-43, -49); ctx.stroke();
      ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(-39, -50.5); ctx.lineTo(-39, -46); ctx.stroke();

      const potG = ctx.createLinearGradient(-28, -55, 28, -29);
      potG.addColorStop(0, '#ef4444'); potG.addColorStop(0.45, '#dc2626'); potG.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = potG; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.roundRect(-28, -55, 56, 26, [4, 4, 14, 14]); ctx.fill(); ctx.stroke();
      // Specular ceramic glaze highlight + Swiss cross & folk dots
      ctx.strokeStyle = 'rgba(255,255,255,0.38)'; ctx.lineWidth = 2.0;
      ctx.beginPath(); ctx.moveTo(-22, -51); ctx.lineTo(-22, -35); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-5.5, -43.5, 11, 3.2); ctx.fillRect(-1.6, -47.4, 3.2, 11);
      for (const dx0 of [-16, 16]) {
        ctx.beginPath(); ctx.arc(dx0, -42, 2.0, 0, Math.PI * 2); ctx.fill();
      }

      // Glossy golden Gruyère & Vacherin melted cheese pool at rim
      const chPool = ctx.createRadialGradient(-4, -55, 2, 0, -55, 25);
      chPool.addColorStop(0, '#fefce8'); chPool.addColorStop(0.65, '#fde047'); chPool.addColorStop(1, '#ca8a04');
      ctx.fillStyle = chPool;
      ctx.beginPath(); ctx.ellipse(0, -55, 25, 5.8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#a16207'; ctx.lineWidth = 1.3; ctx.stroke();

      if (chilled) {
        const bW = p.bridgeW || 138;
        const bY = -108;
        // Stretchy golden cheese strands supporting the solidified arch bridge!
        ctx.strokeStyle = '#eab308'; ctx.lineWidth = 6.5; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-14, -55); ctx.quadraticCurveTo(-28, -84, -bW * 0.42, bY + 7);
        ctx.moveTo(0, -55); ctx.lineTo(0, bY + 8);
        ctx.moveTo(14, -55); ctx.quadraticCurveTo(28, -84, bW * 0.42, bY + 7);
        ctx.stroke();
        ctx.strokeStyle = '#fef9c3'; ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(-14, -55); ctx.quadraticCurveTo(-28, -84, -bW * 0.42, bY + 7);
        ctx.moveTo(14, -55); ctx.quadraticCurveTo(28, -84, bW * 0.42, bY + 7);
        ctx.stroke();

        const brG = ctx.createLinearGradient(0, bY, 0, bY + 14);
        brG.addColorStop(0, '#fefce8'); brG.addColorStop(0.5, '#fde047'); brG.addColorStop(1, '#ca8a04');
        ctx.fillStyle = brG; ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.roundRect(-bW * 0.5, bY, bW, 14, 7); ctx.fill(); ctx.stroke();
        // Braided cheese-crust texture & holes along bridge deck
        ctx.fillStyle = '#a16207';
        for (let hx = -bW * 0.36; hx <= bW * 0.36; hx += 22) {
          ctx.beginPath(); ctx.ellipse(hx, bY + 7, 3.5, 2.0, 0, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#fef08a'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('🫕 BRIDGE!', 0, bY - 6);
      } else if (p.fondueErupting) {
        const plumeH = 92 + Math.sin(time * 16) * 8;
        const plG = ctx.createLinearGradient(0, -55, 0, -55 - plumeH);
        plG.addColorStop(0, '#f59e0b'); plG.addColorStop(0.55, '#fde047'); plG.addColorStop(1, '#fefce8');
        ctx.fillStyle = plG;
        ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-16, -55);
        ctx.quadraticCurveTo(-24, -55 - plumeH * 0.62, 0, -55 - plumeH);
        ctx.quadraticCurveTo(24, -55 - plumeH * 0.62, 16, -55);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        for (let b = 0; b < 5; b++) {
          const bx0 = Math.sin(time * 9 + b * 1.6) * 20;
          const by0 = -64 - ((time * 88 + b * 22) % plumeH);
          ctx.fillStyle = '#fef9c3'; ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1.0;
          ctx.beginPath(); ctx.arc(bx0, by0, 4.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }
      } else if (p.fondueWarn) {
        for (let b = 0; b < 4; b++) {
          const br = 3 + ((time * 8 + b) % 4.2);
          ctx.fillStyle = '#fef9c3'; ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = 1.1;
          ctx.beginPath(); ctx.arc(-12 + b * 8, -58 - br * 1.5, br, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }
      }
      ctx.restore();
      return true;
    }

    // 12. SWISS AVALANCHE COWBELL ARCH & SNOW CORNICE (Granite plinths, chamfered larch portal, pitched roof with snow cornice & icicles, embroidered Treichel strap, hammered bronze cowbell & faceted snow-boulders!)
    if (p.type === 'swiss_avalanche_bell') {
      const floorY = py + p.h;
      const cx = px + p.w * 0.5;
      const archH = p.archH || 172;
      const topY = floorY - archH;
      const bellSwing = p.bellSwing || 0;
      ctx.save();

      // Granite boulder base plinths anchoring timber posts
      for (const postX of [px + 12, px + p.w - 12]) {
        ctx.fillStyle = '#94a3b8'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(postX - 11, floorY - 16, 22, 16, [4, 4, 1, 1]); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e2e8f0'; ctx.fillRect(postX - 9, floorY - 14, 18, 2.5);
      }

      // Heavy chamfered larch timber uprights + diagonal knee braces + crossbeam
      const timG = ctx.createLinearGradient(px, 0, px + p.w, 0);
      timG.addColorStop(0, '#b45309'); timG.addColorStop(0.5, '#78350f'); timG.addColorStop(1, '#451a03');
      ctx.fillStyle = timG; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.6;
      ctx.fillRect(px + 5, topY, 14, archH - 15); ctx.strokeRect(px + 5, topY, 14, archH - 15);
      ctx.fillRect(px + p.w - 19, topY, 14, archH - 15); ctx.strokeRect(px + p.w - 19, topY, 14, archH - 15);
      // Diagonal timber braces + iron gussets
      ctx.strokeStyle = '#5c2d0c'; ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(px + 18, topY + 26); ctx.lineTo(px + 38, topY + 2);
      ctx.moveTo(px + p.w - 18, topY + 26); ctx.lineTo(px + p.w - 38, topY + 2);
      ctx.stroke();
      ctx.fillStyle = '#78350f'; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.roundRect(px - 4, topY - 14, p.w + 8, 16, 3); ctx.fill(); ctx.stroke();

      // Pitched wood-shingle canopy + sculpted overhanging snowdrift cornice + translucent icicles!
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(px - 10, topY - 12); ctx.lineTo(cx, topY - 30); ctx.lineTo(px + p.w + 10, topY - 12);
      ctx.closePath(); ctx.fill(); ctx.stroke();

      const snowG = ctx.createLinearGradient(0, topY - 34, 0, topY - 8);
      snowG.addColorStop(0, '#ffffff'); snowG.addColorStop(0.65, '#e0f2fe'); snowG.addColorStop(1, '#7dd3fc');
      ctx.fillStyle = snowG; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(px - 12, topY - 11);
      ctx.quadraticCurveTo(cx - 28, topY - 36, cx, topY - 33);
      ctx.quadraticCurveTo(cx + 28, topY - 36, px + p.w + 12, topY - 11);
      ctx.quadraticCurveTo(cx, topY - 6, px - 12, topY - 11);
      ctx.closePath(); ctx.fill(); ctx.stroke();

      // Translucent crystalline icicles hanging along eaves
      ctx.fillStyle = 'rgba(224, 242, 254, 0.90)';
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 0.9;
      for (let ix = px + 18; ix < px + p.w - 16; ix += 18) {
        const iLen = 9 + (ix % 7);
        ctx.beginPath();
        ctx.moveTo(ix - 3.2, topY - 9);
        ctx.lineTo(ix, topY - 9 + iLen);
        ctx.lineTo(ix + 3.2, topY - 9);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }

      // Swinging Ceremonial Swiss Treichel Cowbell on Embroidered Leather Strap!
      ctx.save();
      ctx.translate(cx, topY + 2);
      ctx.rotate(bellSwing);
      // Embroidered black/red leather strap + brass buckle + Swiss cross & Edelweiss
      ctx.fillStyle = '#1c1917'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.1;
      ctx.fillRect(-6.5, 0, 13, 16); ctx.strokeRect(-6.5, 0, 13, 16);
      ctx.fillStyle = '#dc2626'; ctx.fillRect(-5, 2, 10, 11);
      ctx.fillStyle = '#ffffff'; ctx.fillRect(-3.2, 6.5, 6.4, 2); ctx.fillRect(-1, 4.3, 2, 6.4);
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.4;
      ctx.strokeRect(-5.5, 12.5, 11, 3.2);

      // Bulging hammered-bronze Treichel bell body + embossed floral band + iron clapper!
      const bG = ctx.createLinearGradient(-16, 16, 16, 40);
      bG.addColorStop(0, '#fef9c3'); bG.addColorStop(0.45, '#f59e0b'); bG.addColorStop(1, '#78350f');
      ctx.fillStyle = bG; ctx.strokeStyle = '#451a03'; ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-10, 16);
      ctx.bezierCurveTo(-17, 24, -17, 33, -15, 39);
      ctx.quadraticCurveTo(0, 44, 15, 39);
      ctx.bezierCurveTo(17, 33, 17, 24, 10, 16);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(120, 53, 15, 0.55)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(-14, 33); ctx.quadraticCurveTo(0, 36, 14, 33); ctx.stroke();
      ctx.fillStyle = '#451a03';
      ctx.beginPath(); ctx.arc(Math.sin(bellSwing * 2.4) * 5, 41.5, 4.0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      if (p.bellWarn) {
        const pulse = 0.5 + 0.5 * Math.sin(time * 24);
        ctx.strokeStyle = `rgba(253, 224, 71, ${(0.5 + pulse * 0.5).toFixed(2)})`;
        ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.arc(cx, topY + 28, 22 + pulse * 10, -0.7, 0.7); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, topY + 28, 22 + pulse * 10, Math.PI - 0.7, Math.PI + 0.7); ctx.stroke();
      }

      // Faceted crystalline snow-boulders with frost trail!
      if (p.snowballs && p.snowballs.length) {
        const worldOff = (p.x || 0) - px;
        const worldOffY = (p.y || 0) - py;
        for (const sb of p.snowballs) {
          const sx = sb.x - worldOff;
          const sy = sb.y - worldOffY;
          const sr = sb.r || 12;
          ctx.fillStyle = 'rgba(224, 242, 254, 0.55)';
          ctx.beginPath(); ctx.arc(sx, sy - 7, sr * 0.65, 0, Math.PI * 2); ctx.fill();
          const sG = ctx.createRadialGradient(sx - 3, sy - 3, 2, sx, sy, sr);
          sG.addColorStop(0, '#ffffff'); sG.addColorStop(0.68, '#e0f2fe'); sG.addColorStop(1, '#38bdf8');
          ctx.fillStyle = sG; ctx.strokeStyle = '#0284c7'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.1;
          ctx.beginPath(); ctx.moveTo(sx - 4, sy - 3); ctx.lineTo(sx + 2, sy - 5); ctx.stroke();
        }
      }
      ctx.restore();
      return true;
    }

    // 13. COZY ST. BERNARD ALPINE RESCUE HUT (كشك الإنقاذ والضيافة السويسري الدافئ — Stone & honey-larch hospice chalet, smoking hearth chimney, warm glowing window, rescue barrel & steaming Swiss hot chocolate!)
    if (p.type === 'swiss_rescue_hut') {
      const floorY = py + p.h;
      const cx = px + p.w * 0.5;
      const gifted = !!p.gifted;
      ctx.save();
      ctx.translate(cx, floorY);

      // Soft ground shadow
      ctx.fillStyle = 'rgba(15, 23, 42, 0.26)';
      ctx.beginPath(); ctx.ellipse(0, 0, 56, 5.5, 0, 0, Math.PI * 2); ctx.fill();

      // Stone chimney + gentle hearth smoke curls
      ctx.fillStyle = '#64748b'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.4;
      ctx.fillRect(22, -96, 12, 24); ctx.strokeRect(22, -96, 12, 24);
      for (let sm = 0; sm < 3; sm++) {
        const sf = ((time * 0.65 + sm * 0.33) % 1);
        ctx.fillStyle = `rgba(254, 249, 195, ${(0.55 * (1 - sf)).toFixed(2)})`;
        ctx.beginPath(); ctx.arc(28 + Math.sin(time * 2 + sm) * 4 + sf * 8, -100 - sf * 22, 3.5 + sf * 4.5, 0, Math.PI * 2); ctx.fill();
      }

      // Granite foundation + honey-larch log chalet walls
      const hutG = ctx.createLinearGradient(-44, -74, 44, 0);
      hutG.addColorStop(0, '#d97706'); hutG.addColorStop(0.55, '#92400e'); hutG.addColorStop(1, '#5c2d0c');
      ctx.fillStyle = hutG; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.7;
      ctx.beginPath(); ctx.roundRect(-44, -72, 88, 72, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-44, -15, 88, 15); ctx.strokeRect(-44, -15, 88, 15);
      // Horizontal log seams
      ctx.strokeStyle = 'rgba(41, 21, 9, 0.45)'; ctx.lineWidth = 1.1;
      for (let ly = -60; ly <= -24; ly += 12) {
        ctx.beginPath(); ctx.moveTo(-44, ly); ctx.lineTo(44, ly); ctx.stroke();
      }

      // Snow-dusted overhanging alpine chalet roof + carved bargeboard + Swiss rescue cross sign!
      ctx.fillStyle = '#78350f'; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(-56, -68); ctx.lineTo(0, -98); ctx.lineTo(56, -68); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4.2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-54, -70); ctx.lineTo(0, -99); ctx.lineTo(54, -70); ctx.stroke();

      // Warm amber glowing hospice window with red shutters
      ctx.fillStyle = '#fef08a'; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.4;
      ctx.fillRect(-32, -52, 20, 20); ctx.strokeRect(-32, -52, 20, 20);
      ctx.strokeStyle = '#78350f';
      ctx.beginPath();
      ctx.moveTo(-22, -52); ctx.lineTo(-22, -32);
      ctx.moveTo(-32, -42); ctx.lineTo(-12, -42);
      ctx.stroke();
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-37, -52, 5, 20); ctx.fillRect(-12, -52, 5, 20);

      // Serving counter shelf + steaming mug of Swiss hot cocoa & Toblerone gold triangle bar!
      ctx.fillStyle = '#b45309'; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.3;
      ctx.fillRect(-38, -31, 34, 5); ctx.strokeRect(-38, -31, 34, 5);
      if (!gifted) {
        // Steaming red Swiss cocoa mug
        ctx.fillStyle = '#dc2626'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.0;
        ctx.fillRect(-29, -40, 8, 9); ctx.strokeRect(-29, -40, 8, 9);
        ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-25, -42); ctx.quadraticCurveTo(-27, -47, -24 + Math.sin(time * 5) * 1.5, -51);
        ctx.stroke();
        // Golden triangular Swiss chocolate bar
        ctx.fillStyle = '#facc15'; ctx.strokeStyle = '#854d0e'; ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(-17, -31); ctx.lineTo(-13, -37); ctx.lineTo(-9, -31);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }

      // Arched oak hospice door + coiled rescue rope + iconic St. Bernard oak barrel!
      ctx.fillStyle = '#5c2d0c'; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.roundRect(6, -46, 22, 46, [11, 11, 0, 0]); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(23, -22, 1.8, 0, Math.PI * 2); ctx.fill();
      // Coiled hemp mountain rescue rope hung on wall
      ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.arc(36, -42, 5.5, 0, Math.PI * 2); ctx.stroke();
      // Oak St. Bernard rescue barrel resting beside door
      ctx.fillStyle = '#b45309'; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.roundRect(30, -18, 18, 18, 5); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(34, -18); ctx.lineTo(34, 0); ctx.moveTo(44, -18); ctx.lineTo(44, 0); ctx.stroke();
      ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.arc(39, -9, 4.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.fillRect(36.5, -9.8, 5, 1.6); ctx.fillRect(38.2, -11.5, 1.6, 5);

      // Gable Swiss Rescue Cross Emblem + Floating Invitation Badge!
      ctx.fillStyle = '#dc2626'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.roundRect(-9, -86, 18, 18, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-5.5, -78.5, 11, 3); ctx.fillRect(-1.5, -82.5, 3, 11);

      if (!gifted) {
        const bob = Math.sin(time * 3.2) * 3;
        ctx.fillStyle = 'rgba(185, 28, 28, 0.92)';
        ctx.strokeStyle = '#fde047'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(-28, -118 + bob, 56, 17, 6); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fef08a'; ctx.font = 'bold 9.5px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('🍫 +❤️ 🪙', 0, -106 + bob);
      }
      ctx.restore();
      return true;
    }

    return false;
  }

  const prevPurgeSwiss = Art.purgeInactiveStageCaches;
  Art.purgeInactiveStageCaches = function (activeTheme) {
    if (typeof prevPurgeSwiss === 'function') prevPurgeSwiss(activeTheme);
    if (activeTheme !== 'swiss') {
      for (const c of [swissCloudSprite, swissHorizonCache, swissFarCache, swissMidCache]) {
        if (c) { c.width = 0; c.height = 0; }
      }
      swissCloudSprite = null;
      swissHorizonCache = null;
      swissFarCache = null;
      swissMidCache = null;
    }
  };

  // =========================================================================
  // 6. MUSEUM-GRADE PHOTOREALISTIC FOREGROUND SWISS COWS (IN FRONT OF CAT!)
  //    • 'brown_white': Rich Chestnut-Mahogany Coat Spotted with White (Simmental Red-Pied)
  //    • 'black_white': Pearlescent Ivory-White Coat Spotted with Velvet-Black (Holstein/Fribourg)
  // =========================================================================
  function drawCloseForegroundCow(ctx, fc, sx, sy, time) {
    const face = fc.facing || -1;
    const isBlackWhite = fc.breed === 'black_white';
    const variant = fc.variant || 1;
    const ph = fc.phase || 0;
    const mooT = fc.mooAnim || 0;
    const isMooing = mooT > 0.05;
    const mooStrength = Math.min(1, mooT * 1.6);

    // Lifelike bovine motion: gentle rib breathing, cud chewing, ear flicking, tail swishing & warm Moo lift!
    const idleNod = (1 - mooStrength) * (Math.sin(time * 1.35 + ph) * 2.4 + 2.8);
    const mooLift = mooStrength * -7.2;
    const headYOff = idleNod + mooLift;
    const headRot = (1 - mooStrength) * 0.16 - mooStrength * 0.14;
    const jawOpen = isMooing
      ? (3.0 + Math.sin(time * 8.5) * 0.7) * mooStrength
      : Math.max(0, Math.sin(time * 4.8 + ph)) * 1.0;
    const jawChewX = !isMooing ? Math.cos(time * 4.8 + ph) * 0.9 : 0;
    const earFlick = Math.sin(time * (isMooing ? 7.5 : 2.1) + ph) * (isMooing ? 0.16 : 0.06);
    const tailSwish = Math.sin(time * 2.6 + ph * 1.4) * 7.5;
    const bellSwing = Math.sin(time * (isMooing ? 9.2 : 2.2) + ph) * (isMooing ? 0.22 : 0.07);
    const breath = Math.sin(time * 1.9 + ph) * 1.1;

    // Rich naturalistic fur palettes:
    // - Brown-Spotted-with-White: base is deep glossy chestnut-mahogany brown, spotted with organic creamy snow-white!
    // - White-Spotted-with-Black: base is sunlit pearlescent cream-white, spotted with glossy blue-black obsidian!
    const brownLight = variant === 2 ? '#c97332' : '#b85d25';
    const brownMid = variant === 2 ? '#9e4c18' : '#8e3d12';
    const brownDark = variant === 2 ? '#632b0a' : '#572208';

    ctx.save();
    ctx.translate(sx + (fc.w || 168) * 0.5, sy);
    ctx.scale(face * 1.05, 1.05);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // 1. Multi-layered soft ambient occlusion ground shadow on the grassy slope
    const shG = ctx.createRadialGradient(0, 1, 8, 0, 1, 66);
    shG.addColorStop(0.0, 'rgba(5, 42, 20, 0.46)');
    shG.addColorStop(0.65, 'rgba(5, 46, 22, 0.22)');
    shG.addColorStop(1.0, 'rgba(5, 46, 22, 0)');
    ctx.fillStyle = shG;
    ctx.beginPath();
    ctx.ellipse(2, 1.5, 66, 10.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Helper: Anatomically accurate articulated ungulate hindleg (stifle -> angled hock -> cannon -> fetlock -> dewclaw -> split hoof)
    const drawAnatomicalHindLeg = (offsetX, isFar) => {
      const shade = isFar ? 0.76 : 1.0;
      const topStocking = isFar ? '#cbd5e1' : '#ffffff';
      const midStocking = isFar ? '#94a3b8' : '#e2e8f0';
      const botStocking = isFar ? '#64748b' : '#cbd5e1';
      const lG = ctx.createLinearGradient(offsetX - 8, -46, offsetX + 8, 0);
      lG.addColorStop(0.0, isBlackWhite ? topStocking : (isFar ? '#572208' : brownMid));
      lG.addColorStop(0.36, topStocking);
      lG.addColorStop(0.75, midStocking);
      lG.addColorStop(1.0, botStocking);

      ctx.save();
      ctx.fillStyle = lG;
      ctx.strokeStyle = isFar ? 'rgba(30, 27, 24, 0.55)' : 'rgba(41, 29, 18, 0.68)';
      ctx.lineWidth = 1.05;
      ctx.beginPath();
      // Upper gaskin/thigh tapering down to distinct backward-angled hock joint!
      ctx.moveTo(offsetX - 8.5, -45);
      ctx.bezierCurveTo(offsetX - 10.5, -34, offsetX - 12.2, -26, offsetX - 11.5, -20.5); // point of hock!
      ctx.quadraticCurveTo(offsetX - 8.5, -16, offsetX - 7.2, -7.5); // slender rear cannon tendon
      ctx.lineTo(offsetX - 9.0, -5.8); // small rear dewclaw!
      ctx.lineTo(offsetX - 6.6, -4.5);
      ctx.lineTo(offsetX - 4.8, -2.5); // pastern
      ctx.lineTo(offsetX + 4.8, -2.5);
      ctx.quadraticCurveTo(offsetX + 2.8, -8.5, offsetX - 1.2, -18.5); // front of cannon & hock crease
      ctx.quadraticCurveTo(offsetX + 3.5, -29, offsetX + 6.5, -44); // muscular stifle front
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Subtle tendon shadow line along cannon bone
      if (!isFar) {
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.35)';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(offsetX - 6.8, -19);
        ctx.lineTo(offsetX - 4.2, -8);
        ctx.stroke();
      }

      // 3D Split Cloven Keratin Hoof with glossy highlight & dark cleft
      const hoofG = ctx.createLinearGradient(offsetX - 5, -3, offsetX + 6, 1);
      hoofG.addColorStop(0, isFar ? '#1e293b' : '#475569');
      hoofG.addColorStop(0.5, '#1e293b');
      hoofG.addColorStop(1, '#09090b');
      ctx.fillStyle = hoofG;
      ctx.beginPath();
      ctx.moveTo(offsetX - 5.0, -3.2);
      ctx.lineTo(offsetX + 4.8, -3.2);
      ctx.quadraticCurveTo(offsetX + 7.2, -1.0, offsetX + 6.8, 0.8);
      ctx.lineTo(offsetX + 1.5, 0.8);
      ctx.lineTo(offsetX + 0.6, -1.6); // realistic cloven split!
      ctx.lineTo(offsetX - 0.3, 0.8);
      ctx.lineTo(offsetX - 5.2, 0.6);
      ctx.closePath();
      ctx.fill();
      if (!isFar && shade > 0.9) {
        ctx.strokeStyle = 'rgba(226, 232, 240, 0.42)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(offsetX + 2.2, -2.5);
        ctx.lineTo(offsetX + 5.2, 0.2);
        ctx.stroke();
      }
      ctx.restore();
    };

    // Helper: Anatomically accurate articulated foreleg (muscular forearm -> carpal knee bulge -> cannon -> fetlock -> dewclaw -> split hoof)
    const drawAnatomicalForeLeg = (offsetX, isFar) => {
      const topStocking = isFar ? '#cbd5e1' : '#ffffff';
      const midStocking = isFar ? '#94a3b8' : '#e2e8f0';
      const botStocking = isFar ? '#64748b' : '#cbd5e1';
      const lG = ctx.createLinearGradient(offsetX - 6, -42, offsetX + 6, 0);
      lG.addColorStop(0.0, isBlackWhite ? topStocking : (isFar ? '#572208' : brownMid));
      lG.addColorStop(0.32, topStocking);
      lG.addColorStop(0.75, midStocking);
      lG.addColorStop(1.0, botStocking);

      ctx.save();
      ctx.fillStyle = lG;
      ctx.strokeStyle = isFar ? 'rgba(30, 27, 24, 0.55)' : 'rgba(41, 29, 18, 0.68)';
      ctx.lineWidth = 1.05;
      ctx.beginPath();
      ctx.moveTo(offsetX - 6.8, -40);
      ctx.quadraticCurveTo(offsetX - 5.4, -27, offsetX - 4.4, -19.5);
      ctx.lineTo(offsetX - 4.2, -7.8);
      ctx.lineTo(offsetX - 6.2, -6.0); // rear dewclaw
      ctx.lineTo(offsetX - 3.8, -4.6);
      ctx.lineTo(offsetX - 2.6, -2.5);
      ctx.lineTo(offsetX + 6.2, -2.5);
      ctx.lineTo(offsetX + 4.4, -7.5); // fetlock front
      ctx.lineTo(offsetX + 3.8, -17.5);
      ctx.quadraticCurveTo(offsetX + 5.4, -20.0, offsetX + 4.6, -23.0); // subtle forward carpal knee bulge!
      ctx.quadraticCurveTo(offsetX + 6.5, -31, offsetX + 7.2, -40);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Split Cloven Hoof
      const hoofG = ctx.createLinearGradient(offsetX - 3, -3, offsetX + 8, 1);
      hoofG.addColorStop(0, isFar ? '#1e293b' : '#475569');
      hoofG.addColorStop(0.5, '#1e293b');
      hoofG.addColorStop(1, '#09090b');
      ctx.fillStyle = hoofG;
      ctx.beginPath();
      ctx.moveTo(offsetX - 3.0, -3.2);
      ctx.lineTo(offsetX + 6.4, -3.2);
      ctx.quadraticCurveTo(offsetX + 8.8, -1.0, offsetX + 8.4, 0.8);
      ctx.lineTo(offsetX + 3.2, 0.8);
      ctx.lineTo(offsetX + 2.3, -1.6);
      ctx.lineTo(offsetX + 1.4, 0.8);
      ctx.lineTo(offsetX - 3.2, 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // 2. Far-side Hindleg & Foreleg
    drawAnatomicalHindLeg(-35, true);
    drawAnatomicalForeLeg(21, true);

    // 3. Anatomically Integrated Capacious Dairy Udder with Cylindrical Teats & Subtle Vein
    ctx.save();
    const udG = ctx.createRadialGradient(-23, -30, 3, -24, -27, 17);
    udG.addColorStop(0.0, '#fff1f2');
    udG.addColorStop(0.58, '#fbcfe8');
    udG.addColorStop(1.0, '#be185d');
    ctx.fillStyle = udG;
    ctx.strokeStyle = 'rgba(131, 24, 67, 0.42)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(-36, -35);
    ctx.bezierCurveTo(-37, -23, -29, -20, -22, -21);
    ctx.bezierCurveTo(-14, -22, -11, -27, -12, -33);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // 3 visible anatomical cylindrical teats
    ctx.fillStyle = '#f472b6';
    for (const [tx, ty] of [[-30.5, -22.2], [-24.5, -21.2], [-18.5, -22.5]]) {
      ctx.beginPath();
      ctx.roundRect(tx - 1.3, ty - 1, 2.6, 5.2, 1.3);
      ctx.fill();
    }
    ctx.restore();

    // 4. Long Sculpted Bovine Tail Hanging from Squared Tail-Head + Fluffy Hair Switch
    const tailTipX = -58 + tailSwish;
    ctx.strokeStyle = isBlackWhite ? '#e2e8f0' : brownDark;
    ctx.lineWidth = 3.4;
    ctx.beginPath();
    ctx.moveTo(-55, -74);
    ctx.bezierCurveTo(-62, -62, -62 + tailSwish * 0.45, -40, tailTipX, -21);
    ctx.stroke();
    // Voluminous multi-strand tail switch brush
    const swG = ctx.createLinearGradient(tailTipX, -23, tailTipX, -7);
    swG.addColorStop(0, isBlackWhite ? '#1e293b' : '#fef3c7');
    swG.addColorStop(1, isBlackWhite ? '#09090b' : '#d6c7b2');
    ctx.fillStyle = swG;
    ctx.beginPath();
    ctx.moveTo(tailTipX, -23);
    ctx.bezierCurveTo(tailTipX - 5.5, -17, tailTipX - 4.5, -10, tailTipX + 0.5, -7);
    ctx.bezierCurveTo(tailTipX + 5.2, -11, tailTipX + 4.5, -17, tailTipX, -23);
    ctx.closePath();
    ctx.fill();

    // 5. TRUE BOVINE ANATOMICAL SILHOUETTE: Tail-Head, Pelvic Hook Bone, Loin, Thoracic Withers, Neck, Pleated Dewlap & Rib Barrel!
    const traceFullBodyAndNeck = () => {
      ctx.beginPath();
      // Squared sacral tail-head & pin bone
      ctx.moveTo(-56, -75);
      // Pelvic hook bone & subtle loin dip
      ctx.bezierCurveTo(-48, -80, -38, -81, -26, -79.5 - breath * 0.4);
      // Rising thoracic chine to prominent rounded withers (shoulder hump!)
      ctx.bezierCurveTo(-8, -79 - breath * 0.7, 10, -83 - breath * 0.5, 24, -86.5);
      // Muscular dorsal neck crest sweeping to poll
      ctx.bezierCurveTo(34, -87.5, 44, -83 + headYOff * 0.45, 54, -75 + headYOff * 0.85);
      // Throat latch
      ctx.lineTo(50, -49 + headYOff * 0.78);
      // Realistic double-folded pendulous bovine dewlap & brisket!
      ctx.bezierCurveTo(49, -40 + headYOff * 0.5, 42, -35 + headYOff * 0.3, 37, -37 + headYOff * 0.2);
      ctx.bezierCurveTo(34, -31, 25, -29, 18, -33);
      // Deep heart-girth & capacious rib barrel
      ctx.bezierCurveTo(6, -27 + breath, -14, -26.5 + breath * 0.8, -28, -32);
      // Upward flank fold in front of hind stifle & thigh
      ctx.quadraticCurveTo(-34, -35, -39, -35);
      // Muscular hind quarter / buttock curve up to pin-bone
      ctx.bezierCurveTo(-51, -39, -59, -54, -56, -75);
      ctx.closePath();
    };

    // Base Coat Gradient
    const baseG = ctx.createLinearGradient(0, -88, 0, -26);
    if (isBlackWhite) {
      // Pearlescent ivory-white base coat with cool sky shadow & warm sunlit spine
      baseG.addColorStop(0.00, '#ffffff');
      baseG.addColorStop(0.56, '#f8f6f0');
      baseG.addColorStop(0.86, '#dce3ec');
      baseG.addColorStop(1.00, '#c8d6cc'); // subtle green meadow bounce light on belly!
    } else {
      // Rich glossy Alpine chestnut-mahogany brown base coat
      baseG.addColorStop(0.00, brownLight);
      baseG.addColorStop(0.48, brownMid);
      baseG.addColorStop(0.88, brownDark);
      baseG.addColorStop(1.00, '#4a250d');
    }
    ctx.fillStyle = baseG;
    traceFullBodyAndNeck();
    ctx.fill();

    // 6. ORGANIC GEOGRAPHIC COAT SPOTS, SATELLITE FLECKS, FUR TUFTS & 3D ANATOMICAL MUSCLE SHADING!
    ctx.save();
    traceFullBodyAndNeck();
    ctx.clip();

    if (isBlackWhite) {
      // --- WHITE SPOTTED WITH VELVET-BLACK (Photorealistic Holstein / Fribourg) ---
      const blkG = ctx.createLinearGradient(0, -88, 0, -30);
      blkG.addColorStop(0.00, '#334155'); // glossy sky-blue sheen on sunlit black fur!
      blkG.addColorStop(0.28, '#18181b');
      blkG.addColorStop(1.00, '#09090b');
      ctx.fillStyle = blkG;

      // Patch 1: Irregular multi-lobed neck & shoulder cape
      ctx.beginPath();
      ctx.moveTo(22, -88);
      ctx.bezierCurveTo(38, -88, 56, -80, 56, -46);
      ctx.bezierCurveTo(46, -42, 41, -48, 35, -45);
      ctx.bezierCurveTo(28, -42, 27, -56, 20, -61);
      ctx.bezierCurveTo(14, -66, 16, -79, 22, -88);
      ctx.closePath();
      ctx.fill();

      // Patch 2: Large organic geographic map saddle across chine & rib barrel (with irregular peninsulas!)
      ctx.beginPath();
      ctx.moveTo(-24, -82);
      ctx.bezierCurveTo(-12, -83, 4, -84, 9, -75);
      ctx.bezierCurveTo(13, -67, 7, -58, 11, -50);
      ctx.bezierCurveTo(14, -43, 6, -37, -2, -41);
      ctx.bezierCurveTo(-8, -44, -10, -53, -17, -51);
      ctx.bezierCurveTo(-25, -49, -29, -40, -34, -46);
      ctx.bezierCurveTo(-38, -52, -31, -63, -33, -71);
      ctx.bezierCurveTo(-35, -77, -30, -81, -24, -82);
      ctx.closePath();
      ctx.fill();

      // Patch 3: Rump & pin-bone cap
      ctx.beginPath();
      ctx.moveTo(-58, -77);
      ctx.bezierCurveTo(-48, -81, -41, -76, -43, -66);
      ctx.bezierCurveTo(-45, -57, -52, -52, -59, -57);
      ctx.closePath();
      ctx.fill();

      // Organic satellite ink-flecks & irregular spots (NOT uniform circles!)
      for (const [fx, fy, rx, ry, rot] of [
        [14, -42, 5.2, 3.4, 0.3],
        [-8, -34, 6.5, 3.8, -0.2],
        [-38, -56, 4.2, 2.8, 0.5],
        [4, -62, 3.2, 2.1, -0.4],
        [-22, -37, 3.4, 2.2, 0.2],
        [28, -36, 4.0, 2.5, -0.3],
      ]) {
        ctx.beginPath();
        ctx.ellipse(fx, fy, rx, ry, rot, 0, Math.PI * 2);
        ctx.fill();
      }

      // Fine feathered black hair strokes along patch borders for realistic fur transition
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 0.95;
      ctx.beginPath();
      for (const [hx, hy] of [[10, -68], [11, -54], [-15, -51], [-32, -62], [23, -60], [-43, -66]]) {
        ctx.moveTo(hx, hy); ctx.lineTo(hx + 3.2, hy + 1.8);
        ctx.moveTo(hx - 1, hy + 2.2); ctx.lineTo(hx + 2.4, hy + 3.8);
      }
      ctx.stroke();
    } else {
      // --- BROWN SPOTTED WITH WHITE (Photorealistic Swiss Simmental / Red-Pied!) ---
      const whtG = ctx.createLinearGradient(0, -86, 0, -26);
      whtG.addColorStop(0.00, '#ffffff');
      whtG.addColorStop(0.62, '#f8f5ec');
      whtG.addColorStop(0.90, '#dce4e8');
      whtG.addColorStop(1.00, '#cbd8ce'); // subtle meadow bounce light!
      ctx.fillStyle = whtG;

      if (variant === 2) {
        // Variant 2: Broad irregular white Swiss saddle-splash, white brisket/dewlap & white hind flank!
        ctx.beginPath();
        // White brisket, lower belly & sweeping shoulder peninsula
        ctx.moveTo(46, -42);
        ctx.bezierCurveTo(38, -48, 30, -56, 26, -70);
        ctx.bezierCurveTo(23, -81, 14, -86, 6, -84);
        ctx.bezierCurveTo(2, -72, 8, -58, 2, -48);
        ctx.bezierCurveTo(-4, -39, -18, -41, -24, -52);
        ctx.bezierCurveTo(-29, -62, -37, -64, -41, -50);
        ctx.lineTo(-44, -25);
        ctx.lineTo(48, -25);
        ctx.closePath();
        ctx.fill();

        // White rump-top splash
        ctx.beginPath();
        ctx.moveTo(-50, -80);
        ctx.bezierCurveTo(-41, -82, -34, -77, -37, -69);
        ctx.bezierCurveTo(-40, -63, -49, -66, -53, -74);
        ctx.closePath();
        ctx.fill();
      } else {
        // Variant 1: Classic Swiss Red-Pied irregular white shoulder belt, white underline & multi-lobed flank map!
        ctx.beginPath();
        // Sweeping organic white shoulder belt + white belly + white hind-flank splash
        ctx.moveTo(29, -87);
        ctx.bezierCurveTo(22, -87, 15, -78, 16, -66);
        ctx.bezierCurveTo(17, -54, 10, -45, 2, -44);
        ctx.bezierCurveTo(-8, -43, -14, -38, -21, -46);
        ctx.bezierCurveTo(-26, -53, -24, -67, -30, -73);
        ctx.bezierCurveTo(-36, -78, -42, -70, -40, -58);
        ctx.bezierCurveTo(-38, -46, -45, -42, -46, -32);
        ctx.lineTo(46, -25);
        ctx.lineTo(45, -39);
        ctx.bezierCurveTo(36, -44, 33, -55, 35, -67);
        ctx.bezierCurveTo(37, -77, 34, -86, 29, -87);
        ctx.closePath();
        ctx.fill();

        // Organic white dorsal spot on loin
        ctx.beginPath();
        ctx.moveTo(-12, -81);
        ctx.bezierCurveTo(-4, -82, 2, -77, -1, -70);
        ctx.bezierCurveTo(-4, -64, -14, -66, -16, -73);
        ctx.closePath();
        ctx.fill();
      }

      // Natural roan/fleck speckles along the brown-and-white borders!
      ctx.fillStyle = '#fffdf9';
      for (const [fx, fy, rx, ry, rot] of [
        [-6, -56, 4.8, 2.9, 0.25],
        [9, -60, 3.6, 2.2, -0.35],
        [-47, -56, 4.2, 2.6, 0.4],
        [39, -56, 3.4, 2.1, -0.2],
      ]) {
        ctx.beginPath();
        ctx.ellipse(fx, fy, rx, ry, rot, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = brownMid;
      for (const [fx, fy, rx, ry, rot] of [
        [24, -52, 4.2, 2.6, -0.2],
        [-33, -52, 3.6, 2.3, 0.3],
        [-6, -36, 4.5, 2.4, 0.1],
      ]) {
        ctx.beginPath();
        ctx.ellipse(fx, fy, rx, ry, rot, 0, Math.PI * 2);
        ctx.fill();
      }

      // Fine feathered white/chestnut hair ticks across patch borders
      ctx.strokeStyle = '#fffdf7';
      ctx.lineWidth = 0.95;
      ctx.beginPath();
      for (const [hx, hy] of [[16, -66], [34, -64], [-25, -62], [-39, -56], [-3, -71]]) {
        ctx.moveTo(hx - 2, hy); ctx.lineTo(hx + 2.5, hy + 1.4);
        ctx.moveTo(hx - 1.5, hy + 2.2); ctx.lineTo(hx + 2.8, hy + 3.4);
      }
      ctx.stroke();
    }

    // 7. UNIFIED 3D ANATOMICAL MUSCLE, RIBCAGE, HIP-HOLLOW & SUNLIGHT VOLUME SHADING!
    // Warm golden Alpine sunlight kissing the spine, withers & hook bone
    const sunRim = ctx.createLinearGradient(0, -88, 0, -68);
    sunRim.addColorStop(0.0, 'rgba(255, 251, 235, 0.36)');
    sunRim.addColorStop(1.0, 'rgba(255, 251, 235, 0)');
    ctx.fillStyle = sunRim;
    ctx.fillRect(-60, -90, 118, 22);

    // Subtle anatomical triangular hunger-hollow (paralumbar fossa), shoulder blade & dewlap skin folds!
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.14)';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    // Shoulder blade (scapula) contour
    ctx.moveTo(23, -78);
    ctx.quadraticCurveTo(19, -60, 26, -46);
    // Paralumbar hip hollow before hook bone
    ctx.moveTo(-38, -74);
    ctx.quadraticCurveTo(-32, -64, -36, -54);
    // Subtle last-rib arcs
    ctx.lineWidth = 1.6;
    ctx.moveTo(-14, -68); ctx.quadraticCurveTo(-17, -54, -13, -42);
    ctx.moveTo(-6, -69); ctx.quadraticCurveTo(-9, -54, -5, -41);
    // Dewlap loose skin pleats on neck
    ctx.moveTo(45, -54 + headYOff * 0.6);
    ctx.quadraticCurveTo(38, -43 + headYOff * 0.3, 31, -41);
    ctx.stroke();

    // Lower barrel 3D cylindrical shadow
    const bellySh = ctx.createLinearGradient(0, -46, 0, -26);
    bellySh.addColorStop(0.0, 'rgba(15, 23, 42, 0)');
    bellySh.addColorStop(0.75, 'rgba(15, 23, 42, 0.18)');
    bellySh.addColorStop(1.0, 'rgba(22, 101, 52, 0.16)');
    ctx.fillStyle = bellySh;
    ctx.fillRect(-60, -46, 120, 22);
    ctx.restore(); // end body clip

    // Delicate outer contour stroke (soft natural dark-umber, NOT thick cartoon black!)
    ctx.strokeStyle = 'rgba(41, 25, 14, 0.62)';
    ctx.lineWidth = 1.15;
    traceFullBodyAndNeck();
    ctx.stroke();

    // 8. Near-Side Muscular Hindleg & Foreleg (with upper thigh/forearm blending seamlessly into torso!)
    drawAnatomicalHindLeg(-27, false);
    drawAnatomicalForeLeg(29, false);
    // Upper thigh & forearm muscle blend patch over leg join
    ctx.fillStyle = isBlackWhite ? '#f8f6f0' : (variant === 2 ? '#f8f5ec' : brownMid);
    ctx.beginPath();
    ctx.ellipse(-28, -42, 9.5, 7.5, -0.15, 0, Math.PI * 2);
    ctx.fill();

    // 9. MUSEUM-GRADE SWISS EMBROIDERED LEATHER COLLAR (Chüeli-Rieme) & 3D HAMMERED TREICHEL BELL!
    const colTopX = 39, colTopY = -82 + headYOff * 0.42;
    const colBotX = 44.5, colBotY = -41 + headYOff * 0.62;
    // Stitched dark saddle-leather strap + crimson felt edging
    ctx.strokeStyle = '#291509';
    ctx.lineWidth = 8.4;
    ctx.beginPath(); ctx.moveTo(colTopX, colTopY); ctx.lineTo(colBotX, colBotY); ctx.stroke();
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 6.2;
    ctx.beginPath(); ctx.moveTo(colTopX, colTopY); ctx.lineTo(colBotX, colBotY); ctx.stroke();
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 4.0;
    ctx.beginPath(); ctx.moveTo(colTopX, colTopY); ctx.lineTo(colBotX, colBotY); ctx.stroke();

    // Ornate Brass Plaque, Swiss Cross & White Edelweiss Embroidery on the Leather Strap!
    const midColX = (colTopX + colBotX) * 0.5;
    const midColY = (colTopY + colBotY) * 0.5;
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(midColX, midColY, 2.7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(colTopX + (colBotX - colTopX) * 0.26, colTopY + (colBotY - colTopY) * 0.26, 1.6, 0, Math.PI * 2);
    ctx.arc(colTopX + (colBotX - colTopX) * 0.76, colTopY + (colBotY - colTopY) * 0.76, 1.6, 0, Math.PI * 2);
    ctx.fill();

    // 3D Hammered Bronze-Gold Swiss Treichel Cowbell + Iron Clapper
    ctx.save();
    ctx.translate(colBotX + 0.5, colBotY + 2.5);
    ctx.rotate(bellSwing);
    // Leather buckle loop
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-3.2, -2.5, 6.4, 3.8);
    const bellG = ctx.createLinearGradient(-8, 0, 8, 14);
    bellG.addColorStop(0.00, '#fef08a');
    bellG.addColorStop(0.32, '#f59e0b');
    bellG.addColorStop(0.72, '#b45309');
    bellG.addColorStop(1.00, '#451a03');
    ctx.fillStyle = bellG;
    ctx.strokeStyle = '#3b1d0a';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(-5.8, 0.5);
    ctx.lineTo(5.8, 0.5);
    ctx.bezierCurveTo(8.8, 5.0, 8.2, 10.8, 6.4, 13.8);
    ctx.quadraticCurveTo(0, 15.6, -6.4, 13.8);
    ctx.bezierCurveTo(-8.2, 10.8, -8.8, 5.0, -5.8, 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Decorative engraved brass band & specular vertical highlight
    ctx.strokeStyle = 'rgba(254, 249, 195, 0.65)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(-6.6, 9.8); ctx.quadraticCurveTo(0, 11.2, 6.6, 9.8);
    ctx.moveTo(-2.5, 2.0); ctx.lineTo(-3.2, 12.2);
    ctx.stroke();
    // Dark iron bell clapper peeking beneath rim
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(Math.sin(bellSwing * 3) * 1.4, 14.5, 2.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 10. PORTRAIT-GRADE REALISTIC BOVINE HEAD (Poll, Curly Forelock, Ringed Horns, Plush Ears, Eyelashed Eye & Dewy Muzzle!)
    ctx.save();
    ctx.translate(54, -63 + headYOff * 0.92);
    ctx.rotate(headRot);

    // Helper: Realistic Curved Keratin Horn with Growth Rings & Dark Polished Tip
    const drawRealisticHorn = (hx, hy, sc, rotH) => {
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(rotH);
      ctx.scale(sc, sc);
      const hG = ctx.createLinearGradient(-2, 0, 5, -16);
      hG.addColorStop(0.00, '#d6b88c');
      hG.addColorStop(0.55, '#fef3c7');
      hG.addColorStop(0.82, '#78553a');
      hG.addColorStop(1.00, '#1e1b18');
      ctx.fillStyle = hG;
      ctx.strokeStyle = 'rgba(41, 25, 14, 0.65)';
      ctx.lineWidth = 0.95;
      ctx.beginPath();
      ctx.moveTo(-3.2, 0.5);
      ctx.bezierCurveTo(-5.2, -7.5, -1.5, -13.5, 4.5, -16.2);
      ctx.bezierCurveTo(1.8, -11.5, 1.2, -6.5, 3.0, 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Keratin growth rings near horn base
      ctx.strokeStyle = 'rgba(120, 83, 50, 0.45)';
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(-3.0, -2.5); ctx.lineTo(2.4, -2.2);
      ctx.moveTo(-3.2, -5.2); ctx.lineTo(1.8, -4.8);
      ctx.moveTo(-2.8, -7.8); ctx.lineTo(1.5, -7.4);
      ctx.stroke();
      ctx.restore();
    };

    // Far Ear & Far Horn
    ctx.fillStyle = isBlackWhite ? '#18181b' : brownDark;
    ctx.beginPath();
    ctx.ellipse(-5.5, -13.2, 7.8, 3.6, -0.5, 0, Math.PI * 2);
    ctx.fill();
    drawRealisticHorn(2.5, -13.5, 0.86, 0.14);

    // Lower Jaw & Warm Open Mouth Cavity / Tongue when Chewing Clover or Mooing!
    ctx.save();
    ctx.translate(jawChewX * 0.5, 0);
    if (jawOpen > 0.25) {
      ctx.fillStyle = '#4c0519';
      ctx.beginPath();
      ctx.ellipse(15.2, 11.4 + jawOpen * 0.5, 6.4, 2.0 + jawOpen * 0.52, 0.14, 0, Math.PI * 2);
      ctx.fill();
      // Soft pink bovine tongue
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.ellipse(16.0, 11.8 + jawOpen * 0.5, 4.2, 1.3, 0.08, 0, Math.PI * 2);
      ctx.fill();
    }
    // Fleshy white/pink chin & lower lip under jaw
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = 'rgba(41, 25, 14, 0.55)';
    ctx.lineWidth = 0.95;
    ctx.beginPath();
    ctx.moveTo(5.5, 9.8);
    ctx.quadraticCurveTo(13.5, 14.5 + jawOpen * 0.85, 20.5, 12.2 + jawOpen * 0.75);
    ctx.quadraticCurveTo(16.0, 9.5 + jawOpen * 0.4, 5.5, 9.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // True Bovine Cranial & Facial Sculpture (Poll -> Brow Ridge -> Nasal Dish -> Cheek Masseter -> Broad Muzzle)
    const traceHeadSkull = () => {
      ctx.beginPath();
      ctx.moveTo(-11.5, -9.5);
      // Rounded poll crown
      ctx.bezierCurveTo(-7.5, -16.8, 2.5, -16.5, 7.5, -11.8);
      // Prominent supraorbital brow ridge -> slight concave nasal dish -> wide muzzle bridge
      ctx.bezierCurveTo(11.5, -9.0, 15.2, -4.5, 21.2, 1.8);
      // Broad squared muzzle front & upper lip
      ctx.bezierCurveTo(24.5, 5.5, 23.2, 11.2, 17.5, 12.0);
      // Cheek jowl & rounded masseter muscle!
      ctx.bezierCurveTo(10.5, 12.6, 3.5, 12.8, -2.5, 9.8);
      ctx.bezierCurveTo(-9.2, 6.8, -12.2, -1.5, -11.5, -9.5);
      ctx.closePath();
    };

    const skullG = ctx.createLinearGradient(-10, -16, 18, 12);
    if (isBlackWhite) {
      skullG.addColorStop(0.0, '#334155');
      skullG.addColorStop(0.45, '#18181b');
      skullG.addColorStop(1.0, '#09090b');
    } else {
      skullG.addColorStop(0.0, brownLight);
      skullG.addColorStop(0.55, brownMid);
      skullG.addColorStop(1.0, brownDark);
    }
    ctx.fillStyle = skullG;
    traceHeadSkull();
    ctx.fill();

    // Clipped Facial Blaze Markings & 3D Cheek/Brow Sculpting!
    ctx.save();
    traceHeadSkull();
    ctx.clip();

    if (isBlackWhite) {
      // Classic Holstein White Forehead Star & Broad White Nasal-Bridge Blaze Leaving Dark Eye-Spectacles & Cheeks!
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-2.5, -16.5);
      ctx.bezierCurveTo(3.5, -16.5, 7.2, -13.0, 6.8, -8.5);
      ctx.bezierCurveTo(9.8, -6.5, 15.5, -3.2, 22.5, 2.5);
      ctx.lineTo(22.5, 12.5);
      ctx.lineTo(10.5, 12.5);
      ctx.bezierCurveTo(10.2, 6.2, 8.8, 1.5, 5.2, -1.2);
      ctx.bezierCurveTo(1.5, -3.5, -2.2, -8.5, -2.5, -16.5);
      ctx.closePath();
      ctx.fill();
    } else {
      // Classic Swiss Simmental Broad White Face & Forehead Blaze with Rich Chestnut Eye-Patch / Cheek!
      ctx.fillStyle = '#fffdf9';
      ctx.beginPath();
      ctx.moveTo(-4.2, -16.8);
      ctx.bezierCurveTo(4.0, -16.8, 9.5, -12.5, 14.5, -5.5);
      ctx.lineTo(24.0, 2.5);
      ctx.lineTo(23.5, 13.0);
      ctx.lineTo(7.5, 12.8);
      ctx.bezierCurveTo(6.8, 6.5, 7.5, 1.5, 4.0, -1.0);
      ctx.bezierCurveTo(-1.0, -4.5, -4.8, -9.8, -4.2, -16.8);
      ctx.closePath();
      ctx.fill();
    }

    // Subtle 3D masseter cheek highlight & under-jaw shadow
    ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
    ctx.beginPath();
    ctx.ellipse(-1.5, 3.5, 6.5, 4.8, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = 'rgba(41, 25, 14, 0.65)';
    ctx.lineWidth = 1.1;
    traceHeadSkull();
    ctx.stroke();

    // Fluffy Curly Poll Forelock Tuft Between the Horns!
    ctx.fillStyle = '#fffdf7';
    ctx.strokeStyle = isBlackWhite ? 'rgba(100, 116, 139, 0.45)' : 'rgba(180, 83, 9, 0.35)';
    ctx.lineWidth = 0.85;
    for (const [cxF, cyF, rF] of [[-4.2, -14.5, 3.1], [-0.8, -15.4, 3.4], [2.6, -14.6, 2.9], [0.8, -13.2, 2.6]]) {
      ctx.beginPath();
      ctx.arc(cxF, cyF, rF, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Near Ringed Horn
    drawRealisticHorn(-3.8, -13.0, 1.0, -0.06);

    // Detailed Plush Bovine Ear: Fur Rim, Rosy Inner Concha, Cartilage Ridges & White Guard Hairs!
    ctx.save();
    ctx.translate(-8.2, -8.5);
    ctx.rotate(-0.28 + earFlick);
    ctx.fillStyle = isBlackWhite ? '#18181b' : brownMid;
    ctx.strokeStyle = '#1e1b18';
    ctx.lineWidth = 1.05;
    ctx.beginPath();
    ctx.moveTo(1, -2.2);
    ctx.bezierCurveTo(-5, -5.2, -14.5, -3.2, -16.5, 1.8);
    ctx.bezierCurveTo(-14.2, 6.5, -5.5, 6.2, 1, 2.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Warm rosy-peach inner ear concha
    const earInG = ctx.createLinearGradient(-14, 0, -1, 2);
    earInG.addColorStop(0, '#fda4af');
    earInG.addColorStop(1, '#ffe4e6');
    ctx.fillStyle = earInG;
    ctx.beginPath();
    ctx.moveTo(-0.5, -0.8);
    ctx.bezierCurveTo(-5.5, -2.6, -12.2, -1.2, -13.8, 1.6);
    ctx.bezierCurveTo(-11.8, 4.4, -5.2, 4.2, -0.5, 1.4);
    ctx.closePath();
    ctx.fill();
    // Delicate radiating white inner-ear guard hairs!
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.78)';
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.moveTo(-1.5, -0.2); ctx.lineTo(-7.5, -0.8);
    ctx.moveTo(-1.5, 0.5); ctx.lineTo(-9.2, 1.4);
    ctx.moveTo(-2.0, 1.2); ctx.lineTo(-7.2, 2.8);
    ctx.stroke();
    ctx.restore();

    // Moist, Dewy Glandular Rose-Pink Muzzle Pad, Comma Nostrils, Philtrum & Sensory Whiskers!
    const muzG = ctx.createRadialGradient(18.5, 5.2, 1.2, 18.8, 6.8, 8.2);
    muzG.addColorStop(0.00, '#fff1f2');
    muzG.addColorStop(0.55, '#fda4af');
    muzG.addColorStop(1.00, '#e11d48');
    ctx.fillStyle = muzG;
    ctx.strokeStyle = 'rgba(136, 19, 55, 0.52)';
    ctx.lineWidth = 0.95;
    ctx.beginPath();
    ctx.moveTo(13.2, 3.8);
    ctx.bezierCurveTo(15.8, 0.8, 22.2, 1.2, 23.6, 5.2);
    ctx.bezierCurveTo(24.4, 9.2, 21.2, 11.8, 16.5, 11.5);
    ctx.bezierCurveTo(12.8, 11.0, 11.8, 7.2, 13.2, 3.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cute natural slate pigment spot on the Holstein muzzle!
    if (isBlackWhite) {
      ctx.fillStyle = 'rgba(30, 41, 59, 0.58)';
      ctx.beginPath();
      ctx.ellipse(15.2, 8.2, 2.4, 1.6, 0.25, 0, Math.PI * 2);
      ctx.fill();
    }

    // Central philtrum groove & sculpted comma-shaped nostrils with fleshy alar rims
    ctx.strokeStyle = 'rgba(136, 19, 55, 0.48)';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(19.6, 7.2);
    ctx.lineTo(19.0, 11.4);
    ctx.stroke();

    ctx.fillStyle = '#3b0712';
    ctx.beginPath();
    ctx.ellipse(16.8, 5.6, 2.0, 1.15, -0.42, 0, Math.PI * 2);
    ctx.ellipse(21.6, 6.2, 1.5, 1.0, 0.32, 0, Math.PI * 2);
    ctx.fill();
    // Wet glistening dew highlights on upper muzzle pad
    ctx.fillStyle = 'rgba(255, 255, 255, 0.68)';
    ctx.beginPath();
    ctx.ellipse(18.2, 3.3, 2.8, 0.95, 0.12, 0, Math.PI * 2);
    ctx.arc(20.6, 4.4, 0.7, 0, Math.PI * 2);
    ctx.fill();

    // Fine translucent white sensory muzzle whiskers
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.62)';
    ctx.lineWidth = 0.65;
    ctx.beginPath();
    ctx.moveTo(14.5, 10.5); ctx.lineTo(12.2, 13.5);
    ctx.moveTo(17.2, 11.2); ctx.lineTo(16.5, 14.2);
    ctx.moveTo(20.8, 10.8); ctx.lineTo(22.2, 13.5);
    ctx.stroke();

    // Soulful, Liquid-Glossy Cow Eye with Eyelid Folds, Warm Espresso Iris, Horizontal Pupil & Sweeping Eyelashes!
    // Soft upper orbital brow & lower eyelid crease
    ctx.fillStyle = isBlackWhite ? '#0f172a' : '#4a1f08';
    ctx.beginPath();
    ctx.ellipse(4.8, -4.2, 4.3, 3.3, -0.08, 0, Math.PI * 2);
    ctx.fill();
    // Warm espresso-amber iris
    const eyeG = ctx.createRadialGradient(5.2, -3.8, 0.4, 5.0, -4.0, 3.2);
    eyeG.addColorStop(0.0, '#78350f');
    eyeG.addColorStop(0.65, '#3b1d0a');
    eyeG.addColorStop(1.0, '#09090b');
    ctx.fillStyle = eyeG;
    ctx.beginPath();
    ctx.ellipse(5.0, -4.1, 3.2, 2.6, -0.05, 0, Math.PI * 2);
    ctx.fill();
    // Horizontal-oval bovine pupil
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.ellipse(5.2, -4.1, 1.9, 1.25, -0.05, 0, Math.PI * 2);
    ctx.fill();
    // Dual sky catchlights (wet glossy eye!)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(6.0, -4.9, 1.05, 0.75, -0.2, 0, Math.PI * 2);
    ctx.arc(4.0, -3.3, 0.45, 0, Math.PI * 2);
    ctx.fill();
    // Upper eyelid fold & 4 delicate curved eyelashes!
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    ctx.arc(4.9, -4.0, 3.4, Math.PI * 1.05, Math.PI * 1.96);
    ctx.stroke();
    ctx.lineWidth = 0.85;
    ctx.beginPath();
    ctx.moveTo(2.0, -5.4); ctx.lineTo(0.6, -6.5);
    ctx.moveTo(3.4, -6.8); ctx.lineTo(2.4, -8.1);
    ctx.moveTo(5.2, -7.2); ctx.lineTo(4.8, -8.6);
    ctx.moveTo(6.9, -6.7); ctx.lineTo(7.2, -8.0);
    ctx.stroke();

    // Gentle nibble clover sprig in mouth when grazing OR warm acoustic sound-waves when mooing!
    if (isMooing) {
      for (let w = 0; w < 2; w++) {
        const prog = ((time * 1.8 + w * 0.5) % 1);
        const r = 11 + prog * 19;
        ctx.strokeStyle = `rgba(254, 249, 195, ${((1 - prog) * 0.72 * mooStrength).toFixed(2)})`;
        ctx.lineWidth = 1.7;
        ctx.beginPath();
        ctx.arc(26, 6, r, -0.45, 0.45);
        ctx.stroke();
      }
    } else {
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(19, 11.2);
      ctx.quadraticCurveTo(24, 13.5 + jawChewX, 27, 16.0);
      ctx.stroke();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(27.5, 16.2, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore(); // end head

    // 11. Layered Foreground Alpine Grass, Clover & Wildflowers Rooting the Hooves into the Slope!
    const gSway = Math.sin(time * 2.2 + ph) * 1.8;
    for (const [gx, gh, col] of [
      [-52, 13, '#15803d'], [-40, 15, '#22c55e'], [-28, 12, '#16a34a'],
      [-14, 14, '#22c55e'], [4, 11, '#15803d'], [20, 14, '#22c55e'],
      [33, 15, '#16a34a'], [46, 13, '#22c55e'], [56, 11, '#15803d'],
    ]) {
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.85;
      ctx.beginPath();
      ctx.moveTo(gx, 3.2);
      ctx.quadraticCurveTo(gx - 2 + gSway, -gh * 0.5, gx - 4.2 + gSway, -gh);
      ctx.moveTo(gx + 3, 3.2);
      ctx.quadraticCurveTo(gx + 5 + gSway, -gh * 0.45, gx + 7.2 + gSway, -gh * 0.85);
      ctx.stroke();
    }
    // Foreground dandelions & white alpine daisies
    for (const [fx0, fy0, fCol] of [[-42, -10.5, '#ffffff'], [-12, -10.0, '#fde047'], [23, -9.5, '#ffffff'], [48, -9.5, '#fde047']]) {
      ctx.fillStyle = fCol;
      ctx.beginPath();
      ctx.arc(fx0 + gSway * 0.5, fy0, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawSwissForegroundCows(ctx, level, camX, camY, time, viewW) {
    if (!level || !level.swiss_foreground_cows) return;
    const cullW = viewW || ctx._viewW || 1024;
    for (const fc of level.swiss_foreground_cows) {
      const sx = fc.x - camX;
      const sy = fc.y - camY;
      if (sx + (fc.w || 152) < -90 || sx > cullW + 90) continue;
      drawCloseForegroundCow(ctx, fc, sx, sy, time);
    }
  }

  Art.drawSwissSkyAndHorizon = drawSwissSkyAndHorizon;
  Art.drawSwissMidground = drawSwissMidground;
  Art.drawSwissGoalGate = drawSwissGoalGate;
  Art.drawSwissAlpineStream = drawSwissAlpineStream;
  Art.drawSwissForegroundCows = drawSwissForegroundCows;
  Art.drawPlatform = function (ctx, p, px, py, nv, time) {
    if (p && p.type && p.type.startsWith('swiss_')) {
      if (drawSwissPlatform(ctx, p, px, py, nv, time)) return;
    }
    return prevDrawPlatform(ctx, p, px, py, nv, time);
  };
  Art.drawCheckpoint = function (ctx, cp, cx, cy, time, theme, stageNum) {
    if (theme === 'swiss' || stageNum === 28) {
      drawSwissCheckpoint(ctx, cp, cx, cy, time);
      return;
    }
    return prevDrawCheckpoint(ctx, cp, cx, cy, time, theme, stageNum);
  };
})();
