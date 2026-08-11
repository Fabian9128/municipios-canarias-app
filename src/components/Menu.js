import { useLocation, useNavigate } from "react-router-dom";

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  const isMapa = location.pathname !== "/pasaporte";
  const isPasaporte = location.pathname === "/pasaporte";

  return (
    <nav
      style={{
        position: "fixed",
        bottom: "12px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,

        display: "flex",
        alignItems: "center",
        gap: "6px",

        width: "calc(100% - 24px)",
        maxWidth: "360px",

        padding: "6px",

        background: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",

        borderRadius: "22px",

        boxShadow: "0 6px 25px rgba(0,0,0,0.18)",
      }}
    >
      <button
        type="button"
        onClick={() => navigate("/mapa")}
        style={{
          ...buttonStyle,
          background: isMapa ? "#0096c7" : "transparent",
          color: isMapa ? "#fff" : "#555",
        }}
      >
        <span style={{ fontSize: "1.35rem" }}>🗺️</span>

        <span>Mapa</span>
      </button>

      <button
        type="button"
        onClick={() => navigate("/pasaporte")}
        style={{
          ...buttonStyle,
          background: isPasaporte ? "#0096c7" : "transparent",
          color: isPasaporte ? "#fff" : "#555",
        }}
      >
        <span style={{ fontSize: "1.35rem" }}>📘</span>

        <span>Pasaporte</span>
      </button>
    </nav>
  );
}

const buttonStyle = {
  flex: 1,
  border: "none",
  borderRadius: "17px",
  padding: "8px 14px",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "2px",

  fontSize: "0.75rem",
  fontWeight: 600,

  cursor: "pointer",
  transition: "all 0.2s ease",
};