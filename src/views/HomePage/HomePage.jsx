import { useState, useEffect } from 'react';
import {Link} from "react-router-dom";

import Card from '../../components/ProjectCard/Card'

import './HomePage.css';

const roles = ["Game Developer", "Software Engineer", "AI Researcher"];

const links = [
  { title: "Projects", path: "/projects" },
  { title: "About", path: "/about" },
  { title: "Behind the Code", path: "/behind-the-code" },
  { title: "Resume", path: "/resume"}
];

function HomePage() {
  const [currentRole, setCurrentRole] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typeSpeed = 100; 
    const deleteSpeed = 50; 
    let timeout; // Variable to hold the timeout, allows us to clear it on cleanup

    if (!isDeleting && charIndex < roles[roleIndex].length) {
      // Typing effect
      timeout = setTimeout(() => {
        setCurrentRole(prev => prev + roles[roleIndex].charAt(charIndex));
        setCharIndex(charIndex + 1);
      }, typeSpeed);
    } else if (isDeleting && charIndex > 0) {
      // Deleting effect
      timeout = setTimeout(() => {
        setCurrentRole(prev => prev.substring(0, prev.length - 1));
        setCharIndex(charIndex - 1);
      }, deleteSpeed);
    } else if (!isDeleting && charIndex === roles[roleIndex].length) {
      // Pause
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 10000);
    } else {
      // Switch to the next role after deleting the current one
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex((roleIndex + 1) % roles.length);
        setCharIndex(0);
      }, 500); 
    }

    return () => clearTimeout(timeout); // Clear the timeout on cleanup
  }, [currentRole, isDeleting, charIndex, roleIndex]);

  return (
    <div className="App">
      <div className="Navigation">
        <h1>Taber Fisher</h1>
        <div className="typewriter">
          <h2>
            {currentRole}
          </h2>
        </div>
        <nav>
          <ul>
            {links.map(link => (
              <li key={link.title}>
                <a href={link.path}>{link.title}</a> {/* Replace with <Link to={link.path}>{link.title}</Link> if using React Router */}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <Card />
    </div>
  );
}

export default HomePage;
