import { useState } from "react";
import islas from "../assets/data/municipios-coordenadas.json";
import { useVisitedMunicipios } from "../hooks/useVisitedMunicipios";
import municipiosData from "../assets/data/municipios-datos.json";

export default function Pasaporte()
{
  const { visited } = useVisitedMunicipios();
  const [openIsla, setOpenIsla] = useState(null);

  const toggleIsla = (islaName) => {
    setOpenIsla(openIsla === islaName ? null : islaName);
  };

  return (
    <div style={{ flex: 1, padding: "1rem", background: "#0096c7" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {islas.map((isla) => {
          const total = isla.municipios.length;
          const visitados = isla.municipios.filter((m) =>
            visited.includes(m.name)
          ).length;
          const porcentaje = Math.round((visitados / total) * 100);

          // 🎨 color dinámico según progreso
          let headerColor = "#dc3545"; // rojo por defecto (0%)
          if (porcentaje > 0 && porcentaje < 100) {
            headerColor = "#ffc107"; // amarillo
          } else if (porcentaje === 100) {
            headerColor = "#28a745"; // verde
          }

          return (
            <div
              key={isla.name}
              style={{
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                overflow: "hidden",
              }}
            >
              {/* Header de la card */}
              <button
                onClick={() => toggleIsla(isla.name)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 16px",
                  border: "none",
                  background: headerColor,
                  color: "#fff",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{isla.name}</span>
                <span>
                  {visitados}/{total} ({porcentaje}%)
                  {openIsla === isla.name ? " ▲" : " ▼"}
                </span>
              </button>

              {/* Contenido expandible */}
              {openIsla === isla.name && (
                <div style={{ padding: "12px 16px", background: "#e0dedeff" }}>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {isla.municipios.map((m) => {
                      const municipioInfo = municipiosData.find(x => x.name === m.name);
                      const savedFoto = localStorage.getItem(`foto_${m.name}`);

                      return (
                        <li
                          key={m.name}
                          style={{
                            padding: "10px 0",
                            borderBottom: "1px solid #eee",
                            color: visited.includes(m.name) ? "#28a745" : "#6c757d",
                            fontWeight: visited.includes(m.name) ? "bold" : "normal",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          {/* Foto subida desde localStorage */}
                          {savedFoto && (
                            <img
                              src={savedFoto}
                              alt={`Foto de ${m.name}`}
                              style={{ width: "50px", height: "50px", objectFit: "contain", borderRadius: "4px" }}
                            />
                          )}

                          {/* Escudo */}
                          {municipioInfo?.escudo && (
                            <img
                              src={municipioInfo.escudo}
                              alt={`Escudo de ${m.name}`}
                              style={{ width: "40px", height: "40px", objectFit: "contain" }}
                            />
                          )}

                          {/* Bandera */}
                          {municipioInfo?.bandera && (
                            <img
                              src={municipioInfo.bandera}
                              alt={`Bandera de ${m.name}`}
                              style={{ width: "40px", height: "40px", objectFit: "contain" }}
                            />
                          )}

                          <span style={{ flex: 1 }}>
                            {m.name} {visited.includes(m.name) ? "✅" : "⬜"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
