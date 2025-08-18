"use client";

interface ItemCardProps {
  text: string;
  onDelete: () => void;
  isDragging?: boolean;
}

export default function ItemCard({
  text,
  onDelete,
  isDragging = false,
}: ItemCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete();
  };

  return (
    <div
      className={`group relative p-3 rounded-lg border transition-all duration-200 ${
        isDragging
          ? "opacity-50 scale-95 shadow-lg border-blue-400 bg-blue-50 dark:bg-blue-900/20"
          : "bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"
      }`}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-900 dark:text-gray-100 flex-1 pr-2 break-words leading-relaxed">
          {text}
        </p>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleDelete}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 z-10 relative pointer-events-auto"
            title="삭제"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
