import React, { useState, useEffect } from 'react';
import { Memory, MemoryType } from '../types';
import { X, Image, Video, Mic, FileText, UploadCloud, Music } from 'lucide-react';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memory: Omit<Memory, 'id'>) => void;
  initialData?: Memory | null;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<MemoryType>(MemoryType.PHOTO);
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDate(initialData.date.split('T')[0]);
      setType(initialData.type);
      setContent(initialData.content || '');
    } else {
      // Reset
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
      setType(MemoryType.PHOTO);
      setContent('');
      setMediaFile(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      date: new Date(date).toISOString(),
      type,
      content,
      mediaUrl: mediaFile ? URL.createObjectURL(mediaFile) : (initialData?.mediaUrl || `https://picsum.photos/800/600?random=${Math.random()}`),
      tags: ['yeni']
    });
    onClose();
  };

  const typeOptions = [
    { value: MemoryType.PHOTO, icon: <Image size={18} />, label: 'Fotoğraf' },
    { value: MemoryType.VIDEO, icon: <Video size={18} />, label: 'Video' },
    { value: MemoryType.AUDIO, icon: <Mic size={18} />, label: 'Ses' },
    { value: MemoryType.TEXT, icon: <FileText size={18} />, label: 'Not' },
    { value: MemoryType.SONG, icon: <Music size={18} />, label: 'Şarkı' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {initialData ? 'Anıyı Düzenle' : 'Yeni Anı Ekle'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Başlık</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Bu anı ne hakkında?"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tarih</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Anı Türü</label>
            <div className="grid grid-cols-5 gap-2">
              {typeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setType(opt.value)}
                  className={`
                    flex flex-col items-center justify-center p-2 rounded-xl border transition-all
                    ${type === opt.value 
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400' 
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}
                  `}
                >
                  <span className="mb-1">{opt.icon}</span>
                  <span className="text-[10px] font-medium whitespace-nowrap">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload (Conditional) */}
          {type !== MemoryType.TEXT && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Medya</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                  accept={
                    type === MemoryType.PHOTO ? "image/*" : 
                    type === MemoryType.VIDEO ? "video/*" : 
                    "audio/*"
                  }
                />
                <UploadCloud size={32} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {mediaFile ? mediaFile.name : type === MemoryType.SONG ? 'Şarkı dosyasını yükle' : `Dosya yüklemek için tıkla`}
                </p>
              </div>
            </div>
          )}

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Detaylar</label>
            <textarea 
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Hikayeni anlat..."
            />
          </div>

        </form>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3 bg-gray-50 dark:bg-gray-800/50">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            İptal
          </button>
          <button 
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all transform hover:scale-105"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};