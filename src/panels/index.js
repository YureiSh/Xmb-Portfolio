// Paneller, XMB'de bağlı oldukları kategoriye (xmbData.categories[].id) göre
// klasörlenmiştir: profile/ settings/ photo/ music/ video/ work/ game/
import DoomPanel from "./game/DoomPanel";
import MusicPlaylistsPanel from "./music/MusicPlaylistsPanel";
import PhotoPlaylistsPanel from "./photo/PhotoPlaylistsPanel";
import AboutPanel from "./profile/AboutPanel";
import CvPanel from "./profile/CvPanel";
import SystemSettingsPanel from "./settings/SystemSettingsPanel";
import ThemeSettingPanel from "./settings/ThemeSettingPanel";
import VideoFolderPanel from "./video/VideoFolderPanel";
import ProjectEcommercePanel from "./work/ProjectEcommercePanel";
import ProjectPortfolioPanel from "./work/ProjectPortfolioPanel";
import ProjectsPanel from "./work/ProjectsPanel";
import ProjectSpaPanel from "./work/ProjectSpaPanel";

export const PANEL_COMPONENTS = {
// profile
about: AboutPanel,
cv: CvPanel,
// settings
systemSettings: SystemSettingsPanel,
themeSettings: ThemeSettingPanel,
// photo / music / video
photo_playlists: PhotoPlaylistsPanel,
music_playlists: MusicPlaylistsPanel,
video_folder: VideoFolderPanel,
// work
projects: ProjectsPanel,
project_portfolio: ProjectPortfolioPanel,
project_ecommerce: ProjectEcommercePanel,
project_spa: ProjectSpaPanel,
// game
doom: DoomPanel,

};
