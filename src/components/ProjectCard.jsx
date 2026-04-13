/**
 * ProjectCard Component
 * Renders a summary card for a single project including its status and progress.
 */
import React from 'react';
import { statusBadge } from './statusConfig';

function ProjectCard({ project, selected, onSelect }) {
  return (
    <article
      className={selected ? 'project-card selected' : 'project-card'}
      onClick={() => onSelect(project.id)}
    >
      <div className="card-title">{project.name}</div>
      <div className="card-meta">{project.manager}</div>
      <span className={`badge ${statusBadge[project.status]}`}>{project.status}</span>
    </article>
  );
}

export default ProjectCard;
