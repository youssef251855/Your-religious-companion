import { PrayerData, Surah } from '../types';

// Aladhan API for Prayer Times
export const getPrayerTimes = async (lat: number, lng: number): Promise<PrayerData | null> => {
  try {
    const date = new Date();
    // Method 4 is Umm al-Qura, widely used in Saudi Arabia and favored in many Arab countries.
    // Switching to 4 provides generally better accuracy for the target audience than 3 (MWL).
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${Math.floor(date.getTime() / 1000)}?latitude=${lat}&longitude=${lng}&method=4`
    );
    const data = await response.json();
    if (data.code === 200) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    return null;
  }
};

// Quran Metadata API (Surah List)
export const getSurahList = async (): Promise<Surah[]> => {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await response.json();
    if (data.code === 200) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching Surah list:", error);
    return [];
  }
};

// Audio URL builder (Mishary Alafasy)
export const getAudioUrl = (surahNumber: number): string => {
  const formattedNumber = surahNumber.toString().padStart(3, '0');
  return `https://server8.mp3quran.net/afs/${formattedNumber}.mp3`;
};

// Quran Text API
export const getSurahText = async (surahNumber: number): Promise<any> => {
    try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`);
        const data = await response.json();
        if(data.code === 200) {
            return data.data;
        }
        return null;
    } catch(error) {
        console.error("Error fetching surah text", error);
        return null;
    }
}