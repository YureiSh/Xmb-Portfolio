import { useEffect, useRef } from 'react';

function ProjectPortfolioPanel() {
  const githubLinkRef = useRef(null);
  const websiteLinkRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.code === 'KeyQ') {
        e.preventDefault();
        githubLinkRef.current?.click();
      } else if (e.code === 'KeyE') {
        e.preventDefault();
        websiteLinkRef.current?.click();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col gap-8 max-w-2xl pt-12 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold">Portfolio</h3>
        <p className="text-sm opacity-70">Frontend — React | Tailwind | GSAP</p>
      </div>

      <p className="leading-relaxed">
        Kişisel portfolyo sitem. Tek sayfalık bir tanıtım: iki dilli (TR/EN) içerik,
        yenilemeye dayanıklı karanlık mod ve bölümler görünür alana girdikçe tetiklenen
        scroll animasyonları. Sayfadaki bütün metin tek bir sözlükten besleniyor, böylece
        dil değiştirmek bileşenlere hiç dokunmadan çalışıyor.
      </p>

      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold uppercase opacity-60">Tech Stack</h4>

        <div className="flex flex-wrap gap-2">
          {['React 19', 'Tailwind CSS 4', 'GSAP', 'ScrollTrigger', 'Context API', 'Axios', 'Vite'].map((tech) => (
            <span
              key={tech}
              className="text-sm px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold uppercase opacity-60">Mimari</h4>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2 items-baseline">
            <span className="text-sm font-medium w-24 shrink-0">Durum</span>
            <span className="text-sm opacity-80 flex-1">
              İki ayrı Context: <code>ThemeContext</code> karanlık modu, <code>LanguageContext</code> dili
              taşıyor. State ağacı bir kütüphaneye ihtiyaç duymayacak kadar küçük olduğu için Redux yok.
            </span>
          </div>
          <div className="flex flex-wrap gap-2 items-baseline">
            <span className="text-sm font-medium w-24 shrink-0">Kalıcılık</span>
            <span className="text-sm opacity-80 flex-1">
              Kendi yazdığım <code>useLocalStorage</code> hook'u tema tercihini localStorage'da
              tutuyor; okuma lazy initializer içinde, böylece ilk render doğru temayla geliyor.
            </span>
          </div>
          <div className="flex flex-wrap gap-2 items-baseline">
            <span className="text-sm font-medium w-24 shrink-0">Animasyon</span>
            <span className="text-sm opacity-80 flex-1">
              <code>useGSAP</code> + ScrollTrigger. Skills, Profile ve Projects bölümleri
              viewport'a girdikçe kendi timeline'larını çalıştırıyor.
            </span>
          </div>
          <div className="flex flex-wrap gap-2 items-baseline">
            <span className="text-sm font-medium w-24 shrink-0">İçerik</span>
            <span className="text-sm opacity-80 flex-1">
              <code>textData.js</code> içindeki TR/EN sözlüğü tüm kopyayı besliyor —
              bileşenlerin içinde gömülü metin yok.
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold uppercase opacity-60">Öne Çıkanlar</h4>
        <div className="flex flex-col gap-1">
          <p className="text-sm opacity-80">
            Tek tuşla TR/EN geçişi; çeviri sözlüğü tek kaynak olduğu için yeni bölüm eklemek metin kopyalamayı gerektirmiyor
          </p>
          <p className="text-sm opacity-80">
            localStorage'a yazılan karanlık mod — sekme kapanıp açılsa da tercih korunuyor
          </p>
          <p className="text-sm opacity-80">
            ScrollTrigger ile bölüm bazlı giriş animasyonları, mobil öncelikli responsive düzen
          </p>
          <p className="text-sm opacity-80">
            Vercel üzerinde SPA rewrite kuralıyla dağıtım
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        <a
          ref={githubLinkRef}
          href="https://github.com/YureiSh/portfolio"
          target="_blank"
          rel="noreferrer"
          className="text-sm px-4 py-2 rounded-md bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 transition-colors"
        >
          GitHub
        </a>
        <a
          ref={websiteLinkRef}
          href="https://portfolio-enis-ata.vercel.app"
          target="_blank"
          rel="noreferrer"
          className="text-sm px-4 py-2 rounded-md bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 transition-colors"
        >
          Website
        </a>
      </div>
    </div>
  );
}
export default ProjectPortfolioPanel;
