"use client";

import { DailyFocusItem } from "../lib/types";
import { Language, getTranslation } from "../lib/i18n";

interface DailyFocusProps {
  dailyFocus: DailyFocusItem[];
  language: Language;
}

export default function DailyFocus({ dailyFocus, language }: DailyFocusProps) {
  if (dailyFocus.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {getTranslation(language, "dailyFocus")}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {getTranslation(language, "focusTip")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dailyFocus.map((item) => (
          <div
            key={item.priority}
            className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-700/50 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="absolute top-4 right-4 w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                {item.priority}
              </span>
            </div>

            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-3">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {getTranslation(language, "priority")} {item.priority}
                </span>
              </div>

              <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
                {item.task}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
