import { useState } from "react";

type Img = {
  url: string;
  authorName: string;
  description: string;
};

function Image({ img }: { img: Img }) {
  const loveStates = ["❤️", "🤍"];

  const [loved, setLoved] = useState("🤍");

  const handleLove = () => {
    setLoved(loveStates[loveStates.indexOf(loved) ^ 1]);
  };

  return (
    <>
      <div style={{ borderRadius: "8px" }} className="image-container">
        <img
          src={img.url}
          alt="imagine"
          style={{ width: "100%", borderRadius: "8px" }}
          className="image"
        />
        <div className="image-details">
          <p>
            <i>Author</i>: {img.authorName}
          </p>
          <p>
            <i>Description</i>: {img.description}
          </p>
        </div>
        <div>
          <button className="love-button" onClick={handleLove}>
            {loved}
          </button>
        </div>
      </div>
    </>
  );
}

export default Image;
