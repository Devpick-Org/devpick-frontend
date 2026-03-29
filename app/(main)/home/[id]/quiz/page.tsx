"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ContentQuizPage } from "@/components/features/home/quiz/ContentQuizPage";

export default function Page() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6 lg:px-8">
      {/* 뒤로가기 */}
      <Link
        href={`/home/${id}`}
        className="group/back mb-8 inline-flex items-center gap-2 rounded-lg py-2 text-sm font-medium text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover/back:-translate-x-0.5" />
        본문으로
      </Link>

      <ContentQuizPage contentId={id} />
    </div>
  );
}
