window.Game = window.Game || {};

(function () {
  // =========================================================================
  // LEVEL 27: BATTIR (STATIC BACKGROUND EDITION — نسخة بتّير بخلفية ثابتة)
  // Exact gameplay copy of Stage 26 with all background animations frozen.
  // =========================================================================
  window.Game.createLevel27 = function createLevel27() {
    const lv = window.Game.createLevel26();
    lv.stage = 27;
    lv.title = 'المرحلة 27';
    lv.staticBackground = true;
    return lv;
  };
})();
