import React, { useRef, useState } from "react";
import { Group, Transformer, Circle, Text } from "react-konva";
import { useDiagramContext } from "../../store/DiagramContext";
import { ShapeOnCanvas } from "../../types/shapes";
import SVGImage from "./SvgImage";
import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";
import { getDefaultShapeSize } from "../../utils/shapeUtils";
import { getTextPositionsForShape } from "../../utils/textPositionUtils";

interface DiagramShapeProps {
  shape: ShapeOnCanvas;
  isSelected: boolean;
  onSelect: () => void;
  onShiftSelect?: () => void;
  onChange: (newAttrs: Partial<ShapeOnCanvas>) => void;
}

// Helper function untuk format multiline text (tambahkan di luar component)
const formatMultilineText = (text: string) => {
  if (!text) return "";

  // Split text menjadi beberapa baris jika terlalu panjang
  const maxCharsPerLine = 15;
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    if (
      (currentLine + word).length > maxCharsPerLine &&
      currentLine.length > 0
    ) {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  });

  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  return lines.join("\n");
};

const DiagramShape: React.FC<DiagramShapeProps> = ({
  shape,
  isSelected,
  onSelect,
  onShiftSelect,
  onChange,
}) => {
  const transformerRef = React.useRef<any>(null);
  const shapeRef = React.useRef<any>(null);
  const textRef = React.useRef<any>(null);

  // State untuk hover effect pada connector
  const [hoveredConnector, setHoveredConnector] = useState<string | null>(null);

  // Tambahkan initialPosition ref untuk tracking saat drag
  const initialPositionRef = useRef({ x: shape.x, y: shape.y });

  const {
    completeConnection,
    isConnecting,
    connectingFromId,
    connectingFromPoint,
    startConnectionFromPoint,
    selectedIds,
    updateShapePosition,
    // startDrawingConnection,
  } = useDiagramContext();

  React.useEffect(() => {
    if (isSelected) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Hitung ukuran connector berdasarkan ukuran shape
  const getConnectorRadius = () => {
    // Membuat ukuran konektor proporsional dengan ukuran shape tapi dengan batas maksimum
    const baseDimension = Math.min(shape.width || 100, shape.height || 50);
    return Math.min(5, Math.max(3, baseDimension * 0.05));
  };

  // Fungsi untuk mendapatkan ukuran font yang konsisten dan lebih stabil
  const getConsistentFontSize = (
    baseFontSize: number,
    fontType: "id" | "main" | "text" = "main"
  ) => {
    // Definisikan ukuran font standar berdasarkan tipe
    const standardSizes = {
      id: 12, // Ukuran ID tetap
      main: 13, // Ukuran teks utama
      text: 14, // Ukuran teks biasa
    };

    // Ambil ukuran standar berdasarkan tipe
    const standardSize = standardSizes[fontType];

    // Jika ada custom font size dari shape, gunakan itu tapi tetap dalam range yang wajar
    if (baseFontSize && baseFontSize !== standardSize) {
      return Math.min(18, Math.max(10, baseFontSize));
    }

    // Untuk shape yang sangat kecil, gunakan font size yang lebih kecil
    const shapeArea = (shape.width || 100) * (shape.height || 50);
    const normalArea = 100 * 50; // Area normal reference

    if (shapeArea < normalArea * 0.5) {
      // Shape kecil - kurangi font size sedikit
      return Math.max(10, standardSize - 2);
    } else if (shapeArea > normalArea * 2) {
      // Shape besar - tambah font size sedikit
      return Math.min(16, standardSize + 1);
    }

    // Ukuran normal
    return standardSize;
  };

  // Fungsi untuk mendapatkan semua shape yang dipilih
  // (Posisi text sekarang otomatis, tidak perlu property manual mainTextX/mainTextY/idTextX/idTextY)
  const getSelectedShapes = (): Konva.Node[] => {
    const stage = shapeRef.current?.getStage();
    if (!stage) return [];

    const selectedShapes: Konva.Node[] = [];
    selectedIds.forEach((id) => {
      // Cari node dengan id yang sesuai
      const node = stage.findOne(`#${id}`);
      if (node) selectedShapes.push(node);
    });

    return selectedShapes;
  };

  // Tangani awal drag
  const handleDragStart = () => {
    // Simpan posisi awal untuk shape ini
    initialPositionRef.current = { x: shape.x, y: shape.y };

    // Jika multiple shapes dipilih, simpan posisi awal untuk semua shapes
    if (selectedIds.length > 1 && isSelected) {
      const selectedShapes = getSelectedShapes();
      selectedShapes.forEach((shapeNode) => {
        // Simpan posisi awal di node itu sendiri sebagai custom attribute
        if (shapeNode.id() !== shape.id) {
          shapeNode.setAttr("initialX", shapeNode.x());
          shapeNode.setAttr("initialY", shapeNode.y());
        }
      });
    }
  };

  // Tangani selama drag
  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    // Hitung delta dari posisi awal
    const deltaX = e.target.x() - initialPositionRef.current.x;
    const deltaY = e.target.y() - initialPositionRef.current.y;

    // Jika multiple shapes dipilih, perbarui posisi semua shapes
    if (selectedIds.length > 1 && isSelected) {
      const selectedShapes = getSelectedShapes();
      selectedShapes.forEach((shapeNode) => {
        // Jangan update shape yang sedang di-drag
        if (shapeNode.id() !== shape.id) {
          const initialX = shapeNode.getAttr("initialX");
          const initialY = shapeNode.getAttr("initialY");

          if (initialX !== undefined && initialY !== undefined) {
            shapeNode.x(initialX + deltaX);
            shapeNode.y(initialY + deltaY);
          }
        }
      });
    }

    // Perbarui attrs untuk shape yang di-drag
    onChange({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  // Tangani akhir drag
  const handleDragEnd = () => {
    // Jika multiple shapes dipilih, komit perubahan ke semua shapes
    if (selectedIds.length > 1 && isSelected) {
      const selectedShapes = getSelectedShapes();
      selectedShapes.forEach((shapeNode) => {
        // Jangan update shape yang sedang di-drag (sudah diupdate oleh onChange di atas)
        if (shapeNode.id() !== shape.id) {
          // Ambil id dan posisi
          const id = shapeNode.id();
          const x = shapeNode.x();
          const y = shapeNode.y();

          // Perbarui posisi di store
          updateShapePosition(id, { x, y });
        }
      });
    }
  };

  // Handle transform untuk menyesuaikan ukuran teks dan connector saat shape di-resize
  const handleTransform = (e: KonvaEventObject<Event>) => {
    // Mendapatkan node yang sedang di-transform
    const node = e.target;
    // Mendapatkan ukuran baru setelah transformasi
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset scale menjadi 1 dan perbarui width dan height
    node.scaleX(1);
    node.scaleY(1);

    // Perbarui shape dengan ukuran baru
    onChange({
      x: node.x(),
      y: node.y(),
      width: Math.max(20, node.width() * scaleX),
      height: Math.max(20, node.height() * scaleY),
    });
  };

  // Handler untuk connector points
  const handleConnectorMouseDown = (
    e: KonvaEventObject<MouseEvent>,
    point: string
  ) => {
    e.cancelBubble = true; // Penting: hentikan propagasi

    if (isConnecting) {
      completeConnection(shape.id, point);
    } else {
      startConnectionFromPoint(shape.id, point);
    }
  };

  // Handler untuk hover effect pada connector
  const handleConnectorMouseEnter = (connectorPoint: string) => {
    setHoveredConnector(connectorPoint);
    document.body.style.cursor = isConnecting ? "crosshair" : "pointer";
  };

  const handleConnectorMouseLeave = () => {
    setHoveredConnector(null);
    document.body.style.cursor = "default";
  };

  const getLetterSpacing = (spacing: string = "normal") => {
    switch (spacing) {
      case "tight":
        return -0.5; // Lebih rapat (-0.5px)
      case "normal":
        return 0; // Jarak normal
      case "loose":
        return 1.5; // Lebih longgar (1.5px)
      default:
        return 0;
    }
  };

  const getDefaultPrefix = () => {
    switch (shape.type) {
      case "goal1":
        return "G";
      case "goal2":
        return "C";
      case "goal3":
        return "Sn";
      case "goal4":
        return "S";
      case "goal5":
        return "A";
      case "goal6":
        return "J";
      case "goal8":
        return "U";
      case "sacm6":
        return "AR";
      default:
        return "";
    }
  };

  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true; // Penting: hentikan propagasi

    // Cek apakah shift key ditekan
    if (e.evt.shiftKey && onShiftSelect) {
      onShiftSelect();
    } else {
      onSelect();
    }
  };

  const handleShapeContextMenu = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
    e.cancelBubble = true;

    // Jika belum dipilih, pilih shape ini dulu
    if (!isSelected) {
      onSelect();
    }

    // Posisi untuk context menu (relatif terhadap container)
    const stage = shapeRef.current.getStage();
    const container = stage.container();
    const containerRect = container.getBoundingClientRect();

    // Koordinat event dalam koordinat panggung
    const point = stage.getPointerPosition();

    // Konversi ke koordinat layar
    const x = containerRect.left + point.x;
    const y = containerRect.top + point.y;

    // Trigger custom event untuk context menu
    const customEvent = new CustomEvent("shapeContextMenu", {
      bubbles: true,
      detail: { x, y, shapeId: shape.id },
    });
    container.dispatchEvent(customEvent);
  };

  // Gunakan fungsi helper ini di dalam komponen DiagramShape
  const defaultSize = getDefaultShapeSize(shape.type);

  // Dapatkan posisi ideal untuk main text dan id text
  const { mainTextX, mainTextY, idTextX, idTextY, mainTextOffsetX } =
    getTextPositionsForShape(
      shape.type,
      shape.width || defaultSize.width,
      shape.height || defaultSize.height
    );

  // Fungsi untuk menghasilkan string SVG dari properti shape
  const getSvgString = () => {
    let svgContent = "";

    switch (shape.type) {
      case "goal1":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="157.28 125.38 76.04 51.49">
            <rect x="157.784" y="125.876" width="75.036" height="50.491" style="stroke: rgb(0, 0, 0); fill: none; stroke-width: 1;"/>
          </svg>
        `;
        break;
      case "goal2":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.47 -0.5 59.54 37.24">
            <path style="stroke: rgb(0, 0, 0); fill: none; stroke-width: 1;" d="M 7.304 0 L 51.52 0.154 C 62.608 7.221 58.996 34.757 51.732 36.243 L 7.152 36.082 C -1.786 34.697 -2.942 3.146 7.304 0 Z"/>
          </svg>
        `;
        break;
      case "goal3":
        svgContent = `
          <svg
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
          >
            <circle
              cx="250"
              cy="250"
              r="240"
              stroke="black"
              stroke-width="7"
              fill="none"
            />
          </svg>
        `;
        break;
      case "goal4":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="141.04 90.31 139.15 47.28">
            <path style="stroke: rgb(0, 0, 0); fill: none; stroke-width: 1;" d="M 164.489 90.813 L 141.538 137.097 L 256.293 136.743 L 279.687 91.52 L 164.489 90.813 Z"/>
          </svg>
        `;
        break;
      case "goal5":
        svgContent = `
          <svg viewBox="62.69 199 97.89 56.82" xmlns="http://www.w3.org/2000/svg">
            <ellipse style="stroke: rgb(0, 0, 0); fill: none; stroke-width: 1;" cx="111.64" cy="227.413" rx="48.446" ry="27.909"/>
            <text style="fill: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 3.3px; font-weight: 700; white-space: pre;" transform="matrix(3.306396, 0, 0, 2.587165, -366.604095, -404.534119)" x="156.487" y="254.027">A</text>
          </svg>
        `;
        break;
      case "goal6":
        svgContent = `
          <svg viewBox="62.69 199 97.89 56.82" xmlns="http://www.w3.org/2000/svg">
            <ellipse style="stroke: rgb(0, 0, 0); fill: none; stroke-width: 1;" cx="111.64" cy="227.413" rx="48.446" ry="27.909"/>
            <text style="fill: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 3.3px; font-weight: 700; white-space: pre;" transform="matrix(3.306396, 0, 0, 2.587165, -366.604095, -404.534119)" x="156.487" y="254.027">J</text>
          </svg>
        `;
        break;
      case "goal7":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="11.04 12.09 24.21 24.21">
            <rect x="158.949" y="83.542" width="15" height="15" style="stroke: rgb(0, 0, 0); fill: none; stroke-width: 0.3;" transform="matrix(0.707106, 0.707108, -0.707108, 0.707106, -30.178931, -157.880223)"/>
          </svg>
        `;
        break;
      case "goal8":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="120.37 137.78 76.04 65.14">
            <rect x="120.873" y="138.278" width="75.036" height="50.491" style="stroke: rgb(0, 0, 0); fill: none; stroke-width: 1;"/>
            <polygon style="stroke: rgb(0, 0, 0); fill: none; stroke-width: 1;" points="157.932 189.286 150.714 195.917 157.932 202.422 164.91 196.192"/>
          </svg>
        `;
        break;
      case "extension1":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="284.18 107.64 14.73 10.36">
            <g transform="matrix(0.436665, 0, 0, 0.518052, 157.340444, -28.360312)" style="">
              <rect x="291.624" y="268.148" width="31.442" height="13.408" style="stroke: rgb(0, 0, 0); fill: rgb(215, 215, 215);"/>
              <rect x="291.624" y="263.496" width="11.706" height="4.652" style="stroke: rgb(0, 0, 0); fill: rgb(215, 215, 215);"/>
            </g>
          </svg>
        `;
        break;
      case "extension2":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="228.46 181.41 76.04 83.6">
            <g style="" transform="matrix(1, 0, 0, 1.039405, 0, -10.423142)">
              <rect x="228.958" y="245.876" width="75.036" height="18.64" style="stroke: rgb(0, 0, 0); fill: none;"/>
              <g transform="matrix(0.436665, 0, 0, 0.518052, 106.434837, 113.239815)" style="">
                <rect x="291.624" y="268.148" width="31.442" height="13.408" style="stroke: rgb(0, 0, 0); fill: rgb(215, 215, 215);"/>
                <rect x="291.624" y="263.496" width="11.706" height="4.652" style="stroke: rgb(0, 0, 0); fill: rgb(215, 215, 215);"/>
              </g>
              <path style="stroke: rgb(0, 0, 0); fill: none;" d="M 228.958 222.158 L 228.958 245.876 L 303.994 245.876 L 303.994 222.222 C 298.294 169.367 232.928 176.067 228.958 222.158 Z"/>
            </g>
          </svg>
        `;
        break;
      case "extension3":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="228.46 209.97 76.04 55.04">
            <g>
              <g style="" transform="matrix(1, 0, 0, 1.039405, 0, -10.423141)">
                <rect x="228.958" y="245.876" width="75.036" height="18.64" style="stroke: rgb(0, 0, 0); fill: none;"/>
                <g transform="matrix(0.436665, 0, 0, 0.518052, 106.434837, 113.239815)" style="">
                  <rect x="291.624" y="268.148" width="31.442" height="13.408" style="stroke: rgb(0, 0, 0); fill: rgb(215, 215, 215);"/>
                  <rect x="291.624" y="263.496" width="11.706" height="4.652" style="stroke: rgb(0, 0, 0); fill: rgb(215, 215, 215);"/>
                </g>
                <path style="stroke: rgb(0, 0, 0); fill: none;" d="M 237.421 212.967 C 228.585 216.1 229.403 223.191 228.958 224.503 L 228.958 245.876 L 303.994 245.876 L 303.994 223.458 C 303.668 222.055 303.964 214.798 295.913 212.522 L 237.421 212.967 Z"/>
              </g>
            </g>
            <path style="fill: rgb(51, 51, 51); white-space: pre;"/>
          </svg>
        `;
        break;
      case "extension4":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="228.46 194.89 76.04 70.13">
            <rect x="228.958" y="195.385" width="75.036" height="50.491" style="stroke: rgb(0, 0, 0); fill: none;"/>
            <rect x="228.958" y="245.876" width="75.036" height="18.64" style="stroke: rgb(0, 0, 0); fill: none;"/>
            <g transform="matrix(0.436665, 0, 0, 0.518052, 106.434841, 113.239818)" style="">
              <rect x="291.624" y="268.148" width="31.442" height="13.408" style="stroke: rgb(0, 0, 0); fill: rgb(215, 215, 215);"/>
              <rect x="291.624" y="263.496" width="11.706" height="4.652" style="stroke: rgb(0, 0, 0); fill: rgb(215, 215, 215);"/>
            </g>
          </svg>
        `;
        break;
      case "sacm1":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="157.28 125.38 76.04 51.49">
            <rect x="157.784" y="125.876" width="75.036" height="50.491" style="stroke: rgb(0, 0, 0); fill: none; stroke-width: 1;"/>
          </svg>
        `;
        break;
      case "sacm2":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="42px" height="32px" viewBox="-0.5 -0.5 42 32" content="&lt;mxfile host=&quot;app.diagrams.net&quot; modified=&quot;2022-06-30T09:25:18.978Z&quot; agent=&quot;5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36 OPR/87.0.4390.58&quot; etag=&quot;7O8Wa1ro8iPvzCV4VFdQ&quot; version=&quot;20.0.3&quot; type=&quot;device&quot;&gt;&lt;diagram id=&quot;_T3-QKW7s_aK2je1OpGu&quot; name=&quot;Page-1&quot;&gt;7ZbLTsMwEEW/Jksk59HXspQUFiAhumBt4iGx6mQix2lavh6HOA+nQrSIik03lX08vhPf66Z1/FW6v5c0T56QgXA8wvaOf+d4njcJ9GcNDg1w54sGxJIzg3qw4R9gIDG05AwKq1AhCsVzG0aYZRApi1EpsbLL3lHYXXMawxHYRFQc01fOVNLQ+YT0/AF4nLSdXWJWUtoWG1AklGE1QH7o+CuJqJpRul+BqL1rfWn2rb9Z7R5MQqZO2QALcEOKj5xSb/u2JssqfLkxKjsqSnNg87Dq0DoAGVvWRupZhpmGt4lKhZ65eiixzBjUHYieFUritvOpXsecRlzV2c/qgkYc2JHn/SHczhp9pQBTUPKgS6re/Nb7ZOB7yyQIqvjOlqfmDsSdXNfhGblu7BFzXd2p0Wlv64LYEgWWMgKza2j2T0LTkZCiMgZ1JKQHg2P36CvLM3L1r7meFcfJuc7/N9fgmutlvq/jXMdCF851cs3ViiMYxTEL/ug9PBb6da562v92N+X9HyA//AQ=&lt;/diagram&gt;&lt;/mxfile&gt;"><defs/><g><path d="M 20 30 L 20 0" fill="none" stroke="rgb(0, 0, 0)" stroke-opacity="0.7" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 20 0 L 40 0" fill="none" stroke="rgb(0, 0, 0)" stroke-opacity="0.7" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 20 30 L 40 30" fill="none" stroke="rgb(0, 0, 0)" stroke-opacity="0.7" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 0 14 L 20 14" fill="none" stroke="rgb(0, 0, 0)" stroke-opacity="0.7" stroke-miterlimit="10" pointer-events="stroke"/></g></svg>
        `;
        break;
      case "sacm3":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="40" height="40" viewBox="0 0 40 40" xml:space="preserve">
          <desc>Created with Fabric.js 4.6.0</desc>
          <defs>
          </defs>
          <g transform="matrix(0 0.09 1.16 0 36.94 4.81)" id="dSP65oEp0JMh1TZHnJUzP"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.52 -0.46 0.06 0.04 30.96 3.64)" id="J6yUVuefAgSbee4HkUeEq"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.02 -0.01 -0.01 -0.02 32.83 2.4)" id="NGt3V3D4NCkSluSwWw4sh"  >
          <path style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(-40, -40)" d="M 60 40 L 80 80 L 40 80 L 0 80 L 20 40 L 40 0 L 60 40 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.63 0.09 0 5.7 38.42)" id="lxfNtmBv0g3jh5kDUI6XZ"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(6.13 0 0 6.57 17.23 18.45)" id="S6lAl6dO2Dpksxpi8gXUo"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.76515 -2.76515 L 2.76515 -2.76515 L 2.76515 2.76515 L -2.76515 2.76515 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -7.16 0.07 0 39.79 22.1)" id="K9D6ezRr6qG2r3Ctiym50"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 7.06 0 22.71 39.75)" id="KzY64UF0oP3kADxV73kto"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          </svg>
        `;
        break;
      case "sacmExt1":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="40" height="20" viewBox="0 0 40 20" xml:space="preserve">
          <desc>Created with Fabric.js 4.6.0</desc>
          <defs>
          </defs>
          <g transform="matrix(4.49 0 0 3.43 19.65 10.03)" id="96NAcnrz7GuuUwYq2Z-D2"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.84091 -2.84091 L 2.84091 -2.84091 L 2.84091 2.84091 L -2.84091 2.84091 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.11 0 0 4.06 39.7 10.03)" id="lKdIPQKHIjGOF8W-_gANH"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 -1 0 37.52 19.76)" id="5CCU0tkhn5uCPNuC973N0"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 -1 0 37.52 0.24)" id="aV5kzypfVc_LNOIMi44Dg"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(-0.11 0 0 4.06 0.3 10.03)" id="NVe-Cj3ukKkw7zIRvF0sa"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 1 0 2.52 19.76)" id="qs3XggaQyStQSqze1592M"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 1 0 2.52 0.24)" id="0UI9G6mzA2oIL9GvMP6pf"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          </svg>
        `;
        break;
      case "sacmExt2":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="40" height="40" viewBox="0 0 40 40" xml:space="preserve">
          <desc>Created with Fabric.js 4.6.0</desc>
          <defs>
          </defs>
          <g transform="matrix(1.92 0 0 0.13 19.99 1.69)" id="AizuvqeKMzawDr0uU-KN7"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(1.74 0 0 1.78 19.99 21.33)" id="8UfMRL__SYEPkqzdoEoKX"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.37 0 0 1.78 34.01 21.33)" id="Uy6J-KacOb5BBUwtJEBsM"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.37 0 0 0.9 34.01 30.34)" id="LXudeA1sw0k5mjlLVuf8L"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.29 0 0 0.36 34.01 12.3)" id="WOz9Zhywxl9kLtZ7ozu6W"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.84 0 0 0.84 34.01 28.82)" id="Tv1qP8KzixZVBwg9Kkl_x"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M 0 -3.18182 C 1.75637 -3.18182 3.18182 -1.7563600000000001 3.18182 0 C 3.18182 1.75637 1.7563600000000001 3.18182 0 3.18182 C -1.75637 3.18182 -3.18182 1.7563600000000001 -3.18182 0 C -3.18182 -1.75637 -1.7563600000000001 -3.18182 0 -3.18182 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.84 0 0 0.84 34.01 31.82)" id="RQkcyGRAGCdKH4YXy6eEH"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M 0 -3.18182 C 1.75637 -3.18182 3.18182 -1.7563600000000001 3.18182 0 C 3.18182 1.75637 1.7563600000000001 3.18182 0 3.18182 C -1.75637 3.18182 -3.18182 1.7563600000000001 -3.18182 0 C -3.18182 -1.75637 -1.7563600000000001 -3.18182 0 -3.18182 z" stroke-linecap="round" />
          </g>
          </svg>
        `;
        break;
      case "sacmExt3":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="40" height="40" viewBox="0 0 40 40" xml:space="preserve">
          <desc>Created with Fabric.js 4.6.0</desc>
          <defs>
          </defs>
          <g transform="matrix(1.92 0 0 0.13 19.99 1.69)" id="AizuvqeKMzawDr0uU-KN7"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(1.74 0 0 1.78 19.99 21.33)" id="8UfMRL__SYEPkqzdoEoKX"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.37 0 0 1.78 34.01 21.33)" id="Uy6J-KacOb5BBUwtJEBsM"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.37 0 0 0.9 34.01 30.34)" id="LXudeA1sw0k5mjlLVuf8L"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.29 0 0 0.36 34.01 12.3)" id="WOz9Zhywxl9kLtZ7ozu6W"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.44 0 0 0.44 34.01 26.96)" id="Tv1qP8KzixZVBwg9Kkl_x"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M 0 -3.18182 C 1.75637 -3.18182 3.18182 -1.7563600000000001 3.18182 0 C 3.18182 1.75637 1.7563600000000001 3.18182 0 3.18182 C -1.75637 3.18182 -3.18182 1.7563600000000001 -3.18182 0 C -3.18182 -1.75637 -1.7563600000000001 -3.18182 0 -3.18182 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.37 0 0 0.9 54.01 50.34)" id="FzL2Zim_GYVBhkPTOpHzQ"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.02 0 0 0.66 34.01 30.83)" id="xlvMBJsNP3AczmG1Ei6Cj"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -3.78788 -3.78788 L 3.78788 -3.78788 L 3.78788 3.78788 L -3.78788 3.78788 z" stroke-linecap="round" />
          </g>
          </svg>
        `;
        break;
      case "sacmExt4":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="40" height="40" viewBox="0 0 40 40" xml:space="preserve">
          <desc>Created with Fabric.js 4.6.0</desc>
          <defs>
          </defs>
          <g transform="matrix(1.92 0 0 0.13 19.99 1.69)" id="AizuvqeKMzawDr0uU-KN7"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(1.74 0 0 1.78 19.99 21.33)" id="8UfMRL__SYEPkqzdoEoKX"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.37 0 0 1.78 34.01 21.33)" id="Uy6J-KacOb5BBUwtJEBsM"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.37 0 0 0.9 34.01 30.34)" id="LXudeA1sw0k5mjlLVuf8L"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.29 0 0 0.36 34.01 12.3)" id="WOz9Zhywxl9kLtZ7ozu6W"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z" stroke-linecap="round" />
          </g>
          </svg>
        `;
        break;
      case "sacmExt5":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="40" height="20" viewBox="0 0 40 20" xml:space="preserve">
          <desc>Created with Fabric.js 4.6.0</desc>
          <defs>
          </defs>
          <g transform="matrix(8.07 0 0 3.63 20 9.14)" id="YBq28Vp2qFK8Nmzy9J-YF"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.87 0 0 0.87 19.98 19.56)" id="-q12FbmdiJvuG1vZ5ijOD"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.87 0 0 0.87 19.99 19.81)" id="IjpB59CyjIFRwGaPQ2dZJ"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z" stroke-linecap="round" />
          </g>
          </svg>
        `;
        break;
      case "sacmExt6":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="40" height="20" viewBox="0 0 40 20" xml:space="preserve">
          <desc>Created with Fabric.js 4.6.0</desc>
          <defs>
          </defs>
          <g transform="matrix(7.85 0 0 3.74 19.89 10.1)" id="YBq28Vp2qFK8Nmzy9J-YF"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.84 -0.39 -0.39 -0.84 19.89 10.1)" id="-q12FbmdiJvuG1vZ5ijOD"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.83 0.39 -0.37 0.79 19.89 10)" id="IjpB59CyjIFRwGaPQ2dZJ"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z" stroke-linecap="round" />
          </g>
          </svg>
        `;
        break;
      case "sacmExt7":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xml:space="preserve" viewBox="-0.01 -0.09 40.05 29.31">
          <desc>Created with Fabric.js 4.6.0</desc>
          <defs>
          </defs>
          <g transform="matrix(0 0.1 -0.88 0 10.32 26.52)" id="rtuyLlzMzHeXcqo1XDg5E">
          <path style="stroke: rgb(0,0,0); stroke-width: 20; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke" transform=" translate(0, 0)" d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z" stroke-linecap="round"/>
          </g>
          <g transform="matrix(0 0.1 -0.88 0 29.45 26.58)" id="fDe7PWYj4-jwFOfE--7SU">
          <path style="stroke: rgb(0,0,0); stroke-width: 20; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke" transform=" translate(0, 0)" d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z" stroke-linecap="round"/>
          </g>
          <g transform="matrix(4.49 0 0 1.48 19.89 26.14)" id="UowMXpxyILWXvDzvSWu-b">
          <path style="stroke: rgb(0,0,0); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke" transform=" translate(0, 0)" d="M -2.07824 -2.07824 L 2.07824 -2.07824 L 2.07824 2.07824 L -2.07824 2.07824 z" stroke-linecap="round"/>
          </g>
          <g transform="matrix(0 0.57 -0.88 0 0.27 13.35)" id="NERr3R3TkklDyYCS7c8gx">
          <path style="stroke: rgb(0,0,0); stroke-width: 20; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke" transform=" translate(0, 0)" d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z" stroke-linecap="round"/>
          </g>
          <g transform="matrix(0 0.58 -0.88 0 39.79 13.37)" id="8p5y28PdfCeXmQdVzq9gy">
          <path style="stroke: rgb(0,0,0); stroke-width: 20; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke" transform=" translate(0, 0)" d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z" stroke-linecap="round"/>
          </g>
          <g transform="matrix(0.86 0 0 1.31 19.97 0.23)" id="DggPCMuK1zK5BbEEi8BhJ">
          <path style="stroke: rgb(0,0,0); stroke-width: 20; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke" transform=" translate(0, 0)" d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z" stroke-linecap="round"/>
          </g>
          <g transform="matrix(0.22 0 0 1.31 5.25 26.51)" id="3HTYJiSHVVnfGHP-XLhLI">
          <path style="stroke: rgb(0,0,0); stroke-width: 20; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke" transform=" translate(0, 0)" d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z" stroke-linecap="round"/>
          </g>
          <g transform="matrix(0.21 0 0 1.26 34.8 26.51)" id="gznAmQxsZFEPbDIFNXXWX">
          <path style="stroke: rgb(0,0,0); stroke-width: 20; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke" transform=" translate(0, 0)" d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z" stroke-linecap="round"/>
          </g>
          </svg>
        `;
        break;
      case "sacmExt8":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="40" height="30" viewBox="0 0 40 30" xml:space="preserve">
          <desc>Created with Fabric.js 4.6.0</desc>
          <defs>
          </defs>
          <g transform="matrix(4.49 0 0 1.62 19.89 28.5)" id="UowMXpxyILWXvDzvSWu-b"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.07824 -2.07824 L 2.07824 -2.07824 L 2.07824 2.07824 L -2.07824 2.07824 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.63 -0.88 0 0.27 14.56)" id="NERr3R3TkklDyYCS7c8gx"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.63 -0.88 0 39.79 14.58)" id="8p5y28PdfCeXmQdVzq9gy"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.86 0 0 1.42 19.97 0.25)" id="DggPCMuK1zK5BbEEi8BhJ"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.25 0 0 1.62 5.96 28.9)" id="3HTYJiSHVVnfGHP-XLhLI"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.24 0 0 1.57 34.1 28.9)" id="gznAmQxsZFEPbDIFNXXWX"  >
          <path style="stroke: rgb(0,0,0); stroke-width: 0.5; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(1.15 0 0 1.25 15.84 28.9)" id="iMmki-e1QTnClkEtZ-v8g"  >
          <path style="stroke: rgb(120,161,12); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M 0 -0.76705 C 0.42341 -0.76705 0.76705 -0.42341 0.76705 0 C 0.76705 0.42341 0.42341 0.76705 0 0.76705 C -0.42341 0.76705 -0.76705 0.42341 -0.76705 0 C -0.76705 -0.42341 -0.42341 -0.76705 0 -0.76705 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(1.15 0 0 1.25 19.89 28.9)" id="bMMqRhrRdflonlyrEYec_"  >
          <path style="stroke: rgb(120,161,12); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M 0 -0.76705 C 0.42341 -0.76705 0.76705 -0.42341 0.76705 0 C 0.76705 0.42341 0.42341 0.76705 0 0.76705 C -0.42341 0.76705 -0.76705 0.42341 -0.76705 0 C -0.76705 -0.42341 -0.42341 -0.76705 0 -0.76705 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(1.15 0 0 1.25 24.19 28.9)" id="8A_kbOM-5KLVSQ6EJ_rlG"  >
          <path style="stroke: rgb(120,161,12); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M 0 -0.76705 C 0.42341 -0.76705 0.76705 -0.42341 0.76705 0 C 0.76705 0.42341 0.42341 0.76705 0 0.76705 C -0.42341 0.76705 -0.76705 0.42341 -0.76705 0 C -0.76705 -0.42341 -0.42341 -0.76705 0 -0.76705 z" stroke-linecap="round" />
          </g>
          </svg>
        `;
        break;
      case "sacmExt9":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="40" height="40" viewBox="0 0 40 40" xml:space="preserve">
          <desc>Created with Fabric.js 4.6.0</desc>
          <defs>
          </defs>
          <g transform="matrix(0 0.09 0.71 0 32.97 0.27)" id="JZxVSofQ1urerpIAWryBq"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.72 0 28.65 0.27)" id="g7WSGJ5m42Kt9t1-uluXv"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.72 0 24.29 0.27)" id="Too_YVDNwMiJmG3Z4fZ5C"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.72 0 19.95 0.27)" id="_1HfLz568FSHBu8V0Zjxn"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.72 0 15.97 0.26)" id="cQ4GMjxPuo0uuOFfmnu8J"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.72 0 11.66 0.26)" id="SA6SIGvj5wTPiuBT3guZ-"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.72 0 7.28 0.27)" id="fFEmSSzZFpUwHr0CT88pa"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.72 0 2.95 0.27)" id="J3jJbzTHEckz9EVSFoZCa"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.6 0.09 0 34.48 6.53)" id="4VKPbpie16YBfEbfrD2iS"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.72 0 32.99 36.14)" id="PELGenApNA1M28xeNrgRO"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.72 0 28.66 36.14)" id="9Z3CRUXK_Il3unmAw64oS"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.72 0 24.29 36.15)" id="cJBvkg94FUIycQKwCh1vh"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.72 0 19.95 36.15)" id="rUPYKgqaPEfNWvLVBHmQC"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.72 0 15.97 36.13)" id="qXhx_GubNExNe_MOyk4J_"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.72 0 11.66 36.13)" id="GmMlDF7SpWixg8q1e0aKD"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.72 0 7.28 36.14)" id="-myps8WMrt__FCfZSWhNZ"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.72 0 2.95 36.14)" id="jRp632YQTMZ_hb84Kaqgh"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.6 0.08 0 34.48 2.57)" id="NXylTTELzziIHRXg2AhJ6"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.6 0.08 0 34.48 14.46)" id="KnIuJx4k93S147QwMspx3"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.6 0.08 0 34.48 10.5)" id="O2RBhvxnlUhdEQUAfoshu"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.6 0.08 0 34.48 22.29)" id="nl_X9b3-wjekQjJbEgVt9"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.6 0.08 0 34.48 18.33)" id="SNDlAKdTNCC0dtDyzIcB8"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.6 0.08 0 34.48 30.21)" id="Yu7oHCSu4XuPIc_Fkra7U"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.6 0.08 0 34.48 26.25)" id="iw1LkT8BtRZIvDKgJCc_c"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.6 0.08 0 34.48 33.87)" id="W_tkYOFoBFzX7-05Qaefu"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.6 0.08 0 0.14 6.53)" id="_or_mReG-7rSbIo8LUGW7"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.6 0.08 0 0.14 2.57)" id="IvLBPXH13Gs-Xt44SBfJP"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.6 0.08 0 0.14 14.46)" id="SED3i75ZyAatcwUvorRXT"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.6 0.08 0 0.14 10.5)" id="krDYNyi4e1fy3z38TJ5lm"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.6 0.08 0 0.14 22.29)" id="NHJSlh1J98WT7xxbpVlq2"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.6 0.08 0 0.14 18.33)" id="_IaUv3dYg-6-Tw0IkICqB"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.6 0.08 0 0.14 30.21)" id="U9wrGe-dwQgDQQAWDyx7g"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.6 0.08 0 0.14 26.25)" id="dnTP2JriRnVuC4GMuai4E"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.6 0.08 0 0.14 33.88)" id="I0FZBA7E34AtQjBKAwe3t"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.56 0.08 0 39.77 12.83)" id="MM8q1vjDrJBKc_sDmkuOb"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.56 0.08 0 39.77 9.12)" id="2l5qoO_-esCVLJP0gkHOF"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.56 0.08 0 39.77 20.23)" id="JIeftoKtV9m5-4KdYU-Is"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.56 0.08 0 39.77 16.54)" id="y_aee_wm32zzAbULjXzO_"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.56 0.08 0 39.77 27.56)" id="hRmXdk7CjNmlLcsfL3NSh"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.56 0.08 0 39.77 23.85)" id="YqUl95Vahq9bPv5PqRg5M"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.56 0.08 0 39.77 34.95)" id="b4kXEfy50QEoETjVK3cw-"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.56 0.08 0 39.77 31.25)" id="B1Wubt1KwRSIV1flbFPgj"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.56 0.08 0 39.77 38.38)" id="hte_Jd6bw1AaFDyar7l9T"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.08 0.67 0 38.33 39.77)" id="hUy6tLHXY6j5266CwpX9t"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.08 0.67 0 34.4 39.6)" id="WAlciHHOBpAMTzVfCjqyG"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.08 0.67 0 30.29 39.61)" id="Bz9TF0yhFEw-14sQCphMo"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.08 0.67 0 26.26 39.61)" id="rf41d24w-OcZJRrBMZe77"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.08 0.67 0 22.54 39.59)" id="I_3q4b06XsvnS2aAOOLhF"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.08 0.67 0 18.51 39.59)" id="ZZPPYOi-CumCj4h9WSFYt"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.08 0.67 0 14.42 39.6)" id="D_oUK1DuMp4psX-tl5wq0"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.08 0.67 0 10.37 39.6)" id="EMMIq4LYuSurZjzT8zefi"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.08 0.67 0 6.03 39.6)" id="HmyataW3SS9oiYOqu6b2m"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.6 0.08 0 4.69 37.91)" id="Ng8oIDhLor4_K9sJCQEFk"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.07 0.91 0 37.55 4.76)" id="dSP65oEp0JMh1TZHnJUzP"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.52 -0.46 0.06 0.04 30.96 3.64)" id="J6yUVuefAgSbee4HkUeEq"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0.02 -0.01 -0.01 -0.02 32.83 2.4)" id="NGt3V3D4NCkSluSwWw4sh"  >
          <path style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(-40, -40)" d="M 60 40 L 80 80 L 40 80 L 0 80 L 20 40 L 40 0 L 60 40 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.56 0.08 0 39.77 6.14)" id="lxfNtmBv0g3jh5kDUI6XZ"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          </svg>
        `;
        break;
      case "sacmExt10":
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="40" height="20" viewBox="0 0 40 20" xml:space="preserve">
          <desc>Created with Fabric.js 4.6.0</desc>
          <defs>
          </defs>
          <g transform="matrix(0 0.09 0.36 0 0.97 0.24)" id="0UI9G6mzA2oIL9GvMP6pf"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 3.21 0.24)" id="yN_8upsWGvMM9i8nM9Os6"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 0.96 0.24)" id="ZeGb26rEXitCpvZ-FPRto"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 3.22 0.24)" id="9uC72o-nudbz5ZaZ8iJiN"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 5.46 0.24)" id="cyZ6kbC1PjadUwQDLnwrM"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 7.72 0.24)" id="Td_E24G3hzx9by5sDmVFn"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 10.16 0.24)" id="I3ZDXok9yslAJ9nuZCOeZ"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 12.41 0.24)" id="GYIsMDPJShLtIpmSTlQTf"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 10.15 0.24)" id="lftvFvwLNxBEVJsdsVA0_"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 12.41 0.24)" id="K-rGkDfoCV3Otx2XqfpWm"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 14.65 0.24)" id="1RKniX-7dtt47ilqphIAk"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 16.91 0.24)" id="W6wvAgN_3-qQ_f_WMeYgN"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 19.21 0.24)" id="w_BlvXTrIIWc123pI7iRK"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 21.46 0.24)" id="TPOE8YxIJO1M9Eufbc7v3"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 19.2 0.24)" id="HxllHUv1TEtmjHaKESh5v"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 21.46 0.24)" id="uPqPtoKCQTRTH4STj13FX"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 23.7 0.24)" id="ek_z79SZ93wf_TyXACWEz"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 25.96 0.24)" id="LnUiJX9jMEetePVgIW0U3"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 28.41 0.24)" id="RHDGKgbzkJpC0rCfiE5g2"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 30.66 0.24)" id="LRnBm4bWBZhzEhDJqB8ku"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 28.4 0.24)" id="mF0tP3MRbS2kSld43S1wg"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 30.66 0.24)" id="rEG5MZqpYcA6frM4fznEI"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 32.9 0.24)" id="d0bbTesg6ucDvSPVoIQWy"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 35.16 0.24)" id="GxEJaKHuF2fY-tN53dAbN"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 36.84 0.24)" id="qZJBF6RVGPVBn9kX9KdTM"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 39.1 0.24)" id="DLlBQa6qDLXjIRY1zux7e"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 0.91 19.76)" id="l1K_M4pgLpGfNuRD52Pe9"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 3.16 19.76)" id="9SVaJbhhlJYaGQz0mW39Y"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 0.9 19.76)" id="mbFSE3jEOxelJ6t9OUycZ"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 3.16 19.76)" id="4vIDir-dkpz2mioNg-QEc"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 5.4 19.76)" id="qoYIzryHsQ5SCoKauGoN_"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 7.66 19.76)" id="9_TbcQb53_s7ackvJqzTS"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 10.11 19.76)" id="ExJcDgfEUIp-YWwYxTGRA"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 12.36 19.76)" id="VCnS2Ta0y1lLTikczCX0J"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 10.1 19.76)" id="hJdiwaA3q7zJEVrTjWrSt"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 12.36 19.76)" id="2dpRkg19X0ih6O-aIfLP9"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 14.6 19.76)" id="mSnRklTsy4NolQPOMKkH5"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 16.86 19.76)" id="mJRtl0iCJDlDvZQDCO7M3"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 19.15 19.76)" id="Osn2WmCCQNfoFxZbtVHIE"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 21.4 19.76)" id="MFsyRpWZ-om2gxa6IORl5"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 19.14 19.76)" id="psbP-NwnyhpDMGNlGDdCt"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 21.4 19.76)" id="u-q6yvGc6zILDHLQ6YzII"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 23.64 19.76)" id="en28xvYVjimXGAjQBofFx"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 25.9 19.76)" id="DSNLKSQuL5pWzkCUTzgzq"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 28.35 19.76)" id="o2_SeV7U-qVy89C1SrfF3"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 30.6 19.76)" id="yKxSCxY3Lf8cyxCKPvS65"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 28.34 19.76)" id="PNnyCIvXlmpAi808rltKL"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 30.6 19.76)" id="XTdypTjb3WeVMMaqjtkox"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 32.84 19.76)" id="bHi2HO7JB-IgIcHiiekdd"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 35.1 19.76)" id="1jfp4JOvmhm-xacKESHfx"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 36.78 19.76)" id="Na8DSFCgKh7z5dEbHPk3P"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 39.04 19.76)" id="5gyoYWxo8qhsSBb2LOiKH"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 50.97 50.24)" id="gBmqMgUmmDIN-mZ7EnFct"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 53.22 50.24)" id="25PzPBQ5BNpf3FC5ejJWU"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 50.96 50.24)" id="4UA1FzePBE4LAkMFLor0g"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 53.22 50.24)" id="eIp2BT6Oq0E-6ve-Cf8t1"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 55.46 50.24)" id="hzuNyjh2Gr3g_ypHkj4Kf"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 57.72 50.24)" id="4XaHvGbi6gjJTVJTRYwB5"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 60.17 50.24)" id="IykgJNCz-MLGvjRdAudo_"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 62.42 50.24)" id="LpWagnDpho8JLAqyPJB-5"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 60.16 50.24)" id="jGvLDMS2IZhstj0maMRYH"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 62.42 50.24)" id="BP0XKfaXWwArLIRCLNeMF"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 64.66 50.24)" id="snCjlex63V5wY9nib-i1H"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 66.92 50.24)" id="_-8zH62wt3GULXU1W3UED"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 69.21 50.24)" id="C1m5M-yBYOOX9XHZAOOQa"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 71.46 50.24)" id="cbodlM5hS83cqNWx7WJqF"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 69.2 50.24)" id="WqpMZ4A5FlF8DYVByKynC"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 71.46 50.24)" id="-KD82wV8ka84rnSNKYBFv"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 73.7 50.24)" id="wPfKaAv4x6ebNq1WZR87N"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 75.96 50.24)" id="0OwkjD2uikyeCcZRJiRY9"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 78.41 50.24)" id="px7Frf-toc1KXBWl1WKSZ"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 80.66 50.24)" id="Z9nK4vHKWUulFJJS4pzhH"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 78.4 50.24)" id="aMrfa3blQ3M5pPvUPBpa4"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 80.66 50.24)" id="BPpswaxSVOjKJ-SKs8HTy"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 82.9 50.24)" id="FJM4eBF8RpdFSO5jTPay_"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 85.16 50.24)" id="3GtenohaLQ1r3IIpTw2dt"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 86.84 50.24)" id="WXhVyQ8aSwdgHwpMTdMFF"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 89.1 50.24)" id="bqoUfAdDb6GDe6A6STA5T"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 0.09 0.36 0 60.96 60.24)" id="YPAf-0KK-y2A5mExZSUER"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.45 0.09 0 0.26 1.81)" id="B-5NxjBxTRDiEbLyIshng"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.45 0.09 0 0.24 4.55)" id="fiNjJ4DoH4b03DEkssGCG"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.45 0.09 0 0.24 7.49)" id="CLJwdKtR4sDuwfd0id86k"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.45 0.09 0 0.22 10.22)" id="-wCiVhZFpQksSGuqASX57"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.45 0.09 0 0.22 13.06)" id="WGcEUHE80OsMZZpBPjWrZ"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.45 0.09 0 0.2 15.79)" id="4kL2lS2pdgpOMSXN30bFU"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.45 0.09 0 0.2 18.73)" id="SfMxM0FHjjmuiRdaJ_kFW"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.45 0.09 0 39.76 1.82)" id="b_lv_bgY7503y-sn6R9d5"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.45 0.09 0 39.74 4.55)" id="42IQImt5ttn4Updonz0-e"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.45 0.09 0 39.74 7.49)" id="C5aQejySx6OpR_DKkA2kk"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.45 0.09 0 39.72 10.22)" id="U0siaJzd29VPQ9MJsGyHx"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.45 0.09 0 39.72 13.07)" id="YkRx-nD8HyFCVYYHhWKSG"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.45 0.09 0 39.7 15.8)" id="VVIr_Kp0F5EdsD0--WkGJ"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          <g transform="matrix(0 -0.45 0.09 0 39.7 18.8)" id="7Sv7nBg2fsZdLGWouJejb"  >
          <path style="stroke: rgb(139,52,162); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(0, 0)" d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z" stroke-linecap="round" />
          </g>
          </svg>
        `;
        break;
      case "text":
        // Render text element dengan svg sederhana
        svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${shape.width} ${shape.height}">
          <rect x="0" y="0" width="${shape.width}" height="${shape.height}" fill="transparent" />
        </svg>
      `;
        break;
      default:
        svgContent = `
          <svg width="${shape.width || 100}" height="${
          shape.height || 50
        }" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="${(shape.width || 100) - 2}" height="${
          (shape.height || 50) - 2
        }" fill="white" stroke="black" stroke-width="1" rx="${
          shape.cornerRadius || 0
        }" ry="${shape.cornerRadius || 0}" />
          </svg>
        `;
    }

    return svgContent;
  };

  // Mendapatkan ukuran font yang sesuai dengan fungsi yang lebih konsisten
  const idFontSize = getConsistentFontSize(shape.fontSizeId || 12, "id");
  const mainFontSize = getConsistentFontSize(shape.fontSize || 13, "main");
  const textFontSize = getConsistentFontSize(shape.fontSize || 14, "text");
  const connectorRadius = getConnectorRadius();

  // Render connector dengan efek visual yang lebih baik
  const renderConnector = (position: string, x: number, y: number) => {
    const isHovered = hoveredConnector === position;
    const isActive =
      isConnecting &&
      ((connectingFromId === shape.id && connectingFromPoint === position) ||
        (connectingFromId !== shape.id && connectingFromId !== null));

    // Enhanced visuals based on state
    const fill = isActive ? "#3B82F6" : isHovered ? "#bbdefb" : "#fff";
    const stroke = isActive ? "#1E40AF" : isHovered ? "#2563EB" : "#666";
    const radiusMultiplier = isHovered ? 1.3 : 1;
    const shadowBlur = isHovered ? 4 : 2;
    const shadowOpacity = isHovered ? 0.5 : 0.2;

    return (
      <Circle
        x={x}
        y={y}
        radius={connectorRadius * radiusMultiplier}
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
        shadowColor="rgba(0,0,0,0.3)"
        shadowBlur={shadowBlur}
        shadowOpacity={shadowOpacity}
        shadowOffset={{ x: 1, y: 1 }}
        onMouseDown={(e) => handleConnectorMouseDown(e, position)}
        onMouseEnter={() => handleConnectorMouseEnter(position)}
        onMouseLeave={handleConnectorMouseLeave}
      />
    );
  };

  // Cek apakah connector points harus ditampilkan (saat selected, hover, atau sedang dalam mode koneksi)
  const shouldShowConnectors =
    isSelected || hoveredConnector !== null || isConnecting;

  return (
    <>
      <Group
        id={shape.id}
        x={shape.x}
        y={shape.y}
        width={shape.width || 100}
        height={shape.height || 50}
        draggable
        onClick={handleClick}
        onContextMenu={handleShapeContextMenu}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onTransform={handleTransform}
        ref={shapeRef}
        onMouseEnter={() => setHoveredConnector("shape")}
        onMouseLeave={() => setHoveredConnector(null)}
      >
        <SVGImage
          svgContent={getSvgString()}
          width={shape.width || defaultSize.width}
          height={shape.height || defaultSize.height}
        />

        {/* Render teks dengan ukuran yang konsisten */}
        {shape.type === "text" ? (
          <Text
            ref={textRef}
            text={shape.text || "Text"}
            x={0}
            y={0}
            width={shape.width || 100}
            height={shape.height || 40}
            fontSize={textFontSize}
            fontFamily={shape.fontFamily || "Arial"}
            fontStyle={(() => {
              if (shape.fontWeight === "bold" && shape.fontStyle === "italic")
                return "bold italic";
              if (shape.fontWeight === "bold") return "bold";
              if (shape.fontStyle === "italic") return "italic";
              return "normal";
            })()}
            align={shape.align || "center"}
            verticalAlign="middle"
            fill="#000"
            padding={5}
            wrap="word"
            draggable={false}
          />
        ) : (
          <>
            {/* ID Text dengan ukuran font yang konsisten */}
            <Text
              text={`${getDefaultPrefix()}${shape.idText || ""}`}
              x={idTextX}
              y={idTextY}
              fontSize={idFontSize}
              fontFamily="Arial, sans-serif"
              fill="#333"
              fontStyle={shape.fontWeight === "bold" ? "bold" : "normal"}
              letterSpacing={getLetterSpacing(shape.interLine)}
            />

            {/* Main text dengan ukuran font yang konsisten */}
            <Text
              ref={textRef}
              text={shape.mainText || ""}
              x={mainTextX}
              y={mainTextY}
              width={(shape.width || defaultSize.width) - 24}
              height={Math.max(20, (shape.height || defaultSize.height) - 40)}
              align="center"
              verticalAlign="middle"
              offsetX={
                mainTextOffsetX || ((shape.width || defaultSize.width) - 24) / 2
              }
              offsetY={0}
              fontSize={mainFontSize}
              fontFamily="Arial, sans-serif"
              fontStyle={shape.descFontWeight === "bold" ? "bold" : "normal"}
              fill="#333"
              letterSpacing={getLetterSpacing(shape.descInterLine)}
              wrap="word"
              ellipsis={true}
            />
          </>
        )}

        {/* Alternative: Multi-line text handling */}
        {(shape as any).multiline && (
          <Text
            text={formatMultilineText(
              shape.value || shape.text || shape.title || ""
            )}
            x={12}
            y={shape.textY || 30}
            width={(shape.width || 100) - 24}
            fontSize={getConsistentFontSize(shape.fontSize || 12, "main")}
            fontFamily="Arial, sans-serif"
            fill="#333"
            lineHeight={1.3}
            align="center"
          />
        )}
      </Group>

      {/* Connection points - ditampilkan saat selected, hover, atau sedang connecting */}
      {shape.type !== "text" && shouldShowConnectors && (
        <Group x={shape.x} y={shape.y}>
          {/* Titik penghubung kiri */}
          {renderConnector("left", 0, (shape.height || defaultSize.height) / 2)}

          {/* Titik penghubung kanan */}
          {renderConnector(
            "right",
            shape.width || defaultSize.width,
            (shape.height || defaultSize.height) / 2
          )}

          {/* Titik penghubung atas */}
          {renderConnector("top", (shape.width || defaultSize.width) / 2, 0)}

          {/* Titik penghubung bawah */}
          {renderConnector(
            "bottom",
            (shape.width || defaultSize.width) / 2,
            shape.height || defaultSize.height
          )}
        </Group>
      )}

      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Minimum size of 20x20
            if (newBox.width < 20 || newBox.height < 20) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default DiagramShape;
