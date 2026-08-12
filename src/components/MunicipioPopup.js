import React, { useRef, useState } from "react";

export default function MunicipioPopup({
  municipio,
  onClose,
  headerHeight = 60,
  modalMargin = 20,
  isMobile = false,
}) {
  const popupRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [modalOffset, setModalOffset] = useState({ x: 0, y: 0 });

  const handleMouseDownModal = (e) => {
    setIsDragging(true);

    setStartDrag({
      x: e.clientX - modalOffset.x,
      y: e.clientY - modalOffset.y,
    });

    e.stopPropagation();
  };

  const handleMouseMoveModal = (e) => {
    if (!isDragging) return;

    setModalOffset({
      x: e.clientX - startDrag.x,
      y: e.clientY - startDrag.y,
    });
  };

  const handleMouseUpModal = () => {
    setIsDragging(false);
  };

  if (!municipio) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        zIndex: 9,
      }}
    >
      <div
        ref={popupRef}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDownModal}
        onMouseMove={handleMouseMoveModal}
        onMouseUp={handleMouseUpModal}
        onMouseLeave={handleMouseUpModal}
        style={{
          position: "absolute",

          top: `${headerHeight + modalMargin + modalOffset.y}px`,

          left: `calc(50% + ${modalOffset.x}px)`,

          transform: "translateX(-50%)",

          width: isMobile ? "84%" : "285px",
          maxWidth: "310px",

          padding: isMobile ? "12px" : "14px",

          border: "1px solid rgba(255,255,255,0.5)",

          background: "#FFF6CC",

          color: "#031069",

          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",

          borderRadius: "16px",

          zIndex: 10,

          boxSizing: "border-box",

          cursor: "move",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            margin: "0 0 10px",
          }}
        >
          {municipio.name}
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              width: "55px",
              height: "55px",
              flexShrink: 0,
            }}
          >
            <img
              src={municipio.escudo}
              alt={`Escudo de ${municipio.name}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          <div
            style={{
              width: "55px",
              height: "55px",
              flexShrink: 0,
            }}
          >
            <img
              src={municipio.bandera}
              alt={`Bandera de ${municipio.name}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        <p
          style={{
            margin: "6px 0 10px",
            fontSize: "0.85rem",
            lineHeight: 1.35,
          }}
        >
          {municipio.descripcion}
        </p>

        <p
          style={{
            fontSize: "0.85rem",
            margin: "0 0 4px",
          }}
        >
          <b>Población:</b> {municipio.poblacion} habitantes
        </p>

        <p
          style={{
            fontSize: "0.85rem",
            margin: 0,
          }}
        >
          <b>Superficie:</b> {municipio.superficie} km²
        </p>

        <div
          style={{
            marginTop: "10px",
            padding: "7px 10px",
            background: municipio.visitado ? "#28a745" : "#8a939b",
            color: "#fff",
            borderRadius: "10px",
            textAlign: "center",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          {municipio.visitado ? "Visitado ✓" : "No visitado"}
        </div>

        {municipio.foto && (
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <img
              src={municipio.foto}
              alt={`Foto de ${municipio.name}`}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: isMobile ? "210px" : "240px",
                objectFit: "contain",
                borderRadius: "10px",
                display: "block",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}