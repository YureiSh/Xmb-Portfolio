import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import gsap from 'gsap';
import {
  selectActiveCategoryIndex,
  selectActiveItemIndex,
} from '../store/slices/xmbSlice';
import { xmbData } from '../constant';
import { useXmbInput } from '../hooks/useXmbInput';
import { createXmbCanvas } from '../background/xmbCanvas';
import '../Xmb.css';
import { Panel } from '../components/Panel';
import PressStartGate from '../components/PressStartGate';
import BootSequence from '../components/BootSequence';
import { useGamepadInput } from '../hooks/useGamepadInput';

const CATEGORY_SPACING = 100;

const CATEGORY_ANCHOR_X = 0;
const ITEM_ANCHOR_Y = 40;

const ITEM_SPACING_COMPACT = 70;   // item'ların birbirine olan normal mesafesi
const ACTIVE_GAP_EXTRA = 70;       // aktifin hemen komşularına eklenen ekstra boşluk

function getItemOffset(index, activeIndex) {
  const base = index * ITEM_SPACING_COMPACT;
  if (index < activeIndex) return base - ACTIVE_GAP_EXTRA;
  if (index > activeIndex) return base + ACTIVE_GAP_EXTRA;
  return base; // aktifin kendisi — referans nokta, extra almaz
}

export function Xmb() {
  useXmbInput();
  useGamepadInput();

  const activeCategoryIndex = useSelector(selectActiveCategoryIndex);
  const activeItemIndex = useSelector(selectActiveItemIndex);

  const canvasRef = useRef(null);
  const categoriesTrackRef = useRef(null);
  const itemsTrackRef = useRef(null);
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

  return (
    <div className="xmb">
      
      <PressStartGate/> {/* */}
      <BootSequence />
      <canvas className="canvas" ref={canvasRef} />
      <Panel />
      <div className="xmb__categories-viewport">
        <div className="xmb__categories-track" ref={categoriesTrackRef}> 
          {xmbData.categories.map((category, categoryIndex) => (
            <div
              key={category.id}
              className={
                categoryIndex === activeCategoryIndex
                  ? 'xmb__category xmb__category--active'
                  : 'xmb__category'
              }
              style={{ left: categoryIndex * CATEGORY_SPACING }}
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
            >
              <div className='flex flex-row gap-4 justify-start items-center max-w-64 max-h-12'>
                <img className={itemIndex === activeItemIndex ? 'scale-125 max-w-12 max-h-12' : 'max-w-12 max-h-12' } src={`/icons/${item.icon}`} alt={item.icon} height={48} width={48} />
                <p>{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}