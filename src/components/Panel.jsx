import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { selectOpenPanel, closePanel } from '../store/slices/xmbSlice';
import { PANELS } from '../constant';
import '../Panel.css';
import { PANEL_COMPONENTS } from '../panels';

export function Panel() {
    const openPanel = useSelector(selectOpenPanel);
    const dispatch = useDispatch();

    const [mountedPanel, setMountedPanel] = useState(openPanel);

    const rootRef = useRef(null);
    const surfaceRef = useRef(null);
    const lastFocusedRef = useRef(null);

    const Content = mountedPanel ? PANEL_COMPONENTS[mountedPanel] : null;
    const isProject = mountedPanel && mountedPanel.startsWith('project_');

    useEffect(() => {
        if (openPanel) {
            lastFocusedRef.current = document.activeElement;
            setMountedPanel(openPanel);
            return;
        }

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

        rootRef.current?.focus();
    }, [mountedPanel, openPanel]);

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
            {!isSidebar && (
                <div className="panel__scrim" onClick={() => dispatch(closePanel())} />
            )}

            <div ref={surfaceRef} className="panel__surface">
                {isSidebar ? null :
                    <header className="panel__header">
                        <h2 className="panel__title">{title}</h2>
                    </header>
                }

                <div className={isSidebar ? "panel__body flex flex-col justify-center" : "panel__body flex flex-col justify-center items-center"}>
                    {Content ? <Content /> : <p>panelId: {mountedPanel}</p>}
                </div>

                {isSidebar ? null :
                    <div className='panel__bottom flex justify-center items-center gap-2'>
                        <p className='pt-2'>ESC Close</p>
                        {isProject ? <div className='flex justify-center items-center pt-2 gap-2'>
                            <p>Q Github </p>
                            <p>E Website </p>
                        </div> : null}
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