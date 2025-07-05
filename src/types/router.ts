// src/types/router.ts
export type ViewType = "landing" | "template-selection" | "editor";

export interface RouterContextType {
  currentView: ViewType;
  navigate: (view: ViewType) => void;
  currentRoute: string;
}