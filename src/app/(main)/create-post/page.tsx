"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import { IoChevronBack } from "react-icons/io5";

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function CreatePostPage() {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // react-easy-crop states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large (max 10MB)");
      return;
    }

    setError("");

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Generates the final 512x640 JPEG Blob based on user position/zoom
  const generateCroppedBlob = async (): Promise<Blob | null> => {
    if (!imagePreview || !croppedAreaPixels) return null;

    const image = new Image();
    image.src = imagePreview;
    
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = canvasRef.current;
    if (!canvas) return null;

    // Enforce minimal specified dimensions at a 4:5 aspect ratio
    const exportWidth = 512;
    const exportHeight = 640;
    canvas.width = exportWidth;
    canvas.height = exportHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, exportWidth, exportHeight);

    // Draw the crop mapping coordinates onto our 512x640 canvas
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      exportWidth,
      exportHeight
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.95);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imagePreview) {
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
      const croppedBlob = await generateCroppedBlob();
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

      // Success - redirect home
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 flex justify-center items-center" style={{ minHeight: "calc(100vh - 6.25rem)" }}>
      <div className="w-full max-w-lg shadow-md rounded-md bg-gradient-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% pt-6 p-8">
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <button
            type="button"
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
          {!imagePreview ? (
            /* File Upload Area */
            <label className="flex flex-col items-center justify-center w-full px-6 py-16 bg-gradient-to-r from-primary/20 via-secondary/20 to-secondary/20 border-2 border-dashed border-white/30 rounded-md cursor-pointer hover:border-white/50 transition shadow-black/10 shadow-md">
              <div className="text-center">
                <p className="text-white font-semibold mb-2 text-lg">Select an image</p>
                <p className="text-white/60 text-sm mb-1">JPEG, PNG, WebP, or GIF</p>
                <p className="text-white/60 text-sm">Max 10MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          ) : (
            /* Image Crop Interface */
            <div className="flex flex-col gap-4">
              
              {/* Cropper Frame Container */}
              <div className="relative w-full aspect-[4/5] bg-black/40 overflow-hidden border border-white/20 rounded-md">
                <Cropper
                  image={imagePreview}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 5}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  minZoom={1}
                  maxZoom={3}
                  zoomWithScroll={true}
                  showGrid={true}
                  objectFit="contain"
                />
              </div>

              {/* Zoom Control Slider */}
              <div className="flex items-center gap-3 py-2">
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
              <p className="text-white/60 text-xs text-center">
                Drag to reposition • Use slider, scroll wheel, or pinch to zoom
              </p>

              {/* Change Image Button */}
              <label className="px-4 py-2 bg-pink-500/80 hover:bg-pink-500/60 text-white rounded-md text-center cursor-pointer transition font-medium text-sm">
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
            disabled={!imagePreview || loading}
            className="px-6 py-3 bg-pink-500 hover:bg-pink-500/80 disabled:bg-pink-500/30 text-white rounded-md font-semibold transition hover:cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </form>

        {/* Hidden canvas for canvas image generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}