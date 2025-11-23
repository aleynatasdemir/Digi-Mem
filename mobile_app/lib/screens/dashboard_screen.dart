import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/memory_service.dart';
import 'add_memory_screen.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 8),
            Text(
              'Bugün ne hatırlamak istersin?',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 4),
            Text(
              'Anılarını ölümsüzleştirmenin en güzel yolu.',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.grey[600],
                  ),
            ),
            const SizedBox(height: 24),
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 0.85,
                children: [
                  _BentoCard(
                    title: 'Fotoğraf',
                    subtitle: 'En güzel anlarını\ngörselleştir',
                    icon: Icons.photo_camera_rounded,
                    gradient: const LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [Color(0xFF3B82F6), Color(0xFF2563EB)],
                    ),
                    isLarge: true,
                    onTap: () => _openAddMemory(context, 'PHOTO'),
                  ),
                  _BentoCard(
                    title: 'Video',
                    icon: Icons.videocam_rounded,
                    color: const Color(0xFFA855F7),
                    onTap: () => _openAddMemory(context, 'VIDEO'),
                  ),
                  _BentoCard(
                    title: 'Şarkı',
                    icon: Icons.music_note_rounded,
                    color: const Color(0xFFF59E0B),
                    onTap: () => _openAddMemory(context, 'SONG'),
                  ),
                  _BentoCard(
                    title: 'Ses Kaydı',
                    icon: Icons.mic_rounded,
                    color: const Color(0xFFEF4444),
                    isWide: true,
                    onTap: () => _openAddMemory(context, 'AUDIO'),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                  colors: [Color(0xFF10B981), Color(0xFF14B8A6)],
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: InkWell(
                onTap: () => _openAddMemory(context, 'TEXT'),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Günlük Notu Al',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Düşüncelerini, şiirlerini veya\ngünün özetini yaz.',
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.9),
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.edit_note_rounded,
                        color: Colors.white,
                        size: 28,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.auto_awesome_rounded,
                    size: 12, color: Colors.grey[400]),
                const SizedBox(width: 4),
                Text(
                  'Dijital anılarınız güvende',
                  style: TextStyle(fontSize: 11, color: Colors.grey[400]),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _openAddMemory(BuildContext context, String type) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => AddMemoryScreen(initialType: type),
      ),
    );
    if (result == true) {
      Provider.of<MemoryService>(context, listen: false).fetchMemories();
    }
  }
}

class _BentoCard extends StatelessWidget {
  final String title;
  final String? subtitle;
  final IconData icon;
  final Color? color;
  final Gradient? gradient;
  final bool isLarge;
  final bool isWide;
  final VoidCallback onTap;

  const _BentoCard({
    required this.title,
    this.subtitle,
    required this.icon,
    this.color,
    this.gradient,
    this.isLarge = false,
    this.isWide = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GridTile(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(24),
        child: Container(
          decoration: BoxDecoration(
            color: gradient == null ? (color ?? Colors.white) : null,
            gradient: gradient,
            borderRadius: BorderRadius.circular(24),
            border: gradient == null && color == null
                ? Border.all(color: Colors.grey[300]!)
                : null,
            boxShadow: [
              if (gradient != null || color != null)
                BoxShadow(
                  color: (color ?? Colors.blue).withOpacity(0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
            ],
          ),
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment:
                isLarge ? MainAxisAlignment.center : MainAxisAlignment.start,
            crossAxisAlignment:
                isLarge ? CrossAxisAlignment.center : CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: gradient != null || color != null
                      ? Colors.white.withOpacity(0.2)
                      : color?.withOpacity(0.1) ?? Colors.grey[100],
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(
                  icon,
                  size: isLarge ? 32 : 24,
                  color: gradient != null || color != null
                      ? Colors.white
                      : color ?? Colors.grey[700],
                ),
              ),
              const SizedBox(height: 12),
              Text(
                title,
                style: TextStyle(
                  fontSize: isLarge ? 20 : 16,
                  fontWeight: FontWeight.bold,
                  color: gradient != null || color != null
                      ? Colors.white
                      : Colors.black87,
                ),
                textAlign: isLarge ? TextAlign.center : TextAlign.start,
              ),
              if (subtitle != null) ...[
                const SizedBox(height: 4),
                Text(
                  subtitle!,
                  style: TextStyle(
                    fontSize: 12,
                    color: gradient != null || color != null
                        ? Colors.white.withOpacity(0.9)
                        : Colors.grey[600],
                  ),
                  textAlign: isLarge ? TextAlign.center : TextAlign.start,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
