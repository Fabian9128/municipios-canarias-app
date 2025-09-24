import { useState } from "react";
import islas from "../assets/data/municipios-coordenadas.json";
import municipios from "../assets/data/municipios-datos.json";
import { useVisitedMunicipios } from "../hooks/useVisitedMunicipios";
import { useZoomAndPan } from "../hooks/useZoomAndPan";
import MunicipioPopup from "../components/MunicipioPopup";

export default function CanariasMapa()
{
  const [selected, setSelected] = useState(null);
  const { visited, toggleVisited } = useVisitedMunicipios();
  const { vb, handlers, svgRef } = useZoomAndPan();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header style={{ padding: "8px", background: "#ffd21fa5", textAlign: "center" }}>
        <h1>MUNICIPIOS CANARIAS</h1>
      </header>

      <main style={{ flex: 1, position: "relative" }}>
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={vb}
          preserveAspectRatio="xMidYMid meet"
          style={{ display: "block", width: "100%", height: "100%", background: "#0096c7" }}
          {...handlers}
          onWheel={(e) => handlers.onWheel(e, svgRef)} // wheel necesita svgRef
        >
          {islas.map((isla) => (
            <g key={isla.name} transform={isla.transform}>
              {isla.municipios.map((m) => (
                <path
                  key={m.name}
                  d={m.path}
                  fill={
                    visited.includes(m.name)
                      ? "#28a745"
                      : selected === m.name
                      ? "#FFD21F"
                      : "#cce"
                  }
                  stroke="#336"
                  strokeWidth="2"
                  onClick={() => setSelected(m.name)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </g>
          ))}
        </svg>

        {selected && (
          <MunicipioPopup
            municipio={municipios.find((m) => m.name === selected)}
            visited={visited}
            toggleVisited={toggleVisited}
            onClose={() => setSelected(null)}
          />
        )}
      </main>
    </div>
  );
}
