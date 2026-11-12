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

  // Check if image is a product or service photograph requiring on-screen watermark
  const isProtectedFoodImage = typeof src === 'string' && (
    src.includes('/cakes/') ||
    src.includes('/seasonal/') ||
    src.includes('/cupcakes/') ||
    src.includes('/cookies/') ||
    src.includes('/catering/')
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
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
        <picture className={`${pictureClassName}`}>
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
            onClick={onClick}
            onLoad={handleLoad}
            onError={handleError}
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
          onClick={onClick}
          onLoad={handleLoad}
          onError={handleError}
          className={`${className} ${imgFitClass} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* On-Screen Watermark Overlay for Live View & Screenshot Capture (Un-croppable from all sides) */}
      {isProtectedFoodImage && isLoaded && !hasError && (
        <div 
          className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center overflow-hidden z-20 select-none"
          aria-hidden="true"
        >
          {/* Upper Subtle Ribbon */}
          <div className="absolute top-[22%] transform -rotate-12 text-center font-bold tracking-[0.18em] uppercase whitespace-nowrap text-white/20 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] text-xs sm:text-sm">
            GoodNews Cake and Catering
          </div>
          {/* Center Core Ribbon (Un-croppable from top, bottom, or sides) */}
          <div className="transform -rotate-12 text-center font-bold tracking-[0.20em] uppercase whitespace-nowrap text-white/30 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] text-sm sm:text-base md:text-lg px-4 py-1">
            GoodNews Cake and Catering
          </div>
          {/* Lower Subtle Ribbon */}
          <div className="absolute bottom-[22%] transform -rotate-12 text-center font-bold tracking-[0.18em] uppercase whitespace-nowrap text-white/20 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] text-xs sm:text-sm">
            GoodNews Cake and Catering
          </div>
          {/* Bottom-Right Signature Badge */}
          <div className="absolute bottom-2.5 right-2.5 text-[11px] sm:text-xs font-semibold text-white/45 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] tracking-wider">
            GoodNews Cake and Catering
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
