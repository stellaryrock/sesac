import Image from "next/image"
import Link from "next/link"

export default function ParallelPhotoList(){
  const arrId = new Array(10).fill(0)
  
  return(
    <>
      <ul className="flex flex-wrap gap-2 my-2">
        {arrId.map(
          (val, idx) => 
            <li key={idx}>
              <Link href={`/photos/${idx}`}>
                <Image
                  src={`https://picsum.photos/id/${idx}/200/300`}
                  alt={'picsum photo'}
                  width={200}
                  height={300}
                />
              </Link>
            </li>
          )
        }
      </ul>
    </>
  )
}