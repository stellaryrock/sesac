import { use } from "react";

type Props = {
  params : Promise<{id : string}>
}

export default function PhotosId({params} : Props){
  const { id } = use(params);
  
  return (
    <>
      <h1 className='text-2xl capitalize'>ID {id}</h1>
    </>
  )
}