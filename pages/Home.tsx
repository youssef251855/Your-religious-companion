import React, { useEffect, useState } from 'react';
import Countdown from '../components/Countdown';
import { getPrayerTimes } from '../services/api';
import { getDailyAIContent } from '../services/geminiService';
import { PrayerData, AIContent } from '../types';
import { MapPin, Calendar, Loader2, Sparkles, Heart, Activity } from 'lucide-react';

const Home: React.FC = () => {
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiContent, setAiContent] = useState<AIContent | null>(null);

  useEffect(() => {
    // 1. Get Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Fetch Prayer Times
          const data = await getPrayerTimes(latitude, longitude);
          if (data) {
            setPrayerData(data);
            localStorage.setItem('cachedLocation', JSON.stringify({ lat: latitude, lng: longitude }));
          } else {
            setError("فشل في جلب مواقيت الصلاة");
          }
          setLoading(false);
        },
        (err) => {
          console.error(err);
          setError("يرجى تفعيل الموقع الجغرافي للحصول على مواقيت دقيقة");
          setLoading(false);
          // Try to load cached
          const cached = localStorage.getItem('cachedLocation');
          if(cached) {
            const {lat, lng} = JSON.parse(cached);
            getPrayerTimes(lat, lng).then(data => data && setPrayerData(data));
          }
        }
      );
    } else {
      setError("المتصفح لا يدعم تحديد الموقع");
      setLoading(false);
    }

    // 2. Get AI Content
    const fetchAI = async () => {
        // Check local storage for today's content to save API calls
        const today = new Date().toDateString();
        const savedAI = localStorage.getItem('dailyAIContent');
        
        if (savedAI) {
            const parsed = JSON.parse(savedAI);
            if (parsed.date === today) {
                setAiContent(parsed.content);
                return;
            }
        }

        const content = await getDailyAIContent();
        if (content) {
            setAiContent(content);
            localStorage.setItem('dailyAIContent', JSON.stringify({ date: today, content }));
        }
    };
    fetchAI();

  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-primary-600" size={48} />
        <p className="text-gray-500">جاري تحديد موقعك وجلب المواقيت...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greeting Section */}
      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white font-amiri mb-1">رمضان كريم</h2>
            <p className="text-gray-500 dark:text-gray-400">تقبل الله منا ومنكم صالح الأعمال</p>
        </div>
        <div className="text-left text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-end gap-1">
                <Calendar size={14} />
                <span>{prayerData?.date.hijri.day} {prayerData?.date.hijri.month.ar} {prayerData?.date.hijri.year}</span>
            </div>
            <div>{prayerData?.date.readable}</div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm">
            {error}
        </div>
      )}

      {/* Countdown Card */}
      <Countdown timings={prayerData?.timings || null} />

      {/* Prayer Times Grid */}
      {prayerData && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {Object.entries({
                'الفجر': prayerData.timings.Fajr,
                'الشروق': prayerData.timings.Sunrise,
                'الظهر': prayerData.timings.Dhuhr,
                'العصر': prayerData.timings.Asr,
                'المغرب': prayerData.timings.Maghrib,
                'العشاء': prayerData.timings.Isha
            }).map(([name, time]) => (
                <div key={name} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 text-center flex flex-col items-center justify-center hover:shadow-md transition">
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{name}</span>
                    <span className="font-bold text-lg text-primary-700 dark:text-primary-400 font-mono">{time.split(' ')[0]}</span>
                </div>
            ))}
        </div>
      )}

      {/* AI Daily Insights */}
      {aiContent && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Dua Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                <div className="flex items-center gap-2 mb-3 text-indigo-600 dark:text-indigo-400 font-bold">
                    <Sparkles size={18} />
                    <h3>دعاء اليوم</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-amiri text-lg leading-relaxed">
                    "{aiContent.dua}"
                </p>
            </div>

            {/* Health Tip */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 rounded-2xl border border-green-100 dark:border-green-800/50">
                <div className="flex items-center gap-2 mb-3 text-green-600 dark:text-green-400 font-bold">
                    <Activity size={18} />
                    <h3>نصيحة صحية</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {aiContent.healthTip}
                </p>
            </div>

             {/* Charity Idea */}
             <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-5 rounded-2xl border border-orange-100 dark:border-orange-800/50">
                <div className="flex items-center gap-2 mb-3 text-orange-600 dark:text-orange-400 font-bold">
                    <Heart size={18} />
                    <h3>فكرة صدقة</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {aiContent.charityIdea}
                </p>
            </div>
        </div>
      )}
      
      {/* Location Info */}
      <div className="flex justify-center text-gray-400 text-xs items-center gap-1">
        <MapPin size={12} />
        <span>{prayerData?.meta.timezone || 'تحديد المنطقة تلقائي'}</span>
      </div>

    </div>
  );
};

export default Home;
