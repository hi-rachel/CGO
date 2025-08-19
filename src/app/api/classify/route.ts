import { NextRequest, NextResponse } from "next/server";
import { DailyFocusItem } from "../../../lib/types";

interface ClassificationResult {
  core: string[];
  growth: string[];
  optional: string[];
  dailyFocus: DailyFocusItem[];
}

function generateClassificationPrompt(
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

export async function POST(request: NextRequest) {
  try {
    const { tasks, language = "ko" } = await request.json();

    if (!tasks || !Array.isArray(tasks)) {
      return NextResponse.json(
        { error: "Invalid tasks array" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const prompt = generateClassificationPrompt(tasks, language);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    // JSON 파싱 시도
    let result: ClassificationResult;
    try {
      // JSON 블록 추출
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      throw new Error("Failed to parse OpenAI response");
    }

    // 결과 검증
    if (!result.core || !result.growth || !result.optional) {
      throw new Error("Invalid response structure");
    }

    // Daily Focus가 없으면 생성
    if (!result.dailyFocus || result.dailyFocus.length === 0) {
      const coreTasks = result.core.slice(0, 3);
      const growthTasks = result.growth.slice(0, 3 - coreTasks.length);
      const allTasks = [...coreTasks, ...growthTasks];

      result.dailyFocus = allTasks.map((task, index) => ({
        priority: index + 1,
        task: task,
      }));
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Classification failed" },
      { status: 500 }
    );
  }
}
