import useImage from "use-image";
import { Image } from "react-konva";

type URLImageType = {
  src: string;
};

const URLImage = ({ src }: URLImageType) => {
  let [image] = useImage(src, "anonymous");
  return <Image image={image} />;
};

export default URLImage;
