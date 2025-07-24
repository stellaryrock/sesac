const PHOTOS_URL = 'https://picsum.photos/v2/list?limit=12';

export type Photo = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
};

export const getPhotos = async (): Promise<Photo[]> => {
  return fetch(PHOTOS_URL).then((res) => res.json());
};

export const getPhoto = async (id: string): Promise<Photo> => {
  return fetch(`https://picsum.photos/id/${id}/info`).then((res) => res.json());
};
