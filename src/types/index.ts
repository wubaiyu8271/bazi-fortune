// 全局类型定义

export interface UserInfo {
  name: string;
  gender: 'male' | 'female';
  birthDate: string; // YYYY-MM-DD
  birthHour: number; // 0-23
}

export interface FortuneResult {
  bazi: {
    yearPillar: string;
    monthPillar: string;
    dayPillar: string;
    hourPillar: string;
  };
  wuxing: {
    gold: number;
    wood: number;
    water: number;
    fire: number;
    earth: number;
    dominant: string;
    lacking: string;
  };
  personality: {
    summary: string;
    detail: string;
  };
  career: {
    summary: string;
    detail: string;
  };
  marriage: {
    summary: string;
    detail: string;
  };
  wealth: {
    summary: string;
    detail: string;
  };
  health: {
    summary: string;
    detail: string;
  };
  liunian: {
    summary: string;
    detail: string;
  };
}

export type PageState = 'home' | 'form' | 'loading' | 'result' | 'paidResult';
