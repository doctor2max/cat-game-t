/* ============================================================================
   STAGE 27 ART ENGINE: ISTANBUL, TURKEY (إسطنبول • مضيق البوسفور، جسر غلطة والبازار الكبير)
   MUSEUM-GRADE ARCHITECTURAL REALISM + 60FPS TILE BAKING + LIVING BOSPHORUS SPECTACLE:
     • Horizon: Sunset God-Rays, Crescent Moon, 15 July Martyrs Bosphorus Suspension
       Bridge (3D H-Pylons, Shifting LEDs, Streaming Traffic), Ortaköy Baroque Mosque,
       Sultanahmet Blue Mosque (6 Fluted Minarets + Cascading Semi-Domes + Lit Mahya),
       and Hagia Sophia (Byzantine Buttresses + 40-Window Golden Dome)
     • Far Panorama (0.22x Baked): Rumeli Hisarı Fortress Towers, Genoese Ashlar
       Galata Tower, Stacked Colorful Balat Cumba Houses with Strung Mosaic Lanterns,
       and Maiden's Tower (Kız Kulesi) on Foam-Kissed Rocky Islet
     • Midground (0.42x Baked + 60fps Live Overlay): Double-Deck Galata Bridge with
       Balık-Ekmek Waterfront Restaurants & Mosaic Chandeliers, Deep Bosphorus Strait,
       Two-Plane Cruise & Şehir Hatları Vapur Ferry with Fluttering Turkish Flag,
       Leaping Bosphorus Dolphins, Animated Casting Fishermen & Red Istiklal Tram
     • Foreground Wonders & Authentic Istanbul Obstacles:
       - Shimmering Foreground Bosphorus Sea Channels & Ottoman Sebil Checkpoints
       - Speeding Istiklal Red Streetcar Crossing (معبر ترام الاستقلال السريع)
       - Sizzling Eminönü Balık-Ekmek & Charcoal Kebab Brazier (مشواة رصيف البوسفور)
       - Twin-Leaf Rotating Galata Bascule Drawbridge + Passing Steamer Funnel
       - Basilica Cistern Inverted Marble Medusa Column & Water Surge (صهريج ميدوسا)
       - Swinging Grand Bazaar Ablaq Arch & Pierced Tombak Censer (مبخرة البازار)
       - Pier-Side Galata Angler Hoisting Wooden Bosphorus Skiff Buoy
       - Ottoman Hammam Kurna Valve & Pressurized Marble Steam Lift, Çay Samovars,
         Kilim Spring Awnings, Swinging Mosaic Chandeliers & Friendly Simitçi (+1 💜)
   ============================================================================ */
(function () {
  'use strict';
  window.Game = window.Game || {};
  const Art = window.Game.Art;
  if (!Art) return;

  const prevDrawPlatform = Art.drawPlatform;
  const prevDrawCheckpoint = Art.drawCheckpoint;

  const STONE_WARM = ['#e4d6c1', '#d6c4aa', '#ece0cd', '#c7b296', '#dccab0', '#baa386'];
  const STONE_COOL = ['#d2dce8', '#beccdc', '#e2eaf2', '#a8b8cb', '#c6d3e2', '#94a6bc'];
  const MARBLE_PAL = ['#f8fafc', '#eef2f6', '#e2e8f0', '#f1f5f9', '#dbe4ee', '#cbd5e1'];

  function makeOffscreen(w, h, fn) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const cctx = c.getContext('2d');
    fn(cctx, w, h);
    return c;
  }

  function fillAshlarMasonry(ctx, x, y, w, h, rowH, blkW, pal, seed, minBx, maxBx) {
    const rows = Math.ceil(h / rowH);
    const lo = minBx !== undefined ? minBx : -blkW;
    const hi = maxBx !== undefined ? maxBx : w + blkW;
    for (let r = 0; r < rows; r++) {
      const ry = y + r * rowH;
      const off = (r % 2) * (blkW * 0.5);
      for (let bx = -blkW + off; bx < w + blkW; bx += blkW) {
        if (bx + blkW < lo || bx > hi) continue;
        const idx = Math.abs(seed + r * 13 + Math.floor(bx / blkW) * 19) % pal.length;
        ctx.fillStyle = pal[idx];
        ctx.fillRect(x + bx + 0.8, ry + 0.8, blkW - 1.6, rowH - 1.6);
        ctx.fillStyle = 'rgba(255, 251, 238, 0.24)';
        ctx.fillRect(x + bx + 1.0, ry + 1.0, blkW - 2.0, 1.4);
        ctx.fillStyle = 'rgba(24, 15, 10, 0.22)';
        ctx.fillRect(x + bx + 0.8, ry + rowH - 1.6, blkW - 1.6, 1.4);
      }
    }
  }

  function drawTurkishFlag(ctx, x, y, w, h, time, phase) {
    const wave = Math.sin(time * 6.5 + (phase || 0)) * 2.2;
    ctx.save();
    ctx.fillStyle = '#e11d48';
    ctx.strokeStyle = '#881337';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + w * 0.5, y + wave, x + w, y + wave * 0.6);
    ctx.lineTo(x + w, y + h + wave * 0.6);
    ctx.quadraticCurveTo(x + w * 0.5, y + h + wave, x, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // White Crescent & Star
    const cy = y + h * 0.5 + wave * 0.35;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + w * 0.38, cy, h * 0.27, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.arc(x + w * 0.44, cy, h * 0.21, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + w * 0.64, cy, h * 0.11, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawOttomanDome(ctx, cx, baseY, rx, ry, colTop, colBot, showWindows, showFinial) {
    const topY = baseY - ry;
    const drawProfile = () => {
      ctx.beginPath();
      ctx.moveTo(cx - rx, baseY);
      ctx.bezierCurveTo(cx - rx, baseY - ry * 0.62, cx - rx * 0.46, baseY - ry * 0.98, cx, topY);
      ctx.bezierCurveTo(cx + rx * 0.46, baseY - ry * 0.98, cx + rx, baseY - ry * 0.62, cx + rx, baseY);
      ctx.closePath();
    };

    ctx.save();
    // 1. 3D Spherical Weathered-Lead Shading (sunlit upper-right pearl sheen -> cool slate shadow)
    const rg = ctx.createRadialGradient(cx + rx * 0.28, baseY - ry * 0.62, rx * 0.08, cx - rx * 0.08, baseY - ry * 0.35, Math.max(rx, ry) * 1.28);
    rg.addColorStop(0.00, '#ffffff');
    rg.addColorStop(0.22, colTop);
    rg.addColorStop(0.64, colBot);
    rg.addColorStop(1.00, '#1e293b');
    ctx.fillStyle = rg;
    drawProfile();
    ctx.fill();

    // Clip interior details (meridian lead ribs, horizontal sheet seams, specular sheen, drum windows)
    ctx.save();
    drawProfile();
    ctx.clip();

    // Subtle horizontal lead-cladding seam courses curving in 3D perspective
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.16)';
    ctx.lineWidth = 0.8;
    for (const frac of [0.28, 0.56, 0.80]) {
      const sy = baseY - ry * frac;
      ctx.beginPath();
      ctx.moveTo(cx - rx, sy);
      ctx.quadraticCurveTo(cx, sy + ry * 0.09, cx + rx, sy);
      ctx.stroke();
    }

    // 3D-Projected Meridian Lead Ribs (Kaburga) using sin-spaced spherical projection
    const ribCount = rx >= 38 ? 5 : 3;
    for (let r = -ribCount; r <= ribCount; r++) {
      const u = Math.sin((r / (ribCount + 1)) * (Math.PI * 0.5));
      const bx = cx + u * rx;
      const ctrlX = cx + u * rx * 0.72;
      const ctrlY = baseY - ry * 0.64;
      ctx.strokeStyle = r >= 0 ? 'rgba(248, 250, 252, 0.36)' : 'rgba(15, 23, 42, 0.28)';
      ctx.lineWidth = 0.95;
      ctx.beginPath();
      ctx.moveTo(bx, baseY);
      ctx.quadraticCurveTo(ctrlX, ctrlY, cx, topY + 1);
      ctx.stroke();
    }

    // Soft sunlit sky-silver crescent highlight along upper-right curve
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.58)';
    ctx.lineWidth = Math.max(1.4, rx * 0.045);
    ctx.beginPath();
    ctx.moveTo(cx + rx * 0.82, baseY - ry * 0.14);
    ctx.quadraticCurveTo(cx + rx * 0.66, baseY - ry * 0.76, cx + rx * 0.12, topY + ry * 0.07);
    ctx.stroke();

    // Recessed Arched Clerestory Drum Windows (Kasnak Pencereleri) with tiny stone piers
    if (showWindows) {
      const winBandH = Math.max(6.5, Math.min(10, ry * 0.22));
      ctx.fillStyle = 'rgba(15, 23, 42, 0.34)';
      ctx.fillRect(cx - rx, baseY - winBandH - 1, rx * 2, winBandH + 1);
      const halfCount = Math.max(4, Math.floor(rx / 7.5));
      for (let i = -halfCount; i <= halfCount; i++) {
        const u = Math.sin((i / (halfCount + 0.8)) * (Math.PI * 0.48));
        const wx = cx + u * rx * 0.92;
        const ww = Math.max(2.0, 3.2 * Math.cos((i / (halfCount + 1)) * 1.1));
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(wx - ww * 0.5 - 0.5, baseY - winBandH + 0.5, ww + 1, winBandH - 1.2, [ww * 0.5, ww * 0.5, 0, 0]);
        ctx.fill();
        ctx.fillStyle = 'rgba(186, 230, 253, 0.88)';
        ctx.beginPath();
        ctx.roundRect(wx - ww * 0.5, baseY - winBandH + 1.1, ww, winBandH - 2.0, [ww * 0.5, ww * 0.5, 0, 0]);
        ctx.fill();
      }
    }
    ctx.restore();

    // Crisp outer silhouette stroke & projecting stone cornice ring at base
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.2;
    drawProfile();
    ctx.stroke();
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(cx - rx - 1.5, baseY - 1.2, rx * 2 + 3, 2.4);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.fillRect(cx - rx - 1.5, baseY + 1.0, rx * 2 + 3, 1.2);

    // Authentic Gilded Ottoman Alem Finial (seated directly on exact dome apex!)
    if (showFinial !== false) {
      const spireH = Math.max(10, Math.min(18, ry * 0.38));
      // Small lead collar cap at apex
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(cx - 3.2, topY + 1);
      ctx.lineTo(cx, topY - 2.2);
      ctx.lineTo(cx + 3.2, topY + 1);
      ctx.closePath();
      ctx.fill();
      // Slender gilded bronze spire + graduated spheres + open golden crescent
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(cx, topY - 1);
      ctx.lineTo(cx, topY - spireH);
      ctx.stroke();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(cx, topY - spireH * 0.32, 2.0, 0, Math.PI * 2);
      ctx.arc(cx, topY - spireH * 0.62, 1.45, 0, Math.PI * 2);
      ctx.fill();
      // Tiny open golden Ottoman crescent at apex
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 1.35;
      ctx.beginPath();
      ctx.arc(cx, topY - spireH - 1.8, 2.5, 0.35, Math.PI - 0.35, false);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawOttomanSemiDome(ctx, attachX, baseY, spanX, ry, dir, colTop, colBot) {
    // True Ottoman cascading quarter-sphere semi-dome (Yarım Kubbe) sweeping smoothly into the central drum!
    const outerX = attachX + dir * spanX;
    const topY = baseY - ry;
    const drawSemi = () => {
      ctx.beginPath();
      ctx.moveTo(attachX, baseY);
      ctx.lineTo(outerX, baseY);
      ctx.bezierCurveTo(outerX, baseY - ry * 0.62, attachX + dir * spanX * 0.48, topY + ry * 0.02, attachX, topY);
      ctx.closePath();
    };
    ctx.save();
    const rg = ctx.createRadialGradient(attachX + dir * spanX * 0.25, baseY - ry * 0.65, 2, attachX + dir * spanX * 0.4, baseY - ry * 0.3, Math.max(spanX, ry) * 1.3);
    rg.addColorStop(0.00, '#f8fafc');
    rg.addColorStop(0.28, colTop);
    rg.addColorStop(0.68, colBot);
    rg.addColorStop(1.00, '#1e293b');
    ctx.fillStyle = rg;
    drawSemi();
    ctx.fill();

    ctx.save();
    drawSemi();
    ctx.clip();
    // Radiating curved lead ribs sweeping into the drum apex
    for (let r = 1; r <= 3; r++) {
      const f = r / 4;
      const bx = attachX + dir * spanX * f;
      ctx.strokeStyle = dir > 0 ? 'rgba(248, 250, 252, 0.32)' : 'rgba(15, 23, 42, 0.26)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(bx, baseY);
      ctx.quadraticCurveTo(attachX + dir * spanX * f * 0.72, baseY - ry * 0.60, attachX, topY + 1);
      ctx.stroke();
    }
    if (dir > 0) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(outerX - 2, baseY - ry * 0.14);
      ctx.quadraticCurveTo(attachX + spanX * 0.70, baseY - ry * 0.74, attachX + 3, topY + 2);
      ctx.stroke();
    }
    ctx.restore();

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.15;
    drawSemi();
    ctx.stroke();
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(Math.min(attachX, outerX) - 1, baseY - 1.0, spanX + 2, 2.2);
    ctx.restore();
  }

  function drawOttomanMinaret(ctx, cx, baseY, h, w, balconies) {
    const topY = baseY - h;
    const shaftG = ctx.createLinearGradient(cx - w, topY, cx + w, topY);
    shaftG.addColorStop(0.0, '#ffffff');
    shaftG.addColorStop(0.52, '#e2e8f0');
    shaftG.addColorStop(1.0, '#94a3b8');
    ctx.fillStyle = shaftG;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.15;

    ctx.fillRect(cx - w * 0.88, baseY - h * 0.22, w * 1.76, h * 0.22);
    ctx.strokeRect(cx - w * 0.88, baseY - h * 0.22, w * 1.76, h * 0.22);
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.58, baseY - h * 0.22);
    ctx.lineTo(cx - w * 0.40, topY + 26);
    ctx.lineTo(cx + w * 0.40, topY + 26);
    ctx.lineTo(cx + w * 0.58, baseY - h * 0.22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.14, baseY - h * 0.22);
    ctx.lineTo(cx - w * 0.10, topY + 26);
    ctx.stroke();

    const fracs = balconies === 3 ? [0.28, 0.48, 0.68] : [0.36, 0.64];
    for (const frac of fracs) {
      const by = topY + h * frac;
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.roundRect(cx - w * 1.02, by, w * 2.04, 6.2, 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(cx - w * 0.72, by + 1.5, w * 1.44, 2.0);
    }

    ctx.fillStyle = '#475569';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.44, topY + 26);
    ctx.lineTo(cx, topY);
    ctx.lineTo(cx + w * 0.44, topY + 26);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(cx, topY);
    ctx.lineTo(cx, topY - 10);
    ctx.stroke();
  }

  function drawBalatCumbaHouse(ctx, x, baseY, bw, bh, wallTop, wallBot, trimCol, seed) {
    const y = baseY - bh;
    ctx.save();
    ctx.save();
    ctx.beginPath();
    ctx.rect(x + 4, baseY - 50, bw - 8, 50);
    ctx.clip();
    fillAshlarMasonry(ctx, x + 4, baseY - 50, bw - 8, 50, 10, 18, STONE_WARM, seed || 17);
    ctx.restore();
    ctx.strokeStyle = '#261810';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + 4, baseY - 50, bw - 8, 50);

    // Arched Ottoman wooden doorway with fanlight transom
    ctx.fillStyle = '#3f2314';
    ctx.strokeStyle = '#1f120b';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(x + bw * 0.34, baseY);
    ctx.lineTo(x + bw * 0.34, baseY - 28);
    ctx.arc(x + bw * 0.5, baseY - 28, bw * 0.16, Math.PI, 0);
    ctx.lineTo(x + bw * 0.66, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.78)';
    ctx.beginPath();
    ctx.arc(x + bw * 0.5, baseY - 28, bw * 0.12, Math.PI, 0);
    ctx.closePath();
    ctx.fill();

    // Overhanging wooden Cumba bay-window upper floors
    const wG = ctx.createLinearGradient(x, y + 18, x + bw, baseY - 46);
    wG.addColorStop(0, wallTop);
    wG.addColorStop(0.62, wallBot);
    wG.addColorStop(1, '#2b1919');
    ctx.fillStyle = wG;
    ctx.strokeStyle = '#261810';
    ctx.lineWidth = 1.5;
    ctx.fillRect(x, y + 18, bw, bh - 66);
    ctx.strokeRect(x, y + 18, bw, bh - 66);

    for (let ly = y + 25; ly < baseY - 50; ly += 6.5) {
      ctx.fillStyle = 'rgba(255, 250, 240, 0.11)';
      ctx.fillRect(x + 1, ly, bw - 2, 1.2);
      ctx.fillStyle = 'rgba(20, 10, 8, 0.18)';
      ctx.fillRect(x + 1, ly + 4.5, bw - 2, 1.2);
    }
    ctx.fillStyle = trimCol;
    ctx.fillRect(x + 1, y + 19, 4, bh - 68);
    ctx.fillRect(x + bw - 5, y + 19, 4, bh - 68);
    ctx.fillRect(x - 1, y + 18, bw + 2, 4.5);

    ctx.fillStyle = trimCol;
    ctx.strokeStyle = '#261810';
    ctx.lineWidth = 1.1;
    for (const bx of [x + 8, x + bw * 0.5 - 3, x + bw - 14]) {
      ctx.beginPath();
      ctx.moveTo(bx, baseY - 48);
      ctx.lineTo(bx + 6.5, baseY - 48);
      ctx.bezierCurveTo(bx + 6.5, baseY - 38, bx + 2.5, baseY - 35, bx + 2.5, baseY - 30);
      ctx.lineTo(bx, baseY - 30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    const cols = bw >= 92 ? 3 : 2;
    const winW = 16, winH = 27;
    const gap = (bw - cols * winW) / (cols + 1);
    for (let r = 0; r < 2; r++) {
      const wy = y + 29 + r * 43;
      if (wy + winH > baseY - 54) break;
      for (let c = 0; c < cols; c++) {
        const wx = x + gap + c * (winW + gap);
        ctx.fillStyle = 'rgba(28, 19, 15, 0.44)';
        ctx.fillRect(wx - 4.2, wy + 2, 3.8, winH - 2);
        ctx.fillRect(wx + winW + 0.4, wy + 2, 3.8, winH - 2);
        const pG = ctx.createLinearGradient(wx, wy, wx, wy + winH);
        pG.addColorStop(0, '#f0f9ff');
        pG.addColorStop(0.55, '#7dd3fc');
        pG.addColorStop(1, '#0369a1');
        ctx.fillStyle = pG;
        ctx.strokeStyle = trimCol;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(wx, wy, winW, winH, [6, 6, 1, 1]);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(wx + winW * 0.5, wy);
        ctx.lineTo(wx + winW * 0.5, wy + winH);
        ctx.moveTo(wx, wy + winH * 0.5);
        ctx.lineTo(wx + winW, wy + winH * 0.5);
        ctx.stroke();
        if (r === 1) {
          ctx.fillStyle = '#9a3412';
          ctx.fillRect(wx - 2, wy + winH - 1, winW + 4, 4.5);
          ctx.fillStyle = '#15803d';
          ctx.fillRect(wx - 1, wy + winH - 3.5, winW + 2, 3);
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(wx + 3, wy + winH - 3, 2.1, 0, Math.PI * 2);
          ctx.arc(wx + 12, wy + winH - 3.5, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Brick chimney & scalloped barrel-tile roof
    ctx.fillStyle = '#7c2d12';
    ctx.strokeStyle = '#261810';
    ctx.lineWidth = 1.3;
    ctx.fillRect(x + bw * 0.72, y - 11, 10, 15);
    ctx.strokeRect(x + bw * 0.72, y - 11, 10, 15);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(x + bw * 0.72 - 1.5, y - 13, 13, 3);
    const rG = ctx.createLinearGradient(x, y, x, y + 20);
    rG.addColorStop(0, '#ea580c');
    rG.addColorStop(0.55, '#c2410c');
    rG.addColorStop(1, '#7c2d12');
    ctx.fillStyle = rG;
    ctx.strokeStyle = '#261810';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 7, y + 20);
    ctx.lineTo(x + bw * 0.14, y);
    ctx.lineTo(x + bw * 0.86, y);
    ctx.lineTo(x + bw + 7, y + 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(40, 14, 6, 0.34)';
    ctx.lineWidth = 1.0;
    for (let rx = x + 3; rx < x + bw; rx += 8) {
      ctx.beginPath();
      ctx.moveTo(rx, y + 2);
      ctx.lineTo(rx - 2, y + 19);
      ctx.stroke();
      ctx.fillStyle = '#9a3412';
      ctx.beginPath();
      ctx.arc(rx - 2, y + 20, 3.2, 0, Math.PI);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawGalataTowerLandmark(ctx, cx, baseY, scale) {
    ctx.save();
    ctx.translate(cx, baseY);
    ctx.scale(scale, scale);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-46, 0);
    ctx.lineTo(-40, -248);
    ctx.lineTo(40, -248);
    ctx.lineTo(46, 0);
    ctx.closePath();
    ctx.clip();
    fillAshlarMasonry(ctx, -47, -250, 94, 252, 12, 20, STONE_WARM, 31);
    const shadeG = ctx.createLinearGradient(-47, 0, 47, 0);
    shadeG.addColorStop(0.00, 'rgba(255, 238, 205, 0.30)');
    shadeG.addColorStop(0.42, 'rgba(255, 238, 205, 0.04)');
    shadeG.addColorStop(0.75, 'rgba(42, 24, 14, 0.44)');
    shadeG.addColorStop(1.00, 'rgba(22, 12, 8, 0.70)');
    ctx.fillStyle = shadeG;
    ctx.fillRect(-47, -250, 94, 252);
    ctx.restore();

    ctx.strokeStyle = '#231610';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-46, 0);
    ctx.lineTo(-40, -248);
    ctx.lineTo(40, -248);
    ctx.lineTo(46, 0);
    ctx.closePath();
    ctx.stroke();

    // Stone belt courses
    for (const by of [-86, -172]) {
      ctx.fillStyle = '#e7c69e';
      ctx.fillRect(-44, by, 88, 5);
      ctx.strokeRect(-44, by, 88, 5);
    }

    for (const wy of [-54, -116, -162, -214]) {
      for (const wx of [-19, 0, 19]) {
        ctx.fillStyle = '#fef08a';
        ctx.strokeStyle = '#3b2112';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(wx - 4.8, wy + 13);
        ctx.lineTo(wx - 4.8, wy);
        ctx.arc(wx, wy, 4.8, Math.PI, 0);
        ctx.lineTo(wx + 4.8, wy + 13);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#8b684d';
        ctx.fillRect(wx - 6, wy + 13, 12, 2.6);
      }
    }

    // Corbeled observation balcony & wrought-iron balustrade
    ctx.fillStyle = '#e7c69e';
    ctx.strokeStyle = '#231610';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(-52, -260, 104, 14, 3);
    ctx.fill();
    ctx.stroke();
    for (let bx = -44; bx <= 44; bx += 11) {
      ctx.fillStyle = '#a8835e';
      ctx.fillRect(bx - 2, -246, 4, 8);
    }
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-50, -268);
    ctx.lineTo(50, -268);
    ctx.stroke();
    for (let rx = -48; rx <= 48; rx += 8) {
      ctx.beginPath();
      ctx.moveTo(rx, -268);
      ctx.lineTo(rx, -260);
      ctx.stroke();
    }

    // Upper arched gallery drum
    const drumG = ctx.createLinearGradient(-39, -298, 39, -260);
    drumG.addColorStop(0.0, '#f5d9b5');
    drumG.addColorStop(0.6, '#b89168');
    drumG.addColorStop(1.0, '#4a3529');
    ctx.fillStyle = drumG;
    ctx.fillRect(-39, -298, 78, 38);
    ctx.strokeRect(-39, -298, 78, 38);
    for (let a = -24; a <= 24; a += 12) {
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(a, -279, 4.4, Math.PI, 0);
      ctx.lineTo(a + 4.4, -263);
      ctx.lineTo(a - 4.4, -263);
      ctx.closePath();
      ctx.fill();
    }

    // Tall Conical Lead Roof + Dormer Windows + Gilded Ottoman Alem
    const roofG = ctx.createLinearGradient(-48, -298, 48, -410);
    roofG.addColorStop(0.0, '#64748b');
    roofG.addColorStop(0.45, '#334155');
    roofG.addColorStop(1.0, '#0f172a');
    ctx.fillStyle = roofG;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-48, -298);
    ctx.lineTo(0, -410);
    ctx.lineTo(48, -298);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(226, 232, 240, 0.30)';
    ctx.lineWidth = 1.1;
    for (const rx of [-28, -12, 12, 28]) {
      ctx.beginPath();
      ctx.moveTo(rx, -298);
      ctx.lineTo(0, -408);
      ctx.stroke();
    }
    for (const dx of [-16, 0, 16]) {
      ctx.fillStyle = '#fef08a';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.roundRect(dx - 3.5, -338, 7, 11, [3.5, 3.5, 0, 0]);
      ctx.fill();
      ctx.stroke();
    }
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -410);
    ctx.lineTo(0, -440);
    ctx.stroke();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0, -420, 4.2, 0, Math.PI * 2);
    ctx.arc(0, -432, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawRumeliFortress(ctx, cx, baseY) {
    ctx.save();
    ctx.translate(cx, baseY);
    // Stepped crenellated curtain wall connecting two cylindrical Bosphorus fortress towers
    ctx.fillStyle = '#7c6f64';
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-78, 0);
    ctx.lineTo(-78, -54);
    ctx.lineTo(68, -36);
    ctx.lineTo(68, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    for (let mx = -72; mx <= 60; mx += 12) {
      const my = -54 + ((mx + 78) / 146) * 18;
      ctx.fillStyle = '#9ca3af';
      ctx.fillRect(mx, my - 6, 7, 6);
      ctx.strokeRect(mx, my - 6, 7, 6);
    }
    for (const [tx, th, tw] of [[-76, 108, 34], [64, 86, 28]]) {
      const tG = ctx.createLinearGradient(tx - tw * 0.5, 0, tx + tw * 0.5, 0);
      tG.addColorStop(0, '#d6cfc7');
      tG.addColorStop(0.55, '#8c7f73');
      tG.addColorStop(1, '#3f3832');
      ctx.fillStyle = tG;
      ctx.fillRect(tx - tw * 0.5, -th, tw, th);
      ctx.strokeRect(tx - tw * 0.5, -th, tw, th);
      for (let m = -tw * 0.5; m < tw * 0.5 - 2; m += 8) {
        ctx.fillRect(tx + m, -th - 7, 5, 7);
        ctx.strokeRect(tx + m, -th - 7, 5, 7);
      }
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(tx - tw * 0.52, -th - 7);
      ctx.lineTo(tx, -th - 30);
      ctx.lineTo(tx + tw * 0.52, -th - 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawMaidensTower(ctx, cx, baseY) {
    ctx.save();
    ctx.translate(cx, baseY);
    ctx.strokeStyle = 'rgba(224, 242, 254, 0.62)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-58, 4);
    ctx.quadraticCurveTo(0, 9, 58, 4);
    ctx.stroke();
    const rockG = ctx.createLinearGradient(-48, -14, 48, 4);
    rockG.addColorStop(0, '#8c7866');
    rockG.addColorStop(1, '#332924');
    ctx.fillStyle = rockG;
    ctx.strokeStyle = '#1c1512';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-50, 4);
    ctx.lineTo(-44, -12);
    ctx.lineTo(44, -12);
    ctx.lineTo(50, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f5e6d3';
    ctx.strokeStyle = '#291c14';
    ctx.lineWidth = 1.4;
    ctx.fillRect(-33, -35, 66, 23);
    ctx.strokeRect(-33, -35, 66, 23);
    ctx.fillStyle = '#fde047';
    for (const wx of [-23, -12, 12, 23]) ctx.fillRect(wx - 2.5, -28, 5, 9);
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(-36, -35);
    ctx.lineTo(-25, -44);
    ctx.lineTo(25, -44);
    ctx.lineTo(36, -35);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const twG = ctx.createLinearGradient(-14, -95, 14, -35);
    twG.addColorStop(0, '#fff7ed');
    twG.addColorStop(0.65, '#e2cdb5');
    twG.addColorStop(1, '#8c725a');
    ctx.fillStyle = twG;
    ctx.fillRect(-13.5, -92, 27, 57);
    ctx.strokeRect(-13.5, -92, 27, 57);
    const bGlow = ctx.createRadialGradient(0, -78, 2, 0, -78, 30);
    bGlow.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
    bGlow.addColorStop(1, 'rgba(251, 146, 60, 0)');
    ctx.fillStyle = bGlow;
    ctx.beginPath();
    ctx.arc(0, -78, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-5, -83, 10, 11);
    ctx.fillRect(-4, -59, 8, 10);
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(-17, -92);
    ctx.quadraticCurveTo(0, -114, 17, -92);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, -103);
    ctx.lineTo(0, -122);
    ctx.stroke();
    ctx.restore();
  }

  function drawCypressTree(ctx, x, baseY, h) {
    const g = ctx.createLinearGradient(x - 8, baseY - h, x + 8, baseY);
    g.addColorStop(0, '#24473a');
    g.addColorStop(1, '#0d1f19');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x, baseY - h);
    ctx.bezierCurveTo(x - 10, baseY - h * 0.55, x - 9, baseY - h * 0.12, x - 2, baseY);
    ctx.lineTo(x + 2, baseY);
    ctx.bezierCurveTo(x + 9, baseY - h * 0.12, x + 10, baseY - h * 0.55, x, baseY - h);
    ctx.closePath();
    ctx.fill();
  }

  // =========================================================================
  // 1. COOL DAYTIME BOSPHORUS SKY, DENSE CUMULUS CLOUDS & HISTORIC HORIZON
  // =========================================================================
  let istanbulCloudSprite = null;
  let istanbulHorizonCache = null;

  function renderVolumetricCloudShape(ctx) {
    // Cool slate-periwinkle shadowed cloud underside
    ctx.fillStyle = '#93c5fd';
    ctx.beginPath();
    ctx.ellipse(0, 14, 86, 18, 0, 0, Math.PI * 2);
    ctx.ellipse(-44, 12, 52, 14, 0, 0, Math.PI * 2);
    ctx.ellipse(46, 12, 54, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Soft glacial sky-blue mid-body puffs
    ctx.fillStyle = '#dbeafe';
    ctx.beginPath();
    ctx.arc(-48, 2, 28, 0, Math.PI * 2);
    ctx.arc(-18, -10, 36, 0, Math.PI * 2);
    ctx.arc(20, -12, 38, 0, Math.PI * 2);
    ctx.arc(52, 2, 27, 0, Math.PI * 2);
    ctx.ellipse(0, 6, 76, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Crisp sunlit snow-white billowing cumulus crowns
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-46, -2, 23, 0, Math.PI * 2);
    ctx.arc(-18, -15, 31, 0, Math.PI * 2);
    ctx.arc(18, -17, 33, 0, Math.PI * 2);
    ctx.arc(48, -2, 22, 0, Math.PI * 2);
    ctx.ellipse(0, -1, 64, 15, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawVolumetricCloud(ctx, cx, cy, scaleX, scaleY, alpha) {
    if (!istanbulCloudSprite && typeof document !== 'undefined' && document.createElement) {
      istanbulCloudSprite = makeOffscreen(200, 96, (cctx) => {
        cctx.translate(100, 56);
        renderVolumetricCloudShape(cctx);
      });
    }
    if (istanbulCloudSprite) {
      const dw = 200 * scaleX;
      const dh = 96 * scaleY;
      const dx = cx - 100 * scaleX;
      if (dx + dw < -20 || dx > 1320) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.drawImage(istanbulCloudSprite, dx, cy - 56 * scaleY, dw, dh);
      ctx.restore();
      return;
    }
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scaleX, scaleY);
    ctx.globalAlpha = alpha;
    renderVolumetricCloudShape(ctx);
    ctx.restore();
  }

  function drawIstanbulSkyAndHorizon(ctx, camX, w, h, time) {
    // Crisp, cool-toned Bosphorus maritime daytime sky
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.80);
    sky.addColorStop(0.00, '#0369a1');
    sky.addColorStop(0.24, '#0284c7');
    sky.addColorStop(0.52, '#38bdf8');
    sky.addColorStop(0.78, '#bae6fd');
    sky.addColorStop(1.00, '#f0f9ff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // High Cool Morning Sun + Soft Silver-Cyan Atmospheric Light Shafts
    const sunX = 955 - (camX * 0.012) % 220;
    const sunY = 98;
    ctx.save();
    for (let ray = -3; ray <= 2; ray++) {
      const rayG = ctx.createLinearGradient(sunX, sunY, sunX + ray * 165 - 95, 490);
      rayG.addColorStop(0, 'rgba(240, 249, 255, 0.24)');
      rayG.addColorStop(1, 'rgba(224, 242, 254, 0)');
      ctx.fillStyle = rayG;
      ctx.beginPath();
      ctx.moveTo(sunX - 18, sunY);
      ctx.lineTo(sunX + 18, sunY);
      ctx.lineTo(sunX + ray * 165 - 52, 490);
      ctx.lineTo(sunX + ray * 165 - 144, 490);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    const halo = ctx.createRadialGradient(sunX, sunY, 14, sunX, sunY, 210);
    halo.addColorStop(0.00, 'rgba(255, 255, 255, 0.96)');
    halo.addColorStop(0.30, 'rgba(224, 242, 254, 0.56)');
    halo.addColorStop(0.65, 'rgba(125, 211, 252, 0.22)');
    halo.addColorStop(1.00, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 210, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 36, 0, Math.PI * 2);
    ctx.fill();

    // CLOUD BANK 1 (Far High Cumulus Deck - Dense, Soft & Cool)
    const spanC1 = w + 460;
    for (let i = 0; i < 9; i++) {
      const cx0 = (((i * 195 - camX * 0.018 + time * 4.5) % spanC1) + spanC1) % spanC1 - 230;
      const cy0 = 56 + (i % 3) * 34;
      drawVolumetricCloud(ctx, cx0, cy0, 0.92 + (i % 3) * 0.18, 0.72 + (i % 2) * 0.14, 0.82);
    }

    // CLOUD BANK 2 (Towering Dense Mid-Sky Marmara Cumulus Billows)
    const spanC2 = w + 520;
    for (let i = 0; i < 10; i++) {
      const cx0 = (((i * 178 + 75 - camX * 0.034 + time * 7.5) % spanC2) + spanC2) % spanC2 - 260;
      const cy0 = 112 + (i % 4) * 34;
      drawVolumetricCloud(ctx, cx0, cy0, 1.12 + (i % 3) * 0.22, 0.94 + (i % 2) * 0.18, 0.92);
    }

    // CLOUD BANK 3 (Low Horizon Sea-Breeze Stratocumulus Layer)
    const spanC3 = w + 480;
    for (let i = 0; i < 9; i++) {
      const cx0 = (((i * 188 + 40 - camX * 0.048 + time * 9.5) % spanC3) + spanC3) % spanC3 - 240;
      const cy0 = 248 + (i % 3) * 26;
      drawVolumetricCloud(ctx, cx0, cy0, 1.25 + (i % 2) * 0.25, 0.68, 0.76);
    }

    // 15 July Martyrs Bosphorus Suspension Bridge + Ortaköy Baroque Mosque in Crisp Daylight
    const brOff = -((camX * 0.06) % 1480);
    for (let bx = brOff; bx < w + 1480; bx += 1480) {
      const t1 = bx + 280, t2 = bx + 920, deckY = 392;
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.86)';
      ctx.lineWidth = 5.5;
      ctx.beginPath();
      ctx.moveTo(bx - 120, deckY);
      ctx.lineTo(bx + 1320, deckY);
      ctx.stroke();

      for (const tx of [t1, t2]) {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(tx - 8, deckY - 132, 6, 158);
        ctx.fillRect(tx + 8, deckY - 132, 6, 158);
        ctx.fillRect(tx - 8, deckY - 120, 22, 5.5);
        ctx.fillRect(tx - 8, deckY - 78, 22, 5);
        ctx.fillRect(tx - 8, deckY - 38, 22, 5);
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(tx - 7, deckY - 130, 2.0, 128);
        ctx.fillRect(tx + 9, deckY - 130, 2.0, 128);
      }

      ctx.strokeStyle = 'rgba(241, 245, 249, 0.88)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(bx - 80, deckY);
      ctx.quadraticCurveTo(t1 - 95, deckY - 12, t1 + 3, deckY - 130);
      ctx.quadraticCurveTo((t1 + t2) * 0.5, deckY - 8, t2 + 3, deckY - 130);
      ctx.quadraticCurveTo(t2 + 95, deckY - 12, bx + 1280, deckY);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.48)';
      ctx.lineWidth = 0.95;
      for (let sx = t1 + 24; sx < t2; sx += 24) {
        const u = (sx - t1) / (t2 - t1);
        const cy = (deckY - 130) + (4 * u * (1 - u)) * 118;
        ctx.beginPath();
        ctx.moveTo(sx, cy);
        ctx.lineTo(sx, deckY);
        ctx.stroke();
      }

      for (let car = 0; car < 9; car++) {
        const carX = bx + ((car * 155 + time * (car % 2 === 0 ? 36 : -30)) % 1340 + 1340) % 1340 - 60;
        ctx.fillStyle = car % 2 === 0 ? '#ffffff' : '#0284c7';
        ctx.fillRect(carX - 3, deckY - 5, 6, 3);
      }

      // White Marmara-Marble Ortaköy Baroque Mosque at the Bosphorus bridge pier
      const ox = t1 - 62, oy = 428;
      drawOttomanMinaret(ctx, ox - 22, oy, 76, 4.6, 2);
      drawOttomanMinaret(ctx, ox + 22, oy, 76, 4.6, 2);
      ctx.fillStyle = '#f1f5f9';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.0;
      ctx.fillRect(ox - 20, oy - 26, 40, 28);
      ctx.strokeRect(ox - 20, oy - 26, 40, 28);
      ctx.fillStyle = '#7dd3fc';
      for (const awx of [ox - 12, ox, ox + 12]) {
        ctx.beginPath();
        ctx.roundRect(awx - 3, oy - 18, 6, 13, [3, 3, 0, 0]);
        ctx.fill();
      }
      drawOttomanDome(ctx, ox, oy - 26, 18, 15, '#cbd5e1', '#64748b', true);
    }

    // Monumental Historic Peninsula Silhouette (Sultanahmet Blue Mosque + Hagia Sophia in Cool Daylight — GPU Baked!)
    const renderPeninsulaTile = (pCtx, mx) => {
      const hillG = pCtx.createLinearGradient(0, 355, 0, 488);
      hillG.addColorStop(0, '#64748b');
      hillG.addColorStop(1, '#334155');
      pCtx.fillStyle = hillG;
      pCtx.beginPath();
      pCtx.moveTo(mx, 492);
      pCtx.bezierCurveTo(mx + 260, 378, mx + 580, 356, mx + 860, 386);
      pCtx.bezierCurveTo(mx + 1140, 414, mx + 1360, 366, mx + 1560, 492);
      pCtx.closePath();
      pCtx.fill();

      // 1. Sultanahmet Blue Mosque (Authentic Pyramidal Ottoman Cascading Domes + 6 Symmetrical Fluted Minarets)
      const cx = mx + 440, by = 408;
      drawOttomanMinaret(pCtx, cx - 142, by + 6, 138, 6.4, 2);
      drawOttomanMinaret(pCtx, cx + 142, by + 6, 138, 6.4, 2);
      drawOttomanMinaret(pCtx, cx - 96, by + 4, 158, 7.2, 3);
      drawOttomanMinaret(pCtx, cx + 96, by + 4, 158, 7.2, 3);
      drawOttomanMinaret(pCtx, cx - 56, by + 2, 170, 7.6, 3);
      drawOttomanMinaret(pCtx, cx + 56, by + 2, 170, 7.6, 3);

      const bmG = pCtx.createLinearGradient(cx - 128, by - 58, cx + 128, by + 12);
      bmG.addColorStop(0, '#ffffff');
      bmG.addColorStop(0.55, '#e2e8f0');
      bmG.addColorStop(1, '#94a3b8');
      pCtx.fillStyle = bmG;
      pCtx.strokeStyle = '#475569';
      pCtx.lineWidth = 1.0;
      pCtx.beginPath();
      pCtx.roundRect(cx - 126, by - 26, 252, 38, [4, 4, 0, 0]);
      pCtx.fill();
      pCtx.stroke();

      pCtx.fillStyle = 'rgba(56, 189, 248, 0.55)';
      for (let ax = cx - 110; ax <= cx + 110; ax += 18) {
        pCtx.beginPath();
        pCtx.roundRect(ax - 3.2, by - 16, 6.4, 11, [3.2, 3.2, 0, 0]);
        pCtx.fill();
      }
      pCtx.fillStyle = '#cbd5e1';
      pCtx.fillRect(cx - 128, by - 28, 256, 3.2);

      pCtx.fillStyle = bmG;
      pCtx.fillRect(cx - 114, by - 38, 42, 12);
      pCtx.strokeRect(cx - 114, by - 38, 42, 12);
      pCtx.fillRect(cx + 72, by - 38, 42, 12);
      pCtx.strokeRect(cx + 72, by - 38, 42, 12);
      drawOttomanDome(pCtx, cx - 93, by - 38, 21, 16, '#cbd5e1', '#64748b', false, true);
      drawOttomanDome(pCtx, cx + 93, by - 38, 21, 16, '#cbd5e1', '#64748b', false, true);

      pCtx.fillStyle = bmG;
      pCtx.fillRect(cx - 86, by - 46, 172, 20);
      pCtx.strokeRect(cx - 86, by - 46, 172, 20);
      pCtx.fillStyle = 'rgba(125, 211, 252, 0.72)';
      for (let ax = cx - 70; ax <= cx + 70; ax += 14) {
        pCtx.beginPath();
        pCtx.roundRect(ax - 2.4, by - 41, 4.8, 9, [2.4, 2.4, 0, 0]);
        pCtx.fill();
      }
      drawOttomanSemiDome(pCtx, cx - 44, by - 44, 42, 32, -1, '#cbd5e1', '#64748b');
      drawOttomanSemiDome(pCtx, cx + 44, by - 44, 42, 32, 1, '#cbd5e1', '#64748b');

      pCtx.fillStyle = bmG;
      pCtx.fillRect(cx - 50, by - 64, 100, 22);
      pCtx.strokeRect(cx - 50, by - 64, 100, 22);
      drawOttomanDome(pCtx, cx, by - 44, 34, 21, '#dbeafe', '#64748b', false, false);
      for (const tx of [cx - 50, cx + 50]) {
        pCtx.fillStyle = '#f8fafc';
        pCtx.fillRect(tx - 4.5, by - 73, 9, 27);
        pCtx.strokeRect(tx - 4.5, by - 73, 9, 27);
        pCtx.fillStyle = '#475569';
        pCtx.beginPath();
        pCtx.moveTo(tx - 5.2, by - 73);
        pCtx.lineTo(tx, by - 84);
        pCtx.lineTo(tx + 5.2, by - 73);
        pCtx.closePath();
        pCtx.fill();
      }
      drawOttomanDome(pCtx, cx, by - 64, 50, 45, '#e2e8f0', '#64748b', true, true);

      // 2. Hagia Sophia
      const hx = mx + 1120, hby = 412;
      drawOttomanMinaret(pCtx, hx - 116, hby + 6, 146, 7.8, 2);
      drawOttomanMinaret(pCtx, hx - 78, hby + 4, 156, 8.2, 2);
      drawOttomanMinaret(pCtx, hx + 78, hby + 4, 156, 8.2, 2);
      drawOttomanMinaret(pCtx, hx + 116, hby + 6, 146, 7.8, 2);

      const hsG = pCtx.createLinearGradient(hx - 102, hby - 66, hx + 102, hby + 10);
      hsG.addColorStop(0, '#f5d5cc');
      hsG.addColorStop(0.55, '#d6a598');
      hsG.addColorStop(1, '#785a58');
      pCtx.fillStyle = hsG;
      pCtx.strokeStyle = '#5c4240';
      pCtx.lineWidth = 1.0;
      pCtx.beginPath();
      pCtx.moveTo(hx - 106, hby + 10);
      pCtx.lineTo(hx - 94, hby - 34);
      pCtx.lineTo(hx + 94, hby - 34);
      pCtx.lineTo(hx + 106, hby + 10);
      pCtx.closePath();
      pCtx.fill();
      pCtx.stroke();
      for (const bpx of [hx - 82, hx - 54, hx + 54, hx + 82]) {
        pCtx.fillStyle = '#e7c1b6';
        pCtx.fillRect(bpx - 6, hby - 44, 12, 52);
        pCtx.strokeRect(bpx - 6, hby - 44, 12, 52);
      }

      pCtx.fillStyle = hsG;
      pCtx.fillRect(hx - 76, hby - 56, 152, 24);
      pCtx.strokeRect(hx - 76, hby - 56, 152, 24);
      pCtx.fillStyle = 'rgba(125, 211, 252, 0.72)';
      for (let wx = hx - 60; wx <= hx + 60; wx += 15) {
        pCtx.beginPath();
        pCtx.roundRect(wx - 2.6, hby - 49, 5.2, 11, [2.6, 2.6, 0, 0]);
        pCtx.fill();
      }

      drawOttomanSemiDome(pCtx, hx - 52, hby - 46, 38, 28, -1, '#e2e8f0', '#78716c');
      drawOttomanSemiDome(pCtx, hx + 52, hby - 46, 38, 28, 1, '#e2e8f0', '#78716c');
      pCtx.fillStyle = '#e7c1b6';
      pCtx.fillRect(hx - 56, hby - 66, 112, 12);
      pCtx.strokeRect(hx - 56, hby - 66, 112, 12);
      drawOttomanDome(pCtx, hx, hby - 64, 56, 42, '#f1f5f9', '#78716c', true, true);
    };

    if (!istanbulHorizonCache && typeof document !== 'undefined' && document.createElement) {
      istanbulHorizonCache = makeOffscreen(1560, 300, (cctx) => {
        cctx.translate(0, -196);
        renderPeninsulaTile(cctx, 0);
      });
    }

    const mOff = -((camX * 0.10) % 1560);
    for (let mx = mOff - 1560; mx < w + 1560; mx += 1560) {
      if (mx + 1560 < 0 || mx > w) continue;
      if (istanbulHorizonCache) {
        ctx.drawImage(istanbulHorizonCache, mx, 196);
      } else {
        renderPeninsulaTile(ctx, mx);
      }
    }
  }

  // =========================================================================
  // 2. ISTANBUL MIDGROUND WITH 60FPS TILE BAKING + LIVING DYNAMIC OVERLAY
  // =========================================================================
  let istanbulFarCache = null;
  let istanbulMidCache = null;

  function drawIstanbulMidground(mainCtx, camX, w, h, time) {
    const farSpan = 1680, farPad = 120;
    const midSpan = 1600, midPad = 120;

    // --- LAYER 1 (0.22x): Baked Rumeli Hisarı, Galata Tower, Balat Cumba Hills & Maiden's Tower ---
    if (!istanbulFarCache && typeof document !== 'undefined' && document.createElement) {
      istanbulFarCache = makeOffscreen(farSpan + farPad * 2, 640, (ctx) => {
        const vx = farPad;
        const hG = ctx.createLinearGradient(0, 350, 0, 565);
        hG.addColorStop(0, '#3b6e5c');
        hG.addColorStop(0.55, '#274e47');
        hG.addColorStop(1, '#163038');
        ctx.fillStyle = hG;
        ctx.beginPath();
        ctx.moveTo(vx - 60, 570);
        ctx.bezierCurveTo(vx + 220, 404, vx + 540, 362, vx + 860, 396);
        ctx.bezierCurveTo(vx + 1180, 428, vx + 1440, 380, vx + farSpan + 60, 570);
        ctx.closePath();
        ctx.fill();

        drawRumeliFortress(ctx, vx + 1180, 442);

        for (const [tx, ty, th] of [[48, 478, 58], [492, 462, 66], [534, 468, 54], [748, 464, 62], [1078, 456, 60], [1545, 475, 54]]) {
          drawCypressTree(ctx, vx + tx, ty, th);
        }

        drawGalataTowerLandmark(ctx, vx + 640, 465, 0.76);

        drawBalatCumbaHouse(ctx, vx + 78, 516, 94, 144, '#f59e0b', '#b45309', '#fef3c7', 11);
        drawBalatCumbaHouse(ctx, vx + 184, 506, 86, 132, '#e11d48', '#9f1239', '#fde68a', 23);
        drawBalatCumbaHouse(ctx, vx + 280, 498, 98, 148, '#0284c7', '#0369a1', '#e0f2fe', 37);
        drawBalatCumbaHouse(ctx, vx + 390, 508, 86, 136, '#10b981', '#047857', '#d1fae5', 43);
        drawBalatCumbaHouse(ctx, vx + 770, 504, 94, 144, '#f97316', '#c2410c', '#ffedd5', 59);
        drawBalatCumbaHouse(ctx, vx + 878, 512, 88, 136, '#6366f1', '#4338ca', '#e0e7ff', 67);
        drawBalatCumbaHouse(ctx, vx + 980, 500, 96, 146, '#eab308', '#a16207', '#fef9c3', 71);
        drawBalatCumbaHouse(ctx, vx + 1092, 514, 90, 132, '#ec4899', '#be185d', '#fce7f3', 83);
        drawBalatCumbaHouse(ctx, vx + 1216, 506, 96, 142, '#14b8a6', '#0f766e', '#ccfbf1', 97);
        drawBalatCumbaHouse(ctx, vx + 1326, 516, 88, 130, '#d97706', '#92400e', '#fef3c7', 103);
        drawBalatCumbaHouse(ctx, vx + 1430, 512, 94, 138, '#3b82f6', '#1d4ed8', '#dbeafe', 113);

        // Strung glowing Balat street lanterns draped between upper house eaves
        const lanCols = ['#fde047', '#fb7185', '#38bdf8', '#34d399'];
        for (const [sx0, sx1, sy0] of [[168, 286, 404], [860, 986, 402], [1308, 1436, 408]]) {
          ctx.strokeStyle = 'rgba(30, 20, 16, 0.65)';
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(vx + sx0, sy0);
          ctx.quadraticCurveTo(vx + (sx0 + sx1) * 0.5, sy0 + 16, vx + sx1, sy0);
          ctx.stroke();
          for (let li = 1; li <= 3; li++) {
            const u = li / 4;
            const lx = vx + sx0 + (sx1 - sx0) * u;
            const ly = sy0 + 4 * u * (1 - u) * 16 + 3;
            ctx.fillStyle = lanCols[li % lanCols.length];
            ctx.beginPath();
            ctx.arc(lx, ly, 3.0, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        drawMaidensTower(ctx, vx + 1575, 536);
      });
    }
    if (istanbulFarCache) {
      const farOff = -(((camX * 0.22) % farSpan) + farSpan) % farSpan;
      for (let bx = farOff - farSpan; bx < w + farSpan; bx += farSpan) {
        if (bx + farSpan + farPad < 0 || bx - farPad > w) continue;
        mainCtx.drawImage(istanbulFarCache, bx - farPad, 0);
      }
    }

    // --- LAYER 2 (0.42x): Baked Double-Deck Galata Bridge, Waterfront Cafés & Deep Bosphorus ---
    if (!istanbulMidCache && typeof document !== 'undefined' && document.createElement) {
      istanbulMidCache = makeOffscreen(midSpan + midPad * 2, 680, (ctx) => {
        const vx = midPad;

        // Cool turquoise-cerulean-sapphire daytime Bosphorus Strait water
        const seaG = ctx.createLinearGradient(0, 522, 0, 680);
        seaG.addColorStop(0.00, '#0ea5e9');
        seaG.addColorStop(0.28, '#0284c7');
        seaG.addColorStop(0.64, '#0369a1');
        seaG.addColorStop(1.00, '#0c4a6e');
        ctx.fillStyle = seaG;
        ctx.fillRect(0, 522, midSpan + midPad * 2, 158);

        // Galata Bridge Upper Promenade Deck
        const brG = ctx.createLinearGradient(0, 466, 0, 488);
        brG.addColorStop(0, '#e6caa8');
        brG.addColorStop(0.5, '#9b7b5e');
        brG.addColorStop(1, '#433024');
        ctx.fillStyle = brG;
        ctx.strokeStyle = '#1f1510';
        ctx.lineWidth = 1.6;
        ctx.fillRect(vx - 40, 468, midSpan + 80, 18);
        ctx.strokeRect(vx - 40, 468, midSpan + 80, 18);

        // Ornate wrought-iron Galata Bridge railing
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(vx - 40, 455);
        ctx.lineTo(vx + midSpan + 40, 455);
        ctx.stroke();
        for (let rx = vx; rx < vx + midSpan; rx += 20) {
          ctx.beginPath();
          ctx.moveTo(rx, 455);
          ctx.lineTo(rx, 468);
          ctx.stroke();
          if (rx % 40 === 0) {
            ctx.beginPath();
            ctx.arc(rx + 10, 461.5, 3.6, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        for (let ax = vx; ax < vx + midSpan; ax += 200) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(ax, 486, 30, 62);
          ctx.clip();
          fillAshlarMasonry(ctx, ax, 486, 30, 62, 10, 15, STONE_WARM, ax);
          ctx.restore();
          ctx.strokeStyle = '#1f1510';
          ctx.lineWidth = 1.6;
          ctx.strokeRect(ax, 486, 30, 62);
          ctx.fillStyle = 'rgba(15, 23, 42, 0.36)';
          ctx.fillRect(ax + 2, 548, 26, 24);

          const archG = ctx.createLinearGradient(ax + 30, 486, ax + 30, 514);
          archG.addColorStop(0, '#6b5342');
          archG.addColorStop(1, '#3b2b22');
          ctx.fillStyle = archG;
          ctx.beginPath();
          ctx.moveTo(ax + 30, 486);
          ctx.lineTo(ax + 200, 486);
          ctx.lineTo(ax + 200, 514);
          ctx.quadraticCurveTo(ax + 115, 474, ax + 30, 514);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Warm glowing under-deck Balık-Ekmek waterfront restaurant windows & awnings
          const cafeX = ax + 64;
          ctx.fillStyle = 'rgba(251, 146, 60, 0.32)';
          ctx.fillRect(cafeX, 502, 102, 22);
          ctx.fillStyle = 'rgba(254, 240, 138, 0.55)';
          for (let wx = cafeX + 10; wx < cafeX + 92; wx += 26) {
            ctx.fillRect(wx, 509, 16, 11);
          }
          for (let s = 0; s < 6; s++) {
            ctx.fillStyle = s % 2 === 0 ? '#b91c1c' : '#fef3c7';
            ctx.fillRect(cafeX + s * 17, 502, 17, 6);
          }

          // Hanging Faceted Turkish Mosaic Lamp under bridge arch
          const lx = ax + 115, ly = 497;
          const lg = ctx.createRadialGradient(lx, ly, 2, lx, ly, 32);
          lg.addColorStop(0, 'rgba(253, 224, 71, 0.85)');
          lg.addColorStop(1, 'rgba(249, 115, 22, 0)');
          ctx.fillStyle = lg;
          ctx.beginPath();
          ctx.arc(lx, ly, 32, 0, Math.PI * 2);
          ctx.fill();
          const lampCols = ['#38bdf8', '#f43f5e', '#fbbf24', '#34d399'];
          ctx.fillStyle = lampCols[Math.abs(Math.round(ax / 200)) % lampCols.length];
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(lx, ly, 6.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Ornate Twin-Globe Ottoman Bridge Streetlamp
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(ax + 15, 468);
          ctx.lineTo(ax + 15, 414);
          ctx.moveTo(ax + 5, 422);
          ctx.quadraticCurveTo(ax + 15, 416, ax + 25, 422);
          ctx.stroke();
          for (const gx of [ax + 5, ax + 25]) {
            const pg = ctx.createRadialGradient(gx, 420, 1, gx, 420, 24);
            pg.addColorStop(0, 'rgba(254, 240, 138, 0.88)');
            pg.addColorStop(1, 'rgba(251, 146, 60, 0)');
            ctx.fillStyle = pg;
            ctx.beginPath();
            ctx.arc(gx, 420, 24, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fef9c3';
            ctx.beginPath();
            ctx.arc(gx, 420, 4.0, 0, Math.PI * 2);
            ctx.fill();
          }
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

    // --- LAYER 3 (LIVE 60FPS DYNAMIC BOSPHORUS WATERFRONT SPECTACLE!) ---
    // 3A. Animated Galata Bridge Fishermen casting & bobbing rods
    const angOff = -(((camX * 0.42) % 360) + 360) % 360;
    for (let ax = angOff + 72; ax < w + 80; ax += 360) {
      const sway = Math.sin(time * 2.3 + ax * 0.03) * 4.5;
      mainCtx.save();
      mainCtx.fillStyle = '#1e1b2e';
      mainCtx.beginPath();
      mainCtx.arc(ax, 443, 4.4, 0, Math.PI * 2);
      mainCtx.fill();
      mainCtx.fillRect(ax - 3.8, 447, 7.6, 17);
      // Angler bucket beside feet
      mainCtx.fillStyle = '#b91c1c';
      mainCtx.fillRect(ax - 11, 458, 6, 7);
      mainCtx.strokeStyle = '#334155';
      mainCtx.lineWidth = 1.6;
      mainCtx.beginPath();
      mainCtx.moveTo(ax + 2, 451);
      mainCtx.quadraticCurveTo(ax + 24, 422 + sway * 0.5, ax + 45, 432 + sway);
      mainCtx.stroke();
      mainCtx.strokeStyle = 'rgba(226, 232, 240, 0.38)';
      mainCtx.lineWidth = 0.85;
      mainCtx.beginPath();
      mainCtx.moveTo(ax + 45, 432 + sway);
      mainCtx.lineTo(ax + 47, 544);
      mainCtx.stroke();
      mainCtx.restore();
    }

    // 3B. Detailed Live 1914 Red Istiklal Nostalgic Tram gliding across Galata Bridge on Rails & Overhead Wire
    mainCtx.save();
    mainCtx.strokeStyle = 'rgba(148, 163, 184, 0.55)';
    mainCtx.lineWidth = 1.2;
    mainCtx.beginPath();
    mainCtx.moveTo(0, 404);
    mainCtx.lineTo(w, 404);
    mainCtx.stroke();
    mainCtx.fillStyle = '#475569';
    mainCtx.fillRect(0, 467, w, 2.2);
    mainCtx.restore();

    const tramX = ((time * 88 - camX * 0.42) % (w + 520) + (w + 520)) % (w + 520) - 240;
    const bgWheelRot = (tramX * 0.14);
    mainCtx.save();
    mainCtx.translate(tramX, 421);

    // Articulated Diamond Scissor Pantograph + Collector Shoe touching overhead wire at y = -17
    mainCtx.strokeStyle = '#92400e';
    mainCtx.lineWidth = 2.4;
    mainCtx.beginPath();
    mainCtx.moveTo(50, -3);
    mainCtx.lineTo(44, -10);
    mainCtx.lineTo(59, -17);
    mainCtx.lineTo(74, -10);
    mainCtx.lineTo(68, -3);
    mainCtx.stroke();
    mainCtx.strokeStyle = '#fbbf24';
    mainCtx.lineWidth = 1.3;
    mainCtx.stroke();
    mainCtx.fillStyle = '#1e293b';
    mainCtx.fillRect(52, -18.5, 14, 2.4);
    if (Math.sin(time * 18) > 0.88) {
      mainCtx.fillStyle = '#fef08a';
      mainCtx.beginPath();
      mainCtx.arc(59, -17, 4.0, 0, Math.PI * 2);
      mainCtx.fill();
    }

    // Raised Cream Clerestory Roof Monitor with Tiny Louvers & Destination Board
    mainCtx.fillStyle = '#fef3c7';
    mainCtx.strokeStyle = '#1e1b18';
    mainCtx.lineWidth = 1.3;
    mainCtx.beginPath();
    mainCtx.roundRect(14, -5, 92, 6, [3, 3, 0, 0]);
    mainCtx.fill();
    mainCtx.stroke();
    mainCtx.fillStyle = '#92400e';
    for (let lx = 22; lx <= 94; lx += 12) mainCtx.fillRect(lx, -3.5, 6, 2.2);
    mainCtx.fillStyle = '#450a0a';
    mainCtx.fillRect(36, 1, 48, 6.5);
    mainCtx.fillStyle = '#fef08a';
    mainCtx.font = 'bold 5.5px sans-serif';
    mainCtx.textAlign = 'center';
    mainCtx.fillText('TAKSİM • TÜNEL', 60, 6);

    // Sculpted Vintage Crimson-and-Ivory Wooden Streetcar Body
    const trG = mainCtx.createLinearGradient(0, 0, 0, 42);
    trG.addColorStop(0, '#ef4444');
    trG.addColorStop(0.55, '#b91c1c');
    trG.addColorStop(1, '#7f1d1d');
    mainCtx.fillStyle = trG;
    mainCtx.strokeStyle = '#1e1b18';
    mainCtx.lineWidth = 1.5;
    mainCtx.beginPath();
    mainCtx.roundRect(0, 0, 120, 41, [7, 7, 2, 2]);
    mainCtx.fill();
    mainCtx.stroke();
    mainCtx.fillStyle = '#fffbeb';
    mainCtx.fillRect(4, 9, 112, 18);
    mainCtx.fillStyle = '#fbbf24';
    mainCtx.fillRect(3, 27.5, 114, 2.2);
    mainCtx.fillRect(3, 7.5, 114, 1.5);
    mainCtx.strokeStyle = '#fbbf24';
    mainCtx.lineWidth = 1.3;
    mainCtx.beginPath();
    mainCtx.moveTo(6, 10);
    mainCtx.lineTo(6, 36);
    mainCtx.moveTo(114, 10);
    mainCtx.lineTo(114, 36);
    mainCtx.stroke();

    // 4 Arched Mahogany-Framed Windows with Warm Interior Glow, Curtains & Silhouettes
    for (let wi = 0; wi < 4; wi++) {
      const wx = 12 + wi * 24.5;
      const wG = mainCtx.createLinearGradient(wx, 11, wx, 25);
      wG.addColorStop(0, '#fef9c3');
      wG.addColorStop(1, '#f59e0b');
      mainCtx.fillStyle = wG;
      mainCtx.strokeStyle = '#78350f';
      mainCtx.lineWidth = 1.3;
      mainCtx.beginPath();
      mainCtx.roundRect(wx, 10.5, 19, 15, [4, 4, 1, 1]);
      mainCtx.fill();
      mainCtx.stroke();
      mainCtx.fillStyle = 'rgba(127, 29, 29, 0.30)';
      mainCtx.beginPath();
      mainCtx.arc(wx + 9.5, 17, 2.8, 0, Math.PI * 2);
      mainCtx.fill();
      mainCtx.fillStyle = '#9f1239';
      mainCtx.fillRect(wx + 1, 11, 2.8, 5);
    }

    // Steel Bogie Frame, Twin Spoked Wheels & Iron Cowcatcher on Bridge Rails
    mainCtx.fillStyle = '#1e293b';
    mainCtx.fillRect(16, 40, 88, 4.5);
    for (const bx of [26, 44, 76, 94]) {
      mainCtx.save();
      mainCtx.translate(bx, 44.5);
      mainCtx.rotate(bgWheelRot);
      mainCtx.fillStyle = '#0f172a';
      mainCtx.strokeStyle = '#94a3b8';
      mainCtx.lineWidth = 1.2;
      mainCtx.beginPath();
      mainCtx.arc(0, 0, 3.8, 0, Math.PI * 2);
      mainCtx.fill();
      mainCtx.stroke();
      mainCtx.beginPath();
      mainCtx.moveTo(-3, 0);
      mainCtx.lineTo(3, 0);
      mainCtx.stroke();
      mainCtx.restore();
    }
    mainCtx.strokeStyle = '#0f172a';
    mainCtx.lineWidth = 1.8;
    mainCtx.beginPath();
    mainCtx.moveTo(118, 39);
    mainCtx.lineTo(126, 46);
    mainCtx.lineTo(113, 46);
    mainCtx.stroke();
    mainCtx.fillStyle = '#fbbf24';
    mainCtx.beginPath();
    mainCtx.arc(117, 24, 2.2, 0, Math.PI * 2);
    mainCtx.fill();
    const headCone = mainCtx.createLinearGradient(120, 32, 188, 32);
    headCone.addColorStop(0, 'rgba(254, 240, 138, 0.56)');
    headCone.addColorStop(1, 'rgba(254, 240, 138, 0)');
    mainCtx.fillStyle = headCone;
    mainCtx.beginPath();
    mainCtx.moveTo(120, 28);
    mainCtx.lineTo(188, 16);
    mainCtx.lineTo(188, 45);
    mainCtx.lineTo(120, 36);
    mainCtx.closePath();
    mainCtx.fill();
    mainCtx.fillStyle = '#fef08a';
    mainCtx.strokeStyle = '#b45309';
    mainCtx.lineWidth = 1.2;
    mainCtx.beginPath();
    mainCtx.arc(120, 32, 4.0, 0, Math.PI * 2);
    mainCtx.fill();
    mainCtx.stroke();
    mainCtx.restore();

    // 3C. Sparkling Cool Daylight Silver-Cyan Reflections on Bosphorus Water
    const sunRefX = 955 - (camX * 0.012) % 220;
    for (let r = 0; r < 10; r++) {
      const ry = 530 + r * 11;
      const rw = 64 - r * 3.6 + Math.sin(time * 2.8 + r * 1.3) * 14;
      mainCtx.fillStyle = `rgba(240, 249, 255, ${(0.52 - r * 0.036).toFixed(2)})`;
      mainCtx.fillRect(sunRefX - rw * 0.5 + Math.sin(time * 2.1 + r) * 8, ry, rw, 2.6);
    }
    mainCtx.fillStyle = 'rgba(224, 242, 254, 0.36)';
    for (let s = 0; s < 16; s++) {
      const sx = ((s * 113 - camX * 0.24 + Math.sin(time * 1.6 + s) * 15) % w + w) % w;
      const sy = 534 + (s % 5) * 18;
      mainCtx.fillRect(sx, sy, 28 + (s % 3) * 14, 2.2);
    }

    // 3D. Detailed Double-Deck Golden Horn Bosphorus Sightseeing Boat (Boğaz Tur Teknesi) gliding eastward
    const tourX = (((time * 22 - camX * 0.28) % (w + 380)) + (w + 380)) % (w + 380) - 180;
    mainCtx.save();
    mainCtx.translate(tourX, 534 + Math.sin(time * 1.9) * 1.5);
    mainCtx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
    mainCtx.lineWidth = 1.6;
    mainCtx.beginPath();
    mainCtx.moveTo(-28, 12);
    mainCtx.quadraticCurveTo(-8, 11, 4, 10);
    mainCtx.moveTo(-18, 14.5);
    mainCtx.quadraticCurveTo(-2, 13.5, 10, 12.5);
    mainCtx.stroke();
    mainCtx.fillStyle = '#0284c7';
    mainCtx.strokeStyle = '#0c4a6e';
    mainCtx.lineWidth = 1.0;
    mainCtx.beginPath();
    mainCtx.roundRect(14, -13, 56, 3.2, 1.5);
    mainCtx.fill();
    mainCtx.stroke();
    mainCtx.strokeStyle = '#e2e8f0';
    mainCtx.lineWidth = 1.0;
    for (const px0 of [18, 34, 50, 66]) {
      mainCtx.beginPath();
      mainCtx.moveTo(px0, -10);
      mainCtx.lineTo(px0, -3);
      mainCtx.stroke();
    }
    mainCtx.fillStyle = '#ffffff';
    mainCtx.strokeStyle = '#1e293b';
    mainCtx.lineWidth = 1.1;
    mainCtx.beginPath();
    mainCtx.roundRect(10, -4, 68, 9, [2, 4, 0, 0]);
    mainCtx.fill();
    mainCtx.stroke();
    mainCtx.fillStyle = '#7dd3fc';
    for (let tw = 15; tw <= 63; tw += 10) {
      mainCtx.beginPath();
      mainCtx.roundRect(tw, -2, 7.2, 4.8, [2, 2, 0, 0]);
      mainCtx.fill();
    }
    mainCtx.fillStyle = '#f8fafc';
    mainCtx.strokeStyle = '#0f172a';
    mainCtx.lineWidth = 1.2;
    mainCtx.beginPath();
    mainCtx.moveTo(2, 4);
    mainCtx.quadraticCurveTo(46, 5.5, 92, 2);
    mainCtx.quadraticCurveTo(88, 10, 80, 12);
    mainCtx.lineTo(8, 12);
    mainCtx.quadraticCurveTo(2, 9, 2, 4);
    mainCtx.closePath();
    mainCtx.fill();
    mainCtx.stroke();
    mainCtx.fillStyle = '#0369a1';
    mainCtx.fillRect(6, 7.5, 78, 2.2);
    mainCtx.fillStyle = '#be123c';
    mainCtx.fillRect(8, 9.8, 73, 2.0);
    mainCtx.strokeStyle = '#64748b';
    mainCtx.lineWidth = 1.0;
    mainCtx.beginPath();
    mainCtx.moveTo(5, 4);
    mainCtx.lineTo(2, -8);
    mainCtx.stroke();
    drawTurkishFlag(mainCtx, -8, -8, 10, 6.5, time, 1.1);
    mainCtx.restore();

    // 3E. Iconic Historic Şehir Hatları Bosphorus Vapur Ferry steaming westward + Lifeboats & Turkish Flag!
    const vapX = w + 200 - (((time * 42 + camX * 0.36) % (w + 480) + (w + 480)) % (w + 480));
    const vapY = 556 + Math.sin(time * 2.3) * 2.4;
    mainCtx.save();
    mainCtx.translate(vapX, vapY);

    mainCtx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    mainCtx.lineWidth = 2.2;
    mainCtx.beginPath();
    mainCtx.moveTo(-10, 23);
    mainCtx.quadraticCurveTo(16, 27, 46, 26);
    mainCtx.moveTo(148, 21);
    mainCtx.quadraticCurveTo(194, 24, 248, 26);
    mainCtx.stroke();
    mainCtx.strokeStyle = 'rgba(186, 230, 253, 0.65)';
    mainCtx.lineWidth = 1.6;
    mainCtx.beginPath();
    mainCtx.moveTo(142, 25);
    mainCtx.quadraticCurveTo(182, 29, 224, 31);
    mainCtx.stroke();

    mainCtx.strokeStyle = '#64748b';
    mainCtx.lineWidth = 1.3;
    mainCtx.beginPath();
    mainCtx.moveTo(18, -5);
    mainCtx.lineTo(15, -34);
    mainCtx.moveTo(11, -24);
    mainCtx.lineTo(22, -24);
    mainCtx.stroke();
    mainCtx.fillStyle = '#22c55e';
    mainCtx.beginPath();
    mainCtx.arc(15, -34, 1.8, 0, Math.PI * 2);
    mainCtx.fill();

    const vFunG = mainCtx.createLinearGradient(66, -37, 83, -37);
    vFunG.addColorStop(0, '#fde047');
    vFunG.addColorStop(0.55, '#f59e0b');
    vFunG.addColorStop(1, '#b45309');
    mainCtx.fillStyle = vFunG;
    mainCtx.strokeStyle = '#1e293b';
    mainCtx.lineWidth = 1.4;
    mainCtx.beginPath();
    mainCtx.moveTo(66, -15);
    mainCtx.lineTo(68, -37);
    mainCtx.lineTo(82, -37);
    mainCtx.lineTo(84, -15);
    mainCtx.closePath();
    mainCtx.fill();
    mainCtx.stroke();
    mainCtx.fillStyle = '#0f172a';
    mainCtx.fillRect(67.6, -37, 14.8, 6.2);
    mainCtx.fillStyle = '#dc2626';
    mainCtx.fillRect(67.2, -27.5, 15.6, 2.8);
    mainCtx.strokeStyle = '#fde047';
    mainCtx.lineWidth = 1.5;
    mainCtx.beginPath();
    mainCtx.moveTo(65, -16);
    mainCtx.lineTo(66.5, -33);
    mainCtx.stroke();

    mainCtx.fillStyle = '#ffffff';
    mainCtx.strokeStyle = '#1e293b';
    mainCtx.lineWidth = 1.3;
    mainCtx.beginPath();
    mainCtx.roundRect(32, -17, 78, 12, [3, 3, 0, 0]);
    mainCtx.fill();
    mainCtx.stroke();
    mainCtx.fillStyle = '#92400e';
    mainCtx.strokeStyle = '#451a03';
    mainCtx.beginPath();
    mainCtx.roundRect(22, -20, 17, 15, [3, 2, 0, 0]);
    mainCtx.fill();
    mainCtx.stroke();
    mainCtx.fillStyle = '#bae6fd';
    mainCtx.fillRect(24, -17.5, 11, 5.5);

    mainCtx.fillStyle = '#ffffff';
    mainCtx.strokeStyle = '#1e293b';
    mainCtx.lineWidth = 1.4;
    mainCtx.beginPath();
    mainCtx.roundRect(14, -5, 118, 15, [3, 3, 0, 0]);
    mainCtx.fill();
    mainCtx.stroke();
    for (let p = 0; p < 8; p++) {
      mainCtx.fillStyle = '#bae6fd';
      mainCtx.strokeStyle = '#334155';
      mainCtx.lineWidth = 0.8;
      mainCtx.beginPath();
      mainCtx.roundRect(19 + p * 13.5, -2.5, 9.2, 7.8, [3, 3, 0, 0]);
      mainCtx.fill();
      mainCtx.stroke();
    }
    for (let p = 0; p < 4; p++) {
      mainCtx.fillStyle = '#e0f2fe';
      mainCtx.beginPath();
      mainCtx.roundRect(42 + p * 15.5, -14.5, 10.5, 6.5, [2.5, 2.5, 0, 0]);
      mainCtx.fill();
    }
    mainCtx.fillStyle = '#fef3c7';
    mainCtx.strokeStyle = '#b45309';
    mainCtx.lineWidth = 1.0;
    mainCtx.beginPath();
    mainCtx.ellipse(98, -12, 8.5, 3.2, 0, 0, Math.PI * 2);
    mainCtx.fill();
    mainCtx.stroke();

    mainCtx.save();
    mainCtx.beginPath();
    mainCtx.moveTo(-10, 7);
    mainCtx.quadraticCurveTo(72, 11, 154, 9);
    mainCtx.quadraticCurveTo(150, 21, 140, 25);
    mainCtx.lineTo(8, 25);
    mainCtx.quadraticCurveTo(-4, 19, -10, 7);
    mainCtx.closePath();
    mainCtx.clip();

    const vHullG = mainCtx.createLinearGradient(0, 7, 0, 25);
    vHullG.addColorStop(0.00, '#ffffff');
    vHullG.addColorStop(0.55, '#e2e8f0');
    vHullG.addColorStop(0.57, '#0369a1');
    vHullG.addColorStop(0.80, '#0f172a');
    vHullG.addColorStop(0.82, '#be123c');
    vHullG.addColorStop(1.00, '#881337');
    mainCtx.fillStyle = vHullG;
    mainCtx.fillRect(-12, 6, 170, 21);
    mainCtx.fillStyle = '#fbbf24';
    mainCtx.fillRect(-10, 11.5, 166, 1.8);
    mainCtx.restore();

    mainCtx.strokeStyle = '#1e293b';
    mainCtx.lineWidth = 1.5;
    mainCtx.beginPath();
    mainCtx.moveTo(-10, 7);
    mainCtx.quadraticCurveTo(72, 11, 154, 9);
    mainCtx.quadraticCurveTo(150, 21, 140, 25);
    mainCtx.lineTo(8, 25);
    mainCtx.quadraticCurveTo(-4, 19, -10, 7);
    mainCtx.closePath();
    mainCtx.stroke();

    for (let px0 = 14; px0 <= 134; px0 += 20) {
      mainCtx.fillStyle = '#fef08a';
      mainCtx.strokeStyle = '#92400e';
      mainCtx.lineWidth = 0.9;
      mainCtx.beginPath();
      mainCtx.arc(px0, 16, 2.2, 0, Math.PI * 2);
      mainCtx.fill();
      mainCtx.stroke();
    }

    mainCtx.strokeStyle = '#64748b';
    mainCtx.lineWidth = 1.3;
    mainCtx.beginPath();
    mainCtx.moveTo(148, 9);
    mainCtx.lineTo(153, -10);
    mainCtx.stroke();
    drawTurkishFlag(mainCtx, 153, -10, 17, 10.5, time, 0.5);

    for (let sm = 0; sm < 3; sm++) {
      const sf = (time * 0.75 + sm * 0.33) % 1;
      mainCtx.fillStyle = `rgba(255, 255, 255, ${(0.55 * (1 - sf)).toFixed(2)})`;
      mainCtx.beginPath();
      mainCtx.arc(75 + sf * 44, -41 - sf * 19, 4.5 + sf * 7.5, 0, Math.PI * 2);
      mainCtx.fill();
    }
    mainCtx.restore();

    // 3F. Wheeling Flocks of Snow-White Bosphorus Seagulls with Black Primary Wingtips!
    mainCtx.lineCap = 'round';
    for (let b = 0; b < 9; b++) {
      const bx = ((b * 175 + time * (28 + (b % 3) * 7) - camX * 0.14) % (w + 180) + (w + 180)) % (w + 180) - 90;
      const by = 88 + (b % 4) * 36 + Math.sin(time * 2.2 + b * 1.4) * 10;
      const wing = Math.sin(time * 7.2 + b * 1.9) * 6.2;
      mainCtx.save();
      mainCtx.translate(bx, by);
      // White gull body & angled silver-white wings
      mainCtx.strokeStyle = '#ffffff';
      mainCtx.lineWidth = 2.5;
      mainCtx.beginPath();
      mainCtx.moveTo(-13, -wing);
      mainCtx.quadraticCurveTo(-5, -4, 0, 0);
      mainCtx.quadraticCurveTo(5, -4, 13, -wing);
      mainCtx.stroke();
      // Black gull wingtips
      mainCtx.strokeStyle = '#0f172a';
      mainCtx.lineWidth = 2.2;
      mainCtx.beginPath();
      mainCtx.moveTo(-13, -wing);
      mainCtx.lineTo(-16, -wing + 1.5);
      mainCtx.moveTo(13, -wing);
      mainCtx.lineTo(16, -wing + 1.5);
      mainCtx.stroke();
      mainCtx.fillStyle = '#f8fafc';
      mainCtx.beginPath();
      mainCtx.ellipse(0, 0, 4.2, 2.0, 0, 0, Math.PI * 2);
      mainCtx.fill();
      mainCtx.fillStyle = '#f59e0b';
      mainCtx.fillRect(3.8, -0.8, 2.6, 1.5);
      mainCtx.restore();
    }

    // Cool Bosphorus sea-spray sparkles drifting in the breeze
    mainCtx.fillStyle = 'rgba(240, 249, 255, 0.55)';
    for (let m = 0; m < 12; m++) {
      const mx = ((m * 131 - camX * 0.55 + time * 14) % w + w) % w;
      const my = 180 + ((m * 73 + Math.sin(time * 1.3 + m) * 28) % 340);
      mainCtx.beginPath();
      mainCtx.arc(mx, my, 1.4 + (m % 2) * 0.7, 0, Math.PI * 2);
      mainCtx.fill();
    }
  }

  // =========================================================================
  // 3. FOREGROUND BOSPHORUS SEA CHANNEL & BESPOKE OTTOMAN SEBIL CHECKPOINT
  // =========================================================================
  function drawIstanbulWaterChannel(ctx, px, py, w, h, time) {
    ctx.save();
    const wG = ctx.createLinearGradient(px, py, px, py + h);
    wG.addColorStop(0.00, 'rgba(14, 165, 233, 0.90)');
    wG.addColorStop(0.38, 'rgba(2, 132, 199, 0.95)');
    wG.addColorStop(1.00, 'rgba(7, 89, 133, 0.99)');
    ctx.fillStyle = wG;
    ctx.beginPath();
    ctx.moveTo(px, py + h);
    for (let x = 0; x <= w; x += 24) {
      const wy = py + Math.sin(time * 3.8 + (px + x) * 0.045) * 4.5;
      ctx.lineTo(px + x, wy);
    }
    ctx.lineTo(px + w, py + h);
    ctx.closePath();
    ctx.fill();

    // Crisp snow-white Bosphorus sea-foam crest ribbon
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 20) {
      const wy = py + Math.sin(time * 3.8 + (px + x) * 0.045) * 4.5;
      if (x === 0) ctx.moveTo(px + x, wy);
      else ctx.lineTo(px + x, wy);
    }
    ctx.stroke();

    ctx.fillStyle = 'rgba(224, 242, 254, 0.52)';
    for (let rx = 18; rx < w - 24; rx += 54) {
      const shimmerX = px + rx + Math.sin(time * 2.5 + rx) * 8;
      ctx.fillRect(shimmerX, py + 14 + (rx % 3) * 8, 28, 2.4);
    }
    ctx.restore();
  }

  function drawIstanbulCheckpoint(ctx, cp, cx, cy, time) {
    const lit = !!cp.activated;
    const baseY = cy + (cp.h || 32);
    ctx.save();
    ctx.translate(cx + 22, baseY);

    // Ornate Ottoman Sultanahmet Marble Sebil / Çeşme Fountain Sanctuary!
    if (lit) {
      const halo = ctx.createRadialGradient(0, -48, 6, 0, -48, 56);
      halo.addColorStop(0, 'rgba(254, 240, 138, 0.65)');
      halo.addColorStop(0.55, 'rgba(56, 189, 248, 0.24)');
      halo.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0, -48, 56, 0, Math.PI * 2);
      ctx.fill();
    }

    // Carved Marmara marble fountain body
    const mG = ctx.createLinearGradient(-22, -74, 22, 0);
    mG.addColorStop(0, '#ffffff');
    mG.addColorStop(0.55, '#e2e8f0');
    mG.addColorStop(1, '#94a3b8');
    ctx.fillStyle = mG;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(-21, -68, 42, 68, [8, 8, 2, 2]);
    ctx.fill();
    ctx.stroke();

    // Ottomon Lead Eave Canopy & Gilded Finial
    ctx.fillStyle = '#0f766e';
    ctx.strokeStyle = '#134e4a';
    ctx.beginPath();
    ctx.moveTo(-27, -68);
    ctx.quadraticCurveTo(0, -86, 27, -68);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-26, -69, 52, 3.2);
    ctx.beginPath();
    ctx.arc(0, -82, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Iznik Cobalt-Turquoise Pointed Arch Niche
    const izG = ctx.createLinearGradient(0, -58, 0, -14);
    izG.addColorStop(0, lit ? '#0284c7' : '#334155');
    izG.addColorStop(1, lit ? '#0369a1' : '#1e293b');
    ctx.fillStyle = izG;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-13, -14);
    ctx.lineTo(-13, -44);
    ctx.quadraticCurveTo(0, -60, 13, -44);
    ctx.lineTo(13, -14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Brass Spout + Flowing Sparkling Water into Marble Basin when Activated!
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-3, -30, 6, 4);
    if (lit) {
      ctx.strokeStyle = '#7dd3fc';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(0, -26);
      ctx.lineTo(Math.sin(time * 12) * 1.2, -12);
      ctx.stroke();
    }
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(-16, -13, 32, 9, [2, 2, 6, 6]);
    ctx.fill();
    ctx.stroke();

    // Glowing Faceted Mosaic Lantern suspended beside the Sebil
    const swing = Math.sin(time * 3.2) * 2.2;
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(21, -62);
    ctx.lineTo(29, -62);
    ctx.lineTo(29 + swing * 0.4, -50);
    ctx.stroke();
    ctx.fillStyle = lit ? '#fde047' : '#64748b';
    ctx.strokeStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(29 + swing * 0.4, -45, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  // =========================================================================
  // 4. MONUMENTAL GALATA TOWER & IMPERIAL DOLMABAHÇE MARBLE TRIUMPHAL GATE
  // =========================================================================
  function drawIstanbulGalataGate(ctx, g, gx, gy, time, label) {
    ctx.save();
    const cx = gx + g.w * 0.5;
    const botY = gy + g.h;
    const gw = Math.max(124, g.w + 26);
    const leftX = cx - gw * 0.5;
    const rightX = cx + gw * 0.5;
    const topY = gy - 18;

    // 1. Monumental Genoese Galata Tower soaring behind the Imperial Marble Gate
    drawGalataTowerLandmark(ctx, cx, botY, 0.74);

    // 2. Radiant Sky-Sapphire & Golden Victory Portal Core inside the archway
    const portalR = gw * 0.30;
    const portalCy = botY - 48;
    const pGlow = ctx.createRadialGradient(cx, portalCy, 4, cx, portalCy, portalR * 1.65);
    pGlow.addColorStop(0.00, 'rgba(255, 255, 255, 0.98)');
    pGlow.addColorStop(0.32, 'rgba(186, 230, 253, 0.90)');
    pGlow.addColorStop(0.68, 'rgba(14, 165, 233, 0.52)');
    pGlow.addColorStop(1.00, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = pGlow;
    ctx.beginPath();
    ctx.arc(cx, portalCy, portalR * 1.65, 0, Math.PI * 2);
    ctx.fill();

    // Inner recessed ogee portal backing with swirling starlight rings
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx - portalR, botY - 6);
    ctx.lineTo(cx - portalR, gy + 44);
    ctx.quadraticCurveTo(cx - portalR, gy + 10, cx, gy + 2);
    ctx.quadraticCurveTo(cx + portalR, gy + 10, cx + portalR, gy + 44);
    ctx.lineTo(cx + portalR, botY - 6);
    ctx.closePath();
    ctx.clip();
    const inG = ctx.createLinearGradient(cx, gy, cx, botY);
    inG.addColorStop(0, '#0284c7');
    inG.addColorStop(0.5, '#38bdf8');
    inG.addColorStop(1, '#e0f2fe');
    ctx.fillStyle = inG;
    ctx.fillRect(cx - portalR, gy, portalR * 2, g.h + 10);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.58)';
    ctx.lineWidth = 1.6;
    for (let ring = 0; ring < 3; ring++) {
      const rr = 14 + ((time * 22 + ring * 18) % 38);
      ctx.globalAlpha = Math.max(0, 1 - rr / 52);
      ctx.beginPath();
      ctx.arc(cx, botY - 44, rr, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    // 3. Carved White Marmara-Marble Archway Body + Cobalt-Turquoise Iznik Tile Spandrels
    const traceMarbleArch = () => {
      ctx.beginPath();
      ctx.moveTo(leftX, botY);
      ctx.lineTo(leftX, topY + 20);
      ctx.lineTo(rightX, topY + 20);
      ctx.lineTo(rightX, botY);
      ctx.lineTo(cx + portalR, botY);
      ctx.lineTo(cx + portalR, gy + 44);
      ctx.quadraticCurveTo(cx + portalR, gy + 10, cx, gy + 2);
      ctx.quadraticCurveTo(cx - portalR, gy + 10, cx - portalR, gy + 44);
      ctx.lineTo(cx - portalR, botY);
      ctx.closePath();
    };
    ctx.save();
    traceMarbleArch();
    ctx.clip();
    fillAshlarMasonry(ctx, leftX, topY + 18, gw, botY - topY, 12, 22, MARBLE_PAL, 61);
    // Hand-painted Cobalt & Turquoise Iznik Spandrel Panels above the pointed arch
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(leftX + 16, topY + 26, gw - 32, 34);
    for (const sx of [-portalR * 0.78, portalR * 0.78]) {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cx + sx, topY + 42, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(cx + sx, topY + 42, 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f43f5e';
      for (let a = 0; a < 6; a++) {
        const ang = (a * Math.PI) / 3;
        ctx.beginPath();
        ctx.arc(cx + sx + Math.cos(ang) * 5.8, topY + 42 + Math.sin(ang) * 5.8, 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
    traceMarbleArch();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    // Golden Ottoman Voussoir Arch Trim
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(cx - portalR, botY - 6);
    ctx.lineTo(cx - portalR, gy + 44);
    ctx.quadraticCurveTo(cx - portalR, gy + 10, cx, gy + 2);
    ctx.quadraticCurveTo(cx + portalR, gy + 10, cx + portalR, gy + 44);
    ctx.lineTo(cx + portalR, botY - 6);
    ctx.stroke();

    // 4. Twin Fluted Marble Columns with Gilded Muqarnas Capitals & Octagonal Plinths
    for (const colX of [leftX + 10, rightX - 10]) {
      const cG = ctx.createLinearGradient(colX - 8, 0, colX + 8, 0);
      cG.addColorStop(0, '#ffffff');
      cG.addColorStop(0.55, '#e2e8f0');
      cG.addColorStop(1, '#94a3b8');
      ctx.fillStyle = cG;
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.fillRect(colX - 7, topY + 30, 14, botY - (topY + 30) - 10);
      ctx.strokeRect(colX - 7, topY + 30, 14, botY - (topY + 30) - 10);
      // Fluting grooves
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.35)';
      ctx.lineWidth = 0.9;
      for (const fx of [-3.5, 0, 3.5]) {
        ctx.beginPath();
        ctx.moveTo(colX + fx, topY + 33);
        ctx.lineTo(colX + fx, botY - 12);
        ctx.stroke();
      }
      // Gilded Muqarnas Capital & Carved Base
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.roundRect(colX - 10, topY + 21, 20, 10, 2);
      ctx.roundRect(colX - 10, botY - 12, 20, 10, 2);
      ctx.fill();
      ctx.stroke();
    }

    // 5. Open Wrought-Iron & Gold-Leaf Dolmabahçe Palace Filigree Gates!
    for (const dir of [-1, 1]) {
      const hingeX = cx + dir * portalR;
      const leafW = 15;
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      const lx = dir === -1 ? hingeX : hingeX - leafW;
      ctx.beginPath();
      ctx.roundRect(lx, gy + 36, leafW, botY - (gy + 36) - 6, 2);
      ctx.fill();
      ctx.stroke();
      // Gold filigree scrolls & vertical spears
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 1.1;
      for (const bx of [lx + 4, lx + 8, lx + 11]) {
        ctx.beginPath();
        ctx.moveTo(bx, gy + 34);
        ctx.lineTo(bx, botY - 8);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(lx + leafW * 0.5, gy + 56, 4.2, 0, Math.PI * 2);
      ctx.arc(lx + leafW * 0.5, gy + 78, 4.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 6. Stepped Baroque Cornice + Golden Imperial Ottoman Sunburst & Tughra Medallion
    const cornG = ctx.createLinearGradient(leftX - 8, topY + 6, leftX - 8, topY + 22);
    cornG.addColorStop(0, '#ffffff');
    cornG.addColorStop(0.6, '#cbd5e1');
    cornG.addColorStop(1, '#64748b');
    ctx.fillStyle = cornG;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(leftX - 8, topY + 8, gw + 16, 14, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(leftX - 6, topY + 18, gw + 12, 3.2);

    // Sculpted Golden Sunburst & Emerald-Ruby Imperial Crest
    ctx.save();
    ctx.translate(cx, topY + 4);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.8;
    for (let r = 0; r < 11; r++) {
      const ang = -Math.PI + (r / 10) * Math.PI;
      ctx.beginPath();
      ctx.moveTo(Math.cos(ang) * 10, Math.sin(ang) * 10);
      ctx.lineTo(Math.cos(ang) * 21, Math.sin(ang) * 21);
      ctx.stroke();
    }
    ctx.fillStyle = '#0369a1';
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(-2, 0, 4.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.arc(0, -0.5, 3.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(4.8, -0.5, 2.0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 7. Twin Hanging Mosaic Palace Lanterns + Twin Fluttering Turkish Flags
    for (const side of [-1, 1]) {
      const fx = cx + side * (gw * 0.5 - 6);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(fx, topY + 8);
      ctx.lineTo(fx, topY - 20);
      ctx.stroke();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(fx, topY - 22, 2.6, 0, Math.PI * 2);
      ctx.fill();
      drawTurkishFlag(ctx, fx, topY - 20, 20, 12, time, side === -1 ? 0 : 1.3);

      // Suspended turquoise-ruby lantern beside column
      const lx = cx + side * (portalR + 9);
      const sway = Math.sin(time * 3.2 + side) * 2.0;
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(lx, gy + 24);
      ctx.lineTo(lx + sway, gy + 36);
      ctx.stroke();
      ctx.fillStyle = side === -1 ? '#f43f5e' : '#38bdf8';
      ctx.strokeStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(lx + sway, gy + 41, 5.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // 8. Stepped Marble Threshold & Royal Crimson-Gold Palace Carpet
    ctx.fillStyle = '#e2e8f0';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.6;
    ctx.fillRect(leftX - 10, botY - 6, gw + 20, 8);
    ctx.strokeRect(leftX - 10, botY - 6, gw + 20, 8);
    ctx.fillStyle = '#be123c';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.8;
    ctx.fillRect(cx - portalR - 4, botY - 7, (portalR + 4) * 2, 9);
    ctx.strokeRect(cx - portalR - 4, botY - 7, (portalR + 4) * 2, 9);

    // Floating Royal Banner Plaque
    const isEn = window.Game.I18n && window.Game.I18n.isEn();
    const text = isEn ? 'GALATA PALACE GATE • ISTANBUL' : (label || 'بوابة برج غلطة • إسطنبول');
    const bob = Math.sin(time * 2.6) * 3;
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    const tw = Math.max(200, ctx.measureText(text).width + 34);
    ctx.fillStyle = 'rgba(3, 105, 161, 0.95)';
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.roundRect(cx - tw * 0.5, topY - 46 + bob, tw, 24, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fef9c3';
    ctx.fillText(text, cx, topY - 30 + bob);
    ctx.restore();
  }

  // =========================================================================
  // 5. MUSEUM-GRADE FOREGROUND SURFACES & AUTHENTIC ISTANBUL OBSTACLES
  // =========================================================================
  function drawOttomanHumanVendor(ctx, x, y, vestCol, trimCol, fezCol, time, smile) {
    ctx.save();
    ctx.translate(x, y);
    const breath = Math.sin(time * 3.4 + x * 0.05) * 1.2;
    ctx.translate(0, breath);

    // Shaded crisp white Ottoman cotton shirt & puffed sleeves
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(-15, -56, 6.5, 11, 0.25, 0, Math.PI * 2);
    ctx.ellipse(15, -56, 6.5, 11, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(-14, -73, 28, 34, 7);
    ctx.fill();
    ctx.stroke();

    // Embroidered Ottoman waistcoat (Yelek) with gold braid & crimson sash
    const vG = ctx.createLinearGradient(-13, -72, 13, -42);
    vG.addColorStop(0, vestCol);
    vG.addColorStop(1, '#0f172a');
    ctx.fillStyle = vG;
    ctx.beginPath();
    ctx.moveTo(-13, -72);
    ctx.lineTo(-4, -72);
    ctx.lineTo(-2, -44);
    ctx.lineTo(-13, -44);
    ctx.closePath();
    ctx.moveTo(13, -72);
    ctx.lineTo(4, -72);
    ctx.lineTo(2, -44);
    ctx.lineTo(13, -44);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = trimCol;
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Shaded neck, ears & sculpted head
    ctx.fillStyle = '#d99b72';
    ctx.fillRect(-4, -78, 8, 7);
    ctx.beginPath();
    ctx.arc(-10.5, -85, 2.8, 0, Math.PI * 2);
    ctx.arc(10.5, -85, 2.8, 0, Math.PI * 2);
    ctx.fill();
    const skinG = ctx.createRadialGradient(-3, -88, 2, 0, -85, 12);
    skinG.addColorStop(0, '#fde2cc');
    skinG.addColorStop(0.65, '#f1be96');
    skinG.addColorStop(1, '#c98a63');
    ctx.fillStyle = skinG;
    ctx.strokeStyle = '#3b1d0c';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, -85, 10.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Expressive eyebrows, eyes with sclera & catchlights, nose, and curled Ottoman mustache!
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-4.0, -86.5, 2.4, 1.8, 0, 0, Math.PI * 2);
    ctx.ellipse(4.0, -86.5, 2.4, 1.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(-3.8, -86.5, 1.3, 0, Math.PI * 2);
    ctx.arc(3.8, -86.5, 1.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-4.3, -87.3, 0.9, 0.9);
    ctx.fillRect(3.3, -87.3, 0.9, 0.9);
    // Brows
    ctx.strokeStyle = '#291509';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-6.8, -89.5);
    ctx.quadraticCurveTo(-4.0, -91.2, -1.5, -89.5);
    ctx.moveTo(1.5, -89.5);
    ctx.quadraticCurveTo(4.0, -91.2, 6.8, -89.5);
    ctx.stroke();
    // Nose
    ctx.strokeStyle = '#b4714c';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, -86.5);
    ctx.lineTo(-1.2, -83.0);
    ctx.lineTo(1.0, -82.8);
    ctx.stroke();
    // Classic curled Turkish mustache (Pala Bıyık)!
    ctx.fillStyle = '#291509';
    ctx.beginPath();
    ctx.moveTo(0, -81.8);
    ctx.quadraticCurveTo(-4.5, -83.2, -8.2, -80.2);
    ctx.quadraticCurveTo(-4.5, -79.2, 0, -80.5);
    ctx.quadraticCurveTo(4.5, -79.2, 8.2, -80.2);
    ctx.quadraticCurveTo(4.5, -83.2, 0, -81.8);
    ctx.fill();
    if (smile) {
      ctx.strokeStyle = '#7c2d12';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, -79.5, 2.8, 0.15, Math.PI - 0.15);
      ctx.stroke();
    }

    // Velvet Crimson Fez + Swinging Black Silk Tassel!
    const fG = ctx.createLinearGradient(-9, -104, 9, -92);
    fG.addColorStop(0, fezCol || '#e11d48');
    fG.addColorStop(1, '#881337');
    ctx.fillStyle = fG;
    ctx.strokeStyle = '#3b0712';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-9.5, -93);
    ctx.lineTo(-7.5, -104);
    ctx.lineTo(7.5, -104);
    ctx.lineTo(9.5, -93);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-9.2, -93.8);
    ctx.lineTo(9.2, -93.8);
    ctx.stroke();
    const tasselSway = Math.sin(time * 4.5 + x) * 2.0;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, -104);
    ctx.quadraticCurveTo(9, -103, 11 + tasselSway, -94);
    ctx.stroke();
    ctx.restore();
  }

  function drawIstanbulPlatform(ctx, p, px, py, nv, time) {
    if (p.type === 'istanbul_quay') {
      const viewW = ctx._viewW || 1024;
      const visMinX = Math.max(-48, -px - 48);
      const visMaxX = Math.min(p.w + 48, viewW - px + 48);
      ctx.save();
      ctx.translate(px, py);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 13, p.w, p.h - 13);
      ctx.clip();
      fillAshlarMasonry(ctx, 0, 13, p.w, p.h - 13, 18, 44, STONE_WARM, Math.round(p.x * 0.05), visMinX, visMaxX);
      // Subtle mossy sea-spray tide line & granite depth shading
      const depthG = ctx.createLinearGradient(0, 13, 0, p.h);
      depthG.addColorStop(0.0, 'rgba(255, 248, 232, 0.10)');
      depthG.addColorStop(0.55, 'rgba(15, 23, 42, 0.25)');
      depthG.addColorStop(1.0, 'rgba(12, 74, 110, 0.65)');
      ctx.fillStyle = depthG;
      ctx.fillRect(0, 13, p.w, p.h - 13);
      for (let mx = 34; mx < p.w - 34; mx += 110) {
        if (mx + 20 < visMinX || mx - 20 > visMaxX) continue;
        ctx.fillStyle = 'rgba(20, 184, 166, 0.22)';
        ctx.beginPath();
        ctx.ellipse(mx, p.h - 16, 18, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Hand-painted Ottoman Iznik ceramic turquoise-cobalt-tulip promenade cornice
      const izG = ctx.createLinearGradient(0, 0, 0, 13);
      izG.addColorStop(0, '#0ea5e9');
      izG.addColorStop(0.48, '#0284c7');
      izG.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = izG;
      ctx.fillRect(0, 0, p.w, 13);
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(0, 0.8, p.w, 1.8);
      for (let tx = 14; tx < p.w - 12; tx += 24) {
        if (tx + 16 < visMinX || tx - 8 > visMaxX) continue;
        // Iznik diamond cartouche + crimson tulip blossom
        ctx.fillStyle = '#fef9c3';
        ctx.beginPath();
        ctx.moveTo(tx, 2.0);
        ctx.lineTo(tx + 5.5, 6.5);
        ctx.lineTo(tx, 11.0);
        ctx.lineTo(tx - 5.5, 6.5);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.arc(tx, 6.5, 2.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(tx + 12, 6.5, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(0, 11.2, p.w, 2.0);

      // Cast-iron Ottoman mooring bollards with looped hemp hawser ropes & brass sea-wall rings!
      if (p.w >= 420) {
        for (let bx = 95; bx < p.w - 95; bx += 360) {
          if (bx + 170 < visMinX || bx - 20 > visMaxX) continue;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
          ctx.beginPath();
          ctx.ellipse(bx + 2, 0.5, 12, 3, 0, 0, Math.PI * 2);
          ctx.fill();
          const bolG = ctx.createLinearGradient(bx - 8, -16, bx + 8, 0);
          bolG.addColorStop(0, '#475569');
          bolG.addColorStop(0.5, '#1e293b');
          bolG.addColorStop(1, '#090d16');
          ctx.fillStyle = bolG;
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.4;
          ctx.fillRect(bx - 7, -15, 14, 15);
          ctx.strokeRect(bx - 7, -15, 14, 15);
          ctx.beginPath();
          ctx.ellipse(bx, -15.5, 9.8, 3.8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Coiled golden hemp hawser rope around bollard
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(bx - 9, -8.5);
          ctx.quadraticCurveTo(bx, -5.5, bx + 9.5, -7.5);
          ctx.moveTo(bx - 8.5, -5.0);
          ctx.quadraticCurveTo(bx, -2.5, bx + 14, 0);
          ctx.stroke();
          // Brass mooring ring on sea-wall face
          ctx.fillStyle = '#451a03';
          ctx.beginPath();
          ctx.arc(bx + 155, 28, 3.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.arc(bx + 155, 34, 7.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.strokeStyle = '#291a10';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(0, 0, p.w, p.h);
      ctx.restore();
      return true;
    }

    if (p.type === 'istanbul_bazaar_floor') {
      ctx.save();
      ctx.translate(px, py);
      if (p.oneWay) {
        // ELEVATED OTTOMAN CARVED WALNUT & IZNIK-TILE CUMBA BALCONY (S-scrolled corbels, draped Anatolian carpet valance & swaying mosaic lantern!)
        const corbelXs = p.w >= 190 ? [18, p.w * 0.5 - 6, p.w - 30] : [14, p.w - 26];
        for (const bx of corbelXs) {
          const cG = ctx.createLinearGradient(bx, p.h, bx + 12, p.h + 18);
          cG.addColorStop(0, '#92400e');
          cG.addColorStop(1, '#3b1d0c');
          ctx.fillStyle = cG;
          ctx.strokeStyle = '#1f120b';
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(bx, p.h - 1);
          ctx.lineTo(bx + 12, p.h - 1);
          ctx.bezierCurveTo(bx + 12, p.h + 8, bx + 7, p.h + 12, bx + 7, p.h + 18);
          ctx.lineTo(bx + 3, p.h + 18);
          ctx.bezierCurveTo(bx + 3, p.h + 11, bx, p.h + 7, bx, p.h - 1);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(bx + 6, p.h + 5, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Swaying faceted Turkish mosaic lantern beneath center of balcony
        if (p.w >= 185) {
          const sway = Math.sin(time * 2.8 + (p.x || 0) * 0.02) * 2.0;
          const lx = p.w * 0.5 + 28, ly = p.h + 14;
          ctx.strokeStyle = '#92400e';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(lx, p.h);
          ctx.lineTo(lx + sway * 0.5, ly - 5);
          ctx.stroke();
          ctx.fillStyle = 'rgba(253, 224, 71, 0.30)';
          ctx.beginPath();
          ctx.arc(lx + sway * 0.5, ly, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#38bdf8';
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(lx + sway * 0.5, ly, 5.0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        // Draped crimson-and-gold Anatolian carpet runner hanging from center of balcony!
        const rugW = Math.min(72, p.w * 0.36);
        const rugX = p.w * 0.5 - rugW * 0.5;
        ctx.fillStyle = '#9f1239';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(rugX, p.h - 3, rugW, 11, [0, 0, 4, 4]);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(rugX + 8, p.h - 1, rugW - 16, 5);
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.0;
        for (let fx = rugX + 4; fx <= rugX + rugW - 4; fx += 5) {
          ctx.beginPath();
          ctx.moveTo(fx, p.h + 8);
          ctx.lineTo(fx, p.h + 12);
          ctx.stroke();
        }
      }

      const viewWBz = ctx._viewW || 1024;
      const bzMinX = Math.max(-48, -px - 48);
      const bzMaxX = Math.min(p.w + 48, viewWBz - px + 48);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 10, p.w, p.h - 10);
      ctx.clip();
      fillAshlarMasonry(ctx, 0, 10, p.w, p.h - 10, 14, 34, STONE_WARM, Math.round(p.x * 0.07), bzMinX, bzMaxX);
      ctx.restore();

      // Rich crimson-velvet & gilded Iznik promenade carpet top
      const topG = ctx.createLinearGradient(0, 0, 0, 10);
      topG.addColorStop(0, '#e11d48');
      topG.addColorStop(0.55, '#9f1239');
      topG.addColorStop(1, '#4c0519');
      ctx.fillStyle = topG;
      ctx.fillRect(0, 0, p.w, 10);
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(0, 0.6, p.w, 1.5);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(0, 8.2, p.w, 2.2);
      for (let gx = 12; gx < p.w - 10; gx += 18) {
        if (gx + 8 < bzMinX || gx - 8 > bzMaxX) continue;
        ctx.fillStyle = gx % 36 === 12 ? '#fef08a' : '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(gx, 2.2);
        ctx.lineTo(gx + 4, 5.0);
        ctx.lineTo(gx, 7.8);
        ctx.lineTo(gx - 4, 5.0);
        ctx.closePath();
        ctx.fill();
      }
      ctx.strokeStyle = '#3b1d0c';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(0, 0, p.w, p.h);
      ctx.restore();
      return true;
    }

    if (p.type === 'istanbul_balat_wall') {
      // AUTHENTIC OTTOMAN ALMAŞIK WALL (Alternating Cut Cream Limestone & Crimson Horasan Brick Courses + Carved Kafes Lattice Window & Brass Cleats!)
      ctx.save();
      ctx.translate(px, py);
      const courseH = 12;
      for (let cy0 = 0, rIdx = 0; cy0 < p.h; cy0 += courseH, rIdx++) {
        const ch = Math.min(courseH, p.h - cy0);
        if (rIdx % 2 === 0) {
          const stG = ctx.createLinearGradient(0, cy0, p.w, cy0);
          stG.addColorStop(0, '#f5ebd6');
          stG.addColorStop(0.6, '#dccab0');
          stG.addColorStop(1, '#a89378');
          ctx.fillStyle = stG;
          ctx.fillRect(0, cy0, p.w, ch);
        } else {
          const brG = ctx.createLinearGradient(0, cy0, p.w, cy0);
          brG.addColorStop(0, '#dc2626');
          brG.addColorStop(0.55, '#b91c1c');
          brG.addColorStop(1, '#7f1d1d');
          ctx.fillStyle = brG;
          ctx.fillRect(0, cy0, p.w, ch);
          ctx.strokeStyle = 'rgba(254, 243, 199, 0.35)';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(p.w * 0.5, cy0);
          ctx.lineTo(p.w * 0.5, cy0 + ch);
          ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(41, 21, 9, 0.45)';
        ctx.lineWidth = 1.0;
        ctx.strokeRect(0, cy0, p.w, ch);
      }

      // Miniature arched wooden Ottoman Kafes (Mashrabiya) window mid-tower
      if (p.h >= 145) {
        const wy = Math.round(p.h * 0.44);
        ctx.fillStyle = '#fef08a';
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(p.w * 0.5 - 7, wy, 14, 18, [7, 7, 1, 1]);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(p.w * 0.5 - 6, wy + 6); ctx.lineTo(p.w * 0.5 + 6, wy + 6);
        ctx.moveTo(p.w * 0.5 - 6, wy + 12); ctx.lineTo(p.w * 0.5 + 6, wy + 12);
        ctx.moveTo(p.w * 0.5, wy + 1); ctx.lineTo(p.w * 0.5, wy + 18);
        ctx.stroke();
      }

      // Forged brass-riveted climbing cleats
      for (let ry = 20; ry < p.h - 14; ry += 28) {
        if (p.h >= 145 && Math.abs(ry - p.h * 0.44 - 8) < 13) continue;
        const clG = ctx.createLinearGradient(0, ry, 0, ry + 5.5);
        clG.addColorStop(0, '#fef08a');
        clG.addColorStop(1, '#d97706');
        ctx.fillStyle = clG;
        ctx.strokeStyle = '#291509';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.roundRect(3.5, ry, p.w - 7, 5.2, 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(6.5, ry + 2.6, 1.3, 0, Math.PI * 2);
        ctx.arc(p.w - 6.5, ry + 2.6, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Carved stone cornice cap & climb cue
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.4;
      ctx.fillRect(-2, 0, p.w + 4, 4);
      ctx.strokeRect(-2, 0, p.w + 4, 4);
      ctx.strokeStyle = '#291509';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(0, 0, p.w, p.h);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⬆', p.w * 0.5, 16);
      ctx.restore();
      return true;
    }

    if (p.type === 'istanbul_bazaar_awning') {
      const groundOff = Math.max(48, 615 - (p.y || 548));
      let sag = Math.sin(time * 2.8 + (p.x || 0) * 0.02) * 1.2;
      let bounceImpulse = 0;
      if (p.bounceAnim > 0) {
        const u = 1 - p.bounceAnim;
        bounceImpulse = Math.sin(u * Math.PI * 2.5) * Math.exp(-u * 2.6);
        sag += bounceImpulse * 20;
      }
      const curveY = (t) => 4 * t * (1 - t) * sag;

      ctx.save();
      ctx.translate(px, py);

      // 1. STATIONARY Grounded Grand Bazaar Rug-Stall Context (anchored flush on quay at y = groundOff)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.24)';
      ctx.beginPath();
      ctx.ellipse(p.w * 0.5, groundOff - 1, p.w * 0.48, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Recessed cedar rug-display bench & rolled Anatolian carpets on the quay
      const benchY = groundOff - 17;
      ctx.fillStyle = '#5c341d';
      ctx.strokeStyle = '#291509';
      ctx.lineWidth = 1.3;
      ctx.fillRect(16, benchY, p.w - 32, 6);
      ctx.strokeRect(16, benchY, p.w - 32, 6);
      ctx.fillRect(22, benchY + 6, 5, 11);
      ctx.fillRect(p.w - 27, benchY + 6, 5, 11);
      const rollCols = ['#9f1239', '#0369a1', '#b45309'];
      for (let r = 0; r < 3; r++) {
        const rx = 24 + r * 31;
        const ry = benchY - 7;
        ctx.fillStyle = rollCols[r];
        ctx.strokeStyle = '#291509';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(rx, ry, 28, 8, 3.5);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(rx + 6, ry + 1, 3, 6);
        ctx.fillRect(rx + 19, ry + 1, 3, 6);
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        ctx.ellipse(rx + 26, ry + 4, 2.2, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. STATIONARY Carved Stone Plinths, Turned Walnut-and-Iron Posts & Scrolled Corbel Brackets
      for (const side of [0, 1]) {
        const postX = side === 0 ? 7 : p.w - 7;
        const inward = side === 0 ? 1 : -1;

        // Carved Marmara stone plinth seated flush on quay
        const plG = ctx.createLinearGradient(postX - 8, groundOff - 11, postX + 8, groundOff);
        plG.addColorStop(0, '#f1f5f9');
        plG.addColorStop(0.6, '#cbd5e1');
        plG.addColorStop(1, '#64748b');
        ctx.fillStyle = plG;
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(postX - 7.5, groundOff - 11, 15, 11, [2, 2, 0, 0]);
        ctx.fill();
        ctx.stroke();

        // Turned dark-walnut & iron column rising to brass finial
        const colG = ctx.createLinearGradient(postX - 4, 0, postX + 4, 0);
        colG.addColorStop(0, '#92400e');
        colG.addColorStop(0.45, '#5c341d');
        colG.addColorStop(1, '#291509');
        ctx.fillStyle = colG;
        ctx.strokeStyle = '#1c1008';
        ctx.lineWidth = 1.3;
        ctx.fillRect(postX - 3.6, -7, 7.2, groundOff - 4);
        ctx.strokeRect(postX - 3.6, -7, 7.2, groundOff - 4);

        // Decorative brass collar rings & onion finial on top of post
        ctx.fillStyle = '#fbbf24';
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.0;
        ctx.fillRect(postX - 4.6, 18, 9.2, 3.4);
        ctx.fillRect(postX - 4.8, -7.5, 9.6, 3.5);
        ctx.beginPath();
        ctx.arc(postX, -11, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(postX - 1.8, -14.5);
        ctx.lineTo(postX, -19.5);
        ctx.lineTo(postX + 1.8, -14.5);
        ctx.closePath();
        ctx.fill();

        // Scrolled wrought-iron Ottoman corbel bracket supporting canopy corner
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(postX + inward * 3.5, 29);
        ctx.bezierCurveTo(postX + inward * 14, 24, postX + inward * 16, 12, postX + inward * 24, 9);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(postX + inward * 11, 21, 3.2, 0, Math.PI * 2);
        ctx.stroke();

        // Coiled Brass Tension Spring visibly anchoring canopy edge to stall post!
        const spX0 = postX + inward * 3.8;
        const spX1 = postX + inward * 11.5;
        const spY1 = 5 + sag * 0.14;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(spX0, 4);
        ctx.lineTo(spX0 + inward * 2.2, 1.5);
        ctx.lineTo(spX0 + inward * 4.5, 7.0);
        ctx.lineTo(spX0 + inward * 6.8, 2.0);
        ctx.lineTo(spX1, spY1);
        ctx.stroke();
      }

      // 3. ELASTIC TENSIONED ANATOLIAN KILIM SPRING CANOPY (flexes & rebounds smoothly!)
      const spanL = 11;
      const spanR = p.w - 11;
      const spanW = spanR - spanL;
      const stripes = 7;
      const sw = spanW / stripes;

      for (let i = 0; i < stripes; i++) {
        const t0 = i / stripes;
        const t1 = (i + 1) / stripes;
        const tm = (t0 + t1) * 0.5;
        const x0 = spanL + i * sw;
        const x1 = x0 + sw;
        const xm = (x0 + x1) * 0.5;
        const top0 = curveY(t0);
        const topM = curveY(tm);
        const top1 = curveY(t1);
        const bot0 = top0 + 18;
        const botM = topM + 20;
        const bot1 = top1 + 18;

        // Shaded woven kilim panel
        const pG = ctx.createLinearGradient(xm, topM, xm, botM + 6);
        if (i % 2 === 0) {
          pG.addColorStop(0, '#e11d48');
          pG.addColorStop(0.55, '#be123c');
          pG.addColorStop(1, '#881337');
        } else {
          pG.addColorStop(0, '#fffbeb');
          pG.addColorStop(0.6, '#fef3c7');
          pG.addColorStop(1, '#d6bc8e');
        }
        ctx.fillStyle = pG;
        ctx.strokeStyle = '#4c0519';
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(x0, top0);
        ctx.quadraticCurveTo(xm, topM - 1.5, x1, top1);
        ctx.lineTo(x1, bot1);
        ctx.quadraticCurveTo(xm, botM + sw * 0.44, x0, bot0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Woven Anatolian Kilim diamond medallion (or subtle upward chevron on center ivory panel)
        const cy = topM + 9.5;
        if (i === 3) {
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.moveTo(xm - 5.5, cy + 3.2);
          ctx.lineTo(xm, cy - 2.6);
          ctx.lineTo(xm + 5.5, cy + 3.2);
          ctx.moveTo(xm - 4.0, cy - 1.2);
          ctx.lineTo(xm, cy - 5.2);
          ctx.lineTo(xm + 4.0, cy - 1.2);
          ctx.stroke();
        } else {
          ctx.fillStyle = i % 2 === 0 ? '#fbbf24' : '#0284c7';
          ctx.beginPath();
          ctx.moveTo(xm, cy - 4.8);
          ctx.lineTo(xm + 4.8, cy);
          ctx.lineTo(xm, cy + 4.8);
          ctx.lineTo(xm - 4.8, cy);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = i % 2 === 0 ? '#0369a1' : '#be123c';
          ctx.beginPath();
          ctx.arc(xm, cy, 1.7, 0, Math.PI * 2);
          ctx.fill();
        }

        // Swinging Golden Silk Tassel hanging from each scalloped valance peak
        const tasselSway = Math.sin(time * 4.2 + i * 0.9) * 1.6 + bounceImpulse * (i - 3) * 1.4;
        const ty0 = botM + sw * 0.22;
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(xm, ty0);
        ctx.lineTo(xm + tasselSway, ty0 + 5.5);
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(xm + tasselSway, ty0 + 6.5, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Tensioned Golden Braided Top Edge & Sunlit Highlight along the live elastic curve
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(spanL, 1.2);
      ctx.quadraticCurveTo(p.w * 0.5, 1.2 + sag * 2.0, spanR, 1.2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(spanL + 4, 0.4);
      ctx.quadraticCurveTo(p.w * 0.5, 0.4 + sag * 2.0, spanR - 4, 0.4);
      ctx.stroke();

      ctx.restore();
      return true;
    }

    if (p.type === 'istanbul_tram_car') {
      const dir = (p.moveDir || 1) >= 0 ? 1 : -1;
      const wheelRot = (p.x || 0) * 0.09;
      // Compute WORLD-FIXED stationary viaduct track bounds anchored quay-to-quay!
      const worldOff = (p.x || 0) - px;
      const sX = p.startX !== undefined ? p.startX : (p.minX !== undefined ? p.minX : p.x);
      const eX = p.endX !== undefined ? p.endX : (p.maxX !== undefined ? p.maxX : p.x);
      const trackLeft = (sX - worldOff) - 62;
      const trackRight = (eX + p.w - worldOff) + 62;
      const trackW = Math.max(p.w + 120, trackRight - trackLeft);
      const railY = py + 58;
      const wireY = py - 36;

      ctx.save();
      // 1. STATIONARY Grounded Stone-and-Iron Viaduct Piers descending into the Bosphorus!
      const pierXs = [trackLeft + 44, trackLeft + trackW * 0.5, trackRight - 44];
      for (const pierX of pierXs) {
        const pierH = Math.max(120, 740 - (railY + 12));
        const pG = ctx.createLinearGradient(pierX - 16, 0, pierX + 16, 0);
        pG.addColorStop(0, '#e2d5c3');
        pG.addColorStop(0.55, '#b8a389');
        pG.addColorStop(1, '#6b5845');
        ctx.fillStyle = pG;
        ctx.strokeStyle = '#291a10';
        ctx.lineWidth = 1.5;
        ctx.fillRect(pierX - 14, railY + 12, 28, pierH);
        ctx.strokeRect(pierX - 14, railY + 12, 28, pierH);
        ctx.fillStyle = '#e7dac7';
        ctx.fillRect(pierX - 19, railY + 8, 38, 6);
        ctx.strokeRect(pierX - 19, railY + 8, 38, 6);

        // Stationary Cast-Iron Overhead Catenary Support Mast rising from viaduct pier
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(pierX, railY + 2);
        ctx.lineTo(pierX, wireY - 8);
        ctx.stroke();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(pierX - 14, wireY - 4);
        ctx.lineTo(pierX + 14, wireY - 4);
        ctx.moveTo(pierX, wireY + 10);
        ctx.lineTo(pierX + 10, wireY - 4);
        ctx.moveTo(pierX, wireY + 10);
        ctx.lineTo(pierX - 10, wireY - 4);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(pierX, wireY - 9, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. STATIONARY Overhead Copper Catenary Power Wire spanning quay-to-quay
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.78)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(trackLeft, wireY);
      ctx.lineTo(trackRight, wireY);
      ctx.stroke();

      // 3. STATIONARY Riveted Steel Viaduct Rail Girder & Diagonal Bridge Truss (FIXED in world!)
      const girderG = ctx.createLinearGradient(0, railY, 0, railY + 15);
      girderG.addColorStop(0, '#64748b');
      girderG.addColorStop(0.45, '#334155');
      girderG.addColorStop(1, '#0f172a');
      ctx.fillStyle = girderG;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.fillRect(trackLeft, railY + 2, trackW, 11);
      ctx.strokeRect(trackLeft, railY + 2, trackW, 11);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.48)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let tx = trackLeft + 8; tx < trackRight - 16; tx += 22) {
        ctx.moveTo(tx, railY + 3);
        ctx.lineTo(tx + 11, railY + 12);
        ctx.lineTo(tx + 22, railY + 3);
      }
      ctx.stroke();
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(trackLeft, railY, trackW, 2.5);
      ctx.restore();

      // 4. MOVING Vintage Red Istiklal Tram Car rolling along the fixed rail & overhead wire!
      ctx.save();
      ctx.translate(px, py);

      // Articulated Diamond Scissor Pantograph gliding cleanly along fixed overhead wire (y = -36)
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(p.w * 0.42, 0);
      ctx.lineTo(p.w * 0.34, -18);
      ctx.lineTo(p.w * 0.50, -35);
      ctx.lineTo(p.w * 0.66, -18);
      ctx.lineTo(p.w * 0.58, 0);
      ctx.stroke();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(p.w * 0.50 - 9, -37.5, 18, 3.2);
      if (Math.sin(time * 16 + p.x * 0.05) > 0.86) {
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(p.w * 0.50, -36, 4.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Raised Cream Clerestory Roof Monitor with Ventilator Louvers
      ctx.fillStyle = '#fef3c7';
      ctx.strokeStyle = '#291509';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(14, -5, p.w - 28, 7, [4, 4, 0, 0]);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#b45309';
      for (let vx = 24; vx < p.w - 26; vx += 14) ctx.fillRect(vx, -3.5, 7, 2.8);
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.roundRect(0, 1, p.w, 9, [6, 6, 0, 0]);
      ctx.fill();
      ctx.stroke();

      // Sculpted Crimson & Ivory Nostalgic Istiklal Car Body + Mahogany Trim
      const tG = ctx.createLinearGradient(0, 10, 0, 52);
      tG.addColorStop(0, '#ef4444');
      tG.addColorStop(0.55, '#be123c');
      tG.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = tG;
      ctx.strokeStyle = '#291509';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(4, 10, p.w - 8, 41, [0, 0, 5, 5]);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fffbeb';
      ctx.fillRect(6, 13, p.w - 12, 22);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(6, 35, p.w - 12, 3.0);
      ctx.fillRect(6, 11.5, p.w - 12, 1.8);

      // Arched Mahogany-Framed Passenger Windows with Warm Glow & Silhouettes
      for (let wx = 14; wx < p.w - 26; wx += 28) {
        const wG = ctx.createLinearGradient(wx, 15, wx, 33);
        wG.addColorStop(0, '#fef9c3');
        wG.addColorStop(0.65, '#fde047');
        wG.addColorStop(1, '#f59e0b');
        ctx.fillStyle = wG;
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.roundRect(wx, 15, 21, 18, [5, 5, 1, 1]);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'rgba(127, 29, 29, 0.34)';
        ctx.beginPath();
        ctx.arc(wx + 10.5, 22, 3.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(wx + 5.5, 25.5, 10, 7, [4, 4, 0, 0]);
        ctx.fill();
        ctx.fillStyle = '#9f1239';
        ctx.fillRect(wx + 1, 15.5, 3.5, 6);
        ctx.fillRect(wx + 16.5, 15.5, 3.5, 6);
      }

      // Brass destination plaque
      ctx.fillStyle = '#450a0a';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.roundRect(p.w * 0.5 - 38, 39.5, 76, 10, 2.5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 7.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TAKSİM • TÜNEL', p.w * 0.5, 47);

      // Under-Chassis Steel Bogie Truck & Rotating Spoked Wheels sitting flush on fixed rail (y = 58)
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.fillRect(16, 50, p.w - 32, 5.5);
      ctx.strokeRect(16, 50, p.w - 32, 5.5);
      for (const bx of [28, 48, p.w - 48, p.w - 28]) {
        ctx.save();
        ctx.translate(bx, 54.2);
        ctx.rotate(wheelRot);
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 4.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(-3.6, 0);
        ctx.lineTo(3.6, 0);
        ctx.moveTo(0, -3.6);
        ctx.lineTo(0, 3.6);
        ctx.stroke();
        ctx.restore();
      }
      // Iron cowcatcher & brass headlamp with soft volumetric beam
      const headX = dir >= 0 ? p.w - 4 : 4;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(headX, 50);
      ctx.lineTo(headX + dir * 9, 57.5);
      ctx.lineTo(headX - dir * 5, 57.5);
      ctx.stroke();
      const beamG = ctx.createLinearGradient(headX, 42, headX + dir * 62, 42);
      beamG.addColorStop(0, 'rgba(254, 240, 138, 0.55)');
      beamG.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = beamG;
      ctx.beginPath();
      ctx.moveTo(headX, 38);
      ctx.lineTo(headX + dir * 62, 26);
      ctx.lineTo(headX + dir * 62, 54);
      ctx.lineTo(headX, 46);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(headX, 42, 4.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      return true;
    }

    if (p.type === 'istanbul_vapur_boat') {
      const dir = (p.moveDir || 1) >= 0 ? 1 : -1;
      ctx.save();
      ctx.translate(px, py);

      // 1. Layered Curved Bosphorus Foam Wake & Bow Ripple
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-22, 37);
      ctx.quadraticCurveTo(p.w * 0.5, 45, p.w + 22, 37);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.62)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-12, 41);
      ctx.quadraticCurveTo(p.w * 0.5, 48, p.w + 12, 41);
      ctx.stroke();

      // 2. Mahogany Forward Wheelhouse (Kaptan Köşkü), Upper Salon Cabin, Handrails & Navigation Mast behind Teak Deck
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.roundRect(38, -14, p.w - 76, 14, [3, 3, 0, 0]);
      ctx.fill();
      ctx.stroke();
      for (let swx = 46; swx < p.w - 50; swx += 18) {
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(swx, -10.5, 11, 6.5);
      }
      // Mahogany Pilot Wheelhouse + green starboard navigation lamp
      const whX = dir >= 0 ? p.w - 42 : 20;
      ctx.fillStyle = '#92400e';
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.roundRect(whX, -18, 22, 18, [3, 3, 0, 0]);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(whX + 3, -14.5, 16, 6.5);
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(whX + 11, -20, 2.0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(8, -8);
      ctx.lineTo(p.w - 8, -8);
      ctx.stroke();
      for (let rx = 10; rx <= p.w - 10; rx += 18) {
        ctx.beginPath();
        ctx.moveTo(rx, -8);
        ctx.lineTo(rx, 0);
        ctx.stroke();
      }

      // Iconic Şehir Hatları Flanged Yellow-and-Black Smokestack + Brass Steam Whistle Pipe
      const fx = p.w * 0.5;
      const funG = ctx.createLinearGradient(fx - 10, -32, fx + 10, -32);
      funG.addColorStop(0, '#fde047');
      funG.addColorStop(0.55, '#f59e0b');
      funG.addColorStop(1, '#b45309');
      ctx.fillStyle = funG;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(fx - 9.5, -14);
      ctx.lineTo(fx - 8.5, -33);
      ctx.lineTo(fx + 8.5, -33);
      ctx.lineTo(fx + 9.5, -14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Black soot cap & crimson heritage band
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(fx - 9, -33, 18, 6.5);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(fx - 9.2, -23.5, 18.4, 3.0);
      // Brass steam whistle pipe beside funnel
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(fx + 10, -14);
      ctx.lineTo(fx + 10, -28);
      ctx.stroke();

      // Drifting soft white steam puffs from funnel
      for (let sm = 0; sm < 3; sm++) {
        const sf = (time * 0.85 + sm * 0.33) % 1;
        ctx.fillStyle = `rgba(255, 255, 255, ${(0.52 * (1 - sf)).toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(fx - dir * sf * 28, -37 - sf * 19, 4.2 + sf * 6.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Stern mast & fluttering Turkish flag
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(p.w - 14, 0);
      ctx.lineTo(p.w - 12, -20);
      ctx.stroke();
      drawTurkishFlag(ctx, p.w - 12, -20, 17, 10.5, time, p.phase || 0);

      // 3. Planked Walkable Teakwood Sun-Deck with Iron Cleats
      const deckG = ctx.createLinearGradient(0, 0, 0, 9);
      deckG.addColorStop(0, '#f59e0b');
      deckG.addColorStop(0.55, '#b45309');
      deckG.addColorStop(1, '#78350f');
      ctx.fillStyle = deckG;
      ctx.strokeStyle = '#291509';
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.roundRect(2, 0, p.w - 4, 9, [4, 4, 0, 0]);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(41, 21, 9, 0.38)';
      ctx.lineWidth = 1.0;
      for (let px0 = 16; px0 < p.w - 12; px0 += 16) {
        ctx.beginPath();
        ctx.moveTo(px0, 1);
        ctx.lineTo(px0, 8.5);
        ctx.stroke();
      }

      // 4. Sculpted Maritime Curved Vapur Hull (White Upper + Navy Stripe + Crimson Waterline)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-8, 9);
      ctx.lineTo(p.w + 8, 9);
      ctx.quadraticCurveTo(p.w + 2, 26, p.w - 14, 38);
      ctx.lineTo(14, 38);
      ctx.quadraticCurveTo(-2, 26, -8, 9);
      ctx.closePath();
      ctx.clip();

      const hullG = ctx.createLinearGradient(0, 9, 0, 38);
      hullG.addColorStop(0.00, '#ffffff');
      hullG.addColorStop(0.56, '#e2e8f0');
      hullG.addColorStop(0.58, '#1e3a8a');
      hullG.addColorStop(0.80, '#0f172a');
      hullG.addColorStop(0.82, '#be123c');
      hullG.addColorStop(1.00, '#881337');
      ctx.fillStyle = hullG;
      ctx.fillRect(-10, 8, p.w + 20, 32);

      // Golden sheer-rail molding & recessed arched cabin windows
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-10, 11.5, p.w + 20, 2.4);
      ctx.restore();

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-8, 9);
      ctx.lineTo(p.w + 8, 9);
      ctx.quadraticCurveTo(p.w + 2, 26, p.w - 14, 38);
      ctx.lineTo(14, 38);
      ctx.quadraticCurveTo(-2, 26, -8, 9);
      ctx.closePath();
      ctx.stroke();

      // Riveted Brass Portholes with Sky-Gold Reflections
      for (let hx = 24; hx < p.w - 18; hx += 24) {
        ctx.fillStyle = '#bae6fd';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(hx, 20.5, 4.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(hx - 1.3, 19.2, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Red-and-White Life-Rings with Canvas Straps
      for (const lx of [p.w * 0.24, p.w * 0.76]) {
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.arc(lx, 21, 5.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.6;
        for (let a = 0; a < 4; a++) {
          const ang = a * Math.PI * 0.5;
          ctx.beginPath();
          ctx.moveTo(lx + Math.cos(ang) * 3.8, 21 + Math.sin(ang) * 3.8);
          ctx.lineTo(lx + Math.cos(ang) * 6.4, 21 + Math.sin(ang) * 6.4);
          ctx.stroke();
        }
      }
      ctx.restore();
      return true;
    }

    // UPGRADED PIER-SIDE GALATA ANGLER & CARVED OTTOMAN TAKA / SANDAL WOODEN SKIFF!
    if (p.type === 'istanbul_fishing_float') {
      const cx = px + p.w * 0.5;
      const basePy = (p.baseY !== undefined ? p.baseY - (p.y - py) : py);
      ctx.save();

      // 1. Overhead Timber Gantry Cantilever Beam & Rotating Brass Pulley
      const topBeamY = basePy - 210;
      ctx.fillStyle = '#5c3a21';
      ctx.strokeStyle = '#291509';
      ctx.lineWidth = 1.6;
      ctx.fillRect(cx - 28, topBeamY - 8, 56, 10);
      ctx.strokeRect(cx - 28, topBeamY - 8, 56, 10);
      ctx.save();
      ctx.translate(cx, topBeamY + 4);
      ctx.rotate((basePy - py) * 0.06);
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 9.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(8, 0);
      ctx.moveTo(0, -8);
      ctx.lineTo(0, 8);
      ctx.stroke();
      ctx.restore();

      // Twin taut braided marine hoist lines + brass shackles
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.85)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cx, topBeamY + 12);
      ctx.lineTo(px + 20, py + 2);
      ctx.moveTo(cx, topBeamY + 12);
      ctx.lineTo(px + p.w - 20, py + 2);
      ctx.stroke();

      // 2. Wicker Fish Basket & Draped Fishing Net on Skiff Deck
      ctx.fillStyle = '#d97706';
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(px + 14, py - 10, 16, 10, [2, 2, 4, 4]);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(254, 243, 199, 0.55)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(px + 15, py - 5);
      ctx.lineTo(px + 29, py - 5);
      ctx.stroke();

      // 3. Carved Ottoman Taka / Sandal Wooden Fishing Skiff Hull with Swept Bow & Stern Posts!
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(px - 10, py - 3);
      ctx.quadraticCurveTo(px - 2, py + 1, px + 8, py + 1);
      ctx.lineTo(px + p.w - 8, py + 1);
      ctx.quadraticCurveTo(px + p.w + 2, py + 1, px + p.w + 10, py - 3);
      ctx.quadraticCurveTo(px + p.w + 2, py + p.h + 7, px + p.w - 14, py + p.h + 8);
      ctx.lineTo(px + 14, py + p.h + 8);
      ctx.quadraticCurveTo(px - 2, py + p.h + 7, px - 10, py - 3);
      ctx.closePath();
      ctx.clip();

      const hullG = ctx.createLinearGradient(px, py, px, py + p.h + 9);
      hullG.addColorStop(0.00, '#fbbf24');
      hullG.addColorStop(0.32, '#d97706');
      hullG.addColorStop(0.72, '#92400e');
      hullG.addColorStop(1.00, '#451a03');
      ctx.fillStyle = hullG;
      ctx.fillRect(px - 12, py - 4, p.w + 24, p.h + 14);

      // Horizontal clinker wooden planking strakes
      ctx.strokeStyle = 'rgba(41, 16, 5, 0.42)';
      ctx.lineWidth = 1.0;
      for (let sy = py + 8; sy < py + p.h + 6; sy += 5.5) {
        ctx.beginPath();
        ctx.moveTo(px - 10, sy);
        ctx.lineTo(px + p.w + 10, sy);
        ctx.stroke();
      }
      // Authentic Ottoman Turquoise & Crimson Gunwale Trim Band
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(px - 8, py + 2, p.w + 16, 4.2);
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(px - 8, py + 6.2, p.w + 16, 2.0);
      ctx.restore();

      // Crisp Hull Outline
      ctx.strokeStyle = '#291005';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(px - 10, py - 3);
      ctx.quadraticCurveTo(px - 2, py + 1, px + 8, py + 1);
      ctx.lineTo(px + p.w - 8, py + 1);
      ctx.quadraticCurveTo(px + p.w + 2, py + 1, px + p.w + 10, py - 3);
      ctx.quadraticCurveTo(px + p.w + 2, py + p.h + 7, px + p.w - 14, py + p.h + 8);
      ctx.lineTo(px + 14, py + p.h + 8);
      ctx.quadraticCurveTo(px - 2, py + p.h + 7, px - 10, py - 3);
      ctx.closePath();
      ctx.stroke();

      // Draped Fishing Net & Braided Cork Side Fenders with Rope Lashings
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.55)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(px + 20, py + 2);
      ctx.quadraticCurveTo(cx, py + 18, px + p.w - 20, py + 2);
      ctx.stroke();
      for (const fx of [px + 24, cx, px + p.w - 24]) {
        ctx.strokeStyle = '#fef3c7';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(fx, py + 2);
        ctx.lineTo(fx, py + 12);
        ctx.stroke();
        ctx.fillStyle = '#dc2626';
        ctx.strokeStyle = '#fef3c7';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(fx, py + 16, 4.6, 5.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Glowing Brass Bow Lantern with Warm Halo
      const lanX = px + p.w - 6, lanY = py - 8;
      const lGlow = ctx.createRadialGradient(lanX, lanY, 1, lanX, lanY, 16);
      lGlow.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
      lGlow.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = lGlow;
      ctx.beginPath();
      ctx.arc(lanX, lanY, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(lanX, py - 1);
      ctx.lineTo(lanX, lanY - 4);
      ctx.stroke();
      ctx.fillStyle = '#fef08a';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(lanX, lanY, 3.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      return true;
    }

    // NEW OBSTACLE #1: LIVE CROSSING RED ISTIKLAL STREETCAR HAZARD!
    if (p.type === 'istanbul_tram_crossing') {
      const floorY = py + p.h;
      ctx.save();
      // Embedded steel Istiklal tramway rails & cobblestone bed on ground
      ctx.fillStyle = '#334155';
      ctx.fillRect(px, floorY - 5, p.w, 5);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(px, floorY - 6, p.w, 2);

      // Overhead copper tramway catenary wire + insulator poles
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.65)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(px - 40, floorY - 106);
      ctx.lineTo(px + p.w + 40, floorY - 106);
      ctx.stroke();

      // Ornate Cast-Iron Istiklal Tram Warning Bell & Signal Post (TRAMVAY)
      const postX = px + 26;
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.6;
      ctx.fillRect(postX - 4, floorY - 94, 8, 94);
      ctx.strokeRect(postX - 4, floorY - 94, 8, 94);
      // Warning sign plaque
      ctx.fillStyle = '#fef3c7';
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(postX - 24, floorY - 76, 48, 16, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#991b1b';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TRAMVAY', postX, floorY - 65);

      const isDanger = p.crossState === 'warn' || p.crossState === 'pass';
      const sigCol = isDanger ? (Math.sin(time * 18) > 0 ? '#ef4444' : '#fbbf24') : '#22c55e';
      const sGlow = ctx.createRadialGradient(postX, floorY - 98, 2, postX, floorY - 98, 22);
      sGlow.addColorStop(0, sigCol);
      sGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sGlow;
      ctx.beginPath();
      ctx.arc(postX, floorY - 98, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = sigCol;
      ctx.strokeStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(postX, floorY - 98, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Vibrating brass warning bell when tram approaches!
      const bellShake = isDanger ? Math.sin(time * 36) * 2.5 : 0;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(postX + 12 + bellShake, floorY - 86, 5.2, 0, Math.PI * 2);
      ctx.fill();

      // Speeding Vintage Red Istiklal Streetcar!
      if (p.tramActive && p.tramX !== undefined) {
        const tx = p.tramX - (p.x - px);
        const tw = 156, th = 68;
        ctx.save();
        ctx.translate(tx, floorY - th);
        // Pantograph & electric arc spark on overhead wire
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(tw * 0.4, 0);
        ctx.lineTo(tw * 0.5, -38);
        ctx.lineTo(tw * 0.6, 0);
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(tw * 0.5, -38, 4.8, 0, Math.PI * 2);
        ctx.fill();

        // Headlight volumetric beam pointing left
        const hBeam = ctx.createLinearGradient(0, 46, -85, 46);
        hBeam.addColorStop(0, 'rgba(254, 240, 138, 0.70)');
        hBeam.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = hBeam;
        ctx.beginPath();
        ctx.moveTo(0, 40);
        ctx.lineTo(-85, 22);
        ctx.lineTo(-85, 66);
        ctx.lineTo(0, 52);
        ctx.closePath();
        ctx.fill();

        // Clerestory cream roof + Nostalgic crimson/cream body + brass cowcatcher
        ctx.fillStyle = '#fef3c7';
        ctx.strokeStyle = '#291509';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(8, 0, tw - 16, 11, [6, 6, 0, 0]);
        ctx.fill();
        ctx.stroke();
        const bodyG = ctx.createLinearGradient(0, 10, 0, th - 6);
        bodyG.addColorStop(0, '#ef4444');
        bodyG.addColorStop(0.55, '#be123c');
        bodyG.addColorStop(1, '#7f1d1d');
        ctx.fillStyle = bodyG;
        ctx.beginPath();
        ctx.roundRect(0, 10, tw, th - 16, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(3, 14, tw - 6, 22);
        for (let wIdx = 0; wIdx < 5; wIdx++) {
          ctx.fillStyle = '#fde68a';
          ctx.strokeStyle = '#7f1d1d';
          ctx.lineWidth = 1.4;
          ctx.fillRect(9 + wIdx * 28, 16, 22, 18);
          ctx.strokeRect(9 + wIdx * 28, 16, 22, 18);
        }
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(4, 41, tw - 8, 3.5);
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 8.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('İSTİKLAL • 1914', tw * 0.5, 54);
        // Brass Cyclops headlight + iron cowcatcher + steel bogie wheels
        ctx.fillStyle = '#fef08a';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(2, 46, 6.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(2, th - 8);
        ctx.lineTo(-10, th - 1);
        ctx.lineTo(14, th - 1);
        ctx.stroke();
        for (const wx of [28, 56, tw - 56, tw - 28]) {
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(wx, th - 4, 6.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.arc(wx, th - 4, 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      ctx.restore();
      return true;
    }

    // NEW OBSTACLE #2: SIZZLING EMINÖNÜ BALIK-EKMEK & CHARCOAL KEBAB BRAZIER!
    if (p.type === 'istanbul_balik_grill') {
      const floorY = py + p.h;
      const cx = px + p.w * 0.5;
      const flamePwr = p.flamePower || 0;
      ctx.save();
      ctx.translate(cx, floorY);

      // Detailed Eminönü Chef behind the hammered-copper waterfront grill cart!
      drawOttomanHumanVendor(ctx, 0, 0, '#dc2626', '#fbbf24', '#be123c', time, false);

      // Roaring Charcoal Flame Plume & Rising Sparks when erupting!
      if (p.grillState === 'flare' && flamePwr > 0.15) {
        const fh = 84 * flamePwr;
        const fG = ctx.createLinearGradient(0, -44, 0, -44 - fh);
        fG.addColorStop(0.0, 'rgba(254, 249, 195, 0.96)');
        fG.addColorStop(0.4, 'rgba(251, 146, 60, 0.90)');
        fG.addColorStop(0.8, 'rgba(220, 38, 38, 0.72)');
        fG.addColorStop(1.0, 'rgba(220, 38, 38, 0)');
        ctx.fillStyle = fG;
        for (let t = -1; t <= 1; t++) {
          const sway = Math.sin(time * 22 + t * 2) * 7;
          ctx.beginPath();
          ctx.moveTo(t * 14 - 14, -44);
          ctx.quadraticCurveTo(t * 16 + sway, -44 - fh * 0.6, t * 10 + sway * 1.3, -44 - fh);
          ctx.quadraticCurveTo(t * 16 - sway, -44 - fh * 0.5, t * 14 + 14, -44);
          ctx.closePath();
          ctx.fill();
        }
      } else if (p.grillState === 'warn') {
        const wGlow = ctx.createRadialGradient(0, -48, 4, 0, -48, 36);
        wGlow.addColorStop(0, 'rgba(251, 146, 60, 0.80)');
        wGlow.addColorStop(1, 'rgba(251, 146, 60, 0)');
        ctx.fillStyle = wGlow;
        ctx.beginPath();
        ctx.arc(0, -48, 36, 0, Math.PI * 2);
        ctx.fill();
      }

      // Hammered-Copper & Firebrick Ottoman Brazier Body + Glowing Charcoal Bed
      const brG = ctx.createLinearGradient(-42, -44, 42, -8);
      brG.addColorStop(0, '#fed7aa');
      brG.addColorStop(0.45, '#ea580c');
      brG.addColorStop(1, '#7c2d12');
      ctx.fillStyle = brG;
      ctx.strokeStyle = '#291005';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(-42, -42, 84, 32, 5);
      ctx.fill();
      ctx.stroke();

      // Glowing red-orange charcoal embers or closed domed copper lid if Meow-damped!
      if (p.dampedTimer > 0) {
        const lidG = ctx.createLinearGradient(-38, -62, 38, -42);
        lidG.addColorStop(0, '#fde68a');
        lidG.addColorStop(0.5, '#d97706');
        lidG.addColorStop(1, '#78350f');
        ctx.fillStyle = lidG;
        ctx.beginPath();
        ctx.moveTo(-40, -42);
        ctx.quadraticCurveTo(0, -68, 40, -42);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🐟 SAFE!', 0, -68);
      } else {
        ctx.fillStyle = p.grillState === 'warn' || p.grillState === 'flare' ? '#fb923c' : '#b91c1c';
        ctx.fillRect(-36, -46, 72, 5);
        // Grilling mackerel fillets on iron grate
        ctx.fillStyle = '#d97706';
        for (const fx of [-20, 0, 20]) {
          ctx.beginPath();
          ctx.ellipse(fx, -46, 8, 3.2, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 8.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BALIK • EKMEK', 0, -22);
      for (const wx of [-28, 28]) {
        ctx.fillStyle = '#451a03';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(wx, -8, 8.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
      return true;
    }

    // NEW OBSTACLE #3: TWIN-LEAF ROTATING GALATA BASCULE DRAWBRIDGE + CLASSIC BOSPHORUS PASSENGER STEAMER!
    if (p.type === 'istanbul_drawbridge_leaf') {
      const basePy = (p.baseY !== undefined ? p.baseY - (p.y - py) : py);
      const openT = Math.max(0, Math.min(1, p.liftT || 0));
      const tiltAng = openT * 0.52; // Genuine 30-degree upward bascule rotation!
      const halfW = p.w * 0.5;
      const waterY = basePy + 42; // Exact Bosphorus sea channel waterline (puddle y = 656)!
      ctx.save();

      // 1. Classic Multi-Deck Bosphorus Passenger Steamer (Şehir Hatları Boğaz Vapuru) in 3D Head-On Perspective!
      if (openT > 0.24) {
        const emerge = Math.min(1, (openT - 0.24) / 0.52);
        const shipScale = 0.66 + emerge * 0.34;
        const shipSwayX = Math.sin(time * 1.15 + (p.phase || 0)) * 7;
        const shipHeaveY = Math.sin(time * 2.4 + (p.phase || 0)) * 1.8;
        const shipRoll = Math.sin(time * 1.9 + (p.phase || 0)) * 0.022;
        const shipCx = px + halfW + shipSwayX;

        ctx.save();
        // Clip cleanly slightly below the water channel top so hull sits naturally in the Bosphorus waves
        ctx.beginPath();
        ctx.rect(px - 40, basePy - 210, p.w + 80, waterY - (basePy - 210) + 12);
        ctx.clip();

        ctx.translate(shipCx, waterY + (1 - emerge) * 34 + shipHeaveY);
        ctx.scale(shipScale, shipScale);
        ctx.rotate(shipRoll);

        // A. Tall Classic Şehir Hatları Smokestack & Foremast (behind wheelhouse, rising between raised bridge leaves!)
        const fnG = ctx.createLinearGradient(-13, -102, 13, -102);
        fnG.addColorStop(0, '#fde047');
        fnG.addColorStop(0.45, '#f59e0b');
        fnG.addColorStop(1, '#92400e');
        ctx.fillStyle = fnG;
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-12, -98, 24, 34, 3);
        ctx.fill();
        ctx.stroke();
        // Black soot collar & crimson maritime emblem band
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-12, -98, 24, 7);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(-12, -87, 24, 6.5);
        // Tiny white crescent-and-star emblem on funnel band
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-1.2, -83.8, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(-0.3, -83.8, 1.7, 0, Math.PI * 2);
        ctx.fill();
        // Gleaming vertical brass steam whistle pipe on funnel front
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(4, -72);
        ctx.lineTo(4, -93);
        ctx.stroke();

        // Volumetric billowing Bosphorus steamer smoke & white steam clouds
        for (let s = 0; s < 4; s++) {
          const sf = (time * 1.25 + s * 0.25) % 1;
          const puffX = Math.sin(time * 4.2 + s * 1.7) * (4 + sf * 9);
          const puffY = -103 - sf * 34;
          const puffR = 6.5 + sf * 10.5;
          const pG = ctx.createRadialGradient(puffX - 2, puffY - 2, 1, puffX, puffY, puffR);
          pG.addColorStop(0, `rgba(255, 255, 255, ${(0.72 * (1 - sf)).toFixed(2)})`);
          pG.addColorStop(0.65, `rgba(226, 232, 240, ${(0.45 * (1 - sf)).toFixed(2)})`);
          pG.addColorStop(1, 'rgba(203, 213, 225, 0)');
          ctx.fillStyle = pG;
          ctx.beginPath();
          ctx.arc(puffX, puffY, puffR, 0, Math.PI * 2);
          ctx.fill();
        }

        // Slender white steel radar foremast, crosstree & fluttering Turkish Ay-Yıldız pennant
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(0, -68);
        ctx.lineTo(0, -118);
        ctx.moveTo(-11, -106);
        ctx.lineTo(11, -106);
        ctx.stroke();
        const flagWave = Math.sin(time * 6.5) * 2.4;
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.moveTo(0, -118);
        ctx.quadraticCurveTo(8, -119 + flagWave, 15, -115 + flagWave);
        ctx.quadraticCurveTo(8, -111 + flagWave, 0, -111);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(5.5, -114.8 + flagWave * 0.5, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // B. Twin Side Lifeboats on Curved Davits (Port & Starboard flanks)
        for (const side of [-1, 1]) {
          ctx.fillStyle = '#f1f5f9';
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(side * 44, -44, 7.5, 4.2, side * 0.18, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#ea580c';
          ctx.fillRect(side * 44 - 5, -45, 10, 2);
        }

        // C. Carved Mahogany Pilot Wheelhouse (Kaptan Köşkü) with Cyan Glass & Wing Navigation Lamps
        const whG = ctx.createLinearGradient(-24, -70, 24, -52);
        whG.addColorStop(0, '#9a3412');
        whG.addColorStop(0.5, '#7c2d12');
        whG.addColorStop(1, '#431407');
        ctx.fillStyle = whG;
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(-23, -69, 46, 17, [5, 5, 2, 2]);
        ctx.fill();
        ctx.stroke();
        // Crisp white sun-visor brow roof over bridge
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.roundRect(-26, -72, 52, 4.2, 2);
        ctx.fill();
        ctx.stroke();
        // 5 beveled cyan-tinted pilot bridge windows
        for (let wi = -2; wi <= 2; wi++) {
          const wx = wi * 8.2 - 3.1;
          const wg = ctx.createLinearGradient(wx, -66, wx + 6, -57);
          wg.addColorStop(0, '#bae6fd');
          wg.addColorStop(0.5, '#38bdf8');
          wg.addColorStop(1, '#0369a1');
          ctx.fillStyle = wg;
          ctx.fillRect(wx, -66, 6.2, 8.5);
        }
        // Brass roof searchlight
        ctx.fillStyle = '#fbbf24';
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(0, -74.5, 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Starboard Green (viewer's left) & Port Red (viewer's right) Maritime Wing Lamps
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(-25.5, -62, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(25.5, -62, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // D. Upper & Lower Passenger Promenade Decks (Curved White Superstructure, Teak Trim & Warm Salon Windows)
        const supG = ctx.createLinearGradient(-44, -52, 44, -24);
        supG.addColorStop(0, '#ffffff');
        supG.addColorStop(0.55, '#f8fafc');
        supG.addColorStop(1, '#cbd5e1');
        ctx.fillStyle = supG;
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-42, -26);
        ctx.lineTo(-38, -52);
        ctx.quadraticCurveTo(0, -57, 38, -52);
        ctx.lineTo(42, -26);
        ctx.quadraticCurveTo(0, -31, -42, -26);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Burmese teak window belt & 7 warmly lit arched passenger salon windows
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.moveTo(-39, -35);
        ctx.quadraticCurveTo(0, -40, 39, -35);
        ctx.lineTo(38, -46);
        ctx.quadraticCurveTo(0, -51, -38, -46);
        ctx.closePath();
        ctx.fill();
        for (let sw = -3; sw <= 3; sw++) {
          const sx = sw * 9.8;
          const sy = -42.5 - (1 - Math.abs(sw) / 3.5) * 2.2;
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.roundRect(sx - 3.2, sy - 3.5, 6.4, 7.5, [3, 3, 1, 1]);
          ctx.fill();
        }

        // Upper promenade white railing stanchions & classic orange/white lifebuoys
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-37, -55.5);
        ctx.quadraticCurveTo(0, -60, 37, -55.5);
        ctx.stroke();
        for (const lx of [-28, -14, 14, 28]) {
          ctx.strokeStyle = '#ea580c';
          ctx.lineWidth = 2.1;
          ctx.beginPath();
          ctx.arc(lx, -51.5, 3.0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.arc(lx, -51.5, 3.0, -0.4, 0.4);
          ctx.arc(lx, -51.5, 3.0, 2.7, 3.5);
          ctx.stroke();
        }

        // E. Flared 3D V-Shaped Steel Bow Hull (Split Port/Starboard Shading, Sharp Stem Prow, Gold Stripe & Twin Anchors!)
        // Starboard sunlit side (viewer's left)
        const hullLG = ctx.createLinearGradient(-50, -32, 0, 6);
        hullLG.addColorStop(0, '#334155');
        hullLG.addColorStop(0.6, '#1e293b');
        hullLG.addColorStop(1, '#0f172a');
        ctx.fillStyle = hullLG;
        ctx.beginPath();
        ctx.moveTo(0, -35); // sharp raised bow stem tip!
        ctx.quadraticCurveTo(-28, -32, -50, -25);
        ctx.quadraticCurveTo(-45, -8, -36, 7);
        ctx.lineTo(0, 9);
        ctx.closePath();
        ctx.fill();

        // Port shaded side (viewer's right)
        const hullRG = ctx.createLinearGradient(0, -32, 50, 6);
        hullRG.addColorStop(0, '#1e293b');
        hullRG.addColorStop(0.65, '#0f172a');
        hullRG.addColorStop(1, '#020617');
        ctx.fillStyle = hullRG;
        ctx.beginPath();
        ctx.moveTo(0, -35);
        ctx.quadraticCurveTo(28, -32, 50, -25);
        ctx.quadraticCurveTo(45, -8, 36, 7);
        ctx.lineTo(0, 9);
        ctx.closePath();
        ctx.fill();

        // Crimson anti-fouling boot-top band along the waterline
        ctx.fillStyle = '#be123c';
        ctx.beginPath();
        ctx.moveTo(-39, -1);
        ctx.quadraticCurveTo(0, 3, 39, -1);
        ctx.lineTo(36, 8);
        ctx.quadraticCurveTo(0, 11, -36, 8);
        ctx.closePath();
        ctx.fill();

        // Crisp white flared upper bow bulwark & gleaming golden sheer-stripe
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(-50, -25);
        ctx.quadraticCurveTo(-26, -31.5, 0, -35);
        ctx.quadraticCurveTo(26, -31.5, 50, -25);
        ctx.stroke();

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-47, -20);
        ctx.quadraticCurveTo(-24, -26, 0, -29);
        ctx.quadraticCurveTo(24, -26, 47, -20);
        ctx.stroke();

        // Hull outer contour & central razor-sharp steel stem-post highlight
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(0, -35);
        ctx.quadraticCurveTo(-28, -32, -50, -25);
        ctx.quadraticCurveTo(-45, -8, -36, 7);
        ctx.moveTo(0, -35);
        ctx.quadraticCurveTo(28, -32, 50, -25);
        ctx.quadraticCurveTo(45, -8, 36, 7);
        ctx.stroke();

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.7;
        ctx.beginPath();
        ctx.moveTo(0, -35);
        ctx.lineTo(0, 8);
        ctx.stroke();

        // Twin hawsepipes, hanging bower anchors & illuminated lower hull portholes
        for (const side of [-1, 1]) {
          // Anchor hawse & fluke
          ctx.fillStyle = '#020617';
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(side * 13, -19, 3.0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(side * 13, -18);
          ctx.lineTo(side * 14, -11);
          ctx.moveTo(side * 10.5, -12.5);
          ctx.quadraticCurveTo(side * 14, -9.5, side * 17.5, -12.5);
          ctx.stroke();
          // Illuminated brass portholes
          for (const pxOff of [26, 36]) {
            ctx.fillStyle = '#fef08a';
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.arc(side * pxOff, -14 + (pxOff - 26) * 0.2, 2.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
        }

        // F. Parted Foaming White V-Bow Waves & Turquoise Wake Ripples at the Waterline!
        const foamPulse = Math.sin(time * 5.5) * 3;
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.85)';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(-36, 1);
        ctx.quadraticCurveTo(-52, 2, -68 - foamPulse, 5);
        ctx.moveTo(36, 1);
        ctx.quadraticCurveTo(52, 2, 68 + foamPulse, 5);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        for (let fw = -3; fw <= 3; fw++) {
          const fx = fw * 11.5 + Math.sin(time * 4.8 + fw) * 2.2;
          const fr = 4.8 - Math.abs(fw) * 0.55;
          ctx.beginPath();
          ctx.ellipse(fx, 0.5, fr * 1.6, fr * 0.65, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // 2. Twin Rotating Riveted Steel Bascule Bridge Leaves & Grounded Stone Gear-Towers!
      for (const side of [0, 1]) {
        const pivotX = side === 0 ? px : px + p.w;
        const dir = side === 0 ? 1 : -1;
        ctx.save();
        ctx.translate(pivotX, basePy + 4);
        ctx.rotate(-dir * tiltAng);

        // Ornate wrought-iron pedestrian balustrade along top of bridge leaf
        const leafStart = side === 0 ? 4 : -halfW + 7;
        const leafLen = halfW - 11;
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(leafStart, -13);
        ctx.lineTo(leafStart + leafLen, -13);
        for (let rx = 0; rx <= leafLen; rx += 18) {
          ctx.moveTo(leafStart + rx, -4);
          ctx.lineTo(leafStart + rx, -13);
        }
        ctx.stroke();

        // Heavy riveted steel bascule deck girder
        const dG = ctx.createLinearGradient(0, -4, 0, p.h);
        dG.addColorStop(0, '#94a3b8');
        dG.addColorStop(0.45, '#475569');
        dG.addColorStop(1, '#1e293b');
        ctx.fillStyle = dG;
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(side === 0 ? 0 : -halfW + 3, -4, halfW - 3, p.h, 3);
        ctx.fill();
        ctx.stroke();
        // Golden brass safety curb & red-white tip warning chevrons
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(side === 0 ? 2 : -halfW + 5, -3, halfW - 7, 4);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(side === 0 ? halfW - 18 : -halfW + 5, -3, 13, 4);
        // Diagonal steel Warren-truss bracing & rivets underneath leaf
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.3;
        for (let gx = 18; gx < halfW - 18; gx += 28) {
          const sx0 = side === 0 ? gx : -gx;
          ctx.beginPath();
          ctx.moveTo(sx0, 2);
          ctx.lineTo(sx0 + dir * 14, p.h - 6);
          ctx.lineTo(sx0 + dir * 28, 2);
          ctx.stroke();
        }
        ctx.restore();

        // Monumental Ashlar Gear-Tower Grounded Deep into the Bosphorus Channel (basePy - 168 down to basePy + 58)
        const tx = side === 0 ? px - 32 : px + p.w + 2;
        ctx.save();
        ctx.beginPath();
        ctx.rect(tx, basePy - 168, 30, 226);
        ctx.clip();
        fillAshlarMasonry(ctx, tx, basePy - 168, 30, 226, 14, 15, STONE_WARM, side * 19 + 7);
        ctx.restore();
        ctx.strokeStyle = '#291a10';
        ctx.lineWidth = 1.6;
        ctx.strokeRect(tx, basePy - 168, 30, 226);
        // Carved Ottoman stone cornice cap at tower crown
        ctx.fillStyle = '#e7dcc8';
        ctx.strokeStyle = '#291a10';
        ctx.lineWidth = 1.4;
        ctx.fillRect(tx - 3, basePy - 172, 36, 7);
        ctx.strokeRect(tx - 3, basePy - 172, 36, 7);

        // Rotating spoked & toothed brass bascule cogwheel
        ctx.save();
        ctx.translate(tx + 15, basePy - 12);
        ctx.rotate(dir * tiltAng * 2.5);
        ctx.fillStyle = '#b45309';
        for (let cg = 0; cg < 8; cg++) {
          ctx.save();
          ctx.rotate((cg * Math.PI) / 4);
          ctx.fillRect(-2.2, -14, 4.4, 28);
          ctx.restore();
        }
        const gearG = ctx.createRadialGradient(-3, -3, 1, 0, 0, 11.5);
        gearG.addColorStop(0, '#fde047');
        gearG.addColorStop(0.65, '#d97706');
        gearG.addColorStop(1, '#78350f');
        ctx.fillStyle = gearG;
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Taut steel hoist cable/chain from tower top pulley to raised leaf tip
        const tipX = pivotX + dir * Math.cos(tiltAng) * (halfW - 14);
        const tipY = basePy + 4 - Math.sin(tiltAng) * (halfW - 14);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.1;
        ctx.beginPath();
        ctx.moveTo(tx + 15, basePy - 160);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        const sigCol = p.bridgeWarn ? '#fbbf24' : (p.bridgeRaised ? '#ef4444' : '#22c55e');
        const sg = ctx.createRadialGradient(tx + 15, basePy - 180, 2, tx + 15, basePy - 180, 18);
        sg.addColorStop(0, sigCol);
        sg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(tx + 15, basePy - 180, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = sigCol;
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(tx + 15, basePy - 180, 6.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
      return true;
    }

    // NEW OBSTACLE #4: BASILICA CISTERN INVERTED MARBLE MEDUSA HEAD & WATER SURGE (Yerebatan Sarnıcı Masterpiece!)
    if (p.type === 'istanbul_medusa_cistern') {
      const floorY = py + p.h;
      const cx = px + p.w * 0.5;
      ctx.save();

      // Recessed glowing emerald-turquoise cistern pool rim at column base
      ctx.fillStyle = '#0c4a6e';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cx - 38, floorY - 8, 76, 8, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#2dd4bf';
      ctx.fillRect(cx - 34, floorY - 6.5, 68, 3.5);

      // Fluted Corinthian Marble Column Shaft rising above the Inverted Medusa Block!
      const colG = ctx.createLinearGradient(cx - 19, floorY - 128, cx + 19, floorY - 52);
      colG.addColorStop(0, '#ffffff');
      colG.addColorStop(0.55, '#cbd5e1');
      colG.addColorStop(1, '#64748b');
      ctx.fillStyle = colG;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.6;
      ctx.fillRect(cx - 18, floorY - 122, 36, 70);
      ctx.strokeRect(cx - 18, floorY - 122, 36, 70);
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.35)';
      ctx.lineWidth = 1.1;
      for (const fx of [-11, -4, 4, 11]) {
        ctx.beginPath();
        ctx.moveTo(cx + fx, floorY - 120);
        ctx.lineTo(cx + fx, floorY - 54);
        ctx.stroke();
      }
      // Carved acanthus Corinthian capital + bronze collar ring
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.roundRect(cx - 25, floorY - 134, 50, 13, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#d97706';
      ctx.fillRect(cx - 19, floorY - 55, 38, 3.5);

      // Iconic Carved Inverted Greco-Roman Marble Medusa Pedestal (Yerebatan Sarnıcı)!
      const medG = ctx.createLinearGradient(cx - 28, floorY - 52, cx + 28, floorY - 6);
      medG.addColorStop(0, '#f8fafc');
      medG.addColorStop(0.55, '#cbd5e1');
      medG.addColorStop(1, '#64748b');
      ctx.fillStyle = medG;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(cx - 28, floorY - 52, 56, 46, 5);
      ctx.fill();
      ctx.stroke();

      // Writhing sculpted stone serpent locks around the inverted face!
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2.6;
      ctx.lineCap = 'round';
      for (const [sx0, sy0, r0] of [[-21, -20, 6], [-14, -13, 5.5], [0, -12, 6], [14, -13, 5.5], [21, -20, 6], [-22, -35, 5], [22, -35, 5]]) {
        ctx.beginPath();
        ctx.arc(cx + sx0, floorY + sy0, r0, 0.2, Math.PI * 1.45);
        ctx.stroke();
      }
      // Sculpted upside-down Medusa face oval, cheekbones, nose & glowing emerald/gold eyes!
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.ellipse(cx, floorY - 31, 16, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      const eyeGlow = p.stunTimer > 0 ? '#64748b' : (p.cisternState === 'warn' || p.cisternState === 'surge' ? '#10b981' : '#f59e0b');
      if (p.cisternState === 'warn' || p.cisternState === 'surge') {
        const eg = ctx.createRadialGradient(cx, floorY - 27, 2, cx, floorY - 27, 38);
        eg.addColorStop(0, 'rgba(16, 185, 129, 0.68)');
        eg.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = eg;
        ctx.beginPath();
        ctx.arc(cx, floorY - 27, 38, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const side of [-1, 1]) {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(cx + side * 7.5, floorY - 26, 4.6, 2.8, side * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = eyeGlow;
        ctx.beginPath();
        ctx.ellipse(cx + side * 7.5, floorY - 26, 3.4, 2.0, side * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
      // Inverted brow, nose bridge & parted stone lips at top of face!
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, floorY - 23);
      ctx.lineTo(cx, floorY - 35);
      ctx.moveTo(cx - 6.5, floorY - 39.5);
      ctx.quadraticCurveTo(cx, floorY - 43, cx + 6.5, floorY - 39.5);
      ctx.stroke();

      if (p.stunTimer > 0) {
        ctx.fillStyle = '#6ee7b7';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🐍 CALM!', cx, floorY - 140);
      }

      // Twin Sweeping Subterranean Turquoise-Emerald Cistern Surge Waves!
      if (p.cisternState === 'surge' && p.waveDist !== undefined) {
        for (const dir of [-1, 1]) {
          const wx = cx + dir * p.waveDist;
          const wG = ctx.createLinearGradient(wx - 20, floorY - 36, wx + 20, floorY);
          wG.addColorStop(0, '#a7f3d0');
          wG.addColorStop(0.45, '#0ea5e9');
          wG.addColorStop(1, '#0c4a6e');
          ctx.fillStyle = wG;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(wx - 22, floorY);
          ctx.quadraticCurveTo(wx - dir * 10, floorY - 40, wx + dir * 15, floorY - 30);
          ctx.quadraticCurveTo(wx + dir * 6, floorY - 12, wx + 22, floorY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }
      ctx.restore();
      return true;
    }

    // NEW OBSTACLE #5: GROUNDED OTTOMAN ABLAQ STONE ARCHWAY & SWINGING PIERCED TOMBAK CENSER!
    if (p.type === 'istanbul_whirling_censer') {
      const ax = px + p.w * 0.5;
      const ay = py;
      const groundScreenY = ay + Math.max(185, 615 - (p.y || 375));
      const archSpan = 88;
      const len = p.chainLen || 155;
      const ang = p.censerAngle || 0;
      const bx = ax + Math.sin(ang) * len;
      const by = ay + Math.cos(ang) * len;

      ctx.save();
      // 1. Grounded Twin Fluted Marmara-Marble Columns + Octagonal Plinths + Polychrome Ablaq Arch!
      for (const side of [-1, 1]) {
        const colX = ax + side * archSpan;
        const cG = ctx.createLinearGradient(colX - 8, 0, colX + 8, 0);
        cG.addColorStop(0, '#f8fafc');
        cG.addColorStop(0.55, '#cbd5e1');
        cG.addColorStop(1, '#64748b');
        ctx.fillStyle = cG;
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.4;
        ctx.fillRect(colX - 6.5, ay + 12, 13, groundScreenY - (ay + 22));
        ctx.strokeRect(colX - 6.5, ay + 12, 13, groundScreenY - (ay + 22));
        // Octagonal base plinth & gilded Muqarnas capital
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(colX - 11, groundScreenY - 10, 22, 10);
        ctx.strokeRect(colX - 11, groundScreenY - 10, 22, 10);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(colX - 9.5, ay + 6, 19, 7);
        ctx.strokeRect(colX - 9.5, ay + 6, 19, 7);
      }

      // Spanning Pointed Ottoman Ablaq Stone Arch Beam (alternating crimson & cream voussoirs + Iznik rosettes!)
      const beamG = ctx.createLinearGradient(0, ay - 22, 0, ay + 8);
      beamG.addColorStop(0, '#be123c');
      beamG.addColorStop(1, '#881337');
      ctx.fillStyle = beamG;
      ctx.strokeStyle = '#291509';
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.moveTo(ax - archSpan - 12, ay + 7);
      ctx.lineTo(ax - archSpan - 12, ay - 16);
      ctx.lineTo(ax + archSpan + 12, ay - 16);
      ctx.lineTo(ax + archSpan + 12, ay + 7);
      ctx.lineTo(ax + archSpan - 6, ay + 7);
      ctx.quadraticCurveTo(ax, ay - 14, ax - archSpan + 6, ay + 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cream ablaq stone stripes & turquoise Iznik spandrel medallions
      ctx.fillStyle = '#fef3c7';
      for (let vx = -archSpan + 12; vx <= archSpan - 20; vx += 28) {
        ctx.fillRect(ax + vx, ay - 15, 9, 10);
      }
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(ax - archSpan - 14, ay - 19, (archSpan + 14) * 2, 3.5);
      for (const rxOff of [-archSpan * 0.62, archSpan * 0.62]) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(ax + rxOff, ay - 6, 4.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Forged Brass Suspension Chain + Aromatic Incense Smoke Trail
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3.0;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(ax, ay + 1);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.setLineDash([]);

      for (let sm = 0; sm < 3; sm++) {
        const sf = ((time * 1.2 + sm * 0.33) % 1);
        ctx.fillStyle = `rgba(254, 243, 199, ${(0.42 * (1 - sf)).toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(bx - Math.sin(ang) * sf * 22, by - 12 - sf * 26, 4 + sf * 7, 0, Math.PI * 2);
        ctx.fill();
      }

      const glow = ctx.createRadialGradient(bx, by, 4, bx, by, 38);
      glow.addColorStop(0, 'rgba(251, 146, 60, 0.72)');
      glow.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(bx, by, 38, 0, Math.PI * 2);
      ctx.fill();

      // 3. Pierced Ottoman Tombak Gilded-Brass Censer (Buhurdan) with Filigree Dome & Finial!
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(-ang);
      const cG = ctx.createRadialGradient(-5, -6, 2, 0, 0, 22);
      cG.addColorStop(0, '#fef9c3');
      cG.addColorStop(0.45, '#f59e0b');
      cG.addColorStop(1, '#78350f');
      ctx.fillStyle = cG;
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 0, 19, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Embossed equatorial filigree band + glowing ruby coal vents
      ctx.fillStyle = '#92400e';
      ctx.fillRect(-19, -3, 38, 6);
      ctx.fillStyle = '#fde047';
      for (const vx of [-11, -4, 4, 11]) {
        ctx.beginPath();
        ctx.arc(vx, 0, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#ef4444';
      for (const vx of [-8, 0, 8]) {
        ctx.beginPath();
        ctx.arc(vx, -8, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }
      // Pointed Ottoman brass finial & silk tassel below censer
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(-5, 18);
      ctx.lineTo(0, 28);
      ctx.lineTo(5, 18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.restore();
      return true;
    }

    if (p.type === 'istanbul_samovar_vent') {
      ctx.save();
      ctx.translate(px + p.w * 0.5, py + p.h);

      // 1. Rich Upward Thermal Steam Ribbons & Swirling Vapor Clouds (unmistakable lift cue)
      if (p.steamActive) {
        const boost = p.boostTimer > 0;
        const maxH = boost ? 245 : 215;
        // Soft translucent vertical thermal column glow
        const colG = ctx.createLinearGradient(0, -82, 0, -82 - maxH);
        colG.addColorStop(0.0, boost ? 'rgba(224, 242, 254, 0.42)' : 'rgba(240, 249, 255, 0.30)');
        colG.addColorStop(0.6, 'rgba(240, 249, 255, 0.16)');
        colG.addColorStop(1.0, 'rgba(240, 249, 255, 0)');
        ctx.fillStyle = colG;
        ctx.beginPath();
        ctx.moveTo(-12, -82);
        ctx.quadraticCurveTo(-24, -82 - maxH * 0.5, -28, -82 - maxH);
        ctx.lineTo(28, -82 - maxH);
        ctx.quadraticCurveTo(24, -82 - maxH * 0.5, 12, -82);
        ctx.closePath();
        ctx.fill();

        // Swirling upward steam ribbons
        ctx.strokeStyle = boost ? 'rgba(255, 255, 255, 0.72)' : 'rgba(240, 249, 255, 0.55)';
        ctx.lineWidth = 2.0;
        for (let r = -1; r <= 1; r++) {
          ctx.beginPath();
          for (let step = 0; step <= 8; step++) {
            const u = step / 8;
            const rx = r * (6 + u * 8) + Math.sin(time * 6.5 - u * 5.2 + r * 2) * (5 + u * 7);
            const ry = -84 - u * maxH;
            if (step === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
          }
          ctx.stroke();
        }

        // Layered billowing white steam puffs
        for (let k = 0; k < 8; k++) {
          const frac = ((time * 1.45 + k / 8) % 1);
          const sy = -84 - frac * maxH;
          const sx = Math.sin(time * 5.2 + k * 1.9) * (6 + frac * 13);
          const rad = 9 + frac * 17;
          ctx.fillStyle = `rgba(255, 255, 255, ${((1 - frac) * (boost ? 0.68 : 0.52)).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(sx, sy, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (p.steamWarn) {
        // Rattling warning steam puffs + golden hiss glow before eruption
        const pulse = 0.5 + 0.5 * Math.sin(time * 20);
        const wGlow = ctx.createRadialGradient(0, -88, 2, 0, -88, 26);
        wGlow.addColorStop(0, `rgba(254, 249, 195, ${(0.55 + pulse * 0.3).toFixed(2)})`);
        wGlow.addColorStop(1, 'rgba(254, 249, 195, 0)');
        ctx.fillStyle = wGlow;
        ctx.beginPath();
        ctx.arc(0, -88, 26, 0, Math.PI * 2);
        ctx.fill();
        for (let wp = -1; wp <= 1; wp++) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
          ctx.beginPath();
          ctx.arc(wp * 8, -86 - pulse * 8 - Math.abs(wp) * 3, 5.5 + pulse * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Carved Walnut & Iznik-Tile Ottoman Tea Stand (Çay Ocağı)
      const standG = ctx.createLinearGradient(-34, -18, 34, 0);
      standG.addColorStop(0, '#92400e');
      standG.addColorStop(0.5, '#78350f');
      standG.addColorStop(1, '#451a03');
      ctx.fillStyle = standG;
      ctx.strokeStyle = '#291005';
      ctx.lineWidth = 1.6;
      // Turned table legs & lower shelf
      ctx.fillRect(-30, -14, 6, 14);
      ctx.strokeRect(-30, -14, 6, 14);
      ctx.fillRect(24, -14, 6, 14);
      ctx.strokeRect(24, -14, 6, 14);
      // Table apron with inlaid Iznik turquoise ceramic tile
      ctx.beginPath();
      ctx.roundRect(-34, -19, 68, 10, 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-20, -17, 40, 6);
      ctx.fillStyle = '#fde047';
      for (let ix = -14; ix <= 14; ix += 7) {
        ctx.beginPath();
        ctx.arc(ix, -14, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Fluted Brass Pedestal & Glowing Charcoal Firebox (Ateşlik)
      const baseG = ctx.createLinearGradient(-20, -31, 20, -19);
      baseG.addColorStop(0, '#fef08a');
      baseG.addColorStop(0.45, '#d97706');
      baseG.addColorStop(1, '#78350f');
      ctx.fillStyle = baseG;
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-19, -19);
      ctx.lineTo(-15, -31);
      ctx.lineTo(15, -31);
      ctx.lineTo(19, -19);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glowing grated firebox window with live ember glow
      const emberPulse = 0.72 + 0.28 * Math.sin(time * 9);
      ctx.fillStyle = `rgba(251, 146, 60, ${emberPulse.toFixed(2)})`;
      ctx.beginPath();
      ctx.roundRect(-10, -28.5, 20, 7, 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-6, -26.5, 12, 3.2);
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.2;
      for (const gx of [-5, 0, 5]) {
        ctx.beginPath();
        ctx.moveTo(gx, -28.5);
        ctx.lineTo(gx, -21.5);
        ctx.stroke();
      }

      // 4. Ornate Double-Bellied Hammered-Copper Ottoman Samovar Urn
      const urnG = ctx.createLinearGradient(-23, -64, 23, -31);
      urnG.addColorStop(0.00, '#ffedd5');
      urnG.addColorStop(0.26, '#fb923c');
      urnG.addColorStop(0.58, '#c2410c');
      urnG.addColorStop(0.86, '#7c2d12');
      urnG.addColorStop(1.00, '#431407');
      ctx.fillStyle = urnG;
      ctx.strokeStyle = '#291005';
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.moveTo(-14, -31);
      ctx.bezierCurveTo(-24, -38, -25, -54, -15, -62);
      ctx.lineTo(-11, -67);
      ctx.lineTo(11, -67);
      ctx.lineTo(15, -62);
      ctx.bezierCurveTo(25, -54, 24, -38, 14, -31);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Embossed gilded filigree waist belt & metallic specular highlight
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-19.5, -49, 39, 3.6);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 0.9;
      ctx.strokeRect(-19.5, -49, 39, 3.6);
      ctx.strokeStyle = 'rgba(255, 247, 237, 0.55)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-12, -35);
      ctx.quadraticCurveTo(-17, -47, -11, -59);
      ctx.stroke();

      // Twin Sculpted S-Scroll Brass Handles with Turned Walnut Grips
      for (const s of [-1, 1]) {
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(s * 18, -56);
        ctx.bezierCurveTo(s * 28, -56, s * 28, -40, s * 17, -38);
        ctx.stroke();
        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.roundRect(s * 23 - 2.5, -50, 5, 8, 2);
        ctx.fill();
      }

      // Front Brass Tea Faucet (Musluk) & Drip Saucer
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(-2.5, -42, 5, 7, 1.5);
      ctx.fill();
      ctx.stroke();
      ctx.fillRect(-5.5, -43.5, 11, 2.4);
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.ellipse(0, -19.5, 7, 2.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Fluted Brass Steam Crown & Chimney Collar
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.roundRect(-13, -72, 26, 5.5, 2);
      ctx.fill();
      ctx.stroke();

      // 5. Hand-Painted Iznik Blue-and-White Porcelain Demlik Teapot on Top!
      const lidRattle = (p.steamWarn || p.steamActive) ? Math.sin(time * 28) * 1.3 : 0;
      ctx.save();
      ctx.translate(0, -72 + (p.steamActive ? -1.5 : 0));
      // Teapot curved spout (left) & C-handle (right)
      ctx.strokeStyle = '#0369a1';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(-9, -4);
      ctx.quadraticCurveTo(-16, -6, -18, -13);
      ctx.stroke();
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.strokeStyle = '#0369a1';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(9, -11);
      ctx.bezierCurveTo(17, -12, 17, -2, 9, -3);
      ctx.stroke();
      // Porcelain teapot belly
      const potG = ctx.createRadialGradient(-3, -9, 1, 0, -7, 12);
      potG.addColorStop(0, '#ffffff');
      potG.addColorStop(0.7, '#e0f2fe');
      potG.addColorStop(1, '#93c5fd');
      ctx.fillStyle = potG;
      ctx.strokeStyle = '#0369a1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, -7, 11, 7.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Cobalt Iznik floral medallion on teapot
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(0, -7, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(0, -7, 1.2, 0, Math.PI * 2);
      ctx.fill();
      // Domed porcelain lid with gilded knob (rattles with steam!)
      ctx.save();
      ctx.translate(0, -13.5 + lidRattle * 0.6);
      ctx.rotate(lidRattle * 0.08);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0369a1';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.ellipse(0, 0, 7.5, 2.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, -3.2, 2.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.restore();

      // 6. Side Brass Tea Tray with Two Classic Tulip Turkish Tea Glasses (İnce Belli)
      ctx.fillStyle = '#d97706';
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.ellipse(24, -19.5, 9, 2.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      for (const gx of [20.5, 27.5]) {
        ctx.fillStyle = 'rgba(240, 249, 255, 0.85)';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(gx - 2.4, -20);
        ctx.quadraticCurveTo(gx - 1.5, -24, gx - 2.6, -28.5);
        ctx.lineTo(gx + 2.6, -28.5);
        ctx.quadraticCurveTo(gx + 1.5, -24, gx + 2.4, -20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Rich ruby-crimson Turkish black tea inside glass
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(gx - 1.7, -26.5, 3.4, 5.8);
      }

      ctx.restore();
      return true;
    }

    if (p.type === 'istanbul_simit_vendor') {
      ctx.save();
      ctx.translate(px, py + p.h);
      // Ground shadow
      ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
      ctx.beginPath();
      ctx.ellipse(60, 0, 52, 4.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Scalloped red-and-cream Eminönü Simitçi canopy with brass finials
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#dc2626' : '#fffbeb';
        ctx.strokeStyle = '#450a0a';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(10 + i * 16, -106, 16, 12, [3, 3, 6, 6]);
        ctx.fill();
        ctx.stroke();
      }
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(16, -94);
      ctx.lineTo(16, -46);
      ctx.moveTo(100, -94);
      ctx.lineTo(100, -46);
      ctx.stroke();

      drawOttomanHumanVendor(ctx, 58, -2, '#0284c7', '#fbbf24', '#be123c', time, true);

      // Vintage crimson & brass glass-topped Simit cart + push handle
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.moveTo(14, -40);
      ctx.lineTo(2, -45);
      ctx.stroke();
      const cartG = ctx.createLinearGradient(14, -46, 104, -14);
      cartG.addColorStop(0, '#ef4444');
      cartG.addColorStop(0.55, '#dc2626');
      cartG.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = cartG;
      ctx.strokeStyle = '#450a0a';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(14, -46, 92, 31, 4);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.3;
      ctx.strokeRect(18, -42, 84, 23);
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 9.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TAZE SİMİT', 60, -27);

      // Beveled glass showcase filled with stacked sesame Simit towers & white cheese!
      ctx.fillStyle = 'rgba(224, 242, 254, 0.45)';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.8;
      ctx.fillRect(18, -72, 84, 26);
      ctx.strokeRect(18, -72, 84, 26);
      // Stacked golden Simit rings on wooden pegs
      for (const sx0 of [30, 50, 70]) {
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(sx0, -47);
        ctx.lineTo(sx0, -68);
        ctx.stroke();
        for (let st = 0; st < 4; st++) {
          ctx.fillStyle = '#d97706';
          ctx.strokeStyle = '#fde68a';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.ellipse(sx0, -50 - st * 4.2, 7.5, 2.4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      }
      // Upright golden sesame Simit ring on display + white Beyaz Peynir cheese wedge
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3.8;
      ctx.beginPath();
      ctx.arc(89, -57, 6.2, 0, Math.PI * 2);
      ctx.stroke();

      // Spoked wooden & brass cart wheels
      for (const wx of [30, 90]) {
        ctx.fillStyle = '#451a03';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(wx, -12, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.2;
        for (let sp = 0; sp < 4; sp++) {
          const a = (sp * Math.PI) / 4;
          ctx.beginPath();
          ctx.moveTo(wx - Math.cos(a) * 10, -12 - Math.sin(a) * 10);
          ctx.lineTo(wx + Math.cos(a) * 10, -12 + Math.sin(a) * 10);
          ctx.stroke();
        }
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(wx, -12, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!p.gifted) {
        const hb = Math.sin(time * 3.6) * 3;
        ctx.fillStyle = 'rgba(185, 28, 28, 0.92)';
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(32, -127 + hb, 56, 17, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 9.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🥨 +❤️ 🪙', 60, -115 + hb);
      }
      ctx.restore();
      return true;
    }

    if (p.type === 'istanbul_mosaic_chandelier') {
      const cx = px + p.w * 0.5;
      const ax = (p.anchorX !== undefined ? p.anchorX - (p.x - px) : cx);
      const ay = (p.anchorY !== undefined ? p.anchorY - (p.y - py) : py - 165);
      const seaY = Math.max(ay + 280, 680 - ((p.y || 545) - py));
      ctx.save();

      // 1. Grounded Overwater Ottoman Stone-and-Wrought-Iron Lantern Gantry Portal (NO floating box!)
      const spanHalf = 96;
      for (const side of [-1, 1]) {
        const postX = ax + side * spanHalf;
        // Cut stone pier base rising out of the Bosphorus water + slim cast-iron lattice column
        ctx.fillStyle = '#cbd5e1';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.4;
        ctx.fillRect(postX - 9, seaY - 95, 18, 95);
        ctx.strokeRect(postX - 9, seaY - 95, 18, 95);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(postX, seaY - 95);
        ctx.lineTo(postX, ay - 6);
        ctx.stroke();
        // Scrolled Ottoman iron arch bracket
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(postX, ay + 18);
        ctx.quadraticCurveTo(postX - side * 18, ay - 4, postX - side * 34, ay - 4);
        ctx.stroke();
      }
      // Overhead riveted wrought-iron & gilded Ottoman arch girder
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(ax - spanHalf - 8, ay - 12, (spanHalf + 8) * 2, 10, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(ax, ay - 7, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // 2. Braided Brass Suspension Chain + Filigree Canopy + Walkable Brass Chandelier Ring!
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(ax, ay - 1);
      ctx.lineTo(cx, py - 24);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(cx - 11, py - 18);
      ctx.quadraticCurveTo(cx, py - 28, cx + 11, py - 18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(cx, py - 20);
      ctx.lineTo(px + 12, py + 2);
      ctx.moveTo(cx, py - 20);
      ctx.lineTo(cx, py + 2);
      ctx.moveTo(cx, py - 20);
      ctx.lineTo(px + p.w - 12, py + 2);
      ctx.stroke();

      const ringG = ctx.createLinearGradient(px, py, px, py + 14);
      ringG.addColorStop(0, '#fef9c3');
      ringG.addColorStop(0.5, '#f59e0b');
      ringG.addColorStop(1, '#78350f');
      ctx.fillStyle = ringG;
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(px, py, p.w, 13, 5);
      ctx.fill();
      ctx.stroke();

      // 5 Faceted Stained-Glass Turkish Mosaic Globes with Brass Caps & Filigree Finials
      const globeCols = ['#f43f5e', '#38bdf8', '#fbbf24', '#10b981', '#a855f7'];
      for (let i = 0; i < 5; i++) {
        const gx = px + 18 + i * ((p.w - 36) / 4);
        const gy = py + 25 + (i % 2) * 8;
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(gx, py + 13);
        ctx.lineTo(gx, gy - 8);
        ctx.stroke();
        const glow = ctx.createRadialGradient(gx, gy, 2, gx, gy, 24);
        glow.addColorStop(0, 'rgba(254, 240, 138, 0.72)');
        glow.addColorStop(1, 'rgba(251, 146, 60, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(gx, gy, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = globeCols[i];
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(gx, gy, 8.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Diamond mosaic star pattern & brass bottom spike
        ctx.fillStyle = '#fffbeb';
        ctx.beginPath();
        ctx.moveTo(gx, gy - 4); ctx.lineTo(gx + 3.5, gy); ctx.lineTo(gx, gy + 4); ctx.lineTo(gx - 3.5, gy);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(gx, gy + 8.5);
        ctx.lineTo(gx, gy + 13.5);
        ctx.stroke();
      }
      ctx.restore();
      return true;
    }

    if (p.type === 'istanbul_hammam_valve') {
      ctx.save();
      ctx.translate(px + p.w * 0.5, py + p.h);
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-28, -74, 56, 74, [26, 26, 2, 2]);
      ctx.clip();
      fillAshlarMasonry(ctx, -28, -74, 56, 74, 11, 17, MARBLE_PAL, 29);
      ctx.restore();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(-28, -74, 56, 74, [26, 26, 2, 2]);
      ctx.stroke();

      // Pointed Iznik turquoise tile niche + brass tap + hammered copper bath bowl (Hamam Tası)!
      ctx.fillStyle = p.active ? '#0284c7' : '#334155';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.roundRect(-18, -64, 36, 28, [16, 16, 2, 2]);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.ellipse(12, -8, 8.5, 4.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.translate(0, -30);
      ctx.rotate(p.wheelRot || (p.active ? time * 1.8 : 0));
      ctx.strokeStyle = p.active ? '#fde047' : '#d97706';
      ctx.lineWidth = 4.0;
      ctx.beginPath();
      ctx.arc(0, 0, 15.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 2.4;
      for (let s = 0; s < 6; s++) {
        const a = (s * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * 14.5, Math.sin(a) * 14.5);
        ctx.stroke();
      }
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.arc(0, 0, 4.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = p.active ? '#38bdf8' : '#fbbf24';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.active ? '♨️ HAMMAM ON' : '⚙ HAMMAM', 0, -80);
      ctx.restore();
      return true;
    }

    if (p.type === 'istanbul_hammam_lift') {
      const basePy = (p.baseY !== undefined ? p.baseY - (p.y - py) : py);
      ctx.save();
      const liftDist = Math.max(8, basePy - py + 34);
      // Twin telescoping fluted brass steam cylinders + central pressure gauge!
      for (const ox of [24, p.w - 24]) {
        const pG = ctx.createLinearGradient(px + ox - 8, py, px + ox + 8, py);
        pG.addColorStop(0, '#fef9c3');
        pG.addColorStop(0.5, '#d97706');
        pG.addColorStop(1, '#451a03');
        ctx.fillStyle = pG;
        ctx.strokeStyle = '#291005';
        ctx.lineWidth = 1.4;
        ctx.fillRect(px + ox - 6.5, py + p.h, 13, liftDist);
        ctx.strokeRect(px + ox - 6.5, py + p.h, 13, liftDist);
        ctx.fillStyle = '#fbbf24';
        for (let cy0 = py + p.h + 18; cy0 < py + p.h + liftDist - 10; cy0 += 28) {
          ctx.fillRect(px + ox - 8.5, cy0, 17, 4);
        }
      }
      if (p.liftActive) {
        for (let k = 0; k < 6; k++) {
          const sf = (time * 1.8 + k * 0.17) % 1;
          ctx.fillStyle = `rgba(224, 242, 254, ${(0.62 * (1 - sf)).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(px + p.w * (0.2 + (k % 3) * 0.3) + Math.sin(time * 7 + k) * 8, py + p.h + sf * 44, 7 + sf * 10, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      const mG = ctx.createLinearGradient(px, py, px, py + p.h);
      mG.addColorStop(0, '#ffffff');
      mG.addColorStop(0.55, '#e2e8f0');
      mG.addColorStop(1, '#94a3b8');
      ctx.fillStyle = mG;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(px, py, p.w, p.h, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(px + 2, py + 2, p.w - 4, 5.5);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(px + 2, py + 7.5, p.w - 4, 2.2);
      // Center brass steam pressure dial on marble slab front
      ctx.fillStyle = '#fef9c3';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(px + p.w * 0.5, py + p.h * 0.62, 5.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      return true;
    }

    // NEW OBSTACLE #6: MARAŞ DONDURMA TRICKSTER CART & SWEEPING BRASS PADDLE!
    if (p.type === 'istanbul_dondurma_trick') {
      const floorY = py + p.h;
      const cx = px + p.w * 0.5;
      const dir = p.paddleDir || -1;
      ctx.save();
      ctx.translate(cx, floorY);

      // Ornate Scalloped Ottoman Velvet Canopy + Row of Hanging Brass Trickster Bells!
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-44, -44);
      ctx.lineTo(-44, -104);
      ctx.moveTo(44, -44);
      ctx.lineTo(44, -104);
      ctx.stroke();
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#9f1239' : '#fef3c7';
        ctx.strokeStyle = '#4c0519';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(-48 + i * 16, -114, 16, 12, [3, 3, 6, 6]);
        ctx.fill();
        ctx.stroke();
        const bellSway = Math.sin(time * 7 + i) * 1.6;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(-40 + i * 16 + bellSway, -98, 3.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Detailed Maraş Dondurma Master behind the copper ice-cream barrels!
      drawOttomanHumanVendor(ctx, 0, -2, '#9f1239', '#fde047', '#be123c', time, true);

      // Hammered-Brass & Mahogany Maraş Ice-Cream Cart Body
      const cG = ctx.createLinearGradient(-46, -46, 46, -10);
      cG.addColorStop(0, '#fde68a');
      cG.addColorStop(0.45, '#d97706');
      cG.addColorStop(1, '#78350f');
      ctx.fillStyle = cG;
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(-46, -46, 92, 34, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#9f1239';
      ctx.fillRect(-40, -38, 80, 18);
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 8.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MARAŞ DONDURMA', 0, -26);

      for (const bx of [-24, 0, 24]) {
        ctx.fillStyle = '#fbbf24';
        ctx.strokeStyle = '#451a03';
        ctx.beginPath();
        ctx.ellipse(bx, -46, 9, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      for (const wx of [-30, 30]) {
        ctx.fillStyle = '#451a03';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(wx, -10, 9.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      if (p.charmedTimer > 0) {
        // Stretchy Elastic Pink-Rose & Pistachio Dondurma Bounce Cushion!
        const sq = Math.sin(time * 9) * 2.5;
        const dG = ctx.createLinearGradient(-44, -76, 44, -46);
        dG.addColorStop(0, '#fbcfe8');
        dG.addColorStop(0.5, '#fffbeb');
        dG.addColorStop(1, '#bbf7d0');
        ctx.fillStyle = dG;
        ctx.strokeStyle = '#db2777';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(-44, -46);
        ctx.quadraticCurveTo(0, -84 + sq, 44, -46);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('🍦 BOUNCE!', 0, -76 + sq);
      } else {
        // Long Sweeping Brass Trickster Paddle + Spinning Ice-Cream Cone Hazard!
        const reach = p.paddleReach !== undefined ? p.paddleReach : 65;
        const waveY = p.paddleWaveY || 0;
        const tipX = dir * reach;
        const tipY = -36 + waveY;

        if (reach > 72) {
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.65)';
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.arc(tipX, tipY, 16, -0.8, 0.8);
          ctx.stroke();
        }

        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 5.4;
        ctx.beginPath();
        ctx.moveTo(dir * 10, -54);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(dir * 10, -54);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        ctx.save();
        ctx.translate(tipX, tipY);
        ctx.rotate(time * 8 * dir);
        ctx.fillStyle = '#d97706';
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(0, 11);
        ctx.lineTo(-6, -2);
        ctx.lineTo(6, -2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fce7f3';
        ctx.strokeStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(-2, -5, 6.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#bbf7d0';
        ctx.beginPath();
        ctx.arc(3, -8, 5.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
      return true;
    }

    // NEW OBSTACLE #7: ISTIKLAL ROASTED CHESTNUT CART (KESTANE KEBAP) & POPPING EMBERS!
    if (p.type === 'istanbul_kestane_cart') {
      const floorY = py + p.h;
      const cx = px + p.w * 0.5;
      ctx.save();
      ctx.translate(cx, floorY);

      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(0, -44);
      ctx.lineTo(0, -108);
      ctx.stroke();
      for (let s = -2; s <= 1; s++) {
        ctx.fillStyle = s % 2 === 0 ? '#dc2626' : '#fef3c7';
        ctx.strokeStyle = '#450a0a';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -114);
        ctx.lineTo(s * 24, -92);
        ctx.lineTo((s + 1) * 24, -92);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      drawOttomanHumanVendor(ctx, -18, -2, '#78350f', '#fbbf24', '#991b1b', time, false);

      const kG = ctx.createLinearGradient(-44, -44, 44, -10);
      kG.addColorStop(0, '#ef4444');
      kG.addColorStop(1, '#991b1b');
      ctx.fillStyle = kG;
      ctx.strokeStyle = '#450a0a';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(-44, -44, 88, 32, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 8.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('KESTANE KEBAP', 0, -24);

      for (const wx of [-28, 28]) {
        ctx.fillStyle = '#451a03';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(wx, -10, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      if (p.dampedTimer > 0) {
        ctx.fillStyle = '#fbbf24';
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-22, -44);
        ctx.quadraticCurveTo(10, -64, 38, -44);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        if (p.kestaneWarn) {
          const wg = ctx.createRadialGradient(10, -50, 3, 10, -50, 30);
          wg.addColorStop(0, 'rgba(251, 146, 60, 0.85)');
          wg.addColorStop(1, 'rgba(251, 146, 60, 0)');
          ctx.fillStyle = wg;
          ctx.beginPath();
          ctx.arc(10, -50, 30, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#fb923c';
        ctx.fillRect(-16, -48, 52, 5);
        for (let cIdx = 0; cIdx < 6; cIdx++) {
          ctx.fillStyle = '#78350f';
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(-10 + cIdx * 8, -50, 3.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      }

      if (p.embers && p.embers.length) {
        for (const em of p.embers) {
          const ex = em.x - (p.x + p.w * 0.5);
          const ey = em.y - (p.y + p.h);
          const eg = ctx.createRadialGradient(ex, ey, 2, ex, ey, 16);
          eg.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
          eg.addColorStop(0.5, 'rgba(249, 115, 22, 0.65)');
          eg.addColorStop(1, 'rgba(239, 68, 68, 0)');
          ctx.fillStyle = eg;
          ctx.beginPath();
          ctx.arc(ex, ey, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#7c2d12';
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(ex, ey, 6.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.strokeStyle = '#fef9c3';
          ctx.beginPath();
          ctx.moveTo(ex - 3, ey);
          ctx.lineTo(ex + 3, ey);
          ctx.stroke();
        }
      }

      ctx.restore();
      return true;
    }

    // NEW PLATFORM #8: BUOYANT BOSPHORUS CEDAR FLOATING PONTOON!
    if (p.type === 'istanbul_floating_pontoon') {
      const cx = px + p.w * 0.5;
      const tilt = p.pontoonTilt || 0;
      ctx.save();
      ctx.translate(cx, py + p.h * 0.5);
      ctx.rotate(tilt);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-p.w * 0.5 - 10, p.h * 0.5 + 3);
      ctx.quadraticCurveTo(0, p.h * 0.5 + 8, p.w * 0.5 + 10, p.h * 0.5 + 3);
      ctx.stroke();

      for (const dx of [-p.w * 0.34, 0, p.w * 0.34]) {
        ctx.fillStyle = '#0369a1';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(dx - 16, 0, 32, p.h * 0.5 + 4, 5);
        ctx.fill();
        ctx.stroke();
      }

      const dG = ctx.createLinearGradient(0, -p.h * 0.5, 0, 4);
      dG.addColorStop(0, '#f59e0b');
      dG.addColorStop(0.55, '#b45309');
      dG.addColorStop(1, '#78350f');
      ctx.fillStyle = dG;
      ctx.strokeStyle = '#291509';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(-p.w * 0.5, -p.h * 0.5, p.w, p.h * 0.68, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-p.w * 0.5 + 3, -p.h * 0.5 + 2, p.w - 6, 3.2);

      ctx.strokeStyle = 'rgba(41, 21, 9, 0.45)';
      ctx.lineWidth = 1.1;
      for (let sx = -p.w * 0.5 + 22; sx < p.w * 0.5 - 10; sx += 22) {
        ctx.beginPath();
        ctx.moveTo(sx, -p.h * 0.5);
        ctx.lineTo(sx, 2);
        ctx.stroke();
      }
      // Turkish Evil-Eye (Nazar Boncuğu) marine talisman + lashed red/white fenders!
      for (const fxOff of [-p.w * 0.24, p.w * 0.24]) {
        ctx.fillStyle = '#dc2626';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.ellipse(fxOff, 1, 4.2, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = '#1d4ed8';
      ctx.beginPath(); ctx.arc(0, -2, 4.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, -2, 3.0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.arc(0, -2, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(0, -2, 0.8, 0, Math.PI * 2); ctx.fill();

      for (const cx0 of [-p.w * 0.40, p.w * 0.40]) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(cx0 - 6, -p.h * 0.5 - 4, 12, 4);
        ctx.fillRect(cx0 - 10, -p.h * 0.5 - 6, 20, 2.5);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(cx0 + 12, -p.h * 0.5 - 1.5, 3.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
      return true;
    }

    // NEW PLATFORM #9: SULTANAHMET MARBLE TULIP FOUNTAIN & RISING WATER-JET LOTUS DISC!
    if (p.type === 'istanbul_tulip_fountain') {
      const cx = px + p.w * 0.5;
      const basePy = (p.baseY !== undefined ? p.baseY - (p.y - py) : py);
      const basinY = basePy + 38;
      const seaFloorY = basinY + 75;
      ctx.save();

      // Grounded fluted marble fountain pedestal rising out of Bosphorus channel
      const pedG = ctx.createLinearGradient(cx - 16, 0, cx + 16, 0);
      pedG.addColorStop(0, '#f8fafc');
      pedG.addColorStop(0.6, '#cbd5e1');
      pedG.addColorStop(1, '#64748b');
      ctx.fillStyle = pedG;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.fillRect(cx - 15, basinY + 12, 30, seaFloorY - (basinY + 12));
      ctx.strokeRect(cx - 15, basinY + 12, 30, seaFloorY - (basinY + 12));

      // Pressurized crystal Bosphorus water column + foaming crown!
      const jetH = Math.max(8, basinY - (py + p.h * 0.5));
      const jetW = 22 + Math.sin(time * 18) * 3;
      const jG = ctx.createLinearGradient(cx - jetW * 0.5, py, cx + jetW * 0.5, py);
      jG.addColorStop(0.0, 'rgba(56, 189, 248, 0.80)');
      jG.addColorStop(0.5, 'rgba(255, 255, 255, 0.98)');
      jG.addColorStop(1.0, 'rgba(14, 165, 233, 0.84)');
      ctx.fillStyle = jG;
      ctx.fillRect(cx - jetW * 0.5, py + p.h * 0.5, jetW, jetH);

      ctx.fillStyle = 'rgba(240, 249, 255, 0.90)';
      for (let sp = -2; sp <= 2; sp++) {
        const dropY = py + p.h + ((time * 58 + Math.abs(sp) * 14) % 30);
        ctx.beginPath();
        ctx.arc(cx + sp * (p.w * 0.22), dropY, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sculpted 3D Ottoman Marble Tulip (Lale) Chalice Basin + Twin Brass Swan Spouts!
      for (const side of [-1, 1]) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(cx + side * 28, basinY - 2);
        ctx.quadraticCurveTo(cx + side * 40, basinY - 12, cx + side * 36, basinY + 2);
        ctx.stroke();
      }
      const bG = ctx.createLinearGradient(cx - 38, basinY - 20, cx + 38, basinY + 14);
      bG.addColorStop(0, '#ffffff');
      bG.addColorStop(0.6, '#cbd5e1');
      bG.addColorStop(1, '#64748b');
      ctx.fillStyle = bG;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cx - 38, basinY - 12);
      ctx.lineTo(cx - 22, basinY - 4);
      ctx.lineTo(cx, basinY - 15);
      ctx.lineTo(cx + 22, basinY - 4);
      ctx.lineTo(cx + 38, basinY - 12);
      ctx.quadraticCurveTo(cx + 30, basinY + 13, cx + 18, basinY + 14);
      ctx.lineTo(cx - 18, basinY + 14);
      ctx.quadraticCurveTo(cx - 30, basinY + 13, cx - 38, basinY - 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(cx - 20, basinY + 1, 40, 6);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx, basinY - 10, 6.5, Math.PI, 0);
      ctx.fill();

      // Carved Marmara-Marble & Iznik-Tile Rising Lotus Platform Disc!
      const mG = ctx.createLinearGradient(px, py, px, py + p.h + 6);
      mG.addColorStop(0, '#ffffff');
      mG.addColorStop(0.55, '#e2e8f0');
      mG.addColorStop(1, '#94a3b8');
      ctx.fillStyle = mG;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(px, py, p.w, p.h, [4, 4, 14, 14]);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(px + 4, py + 2, p.w - 8, 5);
      ctx.fillStyle = '#fbbf24';
      for (let tx = px + 18; tx < px + p.w - 14; tx += 22) {
        ctx.beginPath();
        ctx.arc(tx, py + p.h - 2.5, 4.5, 0, Math.PI);
        ctx.fill();
      }
      ctx.restore();
      return true;
    }

    return false;
  }

  const prevPurgeIstanbul = Art.purgeInactiveStageCaches;
  Art.purgeInactiveStageCaches = function (activeTheme) {
    if (typeof prevPurgeIstanbul === 'function') prevPurgeIstanbul(activeTheme);
    if (activeTheme !== 'istanbul') {
      for (const c of [istanbulCloudSprite, istanbulHorizonCache, istanbulFarCache, istanbulMidCache]) {
        if (c) { c.width = 0; c.height = 0; }
      }
      istanbulCloudSprite = null;
      istanbulHorizonCache = null;
      istanbulFarCache = null;
      istanbulMidCache = null;
    }
  };

  Art.drawIstanbulSkyAndHorizon = drawIstanbulSkyAndHorizon;
  Art.drawIstanbulMidground = drawIstanbulMidground;
  Art.drawIstanbulGalataGate = drawIstanbulGalataGate;
  Art.drawIstanbulWaterChannel = drawIstanbulWaterChannel;
  Art.drawPlatform = function (ctx, p, px, py, nv, time) {
    if (p && p.type && p.type.startsWith('istanbul_')) {
      if (drawIstanbulPlatform(ctx, p, px, py, nv, time)) return;
    }
    return prevDrawPlatform(ctx, p, px, py, nv, time);
  };
  Art.drawCheckpoint = function (ctx, cp, cx, cy, time, theme, stageNum) {
    if (theme === 'istanbul' || stageNum === 27) {
      drawIstanbulCheckpoint(ctx, cp, cx, cy, time);
      return;
    }
    return prevDrawCheckpoint(ctx, cp, cx, cy, time, theme, stageNum);
  };
})();
