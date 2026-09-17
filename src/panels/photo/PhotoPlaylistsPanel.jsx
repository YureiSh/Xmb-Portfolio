import { usePanelScroll } from '../../hooks/usePanelScroll';

function PhotoPlaylistsPanel() {
    const scrollRef = usePanelScroll();
    return (
        <div ref={scrollRef} className="flex flex-col gap-8 max-w-2xl pt-12">
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">Playlists</h3>
                <p className="text-sm opacity-70">Photo</p>
            </div>
        </div>
    );
}
export default PhotoPlaylistsPanel;
