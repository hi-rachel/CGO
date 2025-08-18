"use client";

import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Buckets } from "../lib/types";
import { Language, getTranslation } from "../lib/i18n";
import Column from "./Column";

interface BoardProps {
  buckets: Buckets;
  onDragEnd: (event: DragEndEvent) => void;
  onItemDelete: (id: string) => void;
  language: Language;
}

export default function Board({
  buckets,
  onDragEnd,
  onItemDelete,
  language,
}: BoardProps) {
  // Generate all item IDs for SortableContext
  const allItemIds = [
    ...buckets.core.map((_, index) => `core-${index}`),
    ...buckets.growth.map((_, index) => `growth-${index}`),
    ...buckets.optional.map((_, index) => `optional-${index}`),
  ];

  const totalItems = allItemIds.length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {getTranslation(language, "itemsTotal")}: {totalItems}
        </h2>
      </div>

      <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SortableContext
            items={allItemIds}
            strategy={verticalListSortingStrategy}
          >
            <Column
              id="core"
              items={buckets.core}
              onItemDelete={onItemDelete}
              language={language}
            />
            <Column
              id="growth"
              items={buckets.growth}
              onItemDelete={onItemDelete}
              language={language}
            />
            <Column
              id="optional"
              items={buckets.optional}
              onItemDelete={onItemDelete}
              language={language}
            />
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
}
