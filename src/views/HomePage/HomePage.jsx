import { useState, useEffect } from 'react';
import './HomePage.css';

const roles = ["Game Developer", "Software Engineer", "AI Researcher"];

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
      }, 5000);
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
    <div className="Home">
      <div className='flexbox-content'>
        <div className="flexbox-child1">
          <h1>Hello, I&apos;m Taber!</h1>
          <h2>{currentRole}</h2>
        </div>
        <div className="flexbox-child2">
          <p className='glasscard'>testing</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
