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
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0096c7" }}>
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={vb}
        preserveAspectRatio="xMidYMid meet"
        style={{ flex: 1, width: "100%", height: "100%" }}
        {...handlers}
        onWheel={(e) => handlers.onWheel(e, svgRef)}
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
    </div>
  );
}
