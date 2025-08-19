"use client";

import { Language, getTranslation } from "../lib/i18n";

interface InputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onOrganize: () => void;
  loading: boolean;
  language: Language;
  remainingRequests: number;
}

export default function InputBox({
  value,
  onChange,
  onOrganize,
  loading,
  language,
  remainingRequests,
}: InputBoxProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm p-8">
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={getTranslation(language, "placeholder")}
              className="w-full h-56 sm:h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-medium text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-200"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgb(156 163 175) transparent",
              }}
              disabled={loading}
            />
            <div className="absolute bottom-5 right-5 text-xs text-gray-400 dark:text-gray-500">
              {value.split("\n").filter((line) => line.trim()).length}{" "}
              {getTranslation(language, "itemsTotal")}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {getTranslation(language, "firstThingsFirst")}!
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {getTranslation(language, "requestLimitInfo")}
              </p>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-4">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {Math.max(
                  0,
                  Math.min(
                    5,
                    Number.isFinite(remainingRequests) ? remainingRequests : 5
                  )
                )}
              </p>
              <button
                onClick={onOrganize}
                disabled={!value.trim() || loading}
                className="flex-1 sm:flex-none px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">
                      {getTranslation(language, "organizingButton")}
                    </span>
                    <span className="sm:hidden">분석중...</span>
                  </div>
                ) : (
                  <>
                    <span className="hidden sm:inline">
                      {getTranslation(language, "organizeButton")}
                    </span>
                    <span className="sm:hidden">정리하기</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
