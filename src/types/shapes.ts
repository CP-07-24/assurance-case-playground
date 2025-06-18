import React from "react";

export interface Shape {
  id: string;
  type: string;
  title: string;
  preview: React.ReactNode;
  width?: number;
  height?: number;
  cornerRadius?: number;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  points: number[];
  style: "line" | "arrow" | "solidArrow" | "doubleArrow" | "dashed" | "dotted";
}

export interface ShapeOnCanvas extends Shape {
  x: number;
  y: number;
  text?: string;
  textX?: number;
  textY?: number;
  idText?: string;
  value?: string;
  fontFamily?: string;
  fontSize?: number;
  fontSizeId?: number;
  fontWeight?: string;
  fontStyle?: string;
  align?: "left" | "center" | "right";
  textDecoration?: string;
  interLine?: string;
  description?: string;
  descFontSize?: number;
  descFontWeight?: string;
  descInterLine?: string;
  connections?: string[];
}
