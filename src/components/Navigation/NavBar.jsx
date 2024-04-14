import { NavLink } from 'react-router-dom';
import { FaHome, FaProjectDiagram, FaUser, FaCode } from 'react-icons/fa';

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
      </ul>
    </div>
  );
};

export default NavBar;
