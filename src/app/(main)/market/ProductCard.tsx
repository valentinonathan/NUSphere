import type { ProductCardType } from "./page"
import Image from "next/image"
import Link from "next/link"


// export type ProductCard = {
//     id: number
//     image_url: string
//     title: string
// }




const ProductCard = ({ id, image_url, title }: ProductCardType) => {
  return (
    <Link href={`marketplace/${id}`}>
      <div className="shadow-black/10 shadow-md bg-linear-to-r from-primary/50 from-0% via-secondary/50 via-110% to-secondary/50 to-100% rounded-md p-4">
        <img src={image_url} />
        <p>{title}</p>
      </div>
    </Link>
  )
}

export default ProductCard