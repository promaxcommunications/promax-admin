import Image, { ImageProps } from "next/image";

const ImageEl = ({ src, alt, className, ...props }: ImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={0}
      height={0}
      sizes="100vw"
      className={`w-auto h-auto ${className}`}
      {...props}
    />
  );
};

export default ImageEl;
