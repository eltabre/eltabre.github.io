import React from 'react';
import './ProjectCard.css'; // make sure you have the correct path for your CSS file

function ProjectCard({ id, title, description, imageUrl, isExpanded, onCardClick }) {
    return (
      <div className={`project-card ${isExpanded ? 'expanded' : ''}`} onClick={onCardClick}>
        <div className="card-inner">
          {isExpanded ? (
            <div className="expanded-content">
              <h2>{title}</h2>
              <img src={imageUrl} alt={title} />
              <p>{description}</p>
              {/* You can add more content here that you want to show when the card is expanded */}
            </div>
          ) : (
            <div className="card-front">
              {/* Default card content */}
              <img src={imageUrl} alt={title} />
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
  
export default ProjectCard;
