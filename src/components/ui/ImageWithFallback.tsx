"use client";

import { useEffect, useMemo, useState, type ImgHTMLAttributes } from "react";

const DEFAULT_PRODUCT_PLACEHOLDER =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80";

type ImageWithFallbackProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

function resolveImageSource(
  src: ImgHTMLAttributes<HTMLImageElement>["src"],
  fallbackSrc: string,
) {
  return typeof src === "string" && src.trim().length > 0 ? src : fallbackSrc;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = DEFAULT_PRODUCT_PLACEHOLDER,
  onError,
  ...props
}: ImageWithFallbackProps) {
  const resolvedSource = useMemo(
    () => resolveImageSource(src, fallbackSrc),
    [fallbackSrc, src],
  );

  const [currentSource, setCurrentSource] = useState(resolvedSource);

  useEffect(() => {
    setCurrentSource(resolvedSource);
  }, [resolvedSource]);

  return (
    <img
      {...props}
      src={currentSource}
      alt={alt}
      onError={(event) => {
        if (currentSource !== fallbackSrc) {
          setCurrentSource(fallbackSrc);
        }

        onError?.(event);
      }}
    />
  );
}
