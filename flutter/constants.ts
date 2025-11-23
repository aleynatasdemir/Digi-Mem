import { Memory, MemoryType, User } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Demir',
  email: 'alex@digimem.app',
  avatar: 'https://picsum.photos/200/200'
};

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: '1',
    title: 'Kapadokya Gezisi',
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    type: MemoryType.PHOTO,
    content: 'Balonlar bu sabah büyüleyiciydi.',
    mediaUrl: 'https://picsum.photos/800/600?random=1',
    tags: ['seyahat', 'doğa']
  },
  {
    id: '2',
    title: 'Gitar Pratik Seansı',
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    type: MemoryType.VIDEO,
    content: 'Sonunda o soloyu çalabildim!',
    mediaUrl: 'https://picsum.photos/800/600?random=2', // Placeholder for video thumb
    tags: ['müzik', 'hobi']
  },
  {
    id: '3',
    title: 'Anneanne Tarifi',
    date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    type: MemoryType.AUDIO,
    content: 'Gizli malzemeyi anlattığı ses kaydı.',
    tags: ['aile', 'yemek']
  },
  {
    id: '4',
    title: 'Günlük Notum',
    date: new Date().toISOString(),
    type: MemoryType.TEXT,
    content: 'Bugün çok verimli geçti. Projeyi zamanından önce bitirdim.',
    tags: ['günlük', 'iş']
  },
  {
    id: '5',
    title: 'Sahilde Gün Batımı',
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    type: MemoryType.PHOTO,
    content: 'Altın saat mükemmeldi.',
    mediaUrl: 'https://picsum.photos/800/600?random=3',
    tags: ['doğa', 'huzur']
  }
];

export const MONTH_NAMES = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];