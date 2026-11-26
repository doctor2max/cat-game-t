/* ============================================================================
   STAGE 27 ART ENGINE: ISTANBUL, TURKEY (إسطنبول • جسر غلطة ومضيق البوسفور)
   First-Pass Museum-Grade Architectural Realism + Built-In 60fps Tile Baking:
     • Golden-Hour Bosphorus Sunset with Monumental Hagia Sophia, Blue Mosque
       (6 Fluted Minarets + Ribbed Lead Domes) & Bosphorus Suspension Bridge
     • Baked Far Panorama Tile (0.24x): Colorful Balat Ottoman Cumba Houses &
       Monumental Cylindrical Galata Tower
     • Baked Waterfront & Bazaar Tile (0.42x): Galata Bridge Arches, Fishing
       Rods, Mosaic Lamps, Waterfront Kiosks & Continuous Bosphorus Water
     • Live 60fps Overlay: Classic Red Istiklal Tram, White Bosphorus Vapur
       Ferry with Delicate Hull Wake, Soaring Seagulls & Golden Water Shimmer
     • 8 Handcrafted Foreground Platform / Interactive Prop Renderers +
       Monumental Galata Tower Finish Gate
   ============================================================================ */
(function () {
  'use strict';
  window.Game = window.Game || {};
  const Art = window.Game.Art;
  if (!Art) return;

  const prevDrawPlatform = Art.drawPlatform;

  function makeOffscreen(w, h, fn) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const cctx = c.getContext('2d');
    fn(cctx, w, h);
    return c;
  }

  // Helper: Sculpted Ottoman Ribbed Lead Dome with Gilded Finial (Alem)
  function drawOttomanDome(ctx, cx, baseY, rx, ry, colTop, colBot) {
    const g = ctx.createLinearGradient(cx - rx, baseY - ry, cx + rx, baseY);
    g.addColorStop(0.0, colTop);
    g.addColorStop(0.55, colBot);
    g.addColorStop(1.0, '#1e1b2e');
    ctx.fillStyle = g;
    ctx.strokeStyle = '#181426';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(cx - rx, baseY);
    ctx.bezierCurveTo(cx - rx, baseY - ry * 1.15, cx + rx, baseY - ry * 1.15, cx + rx, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Ribbed lead seams curving to crown
    ctx.strokeStyle = 'rgba(255, 240, 210, 0.22)';
    ctx.lineWidth = 1.0;
    for (let r = -2; r <= 2; r++) {
      const ox = (r / 3) * rx;
      ctx.beginPath();
      ctx.moveTo(cx + ox, baseY);
      ctx.quadraticCurveTo(cx + ox * 0.45, baseY - ry * 0.65, cx, baseY - ry * 0.88);
      ctx.stroke();
    }

    // Gilded Ottoman Alem finial spire
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(cx, baseY - ry * 0.88);
    ctx.lineTo(cx, baseY - ry * 0.88 - 14);
    ctx.stroke();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(cx, baseY - ry * 0.88 - 6, 2.4, 0, Math.PI * 2);
    ctx.arc(cx, baseY - ry * 0.88 - 12, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Helper: Fluted Ottoman Pencil Minaret with Carved Şerefe Balconies & Conical Lead Spire
  function drawOttomanMinaret(ctx, cx, baseY, h, w) {
    const topY = baseY - h;
    const shaftG = ctx.createLinearGradient(cx - w, topY, cx + w, topY);
    shaftG.addColorStop(0.0, '#f3d8b8');
    shaftG.addColorStop(0.45, '#d4a67e');
    shaftG.addColorStop(1.0, '#5a3d36');
    ctx.fillStyle = shaftG;
    ctx.strokeStyle = '#23151e';
    ctx.lineWidth = 1.2;

    // Stone pedestal + fluted shaft
    ctx.fillRect(cx - w * 0.85, baseY - h * 0.22, w * 1.7, h * 0.22);
    ctx.strokeRect(cx - w * 0.85, baseY - h * 0.22, w * 1.7, h * 0.22);
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.55, baseY - h * 0.22);
    ctx.lineTo(cx - w * 0.42, topY + 26);
    ctx.lineTo(cx + w * 0.42, topY + 26);
    ctx.lineTo(cx + w * 0.55, baseY - h * 0.22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Two carved Şerefe balconies
    for (const frac of [0.36, 0.64]) {
      const by = topY + h * frac;
      ctx.fillStyle = '#e7c39a';
      ctx.beginPath();
      ctx.roundRect(cx - w * 0.92, by, w * 1.84, 6.5, 2);
      ctx.fill();
      ctx.stroke();
    }

    // Lead conical spire + gilded finial
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.45, topY + 26);
    ctx.lineTo(cx, topY);
    ctx.lineTo(cx + w * 0.45, topY + 26);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(cx, topY);
    ctx.lineTo(cx, topY - 9);
    ctx.stroke();
  }

  // Helper: Colorful Balat / Karaköy Ottoman Cumba Wooden Bay-Window House
  function drawBalatCumbaHouse(ctx, x, baseY, bw, bh, wallTop, wallBot, trimCol) {
    const y = baseY - bh;
    ctx.save();
    // Stone ground-floor plinth
    const stG = ctx.createLinearGradient(x, baseY - 46, x, baseY);
    stG.addColorStop(0, '#a89680'); stG.addColorStop(1, '#6b5b4b');
    ctx.fillStyle = stG; ctx.strokeStyle = '#291c14'; ctx.lineWidth = 1.5;
    ctx.fillRect(x + 4, baseY - 46, bw - 8, 46);
    ctx.strokeRect(x + 4, baseY - 46, bw - 8, 46);

    // Arched Ottoman wooden doorway
    ctx.fillStyle = '#3f2314';
    ctx.beginPath();
    ctx.moveTo(x + bw * 0.34, baseY);
    ctx.lineTo(x + bw * 0.34, baseY - 26);
    ctx.arc(x + bw * 0.5, baseY - 26, bw * 0.16, Math.PI, 0);
    ctx.lineTo(x + bw * 0.66, baseY);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Overhanging upper wooden Cumba bay-window facade supported by curved timber corbels
    const wG = ctx.createLinearGradient(x, y, x + bw, baseY - 42);
    wG.addColorStop(0, wallTop); wG.addColorStop(0.65, wallBot); wG.addColorStop(1, '#3b2422');
    ctx.fillStyle = wG;
    ctx.fillRect(x, y + 18, bw, bh - 62);
    ctx.strokeRect(x, y + 18, bw, bh - 62);

    // Horizontal timber clapboard siding lines
    ctx.strokeStyle = 'rgba(30, 15, 10, 0.18)'; ctx.lineWidth = 0.9;
    for (let ly = y + 26; ly < baseY - 46; ly += 8) {
      ctx.beginPath(); ctx.moveTo(x + 1, ly); ctx.lineTo(x + bw - 1, ly); ctx.stroke();
    }

    // Carved wooden brackets (corbels) under bay overhang
    ctx.fillStyle = trimCol; ctx.strokeStyle = '#291c14'; ctx.lineWidth = 1.2;
    for (const bx of [x + 8, x + bw * 0.5 - 3, x + bw - 14]) {
      ctx.beginPath();
      ctx.moveTo(bx, baseY - 44); ctx.lineTo(bx + 6, baseY - 44);
      ctx.quadraticCurveTo(bx + 6, baseY - 34, bx + 2, baseY - 30);
      ctx.lineTo(bx, baseY - 30); ctx.closePath(); ctx.fill(); ctx.stroke();
    }

    // Warm sunlit arched Cumba windows with white lattice muntins & shutters
    const cols = bw >= 92 ? 3 : 2;
    const winW = 16, winH = 26;
    const gap = (bw - cols * winW) / (cols + 1);
    for (let r = 0; r < 2; r++) {
      const wy = y + 30 + r * 42;
      if (wy + winH > baseY - 52) break;
      for (let c = 0; c < cols; c++) {
        const wx = x + gap + c * (winW + gap);
        ctx.fillStyle = '#fef08a'; ctx.strokeStyle = trimCol; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.roundRect(wx, wy, winW, winH, [6, 6, 1, 1]); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(wx + winW * 0.5, wy); ctx.lineTo(wx + winW * 0.5, wy + winH);
        ctx.moveTo(wx, wy + winH * 0.5); ctx.lineTo(wx + winW, wy + winH * 0.5);
        ctx.stroke();
      }
    }

    // Terracotta Mediterranean pitched tile roof with projecting eaves
    const rG = ctx.createLinearGradient(x, y, x, y + 20);
    rG.addColorStop(0, '#c2410c'); rG.addColorStop(1, '#7c2d12');
    ctx.fillStyle = rG; ctx.strokeStyle = '#291c14'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 6, y + 20); ctx.lineTo(x + bw * 0.14, y);
    ctx.lineTo(x + bw * 0.86, y); ctx.lineTo(x + bw + 6, y + 20);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  // Helper: Monumental Cylindrical Galata Tower (برج غلطة التاريخي)
  function drawGalataTowerLandmark(ctx, cx, baseY, scale) {
    ctx.save();
    ctx.translate(cx, baseY);
    ctx.scale(scale, scale);

    // Cylindrical ashlar limestone drum with 3D golden sunset side-lighting
    const drumG = ctx.createLinearGradient(-44, -270, 44, 0);
    drumG.addColorStop(0.0, '#f7dec0');
    drumG.addColorStop(0.38, '#d4ae84');
    drumG.addColorStop(0.76, '#8b684d');
    drumG.addColorStop(1.0, '#4a3529');
    ctx.fillStyle = drumG; ctx.strokeStyle = '#231610'; ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-44, 0); ctx.lineTo(-40, -245); ctx.lineTo(40, -245); ctx.lineTo(44, 0);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Horizontal stone courses & recessed arched windows
    ctx.strokeStyle = 'rgba(40, 22, 12, 0.24)'; ctx.lineWidth = 1.0;
    for (let y = -20; y > -240; y -= 16) {
      ctx.beginPath(); ctx.moveTo(-42, y); ctx.lineTo(42, y); ctx.stroke();
    }
    for (const wy of [-62, -120, -176]) {
      for (const wx of [-18, 0, 18]) {
        ctx.fillStyle = '#fde68a'; ctx.strokeStyle = '#3b2112'; ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(wx - 4.5, wy + 12); ctx.lineTo(wx - 4.5, wy);
        ctx.arc(wx, wy, 4.5, Math.PI, 0); ctx.lineTo(wx + 4.5, wy + 12);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
    }

    // Iconic projecting corbeled observation balcony & arched upper gallery
    ctx.fillStyle = '#e7c69e'; ctx.strokeStyle = '#231610'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.roundRect(-48, -256, 96, 14, 3); ctx.fill(); ctx.stroke();
    // Upper arched gallery drum
    ctx.fillStyle = drumG;
    ctx.fillRect(-38, -292, 76, 36); ctx.strokeRect(-38, -292, 76, 36);
    for (let a = -24; a <= 24; a += 12) {
      ctx.fillStyle = '#fef08a';
      ctx.beginPath(); ctx.arc(a, -274, 4.2, Math.PI, 0); ctx.lineTo(a + 4.2, -260); ctx.lineTo(a - 4.2, -260); ctx.closePath(); ctx.fill();
    }

    // Iconic Tall Slate-Lead Conical Roof with Dormer Windows & Gilded Finial Spire!
    const roofG = ctx.createLinearGradient(-44, -292, 44, -395);
    roofG.addColorStop(0.0, '#64748b'); roofG.addColorStop(0.45, '#334155'); roofG.addColorStop(1.0, '#0f172a');
    ctx.fillStyle = roofG; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-45, -292); ctx.lineTo(0, -398); ctx.lineTo(45, -292);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Ribbed lead cone seams + gilded Alem spire
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.25)'; ctx.lineWidth = 1.1;
    for (const rx of [-26, -10, 10, 26]) {
      ctx.beginPath(); ctx.moveTo(rx, -292); ctx.lineTo(0, -396); ctx.stroke();
    }
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(0, -398); ctx.lineTo(0, -424); ctx.stroke();
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.arc(0, -408, 4, 0, Math.PI * 2); ctx.arc(0, -418, 2.8, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // =========================================================================
  // 1. GOLDEN-HOUR BOSPHORUS SKY & MONUMENTAL HISTORIC PENINSULA HORIZON
  // =========================================================================
  function drawIstanbulSkyAndHorizon(ctx, camX, w, h, time) {
    // Rich Golden-Hour Bosphorus Sunset Sky (Deep Indigo Zenith -> Rose Amber -> Glowing Gold Horizon)
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.78);
    sky.addColorStop(0.00, '#1e1b4b');
    sky.addColorStop(0.28, '#581c5c');
    sky.addColorStop(0.56, '#be4b5a');
    sky.addColorStop(0.80, '#f59e42');
    sky.addColorStop(1.00, '#fde68a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Radiant Setting Sun over the Bosphorus
    const sunX = 940 - (camX * 0.015) % 240;
    const sunY = 235;
    const halo = ctx.createRadialGradient(sunX, sunY, 16, sunX, sunY, 210);
    halo.addColorStop(0.0, 'rgba(255, 250, 210, 0.95)');
    halo.addColorStop(0.32, 'rgba(253, 186, 116, 0.45)');
    halo.addColorStop(1.0, 'rgba(251, 146, 60, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(sunX, sunY, 210, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fffbeb';
    ctx.beginPath(); ctx.arc(sunX, sunY, 44, 0, Math.PI * 2); ctx.fill();

    // Sculpted sunset cloud bands drifting gently across the Bosphorus
    ctx.fillStyle = 'rgba(254, 215, 170, 0.24)';
    for (let i = 0; i < 6; i++) {
      const cx0 = ((i * 270 - camX * 0.03 + time * 5) % (w + 300)) - 150;
      const cy0 = 88 + (i % 3) * 44;
      ctx.beginPath();
      ctx.ellipse(cx0, cy0, 115 + (i % 2) * 35, 16, 0, 0, Math.PI * 2);
      ctx.ellipse(cx0 + 48, cy0 - 7, 68, 13, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Distant Bosphorus Suspension Bridge (جسر البوسفور المعلق)
    const brOff = -((camX * 0.06) % 1400);
    for (let bx = brOff; bx < w + 1400; bx += 1400) {
      const t1 = bx + 260, t2 = bx + 860, deckY = 392;
      ctx.strokeStyle = 'rgba(76, 36, 58, 0.58)'; ctx.lineWidth = 4.5;
      ctx.beginPath(); ctx.moveTo(bx - 120, deckY); ctx.lineTo(bx + 1240, deckY); ctx.stroke();
      // Twin A-frame bridge towers
      for (const tx of [t1, t2]) {
        ctx.fillStyle = 'rgba(88, 38, 62, 0.68)';
        ctx.fillRect(tx - 6, deckY - 122, 5, 145);
        ctx.fillRect(tx + 7, deckY - 122, 5, 145);
        ctx.fillRect(tx - 6, deckY - 110, 18, 5);
        ctx.fillRect(tx - 6, deckY - 62, 18, 5);
      }
      // Graceful catenary suspension cables & vertical suspenders
      ctx.strokeStyle = 'rgba(253, 186, 116, 0.45)'; ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(bx - 80, deckY); ctx.quadraticCurveTo(t1 - 90, deckY - 12, t1 + 3, deckY - 120);
      ctx.quadraticCurveTo((t1 + t2) * 0.5, deckY - 10, t2 + 3, deckY - 120);
      ctx.quadraticCurveTo(t2 + 95, deckY - 12, bx + 1200, deckY);
      ctx.stroke();
    }

    // Monumental Historic Peninsula Silhouette with Detailed Sultanahmet / Hagia Sophia Domes & 6 Minarets!
    const mOff = -((camX * 0.11) % 1360);
    for (let mx = mOff - 1360; mx < w + 1360; mx += 1360) {
      // Distant Anatolian & Historic Peninsula rolling hill ridge
      const hillG = ctx.createLinearGradient(0, 355, 0, 480);
      hillG.addColorStop(0, '#4c2640'); hillG.addColorStop(1, '#26142a');
      ctx.fillStyle = hillG;
      ctx.beginPath();
      ctx.moveTo(mx, 485);
      ctx.bezierCurveTo(mx + 220, 382, mx + 520, 360, mx + 760, 390);
      ctx.bezierCurveTo(mx + 1020, 420, mx + 1200, 372, mx + 1360, 485);
      ctx.closePath(); ctx.fill();

      // Blue Mosque / Sultanahmet Grand Complex (Multi-tiered Ribbed Domes + 6 Pencil Minarets)
      const cx = mx + 520, by = 408;
      drawOttomanMinaret(ctx, cx - 138, by + 6, 138, 7.5);
      drawOttomanMinaret(ctx, cx - 96, by + 4, 152, 8.2);
      drawOttomanMinaret(ctx, cx - 54, by + 2, 162, 8.5);
      drawOttomanMinaret(ctx, cx + 54, by + 2, 162, 8.5);
      drawOttomanMinaret(ctx, cx + 96, by + 4, 152, 8.2);
      drawOttomanMinaret(ctx, cx + 138, by + 6, 138, 7.5);
      // Courtyard masonry base & arched portico
      ctx.fillStyle = '#3b1d34'; ctx.fillRect(cx - 120, by - 32, 240, 44);
      // Cascading semi-domes + grand central dome
      drawOttomanDome(ctx, cx - 64, by - 26, 36, 26, '#7c3f58', '#3b1d34');
      drawOttomanDome(ctx, cx + 64, by - 26, 36, 26, '#7c3f58', '#3b1d34');
      drawOttomanDome(ctx, cx - 32, by - 36, 44, 34, '#924c66', '#45223d');
      drawOttomanDome(ctx, cx + 32, by - 36, 44, 34, '#924c66', '#45223d');
      drawOttomanDome(ctx, cx, by - 46, 56, 48, '#b06478', '#4c2640');
    }
  }

  // =========================================================================
  // 2. ISTANBUL MIDGROUND WITH BUILT-IN 60FPS OFFSCREEN CANVAS TILE BAKING!
  // =========================================================================
  let istanbulFarCache = null;
  let istanbulMidCache = null;

  function drawIstanbulMidground(mainCtx, camX, w, h, time) {
    const farSpan = 1640, farPad = 120;
    const midSpan = 1600, midPad = 120;

    // --- LAYER 1 (0.24x Parallax): Baked Balat Cumba Hills + Monumental Galata Tower ---
    if (!istanbulFarCache && typeof document !== 'undefined' && document.createElement) {
      istanbulFarCache = makeOffscreen(farSpan + farPad * 2, 640, (ctx) => {
        const vx = farPad;
        // Rolling Karaköy / Beyoğlu green-and-ochre hillside
        const hG = ctx.createLinearGradient(0, 355, 0, 565);
        hG.addColorStop(0, '#5b4238'); hG.addColorStop(0.55, '#3b2a28'); hG.addColorStop(1, '#1e161c');
        ctx.fillStyle = hG;
        ctx.beginPath();
        ctx.moveTo(vx - 60, 570);
        ctx.bezierCurveTo(vx + 220, 415, vx + 540, 368, vx + 840, 398);
        ctx.bezierCurveTo(vx + 1140, 428, vx + 1420, 385, vx + farSpan + 60, 570);
        ctx.closePath(); ctx.fill();

        // Monumental Galata Tower crowning the hillside!
        drawGalataTowerLandmark(ctx, vx + 640, 465, 0.72);

        // Colorful Balat & Karaköy Ottoman Cumba Wooden Bay-Window Houses clustered along the hill!
        drawBalatCumbaHouse(ctx, vx + 80, 515, 92, 138, '#f59e0b', '#b45309', '#fef3c7');
        drawBalatCumbaHouse(ctx, vx + 182, 505, 84, 128, '#e11d48', '#9f1239', '#fde68a');
        drawBalatCumbaHouse(ctx, vx + 278, 498, 96, 144, '#0284c7', '#0369a1', '#e0f2fe');
        drawBalatCumbaHouse(ctx, vx + 388, 508, 86, 132, '#10b981', '#047857', '#d1fae5');
        drawBalatCumbaHouse(ctx, vx + 770, 504, 94, 140, '#f97316', '#c2410c', '#ffedd5');
        drawBalatCumbaHouse(ctx, vx + 878, 512, 88, 132, '#6366f1', '#4338ca', '#e0e7ff');
        drawBalatCumbaHouse(ctx, vx + 980, 500, 96, 142, '#eab308', '#a16207', '#fef9c3');
        drawBalatCumbaHouse(ctx, vx + 1092, 514, 90, 130, '#ec4899', '#be185d', '#fce7f3');
        drawBalatCumbaHouse(ctx, vx + 1200, 506, 94, 138, '#14b8a6', '#0f766e', '#ccfbf1');
        drawBalatCumbaHouse(ctx, vx + 1312, 516, 86, 126, '#d97706', '#92400e', '#fef3c7');
        drawBalatCumbaHouse(ctx, vx + 1418, 512, 92, 134, '#3b82f6', '#1d4ed8', '#dbeafe');
      });
    }
    if (istanbulFarCache) {
      const farOff = -(((camX * 0.24) % farSpan) + farSpan) % farSpan;
      for (let bx = farOff - farSpan; bx < w + farSpan; bx += farSpan) {
        if (bx + farSpan + farPad < 0 || bx - farPad > w) continue;
        mainCtx.drawImage(istanbulFarCache, bx - farPad, 0);
      }
    }

    // --- LAYER 2 (0.42x Parallax): Baked Galata Bridge Arches, Bazaar Portals & Continuous Bosphorus Water ---
    if (!istanbulMidCache && typeof document !== 'undefined' && document.createElement) {
      istanbulMidCache = makeOffscreen(midSpan + midPad * 2, 680, (ctx) => {
        const vx = midPad;

        // Continuous deep Bosphorus Strait water surface (y = 530..680)
        const seaG = ctx.createLinearGradient(0, 526, 0, 680);
        seaG.addColorStop(0.0, '#1e3a5f');
        seaG.addColorStop(0.35, '#172554');
        seaG.addColorStop(1.0, '#0c142c');
        ctx.fillStyle = seaG;
        ctx.fillRect(0, 526, midSpan + midPad * 2, 154);

        // Galata Bridge Double-Deck Stone & Steel Arched Promenade (y = 468..542)
        const brG = ctx.createLinearGradient(0, 466, 0, 540);
        brG.addColorStop(0, '#c8a986'); brG.addColorStop(0.5, '#8c6d53'); brG.addColorStop(1, '#4a3528');
        ctx.fillStyle = brG; ctx.strokeStyle = '#1f1510'; ctx.lineWidth = 1.6;
        ctx.fillRect(vx - 40, 468, midSpan + 80, 18);
        ctx.strokeRect(vx - 40, 468, midSpan + 80, 18);

        // Ornate wrought-iron Galata Bridge railing + fishing rods leaning over the Bosphorus
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2.0;
        ctx.beginPath(); ctx.moveTo(vx - 40, 456); ctx.lineTo(vx + midSpan + 40, 456); ctx.stroke();
        for (let rx = vx; rx < vx + midSpan; rx += 22) {
          ctx.beginPath(); ctx.moveTo(rx, 456); ctx.lineTo(rx, 468); ctx.stroke();
        }

        // Arched bridge piers plunging into the Bosphorus
        for (let ax = vx; ax < vx + midSpan; ax += 200) {
          ctx.fillStyle = '#5c4636'; ctx.strokeStyle = '#1f1510'; ctx.lineWidth = 1.6;
          ctx.fillRect(ax, 486, 26, 60); ctx.strokeRect(ax, 486, 26, 60);
          // Graceful bridge arch between piers
          ctx.beginPath();
          ctx.moveTo(ax + 26, 486); ctx.lineTo(ax + 200, 486);
          ctx.lineTo(ax + 200, 514);
          ctx.quadraticCurveTo(ax + 113, 476, ax + 26, 514);
          ctx.closePath(); ctx.fill(); ctx.stroke();

          // Warm hanging Turkish Mosaic Lamp under each bridge arch
          const lx = ax + 113, ly = 496;
          const lg = ctx.createRadialGradient(lx, ly, 2, lx, ly, 24);
          lg.addColorStop(0, 'rgba(253, 224, 71, 0.72)'); lg.addColorStop(1, 'rgba(249, 115, 22, 0)');
          ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(lx, ly, 24, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = (Math.round(ax / 200) % 2 === 0) ? '#38bdf8' : '#f43f5e';
          ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(lx, ly, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

          // Classic Ottoman wrought-iron lamppost above pier
          ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2.6;
          ctx.beginPath(); ctx.moveTo(ax + 13, 468); ctx.lineTo(ax + 13, 422); ctx.stroke();
          const pg = ctx.createRadialGradient(ax + 13, 418, 2, ax + 13, 418, 26);
          pg.addColorStop(0, 'rgba(254, 240, 138, 0.85)'); pg.addColorStop(1, 'rgba(251, 146, 60, 0)');
          ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(ax + 13, 418, 26, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fef9c3'; ctx.beginPath(); ctx.arc(ax + 13, 418, 4.5, 0, Math.PI * 2); ctx.fill();
        }
      });
    }
    if (istanbulMidCache) {
      const midOff = -(((camX * 0.42) % midSpan) + midSpan) % midSpan;
      for (let bx = midOff - midSpan; bx < w + midSpan; bx += midSpan) {
        if (bx + midSpan + midPad < 0 || bx - midPad > w) continue;
        mainCtx.drawImage(istanbulMidCache, bx - midPad, 0);
      }
    }

    // --- LAYER 3 (LIVE 60FPS LIGHTWEIGHT ANIMATED OVERLAY — < 250 draw calls/frame!) ---
    // 1. Live Classic Red Istiklal Nostalgic Tram gliding across the Galata Bridge promenade!
    const tramX = ((time * 95 - camX * 0.42) % (w + 460) + (w + 460)) % (w + 460) - 220;
    const tramY = 424;
    mainCtx.save();
    mainCtx.translate(tramX, tramY);
    // Pantograph reaching overhead wire
    mainCtx.strokeStyle = '#cbd5e1'; mainCtx.lineWidth = 1.6;
    mainCtx.beginPath(); mainCtx.moveTo(46, 0); mainCtx.lineTo(54, -14); mainCtx.lineTo(62, 0); mainCtx.stroke();
    // Glossy crimson Istiklal tram body
    const trG = mainCtx.createLinearGradient(0, 0, 0, 42);
    trG.addColorStop(0, '#ef4444'); trG.addColorStop(0.55, '#b91c1c'); trG.addColorStop(1, '#7f1d1d');
    mainCtx.fillStyle = trG; mainCtx.strokeStyle = '#1e1b18'; mainCtx.lineWidth = 1.6;
    mainCtx.beginPath(); mainCtx.roundRect(0, 0, 112, 42, [8, 8, 2, 2]); mainCtx.fill(); mainCtx.stroke();
    // Cream roof & warm glowing passenger windows
    mainCtx.fillStyle = '#fef3c7'; mainCtx.fillRect(4, 2, 104, 5);
    for (let wi = 0; wi < 4; wi++) {
      mainCtx.fillStyle = '#fde68a'; mainCtx.fillRect(12 + wi * 24, 11, 17, 14);
      mainCtx.strokeStyle = '#7f1d1d'; mainCtx.strokeRect(12 + wi * 24, 11, 17, 14);
    }
    // Glowing brass front headlamp
    mainCtx.fillStyle = '#fef08a';
    mainCtx.beginPath(); mainCtx.arc(112, 30, 4.2, 0, Math.PI * 2); mainCtx.fill();
    mainCtx.restore();

    // 2. Live White Bosphorus Passenger Ferry (Vapur) gliding inside continuous Bosphorus water!
    const vapX = w + 180 - (((time * 42 + camX * 0.36) % (w + 420) + (w + 420)) % (w + 420));
    const vapY = 556 + Math.sin(time * 2.2) * 2.2;
    mainCtx.save();
    mainCtx.translate(vapX, vapY);
    // Delicate hull-hugging white wake lines on the stationary water
    mainCtx.strokeStyle = 'rgba(224, 242, 254, 0.42)'; mainCtx.lineWidth = 1.6;
    mainCtx.beginPath();
    mainCtx.moveTo(136, 20); mainCtx.quadraticCurveTo(175, 22, 215, 25);
    mainCtx.moveTo(132, 24); mainCtx.quadraticCurveTo(165, 27, 198, 29);
    mainCtx.stroke();
    // Crisp white Vapur hull + dark navy waterline
    mainCtx.fillStyle = '#f8fafc'; mainCtx.strokeStyle = '#1e293b'; mainCtx.lineWidth = 1.5;
    mainCtx.beginPath();
    mainCtx.moveTo(0, 10); mainCtx.lineTo(138, 10); mainCtx.lineTo(130, 23); mainCtx.lineTo(12, 23);
    mainCtx.closePath(); mainCtx.fill(); mainCtx.stroke();
    mainCtx.fillStyle = '#1e3a8a'; mainCtx.fillRect(10, 18, 122, 5);
    // Double-deck passenger cabin + iconic yellow-and-black Istanbul ferry smokestack
    mainCtx.fillStyle = '#ffffff'; mainCtx.fillRect(22, -4, 92, 14); mainCtx.strokeRect(22, -4, 92, 14);
    mainCtx.fillStyle = '#fef08a';
    for (let p = 0; p < 6; p++) mainCtx.fillRect(28 + p * 14, -1, 9, 7);
    mainCtx.fillStyle = '#f59e0b'; mainCtx.fillRect(58, -22, 14, 18); mainCtx.strokeRect(58, -22, 14, 18);
    mainCtx.fillStyle = '#0f172a'; mainCtx.fillRect(58, -22, 14, 5);
    mainCtx.restore();

    // 3. Golden Sunset Water Shimmer across the Bosphorus
    mainCtx.fillStyle = 'rgba(254, 215, 170, 0.24)';
    for (let s = 0; s < 14; s++) {
      const sx = ((s * 117 - camX * 0.22 + Math.sin(time * 1.5 + s) * 14) % w + w) % w;
      const sy = 538 + (s % 5) * 18;
      mainCtx.fillRect(sx, sy, 34 + (s % 3) * 14, 2.2);
    }
  }

  // =========================================================================
  // 3. MONUMENTAL GALATA TOWER & IMPERIAL ARCH FINISH GATE
  // =========================================================================
  function drawIstanbulGalataGate(ctx, g, gx, gy, time, label) {
    ctx.save();
    const cx = gx + g.w * 0.5;
    const botY = gy + g.h;

    // Towering Galata Tower silhouette behind the stone triumphal arch
    drawGalataTowerLandmark(ctx, cx, botY, 0.56);

    // Ornate Ottoman Ashlar Limestone Arch Frame
    const archG = ctx.createLinearGradient(gx, gy, gx + g.w, botY);
    archG.addColorStop(0, '#f5e1c3'); archG.addColorStop(0.5, '#d4af84'); archG.addColorStop(1, '#8c6642');
    ctx.fillStyle = archG; ctx.strokeStyle = '#29170d'; ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(gx, botY); ctx.lineTo(gx, gy + 18);
    ctx.quadraticCurveTo(cx, gy - 12, gx + g.w, gy + 18);
    ctx.lineTo(gx + g.w, botY); ctx.lineTo(gx + g.w - 22, botY);
    ctx.lineTo(gx + g.w - 22, gy + 44);
    ctx.arc(cx, gy + 44, g.w * 0.5 - 22, 0, Math.PI, true);
    ctx.lineTo(gx + 22, botY); ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Glowing Iznik-turquoise & gold portal shimmer inside arch
    const pGlow = ctx.createRadialGradient(cx, botY - 38, 6, cx, botY - 38, 56);
    pGlow.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
    pGlow.addColorStop(0.55, 'rgba(56, 189, 248, 0.35)');
    pGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = pGlow;
    ctx.beginPath(); ctx.arc(cx, botY - 38, 56, 0, Math.PI * 2); ctx.fill();

    // Crimson Ottoman Welcome Carpet at threshold
    ctx.fillStyle = '#b91c1c'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.6;
    ctx.fillRect(gx + 16, botY - 6, g.w - 32, 8);
    ctx.strokeRect(gx + 16, botY - 6, g.w - 32, 8);

    // Floating Heritage Nameplate ("برج غلطة • إسطنبول" / "GALATA TOWER • ISTANBUL")
    const isEn = window.Game.I18n && window.Game.I18n.isEn();
    const text = isEn ? 'GALATA TOWER • ISTANBUL' : (label || 'برج غلطة • إسطنبول');
    const bob = Math.sin(time * 2.6) * 3;
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    const tw = Math.max(185, ctx.measureText(text).width + 30);
    ctx.fillStyle = 'rgba(136, 19, 55, 0.92)';
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.roundRect(cx - tw * 0.5, gy - 40 + bob, tw, 24, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fef08a';
    ctx.fillText(text, cx, gy - 24 + bob);
    ctx.restore();
  }

  // =========================================================================
  // 4. EIGHT HANDCRAFTED ISTANBUL FOREGROUND PLATFORMS & INTERACTIVE PROPS
  // =========================================================================
  function drawIstanbulPlatform(ctx, p, px, py, nv, time) {
    if (p.type === 'istanbul_quay') {
      // Karaköy / Galata Stone Waterfront Quay with Dressed Ashlar Blocks, Iznik Tile Border & Iron Bollards
      ctx.save();
      ctx.translate(px, py);
      const qG = ctx.createLinearGradient(0, 0, 0, p.h);
      qG.addColorStop(0, '#d6c5ad'); qG.addColorStop(0.22, '#a89279'); qG.addColorStop(1, '#574638');
      ctx.fillStyle = qG; ctx.fillRect(0, 0, p.w, p.h);
      // Turquoise Iznik ceramic trim band along upper promenade curb
      ctx.fillStyle = '#0284c7'; ctx.fillRect(0, 0, p.w, 8);
      ctx.fillStyle = '#fde047';
      for (let tx = 8; tx < p.w - 8; tx += 24) ctx.fillRect(tx, 2, 10, 4);
      // Staggered stone masonry courses
      ctx.strokeStyle = 'rgba(35, 22, 14, 0.32)'; ctx.lineWidth = 1.2;
      for (let ry = 18; ry < p.h; ry += 20) {
        ctx.beginPath(); ctx.moveTo(0, ry); ctx.lineTo(p.w, ry); ctx.stroke();
        const off = ((ry / 20) % 2) * 28;
        for (let cx = off; cx < p.w; cx += 56) {
          ctx.beginPath(); ctx.moveTo(cx, ry); ctx.lineTo(cx, Math.min(p.h, ry + 20)); ctx.stroke();
        }
      }
      ctx.strokeStyle = '#291a10'; ctx.lineWidth = 1.8; ctx.strokeRect(0, 0, p.w, p.h);
      ctx.restore();
      return true;
    }

    if (p.type === 'istanbul_bazaar_floor') {
      // Grand Bazaar Vaulted Marble & Terracotta Cobblestone Promenade with Golden Ottoman Molding
      ctx.save();
      ctx.translate(px, py);
      const bG = ctx.createLinearGradient(0, 0, 0, p.h);
      bG.addColorStop(0, '#f3dfc1'); bG.addColorStop(0.35, '#c79a6b'); bG.addColorStop(1, '#6b4226');
      ctx.fillStyle = bG; ctx.fillRect(0, 0, p.w, p.h);
      // Crimson-and-gold Grand Bazaar cornice strip
      ctx.fillStyle = '#9f1239'; ctx.fillRect(0, 0, p.w, 7);
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(0, 6, p.w, 2.5);
      // Carved stone blocks
      ctx.strokeStyle = 'rgba(55, 25, 10, 0.28)'; ctx.lineWidth = 1.1;
      for (let cx = 36; cx < p.w; cx += 36) {
        ctx.beginPath(); ctx.moveTo(cx, 8); ctx.lineTo(cx, p.h); ctx.stroke();
      }
      ctx.strokeStyle = '#3b1d0c'; ctx.lineWidth = 1.6; ctx.strokeRect(0, 0, p.w, p.h);
      ctx.restore();
      return true;
    }

    if (p.type === 'istanbul_balat_wall') {
      // Climbable Balat Ottoman Timber-Framed Stone Wall with Grip Ledges & Wall-Climb Emblem
      ctx.save();
      ctx.translate(px, py);
      const wG = ctx.createLinearGradient(0, 0, p.w, 0);
      wG.addColorStop(0, '#d97706'); wG.addColorStop(0.5, '#b45309'); wG.addColorStop(1, '#78350f');
      ctx.fillStyle = wG; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.8;
      ctx.fillRect(0, 0, p.w, p.h); ctx.strokeRect(0, 0, p.w, p.h);
      // Wooden cross-timbers for clear visual climbability
      ctx.fillStyle = '#fef3c7';
      for (let ry = 18; ry < p.h - 14; ry += 26) {
        ctx.fillRect(3, ry, p.w - 6, 4);
      }
      // Clear climb indicator chevron
      ctx.fillStyle = '#fde047'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('⬆', p.w * 0.5, 16);
      ctx.restore();
      return true;
    }

    if (p.type === 'istanbul_bazaar_awning') {
      // Springy Scalloped Crimson-and-Gold Grand Bazaar Canopy Awning with Golden Tassels
      const dip = p.bounceAnim ? Math.sin(p.bounceAnim * Math.PI) * 9 : 0;
      ctx.save();
      ctx.translate(px, py + dip);
      // Wrought-iron side wall brackets
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.moveTo(8, 6); ctx.lineTo(8, 28); ctx.moveTo(p.w - 8, 6); ctx.lineTo(p.w - 8, 28);
      ctx.stroke();
      // Alternating crimson & warm cream stripes
      const stripes = 7, sw = p.w / stripes;
      for (let i = 0; i < stripes; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#be123c' : '#fef3c7';
        ctx.strokeStyle = '#4c0519'; ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(i * sw, 0); ctx.lineTo((i + 1) * sw, 0);
        ctx.lineTo((i + 1) * sw, 18);
        ctx.arc(i * sw + sw * 0.5, 18, sw * 0.5, 0, Math.PI);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      // Golden top bounce rim sheen
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(2, 0, p.w - 4, 3.5);
      ctx.restore();
      return true;
    }

    if (p.type === 'istanbul_tram_car') {
      // Rideable Classic Red Istiklal Nostalgic Tram Roof + Overhead Catenary Wire & Pantograph!
      ctx.save();
      ctx.translate(px, py);
      // Overhead catenary wire & spring pantograph
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.55)'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(-40, -34); ctx.lineTo(p.w + 40, -34); ctx.stroke();
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(p.w * 0.42, 0); ctx.lineTo(p.w * 0.5, -34); ctx.lineTo(p.w * 0.58, 0);
      ctx.stroke();
      // Cream roof boarding deck (solid visual footing!)
      ctx.fillStyle = '#fef3c7'; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.roundRect(0, 0, p.w, 10, [6, 6, 0, 0]); ctx.fill(); ctx.stroke();
      // Glossy crimson nostalgic tram cabin below deck
      const tG = ctx.createLinearGradient(0, 10, 0, 56);
      tG.addColorStop(0, '#ef4444'); tG.addColorStop(0.55, '#be123c'); tG.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = tG;
      ctx.beginPath(); ctx.roundRect(4, 10, p.w - 8, 44, [0, 0, 6, 6]); ctx.fill(); ctx.stroke();
      // Golden brass trim + warm illuminated windows
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(6, 36, p.w - 12, 3.5);
      for (let wx = 16; wx < p.w - 28; wx += 30) {
        ctx.fillStyle = '#fde68a'; ctx.fillRect(wx, 15, 22, 17);
        ctx.strokeStyle = '#4c0519'; ctx.strokeRect(wx, 15, 22, 17);
      }
      // Glowing front headlamp in direction of travel
      const headX = (p.moveDir || 1) >= 0 ? p.w - 4 : 4;
      ctx.fillStyle = '#fef08a';
      ctx.beginPath(); ctx.arc(headX, 42, 5.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      return true;
    }

    if (p.type === 'istanbul_vapur_boat') {
      // Rideable Traditional White Bosphorus Vapur Ferry (Floats cleanly inside continuous water!)
      ctx.save();
      ctx.translate(px, py);
      // Delicate hull-hugging white wake lines (NO rectangular water block!)
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.55)'; ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(-14, 34); ctx.quadraticCurveTo(p.w * 0.5, 42, p.w + 14, 34);
      ctx.stroke();
      // Warm teakwood boarding deck
      ctx.fillStyle = '#d97706'; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.roundRect(4, 0, p.w - 8, 9, [4, 4, 0, 0]); ctx.fill(); ctx.stroke();
      // Crisp white hull with navy-blue Bosphorus stripe & brass portholes
      const hG = ctx.createLinearGradient(0, 9, 0, 36);
      hG.addColorStop(0, '#ffffff'); hG.addColorStop(0.65, '#e2e8f0'); hG.addColorStop(1, '#1e3a8a');
      ctx.fillStyle = hG;
      ctx.beginPath();
      ctx.moveTo(0, 9); ctx.lineTo(p.w, 9); ctx.lineTo(p.w - 14, 34); ctx.lineTo(14, 34);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      for (let hx = 28; hx < p.w - 22; hx += 28) {
        ctx.fillStyle = '#fde68a'; ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(hx, 20, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      // Iconic yellow-and-black ferry smokestack rising gently at rear
      ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.5;
      ctx.fillRect(p.w * 0.5 - 9, -24, 18, 24); ctx.strokeRect(p.w * 0.5 - 9, -24, 18, 24);
      ctx.fillStyle = '#0f172a'; ctx.fillRect(p.w * 0.5 - 9, -24, 18, 6);
      ctx.restore();
      return true;
    }

    if (p.type === 'istanbul_samovar_vent') {
      // Ornate Hammered-Copper Ottoman Turkish Tea Samovar (سماور الشاي التركي) with Updraft Steam Plume!
      ctx.save();
      ctx.translate(px + p.w * 0.5, py + p.h);
      // Warm steam updraft plume rising skyward when active
      if (p.steamActive) {
        for (let k = 0; k < 7; k++) {
          const frac = ((time * 1.45 + k / 7) % 1);
          const sy = -72 - frac * 205;
          const sx = Math.sin(time * 5 + k * 1.7) * (8 + frac * 12);
          const r = 10 + frac * 18;
          ctx.fillStyle = `rgba(240, 249, 255, ${(1 - frac) * (p.boostTimer > 0 ? 0.58 : 0.42)})`;
          ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill();
        }
      } else if (p.steamWarn) {
        // Golden whistle telegraph puff before updraft fires
        ctx.fillStyle = 'rgba(254, 240, 138, 0.55)';
        ctx.beginPath(); ctx.arc(0, -78, 9 + Math.sin(time * 18) * 3, 0, Math.PI * 2); ctx.fill();
      }
      // Stone pedestal & glowing charcoal firebox
      ctx.fillStyle = '#475569'; ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.6;
      ctx.fillRect(-24, -14, 48, 14); ctx.strokeRect(-24, -14, 48, 14);
      ctx.fillStyle = '#f97316'; ctx.fillRect(-10, -11, 20, 7);
      // Sculpted hammered-copper Samovar urn body
      const cG = ctx.createLinearGradient(-22, -62, 22, -14);
      cG.addColorStop(0.0, '#fed7aa'); cG.addColorStop(0.35, '#ea580c'); cG.addColorStop(0.75, '#9a3412'); cG.addColorStop(1.0, '#431407');
      ctx.fillStyle = cG; ctx.strokeStyle = '#291005'; ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-16, -14); ctx.bezierCurveTo(-26, -28, -24, -52, -12, -62);
      ctx.lineTo(12, -62); ctx.bezierCurveTo(24, -52, 26, -28, 16, -14);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // Porcelain Ottoman teapot (Demlik) perched atop the Samovar
      ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = '#0284c7'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.ellipse(0, -68, 11, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
      return true;
    }

    if (p.type === 'istanbul_simit_vendor') {
      // Friendly Istanbul Simitçi (بائع السميط) with Red Glass-Topped Cart & Golden Sesame Simit Rings (+1 💜!)
      ctx.save();
      ctx.translate(px, py + p.h);
      // Friendly smiling vendor behind cart
      ctx.fillStyle = '#fef3c7'; ctx.strokeStyle = '#291509'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.roundRect(38, -74, 28, 30, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#0284c7'; ctx.fillRect(41, -72, 22, 24);
      ctx.fillStyle = '#f1c29b'; ctx.beginPath(); ctx.arc(52, -83, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#be123c'; ctx.beginPath(); ctx.roundRect(43, -95, 18, 8, 2); ctx.fill(); ctx.stroke();

      // Classic Red Istanbul Simit Cart with spoked wheels & glass showcase
      ctx.fillStyle = '#dc2626'; ctx.strokeStyle = '#450a0a'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.roundRect(14, -44, 86, 28, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fef08a'; ctx.font = 'bold 9.5px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('SİMİT', 57, -27);
      // Glass display case stacked with golden sesame Simit rings!
      ctx.fillStyle = 'rgba(224, 242, 254, 0.35)'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.6;
      ctx.fillRect(18, -68, 78, 24); ctx.strokeRect(18, -68, 78, 24);
      for (let r = 0; r < 5; r++) {
        ctx.strokeStyle = '#b45309'; ctx.lineWidth = 4.2;
        ctx.beginPath(); ctx.arc(28 + r * 14, -54, 6.2, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.arc(28 + r * 14, -54, 6.2, 0, Math.PI * 2); ctx.stroke();
      }
      // Spoked wooden cart wheels
      for (const wx of [30, 84]) {
        ctx.fillStyle = '#78350f'; ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 2.0;
        ctx.beginPath(); ctx.arc(wx, -12, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(wx, -12, 3, 0, Math.PI * 2); ctx.fill();
      }
      // Floating Purple Extra-Life Heart indicator until gifted!
      if (!p.gifted) {
        const hb = Math.sin(time * 4.2) * 4;
        ctx.font = '18px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('💜', 57, -104 + hb);
      }
      ctx.restore();
      return true;
    }

    return false;
  }

  Art.drawIstanbulSkyAndHorizon = drawIstanbulSkyAndHorizon;
  Art.drawIstanbulMidground = drawIstanbulMidground;
  Art.drawIstanbulGalataGate = drawIstanbulGalataGate;
  Art.drawPlatform = function (ctx, p, px, py, nv, time) {
    if (p && p.type && p.type.startsWith('istanbul_')) {
      if (drawIstanbulPlatform(ctx, p, px, py, nv, time)) return;
    }
    return prevDrawPlatform(ctx, p, px, py, nv, time);
  };
})();
