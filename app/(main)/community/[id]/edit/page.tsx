import { CommunityEditPage } from "@/components/features/community/CommunityEditPage";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id: postId } = await params;
  return <CommunityEditPage postId={postId} />;
}
