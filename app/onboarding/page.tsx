import { OnboardingForm } from "@/components/features/onboarding/OnboardingForm";

export default function Page() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <OnboardingForm />
    </div>
  );
}
