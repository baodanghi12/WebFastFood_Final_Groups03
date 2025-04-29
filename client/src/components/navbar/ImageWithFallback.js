import React, { useState } from "react";
import { assets } from "../../assets/assets.js";

const ImageWithFallback = ({
  src,
  alt,
  category = "food",
  className = "w-full h-full object-cover",
}) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getFallbackImage = () => {
    switch (category.toLowerCase()) {
      case "food":
        return assets.foodPlaceholder;
      case "drink":
        return assets.drinkPlaceholder;
      case "dessert":
        return assets.dessertPlaceholder;
      default:
        return assets.foodPlaceholder;
    }
  };

  const handleImageError = () => {
    setIsError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative h-48 overflow-hidden bg-gray-100">
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-10">
          <div className="text-gray-400 text-xs">Đang tải...</div>
        </div>
      )}

      {/* Real Image */}
      <img
        src={isError ? getFallbackImage() : src}
        alt={alt}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
      />
    </div>
  );
};

export default ImageWithFallback;
