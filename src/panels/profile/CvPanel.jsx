import { usePanelScroll } from '../../hooks/usePanelScroll';

function CvPanel() {
    const scrollRef = usePanelScroll();

    return (
        <div ref={scrollRef} className="flex flex-col gap-4 w-full max-w-3xl h-full min-h-0">
            <div className="flex items-center justify-center">
                <a
                    href="/cv.pdf"
                    download="Enis_Ata_Erkol_CV.pdf"
                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-md bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                    >
                        <path d="M12 3v12" />
                        <path d="m7 10 5 5 5-5" />
                        <path d="M5 21h14" />
                    </svg>
                    İndir
                </a>
            </div>

            <div className="flex-1 min-h-0 rounded-md overflow-hidden border border-white/10">
                <iframe
                    src="/cv.pdf"
                    title="Enis Ata Erkol CV"
                    className="w-full h-full"
                />
            </div>
        </div>
    );
}
export default CvPanel;