import { playNavigate, playSelect, playBack } from '../audio/sounds';

const NAV_ACTIONS = [
    'xmb/moveCategoryLeft',
    'xmb/moveCategoryRight',
    'xmb/moveItemUp',
    'xmb/moveItemDown',
    'xmb/moveSubListUp',
    'xmb/moveSubListDown',
];

export const audioMiddleware = (store) => (next) => (action) => {
    if (action.type === 'xmb/openPanelById' || action.type === 'xmb/openSubList') {
        playSelect();
        return next(action);
    }

    if (action.type === 'xmb/closePanel' || action.type === 'xmb/closeSubList') {
        playBack();
        return next(action);
    }

    if (!NAV_ACTIONS.includes(action.type)) return next(action);

    const before = store.getState().xmb;
    const result = next(action);
    const after = store.getState().xmb;

    // Immer referans eşitliği: clamp sınırında state değişmez, ses de çalmaz.
    const moved =
        before.activeCategoryIndex !== after.activeCategoryIndex ||
        before.itemIndexByCategory !== after.itemIndexByCategory ||
        before.subList !== after.subList;

    if (moved) playNavigate();

    return result;
};