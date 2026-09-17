import { usePanelScroll } from '../../hooks/usePanelScroll';

function AboutPanel() {
    const scrollRef = usePanelScroll();

    return (
        <div ref={scrollRef} className="flex flex-col gap-8 w-full max-w-2xl overflow-y-auto">
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">Enis Ata Erkol</h3>
                <p className="text-sm opacity-70">Full Stack Developer | Software Engineer</p>
            </div>

            <p className="leading-relaxed">
                Elektrik-Elektronik Mühendisliği mezunuyum, Workintech'te 6 aylık
                yoğun bir Full-Stack Development programı tamamladım. Sürekli
                öğrenmeye, ekip çalışmasına ve mühendislik bakış açımı gerçek
                dünya problemlerine uygulamaya inanıyorum.
            </p>

            <div className="flex flex-col gap-3">
                <h4 className="text-sm font-semibold uppercase opacity-60">Skills</h4>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2 items-baseline">
                        <span className="text-sm font-medium w-20 shrink-0">Front End</span>
                        <span className="text-sm opacity-80 flex-1">
                            JavaScript, React.js, Hooks, Context API, Redux, Axios, Yup, Jest, Cypress, HTML, CSS, Tailwind CSS
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2 items-baseline">
                        <span className="text-sm font-medium w-20 shrink-0">Back End</span>
                        <span className="text-sm opacity-80 flex-1">
                            Java, OOP, Design Patterns, Spring Boot, Spring Data JPA, Spring Security, SQL, PostgreSQL, JUnit, Mockito, .NET
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2 items-baseline">
                        <span className="text-sm font-medium w-20 shrink-0">Diğer</span>
                        <span className="text-sm opacity-80 flex-1">
                            Algorithms, Debugging, Deployment, Problem Solving, Figma, Git
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h4 className="text-sm font-semibold uppercase opacity-60">Deneyim</h4>
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between gap-3">
                        <span className="text-sm font-medium">Jet Teknoloji — Full-stack Developer</span>
                        <span className="text-xs opacity-60 shrink-0 whitespace-nowrap">02/2025 - 11/2025</span>
                    </div>
                    <div className="flex justify-between gap-3">
                        <span className="text-sm font-medium">Magicorn — DevOps Intern</span>
                        <span className="text-xs opacity-60 shrink-0 whitespace-nowrap">06/2024 - 02/2025</span>
                    </div>
                    <div className="flex justify-between gap-3">
                        <span className="text-sm font-medium">University of Twente — Project Intern</span>
                        <span className="text-xs opacity-60 shrink-0 whitespace-nowrap">06/2023 - 09/2023</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-6">
                <div className="flex flex-col">
                    <span className="text-xs opacity-60">Konum</span>
                    <span className="text-sm">Küçükçekmece, İstanbul</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs opacity-60">Diller</span>
                    <span className="text-sm">English (Advanced), 日本語 (Beginner)</span>
                </div>
            </div>
        </div>
    );
}
export default AboutPanel;