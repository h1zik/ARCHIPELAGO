import React, { useState } from 'react';

const OptimizedImage = ({ src, alt, className, loading = 'lazy', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-[#EAE7E2] animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#A27B5C] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {hasError ? (
        <div className="absolute inset-0 bg-[#EAE7E2] flex items-center justify-center text-[#5C6B70] text-sm">
          Failed to load
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          loading={loading}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
