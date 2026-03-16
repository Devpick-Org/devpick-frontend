import { AuthContainer } from "@/components/features/auth/AuthContainer"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ oauthError?: string }>
}) {
  const { oauthError } = await searchParams
  return (
    <div className="min-h-screen bg-background px-4 pt-20 pb-16">
      <AuthContainer oauthError={oauthError} />
    </div>
  )
}
