import { Routes, Route } from "react-router-dom";
import TestPage from "./pages/TestPage";
import { Xmb } from "./pages/Xmb";

function App() {

  return (
      <Routes>
        <Route path="/" element={<Xmb />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
  );
}
export default App