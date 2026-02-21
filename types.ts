export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export interface HijriDate {
  day: string;
  month: {
    en: string;
    ar: string;
    number: number;
  };
  year: string;
  weekday: {
    en: string;
    ar: string;
  };
}

export interface PrayerData {
  timings: PrayerTimings;
  date: {
    readable: string;
    hijri: HijriDate;
  };
  meta: {
    timezone: string;
  };
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface AthkarItem {
  id: number;
  text: string;
  count: number;
  category: 'morning' | 'evening' | 'general';
}

export interface AIContent {
  dua: string;
  healthTip: string;
  charityIdea: string;
}

export interface UserSettings {
  location: { lat: number; lng: number } | null;
  city: string;
  calculationMethod: number; // For Aladhan API
}

export interface KhatamProgress {
  currentDay: number;
  completedDays: number[];
  totalDays: number;
}
