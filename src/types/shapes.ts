import React from 'react';

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
}

export interface ShapeOnCanvas extends Shape {
  x: number;
  y: number;
  text?: string;
  idText?: string;
  value?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  align?: 'left' | 'center' | 'right';
  textDecoration?: string;
  interLine?: string;
  description?: string;
  descFontSize?: number;
  descFontWeight?: string;
  descInterLine?: string;
  connections?: string[];
}