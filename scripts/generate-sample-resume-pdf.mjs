/**
 * 샘플 이력서 PDF 생성 (영문 본문 — jsPDF 내장 폰트는 한글 미지원).
 * 실행: node scripts/generate-sample-resume-pdf.mjs
 * 출력: public/samples/sample-resume-upload-demo.pdf
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { jsPDF } from "jspdf";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "samples");
const outPath = join(outDir, "sample-resume-upload-demo.pdf");

const doc = new jsPDF({ unit: "mm", format: "a4" });
let y = 18;
const left = 14;
const mw = 180;
const line = (txt, gap = 5.5, size = 10) => {
  doc.setFontSize(size);
  const lines = doc.splitTextToSize(txt, mw);
  doc.text(lines, left, y);
  y += lines.length * gap;
  if (y > 270) {
    doc.addPage();
    y = 18;
  }
};

doc.setFontSize(20);
doc.text("Hong Gildong", left, y);
y += 10;
doc.setFontSize(11);
doc.text("Backend Engineer | Seoul, Republic of Korea | sample.devpick.kr@example.com", left, y);
y += 12;

line(
  "SUMMARY",
  5,
  13,
);
line(
  "Backend engineer focusing on scalable APIs and reliable operations. " +
    "Comfortable owning features end-to-end: design discussions, implementation, tests, rollout, " +
    "and on-call support. Interested in pragmatic architecture, observable systems, " +
    "and improving team throughput through sensible automation and documentation.",
);

line(
  "SKILLS",
  5,
  13,
);
line(
  "Java, Spring Boot, Spring WebFlux (basics), JPA, QueryDSL, PostgreSQL, Redis, Kafka (basics), " +
    "Docker, AWS ECS, GitHub Actions, OpenAPI, JUnit, Grafana, Prometheus, REST, gRPC (basics).",
);

line(
  "EXPERIENCE",
  5,
  13,
);
line(
  "DevPick Labs — Backend Engineer — 2022-03 ~ Present — Seoul",
  5,
  11,
);
line(
  "Built and operated core commerce APIs handling peak traffic during campaign windows. " +
    "Reduced p95 latency for the checkout aggregation path by profiling DB queries and introducing " +
    "targeted caches with explicit TTL policies and stampedes protections. Improved incident response " +
    "by aligning runbooks, adding SLO dashboards, and running lightweight game days quarterly. " +
    "Collaborated with frontend engineers on API contracts via OpenAPI; participated in production " +
    "deployments behind feature flags.",
);
line(
  "Acme Payments — Junior Backend Engineer — 2020-01 ~ 2022-02 — Seoul",
  5,
  11,
);
line(
  "Maintained ledger microservice integrations and hardened idempotency for webhook ingestion. " +
    "Worked on Postgres schema migrations under dual-write constraints and incremental validation. " +
    "Automated repeatable operations using internal CLI tools.",
);

line(
  "PROJECTS",
  5,
  13,
);
line(
  "Fleet Dispatch Simulator — Hackathon Winner",
  5,
  11,
);
line(
  "Team backend lead for a weekend hackathon prototype: routing engine API, Postgres storage, Redis " +
    "for ephemeral assignment locks, seeded demo datasets, Grafana dashboard for mocked throughput. " +
    "Role: architecture sketch, REST API definition, pairing on integration tests.",
);
line(
  "Personal: Study Log API",
  5,
  11,
);
line(
  "Small side project exporting weekly study summaries (Markdown). Spring Boot backend, Postgres, " +
    "deployed container image to a hobby VPS. Goal was to practice repeatable CI and minimal infra.",
);

line(
  "EDUCATION",
  5,
  13,
);
line(
  "Bachelor of Science in Computer Engineering — Example National University — 2016 ~ 2020.",
);

mkdirSync(outDir, { recursive: true });
const buf = Buffer.from(doc.output("arraybuffer"));
writeFileSync(outPath, buf);

console.log("Wrote", outPath);
