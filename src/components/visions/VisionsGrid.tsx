"use client";

import React, { useState, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useVisionsStore, GRID_SIZE } from '@/store/visions';
import { VisionCell } from './VisionCell';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const VisionsGrid = () => {
  const { cells, selectedCells, setSelectedCells, anchors } = useVisionsStore();
  const wrapperRef = useRef<any>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1.2);
  const [selectionStart, setSelectionStart] = useState<{ x: number, y: number } | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number, y: number } | null>(null);

  const cellSize = 40; // 40px per cell

  const handleCellClick = (x: number, y: number) => {
    // Check if it's an anchor area
    const isAnchor = anchors.some(a => 
      x >= a.x && x < a.x + a.width && y >= a.y && y < a.y + a.height
    );
    if (isAnchor) return;

    if (!selectionStart) {
      setSelectionStart({ x, y });
      setSelectedCells([{ x, y }]);
    } else {
      const x1 = Math.min(selectionStart.x, x);
      const x2 = Math.max(selectionStart.x, x);
      const y1 = Math.min(selectionStart.y, y);
      const y2 = Math.max(selectionStart.y, y);
      
      const newSelection = [];
      // Limit to 8x8 or similar
      const finalX2 = Math.min(x2, x1 + 15);
      const finalY2 = Math.min(y2, y1 + 15);

      for (let iy = y1; iy <= finalY2; iy++) {
        for (let ix = x1; ix <= finalX2; ix++) {
          newSelection.push({ x: ix, y: iy });
        }
      }
      setSelectedCells(newSelection);
      setSelectionStart(null);
    }
  };

  const isGhostSelected = (x: number, y: number) => {
    if (!selectionStart || !hoverPos) return false;
    const x1 = Math.min(selectionStart.x, hoverPos.x);
    const x2 = Math.max(selectionStart.x, hoverPos.x);
    const y1 = Math.min(selectionStart.y, hoverPos.y);
    const y2 = Math.max(selectionStart.y, hoverPos.y);
    
    const finalX2 = Math.min(x2, x1 + 15);
    const finalY2 = Math.min(y2, y1 + 15);

    return x >= x1 && x <= finalX2 && y >= y1 && y <= finalY2;
  };

  const renderCells = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const key = `${x}-${y}`;
        const isSelected = selectedCells.some(c => c.x === x && c.y === y);
        const isGhost = isGhostSelected(x, y);

        grid.push(
          <VisionCell
            key={key}
            x={x}
            y={y}
            data={cells[key]}
            isSelected={isSelected}
            isGhostSelected={isGhost}
            onClick={() => handleCellClick(x, y)}
            onMouseEnter={() => setHoverPos({ x, y })}
          />
        );
      }
    }
    return grid;
  };

  return (
    <div 
      onMouseLeave={() => setHoverPos(null)}
      className="w-full h-full bg-white overflow-hidden cursor-grab active:cursor-grabbing relative"
    >
      <TransformWrapper
        ref={wrapperRef}
        initialScale={zoomLevel}
        minScale={0.5}
        maxScale={4}
        centerOnInit
        limitToBounds={false}
        onZoomStop={(ref) => setZoomLevel(ref.state.scale)}
      >
        <TransformComponent wrapperClass="!w-full !h-full">
          <div 
            className="relative"
            style={{ 
              width: GRID_SIZE * cellSize, 
              height: GRID_SIZE * cellSize,
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${cellSize}px)`
            }}
          >
            {renderCells()}

            {/* Anchors Overlays */}
            {anchors.map((anchor) => (
              <motion.div
                key={anchor.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute pointer-events-auto z-20"
                style={{
                  left: anchor.x * cellSize,
                  top: anchor.y * cellSize,
                  width: anchor.width * cellSize,
                  height: anchor.height * cellSize,
                  filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))'
                }}
              >
                <div className="relative w-full h-full rounded-sm overflow-hidden bg-white group">
                  <Image
                    src={anchor.img}
                    alt={anchor.name}
                    fill
                    className="object-contain"
                    sizes="800px"
                  />
                  {/* Hover tooltip */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{anchor.name}</p>
                    <p className="text-[8px] font-bold mt-1 opacity-60">SANCTUAIRE INVIOLABLE</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};
