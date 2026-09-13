import { Routes, Route } from "react-router-dom";
import { Xmb } from "./pages/Xmb";

function App() {

  return (
      <Routes>
        <Route path="/" element={<Xmb />} />
      </Routes>
  );
}
export default App
