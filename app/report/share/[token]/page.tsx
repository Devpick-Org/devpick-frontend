import SharedReportPage from "@/components/features/report/SharedReportPage";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function Page({ params }: Props) {
  const { token } = await params;
  return <SharedReportPage token={token} />;
}
