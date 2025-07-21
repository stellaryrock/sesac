"use client";
import { useRouter } from "next/router";
import { MouseEventHandler, use } from "react";

type Props = {
  params : Promise<{id : string}>
};

export default function ModalID({ params } : Props){
  const { id } = use(params);
  const router = useRouter();

  const onClickPrev :MouseEventHandler<HTMLButtonElement> = (evt) => {
    console.log("Back to Gallery");
    router.back();
  }

  return (
    <>
      <h2>ModalID Id {id}</h2>
      <button onClick= {onClickPrev}>Back to Gallery</button>
    </>
  )
}