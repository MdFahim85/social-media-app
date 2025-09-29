import Image from "next/image";

function ImageBox({
  src,
  size,
}: {
  src: string | null | undefined;
  size: number;
}) {
  return (
    <Image
      src={src || "/avatar.png"}
      alt="Avatar"
      width={size}
      height={size}
      className="rounded-full"
    />
  );
}

export default ImageBox;
