'use client';
import React, { useState, useRef } from 'react';
import { Pause, Play } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const TshirtHeroSection = () => {
  const [playingStates, setPlayingStates] = useState({});
  const videoRefs = useRef({});
  const { router } = useAppContext();

  const videoThumbnails = [
    { id: 1, src: '/videos/tshirtvideo.mp4' },
    { id: 2, src: '/videos/tshirtvideo.mp4' },
    { id: 3, src: '/videos/tshirtvideo.mp4' },
    { id: 4, src: '/videos/tshirtvideo.mp4' },
  ];

  const handleVideoClick = (video) => {
    const vid = videoRefs.current[video.id];
    if (vid) {
      if (vid.paused) {
        vid.play();
        setPlayingStates((prev) => ({ ...prev, [video.id]: true }));
      } else {
        vid.pause();
        setPlayingStates((prev) => ({ ...prev, [video.id]: false }));
      }
    }
  };

  return (
    <section className="w-full mt-20">
      {/* Hero Section */}
      <div className="relative h-[90vh] rounded-sm w-full flex items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/tshirtvideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-0" />
        <div className="relative z-10 text-center px-6 md:px-12 max-w-4xl">
          <h1 className="text-3xl md:text-6xl font-bold mb-4 text-white">
            Affordable T-shirt, Crafted to Impress
          </h1>
          <p className="text-md md:text-xl text-white mb-6">
            From high-quality fabric to perfect packaging — experience comfort, confidence, and craftsmanship.
          </p>
          <a
            onClick={() => router.push('/all-products')}
            className="inline-block cursor-pointer bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition"
          >
            Shop Now
          </a>
        </div>
      </div>

      {/* Trust Section */}
      <div className="px-4 md:px-10 py-24">
        <h2 className="text-3xl font-semibold text-center mb-2 text-gray-800">
          See What Makes Us Different
        </h2>
        <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
          Real video insights into our T-shirt quality, detailed packaging, and trusted customer experience.
        </p>

        {/* Mobile scroll hint */}
        <div className="block md:hidden text-sm text-center text-gray-900 mb-2">
          Scroll to explore ↓
        </div>

        <div className="flex gap-4 overflow-x-auto md:overflow-visible scrollbar-hide md:scrollbar-default pb-2 flex-col md:flex-row items-center md:items-stretch">
          {videoThumbnails.map((video) => (
            <div
              key={video.id}
              className="relative w-[80vw] h-[200px] md:w-64 md:h-64 bg-gray-200  overflow-hidden shadow hover:shadow-lg transition cursor-pointer group"
              onClick={() => handleVideoClick(video)}
            >
              <video
                id={`video-${video.id}`}
                ref={(el) => (videoRefs.current[video.id] = el)}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
              >
                <source src={video.src} type="video/mp4" />
              </video>

              {/* Pause/Play icon - only visible on desktop/tablet */}
              <div className="hidden md:flex absolute inset-0 items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
                {playingStates[video.id] ? (
                  <Pause className="text-white w-10 h-10" />
                ) : (
                  <Play className="text-white w-10 h-10" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TshirtHeroSection;
