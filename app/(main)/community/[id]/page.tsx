import { CommunityDetailPage } from "@/components/features/community/CommunityDetailPage";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id: postId } = await params;
  return <CommunityDetailPage postId={postId} />;
}
