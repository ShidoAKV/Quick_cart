import React, { useState } from "react";
import Image from "next/image";

const ColorImageSwitcher = ({ color, image, productName }) => {

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div>
      {/* Main Image */}
      <div className="w-72 h-96 relative mb-4">
        <Image
          src={image[selectedIndex]}
          alt={`${productName} - ${color[selectedIndex]}`}
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      {/* Color Buttons */}
      <div className="flex gap-4">
        {color.map((color, index) => (
          <button
            key={color}
            onClick={() => setSelectedIndex(index)}
            className={`px-3 py-1 rounded-full border ${
              selectedIndex === index
                ? "border-green-600 bg-green-100"
                : "border-gray-400 bg-white"
            }`}
          >
            {color}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorImageSwitcher;
