import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { selectOpenPanel, closePanel } from '../store/slices/xmbSlice';
import { PANELS } from '../constant';
import '../Panel.css';

/**
 * Panel kabuğu. İçerikleri Hafta 3 boyunca doldurulacak.
 *
 * Redux sadece "hangi panel açık" bilgisini tutar (openPanel).
 * Panelin fullscreen mi sidebar mı olduğu constant.js'teki PANELS
 * tablosundan gelir, animasyon tamamen GSAP'ın işi.
 */
export function Panel() {
    const openPanel = useSelector(selectOpenPanel);
    const dispatch = useDispatch();

    // React openPanel null olur olmaz component'i söker. Ama biz önce
    // kapanış animasyonunu oynatmak istiyoruz — o yüzden "şu an DOM'da
    // duran panel" ayrı bir state'te tutuluyor.
    const [mountedPanel, setMountedPanel] = useState(openPanel);

    const rootRef = useRef(null);
    const surfaceRef = useRef(null);
    // Panel kapanınca odağı geri vereceğimiz element.
    const lastFocusedRef = useRef(null);

    useEffect(() => {
        if (openPanel) {
            lastFocusedRef.current = document.activeElement;
            setMountedPanel(openPanel);
            return;
        }

        // Kapanış: animasyonu oynat, bitince DOM'dan söktür.
        if (!mountedPanel) return;
        const surface = surfaceRef.current;
        if (!surface) {
            setMountedPanel(null);
            return;
        }

        const mode = PANELS[mountedPanel]?.mode ?? 'fullscreen';
        const outVars =
            mode === 'sidebar'
                ? { xPercent: 100, opacity: 0 }
                : { opacity: 0, scale: 0.97 };

        const tween = gsap.to(surface, {
            ...outVars,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => setMountedPanel(null),
        });

        return () => tween.kill();
    }, [openPanel, mountedPanel]);

    // Açılış animasyonu + odak
    useEffect(() => {
        if (!mountedPanel || !openPanel) return;
        const surface = surfaceRef.current;
        if (!surface) return;

        const mode = PANELS[mountedPanel]?.mode ?? 'fullscreen';
        const fromVars =
            mode === 'sidebar'
                ? { xPercent: 100, opacity: 0 }
                : { opacity: 0, scale: 0.97 };

        gsap.fromTo(
            surface,
            fromVars,
            { xPercent: 0, opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
        );

        // Odağı panele taşı: ekran okuyucular ve Tab tuşu için gerekli.
        rootRef.current?.focus();
    }, [mountedPanel, openPanel]);

    // Panel kapanınca odağı geri ver.
    useEffect(() => {
        if (mountedPanel) return;
        lastFocusedRef.current?.focus?.();
        lastFocusedRef.current = null;
    }, [mountedPanel]);

    if (!mountedPanel) return null;

    const panel = PANELS[mountedPanel];
    const mode = panel?.mode ?? 'fullscreen';
    const isSidebar = mode === 'sidebar';
    const title = panel?.label ?? mountedPanel;

    return (
        <div
            ref={rootRef}
            className={`panel panel--${mode}`}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
        >
            {/* Fullscreen'de arkayı karartan katman. Sidebar'da yok: XMB
          arkada görünmeye devam etmeli. */}
            {!isSidebar && (
                <div className="panel__scrim" onClick={() => dispatch(closePanel())} />
            )}

            <div ref={surfaceRef} className="panel__surface">
                {isSidebar ? null :
                    <header className="panel__header">
                        <h2 className="panel__title">{title}</h2>
                    </header>
                }

                <div className={isSidebar ? "panel__body flex flex-col justify-center" :"panel__body flex flex-col justify-center items-center"}>
                    <p>Click ESC to close</p>
                    {/* İçerikler Salı'dan itibaren buraya. */}
                    <p>panelId: {mountedPanel}</p>
                </div>

                {isSidebar ? null :
                    <div className='panel__bottom flex justify-center items-center'>
                        <p className='pt-2'>ESC Close</p>
                    </div>
                }

            </div>
        </div>
    );
}

/*
    <button
        type="button"
        className="panel__close"
        onClick={() => dispatch(closePanel())}
    >
        Kapat (ESC)
    </button>
*/