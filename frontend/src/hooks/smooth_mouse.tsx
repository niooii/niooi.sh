import { useEffect, useRef, useState } from "react";

export const useSmoothMouse = (smoothFactor = 0.1) => {
    const positionRef = useRef({ x: 0, y: 0 });
    const targetPositionRef = useRef({ x: 0, y: 0 });
  
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        targetPositionRef.current = { x: e.clientX, y: e.clientY };
      };
  
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
  
    useEffect(() => {
      const animate = () => {
        positionRef.current = {
          x: positionRef.current.x + (targetPositionRef.current.x - positionRef.current.x) * smoothFactor,
          y: positionRef.current.y + (targetPositionRef.current.y - positionRef.current.y) * smoothFactor
        };
        animationFrame = requestAnimationFrame(animate);
      };
  
      let animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, [smoothFactor]);
  
    return positionRef; // Return the ref directly
  };