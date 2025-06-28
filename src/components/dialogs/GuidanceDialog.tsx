import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

interface GuidanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VideoGuide {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

const GuidanceDialog: React.FC<GuidanceDialogProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample video guides - you can replace with your actual data
  const videoGuides: VideoGuide[] = [
    {
      id: '1',
      title: 'Gunakan AI Prompt di Aplikasi Permodelan',
      description: 'Pelajari cara menggunakan AI Prompt untuk meningkatkan produktivitas Anda',
      videoUrl: 'https://www.youtube.com/embed/2_WmgcF24jc',
      thumbnailUrl: 'https://img.youtube.com/vi/2_WmgcF24jc/mqdefault.jpg'
    },
    {
      id: '2',
      title: 'Gunakan AI Prompt di Aplikasi Permodelan',
      description: 'Panduan lengkap penggunaan AI dalam aplikasi',
      videoUrl: 'https://www.youtube.com/embed/2_WmgcF24jc',
      thumbnailUrl: 'https://img.youtube.com/vi/2_WmgcF24jc/mqdefault.jpg'
    },
    {
      id: '3',
      title: 'Gunakan AI Prompt di Aplikasi Permodelan',
      description: 'Tips dan trik untuk mengoptimalkan AI Prompt',
      videoUrl: 'https://www.youtube.com/embed/2_WmgcF24jc',
      thumbnailUrl: 'https://img.youtube.com/vi/2_WmgcF24jc/mqdefault.jpg'
    },
    {
      id: '4',
      title: 'Gunakan AI Prompt di Aplikasi Permodelan',
      description: 'Contoh praktis penggunaan AI dalam workflow',
      videoUrl: 'https://www.youtube.com/embed/2_WmgcF24jc',
      thumbnailUrl: 'https://img.youtube.com/vi/2_WmgcF24jc/mqdefault.jpg'
    },
    {
      id: '5',
      title: 'Gunakan AI Prompt di Aplikasi Permodelan',
      description: 'Advanced techniques untuk power users',
      videoUrl: 'https://www.youtube.com/embed/2_WmgcF24jc',
      thumbnailUrl: 'https://img.youtube.com/vi/2_WmgcF24jc/mqdefault.jpg'
    },
    {
      id: '6',
      title: 'Gunakan AI Prompt di Aplikasi Permodelan',
      description: 'Troubleshooting dan pemecahan masalah',
      videoUrl: 'https://www.youtube.com/embed/2_WmgcF24jc',
      thumbnailUrl: 'https://img.youtube.com/vi/2_WmgcF24jc/mqdefault.jpg'
    },
    {
      id: '7',
      title: 'Gunakan AI Prompt di Aplikasi Permodelan',
      description: 'Best practices dan rekomendasi',
      videoUrl: 'https://www.youtube.com/embed/2_WmgcF24jc',
      thumbnailUrl: 'https://img.youtube.com/vi/2_WmgcF24jc/mqdefault.jpg'
    },
    {
      id: '8',
      title: 'Gunakan AI Prompt di Aplikasi Permodelan',
      description: 'Integrasi dengan tools eksternal',
      videoUrl: 'https://www.youtube.com/embed/2_WmgcF24jc',
      thumbnailUrl: 'https://img.youtube.com/vi/2_WmgcF24jc/mqdefault.jpg'
    },
    {
      id: '9',
      title: 'Gunakan AI Prompt di Aplikasi Permodelan',
      description: 'Update terbaru dan fitur baru',
      videoUrl: 'https://www.youtube.com/embed/2_WmgcF24jc',
      thumbnailUrl: 'https://img.youtube.com/vi/2_WmgcF24jc/mqdefault.jpg'
    }
  ];

  // Filter videos based on search query
  const filteredVideos = videoGuides.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl h-5/6 max-h-screen overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">APP GUIDE</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 h-full overflow-y-auto">
          {/* Search Box */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Placeholder"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {filteredVideos.map((video) => (
              <div key={video.id} className="bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Video Container */}
                <div className="aspect-video bg-gray-200 relative">
                  <iframe
                    src={video.videoUrl}
                    title={video.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                {/* Video Info */}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredVideos.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada video yang ditemukan untuk "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuidanceDialog;