export type Language = "ko" | "en";

export const translations = {
  ko: {
    title: "CGO",
    subtitle: "Core • Growth • Optional",
    howItWorks: "어떻게 작동하나요?",
    howItWorksDesc:
      "할일을 입력하면 AI가 우선순위에 따라 자동으로 분류해드립니다.",
    placeholder: "할일을 한 줄씩 입력하세요...",
    organizeButton: "정리하기",
    organizingButton: "정리 중...",
    itemsTotal: "항목",
    firstThingsFirst: "First Things First",
    core: "Core",
    growth: "Growth",
    optional: "Optional",
    coreDesc: "반드시 지금 해야 할 가장 중요한 일",
    growthDesc: "미래의 성장을 위해 투자하는 일",
    optionalDesc: "여유 있을 때 해도 되는 실험·취미",
    dailyFocus: "오늘의 핵심 3가지",
    focusTip: "가장 중요한 3가지만 집중하세요",
    copyMarkdown: "마크다운 복사",
    reset: "초기화",
    confirmReset: "모든 데이터를 초기화하시겠습니까?",
    confirmResetMessage: "이 작업은 되돌릴 수 없습니다.",
    copySuccess: "마크다운이 성공적으로 복사되었습니다!",
    copyError: "마크다운 복사에 실패했습니다.",
    madeWith: "Made with",
    feedback: "피드백 보내기",
    noItemsYet: "아직 항목이 없습니다",
    gptAnalysis: "AI 분석",
    aiDriven: "AI 기반 우선순위",
    requestLimitRemaining: "남은 요청: {count}회",
    requestLimitDailyExceeded: "하루에 5번만 분석 가능합니다.",
    requestLimitTooFrequent: "너무 빈번한 요청입니다.",
    requestLimitWaitMinutes: "{minutes}분 후에 다시 시도해주세요.",
    requestLimitInfo: "하루에 5번만 분석 가능합니다.",
    loading: "로딩 중...",
    cancel: "취소",
    confirm: "확인",
    priority: "우선순위",
    switchToLight: "라이트 모드로 전환",
    switchToDark: "다크 모드로 전환",
  },
  en: {
    title: "CGO",
    subtitle: "Core • Growth • Optional",
    howItWorks: "How it works?",
    howItWorksDesc:
      "Enter your tasks and AI will automatically classify them by priority.",
    placeholder: "Enter tasks one by line...",
    organizeButton: "Organize",
    organizingButton: "Organizing...",
    itemsTotal: "items",
    firstThingsFirst: "First Things First",
    core: "Core",
    growth: "Growth",
    optional: "Optional",
    coreDesc: "Must-do tasks that are most important right now",
    growthDesc: "Investments for future growth and development",
    optionalDesc: "Experiments and hobbies for when you have time",
    dailyFocus: "Today's Focus 3",
    focusTip: "Focus on just the 3 most important things",
    copyMarkdown: "Copy as Markdown",
    reset: "Reset",
    confirmReset: "Are you sure you want to reset all data?",
    confirmResetMessage: "This action cannot be undone.",
    copySuccess: "Markdown copied successfully!",
    copyError: "Failed to copy markdown.",
    madeWith: "Made with",
    feedback: "Send Feedback",
    noItemsYet: "No items yet",
    gptAnalysis: "AI Analysis",
    aiDriven: "AI-powered prioritization",
    requestLimitRemaining: "Remaining requests: {count}",
    requestLimitDailyExceeded: "Only 5 analyses allowed per day.",
    requestLimitTooFrequent: "Request too frequent.",
    requestLimitWaitMinutes: "Please try again in {minutes} minutes.",
    requestLimitInfo: "Only 5 analyses allowed per day.",
    loading: "Loading...",
    cancel: "Cancel",
    confirm: "Confirm",
    priority: "Priority",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
  },
};

export function getTranslation(
  language: Language,
  key: keyof typeof translations.ko,
  params?: Record<string, string | number>
): string {
  const translation =
    translations[language][key] || translations.ko[key] || key;

  if (params) {
    return translation.replace(/\{(\w+)\}/g, (match, param) => {
      return String(params[param] || match);
    });
  }

  return translation;
}
