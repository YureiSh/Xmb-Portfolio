import { playNavigate } from "../audio/sounds";

const NAV_ACTIONS = [
    'xmb/moveCategoryLeft',
    'xmb/moveCategoryRight',
    'xmb/moveItemUp',
    'xmb/moveItemDown',
];

export const audioMiddleware = (store) => (next) => (action) => {
    if (!NAV_ACTIONS.includes(action.type)) return next(action);

    const before = store.getState().xmb;
    const result = next(action);
    const after = store.getState().xmb;

    const moved =
        before.activeCategoryIndex !== after.activeCategoryIndex ||
        before.itemIndexByCategory !== after.itemIndexByCategory;

    if (moved) playNavigate();

    return result;
};