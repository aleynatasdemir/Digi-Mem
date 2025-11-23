import React from 'react';
import { User, Memory } from '../types';
import { Edit2, LogOut } from 'lucide-react';

interface ProfileProps {
  user: User;
  memories: Memory[];
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, memories, onLogout }) => {
  
  // Calculate basic stats for the bottom card
  const totalMemories = memories.length;
  const currentMonth = new Date().getMonth();
  const memoriesThisMonth = memories.filter(m => new Date(m.date).getMonth() === currentMonth).length;
  
  // Mock "This Week" calculation
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const memoriesThisWeek = memories.filter(m => new Date(m.date) >= oneWeekAgo).length;

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-6 animate-fade-in">
      <div className="max-w-2xl mx-auto pt-4">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Profil Bilgileri</h1>
            <p className="text-gray-400">Kişisel bilgilerinizi görüntüleyin ve düzenleyin</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl text-white hover:bg-gray-700 transition-colors text-sm">
            <Edit2 size={16} className="mr-2" />
            Düzenle
          </button>
        </div>

        {/* Avatar */}
        <div className="mb-10 flex justify-center md:justify-start">
          <div className="w-24 h-24 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 mb-10 border-b border-gray-800 pb-10">
          <div>
            <label className="block text-sm font-medium text-white mb-2 flex items-center">
              <span className="mr-2">Ad Soyad</span>
            </label>
            <div className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white">
              {user.name}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2 flex items-center">
              <span className="mr-2">E-posta</span>
            </label>
            <div className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white">
              {user.email}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2 flex items-center">
              <span className="mr-2">Üyelik Tarihi</span>
            </label>
            <div className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white">
              16 Kasım 2025
            </div>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-1">İstatistikler</h3>
          <p className="text-gray-500 text-sm mb-6">Hesap aktivite özeti</p>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-500 text-sm mb-1">Toplam Anı</p>
              <p className="text-2xl font-bold text-white">{totalMemories}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Bu Ay</p>
              <p className="text-2xl font-bold text-white">{memoriesThisMonth}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Bu Hafta</p>
              <p className="text-2xl font-bold text-white">{memoriesThisWeek}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center"
        >
          <LogOut size={20} className="mr-2" />
          Çıkış Yap
        </button>

      </div>
    </div>
  );
};