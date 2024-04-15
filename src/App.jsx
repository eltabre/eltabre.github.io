import { Routes, Route } from "react-router-dom";

import HomePage from "./views/HomePage/HomePage";
import AboutPage from "./views/AboutPage";
import ProjectPage from './views/ProjectPage/ProjectPage';
import BlogPage from './views/BlogPage/BlogPage'; 
import NavBar from './components/Navigation/NavBar'

// Different Blog pages
import BP1 from './views/BlogPosts/bp1';
import BP2 from './views/BlogPosts/bp2';

import './App.css'

export default function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes className="Navigation">
        <Route path="/" element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="projects" element={<ProjectPage />} />
        <Route path="btc" element={<BlogPage />} />
        {/* BTC posts*/}
        <Route path="/btc/:postId" element={<BP1 />} />
        <Route path="/btc/:postId" element={<BP2 />} />
      </Routes>
    </div>
  );
}