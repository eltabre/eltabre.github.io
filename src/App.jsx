import { Routes, Route } from "react-router-dom";

import HomePage from "./views/HomePage/HomePage";
import AboutPage from "./views/AboutPage";
import ProjectPage from './views/ProjectPage';
import BlogPage from './views/BlogPage'; 
import NavBar from './components/Navigation/NavBar'

import './App.css'

export default function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="projects" element={<ProjectPage />} />
        <Route path="btc" element={<BlogPage />} />
      </Routes>
    </div>
  );
}