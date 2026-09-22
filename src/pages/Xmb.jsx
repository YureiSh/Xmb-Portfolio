import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import gsap from 'gsap';
import {
  selectActiveCategoryIndex,
  selectActiveItemIndex,
  selectOpenPanel,
  selectBootPhase,
  selectSubList,
  setActiveCategoryIndex,
  setItemIndex,
  setSubListIndex,
} from '../store/slices/xmbSlice';
import { xmbData, SUBLIST_ITEMS } from '../constant';
import { useXmbInput, activateItem } from '../hooks/useXmbInput';
import { createXmbCanvas } from '../background/xmbCanvas';
import '../Xmb.css';
import { Panel } from '../components/Panel';
import PressStartGate from '../components/PressStartGate';
import BootSequence from '../components/BootSequence';
import { useGamepadInput } from '../hooks/useGamepadInput';
import { useSwipeInput } from '../hooks/useSwipeInput';
import { useIsCompact } from '../hooks/useIsCompact';

const CATEGORY_SPACING = 100;

const CATEGORY_ANCHOR_X = 0;
const ITEM_ANCHOR_Y = 40;

const ITEM_SPACING_COMPACT = 70;   // item'ların birbirine olan normal mesafesi
const ACTIVE_GAP_EXTRA = 70;       // aktifin hemen komşularına eklenen ekstra boşluk

const SUBLIST_SHIFT_X = -120;       
const SUBLIST_COLUMN_X = 120;

const SUBLIST_ITEM_SPACING = 56;     
const SUBLIST_ANCHOR_Y = ITEM_ANCHOR_Y; 

const DIMMED_CATEGORY_OPACITY = 0.06;
const IDLE_CATEGORY_OPACITY = 0.9; 

function getItemOffset(index, activeIndex) {
  const base = index * ITEM_SPACING_COMPACT;
  if (index < activeIndex) return base - ACTIVE_GAP_EXTRA;
  if (index > activeIndex) return base + ACTIVE_GAP_EXTRA;
  return base; // aktifin kendisi — referans nokta, extra almaz
}

export function Xmb() {
  useXmbInput();
  useGamepadInput();
  useSwipeInput();

  const dispatch = useDispatch();
  const isCompact = useIsCompact();
  const activeCategoryIndex = useSelector(selectActiveCategoryIndex);
  const activeItemIndex = useSelector(selectActiveItemIndex);
  const openPanel = useSelector(selectOpenPanel);
  const bootPhase = useSelector(selectBootPhase);
  const subList = useSelector(selectSubList);

  const subListItem = subList ? SUBLIST_ITEMS[subList.itemId] : null;

  const canNavigate = !openPanel && !subList && bootPhase === 'ready';

  function handleCategoryClick(categoryIndex) {
    if (!canNavigate) return;
    dispatch(setActiveCategoryIndex(categoryIndex));
  }


  function handleItemClick(item, itemIndex) {
    if (!canNavigate) return;
    if (itemIndex !== activeItemIndex) {
      dispatch(setItemIndex({ categoryIndex: activeCategoryIndex, itemIndex }));
      return;
    }
    activateItem(item, dispatch);
  }


  const canvasRef = useRef(null);
  const categoriesTrackRef = useRef(null);
  const categoryElsRef = useRef([]);
  const itemsTrackRef = useRef(null);
  const subListRef = useRef(null);
  const prevCategoryIndexRef = useRef(activeCategoryIndex);

  // --- WebGL dalga arkaplanı ---
  useEffect(() => {
    const instance = createXmbCanvas(canvasRef.current);
    return () => instance.destroy();
  }, []);

  // --- Yatay: kategori kayması ---
  useEffect(() => {
    const targetX = CATEGORY_ANCHOR_X - activeCategoryIndex * CATEGORY_SPACING;
    gsap.to(categoriesTrackRef.current, {
      x: targetX,
      duration: 0.4,
      ease: 'power2.out',
    });
  }, [activeCategoryIndex]);

  // --- Dikey: öğe kayması ---
  useEffect(() => {
    const targetY = ITEM_ANCHOR_Y - getItemOffset(activeItemIndex, activeItemIndex);
    const categoryJustChanged =
      prevCategoryIndexRef.current !== activeCategoryIndex;

    if (categoryJustChanged) {
      gsap.set(itemsTrackRef.current, { y: targetY });
      prevCategoryIndexRef.current = activeCategoryIndex;
    } else {
      gsap.to(itemsTrackRef.current, {
        y: targetY,
        duration: 0.35,
        ease: 'power2.out',
      });
    }
  }, [activeItemIndex, activeCategoryIndex]);

  // --- Sublist: aktif kategori + öğe listesi sola kayar, diğer kategoriler
  //     yerinde kalıp neredeyse görünmez olur. Kategori rayının kendi x'i
  //     (yukarıdaki effect) ayrı elemanda olduğu için iki dönüşüm çakışmıyor.
  useEffect(() => {
    const isOpen = Boolean(subList);
    const categoryEls = categoryElsRef.current;
    const activeEl = categoryEls[activeCategoryIndex];
    const otherEls = categoryEls.filter((el, i) => el && i !== activeCategoryIndex);

    gsap.to([activeEl, itemsTrackRef.current].filter(Boolean), {
      x: isOpen ? SUBLIST_SHIFT_X : 0,
      duration: 0.4,
      ease: 'power2.out',
    });

    if (!otherEls.length) return;

    gsap.to(otherEls, {
      opacity: isOpen ? DIMMED_CATEGORY_OPACITY : IDLE_CATEGORY_OPACITY,
      duration: 0.4,
      ease: 'power2.out',
      // Kapanışta inline opacity'yi bırakmak, aktif kategori değişince
      // CSS'in devralıp doğru değeri vermesini engellerdi.
      onComplete: isOpen ? undefined : () => gsap.set(otherEls, { clearProps: 'opacity' }),
    });
  }, [subList, activeCategoryIndex]);

  // Sublist sütununun girişi. itemId'ye bağlı: aynı sublist içinde
  // yukarı/aşağı gezinirken tekrar oynamasın.
  useEffect(() => {
    if (!subListRef.current) return;
    gsap.fromTo(
      subListRef.current,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
    );
  }, [subList?.itemId]);

  // Sublist dikey kayması: seçili satır sabit noktada kalsın.
  useEffect(() => {
    if (!subListRef.current || !subList) return;
    gsap.to(subListRef.current, {
      y: SUBLIST_ANCHOR_Y - subList.index * SUBLIST_ITEM_SPACING,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [subList]);

  // Aktif olmayan satıra dokunmak onu seçer, aktif olana dokunmak çalıştırır —
  // ana listedeki iki dokunuşluk akışın aynısı.
  function handleSubItemClick(child, childIndex) {
    if (!subList) return;
    if (childIndex !== subList.index) {
      dispatch(setSubListIndex(childIndex));
      return;
    }
    activateItem(child, dispatch);
  }

  return (
    <div className={isCompact ? 'xmb xmb--compact' : 'xmb'}>
      
      <PressStartGate/> {/* */}
      <BootSequence />
      <canvas className="canvas" ref={canvasRef} />
      <Panel />
      <div className="xmb__categories-viewport">
        <div className="xmb__categories-track" ref={categoriesTrackRef}> 
          {xmbData.categories.map((category, categoryIndex) => (
            <div
              key={category.id}
              ref={(el) => { categoryElsRef.current[categoryIndex] = el; }}
              className={
                categoryIndex === activeCategoryIndex
                  ? 'xmb__category xmb__category--active'
                  : 'xmb__category'
              }
              style={{ left: categoryIndex * CATEGORY_SPACING }}
              onClick={() => handleCategoryClick(categoryIndex)}
            >
              <div className='flex flex-col justify-center items-center max-w-12 max-h-12'>
                {category.icon ? <img className='max-w-12 max-h-12' src={`/icons/${category.icon}`} alt={category.icon} height={48} width={48} /> : null}
                {categoryIndex === activeCategoryIndex ? <p className='text-[16px]' >{category.label}</p> : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="xmb__items-viewport">
        <div className="xmb__items-track" ref={itemsTrackRef}>
          {xmbData.categories[activeCategoryIndex].items.map((item, itemIndex) => (
            <div
              key={item.id}
              className={
                itemIndex === activeItemIndex
                  ? 'xmb__item--active'
                  : 'xmb__item'
              }
              style={{ top: getItemOffset(itemIndex, activeItemIndex) }}
              onClick={() => handleItemClick(item, itemIndex)}
            >
              <div className='flex flex-row gap-4 justify-start items-center max-w-64 max-h-12'>
                <img className={itemIndex === activeItemIndex ? 'scale-125 max-w-12 max-h-12' : 'max-w-12 max-h-12' } src={`/icons/${item.icon}`} alt={item.icon} height={48} width={48} />
                <p>{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sublist sütunu öğe rayının D I Ş I N D A: ray sola kayarken
            bu sütun boşalan alanda yerinde duruyor. */}
        {subListItem ? (
          <div
            className="xmb__sublist"
            ref={subListRef}
            style={{ left: SUBLIST_COLUMN_X }}
          >
            {subListItem.children.map((child, childIndex) => {
              const classes = ['xmb__subitem'];
              if (childIndex === subList.index) classes.push('xmb__subitem--active');
              if (child.type === 'disabled') classes.push('xmb__subitem--disabled');

              return (
                <div
                  key={child.id}
                  className={classes.join(' ')}
                  style={{ top: childIndex * SUBLIST_ITEM_SPACING }}
                  onClick={() => handleSubItemClick(child, childIndex)}
                >
                  <div className="flex flex-row gap-4 justify-start items-center max-w-64 max-h-12">
                    <img
                      className="max-w-10 max-h-10"
                      src={`/icons/${child.icon}`}
                      alt={child.icon}
                      height={40}
                      width={40}
                    />
                    <p>{child.label}</p>
                  </div>
                </div>
              );
            })}

            {/* PS3 boş bir klasörde bunu yazardı — kategori boş değil, içeriği yok. */}
            {subListItem.emptyMessage ? (
              <p
                className="xmb__sublist-empty"
                style={{ top: subListItem.children.length * SUBLIST_ITEM_SPACING }}
              >
                {subListItem.emptyMessage}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}