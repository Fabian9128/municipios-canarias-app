import { useState } from "react";
import islas from "./assets/data/municipios-coordenadas.json";

export default function CanariasMapa()
{
  const [selected, setSelected] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [startOffset, setStartOffset] = useState({ x: 0, y: 0 });

  const baseViewBox = { x: -150, y: -50, width: 1100, height: 500 };

  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.2, 5));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.2, 1));

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

  // Eventos de arrastre
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
            linear-gradient(
              to right,
              #ffffff 0%,
              #ffffff 33.3%,
              #2997df 33.3%,
              #2997df 66.6%,
              #ffd21f 66.6%,
              #ffd21f 100%
            ) 1
          `,
        }}
      >
        <h1>MUNICIPIOS CANARIAS</h1>
      </header>

      <main style={{ display: "flex", flex: 1, overflow: "hidden" }}>
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
            position: "relative",
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
                    fill={selected === m.name ? "#FFD21F" : "#cce"}
                    stroke="#336"
                    strokeWidth="2"
                    onClick={() => setSelected(m.name)}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </g>
            ))}
          </svg>

          {/* Botones de zoom */}
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
            <button onClick={handleZoomIn} style={{ padding: "4px 8px" }}>
              ➕ Zoom in
            </button>
            <button onClick={handleZoomOut} style={{ padding: "4px 8px" }}>
              ➖ Zoom out
            </button>
          </div>

          {/* Popup flotante */}
          {selected && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                zIndex: 10,
                minWidth: "250px",
                textAlign: "center",
              }}
            >
              <h2 style={{ margin: "0 0 10px 0", color: "#031069ff" }}>
                {selected}
              </h2>
              <p>
                Información
              </p>
              <button
                onClick={() => setSelected(null)}
                style={{
                  marginTop: "10px",
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#2997df",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
