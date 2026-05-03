"use client";

import React, { useState, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useVisionsStore, GRID_SIZE } from '@/store/visions';
import { VisionCell } from './VisionCell';
import Image from 'next/image';
import { Plus, Minus, Maximize } from 'lucide-react';

const BeninFlag = () => (
  <div className="w-full h-full flex">
    <div className="w-2/5 h-full bg-[#008751]" />
    <div className="w-3/5 h-full flex flex-col">
      <div className="h-1/2 w-full bg-[#FCD116]" />
      <div className="h-1/2 w-full bg-[#E8112D]" />
    </div>
  </div>
);

export const VisionsGrid = () => {
  const { cells, selectedCells, setSelectedCells, anchors } = useVisionsStore();
  const wrapperRef = useRef<any>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1.2);
  const [selectionStart, setSelectionStart] = useState<{ x: number, y: number } | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number, y: number } | null>(null);

  const cellSize = 40; 

  const handleCellClick = (x: number, y: number) => {
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
        const isAnchorArea = anchors.some(a => 
          x >= a.x && x < a.x + a.width && y >= a.y && y < a.y + a.height
        );

        grid.push(
          <VisionCell
            key={key}
            x={x}
            y={y}
            data={cells[key]}
            isSelected={isSelected}
            isGhostSelected={isGhost}
            isAnchorArea={isAnchorArea}
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
        minScale={0.1}
        maxScale={4}
        centerOnInit
        limitToBounds={false}
        onZoomStop={(ref) => setZoomLevel(ref.state.scale)}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Zoom Controls UI */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 z-[400] flex flex-col gap-2">
              <button 
                onClick={() => zoomIn()}
                className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-[#008751] hover:scale-110 active:scale-95 transition-all"
              >
                <Plus size={20} strokeWidth={3} />
              </button>
              <button 
                onClick={() => zoomOut()}
                className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-[#008751] hover:scale-110 active:scale-95 transition-all"
              >
                <Minus size={20} strokeWidth={3} />
              </button>
              <button 
                onClick={() => resetTransform()}
                className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-[#008751] hover:scale-110 active:scale-95 transition-all mt-4"
              >
                <Maximize size={18} strokeWidth={3} />
              </button>
            </div>

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
                {/* Anchors Overlays (Z-10) */}
                {anchors.map((anchor) => (
                  <div
                    key={anchor.id}
                    className="absolute z-10"
                    style={{
                      left: anchor.x * cellSize,
                      top: anchor.y * cellSize,
                      width: anchor.width * cellSize,
                      height: anchor.height * cellSize,
                    }}
                  >
                    <div className="relative w-full h-full bg-white overflow-hidden">
                      {anchor.img === 'FLAG_SVG' ? (
                        <BeninFlag />
                      ) : (
                        <Image
                          src={anchor.img}
                          alt={anchor.name}
                          fill
                          className="object-contain"
                          sizes="800px"
                        />
                      )}
                    </div>
                  </div>
                ))}

                {/* Grid Cells (Z-20) */}
                {renderCells()}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};
