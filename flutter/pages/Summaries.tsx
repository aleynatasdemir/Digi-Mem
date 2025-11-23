import React, { useState, useMemo } from 'react';
import { Memory, MemoryType } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Sparkles, TrendingUp, Calendar, Activity, Image as ImageIcon, FileText, ArrowLeft, Grid3X3, ArrowRight, CheckCircle2 } from 'lucide-react';
import { generateMemorySummary } from '../services/geminiService';

interface SummariesProps {
  memories: Memory[];
}

// Wizard Steps
// 1. Select Period Type (Week, Month, Year)
// 2. Select Specific Date Range (DatePicker)
// 3. Select Content Type (Summary Text vs Collage)
// 4. Result

type PeriodType = 'WEEK' | 'MONTH' | 'YEAR';
type GenerationType = 'SUMMARY' | 'COLLAGE';

export const Summaries: React.FC<SummariesProps> = ({ memories }) => {
  // Wizard State
  const [step, setStep] = useState<number>(1);
  const [periodType, setPeriodType] = useState<PeriodType | null>(null);
  const [specificDateValue, setSpecificDateValue] = useState<string>(''); // Stores "2023-W10", "2023-05", or "2023"
  const [generationType, setGenerationType] = useState<GenerationType | null>(null);
  
  // Result State
  const [aiSummary, setAiSummary] = useState<string>('');
  const [collageImages, setCollageImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Stats Calculation
  const stats = useMemo(() => {
    const total = memories.length;
    const thisMonth = memories.filter(m => new Date(m.date).getMonth() === new Date().getMonth()).length;
    
    const types = {
      [MemoryType.PHOTO]: memories.filter(m => m.type === MemoryType.PHOTO).length,
      [MemoryType.VIDEO]: memories.filter(m => m.type === MemoryType.VIDEO).length,
      [MemoryType.AUDIO]: memories.filter(m => m.type === MemoryType.AUDIO).length,
      [MemoryType.TEXT]: memories.filter(m => m.type === MemoryType.TEXT).length,
      [MemoryType.SONG]: memories.filter(m => m.type === MemoryType.SONG).length,
    };

    // Group by date for activity chart
    const activityMap = new Map<string, number>();
    memories.forEach(m => {
        const d = m.date.split('T')[0];
        activityMap.set(d, (activityMap.get(d) || 0) + 1);
    });
    
    // Create array for last 7 days
    const activityData = [];
    for(let i=6; i>=0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const ds = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('tr-TR', { weekday: 'short' });
        activityData.push({
            name: dayName,
            count: activityMap.get(ds) || 0
        });
    }

    const typeData = [
        { name: 'Fotoğraf', value: types[MemoryType.PHOTO], color: '#3b82f6' },
        { name: 'Video', value: types[MemoryType.VIDEO], color: '#a855f7' },
        { name: 'Ses', value: types[MemoryType.AUDIO], color: '#ef4444' },
        { name: 'Not', value: types[MemoryType.TEXT], color: '#10b981' },
        { name: 'Şarkı', value: types[MemoryType.SONG], color: '#f59e0b' },
    ].filter(item => item.value > 0); 

    return { total, thisMonth, typeData, activityData };
  }, [memories]);


  // --- Helpers ---

  const getDateRangeFromSelection = (): { start: Date, end: Date, label: string } | null => {
    if (!periodType || !specificDateValue) return null;

    const start = new Date();
    const end = new Date();
    let label = '';

    try {
        if (periodType === 'WEEK') {
            // format: "2024-W10"
            const [yearStr, weekStr] = specificDateValue.split('-W');
            const year = parseInt(yearStr);
            const week = parseInt(weekStr);
            
            // Simple ISO week calculation
            const simpleDate = new Date(year, 0, 1 + (week - 1) * 7);
            const dayOfWeek = simpleDate.getDay();
            const isoWeekStart = simpleDate;
            if (dayOfWeek <= 4) {
                 isoWeekStart.setDate(simpleDate.getDate() - simpleDate.getDay() + 1);
            } else {
                 isoWeekStart.setDate(simpleDate.getDate() + 8 - simpleDate.getDay());
            }
            
            start.setTime(isoWeekStart.getTime());
            end.setTime(isoWeekStart.getTime());
            end.setDate(end.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            
            label = `${year} ${week}. Hafta`;

        } else if (periodType === 'MONTH') {
            // format: "2024-03"
            const [year, month] = specificDateValue.split('-').map(Number);
            start.setFullYear(year, month - 1, 1);
            start.setHours(0, 0, 0, 0);
            
            end.setFullYear(year, month, 0); // Last day of month
            end.setHours(23, 59, 59, 999);
            
            label = start.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

        } else if (periodType === 'YEAR') {
            // format: "2024"
            const year = parseInt(specificDateValue);
            start.setFullYear(year, 0, 1);
            start.setHours(0, 0, 0, 0);
            
            end.setFullYear(year, 11, 31);
            end.setHours(23, 59, 59, 999);
            
            label = `${year} Yılı`;
        }
    } catch (e) {
        console.error("Date parsing error", e);
        return null;
    }

    return { start, end, label };
  };

  const getFilteredMemories = () => {
    const range = getDateRangeFromSelection();
    if (!range) return [];
    
    return memories.filter(m => {
        const d = new Date(m.date);
        return d >= range.start && d <= range.end;
    });
  };

  // --- Handlers ---

  const handlePeriodTypeSelect = (type: PeriodType) => {
    setPeriodType(type);
    setSpecificDateValue(''); // Reset value when type changes
    setStep(2);
  };

  const handleDateSubmit = () => {
    if (!specificDateValue) return;
    setStep(3);
  };

  const handleContentTypeSelect = async (type: GenerationType) => {
    setGenerationType(type);
    setIsGenerating(true);
    setStep(4);

    const filtered = getFilteredMemories();
    const range = getDateRangeFromSelection();
    
    if (filtered.length === 0) {
        setAiSummary("Seçilen tarih aralığı için herhangi bir anı bulunamadı.");
        setCollageImages([]);
        setIsGenerating(false);
        return;
    }

    if (type === 'SUMMARY') {
        setAiSummary("Gemini anılarını analiz ediyor...");
        const result = await generateMemorySummary(filtered, range?.label || 'bu dönem');
        setAiSummary(result);
    } else {
        // Collage Logic
        setTimeout(() => {
            const images = filtered
                .filter(m => (m.type === MemoryType.PHOTO || m.type === MemoryType.VIDEO) && m.mediaUrl)
                .map(m => m.mediaUrl as string)
                .slice(0, 9);
            setCollageImages(images);
            setAiSummary(images.length === 0 ? "Bu tarihlerde görsel içeren anı bulunamadı." : "");
        }, 1500);
    }
    setIsGenerating(false);
  };

  const resetWizard = () => {
    setStep(1);
    setPeriodType(null);
    setSpecificDateValue('');
    setGenerationType(null);
    setAiSummary('');
    setCollageImages([]);
  };

  // --- Render Steps ---

  const renderStep1_PeriodType = () => (
    <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">1. Hangi dönemi özetleyelim?</h3>
        <div className="grid grid-cols-3 gap-4">
            {[
                { id: 'WEEK', label: 'Haftalık', icon: <Calendar size={20} /> },
                { id: 'MONTH', label: 'Aylık', icon: <Calendar size={20} /> },
                { id: 'YEAR', label: 'Yıllık', icon: <Calendar size={20} /> },
            ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => handlePeriodTypeSelect(item.id as PeriodType)}
                    className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                >
                    <div className="mb-3 text-gray-500 dark:text-gray-400 group-hover:text-blue-500">
                        {item.icon}
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {item.label}
                    </span>
                </button>
            ))}
        </div>
    </div>
  );

  const renderStep2_SpecificDate = () => (
    <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            2. Hangi {periodType === 'WEEK' ? 'hafta' : periodType === 'MONTH' ? 'ay' : 'yıl'}?
        </h3>
        
        <div className="flex flex-col space-y-4">
            {periodType === 'WEEK' && (
                <input 
                    type="week" 
                    value={specificDateValue}
                    onChange={(e) => setSpecificDateValue(e.target.value)}
                    className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
            )}
            {periodType === 'MONTH' && (
                <input 
                    type="month" 
                    value={specificDateValue}
                    onChange={(e) => setSpecificDateValue(e.target.value)}
                    className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
            )}
            {periodType === 'YEAR' && (
                <input 
                    type="number" 
                    min="2000"
                    max={new Date().getFullYear()}
                    placeholder="Örn: 2024"
                    value={specificDateValue}
                    onChange={(e) => setSpecificDateValue(e.target.value)}
                    className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
            )}

            <div className="flex gap-3 pt-2">
                 <button 
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
                >
                    Geri
                </button>
                <button 
                    disabled={!specificDateValue}
                    onClick={handleDateSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    Devam Et <ArrowRight size={18} className="ml-2"/>
                </button>
            </div>
        </div>
    </div>
  );

  const renderStep3_ContentType = () => (
    <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">3. Ne oluşturmak istersin?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
                onClick={() => handleContentTypeSelect('SUMMARY')}
                className="flex items-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:ring-2 ring-blue-500 transition-all text-left group"
            >
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mr-4">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">Hikaye Özeti</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Yapay zeka ile bu dönemin hikayesini yaz.</p>
                </div>
            </button>

            <button
                onClick={() => handleContentTypeSelect('COLLAGE')}
                className="flex items-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:ring-2 ring-purple-500 transition-all text-left group"
            >
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mr-4">
                    <Grid3X3 size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">Anı Kolajı</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bu döneme ait fotoğraflardan bir kolaj oluştur.</p>
                </div>
            </button>
        </div>
        <button 
            onClick={() => setStep(2)}
            className="mt-4 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 underline"
        >
            Tarihi Değiştir
        </button>
    </div>
  );

  const renderStep4_Result = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
                {isGenerating ? (
                    <span className="flex items-center text-blue-600"><Sparkles className="animate-spin mr-2" size={18}/> Oluşturuluyor...</span>
                ) : (
                    <span className="flex items-center text-green-600"><CheckCircle2 className="mr-2" size={18}/> {getDateRangeFromSelection()?.label} Özeti</span>
                )}
            </h3>
            {!isGenerating && (
                <button onClick={resetWizard} className="text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
                    Yeni Oluştur
                </button>
            )}
        </div>
        
        <div className="p-6 min-h-[200px]">
            {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-40 space-y-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 dark:text-gray-400 animate-pulse">
                        {generationType === 'SUMMARY' ? 'Yapay zeka anılarını okuyor...' : 'Fotoğrafların düzenleniyor...'}
                    </p>
                </div>
            ) : (
                <>
                    {generationType === 'SUMMARY' && (
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                                {aiSummary}
                            </p>
                        </div>
                    )}

                    {generationType === 'COLLAGE' && (
                        <div>
                            {collageImages.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2 aspect-square max-w-md mx-auto rounded-xl overflow-hidden shadow-2xl">
                                    {collageImages.map((img, idx) => (
                                        <div key={idx} className={`relative overflow-hidden ${idx === 4 ? 'col-span-1 row-span-1' : ''}`}>
                                            <img src={img} alt="Memory" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-10">
                                    <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                                    <p>{aiSummary || "Gösterilecek görsel bulunamadı."}</p>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-6 space-y-8 pb-20 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analiz ve Özetler</h1>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center transition-transform hover:scale-[1.02]">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-4">
                <Activity className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Anı</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</h3>
            </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center transition-transform hover:scale-[1.02]">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl mr-4">
                <Calendar className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Bu Ay</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.thisMonth}</h3>
            </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center transition-transform hover:scale-[1.02]">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl mr-4">
                <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Haftalık Aktivite</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">+12%</h3>
            </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Son 7 Gün Aktivitesi</h3>
              <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.activityData}>
                          <defs>
                              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10}/>
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', borderRadius: '12px', border: 'none', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                          />
                          <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Type Distribution */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">İçerik Dağılımı</h3>
              <div className="h-64 w-full flex items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={stats.typeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {stats.typeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', borderRadius: '12px', border: 'none', color: '#fff' }}
                        />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {stats.typeData.map((type, idx) => (
                      <div key={idx} className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                          <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: type.color }}></div>
                          {type.name}
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* AI Wizard Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 p-6 lg:p-8 rounded-3xl border border-blue-100 dark:border-gray-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center">
                    <Sparkles className="text-amber-500 mr-2 fill-current" />
                    Sihirli Anı Asistanı
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Seçtiğin tarih aralığındaki anıları senin için harika bir hikayeye veya görsele dönüştürelim.
                </p>
            </div>

            {step === 1 && renderStep1_PeriodType()}
            {step === 2 && renderStep2_SpecificDate()}
            {step === 3 && renderStep3_ContentType()}
            {step === 4 && renderStep4_Result()}
            
        </div>
      </div>

    </div>
  );
};
