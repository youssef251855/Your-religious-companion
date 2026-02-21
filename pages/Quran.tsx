import React, { useState, useEffect, useRef } from 'react';
import { getSurahList, getAudioUrl, getSurahText } from '../services/api';
import { Surah } from '../types';
import { Search, Play, Pause, ChevronRight, Loader2, FileText } from 'lucide-react';

const Quran: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Active state
  const [activeSurah, setActiveSurah] = useState<Surah | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [surahText, setSurahText] = useState<any>(null); // To store ayahs
  const [textLoading, setTextLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchSurahs = async () => {
      const list = await getSurahList();
      setSurahs(list);
      setFilteredSurahs(list);
      setLoading(false);
    };
    fetchSurahs();
  }, []);

  useEffect(() => {
    const filtered = surahs.filter(s => 
      s.name.includes(search) || 
      s.englishName.toLowerCase().includes(search.toLowerCase()) || 
      s.number.toString().includes(search)
    );
    setFilteredSurahs(filtered);
  }, [search, surahs]);

  useEffect(() => {
    if (activeSurah && audioRef.current) {
        audioRef.current.src = getAudioUrl(activeSurah.number);
        audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error(e));
        
        // Fetch text
        setTextLoading(true);
        getSurahText(activeSurah.number).then(data => {
            setSurahText(data);
            setTextLoading(false);
        });
    }
  }, [activeSurah]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleBack = () => {
      setActiveSurah(null);
      setIsPlaying(false);
      setSurahText(null);
      if(audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
      }
  }

  if (loading) return (
      <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
  );

  // Detail View (Reader & Player)
  if (activeSurah) {
      return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm sticky top-0 z-10 border-b dark:border-slate-700">
                <button onClick={handleBack} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
                    <ChevronRight />
                </button>
                <div className="flex-1">
                    <h2 className="text-xl font-bold font-amiri text-primary-700 dark:text-primary-400">{activeSurah.name}</h2>
                    <p className="text-xs text-gray-500">{activeSurah.englishName} • {activeSurah.numberOfAyahs} آية</p>
                </div>
                <button 
                    onClick={togglePlay}
                    className="w-12 h-12 flex items-center justify-center bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition"
                >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                </button>
            </div>

            <audio 
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
            />

            {/* Content */}
            <div className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-3xl shadow-sm min-h-[50vh]">
                {textLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-gray-400" />
                    </div>
                ) : (
                    <div className="text-center">
                         <div className="font-amiri text-2xl md:text-3xl leading-[2.5] md:leading-[3] text-gray-800 dark:text-gray-200" dir="rtl">
                            {activeSurah.number !== 1 && activeSurah.number !== 9 && (
                                <div className="mb-8 block text-primary-600 dark:text-primary-400">
                                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                                </div>
                            )}
                            {surahText?.ayahs.map((ayah: any) => (
                                <span key={ayah.number} className="inline relative group">
                                    {ayah.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '')} 
                                    <span className="inline-flex items-center justify-center w-8 h-8 mx-1 text-sm border border-gold-500 rounded-full text-gold-600 dark:text-gold-400 font-sans number-icon">
                                        {ayah.numberInSurah}
                                    </span>
                                </span>
                            ))}
                         </div>
                    </div>
                )}
            </div>
        </div>
      )
  }

  // List View
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white font-amiri">القرآن الكريم</h2>
        <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="بحث عن سورة..."
                className="w-full md:w-64 pl-4 pr-10 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSurahs.map((surah) => (
          <div 
            key={surah.number}
            onClick={() => setActiveSurah(surah)}
            className="group bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 hover:shadow-md hover:border-primary-500 transition cursor-pointer flex items-center gap-4"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded-full text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:bg-primary-100 group-hover:text-primary-700 transition">
                {surah.number}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold font-amiri text-lg text-gray-800 dark:text-gray-200 group-hover:text-primary-600 transition">{surah.name}</h3>
                    <span className="text-xs text-gray-400">{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{surah.englishName} • {surah.numberOfAyahs} آية</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quran;
