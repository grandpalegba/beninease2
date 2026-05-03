import { create } from 'zustand';
import { VisionCellData, VisionsState, VisionAnchor } from '@/types/visions';

export const BASE_PRICE = 8;
export const GRID_SIZE = 64;

const ANCHORS: VisionAnchor[] = [
  { id: 'flag', name: 'Drapeau du Bénin', img: 'FLAG_SVG', x: 28, y: 28, width: 8, height: 8 },
  { id: 'palais', name: 'Palais Présidentiel', img: '/souverains/palais.jpg', x: 5, y: 15, width: 12, height: 8 },
  { id: 'fresque', name: 'Fresque murale', img: '/souverains/fresque.jpg', x: 45, y: 5, width: 12, height: 8 },
  { id: 'stade', name: 'Stade de l\'amitié', img: '/souverains/stade.jpg', x: 8, y: 45, width: 12, height: 8 },
  { id: 'mosquee', name: 'Grande Mosquée Porto Novo', img: '/souverains/mosquee.jpg', x: 50, y: 50, width: 8, height: 8 },
  { id: 'cathedrale', name: 'Cathédrale Notre Dame', img: '/souverains/cathedrale.jpg', x: 2, y: 2, width: 8, height: 8 },
  { id: 'congres', name: 'Palais des congrès', img: '/souverains/congres.jpg', x: 52, y: 18, width: 8, height: 8 },
  { id: 'etoile', name: 'Place de l\'Étoile', img: '/souverains/etoile.jpg', x: 28, y: 52, width: 8, height: 8 },
  { id: 'porte', name: 'Porte du non retour', img: '/souverains/porte.jpg', x: 40, y: 38, width: 8, height: 8 },
  { id: 'porto', name: 'Porto Novo', img: '/souverains/porto.jpg', x: 54, y: 32, width: 8, height: 8 },
  { id: 'peches', name: 'Route des pêches', img: '/souverains/peches.jpg', x: 25, y: 5, width: 8, height: 8 },
];

// Initialize random locks on any cell
const INITIAL_LOCKS = new Set<string>();
for (let i = 0; i < 40; i++) {
  const x = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
  const y = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
  const isAnchor = ANCHORS.some(a => x >= a.x && x < a.x + a.width && y >= a.y && y < a.y + a.height);
  if (!isAnchor) {
    INITIAL_LOCKS.add(`${x}-${y}`);
  }
}

export const useVisionsStore = create<VisionsState>((set, get) => ({
  cells: {},
  anchors: ANCHORS,
  selectedCells: [],
  isPanelOpen: false,

  setSelectedCells: (cells) => set({ selectedCells: cells }),
  setIsPanelOpen: (isOpen) => set({ isPanelOpen: isOpen }),

  captureCell: (x, y, ownerName) => set((state) => {
    const key = `${x}-${y}`;
    const newCells = { ...state.cells };
    
    newCells[key] = {
      x, y,
      ownerName,
      isLocked: false,
      price: BASE_PRICE,
      captureCount: (state.cells[key]?.captureCount || 0) + 1,
      history: [...(state.cells[key]?.history || []), { ownerName, price: BASE_PRICE, date: new Date().toLocaleDateString() }]
    };

    const neighbors = [
      {x: x-1, y: y-1}, {x: x, y: y-1}, {x: x+1, y: y-1},
      {x: x-1, y: y},                   {x: x+1, y: y},
      {x: x-1, y: y+1}, {x: x, y: y+1}, {x: x+1, y: y+1}
    ];

    neighbors.forEach(n => {
      const nKey = `${n.x}-${n.y}`;
      const neighborCell = state.cells[nKey] || { x: n.x, y: n.y, isLocked: INITIAL_LOCKS.has(nKey) };
      
      if (neighborCell.isLocked) {
        const lockNeighbors = [
          {x: n.x-1, y: n.y-1}, {x: n.x, y: n.y-1}, {x: n.x+1, y: n.y-1},
          {x: n.x-1, y: n.y},                     {x: n.x+1, y: n.y},
          {x: n.x-1, y: n.y+1}, {x: n.x, y: n.y+1}, {x: n.x+1, y: n.y+1}
        ];

        const isFullySurrounded = lockNeighbors.every(ln => {
          const lnKey = `${ln.x}-${ln.y}`;
          return (ln.x === x && ln.y === y) || (newCells[lnKey] && newCells[lnKey].ownerName);
        });

        if (isFullySurrounded) {
          newCells[nKey] = {
            x: n.x, y: n.y,
            ownerName,
            isLocked: false,
            price: 0, 
            captureCount: 1,
            history: [{ ownerName, price: 0, date: new Date().toLocaleDateString() }]
          };
        }
      }
    });

    return { cells: newCells };
  }),

  unlockCell: (x, y) => set((state) => {
    const key = `${x}-${y}`;
    const newCells = { ...state.cells };
    if (newCells[key]) {
      newCells[key].isLocked = false;
    }
    return { cells: newCells };
  }),
}));
