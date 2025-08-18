import type { Buckets } from "./types";

export const parseLines = (blob: string): string[] =>
  blob
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

// --- 키워드 세트 (한/영 혼합) ---
const CORE_HARD =
  /발표|프레젠테이션|presentation|demo|데모|회의\s*자료|자료\s*완성|회의\s*준비|report|리포트|보고서|프로토타입|prototype|고객|이메일\s*답변|reply|respond|deadline|마감|due|출시|release|launch/i;

const CORE_SOFT = /주간|weekly|정리|정돈|정비|정책|plan|기획|스펙|spec/i;

const GROWTH_SET =
  /blog|블로그|seo|콘텐츠|article|post|문서화|docs|리팩터|refactor|가독성|readability|ux|ui|레이아웃|layout|브랜딩|branding|roadmap|학습|study|공부|learning|course|tutorial|practice|알고리즘|algorithm|튜닝|tuning|성능|performance|운동|런닝|헬스|exercise|독서|책|reading/i;

const OPTIONAL_SET =
  /게임|game|넷플릭스|netflix|드라마|쇼|시청|유튜브|youtube|취미|여가|experiment|실험|아이디어|brainstorm|브레인스토밍|polish|animation|three\.js|fun|maybe|later|someday/i;

// entertainment는 강하게 Optional로 보내기
const OPTIONAL_STRONG =
  /게임|game|넷플릭스|netflix|드라마|쇼|시청|유튜브|youtube/i;

// --- 스코어링 분류 ---
export function classify(lines: string[]): Buckets {
  const out: Buckets = { core: [], growth: [], optional: [] };

  for (const raw of lines) {
    const line = raw.trim();

    // 1) 강한 Optional(엔터테인먼트)은 바로 Optional
    if (OPTIONAL_STRONG.test(line)) {
      out.optional.push(line);
      continue;
    }

    // 2) 스코어 계산
    let core = 0,
      growth = 0,
      optional = 0;

    if (CORE_HARD.test(line)) core += 3;
    if (CORE_SOFT.test(line)) core += 1;

    if (GROWTH_SET.test(line)) growth += 2;

    if (OPTIONAL_SET.test(line)) optional += 1;

    // 3) 우선순위 결정: Core > Growth > Optional
    //    같은 점수면 Core 우선, 그 다음 Growth
    if (core > growth && core > optional) {
      out.core.push(line);
    } else if (growth >= core && growth > optional) {
      out.growth.push(line);
    } else if (optional > 0 && optional >= core && optional >= growth) {
      out.optional.push(line);
    } else {
      // 기본값: Growth
      out.growth.push(line);
    }
  }

  return out;
}

export function generateClassificationPrompt(
  tasks: string[],
  language: "ko" | "en" = "ko"
) {
  const systemPrompt =
    language === "ko"
      ? `당신은 할일 우선순위 전문가입니다. 아래 기준으로만 분류하세요.

[분류 기준]
- Core(핵심): 발표/데모/프로토타입/리포트/고객 대응/마감·출시 등 당장 업무 성과와 직결되는 일
- Growth(성장): 학습/문서화/리팩터/SEO/브랜딩/운동/독서/알고리즘 등 장기 가치를 높이는 일
- Optional(선택): 게임/넷플릭스/유튜브 등 엔터테인먼트, 브레인스토밍·실험적 아이디어

[예시]
- "팀 회의 발표 자료 완성" → Core
- "고객 이메일 답변 보내기" → Core
- "신규 기능 프로토타입 만들기" → Core
- "주간 리포트 작성" → Core
- "블로그 글 작성" → Growth
- "UI 디자인 패턴 공부하기" → Growth
- "데이터베이스 성능 튜닝 연습" → Growth
- "운동 30분" → Growth
- "책 읽기" → Growth
- "알고리즘 풀기" → Growth
- "게임하기 1시간" → Optional
- "넷플릭스 드라마 보기" → Optional
- "새로운 앱 아이디어 브레인스토밍" → Optional
- "사진 보정 실험" → Optional

[규칙]
- 엔터테인먼트는 항상 Optional.
- 발표/프로토타입/리포트/고객 대응은 기본 Core.
- 애매하면 Growth.
- JSON만 반환. 여분 텍스트 금지.

JSON:
{"core":[],"growth":[],"optional":[],"dailyFocus":[{"priority":1,"task":""},{"priority":2,"task":""},{"priority":3,"task":""}]}
`
      : `You are a prioritization expert. Classify strictly by:

[Criteria]
- Core: presentations/demos/prototypes/reports/customer responses/deadlines/launches
- Growth: learning/docs/refactor/SEO/branding/exercise/reading/algorithms
- Optional: entertainment (games/Netflix/YouTube), brainstorming/experimental ideas

[Examples]
- "Finish team presentation deck" → Core
- "Reply to customer email" → Core
- "Build new feature prototype" → Core
- "Write weekly report" → Core
- "Write technical blog post" → Growth
- "Study UI design patterns" → Growth
- "DB performance tuning practice" → Growth
- "Exercise 30m" → Growth
- "Read book" → Growth
- "Solve algorithms" → Growth
- "Play games 1h" → Optional
- "Watch Netflix" → Optional
- "Brainstorm new app idea" → Optional
- "Photo retouching experiment" → Optional

[Rules]
- Entertainment is always Optional.
- Presentation/prototype/report/customer response default to Core.
- If uncertain, choose Growth.
- Return JSON only, nothing else.

JSON:
{"core":[],"growth":[],"optional":[],"dailyFocus":[{"priority":1,"task":""},{"priority":2,"task":""},{"priority":3,"task":""}]}
`;

  const userPrompt =
    language === "ko"
      ? `다음 작업들을 위 기준으로 분류하세요:\n${tasks.join("\n")}`
      : `Classify these tasks by the rules:\n${tasks.join("\n")}`;

  return `${systemPrompt}\n\n${userPrompt}`;
}
