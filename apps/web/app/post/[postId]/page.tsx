import { PostDetailShell } from "@/components/board/PostDetailShell";
import type { Post } from "@/components/board/types";

export default function PostDetailPage({ params }: { params: { postId: string } }) {
  const post: Post = {
    id: params.postId,
    title: `게시글 상세 (더미)`,
    author: "익명",
    content:
      "이 화면은 UI 틀만 구현된 상태입니다.\n\n나중에 데이터 로직을 붙이면:\n- params.postId로 게시글 조회\n- 조회 결과를 PostDetailShell에 전달\n\n하면 됩니다.",
    createdAt: "2025-01-01T09:00:00.000Z",
    updatedAt: "2025-01-02T10:30:00.000Z",
  };

  return (
    <PostDetailShell post={post} editHref={`/post/${post.id}/edit`} />
  );
}
