import React, { useState } from 'react';

/**
 * OptimizedImage Component
 * High-performance responsive image loader with WebP picture support,
 * layout shift prevention (CLS=0), smooth progressive skeleton, and error resilience.
 */
const OptimizedImage = ({
  src,
  alt = '',
  width,
  height,
  className = '',
  pictureClassName = 'w-full h-full flex items-center justify-center',
  priority = false,
  loading = 'lazy',
  decoding = 'async',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  objectFit = 'contain',
  onClick,
  cardMode = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!src) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center text-gray-400 text-xs ${className}`}>
        No Image Available
      </div>
    );
  }

  // Derive optimized WebP paths for internal catalog assets
  const isLocalImage = typeof src === 'string' && src.startsWith('/images/');
  let webpFullSrc = null;
  let webpCardSrc = null;
  let fallbackSrc = src;

  if (isLocalImage) {
    const extMatch = src.match(/\.(png|jpg|jpeg|webp)$/i);
    if (extMatch) {
      const ext = extMatch[0];
      const basePath = src.substring(0, src.length - ext.length);
      webpFullSrc = `${basePath}.webp`;
      webpCardSrc = `${basePath}-card.webp`;
    }
  }

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const imgFitClass = objectFit === 'cover' ? 'object-cover' : 'object-contain';

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Shimmer skeleton placeholder */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse rounded-2xl"
          aria-hidden="true"
        />
      )}

      {hasError ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-4 text-center rounded-2xl border border-gray-100">
          <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-gray-500 font-medium">Image preview</span>
        </div>
      ) : isLocalImage && webpFullSrc ? (
        <picture className={`${pictureClassName} select-none pointer-events-auto`}>
          <source
            type="image/webp"
            srcSet={
              cardMode && webpCardSrc
                ? `${webpCardSrc} 600w, ${webpFullSrc} 1200w`
                : `${webpFullSrc} 1200w`
            }
            sizes={sizes}
          />
          <img
            src={fallbackSrc}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding={priority ? 'sync' : 'async'}
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
            onClick={onClick}
            onLoad={handleLoad}
            onError={handleError}
            style={{ WebkitUserDrag: 'none', userSelect: 'none' }}
            className={`${className} ${imgFitClass} transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </picture>
      ) : (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
          onClick={onClick}
          onLoad={handleLoad}
          onError={handleError}
          style={{ WebkitUserDrag: 'none', userSelect: 'none' }}
          className={`${className} ${imgFitClass} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
