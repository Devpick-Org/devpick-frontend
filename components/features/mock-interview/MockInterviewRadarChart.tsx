"use client";

import { cn } from "@/lib/utils";
import type { MockInterviewScores } from "@/lib/mock-interview/buildPlaceholderResult";

interface MockInterviewRadarChartProps {
  scores: MockInterviewScores;
  size?: number;
  className?: string;
}

const AXES: { key: keyof MockInterviewScores; label: string }[] = [
  { key: "framework", label: "프레임워크" },
  { key: "design", label: "설계/판단" },
  { key: "problemSolving", label: "문제 해결" },
  { key: "csInfra", label: "CS/인프라" },
  { key: "communication", label: "커뮤니케이션" },
];

export function MockInterviewRadarChart({
  scores,
  size = 280,
  className,
}: MockInterviewRadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 36;
  const angleFor = (index: number) =>
    (index / AXES.length) * Math.PI * 2 - Math.PI / 2;

  const ringValues = [25, 50, 75, 100];
  const ringPath = (value: number) =>
    AXES.map((_, i) => {
      const angle = angleFor(i);
      const r = (value / 100) * radius;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(" ");

  const dataPath = AXES.map((axis, i) => {
    const angle = angleFor(i);
    const value = scores[axis.key];
    const r = ((value ?? 0) / 100) * radius;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");

  return (
    <svg
      className={cn("text-muted-foreground", className)}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="모의면접 영역별 점수 레이더 차트"
    >
      {ringValues.map((v) => (
        <polygon
          key={v}
          points={ringPath(v)}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.18}
          strokeWidth={1}
        />
      ))}
      {AXES.map((axis, i) => {
        const angle = angleFor(i);
        return (
          <line
            key={axis.key}
            x1={cx}
            y1={cy}
            x2={cx + radius * Math.cos(angle)}
            y2={cy + radius * Math.sin(angle)}
            stroke="currentColor"
            strokeOpacity={0.18}
            strokeWidth={1}
          />
        );
      })}
      <polygon
        points={dataPath}
        fill="hsl(var(--primary))"
        fillOpacity={0.18}
        stroke="hsl(var(--primary))"
        strokeWidth={1.5}
      />
      {AXES.map((axis, i) => {
        const angle = angleFor(i);
        const x = cx + (radius + 18) * Math.cos(angle);
        const y = cy + (radius + 18) * Math.sin(angle);
        const value = scores[axis.key];
        const display = typeof value === "number" ? value : "—";
        return (
          <g key={axis.key}>
            <text
              x={x}
              y={y - 6}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fill="currentColor"
              fillOpacity={0.85}
            >
              {axis.label}
            </text>
            <text
              x={x}
              y={y + 8}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fontWeight={600}
              fill="hsl(var(--foreground))"
            >
              {display}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
