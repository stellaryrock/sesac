import { use } from "react";
import Image
 from "next/image";
type Props = {
  params : Promise<{id : string}>
};

export default function PhotosID({ params } : Props){
  const { id } = use(params);
  return (
    <>
      <Image
        src={`https://picsum.photos/id/${id}/200/300`}
        alt={'picsum random photo'}
        width={150}
        height={150}
      />
    </>
  )
}