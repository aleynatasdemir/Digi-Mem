import 'package:flutter/material.dart';
import '../memories/memories_box_screen.dart';
import '../summaries/summaries_screen.dart';
import '../settings/settings_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String? _selectedMedia;
  final _dateController = TextEditingController();
  final _titleController = TextEditingController();
  final _textController = TextEditingController();

  @override
  void dispose() {
    _dateController.dispose();
    _titleController.dispose();
    _textController.dispose();
    super.dispose();
  }

  void _showUploadModal(String mediaType) {
    setState(() {
      _selectedMedia = mediaType;
      _dateController.text = DateTime.now().toIso8601String().split('T')[0];
    });

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _buildUploadModal(mediaType),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // Header (dashboard.tsx'ten)
            _buildHeader(context),
            
            // Main content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    // Title
                    Text(
                      'Anı Ekle!',
                      style: theme.textTheme.displaySmall?.copyWith(
                        fontWeight: FontWeight.bold,
                        fontSize: 36,
                        letterSpacing: -0.5,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Anılarınızı fotoğraf, video, ses kaydı, metin veya şarkı olarak kaydedin',
                      style: theme.textTheme.bodyLarge?.copyWith(
                        color: theme.hintColor,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 32),
                    
                    // Media type cards grid
                    _buildMediaGrid(context),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    final theme = Theme.of(context);
    final isLargeScreen = MediaQuery.of(context).size.width > 600;
    
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: isLargeScreen ? 24 : 16,
        vertical: 16,
      ),
      decoration: BoxDecoration(
        color: theme.cardColor,
        border: Border(
          bottom: BorderSide(
            color: theme.dividerColor.withOpacity(0.1),
          ),
        ),
      ),
      child: Row(
        children: [
          // Logo
          GestureDetector(
            onTap: () {
              // Scroll to top or refresh
            },
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary,
                    borderRadius: BorderRadius.circular(9),
                  ),
                  child: const Icon(
                    Icons.auto_awesome_rounded,
                    color: Colors.white,
                    size: 18,
                  ),
                ),
                if (isLargeScreen) ...[
                  const SizedBox(width: 12),
                  Text(
                    'Dijital Hafıza',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ],
            ),
          ),
          const Spacer(),
          
          // Navigation buttons (only on larger screens)
          if (isLargeScreen) ...[
            TextButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const MemoriesBoxScreen(),
                  ),
                );
              },
              icon: const Icon(Icons.inventory_2_outlined, size: 18),
              label: const Text('Anı Kutusu'),
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              ),
            ),
            const SizedBox(width: 4),
            TextButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const SummariesScreen(),
                  ),
                );
              },
              icon: const Icon(Icons.summarize_outlined, size: 18),
              label: const Text('Özetler'),
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              ),
            ),
            const SizedBox(width: 4),
          ],
          
          // Settings button
          IconButton(
            icon: const Icon(Icons.settings_outlined, size: 22),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const SettingsScreen(),
                ),
              );
            },
            tooltip: 'Ayarlar',
          ),
          
          // Mobile menu for smaller screens
          if (!isLargeScreen)
            PopupMenuButton<String>(
              icon: const Icon(Icons.menu, size: 22),
              onSelected: (value) {
                switch (value) {
                  case 'box':
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const MemoriesBoxScreen(),
                      ),
                    );
                    break;
                  case 'summaries':
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const SummariesScreen(),
                      ),
                    );
                    break;
                }
              },
              itemBuilder: (context) => [
                const PopupMenuItem(
                  value: 'box',
                  child: Row(
                    children: [
                      Icon(Icons.inventory_2_outlined, size: 18),
                      SizedBox(width: 12),
                      Text('Anı Kutusu'),
                    ],
                  ),
                ),
                const PopupMenuItem(
                  value: 'summaries',
                  child: Row(
                    children: [
                      Icon(Icons.summarize_outlined, size: 18),
                      SizedBox(width: 12),
                      Text('Özetler'),
                    ],
                  ),
                ),
              ],
            ),
        ],
      ),
    );
  }

  Widget _buildMediaGrid(BuildContext context) {
    final mediaTypes = [
      {
        'id': 'photo',
        'icon': Icons.image_outlined,
        'title': 'Fotoğraf',
      },
      {
        'id': 'video',
        'icon': Icons.videocam_outlined,
        'title': 'Video',
      },
      {
        'id': 'audio',
        'icon': Icons.mic_outlined,
        'title': 'Ses',
      },
      {
        'id': 'text',
        'icon': Icons.text_fields,
        'title': 'Metin',
      },
      {
        'id': 'music',
        'icon': Icons.music_note_outlined,
        'title': 'Şarkı',
      },
    ];

    return LayoutBuilder(
      builder: (context, constraints) {
        // Responsive grid: 5 columns on desktop, 2 on mobile
        final crossAxisCount = constraints.maxWidth > 800 ? 5 : 2;
        
        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 0.95,
          ),
          itemCount: mediaTypes.length,
          itemBuilder: (context, index) {
            final type = mediaTypes[index];
            return _buildMediaCard(
              context,
              id: type['id'] as String,
              icon: type['icon'] as IconData,
              title: type['title'] as String,
            );
          },
        );
      },
    );
  }

  Widget _buildMediaCard(
    BuildContext context, {
    required String id,
    required IconData icon,
    required String title,
  }) {
    final theme = Theme.of(context);
    
    return InkWell(
      onTap: () => _showUploadModal(id),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        decoration: BoxDecoration(
          color: theme.cardColor,
          border: Border.all(
            color: theme.dividerColor.withOpacity(0.2),
            width: 2,
          ),
          borderRadius: BorderRadius.circular(12),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: theme.colorScheme.primary.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                size: 32,
                color: theme.colorScheme.primary,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUploadModal(String mediaType) {
    final theme = Theme.of(context);
    
    String getTitle() {
      switch (mediaType) {
        case 'photo':
          return 'Fotoğraf Yükle';
        case 'video':
          return 'Video Yükle';
        case 'audio':
          return 'Ses Kaydı Yükle';
        case 'text':
          return 'Metin Ekle';
        case 'music':
          return 'Şarkı Yükle';
        default:
          return 'Yükle';
      }
    }

    return Container(
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    getTitle(),
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

              // File upload (except for text)
              if (mediaType != 'text') ...[
                Text(
                  mediaType == 'photo'
                      ? 'Fotoğraf Seç'
                      : mediaType == 'video'
                          ? 'Video Dosyası Seç'
                          : mediaType == 'audio'
                              ? 'Ses Dosyası Seç'
                              : 'Şarkı Dosyası Seç',
                  style: theme.textTheme.labelLarge?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 8),
                OutlinedButton.icon(
                  onPressed: () {
                    // File picker
                  },
                  icon: const Icon(Icons.upload_file),
                  label: const Text('Dosya Seç'),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // Text input for text type
              if (mediaType == 'text') ...[
                Text(
                  'Metniniz',
                  style: theme.textTheme.labelLarge?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _textController,
                  maxLines: 5,
                  decoration: InputDecoration(
                    hintText: 'Anınızı buraya yazın...',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // Title input
              Text(
                'Başlık (İsteğe Bağlı)',
                style: theme.textTheme.labelLarge?.copyWith(
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _titleController,
                decoration: InputDecoration(
                  hintText: 'Anınıza bir başlık verin',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Date picker
              Text(
                'Tarih',
                style: theme.textTheme.labelLarge?.copyWith(
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _dateController,
                readOnly: true,
                decoration: InputDecoration(
                  hintText: 'Tarih seçin',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  suffixIcon: const Icon(Icons.calendar_today),
                ),
                onTap: () async {
                  final date = await showDatePicker(
                    context: context,
                    initialDate: DateTime.now(),
                    firstDate: DateTime(2000),
                    lastDate: DateTime.now(),
                  );
                  if (date != null) {
                    _dateController.text = date.toIso8601String().split('T')[0];
                  }
                },
              ),
              const SizedBox(height: 24),

              // Submit button
              FilledButton(
                onPressed: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Anı eklendi! (Mock mode)'),
                      backgroundColor: Colors.green,
                    ),
                  );
                },
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Text(
                  'Anı Ekle',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
