import { NextRequest, NextResponse } from "next/server";
import { DailyFocusItem } from "../../../lib/types";

interface ClassificationResult {
  core: string[];
  growth: string[];
  optional: string[];
  dailyFocus: DailyFocusItem[];
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

    const { generateClassificationPrompt } = await import(
      "../../../lib/classify"
    );
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
