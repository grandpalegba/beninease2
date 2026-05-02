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
  selectedCell: { x: number; y: number } | null;
  fundingGoal: number;
  totalFunded: number;
  
  selectCell: (x: number, y: number | null) => void;
  captureCell: (cell: VisionCellData) => void;
}
