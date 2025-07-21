import { use } from "react";

type Props = {
  params : Promise<{id : string}>
};

export default function PhotolistId({ params } : Props){
  const { id } = use(params);
  return (
    <>
      <h2>Photos Id {id}</h2>
    </>
  )
}