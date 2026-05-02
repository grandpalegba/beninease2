"use client";

import React, { useRef, useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useVisionsStore, GRID_SIZE } from '@/store/visions';
import { VisionCell } from './VisionCell';

const CELL_SIZE = 40;
const GRID_PX = GRID_SIZE * CELL_SIZE;

export const VisionsGrid = () => {
  const { cells, selectedCells, setSelectedCells } = useVisionsStore();
  const wrapperRef = useRef<any>(null);
  const [selectionStart, setSelectionStart] = useState<{ x: number, y: number } | null>(null);

  // Center on the flag
  useEffect(() => {
    if (wrapperRef.current) {
      const centerX = (28 + 4) * CELL_SIZE;
      const centerY = (28 + 4) * CELL_SIZE;
      wrapperRef.current.setTransform(
        -centerX + window.innerWidth / 2, 
        -centerY + window.innerHeight / 2, 
        0.8
      );
    }
  }, []);

  const isFlagArea = (x: number, y: number) => {
    return x >= 28 && x <= 35 && y >= 28 && y <= 35;
  };

  const handleCellClick = (x: number, y: number) => {
    if (isFlagArea(x, y)) return;

    if (!selectionStart) {
      setSelectionStart({ x, y });
      setSelectedCells([{ x, y }]);
    } else {
      // Define the rectangle
      const x1 = Math.min(selectionStart.x, x);
      const x2 = Math.max(selectionStart.x, x);
      const y1 = Math.min(selectionStart.y, y);
      const y2 = Math.max(selectionStart.y, y);

      // Limit to 8x8
      const finalX2 = Math.min(x2, x1 + 7);
      const finalY2 = Math.min(y2, y1 + 7);

      const newSelection = [];
      for (let j = y1; j <= finalY2; j++) {
        for (let i = x1; i <= finalX2; i++) {
          if (!isFlagArea(i, j)) {
            newSelection.push({ x: i, y: j });
          }
        }
      }
      setSelectedCells(newSelection);
      setSelectionStart(null); // Reset for next selection
    }
  };

  const renderCells = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const key = `${x}-${y}`;
        const isSelected = selectedCells.some(c => c.x === x && c.y === y);

        grid.push(
          <VisionCell
            key={key}
            x={x}
            y={y}
            data={cells[key]}
            isSelected={isSelected}
            onClick={() => handleCellClick(x, y)}
          />
        );
      }
    }
    return grid;
  };

  return (
    <div className="w-full h-full bg-[#f9f9f9] overflow-hidden cursor-grab active:cursor-grabbing relative">
      <TransformWrapper
        ref={wrapperRef}
        initialScale={0.8}
        minScale={0.1}
        maxScale={4}
        centerOnInit={false}
        limitToBounds={false}
      >
        <TransformComponent
          wrapperStyle={{ width: "100vw", height: "100vh" }}
          contentStyle={{ width: `${GRID_PX}px`, height: `${GRID_PX}px` }}
        >
          <div 
            className="grid relative"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              width: `${GRID_PX}px`,
              height: `${GRID_PX}px`,
              background: 'white',
            }}
          >
            {renderCells()}

            {/* Benin Flag - One Single Unit */}
            <div 
              className="absolute flex"
              style={{
                left: `${28 * CELL_SIZE}px`,
                top: `${28 * CELL_SIZE}px`,
                width: `${8 * CELL_SIZE}px`,
                height: `${8 * CELL_SIZE}px`,
                pointerEvents: 'none',
                zIndex: 10
              }}
            >
               <div className="w-2/5 h-full bg-[#008751]" />
               <div className="w-3/5 h-full flex flex-col">
                  <div className="h-1/2 bg-[#FCD116]" />
                  <div className="h-1/2 bg-[#E8112D]" />
               </div>
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>

      {/* Selection Mode Hint */}
      {selectionStart && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
          <div className="bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl animate-bounce">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] inline-block" />
            Cliquez sur une 2e cellule pour définir le bloc (max 8×8)
          </div>
        </div>
      )}
    </div>
  );
};
