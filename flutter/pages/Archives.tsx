import React, { useState, useMemo } from 'react';
import { Memory, MemoryType } from '../types';
import { MemoryCard } from '../components/MemoryCard';
import { Filter, ChevronLeft, ChevronRight, Video, Music } from 'lucide-react';
import { MONTH_NAMES } from '../constants';

interface ArchivesProps {
  memories: Memory[];
  onDeleteMemory: (id: string) => void;
  onEditMemory: (memory: Memory) => void;
}

export const Archives: React.FC<ArchivesProps> = ({ memories, onDeleteMemory, onEditMemory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<MemoryType | 'ALL'>('ALL');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // --- Calendar Logic ---
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); 
  const startOffset = (firstDayOfMonth + 6) % 7; // Adjust for Monday start

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getMemoriesForDate = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    return memories.filter(m => m.date.startsWith(dateStr));
  };

  const getDayCoverImage = (dayMemories: Memory[]) => {
    const visualMemory = dayMemories.find(m => (m.type === MemoryType.PHOTO || m.type === MemoryType.VIDEO) && m.mediaUrl);
    return visualMemory?.mediaUrl;
  };

  const renderCalendar = () => {
    const days = [];
    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} className="h-20 lg:h-28 bg-transparent"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), d).toISOString().split('T')[0];
      const dayMemories = getMemoriesForDate(d);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;
      const isSelected = selectedDate === dateStr;
      const coverImage = getDayCoverImage(dayMemories);

      days.push(
        <div 
          key={d} 
          onClick={() => setSelectedDate(selectedDate === dateStr ? null : dateStr)} // Toggle selection
          className={`
            relative h-20 lg:h-28 rounded-xl border border-gray-200 dark:border-gray-800 cursor-pointer overflow-hidden transition-all duration-200 group
            ${isSelected ? 'ring-2 ring-blue-500 z-10 scale-[1.05] shadow-lg' : 'hover:border-gray-400 dark:hover:border-gray-600'}
            bg-white dark:bg-gray-900
          `}
        >
          {coverImage && (
             <div className="absolute inset-0">
                <img src={coverImage} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent"></div>
             </div>
          )}

          <span className={`
            absolute top-2 left-2 text-xs font-bold z-20
            ${isToday ? 'bg-blue-600 text-white px-1.5 py-0.5 rounded' : (coverImage ? 'text-white' : 'text-gray-500 dark:text-gray-400')}
          `}>
            {d}
          </span>
          
          {dayMemories.length > 0 && !coverImage && (
             <div className="absolute inset-0 flex items-center justify-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                {dayMemories.length > 1 && <span className="text-[10px] text-gray-500">+{dayMemories.length - 1}</span>}
             </div>
          )}
        </div>
      );
    }
    return days;
  };

  // --- Filtering Logic ---
  const filteredMemories = useMemo(() => {
    return memories.filter(m => {
      // Date Filter (if selected from calendar)
      const matchesDate = selectedDate ? m.date.startsWith(selectedDate) : true;
      
      // Text/Type Filter
      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            m.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = selectedType === 'ALL' || m.type === selectedType;
      
      return matchesSearch && matchesType && matchesDate;
    });
  }, [memories, searchQuery, selectedType, selectedDate]);

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-6 space-y-8 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center">
          <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Anı Kutusu</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Toplam {memories.length} anı saklanıyor.</p>
          </div>
      </div>

      {/* Calendar Section */}
      <div className="bg-white dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white pl-2">
                  {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                  <button onClick={handlePrevMonth} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"><ChevronLeft size={20}/></button>
                  <button onClick={handleNextMonth} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"><ChevronRight size={20}/></button>
              </div>
          </div>
          
          <div className="grid grid-cols-7 mb-2 text-center">
              {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                  <div key={day} className="text-xs font-medium text-gray-400 uppercase tracking-wider">{day}</div>
              ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {renderCalendar()}
          </div>
      </div>

      {/* Filter & List Section */}
      <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
             <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedDate ? `${selectedDate} Tarihli Anılar` : 'Tüm Anılar'}
             </h2>

             <div className="flex items-center gap-3 w-full md:w-auto">
                 <div className="relative flex-1 md:w-64">
                     <input 
                        type="text" 
                        placeholder="Başlık veya etiket ara..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white text-sm"
                     />
                 </div>
                 <select 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as MemoryType | 'ALL')}
                    className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white text-sm"
                 >
                     <option value="ALL">Tümü</option>
                     <option value="PHOTO">Fotoğraflar</option>
                     <option value="VIDEO">Videolar</option>
                     <option value="AUDIO">Ses Kayıtları</option>
                     <option value="TEXT">Notlar</option>
                     <option value="SONG">Şarkılar</option>
                 </select>
             </div>
          </div>

          {/* Grid */}
          {filteredMemories.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                  <Filter size={48} className="mb-4 opacity-50" />
                  <p>Bu kriterlere uygun anı bulunamadı.</p>
                  {(searchQuery || selectedType !== 'ALL' || selectedDate) && (
                    <button 
                        onClick={() => {setSearchQuery(''); setSelectedType('ALL'); setSelectedDate(null);}}
                        className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                        Filtreleri Temizle
                    </button>
                  )}
              </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMemories.map(memory => (
                    <MemoryCard 
                        key={memory.id} 
                        memory={memory} 
                        onDelete={onDeleteMemory}
                        onEdit={onEditMemory}
                    />
                ))}
            </div>
          )}
      </div>
    </div>
  );
};