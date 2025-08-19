"use client";

import { Language, getTranslation } from "../lib/i18n";

interface ToolbarProps {
  onReset: () => void;
  language: Language;
  onCopyMarkdown: () => void;
}

export default function Toolbar({
  onReset,
  language,
  onCopyMarkdown,
}: ToolbarProps) {
  const handleReset = () => {
    if (window.confirm(getTranslation(language, "confirmReset"))) {
      onReset();
    }
  };

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {getTranslation(language, "aiDriven")}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onCopyMarkdown}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
          >
            {getTranslation(language, "copyMarkdown")}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
          >
            {getTranslation(language, "reset")}
          </button>
        </div>
      </div>
    </div>
  );
}
