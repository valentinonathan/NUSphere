"use client"

import { useEffect, useMemo, useState } from "react"
import ProductCard from "./ProductCard"
import { fetchBackendClient } from "@/utils/fetch-backend-client"
import Link from "next/link"

export type Listing = {
  id: number
  seller_id: number
  title: string
  description: string
  price: number
  image_url: string
  created_at: string
  seller_username: string
  category_id: number
  category_name: string
}

export type ApiResponse<T> = {
  message?: string
  data?: T
}

export type ProductCardType = Pick<
  Listing,
  "id" | "image_url" | "title" | "seller_username" | "price" | "category_name"
>

const Page = () => {
  const [productCards, setProductCards] = useState<ProductCardType[]>([])
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true)
        const response = await fetchBackendClient<ApiResponse<ProductCardType[]>>(
          "/market",
          "GET"
        )

        if (response.message) {
          throw new Error(response.message)
        } else if (response.data) {
          setProductCards(response.data)
        }
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage("Can not load listings")
        }
      } finally {
        setLoading(false)
      }
    }

    loadListings()
  }, [])

  const categories = useMemo(() => {
    const unique = new Set(productCards.filter((pc) => pc.category_name != undefined).map((pc) => pc.category_name))
    return ["All", ...Array.from(unique)]
  }, [productCards])

  console.log(categories)

  const filteredCards = useMemo(() => {
    if (selectedCategory === "All") return productCards
    return productCards.filter((pc) => pc.category_name === selectedCategory)
  }, [productCards, selectedCategory])

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-3">
        <p>{String(filteredCards.length)} items</p>

        <select
          className="rounded-md border px-3 py-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category} className="text-black">
              {category}
            </option>
          ))}
        </select>

        <Link
          href="/market/MyProducts/"
          className="inline-flex items-center justify-center rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600"
        >
          MyProducts
        </Link>
      </div>

      {loading && <p>Loading</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="flex flex-wrap gap-2">
        {filteredCards.map((pc) => (
          <ProductCard key={pc.id} {...pc} />
        ))}
      </div>
    </div>
  )
}

export default Page