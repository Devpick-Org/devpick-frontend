import { AuthContainer } from "@/components/features/auth/AuthContainer"

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-background px-4 pt-20 pb-16">
      <AuthContainer />
    </div>
  )
}
