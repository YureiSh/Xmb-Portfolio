'use strict';

window.BG_GRADIENT_PRESETS_DAY = {
  '01': { angleDeg: 90.25, colorStart: [197, 197, 197, 255], colorEnd: [201, 201, 201, 255] },
  '02': { angleDeg: 67, colorStart: [203, 158, 13, 255], colorEnd: [219, 214, 41, 255] },
  '03': { angleDeg: 106, colorStart: [142, 190, 40, 255], colorEnd: [104, 168, 22, 255] },
  '04': { angleDeg: 136.75, colorStart: [216, 182, 182, 255], colorEnd: [231, 66, 117, 255] },
  '05': { angleDeg: 1.5, colorStart: [19, 108, 19, 255], colorEnd: [24, 156, 24, 255] },
  '06': { angleDeg: 148.75, colorStart: [198, 120, 238, 255], colorEnd: [103, 77, 161, 255] },
  '07': { angleDeg: 26.5, colorStart: [0, 167, 146, 255], colorEnd: [10, 240, 239, 255] },
  '08': { angleDeg: 62.5, colorStart: [0, 0, 95, 255], colorEnd: [33, 217, 255, 255] },
  '09': { angleDeg: 148.5, colorStart: [146, 44, 155, 255], colorEnd: [217, 98, 236, 255] },
  '10': { angleDeg: 128.5, colorStart: [227, 151, 15, 255], colorEnd: [224, 187, 2, 255] },
  '11': { angleDeg: 90, colorStart: [115, 68, 20, 255], colorEnd: [154, 118, 47, 255] },
  '12': { angleDeg: 170.5, colorStart: [236, 68, 45, 255], colorEnd: [214, 63, 43, 255] },
};

window.BG_GRADIENT_PRESETS_NIGHT = {
  '01': { angleDeg: 89.75, colorStart: [181, 181, 181, 255], colorEnd: [0, 0, 0, 255] },
  '02': { angleDeg: 93.75, colorStart: [198, 188, 128, 255], colorEnd: [0, 0, 0, 255] },
  '03': { angleDeg: 90.25, colorStart: [152, 170, 113, 255], colorEnd: [0, 0, 0, 255] },
  '04': { angleDeg: 90.25, colorStart: [212, 174, 182, 255], colorEnd: [10, 8, 8, 255] },
  '05': { angleDeg: 116, colorStart: [48, 118, 48, 255], colorEnd: [11, 3, 11, 255] },
  '06': { angleDeg: 91, colorStart: [209, 163, 225, 255], colorEnd: [0, 0, 0, 255] },
  '07': { angleDeg: 109.75, colorStart: [16, 129, 124, 255], colorEnd: [17, 0, 0, 255] },
  '08': { angleDeg: 69.5, colorStart: [20, 159, 176, 255], colorEnd: [0, 0, 31, 255] },
  '09': { angleDeg: 51, colorStart: [116, 0, 153, 255], colorEnd: [12, 0, 11, 255] },
  '10': { angleDeg: 89.75, colorStart: [216, 142, 0, 255], colorEnd: [0, 0, 0, 255] },
  '11': { angleDeg: 90, colorStart: [131, 86, 32, 255], colorEnd: [18, 20, 17, 255] },
  '12': { angleDeg: 118.25, colorStart: [157, 59, 44, 255], colorEnd: [0, 0, 3, 255] },
};

(function () {
  const day = window.BG_GRADIENT_PRESETS_DAY;
  const night = window.BG_GRADIENT_PRESETS_NIGHT;
  const monthKeys = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  const merged = {
    default: { label: 'Original (RGB Sliders)', legacy: true },
  };
  const options = [{ value: 'default', label: 'Original (RGB Sliders)' }];

  monthKeys.forEach(function (m) {
    if (day[m]) {
      merged[m + '_day'] = {
        label: m + ' (Day)',
        angleDeg: day[m].angleDeg,
        colorStart: day[m].colorStart.slice(),
        colorEnd: day[m].colorEnd.slice(),
      };
      options.push({ value: m + '_day', label: m + ' (Day)' });
    }
    if (night[m]) {
      merged[m + '_night'] = {
        label: m + ' (Night)',
        angleDeg: night[m].angleDeg,
        colorStart: night[m].colorStart.slice(),
        colorEnd: night[m].colorEnd.slice(),
      };
      options.push({ value: m + '_night', label: m + ' (Night)' });
    }
  });

  window.BG_GRADIENT_PRESETS = merged;
  window.BG_GRADIENT_PRESET_OPTIONS = options;
})();