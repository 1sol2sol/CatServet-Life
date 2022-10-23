import { ProductWithCount } from "pages";
import useSWR from "swr"
import Item from "./item";

interface ProductListProps{
  kind: "favs" | "sales" | "purchases"
}

interface Record {
  id: number;
  product: ProductWithCount;
}

interface ProductListResponse {
  [key:string]: Record[]
}

export default function ProudctList({kind}: ProductListProps){
  const {data} = useSWR<ProductListResponse>(`/api/users/me/${kind}`);
  return data ? 
  <>
  {data[kind]?.map((record) => (
    <Item
      id={record.product.id}
      key={record.id}
      image={record.product.image}
      title={record.product.name}
      price={record.product.price}
      time={record.product.created}
      comments={record.product._count.chatRooms}
      hearts={record.product._count.favs}
    />
  ))}
  </>
  :null

}