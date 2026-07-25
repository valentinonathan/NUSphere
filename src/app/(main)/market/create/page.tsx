"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import { IoChevronBack } from "react-icons/io5";
import { fetchBackendClient } from "@/utils/fetch-backend-client";

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

import { ApiResponse } from "../page";

type Category = {
  id: number;
  name: string;
};

export default function ListingImageUpload() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetchBackendClient<ApiResponse<Category[]>>("/market/categories", "GET");
        
        if (res.message) {
          throw new Error(res.message)
        } else if (res.data) {
          setCategories(res.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load categories");
      }
    }

    loadCategories();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(selected.type)) {
      setError("Only image files are allowed (jpeg, png, webp, gif)");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("File is too large (max 5MB)");
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setCroppedAreaPixels(null);
    };
    reader.readAsDataURL(selected);
  };

  const onCropComplete = useCallback((_: Area, cropped: Area) => {
    setCroppedAreaPixels(cropped);
  }, []);

  const generateCroppedBlob = async (): Promise<Blob | null> => {
    if (!imagePreview || !croppedAreaPixels) return null;

    const image = new Image();
    image.src = imagePreview;

    await new Promise<void>((resolve) => {
      image.onload = () => resolve();
    });

    const canvas = canvasRef.current;
    if (!canvas) return null;

    const exportWidth = 256;
    const exportHeight = 256;
    canvas.width = exportWidth;
    canvas.height = exportHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, exportWidth, exportHeight);
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

    if (!title.trim() || !description.trim() || !price.trim() || !selectedCategoryId) {
      setError("Please fill in title, description, price, and category");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const croppedBlob = await generateCroppedBlob();
      if (!croppedBlob) {
        throw new Error("Failed to crop image");
      }

      const formData = new FormData();
      formData.append("image", croppedBlob, "listing-image.jpg");
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category_id", selectedCategoryId);

      const res = await fetch("/api/market", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create listing");
      }

      router.push("/marketplace");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="mx-auto flex min-h-screen max-w-3xl items-center justify-center p-4 text-black"
      style={{ minHeight: "calc(100vh - 6.25rem)" }}
    >
      <div className="w-full rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md p-2 hover:bg-slate-100"
            title="Go back"
          >
            <IoChevronBack className="text-2xl" />
          </button>
          <h1 className="text-2xl font-semibold">Create Listing</h1>
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Listing image</span>

            {!imagePreview ? (
              <div className="mt-1">
                <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 px-6 py-10 hover:border-slate-400">
                  <p className="mb-1 text-sm font-medium text-slate-700">Click to upload an image</p>
                  <p className="text-xs text-slate-500">JPEG, PNG, WebP, GIF • max 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="mt-2 space-y-3">
                <div
                  className="relative overflow-hidden rounded-md border border-slate-300 bg-black"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <Cropper
                    image={imagePreview}
                    crop={crop}
                    zoom={zoom}
                    aspect={1 / 1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    minZoom={1}
                    maxZoom={3}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="min-w-14 text-sm font-medium text-slate-700">Zoom:</label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="h-2 flex-1 cursor-pointer rounded-lg bg-slate-200"
                  />
                  <span className="min-w-12 text-right text-sm text-slate-600">
                    {zoom.toFixed(1)}x
                  </span>
                </div>

                <label className="inline-flex w-fit cursor-pointer items-center rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600">
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
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Category</span>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Enter title"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block min-h-24 w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Enter description"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Price</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Enter price"
            />
          </label>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading || !imagePreview}
              className="rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-pink-300"
            >
              {loading ? "Creating..." : "Create Listing"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/market")}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}