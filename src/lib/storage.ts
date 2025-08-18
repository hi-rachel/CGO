import { Buckets, DailyFocusItem } from "./types";
import { Language } from "./i18n";

interface StorageData {
  buckets: Buckets;
  dailyFocus: DailyFocusItem[];
  inputText: string;
  language: Language;
  hasOrganized: boolean;
}

const STORAGE_KEY = "cgo-app-data";

export function saveToStorage(data: StorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("localStorage 저장 실패:", error);
    }
  }
}

export function loadFromStorage(): StorageData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored);

    // 이전 TaskItem 구조의 데이터를 현재 string[] 구조로 변환
    if (data.buckets && data.buckets.core && data.buckets.core.length > 0) {
      // 첫 번째 아이템이 객체인지 확인 (TaskItem 구조)
      const firstItem = data.buckets.core[0];
      if (
        typeof firstItem === "object" &&
        firstItem !== null &&
        "text" in firstItem
      ) {
        // TaskItem[] 구조를 string[] 구조로 변환
        const convertToStringArray = (items: unknown[]): string[] => {
          return items.map((item) => {
            if (typeof item === "object" && item !== null && "text" in item) {
              return (item as { text: string }).text;
            }
            return String(item);
          });
        };

        return {
          ...data,
          buckets: {
            core: convertToStringArray(data.buckets.core || []),
            growth: convertToStringArray(data.buckets.growth || []),
            optional: convertToStringArray(data.buckets.optional || []),
          },
        };
      }
    }

    return data;
  } catch {
    // 오류 발생 시 localStorage를 완전히 지움
    clearStorage();
    return null;
  }
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("localStorage 삭제 실패:", error);
    }
  }
}

// 모든 CGO 관련 localStorage 데이터를 지우는 함수
export function clearAllCGOStorage(): void {
  try {
    // 모든 CGO 관련 키를 찾아서 지움
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.includes("cgo") || key.includes("CGO")) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("localStorage 전체 삭제 실패:", error);
    }
  }
}
