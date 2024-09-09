"use client";
import { useState } from "react";

interface DropAreaProps {
  className?: string;
  onDrop: () => void;
}

const DropArea = ({ className, onDrop }: DropAreaProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragCounter((prev) => prev + 1);
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragCounter((prev) => prev - 1);
    if (dragCounter === 1) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    setDragCounter(0);
    onDrop();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        transition-all ease-in-out duration-300
        ${isDragging ? 'opacity-100 h-[200px]' : 'opacity-0 h-0'}
        w-full border border-slate-200 rounded-lg p-2 my-2 mb-4 shadow-lg
        ${className}
      `}
    >
      <h1>Drop files here</h1>
    </div>
  );
};

export default DropArea;



