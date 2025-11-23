import React from 'react';
import { Memory } from '../types';
import { Image, Video, Mic, FileText, Music, Sparkles } from 'lucide-react';

interface DashboardProps {
  memories: Memory[];
  onAddMemory: () => void;
  onDeleteMemory: (id: string) => void;
  onEditMemory: (memory: Memory) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onAddMemory }) => {
  
  return (
    <div className="h-full flex flex-col p-4 lg:p-6 overflow-hidden animate-fade-in">
      
      {/* Header Section */}
      <div className="flex-shrink-0 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Bugün ne hatırlamak istersin?
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Anılarını ölümsüzleştirmenin en güzel yolu.
        </p>
      </div>

      {/* Non-scrollable Bento Grid */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 min-h-0">
        
        {/* 1. Photo Card (Large, Tall) */}
        <button 
          onClick={onAddMemory} 
          className="col-span-1 md:col-span-1 row-span-2 group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://images.unsplash.com/photo-1554048612-387768052bf7?auto=format&fit=crop&q=80&w=500')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
              <Image size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Fotoğraf</h3>
            <p className="text-blue-100 text-sm text-center px-2">En güzel anlarını görselleştir.</p>
          </div>
        </button>

        {/* 2. Video Card */}
        <button 
          onClick={onAddMemory} 
          className="col-span-1 md:col-span-1 group relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] flex flex-col items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-purple-50 dark:bg-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 relative z-10">
            <Video size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white relative z-10">Video</h3>
        </button>

        {/* 3. Song Card */}
        <button 
          onClick={onAddMemory} 
          className="col-span-1 md:col-span-1 group relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] flex flex-col items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-amber-50 dark:bg-amber-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 relative z-10">
            <Music size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white relative z-10">Şarkı</h3>
        </button>

        {/* 4. Audio/Mic Card (Wide on mobile, normal on desktop) */}
        <button 
          onClick={onAddMemory} 
          className="col-span-2 md:col-span-1 group relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] flex flex-col items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-red-50 dark:bg-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center mb-2 relative z-10">
            <Mic size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white relative z-10">Ses Kaydı</h3>
        </button>

        {/* 5. Note/Journal Card (Wide bottom) */}
        <button 
          onClick={onAddMemory} 
          className="col-span-2 md:col-span-3 group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-800 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-between p-8"
        >
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
           <div className="relative z-10 text-left">
             <h3 className="text-2xl font-bold text-white mb-2">Günlük Notu Al</h3>
             <p className="text-emerald-50 text-sm max-w-xs">Düşüncelerini, şiirlerini veya günün özetini yaz.</p>
           </div>
           <div className="relative z-10 w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <FileText size={28} className="text-white" />
           </div>
        </button>
        
      </div>
      
      {/* Footer Decoration */}
      <div className="flex-shrink-0 mt-4 flex justify-center items-center text-xs text-gray-400 dark:text-gray-500">
        <Sparkles size={12} className="mr-1" />
        <span>Dijital anılarınız güvende</span>
      </div>
    </div>
  );
};