import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import './ProjectPage.css'; // make sure you have the correct path for your CSS file

function ProjectPage() {
  const [expandedCard, setExpandedCard] = useState(null);

  const projects = [
    { id: 1, title: "Project 1", description: "Description of Project 1", imageUrl: "/path/to/image1.jpg" }
  ];

  const handleCardClick = (projectId) => {
    setExpandedCard(expandedCard === projectId ? null : projectId);
  };

  return (
    <div className="Navigation">
      <h1>Project Page</h1>
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            {...project}
            isExpanded={expandedCard === project.id}
            onCardClick={() => handleCardClick(project.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectPage;
