import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import CanariasMapa from "./pages/CanariasMapa";
import Pasaporte from "./pages/Pasaporte";
import Menu from "./components/Menu";

export default function App() {
  return (
    <Router>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <main
          style={{
            flex: 1,
            display: "flex",
          }}
        >
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/mapa" replace />}
            />

            <Route
              path="/mapa"
              element={<CanariasMapa />}
            />

            <Route
              path="/pasaporte"
              element={<Pasaporte />}
            />
          </Routes>
        </main>

        <Menu />
      </div>
    </Router>
  );
}