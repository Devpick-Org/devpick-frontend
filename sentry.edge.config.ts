import * as Sentry from "@sentry/nextjs";

const dsn =
  process.env.SENTRY_DSN ??
  process.env.NEXT_PUBLIC_SENTRY_DSN ??
  "https://eff8191aa4a5ddb71d0cbfa926ee89a4@o4511437841498112.ingest.us.sentry.io/4511437846151169";

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0.05"),
    tracePropagationTargets: [
      "localhost",
      /^https:\/\/traceapp\.site/,
      /^https:\/\/api\.traceapp\.org/,
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
    ].filter(Boolean),
    sendDefaultPii: false,
  });
}
