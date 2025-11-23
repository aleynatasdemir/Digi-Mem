enum MemoryType {
  photo,
  video,
  voice,
  text,
  song;

  String get displayName {
    switch (this) {
      case MemoryType.photo:
        return 'Fotoğraf';
      case MemoryType.video:
        return 'Video';
      case MemoryType.voice:
        return 'Ses Kaydı';
      case MemoryType.text:
        return 'Metin';
      case MemoryType.song:
        return 'Şarkı';
    }
  }
}

class Memory {
  final int? id;
  final String type;
  final String? title;
  final String? description;
  final DateTime? memoryDate;
  final DateTime createdAt;
  final DateTime? updatedAt;
  final List<String>? tags;
  final String? fileUrl;
  final String? thumbnailUrl;
  final String? mimeType;
  final int? fileSize;
  final int? durationSeconds;
  final String? transcriptionText;
  final String? spotifyTrackId;
  final String? songTitle;
  final String? artistName;
  final String? albumName;
  final String? albumArtUrl;
  final String userId;

  Memory({
    this.id,
    required this.type,
    this.title,
    this.description,
    this.memoryDate,
    required this.createdAt,
    this.updatedAt,
    this.tags,
    this.fileUrl,
    this.thumbnailUrl,
    this.mimeType,
    this.fileSize,
    this.durationSeconds,
    this.transcriptionText,
    this.spotifyTrackId,
    this.songTitle,
    this.artistName,
    this.albumName,
    this.albumArtUrl,
    required this.userId,
  });

  factory Memory.fromJson(Map<String, dynamic> json) {
    return Memory(
      id: json['id'] as int?,
      type: json['type'] as String,
      title: json['title'] as String?,
      description: json['description'] as String?,
      memoryDate: json['memoryDate'] != null
          ? DateTime.parse(json['memoryDate'] as String)
          : null,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : null,
      tags: (json['tags'] as List<dynamic>?)?.cast<String>(),
      fileUrl: json['fileUrl'] as String?,
      thumbnailUrl: json['thumbnailUrl'] as String?,
      mimeType: json['mimeType'] as String?,
      fileSize: json['fileSize'] as int?,
      durationSeconds: json['durationSeconds'] as int?,
      transcriptionText: json['transcriptionText'] as String?,
      spotifyTrackId: json['spotifyTrackId'] as String?,
      songTitle: json['songTitle'] as String?,
      artistName: json['artistName'] as String?,
      albumName: json['albumName'] as String?,
      albumArtUrl: json['albumArtUrl'] as String?,
      userId: json['userId'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'type': type,
      'title': title,
      'description': description,
      'date': memoryDate?.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'tags': tags,
      'fileUrl': fileUrl,
      'thumbnailUrl': thumbnailUrl,
      'mimeType': mimeType,
      'fileSize': fileSize,
      'durationSeconds': durationSeconds,
      'transcriptionText': transcriptionText,
      'spotifyTrackId': spotifyTrackId,
      'songTitle': songTitle,
      'artistName': artistName,
      'albumName': albumName,
      'albumArtUrl': albumArtUrl,
      'userId': userId,
    };
  }

  MemoryType get memoryType {
    switch (type.toLowerCase()) {
      case 'photo':
        return MemoryType.photo;
      case 'video':
        return MemoryType.video;
      case 'voice':
        return MemoryType.voice;
      case 'text':
        return MemoryType.text;
      case 'song':
        return MemoryType.song;
      default:
        return MemoryType.text;
    }
  }
}
