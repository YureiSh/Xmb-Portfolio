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
      icon: 'user',
      items: [
        { id: 'about', label: 'Hakkımda', icon: 'about', type: 'panel', target: 'about' },
        { id: 'cv', label: 'CV', icon: 'cv', type: 'panel', target: 'cv' },
      ],
    },
    {
      id: 'work',
      label: 'Projeler',
      icon: 'folder',
      items: [
        { id: 'projects', label: 'Projeler', icon: 'projects', type: 'panel', target: 'projects' },
        { id: 'portfolio', label: 'Portfolio', icon: 'portfolio', type: 'panel', target: 'portfolio' },
        { id: 'ecommerce', label: 'E-commerce Platform', icon: 'ecommerce', type: 'panel', target: 'ecommerce' },
        { id: 'spa', label: 'SPA: Teknolojik yemekler', icon: 'spa', type: 'panel', target: 'spa' },
      ],
    },
    {
      id: 'game',
      label: 'Game',
      icon: 'folder',
      items: [
        { id: 'doom', label: 'Doom', icon: 'doom', type: 'game', target: 'doom' },
      ],
    },
    {
      id: 'system',
      label: 'Ayarlar',
      icon: 'settings',
      items: [
        { id: 'settings', label: 'Ayarlar', icon: 'settings', type: 'panel', target: 'settings' },
        { id: 'contact', label: 'İletişim', icon: 'contact', type: 'panel', target: 'contact' },
        { id: 'test', label: 'Test', icon: 'test', type: 'panel', target: 'test' },
      ],
    },

  ],
};