import { NavLink } from 'react-router-dom';
import { FaHome, FaProjectDiagram, FaUser, FaCode, FaLinkedin, FaRegNewspaper } from 'react-icons/fa';
import { SiGooglescholar } from "react-icons/si";

import './NavBar.css';

const NavBar = () => {
  return (
    <div className="navigation">
      <ul>
        <li>
          <NavLink to="/" exact className="nav-link" activeClassName="nav-link-active">
            <FaHome className="icon" /><span className="nav-text">Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" className="nav-link" activeClassName="nav-link-active">
            <FaProjectDiagram className="icon" /><span className="nav-text">Projects</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className="nav-link" activeClassName="nav-link-active">
            <FaUser className="icon" /><span className="nav-text">About</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/btc" className="nav-link" activeClassName="nav-link-active">
            <FaCode className="icon" /><span className="nav-text">Behind the Code</span>
          </NavLink>
        </li>
        <li>
          <a href="/public/TaberFisherResume.pdf" className="nav-link" target="_blank" rel="noopener noreferrer" download>
            <FaRegNewspaper className="icon" /><span className="nav-text">Download Resume</span>
          </a>
        </li>
        <li>
          <NavLink to="https://www.linkedin.com/in/taberfisher/" className="nav-link" target="_blank" >
            <FaLinkedin className="icon" /><span className="nav-text">LinkedIn</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="https://scholar.google.com/citations?user=PdbeU7YAAAAJ&hl=en" className="nav-link" target="_blank" >
            <SiGooglescholar className="icon" /><span className="nav-text">Google Scholar</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
