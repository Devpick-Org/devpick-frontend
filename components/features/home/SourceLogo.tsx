import { isStackOverflowSource } from "@/lib/content/sourceGuards";

interface SourceLogoProps {
  sourceName: string;
  size?: number;
}

type LogoConfig = {
  src: string;
  bg?: string;
  innerPadding?: number;
};

const SOURCE_LOGO: Record<string, LogoConfig> = {
  velog: { src: "/icons/sources/velog.svg" },
  naver_d2: { src: "/icons/sources/naver.svg", bg: "#03C75A", innerPadding: 2 },
  kakao_tech: { src: "/icons/sources/kakao.svg", bg: "#FEE500", innerPadding: 2 },
  toss_tech: { src: "/icons/sources/toss.png" },
  oliveyoung_tech: { src: "/icons/sources/oliveyoung.svg" },
};

export function SourceLogo({ sourceName, size = 17 }: SourceLogoProps) {
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
    const pad = config.innerPadding ?? 0;
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.src}
          alt={sourceName}
          width={innerSize}
          height={innerSize}
          style={{ objectFit: "contain", display: "block" }}
        />
      </span>
    );
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-bold text-muted-foreground"
      style={{ width: size, height: size, minWidth: size }}
    >
      {sourceName.charAt(0).toUpperCase()}
    </span>
  );
}
