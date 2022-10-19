import Image from "next/image";
import catLoading from "../public/cat-loading.gif"


export default function Loading(){
 return(
  <div className='w-full mt-72 flex flex-col justify-center items-center'>
    <Image src={catLoading} alt="로딩중..."/>
    <p className=' text-amber-700 font-semibold'>Loading...</p>
  </div>
 )
}