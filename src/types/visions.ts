export interface VisionAnchor {
  id: string;
  name: string;
  img: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface VisionHistory {
  ownerName: string;
  price: number;
  date: string;
}

export interface VisionCellData {
  x: number;
  y: number;
  ownerName?: string;
  isLocked: boolean;
  isAnchor?: boolean;
  anchorId?: string;
  price: number;
  captureCount: number;
  history: VisionHistory[];
  // New fields for vision content
  type?: 'image' | 'video';
  contentUrl?: string;
  label?: string;
}

export interface VisionsState {
  cells: Record<string, VisionCellData>;
  anchors: VisionAnchor[];
  selectedCells: { x: number; y: number }[];
  isPanelOpen: boolean;
  viewingVision: VisionCellData | null;
  
  setSelectedCells: (cells: { x: number; y: number }[]) => void;
  setIsPanelOpen: (isOpen: boolean) => void;
  setViewingVision: (vision: VisionCellData | null) => void;
  captureCell: (x: number, y: number, ownerName: string) => void;
  unlockCell: (x: number, y: number) => void;
}
