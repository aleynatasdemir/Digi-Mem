import React from 'react';
import { Memory, MemoryType } from '../types';
import { Image, Video, Mic, FileText, Calendar, Music } from 'lucide-react';

interface MemoryCardProps {
  memory: Memory;
  onDelete?: (id: string) => void;
  onEdit?: (memory: Memory) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onDelete, onEdit }) => {
  const getTypeIcon = () => {
    switch (memory.type) {
      case MemoryType.PHOTO: return <Image size={16} className="text-blue-500" />;
      case MemoryType.VIDEO: return <Video size={16} className="text-purple-500" />;
      case MemoryType.AUDIO: return <Mic size={16} className="text-red-500" />;
      case MemoryType.TEXT: return <FileText size={16} className="text-green-500" />;
      case MemoryType.SONG: return <Music size={16} className="text-amber-500" />;
    }
  };

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Thumbnail Area */}
      <div className="relative h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        {memory.type === MemoryType.PHOTO && memory.mediaUrl ? (
          <img src={memory.mediaUrl} alt={memory.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
        ) : memory.type === MemoryType.VIDEO && memory.mediaUrl ? (
           <div className="relative w-full h-full">
             <img src={memory.mediaUrl} alt="Video thumbnail" className="w-full h-full object-cover opacity-80" />
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-10 h-10 bg-white/30 backdrop-blur rounded-full flex items-center justify-center">
                 <Video className="text-white fill-current" size={20} />
               </div>
             </div>
           </div>
        ) : (
          <div className="text-gray-400 dark:text-gray-500 flex flex-col items-center justify-center">
            {memory.type === MemoryType.AUDIO && <Mic size={40} />}
            {memory.type === MemoryType.TEXT && <FileText size={40} />}
            {memory.type === MemoryType.SONG && <Music size={40} />}
          </div>
        )}
        
        <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 p-1.5 rounded-lg shadow-sm">
          {getTypeIcon()}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <span className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
            <Calendar size={12} className="mr-1" />
            {formatDate(memory.date)}
          </span>
          {/* Actions Dropdown (Simplified as Hover buttons for this demo) */}
          <div className="hidden group-hover:flex gap-2">
            <button 
                onClick={() => onEdit?.(memory)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
                Düzenle
            </button>
            <button 
                onClick={() => onDelete?.(memory.id)}
                className="text-xs text-red-600 dark:text-red-400 hover:underline"
            >
                Sil
            </button>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{memory.title}</h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 flex-1">
          {memory.content || "İçerik yok."}
        </p>

        {/* Tags */}
        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {memory.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};