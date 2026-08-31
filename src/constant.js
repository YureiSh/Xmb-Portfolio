/**
 * XMB içerik veri modeli.
 *
 * Her kategori yatay eksende bir ikon. Her kategorinin `items` dizisi
 * o kategori seçiliyken dikeyde gezinilen öğeler.
 *
 * @typedef {'panel' | 'game' | 'external'} XmbItemType
 * - 'panel'    → openPanelById(panelId) tetiklenir, panel component'i açılır
 * - 'game'     → WASM oyunu panel içine gömülü açılır (Hafta 5)
 * - 'external' → yeni sekmede bir linke gider (ör. GitHub, LinkedIn)
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
      label: 'Profil',
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
        { id: 'themeSetting', label: 'Theme Settings', icon: 'settings.svg', type: 'panel', target: 'themeSetting' },
        //{ id: 'portfolio', label: 'Portfolio', icon: 'portfolio', type: 'panel', target: 'portfolio' },
        //{ id: 'ecommerce', label: 'E-commerce Platform', icon: 'ecommerce', type: 'panel', target: 'ecommerce' },
        //{ id: 'spa', label: 'SPA: Teknolojik yemekler', icon: 'spa', type: 'panel', target: 'spa' },
      ],
    },
    {
      id: 'photo',
      label: 'Photo',
      icon: 'photos.svg',
      items: [
        { id: 'photo_playlists', label: 'Playlists', icon: 'playlist.svg', type: 'panel', target: 'photo_playlists' },
      ],
    },
    {
      id: 'music',
      label: 'Music',
      icon: 'musics.svg',
      items: [
        { id: 'music_playlists', label: 'Playlists', icon: 'playlist.svg', type: 'panel', target: 'music_playlists' },
      ],
    },
    {
      id: 'video',
      label: 'Video',
      icon: 'video.svg',
      items: [
        { id: 'video_folder', label: 'Video', icon: 'folder.svg', type: 'panel', target: 'video_folder' },
      ],
    },
    {
      id: 'work',
      label: 'Projeler',
      icon: 'folder.svg',
      items: [
        { id: 'projects', label: 'Projeler', icon: 'trophy.svg', type: 'panel', target: 'projects' },
        { id: 'portfolio', label: 'Portfolio', icon: 'trophy.svg', type: 'panel', target: 'portfolio' },
        { id: 'ecommerce', label: 'E-commerce Platform', icon: 'trophy.svg', type: 'panel', target: 'ecommerce' },
        { id: 'spa', label: 'SPA: Teknolojik yemekler', icon: 'trophy.svg', type: 'panel', target: 'spa' },
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
  about: { label: 'Hakkımda', mode: 'fullscreen' },
  cv: { label: 'CV', mode: 'fullscreen' },
  projects: { label: 'Projeler', mode: 'fullscreen' },
  portfolio: { label: 'Portfolio', mode: 'fullscreen' },
  ecommerce: { label: 'E-commerce Platform', mode: 'fullscreen' },
  spa: { label: 'SPA: Teknolojik yemekler', mode: 'fullscreen' },
  systemSettings: { label: 'System Settings', mode: 'sidebar' },
  themeSetting: { label: 'Theme Settings', mode: 'sidebar' },
  doom: { label: 'Doom', mode: 'fullscreen' },
};