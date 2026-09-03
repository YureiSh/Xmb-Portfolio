import { useLayoutEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import gsap from 'gsap';
import { selectBootPhase, setBootPhase } from '../store/slices/xmbSlice';

function BootSequence() {
    const dispatch = useDispatch();
    const bootPhase = useSelector(selectBootPhase);

    const overlayRef = useRef(null);
    const textRef = useRef(null);
    const textInnerRef = useRef(null);
    const timelineRef = useRef(null);
    const finishedRef = useRef(false);

    useLayoutEffect(() => {
        if (bootPhase !== 'boot-sequence') return;

        const categoriesViewport = document.querySelector('.xmb__categories-viewport');
        const itemsViewport = document.querySelector('.xmb__items-viewport');
        const categories = document.querySelectorAll('.xmb__category');

        gsap.set(overlayRef.current, { opacity: 1 });
        gsap.set(textRef.current, { opacity: 0, scale: 1.04 });
        gsap.set(textInnerRef.current, { clipPath: 'inset(0 100% 0 0)' });
        gsap.set([categoriesViewport, itemsViewport], { opacity: 0 });
        gsap.set(categories, { opacity: 0, y: 16 });

        function finish() {
            if (finishedRef.current) return;
            finishedRef.current = true;

            timelineRef.current?.kill();

            gsap.set(overlayRef.current, { opacity: 0 });
            gsap.set([categoriesViewport, itemsViewport], { opacity: 1 });
            gsap.set(categories, { opacity: 1, y: 0 });
            gsap.set(textInnerRef.current, { clipPath: 'inset(0 0% 0 0)' });

            dispatch(setBootPhase('ready'));
        }

        const tl = gsap.timeline({ onComplete: finish });
        timelineRef.current = tl;

        tl
            // Siyah perde kalkıyor, dalga ortaya çıkıyor
            .to(overlayRef.current, {
                opacity: 0,
                duration: 6,
                ease: 'power2.inOut',
            }, 0)

            // İsim beliriyor — perde açılırken
            .to(textRef.current, {
                opacity: 1,
                scale: 1,
                duration: 1.4,
                ease: 'power2.out',
            }, 2.6)

            // Soldan sağa açılıyor
            .to(textInnerRef.current, {
                clipPath: 'inset(0 0% 0 0)',
                duration: 0.6,
                ease: 'power2.out',
            }, 2.6)

            // İsim sönüyor — perde henüz tam kalkmadan
            .to(textRef.current, {
                opacity: 0,
                duration: 1.2,
                ease: 'power2.in',
            }, 3.6)

            // Kategori satırı giriyor
            .to(categoriesViewport, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
            }, 5.2)

            // İkonlar kademeli beliriyor
            .to(categories, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.07,
                ease: 'power2.out',
            }, '<')

            // Öğeler giriyor
            .to(itemsViewport, {
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out',
            }, '-=0.2');

        function handleKeyDown(e) {
            if (e.repeat) return;
            finish();
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', finish);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', finish);
            tl.kill();
        };
    }, [bootPhase, dispatch]);

    if (bootPhase !== 'boot-sequence') return null;

    return (
        <>
            <div
                ref={overlayRef}
                className="fixed inset-0 z-40 bg-black pointer-events-none"
            />

            <div
                ref={textRef}
                className="fixed inset-0 z-40 flex items-center justify-end pointer-events-none"
            >
                <div ref={textInnerRef} className="flex flex-col items-center gap-3">
                    <h1 className="text-white text-3xl font-light tracking-[0.35em]">
                        ENIS ATA ERKOL
                    </h1>
                    <p className="text-white/50 text-xs font-light tracking-[0.5em]">
                        PORTFOLIO
                    </p>
                </div>
            </div>
        </>
    );
}
export default BootSequence;