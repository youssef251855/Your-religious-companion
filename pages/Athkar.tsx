import React, { useState } from 'react';
import { Sun, Moon, CheckCircle, RotateCcw } from 'lucide-react';

const athkarData = {
  morning: [
    { id: 1, text: "اللّهُـمَّ بِكَ أَصْـبَحْنا وَبِكَ أَمْسَـينا ، وَبِكَ نَحْـيا وَبِكَ نَمُـوتُ وَإِلَـيْكَ النُّـشُور.", count: 1 },
    { id: 2, text: "أَصْبَـحْـنا وَأَصْبَـحْ المُـلكُ للهِ رَبِّ العـالَمـين ، اللّهُـمَّ إِنِّـي أسْـأَلُـكَ خَـيْرَ هـذا الـيَوْم ، فَـتْحَهُ ، وَنَصْـرَهُ ، وَنـورَهُ وَبَـرَكَتَـهُ ، وَهُـداهُ ، وَأَعـوذُ بِـكَ مِـنْ شَـرِّ ما فـيهِ وَشَـرِّ ما بَعْـدَه.", count: 1 },
    { id: 3, text: "سُبْحـانَ اللهِ وَبِحَمْـدِهِ عَدَدَ خَلْـقِه ، وَرِضـا نَفْسِـه ، وَزِنَـةَ عَـرْشِـه ، وَمِـدادَ كَلِمـاتِـه.", count: 3 },
    { id: 4, text: "اللّهُـمَّ عافِـني في بَدَنـي ، اللّهُـمَّ عافِـني في سَمْـعي ، اللّهُـمَّ عافِـني في بَصَـري ، لا إلهَ إلاّ أَنْـتَ.", count: 3 },
  ],
  evening: [
    { id: 5, text: "اللّهُـمَّ بِكَ أَمْسَـينا وَبِكَ أَصْـبَحْنا، وَبِكَ نَحْـيا وَبِكَ نَمُـوتُ وَإِلَـيْكَ الْمَصِير.", count: 1 },
    { id: 6, text: "أَمْسَيْـنا وَأَمْسـى المـلكُ لله وَالحَمدُ لله ، لا إلهَ إلاّ اللّهُ وَحدَهُ لا شَريكَ لهُ ، لهُ المُـلكُ ولهُ الحَمْـد، وهُوَ على كلّ شَيءٍ قدير.", count: 1 },
    { id: 7, text: "أَعـوذُ بِكَلِمـاتِ اللّهِ التّـامّـاتِ مِنْ شَـرِّ ما خَلَـق.", count: 3 },
    { id: 8, text: "يا حَـيُّ يا قَيّـومُ بِـرَحْمَـتِكِ أَسْتَـغـيث ، أَصْلِـحْ لي شَـأْنـي كُلَّـه ، وَلا تَكِلـني إِلى نَفْـسي طَـرْفَةَ عَـين.", count: 1 },
  ]
};

const Athkar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');
  // State to track counts: { [id]: currentCount }
  const [progress, setProgress] = useState<Record<number, number>>({});

  const handleIncrement = (id: number, target: number) => {
    setProgress(prev => {
      const current = prev[id] || 0;
      if (current < target) {
        return { ...prev, [id]: current + 1 };
      }
      return prev;
    });
  };

  const handleReset = () => setProgress({});

  const list = athkarData[activeTab];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-amiri text-gray-800 dark:text-white">الأذكار اليومية</h2>
          <button onClick={handleReset} className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600">
              <RotateCcw size={14} /> إعادة ضبط
          </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
        <button 
            onClick={() => setActiveTab('morning')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition text-sm font-bold ${activeTab === 'morning' ? 'bg-white dark:bg-slate-700 shadow text-amber-600' : 'text-gray-500'}`}
        >
            <Sun size={18} /> أذكار الصباح
        </button>
        <button 
            onClick={() => setActiveTab('evening')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition text-sm font-bold ${activeTab === 'evening' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600' : 'text-gray-500'}`}
        >
            <Moon size={18} /> أذكار المساء
        </button>
      </div>

      <div className="space-y-4">
        {list.map((item) => {
            const current = progress[item.id] || 0;
            const isDone = current >= item.count;
            
            return (
                <div 
                    key={item.id} 
                    onClick={() => handleIncrement(item.id, item.count)}
                    className={`relative p-6 rounded-2xl border transition cursor-pointer select-none ${
                        isDone 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                        : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-primary-300'
                    }`}
                >
                    <p className="font-amiri text-xl leading-relaxed text-gray-800 dark:text-gray-200 mb-4">{item.text}</p>
                    
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-400">
                            التكرار: {item.count}
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-1 rounded-full text-sm font-bold transition ${isDone ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'}`}>
                            {isDone ? <CheckCircle size={16} /> : <span>{current} / {item.count}</span>}
                        </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 h-1 bg-primary-500 transition-all duration-300 rounded-bl-2xl" style={{ width: `${(current / item.count) * 100}%` }}></div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default Athkar;
