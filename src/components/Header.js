import Menu from "./Menu";

export default function Header({ onToggleMenu })
{
  return (
    <header
      style={{
        padding: "8px",
        color: "#031069ff",
        background: "#ffd21fa5",
        textAlign: "center",
        borderBottom: "8px solid",
        borderImage:
          "linear-gradient(to right,#fff 0%,#fff 33.3%,#2997df 33.3%,#2997df 66.6%,#ffd21f 66.6%,#ffd21f 100%) 1",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Menu />

      {/* Título */}
      <h1 style={{ margin: 0, fontSize: "1.5rem", flex: 1, textAlign: "center" }}>
        MUNICIPIOS CANARIAS
      </h1>

      {/* Spacer a la derecha */}
      <div style={{ width: "2rem" }}></div>
    </header>
  );
}
