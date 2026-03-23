import React, { useState } from 'react';
import { XMarkIcon, PlayIcon } from '@heroicons/react/24/outline';
import { videoGuideData } from '../../data/mockData';

const VideoGuidePage = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const openVideoModal = (video) => {
    setSelectedVideo(video);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Guides</h1>
          <p className="text-gray-600">Learn how to use Kivi Health features with our comprehensive video tutorials</p>
        </div>

        {/* Video Grid - 9 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoGuideData.map((video) => (
            <div
              key={video.id}
              onClick={() => openVideoModal(video)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-6xl opacity-70">{video.thumbnail}</div>
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <div className="bg-white bg-opacity-90 rounded-full p-3 transform scale-0 hover:scale-100 transition-transform duration-200">
                    <PlayIcon className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{video.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{video.description}</p>
                
                <div className="flex items-center text-blue-600 text-sm font-medium group">
                  <span>Watch Video</span>
                  <PlayIcon className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-900">{selectedVideo.title}</h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              {/* Video Content */}
              <div className="p-6">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-inner">
                  <iframe
                    src={selectedVideo.videoUrl}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedVideo.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGuidePage;
