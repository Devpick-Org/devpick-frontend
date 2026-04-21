import { JobDetailPage } from "@/components/features/jobs/detail/JobDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <JobDetailPage id={id} />;
}
