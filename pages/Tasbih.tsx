import React, { useState, useEffect } from 'react';
import { RotateCcw, Save } from 'lucide-react';

const Tasbih: React.FC = () => {
  const [count, setCount] = useState<number>(() => {
    const saved = localStorage.getItem('tasbihCount');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    localStorage.setItem('tasbihCount', count.toString());
  }, [count]);

  const increment = () => {
    setCount(prev => prev + 1);
    setSessionCount(prev => prev + 1);
    
    // Haptic feedback if supported
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
  };

  const reset = () => {
      if (window.confirm("هل تريد تصفير العداد الكلي؟")) {
          setCount(0);
          setSessionCount(0);
      }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold font-amiri text-primary-700 dark:text-primary-400">السبحة الإلكترونية</h2>
        <p className="text-gray-500">فَاذْكُرُونِي أَذْكُرْكُمْ</p>
      </div>

      {/* Main Counter Circle */}
      <button 
        onClick={increment}
        className="w-64 h-64 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 shadow-[inset_0px_4px_10px_rgba(0,0,0,0.1),0px_10px_30px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center active:scale-95 transition-transform duration-100 border-8 border-white dark:border-slate-600 outline outline-4 outline-primary-500/20"
      >
        <span className="text-6xl font-bold font-mono text-gray-800 dark:text-white tabular-nums">{count}</span>
        <span className="text-xs text-gray-400 mt-2">اضغط للتسبيح</span>
      </button>

      {/* Stats */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 w-full max-w-xs flex justify-between items-center">
          <div className="text-center">
              <span className="block text-xs text-gray-400">الجلسة الحالية</span>
              <span className="font-bold text-xl text-primary-600">{sessionCount}</span>
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-slate-700"></div>
          <button onClick={reset} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
              <RotateCcw size={20} />
          </button>
      </div>

      <div className="text-center max-w-sm text-sm text-gray-500 italic">
        "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ"
      </div>
    </div>
  );
};

export default Tasbih;
