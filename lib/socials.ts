import { AiOutlineInstagram } from "react-icons/ai";
import { FaBluesky, FaXTwitter } from "react-icons/fa6";
import { RxLinkedinLogo } from "react-icons/rx";
import { FaFacebook, FaGithub, FaGlobe, FaTwitch, FaYoutube } from "react-icons/fa";
import { SiSubstack } from "react-icons/si";

export const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    x: FaXTwitter,
    instagram: AiOutlineInstagram,
    linkedin: RxLinkedinLogo,
    github: FaGithub,
    bluesky: FaBluesky,
    facebook: FaFacebook,
    youtube: FaYoutube,
    twitch: FaTwitch,
    substack: SiSubstack,
    website: FaGlobe,
};

export const AVAILABLE_PLATFORMS = Object.keys(ICON_MAP);