# Repository Guidelines

## Project Structure & Module Organization
- 모노레포 루트에는 `apps`, `docker`, `turbo.json`, 그리고 공용 설정(`package.json`, `pnpm-workspace.yaml`)이 있습니다.
- `apps/api`는 NestJS 기반 백엔드로 `src`에 모듈, `prisma`에 스키마, `test`에 Jest 스위트를 둡니다.
- `apps/web`은 Next.js 프론트엔드로 `app` 라우터와 `components` 디렉터리가 핵심 구조입니다.
- 공통 ESLint/TS 구성은 루트 패키지에서 제공하며, 패키지별 `eslint.config.mjs`와 `tsconfig*.json`을 통해 세부 조정합니다.

## Build, Test, and Development Commands
- `pnpm install`: 루트에서 실행하면 모든 워크스페이스 의존성을 설치합니다.
- `pnpm dev`: `turbo run dev`를 호출하여 `web`, `api`를 동시에 개발 모드로 띄웁니다. 필요 시 `pnpm --filter api dev` 처럼 필터링하세요.
- `pnpm build`: 모든 앱과 패키지를 프로덕션 빌드합니다. 캐시를 재사용하려면 `turbo build --filter=web`과 같이 범위를 좁힐 수 있습니다.
- `pnpm lint`, `pnpm check-types`, `pnpm format`: 각각 ESLint, TypeScript 체크, Prettier 포매팅을 실행합니다.

## Coding Style & Naming Conventions
- TypeScript 전용 저장소이며, Prettier가 2-스페이스 들여쓰기를 강제합니다. PR 전 `pnpm format`으로 정렬 상태를 맞추세요.
- React 컴포넌트와 Nest 프로바이더는 PascalCase, 유틸 함수와 훅은 camelCase를 사용합니다.
- 환경 변수는 `docker/.env.*` 또는 앱별 `.env`로 구분하고, 런타임에 필요한 키만 `process.env`에서 참조합니다.

## Testing Guidelines
- `apps/api`는 Jest를 사용합니다. `pnpm --filter api test`, `test:e2e`, `test:cov`로 단위·E2E·커버리지를 각각 실행하세요.
- Next.js 앱은 기본적으로 Playwright나 Vitest가 없으므로, React Testing Library 기반 스위트를 추가할 때 `apps/web/__tests__` 구조를 재사용하십시오.
- 새로운 테스트 파일은 대상 기능명 뒤에 `.spec.ts` 또는 `.e2e-spec.ts`를 붙입니다.

## Commit & Pull Request Guidelines
- Git 기록은 `init: first commit` 형태를 따르므로, Conventional Commits (`feat:`, `fix:`, `chore:` 등) 접두사를 권장합니다.
- 하나의 기능·버그 수정만 포함하고, 변경 요약, 테스트 결과, 관련 이슈 링크를 PR 설명에 명시하세요.
- UI 변경이나 API 스키마 수정 시 스크린샷/샘플 요청 스키마를 첨부하여 검토 범위를 줄입니다.

## Security & Configuration Tips
- Prisma 마이그레이션은 `apps/api/prisma`에서 관리하고, 공유 DB를 건드릴 때는 `docker` 컴포즈 파일로 로컬 인스턴스를 먼저 띄우세요.
- Secrets는 Git에 커밋하지 말고 Vercel/Nest `configService`를 통해 주입합니다. 필요 시 `.env.example`를 갱신해 키 이름만 문서화하세요.

## Agent-Specific Instructions
- 코드 생성, 설정, 라이브러리/ API 문서가 필요할 때는 항상 Context7 도구를 통해 라이브러리 ID를 확인하고 문서를 조회합니다.
