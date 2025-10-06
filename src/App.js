import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import CanariasMapa from "./pages/CanariasMapa";
import Pasaporte from "./pages/Pasaporte";

export default function App()
{
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", paddingTop: "58px" }}>
          <Routes>
            <Route path="/" element={<CanariasMapa />} />
            <Route path="/mapa" element={<CanariasMapa />} />
            <Route path="/pasaporte" element={<Pasaporte />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
