import { useEffect, useRef } from 'react';
import { useDispatch, useStore } from 'react-redux';
import {
  moveCategoryLeft,
  moveCategoryRight,
  moveItemUp,
  moveItemDown,
  openPanelById,
  closePanel,
  openSubList,
  closeSubList,
  moveSubListUp,
  moveSubListDown,
  isInputCaptured,
} from '../store/slices/xmbSlice';
import { xmbData, SUBLIST_ITEMS } from '../constant';

const REPEAT_DELAY = 400;
const REPEAT_RATE = 120;

// Bir öğeyi "seçer". Klavyedeki Enter da, dokunmatikteki tıklama da (Xmb.jsx)
// buradan geçer; öğe türüne göre ne olacağı tek yerde.
export function activateItem(item, dispatch) {
  if (!item) return;

  // Bilinçli olarak işlevsiz öğe: tıklanır ama hiçbir şey olmaz.
  // CSS'te soluk duruyor, yani bozuk değil — kullanılamıyor.
  if (item.type === 'disabled') return;

  if (item.type === 'sublist') {
    dispatch(openSubList(item.id));
  } else if (item.type === 'panel' || item.type === 'game') {
    dispatch(openPanelById(item.target ?? item.id));
  } else if (item.type === 'external' && item.target) {
    // Redux'a hiç girmiyor: sayfadan çıkmak state değişikliği değil.
    window.open(item.target, '_blank', 'noopener,noreferrer');
  }
}

export function useXmbInput() {
  const dispatch = useDispatch();
  const store = useStore();

  const timersRef = useRef({});

  useEffect(() => {

    const inSubList = () => Boolean(store.getState().xmb.subList);
    const repeatableMap = {
      ArrowLeft: () =>
        inSubList() ? dispatch(closeSubList()) : dispatch(moveCategoryLeft()),
      ArrowRight: () =>
        inSubList() ? dispatch(closeSubList()) : dispatch(moveCategoryRight()),
      ArrowUp: () =>
        inSubList() ? dispatch(moveSubListUp()) : dispatch(moveItemUp()),
      ArrowDown: () =>
        inSubList() ? dispatch(moveSubListDown()) : dispatch(moveItemDown()),
    };

    function activateCurrentItem() {
      const state = store.getState().xmb;
      if (state.openPanel || state.bootPhase !== 'ready') return;

      // Sublist açıksa Enter oradaki satıra ait.
      if (state.subList) {
        const parent = SUBLIST_ITEMS[state.subList.itemId];
        activateItem(parent?.children?.[state.subList.index], dispatch);
        return;
      }

      const categoryIndex = state.activeCategoryIndex;
      const itemIndex = state.itemIndexByCategory[categoryIndex];
      activateItem(xmbData.categories[categoryIndex]?.items[itemIndex], dispatch);
    }

    // Panel sublist'in içinden de açılabilir, o yüzden önce panel kapanır.
    function goBack() {
      const state = store.getState().xmb;
      if (state.openPanel) {
        dispatch(closePanel());
        return;
      }
      if (state.subList) dispatch(closeSubList());
    }

    // Tek atışlık tuşlar (basılı tutmak tekrar etmemeli)
    const oneShotMap = {
      Enter: activateCurrentItem,
      ' ': activateCurrentItem,      // Space
      Escape: goBack,
      Backspace: goBack,
    };

    function clearKeyTimers(key) {
      const timers = timersRef.current[key];
      if (!timers) return;
      clearTimeout(timers.delayTimeout);
      clearInterval(timers.intervalId);
      delete timersRef.current[key];
    }

    const handleKeyDown = (e) => {
      const key = e.key;

      // Bir panel girdiyi devraldıysa (Doom) hiçbir tuşa dokunmuyoruz —
      // preventDefault bile etmiyoruz ki ok tuşları/Escape oyuna ulaşsın.
      if (isInputCaptured(store.getState().xmb)) return;

      if (oneShotMap[key]) {
        e.preventDefault();
        if (e.repeat) return;
        oneShotMap[key]();
        return;
      }

      if (!repeatableMap[key]) return;
      e.preventDefault();
      if (e.repeat) return;

      clearKeyTimers(key);
      repeatableMap[key]();
      //playNavigate();

      const delayTimeout = setTimeout(() => {
        const intervalId = setInterval(() => {
          repeatableMap[key]();
          //playNavigate();
        }, REPEAT_RATE);
        timersRef.current[key] = { delayTimeout, intervalId };
      }, REPEAT_DELAY);

      timersRef.current[key] = { delayTimeout, intervalId: null };
    };

    const handleKeyUp = (e) => {
      clearKeyTimers(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      Object.keys(timersRef.current).forEach(clearKeyTimers);
    };
  }, [dispatch, store]);
}