import Image from "next/image";
import type { IconType } from "react-icons";
import { FiDownload, FiGlobe } from "react-icons/fi";
import { SiGithub, SiX } from "react-icons/si";
import type { CategoryIconKey } from "@/data/categories";

type CategoryPreviewIconProps = {
  iconKey: CategoryIconKey;
};

type IconConfig =
  | {
      type: "react-icon";
      icon: IconType;
      iconClassName: string;
      wrapperClassName: string;
      lightClassName: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
      imageClassName: string;
      wrapperClassName: string;
      lightClassName: string;
    };

const iconMap: Record<CategoryIconKey, IconConfig> = {
  social: {
    type: "react-icon",
    icon: SiX,
    iconClassName: "h-[18px] w-[18px] text-zinc-100",
    wrapperClassName:
      "from-zinc-200/12 via-zinc-100/10 to-zinc-300/6 ring-white/12 bg-[#111214]",
    lightClassName: "category-preview-icon--social",
  },
  site: {
    type: "react-icon",
    icon: FiGlobe,
    iconClassName: "h-[18px] w-[18px] text-indigo-100",
    wrapperClassName:
      "from-indigo-500/18 via-indigo-400/12 to-blue-400/8 ring-indigo-300/16",
    lightClassName: "category-preview-icon--site",
  },
  github: {
    type: "react-icon",
    icon: SiGithub,
    iconClassName: "h-[19px] w-[19px] text-zinc-50",
    wrapperClassName:
      "from-zinc-300/12 via-zinc-200/10 to-zinc-100/6 ring-white/12 bg-[#17181c]",
    lightClassName: "category-preview-icon--github",
  },
  token: {
    type: "image",
    src: "/doge.svg",
    alt: "Dogecoin avatar",
    imageClassName: "h-[26px] w-[26px] rounded-full object-cover",
    wrapperClassName:
      "from-amber-300/18 via-yellow-200/12 to-orange-200/10 ring-amber-200/16 bg-[#2a2213]",
    lightClassName: "category-preview-icon--token",
  },
  app: {
    type: "react-icon",
    icon: FiDownload,
    iconClassName: "h-[18px] w-[18px] text-emerald-100",
    wrapperClassName:
      "from-emerald-500/18 via-teal-400/12 to-cyan-400/10 ring-emerald-400/16",
    lightClassName: "category-preview-icon--app",
  },
};

export function CategoryPreviewIcon({ iconKey }: CategoryPreviewIconProps) {
  const config = iconMap[iconKey];

  return (
    <span
      className={`category-preview-icon inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 ring-inset shadow-[0_10px_24px_rgba(0,0,0,0.16)] ${config.wrapperClassName} ${config.lightClassName}`}
    >
      {config.type === "react-icon" ? (
        <config.icon className={config.iconClassName} />
      ) : (
        <Image
          src={config.src}
          alt={config.alt}
          width={24}
          height={24}
          className={config.imageClassName}
        />
      )}
    </span>
  );
}
