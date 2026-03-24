import type {
  PostDetailDTO,
  PostAttachmentDTO,
  CommunityAnswer,
  CommentDTO,
  AiAnswer,
  SimilarPost,
} from "@/types/community";

// ─── 게시글 상세 Store ────────────────────────────────────────────────────────

const SAMPLE_ATTACHMENTS: PostAttachmentDTO[] = [
  {
    type: "IMAGE",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
    fileName: "useEffect-diagram.png",
  },
  {
    type: "FILE",
    url: "https://example.com/files/useEffect-example.zip",
    fileName: "useEffect-example.zip",
  },
];

const POST_DETAIL_001: PostDetailDTO = {
  id: "post-001",
  title: "React useEffect 의존성 배열, 빈 배열과 생략의 차이가 뭔가요?",
  content: `공식 문서를 읽었는데 빈 배열 []과 아예 생략했을 때 동작이 다르다고 하는데, 실제로 어떤 차이가 있는지 코드 예시로 설명해 주실 수 있나요?

저는 현재 다음과 같이 코드를 작성했습니다:

\`\`\`js
// 케이스 1: 의존성 배열 생략
useEffect(() => {
  fetchUserData();
});

// 케이스 2: 빈 배열
useEffect(() => {
  fetchUserData();
}, []);
\`\`\`

두 케이스의 실행 시점이 어떻게 다른지, 그리고 언제 어떤 걸 써야 하는지 명확한 기준을 알고 싶습니다.`,
  level: "BEGINNER",
  authorId: "user-001",
  authorNickname: "코딩입문자",
  answerCount: 2,
  createdAt: "2026-03-17T08:30:00.000Z",
  updatedAt: "2026-03-17T08:30:00.000Z",
  attachments: SAMPLE_ATTACHMENTS,
};

const POST_DETAIL_002: PostDetailDTO = {
  id: "post-002",
  title: "Next.js App Router에서 서버 컴포넌트와 클라이언트 컴포넌트를 어떻게 나누는 게 좋을까요?",
  content: `데이터 패칭은 서버에서, 인터랙션은 클라이언트에서 한다는 원칙은 알겠는데, 실제 프로젝트에서 경계를 어디서 그어야 할지 기준이 불명확합니다.

예를 들어 아래 구조에서 어디에 "use client"를 붙여야 할지 헷갈립니다:

\`\`\`tsx
// 이 컴포넌트는 서버? 클라이언트?
export default function PostPage() {
  const [liked, setLiked] = useState(false); // 상태가 있으면 클라이언트?
  const data = await fetchPost();            // 데이터 패칭은 서버?
  return <div>...</div>;
}
\`\`\`

실무에서 어떤 기준으로 분리하는지 궁금합니다.`,
  level: "JUNIOR",
  authorId: "user-002",
  authorNickname: "프론트엔드주니어",
  answerCount: 1,
  createdAt: "2026-03-17T07:15:00.000Z",
  updatedAt: "2026-03-17T07:15:00.000Z",
  attachments: [],
};

const POST_DETAIL_004: PostDetailDTO = {
  id: "post-004",
  title: "TanStack Query와 Zustand를 함께 쓸 때 서버 상태와 클라이언트 상태를 어떻게 구분하나요?",
  content: `API로 받아온 데이터는 TanStack Query로 관리하고, UI 상태는 Zustand로 관리한다는 건 알겠는데, 사용자 인증 정보처럼 애매한 경우는 어디에 두어야 하나요?

예를 들어 로그인한 유저 정보는:
- 서버에서 /users/me로 받아오기 때문에 TanStack Query?
- 하지만 앱 전반에 동기적으로 접근해야 해서 Zustand?

이런 경계가 애매한 케이스들을 어떻게 판단하는지 기준을 알고 싶습니다.`,
  level: "MIDDLE",
  authorId: "user-004",
  authorNickname: "리액트개발자",
  answerCount: 1,
  createdAt: "2026-03-16T22:00:00.000Z",
  updatedAt: "2026-03-16T22:00:00.000Z",
  attachments: [],
};

const POST_DETAIL_010: PostDetailDTO = {
  id: "post-010",
  title: "React 19 Concurrent Features를 실무에 적용할 때 주의할 점이 있을까요?",
  content: `useTransition과 useDeferredValue를 쓰면 UI가 더 자연스럽다고 해서 도입을 고려 중인데, 기존 코드와 충돌이 생기거나 예기치 않은 동작이 있을 수 있는지 궁금합니다.

\`\`\`tsx
const [isPending, startTransition] = useTransition();

function handleSearch(query: string) {
  startTransition(() => {
    setSearchQuery(query); // 이 업데이트가 지연될 수 있음
  });
}
\`\`\`

특히 외부 상태(Zustand, 서버 요청 등)와 함께 쓸 때 주의할 점이 있는지 실무 경험을 듣고 싶습니다.`,
  level: "SENIOR",
  authorId: "user-010",
  authorNickname: "시니어프론트",
  answerCount: 1,
  createdAt: "2026-03-16T08:00:00.000Z",
  updatedAt: "2026-03-16T08:00:00.000Z",
  attachments: [],
};

/** postId → PostDetailDTO. 실제 API 연동 시 이 Map을 제거하고 axios 호출로 교체합니다. */
export const MOCK_POST_STORE: Record<string, PostDetailDTO> = {
  "post-001": POST_DETAIL_001,
  "post-002": POST_DETAIL_002,
  "post-004": POST_DETAIL_004,
  "post-010": POST_DETAIL_010,
};

// ─── AI 답변 Store ────────────────────────────────────────────────────────────

/** postId → AiAnswer */
export const MOCK_AI_ANSWER_STORE: Record<string, AiAnswer> = {
  "post-001": {
    content: `**핵심 차이점**

| 구분 | 실행 시점 |
|------|----------|
| 빈 배열 \`[]\` | 마운트 시 **1회만** |
| 생략 | **매 렌더링마다** |

**주의**: 생략 + 내부 상태 변경 = 무한 루프 위험

빈 배열은 컴포넌트 초기화 시 한 번만 데이터를 불러올 때 적합하고, 생략은 실무에서 거의 사용하지 않습니다. 특정 값에 반응해야 한다면 해당 값을 의존성 배열에 명시하세요.`,
    generatedAt: "2026-03-17T08:35:00.000Z",
  },
  "post-002": {
    content: `**핵심 원칙**: \`"use client"\`는 트리 **말단**에 배치하세요.

- **서버 컴포넌트**: 데이터 패칭, DB 접근, 민감 정보 처리
- **클라이언트 컴포넌트**: 이벤트 핸들러, useState/useEffect, 브라우저 API

\`useState\`와 \`await fetch\`를 같은 컴포넌트에서 쓸 수 없습니다. 상태가 필요한 부분만 별도 클라이언트 컴포넌트로 분리하고, 나머지는 서버 컴포넌트로 유지하는 것이 권장 패턴입니다.`,
    generatedAt: "2026-03-17T07:20:00.000Z",
  },
  "post-004": {
    content: `**구분 기준**

- **TanStack Query**: 서버와 동기화가 필요한 데이터 (캐시, 재검증, 로딩/에러 상태)
- **Zustand**: 컴포넌트 간 공유되는 순수 클라이언트 상태

**인증 정보**는 서버에서 받아오지만 앱 전반에 동기적으로 접근해야 하므로 **Zustand**가 적합합니다. 초기 로드 시 \`/users/me\`를 한 번 호출해 Zustand에 저장하고, 이후에는 store에서 읽는 패턴이 일반적입니다.`,
    generatedAt: "2026-03-16T22:05:00.000Z",
  },
  "post-010": {
    content: `**주요 주의사항**

- \`startTransition\` 내부의 업데이트는 **긴급하지 않음**으로 표시됩니다. 외부 상태(Zustand store 등)를 직접 변경하면 트랜지션 밖에서 즉시 반영되어 의도한 지연 효과가 없을 수 있습니다.
- \`useDeferredValue\`는 값이 안정화될 때까지 이전 값을 유지합니다. 이 값으로 파생된 무거운 연산에 \`useMemo\`를 함께 사용하면 효과적입니다.
- 순수 렌더링 최적화 목적에만 활용하고, 사이드 이펙트가 있는 로직에는 적용을 피하세요.`,
    generatedAt: "2026-03-16T08:05:00.000Z",
  },
};

// ─── 유사 질문 Store ──────────────────────────────────────────────────────────

/** postId → SimilarPost[] */
export const MOCK_SIMILAR_POSTS_STORE: Record<string, SimilarPost[]> = {
  "post-001": [
    {
      id: "post-010",
      title: "React 19 Concurrent Features를 실무에 적용할 때 주의할 점이 있을까요?",
      answerCount: 1,
      level: "SENIOR",
    },
    {
      id: "post-004",
      title: "TanStack Query와 Zustand를 함께 쓸 때 서버 상태와 클라이언트 상태를 어떻게 구분하나요?",
      answerCount: 1,
      level: "MIDDLE",
    },
    {
      id: "post-002",
      title: "Next.js App Router에서 서버 컴포넌트와 클라이언트 컴포넌트를 어떻게 나누는 게 좋을까요?",
      answerCount: 1,
      level: "JUNIOR",
    },
    {
      id: "post-005",
      title: "TypeScript에서 제네릭을 사용할 때 타입 추론이 안 되는 경우가 있어서 질문드립니다.",
      answerCount: 3,
      level: "JUNIOR",
    },
    {
      id: "post-006",
      title: "CSS Grid와 Flexbox를 언제 각각 사용하는 게 적합한가요?",
      answerCount: 2,
      level: "BEGINNER",
    },
  ],
  "post-002": [
    {
      id: "post-001",
      title: "React useEffect 의존성 배열, 빈 배열과 생략의 차이가 뭔가요?",
      answerCount: 2,
      level: "BEGINNER",
    },
    {
      id: "post-010",
      title: "React 19 Concurrent Features를 실무에 적용할 때 주의할 점이 있을까요?",
      answerCount: 1,
      level: "SENIOR",
    },
    {
      id: "post-004",
      title: "TanStack Query와 Zustand를 함께 쓸 때 서버 상태와 클라이언트 상태를 어떻게 구분하나요?",
      answerCount: 1,
      level: "MIDDLE",
    },
    {
      id: "post-007",
      title: "Next.js에서 Image 컴포넌트 사용 시 layout shift가 발생하는 이유가 궁금합니다.",
      answerCount: 2,
      level: "JUNIOR",
    },
    {
      id: "post-008",
      title: "React에서 Context API와 전역 상태 라이브러리를 언제 구분해서 쓰나요?",
      answerCount: 4,
      level: "MIDDLE",
    },
  ],
  "post-004": [
    {
      id: "post-002",
      title: "Next.js App Router에서 서버 컴포넌트와 클라이언트 컴포넌트를 어떻게 나누는 게 좋을까요?",
      answerCount: 1,
      level: "JUNIOR",
    },
    {
      id: "post-001",
      title: "React useEffect 의존성 배열, 빈 배열과 생략의 차이가 뭔가요?",
      answerCount: 2,
      level: "BEGINNER",
    },
    {
      id: "post-010",
      title: "React 19 Concurrent Features를 실무에 적용할 때 주의할 점이 있을까요?",
      answerCount: 1,
      level: "SENIOR",
    },
    {
      id: "post-009",
      title: "Redux Toolkit과 TanStack Query를 같이 쓰는 게 맞는 방향인가요?",
      answerCount: 3,
      level: "MIDDLE",
    },
    {
      id: "post-005",
      title: "TypeScript에서 제네릭을 사용할 때 타입 추론이 안 되는 경우가 있어서 질문드립니다.",
      answerCount: 3,
      level: "JUNIOR",
    },
  ],
  "post-010": [
    {
      id: "post-004",
      title: "TanStack Query와 Zustand를 함께 쓸 때 서버 상태와 클라이언트 상태를 어떻게 구분하나요?",
      answerCount: 1,
      level: "MIDDLE",
    },
    {
      id: "post-002",
      title: "Next.js App Router에서 서버 컴포넌트와 클라이언트 컴포넌트를 어떻게 나누는 게 좋을까요?",
      answerCount: 1,
      level: "JUNIOR",
    },
    {
      id: "post-001",
      title: "React useEffect 의존성 배열, 빈 배열과 생략의 차이가 뭔가요?",
      answerCount: 2,
      level: "BEGINNER",
    },
    {
      id: "post-008",
      title: "React에서 Context API와 전역 상태 라이브러리를 언제 구분해서 쓰나요?",
      answerCount: 4,
      level: "MIDDLE",
    },
    {
      id: "post-009",
      title: "Redux Toolkit과 TanStack Query를 같이 쓰는 게 맞는 방향인가요?",
      answerCount: 3,
      level: "MIDDLE",
    },
  ],
};

// ─── 답변 가변 Store ──────────────────────────────────────────────────────────
// postId별로 답변 목록을 관리합니다.
// 실제 API 연동 시 이 store 전체를 제거하고 axios 호출로 교체합니다.

const INITIAL_ANSWERS_001: CommunityAnswer[] = [
  {
    id: "answer-001",
    content: `빈 배열 \`[]\`과 생략의 핵심 차이를 정리해 드릴게요.

**빈 배열 \`[]\`**: 컴포넌트가 처음 **마운트될 때 단 한 번**만 실행됩니다.
**생략**: **매 렌더링마다** 실행됩니다. 상태나 props가 변경될 때마다 실행되는 것이죠.

\`\`\`js
// 마운트 시 1회만 실행
useEffect(() => {
  fetchUserData();
}, []);

// 매 렌더링마다 실행 (위험!)
useEffect(() => {
  setCount(count + 1); // 무한 루프 발생!
});
\`\`\`

생략했을 때 effect 내부에서 상태를 변경하면 렌더링 유발 → effect 재실행 → 무한 루프가 됩니다. 대부분의 경우 **빈 배열이 의도한 동작**에 더 가깝습니다.`,
    authorId: "user-senior-01",
    authorNickname: "시니어개발자",
    isAdopted: true,
    createdAt: "2026-03-17T09:00:00.000Z",
    updatedAt: "2026-03-17T09:00:00.000Z",
    comments: [
      {
        id: "comment-001",
        userId: "user-001",
        nickname: "코딩입문자",
        content: "정말 명확한 설명 감사합니다! 이제 이해가 됐어요.",
        createdAt: "2026-03-17T09:30:00.000Z",
      },
      {
        id: "comment-002",
        userId: "user-middle-01",
        nickname: "미들개발자",
        content: "cleanup 함수 반환도 알아두면 좋아요. 이벤트 리스너나 타이머 해제할 때 유용합니다.",
        createdAt: "2026-03-17T10:00:00.000Z",
      },
    ],
  },
  {
    id: "answer-002",
    content: `추가로 의존성 배열에 특정 값을 넣는 케이스도 알아두세요.

\`\`\`js
const [userId, setUserId] = useState(null);

// userId가 변경될 때마다 실행
useEffect(() => {
  if (userId) fetchUserData(userId);
}, [userId]); // userId를 의존성으로 명시
\`\`\`

ESLint의 \`exhaustive-deps\` 규칙을 활성화하면, effect 내부에서 참조하는 외부 변수를 빠짐없이 의존성 배열에 추가하도록 자동으로 경고해줍니다.`,
    authorId: "user-junior-01",
    authorNickname: "주니어개발자",
    isAdopted: false,
    createdAt: "2026-03-17T11:00:00.000Z",
    updatedAt: "2026-03-17T11:00:00.000Z",
    comments: [],
  },
];

const INITIAL_ANSWERS_002: CommunityAnswer[] = [
  {
    id: "answer-002-001",
    content: `\`"use client"\`는 최대한 트리 **말단**에 두는 게 좋습니다.

상위 레이아웃은 서버 컴포넌트로 유지하고, 버튼이나 폼처럼 이벤트가 필요한 리프 컴포넌트에만 선언하세요.

\`\`\`tsx
// ✅ 권장: 서버 컴포넌트가 클라이언트 컴포넌트를 children으로 받음
// page.tsx (서버)
export default async function PostPage() {
  const data = await fetchPost();
  return (
    <article>
      <PostContent data={data} />  {/* 서버 */}
      <LikeButton postId={data.id} />  {/* 클라이언트 */}
    </article>
  );
}
\`\`\`

\`useState\`가 필요한 \`LikeButton\`만 "use client"로 분리하면 됩니다.`,
    authorId: "user-senior-01",
    authorNickname: "시니어개발자",
    isAdopted: true,
    createdAt: "2026-03-17T08:00:00.000Z",
    updatedAt: "2026-03-17T08:00:00.000Z",
    comments: [],
  },
];

const INITIAL_ANSWERS_004: CommunityAnswer[] = [
  {
    id: "answer-004-001",
    content: `인증 정보는 서버에서 받아오지만 앱 전반에 걸쳐 **동기적으로 접근**해야 하므로 Zustand가 적합합니다.

**판단 기준**:
- 캐시·재검증·로딩 상태가 필요하면 → **TanStack Query**
- 여러 컴포넌트가 동기적으로 공유해야 하는 상태 → **Zustand**

\`\`\`ts
// 인증 초기화 패턴
// 앱 마운트 시 /users/me 호출 후 Zustand에 저장
const { data } = useQuery({ queryKey: ["me"], queryFn: fetchMe });
useEffect(() => {
  if (data) setAuth(data);
}, [data]);
\`\`\`

이후 컴포넌트에서는 \`useAuthStore()\`로 동기 접근합니다.`,
    authorId: "user-senior-01",
    authorNickname: "시니어개발자",
    isAdopted: true,
    createdAt: "2026-03-16T23:00:00.000Z",
    updatedAt: "2026-03-16T23:00:00.000Z",
    comments: [],
  },
];

const INITIAL_ANSWERS_010: CommunityAnswer[] = [
  {
    id: "answer-010-001",
    content: `실무에서 겪은 주요 주의사항을 공유합니다.

**1. 외부 상태와 함께 쓸 때**

\`startTransition\` 내부에서 Zustand store를 직접 변경하면 트랜지션 밖에서 즉시 반영되어 의도한 지연 효과가 없습니다.

\`\`\`tsx
// ❌ 트랜지션이 Zustand에 영향 없음
startTransition(() => {
  useStore.getState().setFilter(value); // 즉시 반영됨
});

// ✅ React 상태만 트랜지션 대상으로
startTransition(() => {
  setLocalFilter(value); // React 상태는 지연 가능
});
\`\`\`

**2. side effect가 있는 setState는 트랜지션 안에 넣지 마세요.**
순수 렌더링 최적화 목적에만 활용하는 것이 안전합니다.`,
    authorId: "user-senior-01",
    authorNickname: "시니어프론트2",
    isAdopted: true,
    createdAt: "2026-03-16T09:00:00.000Z",
    updatedAt: "2026-03-16T09:00:00.000Z",
    comments: [],
  },
];

const _answersByPost: Record<string, CommunityAnswer[]> = {
  "post-001": structuredClone(INITIAL_ANSWERS_001),
  "post-002": structuredClone(INITIAL_ANSWERS_002),
  "post-004": structuredClone(INITIAL_ANSWERS_004),
  "post-010": structuredClone(INITIAL_ANSWERS_010),
};

export const mockAnswerStore = {
  getAll(postId: string): CommunityAnswer[] {
    return structuredClone(_answersByPost[postId] ?? []);
  },

  create(postId: string, answer: CommunityAnswer): CommunityAnswer {
    if (!_answersByPost[postId]) _answersByPost[postId] = [];
    _answersByPost[postId] = [..._answersByPost[postId], answer];
    return answer;
  },

  update(postId: string, answerId: string, content: string): CommunityAnswer {
    const list = _answersByPost[postId];
    const target = list?.find((a) => a.id === answerId);
    if (!target) throw new Error(`Answer not found: ${answerId}`);
    const updated: CommunityAnswer = {
      ...target,
      content,
      updatedAt: new Date().toISOString(),
    };
    _answersByPost[postId] = list.map((a) => (a.id === answerId ? updated : a));
    return updated;
  },

  delete(postId: string, answerId: string): void {
    const list = _answersByPost[postId] ?? [];
    _answersByPost[postId] = list.filter((a) => a.id !== answerId);
  },

  adopt(postId: string, answerId: string): void {
    const list = _answersByPost[postId] ?? [];
    _answersByPost[postId] = list.map((a) => ({
      ...a,
      isAdopted: a.id === answerId,
    }));
  },

  addComment(postId: string, answerId: string, comment: CommentDTO): CommentDTO {
    const list = _answersByPost[postId] ?? [];
    _answersByPost[postId] = list.map((a) =>
      a.id === answerId ? { ...a, comments: [...a.comments, comment] } : a,
    );
    return comment;
  },

  deleteComment(postId: string, answerId: string, commentId: string): void {
    const list = _answersByPost[postId] ?? [];
    _answersByPost[postId] = list.map((a) =>
      a.id === answerId
        ? { ...a, comments: a.comments.filter((c) => c.id !== commentId) }
        : a,
    );
  },
};

// ─── 게시글 생성 Store ────────────────────────────────────────────────────────

/**
 * 새로 작성된 게시글을 MOCK_POST_STORE에 등록한다.
 * postsEndpoints.createPost 에서 호출하며, 이후 getPostDetail이 즉시 조회 가능해진다.
 * 실제 API 연동 시 이 함수를 제거하고 서버 응답을 그대로 사용하면 된다.
 */
export function mockCreatePost(post: PostDetailDTO): PostDetailDTO {
  MOCK_POST_STORE[post.id] = post;
  return post;
}
