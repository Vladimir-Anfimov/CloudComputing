import Masonry from "react-masonry-css";
import Image from "./Image";
import { Auth } from "firebase/auth";
import { useEffect, useState } from "react";

type Img = {
  url: string;
  authorName: string;
  description: string;
  authorId: string;
  createdAt: string;
  extension: string;
};

interface ImgProps {
  auth: Auth;
}

const API_URL = "http://localhost:8082/api/images";

function Images({ auth }: ImgProps) {
  const [images, setImages] = useState<Img[]>([]);

  const fetchImages = async () => {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
      },
    });

    const data = await response.json();
    const _images: Img[] = data.images.map((img: any) => ({
      url: `${img.url}.${img.extension}`,
      authorName: img.authorEmail,
      description: img.description,
      authorId: img.authorId,
      createdAt: formatDate(img.createdAt),
    }));
    setImages(_images);
  };

  useEffect(() => {
    fetchImages();
  }, [auth]);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <>
      <div className="container">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {images.length > 0 &&
            images.map((img, index) => <Image key={index} img={img} />)}
        </Masonry>
      </div>
    </>
  );
}

export default Images;
