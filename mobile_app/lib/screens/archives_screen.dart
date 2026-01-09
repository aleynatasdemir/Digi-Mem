import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:table_calendar/table_calendar.dart';
import '../services/memory_service.dart';
import '../models/memory.dart';
import '../widgets/memory_card.dart';

class ArchivesScreen extends StatefulWidget {
  const ArchivesScreen({Key? key}) : super(key: key);

  @override
  State<ArchivesScreen> createState() => _ArchivesScreenState();
}

class _ArchivesScreenState extends State<ArchivesScreen> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  CalendarFormat _calendarFormat = CalendarFormat.month;
  String _searchQuery = '';
  String _selectedType = 'ALL';

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Anı Kutusu',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                Consumer<MemoryService>(
                  builder: (context, service, _) => Text(
                    'Toplam ${service.memories.length} anı saklanıyor.',
                    style: TextStyle(
                      color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.7),
                      fontSize: 13
                    ),
                  ),
                ),
              ],
            ),
          ),
          _buildTableCalendar(),
          const Divider(height: 1),
          _buildFilters(),
          Expanded(
            child: _buildMemoriesList(),
          ),
        ],
      ),
    );
  }

  Widget _buildTableCalendar() {
    return Consumer<MemoryService>(
      builder: (context, service, _) {
        return TableCalendar(
          firstDay: DateTime.utc(2020, 1, 1),
          lastDay: DateTime.now().add(const Duration(days: 365)),
          focusedDay: _focusedDay,
          calendarFormat: _calendarFormat,
          selectedDayPredicate: (day) {
            return isSameDay(_selectedDay, day);
          },
          onDaySelected: (selectedDay, focusedDay) {
            if (!isSameDay(_selectedDay, selectedDay)) {
              setState(() {
                _selectedDay = selectedDay;
                _focusedDay = focusedDay;
              });
            } else {
               setState(() {
                _selectedDay = null;
                _focusedDay = focusedDay;
              });
            }
          },
          onFormatChanged: (format) {
            if (_calendarFormat != format) {
              setState(() {
                _calendarFormat = format;
              });
            }
          },
          onPageChanged: (focusedDay) {
            _focusedDay = focusedDay;
          },
          eventLoader: (day) {
            return _getMemoriesForDate(day, service.memories);
          },
          calendarStyle: CalendarStyle(
            markerDecoration: BoxDecoration(
              color: Theme.of(context).primaryColor,
              shape: BoxShape.circle,
            ),
            selectedDecoration: BoxDecoration(
              color: Theme.of(context).primaryColor,
              shape: BoxShape.circle,
            ),
            todayDecoration: BoxDecoration(
              color: Theme.of(context).primaryColor.withOpacity(0.5),
              shape: BoxShape.circle,
            ),
          ),
          headerStyle: HeaderStyle(
            formatButtonVisible: false,
            titleCentered: true,
            titleTextStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
        );
      },
    );
  }

  List<Memory> _getMemoriesForDate(DateTime date, List<Memory> memories) {
    return memories.where((memory) {
      final checkDate = memory.memoryDate ?? memory.createdAt;
      return isSameDay(checkDate, date);
    }).toList();
  }

  Widget _buildFilters() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Başlık veya etiket ara...',
                prefixIcon: const Icon(Icons.search, size: 20),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey[300]!),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey[300]!),
                ),
              ),
              onChanged: (value) => setState(() => _searchQuery = value),
            ),
          ),
          const SizedBox(width: 8),
          DropdownButton<String>(
            value: _selectedType,
            borderRadius: BorderRadius.circular(12),
            underline: Container(),
            items: const [
              DropdownMenuItem(value: 'ALL', child: Text('Tümü')),
              DropdownMenuItem(value: 'PHOTO', child: Text('Fotoğraf')),
              DropdownMenuItem(value: 'VIDEO', child: Text('Video')),
              DropdownMenuItem(value: 'AUDIO', child: Text('Ses')),
              DropdownMenuItem(value: 'TEXT', child: Text('Not')),
              DropdownMenuItem(value: 'SONG', child: Text('Şarkı')),
            ],
            onChanged: (value) {
              if (value != null) {
                setState(() => _selectedType = value);
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildMemoriesList() {
    return Consumer<MemoryService>(
      builder: (context, service, _) {
        final filteredMemories = service.memories.where((memory) {
          final checkDate = memory.memoryDate ?? memory.createdAt;
          final matchesDate = _selectedDay == null || isSameDay(checkDate, _selectedDay);

          final matchesSearch = _searchQuery.isEmpty ||
              (memory.title ?? '').toLowerCase().contains(_searchQuery.toLowerCase()) ||
              (memory.tags?.any((tag) =>
                      (tag ?? '').toLowerCase().contains(_searchQuery.toLowerCase())) ??
                  false);

          final matchesType =
              _selectedType == 'ALL' || memory.type == _selectedType;

          return matchesDate && matchesSearch && matchesType;
        }).toList();
        
        // Tarihe göre grupla ve en yeniden eskiye sırala
        final groupedMemories = _groupMemoriesByDate(filteredMemories);
        final sortedDates = groupedMemories.keys.toList()..sort((a, b) => b.compareTo(a));

        if (filteredMemories.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.filter_list_off, size: 64, color: Colors.grey[400]),
                const SizedBox(height: 16),
                Text(
                  'Bu kriterlere uygun anı bulunamadı',
                  style: TextStyle(color: Colors.grey[600]),
                ),
                if (_searchQuery.isNotEmpty ||
                    _selectedType != 'ALL' ||
                    _selectedDay != null)
                  TextButton(
                    onPressed: () {
                      setState(() {
                        _searchQuery = '';
                        _selectedType = 'ALL';
                        _selectedDay = null;
                      });
                    },
                    child: const Text('Filtreleri Temizle'),
                  ),
              ],
            ),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: sortedDates.length,
          itemBuilder: (context, dateIndex) {
            final date = sortedDates[dateIndex];
            final memoriesForDate = groupedMemories[date]!;
            
            final months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
            final dateString = '${date.day} ${months[date.month - 1]} ${date.year}';
            
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.only(bottom: 12, top: 12),
                  child: Text(
                    dateString,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.75,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  itemCount: memoriesForDate.length,
                  itemBuilder: (context, index) {
                    return MemoryCard(memory: memoriesForDate[index]);
                  },
                ),
                const SizedBox(height: 16),
              ],
            );
          },
        );
      },
    );
  }

  Map<DateTime, List<Memory>> _groupMemoriesByDate(List<Memory> memories) {
    final grouped = <DateTime, List<Memory>>{};
    
    for (var memory in memories) {
      final checkDate = memory.memoryDate ?? memory.createdAt;
      final dateKey = DateTime(checkDate.year, checkDate.month, checkDate.day);
      
      if (!grouped.containsKey(dateKey)) {
        grouped[dateKey] = [];
      }
      grouped[dateKey]!.add(memory);
    }
    
    return grouped;
  }
}
