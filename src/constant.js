/**
 * XMB içerik veri modeli.
 *
 * Her kategori yatay eksende bir ikon. Her kategorinin `items` dizisi
 * o kategori seçiliyken dikeyde gezinilen öğeler.
 *
 * @typedef {'panel' | 'game' | 'external' | 'sublist' | 'disabled'} XmbItemType
 * - 'panel'    → openPanelById(panelId) tetiklenir, panel component'i açılır
 * - 'game'     → WASM oyunu panel içine gömülü açılır (Hafta 5)
 * - 'external' → yeni sekmede bir linke gider (ör. GitHub, LinkedIn)
 * - 'sublist'  → XMB sola kayar, öğenin `children` dizisi ikinci sütun olarak açılır
 * - 'disabled' → görünür ama seçilemez; PS3'te de kullanılamayan öğeler soluk dururdu
 *
 * @typedef {Object} XmbItem
 * @property {string} id
 * @property {string} label 
 * @property {string} icon
 * @property {XmbItemType} type
 * @property {string} [target]
 *
 * @typedef {Object} XmbCategory
 * @property {string} id
 * @property {string} label
 * @property {string} icon
 * @property {XmbItem[]} items
 */

/** @type {{ categories: XmbCategory[] }} */

export const xmbData = {
  categories: [
    {
      id: 'profile',
      label: 'Profile',
      icon: 'user.svg',
      items: [
        { id: 'about', label: 'Hakkımda', icon: 'userPlus.svg', type: 'panel', target: 'about' },
        { id: 'cv', label: 'CV', icon: 'user1.svg', type: 'panel', target: 'cv' },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings.svg',
      items: [
        { id: 'systemSettings', label: 'System Settings', icon: 'settings.svg', type: 'panel', target: 'systemSettings' },
        { id: 'themeSettings', label: 'Theme Settings', icon: 'settings.svg', type: 'panel', target: 'themeSettings' },
        //{ id: 'project_portfolio', label: 'Portfolio', icon: 'project_portfolio', type: 'panel', target: 'project_portfolio' },
        //{ id: 'ecommerce', label: 'E-commerce Platform', icon: 'ecommerce', type: 'panel', target: 'ecommerce' },
        //{ id: 'project_spa', label: 'SPA: Teknolojik yemekler', icon: 'project_spa', type: 'panel', target: 'project_spa' },
      ],
    },
    {
      id: 'photo',
      label: 'Photo',
      icon: 'photos.svg',
      items: [
        {
          id: 'photo_playlists',
          label: 'Playlists',
          icon: 'playlist.svg',
          type: 'sublist',
          emptyMessage: 'There are no photos.',
          children: [
            { id: 'photo_new_playlist', label: 'Create New Playlist', icon: 'playlist.svg', type: 'disabled' },
          ],
        },
      ],
    },
    {
      id: 'music',
      label: 'Music',
      icon: 'musics.svg',
      items: [
        {
          id: 'music_playlists',
          label: 'Playlists',
          icon: 'playlist.svg',
          type: 'sublist',
          emptyMessage: 'There are no tracks.',
          children: [
            { id: 'music_new_playlist', label: 'Create New Playlist', icon: 'playlist.svg', type: 'disabled' },
          ],
        },
      ],
    },
    {
      id: 'video',
      label: 'Video',
      icon: 'video.svg',
      items: [
        {
          id: 'video_folder',
          label: 'Video',
          icon: 'folder.svg',
          type: 'sublist',
          emptyMessage: 'There are no videos.',
          children: [
            { id: 'video_new_folder', label: 'Create New Folder', icon: 'folder.svg', type: 'disabled' },
          ],
        },
      ],
    },
    {
      id: 'work',
      label: 'Projects',
      icon: 'folder.svg',
      items: [
        { id: 'projects', label: 'Projects', icon: 'trophy.svg', type: 'panel', target: 'projects' },
        { id: 'project_portfolio', label: 'Portfolio', icon: 'trophy.svg', type: 'panel', target: 'project_portfolio' },
        { id: 'project_ecommerce', label: 'E-commerce Platform', icon: 'trophy.svg', type: 'panel', target: 'project_ecommerce' },
        { id: 'project_spa', label: 'SPA: Teknolojik yemekler', icon: 'trophy.svg', type: 'panel', target: 'project_spa' },
      ],
    },
    {
      id: 'game',
      label: 'Game',
      icon: 'game.svg',
      items: [
        { id: 'doom', label: 'Doom', icon: 'cd.svg', type: 'game', target: 'doom' },
      ],
    },

  ],
};

/**
 * Panel kayıtları. Her panelin nasıl görüneceği burada.
 * Item'lardan bağımsız: ileride bir paneli XMB dışından da
 * açmak isteyebilirsin (URL, başka bir panelin içinden vs).
 *
 * @typedef {'fullscreen' | 'sidebar'} PanelMode
 */
export const PANELS = {
  about: {
    label: 'Hakkımda',
    mode: 'fullscreen',
    keyboardHints: [{ key: '↑↓', action: 'Scroll' }],
    gamepadHints: [{ key: '↑↓', action: 'Scroll' }],
  },
  cv: {
    label: 'CV',
    mode: 'fullscreen',
    keyboardHints: [
      { key: '↑↓', action: 'Scroll' },
      { key: 'Enter', action: 'İndir' },
    ],
    gamepadHints: [
      { key: '↑↓', action: 'Scroll' },
      { key: '✕', action: 'İndir' },
    ],
  },
  projects: {
    label: 'Projects',
    mode: 'fullscreen',
    keyboardHints: [
      { key: '↑↓', action: 'Seç' },
      { key: 'Enter', action: 'Aç' },
    ],
    gamepadHints: [
      { key: '↑↓', action: 'Seç' },
      { key: '✕', action: 'Aç' },
    ],
  },
  project_portfolio: {
    label: 'Portfolio',
    mode: 'fullscreen',
    keyboardHints: [
      { key: 'Q', action: 'Github' },
      { key: 'E', action: 'Website' },
    ],
    gamepadHints: [
      { key: '□', action: 'Github' },
      { key: '△', action: 'Website' },
    ],
  },
  project_ecommerce: {
    label: 'E-commerce Platform',
    mode: 'fullscreen',
    keyboardHints: [
      { key: 'Q', action: 'Github' },
      { key: 'E', action: 'Website' },
    ],
    gamepadHints: [
      { key: '□', action: 'Github' },
      { key: '△', action: 'Website' },
    ],
  },
  project_spa: {
    label: 'SPA: Teknolojik yemekler',
    mode: 'fullscreen',
    keyboardHints: [
      { key: 'Q', action: 'Github' },
      { key: 'E', action: 'Website' },
    ],
    gamepadHints: [
      { key: '□', action: 'Github' },
      { key: '△', action: 'Website' },
    ],
  },
  systemSettings: {
    label: 'System Settings',
    mode: 'sidebar',
    keyboardHints: [
      { key: '↑↓', action: 'Seç' },
      { key: '←→', action: 'Değiştir' },
    ],
    gamepadHints: [
      { key: '↑↓', action: 'Seç' },
      { key: '←→', action: 'Değiştir' },
    ],
  },
  themeSettings: {
    label: 'Theme Settings',
    mode: 'sidebar',
    keyboardHints: [
      { key: '↑↓', action: 'Seç' },
      { key: 'Enter', action: 'Uygula' },
    ],
    gamepadHints: [
      { key: '↑↓', action: 'Seç' },
      { key: '✕', action: 'Uygula' },
    ],
  },
  doom: {
    label: 'Doom',
    mode: 'fullscreen',
    // Panel tüm girdiyi devralır: XMB navigasyonu ve gamepad köprüsü susar,
    // Escape dahil her tuş Doom'a gider. Kapatma bu yüzden ayrı bir tuşta.
    capturesInput: true,
    closeKey: { keyboard: 'F10', gamepad: 'OPTIONS' },
    keyboardHints: [
      { key: '↑↓←→', action: 'Hareket' },
      { key: 'Ctrl', action: 'Ateş' },
      { key: 'Space', action: 'Kullan' },
      { key: 'Esc', action: 'Menü' },
    ],
    gamepadHints: [
      { key: '↑↓←→', action: 'Hareket' },
      { key: '✕', action: 'Ateş' },
      { key: '□', action: 'Kullan' },
      { key: '○', action: 'Menü' },
    ],
  },
};
/**
 * Sublist öğelerine id ile doğrudan erişim. Reducer'lar ve girdi hook'ları
 * kategorileri gezmek zorunda kalmasın diye modül seviyesinde bir kez kuruluyor.
 * PANELS[id] ile aynı mantık: arama değil, doğrudan lookup.
 */
export const SUBLIST_ITEMS = Object.fromEntries(
  xmbData.categories
    .flatMap((category) => category.items)
    .filter((item) => item.type === 'sublist')
    .map((item) => [item.id, item])
);
