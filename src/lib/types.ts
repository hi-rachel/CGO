export type Bucket = "core" | "growth" | "optional";

export interface Buckets {
  core: string[];
  growth: string[];
  optional: string[];
}

export interface DailyFocusItem {
  priority: number;
  task: string;
}

export interface ClassificationResult {
  core: string[];
  growth: string[];
  optional: string[];
  dailyFocus?: DailyFocusItem[];
}
