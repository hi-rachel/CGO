interface RequestLimit {
  count: number;
  date: string;
  lastRequestTime: number;
}

const REQUEST_LIMIT_KEY = "cgo_request_limit";

// 환경변수로 개발/프로덕션 구분
const isDevelopment = () => {
  return process.env.NODE_ENV === "development";
};

const MAX_REQUESTS_PER_DAY = isDevelopment() ? 100 : 5;

export class RequestLimiter {
  private static getToday(): string {
    return new Date().toDateString();
  }

  private static getCurrentTime(): number {
    return Date.now();
  }

  private static getStoredLimit(): RequestLimit | null {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem(REQUEST_LIMIT_KEY);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  private static saveLimit(limit: RequestLimit): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(REQUEST_LIMIT_KEY, JSON.stringify(limit));
  }

  static canMakeRequest(): {
    allowed: boolean;
    reason?: string;
    remaining?: number;
  } {
    // 개발 모드에서는 제한 없음
    if (isDevelopment()) {
      return { allowed: true, remaining: Infinity };
    }

    const today = this.getToday();
    const stored = this.getStoredLimit();

    // 첫 요청이거나 다른 날짜인 경우
    if (!stored || stored.date !== today) {
      return { allowed: true, remaining: MAX_REQUESTS_PER_DAY };
    }

    // 같은 날짜에서 요청 수 체크
    if (stored.count >= MAX_REQUESTS_PER_DAY) {
      return {
        allowed: false,
        reason: "daily_limit_exceeded",
        remaining: 0,
      };
    }

    // 요청 허용
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_DAY - stored.count,
    };
  }

  // API 호출 성공 시 카운트 증가
  static incrementRequestCount(): void {
    // 개발 모드에서는 카운트하지 않음
    if (isDevelopment()) {
      return;
    }

    const today = this.getToday();
    const stored = this.getStoredLimit();

    if (!stored || stored.date !== today) {
      const newLimit: RequestLimit = {
        count: 1,
        date: today,
        lastRequestTime: 0,
      };
      this.saveLimit(newLimit);
    } else {
      const updatedLimit: RequestLimit = {
        count: stored.count + 1,
        date: today,
        lastRequestTime: 0,
      };
      this.saveLimit(updatedLimit);
    }
  }

  static getRemainingRequests(): number {
    if (isDevelopment()) {
      return Infinity;
    }

    const stored = this.getStoredLimit();
    const today = this.getToday();

    if (!stored || stored.date !== today) {
      return MAX_REQUESTS_PER_DAY;
    }

    return Math.max(0, MAX_REQUESTS_PER_DAY - stored.count);
  }

  static getLastRequestTime(): number | null {
    const stored = this.getStoredLimit();
    return stored?.lastRequestTime || null;
  }

  static reset(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(REQUEST_LIMIT_KEY);
  }
}
