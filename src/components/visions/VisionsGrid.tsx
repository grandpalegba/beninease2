"use client";

import React, { useRef, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useVisionsStore, GRID_SIZE } from '@/store/visions';
import { VisionCell } from './VisionCell';

const CELL_SIZE = 40;
const GRID_PX = GRID_SIZE * CELL_SIZE;

export const VisionsGrid = () => {
  const { cells, selectedCell, selectCell } = useVisionsStore();
  const wrapperRef = useRef<any>(null);

  // Center on the flag (X:28-35, Y:28-35)
  useEffect(() => {
    if (wrapperRef.current) {
      const { zoomToElement } = wrapperRef.current;
      // We want to center on the middle of the flag
      const centerX = (28 + 4) * CELL_SIZE;
      const centerY = (28 + 4) * CELL_SIZE;
      
      // Since zoomToElement might be tricky with absolute coords, 
      // we can use setTransform if needed, or just zoom in
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

  const renderCells = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const key = `${x}-${y}`;
        const isSelected = selectedCell?.x === x && selectedCell?.y === y;
        const isFlag = isFlagArea(x, y);

        grid.push(
          <VisionCell
            key={key}
            x={x}
            y={y}
            data={cells[key]}
            isSelected={isSelected}
            isFlag={isFlag}
            onClick={() => !isFlag && selectCell(x, y)}
          />
        );
      }
    }
    return grid;
  };

  return (
    <div className="w-full h-full bg-[#f9f9f9] overflow-hidden cursor-grab active:cursor-grabbing">
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
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              width: `${GRID_PX}px`,
              height: `${GRID_PX}px`,
              background: 'white',
            }}
          >
            {renderCells()}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};
