import { useState } from "react";

import islas from "../assets/data/municipios-coordenadas.json";
import municipiosData from "../assets/data/municipios-datos.json";

export default function Pasaporte() {
  const [openIsla, setOpenIsla] = useState(null);

  const toggleIsla = (islaName) => {
    setOpenIsla(openIsla === islaName ? null : islaName);
  };

  return (
    <div
      style={{
        flex: 1,
        padding: "1rem",
        paddingBottom: "95px",
        background: "#0096c7",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {islas.map((isla) => {
          const total = isla.municipios.length;

          const visitados = isla.municipios.filter((m) => {
            const municipioInfo = municipiosData.find(
              (x) => x.name === m.name
            );

            return municipioInfo?.visitado === true;
          }).length;

          const porcentaje = Math.round((visitados / total) * 100);

          let headerColor = "#8a939b";

          if (porcentaje > 0 && porcentaje < 100) {
            headerColor = "#ffc107";
          } else if (porcentaje === 100) {
            headerColor = "#28a745";
          }

          return (
            <div
              key={isla.name}
              style={{
                background: "#FFF6CC",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                overflow: "hidden",
              }}
            >
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

              {openIsla === isla.name && (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "#FFF6CC",
                  }}
                >
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                    }}
                  >
                    {isla.municipios.map((m) => {
                      const municipioInfo = municipiosData.find(
                        (x) => x.name === m.name
                      );

                      const visitado =
                        municipioInfo?.visitado === true;

                      return (
                        <li
                          key={m.name}
                          style={{
                            padding: "10px 0",
                            borderBottom:
                              "1px solid rgba(0,0,0,0.08)",
                            color: visitado
                              ? "#28a745"
                              : "#6c757d",
                            fontWeight: visitado
                              ? "bold"
                              : "normal",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          {municipioInfo?.foto && (
                            <img
                              src={municipioInfo.foto}
                              alt={`Foto de ${m.name}`}
                              style={{
                                width: "55px",
                                height: "55px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          )}

                          {municipioInfo?.escudo && (
                            <img
                              src={municipioInfo.escudo}
                              alt={`Escudo de ${m.name}`}
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "contain",
                              }}
                            />
                          )}

                          {municipioInfo?.bandera && (
                            <img
                              src={municipioInfo.bandera}
                              alt={`Bandera de ${m.name}`}
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "contain",
                              }}
                            />
                          )}

                          <span style={{ flex: 1 }}>
                            {m.name} {visitado ? "✅" : "⬜"}
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