"use client";

import { useState, useEffect } from "react";
import { Buckets, DailyFocusItem } from "../lib/types";
import { Language, getTranslation } from "../lib/i18n";
import { remove, move, reorder } from "../lib/dnd";
import {
  saveToStorage,
  loadFromStorage,
  clearStorage,
  clearAllCGOStorage,
} from "../lib/storage";
import { RequestLimiter } from "../lib/requestLimiter";
import InputBox from "../components/InputBox";
import Board from "../components/Board";
import Toolbar from "../components/Toolbar";
import LanguageToggle from "../components/LanguageToggle";
import ThemeToggle from "../components/ThemeToggle";
import DailyFocus from "../components/DailyFocus";
import Toast from "../components/Toast";
import { DragEndEvent } from "@dnd-kit/core";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [buckets, setBuckets] = useState<Buckets>({
    core: [],
    growth: [],
    optional: [],
  });
  const [dailyFocus, setDailyFocus] = useState<DailyFocusItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasOrganized, setHasOrganized] = useState(false);
  const [language, setLanguage] = useState<Language>("ko");
  const [remainingRequests, setRemainingRequests] = useState<number>(5);
  const [isClient, setIsClient] = useState(false);

  // Toast 상태
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "info"
  );

  // 클라이언트 사이드 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 초기 로드 (클라이언트에서만)
  useEffect(() => {
    if (!isClient) return;

    try {
      const savedData = loadFromStorage();
      if (savedData) {
        setBuckets(savedData.buckets);
        setDailyFocus(savedData.dailyFocus);
        setInputText(savedData.inputText);
        setLanguage(savedData.language);
        setHasOrganized(savedData.hasOrganized);
      }
    } catch {
      clearAllCGOStorage();
    }

    setRemainingRequests(RequestLimiter.getRemainingRequests());
  }, [isClient]);

  // buckets가 변경될 때마다 Daily Focus 자동 업데이트
  useEffect(() => {
    if (hasOrganized) {
      const coreTasks = buckets.core.slice(0, 3);
      const growthTasks = buckets.growth.slice(0, 3 - coreTasks.length);
      const allTasks = [...coreTasks, ...growthTasks];

      const updatedDailyFocus: DailyFocusItem[] = allTasks.map(
        (task, index) => ({
          priority: index + 1,
          task: task,
        })
      );
      setDailyFocus(updatedDailyFocus);
    }
  }, [buckets, hasOrganized]);

  // 상태 저장
  useEffect(() => {
    if (isClient) {
      saveToStorage({
        buckets,
        dailyFocus,
        inputText,
        language,
        hasOrganized,
      });
    }
  }, [buckets, dailyFocus, inputText, language, hasOrganized, isClient]);

  const showToastMessage = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleOrganize = async () => {
    if (!inputText.trim()) return;

    // 요청 제한 체크
    const limitCheck = RequestLimiter.canMakeRequest();

    if (!limitCheck.allowed) {
      let message = "";

      if (limitCheck.reason === "daily_limit_exceeded") {
        message = getTranslation(language, "requestLimitDailyExceeded");
      } else if (limitCheck.reason === "too_frequent") {
        message = getTranslation(language, "requestLimitTooFrequent");
        if (limitCheck.remaining) {
          message +=
            " " +
            getTranslation(language, "requestLimitWaitMinutes", {
              minutes: limitCheck.remaining,
            });
        }
      }

      showToastMessage(message, "error");
      return;
    }

    setLoading(true);
    try {
      const lines = inputText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const result = await fetch("/api/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tasks: lines,
          language: language,
        }),
      });

      if (!result.ok) {
        throw new Error("API request failed");
      }

      const data = await result.json();
      setBuckets(data);

      RequestLimiter.incrementRequestCount();

      if (data.dailyFocus && data.dailyFocus.length > 0) {
        setDailyFocus(data.dailyFocus);
      } else {
        const coreTasks = data.core.slice(0, 3);
        const growthTasks = data.growth.slice(0, 3 - coreTasks.length);
        const allTasks = [...coreTasks, ...growthTasks];

        const generatedDailyFocus: DailyFocusItem[] = allTasks.map(
          (task, index) => ({
            priority: index + 1,
            task: task,
          })
        );
        setDailyFocus(generatedDailyFocus);
      }

      setHasOrganized(true);
      setRemainingRequests(RequestLimiter.getRemainingRequests());

      if (RequestLimiter.getRemainingRequests() > 0) {
        showToastMessage(
          getTranslation(language, "requestLimitRemaining", {
            count: RequestLimiter.getRemainingRequests(),
          }),
          "success"
        );
      }
    } catch {
      showToastMessage("분석 중 오류가 발생했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleItemDelete = (id: string) => {
    setBuckets((buckets) => remove(buckets, id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over) return;

    if (active.id !== over.id) {
      // Extract bucket names from the IDs
      const [fromBucket] = String(active.id).split("-");
      const [toBucket] = String(over.id).split("-");

      // If dropping on a container (not an item), use the container ID
      const targetBucket =
        toBucket === "core" || toBucket === "growth" || toBucket === "optional"
          ? toBucket
          : String(over.id);

      if (fromBucket !== targetBucket) {
        // Moving between different containers
        setBuckets((buckets) =>
          move(buckets, fromBucket, targetBucket, String(active.id))
        );
      } else {
        // Reordering within the same container
        setBuckets((buckets) =>
          reorder(buckets, fromBucket, String(active.id), String(over.id))
        );
      }
    }
  };

  const handleReset = () => {
    setBuckets({ core: [], growth: [], optional: [] });
    setDailyFocus([]);
    setInputText("");
    setHasOrganized(false);
    clearStorage();
  };

  const handleCopyMarkdown = () => {
    const markdown = Object.entries(buckets)
      .map(([bucketName, items]) => {
        const title = getTranslation(
          language,
          bucketName as keyof typeof buckets
        );
        return (
          `## ${title}\n\n` +
          items.map((item: string) => `- [ ] ${item}`).join("\n")
        );
      })
      .join("\n\n");
    navigator.clipboard.writeText(markdown);
    showToastMessage(
      language === "ko"
        ? "마크다운이 성공적으로 복사되었습니다!"
        : "Markdown copied successfully!",
      "success"
    );
  };

  // 서버 사이드 렌더링 중에는 로딩 상태 표시
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {getTranslation(language, "loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="relative z-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {getTranslation(language, "title")}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getTranslation(language, "subtitle")}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle
                language={language}
                onLanguageChange={setLanguage}
              />
              <ThemeToggle language={language} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* How it works */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {getTranslation(language, "howItWorks")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              {getTranslation(language, "howItWorksDesc")}
            </p>

            {/* 카테고리 설명 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4 border border-rose-200 dark:border-rose-700/50">
                <h3 className="font-semibold text-rose-800 dark:text-rose-200 mb-2">
                  {getTranslation(language, "core")}
                </h3>
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  {getTranslation(language, "coreDesc")}
                </p>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700/50">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                  {getTranslation(language, "growth")}
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  {getTranslation(language, "growthDesc")}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700/50">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {getTranslation(language, "optional")}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {getTranslation(language, "optionalDesc")}
                </p>
              </div>
            </div>
          </div>

          {/* Input - 항상 보임 */}
          <InputBox
            value={inputText}
            onChange={setInputText}
            onOrganize={handleOrganize}
            loading={loading}
            language={language}
            remainingRequests={remainingRequests}
          />

          {/* Results - 정리된 후에만 보임 */}
          {hasOrganized && (
            <>
              {/* Daily Focus */}
              <DailyFocus dailyFocus={dailyFocus} language={language} />

              {/* Board */}
              <Board
                buckets={buckets}
                onDragEnd={handleDragEnd}
                onItemDelete={handleItemDelete}
                language={language}
              />

              {/* Toolbar */}
              <Toolbar
                onReset={handleReset}
                language={language}
                onCopyMarkdown={handleCopyMarkdown}
              />
            </>
          )}
        </div>
      </main>

      {/* Footer - 하단 고정 */}
      <footer className="mt-auto relative z-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getTranslation(language, "madeWith")} 🩵
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <a
                href="https://github.com/hi-rachel/CGO"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                GitHub
              </a>
              <span className="text-gray-400 dark:text-gray-500">•</span>
              <a
                href="mailto:rachel.uiux@gmail.com"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
