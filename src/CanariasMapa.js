import { useState, useEffect, useRef } from "react";
import islas from "./assets/data/municipios-coordenadas.json";
import municipios from "./assets/data/municipios-datos.json";

export default function CanariasMapa()
{
  const [selected, setSelected] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [startOffset, setStartOffset] = useState({ x: 0, y: 0 });
  const [visited, setVisited] = useState([]);

  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const [startDragModal, setStartDragModal] = useState({ x: 0, y: 0 });
  const [modalOffset, setModalOffset] = useState({ x: 0, y: 0 });

  const baseViewBox = { x: -150, y: -50, width: 1100, height: 500 };
  const popupRef = useRef(null);
  const svgRef = useRef(null);
  const isMobile = window.innerWidth <= 768;
  const headerHeight = 56;
  const modalMargin = 16;

  useEffect(() => {
    const stored = localStorage.getItem("municipiosVisitados");
    if (stored) setVisited(JSON.parse(stored));
  }, []);

  // Drag mapa
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartDrag({ x: e.clientX, y: e.clientY });
    setStartOffset({ ...offset });
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const sensitivity = 0.5;
    const dx = (startDrag.x - e.clientX) * (baseViewBox.width / (baseViewBox.width / zoom)) * sensitivity;
    const dy = (startDrag.y - e.clientY) * (baseViewBox.height / (baseViewBox.height / zoom)) * sensitivity;
    setOffset({
      x: startOffset.x + dx,
      y: startOffset.y + dy
    });
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  // Drag modal
  const handleMouseDownModal = (e) => {
    setIsDraggingModal(true);
    setStartDragModal({ x: e.clientX, y: e.clientY });
  };
  const handleMouseMoveModal = (e) => {
    if (!isDraggingModal) return;
    const dx = e.clientX - startDragModal.x;
    const dy = e.clientY - startDragModal.y;
    setModalOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setStartDragModal({ x: e.clientX, y: e.clientY });
  };
  const handleMouseUpModal = () => setIsDraggingModal(false);

  const handleToggleVisited = (name) => {
    const updated = visited.includes(name)
      ? visited.filter(m => m !== name)
      : [...visited, name];
    setVisited(updated);
    localStorage.setItem("municipiosVisitados", JSON.stringify(updated));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setSelected(null);
    };
    if (selected) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selected]);

  // Zoom con rueda centrado en cursor
  const handleWheel = (e) => {
    e.preventDefault();
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const svgWidth = rect.width;
    const svgHeight = rect.height;

    const factor = 1.1;
    const newZoom = e.deltaY < 0 ? Math.min(zoom * factor, 5) : Math.max(zoom / factor, 1);

    // Coordenadas relativas en 0..1
    const relX = mouseX / svgWidth;
    const relY = mouseY / svgHeight;

    // Calcular nuevo offset para que el zoom se centre en el ratón
    const newVbWidth = baseViewBox.width / newZoom;
    const newVbHeight = baseViewBox.height / newZoom;

    const newOffsetX = offset.x + (baseViewBox.width / zoom - newVbWidth) * (relX - 0.5);
    const newOffsetY = offset.y + (baseViewBox.height / zoom - newVbHeight) * (relY - 0.5);

    setZoom(newZoom);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  // Zoom táctil pinch
  const pinchRef = useRef({ distance: 0, zoomStart: 1 });
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

  const vbWidth = baseViewBox.width / zoom;
  const vbHeight = baseViewBox.height / zoom;
  const vbX = baseViewBox.x + offset.x;
  const vbY = baseViewBox.y + offset.y;
  const vb = `${vbX} ${vbY} ${vbWidth} ${vbHeight}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header style={{ padding: "8px", color: "#031069ff", background: "#ffd21fa5", textAlign: "center", borderBottom: "8px solid", borderImage: "linear-gradient(to right,#fff 0%,#fff 33.3%,#2997df 33.3%,#2997df 66.6%,#ffd21f 66.6%,#ffd21f 100%) 1" }}>
        <h1>MUNICIPIOS CANARIAS</h1>
      </header>
      <main style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        <div
          style={{ flex: 1, overflow: "hidden",  cursor: selected ? "default" : isDragging ? "grabbing" : "grab", backgroundColor: "#0096c7" }}
          onMouseDown={(e) => { if (!selected) handleMouseDown(e); }}
          onMouseMove={(e) => { if (!selected) handleMouseMove(e); }}
          onMouseUp={(e) => { if (!selected) handleMouseUp(e); }}
          onMouseLeave={(e) => { if (!selected) handleMouseLeave(e); }}
          onWheel={handleWheel}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox={vb} preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", height: "100%" }}>
            {islas.map((isla) => (
              <g key={isla.name} transform={isla.transform}>
                {isla.municipios.map((m) => (
                  <path key={m.name} d={m.path} fill={visited.includes(m.name) ? "#28a745" : selected === m.name ? "#FFD21F" : "#cce"} stroke="#336" strokeWidth="2" onClick={() => setSelected(m.name)} style={{ cursor: "pointer" }} />
                ))}
              </g>
            ))}
          </svg>

          {selected && (() => {
            const selectedMunicipio = municipios.find(m => m.name === selected);
            if (!selectedMunicipio) return null;
            return (
              <div
                ref={popupRef}
                onMouseDown={handleMouseDownModal}
                onMouseMove={handleMouseMoveModal}
                onMouseUp={handleMouseUpModal}
                onMouseLeave={handleMouseUpModal}
                style={{
                  position: "absolute",
                  top: `${headerHeight + modalMargin + modalOffset.y}px`,
                  left: `calc(50% + ${modalOffset.x}px)`,
                  transform: "translateX(-50%)",
                  width: isMobile ? "90%" : "300px",
                  maxWidth: isMobile ? "300px" : "400px",
                  maxHeight: isMobile ? `calc(100vh - ${headerHeight + modalMargin * 2}px)` : "80vh",
                  overflowY: "auto",
                  padding: isMobile ? "12px" : "16px",
                  border: "1px solid #ddd",
                  background: "#e0dedeff",
                  color: "#031069ff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  zIndex: 10,
                  boxSizing: "border-box",
                  cursor: "move"
                }}
              >
                <h2 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>{selectedMunicipio.name}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <div style={{ width: "60px", height: "60px", flexShrink: 0 }}>
                    <img src={selectedMunicipio.escudo} alt={`Escudo de ${selectedMunicipio.name}`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                  <div style={{ width: "60px", height: "60px", flexShrink: 0 }}>
                    <img src={selectedMunicipio.bandera} alt={`Bandera de ${selectedMunicipio.name}`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                </div>
                <p style={{ marginTop: "8px", fontSize: "0.9rem" }}>{selectedMunicipio.descripcion}</p>
                <p style={{ fontSize: "0.9rem" }}><b>Población:</b> {selectedMunicipio.poblacion} habitantes</p>
                <p style={{ fontSize: "0.9rem" }}><b>Superficie:</b> {selectedMunicipio.superficie} km²</p>
                <button onClick={() => handleToggleVisited(selectedMunicipio.name)} style={{ marginTop: "8px", padding: "6px 12px", width: "100%", backgroundColor: visited.includes(selectedMunicipio.name) ? "#28a745" : "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" }}>
                  {visited.includes(selectedMunicipio.name) ? "Visitado ✅" : "Marcar como visitado"}
                </button>
              </div>
            );
          })()}
        </div>
      </main>
    </div>
  );
}
