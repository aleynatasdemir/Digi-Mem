import 'package:flutter/material.dart';

// Mock data for calendar
const Map<String, Map<int, MemoryDay>> mockMemories = {
  '2025-11': {
    1: MemoryDay(type: 'photo'),
    3: MemoryDay(type: 'video'),
    5: MemoryDay(type: 'text'),
    7: MemoryDay(type: 'photo'),
    10: MemoryDay(type: 'music'),
    12: MemoryDay(type: 'photo', hasMultiple: true),
    15: MemoryDay(type: 'audio'),
    18: MemoryDay(type: 'photo'),
    20: MemoryDay(type: 'video'),
    22: MemoryDay(type: 'text'),
    25: MemoryDay(type: 'photo'),
    28: MemoryDay(type: 'music'),
  },
  '2025-10': {
    2: MemoryDay(type: 'photo'),
    5: MemoryDay(type: 'video'),
    8: MemoryDay(type: 'text'),
    12: MemoryDay(type: 'photo'),
    15: MemoryDay(type: 'audio'),
    18: MemoryDay(type: 'photo', hasMultiple: true),
    21: MemoryDay(type: 'music'),
    25: MemoryDay(type: 'photo'),
    29: MemoryDay(type: 'video'),
    31: MemoryDay(type: 'photo'),
  },
};

class MemoryDay {
  final String type;
  final bool hasMultiple;

  const MemoryDay({required this.type, this.hasMultiple = false});
}

class MemoriesBoxScreen extends StatefulWidget {
  const MemoriesBoxScreen({super.key});

  @override
  State<MemoriesBoxScreen> createState() => _MemoriesBoxScreenState();
}

class _MemoriesBoxScreenState extends State<MemoriesBoxScreen> {
  String? _selectedMonth;
  int? _selectedDay;

  final _monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  final _dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('Anı Kutusu'),
        centerTitle: false,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildMonthCalendar(context, '2025-11', 'Kasım 2025'),
            const SizedBox(height: 32),
            _buildMonthCalendar(context, '2025-10', 'Ekim 2025'),
          ],
        ),
      ),
    );
  }

  Widget _buildMonthCalendar(BuildContext context, String monthKey, String title) {
    final theme = Theme.of(context);
    final year = int.parse(monthKey.split('-')[0]);
    final month = int.parse(monthKey.split('-')[1]);
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: theme.textTheme.headlineMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        
        // Days of week header
        Row(
          children: _dayNames.map((day) {
            return Expanded(
              child: Center(
                child: Text(
                  day,
                  style: theme.textTheme.bodySmall?.copyWith(
                    fontWeight: FontWeight.w500,
                    color: theme.hintColor,
                  ),
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 8),
        
        // Calendar grid
        _buildCalendarGrid(context, monthKey, year, month),
      ],
    );
  }

  Widget _buildCalendarGrid(BuildContext context, String monthKey, int year, int month) {
    final theme = Theme.of(context);
    final firstDay = DateTime(year, month, 1);
    final lastDay = DateTime(year, month + 1, 0);
    final daysInMonth = lastDay.day;
    final startingDayOfWeek = (firstDay.weekday - 1) % 7;

    final cells = <Widget>[];
    
    // Empty cells
    for (int i = 0; i < startingDayOfWeek; i++) {
      cells.add(const AspectRatio(aspectRatio: 1, child: SizedBox()));
    }

    // Day cells
    for (int day = 1; day <= daysInMonth; day++) {
      final memory = mockMemories[monthKey]?[day];
      cells.add(_buildDayCell(context, day, memory, monthKey));
    }

    return GridView.count(
      crossAxisCount: 7,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 8,
      crossAxisSpacing: 8,
      children: cells,
    );
  }

  Widget _buildDayCell(BuildContext context, int day, MemoryDay? memory, String monthKey) {
    final theme = Theme.of(context);
    final hasMemory = memory != null;

    return GestureDetector(
      onTap: hasMemory
          ? () {
              setState(() {
                _selectedMonth = monthKey;
                _selectedDay = day;
              });
              _showMemoryDetail(context, monthKey, day, memory);
            }
          : null,
      child: Container(
        decoration: BoxDecoration(
          color: hasMemory
              ? theme.colorScheme.primary.withOpacity(0.05)
              : theme.cardColor.withOpacity(0.5),
          border: Border.all(
            color: hasMemory
                ? theme.colorScheme.primary.withOpacity(0.3)
                : theme.dividerColor.withOpacity(0.2),
            width: 2,
          ),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Stack(
          children: [
            // Day number
            Positioned(
              top: 2,
              left: 2,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                decoration: BoxDecoration(
                  color: hasMemory
                      ? theme.colorScheme.primary
                      : theme.colorScheme.surfaceVariant,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  day.toString(),
                  style: theme.textTheme.labelSmall?.copyWith(
                    color: hasMemory ? Colors.white : theme.hintColor,
                    fontWeight: FontWeight.bold,
                    fontSize: 10,
                  ),
                ),
              ),
            ),
            
            // Media icon
            if (memory != null)
              Center(
                child: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.surface.withOpacity(0.9),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    _getIconForType(memory.type),
                    size: 16,
                    color: theme.colorScheme.primary,
                  ),
                ),
              ),
            
            // Multiple indicator
            if (memory?.hasMultiple == true)
              Positioned(
                bottom: 2,
                right: 2,
                child: Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary,
                    shape: BoxShape.circle,
                  ),
                  child: const Center(
                    child: Text(
                      '•',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 8,
                        height: 1,
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  IconData _getIconForType(String type) {
    switch (type) {
      case 'photo':
        return Icons.image_outlined;
      case 'video':
        return Icons.videocam_outlined;
      case 'audio':
        return Icons.mic_outlined;
      case 'text':
        return Icons.text_fields;
      case 'music':
        return Icons.music_note_outlined;
      default:
        return Icons.image_outlined;
    }
  }

  void _showMemoryDetail(BuildContext context, String monthKey, int day, MemoryDay memory) {
    final theme = Theme.of(context);
    final monthIndex = int.parse(monthKey.split('-')[1]) - 1;
    final year = monthKey.split('-')[0];

    showDialog(
      context: context,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '$day ${_monthNames[monthIndex]} $year',
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceVariant.withOpacity(0.3),
                  border: Border.all(color: theme.dividerColor),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Center(
                  child: Column(
                    children: [
                      Icon(
                        _getIconForType(memory.type),
                        size: 48,
                        color: theme.colorScheme.primary,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Anı içeriği burada görüntülenecek',
                        style: theme.textTheme.bodyLarge?.copyWith(
                          color: theme.hintColor,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Tip: ${memory.type}',
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.hintColor,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
