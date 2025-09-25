import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Menu()
{
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("MAPA");

  const toggleMenu = () => setOpen(!open);

  const handleClick = (option) => {
    setActive(option);
    if (option === "MAPA") navigate("/mapa");
    else if (option === "PASAPORTE") navigate("/pasaporte");
    setOpen(false);
  };

  useEffect(() => {
    setActive(location.pathname === "/pasaporte" ? "PASAPORTE" : "MAPA");
  }, [location.pathname]);

  return (
    <div>
      <button
        type="button"
        onClick={toggleMenu}
        style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "1.5rem" }}
      >
        ☰
      </button>

      {open && (
        <section style={{
          position: "absolute",
          top: "40px",
          left: "8px",
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: "6px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          padding: "8px",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}>
          <img src="/municipiosIcon.png" alt="Logo" style={{ width: "60px", height: "60px", marginBottom: "8px" }} />

          <button
            onClick={() => handleClick("MAPA")}
            style={{
              ...menuButtonStyle,
              backgroundColor: active === "MAPA" ? "#2997df" : "transparent",
              color: active === "MAPA" ? "#fff" : "#031069ff",
            }}
          >
            MAPA
          </button>
          <button
            onClick={() => handleClick("PASAPORTE")}
            style={{
              ...menuButtonStyle,
              backgroundColor: active === "PASAPORTE" ? "#2997df" : "transparent",
              color: active === "PASAPORTE" ? "#fff" : "#031069ff",
            }}
          >
            PASAPORTE
          </button>
        </section>
      )}
    </div>
  );
}

const menuButtonStyle = {
  padding: "12px 12px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  textAlign: "left",
  width: "100%",
  color: "#031069ff",
  fontSize: "1rem",
};
