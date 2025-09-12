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

  // ESTADOS PARA DRAG DEL MODAL
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const [startDragModal, setStartDragModal] = useState({ x: 0, y: 0 });
  const [modalOffset, setModalOffset] = useState({ x: 0, y: 0 });

  const baseViewBox = { x: -150, y: -50, width: 1100, height: 500 };
  const popupRef = useRef(null);
  const isMobile = window.innerWidth <= 768;
  const headerHeight = 56;
  const modalMargin = 16;

  useEffect(() => {
    // Cargar visitados desde localStorage
    const stored = localStorage.getItem("municipiosVisitados");
    if (stored) setVisited(JSON.parse(stored));
  }, []);

  const handleZoomIn = () => setZoom(z => Math.min(z * 1.2, 5));
  const handleZoomOut = () => setZoom(z => Math.max(z / 1.2, 1));

  // Tamaño del viewBox actual según zoom
  const vbWidth = baseViewBox.width / zoom;
  const vbHeight = baseViewBox.height / zoom;

  // Limites máximos para offset
  const shiftX = 20;
  const maxOffsetX = (baseViewBox.width - vbWidth) / 2 + shiftX;
  const minOffsetX = -(baseViewBox.width - vbWidth) / 2 + shiftX;
  const maxOffsetY = (baseViewBox.height - vbHeight) / 2;
  const minOffsetY = -(baseViewBox.height - vbHeight) / 2;

  // viewBox ajustado
  const vbX = baseViewBox.x + Math.min(Math.max(offset.x, minOffsetX), maxOffsetX);
  const vbY = baseViewBox.y + Math.min(Math.max(offset.y, minOffsetY), maxOffsetY);
  const vb = `${vbX} ${vbY} ${vbWidth} ${vbHeight}`;

  // Drag del mapa
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartDrag({ x: e.clientX, y: e.clientY });
    setStartOffset({ ...offset });
  };

  const handleMouseMove = (e) =>
  {
    if (!isDragging) return;
    const dx = (startDrag.x - e.clientX) * (baseViewBox.width / vbWidth);
    const dy = (startDrag.y - e.clientY) * (baseViewBox.height / vbHeight);
    setOffset({
      x: Math.min(Math.max(startOffset.x + dx, minOffsetX), maxOffsetX),
      y: Math.min(Math.max(startOffset.y + dy, minOffsetY), maxOffsetY),
    });
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  // Drag del modal
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

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header
        style={{
          padding: "8px",
          color: "#031069ff",
          background: "#ffd21fa5",
          textAlign: "center",
          borderBottom: "8px solid",
          borderImage: `
            linear-gradient(to right,
              #ffffff 0%, #ffffff 33.3%,
              #2997df 33.3%, #2997df 66.6%,
              #ffd21f 66.6%, #ffd21f 100%) 1
          `
        }}
      >
        <h1>MUNICIPIOS CANARIAS</h1>
      </header>

      <main style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        <div
          style={{
            flex: 1,
            overflow: "auto",
            cursor: isDragging ? "grabbing" : "grab",
            backgroundColor: "#0096c7",
            backgroundImage: `
              radial-gradient(circle at 20px 20px, rgba(255,255,255,0.15) 2px, transparent 0),
              radial-gradient(circle at 40px 40px, rgba(255,255,255,0.1) 2px, transparent 0)
            `,
            backgroundSize: "60px 60px",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={vb}
            preserveAspectRatio="xMidYMid meet"
            style={{ display: "block", width: "100%", height: "100%" }}
          >
            {islas.map((isla) => (
              <g key={isla.name} transform={isla.transform}>
                {isla.municipios.map((m) => (
                  <path
                    key={m.name}
                    d={m.path}
                    fill={visited.includes(m.name) ? "#28a745" : selected === m.name ? "#FFD21F" : "#cce"}
                    stroke="#336"
                    strokeWidth="2"
                    onClick={() => setSelected(m.name)}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </g>
            ))}
          </svg>

          <div
            style={{
              position: "absolute",
              top: 50,
              left: 10,
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <button onClick={handleZoomIn} style={{ padding: "4px 8px" }}>➕ Zoom in</button>
            <button onClick={handleZoomOut} style={{ padding: "4px 8px" }}>➖ Zoom out</button>
          </div>
        </div>

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
              <button
                onClick={() => handleToggleVisited(selectedMunicipio.name)}
                style={{
                  marginTop: "8px",
                  padding: "6px 12px",
                  width: "100%",
                  backgroundColor: visited.includes(selectedMunicipio.name) ? "#28a745" : "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "1rem"
                }}
              >
                {visited.includes(selectedMunicipio.name) ? "Visitado ✅" : "Marcar como visitado"}
              </button>
            </div>
          );
        })()}
      </main>
    </div>
  );
}
