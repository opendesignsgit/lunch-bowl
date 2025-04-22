import React from 'react';
import { useRef, useState } from "react";
import Slider from "react-slick";
import ReactPlayer from "react-player/youtube";
const AboutVideoSlider = () => {

  const playerRefs = useRef([]);
  const [playingIndex, setPlayingIndex] = useState(null);

  const videoList = [
      { id: "video1", url: "https://www.youtube.com/watch?v=YLslsZuEaNE" },
      { id: "video2", url: "https://www.youtube.com/watch?v=R3GfuzLMPkA" },
      { id: "video3", url: "https://www.youtube.com/watch?v=bON-KPiiNCk" },
  ];

  const settings = {
    dots: true,
    arrows: true,
    infinite: false,
    beforeChange: () => {
      setPlayingIndex(null); // stop playing on slide change
    },
  };

  const handlePlay = (index) => {
    setPlayingIndex(index);
  };

  return (
    <div className="w-full mx-auto">
      <Slider {...settings} className='abtvidosliders'>
        {videoList.map((video, index) => (
          <div key={video.id} className="aspect-video relative">
            {playingIndex === index ? (
              <ReactPlayer
                ref={(el) => (playerRefs.current[index] = el)}
                url={video.url}
                width="100%"
                height="100%"
                controls
                playing
              />
            ) : (
              <div
                className="w-full bg-black relative cursor-pointer"
                onClick={() => handlePlay(index)}
              >
                {/* Custom thumbnail or black box */}
                <img
                  src={`https://img.youtube.com/vi/${video.url.split("v=")[1]}/hqdefault.jpg`}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-white p-4 rounded-full shadow-lg text-black font-bold text-xl">
                    ▶
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default AboutVideoSlider