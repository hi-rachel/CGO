# CGO - Core • Growth • Optional

**CGO** is a productivity web app that helps you organize your tasks into three simple and intuitive buckets.

- **Core (Essential)** 🔴 – Things you must do now (deadlines, clients, appointments, etc.)
- **Growth (Development)** 🟢 – Things that create long-term value (learning, improvement, health, etc.)
- **Optional (Choice)** ⚪ – Experiments, hobbies, and ideas you can do when you have time

This classification makes it clear what to focus on each day.

## Key Features

- **AI Auto-Classification**: Intelligent task classification using OpenAI GPT-4o-mini
- **Daily Focus**: Automatic recommendation of top 3 Core tasks
- **Drag & Drop**: Move and reorder items between columns
- **Markdown Copy**: Copy classification results in markdown format
- **Multi-language Support**: Korean/English support
- **Dark/Light Mode**: Theme switching support
- **Request Limit**: 5 AI analyses per day limit

## Category Descriptions

- **Core**: Must-do tasks that are most important right now
- **Growth**: Investments for future growth and development
- **Optional**: Experiments and hobbies for when you have time

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **AI**: OpenAI GPT-4o-mini
- **State Management**: localStorage (MVP)
- **Deployment**: Vercel

## Environment Variables

To use AI classification features, set your OpenAI API key in the `.env.local` file:

```
OPENAI_API_KEY=your_openai_api_key_here
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

---

# CGO - Core • Growth • Optional

**CGO**는 할 일을 세 가지 버킷으로 단순하고 직관적으로 정리해주는 생산성 웹앱입니다.

- **Core (핵심)** 🔴 – 반드시 지금 해야 하는 일 (마감, 고객, 약속 등)
- **Growth (성장)** 🟢 – 장기적으로 가치를 만드는 일 (학습, 개선, 건강 등)
- **Optional (선택)** ⚪ – 여유 있을 때 해도 되는 실험, 취미, 아이디어

이렇게 분류하면 매일 무엇에 집중해야 할지가 선명해집니다.

## 주요 기능

- **AI 자동 분류**: OpenAI GPT-4o-mini를 활용한 지능형 작업 분류
- **일일 포커스**: 상위 3개 Core 작업 자동 추천
- **드래그 앤 드롭**: 컬럼 간 아이템 이동 및 재정렬
- **마크다운 복사**: 분류 결과를 마크다운 형식으로 복사
- **다국어 지원**: 한국어/영어 지원
- **다크/라이트 모드**: 테마 전환 지원
- **요청 제한**: 하루 5회 AI 분석 제한

## 카테고리 설명

- **Core**: 반드시 지금 해야 할 가장 중요한 일
- **Growth**: 미래의 성장을 위해 투자하는 일
- **Optional**: 여유 있을 때 해도 되는 실험·취미

## 기술 스택

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **AI**: OpenAI GPT-4o-mini
- **상태 관리**: localStorage (MVP)
- **배포**: Vercel

## 환경 변수

AI 분류 기능을 사용하려면 `.env.local` 파일에 OpenAI API 키를 설정하세요:

```
OPENAI_API_KEY=your_openai_api_key_here
```

## 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build
```
