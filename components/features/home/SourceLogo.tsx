import { isStackOverflowSource } from "@/lib/content/sourceGuards";

interface SourceLogoProps {
  sourceName: string;
  size?: number;
  paddingOverride?: number;
}

type LogoConfig = {
  src: string;
  bg?: string;
  innerPadding?: number;
  iconColor?: string;
  noInvert?: boolean;
};

const SOURCE_LOGO: Record<string, LogoConfig> = {
  velog: { src: "/icons/sources/velog.svg" },
  naver_d2: { src: "/icons/sources/naver.svg", bg: "#03C75A", innerPadding: 6 },
  kakao_tech: {
    src: "/icons/sources/kakao.svg",
    bg: "#FEE500",
    innerPadding: 2,
  },
  toss_tech: { src: "/icons/sources/toss.png", noInvert: true },
  oliveyoung_tech: { src: "/icons/sources/oliveyoung.svg", noInvert: true },
  woowahan_tech: { src: "/icons/sources/woowahan_tech.png", bg: "#FFFFFF" },
  socar_tech: {
    src: "/icons/sources/socar_tech.png",
    bg: "#FFFFFF",
    innerPadding: 2,
  },
  skplanet_tech: { src: "/icons/sources/skplanet_tech.svg", bg: "#FFFFFF" },
  nongshim_cloud_tech: {
    src: "/icons/sources/nongshim_cloud_tech.png",
    bg: "#FFFFFF",
    innerPadding: 2,
  },
  kakaopay_tech: { src: "/icons/sources/kakaopay_tech.png", bg: "#FEE500" },
  meta_engineering: {
    src: "/icons/sources/meta_engineering.svg",
    bg: "#FFFFFF",
    iconColor: "#0668E1",
  },
  cloudflare_blog: { src: "/icons/sources/cloudflare_blog.svg", bg: "#FFFFFF" },
  github_blog: { src: "/icons/sources/github_blog.svg", bg: "#FFFFFF" },
  aws_korea_tech: { src: "/icons/sources/aws_korea_tech.svg", bg: "#FFFFFF" },
  ms_devblogs: {
    src: "/icons/sources/ms_devblogs.svg",
    bg: "#FFFFFF",
    innerPadding: 2,
  },
  nvidia_developer: {
    src: "/icons/sources/nvidia_developer.svg",
    bg: "#FFFFFF",
    iconColor: "#77B900",
  },
  grab_engineering: {
    src: "/icons/sources/grab_engineering.svg",
    bg: "#FFFFFF",
    iconColor: "#00983A",
  },
  google_developers: {
    src: "/icons/sources/google_developers.svg",
    bg: "#FFFFFF",
    innerPadding: 2,
  },
  spring_blog: { src: "/icons/sources/spring_blog.svg", bg: "#FFFFFF" },
  flex_tech: { src: "/icons/sources/flex_tech.jpg", bg: "#FFFFFF" },
  nextjs_blog: { src: "/icons/sources/nextjs_blog.svg", bg: "#FFFFFF" },
};

export function SourceLogo({ sourceName, size = 17, paddingOverride }: SourceLogoProps) {
  const key = sourceName.trim().toLowerCase();

  let config: LogoConfig | undefined;

  if (isStackOverflowSource(sourceName)) {
    config = { src: "/icons/sources/stackoverflow.svg" };
  } else if (key.startsWith("medium")) {
    config = { src: "/icons/sources/medium.svg" };
  } else {
    config = SOURCE_LOGO[key];
  }

  if (config) {
    const pad = paddingOverride !== undefined ? paddingOverride : (config.innerPadding ?? 0);
    const innerSize = size - pad * 2;
    return (
      <span
        className="flex shrink-0 items-center justify-center overflow-hidden rounded"
        style={{
          width: size,
          height: size,
          minWidth: size,
          backgroundColor: config.bg,
          padding: pad > 0 ? pad : undefined,
        }}
      >
        {config.iconColor ? (
          <span
            style={{
              width: innerSize,
              height: innerSize,
              minWidth: innerSize,
              display: "block",
              backgroundColor: config.iconColor,
              WebkitMaskImage: `url(${config.src})`,
              maskImage: `url(${config.src})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={config.src}
            alt={sourceName}
            width={innerSize}
            height={innerSize}
            className={!config.bg && !config.noInvert ? "dark:invert" : undefined}
            style={{ objectFit: "contain", display: "block" }}
          />
        )}
      </span>
    );
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-bold text-muted-foreground"
      style={{
        width: size,
        height: size,
        minWidth: size,
      }}
    >
      {sourceName.charAt(0).toUpperCase()}
    </span>
  );
}
