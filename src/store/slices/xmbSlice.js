import { createSlice } from '@reduxjs/toolkit';
import { xmbData } from '../../constant';

// Kategori sayısı ve her kategorideki öğe sayısı xmbData'dan türetiliyor.
// Böylece sınır kontrolleri veriye göre otomatik çalışır, sabit sayı yazılmaz.
const CATEGORY_COUNT = xmbData.categories.length;

const getItemCount = (categoryIndex) =>
  xmbData.categories[categoryIndex]?.items.length ?? 0;

const initialState = {
  // Yatay eksen: hangi kategori aktif
  activeCategoryIndex: 0,

  // Dikey eksen: HER kategori için ayrı hatırlanan öğe indeksi.
  // Kategoriler arası geçişte "3. öğedeyken Ayarlar'a gidip döndüğünde
  // yine 3. öğede misin?" testi bunun sayesinde geçer.
  itemIndexByCategory: Array(CATEGORY_COUNT).fill(0),

  // Açık panel: null = kapalı, aksi halde panel id'si (ör. 'about', 'cv')
  openPanel: null,

  // Boot sekansı fazı: 'booting' | 'ready'
  // Hafta 4'te 'press-start' | 'boot-sequence' gibi ara fazlar eklenecek.
  bootPhase: 'ready',
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const xmbSlice = createSlice({
  name: 'xmb',
  initialState,
  reducers: {
    // --- Yatay navigasyon ---
    moveCategoryLeft(state) {
      if (state.openPanel) return;
      state.activeCategoryIndex = clamp(
        state.activeCategoryIndex - 1,
        0,
        CATEGORY_COUNT - 1
      );
    },
    moveCategoryRight(state) {
      if (state.openPanel) return;
      state.activeCategoryIndex = clamp(
        state.activeCategoryIndex + 1,
        0,
        CATEGORY_COUNT - 1
      );
    },

    // --- Dikey navigasyon (aktif kategori içinde) ---
    moveItemUp(state) {
      if (state.openPanel) return;
      const idx = state.activeCategoryIndex;
      const itemCount = getItemCount(idx);
      state.itemIndexByCategory[idx] = clamp(
        state.itemIndexByCategory[idx] - 1,
        0,
        Math.max(itemCount - 1, 0)
      );
    },
    moveItemDown(state) {
      if (state.openPanel) return;
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

export default xmbSlice.reducer;