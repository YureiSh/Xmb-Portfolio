import { useEffect, useRef } from "react";

function ProjectEcommercePanel() {
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
        <h3 className="text-xl font-bold">E-commerce Platform</h3>
        <p className="text-sm opacity-70">Full Stack Dev. — React | Spring Boot</p>
      </div>

      <p className="leading-relaxed">
        Üyelik sistemi, ürün kataloğu ve sepetten sipariş tamamlamaya kadar
        uzanan alışveriş akışıyla tam çalışan bir e-ticaret platformu.
        Spring Boot REST API'si React tabanlı bir frontend'i besliyor,
        JWT tabanlı kimlik doğrulama ve rol yönetimiyle güvenlik sağlanıyor.
      </p>

      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold uppercase opacity-60">Tech Stack</h4>

        <div className="flex flex-wrap gap-2">
          {['React', 'Redux', 'Java', 'Spring Boot'].map((tech) => (
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
            Spring Boot REST API üzerinde JWT tabanlı kimlik doğrulama ve rol yönetimi
          </p>
          <p className="text-sm opacity-80">
            Ürün kataloğu, filtrelenebilir listeleme, adres/kart yönetimi ve uçtan uca sipariş oluşturma
          </p>
          <p className="text-sm opacity-80">
            PostgreSQL üzerinde veri katmanı
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        <a
          ref={githubLinkRef}
          href="https://github.com/YureiSh/e-commerce-project"
          target="_blank"
          rel="noreferrer"
          className="text-sm px-4 py-2 rounded-md bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 transition-colors"
        >
          GitHub
        </a>
        <a
          ref={websiteLinkRef}
          href="https://e-commerce-project-eae.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="text-sm px-4 py-2 rounded-md bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 transition-colors"
        >
          Website
        </a>
      </div >
    </div >
  );
}
export default ProjectEcommercePanel;