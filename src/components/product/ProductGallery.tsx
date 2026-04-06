"use client";

import { useEffect, useMemo, useState } from "react";

import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

function normalizeGalleryImages(images: string[]) {
  const normalizedImages = images.filter(
    (image): image is string =>
      typeof image === "string" && image.trim().length > 0,
  );

  return normalizedImages.length > 0 ? normalizedImages : [""];
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const galleryImages = useMemo(() => normalizeGalleryImages(images), [images]);
  const [activeImage, setActiveImage] = useState(galleryImages[0]);

  useEffect(() => {
    setActiveImage(galleryImages[0]);
  }, [galleryImages]);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-3xl bg-white shadow-shopee">
        <ImageWithFallback
          src={activeImage}
          alt={name}
          className="aspect-square w-full object-cover"
        />
      </div>

      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
        {galleryImages.map((image, index) => {
          const imageKey = `${image || "fallback"}-${index}`;
          const isActive = activeImage === image;

          return (
            <button
              key={imageKey}
              type="button"
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 ${isActive ? "border-primary" : "border-transparent"}`}
              onClick={() => setActiveImage(image)}
            >
              <ImageWithFallback
                src={image}
                alt={`${name} ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
