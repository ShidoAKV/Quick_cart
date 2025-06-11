'use client';
import React, { useRef } from 'react';

const TshirtHeroSection = () => {
  const videoRefs = useRef({});

  const videoThumbnails = [
    { id: 1, src: '/videos/Tshirtvideo.webm' },
    { id: 2, src: '/videos/Tshirtvideo.webm' },
  ];

  
  return (
    <section className="w-full mt-14">
      {/* Trust Section */}
      <div className="px-4 md:px-10 py-20">
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

        <div className=" lg:pl-72 flex flex-col md:flex-row items-center md:items-stretch gap-4 overflow-x-auto md:overflow-visible pb-2 scrollbar-hide">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 overflow-x-hidden md:overflow-visible pb-2">
            {videoThumbnails.map((video) => (
              <div
                key={video.id}
                className="relative w-[90vw] max-w-[360px] h-[200px] md:w-64 md:h-64 bg-gray-100 overflow-hidden shadow rounded-lg"
              >
                <video
                  ref={(el) => (videoRefs.current[video.id] = el)}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="none"
                   controls={false}
                >
                  <source src={video.src} type="video/mp4" />
                </video>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TshirtHeroSection;
