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

const CATEGORY_SPACING = 100;
const ITEM_SPACING = 140;

const CATEGORY_ANCHOR_X = 0;
const ITEM_ANCHOR_Y = 40;

export function Xmb() {
  useXmbInput();

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
    const targetY = ITEM_ANCHOR_Y - activeItemIndex * ITEM_SPACING;
    const categoryJustChanged =
      prevCategoryIndexRef.current !== activeCategoryIndex;

    if (categoryJustChanged) {
      gsap.set(itemsTrackRef.current, { y: targetY });
      prevCategoryIndexRef.current = activeCategoryIndex;
    } else {
      gsap.to(itemsTrackRef.current, {
        y: targetY,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [activeItemIndex, activeCategoryIndex]);

  return (
    <div className="xmb">
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
                {category.icon ? <img src={`/icons/${category.icon}`} alt={category.icon} height={48} width={48} /> : null}
                <p className='text-[16px]'>{category.label}</p>
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
                  ? 'xmb__item xmb__item--active'
                  : 'xmb__item'
              }
              style={{ top: itemIndex * ITEM_SPACING }}
            >
              <div className='flex flex-row gap-4 justify-start items-center max-w-64 max-h-12'>
                <img src={`/icons/${item.icon}`} alt={item.icon} height={48} width={48} />
                <p>{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}