import { useState } from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  title: string;
  height: number;
  width: number;
  className: string;
};

const fallback =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM8Ug8AAg0BRS8X/OoAAAAASUVORK5CYII=";

export default function Avatar({
  src,
  alt,
  title,
  height,
  width,
  className,
}: Props) {
  const [imageSrc, setImageSrc] = useState<string>(src);
  return (
    <Image
      loader={({ src }) => src}
      src={imageSrc}
      height={height}
      width={width}
      alt={alt}
      title={title}
      className={className}
      onError={() => setImageSrc(fallback)}
      placeholder="blur"
      blurDataURL={fallback}
    />
  );
}
