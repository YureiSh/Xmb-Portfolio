import { useEffect, useRef } from 'react';
import { useDispatch, useStore } from 'react-redux';
import {
  moveCategoryLeft,
  moveCategoryRight,
  moveItemUp,
  moveItemDown,
  openPanelById,
  closePanel,
  isInputCaptured,
} from '../store/slices/xmbSlice';
import { xmbData } from '../constant';

const REPEAT_DELAY = 400;
const REPEAT_RATE = 120;

export function useXmbInput() {
  const dispatch = useDispatch();
  // useStore: state'i olay ANINDA okumak için. useSelector kullansaydık
  // her navigasyonda dependency değişir, listener'lar sürekli sökülüp
  // yeniden takılırdı.
  const store = useStore();

  const timersRef = useRef({});

  useEffect(() => {
    // Tekrarlanabilir tuşlar (basılı tutunca DAS/ARR ile tekrarlar)
    const repeatableMap = {
      ArrowLeft: () => dispatch(moveCategoryLeft()),
      ArrowRight: () => dispatch(moveCategoryRight()),
      ArrowUp: () => dispatch(moveItemUp()),
      ArrowDown: () => dispatch(moveItemDown()),
    };

    // Aktif item'ı seçer. Panel açıksa hiçbir şey yapmaz — panelin
    // kendi içindeki navigasyon panelin sorumluluğunda.
    function activateCurrentItem() {
      const state = store.getState().xmb;
      if (state.openPanel) return;

      const categoryIndex = state.activeCategoryIndex;
      const itemIndex = state.itemIndexByCategory[categoryIndex];
      const item = xmbData.categories[categoryIndex]?.items[itemIndex];
      if (!item) return;

      if (item.type === 'panel' || item.type === 'game') {
        dispatch(openPanelById(item.target ?? item.id));
      } else if (item.type === 'external' && item.target) {
        // Redux'a hiç girmiyor: sayfadan çıkmak state değişikliği değil.
        window.open(item.target, '_blank', 'noopener,noreferrer');
      }
    }

    function goBack() {
      const state = store.getState().xmb;
      if (state.openPanel) dispatch(closePanel());
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