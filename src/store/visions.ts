import { create } from 'zustand';
import { VisionCellData, VisionsState } from '@/types/visions';

export const BASE_PRICE = 8;
export const GRID_SIZE = 64;

export const useVisionsStore = create<VisionsState>((set) => ({
  cells: {
    "30-30": {
      x: 30, y: 30,
      ownerName: "Cotonou Tech Hub",
      mediaUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c",
      mediaType: 'photo',
      whatsappLink: "https://wa.me/22997000000",
      description: "Notre vision est de faire du Bénin le hub technologique de l'Afrique de l'Ouest.",
      price: 16,
      captureCount: 1,
      history: [{ ownerName: "Initial", price: 8, date: "01/05/2026" }]
    },
    "10-10": {
      x: 10, y: 10,
      ownerName: "Fondation Afro-Héritage",
      mediaUrl: "https://images.unsplash.com/photo-1523374228107-6e44bd2b524e",
      mediaType: 'photo',
      whatsappLink: "https://wa.me/22998000000",
      description: "Restaurer la mémoire des anciens pour bâtir le futur.",
      price: 64,
      captureCount: 3,
      history: [
        { ownerName: "Initial", price: 8, date: "20/04/2026" },
        { ownerName: "Koffi", price: 16, date: "22/04/2026" },
        { ownerName: "Amélie", price: 32, date: "25/04/2026" }
      ]
    }
  },
  selectedCell: null,
  fundingGoal: 100000,
  totalFunded: 80,

  selectCell: (x, y) => set({ 
    selectedCell: y === null ? null : { x, y: y as number } 
  }),

  captureCell: (newCell) => set((state) => {
    const key = `${newCell.x}-${newCell.y}`;
    const previousCell = state.cells[key];
    
    // Add transaction to total funded
    const newTotalFunded = state.totalFunded + newCell.price;

    return {
      cells: {
        ...state.cells,
        [key]: newCell,
      },
      totalFunded: newTotalFunded,
    };
  }),
}));
