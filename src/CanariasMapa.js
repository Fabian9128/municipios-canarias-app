import React, { useState } from "react";
//import "./CanariasMapa.css"; // si quieres agregar estilos luego

export default function CanariasMapa() {
  const [selected, setSelected] = useState(null);

  const handleClick = (municipio) => setSelected(municipio);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 600"
        width="600"
        style={{ border: "1px solid #ccc" }}
      >
        {/* Aquí puedes pegar tu SVG completo de Wikipedia */}
        {/* Ejemplo de 2 municipios: */}
        <path
          d="M100 100 L200 100 L200 200 L100 200 Z"
          fill={selected === "Municipio 1" ? "#FFD21F" : "#2997df"}
          stroke="#000"
          onClick={() => handleClick("Municipio 1")}
          style={{ cursor: "pointer" }}
        />
        <path
          d="M250 100 L350 100 L350 200 L250 200 Z"
          fill={selected === "Municipio 2" ? "#FFD21F" : "#2997df"}
          stroke="#000"
          onClick={() => handleClick("Municipio 2")}
          style={{ cursor: "pointer" }}
        />
      </svg>

      <div>
        <h2>Información</h2>
        {selected ? (
          <p>Has seleccionado: <b>{selected}</b></p>
        ) : (
          <p>Haz click en un municipio</p>
        )}
      </div>
    </div>
  );
}
