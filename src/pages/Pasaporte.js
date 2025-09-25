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
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0096c7" }}>

    </div>
  );
}
