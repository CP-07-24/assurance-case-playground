import React from 'react';
import { Shape } from '../types/shapes';

// Define GSN Elements
export const gsnElements: Shape[] = [
  {
    id: 'gsn-goal-1',
    type: 'goal',
    title: 'Goals',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 50 30">
        <rect x="1" y="1" width="48" height="28" fill="white" stroke="black" strokeWidth="1" />
        <text x="25" y="18" fontSize="8" textAnchor="middle">Goals</text>
      </svg>
    ),
    cornerRadius: 0
  },
  {
    id: 'gsn-goal-2',
    type: 'goal',
    title: 'Goals',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 50 30">
        <rect x="1" y="1" width="48" height="28" fill="white" stroke="black" strokeWidth="1" />
        <text x="25" y="18" fontSize="8" textAnchor="middle">Goals</text>
      </svg>
    ),
    cornerRadius: 0
  },
  {
    id: 'gsn-goal-3',
    type: 'goal',
    title: 'Goals',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 50 30">
        <rect x="1" y="1" width="48" height="28" fill="white" stroke="black" strokeWidth="1" />
        <text x="25" y="18" fontSize="8" textAnchor="middle">Goals</text>
      </svg>
    ),
    cornerRadius: 0
  },
  {
    id: 'gsn-goal-4',
    type: 'goal',
    title: 'Goals',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 50 30">
        <rect x="1" y="1" width="48" height="28" fill="white" stroke="black" strokeWidth="1" />
        <text x="25" y="18" fontSize="8" textAnchor="middle">Goals</text>
      </svg>
    ),
    cornerRadius: 0
  },
  {
    id: 'gsn-goal-5',
    type: 'goal',
    title: 'Goals',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 50 30">
        <rect x="1" y="1" width="48" height="28" fill="white" stroke="black" strokeWidth="1" />
        <text x="25" y="18" fontSize="8" textAnchor="middle">Goals</text>
      </svg>
    ),
    cornerRadius: 0
  },
  {
    id: 'gsn-goal-6',
    type: 'goal',
    title: 'Goals',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 50 30">
        <rect x="1" y="1" width="48" height="28" fill="white" stroke="black" strokeWidth="1" />
        <text x="25" y="18" fontSize="8" textAnchor="middle">Goals</text>
      </svg>
    ),
    cornerRadius: 0
  },
];

// Define GSN Extension Elements
export const gsnExtensionElements: Shape[] = [
  {
    id: 'gsn-ext-1',
    type: 'extension',
    title: 'Extension 1',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 50 30">
        <rect x="1" y="1" width="48" height="28" fill="white" stroke="black" strokeWidth="1" rx="5" ry="5" />
        <text x="25" y="18" fontSize="8" textAnchor="middle">Ext 1</text>
      </svg>
    ),
    cornerRadius: 5
  },
  {
    id: 'gsn-ext-2',
    type: 'extension',
    title: 'Extension 2',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 50 30">
        <rect x="1" y="1" width="48" height="28" fill="white" stroke="black" strokeWidth="1" rx="5" ry="5" />
        <text x="25" y="18" fontSize="8" textAnchor="middle">Ext 2</text>
      </svg>
    ),
    cornerRadius: 5
  },
];

// Define SACM Elements
export const sacmElements: Shape[] = [
  {
    id: 'sacm-1',
    type: 'sacm',
    title: 'SACM Element 1',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 50 30">
        <ellipse cx="25" cy="15" rx="24" ry="14" fill="white" stroke="black" strokeWidth="1" />
        <text x="25" y="18" fontSize="8" textAnchor="middle">SACM 1</text>
      </svg>
    ),
    cornerRadius: 0
  },
  {
    id: 'sacm-2',
    type: 'sacm',
    title: 'SACM Element 2',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 50 30">
        <ellipse cx="25" cy="15" rx="24" ry="14" fill="white" stroke="black" strokeWidth="1" />
        <text x="25" y="18" fontSize="8" textAnchor="middle">SACM 2</text>
      </svg>
    ),
    cornerRadius: 0
  },
  {
    id: 'sacm-3',
    type: 'sacm',
    title: 'SACM Element 3',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 50 30">
        <ellipse cx="25" cy="15" rx="24" ry="14" fill="white" stroke="black" strokeWidth="1" />
        <text x="25" y="18" fontSize="8" textAnchor="middle">SACM 3</text>
      </svg>
    ),
    cornerRadius: 0
  },
  {
    id: 'sacm-4',
    type: 'sacm',
    title: 'SACM Element 4',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 50 30">
        <ellipse cx="25" cy="15" rx="24" ry="14" fill="white" stroke="black" strokeWidth="1" />
        <text x="25" y="18" fontSize="8" textAnchor="middle">SACM 4</text>
      </svg>
    ),
    cornerRadius: 0
  },
  {
    id: 'sacm-5',
    type: 'sacm',
    title: 'SACM Element 5',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 50 30">
        <ellipse cx="25" cy="15" rx="24" ry="14" fill="white" stroke="black" strokeWidth="1" />
        <text x="25" y="18" fontSize="8" textAnchor="middle">SACM 5</text>
      </svg>
    ),
    cornerRadius: 0
  },
  {
    id: 'sacm-6',
    type: 'sacm',
    title: 'SACM Element 6',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 50 30">
        <ellipse cx="25" cy="15" rx="24" ry="14" fill="white" stroke="black" strokeWidth="1" />
        <text x="25" y="18" fontSize="8" textAnchor="middle">SACM 6</text>
      </svg>
    ),
    cornerRadius: 0
  },
];

// Define SACM Extension Elements
export const sacmExtensionElements: Shape[] = [
  {
    id: 'sacm-ext-1',
    type: 'sacmExt',
    title: 'SACM Ext 1',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 50 30">
        <polygon points="25,1 49,15 25,29 1,15" fill="white" stroke="black" strokeWidth="1" />
        <text x="25" y="18" fontSize="8" textAnchor="middle">SACM Ext</text>
      </svg>
    ),
    cornerRadius: 0
  },
  {
    id: 'sacm-ext-2',
    type: 'sacmExt',
    title: 'SACM Ext 2',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 50 30">
        <polygon points="25,1 49,15 25,29 1,15" fill="white" stroke="black" strokeWidth="1" />
        <text x="25" y="18" fontSize="8" textAnchor="middle">SACM Ext</text>
      </svg>
    ),
    cornerRadius: 0
  },
];