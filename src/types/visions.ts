export interface VisionHistory {
  ownerName: string;
  price: number;
  date: string;
}

export interface VisionCellData {
  x: number;
  y: number;
  ownerName: string;
  mediaUrl: string;
  mediaType: 'photo' | 'video';
  whatsappLink: string;
  description: string;
  price: number;
  captureCount: number;
  history: VisionHistory[];
}

export interface VisionsState {
  cells: Record<string, VisionCellData>; // Key: "x-y"
  selectedCells: { x: number; y: number }[];
  fundingGoal: number;
  totalFunded: number;
  
  setSelectedCells: (cells: { x: number; y: number }[]) => void;
  captureCells: (cells: VisionCellData[]) => void;
}
