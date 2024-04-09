import { Routes, Route } from "react-router-dom";

import HomePage from "./views/HomePage/HomePage";
import AboutPage from "./views/AboutPage";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
      </Routes>
    </div>
  );
}