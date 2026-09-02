import { useEffect, useRef } from 'react';

function ProjectSpaPanel() {
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
    <div className="flex flex-col gap-8 max-w-2xl pt-12">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold">SPA — Teknolojik Yemekler</h3>
        <p className="text-sm opacity-70">Full Stack Developer — React | Node</p>
      </div>

      <p className="leading-relaxed">
        Teknolojik yemekler projemi kullanıcının belli sipariş seçenekleriyle
        yemek seçebildiği çoğaltılabilir bir site tasarımı ile tamamladım.
        Sayfamızın üzerinden pizza sipariş verip, belirli API call'u ile
        sipariş seçeneklerini ulaştırabiliriz.
      </p>

      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold uppercase opacity-60">Tech Stack</h4>

        <div className="flex flex-wrap gap-2">
          {['React', 'JS', 'Tailwind', 'REST-API'].map((tech) => (
            <span
              key={tech}
              className="text-sm px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold uppercase opacity-60">Öne Çıkanlar</h4>
        <div className="flex flex-col gap-1">
          <p className="text-sm opacity-80">
            Bootstrap ve React ile ölçeklenebilir bir yemek sipariş platformu
          </p>
          <p className="text-sm opacity-80">
            Kullanıcıların interaktif bir arayüz üzerinden pizza sipariş vermesi ve menü seçeneklerini özelleştirmesi
          </p>
          <p className="text-sm opacity-80">
            Menü verisini dinamik çekmek ve sipariş konfigürasyonlarını iletmek için RESTful API entegrasyonu
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        <a
          ref={websiteLinkRef}
          href="https://portfolio-enis-ata.vercel.app"
          target="_blank"
          rel="noreferrer"
          className="text-sm px-4 py-2 rounded-md bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 transition-colors"
        >
          View Site
        </a>
        <a
          ref={githubLinkRef}
          href="https://github.com/YureiSh/fsweb-s8-challenge-pizza"
          target="_blank"
          rel="noreferrer"
          className="text-sm px-4 py-2 rounded-md bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 transition-colors"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
export default ProjectSpaPanel;