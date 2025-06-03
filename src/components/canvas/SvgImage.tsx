import React, { useEffect, useState } from "react";
import { Image } from "react-konva";

interface SVGImageProps {
  svgContent: string;
  width: number;
  height: number;
}

const SVGImage: React.FC<SVGImageProps> = ({ svgContent, width, height }) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    // Encode SVG sebagai data URL
    const svgBlob = new Blob([svgContent], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      setImage(img);
      URL.revokeObjectURL(url); // Clean up
    };

    img.src = url;
  }, [svgContent]);

  return image ? <Image image={image} width={width} height={height} /> : null;
};

export default SVGImage;
