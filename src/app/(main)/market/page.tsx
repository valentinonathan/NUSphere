"use client"

import { useState } from "react"
import ProductCard from "./ProductCard"
import { useEffect } from "react"
import { fetchBackendClient } from "@/utils/fetch-backend-client"

export type Listing = {
    id: number,
    seller_id: number
    title: string
    description: string
    price: number
    image_url: string
    created_at: string
    seller_username: string
}

export type ApiResponse<T> = {
    message?: string
    data?: T
}

export type ProductCardType = {
    id: number
    image_url: string
    title: string
    seller_username: string
}

const page = () => {
    const [productCards, setProductCards] = useState<ProductCardType[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadListings() {
            try {
                setLoading(true);
                const response = await fetchBackendClient<ApiResponse<ProductCardType[]>>("/market", "GET")
                console.log(response)
                if (response.message) {
                    throw new Error(response.message)
                } else if (response.data) {
                    setProductCards(response.data)
                }

            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Can not load listings")
                }
            } finally {
                setLoading(false);
            }
         }

         loadListings();

    }, [])

    return (
        <div className="">
            <p>{String(productCards.length)}</p>
           {loading && <p>Loading</p>}
           {productCards.map((pc) => (
                <ProductCard key={pc.id} {...pc}/>
            ))}
        </div>
    )
}

export default page