"use client";

import { useState } from "react";

interface ImageUrlFieldProps {
  value: string;
  onChange: (url: string) => void;
}

const VALID_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico"];

function isValidImageUrl(url: string): boolean {
  if (!url) return true;
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    const hasValidExtension = VALID_IMAGE_EXTENSIONS.some((ext) => pathname.endsWith(ext));
    const isLikelyImageService = /unsplash|imgur|cloudinary|pexels|pixabay/i.test(url);
    return hasValidExtension || isLikelyImageService || !pathname.includes(".");
  } catch {
    return false;
  }
}

export default function ImageUrlField({ value, onChange }: ImageUrlFieldProps) {
  const [imageError, setImageError] = useState("");
  const [imagePreviewLoaded, setImagePreviewLoaded] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onChange(url);
    setImageError("");
    setImagePreviewLoaded(false);

    if (url && !isValidImageUrl(url)) {
      setImageError("Please enter a valid image URL (jpg, png, gif, webp, etc.)");
    }
  };

  const handleImageLoad = () => {
    setImagePreviewLoaded(true);
    setImageError("");
  };

  const handleImageError = () => {
    if (value) {
      setImageError("Failed to load image. Please check the URL is correct and accessible.");
      setImagePreviewLoaded(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Image URL <span className="text-gray-400 text-xs">(optional)</span>
      </label>
      <input
        type="url"
        name="image"
        value={value}
        onChange={handleChange}
        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 bg-gray-50 text-gray-800 ${
          imageError
            ? "border-coral-300 focus:ring-coral-200"
            : "border-gray-200 focus:ring-mint-300"
        }`}
        placeholder="https://example.com/image.jpg"
      />
      {imageError && (
        <p className="mt-2 text-sm text-coral-300" role="alert" aria-live="polite">
          {imageError}
        </p>
      )}
      {value && !imageError && (
        <div className="mt-3">
          <p className="text-sm text-gray-500 mb-2">Preview:</p>
          <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`w-full h-full object-cover ${
                imagePreviewLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
            {!imagePreviewLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Loading preview...
              </div>
            )}
          </div>
          {imagePreviewLoaded && (
            <p className="mt-2 text-sm text-mint-500">✓ Image loaded successfully</p>
          )}
        </div>
      )}
    </div>
  );
}
