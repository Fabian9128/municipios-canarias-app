import { useState, useEffect } from "react";

export function useVisitedMunicipios() {
  const [visited, setVisited] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("municipiosVisitados");
    if (stored) setVisited(JSON.parse(stored));
  }, []);

  const toggleVisited = (name) => {
    const updated = visited.includes(name)
      ? visited.filter(m => m !== name)
      : [...visited, name];
    setVisited(updated);
    localStorage.setItem("municipiosVisitados", JSON.stringify(updated));
  };

  return { visited, toggleVisited };
}
