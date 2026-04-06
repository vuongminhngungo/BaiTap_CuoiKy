"use client";

import { useMemo, useState } from "react";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(images[0]);
  const gallery = useMemo(
    () => (images.length ? images : [images[0]]),
    [images],
  );

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-3xl bg-white shadow-shopee">
        <img
          src={active}
          alt={name}
          className="aspect-square w-full object-cover"
        />
      </div>
      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
        {gallery.map((image) => (
          <button
            key={image}
            type="button"
            className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 ${active === image ? "border-primary" : "border-transparent"}`}
            onClick={() => setActive(image)}
          >
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
