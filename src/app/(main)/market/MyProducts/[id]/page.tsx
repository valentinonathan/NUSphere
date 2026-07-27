"use client";

import { useEffect, useState, } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchBackendClient } from "@/utils/fetch-backend-client";
import type { ApiResponse, Listing } from "../../page";
import { useRouter } from "next/navigation";

export type MarketConversation = {
  conversation_id: number;
  buyer_id: number;
  buyer_username: string;
};

export default function Page() {
  const params = useParams();
  const rawId = params?.id;
  const productId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [product, setProduct] = useState<Listing | null>(null);
  const [marketConversations, setMarketConversations] = useState<MarketConversation[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetchBackendClient<ApiResponse<Listing>>(
        `/market/${rawId}`,
        "DELETE"
      );

      if (response.message) {
        throw new Error(response.message);
      }

      // Remove the deleted listing from the UI
      setProduct(null);

      // or redirect back to My Products
      router.push("/market/MyProducts");

    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete listing"
      );
    }
  };

  useEffect(() => {
    if (!productId) return;

    async function loadProduct() {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetchBackendClient<ApiResponse<Listing>>(
          `/market/${productId}`,
          "GET"
        );

        if (response.message) {
          throw new Error(response.message);
        }

        setProduct(response.data ?? null);
      } catch (error) {
        setProduct(null);
        setErrorMessage(
          error instanceof Error ? error.message : "Can not load listing"
        );
      } finally {
        setLoading(false);
      }
    }

    async function loadConversations() {
      try {
        const response =
          await fetchBackendClient<ApiResponse<MarketConversation[]>>(
            `/market/${productId}/conversations`,
            "GET"
          );

        if (response.message) {
          throw new Error(response.message);
        }

        setMarketConversations(response.data ?? []);
      } catch (error) {
        console.error(error);
      }
    }

    loadProduct();
    loadConversations();
  }, [productId]);

  if (loading) {
    return (
      <main className="min-h-screen p-4 text-white md:p-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-6 h-6 w-24 rounded bg-white/10" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-[28rem] rounded-md bg-white/10 shadow-md shadow-black/10" />
            <div className="space-y-4 rounded-md bg-white/5 p-6 shadow-md shadow-black/10">
              <div className="h-8 w-2/3 rounded bg-white/10" />
              <div className="h-6 w-1/3 rounded bg-white/10" />
              <div className="h-4 w-1/2 rounded bg-white/10" />
              <div className="h-32 w-full rounded bg-white/10" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="min-h-screen p-4 text-white md:p-8">
        <div className="mx-auto max-w-3xl rounded-md border border-red-500/30 bg-red-500/10 p-6 shadow-md shadow-black/10">
          <p className="text-red-300">{errorMessage}</p>
          <Link
            href="/market"
            className="mt-4 inline-flex rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Back to listings
          </Link>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen p-4 text-white md:p-8">
        <div className="mx-auto max-w-3xl rounded-md shadow-md shadow-black/10 bg-linear-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% p-6">
          <p className="text-white/90">No product found.</p>
          <Link
            href="/market"
            className="mt-4 inline-flex rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-black/30"
          >
            Back to listings
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 text-white md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/market/MyProducts"
            className="inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
          >
            ← Back to listings
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-md shadow-md shadow-black/10 bg-linear-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% p-6 md:p-8">
            <div className="w-64 h-64 overflow-hidden">
              <img
                src={product.image_url}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-medium text-white/90">
                {product.category_name}
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              {product.title}
            </h1>

            <p className="mt-4 text-3xl font-semibold text-white">
              ${Number(product.price).toFixed(2)}
            </p>

            <div className="mt-6 grid gap-4 rounded-md bg-black/15 p-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/60">
                  Seller
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  {product.seller_username}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-white/60">
                  Category
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  {product.category_name}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-white/60">
                  Posted
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  {new Date(product.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-white">Description</h2>
              <p className="mt-3 whitespace-pre-line leading-7 text-white/90">
                {product.description}
              </p>
            </div>

            {/* <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/chat?receiver=${encodeURIComponent(product.seller_username)}&listingId=${product.id}&sellerId=${product.seller_id}`}
                className="rounded-md bg-white/20 px-5 py-3 text-center font-semibold text-zinc-900 transition hover:opacity-90"
              >
                Contact Seller
              </Link>
            </div> */}
            <form onSubmit={handleDelete}>
              <button type="submit">
                <div className="w-fit rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white">
                  Unsubmit
                </div>
              </button>
            </form>
          </section>
          <section className="rounded-md shadow-md shadow-black/10 bg-linear-to-r from-primary/50 via-secondary/50 to-secondary/50 p-6">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Interested Buyers
            </h2>

            {marketConversations.length === 0 ? (
              <p className="text-white/70">
                No buyers have contacted you yet.
              </p>
            ) : (
              <div className="space-y-3">
                {marketConversations.map((conversation) => (
                  <div
                    key={conversation.conversation_id}
                    className="flex items-center justify-between rounded-md bg-black/20 p-4"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        {conversation.buyer_username}
                      </p>

                      <p className="text-sm text-white/70">
                        Buyer ID: {conversation.buyer_id}
                      </p>
                    </div>

                    <Link
                      href={`/chat?receiver=${conversation.buyer_username}&listingId=${productId}`}
                      className="rounded-md bg-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/30"
                    >
                      Open Chat
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

// http://localhost:3000/chat?receiver=calvinpandiangan4&listingId=63&sellerId=90