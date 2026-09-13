import { createSlice } from '@reduxjs/toolkit';
import { xmbData, PANELS } from '../../constant';

// Kategori sayısı ve her kategorideki öğe sayısı xmbData'dan türetiliyor.
// Böylece sınır kontrolleri veriye göre otomatik çalışır, sabit sayı yazılmaz.
const CATEGORY_COUNT = xmbData.categories.length;

const getItemCount = (categoryIndex) =>
  xmbData.categories[categoryIndex]?.items.length ?? 0;

const initialState = {
  activeCategoryIndex: 0,

  // Dikey eksen: HER kategori için ayrı hatırlanan öğe indeksi.
  // Kategoriler arası geçişte "3. öğedeyken Ayarlar'a gidip döndüğünde
  // yine 3. öğede misin?" testi bunun sayesinde geçer.
  itemIndexByCategory: Array(CATEGORY_COUNT).fill(0),

  // Açık panel: null = kapalı, aksi halde panel id'si (ör. 'about', 'cv')
  openPanel: null,

  // Boot sekansı fazı: 'press-start' | 'boot-sequence' | 'ready'
  // 'press-start': AudioContext unlock bekleniyor, XMB henüz görünmüyor
  // 'boot-sequence': logo + dalga girişi animasyonu oynuyor, input kilitli
  // 'ready': XMB tam çalışır durumda
  bootPhase: 'press-start',
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Bir panel girdiyi tamamen devralmış mı? (ör. Doom: Escape dahil her tuş ona ait)
// Hem reducer'lar hem de girdi hook'ları bunu kullanıyor, o yüzden dışa açık.
export const isInputCaptured = (state) =>
  Boolean(state.openPanel && PANELS[state.openPanel]?.capturesInput);

const isNavigationLocked = (state) => state.openPanel || state.bootPhase !== 'ready';

const xmbSlice = createSlice({
  name: 'xmb',
  initialState,
  reducers: {
    // --- Yatay navigasyon ---
    moveCategoryLeft(state) {
      if (isNavigationLocked(state)) return;
      state.activeCategoryIndex = clamp(
        state.activeCategoryIndex - 1,
        0,
        CATEGORY_COUNT - 1
      );
    },
    moveCategoryRight(state) {
      if (isNavigationLocked(state)) return;
      state.activeCategoryIndex = clamp(
        state.activeCategoryIndex + 1,
        0,
        CATEGORY_COUNT - 1
      );
    },

    // --- Dikey navigasyon (aktif kategori içinde) ---
    moveItemUp(state) {
      if (isNavigationLocked(state)) return;
      const idx = state.activeCategoryIndex;
      const itemCount = getItemCount(idx);
      state.itemIndexByCategory[idx] = clamp(
        state.itemIndexByCategory[idx] - 1,
        0,
        Math.max(itemCount - 1, 0)
      );
    },
    moveItemDown(state) {
      if (isNavigationLocked(state)) return;
      const idx = state.activeCategoryIndex;
      const itemCount = getItemCount(idx);
      state.itemIndexByCategory[idx] = clamp(
        state.itemIndexByCategory[idx] + 1,
        0,
        Math.max(itemCount - 1, 0)
      );
    },

    // --- Panel yönetimi ---
    openPanelById(state, action) {
      state.openPanel = action.payload;
    },
    closePanel(state) {
      state.openPanel = null;
    },

    // --- Boot ---
    setBootPhase(state, action) {
      state.bootPhase = action.payload;
    },

    // --- Doğrudan konumlama (ör. deep-link veya klavye "select") ---
    setActiveCategoryIndex(state, action) {
      state.activeCategoryIndex = clamp(action.payload, 0, CATEGORY_COUNT - 1);
    },
    setItemIndex(state, action) {
      const { categoryIndex, itemIndex } = action.payload;
      const itemCount = getItemCount(categoryIndex);
      state.itemIndexByCategory[categoryIndex] = clamp(
        itemIndex,
        0,
        Math.max(itemCount - 1, 0)
      );
    },
  },
});

export const {
  moveCategoryLeft,
  moveCategoryRight,
  moveItemUp,
  moveItemDown,
  openPanelById,
  closePanel,
  setBootPhase,
  setActiveCategoryIndex,
  setItemIndex,
} = xmbSlice.actions;

// --- Selectors ---
export const selectActiveCategoryIndex = (state) => state.xmb.activeCategoryIndex;
export const selectActiveItemIndex = (state) => state.xmb.itemIndexByCategory[state.xmb.activeCategoryIndex];
export const selectOpenPanel = (state) => state.xmb.openPanel;
export const selectBootPhase = (state) => state.xmb.bootPhase;
export const selectInputCaptured = (state) => isInputCaptured(state.xmb);

export default xmbSlice.reducer;