window.Game = window.Game || {};

(function () {
  // =========================================================================
  // LEVEL 27: BATTIR (CLEAR SKY EDITION — نسخة بتّير بسماء صافية فقط)
  // Exact gameplay copy of Stage 26 with a clean clear-sky-only background.
  // =========================================================================
  window.Game.createLevel27 = function createLevel27() {
    const lv = window.Game.createLevel26();
    lv.stage = 27;
    lv.title = 'المرحلة 27';
    lv.staticBackground = true;
    lv.clearSkyOnly = true;
    lv.lamps = [];
    return lv;
  };
})();
