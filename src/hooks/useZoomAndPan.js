import { useState, useRef } from "react";

export function useZoomAndPan(baseViewBox = { x: -150, y: -50, width: 1100, height: 500 }) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [startOffset, setStartOffset] = useState({ x: 0, y: 0 });

  const pinchRef = useRef({ distance: 0, zoomStart: 1 });

  // Drag con ratón
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartDrag({ x: e.clientX, y: e.clientY });
    setStartOffset({ ...offset });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const sensitivity = 0.5;
    const dx = (startDrag.x - e.clientX) * sensitivity;
    const dy = (startDrag.y - e.clientY) * sensitivity;
    setOffset({
      x: startOffset.x + dx,
      y: startOffset.y + dy,
    });
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  // Zoom con rueda centrado en cursor
  const handleWheel = (e, svgRef) => {
    e.preventDefault();
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const svgWidth = rect.width;
    const svgHeight = rect.height;

    const factor = 1.1;
    const newZoom = e.deltaY < 0 ? Math.min(zoom * factor, 5) : Math.max(zoom / factor, 1);

    const relX = mouseX / svgWidth;
    const relY = mouseY / svgHeight;

    const newVbWidth = baseViewBox.width / newZoom;
    const newVbHeight = baseViewBox.height / newZoom;

    const newOffsetX = offset.x + (baseViewBox.width / zoom - newVbWidth) * (relX - 0.5);
    const newOffsetY = offset.y + (baseViewBox.height / zoom - newVbHeight) * (relY - 0.5);

    setZoom(newZoom);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  // Pinch zoom en móvil
  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const [t1, t2] = e.touches;
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      if (!pinchRef.current.distance) {
        pinchRef.current.distance = dist;
        pinchRef.current.zoomStart = zoom;
      } else {
        const factor = dist / pinchRef.current.distance;
        const newZoom = Math.min(Math.max(pinchRef.current.zoomStart * factor, 1), 5);
        setZoom(newZoom);
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) pinchRef.current.distance = 0;
  };

  // viewBox final calculado
  const vbWidth = baseViewBox.width / zoom;
  const vbHeight = baseViewBox.height / zoom;
  const vbX = baseViewBox.x + offset.x;
  const vbY = baseViewBox.y + offset.y;
  const vb = `${vbX} ${vbY} ${vbWidth} ${vbHeight}`;

  return {
    vb,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onWheel: handleWheel,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    svgRef: useRef(null),
  };
}
