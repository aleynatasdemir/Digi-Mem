class Memory {
  final String id;
  final String userId;
  final String type; // text, photo, video, voice, link, document
  final String? title;
  final String? description;
  final String? fileUrl;
  final String? thumbnailUrl;
  final List<String> tags;
  final String? location;
  final String? spotifyTrackId;
  final DateTime createdAt;
  final DateTime updatedAt;

  Memory({
    required this.id,
    required this.userId,
    required this.type,
    this.title,
    this.description,
    this.fileUrl,
    this.thumbnailUrl,
    required this.tags,
    this.location,
    this.spotifyTrackId,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Memory.fromJson(Map<String, dynamic> json) {
    return Memory(
      id: json['id'] ?? '',
      userId: json['userId'] ?? '',
      type: json['type'] ?? 'text',
      title: json['title'],
      description: json['description'],
      fileUrl: json['fileUrl'],
      thumbnailUrl: json['thumbnailUrl'],
      tags: List<String>.from(json['tags'] ?? []),
      location: json['location'],
      spotifyTrackId: json['spotifyTrackId'],
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'type': type,
      'title': title,
      'description': description,
      'fileUrl': fileUrl,
      'thumbnailUrl': thumbnailUrl,
      'tags': tags,
      'location': location,
      'spotifyTrackId': spotifyTrackId,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

class MemoryStats {
  final Map<String, int> totals;
  final Map<String, double> averages;
  final List<Map<String, dynamic>> formatDistribution;
  final List<Map<String, dynamic>> weeklyData;
  final List<Map<String, dynamic>> monthlyTrend;

  MemoryStats({
    required this.totals,
    required this.averages,
    required this.formatDistribution,
    required this.weeklyData,
    required this.monthlyTrend,
  });

  factory MemoryStats.fromJson(Map<String, dynamic> json) {
    return MemoryStats(
      totals: Map<String, int>.from(json['totals'] ?? {}),
      averages: Map<String, double>.from(json['averages'] ?? {}),
      formatDistribution: List<Map<String, dynamic>>.from(json['formatDistribution'] ?? []),
      weeklyData: List<Map<String, dynamic>>.from(json['weeklyData'] ?? []),
      monthlyTrend: List<Map<String, dynamic>>.from(json['monthlyTrend'] ?? []),
    );
  }
}
