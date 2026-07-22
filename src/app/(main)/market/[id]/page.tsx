"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchBackendClient } from "@/utils/fetch-backend-client";

import { ApiResponse, Listing } from "../page";



const page = () => {
  const params = useParams();
  const rawId = params?.id;
  const productId = Array.isArray(rawId) ? rawId[0] : rawId;
  const [product, setProduct] = useState<null | Listing>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    async function loadProduct() {
      try {
        setLoading(true);
        const response = await fetchBackendClient<ApiResponse<Listing>>(
          `/market/${productId}`,
          "GET"
        );

        if (response.message) {
          throw new Error(response.message);
        } else if (response.data) {
          setProduct(response.data);
        }
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Can not load listing");
        }
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (errorMessage) {
    return <p className="text-red-500">{errorMessage}</p>;
  }

  if (!product) {
    return <p>No product found.</p>;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="rounded-lg bg-white shadow-md p-6">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="rounded-lg overflow-hidden bg-slate-100">
            <img
              src={product.image_url}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Product ID: {product.id}</p>
              <h1 className="text-2xl font-semibold">{product.title}</h1>
              <p className="text-base text-slate-700">{product.description}</p>
            </div>

            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Price</p>
              <p className="text-3xl font-bold">${product.price}</p>
              <p className="text-sm text-slate-500">Seller ID: {product.seller_id}</p>
              <p className="text-xs text-slate-400">Created at: {new Date(product.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page