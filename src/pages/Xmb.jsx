import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import gsap from 'gsap';
import {
  selectActiveCategoryIndex,
  selectActiveItemIndex,
} from '../store/slices/xmbSlice';
import { xmbData } from '../constant';
import { useXmbInput } from '../hooks/useXmbInput';
import '../Xmb.css';

// biz sadece track'i kaydırıyoruz.
const CATEGORY_SPACING = 200; 
const ITEM_SPACING = 64; 

const CATEGORY_ANCHOR_X = 0;
const ITEM_ANCHOR_Y = 0;

export function Xmb() {
  useXmbInput();

  const activeCategoryIndex = useSelector(selectActiveCategoryIndex);
  const activeItemIndex = useSelector(selectActiveItemIndex);

  const categoriesTrackRef = useRef(null);
  const itemsTrackRef = useRef(null);

  // Kategori değiştiğinde items listesinin İÇERİĞİ tamamen değişiyor
  // (farklı kategorinin farklı öğeleri). Bu yüzden kategori değişimini
  // ayrıca izleyip, items track'ini o anlık ANİMASYONSUZ doğru yere
  // oturtuyoruz (gsap.set). Buraya set içinde bir delay konulabilir. 
  const prevCategoryIndexRef = useRef(activeCategoryIndex);

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
      // Farklı kategorinin öğe listesine geçtik: kaymadan, direkt oturt.
      gsap.set(itemsTrackRef.current, { y: targetY });
      prevCategoryIndexRef.current = activeCategoryIndex;
    } else {
      // Aynı kategori içinde yukarı/aşağı hareket: normal kaysın.
      gsap.to(itemsTrackRef.current, {
        y: targetY,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [activeItemIndex, activeCategoryIndex]);

  return (
    <div className="xmb">
      {/* Yatay eksen: kategoriler, sabit aralıklarla absolute konumlanmış */}
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
              {category.label}
            </div>
          ))}
        </div>
      </div>

      {/* Dikey eksen: SADECE aktif kategorinin öğeleri */}
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
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}