import React, { useRef, useState, useEffect } from "react";

export default function MunicipioPopup({
  municipio,
  visited,
  toggleVisited,
  onClose,
  headerHeight = 60,
  modalMargin = 20,
  isMobile = false,
}) {
  const popupRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [modalOffset, setModalOffset] = useState({ x: 0, y: 0 });
  const [foto, setFoto] = useState(null);

  // 🔹 Cargar foto de localStorage al abrir popup
  useEffect(() => {
    if (municipio) {
      const savedFoto = localStorage.getItem(`foto_${municipio.name}`);
      if (savedFoto) setFoto(savedFoto);
      else setFoto(null);
    }
  }, [municipio]);

  const handleMouseDownModal = (e) => {
    setIsDragging(true);
    setStartDrag({ x: e.clientX - modalOffset.x, y: e.clientY - modalOffset.y });
    e.stopPropagation();
  };

  const handleMouseMoveModal = (e) => {
    if (!isDragging) return;
    setModalOffset({
      x: e.clientX - startDrag.x,
      y: e.clientY - startDrag.y,
    });
  };

  const handleMouseUpModal = () => setIsDragging(false);

  // 🔹 Al seleccionar foto
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFoto(reader.result);
      localStorage.setItem(`foto_${municipio.name}`, reader.result);
    };
    reader.readAsDataURL(file);
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
          width: isMobile ? "90%" : "300px",
          maxWidth: isMobile ? "300px" : "400px",
          maxHeight: isMobile
            ? `calc(100vh - ${headerHeight + modalMargin * 2}px)`
            : "80vh",
          overflowY: "auto",
          padding: isMobile ? "12px" : "16px",
          border: "1px solid #ddd",
          background: "#e0dedeff",
          color: "#031069ff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          borderRadius: "8px",
          zIndex: 10,
          boxSizing: "border-box",
          cursor: "move",
        }}
      >
        <h2 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>
          {municipio.name}
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ width: "60px", height: "60px", flexShrink: 0 }}>
            <img
              src={municipio.escudo}
              alt={`Escudo de ${municipio.name}`}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <div style={{ width: "60px", height: "60px", flexShrink: 0 }}>
            <img
              src={municipio.bandera}
              alt={`Bandera de ${municipio.name}`}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </div>

        <p style={{ marginTop: "8px", fontSize: "0.9rem" }}>
          {municipio.descripcion}
        </p>
        <p style={{ fontSize: "0.9rem" }}>
          <b>Población:</b> {municipio.poblacion} habitantes
        </p>
        <p style={{ fontSize: "0.9rem" }}>
          <b>Superficie:</b> {municipio.superficie} km²
        </p>

        <button
          onClick={() => toggleVisited(municipio.name)}
          style={{
            marginTop: "8px",
            padding: "6px 12px",
            width: "100%",
            backgroundColor: visited.includes(municipio.name)
              ? "#28a745"
              : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          {visited.includes(municipio.name)
            ? "Visitado ✅"
            : "Marcar como visitado"}
        </button>

        {/* 🔹 Botón para subir foto */}
        {visited.includes(municipio.name) && (
          <button
            onClick={() => fileInputRef.current.click()}
            style={{
              marginTop: "8px",
              padding: "6px 12px",
              width: "100%",
              backgroundColor: "#ff9800",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            {foto ? "Cambiar foto 📷" : "Añadir foto"}
          </button>
        )}

        {/* input oculto */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* mostrar la foto si existe */}
        {foto && (
          <div style={{ marginTop: "12px", display: "flex", justifyContent: "center" }}>
            <img
              src={foto}
              alt={`Foto de ${municipio.name}`}
              style={{
                width: "100%",          // ocupa todo el ancho disponible
                maxWidth: "250px",      // ancho máximo fijo
                maxHeight: "200px",     // altura máxima fija
                objectFit: "contain",
                borderRadius: "6px",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
