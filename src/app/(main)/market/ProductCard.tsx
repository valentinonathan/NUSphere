import type { ProductCardType } from "./page"
import Image from "next/image"
import Link from "next/link"

// export type ProductCard = {
//     id: number
//     image_url: string
//     title: string
// }




const ProductCard = ({ id, image_url, title, seller_username, price, category_name }: ProductCardType) => {
  return (
    <Link href={`/market/${id}`} className="w-fit h-fit">
      <div className="shadow-black/10 shadow-md bg-linear-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% rounded-md aspect-square">
        <Image
          src="/post-dummy.png"
          alt="Post"
          width={256}
          height={256}
          className="object-cover w-64 h-64"
        />
        <div className="px-2">
          <span className="inline-block rounded-md bg-red-500 px-2 py-0.5 text-white">
            {category_name}
          </span>
          <p>{title}</p>
          <p>Seller: {seller_username}</p>
          <p>${price}</p>

        </div>
      </div>
    </Link>
  )
}

export default ProductCard