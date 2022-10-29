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
  {data[kind].length === 0 ? <p className="text-yellow-900 text-lg font-semibold text-center pt-72">아직 내역이 없어요 😢 😢</p> : ""}
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