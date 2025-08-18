# CGO - Core • Growth • Optional

작업과 프로젝트를 Core, Growth, Optional 카테고리로 자동 분류하는 웹 앱입니다.

## 기능

- **자동 분류**: 키워드 기반 규칙으로 작업을 자동 분류
- **드래그 앤 드롭**: 컬럼 간 아이템 이동 및 재정렬
- **인라인 편집**: 클릭하여 아이템 편집
- **마크다운 복사**: 분류 결과를 마크다운 형식으로 복사
- **LLM 정제**: OpenAI API를 통한 분류 결과 개선 (선택사항)

## 분류 규칙

### Core (긴급/영향/약속)

- 키워드: revenue, payment, billing, subscription, launch, release, deadline, due, deliverable, demo, pitch, presentation, interview, portfolio, resume, cv, hiring, client, sponsor, investor, traction, users, MAU, MRR, P0, urgent, critical, must, today, this week

### Growth (브랜드/학습/시스템)

- 키워드: blog, seo, content, post, article, docs, refactor, cleanup, ux, layout, readability, analytics, dashboard, branding, roadmap, study, cs, algorithm, interview prep, learning, course, tutorial, practice

### Optional (실험/선택사항)

- 키워드: experiment, try, idea, prototype, v2, ai filter, fun, maybe, someday, later, explore, viral, growth hack, polish, animation, three.js

## 기술 스택

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **AI**: OpenAI GPT-4o-mini (선택사항)

## 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build
```

## 환경 변수

LLM 기능을 사용하려면 `.env.local` 파일에 OpenAI API 키를 설정하세요:

```
OPENAI_API_KEY=your_openai_api_key_here
```

## 배포

Vercel을 통한 원클릭 배포를 지원합니다:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/cgo)

## 라이선스

MIT
