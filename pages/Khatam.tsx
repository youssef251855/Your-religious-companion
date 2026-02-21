import React, { useState, useEffect } from 'react';
import { Check, Trophy } from 'lucide-react';

const TOTAL_PAGES = 604;
const RAMADAN_DAYS = 30;

const Khatam: React.FC = () => {
  const [targetDays, setTargetDays] = useState(30);
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    const saved = localStorage.getItem('khatamProgress');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('khatamProgress', JSON.stringify(completedDays));
  }, [completedDays]);

  const pagesPerDay = Math.ceil(TOTAL_PAGES / targetDays);

  const toggleDay = (day: number) => {
    if (completedDays.includes(day)) {
      setCompletedDays(prev => prev.filter(d => d !== day));
    } else {
      setCompletedDays(prev => [...prev, day]);
    }
  };

  const progress = Math.round((completedDays.length / targetDays) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold font-amiri text-gray-800 dark:text-white">جدول ختم القرآن</h2>
            <p className="text-gray-500 text-sm">تتبع تقدمك في ختم المصحف الشريف</p>
        </div>
        <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border text-sm flex items-center gap-2">
            <span>الهدف:</span>
            <select 
                value={targetDays} 
                onChange={(e) => setTargetDays(Number(e.target.value))}
                className="bg-transparent font-bold text-primary-600 outline-none"
            >
                <option value="10">10 أيام (3 أجزاء/يوم)</option>
                <option value="15">15 يوم (جزئين/يوم)</option>
                <option value="30">30 يوم (جزء/يوم)</option>
            </select>
        </div>
       </div>

       {/* Progress Bar */}
       <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
           <div className="flex justify-between items-center mb-2">
               <span className="font-bold text-gray-700 dark:text-gray-300">نسبة الإنجاز</span>
               <span className="text-primary-600 font-bold">{progress}%</span>
           </div>
           <div className="w-full bg-gray-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
               <div className="bg-primary-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
           </div>
           <p className="mt-4 text-center text-sm text-gray-500">
               المعدل اليومي المطلوب: <span className="font-bold text-primary-600">{pagesPerDay} صفحة</span> (تقريباً)
           </p>
       </div>

       {/* Grid */}
       <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
           {Array.from({ length: targetDays }, (_, i) => i + 1).map((day) => {
               const isCompleted = completedDays.includes(day);
               const startPage = (day - 1) * pagesPerDay + 1;
               const endPage = Math.min(day * pagesPerDay, TOTAL_PAGES);

               return (
                   <div 
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition flex flex-col items-center justify-center h-32 text-center group ${
                            isCompleted 
                            ? 'bg-primary-500 border-primary-500 text-white' 
                            : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-primary-300'
                        }`}
                   >
                       <span className={`text-lg font-bold ${isCompleted ? 'text-white' : 'text-gray-800 dark:text-white'}`}>اليوم {day}</span>
                       <span className={`text-xs mt-1 ${isCompleted ? 'text-white/80' : 'text-gray-400'}`}>
                           ص {startPage} - {endPage}
                       </span>
                       
                       {isCompleted && (
                           <div className="absolute top-2 right-2">
                               <Check size={16} />
                           </div>
                       )}
                   </div>
               );
           })}
       </div>
       
       {progress === 100 && (
           <div className="text-center p-8 bg-gold-50 dark:bg-yellow-900/10 rounded-3xl border border-gold-200 dark:border-yellow-700">
               <Trophy className="mx-auto text-gold-500 mb-4" size={48} />
               <h3 className="text-2xl font-bold text-gold-600 dark:text-gold-400 font-amiri">مبارك! لقد أتممت الختمة</h3>
               <p className="text-gray-600 dark:text-gray-300">تقبل الله منك وجعله في ميزان حسناتك</p>
           </div>
       )}
    </div>
  );
};

export default Khatam;
