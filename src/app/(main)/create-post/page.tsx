"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";

export default function CreatePostPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setError("Only image files are allowed (jpeg, png, webp, gif)");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large (max 5MB)");
      return;
    }

    setSelectedImage(file);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setPan((prev) => ({
      x: Math.max(-100, Math.min(100, prev.x + deltaX * 0.3)),
      y: Math.max(-100, Math.min(100, prev.y + deltaY * 0.3)),
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const cropImage = async (): Promise<Blob | null> => {
    if (!imageRef.current || !containerRef.current) return null;

    const canvas = canvasRef.current;
    if (!canvas) return null;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerWidth * (5 / 4); // 4:5 aspect ratio

    canvas.width = containerWidth;
    canvas.height = containerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const img = imageRef.current;

    const imageAspect = img.naturalWidth / img.naturalHeight;
    const frameAspect = containerWidth / containerHeight;

    let drawWidth: number;
    let drawHeight: number;

    // Replicate object-fit: cover
    if (imageAspect > frameAspect) {
        drawHeight = containerHeight;
        drawWidth = drawHeight * imageAspect;
    } else {
        drawWidth = containerWidth;
        drawHeight = drawWidth / imageAspect;
    }

    ctx.clearRect(0, 0, containerWidth, containerHeight);

    ctx.save();

    // Move origin to center of crop frame
    ctx.translate(containerWidth / 2, containerHeight / 2);

    // Apply pan first, then zoom (matches visual expectation)
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw image centered
    ctx.drawImage(
        img,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
    );

    ctx.restore();

    return new Promise((resolve) => {
        canvas.toBlob(
        (blob) => resolve(blob),
        "image/jpeg",
        0.95
        );
    });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedImage) {
      setError("Please select an image");
      return;
    }

    if (caption.length > 500) {
      setError("Caption is too long (max 500 characters)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Crop the image
      const croppedBlob = await cropImage();
      if (!croppedBlob) {
        throw new Error("Failed to crop image");
      }

      // Create FormData
      const formData = new FormData();
      formData.append("image", croppedBlob, "post-image.jpg");
      if (caption.trim()) {
        formData.append("caption", caption);
      }

      // Submit to API
      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      // Success - redirect to home
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 flex justify-center items-center" style={{ minHeight: "calc(100vh - 6.25rem)" }}>
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 text-white hover:text-white/60 hover:cursor-pointer transition"
            title="Go back"
          >
            <IoChevronBack className="text-2xl" />
          </button>
          <h1 className="text-2xl font-momo text-white">Create Post</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/30 border border-red-500/50 rounded-md text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {!selectedImage ? (
            /* File Upload Area */
            <label className="flex flex-col items-center justify-center w-full px-6 py-16 bg-gradient-to-r from-primary/20 via-secondary/20 to-secondary/20 border-2 border-dashed border-white/30 rounded-md cursor-pointer hover:border-white/50 transition shadow-black/10 shadow-md">
              <div className="text-center">
                <p className="text-white font-semibold mb-2 text-lg">Select an image</p>
                <p className="text-white/60 text-sm mb-1">JPEG, PNG, WebP, or GIF</p>
                <p className="text-white/60 text-sm">Max 5MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          ) : (
            /* Image Crop Interface */
            <div className="flex flex-col gap-4">
              {/* Crop Container */}
              <div
                ref={containerRef}
                className="relative w-full bg-black/40 rounded-md overflow-hidden border border-white/20 shadow-black/10 shadow-md"
                style={{
                  aspectRatio: "4 / 5",
                  cursor: isDragging ? "grabbing" : "grab",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  ref={imageRef}
                  src={imagePreview}
                  alt="preview"
                  className="absolute inset-0 w-full h-full"
                  style={{
                    objectFit: "contain",
                    transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                    transformOrigin: "center",
                    transition: isDragging ? "none" : "transform 0.1s ease-out",
                  }}
                />
              </div>

              {/* Zoom Control */}
              <div className="flex items-center gap-3">
                <label className="text-white text-sm font-medium min-w-14">Zoom:</label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ff5757 0%, #ff5757 ${((zoom - 1) / 2) * 100}%, rgba(255, 255, 255, 0.2) ${((zoom - 1) / 2) * 100}%, rgba(255, 255, 255, 0.2) 100%)`,
                  }}
                />
                <span className="text-white text-sm min-w-12 text-right">{zoom.toFixed(1)}x</span>
              </div>

              {/* Info Text */}
              <p className="text-white/60 text-sm text-center">Drag to pan • Use zoom slider to adjust</p>

              {/* Change Image Button */}
              <label className="px-4 py-2 bg-secondary/70 hover:bg-secondary/80 text-white rounded-md text-center cursor-pointer transition font-medium hover:cursor-pointer">
                Change Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Caption Input */}
          <div className="flex flex-col gap-2">
            <label className="text-white font-medium">Caption (optional)</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption for your post..."
              maxLength={500}
              className="w-full h-20 px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:border-white/50 resize-none"
            />
            <div className="text-white/60 text-sm text-right">
              {caption.length} / 500
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedImage || loading}
            className="px-6 py-3 bg-primary/70 hover:bg-primary/80 disabled:bg-primary/50 text-white rounded-md font-semibold transition hover:cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </form>

        {/* Hidden canvas for cropping */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
