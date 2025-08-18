"use client";

import { useDroppable } from "@dnd-kit/core";
import { Language, getTranslation } from "../lib/i18n";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ItemCard from "./ItemCard";

interface SortableItemProps {
  id: string;
  text: string;
  onDelete: () => void;
}

function SortableItem({ id, text, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="touch-none">
      <div {...listeners} className="cursor-grab active:cursor-grabbing">
        <ItemCard text={text} onDelete={onDelete} isDragging={isDragging} />
      </div>
    </div>
  );
}

interface ColumnProps {
  id: string;
  items: string[];
  onItemDelete: (id: string) => void;
  language: Language;
}

const getBucketConfig = (id: string, language: Language) => {
  const configs = {
    core: {
      title: getTranslation(language, "core"),
      color:
        "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700/50",
      textColor: "text-rose-800 dark:text-rose-200",
      accentColor: "bg-rose-100 dark:bg-rose-800/50",
      dropColor:
        "bg-rose-100 dark:bg-rose-800/50 border-rose-300 dark:border-rose-600",
    },
    growth: {
      title: getTranslation(language, "growth"),
      color:
        "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/50",
      textColor: "text-emerald-800 dark:text-emerald-200",
      accentColor: "bg-emerald-100 dark:bg-emerald-800/50",
      dropColor:
        "bg-emerald-100 dark:bg-emerald-800/50 border-emerald-300 dark:border-emerald-600",
    },
    optional: {
      title: getTranslation(language, "optional"),
      color:
        "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50",
      textColor: "text-gray-800 dark:text-gray-200",
      accentColor: "bg-gray-100 dark:bg-gray-700/50",
      dropColor:
        "bg-gray-100 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600",
    },
  };

  return configs[id as keyof typeof configs] || configs.optional;
};

export default function Column({
  id,
  items,
  onItemDelete,
  language,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const config = getBucketConfig(id, language);

  return (
    <div className="flex-1 min-w-0">
      <div
        className={`p-4 rounded-2xl border transition-all duration-200 ${
          isOver
            ? `${config.dropColor} shadow-lg scale-[1.02]`
            : `${config.color} hover:shadow-md`
        } h-full`}
      >
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.accentColor} ${config.textColor} mb-4`}
        >
          {config.title}
        </div>

        <div className="mb-4">
          <p
            className={`text-xs ${config.textColor} opacity-80 leading-relaxed`}
          >
            {id === "core" && getTranslation(language, "coreDesc")}
            {id === "growth" && getTranslation(language, "growthDesc")}
            {id === "optional" && getTranslation(language, "optionalDesc")}
          </p>
        </div>

        <div
          ref={setNodeRef}
          className={`space-y-3 min-h-[200px] transition-all duration-200 ${
            isOver ? "bg-white/50 dark:bg-gray-800/50 rounded-lg p-2" : ""
          }`}
        >
          {items.map((item, index) => (
            <SortableItem
              key={`${id}-${index}`}
              id={`${id}-${index}`}
              text={item}
              onDelete={() => onItemDelete(`${id}-${index}`)}
            />
          ))}

          {items.length === 0 && (
            <div
              className={`text-center text-sm py-8 rounded-lg border-2 border-dashed transition-all duration-200 ${
                isOver
                  ? "border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
              }`}
            >
              {isOver
                ? language === "ko"
                  ? "여기에 놓으세요"
                  : "Drop here"
                : getTranslation(language, "noItemsYet")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
