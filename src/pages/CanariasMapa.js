import { useEffect, useRef, useState } from "react";

import islas from "../assets/data/municipios-coordenadas.json";
import municipios from "../assets/data/municipios-datos.json";
import { useVisitedMunicipios } from "../hooks/useVisitedMunicipios";
import MunicipioPopup from "../components/MunicipioPopup";

export default function CanariasMapa() {
  const [selected, setSelected] = useState(null);
  const [selectedIsla, setSelectedIsla] = useState(islas[0]?.name);
  const [viewBox, setViewBox] = useState("0 0 100 100");

  const islaRef = useRef(null);

  const { visited, toggleVisited } = useVisitedMunicipios();

  const islaActual = islas.find(
    (isla) => isla.name === selectedIsla
  );

  useEffect(() => {
    if (!islaRef.current) return;

    const bbox = islaRef.current.getBBox();

    const padding = 12;

    const x = bbox.x - padding;
    const y = bbox.y - padding;
    const width = bbox.width + padding * 2;
    const height = bbox.height + padding * 2;

    setViewBox(`${x} ${y} ${width} ${height}`);
  }, [selectedIsla]);

  const visitadosIsla =
    islaActual?.municipios.filter((m) =>
      visited.includes(m.name)
    ).length ?? 0;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#0096c7",
        minHeight: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "8px",
          padding: "12px",
          background: "#fff",
        }}
      >
        {islas.map((isla) => (
          <button
            key={isla.name}
            type="button"
            onClick={() => {
              setSelectedIsla(isla.name);
              setSelected(null);
            }}
            style={{
              border: "none",
              borderRadius: "20px",
              padding: "8px 14px",
              cursor: "pointer",
              fontWeight: 600,

              background:
                selectedIsla === isla.name
                  ? "#0096c7"
                  : "#e9ecef",

              color:
                selectedIsla === isla.name
                  ? "#fff"
                  : "#333",
            }}
          >
            {isla.name}
          </button>
        ))}
      </div>

      {islaActual && (
        <div
          style={{
            textAlign: "center",
            color: "#fff",
            padding: "16px 10px 0",
          }}
        >
          <h2
            style={{
              margin: 0,
            }}
          >
            {islaActual.name}
          </h2>

          <p
            style={{
              margin: "5px 0 0",
            }}
          >
            {visitadosIsla} de{" "}
            {islaActual.municipios.length} municipios visitados
          </p>
        </div>
      )}

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        {islaActual && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
            style={{
              width: "100%",
              height: "100%",
              maxWidth: "900px",
              maxHeight: "700px",
            }}
          >
            <g ref={islaRef}>
              <g transform={islaActual.transform}>
                {islaActual.municipios.map((m) => (
                  <path
                    key={m.name}
                    d={m.path}
                    fill={
                      selected === m.name
                        ? "#FFD21F"
                        : visited.includes(m.name)
                        ? "#28a745"
                        : "#cce"
                    }
                    stroke="#336"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    onClick={() => setSelected(m.name)}
                    style={{
                      cursor: "pointer",
                      transition: "fill 0.15s ease",
                    }}
                  />
                ))}
              </g>
            </g>
          </svg>
        )}
      </div>

      {selected && (
        <MunicipioPopup
          municipio={municipios.find(
            (m) => m.name === selected
          )}
          visited={visited}
          toggleVisited={toggleVisited}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}