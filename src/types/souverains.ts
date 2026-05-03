export interface SouverainsAnchor {
  id: string;
  name: string;
  img: string;
  x: number;
  y: number;
  width: number; // in grid cells
  height: number; // in grid cells
}

export interface SouverainsCellData {
  x: number;
  y: number;
  ownerName?: string;
  isLocked: boolean;
  isAnchor?: boolean;
  anchorId?: string;
  price: number;
}

export interface SouverainsState {
  cells: Record<string, SouverainsCellData>;
  anchors: SouverainsAnchor[];
  selectedCells: { x: number; y: number }[];
  isPanelOpen: boolean;
  
  setSelectedCells: (cells: { x: number; y: number }[]) => void;
  setIsPanelOpen: (isOpen: boolean) => void;
  captureCell: (x: number, y: number, ownerName: string) => void;
  unlockCell: (x: number, y: number) => void;
}
