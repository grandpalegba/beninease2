import { create } from 'zustand';
import { VisionCellData, VisionsState, VisionAnchor } from '@/types/visions';

export const BASE_PRICE = 8;
export const GRID_SIZE = 64;

const ANCHORS: VisionAnchor[] = [
  { id: 'palais', name: 'Palais Présidentiel', img: '/souverains/palais.jpg', x: 26, y: 28, width: 12, height: 8 },
  { id: 'mosquee', name: 'Grande Mosquée Porto Novo', img: '/souverains/mosquee.jpg', x: 48, y: 10, width: 8, height: 8 },
  { id: 'porto', name: 'Porto Novo', img: '/souverains/porto.jpg', x: 56, y: 10, width: 8, height: 8 },
  { id: 'porte', name: 'Porte du non retour', img: '/souverains/porte.jpg', x: 20, y: 50, width: 8, height: 8 },
  { id: 'peches', name: 'Route des pêches', img: '/souverains/peches.jpg', x: 30, y: 50, width: 8, height: 8 },
  { id: 'fresque', name: 'Fresque murale', img: '/souverains/fresque.jpg', x: 40, y: 50, width: 12, height: 8 },
  { id: 'cathedrale', name: 'Cathédrale Notre Dame', img: '/souverains/cathedrale.jpg', x: 10, y: 10, width: 8, height: 8 },
  { id: 'congres', name: 'Palais des congrès', img: '/souverains/congres.jpg', x: 10, y: 20, width: 8, height: 8 },
  { id: 'etoile', name: 'Place de l\'Étoile', img: '/souverains/etoile.jpg', x: 10, y: 30, width: 8, height: 8 },
  { id: 'stade', name: 'Stade de l\'amitié', img: '/souverains/stade.jpg', x: 10, y: 40, width: 12, height: 8 },
];

// Initialize random locks
const INITIAL_LOCKS = new Set<string>();
for (let i = 0; i < 20; i++) {
  const x = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
  const y = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
  INITIAL_LOCKS.add(`${x}-${y}`);
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

    // Check neighbors for locks to break
    const neighbors = [
      {x: x-1, y: y-1}, {x: x, y: y-1}, {x: x+1, y: y-1},
      {x: x-1, y: y},                   {x: x+1, y: y},
      {x: x-1, y: y+1}, {x: x, y: y+1}, {x: x+1, y: y+1}
    ];

    neighbors.forEach(n => {
      const nKey = `${n.x}-${n.y}`;
      const neighborCell = state.cells[nKey] || { x: n.x, y: n.y, isLocked: INITIAL_LOCKS.has(nKey) };
      
      if (neighborCell.isLocked) {
        // Check if all 8 neighbors of THIS lock are captured
        const lockNeighbors = [
          {x: n.x-1, y: n.y-1}, {x: n.x, y: n.y-1}, {x: n.x+1, y: n.y-1},
          {x: n.x-1, y: n.y},                     {x: n.x+1, y: n.y},
          {x: n.x-1, y: n.y+1}, {x: n.x, y: n.y+1}, {x: n.x+1, y: n.y+1}
        ];

        const isFullySurrounded = lockNeighbors.every(ln => {
          const lnKey = `${ln.x}-${ln.y}`;
          // The cell currently being captured is 'newCells[key]', others are in 'state.cells' or 'newCells'
          return (ln.x === x && ln.y === y) || (newCells[lnKey] && newCells[lnKey].ownerName);
        });

        if (isFullySurrounded) {
          // Break lock and give it to the current user
          newCells[nKey] = {
            x: n.x, y: n.y,
            ownerName,
            isLocked: false,
            price: 0, // Free
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

// Initialize anchors in cells (not really needed if we handle them separately in grid, but good for hits)
ANCHORS.forEach(anchor => {
  for (let iy = 0; iy < anchor.height; iy++) {
    for (let ix = 0; ix < anchor.width; ix++) {
       // mark these cells as anchor
    }
  }
});
