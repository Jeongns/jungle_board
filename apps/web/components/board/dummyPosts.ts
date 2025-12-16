import type { Post } from '@/components/board/types';

export const DUMMY_POSTS: Post[] = [
  {
    id: 'dummy-1',
    title: '환영합니다',
    author: '관리자',
    content:
      '이 메인 화면의 게시글은 더미 데이터입니다.\n\n나중에 실제 데이터 로직을 붙이면 이 배열을 API/스토리지 결과로 교체하면 됩니다.',
    createdAt: '2025-01-01T09:00:00.000Z',
    updatedAt: '2025-01-01T09:00:00.000Z',
  },
  {
    id: 'dummy-2',
    title: '상세 페이지 UI',
    author: '보드랩',
    content:
      '상세 화면은 보기 전용 틀만 제공됩니다.\n\n- 헤더 액션\n- 본문 카드\n- 댓글 섹션(placeholder)\n- 사이드 정보 카드\n\n필요한 기능을 나중에 연결하세요.',
    createdAt: '2025-01-02T09:00:00.000Z',
    updatedAt: '2025-01-02T10:30:00.000Z',
  },
];
