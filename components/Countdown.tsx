import React, { useState, useEffect } from 'react';
import { PrayerTimings } from '../types';
import { Clock, Moon, Sun } from 'lucide-react';

interface CountdownProps {
  timings: PrayerTimings | null;
}

const Countdown: React.FC<CountdownProps> = ({ timings }) => {
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00');
  const [nextEvent, setNextEvent] = useState<'Iftar' | 'Suhoor'>('Iftar');

  useEffect(() => {
    if (!timings) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const maghribTime = new Date();
      const fajrTime = new Date();

      const [maghribHours, maghribMinutes] = timings.Maghrib.split(':').map(Number);
      const [fajrHours, fajrMinutes] = timings.Fajr.split(':').map(Number);

      maghribTime.setHours(maghribHours, maghribMinutes, 0);
      fajrTime.setHours(fajrHours, fajrMinutes, 0);

      // Logic:
      // If now < Fajr -> Next is Suhoor (Fajr time)
      // If now > Fajr && now < Maghrib -> Next is Iftar (Maghrib time)
      // If now > Maghrib -> Next is Suhoor (Fajr tomorrow)

      let targetTime: Date;
      let eventName: 'Iftar' | 'Suhoor';

      if (now < fajrTime) {
        targetTime = fajrTime;
        eventName = 'Suhoor';
      } else if (now < maghribTime) {
        targetTime = maghribTime;
        eventName = 'Iftar';
      } else {
        targetTime = fajrTime;
        targetTime.setDate(targetTime.getDate() + 1);
        eventName = 'Suhoor';
      }

      setNextEvent(eventName);

      const diff = targetTime.getTime() - now.getTime();
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Initial call

    return () => clearInterval(timer);
  }, [timings]);

  if (!timings) return <div className="animate-pulse h-32 bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-800 to-primary-600 p-6 text-white shadow-lg">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-gold-500/20 blur-2xl"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-2 mb-2 text-primary-100 bg-black/10 px-4 py-1 rounded-full text-sm backdrop-blur-sm">
           {nextEvent === 'Iftar' ? <Moon size={16} /> : <Sun size={16} />}
           <span>المتبقي على {nextEvent === 'Iftar' ? 'الإفطار' : 'السحور'}</span>
        </div>
        
        <div className="text-5xl md:text-6xl font-bold tracking-wider font-mono my-4 tabular-nums">
          {timeLeft}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-primary-100">
           <Clock size={16} />
           <span>
             {nextEvent === 'Iftar' ? `موعد أذان المغرب: ${timings.Maghrib}` : `موعد أذان الفجر: ${timings.Fajr}`}
           </span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
