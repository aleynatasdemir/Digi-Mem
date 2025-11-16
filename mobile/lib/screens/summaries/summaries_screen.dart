import 'package:flutter/material.dart';

// Mock data
const weeklyData = [
  {'day': 'Pzt', 'uploads': 3},
  {'day': 'Sal', 'uploads': 5},
  {'day': 'Çar', 'uploads': 2},
  {'day': 'Per', 'uploads': 4},
  {'day': 'Cum', 'uploads': 7},
  {'day': 'Cmt', 'uploads': 6},
  {'day': 'Paz', 'uploads': 3},
];

const monthlyTrendData = [
  {'week': '1. Hafta', 'uploads': 15},
  {'week': '2. Hafta', 'uploads': 22},
  {'week': '3. Hafta', 'uploads': 18},
  {'week': '4. Hafta', 'uploads': 30},
];

const formatData = {
  'photo': 45,
  'video': 12,
  'audio': 8,
  'text': 23,
  'music': 7,
};

class SummariesScreen extends StatefulWidget {
  const SummariesScreen({super.key});

  @override
  State<SummariesScreen> createState() => _SummariesScreenState();
}

class _SummariesScreenState extends State<SummariesScreen> {
  String? _selectedPeriod;
  
  void _showSummaryTypeDialog(String period) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    period == 'weekly'
                        ? 'Haftalık Özet'
                        : period == 'monthly'
                            ? 'Aylık Özet'
                            : 'Yıllık Özet',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Hangi tür özet oluşturmak istersiniz?',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).hintColor,
                    ),
              ),
              const SizedBox(height: 24),
              _buildSummaryTypeButton(
                context,
                icon: Icons.collections_outlined,
                title: 'Kolaj Oluştur',
                subtitle: 'Anılarınızdan görsel kolaj',
                onTap: () {
                  Navigator.pop(context);
                  _showGeneratingDialog('collage');
                },
              ),
              const SizedBox(height: 12),
              _buildSummaryTypeButton(
                context,
                icon: Icons.bar_chart,
                title: 'İstatistik Özeti',
                subtitle: 'Detaylı istatistik raporu',
                onTap: () {
                  Navigator.pop(context);
                  _showGeneratingDialog('stats');
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryTypeButton(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    final theme = Theme.of(context);
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          border: Border.all(color: theme.dividerColor),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: theme.colorScheme.primary),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.hintColor,
                    ),
                  ),
                ],
              ),
            ),
            Icon(Icons.chevron_right, color: theme.hintColor),
          ],
        ),
      ),
    );
  }

  void _showGeneratingDialog(String type) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircularProgressIndicator(),
              const SizedBox(height: 24),
              Text(
                'Özet Oluşturuluyor',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 8),
              Text(
                type == 'collage'
                    ? 'Anılarınızdan kolaj oluşturuluyor...'
                    : 'İstatistik özeti hazırlanıyor...',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).hintColor,
                    ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
    
    // Auto close after 2 seconds
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Özet oluşturuldu! (Mock mode)'),
            backgroundColor: Colors.green,
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final totalWeekly = weeklyData.fold<int>(0, (sum, day) => sum + (day['uploads'] as int));
    final weeklyAverage = (totalWeekly / 7).toStringAsFixed(1);
    final monthlyAverage = ((totalWeekly / 7) * 30).toStringAsFixed(0);
    
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('Özetler'),
        centerTitle: false,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Text(
              'İstatistikler',
              style: theme.textTheme.displaySmall?.copyWith(
                fontWeight: FontWeight.bold,
                fontSize: 32,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Anılarınızın özeti ve istatistikleri',
              style: theme.textTheme.bodyLarge?.copyWith(
                color: theme.hintColor,
              ),
            ),
            const SizedBox(height: 24),

            // Stats Cards
            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    context,
                    icon: Icons.calendar_today_outlined,
                    title: 'Günlük Ort.',
                    value: weeklyAverage,
                    subtitle: 'anı / gün',
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    context,
                    icon: Icons.calendar_today_outlined,
                    title: 'Haftalık',
                    value: totalWeekly.toString(),
                    subtitle: 'anı / hafta',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _buildStatCard(
              context,
              icon: Icons.calendar_today_outlined,
              title: 'Aylık Ortalama',
              value: monthlyAverage,
              subtitle: 'anı / ay',
            ),
            const SizedBox(height: 24),

            // Weekly Chart
            _buildWeeklyChart(context),
            const SizedBox(height: 24),

            // Monthly Trend
            _buildMonthlyTrend(context),
            const SizedBox(height: 24),

            // Format Distribution
            _buildFormatDistribution(context),
            const SizedBox(height: 32),

            // Create Summary Section
            Text(
              'Özet Oluştur',
              style: theme.textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildSummaryPeriodCard(
                    context,
                    icon: Icons.auto_awesome,
                    title: 'Haftalık\nÖzet',
                    onTap: () => _showSummaryTypeDialog('weekly'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildSummaryPeriodCard(
                    context,
                    icon: Icons.auto_awesome,
                    title: 'Aylık\nÖzet',
                    onTap: () => _showSummaryTypeDialog('monthly'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildSummaryPeriodCard(
                    context,
                    icon: Icons.auto_awesome,
                    title: 'Yıllık\nÖzet',
                    onTap: () => _showSummaryTypeDialog('yearly'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String value,
    required String subtitle,
  }) {
    final theme = Theme.of(context);
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: theme.dividerColor.withOpacity(0.2)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Icon(icon, size: 16, color: theme.hintColor),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: theme.textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              subtitle,
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.hintColor,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWeeklyChart(BuildContext context) {
    final theme = Theme.of(context);
    final maxValue = weeklyData.map((d) => d['uploads'] as int).reduce((a, b) => a > b ? a : b);
    
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: theme.dividerColor.withOpacity(0.2)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Haftalık Yüklemeler',
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Son 7 günün anı yükleme aktivitesi',
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.hintColor,
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              height: 180,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: weeklyData.map((day) {
                  final uploads = day['uploads'] as int;
                  final height = (uploads / maxValue) * 150;
                  return Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Text(
                        uploads.toString(),
                        style: theme.textTheme.labelSmall,
                      ),
                      const SizedBox(height: 4),
                      Container(
                        width: 32,
                        height: height,
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary,
                          borderRadius: const BorderRadius.vertical(
                            top: Radius.circular(4),
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        day['day'] as String,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.hintColor,
                        ),
                      ),
                    ],
                  );
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMonthlyTrend(BuildContext context) {
    final theme = Theme.of(context);
    final maxValue = monthlyTrendData.map((d) => d['uploads'] as int).reduce((a, b) => a > b ? a : b);
    
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: theme.dividerColor.withOpacity(0.2)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Aylık Trend',
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Haftalık bazda yükleme trendi',
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.hintColor,
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              height: 120,
              child: CustomPaint(
                painter: _LinePainter(
                  data: monthlyTrendData.map((d) => d['uploads'] as int).toList(),
                  maxValue: maxValue,
                  color: theme.colorScheme.primary,
                ),
                child: Container(),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: monthlyTrendData.map((week) {
                return Text(
                  week['week'] as String,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.hintColor,
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFormatDistribution(BuildContext context) {
    final theme = Theme.of(context);
    final total = formatData.values.reduce((a, b) => a + b);
    
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: theme.dividerColor.withOpacity(0.2)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Format Dağılımı',
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Yüklenen anıların format bazında dağılımı',
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.hintColor,
              ),
            ),
            const SizedBox(height: 20),
            _buildFormatBar(context, Icons.image_outlined, 'Fotoğraf', formatData['photo']!, total, Colors.blue),
            const SizedBox(height: 16),
            _buildFormatBar(context, Icons.videocam_outlined, 'Video', formatData['video']!, total, Colors.red),
            const SizedBox(height: 16),
            _buildFormatBar(context, Icons.text_fields, 'Metin', formatData['text']!, total, Colors.orange),
            const SizedBox(height: 16),
            _buildFormatBar(context, Icons.mic_outlined, 'Ses', formatData['audio']!, total, Colors.green),
            const SizedBox(height: 16),
            _buildFormatBar(context, Icons.music_note_outlined, 'Şarkı', formatData['music']!, total, Colors.purple),
          ],
        ),
      ),
    );
  }

  Widget _buildFormatBar(BuildContext context, IconData icon, String label, int value, int total, Color color) {
    final theme = Theme.of(context);
    final percentage = (value / total * 100).toInt();
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Icon(icon, size: 16, color: color),
                const SizedBox(width: 8),
                Text(label, style: theme.textTheme.bodyMedium),
              ],
            ),
            Text(
              value.toString(),
              style: theme.textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: value / total,
            minHeight: 8,
            backgroundColor: theme.colorScheme.surfaceVariant,
            valueColor: AlwaysStoppedAnimation<Color>(color),
          ),
        ),
      ],
    );
  }

  Widget _buildSummaryPeriodCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    final theme = Theme.of(context);
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        height: 100,
        decoration: BoxDecoration(
          border: Border.all(color: theme.dividerColor),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 32, color: theme.colorScheme.primary),
            const SizedBox(height: 8),
            Text(
              title,
              style: theme.textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class _LinePainter extends CustomPainter {
  final List<int> data;
  final int maxValue;
  final Color color;

  _LinePainter({
    required this.data,
    required this.maxValue,
    required this.color,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final path = Path();
    final stepX = size.width / (data.length - 1);

    for (int i = 0; i < data.length; i++) {
      final x = i * stepX;
      final y = size.height - (data[i] / maxValue * size.height);
      
      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }

    canvas.drawPath(path, paint);

    // Draw dots
    final dotPaint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    for (int i = 0; i < data.length; i++) {
      final x = i * stepX;
      final y = size.height - (data[i] / maxValue * size.height);
      canvas.drawCircle(Offset(x, y), 4, dotPaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
